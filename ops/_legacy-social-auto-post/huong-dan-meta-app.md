# Hướng Dẫn Lấy Credentials Meta API

> Làm một lần duy nhất. Mất khoảng 15–20 phút.

---

## Bước 1 — Tạo Facebook App

1. Truy cập: **https://developers.facebook.com/apps**
2. Nhấn **"Create App"**
3. Chọn Use case: **"Other"** → Next
4. App type: **"Business"** → Next
5. Điền:
   - App name: `VenHo Social Manager`
   - App contact email: `venhohotel@gmail.com`
6. Nhấn **"Create App"**

---

## Bước 2 — Thêm sản phẩm Instagram Graph API

1. Trong dashboard App, tìm mục **"Add Products"**
2. Tìm **"Instagram Graph API"** → nhấn **"Set Up"**

---

## Bước 3 — Lấy Page Access Token (Facebook)

### 3a. Vào Graph API Explorer
1. Truy cập: **https://developers.facebook.com/tools/explorer/**
2. Góc trên phải, chọn App vừa tạo: `VenHo Social Manager`

### 3b. Chọn permissions
Nhấn **"Add a Permission"** và thêm các quyền sau:
- `pages_manage_posts`
- `pages_read_engagement`
- `instagram_content_publish`
- `instagram_basic`

### 3c. Generate token
1. Nhấn **"Generate Access Token"**
2. Đăng nhập Facebook cá nhân của Harry
3. Chọn **Facebook Page: Ven Hồ Hotel Hanoi**
4. Cấp tất cả quyền được yêu cầu
5. Copy token hiện ra (dài ~200 ký tự) — đây là **Short-lived token**

### 3d. Đổi sang Long-lived token (hết hạn sau 60 ngày)
Gọi API sau trong Graph API Explorer:

```
GET /oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={APP_ID}
  &client_secret={APP_SECRET}
  &fb_exchange_token={SHORT_LIVED_TOKEN}
```

- `APP_ID` và `APP_SECRET` lấy từ: App Dashboard → Settings → Basic
- Copy **Long-lived token** từ kết quả

### 3e. Lấy Page Access Token
Gọi:
```
GET /me/accounts
  ?access_token={LONG_LIVED_USER_TOKEN}
```

Trong kết quả, tìm page "Ven Hồ Hotel Hanoi" → copy **access_token** của page đó.

> Đây là `FB_ACCESS_TOKEN` cần điền vào `.env`

---

## Bước 4 — Lấy Facebook Page ID

Gọi:
```
GET /me/accounts
  ?access_token={FB_ACCESS_TOKEN}
```

Tìm page "Ven Hồ Hotel Hanoi" → copy **id** (dãy số ~15 chữ số).

> Đây là `FB_PAGE_ID` cần điền vào `.env`

---

## Bước 5 — Lấy Instagram Business Account ID

Gọi:
```
GET /{FB_PAGE_ID}?fields=instagram_business_account&access_token={FB_ACCESS_TOKEN}
```

Kết quả trả về dạng:
```json
{
  "instagram_business_account": {
    "id": "17841412345678"
  }
}
```

> Đây là `IG_USER_ID` cần điền vào `.env`

---

## Bước 6 — Điền vào file .env

```
Mở file: Social Media Auto Post\.env
```

Điền:
```
ANTHROPIC_API_KEY=sk-ant-...         ← lấy từ console.anthropic.com
FB_PAGE_ID=123456789012345           ← số ID từ Bước 4
FB_ACCESS_TOKEN=EAAxxxxx...          ← token từ Bước 3e
IG_USER_ID=17841412345678            ← ID từ Bước 5
GMAIL_SENDER=venhohotel@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx  ← App Password Gmail (như revenue agent)
```

---

## Bước 7 — Cài đặt và test

1. Double-click **`setup.bat`** → cài thư viện Python
2. Chạy test generator thủ công:
   ```
   python post_generator.py
   ```
3. Kiểm tra email tại hpham1504@gmail.com
4. Kiểm tra file xuất hiện trong thư mục `pending/`

---

## Bước 8 — Đăng ký Task Scheduler

Chạy lệnh PowerShell sau (chạy 1 lần):

```powershell
$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NonInteractive -File `"E:\Claude-Workspace\projects\Ven Ho Hotel\Social Media Auto Post\run-generate.ps1`""

$trigger = New-ScheduledTaskTrigger `
    -Weekly `
    -DaysOfWeek Monday `
    -At "10:00AM"

Register-ScheduledTask `
    -TaskName "VenHo-SocialMedia" `
    -Action $action `
    -Trigger $trigger `
    -Description "Sinh content Social Media Ven Ho Hotel moi Thu Hai 10AM" `
    -RunLevel Highest
```

Kiểm tra:
```powershell
Get-ScheduledTask -TaskName "VenHo-SocialMedia"
```

---

## Lịch gia hạn Token (quan trọng!)

Facebook Access Token hết hạn sau **60 ngày**. Đặt nhắc nhở:

| Tạo lần | Hết hạn | Gia hạn trước |
|---------|---------|--------------|
| 18/06/2026 | 17/08/2026 | 10/08/2026 |

**Cách gia hạn:** Lặp lại Bước 3d–3e, cập nhật `FB_ACCESS_TOKEN` trong file `.env`.

---

## Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `OAuthException: Invalid OAuth` | Token hết hạn | Gia hạn token (Bước 3d) |
| `IGApiException: Media not found` | Ảnh URL không public | Kiểm tra URL ảnh truy cập được |
| `SMTPAuthenticationError` | Gmail App Password sai | Tạo lại App Password |
| `No schedule entry found` | Tuần này không có trong schedule.json | Thêm entry vào schedule.json |
