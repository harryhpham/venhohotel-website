# Ven Hồ Hotel — CLAUDE.md

Tài liệu hướng dẫn cho Claude Code khi làm việc với project này.

---

## Thông tin dự án

**Chủ dự án:** Harry Pham (hpham1504@gmail.com)  
**Project:** Website khách sạn Ven Hồ Hotel — Next.js 14  
**Thư mục:** `/Users/hanhpham/Developer/Claude-Workspace/projects/Ven Ho Hotel`

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
| Node         | v20.20.2 (cài qua Homebrew)   |
| Package mgr  | npm 10.8.2                    |
| OS           | macOS (Apple Silicon)         |

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
| Facebook     | https://www.facebook.com/venhohotelhanoi (Ven Hồ Hotel Hanoi) |
| Instagram    | https://www.instagram.com/venhohotel            |
| Email        | venhohotel@gmail.com                            |
| Website      | https://venhohotel.com                          |
| Số phòng     | 12 phòng                                        |
| Agoda        | 8.5/10 tổng thể · 9.2/10 vị trí (45 reviews)   |

### Loại phòng
| Phòng                         | Slug               | Diện tích | Giường      | Giá từ       |
|-------------------------------|--------------------|-----------|-------------|--------------|
| Phòng Deluxe Đôi              | deluxe-double      | 18 m²     | 1 Queen     | 400,000đ/đêm |
| Phòng Đôi View Hồ Tây         | double-lake-view   | 16 m²     | 1 Queen     | 600,000đ/đêm |
| Phòng Tiêu Chuẩn Ba Người     | standard-triple    | 18 m²     | 1Đơn + 1Đôi | 500,000đ/đêm |

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

