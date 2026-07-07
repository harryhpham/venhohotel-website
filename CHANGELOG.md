# Changelog — Ven Hồ Hotel Website & Ops

> Chỉ lưu thay đổi liên quan đến **website, ops automation, và hotel systems**.  
> Thay đổi về AI Studio, DNA, Universe: xem `projects/00_PROJECT_HQ/CHANGELOG.md`

---

## 2026-07-07 (5) — VENHO AI Studio: Phase 8 tests + outside DNA + venho CLI fix

- **`test_phase8.py`** (12 tests mới — Phase 8 coverage): `TestRecursiveMediaLoader` (rglob tìm ảnh trong subfolder, sorted, ignore non-image, regression test `assets/raw/room/`), `TestOpenAIProviderParam` (confirm `max_completion_tokens`, không còn `max_tokens`), `TestModelConfig` (confirm `gpt-5.5`, keys required đủ)
- **`outside` subject** — schema + DNA đầy đủ:
  - `config/projects/venho_hotel/subjects/outside.yaml` — 16 aggregation keys (space_type, lake_view, sky, furniture, railing, flooring, lighting...)
  - `config/projects/venho_hotel/subjects/outside.overrides.yaml` — 6 curated FORBIDDEN, 5 ALLOWED IMPERFECTIONS, wording_overrides
  - `VENHO_HOTEL_OUTSIDE_DNA.md` sinh từ 7 ảnh thực tế: 11 invariant · 2 variable · 1 weak (`lake_view_color` — cần thêm ảnh từ tầng cao)
- **Fix `venho` CLI global**: thêm `/Users/hanhpham/Library/Python/3.9/bin` vào `~/.zshrc` — `venho --help` hoạt động từ bất kỳ terminal nào
- **90/90 tests pass** — tăng từ 78 → 90

## 2026-07-07 (4) — VENHO AI Studio Phase 8: chạy thật với API + fix forbidden_hints

- **Xác nhận kiến trúc v2.4 (Step 0–13) chạy đúng với API thật** — GPT-4o (observe) + Claude Sonnet (consolidate), không chỉ mock.
- **Bug fix (root cause)**: 5/6 prompt subject (`observe_room.md`, `observe_facade.md`, `observe_lobby.md`, `observe_westlake.md`, `observe_linh_an.md`) thiếu định nghĩa field `notable_features`/`uncertainty`/`forbidden_hints` trong OUTPUT FORMAT → GPT-4o đoán bừa, khiến FORBIDDEN của DNA phòng bị liệt kê ngược (VD: "Curtains", "chairs" — thứ ĐANG có lại ghi là cấm). Đây chính là known issue đã ghi ở entry (2) bên dưới.
  - Fix: thêm đúng 3 field vào cả 5 prompt, khớp `observe_universal.md`.
- **Fix thêm 1 lỗ hổng liên quan**: `hashes_changed()` trong `dna_manifest.py` chỉ so hash ảnh, không so `prompt_version` → sửa prompt nhưng ảnh không đổi thì Pass 2 bị skip, DNA cũ vẫn giữ nguyên rác. Thêm `needs_regeneration()` (so cả hash + schema_version + prompt_version), cập nhật `pipeline.py` dùng hàm mới — đúng chính sách cache Master Plan §11.
- Bump `prompt_version` 1.0 → 1.1, chạy lại **6 subject bằng API thật**: `lake_view_room`, `deluxe_double`, `facade`, `lobby`, `westlake`, `linh_an` → FORBIDDEN section sạch hẳn, không còn liệt kê ngược.
- **Test Mode A với API thật lần đầu** (trước giờ chỉ có bằng chứng Mode B) — chạy đúng, output đọc được.
- **78/78 tests pass** sau toàn bộ thay đổi.
- **Còn tồn đọng**: chưa có DNA cho phòng "Tiêu Chuẩn Ba Người" (standard-triple) — chưa có ảnh/config; `room`/`room_1`/`room_2` (subject cũ trùng lặp) giữ nguyên theo yêu cầu Harry.

