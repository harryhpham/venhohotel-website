# Changelog — Ven Hồ Hotel Website

## 2026-06-28 (3)
- **VenHoSocialManager — chuyển từ cron Mac sang GitHub Actions**
  - Chẩn đoán: cron job T2/4/6 không chạy vì Mac ngủ lúc 10AM, chỉ có 1 entry log toàn bộ tháng 6
  - Tạo `.github/workflows/social-content.yml`: schedule T2/T4/T6 3:00 UTC (10:00 AM Vietnam)
  - Thêm 3 GitHub Secrets: `OPENAI_API_KEY`, `SOCIAL_GMAIL_SENDER`, `SOCIAL_GMAIL_APP_PASS`
  - Upload toàn bộ VenHoSocialManager pipeline lên GitHub (15 files, `.gitignore` bảo vệ .env/credentials/ảnh)
  - Fix bug `KeyError: 'pillar_id'` trong `update_index()`: entries từ `/tao-social-post` skill không có trường này
  - Fix lỗi 403 khi commit: thêm `permissions: contents: write` vào workflow
  - Fix email thiếu ảnh: nhúng ảnh AI inline (MIMEImage CID) vào HTML email — không cần Drive
  - Kết quả: workflow chạy thành công ~4 phút, email kèm ảnh preview đầy đủ

## 2026-06-24 (4)
- **Location Master Ref + Room DNA + Logo — update toàn bộ `/tao-anh-ai` system**
  - Harry tạo `06_LOCATION_MASTER_REFERENCE_PACK_v1.0_FINAL.md` trong `VenHoBrandSystem/DNA/Linh An Universe/06_LOCATION_LIBRARY_SYSTEM/` — canonical source of truth cho location/environment
  - Harry upload 2 ảnh phòng thực vào `assets/`: `View-Ho-room.jpg` (wide shot) + `View-Ho-Room-from-inside.jpeg` (cửa sổ + hồ)
  - Harry upload `Logo.JPG` vào `assets/` — logo Ven Hồ Hotel (gold lotus + star, "VEN HO HOTEL · LAKE SHORE")
  - Convert 3 file JPEG → PNG: `View-Ho-room.png`, `View-Ho-room-from-inside.png`, `Logo.png` (yêu cầu của `--ref-env`)
  - **Sửa lỗi Hotel Room environment block** trong skill `/tao-anh-ai`: block cũ sai hoàn toàn ("cream and beige palette", "floor-to-ceiling window") → block mới đúng với phòng thực (tường trắng, đồ gỗ nâu đỏ đậm, cửa sổ nhôm đen lưới 2×2, rèm xám nâu, 2 ghế gỗ + bàn kính, 3 tranh hoa phấn hồng, gợi ý `--ref-env`)
  - **Thêm Logo block** vào skill: hướng dẫn dùng logo trên vật phẩm (ly cà phê, thẻ phòng, khăn, menu)
  - **Cập nhật Negative Prompt**: thêm "floor-to-ceiling glass wall, marble luxury interior, generic AI hotel room, cream and white luxury room"
  - **Cập nhật Reference table** trong skill + `CLAUDE.md`: thêm `View-Ho-room.png`, `View-Ho-room-from-inside.png`, `Logo.png` + link Location Master Ref
  - Cập nhật Proven formula: thêm rule hotel room (`--ref-env View-Ho-room-from-inside.png` + plain English editorial prompt)

## 2026-06-24 (3)
- **Skill `/tao-anh-ai` — production session đầu tiên + dual reference upgrade**
  - Tạo 4 ảnh hoàng hôn rooftop (Linh An · Outfit B · square 1:1): đứng lan can, ngồi ghế mây, dạo bộ candid, chân dung gần
  - Feedback Harry: image 1 & 4 (portrait đơn giản) khuôn mặt chuẩn · image 2 & 3 (nhiều props + wide shot) hơi AI feel · khung cảnh Hồ Tây chưa giống thực
  - Harry upload 3 ảnh rooftop thực vào `assets/`: `Rooftop-Panorama-view.jpeg`, `Rooftop-railing.jpeg`, `Rooftop-corner-view.jpeg`
  - **Nâng cấp `generate_image.py`:** thêm flag `--ref-env <path>` — dual reference (face + environment) bằng cách truyền list 2 ảnh vào `images.edit()`
  - Convert `Rooftop-railing.jpeg` → PNG (dùng `sips`) vì API chỉ chấp nhận PNG cho ref thứ 2
  - Test dual ref thành công: lan can đen vòng tròn, gạch đỏ thô, skyline Hà Nội authentic — cải thiện rõ rệt so với text-only environment
  - Harry approved: "Tuyệt vời" · Output: `photos-ai/2026/24-06-hoang-hon-rooftop/` + `24-06-hoang-hon-rooftop-test/`

