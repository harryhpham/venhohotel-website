# Ven Hồ Hotel — CLAUDE.md

Tài liệu hướng dẫn cho Claude Code khi làm việc với project này.

> **Universe context:** Ven Hồ Hotel là base camp của **The West Lake Living** universe.  
> Master CLAUDE.md: `projects/CLAUDE.md` · DNA: `projects/02_KNOWLEDGE/`  
> Nhân vật: Hồ Tây (`projects/01_BRANDS/WEST_LAKE/`) · Linh An (`projects/01_BRANDS/LINH_AN/`)

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
- **"Kết thúc Task"** — khi Harry nhắn cụm này, tự động cập nhật `CLAUDE.md` + `CHANGELOG.md` ngay, không hỏi

---

## Tech Stack

| Thành phần | Chi tiết |
|------------|----------|
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript |
| Styling    | Tailwind CSS v3 |
| Node       | v20.20.2 (cài qua Homebrew) |
| Package mgr | npm 10.8.2 |
| OS         | macOS (Apple Silicon) |

> **Màu sắc, Font, Tagline:** xem `projects/CLAUDE.md` — Brand DNA Quick Reference

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── page.tsx                    ← Trang chủ
│   ├── layout.tsx                  ← Root layout (font, metadata)
│   ├── globals.css
│   ├── phong/[slug]/page.tsx       ← Chi tiết phòng
│   ├── ve-chung-toi/page.tsx
│   ├── tien-ich/page.tsx
│   ├── vi-tri/page.tsx
│   └── lien-he/page.tsx
├── components/
│   ├── sections/                   ← Hero, FeaturedRooms, ServicesGrid...
│   └── ui/                        ← Navbar, Footer, GoogleAnalytics
└── lib/
    ├── context/LangContext.tsx     ← Language switcher VI/EN
    └── data/
        ├── content.ts              ← ⭐ Text website (VI/EN)
        ├── rooms.ts                ← ⭐ Thông tin phòng & ảnh
        └── ota.ts                  ← Deep link Agoda / Booking.com
```

**Chỉnh text website:** `src/lib/data/content.ts`  
**Chỉnh thông tin phòng & ảnh:** `src/lib/data/rooms.ts`

---

## Thông tin khách sạn

| Trường | Thông tin |
|--------|-----------|
| Tên | Ven Hồ Hotel |
| Địa chỉ | 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội |
| Điện thoại | 024 3847 4646 |
| Email | venhohotel@gmail.com |
| Website | https://venhohotel.com |
| Facebook | facebook.com/venhohotelhanoi |
| Instagram | @venhohotelhanoi |
| Agoda | 8.5/10 tổng thể · 9.2/10 vị trí (45 reviews) |
| Số phòng | 12 phòng boutique |

### Loại phòng

| Phòng | Slug | Diện tích | Giá từ |
|-------|------|-----------|--------|
| Phòng Deluxe Đôi | `deluxe-double` | 18 m² | 400,000đ/đêm |
| Phòng Đôi View Hồ Tây | `double-lake-view` | 16 m² | 600,000đ/đêm |
| Phòng Tiêu Chuẩn Ba Người | `standard-triple` | 18 m² | 500,000đ/đêm |

Check-in: 13:00 · Check-out: 12:00 trưa · Trẻ em dưới 9 tuổi: miễn phí

---

## Commands

```bash
# Dev server
npm run dev              # → http://localhost:3000

# Build & preview
npm run build
npx serve out

