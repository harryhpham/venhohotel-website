"""
post_generator.py — Sinh caption tự động cho Ven Hồ Hotel
Chạy mỗi Thứ Hai 10:00 sáng qua Windows Task Scheduler

Đầu ra:
  - pending/YYYY-MM-DD.json  (Harry đọc và duyệt)
  - Email preview → hpham1504@gmail.com
"""

import anthropic
import json
import os
import re
import smtplib
import sys
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from dotenv import load_dotenv

# ── Setup ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

CONFIG = json.loads((BASE_DIR / "config.json").read_text(encoding="utf-8"))
SCHEDULE = json.loads((BASE_DIR / "schedule.json").read_text(encoding="utf-8"))

PENDING_DIR = BASE_DIR / "pending"
LOG_DIR = BASE_DIR / "logs"
PENDING_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)


def log(msg: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    log_file = LOG_DIR / f"generator-{datetime.now().strftime('%Y-%m')}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line + "\n")


# ── Tìm topic tuần này ─────────────────────────────────────────────────────────
def get_this_week_entry() -> dict | None:
    today = datetime.now()
    monday = today - timedelta(days=today.weekday())
    monday_str = monday.strftime("%Y-%m-%d")

    for entry in SCHEDULE:
        if entry["week_monday"] == monday_str:
            return entry

    log(f"Không tìm thấy lịch cho tuần {monday_str} trong schedule.json")
    return None


# ── Kiểm tra ảnh có sẵn ────────────────────────────────────────────────────────
def get_available_images(image_folder: str | None) -> list[str]:
    if not image_folder:
        return []

    folders_config = CONFIG["images"]["folders"]
    if image_folder not in folders_config:
        return []

    local_root = Path(CONFIG["images"]["local_root"])
    public_base = CONFIG["images"]["public_base_url"]
    available = []

    for filename in folders_config[image_folder]:
        local_path = local_root / image_folder / filename
        if local_path.exists():
            public_url = f"{public_base}/{image_folder}/{filename}"
            available.append(public_url)

    return available[:3]  # Tối đa 3 ảnh gợi ý


# ── Gọi Claude API sinh caption ────────────────────────────────────────────────
def generate_caption(entry: dict, images: list[str]) -> dict:
    hotel = CONFIG["hotel_info"]
    has_images = len(images) > 0

    image_note = ""
    if has_images:
        image_note = f"Có ảnh sẵn — gợi ý dùng:\n" + "\n".join(f"  - {url}" for url in images)
    else:
        image_note = "KHÔNG CÓ ẢNH SẴN — cần viết AI image prompt để Harry tạo ảnh bằng Canva AI hoặc Midjourney"

    prompt = f"""Bạn là social media manager cho {hotel['name']} — khách sạn boutique 12 phòng tại {hotel['address']}, Hà Nội.

Thương hiệu: "{hotel['tagline_vi']}" ({hotel['tagline_en']})
Giọng văn: ấm áp, chuyên nghiệp, gần gũi — không quá hoa mỹ, không spam hashtag

CHỦ ĐỀ TUẦN NÀY: {entry['topic']}
Mô tả: {entry['description']}
Tone: {entry['tone']}
Ngày đăng dự kiến: {entry['post_date']}

{image_note}

NHIỆM VỤ — viết 2 caption + (nếu không có ảnh) 1 AI image prompt:

1. **Caption Facebook** (150–200 từ tiếng Việt):
   - Mở đầu bằng câu kéo chú ý (không dùng emoji ngay đầu)
   - Kể câu chuyện cảm xúc ngắn về chủ đề
   - Kết thúc bằng CTA nhẹ nhàng (gợi ý đặt phòng / hỏi thêm)
   - 5–8 hashtag cuối bài
   - Bao gồm: website {hotel['website']} hoặc số {hotel['phone']}

2. **Caption Instagram** (80–100 từ tiếng Việt):
   - Ngắn gọn, visual hơn
   - Dòng đầu phải gây tò mò (người dùng thấy trước khi nhấn "more")
   - 12–15 hashtag (mix tiếng Việt + tiếng Anh)
   - Không lặp hashtag với Facebook

{"3. **AI Image Prompt** (tiếng Anh, 1–2 câu):" if not has_images else ""}
{"""   - Mô tả ảnh cần tạo bằng AI, phù hợp với chủ đề
   - Phong cách: photorealistic, warm tones, luxurious boutique hotel
   - Tỷ lệ: 4:5 (Instagram portrait)
   - Không đề cập tên người, chỉ không gian / phong cảnh""" if not has_images else ""}

Trả về JSON hợp lệ (chỉ JSON, không giải thích thêm):
{{
  "facebook_caption": "...",
  "instagram_caption": "...",
  "ai_image_prompt": {"null" if has_images else '"..."'}
}}"""

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    message = client.messages.create(
        model=CONFIG["claude_model"],
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = message.content[0].text.strip()

    # Trích JSON từ response (phòng trường hợp Claude thêm text thừa)
    json_match = re.search(r'\{[\s\S]*\}', response_text)
    if not json_match:
        raise ValueError(f"Claude không trả về JSON hợp lệ:\n{response_text}")

    return json.loads(json_match.group())


# ── Lưu file pending ───────────────────────────────────────────────────────────
def save_pending(entry: dict, captions: dict, images: list[str]) -> Path:
    post_date = entry["post_date"]
    pending_data = {
        "post_date": post_date,
        "generated_at": datetime.now().isoformat(),
        "topic": entry["topic"],
        "status": "pending_review",
        "facebook": {
            "caption": captions["facebook_caption"],
            "image_url": images[0] if images else None,
            "image_note": f"Dùng ảnh từ {entry['image_folder']}/" if images else "Cần tạo ảnh mới"
        },
        "instagram": {
            "caption": captions["instagram_caption"],
            "image_url": images[0] if images else None,
            "image_note": f"Dùng ảnh từ {entry['image_folder']}/" if images else "Cần tạo ảnh mới"
        },
        "ai_image_prompt": captions.get("ai_image_prompt"),
        "all_available_images": images,
        "instructions": {
            "how_to_edit": "Mở file này bằng Notepad hoặc VS Code, sửa caption trực tiếp rồi lưu",
            "how_to_change_image": "Đổi giá trị image_url thành URL ảnh khác từ danh sách all_available_images",
            "how_to_publish": "Sau khi duyệt, double-click publish.bat để đăng bài"
        }
    }

    output_path = PENDING_DIR / f"{post_date}.json"
    output_path.write_text(
        json.dumps(pending_data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    return output_path


# ── Gửi email preview ──────────────────────────────────────────────────────────
def send_preview_email(entry: dict, captions: dict, images: list[str], pending_path: Path):
    cfg = CONFIG["email"]
    sender = os.environ["GMAIL_SENDER"]
    password = os.environ["GMAIL_APP_PASSWORD"]
    recipient = cfg["recipient"]

    image_section = ""
    if images:
        image_section = f"""
        <p><strong>📸 Ảnh gợi ý:</strong></p>
        <ul>{"".join(f'<li><a href="{url}">{url.split("/")[-1]}</a></li>' for url in images)}</ul>
        <img src="{images[0]}" style="max-width:400px; border-radius:8px;" />
        """
    elif captions.get("ai_image_prompt"):
        image_section = f"""
        <p><strong>🎨 AI Image Prompt</strong> (dùng cho Canva AI / Midjourney):</p>
        <blockquote style="background:#f5f5f5;padding:12px;border-left:4px solid #C9A84C;font-style:italic;">
            {captions['ai_image_prompt']}
        </blockquote>
        """

    html = f"""
    <html><body style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 20px;">

    <div style="background:#1B2D4F; color:white; padding:20px; border-radius:8px 8px 0 0;">
        <h2 style="margin:0;">📱 Draft Bài Đăng — {entry['post_date']}</h2>
        <p style="margin:8px 0 0; opacity:0.8;">Chủ đề: {entry['topic']}</p>
    </div>

    <div style="border:1px solid #ddd; border-top:none; padding:24px; border-radius:0 0 8px 8px;">

        {image_section}

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <h3 style="color:#1B2D4F;">📘 Facebook Caption</h3>
        <div style="background:#f9f7f3; padding:16px; border-radius:6px; white-space:pre-line; line-height:1.7;">
{captions['facebook_caption']}
        </div>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <h3 style="color:#1B2D4F;">📷 Instagram Caption</h3>
        <div style="background:#f9f7f3; padding:16px; border-radius:6px; white-space:pre-line; line-height:1.7;">
{captions['instagram_caption']}
        </div>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <div style="background:#fff8e8; border:1px solid #C9A84C; padding:16px; border-radius:6px;">
            <strong>📋 Bước tiếp theo:</strong>
            <ol>
                <li>Đọc lại caption, chỉnh sửa nếu cần tại:<br>
                    <code style="background:#eee; padding:2px 6px; border-radius:3px;">{pending_path}</code>
                </li>
                <li>Double-click <strong>publish.bat</strong> để đăng lên Facebook + Instagram</li>
            </ol>
        </div>

    </div>

    <p style="color:#999; font-size:12px; text-align:center; margin-top:16px;">
        Tự động tạo bởi Ven Hồ Social Media Bot · {datetime.now().strftime('%d/%m/%Y %H:%M')}
    </p>
    </body></html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{cfg['subject_prefix']} {entry['post_date']} — {entry['topic']}"
    msg["From"] = sender
    msg["To"] = recipient
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.sendmail(sender, recipient, msg.as_string())

    log(f"Email preview đã gửi đến {recipient}")


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    log("=== Bắt đầu sinh content ===")

    entry = get_this_week_entry()
    if not entry:
        log("Không có lịch tuần này — kết thúc.")
        sys.exit(0)

    log(f"Chủ đề: {entry['topic']} | Ngày đăng: {entry['post_date']}")

    # Kiểm tra file pending đã tồn tại chưa
    pending_path = PENDING_DIR / f"{entry['post_date']}.json"
    if pending_path.exists():
        log(f"File pending đã tồn tại: {pending_path} — bỏ qua (xóa file để tạo lại)")
        sys.exit(0)

    images = get_available_images(entry.get("image_folder"))
    log(f"Ảnh tìm thấy: {len(images)} ảnh")

    log("Đang gọi Claude API sinh caption...")
    captions = generate_caption(entry, images)
    log("Caption sinh xong")

    pending_path = save_pending(entry, captions, images)
    log(f"Đã lưu: {pending_path}")

    log("Đang gửi email preview...")
    send_preview_email(entry, captions, images, pending_path)

    log("=== Hoàn thành ===")


if __name__ == "__main__":
    main()
