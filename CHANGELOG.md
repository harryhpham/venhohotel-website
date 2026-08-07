# Changelog — Ven Hồ Hotel Website & Ops

> Chỉ lưu thay đổi liên quan đến **website, ops automation, và hotel systems**.  
> Thay đổi về AI Studio, DNA, Universe: xem `projects/00_PROJECT_HQ/CHANGELOG.md`

---

## 2026-07-23 — venho-auto: đóng gap kiến trúc api_generic + tối ưu chi phí/thời gian

- Phân tích lại chi phí VENHO Runtime Agent v2.0 sau khi thấy 1/12 task tốn hơn $100:
  nguyên nhân chính là **số lần retry hội tụ kém** (VENHO-002 mất 41 attempt vì mỗi lần
  retry làm lại worktree từ đầu), không phải giá model. Tài liệu:
  `venho-auto/docs/VENHO_AUTO_COST_TIME_OPTIMIZATION_v1.md`.
- **A1/A2**: `venho-auto worker reentry --mode {dev-fix,pm-only,verify-only}` — tái dùng
  worktree có sẵn thay vì làm lại từ đầu mỗi lần retry sau `HUMAN_REVIEW`.
- **B1**: PM Reviewer chuyển từ Claude Opus 4.8 sang `deepseek-v4-pro-pm` (rẻ hơn ~21 lần)
  — đã có sẵn trong config `venho-os.json` nhưng bị khoá vì thiếu bảng giá; mở khoá + phát
  hiện, sửa 1 bug thật (`api_generic` gửi sai `response_format`, DeepSeek từ chối request).
- **Đóng gap kiến trúc**: `api_generic` trước đó chỉ có 1 slot `base_url`/`api_key` dùng
  chung cho mọi alias — bật `deepseek-v4-pro-pm` cùng lúc với `claude-pm` sẽ khiến 1 trong
  2 âm thầm gửi nhầm endpoint. Thêm `ModelRegistryEntry.api_generic_provider` để mỗi
  provider (`deepseek`, `anthropic`) có slot cấu hình riêng. Khi nối `claude-pm` vào
  Anthropic thật (Harry xác nhận Anthropic có endpoint OpenAI-compatible), phát hiện thêm
  1 bug thật: Anthropic và DeepSeek đòi `response_format` **ngược nhau** — đã sửa thành
  cấu hình theo từng provider, live-verify cả 2 chiều bằng gọi API thật (curl + full
  production code path, cả Opus lẫn DeepSeek đều trả về payload đúng schema).
- `make verify`: 561 test xanh. Chi tiết đầy đủ: `venho-auto/task_status.md`/
  `task_memory.md` mục 2026-07-23.

## 2026-07-17 — Xoá route callback Zalo OA tạm (đã huỷ hẳn tích hợp Zalo)

- `venho-ota-agent`'s Zalo OA (G0C-6 P1-alert channel) chuyển từ "tạm dừng" (2026-07-15)
  sang **huỷ hẳn** — email là kênh duy nhất từ giờ.
- Xoá `src/app/api/zalo-oauth-callback/route.ts` — route bootstrap tạm, comment gốc đã
  nói "nên xoá khi có refresh token lần đầu"; giả định "tạm dừng, chưa bỏ" không còn đúng.
- `npm run build` verify sạch sau khi xoá.
- Chi tiết đầy đủ (script/env vars/tokens bị xoá): xem `projects/venho-ota-agent/CHANGELOG.md`.

## 2026-07-16 — venho-auto tách thành repo độc lập

- venho-auto là project độc lập, không liên quan website/AI Studio — chuyển
  `07_AUTOMATION/venho-auto/` ra `projects/venho-auto/` bằng `git subtree split`, **giữ
  nguyên toàn bộ lịch sử commit** (16 commit riêng của thư mục này), rồi `git rm` khỏi
  repo `Ven Ho Hotel`. Cùng pattern đã dùng để tách `venho-os` ngày 2026-07-14
- Đã verify `make verify` chạy sạch (266 test) ngay tại vị trí mới trước khi xoá bản cũ
- Từ nay xem `projects/venho-auto/CLAUDE.md`, `task_status.md`, `task_memory.md` cho mọi
  cập nhật venho-auto — không còn nằm trong changelog của repo này

## 2026-07-16 — venho-auto: real Claude Code CLI verify E2E thật + vá lỗ hổng HUMAN_REVIEW

