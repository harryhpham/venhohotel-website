"""
post_publisher.py — Đăng bài lên Facebook + Instagram cho Ven Hồ Hotel
Harry chạy bằng cách double-click publish.bat sau khi duyệt caption

Cách dùng:
  python post_publisher.py              # Tự tìm file pending mới nhất
  python post_publisher.py 2026-07-01  # Chỉ định ngày cụ thể
"""

import json
import os
import sys
import time
import shutil
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv

# ── Setup ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

CONFIG = json.loads((BASE_DIR / "config.json").read_text(encoding="utf-8"))
PENDING_DIR = BASE_DIR / "pending"
PUBLISHED_DIR = BASE_DIR / "published"
LOG_DIR = BASE_DIR / "logs"
PUBLISHED_DIR.mkdir(exist_ok=True)

API_VERSION = CONFIG["meta_api_version"]
GRAPH_BASE = f"https://graph.facebook.com/{API_VERSION}"

FB_PAGE_ID = os.environ.get("FB_PAGE_ID")
FB_ACCESS_TOKEN = os.environ.get("FB_ACCESS_TOKEN")
IG_USER_ID = os.environ.get("IG_USER_ID")


def log(msg: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    log_file = LOG_DIR / f"publisher-{datetime.now().strftime('%Y-%m')}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line + "\n")


# ── Tìm file pending ───────────────────────────────────────────────────────────
def find_pending_file(date_str: str | None = None) -> Path | None:
    if date_str:
        target = PENDING_DIR / f"{date_str}.json"
        return target if target.exists() else None

    pending_files = sorted(PENDING_DIR.glob("*.json"))
    return pending_files[-1] if pending_files else None


# ── Đăng lên Facebook ──────────────────────────────────────────────────────────
def post_to_facebook(caption: str, image_url: str | None) -> dict:
    log("Đang đăng lên Facebook...")

    if image_url:
        # Đăng ảnh kèm caption
        url = f"{GRAPH_BASE}/{FB_PAGE_ID}/photos"
        params = {
            "message": caption,
            "url": image_url,
            "access_token": FB_ACCESS_TOKEN,
        }
    else:
        # Đăng text-only
        url = f"{GRAPH_BASE}/{FB_PAGE_ID}/feed"
        params = {
            "message": caption,
            "access_token": FB_ACCESS_TOKEN,
        }

    resp = requests.post(url, data=params, timeout=30)
    result = resp.json()

    if resp.status_code == 200 and ("id" in result or "post_id" in result):
        post_id = result.get("post_id") or result.get("id")
        log(f"Facebook ✅ Post ID: {post_id}")
        return {"success": True, "post_id": post_id}
    else:
        error = result.get("error", {})
        log(f"Facebook ❌ Lỗi: {error.get('message', str(result))}")
        return {"success": False, "error": error}


# ── Đăng lên Instagram (2 bước) ────────────────────────────────────────────────
def post_to_instagram(caption: str, image_url: str | None) -> dict:
    if not image_url:
        log("Instagram ⚠️  Bỏ qua — không có ảnh (Instagram bắt buộc phải có ảnh)")
        return {"success": False, "error": "Không có ảnh — Instagram yêu cầu ảnh"}

    log("Đang tạo Instagram media container...")

    # Bước 1: Tạo media container
    create_url = f"{GRAPH_BASE}/{IG_USER_ID}/media"
    create_params = {
        "image_url": image_url,
        "caption": caption,
        "access_token": FB_ACCESS_TOKEN,
    }

    resp1 = requests.post(create_url, data=create_params, timeout=30)
    result1 = resp1.json()

    if resp1.status_code != 200 or "id" not in result1:
        error = result1.get("error", {})
        log(f"Instagram ❌ Tạo container thất bại: {error.get('message', str(result1))}")
        return {"success": False, "error": error}

    creation_id = result1["id"]
    log(f"Instagram container tạo xong: {creation_id} — đợi 5 giây...")
    time.sleep(5)

    # Bước 2: Publish
    publish_url = f"{GRAPH_BASE}/{IG_USER_ID}/media_publish"
    publish_params = {
        "creation_id": creation_id,
        "access_token": FB_ACCESS_TOKEN,
    }

    resp2 = requests.post(publish_url, data=publish_params, timeout=30)
    result2 = resp2.json()

    if resp2.status_code == 200 and "id" in result2:
        post_id = result2["id"]
        log(f"Instagram ✅ Post ID: {post_id}")
        return {"success": True, "post_id": post_id}
    else:
        error = result2.get("error", {})
        log(f"Instagram ❌ Publish thất bại: {error.get('message', str(result2))}")
        return {"success": False, "error": error}


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    log("=== Bắt đầu đăng bài ===")

    # Xác nhận với Harry trước khi đăng
    date_arg = sys.argv[1] if len(sys.argv) > 1 else None
    pending_path = find_pending_file(date_arg)

    if not pending_path:
        log("❌ Không tìm thấy file pending để đăng")
        print("\nKhông có bài nào đang chờ duyệt trong thư mục pending/")
        input("\nNhấn Enter để đóng...")
        sys.exit(1)

    data = json.loads(pending_path.read_text(encoding="utf-8"))

    print("\n" + "="*60)
    print(f"  📅 Ngày đăng: {data['post_date']}")
    print(f"  📌 Chủ đề:   {data['topic']}")
    print(f"  📘 Facebook: {data['facebook']['caption'][:80]}...")
    print(f"  📷 Instagram: {data['instagram']['caption'][:80]}...")
    print(f"  🖼  Ảnh:     {data['facebook']['image_url'] or 'Không có ảnh'}")
    print("="*60)

    confirm = input("\n✅ Xác nhận đăng bài? (gõ 'yes' rồi Enter): ").strip().lower()
    if confirm != "yes":
        print("Đã hủy — không đăng bài nào.")
        input("\nNhấn Enter để đóng...")
        sys.exit(0)

    # Kiểm tra env vars
    if not all([FB_PAGE_ID, FB_ACCESS_TOKEN, IG_USER_ID]):
        log("❌ Thiếu credentials trong file .env — kiểm tra FB_PAGE_ID, FB_ACCESS_TOKEN, IG_USER_ID")
        input("\nNhấn Enter để đóng...")
        sys.exit(1)

    fb_result = post_to_facebook(
        caption=data["facebook"]["caption"],
        image_url=data["facebook"]["image_url"]
    )

    ig_result = post_to_instagram(
        caption=data["instagram"]["caption"],
        image_url=data["instagram"]["image_url"]
    )

    # Lưu kết quả vào file
    data["status"] = "published"
    data["published_at"] = datetime.now().isoformat()
    data["results"] = {
        "facebook": fb_result,
        "instagram": ig_result
    }

    # Di chuyển sang published/
    published_path = PUBLISHED_DIR / pending_path.name
    published_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    pending_path.unlink()
    log(f"Đã lưu kết quả: {published_path}")

    print("\n" + "="*60)
    fb_status = "✅ Thành công" if fb_result["success"] else f"❌ Thất bại: {fb_result.get('error', '')}"
    ig_status = "✅ Thành công" if ig_result["success"] else f"❌ {ig_result.get('error', '')}"
    print(f"  Facebook:  {fb_status}")
    print(f"  Instagram: {ig_status}")
    print("="*60)
    log("=== Kết thúc ===")

    input("\nNhấn Enter để đóng...")


if __name__ == "__main__":
    main()
