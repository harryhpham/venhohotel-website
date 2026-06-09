# Ven Hồ Hotel — CLAUDE.md

Tài liệu hướng dẫn cho Claude Code khi làm việc với project này.

---

## Thông tin dự án

**Chủ dự án:** Harry Pham (hpham1504@gmail.com)  
**Project:** Website khách sạn Ven Hồ Hotel — Next.js 14  
**Thư mục:** `E:\Claude-Workspace\projects\Ven Ho Hotel`

---

## Quy tắc làm việc

- **Hỏi trước khi làm** — luôn đặt câu hỏi làm rõ, đưa ra plan ngắn trước khi thực thi
- **Không xóa file** nếu không được Harry cho phép rõ ràng
- **Output mặc định:** `.docx` cho tài liệu
- **Ngôn ngữ:** Trả lời bằng tiếng Việt trừ khi được yêu cầu khác

---

## Tech Stack

| Thành phần   | Chi tiết                      |
|--------------|-------------------------------|
| Framework    | Next.js 14 (App Router)       |
| Language     | TypeScript                    |
| Styling      | Tailwind CSS v3               |
| Node         | >= 18                         |
| Package mgr  | npm                           |

### Màu sắc thương hiệu
```
Gold:        #C9A84C  → Accent, CTA, highlights
Deep Navy:   #1B2D4F  → Sections tối, footer
Warm White:  #F7F4EF  → Nền trang
Cream:       #EDE8E0  → Sections xen kẽ
Charcoal:    #1A1A1A  → Text chính
```

### Font
- **Display:** Cormorant Garamond
- **Body:** DM Sans

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── page.tsx                    ← Trang chủ
│   ├── layout.tsx                  ← Root layout (font, metadata)
│   ├── globals.css
│   ├── phong/
│   │   ├── page.tsx                ← Danh sách phòng
│   │   └── [slug]/page.tsx         ← Chi tiết phòng
│   ├── ve-chung-toi/page.tsx       ← Giới thiệu
│   ├── tien-ich/page.tsx           ← Tiện ích & Dịch vụ
│   ├── vi-tri/page.tsx             ← Vị trí & Đường đi
│   └── lien-he/page.tsx            ← Liên hệ & Đặt phòng
├── components/
│   ├── sections/                   ← Section components của homepage
│   │   ├── Hero.tsx
│   │   ├── StatsStrip.tsx
│   │   ├── FeaturedRooms.tsx
│   │   ├── WestLakeSection.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── NearbySection.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── LocationBlock.tsx
│   │   └── RoomDetailClient.tsx    ← Gallery + slideshow logic
│   └── ui/
│       ├── Navbar.tsx
│       └── Footer.tsx
└── lib/
    ├── context/
    │   └── LangContext.tsx          ← Language switcher VI/EN
    └── data/
        ├── content.ts               ← ⭐ Chỉnh text website (VI/EN)
        └── rooms.ts                 ← ⭐ Thông tin phòng & đường dẫn ảnh
```

### Ảnh
```
public/images/
├── Deluxe-double/     deluxe-double-1.JPG, -2.JPG, -3.JPG
├── Lake-view/         lake-view-1.jpg … lake-view-9.JPG
├── Standard-triple/   standard-triple-1.jpg … -4.JPG
├── Bathroom/          bathroom-1.JPG, -2.JPG
└── Exterior/          exterior-2.jpg, -3.jpg, -4.jpg, -5.jpg
```

---

## Thông tin khách sạn

| Trường       | Thông tin                                       |
|--------------|-------------------------------------------------|
| Tên          | Ven Hồ Hotel                                    |
| Tagline (VI) | Nơi Hồ Tây Gặp Gỡ Sự Tinh Tế                  |
| Tagline (EN) | Where West Lake Meets Elegance                  |
| Địa chỉ      | 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội            |
| Điện thoại   | 024 3847 4646                                   |
| Facebook     | https://www.facebook.com/venhohotel             |
| Website      | https://venhohotel.com                          |
| Số phòng     | 12 phòng                                        |
| Agoda        | 8.5/10 tổng thể · 9.2/10 vị trí (45 reviews)   |

### Loại phòng
| Phòng                         | Slug               | Diện tích | Giường      | Giá từ       |
|-------------------------------|--------------------|-----------|-------------|--------------|
| Phòng Deluxe Đôi              | deluxe-double      | 18 m²     | 1 Queen     | 412,500đ/đêm |
| Phòng Đôi View Hồ Tây         | double-lake-view   | 16 m²     | 1 Queen     | Liên hệ      |
| Phòng Tiêu Chuẩn Ba Người     | standard-triple    | 18 m²     | 1Đơn + 1Đôi | Liên hệ      |

### Check-in / Check-out
- Check-in: 12:00 PM — 20:00 PM
- Check-out: 06:00 AM — 12:00 PM
- Trẻ em dưới 9 tuổi: miễn phí (giường hiện có)

---

## Commands

```bash
# Chạy development server
npm run dev
# → http://localhost:3000

# Build production (static export)
npm run build

# Xem static build
npx serve out