### Real Claude Code CLI — verify E2E thật lần đầu (venho-auto)
- Cài `@anthropic-ai/claude-code` (2.1.197) và chạy thật (không mock) `venho-auto worker run-attempt --dev-provider claude-code --pm-provider claude-code` nhắm vào throwaway fixture repo (không bao giờ nhắm vào chính `venho-auto`, theo §23.0)
- **Bug quan trọng tìm được và sửa**: field `$schema`/`$id` trong JSON Schema (dùng cho `--json-schema`) khiến `claude` CLI **âm thầm** không đăng ký tool `StructuredOutput` — không lỗi, exit code 0, tool chỉ biến mất khỏi session. Root-cause bằng A/B test có kiểm soát trên chính binary thật (0/2 khi có 2 field, 3/3 khi bỏ). Sửa tại `JsonSchemaRegistry.canonical_schema_json()` — loại 2 field này trước khi gửi cho provider, giữ nguyên validate nội bộ
- Sau fix: 1 vòng Dev→PM→commit chạy trọn vẹn qua CLI thật, commit thật lên fixture repo với đúng trailer `Venho-Run`/`Venho-Task`/`Venho-Attempt` — lần đầu tiên quan sát được cả pipeline chạy không gián đoạn
- Thêm test hồi quy; `make verify` sạch 261 test (từ 260)

### HumanReviewService — vá lỗ hổng HUMAN_REVIEW không có lối thoát (venho-auto)
- **Vấn đề phát hiện trong lúc verify trên**: task rơi vào `HUMAN_REVIEW` (provider lỗi, hết budget...) không có cách nào resume — endpoint API là stub vĩnh viễn từ Phase 1, chưa từng nối dù comment tự nhận "bắt đầu ở Phase 6" (Phase 6 đã xong từ lâu). Cách duy nhất là tạo run mới hoàn toàn
- **Giải pháp**: `HumanReviewService.resolve()` mới — map `resume`/`skip`/`cancel` sang đúng state-machine event có sẵn, nối vào API route thật + lệnh CLI mới `venho-auto task human-action`
- Verify bằng CLI round-trip thật: claim task → ép vào HUMAN_REVIEW → resume → claim lại thành công cùng `run_task_id`
- 5 test tích hợp mới; `make verify` sạch 266 test (từ 261)

Chi tiết đầy đủ (bug list, code, test): `07_AUTOMATION/venho-auto/task_status.md`

---

## 2026-07-15 — VenHoSocialManager QC Gate + M05 real generator + VenHo OS STUDIO_DIR fix

### VenHoSocialManager — QC Gate với auto-retry (venho-os)
- **Vấn đề:** ảnh sinh bởi gpt-image-2 không qua bước kiểm tra nào trước khi đăng Facebook
- **Giải pháp:** thêm QC gate dùng GPT-4o-mini vision vào `generate_content.py`:
  - `qc_image()` — gửi ảnh + REAL_SPACE_FACTS + UNIVERSAL_NEGATIVE_CONSTRAINTS → GPT-4o-mini → score 1–10
  - `generate_image_with_qc()` — generate → QC → nếu fail → tighten prompt → retry (max 2 lần)
  - Nếu fail sau 3 lần: skip Drive upload + Make.com, gửi QC alert email cho Harry
  - Threshold: score ≥ 7 = pass; score < 7 = retry
- **`send_qc_alert()`** thêm vào `send_email.py` — email đỏ với score/violations/folder path
- Chi phí thêm: ~1–2 cent/lần chạy (1 GPT-4o-mini call; tối đa 3 nếu retry hết lần)

### M05 Content Studio — Real Claude generator (venho-ai-studio)
- Tạo `content_studio/generators/` — `claude_longform_generator()` gọi `claude-sonnet-5` tại `temperature=0`
- 5 content types (blog/OTA/FAQ/email/website) mỗi type có JSON schema riêng gửi cho Claude
- Longform builders nhận `generator_fn` optional — `None` → mock template cũ (423/423 tests pass)
- Social posts không thay đổi — VenHoSocialManager xử lý end-to-end

### VenHo OS — Fix STUDIO_DIR off-by-one (venho-os)
- `venho-os/src/lib/studio/paths.ts`: đổi `../../03_AI_STUDIO` → `../03_AI_STUDIO`
- Sau fix: DNA API trả 11 subjects, vault-search trả 14 results, single subject DNA load đúng
- Đây là bug documented từ khi tách repo (2026-07-14), giờ mới fix

---

## 2026-07-28 — Fix vĩnh viễn email doanh thu gửi đôi + tắt cloud routine lỗi

