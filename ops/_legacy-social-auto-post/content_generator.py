"""
content_generator.py — Ven Hồ Hotel Social Media Content Generator
Chạy tự động Thứ 2 / 4 / 6 lúc 10:00 sáng (Windows Task Scheduler)

Luồng:
  1. Xác định ngày → chọn Content Pillar
  2. Chọn topic tiếp theo (xoay vòng, không lặp lại gần đây)
  3. Claude API sinh: Tiêu đề, Caption FB, Caption IG, Hashtag, Image Prompt
  4. Lưu vào Content Bank (.json + .md)
  5. Gửi email preview → hpham1504@gmail.com
"""

import anthropic
import json
import os
import re
import smtplib
import sys
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from dotenv import load_dotenv

# ── Setup ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

CONFIG     = json.loads((BASE_DIR / "config.json").read_text(encoding="utf-8"))
PILLARS    = json.loads((BASE_DIR / "pillars.json").read_text(encoding="utf-8"))
BANK_DIR   = BASE_DIR / CONFIG["content_bank_dir"]
LOG_DIR    = BASE_DIR / "logs"
INDEX_FILE = BANK_DIR / "index.json"

BANK_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)

DAY_MAP = {
    0: "monday",
    2: "wednesday",
    4: "friday",
}


def log(msg: str):
    ts   = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    log_file = LOG_DIR / f"generator-{datetime.now().strftime('%Y-%m')}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line + "\n")


# ── 1. Xác định pillar theo ngày ───────────────────────────────────────────────
def get_today_pillar() -> dict | None:
    weekday = datetime.now().weekday()
    day_key = DAY_MAP.get(weekday)
    if not day_key:
        log(f"Hôm nay là thứ {weekday+1} — không phải Thứ 2/4/6, kết thúc.")
        return None
    pillar = PILLARS[day_key].copy()
    pillar["day_key"] = day_key
    return pillar


# ── 2. Chọn topic tiếp theo (round-robin) ──────────────────────────────────────
def pick_next_topic(pillar: dict) -> dict:
    used_ids: list[str] = []

    if INDEX_FILE.exists():
        index = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
        used_ids = [
            e["topic_id"]
            for e in index.get("entries", [])
            if e["pillar_id"] == pillar["id"]
        ]

    topics    = pillar["topics"]
    topic_ids = [t["id"] for t in topics]

    # Tìm topic chưa dùng; nếu dùng hết thì reset
    for tid in topic_ids:
        if tid not in used_ids:
            return next(t for t in topics if t["id"] == tid)

    # Tất cả đã dùng — reset vòng mới, dùng lại từ đầu
    log(f"Hết topic chưa dùng cho pillar '{pillar['id']}' — bắt đầu vòng mới")
    return topics[0]


