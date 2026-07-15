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
- **"Kết thúc Task"** — khi Harry nhắn cụm này, tự động cập nhật `CLAUDE.md` + `CHANGELOG.md` + `task_memory.md` + `task_status.md` ngay, không hỏi

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
| Social Media AI (skill `/tao-social-post`) | `venho-os/ops/VenHoSocialManager/` (repo riêng, chuyển 2026-07-14) | `venho-os/ops/VenHoSocialManager/README.md` |
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
| **Module 01 — Knowledge Studio / DNA Studio / AI Vision Engine** | `projects/03_AI_STUDIO/venho-ai-studio/` | **Phase 0–8 ALL COMPLETE (2026-07-08)** · 258 tests · 0 API call · Roadmap: `docs/dna_studio_master_plan_v2_5_qc.md` · Mode A + Mode B · Pass 2A tất định · Curated Overlay (`overrides.yaml`) · ALLOWED IMPERFECTIONS · COMPACT output · English values rule · 1 subject = 1 hạng · FORBIDDEN = policy · QC gate linh_an · contract 1.1 · DNA subjects: `lake_view_room` · `deluxe_double` · `lobby` · `facade` · `linh_an` · `westlake` · `outside` (v1.1, 14 ảnh — gộp street-level + rooftop qua `space_type` variable) — tất cả có overrides.yaml · CLI: `venho vision observe --mode b --project venho_hotel --subject {subject} --input {dir}` · CLI all: `venho vision observe --all --project venho_hotel` · DNA: `data/projects/venho_hotel/knowledge/VENHO_HOTEL_{SUBJECT}_DNA.md` · vault search: `venho vault search "từ khóa"` · vault diff/export · EXIF reading `read_exif()` · `venho` CLI global (PATH: `/Users/hanhpham/Library/Python/3.9/bin`) · **`/tao-anh-ai` + `/tao-social-post` đọc `_DNA_COMPACT.md` tự động trước khi viết prompt** (DNA thắng nếu mâu thuẫn với block cứng) · Studio UI: **VenHo OS** `localhost:3000/os` — repo riêng `venho-os` (chuyển 2026-07-14) |
| **Module 02 — Prompt Studio** | `projects/03_AI_STUDIO/venho-ai-studio/prompt_studio/` | **ALL 5 STAGES / 16 STEPS COMPLETE (2026-07-08)** · 347 tests · 0 API call · Roadmap: `VENHO_AI_STUDIO_Module_02_Prompt_Studio_Plan_v1.1.md` · Biến DNA JSON (Module 01) → prompt image/video/content/SEO, có version + validate 2 tầng (structural + faithfulness) · Pipeline: Build → Validate #1 → Optimize (Claude, temperature 0, chỉ gọt wording) → Validate #2 (cổng chính) → Manifest-aware Render/Store · Video đa DNA: `character_lock` + `environment_dna`, xung đột key giữa 2 bên → giữ cả hai + ghi `notes` · Content/SEO: `target_language` (vi/en/bilingual) từ `config/projects/venho_hotel/prompt_rules.yaml` · Manifest + Regeneration Policy: DNA/template không đổi → no_change · đổi → archive `_archive/` + bump version · CLI: `venho prompt --type {image,video,content,seo} --project venho_hotel --subject ... --brief "..."` (video: `--subject character,env1,env2`) · `--all` (image+content+seo) · `--allow-draft` · không flag → menu tương tác [A/B/C/D] · Output: `data/projects/venho_hotel/prompts/{image,video,content,seo}/` + `prompt_manifest.json` · **Brand naming trong AI prompt: "Ven Ho Hotel" không dấu** (khác tên hiển thị website có dấu) · optimizer thật dùng fake client test, chưa chạy thật 1 lần với API key thật · menu tương tác chưa có test tự động |
| **Module 03 — Validator Studio** | `projects/03_AI_STUDIO/venho-ai-studio/validator_studio/` | **ALL COMPLETE (2026-07-08)** · 26 tests · 0 API call · Plan: `VENHO_AI_STUDIO_Module_03_Validator_Studio_Plan_v1_1.md` · 4 validator types: image/prompt/face/content · Scoring: AI observe enum → code score deterministic · Kill-switch: forbidden severity=high → cap=40, verdict=regenerate · Face: 07F binary gates + weighted score, grounding OFF · Content: brand_fit/tone/clarity/CTA/language_fit · CLI: `venho validate image\|prompt\|face\|content` |
| **Module 04 — Automation Studio** | `projects/03_AI_STUDIO/venho-ai-studio/automation_studio/` | **ALL COMPLETE (2026-07-08)** · 7 tests · Plan: `VENHO_AI_STUDIO_Module_04_Automation_Studio_Plan_v1_1.md` · Điều phối M01–M03 qua adapter/registry · Config-first YAML workflows · Run lock + Resume + Dry-run + skip_dependents (BFS) · Manual gate (two-half pipeline) · CLI: `venho auto run {workflow_id}` · `venho auto resume {run_id}` |
| **Module 05 — Content Studio** | `projects/03_AI_STUDIO/venho-ai-studio/content_studio/` | **ALL 16 STEPS COMPLETE (2026-07-09)** · 22 tests · Plan: `VENHO_AI_STUDIO_Module_05_Content_Studio_Plan_v1_1.md` · Thực thi content-prompt M02 → prose draft · 8 loại: social/blog/website/OTA/FAQ/email/campaign/calendar · Prose generator hiện mock (chưa gọi AI thật) · CLI: `venho content --type {facebook,blog,...} --topic "..." --lang vi` |
| **Module 06 — Video Studio** | `projects/03_AI_STUDIO/venho-ai-studio/video_studio/` | **MVP COMPLETE (2026-07-09)** · 15 tests · Plan: `VENHO_AI_STUDIO_Module_06_Video_Studio_Plan_v1_1.md` · Pipeline đầy đủ: context → concept → storyboard → shot list → scene prompts (M02) → engine format → caption (M05) → M03 bridge → MD/JSON output → manifest · Storyboard templates theo `video_type` (social_reel/character/hotel_lifestyle/website_hero/explainer) · Shot list động theo vị trí cảnh · Engine templates được embed vào prompt (AI-facing notes) · Aspect ratio thực điền vào engine prompt · Validator bridge dùng primary env subject · CLI: `venho-video generate --topic "..." --duration 15 --type social_reel --subjects lake_view_room,westlake` |
| **Module 07 — Publishing Gateway** | `projects/03_AI_STUDIO/venho-ai-studio/publishing_gateway/` | **COMPLETE offline dry-run MVP (2026-07-09) · Code review + 10 bugs fixed (2026-07-09)** · 19 tests · Plan: `VENHO_AI_STUDIO_Module_07_Publishing_Gateway_Development_Plan_v1_2_QC.md` · Nhận package đã duyệt từ M04 → kiểm contract/approval/brand/capability → queue/adapters → delivery receipt cho M08 · Không tạo/sửa content, không quyết định giờ đăng · `--approval-secret` bắt buộc (không còn default "test-secret") · CircuitBreaker dùng module-level singleton · Idempotency key không bao gồm approval block · CLI: `venho-publish` |
| **Module 08 — Analytics & Feedback Loop** | `projects/03_AI_STUDIO/venho-ai-studio/analytics_feedback/` | **COMPLETE offline MVP (2026-07-09)** · 7 tests · Plan: `VENHO_AI_STUDIO_Module_08_Analytics_Feedback_Development_Plan_v1_2_QC.md` · Receipt M07 → collection tasks → mock metrics → unified snapshot → score/sentiment → alert/advisory/report · Advisory luôn pending approval, không tự apply vào M01/M05 · CLI: `venho-analytics` |
| **Module 09 — Agent Studio** | `projects/03_AI_STUDIO/venho-ai-studio/agent_studio/` | **COMPLETE offline planning/orchestration MVP (2026-07-09)** · 10 tests · Plan: `VENHO_AI_STUDIO_Module_09_Agent_Studio_Development_Plan_v2_2_QC.md` · Goal tự nhiên → validate request → persona/context → missing knowledge → TaskPlan → risk → ModuleRequest qua M04 · Không tự publish, không sửa Knowledge, không gọi M07 trực tiếp · CLI: `venho-agent` |
| **Module 10 — VenHo OS Dashboard** | **Repo riêng `venho-os/` (Next.js `localhost:3000/os`) — tách khỏi repo này 2026-07-14** | **COMPLETE v3.1 — Stage A+B+C + tách repo (2026-07-14)** · Toàn bộ `/os`, `bff/`, API routes `api/v1/studio/*` + `api/v1/workspaces/*`, `ops/VenHoSocialManager/`, và workflow `social-content.yml` đã chuyển sang repo `venho-os` để website `venhohotel.com` chạy độc lập, không còn chứa code dashboard · Repo `Ven Ho Hotel` này chỉ còn website public — verify sạch: `npm run lint`/`build`/`test` không lỗi, không còn import treo · **OTA-01 adapter đã wire vào `AgentsSection`/`OperationsSection`** (2026-07-14, trước khi tách) — hiển thị `ok`/`not_configured`/`unreachable` thật, đã test qua browser · **Chưa có auth middleware cho `/os`** — việc tách repo giảm rủi ro lộ qua domain public, nhưng nếu sau này deploy `venho-os` lên domain công khai vẫn cần thêm auth riêng · Chi tiết đầy đủ, secrets cần điền lại, known issue (`STUDIO_DIR` path off-by-one có sẵn từ trước): xem `venho-os/CLAUDE.md` |
| **AI Studio context** | `projects/03_AI_STUDIO/venho-ai-studio/` | `task_memory.md` — context chung M01–M10 cho AI Engine · `task_status.md` — status từng module · cập nhật mỗi khi kết thúc task |

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