## 2026-06-28 (2)
- **Tạo ảnh AI — `/tao-anh-ai` session: 4 ảnh mới (2 batch)**
  - **Batch 1:** West Lake Café · Linh An · 16:9 (1280×720) · 2 ảnh
    - Ảnh 1: Ngồi bên cửa sổ cầm ly cà phê nhìn ra hồ, ánh sáng sáng sớm 8:30, 85mm portrait
    - Ảnh 2: Wide shot nội thất quán (brick wall, Edison lights, vintage chairs), coffee raised, 35mm
    - Outfit A · `--ref linh-an-master-face.png` · Output: `photos-ai/2026/26-06-linh-an-cafe-ho-tay/`
  - **Batch 2:** Hoàng hôn Hồ Tây từ rooftop · Không Linh An · Square 1:1 (1024×1024) · 2 ảnh
    - Ảnh 1: Railing foreground gần, panoramic lake view, golden sunset 18:00, 24mm
    - Ảnh 2: Ultra-wide 16mm, perspective gạch terracotta, purple-gold dusk sky 18:30
    - Text-to-image (no --ref) · Output: `photos-ai/2026/28-06-hoang-hon-ho-tay/`
  - Lưu ý: Google Drive token hết hạn — đã xóa `token.json` cũ, cần re-auth bằng `python3 google_drive.py` trước khi upload Batch 2

## 2026-06-28
- **DNA Update — 06 Location Library v2.0 + 07 Linh An System v3.1**
  - `06_LOCATION_MASTER_REFERENCE_PACK_v2.0_FINAL.md` — merge Location Pack + Image DNA + Phòng View Hồ thành 20-section canonical guide (màu HEX đầy đủ, AI prompt library, checklist xuất bản)
  - `07A_LINH_AN_VISUAL_DNA_v3.1.md` — Visual DNA cập nhật (sensuality guidelines, 3 hairstyle chính thức, character rules)
  - `07B_MASTER_REFERENCE_PACK_v3.0.md` — Reference scores: B3=9.4–9.5 (PRIMARY), A2=9.2, C=9.2, D=9.4
  - `07C_FACE_LOCK_SYSTEM_v1.1.md` — Mới: identity stack, 5 LABs, Positive-Constraint Rule (dùng mô tả tích cực thay negative prompts)
  - `07E_PRODUCTION_PROMPT_SYSTEM_v1_1.md` — 3-block universal core (FACE/SCENE/CAMERA), engine appendix cho Google Flow + ChatGPT
  - Cập nhật `CLAUDE.md` (master + Ven Ho Hotel): identity stack, reference scores, Face Lock v3.1

## 2026-06-24 (2)
- **Linh An Image Generation — nâng cấp sang `images.edit()` + reference face**
  - Phát hiện: text-to-image không thể lock khuôn mặt Linh An (6–8.4/10); `images.edit()` + reference đạt **9/10**
  - Nâng cấp `generate_image.py`: thêm `--ref <path>` flag — dùng `images.edit()` thay `images.generate()` khi có reference
  - Nâng cấp `google_drive.py`: thay logic SKIP → UPDATE (overwrite file đã tồn tại trên Drive)
  - Thêm 5 reference images vào `ops/VenHoSocialManager/assets/`: `linh-an-master-face.png`, `A2_Front.png`, `B3_Hero.png`, `C_LeftProfile.png`, `D_RightProfile.png`
  - Cập nhật skill `/tao-social-post` Bước 7: bắt buộc dùng `--ref` khi `linh_an: true`
  - Cập nhật `CLAUDE.md` với reference image system + nguyên tắc prompt edit mode
  - **Bài đã tạo:** `2026-06-24_linh-an-cafe-rooftop` — P1 TOFU · 91/100 · Linh An rooftop cafe Ven Hồ

## 2026-06-24
- **VENHO_HOTEL_MASTER_REFERENCE_PACK_v1.0_FINAL** — Hotel Visual DNA (LOCKED)
  - Thêm `VENHO_HOTEL_MASTER_REFERENCE_PACK_v1_FINAL.md` vào `VenHoBrandSystem/DNA/`
  - 19 DNA blocks: Building, Facade, Lobby, Reception, Corridor, Stair, Elevator, Lake View Room, Window, Balcony Railing, West Lake Room Experience, Nguyễn Đình Thi Street, West Lake Environment, Rooftop, Rooftop Railing, Rooftop Panorama, Sunset, Linh An Compatibility Rule
  - Status: READY FOR AI PRODUCTION — canonical reference cho mọi nội dung AI/KOL/marketing
  - Cập nhật CLAUDE.md (master + Ven Ho Hotel) để reference file này