# Lint
npm run lint
```

---

## Cách chỉnh sửa nội dung

**Text website (VI/EN):**
```
src/lib/data/content.ts
```

**Thông tin phòng & ảnh:**
```
src/lib/data/rooms.ts
```

**Thêm ảnh mới:**
1. Copy ảnh vào `public/images/[Tên-folder]/`
2. Cập nhật đường dẫn trong `src/lib/data/rooms.ts`
3. Chạy lại `npm run build`

---

## Kế hoạch tiếp theo

- [ ] Deploy lên Vercel — domain `venhohotel.vn`
- [x] Kết nối form đặt phòng với email (Resend) — hoàn thành 09/06/2026
- [ ] Phân tích đối thủ cạnh tranh khu vực Tây Hồ
- [ ] Xây dựng content & lịch đăng Social Media (Facebook, Instagram, Zalo OA)
- [ ] Phát triển AI Agent quản lý doanh thu hàng ngày
- [ ] Thêm Google Analytics
- [ ] Tích hợp Booking.com / Agoda deep link
- [ ] Tạo tài khoản Instagram, Zalo OA

---

## Lịch sử phát triển

| Ngày       | Milestone                                              |
|------------|--------------------------------------------------------|
| 04/06/2026 | Website 7 trang hoàn chỉnh, build clean               |
|            | VI/EN language switcher                                |
|            | Gallery + lightbox + auto-slideshow 10s                |
|            | Mobile responsive, SEO metadata, JSON-LD schema        |
| 09/06/2026 | Kết nối form đặt phòng với email (Resend)              |
|            | API route POST /api/booking với HTML email template    |
|            | Loading state, error handling tiếng Việt               |
|            | Push lên GitHub (harryhpham/venhohotel-website)        |
|            | Deploy thành công lên Vercel — venhohotel.com          |

---

## Phần 3: Form Đặt Phòng & Email (Resend)

> Kết nối form với email + deploy lên Vercel.

### Thư mục làm việc
`Ven Ho Hotel/Form email/` — xem `notes.md` để biết chi tiết đầy đủ.

### Checklist

- [x] Đăng ký / đăng nhập tài khoản Vercel
- [x] Import repo `harryhpham/venhohotel-website` từ GitHub
- [x] Thêm Environment Variable `RESEND_API_KEY` trong Vercel dashboard
- [x] Deploy thành công — **venhohotel.com**
- [ ] Test form đặt phòng trên production (gửi thử và kiểm tra email)

### Việc còn lại sau deploy

- [ ] Verify domain `venhohotel.com` trong Resend → thay `from` trong `src/app/api/booking/route.ts`:
  - Hiện tại: `onboarding@resend.dev`
  - Mục tiêu: `no-reply@venhohotel.com`
- [ ] Cập nhật `from` email → `no-reply@venhohotel.com` sau khi Resend verify xong
- [ ] Thêm Google Analytics (GA4)
- [ ] Tích hợp Booking.com / Agoda deep link

---

## Phần 4: Social Media Content & Lịch Đăng

> Xây dựng hiện diện thương hiệu trên Facebook, Instagram, Zalo OA.

### Thư mục làm việc
`Ven Ho Hotel/Social Media content/`

### Phạm vi công việc

- [x] Xác định kênh ưu tiên: Facebook · Instagram · Zalo OA
- [x] Xây dựng content pillars — `content-pillars.md`
- [x] Soạn lịch đăng tháng 7/2026 — `lich-dang-thang-7-2026.md`
- [x] Viết caption mẫu + quy cách ảnh — `caption-mau.md`
- [ ] Hướng dẫn tạo tài khoản Instagram & Zalo OA
- [ ] Setup Meta Business Suite để lên lịch tự động

### Nền tảng & ưu tiên

| Kênh | Trạng thái | Ưu tiên |
|------|-----------|---------|
| Facebook | Đã có — facebook.com/venhohotel | Cao |
| Instagram | Chưa có | Trung bình |
| Zalo OA | Chưa có | Trung bình |

---

## Phần 5: Phân Tích Đối Thủ Cạnh Tranh

> Nghiên cứu thị trường khách sạn khu vực Tây Hồ, Hà Nội.

### Thư mục làm việc
`Ven Ho Hotel/Phan tich doi thu/`

### Phạm vi công việc

- [ ] Xác định danh sách đối thủ trực tiếp (cùng phân khúc, khu Tây Hồ)
- [ ] Phân tích: giá phòng, tiện ích, đánh giá khách hàng
- [ ] So sánh điểm mạnh/yếu của Ven Hồ so với đối thủ
- [ ] Đề xuất hướng định vị và cải thiện

---

## Phần 6: Google Analytics (GA4)

> Theo dõi lưu lượng và hành vi người dùng trên venhohotel.com.

### Thư mục làm việc
`Ven Ho Hotel/Google Analytics/`

### Phạm vi công việc

- [ ] Tạo tài khoản GA4 + property cho venhohotel.com
- [ ] Thêm GA4 Measurement ID vào Next.js (`src/app/layout.tsx`)
- [ ] Thiết lập conversion events (form submit, click điện thoại)
- [ ] Kiểm tra data đổ về dashboard

---

## Phần 7: Tích Hợp Agoda / Booking.com

> Thêm deep link đặt phòng trực tiếp qua OTA.

### Thư mục làm việc
`Ven Ho Hotel/Agoda/`

### Phạm vi công việc

- [ ] Lấy affiliate/deep link từ Agoda (trang khách sạn Ven Hồ)
- [ ] Lấy link từ Booking.com
- [ ] Thêm nút CTA "Đặt qua Agoda" / "Đặt qua Booking.com" vào trang phòng và trang liên hệ
- [ ] Đảm bảo link mở tab mới, có UTM tracking

---

## Phần 8: AI Agent Quản Lý Doanh Thu

> Xây dựng agent tự động hóa theo dõi và tối ưu doanh thu hàng ngày.

### Thư mục làm việc
`Ven Ho Hotel/AI Agent/`

### Phạm vi công việc

- [ ] Xác định nguồn dữ liệu (đặt phòng, OTA, email)
- [ ] Thiết kế luồng agent: thu thập → phân tích → báo cáo
- [ ] Xây dựng dashboard doanh thu tự động
- [ ] Tích hợp cảnh báo (Zalo/email) khi có biến động

