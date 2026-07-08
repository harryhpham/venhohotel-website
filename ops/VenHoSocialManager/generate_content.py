"""
generate_content.py — Ven Hồ Hotel Social Media Content Generator
Chạy tự động Thứ 2 / 4 / 6 lúc 8:00 sáng qua GitHub Actions

Luồng:
  1. Xác định pillar theo rotation (20-slot weighted cycle)
  2. Chọn topic tiếp theo (xoay vòng trong pillar)
  3. gpt-5.5 sinh: title, caption FB, caption IG, hashtag, image prompt
  4. gpt-image-2 tạo ảnh (1024×1024) — lưu ngay
  5. Lưu vào database/YYYY-MM-DD_pillar_id/ (meta.json + image.png)
  6. Cập nhật rotation_state.json + database/index
  7. Gọi send_email.py gửi preview (có ảnh nhúng)

Chạy thủ công (test, bỏ qua check Thứ 2/4/6):
  python3 generate_content.py --force
"""

import base64
import json
import os
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

CONFIG    = json.loads((BASE_DIR / "config.json").read_text(encoding="utf-8"))
PILLARS   = json.loads((BASE_DIR / "pillars.json").read_text(encoding="utf-8"))

DB_DIR     = BASE_DIR / CONFIG["database_dir"]
STATE_FILE = DB_DIR / "rotation_state.json"
INDEX_JSON = DB_DIR / "index.json"
INDEX_MD   = DB_DIR / "index.md"

ROTATION   = PILLARS["rotation"]
PILLAR_MAP = PILLARS["pillars"]

SCHEDULED_DAYS = {0, 2, 4}  # Mon=0, Wed=2, Fri=4


def log(msg: str):
    ts   = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    log_file = BASE_DIR / "logs" / f"generator-{datetime.now().strftime('%Y-%m')}.log"
    log_file.parent.mkdir(exist_ok=True)
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line + "\n")


# ── 1. Rotation state ──────────────────────────────────────────────────────────

def load_state() -> dict:
    if not STATE_FILE.exists():
        return {"rotation_index": 0, "topic_counters": {}}
    return json.loads(STATE_FILE.read_text(encoding="utf-8"))


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def get_current_pillar(state: dict) -> dict:
    idx       = state["rotation_index"] % len(ROTATION)
    pillar_id = ROTATION[idx]
    pillar    = dict(PILLAR_MAP[pillar_id])
    pillar["rotation_index"] = idx
    return pillar


# ── 2. Topic selection ─────────────────────────────────────────────────────────

def pick_next_topic(pillar: dict, state: dict) -> dict:
    pillar_id  = pillar["id"]
    topics     = pillar["topics"]
    used_count = state.get("topic_counters", {}).get(pillar_id, 0)
    topic      = topics[used_count % len(topics)]
    log(f"Pillar: {pillar['emoji']} {pillar['name']} — Topic: {topic['title']} ({used_count % len(topics) + 1}/{len(topics)})")
    return topic


def advance_state(state: dict, pillar_id: str):
    state["rotation_index"] = (state["rotation_index"] + 1) % len(ROTATION)
    if "topic_counters" not in state:
        state["topic_counters"] = {}
    state["topic_counters"][pillar_id] = state["topic_counters"].get(pillar_id, 0) + 1


# ── 3. gpt-5.5: sinh caption + image prompt ───────────────────────────────────

