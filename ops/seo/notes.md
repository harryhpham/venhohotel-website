# SEO — Ven Hồ Hotel

> Hoàn thành: 15/06/2026

---

## Mục tiêu

Cải thiện khả năng xuất hiện của venhohotel.com trên Google và tăng chất lượng preview khi share link qua mạng xã hội (Facebook, Zalo, Telegram).

---

## Những gì còn thiếu (so với codebase hiện tại)

| Vấn đề | Ảnh hưởng |
|--------|-----------|
| Không có `robots.txt` | Google crawl không biết sitemap ở đâu |
| Không có `sitemap.xml` | 9 URL chưa được khai báo chủ động với Google |
| Không có `og:image` | Share link lên Facebook/Zalo không có ảnh preview |
| Không có JSON-LD | Google không hiển thị rating 8.5/10 và địa chỉ trong search results |
| `/lien-he` là `"use client"` | Không xuất được `metadata` → title mặc định từ layout |
| Không có Twitter Card | Link share trên Twitter/X không có ảnh |
| `metadataBase` chưa set | Vercel không resolve được relative URL trong og:image |

---

## Checklist Thực Hiện

### Phase 1 — File mới (zero risk)
- [x] Tạo `src/app/robots.ts`
- [x] Tạo `src/app/sitemap.ts` (9 URLs: 6 tĩnh + 3 phòng)
- [x] Tạo `src/components/seo/JsonLd.tsx` (reusable component)

### Phase 2 — Root Layout
- [x] Sửa `src/app/layout.tsx`: thêm `metadataBase`, `og:image`, `twitter`, `title.template`, `alternates`

### Phase 3 — JSON-LD Structured Data
- [x] Homepage (`src/app/page.tsx`): thêm Hotel schema (name, address, geo, rating, amenities)
- [x] Room detail (`src/app/phong/[slug]/page.tsx`): thêm HotelRoom schema + BreadcrumbList
- [x] Các trang còn lại: thêm BreadcrumbList JSON-LD (phong, ve-chung-toi, tien-ich, vi-tri)

### Phase 4 — Refactor Trang Liên Hệ
- [x] Tạo `src/components/sections/ContactClient.tsx` (tách form ra khỏi page)
- [x] Viết lại `src/app/lien-he/page.tsx` thành Server Component + export metadata

### Phase 5 — Metadata các trang con
- [x] Cập nhật title 5 trang (bỏ suffix vì đã có title.template)
- [x] Thêm `og:image` phù hợp cho từng trang

---

## Files Sẽ Thay Đổi

| File | Hành động |
|------|-----------|
| `src/app/robots.ts` | TẠO MỚI |
| `src/app/sitemap.ts` | TẠO MỚI |
| `src/components/seo/JsonLd.tsx` | TẠO MỚI |
| `src/components/sections/ContactClient.tsx` | TẠO MỚI |
| `src/app/layout.tsx` | SỬA |
| `src/app/page.tsx` | SỬA |
| `src/app/lien-he/page.tsx` | VIẾT LẠI |
| `src/app/phong/page.tsx` | SỬA |
| `src/app/phong/[slug]/page.tsx` | SỬA |
| `src/app/ve-chung-toi/page.tsx` | SỬA |
| `src/app/tien-ich/page.tsx` | SỬA |
| `src/app/vi-tri/page.tsx` | SỬA |

---

## Thông Tin Dùng Cho JSON-LD

| Trường | Giá trị |
|--------|---------|
| Schema type | `Hotel` |
| @id | `https://venhohotel.com/#hotel` |
| Tên | Ven Hồ Hotel |
| Điện thoại (E.164) | `+842438474646` |
| Email | `venhohotel@gmail.com` |
| Địa chỉ | 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội |
| Số phòng | 12 |
| Check-in | 13:00 |
| Check-out | 12:00 |
| Agoda rating | 8.5/10 (45 reviews) |
| Tọa độ | lat: 21.0510, lng: 105.8277 |
| og:image | `/images/Hero-lake/hero-lake.jpg` (1200×630) |

---

## Ghi Chú Kỹ Thuật

- `metadataBase` phải set để Vercel resolve được relative URL trong `openGraph.images`
- `dangerouslySetInnerHTML` trong `JsonLd.tsx` là bắt buộc — Next.js sẽ escape JSON nếu dùng cách khác
- hreflang: vì VI/EN dùng chung URL (client-side switch), chỉ khai báo `x-default` + `vi` — không khai báo `en`
- Image path case-sensitive trên Vercel (Linux): copy chính xác từ `rooms.ts` (có file `.JPG` viết hoa)
- `"use client"` component không thể export `metadata` — phải tách ra Server Component wrapper

---

## Verification

1. `npm run build` — pass sạch, không warning `metadataBase`
2. `npm run lint` — không lỗi TypeScript
3. Kiểm tra `/robots.txt` và `/sitemap.xml` trên venhohotel.com sau deploy
4. [Google Rich Results Test](https://search.google.com/test/rich-results) — thấy Hotel schema với rating
5. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — thấy ảnh hero-lake preview
6. Xem Google Search Console → Index Coverage để sitemap được nhận