# ── 3. Gọi Claude API sinh content ────────────────────────────────────────────
def generate_content(pillar: dict, topic: dict) -> dict:
    hotel = CONFIG["hotel"]
    brand = CONFIG["brand"]
    today = datetime.now().strftime("%d/%m/%Y")

    prompt = f"""Bạn là social media manager sáng tạo cho **{hotel['name']}** — khách sạn boutique 12 phòng tại {hotel['address']}.

**Thương hiệu:**
- Tagline: "{hotel['tagline_vi']}" / "{hotel['tagline_en']}"
- Tính cách: {brand['personality']}
- Màu sắc: {brand['colors']}

**Pillar hôm nay ({today}):** {pillar['name']} {pillar['emoji']}
- Mục tiêu: {pillar['description']}
- Tone: {pillar['tone']}
- CTA: {pillar['cta']}

**Chủ đề cụ thể:** {topic['title']}
- Gợi ý nội dung: {topic['desc']}

---
NHIỆM VỤ — Tạo đầy đủ nội dung cho 1 bài đăng social media:

**1. TIÊU ĐỀ** (5–8 từ, gây tò mò hoặc cảm xúc, KHÔNG dùng từ sáo rỗng)

**2. CAPTION FACEBOOK** (150–200 từ tiếng Việt):
- Câu mở đầu: kéo người đọc dừng lại (không bắt đầu bằng emoji)
- Thân bài: kể câu chuyện ngắn hoặc mô tả sinh động về chủ đề
- Kết: CTA nhẹ nhàng — không bán hàng thô
- Hashtag: 6–8 cái cuối bài (mix tiếng Việt + Anh)
- Có thể đề cập: website {hotel['website']} hoặc số {hotel['phone']}

**3. CAPTION INSTAGRAM** (70–100 từ tiếng Việt):
- Dòng 1: câu hook mạnh (người xem thấy trước khi nhấn "more")
- Nội dung: ngắn gọn, visual, gợi cảm xúc
- Hashtag: 12–15 cái (KHÁC với hashtag Facebook, đa dạng hơn)

**4. HASHTAG TỔNG HỢP** (20–25 cái, gộp cả FB + IG, copy-paste sẵn):
- Mix: tiếng Việt, tiếng Anh, local (#TayHo, #HoTay, #Hanoi, #VenHoHotel...)
- Từ rất phổ biến đến niche

**5. IMAGE PROMPT — MIDJOURNEY / DALL-E** (tiếng Anh):
- Mô tả ảnh chi tiết phù hợp với chủ đề
- Style: photorealistic, warm golden tones, luxurious boutique hotel atmosphere
- Ánh sáng: natural light, golden hour hoặc blue hour tùy chủ đề
- Tỷ lệ: --ar 4:5 (Instagram portrait)
- Kết thúc bằng: --ar 4:5 --style raw --v 6

**6. IMAGE PROMPT — CANVA AI** (tiếng Anh, đơn giản hơn, 1–2 câu):
- Phù hợp với Canva AI Text to Image
- Rõ ràng, không quá kỹ thuật

---
Trả về JSON hợp lệ (chỉ JSON, không có text thêm):
{{
  "title": "...",
  "facebook_caption": "...",
  "instagram_caption": "...",
  "hashtags_all": "...",
  "image_prompt_midjourney": "...",
  "image_prompt_canva": "..."
}}"""

    client  = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    message = client.messages.create(
        model=CONFIG["claude_model"],
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    match = re.search(r"\{[\s\S]*\}", raw)
    if not match:
        raise ValueError(f"Claude không trả về JSON hợp lệ:\n{raw}")
    return json.loads(match.group())


# ── 4. Lưu vào Content Bank ────────────────────────────────────────────────────
def save_to_content_bank(pillar: dict, topic: dict, content: dict) -> dict:
    today    = datetime.now().strftime("%Y-%m-%d")
    file_stem = f"{today}-{pillar['id']}"

    # JSON
    json_data = {
        "date":        today,
        "pillar_id":   pillar["id"],
        "pillar_name": pillar["name"],
        "topic_id":    topic["id"],
        "topic_title": topic["title"],
        "generated_at": datetime.now().isoformat(),
        "status":      "pending_review",
        **content,
    }
    json_path = BANK_DIR / f"{file_stem}.json"
    json_path.write_text(json.dumps(json_data, ensure_ascii=False, indent=2), encoding="utf-8")

    # Markdown (asset SEO + đọc dễ)
    day_vi = {"monday": "Thứ Hai", "wednesday": "Thứ Tư", "friday": "Thứ Sáu"}[pillar["day_key"]]
    md = f"""# {content['title']}

**Ngày:** {today} ({day_vi})
**Pillar:** {pillar['emoji']} {pillar['name']}
**Chủ đề:** {topic['title']}
**Trạng thái:** ⏳ Chờ duyệt

---

## 📘 Caption Facebook

{content['facebook_caption']}

---

## 📷 Caption Instagram

{content['instagram_caption']}

---

## #️⃣ Hashtag (copy-paste)

{content['hashtags_all']}

---

## 🎨 Image Prompt

### Midjourney / DALL-E
```
{content['image_prompt_midjourney']}
```

### Canva AI
```
{content['image_prompt_canva']}
```

---

*Tự động tạo bởi Ven Hồ Social Media Bot — {datetime.now().strftime('%d/%m/%Y %H:%M')}*
"""
    md_path = BANK_DIR / f"{file_stem}.md"
    md_path.write_text(md, encoding="utf-8")

    log(f"Đã lưu: {json_path.name} + {md_path.name}")
    return {"json": json_path, "md": md_path, "stem": file_stem}


# ── 5. Cập nhật index ──────────────────────────────────────────────────────────
def update_index(pillar: dict, topic: dict, content: dict, file_paths: dict):
    if INDEX_FILE.exists():
        index = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    else:
        index = {"entries": []}

    index["entries"].append({
        "date":        datetime.now().strftime("%Y-%m-%d"),
        "pillar_id":   pillar["id"],
        "pillar_name": pillar["name"],
        "topic_id":    topic["id"],
        "topic_title": topic["title"],
        "title":       content["title"],
        "file_stem":   file_paths["stem"],
        "status":      "pending_review",
    })
    INDEX_FILE.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")

    # Cập nhật index.md (bảng tổng hợp)
    index_md_path = BANK_DIR / "index.md"
    rows = []
    for e in reversed(index["entries"]):
        status_icon = "✅" if e["status"] == "published" else "⏳"
        rows.append(f"| {e['date']} | {e['pillar_name']} | {e['topic_title']} | {e['title']} | {status_icon} |")

    index_md = f"""# Content Bank — Ven Hồ Hotel

> Toàn bộ nội dung social media đã tạo. Đây là tài sản SEO và thương hiệu của khách sạn.

**Tổng số bài:** {len(index['entries'])}
**Cập nhật lần cuối:** {datetime.now().strftime('%d/%m/%Y %H:%M')}

| Ngày | Pillar | Chủ đề | Tiêu đề | Trạng thái |
|------|--------|--------|---------|-----------|
{chr(10).join(rows)}

---

**Cách dùng Content Bank:**
- Mỗi bài có file `.json` (dữ liệu) và `.md` (đọc trực tiếp)
- File `.md` có thể dùng làm nháp blog post sau này
- Hashtag trong mỗi file đã được nghiên cứu — tái sử dụng thoải mái
"""
    index_md_path.write_text(index_md, encoding="utf-8")
    log("Đã cập nhật content-bank/index.md")


# ── 6. Gửi email ──────────────────────────────────────────────────────────────
def send_email(pillar: dict, topic: dict, content: dict, file_paths: dict):
    cfg      = CONFIG["email"]
    sender   = os.environ["GMAIL_SENDER"]
    password = os.environ["GMAIL_APP_PASSWORD"]
    today    = datetime.now().strftime("%d/%m/%Y")
    day_vi   = {"monday": "Thứ Hai", "wednesday": "Thứ Tư", "friday": "Thứ Sáu"}[pillar["day_key"]]

    # Chuyển newline thành <br> cho HTML
    def to_html(text: str) -> str:
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br>")

    html = f"""<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f4f1eb; font-family: 'Segoe UI', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1eb; padding:24px 0;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%;">

  <!-- Header -->
  <tr><td style="background:#1B2D4F; border-radius:12px 12px 0 0; padding:28px 32px;">
    <p style="margin:0; color:#C9A84C; font-size:13px; letter-spacing:2px; text-transform:uppercase;">{pillar['emoji']} {pillar['name']}</p>
    <h1 style="margin:8px 0 0; color:#ffffff; font-size:22px; font-weight:600;">{content['title']}</h1>
    <p style="margin:8px 0 0; color:#a0b4cc; font-size:13px;">{day_vi}, {today}</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff; padding:32px; border-left:1px solid #e8e2d9; border-right:1px solid #e8e2d9;">

    <!-- Facebook -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="padding-bottom:10px;">
        <span style="background:#1877F2; color:#fff; font-size:12px; font-weight:600; padding:4px 10px; border-radius:4px;">📘 FACEBOOK</span>
      </td></tr>
      <tr><td style="background:#f7f9ff; border:1px solid #e3eaff; border-radius:8px; padding:18px; line-height:1.8; color:#1a1a1a; font-size:14px; white-space:pre-wrap;">
        {to_html(content['facebook_caption'])}
      </td></tr>
    </table>

    <!-- Instagram -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="padding-bottom:10px;">
        <span style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); color:#fff; font-size:12px; font-weight:600; padding:4px 10px; border-radius:4px;">📷 INSTAGRAM</span>
      </td></tr>
      <tr><td style="background:#fff5f7; border:1px solid #ffd6e0; border-radius:8px; padding:18px; line-height:1.8; color:#1a1a1a; font-size:14px; white-space:pre-wrap;">
        {to_html(content['instagram_caption'])}
      </td></tr>
    </table>

    <!-- Hashtags -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="padding-bottom:10px;">
        <span style="background:#6c757d; color:#fff; font-size:12px; font-weight:600; padding:4px 10px; border-radius:4px;">#️⃣ HASHTAG (copy-paste)</span>
      </td></tr>
      <tr><td style="background:#f8f8f8; border:1px solid #e0e0e0; border-radius:8px; padding:14px; color:#555; font-size:13px; word-break:break-word; line-height:2;">
        {to_html(content['hashtags_all'])}
      </td></tr>
    </table>

    <!-- Image Prompts -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="padding-bottom:10px;">
        <span style="background:#7c3aed; color:#fff; font-size:12px; font-weight:600; padding:4px 10px; border-radius:4px;">🎨 IMAGE PROMPT</span>
      </td></tr>
      <tr><td style="padding-bottom:8px; padding-top:10px;">
        <p style="margin:0 0 6px; font-size:12px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Midjourney / DALL-E</p>
        <div style="background:#faf5ff; border:1px solid #ddd6fe; border-radius:8px; padding:14px; font-size:12.5px; color:#4a1d96; font-family:monospace; line-height:1.6; word-break:break-word;">
          {to_html(content['image_prompt_midjourney'])}
        </div>
      </td></tr>
      <tr><td>
        <p style="margin:12px 0 6px; font-size:12px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Canva AI (đơn giản hơn)</p>
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:14px; font-size:12.5px; color:#14532d; font-family:monospace; line-height:1.6; word-break:break-word;">
          {to_html(content['image_prompt_canva'])}
        </div>
      </td></tr>
    </table>

    <!-- Instructions -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:#fffbeb; border:1px solid #C9A84C; border-radius:8px; padding:16px;">
        <p style="margin:0 0 8px; font-weight:700; color:#92400e; font-size:13px;">📋 Bước tiếp theo</p>
        <ol style="margin:0; padding-left:20px; color:#78350f; font-size:13px; line-height:1.9;">
          <li>Tạo ảnh bằng <strong>Canva AI</strong> hoặc <strong>Midjourney</strong> từ prompt trên</li>
          <li>Đăng thủ công lên <strong>Facebook</strong>: facebook.com/venhohotelhanoi</li>
          <li>Đăng thủ công lên <strong>Instagram</strong>: @venhohotelhanoi</li>
          <li>File đầy đủ lưu tại: <code style="background:#fde68a; padding:1px 5px; border-radius:3px;">{file_paths['stem']}.md</code></li>
        </ol>
      </td></tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f0ede8; border-radius:0 0 12px 12px; border:1px solid #e8e2d9; border-top:none; padding:16px 32px; text-align:center;">
    <p style="margin:0; color:#999; font-size:11px;">
      Ven Hồ Social Media Bot · {datetime.now().strftime('%d/%m/%Y %H:%M')} ·
      <a href="{CONFIG['hotel']['website']}" style="color:#C9A84C;">{CONFIG['hotel']['website']}</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{cfg['subject_prefix']} {day_vi} {today} — {pillar['name']}: {content['title']}"
    msg["From"]    = sender
    msg["To"]      = cfg["recipient"]
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.sendmail(sender, cfg["recipient"], msg.as_string())

    log(f"Email đã gửi → {cfg['recipient']}")


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    log("=" * 55)
    log("Ven Hồ Social Media Bot — bắt đầu")

    pillar = get_today_pillar()
    if not pillar:
        sys.exit(0)

    log(f"Pillar: {pillar['name']} ({pillar['day_key']})")

    topic = pick_next_topic(pillar)
    log(f"Topic: {topic['title']}")

    log("Đang gọi Claude API...")
    content = generate_content(pillar, topic)
    log(f"Tiêu đề sinh ra: {content['title']}")

    file_paths = save_to_content_bank(pillar, topic, content)
    update_index(pillar, topic, content, file_paths)

    log("Đang gửi email...")
    send_email(pillar, topic, content, file_paths)

    log("Hoàn thành ✅")
    log("=" * 55)


if __name__ == "__main__":
    main()
