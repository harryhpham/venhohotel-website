# Phần 10: Hệ Thống Tự Động Tạo Content Social Media

> AI tự tạo nội dung → gửi email → Harry duyệt → đăng thủ công.
> Chạy Thứ 2 / 4 / 6 lúc 10:00 sáng.

---

## Kiến trúc hệ thống

```
Task Scheduler (Thứ 2 / 4 / 6 — 10:00 sáng)
    ↓
content_generator.py
    ├── Xác định ngày → chọn Content Pillar
    │     Thứ 2: 🌅 Khám Phá Hồ Tây
    │     Thứ 4: 🍜 Ẩm Thực Hồ Tây
    │     Thứ 6: ⭐ Social Proof & Thương Hiệu
    ├── Chọn topic tiếp theo (xoay vòng, không lặp gần đây)
    ├── Gọi Claude API sinh:
    │     - Tiêu đề
    │     - Caption Facebook (150–200 từ)
    │     - Caption Instagram (70–100 từ)
    │     - Hashtag tổng hợp (20–25 cái)
    │     - Image Prompt Midjourney/DALL-E
    │     - Image Prompt Canva AI
    ├── Lưu vào Content Bank (.json + .md)
    └── Gửi email HTML đẹp → hpham1504@gmail.com
    ↓
Harry đọc email → tạo ảnh → đăng thủ công FB + IG
```

---

## Cấu trúc thư mục

```
Social Media Auto Post/
├── content_generator.py      ← Script chính (chạy tự động)
├── pillars.json              ← Định nghĩa 3 content pillar + topic rotation
├── config.json               ← Cài đặt khách sạn, email, Claude model
├── .env                      ← Credentials (KHÔNG commit GitHub)
├── .env.example              ← Template
├── run-generate.ps1          ← Runner cho Task Scheduler
├── setup-task-scheduler.ps1  ← Đăng ký Task Scheduler (chạy 1 lần)
├── setup.bat                 ← Cài thư viện Python (chạy 1 lần)
├── logs/                     ← Log tự động
└── content-bank/             ← Toàn bộ nội dung đã tạo
    ├── index.json            ← Index machine-readable
    ├── index.md              ← Bảng tổng hợp đọc được
    ├── 2026-07-02-kham_pha.json
    ├── 2026-07-02-kham_pha.md
    └── ...
```

---

## Content Pillars

| Ngày | Pillar | Mục tiêu |
|------|--------|---------|
| Thứ Hai | 🌅 Khám Phá Hồ Tây | Kéo người yêu Hồ Tây → quan tâm Ven Hồ Hotel |
| Thứ Tư | 🍜 Ẩm Thực Hồ Tây | Showcase văn hóa ẩm thực đặc sắc của khu vực |
| Thứ Sáu | ⭐ Social Proof & Thương Hiệu | Xây dựng uy tín, trust, kéo đặt phòng trực tiếp |

**Topics mỗi pillar:** 8 chủ đề xoay vòng → hết 8 tuần lại bắt đầu lại.
Xem chi tiết trong `pillars.json`.

---

## Checklist Thiết Lập (Làm 1 Lần)

### Bước 1 — Cài thư viện Python
- [ ] Double-click `setup.bat` → cài `anthropic`, `requests`, `python-dotenv`

### Bước 2 — Tạo file .env
- [ ] Copy `.env.example` → `.env`
- [ ] Điền `ANTHROPIC_API_KEY` (lấy tại console.anthropic.com)
- [ ] Điền `GMAIL_APP_PASSWORD` (xem hướng dẫn bên dưới)

### Bước 3 — Lấy Gmail App Password
1. Vào myaccount.google.com
2. Security → 2-Step Verification (phải bật trước)
3. App passwords → chọn "Mail" + "Windows Computer"
4. Copy mật khẩu 16 ký tự → điền vào `.env`

### Bước 4 — Test thủ công
- [ ] Mở PowerShell tại thư mục này
- [ ] Chạy: `python content_generator.py`
- [ ] Kiểm tra email tại hpham1504@gmail.com
- [ ] Kiểm tra file mới trong `content-bank/`

### Bước 5 — Đăng ký Task Scheduler
- [ ] Click chuột phải `setup-task-scheduler.ps1` → **Run as Administrator**
- [ ] Xác nhận task được tạo thành công

---

## Sau Khi Nhận Email

1. **Đọc caption** — chỉnh sửa nếu muốn (copy từ email)
2. **Tạo ảnh** bằng:
   - [Canva AI](https://canva.com) — dùng Image Prompt Canva
   - [DALL-E](https://chat.openai.com) — dùng Image Prompt Midjourney
   - Hoặc dùng ảnh thật của khách sạn trong `public/images/`
3. **Đăng thủ công**:
   - Facebook: facebook.com/venhohotelhanoi → Tạo bài viết
   - Instagram: @venhohotelhanoi → Tạo bài đăng
4. **Đánh dấu đã đăng** (tùy chọn): mở file `.json` trong `content-bank/`, đổi `"status"` → `"published"`

---

## Quản Lý Task Scheduler

```powershell
# Chạy thủ công ngay (test)
Start-ScheduledTask -TaskName "VenHo-SocialMedia"

# Xem trạng thái
Get-ScheduledTask -TaskName "VenHo-SocialMedia"

# Tạm tắt
Disable-ScheduledTask -TaskName "VenHo-SocialMedia"

# Bật lại
Enable-ScheduledTask -TaskName "VenHo-SocialMedia"
```

---

## Content Bank — Tài Sản Dài Hạn

- **Mỗi bài** tạo ra 2 file: `.json` (dữ liệu) + `.md` (đọc trực tiếp)
- **index.md**: Bảng tổng hợp toàn bộ content — dễ tìm kiếm
- **Dùng lại**: Caption và hashtag đã nghiên cứu — tái sử dụng thoải mái
- **Blog**: File `.md` có thể chuyển thành blog post cho website
- **3 lần/tuần × 52 tuần = 156 bài** → kho content khổng lồ sau 1 năm

---

## Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `AuthenticationError` | ANTHROPIC_API_KEY sai | Kiểm tra .env |
| `SMTPAuthenticationError` | Gmail App Password sai | Tạo lại App Password |
| `Hôm nay không phải Thứ 2/4/6` | Script chạy ngày sai | Bình thường — Task Scheduler chỉ kích hoạt đúng ngày |
| Email không đến | Kiểm tra spam | Thêm venhohotel@gmail.com vào danh bạ |

---

## File Cũ (Không Dùng Nữa)

Các file sau đây từ phiên bản cũ (cần Meta API) — có thể xóa:
- `post_generator.py` — thay bằng `content_generator.py`
- `post_publisher.py` — không cần (đăng thủ công)
- `publish.bat` — không cần
- `schedule.json` — thay bằng `pillars.json`
- `huong-dan-meta-app.md` — không cần nữa
