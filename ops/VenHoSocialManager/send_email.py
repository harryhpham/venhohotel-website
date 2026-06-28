"""
send_email.py — Gửi email preview content cho Harry (kèm link Google Drive)

Dùng 2 cách:
  1. Import từ generate_content.py:  send_email.send(pillar, topic, content, drive_url)
  2. Gọi độc lập (đọc từ database):  python3 send_email.py
"""

import json
import os
import smtplib
import sys
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

CONFIG     = json.loads((BASE_DIR / "config.json").read_text(encoding="utf-8"))
PILLAR_MAP = json.loads((BASE_DIR / "pillars.json").read_text(encoding="utf-8"))["pillars"]


def build_html(pillar: dict, topic: dict, content: dict, drive_url: str = None) -> str:
    today_str        = datetime.now().strftime("%A, %d/%m/%Y")
    hashtags_display = " ".join(content["hashtags_all"])

    drive_section = ""
    if drive_url:
        drive_section = f"""
  <!-- LINK GOOGLE DRIVE -->
  <tr><td style="padding:20px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8f5e9;border:2px solid #34a853;border-radius:8px;">
      <tr><td style="padding:20px;text-align:center;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#1a7340;text-transform:uppercase;letter-spacing:1px;">Ảnh & nội dung đầy đủ trên Google Drive</p>
        <a href="{drive_url}" style="display:inline-block;background:#34a853;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;">
          Mở Google Drive
        </a>
        <p style="margin:10px 0 0;font-size:11px;color:#555;">image.png &nbsp;·&nbsp; facebook.txt &nbsp;·&nbsp; instagram.txt &nbsp;·&nbsp; image_prompt.txt &nbsp;·&nbsp; meta.json</p>
      </td></tr>
    </table>
  </td></tr>"""

    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:20px 0;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:620px;">

  <!-- HEADER -->
  <tr><td style="background:#1B2D4F;padding:28px 32px;">
    <p style="margin:0;color:#C9A84C;font-size:13px;letter-spacing:2px;text-transform:uppercase;">VEN HỒ HOTEL — SOCIAL MEDIA</p>
    <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:600;">
      {pillar['emoji']} Bài viết mới cần duyệt
    </h1>
    <p style="margin:6px 0 0;color:#aab8cc;font-size:13px;">{today_str}</p>
  </td></tr>

  {drive_section}

  <!-- CHỦ ĐỀ -->
  <tr><td style="padding:24px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;border-radius:8px;overflow:hidden;">
      <tr><td style="background:#C9A84C;padding:8px 16px;">
        <span style="color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">CHỦ ĐỀ</span>
      </td></tr>
      <tr><td style="padding:16px;">
        <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;">{pillar['emoji']} {pillar['name']}</p>
        <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#1B2D4F;">{content['title']}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#555;">{topic['title']}{' — ' + topic['desc'] if topic['desc'] else ''}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- CAPTION FACEBOOK -->
  <tr><td style="padding:20px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border-radius:8px;overflow:hidden;">
      <tr><td style="background:#1877F2;padding:8px 16px;">
        <span style="color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">CAPTION FACEBOOK</span>
      </td></tr>
      <tr><td style="padding:16px;">
        <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;">{content['facebook_caption']}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- CAPTION INSTAGRAM -->
  <tr><td style="padding:20px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff0f5;border-radius:8px;overflow:hidden;">
      <tr><td style="background:linear-gradient(90deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);padding:8px 16px;">
        <span style="color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">CAPTION INSTAGRAM</span>
      </td></tr>
      <tr><td style="padding:16px;">
        <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;">{content['instagram_caption']}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- HASHTAG -->
  <tr><td style="padding:20px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:8px;overflow:hidden;">
      <tr><td style="background:#6c757d;padding:8px 16px;">
        <span style="color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">HASHTAG</span>
      </td></tr>
      <tr><td style="padding:16px;">
        <p style="margin:0;font-size:13px;color:#333;line-height:1.8;">{hashtags_display}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- BƯỚC TIẾP THEO -->
  <tr><td style="padding:20px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #C9A84C;border-radius:8px;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#C9A84C;text-transform:uppercase;letter-spacing:1px;">Bước tiếp theo</p>
        <ol style="margin:0;padding-left:16px;font-size:13px;color:#555;line-height:2;">
          <li>Mở Google Drive → tải ảnh về máy</li>
          <li>Đọc caption, chỉnh sửa nếu muốn</li>
          <li>Đăng Facebook: <a href="{CONFIG['hotel']['facebook']}" style="color:#1877F2;">{CONFIG['hotel']['facebook']}</a></li>
          <li>Đăng Instagram: <a href="https://instagram.com" style="color:#bc1888;">{CONFIG['hotel']['instagram']}</a></li>
        </ol>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:24px 32px;background:#f7f4ef;margin-top:20px;">
    <p style="margin:0;font-size:12px;color:#999;text-align:center;">
      VenHoSocialManager · <a href="{CONFIG['hotel']['website']}" style="color:#C9A84C;">{CONFIG['hotel']['website']}</a><br>
      Tạo lúc {datetime.now().strftime('%H:%M %d/%m/%Y')}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