### Email gửi đôi — fix vĩnh viễn (Ven Hồ Hotel ops)
- **Nguyên nhân gốc**: launchd local (`com.venhohotel.daily-revenue`) chạy song song GitHub Actions — cả 2 gửi email. `launchctl unload` (fix ngày 2026-07-15) chỉ hiệu lực trong session hiện tại, macOS auto-register lại plist sau login/reboot nên email đôi vẫn tiếp tục.
- **Giải pháp vĩnh viễn**:
  1. `launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.venhohotel.daily-revenue.plist` — eject hoàn toàn khỏi launchd
  2. `mv ~/Library/LaunchAgents/com.venhohotel.daily-revenue.plist ~/Library/LaunchAgents/_disabled/` — ra khỏi auto-load directory (plist vẫn giữ để restore nếu cần)
- Verify: `launchctl list | grep daily-revenue` trả về rỗng. GitHub Actions là nguồn duy nhất từ nay.

### Cloud routine lỗi — tắt (Ven Hồ Hotel ops)
- **Vấn đề**: Routine CCR `trig_01YVD8GP1HiyZQtKmmb8inbH` ("Ven Hồ — Báo Cáo Doanh Thu Hàng Ngày", tạo từ 2026-06-15) gửi thông báo lỗi 8h sáng hàng ngày vì cố kết nối tới `admin1.skyhotel.vn` từ môi trường Anthropic cloud — bị block bởi proxy policy (403).
- **Giải pháp**: cập nhật `enabled: false` qua RemoteTrigger tool. Xóa hẳn: `https://claude.ai/code/routines` (phải làm thủ công, không xóa được qua tool).
- GitHub Actions (`daily-revenue.yml`) chạy từ GitHub infrastructure — không bị proxy block, là nguồn scrape SkyHotel duy nhất hoạt động.

---

## 2026-07-15 — Fix email báo cáo doanh thu gửi đôi (attempt 1 — không đủ)

- Chẩn đoán đúng: launchd local chạy song song GitHub Actions, lock file không chặn được.
- Fix ban đầu `launchctl unload` không vĩnh viễn — xem entry 2026-07-28 cho fix thật.

## 2026-07-14 — Wiring OTA vào VENHO OS + tách dashboard sang repo `venho-os`

- **Wiring UI**: `AgentsSection.tsx`/`OperationsSection.tsx` giờ gọi `getOtaAgentSnapshot()` thật (thêm `OtaAgentStatusCard.tsx` dùng chung) thay vì placeholder tĩnh — hiển thị 3 trạng thái `ok`/`not_configured`/`unreachable`, đã verify qua browser (`localhost:3000/os?section=agents|operations`), `npm run lint`/`build` sạch.
- **Tách repo**: theo yêu cầu Harry ("từ nay website chạy độc lập"), toàn bộ Module 10 VENHO OS Dashboard (`src/app/os/`, `src/components/os/`, `src/bff/home/`, `src/bff/ota/`, `src/lib/studio/`, `src/shared/kernel/freshness.ts`, `src/modules/execution/domain/focus-scoring.ts`, `src/modules/module-registry/.../resolve-quick-actions.ts`, API routes `api/v1/studio/*` + `api/v1/workspaces/*`, toàn bộ `ops/VenHoSocialManager/`, workflow `.github/workflows/social-content.yml`, và 3 file test liên quan) đã chuyển sang **repo mới `venho-os`** (`/Users/hanhpham/Developer/Claude-Workspace/projects/venho-os`).
- **Secrets không mang theo** — quyết định của Harry: `ops/VenHoSocialManager/.env`, `credentials.json`, `token.json` (chưa từng nằm trong git, chỉ trên đĩa) và GitHub Actions secrets của `social-content.yml` không copy sang repo mới; cần điền lại thật trong `venho-os` (danh sách đầy đủ trong `venho-os/CLAUDE.md`).
- Copy an toàn: dùng `git archive HEAD` để chỉ export file đã track trong git (tự động loại bỏ mọi thứ bị `.gitignore`), cộng thêm rsync thủ công phần dữ liệu thật chưa track nhưng cần thiết (ảnh reference AI, ảnh đã generate, log, bài social cũ) — loại trừ rõ ràng `.env`/`credentials.json`/`token.json`.
- Verify cả 2 phía: `venho-os` — `npm install && npm run build && npm run lint && npm run test` (10 route build sạch, 3 test file/25 test pass) + test thật `localhost:3000/os`, `/os?section=agents`, `/api/v1/studio/social-index` (đọc đúng database đã copy). `Ven Ho Hotel` sau khi xóa — `npm run build`/`lint` sạch, không còn import treo, route `/os` đã biến mất khỏi build output.
- Cập nhật `CLAUDE.md` (cả `Ven Ho Hotel` và `projects/` master) trỏ sang `venho-os/CLAUDE.md`; cập nhật 2 launcher script `run-venho-os.sh`/`.command` trỏ sang thư mục mới.
- **Phát hiện phụ (chưa tự sửa, đã flag trong `venho-os/CLAUDE.md`)**: `src/lib/studio/paths.ts`'s `STUDIO_DIR` dùng `../../03_AI_STUDIO/venho-ai-studio` — sai 1 cấp so với vị trí thật (`../03_AI_STUDIO/venho-ai-studio`), bug này đã tồn tại từ trước khi tách repo, không phải regression — nghĩa là Knowledge section (DNA/vault-search) có thể chưa từng đọc đúng file kể từ khi viết.
- Chưa làm: chưa deploy `venho-os` lên đâu cả (vẫn chỉ chạy `npm run dev` local); chưa bật lại workflow `social-content.yml` (thiếu secrets thật); chưa thêm auth middleware cho `/os`.