- [x] Deploy lên Vercel — domain `venhohotel.com` — hoàn thành 09/06/2026
- [x] Kết nối form đặt phòng với email (Resend) — hoàn thành 09/06/2026
- [x] Phân tích đối thủ cạnh tranh khu vực Tây Hồ — hoàn thành 15/06/2026
- [ ] Xây dựng content & lịch đăng Social Media (Facebook, Instagram, Zalo OA)
- [x] Phát triển AI Agent quản lý doanh thu hàng ngày
- [x] Migration Windows → macOS — hoàn thành 19/06/2026
- [x] Thêm Google Analytics — hoàn thành 10/06/2026
- [ ] Tích hợp Booking.com / Agoda deep link
- [ ] Tạo tài khoản Instagram, Zalo OA
- [x] Phát triển SEO — robots.txt, sitemap.xml, JSON-LD schema, og:image, Twitter Card — hoàn thành 15/06/2026

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
| 10/06/2026 | **Phần 6 — Google Analytics GA4** hoàn thành ✅         |
|            | Measurement ID: G-4242ESCGY7                           |
|            | GoogleAnalytics component (`next/script afterInteractive`) |
|            | Conversion events: `generate_lead`, `phone_click`      |
|            | Deploy lên Vercel — DebugView xác nhận data đổ về     |
|            | Verify domain venhohotel.com trong Resend              |
|            | Đổi sender sang no-reply@venhohotel.com               |
|            | Test form production — email gửi thành công            |
|            | **Debug build failure:** resend@6 yêu cầu Node ≥20,  |
|            | Vercel mặc định Node 18 → thêm engines vào package.json |
|            | Fix Resend init nằm ngoài try-catch → move vào trong  |
|            | Fix RESEND_API_KEY bị mất trong Vercel env vars        |
|            | ✅ Phần 3 hoàn thành toàn bộ — form live & ổn định    |
| 15/06/2026 | **Phần 5 — Phân Tích Đối Thủ** hoàn thành ✅                   |
|            | 5 đối thủ trực tiếp khu Tây Hồ được phân tích (Đan Thanh sát vách) |
|            | Ven Hồ: Agoda 8.5 cao nhất phân khúc, duy nhất có website+booking  |
|            | Đề xuất định vị + 6 hành động ưu tiên Q3/2026                      |
|            | Lưu trong `Phan tich doi thu/notes.md`                             |
|            | Scheduled Agent tự động cập nhật mỗi Thứ Hai — gửi email báo cáo  |
| 15/06/2026 | **Phần 8 — AI Agent Doanh Thu** hoàn thành ✅           |
|            | Playwright scrape SkyHotel PMS → parse Excel → gửi email|
|            | cron job "VenHo-DailyRevenue" lúc 9:00 AM |
|            | Gmail SMTP (App Password) từ venhohotel@gmail.com        |
|            | CCR bị block egress admin1.skyhotel.vn → dùng local     |
| 19/06/2026 | **Migration Windows → macOS** hoàn thành ✅             |
|            | Homebrew + Node v20.20.2 + npm 10.8.2 đã cài           |
|            | Playwright + Chromium cài lại trên macOS               |
|            | 6 file Windows (.ps1, .bat) → 5 bash scripts (.sh)     |
|            | Cron job "VenHo-DailyRevenue" 9:00 AM chạy OK          |
|            | Terminal Full Disk Access đã cấp                       |
|            | Website localhost:3000 chạy OK trên macOS              |
|            | CLAUDE.md + DEPLOY-GUIDE.md cập nhật đường dẫn macOS  |
| 15/06/2026 | **Phần 9 — SEO** hoàn thành ✅                          |
|            | `robots.ts` → `/robots.txt` (allow all + sitemap link) |
|            | `sitemap.ts` → `/sitemap.xml` (9 URLs, priority đúng)  |
|            | `JsonLd.tsx` — reusable Server Component               |
|            | Hotel JSON-LD schema trên homepage (rating 8.5, geo...) |
|            | HotelRoom JSON-LD + BreadcrumbList trên 3 trang phòng  |
|            | BreadcrumbList JSON-LD trên 5 trang con còn lại        |
|            | Root layout: metadataBase, og:image, Twitter Card      |
|            | Refactor `/lien-he` → Server Component + metadata      |
|            | Cập nhật title template + og:image tất cả trang con    |
|            | Build 16/16 trang pass sạch, không warning             |

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
- [x] Test form đặt phòng trên production — form hoạt động, email gửi thành công

### Việc còn lại sau deploy

- [x] Verify domain `venhohotel.com` trong Resend — **Verified 10/06/2026**
- [x] Cập nhật `from` email → `no-reply@venhohotel.com` — đã deploy
- [x] Fix build: thêm `"engines": {"node": ">=20"}` vào `package.json`
- [x] Fix runtime: move `new Resend()` vào trong `try-catch`
- [x] Fix env: thêm lại `RESEND_API_KEY` vào Vercel dashboard
- [x] Test lần cuối — **form hoạt động hoàn toàn 10/06/2026** ✅

### Ghi chú kỹ thuật quan trọng

- `resend@6+` yêu cầu **Node ≥ 20** — Vercel mặc định Node 18, phải khai báo `engines`
- `RESEND_API_KEY` phải được thêm thủ công trong **Vercel → Settings → Environment Variables**
- Sau khi thêm env var, phải **Redeploy** để Vercel load lại

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
- [x] Instagram (@venhohotel) và Facebook (facebook.com/venhohotel) đã có
- [x] Hướng dẫn tạo Zalo OA — xem `zalo-oa-huong-dan.md`
- [x] Setup Meta Business Suite — xem `meta-business-suite.md`

### Nền tảng & ưu tiên

| Kênh | Trạng thái | Ưu tiên |
|------|-----------|---------|
| Facebook | Đã có — facebook.com/venhohotel | Cao |
| Instagram | Đã có — @venhohotel | Cao |
| Zalo OA | Chưa có | Trung bình |

---

## Phần 5: Phân Tích Đối Thủ Cạnh Tranh