def generate_content(pillar: dict, topic: dict) -> dict:
    log(f"Đang gọi {CONFIG['openai_model']}...")

    cfg   = CONFIG["hotel"]
    brand = CONFIG["brand"]

    ref_image_note = ""
    if pillar.get("ref_image"):
        ref_image_note = (
            " Ảnh sẽ được chỉnh sửa (edit) trên nền một ảnh THẬT của không gian này tại Ven Hồ Hotel"
            " — mô tả phải giữ đúng bố cục/kiến trúc/vật liệu thật đã có trong ảnh gốc,"
            " chỉ thêm/thay đổi ánh sáng, thời điểm trong ngày, chi tiết nhỏ hoặc không khí;"
            " KHÔNG tự bịa ra một không gian/bố cục hoàn toàn khác."
        )

    system_prompt = f"""Bạn là Chuyên gia viết nội dung có kinh nghiệm xây dựng thương hiệu cho Ven Hồ Hotel — khách sạn boutique tại Hồ Tây, Hà Nội.

─── VAI TRÒ & PHƯƠNG PHÁP ───
Trước khi viết, bạn luôn phân tích 4 yếu tố:
1. Người đọc là ai? (đi công tác, thích du lịch, đang tìm phòng lưu trú, muốn tìm hiểu Hồ Tây)
2. Họ đang quan tâm, lo lắng hoặc cần điều gì?
3. Thông điệp chính cần truyền tải là gì?
4. Giọng văn nào phù hợp nhất?

Sau đó viết theo cấu trúc: hook thu hút → mở bài đánh đúng vấn đề → thân bài chia ý rõ ràng → kết bài có thông điệp chốt và CTA phù hợp.

─── THÔNG TIN KHÁCH SẠN ───
- Tên: {cfg['name']} (tagline: "{cfg['tagline_vi']}")
- Địa chỉ: {cfg['address']}
- Điện thoại: {cfg['phone']}
- Website: {cfg['website']}
- Facebook: {cfg['facebook']} / Instagram: {cfg['instagram']}
- 12 phòng boutique, Agoda {cfg['agoda_rating']} tổng thể, {cfg['agoda_location']} vị trí (45 reviews)
- Phòng từ 400,000đ/đêm

─── THƯƠNG HIỆU ───
- Cá tính: {brand['personality']}
- Tệp người đọc chính: người đi công tác, du khách thích trải nghiệm địa phương, người đang tìm phòng lưu trú gần Hồ Tây
- Chủ đề nội dung: Ven Hồ Hotel, Hồ Tây, kinh nghiệm du lịch Hồ Tây (làm gì, ăn gì, chơi gì)
- Mục tiêu: truyền thông, marketing, xây dựng thương hiệu

─── CONTENT PILLAR HIỆN TẠI: {pillar['emoji']} {pillar['name']} ───
- Mô tả: {pillar['description']}
- Tone: {pillar['tone']}
- CTA mẫu: {pillar['cta']}

─── CHỦ ĐỀ BÀI VIẾT ───
- Chủ đề: {topic['title']}
- Gợi ý nội dung: {topic['desc']}

─── QUY TẮC BẮT BUỘC ───
- Ngôn ngữ: Tiếng Việt tự nhiên, gần gũi — chuyên nghiệp nhưng không sáo rỗng
- Không viết chung chung — phải cụ thể, có tính ứng dụng thực tế
- Facebook: 150-200 từ, cấu trúc rõ ràng, 5-8 hashtag cuối bài
- Instagram: 70-100 từ, súc tích, kết thúc bằng dấu chấm hoặc emoji, 12-15 hashtag riêng
- Threads: 100-150 từ, conversational, gần gũi như nói chuyện với người quen, 3-5 hashtag tối đa, CTA nhẹ nhàng tự nhiên
- Không bắt đầu bằng emoji
- Không dùng "sang trọng", "đẳng cấp", "xa xỉ" — thay bằng "tinh tế", "ấm áp", "chân thật"
- Không bịa đặt review, trích dẫn hoặc lời khách hàng như quote thật. Nếu chưa có quote nguồn, hãy viết ở dạng tổng hợp cảm nhận/điểm mạnh.
- Hashtag: BẮT BUỘC không dấu — chỉ dùng tiếng Anh hoặc tiếng Việt không dấu (ví dụ: #HoTay #WestLake #HaNoi #Hanoi #VenHoHotel). TUYỆT ĐỐI không viết hashtag có dấu tiếng Việt (không viết #HồTây, #HàNội)
- image_prompt: tiếng Anh, photorealistic, tả cảnh thực tế đẹp, không có chữ trong ảnh{ref_image_note}

─── CHUẨN SEO ───
- Tiêu đề/hook phải chứa từ khóa chính (ví dụ: "Ven Hồ Hotel", "lưu trú Tây Hồ", "Hồ Tây Hà Nội")
- Đưa từ khóa vào tự nhiên trong 2-3 câu đầu — không nhồi nhét
- Từ khóa phụ liên quan: "phòng view Hồ Tây", "khách sạn boutique Hà Nội", "nghỉ dưỡng Tây Hồ", "du lịch Hồ Tây", "ăn gì Hồ Tây", "chơi gì Hồ Tây"
- Hashtag đóng vai keyword: ưu tiên hashtag có lượng tìm kiếm cao, luôn không dấu (#HoTay #KhachSanHaNoi #DuLichHaNoi #TayHo #WestLakeHanoi)
- Câu kết luôn có địa chỉ hoặc tên thương hiệu để tăng local SEO"""

    user_prompt = f"""Viết content cho bài đăng Facebook và Instagram về chủ đề: "{topic['title']}"

Trả về JSON với format chính xác sau (không có text nào ngoài JSON):
{{
  "title": "Tiêu đề ngắn 5-8 từ, tiếng Việt",
  "facebook_caption": "Caption Facebook 150-200 từ + 5-8 hashtag ở cuối",
  "instagram_caption": "Caption Instagram 70-100 từ + 12-15 hashtag ở cuối",
  "threads_caption": "Caption Threads 100-150 từ, conversational, 3-5 hashtag ở cuối",
  "hashtags_all": ["#hashtag1", "#hashtag2"],
  "image_prompt": "Detailed English prompt for gpt-image-2, photorealistic hotel/lake photography style, portrait or square aspect ratio, no text in image"
}}"""

    client   = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model=CONFIG["openai_model"],
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ],
        response_format={"type": "json_object"},
    )

    choice  = response.choices[0]
    raw     = choice.message.content
    refusal = getattr(choice.message, "refusal", None)

    if refusal:
        raise RuntimeError(f"GPT từ chối yêu cầu: {refusal}")
    if not raw:
        raise RuntimeError(f"GPT trả về nội dung rỗng. finish_reason={choice.finish_reason!r}")

    data = json.loads(raw)
    log(f"Nội dung đã tạo: \"{data['title']}\"")
    return data