## 2026-07-13 — OTA-01 agent adapter (src/bff/ota/) — kết nối VENHO OS tới venho-ota-agent

- **`src/bff/ota/ota-agent.dto.ts` + `ota-agent.client.ts` + `ota-agent.query.ts`** — BFF adapter server-only gọi Internal API của `venho-ota-agent` (repo riêng, headless) theo đúng `venho-ota-agent/docs/MOTHER_DASHBOARD_CONTRACT.md`: bearer token từ env (`OTA_AGENT_BASE_URL`, `OTA_AGENT_API_TOKEN`), timeout 3s, không bao giờ throw ra ngoài — trả `state: "ok"|"unreachable"|"not_configured"` để agent chết/chưa cấu hình không làm crash Mother Dashboard.
- Thêm dependency `server-only` để ép module này không thể lọt vào client bundle.
- Test: `tests/unit/bff/ota/ota-agent.query.test.ts` (mock fetch, 4 case: not_configured/ok/unreachable-network/unreachable-http). Đã smoke-test thật với server `venho-ota-agent` compiled đang chạy (`node packages/api/dist/server.js`) — adapter đọc đúng `mode: PAUSED` qua HTTP thật, không chỉ mock.
- Thêm alias `server-only` → stub trong `vitest.config.ts` (Next.js tự alias module này khi build cho server, nhưng vitest thuần cần alias thủ công mới test được).
- Tạo `.env.example` (chưa từng có trong repo) ghi lại `OTA_AGENT_BASE_URL`/`OTA_AGENT_API_TOKEN`.
- **Chưa làm**: chưa wire `getOtaAgentSnapshot()` vào `AgentsSection`/`OperationsSection` hay `home-snapshot.query.ts` — hai section đó vẫn đang là placeholder "Stage C" có chủ đích, nối dữ liệu thật vào UI là bước tiếp theo, chưa phải việc hôm nay.

---

## 2026-07-13 — Xóa Streamlit M10 Dashboard — VenHo OS Next.js là UI duy nhất

### Dọn dẹp Streamlit (venho-ai-studio)
Streamlit đã được thay thế hoàn toàn bởi VenHo OS Next.js (`localhost:3000/os`). Xóa:
- `ui/studio_app.py` + `ui/` directory (2.335 dòng)
- `dashboard/gateway.py` + `dashboard/__init__.py` + `dashboard/` directory (774 dòng)
- `tests/test_dashboard.py` (149 dòng — test cho module đã xóa)
- `docs/how_to_run_studio_ui.md` (63 dòng — doc Streamlit)

Test suite: 430 → 423 tests (7 dashboard tests đã remove, không có regression).

**Cập nhật docs:** CLAUDE.md (Ven Hồ Hotel + Master) bỏ `localhost:8501`, chỉ còn `localhost:3000/os`.

---

## 2026-07-13 — VenHo OS Next.js Dashboard — Stage A+B+C Complete + Cleanup

### VenHo OS — Next.js Dashboard (`src/app/os/`)
Migrate toàn bộ Mother Dashboard (Streamlit) sang Next.js 16 App Router tại `localhost:3000/os`.  
Architecture: RSC page (`os/page.tsx`) → section components, section routing qua `?section=` query param.

**Stage A — Section Routing**
- Sidebar navigation 9 items: Home Workspace, Workbench, Creative Studio, Knowledge, Projects, Tasks, Agents, Operations, Publishing, Reports, Settings
- `SidebarNavigation.tsx` dùng `<Link>` từ `next/link`, active state với blue dot indicator
- `WorkspaceHeader.tsx` hiển thị section title động
- 8 placeholder sections với `PlaceholderSection` component