> Nghiên cứu thị trường khách sạn khu vực Tây Hồ, Hà Nội.

### Thư mục làm việc
`Ven Ho Hotel/Phan tich doi thu/`

### Phạm vi công việc

- [x] Xác định danh sách đối thủ trực tiếp (cùng phân khúc, khu Tây Hồ)
- [x] Phân tích: giá phòng, tiện ích, đánh giá khách hàng
- [x] So sánh điểm mạnh/yếu của Ven Hồ so với đối thủ
- [x] Đề xuất hướng định vị và cải thiện
- [x] Tạo Scheduled Agent cập nhật đối thủ hàng tuần — hoàn thành 15/06/2026

### Scheduled Agent — Theo Dõi Đối Thủ Tự Động

| Thông tin | Chi tiết |
|-----------|----------|
| Routine ID | `trig_01HhEDr4CRLV1Krf32A1o3AG` |
| Lịch chạy | Mỗi **Thứ Hai 9:00 sáng** (Bangkok / UTC+7) |
| Đầu ra | Email → hpham1504@gmail.com |
| Model | claude-sonnet-4-6 |
| Connector | Gmail ✅ |
| Quản lý | https://claude.ai/code/routines/trig_01HhEDr4CRLV1Krf32A1o3AG |

**Nội dung email hàng tuần:**
- Tóm tắt 3–5 điểm nổi bật thay đổi trong tuần
- Bảng giá & rating của 8 đối thủ so với Ven Hồ
- Vị trí Ven Hồ trên thị trường
- 1–2 hành động cụ thể để giữ lợi thế

---

## Phần 6: Google Analytics (GA4)

> Theo dõi lưu lượng và hành vi người dùng trên venhohotel.com.

### Thư mục làm việc
`Ven Ho Hotel/Google Analytics/`

### Phạm vi công việc

- [x] Tạo tài khoản GA4 + property cho venhohotel.com — Measurement ID: `G-4242ESCGY7`
- [x] Thêm GA4 Measurement ID vào Next.js (`src/app/layout.tsx`) — qua `GoogleAnalytics.tsx`
- [x] Thiết lập conversion events — `generate_lead` (form submit), `phone_click` (click SĐT)
- [x] Kiểm tra data đổ về dashboard — DebugView nhận events 10/06/2026 ✅

### Ghi chú kỹ thuật

- `src/components/ui/GoogleAnalytics.tsx` — load script GA4 bằng `next/script` strategy `afterInteractive`
- Conversion events fire trong `src/app/lien-he/page.tsx`:
  - `generate_lead` — sau khi form submit thành công (kèm `room_type`)
  - `phone_click` — khi click số điện thoại trong trang liên hệ

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

## Phần 8: AI Agent Quản Lý Doanh Thu ✅

> Xây dựng agent tự động hóa theo dõi và tối ưu doanh thu hàng ngày.

### Thư mục làm việc
`Ven Ho Hotel/AI Agent/`

### Phạm vi công việc

- [x] Xác định nguồn dữ liệu: SkyHotel PMS (admin1.skyhotel.vn) — chính xác nhất
- [x] Discovery selectors SkyHotel bằng Playwright headless (login, menu, date picker, export)
- [x] Viết `skyhotel-scraper.py` — login → export Excel → parse → format + gửi email
- [x] Xây dựng hướng dẫn Google Sheets Dashboard + Looker Studio
- [x] Chuyển sang cron job local (CCR bị block egress đến admin1.skyhotel.vn)
- [x] Viết `run-daily-report.sh` — runner script với credentials
- [x] Đăng ký cron job "VenHo-DailyRevenue" — chạy 9:00 AM hàng ngày

### macOS Cron Job — Báo Cáo Doanh Thu Hàng Ngày

> **Lý do không dùng Claude CCR:** `admin1.skyhotel.vn` bị block bởi network egress policy của cloud environment Anthropic.