## 2026-07-07 (3) — VENHO AI Studio: westlake DNA + fix schema

- **Root cause fix**: `westlake.yaml` dùng `feature_keys` (grouped) thay vì `aggregation_keys` (flat) → Pass 2A có 0 invariant
  - Fix: chuyển sang `aggregation_keys` format với 17 keys (water, vegetation, infrastructure, sky, light, atmosphere)
  - Xóa 10 observation cache cũ (thiếu key injection) → re-observe fresh
- **`VENHO_HOTEL_WESTLAKE_DNA.md`** sinh thành công: 10 ảnh · 11 invariant · 5 variable · 0 weak
  - INVARIANT perfect: `water_surface_texture: calm` (100%), `water_visibility_range: far` (100%), `distant_cityscape: yes` (100%)
  - INVARIANT curated: `water_color: muted jade-teal #4E8FA0` (wording_override)
  - VARIABLE: `light_quality`, `time_of_day`, `vegetation_presence`, `lamp_post_presence`, `general_scene_character`
  - FORBIDDEN: 7 curated + 5 observed · ALLOWED IMPERFECTIONS: 5 curated + 9 observed
- **Fix `consolidate_westlake.md`**: rewrite format cũ → Pass 2B format `[{key, canonical}]` — loại bỏ 11 WARN/run
- **Fix wording_overrides** `westlake.overrides.yaml`: thêm normalize `True`→`yes` cho presence keys
- **78/78 tests pass** · tất cả 6 subjects đã có DNA: `lake_view_room` · `deluxe_double` · `lobby` · `facade` · `linh_an` · `westlake`

## 2026-07-07 (2) — VENHO AI Studio Phase 6: cache fix + DNA canonical subjects

- **Fix cache key bug**: thêm `schema_id` vào cache key (`{hash}_{schema_id}_{sv}_{pv}`)
  - Trước: 2 schemas khác nhau (room_2 vs lake_view_room) trên cùng ảnh → cache hit sai
  - Sau: mỗi schema_id có cache riêng biệt → observations đúng schema, không nhiễm chéo
- **Sinh DNA canonical subjects** mới (fresh observations, không dùng cache cũ):
  - `VENHO_HOTEL_LAKE_VIEW_ROOM_DNA.md` — 8 ảnh ViewHo-room-2 · 13 invariant · 5 variable · 8 curated forbidden
  - `VENHO_HOTEL_DELUXE_DOUBLE_DNA.md` — 4 ảnh VenHo-room-1 · 10 invariant · 8 variable · 8 curated forbidden
  - Cả hai có ALLOWED IMPERFECTIONS + CURATOR NOTES + COMPACT version
  - Overlay curated đúng: `style_category: boutique Vietnamese heritage hotel`, `hotel_tier: boutique mid-range`, `window_frame: matte black aluminum…`
- **13 tests mới** (`test_phase6.py`) · tổng: 55/55 pass
- **Known issue (TODO)**: `forbidden_hints` observed noise — AI liệt một số room features (Curtains, Window view) như forbidden hints → sẽ fix prompt trong phase tiếp theo
- `westlake` DNA: pending (chưa có ảnh)

## 2026-07-07 — Trim tài liệu + tách scope CHANGELOG

- Trim `Ven Ho Hotel/CLAUDE.md` (397 → ~320 lines): xóa 3 section duplicate với master
  - Removed: Màu sắc + Font block → 1-line pointer
  - Removed: Face Lock v3.1 full text block → 1-line pointer
  - Simplified: Brand DNA Principles (27 lines → 3 lines)
  - Fixed: stale path `projects/CHANGELOG.md` → `projects/00_PROJECT_HQ/CHANGELOG.md`
- Tách scope CHANGELOG: hotel (website/ops) vs universe (`projects/00_PROJECT_HQ/CHANGELOG.md`)
- Archive `VENHO_AI_Studio_Complete_Master_Plan_v1_2.md` → `09_ARCHIVE/`