**Stage B — Workbench + Creative Studio (tools thật)**
- `src/lib/studio/paths.ts` — path constants (venho-ai-studio, VenHoSocialManager, video scripts)
- `src/lib/studio/constants.ts` — port toàn bộ data constants từ Python (outfits, env blocks, pillars, scenes)
- `src/lib/studio/prompt-builder.ts` — port 3 hàm logic thuần: `assembleImagePrompt`, `buildCaptionPrompt`, `generateVideoScript`
- **API Routes**: `observe` (SSE streaming `venho vision observe`), `generate-image`, `file` (serve local files), `save-script`
- **WorkbenchSection**: Mode A (Observe) + Mode B (Build DNA) với live log streaming (`LiveLog.tsx`)
- **CreativeStudioSection**: Tạo Ảnh AI + Tạo Social Post + Tạo Video Script

**Stage C — Knowledge + Reports (real data)**
- **API Routes**: `dna` (list subjects + read COMPACT), `vault-search` (full-text search DNA), `social-index` (social post history)
- **KnowledgeSection**: DNA Library (7 subjects, 3 colored blocks INVARIANT/ALLOWED/FORBIDDEN + manifest bar) + Vault Search (highlighted results grouped by subject) + Mode C Linh An DNA
- **ReportsSection**: DNA Status (4 summary cards + subjects table) + Social Content Log (entries từ `database/index.json`, filter pillar, Drive link)

**Cleanup**
- `src/components/os/shared/ui.tsx` — shared UI primitives (`SectionHeader`, `Field`, `PrimaryBtn`, `CopyBtn`, `TabBar`, `inputCls`, `textareaCls`); xóa duplicate definitions trong 4 section files
- Xóa `src/shared/kernel/result.ts` + `tests/unit/shared/kernel/result.test.ts` — dead code, không được import
- Xóa `SCENARIO_SUBJECT` unused import, xóa `selectCls` alias vô nghĩa trong CreativeStudio
- Build: ✓ 34/34 pages, 0 TypeScript error

### run-venho-os.command (fix)
- Đổi từ `.sh` → `.command` — macOS Finder chạy `.command` trong Terminal khi double-click; `.sh` chỉ mở text editor

---

## 2026-07-13 — Mother Dashboard v1.0 + Tạo Ảnh AI prompt fix

### Mother Dashboard v1.0 (ui/studio_app.py) — tên chính thức đặt bởi Harry 2026-07-13
- **Single sidebar nav** — xóa outer `mode` radio 7 mục, thay bằng 1 sidebar duy nhất 9 items theo spec (Home Workspace → Settings)
- **Inter font** — CSS `@import` Google Fonts + `font-family: 'Inter', sans-serif` toàn app
- **Creative Studio → 4 tabs**: Skills | Tạo Ảnh AI | Tạo Social Post | Tạo Video Script — tools thật thay vì placeholder
- **Workbench → 3 tabs**: Pipeline View | Observe — Mode A | Build DNA — Mode B
- **Quick Actions functional** — `st.button` thật với `_m10_nav_pending` pattern (fix `StreamlitAPIException: cannot modify after widget instantiated`)

### Tạo Ảnh AI — 2 bug fixes
- **Bug 1 (Textarea cache)** — bỏ `key="tai_prompt"`, textarea luôn reflect inputs hiện tại. Trước: session state cache giữ prompt cũ → user thay outfit/action → prompt không update → ảnh thiếu Linh An
- **Bug 2 (Prompt structure action mode)** — character + environment giờ join `\n` (1 dòng) thành 1 block duy nhất thay vì `\n\n` riêng → gpt-image-2 không còn coi chúng là 2 entity tách biệt → Linh An xuất hiện trong ảnh
- **Outfit E — Nike AeroSwift** — cập nhật từ ảnh thật: `mint-green Nike racerback loose crop tank top, dual Swoosh logos at collar, perforated ventilation panels on chest and back, mint-green Nike running shorts (3-inch inseam) with mesh waistband and small Swoosh logo on leg, white Nike running shoes, white ankle socks, sleek high ponytail`

---

## 2026-07-11 — Mode C: Linh An DNA Studio + Linh An DNA System v3.1 rollout

### Mode C — Linh An DNA Studio (ui/studio_app.py)
- **Tab mới "Linh An DNA — Mode C"** trong Workbench — tách biệt với Mode B (Ven Hồ Hotel)
- Project `linh_an` độc lập: subjects = outfit wardrobe, DNA output vào `data/projects/linh_an/knowledge/`
- **6 schema files mới** trong `config/projects/linh_an/subjects/`: `wardrobe.yaml` (base, 22 keys) + 5 preset outfits (`outfit_a_cafe`, `outfit_b_west_lake`, `outfit_c_street`, `outfit_d_business`, `outfit_e_sport`)
- Workflow: chọn outfit category → upload ảnh trang phục/style reference → run pipeline → DNA text + prompt_snippet
- Tab "Wardrobe DNA Library" hiển thị tất cả outfit DNA đã có
- Hỗ trợ "New Outfit" tự đặt tên tùy ý (snake_case)

