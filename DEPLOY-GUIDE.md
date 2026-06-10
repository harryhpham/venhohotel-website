# Hướng Dẫn Deploy Vercel & Quy Trình Content Hàng Tuần

---

## PHẦN 1 — DEPLOY LÊN VERCEL (Lần đầu ~10 phút)

### Bước 1: Tạo tài khoản GitHub
1. Truy cập **github.com** → Sign up (miễn phí)
2. Tạo repository mới: **New repository** → tên: `venhohotel-website` → Public → Create

### Bước 2: Push code lên GitHub
Mở **Windows Terminal** trong thư mục dự án:
```bash
cd "E:\Claude-Workspace\projects\Ven Ho Hotel"
git init
git add .
git commit -m "Initial commit: Ven Ho Hotel website"
git remote add origin https://github.com/TEN_GITHUB_CUA_BAN/venhohotel-website.git
git push -u origin main
```

### Bước 3: Deploy lên Vercel
1. Truy cập **vercel.com** → Sign up bằng tài khoản GitHub
2. Click **Add New Project**
3. Chọn repository `venhohotel-website` → **Import**
4. Framework: **Next.js** (tự nhận diện)
5. Click **Deploy** → Chờ ~2 phút

✅ Website sẽ có địa chỉ dạng: `venhohotel-website.vercel.app`

### Bước 4: Thêm Environment Variables (BẮT BUỘC)
Trước khi deploy, vào Vercel → Project → **Settings** → **Environment Variables**:

| Name | Value | Environment |
|------|-------|-------------|
| `RESEND_API_KEY` | `re_xxxxxxxxxx` (lấy từ resend.com) | ✅ Production |

> ⚠️ Nếu thiếu `RESEND_API_KEY`, form đặt phòng sẽ trả lỗi "Cấu hình email chưa sẵn sàng".
> Sau khi thêm env var phải **Redeploy** để Vercel load lại.

### Bước 5: Gán domain riêng
1. Vercel Dashboard → Project → **Settings** → **Domains**
2. Nhập `venhohotel.com` → Add
3. Cập nhật DNS tại nhà đăng ký domain (VinaHost) theo hướng dẫn Vercel

---

## PHẦN 2 — QUY TRÌNH UPDATE CONTENT HÀNG TUẦN

### Mỗi thứ Hai — 3 bước đơn giản:

#### Bước 1: Mở file content (2 phút)
Mở file: `E:\Claude-Workspace\projects\Ven Ho Hotel\src\lib\data\content.ts`

Tìm phần `weeklyContent` ở cuối file, cập nhật:

```typescript
export const weeklyContent = {
  // Tiêu đề bài viết tuần này
  title: "Chủ đề tuần này...",

  // Nội dung cho website (section Trải Nghiệm Hồ Tây)
  websiteBody: "Viết 1-2 câu về Hồ Tây theo mùa hoặc dịp đặc biệt...",

  // Caption cho Facebook (ngắn gọn, có emoji)
  facebookCaption: "Caption hấp dẫn cho Facebook... 👇",

  // Hashtags
  hashtags: "#VenHoHotel #HoTay #HaNoi ...",

  // Ảnh đại diện (đường dẫn ảnh đã có trong public/images/)
  featuredImage: "/images/Lake-view/lake-view-1.jpg",

  publishDate: "2026-06-09",
};
```

#### Bước 2: Build & Deploy (3 phút)
```bash
cd "E:\Claude-Workspace\projects\Ven Ho Hotel"
git add src/lib/data/content.ts
git commit -m "Content tuần: [Chủ đề tuần này]"
git push
```
→ Vercel **tự động** deploy lại sau khi push (~1 phút)

#### Bước 3: Đăng Facebook (5 phút)
Dùng nội dung từ `facebookCaption` + ảnh từ Canva:
1. Mở **Facebook Page** Ven Hồ Hotel
2. Tạo bài viết mới → Dán caption → Upload ảnh từ Canva
3. Thêm hashtags → Đăng

---

## PHẦN 3 — QUY TRÌNH TẠO ẢNH CANVA

### Template đề xuất cho Facebook/Instagram:
- **Kích thước:** 1080×1080px (vuông) hoặc 1080×1350px (dọc)
- **Màu nền:** #1B2D4F (navy) hoặc #F7F4EF (kem)
- **Màu accent:** #C9A84C (vàng gold)
- **Font chữ:** Cormorant Garamond (tiêu đề) + DM Sans (nội dung)

### Các loại ảnh cần tạo hàng tuần:
1. **Ảnh phòng** — 1 ảnh phòng + text overlay "View Hồ Tây từ \$17/đêm"
2. **Ảnh Hồ Tây** — Ảnh cảnh đẹp + quote từ khách
3. **Story/Reel** — Video ngắn hoặc ảnh động

---

## PHẦN 4 — LỊCH NỘI DUNG ĐỀ XUẤT

| Tuần | Chủ đề           | Ảnh          | Kênh              |
|------|------------------|--------------|-------------------|
| 1    | View phòng đêm   | lake-view    | Web + Facebook    |
| 2    | Xe đạp Hồ Tây   | activity     | Web + Facebook    |
| 3    | Bình minh Hồ Tây | lake-sunset  | Web + Facebook    |
| 4    | Review khách     | exterior     | Web + Facebook    |

---

## PHẦN 5 — CHECKLIST TRƯỚC KHI DEPLOY

- [x] Build thành công: `npm run build` không có lỗi
- [x] 14/14 trang được generate (bao gồm `/api/booking`)
- [x] Tiếng Việt đầy đủ dấu
- [x] Ảnh phòng hiển thị đúng
- [x] Mobile responsive
- [x] Language switcher VI/EN
- [x] Facebook button hoạt động
- [x] Form liên hệ hoạt động
- [x] `RESEND_API_KEY` đã thêm vào Vercel Environment Variables
- [x] Email gửi thành công từ `no-reply@venhohotel.com`
- [ ] Google Analytics GA4
- [ ] Agoda / Booking.com deep link

---

---

## PHẦN 6 — LƯU Ý KỸ THUẬT (RÚT RA TỪ THỰC TẾ)

### Node.js version
`resend@6+` yêu cầu **Node ≥ 20**. Vercel mặc định Node 18 → build sẽ fail.
`package.json` đã khai báo `"engines": { "node": ">=20" }` để fix.

### API route & try-catch
Mọi khởi tạo SDK (Resend, v.v.) phải nằm **trong** `try-catch` của handler.
Nếu nằm ngoài và throw, Vercel trả HTML 500 thay vì JSON → frontend không parse được.

### Sau khi thêm env var trên Vercel
Phải nhấn **Redeploy** thủ công để deployment mới load env var.
Chỉ push code mới không đủ nếu env var vừa được thêm lần đầu.

---

*Cập nhật lần cuối: 10/06/2026*