**Đã chuyển sang repo `venho-os` ngày 2026-07-14** (tách dashboard VENHO OS độc lập khỏi website). Xem `venho-os/CLAUDE.md` § "VenHoSocialManager — Scripts CLI" cho toàn bộ chi tiết (CLI, AI Image Engines, reference images, workflow `.github/workflows/social-content.yml`). Skill `/tao-social-post` giờ thao tác trên thư mục `venho-os/ops/VenHoSocialManager/`, không còn trong repo này.

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
  - `git add -f` trong bước "Commit generated content" — `.gitignore` ignore toàn bộ `database/`, và git áp dụng exclude rule cho pathspec có wildcard (`**/*.json`, `**/*.txt`) trước khi resolve nên luôn khớp 0 file nếu không có `-f` (bug từng khiến job báo "All jobs have failed" dù bài đã đăng thật lên Facebook — 2026-07-08)
  - **Cron Mac cũ (`0 10 * * 1,3,5`) đã XÓA khỏi crontab** (2026-07-08) — từng chạy song song với GitHub Actions bằng code local, gây trùng rotation state vì local `.env` không có `MAKE_WEBHOOK_URL` nên âm thầm bỏ qua bước đăng Facebook. Giờ GitHub Actions là nguồn chạy duy nhất
  - **Ảnh dùng ref thật của khách sạn theo pillar** (2026-07-08): `pillars.json` có field `ref_image` (`thuong_hieu`→`Hotel-front-view.jpg` · `cong_tac`→`Lobby-1.jpeg` · `social_proof`→`Reception.jpeg` · `ho_tay`→`View-Ho-room-from-inside.png` · `am_thuc`→không dùng ref) — `generate_image()` tự chuyển sang `client.images.edit()` khi có ref thay vì text-to-image thuần (từng khiến ảnh AI không giống Ven Hồ Hotel thật)
  - **Hashtag bắt buộc không dấu** (2026-07-08) — chỉ tiếng Anh hoặc tiếng Việt không dấu (`#HoTay` không phải `#HồTây`)
- **Quy ước tên thương hiệu trong AI prompt/instructions: "Ven Ho Hotel" không dấu** (2026-07-08) — áp dụng cho `venho-ai-studio` Module 02 (Prompt Studio: `config/projects/venho_hotel/prompt_rules.yaml` và mọi `final_prompt` sinh ra), đồng bộ với quy ước hashtag không dấu ở trên. Chỉ áp dụng trong hệ thống AI prompt — **không đổi** tên hiển thị "Ven Hồ Hotel" có dấu trên website/content.ts hay tài liệu này
- Scheduled Agent theo dõi đối thủ: chạy mỗi Thứ Hai 9AM, gửi email báo cáo

---

## Việc còn lại

- [x] Tạo tài khoản Zalo OA — đã có (xác nhận 2026-07-15, trong lúc build kênh gửi P1 alert cho `venho-ota-agent` G0C-6). Còn thiếu: tạo Developer App trên developers.zalo.me để lấy App ID/Secret cho tích hợp gửi tin — xem `venho-ota-agent/task_memory.md` "'Tiếp tục G0C-6'".