# ── 4. gpt-image-2: tạo ảnh ──────────────────────────────────────────────────

def generate_image(image_prompt: str, save_path: Path, ref_image: str = None) -> Path:
    log(f"Đang gọi {CONFIG['dalle_model']} tạo ảnh...")

    client   = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    ref_path = BASE_DIR / ref_image if ref_image else None

    if ref_path and ref_path.exists():
        log(f"Dùng ảnh tham chiếu thật của Ven Hồ Hotel: {ref_image}")
        with open(ref_path, "rb") as ref_file:
            response = client.images.edit(
                model=CONFIG["dalle_model"],
                image=ref_file,
                prompt=image_prompt,
                size=CONFIG["image_sizes"]["square"],
                n=1,
            )
    else:
        response = client.images.generate(
            model=CONFIG["dalle_model"],
            prompt=image_prompt,
            size=CONFIG["image_sizes"]["square"],
            quality=CONFIG.get("image_quality", "high"),
            output_format="png",
            n=1,
        )

    img_data = response.data[0]
    save_path.write_bytes(base64.b64decode(img_data.b64_json))
    log(f"Ảnh đã lưu: {save_path.name}")
    return save_path


# ── 5. Lưu vào database/YYYY-MM-DD_topic_id/ ─────────────────────────────────

def save_to_database(pillar: dict, topic: dict, content: dict) -> dict:
    now         = datetime.now()
    date_str    = now.strftime("%Y-%m-%d")
    year        = now.strftime("%Y")
    month       = now.strftime("%m")
    folder_name = f"{date_str}_{topic['id']}"
    folder_rel  = f"{year}/{month}/{folder_name}"   # path tương đối từ DB_DIR
    content_dir = DB_DIR / year / month / folder_name
    content_dir.mkdir(parents=True, exist_ok=True)

    # Tạo ảnh — dùng ảnh tham chiếu thật của khách sạn nếu pillar có cấu hình ref_image
    image_path = content_dir / "image.png"
    generate_image(content["image_prompt"], image_path, ref_image=pillar.get("ref_image"))

    # Lưu từng file riêng
    (content_dir / "facebook.txt").write_text(content["facebook_caption"], encoding="utf-8")
    (content_dir / "instagram.txt").write_text(content["instagram_caption"], encoding="utf-8")
    (content_dir / "threads.txt").write_text(content["threads_caption"], encoding="utf-8")
    (content_dir / "image_prompt.txt").write_text(content["image_prompt"], encoding="utf-8")

    record = {
        "date":         date_str,
        "generated_at": now.isoformat(),
        "pillar_id":    pillar["id"],
        "pillar_name":  pillar["name"],
        "topic_id":     topic["id"],
        "topic_title":  topic["title"],
        "title":        content["title"],
        "hashtags_all": content["hashtags_all"],
        "status":       "pending_review",
        "folder":       folder_rel,
    }
    (content_dir / "meta.json").write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    log(f"Đã lưu: database/{folder_rel}/")

    return {"folder": folder_rel, "date": date_str, "image_path": image_path, "content_dir": content_dir}