| Thông tin | Chi tiết |
|-----------|----------|
| Job name | `VenHo-DailyRevenue` |
| Script | `AI Agent/run-daily-report.sh` |
| Lịch chạy | Mỗi ngày **9:00 sáng** (giờ máy Harry) |
| Đầu ra | Email → venhohotel@gmail.com |
| Gửi qua | Gmail SMTP (smtplib, App Password) |

**Luồng kỹ thuật:**
1. Playwright headless login `admin1.skyhotel.vn` (user: koibito)
2. Navigate menu Doanh thu → Doanh thu hóa đơn
3. Fill date picker ngày hôm qua → click OK → đợi AJAX
4. Click "Xuất File" (`#export_revenue_v1`) → download Excel
5. Parse Excel (openpyxl): tổng doanh thu, tiền phòng, DV, hình thức TT, top phòng
6. Gửi email qua Gmail SMTP (smtplib SSL port 465, App Password)

**Quản lý cron job:**
```bash
# Xem danh sách cron jobs
crontab -l

# Chỉnh sửa cron (thêm/đổi giờ)
crontab -e

# Entry cron cho báo cáo doanh thu (9:00 AM hàng ngày):
# 0 9 * * * cd "/Users/hanhpham/Developer/Claude-Workspace/projects/Ven Ho Hotel/AI Agent" && bash run-daily-report.sh

# Chạy thủ công ngay
bash "/Users/hanhpham/Developer/Claude-Workspace/projects/Ven Ho Hotel/AI Agent/run-daily-report.sh"
```

**Selectors SkyHotel (đã xác nhận):**
- Login: `#txt_username`, `#txt_password`, `#cmd_login`
- Date picker: `#date_begin`, `#date_end`, `#fancyConfirmdate_edit`
- Export: `#export_revenue_v1` (hoặc `#export_revenue_v2`)
- Menu: accordion jQuery UI, hash `#revenue_invoices`

**Excel format:** Row 0–6 = header info, Row 7 = column labels, Row 8+ = data
- Col 0: STT (string), Col 2: Phòng, Col 7: Tiền phòng, Col 8: DV, Col 11: Tổng cộng, Col 16: HTTT

### Google Sheets Dashboard

- Xem hướng dẫn đầy đủ: `AI Agent/sheets-guide.md`
- Kết nối Looker Studio để xem dashboard trực quan

---

## Phần 9: SEO

> Cải thiện khả năng xuất hiện trên Google và chất lượng preview khi share link mạng xã hội.

### Thư mục làm việc
`Ven Ho Hotel/SEO/`

### Phạm vi công việc

- [x] Tạo `robots.txt` (tự động qua `src/app/robots.ts`)
- [x] Tạo `sitemap.xml` với 9 URL (6 tĩnh + 3 trang phòng)
- [x] Tạo `src/components/seo/JsonLd.tsx` — component dùng chung cho JSON-LD
- [x] Thêm Hotel JSON-LD schema vào homepage (name, address, geo, rating, amenities)
- [x] Thêm HotelRoom JSON-LD vào từng trang phòng chi tiết
- [x] Thêm BreadcrumbList JSON-LD vào tất cả trang con
- [x] Cập nhật root layout: `metadataBase`, `og:image`, Twitter Card, `title.template`
- [x] Refactor `lien-he/page.tsx` → Server Component để xuất metadata
- [x] Cập nhật metadata (title, og:image) cho 5 trang con

### Ghi chú kỹ thuật

- Xem `SEO/notes.md` để biết chi tiết đầy đủ
- `metadataBase` bắt buộc phải set để Vercel resolve relative URL trong `og:image`
- hreflang: chỉ khai báo `x-default` + `vi` (không có URL riêng cho EN)
- JSON-LD dùng `@id: "https://venhohotel.com/#hotel"` để liên kết Hotel ↔ HotelRoom schema

