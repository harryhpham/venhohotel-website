# VenHoSocialManager

AI pipeline tự động tạo caption + ảnh + **tự đăng thẳng lên Facebook Page** qua Make.com, chạy bằng GitHub Actions T2/T4/T6 lúc 8AM Việt Nam.

> ⚠️ **Không có bước duyệt thủ công trước khi đăng.** Email preview gửi song song cho Harry nhưng không chặn việc đăng — bài lên Facebook Page thật ngay trong cùng lần chạy.

## Pipeline

```
gpt-5.5 tạo caption + image_prompt
        ↓
gpt-image-2 tạo ảnh (1024×1024, b64_json)
        ↓
Lưu local: database/YYYY/MM/YYYY-MM-DD_topic_id/
  ├── image.png
  ├── facebook.txt
  ├── instagram.txt
  ├── image_prompt.txt
  └── meta.json
        ↓
Upload image.png lên Google Drive, set quyền "anyone with link can view"
  → lấy FILE_ID → tạo image_public_url (direct-download)
        ↓
Gửi email HTML → hpham1504@gmail.com (ảnh AI nhúng inline, chạy song song)
        ↓
POST JSON (caption + image_public_url) sang Make.com webhook
  (chỉ chạy nếu Drive upload thành công và có image_public_url)
        ↓
Make: Webhook → HTTP "Get a file" (tải ảnh từ image_public_url)
     → Facebook Pages "Create a Post with Photos" → ĐĂNG THẬT lên Facebook Page
        ↓
Commit rotation state + caption/meta text vào repo
  (không commit image.png để tránh repo phình to)
```

## Files chính

| File | Vai trò |
|------|---------|
| `generate_content.py` | Entry point — toàn bộ pipeline |
| `google_drive.py` | Upload Drive + set public permission + tạo `image_public_url` |
| `post_to_make.py` | POST JSON (caption + `image_url`) sang Make.com webhook |
| `send_email.py` | Build HTML + gửi Gmail SMTP SSL 465 |
| `pillars.json` | 5 pillars, 40 topics, 20-slot rotation |
| `config.json` | Models, hotel info, email config |
| `.env` | API keys (không commit) |
| `token.json` | OAuth token Drive (không commit; bản sao lưu trong GitHub Secret `GOOGLE_DRIVE_TOKEN_JSON`) |
| `credentials.json` | OAuth client Drive (không commit; chỉ cần khi xác thực lần đầu local) |

## Models

| Tác vụ | Model | Ghi chú |
|--------|-------|---------|
| Caption + prompt | `gpt-5.5` | Reasoning model — KHÔNG dùng `max_completion_tokens` |
| Ảnh | `gpt-image-2` | Trả về `b64_json`, không phải URL |

## Content Pillars & Rotation

| Pillar | ID | Slot/20 | Tỷ lệ |
|--------|----|---------|-------|
| Hồ Tây & Địa Điểm | `ho_tay` | 8 | 40% |
| Ẩm Thực Tây Hồ | `am_thuc` | 4 | 20% |
| Công Tác & Tiện Ích | `cong_tac` | 3 | 15% |
| Social Proof | `social_proof` | 3 | 15% |
| Thương Hiệu | `thuong_hieu` | 2 | 10% |

Mỗi pillar có 8 topics, xoay vòng tuyến tính. State lưu ở `database/rotation_state.json`.

## GitHub Actions

Workflow: `.github/workflows/social-content.yml`

- Lịch: `0 1 * * 1,3,5` UTC = 8:00 sáng Việt Nam, Thứ 2/4/6
- Secrets cần có: `OPENAI_API_KEY`, `SOCIAL_GMAIL_SENDER`, `SOCIAL_GMAIL_APP_PASS`
- Secret Google Drive: `GOOGLE_DRIVE_TOKEN_JSON` (nội dung file `token.json` — có `refresh_token`, tự refresh trong CI, không cần đăng nhập browser)
- Secret để tự đăng qua Make.com: `MAKE_WEBHOOK_URL`
- Secret tùy chọn để xác thực webhook: `MAKE_WEBHOOK_SECRET`
- Workflow tự khôi phục `token.json` từ secret trước khi chạy `generate_content.py` (không set `SKIP_GOOGLE_DRIVE` nữa — Drive upload luôn chạy vì cần để lấy `image_public_url`)
- Email có ảnh inline; repo commit lại rotation/index/caption text/meta
- Chạy thủ công: GitHub → Actions → Social Content Generator → Run workflow (⚠️ sẽ đăng bài thật lên Facebook Page nếu Make scenario đang `ON`)