## 2026-06-28
- **Fix — Disable scheduled cloud routine bị lỗi 8AM hàng ngày**
  - Nguyên nhân: Routine cũ "Ven Hồ — Báo Cáo Doanh Thu Hàng Ngày" (`trig_01YVD8GP1HiyZQtKmmb8inbH`) tạo từ 15/6 cố scrape SkyHotel từ cloud environment Claude Code → bị proxy chặn kết nối HTTPS đến `admin1.skyhotel.vn` (403 policy denial)
  - Giải pháp: Disable routine này — GitHub Actions (`daily-revenue.yml`) đã làm đúng việc này ở 9AM, không bị chặn
  - Routine theo dõi đối thủ (`trig_01HhEDr4CRLV1Krf32A1o3AG`) giữ nguyên — chỉ dùng web search, không cần SkyHotel

## 2026-06-26 (2)
- **AI Agent — Phiếu Chi + Monthly Summary**
  - Thêm section **Phiếu Chi** vào email báo cáo ngày: tên phiếu, số tiền, hình thức thanh toán, lợi nhuận ước tính
  - Tạo workflow mới `.github/workflows/monthly-summary.yml` — chạy 10AM ngày 1 mỗi tháng
  - Email tháng tổng kết: doanh thu cả tháng trước + chi phí theo loại + lợi nhuận
  - Viết lại `ops/ai-agent/skyhotel-scraper.py`: thêm `navigate_to_phieu_chi()`, `parse_phieu_chi()`, `build_monthly_email()`, `run_monthly()` + flag `--monthly`
  - Phiếu Chi dùng Python-level date filtering (không dựa vào UI date filter của SkyHotel)
  - Test thủ công cả 2 workflow trên GitHub Actions → pass ✓

## 2026-06-26
- **GitHub Actions — Daily Revenue Report**: chuyển từ launchd local → cloud GitHub
  - Workflow: `.github/workflows/daily-revenue.yml` — chạy 9:00 AM (UTC+7) mỗi ngày
  - Không cần Mac bật — chạy hoàn toàn trên GitHub cloud
  - 4 GitHub Secrets: SKYHOTEL_USER, SKYHOTEL_PASS, GMAIL_USER, GMAIL_APP_PASS
  - Test thủ công: Actions → Daily Revenue Report → Run workflow ✓

## 2026-06-22 (2)
- **Fix AI Agent — báo cáo bị miss khi Mac reboot sau 9h**
  - launchd không catch-up missed job sau reboot (chỉ sau sleep) → thêm lịch dự phòng 10:30 AM
  - Thêm lock file `/tmp/venho-revenue-YYYY-MM-DD.lock` vào `run-daily-report.sh` để chống gửi đôi
  - Plist dùng `StartCalendarInterval` array: 9:00 + 10:30

## 2026-06-22
- **The West Lake Living Universe** — Ven Hồ Hotel trở thành base camp của universe lớn hơn
  - Tạo `projects/Ho Tay/` — content library West Lake (SceneLibrary 9 families, Prompts, References)
  - Tạo `projects/Linh An/` — character library (CharacterBible, Prompts x4, Wardrobe x4 seasons)
  - Tạo `projects/ContentProduction/` — output folder (Albums/2026 x5 themes, FB, IG, Reels, Video)
  - Cập nhật `projects/VenHoBrandSystem/` — convert 4 RTF DNA → markdown + PromptEngine + SceneArchitecture
  - Tạo `projects/CLAUDE.md` + `projects/CHANGELOG.md` — master universe context
  - Tạo `website/`, `social/`, `marketing/`, `assets/` sub-folders trong Ven Ho Hotel
  - Cập nhật `CLAUDE.md` — thêm universe context + reference đến new DNA locations

## 2026-06-21 (2)
- **Hồ Tây Image DNA** — tạo `ops/ho-tay-image-dna.md`
  - DNA cố định cho mọi prompt ảnh AI về Hồ Tây / Nguyễn Đình Thi
  - Màu nước mặc định: jade-teal `#4E8FA0` (ngày thường); xám bạc `#B8C4C8` (haze); amber `#C07840` (hoàng hôn)
  - Gồm: identity block, lake water, atmosphere, vegetation, urban elements, local life, color palette, what to avoid, ready-to-use prefix block
  - Nguồn: ảnh thực Harry chụp tại Nguyễn Đình Thi tháng 6/2026
  - Dùng cho: gpt-image-2, Midjourney, DALL-E, Seedance, Flux và mọi AI image tool
- **Trigger "Kết thúc Task"** — thêm vào quy tắc làm việc trong `CLAUDE.md`
  - Mỗi khi Harry nhắn "Kết thúc Task", tự động cập nhật `CLAUDE.md` + `CHANGELOG.md`