# Lint
npm run lint
```

### Deploy lên Vercel

```bash
git add <files>
git commit -m "feat: ..."
git push origin main
# → venhohotel.com cập nhật sau ~1-2 phút
```

> GitHub token đã lưu vào macOS Keychain — `git push` tự động, không cần nhập lại.

---

## Các module & tài liệu chi tiết

| Module | Thư mục | Tài liệu |
|--------|---------|----------|
| Form đặt phòng (Resend) | `ops/email-form/` | `notes.md` |
| Social Media AI (skill `/tao-social-post`) | `ops/VenHoSocialManager/` | `README.md` |
| **Social Video Content** | `local-generated/social-video/` | Local generated, không commit |
| Phân tích đối thủ | `ops/competitor-analysis/` | `notes.md` |
| Google Analytics GA4 | `ops/analytics/` | `notes.md` |
| OTA (Agoda/Booking.com) | `ops/agoda/` | — |
| AI Agent doanh thu | `ops/ai-agent/` | `notes.md` |
| SEO | `ops/seo/` | `notes.md` |
| **Hồ Tây Image DNA** | `ops/` | `ho-tay-image-dna.md` |
| **Universe Brand DNA** | `projects/02_KNOWLEDGE/DNA/` | 5 DNA files + `Linh An Universe/07_LINH_AN_KOL_SYSTEM/` (07A–07F) |
| **Linh An Production** | `02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/` | 07E Production Prompt System · 07F QC Scoring Rubric |
| **Ho Tay Content Library** | `projects/01_BRANDS/WEST_LAKE/` | SceneLibrary, Prompts, References |
| **Linh An Character Library** | `projects/01_BRANDS/LINH_AN/` | CharacterBible, Prompts, Wardrobe |
| **ContentProduction** | `projects/04_PRODUCTION/` | Output content đã tạo |
| **VENHO AI Studio** | `projects/03_AI_STUDIO/venho-ai-studio/` | Knowledge Studio v2.4 (Phase 8 complete · 90/90 tests pass · validated với API thật) — Mode A + Mode B · Pass 2A tất định · Curated Overlay (`overrides.yaml`) · ALLOWED IMPERFECTIONS · COMPACT output · English values rule · 1 subject = 1 hạng · FORBIDDEN = policy · QC gate linh_an · contract 1.1 · `--classify` flag · `--all` flag · `overlay_applied` manifest · cache key = `{hash}_{schema_id}_{sv}_{pv}` · DNA regen key = hash + schema_version + prompt_version (`needs_regeneration()`) · prompt_version 1.1 (fix forbidden_hints noise) · DNA generated: `lake_view_room` · `deluxe_double` · `lobby` · `facade` · `linh_an` · `westlake` · `outside` (v1.1, 14 ảnh — gộp street-level + rooftop qua `space_type` variable) — tất cả có overrides.yaml · CLI: `venho vision observe --mode b --project venho_hotel --subject {subject} --input {dir}` · CLI all: `venho vision observe --all --project venho_hotel` · DNA: `data/projects/venho_hotel/knowledge/VENHO_HOTEL_{SUBJECT}_DNA.md` · Master Plan: `docs/dna_studio_master_plan_v2_4.md` · `venho` CLI global (PATH: `/Users/hanhpham/Library/Python/3.9/bin`) · **`/tao-anh-ai` + `/tao-social-post` đọc `_DNA_COMPACT.md` tự động trước khi viết prompt** (DNA thắng nếu mâu thuẫn với block cứng) |

> Tài liệu chung (Venhohotel.md, DEPLOY-GUIDE.md): `docs/`

**Lịch sử phát triển:** xem `CHANGELOG.md`  
**Universe history:** xem `projects/00_PROJECT_HQ/CHANGELOG.md`

---

## Social Video Content

Hệ thống tạo video ngắn 15 giây cho TikTok / Instagram Reels / YouTube Shorts.

### AI KOL — Linh An

| Trường | Thông tin |
|--------|-----------|
| Tên | Linh An |
| Tuổi | 24 |
| Nghề | Fashion & Lifestyle Creator |
| Khu vực | Tây Hồ, Hà Nội |
| Vai trò | Xuất hiện tự nhiên trong video — KHÔNG phải người quảng cáo |

**Character DNA đầy đủ (v3.1):** `projects/02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/`
- `07A` — Visual DNA v3.1 (character identity)
- `07B` — Master Reference Pack v3.0 (reference scores: B3=9.4–9.5 PRIMARY, A2=9.2, C=9.2, D=9.4)
- `07C` — Face Lock System v1.1 (tại sao người nhận ra Linh An)
- `07E` — Production Prompt System v1.1 (3-block universal core, Google Flow + ChatGPT appendix)
- `07F` — QC Scoring Rubric

**Identity stack (khi xung đột):** Master Face #001 > 07C Face Lock > 07B Reference Pack > 07A Visual DNA > 07E Prompt

**Character Library:** `projects/01_BRANDS/LINH_AN/` (CharacterBible, Prompts, Wardrobe)  
**Legacy prompts:** `local-generated/social-video/linh-an-storyboard-prompts.md` (local generated, vẫn dùng cho `/tao-video-script`)

**Face Lock v3.1:** xem `projects/CLAUDE.md` (Linh An — Quick Reference) hoặc `07A_LINH_AN_VISUAL_DNA_v3.1.md`

**Outfit Pack:**
- **A – Cafe Girl:** cream knit top, beige A-line skirt, small luxury handbag
- **B – West Lake Sunset:** flowing white dress, minimal gold jewelry
- **C – Street Style:** white button-up shirt, high-waist trousers, denim jacket
- **D – Business Travel:** light beige blazer, white blouse, elegant trousers

**Outfit mapping theo Pillar:** View & Vibe→B · Room Tour→D · Local Life→A · Deal→B/D · Guest Story→A/B

### Cấu trúc video

- **Format:** 15 giây · 3 cảnh × 5 giây · 9:16 vertical
- **AI Video tool:** LitMedia Seedance 2.0 — litmedia.ai
- **Edit:** CapCut (ghép clip, nhạc, AI caption)

### 5 Content Pillars

1. **View & Vibe** — cảnh đẹp, hoàng hôn, không khí hồ
2. **Room Tour** — phòng, reveal view, không gian
3. **Local Life** — cuộc sống Tây Hồ (hotel là neo, local là context)
4. **Deal & Ưu đãi** — giá phòng, khuyến mãi
5. **Guest Story** — trải nghiệm khách

### Files

```
local-generated/social-video/
├── README.md                        ← Chiến lược tổng thể
├── content-calendar.md              ← Lịch 14 video (Tuần 1–4, tháng 6–7/2026)
├── linh-an-storyboard-prompts.md   ← ⭐ Character DNA đầy đủ của Linh An
├── scripts/
│   ├── 001-golden-hour-ho-tay.md   ← View & Vibe · 23/6
│   ├── 002-room-tour-double-lake-view.md ← Room Tour · 25/6
│   ├── 003-buoi-sang-ven-ho.md     ← Local Life · 27/6
│   ├── 004-checkin-dep-nhat.md     ← Room Tour · 1/7
│   └── 005-cuoi-tuan-o-tay-ho.md  ← Local Life · 4/7
└── script-generator/               ← Web app tạo script tự động (Node.js + Claude API)
    ├── server.js
    ├── index.html
    └── .env                        ← ANTHROPIC_API_KEY
