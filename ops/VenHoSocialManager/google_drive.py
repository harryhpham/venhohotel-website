"""
google_drive.py — Upload content lên Google Drive
Folder structure: {DRIVE_ROOT_FOLDER} / YYYY / MM / YYYY-MM-DD_topic_id / 5 files

Setup lần đầu (một lần duy nhất):
  1. Tạo credentials.json — xem hướng dẫn trong setup.sh
  2. Chạy: python3 google_drive.py
     → Trình duyệt mở, đăng nhập Google, cho phép quyền truy cập
     → token.json được lưu tự động cho các lần sau
"""

import json
import os
from pathlib import Path

from dotenv import load_dotenv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES     = ["https://www.googleapis.com/auth/drive.file"]
BASE_DIR   = Path(__file__).parent
TOKEN_PATH = BASE_DIR / "token.json"
CREDS_PATH = BASE_DIR / "credentials.json"

load_dotenv(BASE_DIR / ".env")
ROOT_FOLDER = os.environ.get("DRIVE_ROOT_FOLDER", "VenHoSocialManager")


def get_service():
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDS_PATH.exists():
                raise FileNotFoundError(
                    "credentials.json chưa có. Xem hướng dẫn trong setup.sh."
                )
            flow  = InstalledAppFlow.from_client_secrets_file(str(CREDS_PATH), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())

    return build("drive", "v3", credentials=creds)


def get_or_create_folder(service, name: str, parent_id: str = None) -> str:
    query = f"name='{name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"

    results = service.files().list(q=query, fields="files(id)").execute()
    files   = results.get("files", [])
    if files:
        return files[0]["id"]

    meta = {"name": name, "mimeType": "application/vnd.google-apps.folder"}
    if parent_id:
        meta["parents"] = [parent_id]
    folder = service.files().create(body=meta, fields="id").execute()
    return folder["id"]


def get_file_id_in_folder(service, name: str, parent_id: str):
    q       = f"name='{name}' and '{parent_id}' in parents and trashed=false"
    results = service.files().list(q=q, fields="files(id)").execute()
    files   = results.get("files", [])
    return files[0]["id"] if files else None


def upload_file(service, file_path: Path, mimetype: str, parent_id: str):
    existing_id = get_file_id_in_folder(service, file_path.name, parent_id)
    media = MediaFileUpload(str(file_path), mimetype=mimetype, resumable=False)
    if existing_id:
        service.files().update(
            fileId=existing_id,
            media_body=media,
        ).execute()
        print(f"  [UPDATE] {file_path.name} đã cập nhật trên Drive")
    else:
        service.files().create(
            body={"name": file_path.name, "parents": [parent_id]},
            media_body=media,
            fields="id",
        ).execute()
        print(f"  [OK]   {file_path.name} đã upload")


PHOTOS_AI_ROOT = "Photos AI"


def upload_photos_ai_folder(folder_rel: str, content_dir: Path) -> str:
    """
    Upload ảnh lên Google Drive / Photos AI / YYYY / DD-MM-slug /
    folder_rel = "YYYY/DD-MM-slug" (2 parts, đã strip prefix "photos-ai/")
    Upload tất cả file trong thư mục (image-*.png, meta.json, image_prompt.txt).
    """
    parts = folder_rel.split("/")
    if len(parts) != 2:
        raise ValueError(f"folder_rel phải là YYYY/DD-MM-slug: {folder_rel!r}")

    year, folder_name = parts
    service = get_service()

    root_id = get_or_create_folder(service, PHOTOS_AI_ROOT)
    year_id = get_or_create_folder(service, year,        parent_id=root_id)
    sub_id  = get_or_create_folder(service, folder_name, parent_id=year_id)

    for path in sorted(content_dir.iterdir()):
        if path.is_file():
            if path.suffix == ".png":
                mimetype = "image/png"
            elif path.suffix == ".json":
                mimetype = "application/json"
            else:
                mimetype = "text/plain"
            upload_file(service, path, mimetype, sub_id)

    return f"https://drive.google.com/drive/folders/{sub_id}"


def upload_to_drive(folder_rel: str, content_dir: Path) -> str:
    """
    Upload 5 files lên Google Drive / {ROOT_FOLDER} / YYYY / MM / {folder_name} /
    folder_rel = "YYYY/MM/YYYY-MM-DD_topic_id" (path tương đối từ DB_DIR)
    Bỏ qua file đã tồn tại (tránh trùng lặp).
    Trả về URL folder trên Drive.
    """
    parts = folder_rel.split("/")   # ["2026", "06", "2026-06-20_topic"]
    if len(parts) != 3:
        raise ValueError(f"folder_rel không đúng định dạng YYYY/MM/name: {folder_rel!r}")

    year, month, folder_name = parts
    service = get_service()

    root_id  = get_or_create_folder(service, ROOT_FOLDER)
    year_id  = get_or_create_folder(service, year,        parent_id=root_id)
    month_id = get_or_create_folder(service, month,       parent_id=year_id)
    sub_id   = get_or_create_folder(service, folder_name, parent_id=month_id)

    files_to_upload = [
        ("image.png",        "image/png"),
        ("meta.json",        "application/json"),
        ("facebook.txt",     "text/plain"),
        ("instagram.txt",    "text/plain"),
        ("image_prompt.txt", "text/plain"),
    ]
    for filename, mimetype in files_to_upload:
        path = content_dir / filename
        if path.exists():
            upload_file(service, path, mimetype, sub_id)

    return f"https://drive.google.com/drive/folders/{sub_id}"


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "upload":
        # CLI: python3 google_drive.py upload database/2026/06/2026-06-21_slug
        folder_arg  = sys.argv[2]                                # "database/2026/06/..."
        content_dir = BASE_DIR / folder_arg
        folder_rel  = "/".join(Path(folder_arg).parts[1:])       # strip "database/"
        drive_url   = upload_to_drive(folder_rel, content_dir)
        print(drive_url)
    elif len(sys.argv) > 1 and sys.argv[1] == "upload-photos-ai":
        # CLI: python3 google_drive.py upload-photos-ai photos-ai/2026/24-06-slug
        folder_arg  = sys.argv[2]                                # "photos-ai/2026/DD-MM-slug"
        content_dir = BASE_DIR / folder_arg
        folder_rel  = "/".join(Path(folder_arg).parts[1:])       # strip "photos-ai/"
        drive_url   = upload_photos_ai_folder(folder_rel, content_dir)
        print(drive_url)
    else:
        print("Đang xác thực Google Drive...")
        get_service()
        print("Xác thực thành công! token.json đã được lưu.")