def send(pillar: dict, topic: dict, content: dict, drive_url: str = None):
    cfg    = CONFIG["email"]
    sender = os.environ.get("GMAIL_SENDER", cfg["sender"])
    app_pw = os.environ.get("GMAIL_APP_PASSWORD", "")

    if not app_pw:
        raise ValueError("GMAIL_APP_PASSWORD chưa được cấu hình trong .env")

    subject = f"{cfg['subject_prefix']} — {pillar['emoji']} {pillar['name']}: {content['title']}"
    html    = build_html(pillar, topic, content, drive_url)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = sender
    msg["To"]      = cfg["recipient"]
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, app_pw)
        server.sendmail(sender, cfg["recipient"], msg.as_string())

    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Email đã gửi → {cfg['recipient']}")
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Subject: {subject}")


def _extract_hashtags(text: str) -> list:
    return [w for w in text.split() if w.startswith("#")]


def send_from_folder(folder_dir: Path):
    """Gửi email từ một thư mục bài viết — hỗ trợ cả manual-skill lẫn generate_content."""
    meta_path = folder_dir / "meta.json"
    if not meta_path.exists():
        print(f"LỖI: {meta_path} không tồn tại.")
        sys.exit(1)

    record = json.loads(meta_path.read_text(encoding="utf-8"))

    if "pillar_id" in record:
        # Format từ generate_content.py
        pillar   = PILLAR_MAP[record["pillar_id"]]
        topic    = next(t for t in pillar["topics"] if t["id"] == record["topic_id"])
        title    = record["title"]
        hashtags = record.get("hashtags_all", [])
    else:
        # Format từ manual skill
        concept  = record.get("concept", "Bài viết mới")
        pillar   = {"emoji": "📍", "name": record.get("pillar", "Bài viết mới")}
        topic    = {"title": concept, "desc": ""}
        title    = concept
        fb_text  = (folder_dir / "facebook.txt").read_text(encoding="utf-8") if (folder_dir / "facebook.txt").exists() else ""
        hashtags = _extract_hashtags(fb_text)

    content = {
        "title":             title,
        "facebook_caption":  (folder_dir / "facebook.txt").read_text(encoding="utf-8"),
        "instagram_caption": (folder_dir / "instagram.txt").read_text(encoding="utf-8"),
        "hashtags_all":      hashtags,
        "image_prompt":      (folder_dir / "image_prompt.txt").read_text(encoding="utf-8") if (folder_dir / "image_prompt.txt").exists() else "",
    }
    send(pillar, topic, content, record.get("drive_url"))


def send_from_files():
    """Gọi độc lập: tự scan folder mới nhất trong database (không phụ thuộc index.json)."""
    db_dir   = BASE_DIR / CONFIG["database_dir"]
    all_meta = sorted(db_dir.rglob("meta.json"), key=lambda p: p.parent.name, reverse=True)

    if not all_meta:
        print("LỖI: Không tìm thấy bài viết nào trong database.")
        sys.exit(1)

    send_from_folder(all_meta[0].parent)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        send_from_folder(Path(sys.argv[1]))
    else:
        send_from_files()