```

### Tạo script mới

**Cách 1 — Trong VSCode (khuyến nghị, không tốn thêm phí):**
```
/tao-video-script [concept ngắn]
```
Skill file: `.claude/commands/tao-video-script.md`

**Cách 2 — Web app (dùng khi cộng tác viên cần dùng):**
```bash
cd "local-generated/social-video/script-generator"
npm start   # → http://localhost:3000
```
Yêu cầu: `ANTHROPIC_API_KEY` trong file `.env` · Chi phí ~700–1,000đ/script

---

## VenHoSocialManager — Scripts CLI

| Lệnh | Tác dụng |
|------|----------|
| `python3 generate_image.py "[prompt]" "database/YYYY/MM/folder" [portrait\|square\|story]` | Tạo ảnh gpt-image-2 |
| `python3 google_drive.py upload "database/YYYY/MM/folder"` | Upload folder lên Drive, in ra URL |
| `python3 send_email.py` | Gửi email bài mới nhất (tự scan database) |
| `python3 send_email.py "database/YYYY/MM/folder"` | Gửi email bài cụ thể |

**Sau Bước 5 (tạo ảnh) của skill `/tao-social-post`**, phải chạy Bước 5b:
1. Upload Drive → lấy URL
2. Cập nhật `meta.json` thêm `drive_url`
3. Cập nhật `database/index.json` + `database/index.md`

### AI Image Engines

| Engine | Tool | Dùng khi |
|--------|------|---------|
| **GPT Image 2** (ChatGPT) | `generate_image.py --ref` | Volume, social posts, on-demand |
| **Google Flow** (Nano Banana 2) | litmedia.ai → Ingredients system | Hero portrait, branding, series nhất quán |

> **QC scoring:** Mọi ảnh Linh An chấm điểm theo rubric `07F_QC_CHECKLIST_SCORING_RUBRIC_v1_0.md` — ≥9.0 dùng hero, 8.0–8.9 dùng phụ, <8.0 regenerate.

### Linh An — Image Generation (validated 2026-06-24)

**BẮT BUỘC dùng `--ref` khi ảnh có Linh An** — text-only chỉ đạt 6–8.4/10, edit+reference đạt 9/10:

```bash
# Single ref (face only)
python3 generate_image.py "[scene prompt]" "photos-ai/YYYY/DD-MM-slug" [size] --ref "assets/linh-an-master-face.png"