### Linh An DNA System v3.1 — propagate ra toàn hệ thống
- **Small pearl drop earrings** (signature, present in every image) — thêm vào Face Lock tất cả files
- **Face Lock canonical** đồng bộ 9+ files: `very subtle outer corner lift, natural eye asymmetry`, `very subtle upward lip corners, slightly shorter philtrum`
- **Rule 06** — "Beauty enhancement must never override character identity" (07A v3.1)
- **Facial Impression DNA** section mới — Primary/Secondary impression, Avoid
- Skill `tao-anh-ai.md` update: engine selector table (GPT Image 2 vs Google Flow), QC Scoring 4b (kill-switch + verdict threshold), reference table thêm 07B/07C/07E/07F
- Files updated: `01_LINH_AN_VISUAL_DNA_v3.0.md`, `appearance.md`, `photo-engine.md`, `photo-templates.md`, `seedance-templates.md`, `veo-templates.md`, `tao-social-post.md`, `tao-anh-ai.md`, `projects/CLAUDE.md`, `Ven Ho Hotel/CLAUDE.md`

---

## 2026-07-10 — Creative Studio: action prompt v2 + outfit Sport & Active

- **Action prompt formula v2** (`ui/studio_app.py`): đổi từ `\n\n` block tách đôi sang một câu liên tục duy nhất — gpt-image-2 treats `\n\n` là paragraph separator, làm character block trở thành entity độc lập và nhân vật biến mất. Giờ dùng `"Linh An {action}, she is a Vietnamese female lifestyle influencer, 24 years old, ... MAIN SUBJECT in the foreground, full body visible, no conical hat, photorealistic."` — tất cả một câu
- **Lens 85mm → 35mm cho action shots** — 85mm portrait lens crop tight vào face/vai, không render full body khi cần thấy xe đạp; 35mm cho full body visible
- **Outfit mới E — Sport & Active** — `light pastel-green fitted sports top, slim-fit black cycling leggings, white sneakers`; khi chọn E hair tự đổi sang ponytail (validated: phù hợp hơn cho cycling vs center part)
- **Extra negatives cho action mode** — no conical hat on main subject, no dark work clothes, no decorative ornate wrought-iron railing
- **Test validated** (chạy thực tế với gpt-image-2): Linh An xuất hiện đúng trên xe đạp, trang phục thể thao, tóc đuôi ngựa, cảnh bên hồ Hà Nội — commit `3a9be1c`, `fc3e31c`

---

## 2026-07-09 — Creative Studio tích hợp vào Streamlit UI (M10)

- **3 mode Creative Studio mới** trong sidebar `ui/studio_app.py` (localhost:8501):
  - **Tạo Ảnh AI** — form topic/scenario/outfit/action → assemble prompt → chạy `generate_image.py` subprocess → hiển thị ảnh kết quả ngay trong UI; hỗ trợ 1–4 ảnh/batch
  - **Tạo Social Post** — phân tích Content Strategy v2.0 (persona/funnel/golden rule) tự động theo pillar; sinh sẵn prompt template để Harry copy sang ChatGPT viết 3 caption (FB/IG/Threads); tạo ảnh AI kèm lưu `meta.json`
  - **Tạo Video Script** — tự detect số thứ tự script tiếp theo; sinh script 3 scene × Seedance prompt đầy đủ; preview trong UI + nút Lưu file `.md` vào `local-generated/social-video/scripts/`

- **Fix `BASE_DIR = Path(__file__).resolve().parent.parent`** — Streamlit truyền `__file__` dạng relative (`ui/studio_app.py`) khiến `SOCIAL_MANAGER_DIR` thành relative path không tồn tại (`Ven Ho Hotel/ops/VenHoSocialManager`); `.resolve()` fix absolute path

- **Timeout tăng 120s → 300s** cho subprocess `generate_image.py` (gpt-image-2 + `--ref` thường mất 90–150s)

- **Action-first prompt assembly** — khi user nhập action, action dẫn đầu prompt (dòng 1); default pose `"10-20 degree soft hero left angle / Living Expression"` bị strip khỏi Face Lock; trước đó action bị chôn sau 20 dòng Face Lock nên bị bỏ qua

- **`use_ref` toggle** — checkbox "Dùng reference image": bật (mặc định) = dùng `--ref` cho portrait/standing (face consistency 9/10); tắt = text-to-image không `--ref` cho full-body action (đạp xe, chạy, ngồi) — face consistency 7–8.5 nhưng pose tự do