## 2026-07-07 + 2026-06-30 — VENHO AI Studio v2.4 + v2.3

> Chi tiết đầy đủ: `projects/00_PROJECT_HQ/CHANGELOG.md`  
> Tóm tắt v2.4: English values rule · 1 subject = 1 hạng · FORBIDDEN = policy · Curated Overlay · ALLOWED IMPERFECTIONS · QC gate 07F · contract_version 1.1 · 23/23 tests pass  
> Tóm tắt v2.3: Mode A + Mode B · Pass 2A tất định · DNA Regeneration · 6 DNA files cho venho_hotel · 21/21 tests pass

## 2026-06-28 (3) — VenHoSocialManager — chuyển cron Mac → GitHub Actions
- Tạo `.github/workflows/social-content.yml`: schedule T2/T4/T6 3:00 UTC (10:00 AM Vietnam)
- 3 GitHub Secrets: `OPENAI_API_KEY`, `SOCIAL_GMAIL_SENDER`, `SOCIAL_GMAIL_APP_PASS`
- Fix bug `KeyError: 'pillar_id'` trong `update_index()`
- Fix lỗi 403 commit: thêm `permissions: contents: write` vào workflow
- Fix email thiếu ảnh: nhúng ảnh AI inline (MIMEImage CID) — không cần Drive
- Kết quả: workflow ~4 phút, email kèm ảnh preview đầy đủ

## 2026-06-24 (4) — Location Reference + Room DNA — nâng cấp `/tao-anh-ai`
- Harry upload 2 ảnh phòng thực: `View-Ho-room.jpg` + `View-Ho-Room-from-inside.jpeg`
- Harry upload `Logo.JPG` — logo Ven Hồ Hotel
- Convert 3 file JPEG → PNG (yêu cầu `--ref-env`)
- Fix Hotel Room environment block trong skill `/tao-anh-ai`: block cũ sai (cream palette, floor-to-ceiling window) → block mới đúng thực tế
- Thêm Logo block + Negative Prompt cập nhật
- Cập nhật Reference table trong skill + `CLAUDE.md`

## 2026-06-24 (3) — `/tao-anh-ai` production session + dual reference
- 4 ảnh hoàng hôn rooftop (Linh An · Outfit B · square 1:1)
- Feedback: portrait đơn giản 9/10, many props + wide shot → AI feel, Hồ Tây chưa giống thực
- Harry upload 3 ảnh rooftop thực vào `assets/`
- Nâng cấp `generate_image.py`: thêm `--ref-env <path>` — dual reference (face + env)
- Test dual ref: lan can đen, gạch đỏ, skyline authentic — rõ rệt hơn text-only

## 2026-06-28 (2) — 4 ảnh AI mới (West Lake Café + Hoàng hôn Hồ Tây)
- Batch 1: Linh An West Lake Café · 16:9 · `--ref linh-an-master-face.png`
- Batch 2: Hoàng hôn Hồ Tây rooftop · Square · text-to-image (no --ref)
- Google Drive token hết hạn — đã xóa `token.json`, re-auth xong

## 2026-06-28 — Fix — Disable scheduled cloud routine lỗi 8AM
- Routine cũ cố scrape SkyHotel từ cloud → bị proxy chặn 403
- Disable routine — GitHub Actions `daily-revenue.yml` đã làm đúng ở 9AM
- Routine theo dõi đối thủ giữ nguyên (chỉ dùng web search)

## 2026-06-26 (2) — AI Agent — Phiếu Chi + Monthly Summary
- Thêm section Phiếu Chi vào email báo cáo ngày
- Tạo `.github/workflows/monthly-summary.yml` — 10AM ngày 1 mỗi tháng
- Viết lại `skyhotel-scraper.py`: thêm `navigate_to_phieu_chi()`, `parse_phieu_chi()`, `build_monthly_email()`
- Test 2 workflows → pass ✓

