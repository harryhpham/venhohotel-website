# Phần 3: Kết Nối Form Đặt Phòng Với Email

## Tổng quan

Kết nối form đặt phòng trên website với email qua dịch vụ Resend.

## Những gì đã làm (09/06/2026)

### 1. API Route — Backend
- File: `src/app/api/booking/route.ts`
- POST `/api/booking` nhận dữ liệu form → gửi email HTML đến `venhohotel@gmail.com`
- Email template: thông tin khách, chi tiết đặt phòng, nút "Gọi Lại Cho Khách"
- Dịch vụ: Resend (resend.com) — free tier

### 2. Form Frontend
- File: `src/app/lien-he/page.tsx`
- `handleSubmit` async → fetch POST đến `/api/booking`
- Loading state: button hiện "Đang gửi..." + disabled
- Error state: thông báo lỗi tiếng Việt bên dưới button

### 3. Environment Variable
- File: `.env.local` (không commit lên git — đã có trong `.gitignore`)
- `RESEND_API_KEY=***` (lưu trong `.env.local` — không commit)
- Đã thêm vào Vercel dashboard để chạy trên production

### 4. Deploy
- Website live tại: https://venhohotel.com
- Repo: https://github.com/harryhpham/venhohotel-website

## Việc còn lại

- [x] Verify domain `venhohotel.com` trong Resend — **Verified 10/06/2026** ✅
- [x] Sau khi verify: đổi `from` trong `src/app/api/booking/route.ts`:
  - ~~Hiện tại: `onboarding@resend.dev`~~
  - Đã cập nhật: `no-reply@venhohotel.com` — deployed 10/06/2026

## Debug & Fix (10/06/2026 — sau khi verify domain)

### Vấn đề 1: Build Failed trên Vercel
- **Nguyên nhân:** `resend@6.12.4` yêu cầu Node ≥ 20, Vercel mặc định Node 18
- **Fix:** Thêm `"engines": { "node": ">=20" }` vào `package.json`
- **Commit:** `8744991`

### Vấn đề 2: "Lỗi kết nối" khi test form
- **Nguyên nhân:** `new Resend(...)` nằm ngoài `try-catch` → khi throw, Vercel trả HTML 500 → frontend không parse được JSON
- **Fix:** Move `new Resend()` vào trong `try`, thêm guard check `RESEND_API_KEY`
- **Commit:** `9bd5321`

### Vấn đề 3: "Cấu hình email chưa sẵn sàng"
- **Nguyên nhân:** `RESEND_API_KEY` bị mất trong Vercel Environment Variables
- **Fix:** Thêm lại trong Vercel → Settings → Environment Variables → Redeploy

## ✅ PHẦN 3 HOÀN THÀNH — 10/06/2026

## Tài khoản & dịch vụ liên quan

| Dịch vụ | Tài khoản | Ghi chú |
|---------|-----------|---------|
| Resend | venhohotel@gmail.com | API key trong `.env.local` |
| Vercel | — | Env var `RESEND_API_KEY` đã thêm |
| Vinahost.vn | venhohotel@gmail.com | DNS records đã thêm cho domain verify |