## Make.com Facebook Auto-Post

Scenario chuẩn — 3 module:

1. Module 1: `Webhooks` → `Custom webhook`
   - Tạo webhook mới, ví dụ `VenHo Social Publisher`
   - Copy webhook URL
   - Thêm URL này vào GitHub repo secrets với tên `MAKE_WEBHOOK_URL`

2. Module 2: `HTTP` → `Get a file`
   - Webhook gửi **JSON thuần**, KHÔNG đính kèm file — field `image_url` là link direct-download trên Google Drive
   - URL field của module này phải map đúng 1 chip duy nhất: `image_url` (từ Module 1) — không được để lẫn text/token khác trong ô
   - Output của module này (file nhị phân) dùng cho module 3

3. Module 3: `Facebook Pages` → `Create a Post with Photos`
   - Kết nối Facebook account có quyền quản trị page Ven Hồ Hotel
   - Chọn đúng Facebook Page
   - Map field:
     - Message: **chỉ 1 chip** `facebook_caption` (từ Module 1) — xoá hết text/token khác nếu có sẵn trong ô
     - Photos → File: chọn output của Module 2 (`HTTP → Get a file`), KHÔNG map thẳng field `image_url` gốc

   ⚠️ Lỗi thường gặp khi setup: nếu ô Message hoặc URL đã có sẵn nội dung cũ (từ lúc test module riêng lẻ), kéo thêm chip mới vào chỉ **nối thêm** chứ không thay thế — phải bấm chọn hết (Cmd+A) và xoá trắng trước khi chèn chip đúng.

4. Chạy test:
   - Make: bấm `Run once`
   - GitHub: Actions → `Social Content Generator` → `Run workflow`
   - Nếu Make đăng đúng caption + đúng ảnh lên Facebook Page, bật scenario sang `ON`

Webhook payload gửi sang Make (JSON, `Content-Type: application/json`) gồm các field chính:

| Field | Ý nghĩa |
|-------|---------|
| `title` | Tiêu đề bài |
| `facebook_caption` | Caption để đăng Facebook |
| `instagram_caption` | Caption Instagram |
| `threads_caption` | Caption Threads |
| `pillar_name` | Content pillar |
| `topic_title` | Chủ đề |
| `image_url` | Link direct-download ảnh trên Google Drive (public) |
| `hashtags_all` | Mảng hashtag |

```bash
# Chạy local thủ công nếu cần:
python3 generate_content.py --force

# Gửi lại email local từ bài gần nhất:
python3 send_email.py
```

## Biến môi trường (.env)

```
OPENAI_API_KEY=sk-proj-...
GMAIL_SENDER=venhohotel@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
DRIVE_ROOT_FOLDER=VenHoSocialManager
```

## Ghi chú kỹ thuật quan trọng

- **gpt-5.5 là reasoning model**: tự quyết định token — KHÔNG set `max_completion_tokens` hay `response_format`
- **gpt-image-2**: trả về image data để lưu local, tránh phụ thuộc URL expire nhanh
- **JSON parse**: có debug log 300 ký tự đầu raw response trước khi parse
- **Google Drive scope**: `drive.file` — chỉ thấy file do app tạo ra
- **OAuth flow**: `InstalledAppFlow.run_local_server()` → lưu `token.json` cho lần sau (chỉ cần chạy 1 lần local; GitHub Actions dùng lại `refresh_token` này qua secret, không tự chạy lại OAuth flow)
- **Folder Drive**: `ROOT_FOLDER/YYYY/MM/YYYY-MM-DD_topic/` — cùng cấu trúc với local
- **image.png trên Drive luôn ở quyền public** ("anyone with link can view") để Make.com tải được — các file còn lại (`meta.json`, `*.txt`) vẫn ở quyền riêng tư mặc định
- **Nếu đổi Google account cho Drive**: chạy lại `python3 google_drive.py` local để tạo `token.json` mới, rồi `gh secret set GOOGLE_DRIVE_TOKEN_JSON < token.json` để cập nhật secret
- **Bảo mật**: `token.json`, `credentials.json`, `.env` đều trong `.gitignore`

## Nền tảng

| Kênh | Trạng thái |
|------|-----------|
| Facebook | facebook.com/venhohotelhanoi |
| Instagram | @venhohotel |
| Zalo OA | Chưa có |