## 2026-06-26 — GitHub Actions — Daily Revenue Report
- `.github/workflows/daily-revenue.yml` — 9:00 AM (UTC+7) mỗi ngày, chạy cloud
- 4 GitHub Secrets: SKYHOTEL_USER, SKYHOTEL_PASS, GMAIL_USER, GMAIL_APP_PASS

## 2026-06-24 (2) — Linh An Image Generation — nâng cấp sang `images.edit()` + reference
- text-to-image: 6–8.4/10; `images.edit()` + reference: **9/10**
- Nâng cấp `generate_image.py`: thêm `--ref <path>` flag
- Nâng cấp `google_drive.py`: SKIP → UPDATE
- Thêm 5 reference images vào `assets/`: `linh-an-master-face.png`, A2, B3, C, D
- Cập nhật skill `/tao-social-post`: bắt buộc `--ref` khi `linh_an: true`

## 2026-06-22 (2) — Fix AI Agent — báo cáo miss khi Mac reboot
- launchd thêm lịch dự phòng 10:30 AM
- Thêm lock file `/tmp/venho-revenue-YYYY-MM-DD.lock` → chống gửi đôi

## 2026-06-21 (2) — Hồ Tây Image DNA + Trigger "Kết thúc Task"
- Tạo `ops/ho-tay-image-dna.md`: màu nước jade-teal `#4E8FA0`, identity block đầy đủ
- Thêm trigger "Kết thúc Task" vào quy tắc làm việc `CLAUDE.md`

## 2026-06-21 — Fix VenHoSocialManager + Fix AI Agent
- `send_email.py`: tự scan folder mới nhất, không phụ thuộc `index.json`
- `google_drive.py`: thêm CLI `upload <folder>`
- Skill `/tao-social-post`: thêm Bước 5b (upload Drive, cập nhật `meta.json`, `index.json`)
- Fix AI Agent: plist trỏ đường dẫn cũ `AI Agent/` → `ops/ai-agent/`; Gmail App Password cập nhật

## 2026-06-20 — Fix AI Agent + VenHoSocialManager v1
- Chuyển cron → launchd: `com.venhohotel.daily-revenue.plist`
- VenHoSocialManager: pipeline GPT → gpt-image-1 → Drive → email · 5 pillars · cron T2/T4/T6 10AM

## 2026-06-19 — Migration Windows → macOS + Song ngữ EN/VI + OTA Integration
- Homebrew + Node v20.20.2 · Playwright + Chromium cài lại
- 6 file Windows (.ps1/.bat) → 5 bash scripts (.sh) · launchd OK
- Fix song ngữ: 4 trang con → Client Components; 6 section EN trong `content.ts`; `rooms.ts` thêm EN fields
- Cập nhật giá: Deluxe 400k, Lake View 600k, Triple 500k
- `src/lib/data/ota.ts` — `agodaUrl()` / `bookingUrl()` với UTM; GA4 events OTA click

## 2026-06-15 — Phân Tích Đối Thủ + AI Agent Doanh Thu + SEO
- 5 đối thủ Tây Hồ; Scheduled Agent Thứ Hai 9AM → email báo cáo
- AI Agent: Playwright scrape SkyHotel PMS → parse Excel → email
- SEO: robots.ts, sitemap.ts (9 URLs), JsonLd.tsx; build 16/16 pass

## 2026-06-10 — GA4 + Resend Email + Debug Build
- GA4 Measurement ID `G-4242ESCGY7` · conversion events: generate_lead, phone_click
- Resend: verify domain venhohotel.com; sender no-reply@venhohotel.com
- Fix: resend@6 yêu cầu Node ≥20 → `engines` trong `package.json`

## 2026-06-09 — Launch
- Form đặt phòng kết nối Resend (`POST /api/booking`)
- Deploy Vercel → **venhohotel.com** live

## 2026-06-04 — Website v1.0
- 7 trang hoàn chỉnh, build clean
- VI/EN language switcher · Gallery + lightbox + auto-slideshow 10s
- Mobile responsive · SEO metadata · JSON-LD schema
