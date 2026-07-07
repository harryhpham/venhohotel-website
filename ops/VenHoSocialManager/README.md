# VenHoSocialManager

AI pipeline tự động tạo caption + ảnh + gửi email, chạy bằng GitHub Actions T2/T4/T6 lúc 8AM Việt Nam.

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
Gửi email HTML → hpham1504@gmail.com
  (ảnh AI nhúng inline trong email)
        ↓
Commit rotation state + caption/meta text vào repo
  (không commit image.png để tránh repo phình to)
```

## Files chính

| File | Vai trò |
|------|---------|
| `generate_content.py` | Entry point — toàn bộ pipeline |
| `google_drive.py` | OAuth + upload Drive khi chạy local; GitHub Actions đang skip Drive |
| `send_email.py` | Build HTML + gửi Gmail SMTP SSL 465 |
| `pillars.json` | 5 pillars, 40 topics, 20-slot rotation |
| `config.json` | Models, hotel info, email config |
| `.env` | API keys (không commit) |
| `token.json` | OAuth token Drive (không commit) |
| `credentials.json` | OAuth client Drive (không commit) |

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
- Google Drive được skip bằng `SKIP_GOOGLE_DRIVE=1`
- Email có ảnh inline; repo commit lại rotation/index/caption text/meta
- Chạy thủ công: GitHub → Actions → Social Content Generator → Run workflow

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
- **OAuth flow**: `InstalledAppFlow.run_local_server()` → lưu `token.json` cho lần sau
- **Folder Drive**: `ROOT_FOLDER/YYYY/MM/YYYY-MM-DD_topic/` — cùng cấu trúc với local
- **Bảo mật**: `token.json`, `credentials.json`, `.env` đều trong `.gitignore`

## Nền tảng

| Kênh | Trạng thái |
|------|-----------|
| Facebook | facebook.com/venhohotelhanoi |
| Instagram | @venhohotel |
| Zalo OA | Chưa có |