# ── 6. Cập nhật index ─────────────────────────────────────────────────────────

def update_index(pillar: dict, topic: dict, content: dict, file_info: dict):
    index = {"entries": []}
    if INDEX_JSON.exists():
        index = json.loads(INDEX_JSON.read_text(encoding="utf-8"))

    entry = {
        "date":        file_info["date"],
        "pillar_id":   pillar["id"],
        "pillar_name": pillar["name"],
        "topic_id":    topic["id"],
        "topic_title": topic["title"],
        "title":       content["title"],
        "status":      "pending_review",
        "folder":      file_info["folder"],
    }
    index["entries"].append(entry)
    INDEX_JSON.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "# Database Index — Ven Hồ Hotel Social Media\n",
        f"Cập nhật lần cuối: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n",
        "| Ngày | Pillar | Chủ đề | Tiêu đề | Trạng thái |\n",
        "|------|--------|--------|---------|------------|\n",
    ]
    for e in sorted(index["entries"], key=lambda x: x["date"], reverse=True):
        pid   = e.get("pillar_id")
        emoji = PILLAR_MAP[pid]["emoji"] if pid and pid in PILLAR_MAP else "📝"
        lines.append(
            f"| {e['date']} | {emoji} {e.get('pillar_name', '')} | {e.get('topic_title', '')} "
            f"| {e['title']} | {e['status']} |\n"
        )
    INDEX_MD.write_text("".join(lines), encoding="utf-8")
    log("Đã cập nhật database/index.json + index.md")


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    force         = "--force" in sys.argv
    today_weekday = datetime.now().weekday()

    if not force and today_weekday not in SCHEDULED_DAYS:
        day_names = {0: "Thứ Hai", 1: "Thứ Ba", 2: "Thứ Tư", 3: "Thứ Năm",
                     4: "Thứ Sáu", 5: "Thứ Bảy", 6: "Chủ Nhật"}
        log(f"Hôm nay là {day_names[today_weekday]} — không phải Thứ 2/4/6, kết thúc. Dùng --force để bỏ qua.")
        return

    log("=== VenHoSocialManager — Bắt đầu tạo content ===")

    DB_DIR.mkdir(exist_ok=True)

    state     = load_state()
    pillar    = get_current_pillar(state)
    topic     = pick_next_topic(pillar, state)
    content   = generate_content(pillar, topic)
    file_info = save_to_database(pillar, topic, content)

    update_index(pillar, topic, content, file_info)
    advance_state(state, pillar["id"])
    save_state(state)
    log(f"Rotation index tiếp theo: {state['rotation_index']}")

    drive_url = None
    image_public_url = None
    if os.environ.get("SKIP_GOOGLE_DRIVE") == "1":
        log("Bỏ qua Google Drive upload (SKIP_GOOGLE_DRIVE=1).")
    else:
        log("Đang upload lên Google Drive...")
        try:
            import google_drive
            result = google_drive.upload_to_drive(file_info["folder"], file_info["content_dir"])
            drive_url = result["folder_url"]
            image_public_url = result["image_public_url"]
            log(f"Google Drive: {drive_url}")
            log(f"Ảnh public URL: {image_public_url}")
            # Ghi drive_url + image_public_url vào meta.json
            meta_path = file_info["content_dir"] / "meta.json"
            record    = json.loads(meta_path.read_text(encoding="utf-8"))
            record["drive_url"] = drive_url
            record["image_public_url"] = image_public_url
            meta_path.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
        except Exception as e:
            log(f"LỖI Google Drive: {e}")

    log("Đang gửi email preview...")
    try:
        import send_email
        send_email.send(pillar, topic, content, drive_url, file_info["image_path"])
    except Exception as e:
        log(f"LỖI gửi email: {e}")
        log(f"Content đã lưu tại: database/{file_info['folder']}/")
        log("Gửi email thủ công: python3 send_email.py")

    if not image_public_url:
        log("Bỏ qua Make.com: chưa có image_public_url (cần Google Drive upload thành công trước).")
    else:
        log("Đang gửi dữ liệu sang Make.com...")
        try:
            import post_to_make
            make_result = post_to_make.send_to_make(
                pillar,
                topic,
                content,
                file_info,
                image_public_url,
            )
            log(f"Make.com: {make_result}")
        except Exception as e:
            log(f"LỖI Make.com webhook: {e}")

    log("=== Hoàn thành ===")


if __name__ == "__main__":
    main()