---

## 2026-07-08 (2) — Fix bug commit state, xóa cron trùng, ảnh + hashtag đúng chuẩn

- **Sự cố "All jobs have failed"** (run GitHub Actions đầu tiên sau khi bật lại Drive): bài thực ra **đã đăng thành công lên Facebook** (Make trả `HTTP 200 Accepted`), job chỉ fail ở bước cuối "Commit generated content"
  - Root cause: `.gitignore` ignore toàn bộ `ops/VenHoSocialManager/database/`; git áp dụng exclude rule cho pathspec có wildcard (`'database/**/*.json'`, `'database/**/*.txt'`) TRƯỚC KHI resolve, nên luôn khớp 0 file dù có hàng chục file thật tồn tại (verify bằng `git add --dry-run`, tái hiện được lỗi cục bộ)
  - Fix: thêm `-f` vào `git add` trong workflow — bypass `.gitignore` cho các file text/json này (không ảnh hưởng `image.png`, vẫn không commit ảnh)
  - Khôi phục thủ công `rotation_state.json`/`index.json`/`index.md` khớp đúng bài đã đăng thật (đánh dấu `status: "posted"`) vì bước commit lỗi nên state chưa từng được lưu — tránh Thứ 6 lặp lại đúng slot
- **Phát hiện cron Mac cũ (`0 10 * * 1,3,5`) gây xung đột thật**: chạy song song với GitHub Actions bằng code local (đã update), tạo content + upload Drive thật, nhưng **âm thầm bỏ qua bước đăng Facebook** vì `.env` local không có `MAKE_WEBHOOK_URL` (secret đó chỉ có trên GitHub) → tốn 1 slot rotation local không đăng được gì. Đã revert state trùng + **xóa hẳn cron này khỏi crontab** — giờ chỉ còn GitHub Actions là nguồn chạy duy nhất
- **Fix chất lượng nội dung** theo phản hồi Harry:
  - Hashtag có dấu tiếng Việt (`#HồTây`) không đúng chuẩn → sửa system prompt bắt buộc không dấu (`#HoTay`)
  - Ảnh AI không giống Ven Hồ Hotel thật (do `generate_content.py` gọi `gpt-image-2` text-to-image thuần, không như skill `/tao-anh-ai` luôn dùng `--ref-env`) → thêm field `ref_image` cho từng pillar trong `pillars.json` (`thuong_hieu`→`Hotel-front-view.jpg` · `cong_tac`→`Lobby-1.jpeg` · `social_proof`→`Reception.jpeg` · `ho_tay`→`View-Ho-room-from-inside.png` · `am_thuc`→không dùng ref), `generate_image()` tự chuyển sang `client.images.edit()` khi pillar có ref
- **Test end-to-end xác nhận qua GitHub Actions workflow_dispatch** (pillar `am_thuc`, gặp lỗi OpenAI quota giữa chừng — Harry nạp credit — chạy lại thành công): hashtag đúng không dấu, Make đăng Facebook thành công (`HTTP 200`), bước commit state chạy đúng (không cần can thiệp tay)
- Còn tồn đọng: fix ảnh dùng `ref_image` chưa được test thật (slot `am_thuc` không dùng ref) — sẽ tự xác nhận ở lần chạy tiếp theo rơi vào pillar có ref

## 2026-07-08 — Make.com tự đăng Facebook: JSON + Google Drive image URL

- Harry tạo tài khoản Make.com, dựng scenario 3 module: `Webhooks (Custom webhook)` → `HTTP (Get a file)` → `Facebook Pages (Create a Post with Photos)`
- **Đổi kiến trúc gửi ảnh sang Make**: từ multipart (đính kèm file binary trong `post_to_make.py`) sang **JSON thuần + `image_url`** — vì Module 2 (`HTTP Get a file`) cần tải ảnh từ URL public, không nhận file đính kèm trực tiếp
  - `google_drive.py`: thêm `make_public()` — set quyền "anyone with link can view" cho `image.png`, trả về link direct-download (`drive.google.com/uc?export=download&id=...`); `upload_to_drive()` giờ trả `{"folder_url", "image_public_url"}`
  - `post_to_make.py`: viết lại hoàn toàn — bỏ multipart/boundary, POST JSON với field `image_url`
  - `generate_content.py`: dùng `image_public_url`; bỏ qua bước gửi Make nếu Drive upload lỗi (không còn URL để gửi)
  - GitHub Actions (`social-content.yml`): bỏ `SKIP_GOOGLE_DRIVE=1` (bật lại Drive upload — bắt buộc để có `image_url`), thêm bước khôi phục `token.json` từ secret `GOOGLE_DRIVE_TOKEN_JSON` (dùng lại `refresh_token` local, không cần OAuth browser flow trong CI), cài thêm 3 thư viện Google