# Dual ref (face + environment) — dùng khi có reference ảnh địa điểm thực
python3 generate_image.py "[scene prompt]" "photos-ai/YYYY/DD-MM-slug" [size] --ref "assets/linh-an-master-face.png" --ref-env "assets/Rooftop-railing.png"
```

**Lưu ý `--ref-env`:** Phải là file PNG (không phải JPEG) — convert bằng `sips -s format png input.jpeg --out output.png` nếu cần.

**Nguyên tắc prompt khi dùng `--ref`:** KHÔNG mô tả lại khuôn mặt — chỉ mô tả outfit, background, action, ánh sáng.

**Proven formula (validated 2026-06-24):**
- ✅ Standing / leaning at railing + portrait/medium framing (85mm) → khuôn mặt 9/10
- ✅ Dual ref (face + env) → lan can, màu hồ, skyline accurate hơn rõ rệt
- ✅ Hotel room: dùng `--ref-env "assets/View-Ho-room-from-inside.png"` → phòng đúng với thực tế
- ✅ Hotel room: plain English editorial prompt (không dùng character block chi tiết) → tránh safety filter
- ❌ Tránh: candid walking + wide shot (50mm) → AI feel
- ❌ Tránh: nhiều props cùng lúc (ghế mây + nến + ly rượu) → drift sang resort generic
- ❌ Tránh: "cream and beige palette / floor-to-ceiling window" cho hotel room → sai với thực tế

**Reference images:** `ops/VenHoSocialManager/assets/`
| File | Loại | Dùng khi |
|------|------|---------|
| `linh-an-master-face.png` | Face (~15° trái) | `--ref` cho mọi ảnh có Linh An |
| `B3_Hero.png` | Face (3/4 trái) | Production chính thức |
| `A2_Front.png` | Face (thẳng mặt) | Cần góc đối xứng |
| `C_LeftProfile.png` | Face (profile trái) | Silhouette |
| `D_RightProfile.png` | Face (profile phải) | Silhouette |
| `Rooftop-railing.png` | Env — lan can + mặt hồ | `--ref-env` cho scene rooftop portrait |
| `Rooftop-Panorama-view.jpeg` | Env — toàn cảnh rooftop | Tham khảo góc rộng |
| `Rooftop-corner-view.jpeg` | Env — góc rooftop + skyline | Tham khảo skyline Hà Nội |
| `View-Ho-room.png` | Env — phòng wide shot | `--ref-env` cho scene phòng (góc tổng) |
| `View-Ho-room-from-inside.png` | Env — cửa sổ + hồ | `--ref-env` cho scene phòng (focus cửa sổ/railing) |
| `Logo.png` | Logo Ven Hồ Hotel | Tham khảo khi mô tả logo trên vật phẩm (ly, thẻ phòng...) |

**`google_drive.py`:** Đã nâng cấp — tự động `[UPDATE]` file đã tồn tại thay vì `[SKIP]`.

---

## Brand DNA Principles

> Master DNA: `projects/02_KNOWLEDGE/DNA/` (6 files + 10-module Linh An Universe) · Approved June 2026  
> Brand values, Decision Framework (5 câu hỏi), màu sắc, font: xem `projects/CLAUDE.md`  
> Hotel visual DNA (LOCKED): `VENHO_HOTEL_MASTER_REFERENCE_PACK_v2.0_FINAL.md`

---

## Ghi chú triển khai quan trọng

- `resend@6+` yêu cầu Node ≥ 20 — đã khai báo `engines` trong `package.json`
- `RESEND_API_KEY` phải có trong Vercel → Settings → Environment Variables
- GA4 Measurement ID: `G-4242ESCGY7`
- AI Agent doanh thu dùng **GitHub Actions** (cloud) — không cần Mac bật
  - Workflow hàng ngày: `.github/workflows/daily-revenue.yml` — 9:00 AM (UTC+7) mỗi ngày
    - Email gồm: Doanh thu + **Phiếu Chi** (chi phí ngày) + Lợi nhuận ước tính
  - Workflow tháng: `.github/workflows/monthly-summary.yml` — 10:00 AM ngày 1 mỗi tháng
    - Email tổng kết tháng trước: doanh thu + chi phí theo loại + top phòng
  - Secrets: SKYHOTEL_USER, SKYHOTEL_PASS, GMAIL_USER, GMAIL_APP_PASS (GitHub repo settings)
  - Test thủ công: Actions → chọn workflow → Run workflow
  - Backup launchd local: `~/Library/LaunchAgents/com.venhohotel.daily-revenue.plist` (9:00 + 10:30 AM)
- **VenHoSocialManager dùng GitHub Actions** (cloud) — không cần Mac bật
  - Workflow: `.github/workflows/social-content.yml` — T2/T4/T6 lúc **8:00 AM** (UTC+7)
  - Pipeline: gpt-5.5 → caption FB/IG/Threads + gpt-image-2 → lưu local → **upload Google Drive (set public) → lấy `image_public_url`** → email preview (song song, không chặn) → **POST JSON sang Make.com webhook → Make tự đăng thẳng lên Facebook Page** → commit rotation state + caption/meta/index text (không commit `image.png`)
  - ⚠️ **Không có bước duyệt thủ công trước khi đăng** — bài lên Facebook Page thật ngay trong cùng lần chạy T2/T4/T6
  - Secrets: `OPENAI_API_KEY`, `SOCIAL_GMAIL_SENDER`, `SOCIAL_GMAIL_APP_PASS`, `GOOGLE_DRIVE_TOKEN_JSON` (OAuth token Drive, tự refresh trong CI), `MAKE_WEBHOOK_URL`, `MAKE_WEBHOOK_SECRET` (optional)
  - Google Drive **không còn bị skip** (đã bỏ `SKIP_GOOGLE_DRIVE=1`) — bắt buộc chạy để lấy `image_public_url` cho Make; nếu Drive upload lỗi thì bước Make bị bỏ qua (không đăng)
  - Make.com scenario chuẩn 3 module: `Webhooks (Custom webhook)` → `HTTP (Get a file)` → `Facebook Pages (Create a Post with Photos)` — chi tiết setup + lỗi thường gặp khi map field: `ops/VenHoSocialManager/README.md`
  - Test thủ công: Actions → "Social Content Generator" → Run workflow (sẽ đăng bài thật nếu Make scenario đang `ON`)
  - Cron Mac cũ (`0 10 * * 1,3,5`) vẫn còn trong crontab nhưng redundant
- Scheduled Agent theo dõi đối thủ: chạy mỗi Thứ Hai 9AM, gửi email báo cáo

---

## Việc còn lại

- [ ] Tạo tài khoản Zalo OA