## 2026-06-21
- **Fix VenHoSocialManager — skill `/tao-social-post` thiếu 3 bước sau tạo ảnh**
  - `send_email.py`: bỏ phụ thuộc `index.json`; tự scan folder mới nhất trong database; hỗ trợ cả format manual-skill lẫn `generate_content.py`; subject email lấy từ `concept` của bài mới nhất
  - `google_drive.py`: thêm CLI `python3 google_drive.py upload <folder>` để upload bài thủ công
  - Skill `.claude/commands/tao-social-post.md`: thêm **Bước 5b** — sau khi tạo ảnh tự động upload Drive, cập nhật `meta.json` với `drive_url`, cập nhật `index.json` + `index.md`
- **Fix AI Agent — báo cáo doanh thu không gửi**: 2 lỗi
  - Plist trỏ đường dẫn cũ `AI Agent/` (đã xóa sau reorganize) → sửa thành `ops/ai-agent/`
  - Gmail App Password hết hạn → cập nhật mới trong `run-daily-report.sh`
  - Reload launchd, test chạy OK — email gửi thành công

## 2026-06-20
- **Fix AI Agent — chuyển cron → launchd**: cron bỏ qua job khi Mac ngủ; launchd chạy ngay khi Mac thức
  - Plist: `~/Library/LaunchAgents/com.venhohotel.daily-revenue.plist`
- **Phần 4 — VenHoSocialManager**: pipeline GPT-5 → gpt-image-1 → Drive → email hoàn thành
  - 5 pillars, 20-slot weighted rotation, cron T2/T4/T6 10AM

## 2026-06-19
- **Migration Windows → macOS**
  - Homebrew + Node v20.20.2 + npm 10.8.2
  - Playwright + Chromium cài lại trên macOS
  - 6 file Windows (.ps1, .bat) → 5 bash scripts (.sh)
  - launchd job VenHo-DailyRevenue 9:00 AM chạy OK
  - Terminal Full Disk Access đã cấp
- **Fix song ngữ EN/VI toàn bộ trang web**
  - 4 trang con tách thành Client Components (useLang)
  - 6 section EN mới trong content.ts; rooms.ts: thêm descriptionEn, amenitiesEn, bedsEn
  - FeaturedRooms, ServicesGrid, NearbySection, LocationBlock: thêm useLang
  - Cập nhật giá phòng: Deluxe 400k, Lake View 600k, Triple 500k
  - GitHub token lưu macOS Keychain — push tự động
- **Phần 7 — Tích Hợp Agoda / Booking.com**
  - `src/lib/data/ota.ts` — `agodaUrl()` / `bookingUrl()` với UTM
  - GA4 events: `agoda_click`, `booking_click`; Booking.com giữ `aid=304142`
  - Build 16/16 trang pass — deploy lên Vercel

## 2026-06-15
- **Phần 5 — Phân Tích Đối Thủ**: 5 đối thủ trực tiếp khu Tây Hồ (Đan Thanh sát vách)
  - Ven Hồ: Agoda 8.5 cao nhất phân khúc, duy nhất có website+booking
  - Scheduled Agent tự động cập nhật mỗi Thứ Hai 9AM → email báo cáo
- **Phần 8 — AI Agent Doanh Thu**
  - Playwright scrape SkyHotel PMS → parse Excel → gửi email
  - CCR bị block egress admin1.skyhotel.vn → dùng local cron job
- **Phần 9 — SEO**
  - robots.ts, sitemap.ts (9 URLs), JsonLd.tsx (Hotel + HotelRoom + BreadcrumbList)
  - metadataBase, og:image, Twitter Card, title.template
  - Build 16/16 trang pass sạch

## 2026-06-10
- **Google Analytics GA4**: Measurement ID G-4242ESCGY7
  - GoogleAnalytics component (next/script afterInteractive)
  - Conversion events: generate_lead, phone_click
  - DebugView xác nhận data đổ về
- **Email Resend**: verify domain venhohotel.com; đổi sender → no-reply@venhohotel.com
- **Debug build**: resend@6 yêu cầu Node ≥20 → thêm engines vào package.json
- **Fix Resend**: move init vào trong try-catch; fix RESEND_API_KEY trong Vercel env

## 2026-06-09
- Form đặt phòng kết nối email qua Resend (API route POST /api/booking)
- Push lên GitHub (harryhpham/venhohotel-website)
- Deploy thành công lên Vercel — **venhohotel.com** live

## 2026-06-04
- Website 7 trang hoàn chỉnh, build clean
- VI/EN language switcher
- Gallery + lightbox + auto-slideshow 10s
- Mobile responsive, SEO metadata, JSON-LD schema