- **Test end-to-end bằng curl trực tiếp vào webhook** (4 lần, phát hiện + fix 2 lỗi mapping trong Make UI):
  - Lỗi 1: Module 3 (Facebook Pages) field Message map cả `payload_json` lẫn `facebook_caption` → bài đăng lộ nguyên JSON thô. Fix: xoá hết, chỉ giữ 1 chip `facebook_caption`
  - Lỗi 2: Module 2 (HTTP Get a file) field URL vẫn còn trỏ ảnh cũ từ lúc test riêng lẻ (không phải `image_url` từ webhook) → đăng nhầm ảnh không liên quan. Fix: xoá hết, chỉ giữ 1 chip `image_url`
  - Sau khi fix cả 2: xác nhận qua WebFetch — bài test lần 4 đăng đúng caption + đúng ảnh lên `facebook.com/venhohotelhanoi`
- **Quan trọng — không có bước duyệt thủ công**: từ lịch chạy T2/T4/T6 tiếp theo (Thứ 6, 2026-07-10), agent sẽ tự tạo content và **đăng thẳng lên Facebook Page thật**, không qua review của Harry trước khi lên bài
- Đã commit + push (`02e24fa`) để lịch Thứ 6 dùng đúng code mới
- Còn tồn đọng: 4 bài test (`curl-json-test` 1-4) cần Harry vào Facebook Page xoá thủ công

## 2026-07-07 (6) — Workspace reorg + booking security fix + mobile sticky CTA + social pipeline gpt-5.5

- **Commit toàn bộ Phase work** (3 commit, đã push `origin/main`):
  - `68ce882` — reorg thư mục cũ (`Form email/`, `SEO/`, `Social Media content/`) vào `ops/email-form/`, `ops/seo/`, `ops/social-content/`; thêm `docs/`, `marketing/`, `social/`, `assets/`, `website/` (README reference)
  - `9b97287` — tích hợp DNA compact vào `/tao-anh-ai` + `/tao-social-post`
  - `695c6ae` — social pipeline lên gpt-5.5/gpt-image-2
- **Booking API bảo mật hơn** (`src/app/api/booking/route.ts`): thêm `escapeHtml()` + `normalizeText()` chống XSS trong email HTML (trước đó nội dung form chèn thẳng vào template không escape); validate email format + checkout phải sau checkin
- **Mobile Sticky CTA mới** (`src/components/ui/MobileStickyCTA.tsx`): thanh CTA cố định đáy màn hình trên mobile (gọi điện + đặt phòng), có GA4 (`phone_click`, `booking_cta_click`) + Meta Pixel (`Contact`, `Lead`) tracking — nhúng vào `layout.tsx`
- **Footer**: thêm dòng Check-out (trước chỉ có Check-in)
- **SEO metadata** (`layout.tsx`): sửa giá phòng trong description/OG/Twitter card từ 412,500đ → 400,000đ/đêm cho khớp giá thật
- **DNA `outside` → v1.1** (venho-ai-studio, 14 ảnh — từ 7): Harry bổ sung 4 ảnh rooftop chụp từ tầng cao. Phát hiện: schema `outside` vốn thiết kế gộp nhiều loại không gian ngoài trời (`space_type`: rooftop_terrace/balcony/entrance_area/street_level_exterior) trong 1 subject — quyết định giữ nguyên, không tách subject riêng (xem memory `project-outside-dna-schema`)
- **Tích hợp DNA vào skill AI** — `/tao-anh-ai` và `/tao-social-post` giờ bắt buộc đọc `VENHO_HOTEL_{SUBJECT}_DNA_COMPACT.md` trước khi viết prompt (nguồn xác thực, thắng block cứng nếu mâu thuẫn); sửa toàn bộ path cũ trỏ `VenHoBrandSystem/` (đã archive) → `02_KNOWLEDGE/DNA/`
- **Social pipeline** (`ops/VenHoSocialManager/`): model gpt-5 → gpt-5.5, gpt-image-1 → gpt-image-2; GitHub Actions đổi lịch 10AM → 8AM VN, thêm `SKIP_GOOGLE_DRIVE=1` (bỏ hẳn Drive trên cloud), commit thêm caption/meta/index text vào repo (trước chỉ commit rotation state); `google_drive.py` cho phép override `ROOT_FOLDER_ID` qua env, upload thêm `threads.txt`; thêm rule chống bịa review/quote khách trong caption

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
