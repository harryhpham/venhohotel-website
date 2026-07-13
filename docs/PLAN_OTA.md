# PLAN_OTA.md — VENHO OS · OTA-01 MANAGEMENT & REVENUE AGENT
## Kế hoạch kỹ thuật triển khai theo Clean Architecture — v1.4 (Implementation-Ready)

**Mã module:** OTA-01
**Nguồn:** Hợp nhất và tái cấu trúc từ Plan v1.3 Final (12/07/2026). Toàn bộ quy tắc nghiệp vụ, guardrail và gate của v1.3 được giữ nguyên; tài liệu này tổ chức lại chúng thành đặc tả mà một AI Coding Agent đọc và viết code được ngay.
**Phạm vi:** Ven Hồ Hotel — 12 phòng — Agoda, Booking.com, Skyhotel.vn.
**Người phê duyệt:** Hotel Owner (Harry).

---

# 0. HƯỚNG DẪN CHO AI CODING AGENT — ĐỌC PHẦN NÀY TRƯỚC

> Tài liệu này là **nguồn sự thật duy nhất** khi build OTA-01. Nếu code và tài liệu mâu thuẫn, tài liệu thắng. Nếu tài liệu thiếu thông tin, dừng lại và hỏi Owner — không tự bịa nghiệp vụ.

## 0.1. Thứ tự đọc

1. Mục 0 (quy tắc bất biến) → Mục 2 (kiến trúc & dependency rule) → Mục 4 (file tree).
2. Trước khi code một layer: đọc mục đặc tả layer đó (5–9).
3. Trước khi code một phase: đọc mục 12 (phase nào build file nào, DoD gì).
4. Mục 10 (schemas) và mục 11 (testing) áp dụng cho mọi phase.

## 0.2. Mười quy tắc bất biến (HARD RULES — vi phạm = bug nghiêm trọng)

```text
R1.  LLM KHÔNG nằm trên critical path. Sync, reconciliation, pricing math,
     approval, write-back chạy hoàn toàn deterministic. LLM chỉ sinh
     explanation/brief; LLM lỗi → dùng template fallback, pipeline vẫn chạy.
R2.  Mọi write ra hệ thống ngoài (PMS/CM/OTA) phải có: approval hợp lệ HOẶC
     nằm trong pre-approved allowlist; idempotency_key; audit record.
R3.  Trước mỗi write: re-read state hiện tại, so context_hash. Lệch → KHÔNG
     ghi, chuyển recommendation sang STALE.
R4.  Recommendation ở trạng thái EXPIRED hoặc STALE không bao giờ được execute.
     Enforce tại domain layer (state machine), không chỉ tại UI.
R5.  Floor/Ceiling/Minimum Acceptable Net Rate enforce tại MỘT điểm duy nhất:
     domain/policies/guardrails.ts. Mọi con đường tạo giá đều đi qua đây.
R6.  Agent và Dashboard KHÔNG giao tiếp qua file chung. Mọi tương tác đi qua
     Internal API + SQLite transaction. File chỉ dùng cho config versioned,
     governance docs và audit export.
R7.  AUTO-REOPEN inventory không tồn tại trong Module v1.0. Không viết code
     auto-reopen, kể cả sau feature flag.
R8.  Kiểm tra AgentControl.mode ở HAI tầng: đầu mỗi run và ngay trước mỗi
     write tool call. EMERGENCY_STOP chặn cứng tại Action Executor.
R9.  Secrets chỉ đọc từ environment. Không hardcode, không commit, không log.
     PII luôn mask trong log; không lưu PAN/CVC.
R10. Mọi record có schema_version. Mọi run có run_id + rule_version. Audit
     log append-only.
```

## 0.3. Quy trình làm việc của Coding Agent

- Mỗi phase = một Step File (theo L4 Execution OS): Input, Output, Tasks, DoD, **Out of Scope bắt buộc**.
- Definition of Done của mọi task code: `pnpm typecheck && pnpm lint && pnpm test` pass, golden tests liên quan pass.
- Không code trước phase: ví dụ không viết Action Executor khi đang ở Phase 1.
- Gặp Open Item chưa khóa (mục 14) mà task cần nó → dừng, hỏi Owner, không giả định.
- Commit convention: `feat(domain): ...`, `feat(agent): ...`, `test(golden): ...`, `fix: ...`.

---

# 1. TỔNG QUAN VÀ MỤC TIÊU

OTA-01 là lớp **giám sát – phân tích – đề xuất – phê duyệt – thực thi có kiểm soát – audit** đặt trên Skyhotel PMS và hai OTA (Agoda, Booking.com). Module không thay thế các hệ thống đó.

**Mục tiêu kinh doanh (đo được):** 0 overbooking do lỗi VENHO OS; giảm ≥60% giờ thao tác OTA so với baseline Phase 0; tối ưu Net Room Revenue (không đua giá thấp nhất); Owner vận hành từ Mother Dashboard.

**Mốc sản phẩm:**

| Mốc | Gồm | Ý nghĩa |
|---|---|---|
| Operational MVP | Phase 0–2 | Đọc, cảnh báo, competitor intel, đề xuất giá có duyệt — chưa write-back |
| Module v1.0 | Phase 0–4 | Controlled write-back + safe automation đạt nghiệm thu |
| Module v1.1 | Phase 5 | Learning, sau ≥60–90 ngày dữ liệu sạch |

**Ngoài phạm vi v1.0:** direct Connectivity Partner với OTA; dynamic pricing không approval; auto-reopen; xử lý thanh toán/tranh chấp; multi-property; scraping trái điều khoản; review response engine (thuộc M1).

---

# 2. KIẾN TRÚC — CLEAN ARCHITECTURE

## 2.1. Sơ đồ tầng và Dependency Rule

```text
┌─────────────────────────────────────────────────────────────────┐
│  FRAMEWORKS & DRIVERS (ngoài cùng)                              │
│  Next.js Dashboard · Fastify API · SQLite · node-cron ·         │
│  Skyhotel/CM connectors · OpenAI/Anthropic SDK · Telegram/Zalo  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  INTERFACE ADAPTERS (packages/adapters, api, dashboard)   │  │
│  │  Repositories (SQLite) · Connector implementations ·      │  │
│  │  LLM provider adapter · Notifier · REST controllers       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  APPLICATION (packages/application)                 │  │  │
│  │  │  Use cases · Ports (interfaces) · DTOs · UnitOfWork │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │  DOMAIN (packages/domain) — thuần TS, 0 I/O   │  │  │  │
│  │  │  │  Entities · Value Objects · State Machines ·  │  │  │  │
│  │  │  │  Pricing Engine · Guardrails · Policies       │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

DEPENDENCY RULE: import chỉ hướng VÀO trong.
domain không import gì ngoài chính nó và shared/schemas (types).
application chỉ import domain. adapters/api/agent/dashboard import application + domain.
KHÔNG BAO GIỜ ngược lại.
```

## 2.2. Ánh xạ khái niệm v1.3 → thành phần code

| Khái niệm v1.3 | Thành phần | Layer |
|---|---|---|
| Rule Engine / Pricing | `domain/services/pricing-engine.ts` | Domain |
| Guardrails (floor/ceiling/net/biên độ) | `domain/policies/guardrails.ts` | Domain |
| Recommendation state machine + TTL/STALE | `domain/state-machines/recommendation.ts` | Domain |
| Inventory formula | `domain/services/inventory-calculator.ts` | Domain |
| Confidence / Comparability / Freshness | `domain/services/scoring/` | Domain |
| Source-of-Record Matrix | `domain/policies/source-of-record.ts` (+ doc 14) | Domain |
| Reconciliation, dedupe, ingest | `application/use-cases/ingest/`, `reconcile/` | Application |
| Approval Service + revalidation | `application/use-cases/approval/` | Application |
| Action Executor + verify + rollback | `application/use-cases/execution/` | Application |
| Connector tier 1/2/3 + mock | `adapters/connectors/` | Adapters |
| LLM provider-agnostic + fallback | `adapters/llm/` | Adapters |
| Operational Store SQLite/WAL | `adapters/persistence/` | Adapters |
| Internal API | `packages/api` (Fastify) | Interface |
| Mother Dashboard OTA + Agent Center | `apps/dashboard` (Next.js) | Interface |
| Orchestrator + Scheduler + 4 Skills + Modes | `packages/agent` | Interface (composition root) |

## 2.3. Tier tích hợp và Decision Gate G0 (giữ nguyên v1.3)

- **Tier 1** Skyhotel Channel Manager · **Tier 2** API/Webhook chính thức · **Tier 3** structured export + guided manual action · **Tier 4** RPA (không dùng làm lõi).
- **G0-A/B/C** quyết định connector nào được build production. Trước G0: chỉ build trên `adapters/connectors/mock/`.
- Code phải **tier-agnostic**: use case gọi `PmsConnectorPort`; tier chỉ quyết định implementation nào được bind ở composition root.

## 2.4. Deployment topology

- Phase 0–2: single node (Mac mini always-on) — API + Agent + SQLite cùng process host.
- Trước Phase 3: chuyển/xác nhận thiết bị always-on hoặc VPS; backup điện/mạng.
- Dashboard nếu deploy Vercel: **không dùng filesystem Vercel làm state** — Dashboard chỉ gọi Internal API qua HTTPS + auth token.
- SQLite bật WAL mode; một writer duy nhất là API process (Agent ghi qua API nội bộ hoặc cùng process qua UnitOfWork — chọn cùng process trong MVP để tránh 2 writer).

---

# 3. TECH STACK (LOCK CHO MVP)

| Thành phần | Chọn | Lý do |
|---|---|---|
| Ngôn ngữ | TypeScript (strict) toàn repo | Một ngôn ngữ cho agent/API/dashboard; type-safety cho schema nghiệp vụ |
| Runtime | Node.js ≥ 20 LTS | |
| Monorepo | pnpm workspaces | Đơn giản, đủ cho solo founder |
| Validation | Zod — schema là nguồn sự thật, export cả type | Enforce tại mọi boundary (API, connector, LLM output) |
| DB | SQLite + WAL, qua Drizzle ORM + migrations | Đúng v1.3; single-node MVP |
| API | Fastify + zod validation plugin | Nhẹ, schema-first |
| Dashboard | Next.js (App Router) + Tailwind | Khớp Vercel; Mother Dashboard hiện có |
| Scheduler | node-cron trong process Agent | Không cần queue ngoài ở MVP |
| LLM | Provider adapter: `anthropic.ts` / `openai.ts` / `template.ts` (fallback) | R1 + AI-agnostic (v1.3 lỗi #9) |
| Notification | Adapter: Telegram trước (Open Item #3) | |
| Test | Vitest + golden fixtures JSON | |
| Lint/format | ESLint + Prettier, import-boundary rule theo 2.1 | Chống vi phạm Dependency Rule bằng máy |

---

# 4. FILE TREE CHUẨN HÓA (MONOREPO)

> Coding Agent tạo đúng cây này ở Phase 0 (những nhánh Phase sau được đánh dấu). Mỗi comment là hướng dẫn nội dung.

```text
venho-ota/
├── PLAN_OTA.md                      # ← tài liệu này (nguồn sự thật)
├── CLAUDE.md                        # hướng dẫn ngắn cho Claude Code (xem mẫu mục 13.4)
├── package.json                     # pnpm workspace root; scripts: dev/test/typecheck/lint/golden
├── pnpm-workspace.yaml
├── tsconfig.base.json               # strict: true, noUncheckedIndexedAccess: true
├── .env.example                     # liệt kê MỌI env var, không có giá trị thật
├── .gitignore                       # ignore: .env, *.db, backups/, node_modules
│
├── docs/                            # governance — file-first, versioned, KHÔNG chứa runtime state
│   ├── 00_OTA_MASTER_INDEX.md
│   ├── 01_OTA_MODULE_PLAN_v1.4.md   # bản plan này sau khi Owner duyệt
│   ├── 02_OTA_OPERATING_RULES.md
│   ├── 03_OTA_APPROVAL_POLICY.md
│   ├── 10_OTA_DASHBOARD_SPEC.md
│   ├── 14_OTA_SOURCE_OF_RECORD_MATRIX.md
│   ├── 15_OTA_CONNECTOR_CAPABILITY_REPORT.md   # output Phase 0
│   ├── 16_OTA_INCIDENT_SOP.md
│   ├── 17_OTA_TEST_PLAN.md
│   ├── 18_OTA_BACKUP_RECOVERY_PLAN.md
│   └── decisions/                   # G0..G4 Decision Records + changelog
│
├── config/                          # cấu hình nghiệp vụ versioned (Owner-approved, có schema)
│   ├── room_mapping.json            # Skyhotel↔Agoda↔Booking room/rate IDs (Phase 0)
│   ├── rate_plan_mapping.json
│   ├── competitor_set.json          # primary 5 / secondary 5 / watch list
│   ├── pricing_rules.json           # base rates, factors, weights, bounds, floor/ceiling, min net rate
│   ├── season_calendar.json
│   ├── event_calendar.json          # lễ/sự kiện Hà Nội/Hồ Tây, nhập tay trong v1.0
│   ├── alert_rules.json             # điều kiện P1..P4 + kênh gửi
│   ├── preapproved_rules.json       # allowlist Phase 4 (auto-close conditions)
│   ├── rate_consistency_policy.json # ngoại lệ mobile/member/geo theo hợp đồng OTA
│   └── history/                     # bản cũ khi thay đổi (change governance mục 9.3 v1.3)
│
├── packages/
│   ├── shared/                      # dùng chung mọi layer — CHỈ types + zod schemas + hằng số
│   │   └── src/
│   │       ├── schemas/             # zod: booking.ts, rate-inventory.ts, recommendation.ts,
│   │       │                        #      action.ts, alert.ts, competitor-snapshot.ts,
│   │       │                        #      agent-control.ts, config/*.ts  (mục 10)
│   │       ├── constants.ts         # TIMEZONE='Asia/Ho_Chi_Minh', CURRENCY='VND', SCHEMA_VERSION
│   │       └── errors.ts            # taxonomy: ValidationError, StaleContextError,
│   │                                #   UnauthorizedWriteError, ConnectorError, GuardrailViolation
│   │
│   ├── domain/                      # LAYER 1 — thuần logic, KHÔNG import adapter/DB/LLM/fs/net
│   │   └── src/
│   │       ├── entities/            # Booking, RateInventory, Recommendation, ActionRecord, Alert
│   │       ├── value-objects/       # Money, StayDate ([check_in, check_out)), Percentage, RunId
│   │       ├── state-machines/
│   │       │   ├── booking-lifecycle.ts        # NEW→CONFIRMED→MODIFIED→CANCELLED/NO_SHOW/COMPLETED
│   │       │   ├── recommendation.ts           # mục 5.3 — enforce R4 tại đây
│   │       │   └── agent-mode.ts               # RUNNING/READ_ONLY/PAUSED/EMERGENCY_STOP
│   │       ├── services/
│   │       │   ├── pricing-engine.ts           # mục 5.4 — reference rate + demand adjustment
│   │       │   ├── inventory-calculator.ts     # mục 5.2 — công thức available inventory
│   │       │   ├── dedupe.ts                   # dedupe_key = ota+property+booking_id+source_version
│   │       │   ├── context-hash.ts             # hash(inventory, current_rate, restrictions, rule_version)
│   │       │   └── scoring/
│   │       │       ├── confidence.ts           # 35/25/20/20 — mục 5.5
│   │       │       ├── comparability.ts        # competitor comparability score
│   │       │       └── freshness.ts            # bảng max-age theo lead time — mục 5.6
│   │       └── policies/
│   │           ├── guardrails.ts               # R5 — điểm enforce DUY NHẤT floor/ceiling/net/±15%
│   │           ├── ttl-policy.ts               # bảng TTL theo lead time — mục 5.3
│   │           ├── allowlist.ts                # điều kiện auto-close Phase 4 — mục 5.7
│   │           ├── rate-consistency.ts         # policy + ngoại lệ cấu hình
│   │           └── source-of-record.ts         # matrix miền dữ liệu → nguồn thẩm quyền
│   │
│   ├── application/                 # LAYER 2 — use cases; chỉ import domain + shared
│   │   └── src/
│   │       ├── ports/               # interfaces cho adapters implement (mục 7.1)
│   │       │   ├── pms-connector.port.ts       # readBookings, readInventory, readRates, pushRate*, pushRestriction*
│   │       │   ├── ota-verify.port.ts          # đọc trạng thái publish để verify
│   │       │   ├── repositories.port.ts        # BookingRepo, RecommendationRepo, ActionRepo, AlertRepo...
│   │       │   ├── unit-of-work.port.ts        # transaction boundary
│   │       │   ├── llm.port.ts                 # explain(structuredInput) → {text} | fallback
│   │       │   ├── notifier.port.ts            # sendP1, sendBrief
│   │       │   └── clock.port.ts               # now() — không gọi Date.now() trong use case
│   │       ├── use-cases/           # mỗi file 1 use case, contract chuẩn mục 6
│   │       │   ├── ingest/          # ingest-booking-events, ingest-rate-inventory, ingest-competitor-snapshot
│   │       │   ├── reconcile/       # reconcile-bookings, reconcile-inventory, detect-sync-anomalies
│   │       │   ├── pricing/         # generate-recommendations, invalidate-stale-recommendations
│   │       │   ├── approval/        # submit-decision, revalidate-before-execute
│   │       │   ├── execution/       # execute-action (Phase 3), verify-published (P3), rollback-action (P3)
│   │       │   ├── alerting/        # raise-alert, acknowledge-alert, escalate-alert
│   │       │   ├── reporting/       # build-daily-brief, build-weekly-review, export-audit
│   │       │   └── control/        # set-agent-mode, get-agent-status
│   │       └── dto/                 # input/output types cho từng use case
│   │
│   ├── adapters/                    # LAYER 3 — mọi I/O
│   │   └── src/
│   │       ├── persistence/
│   │       │   ├── db.ts                        # SQLite + WAL init
│   │       │   ├── schema.ts                    # Drizzle tables (mục 7.2)
│   │       │   ├── migrations/
│   │       │   ├── repositories/                # implement repositories.port
│   │       │   └── unit-of-work.ts
│   │       ├── connectors/
│   │       │   ├── mock/                        # mock provider — golden tests chạy 100% ở đây
│   │       │   ├── skyhotel-cm/                 # Tier 1 (build sau G0-A)
│   │       │   ├── skyhotel-api/                # Tier 2 (build sau G0-B)
│   │       │   ├── structured-import/           # Tier 3: parse CSV/XLSX export + guided action
│   │       │   └── ota-verify/                  # đọc extranet/ack để verify publish
│   │       ├── llm/
│   │       │   ├── provider.ts                  # chọn provider theo env LLM_PROVIDER
│   │       │   ├── anthropic.ts · openai.ts
│   │       │   ├── template.ts                  # fallback không cần LLM — R1
│   │       │   └── budget-guard.ts              # chặn khi vượt ngân sách model/ngày
│   │       ├── notifications/telegram.ts        # + interface cho Zalo/email sau
│   │       ├── audit/jsonl-exporter.ts          # export audit hằng ngày + checksum
│   │       └── backup/snapshot.ts               # encrypted backup hourly/daily
│   │
│   ├── agent/                       # composition root của runtime tự động
│   │   └── src/
│   │       ├── index.ts                         # bootstrap: wire adapters ↔ use cases
│   │       ├── orchestrator.ts                  # vòng chạy run — pseudocode mục 9.2
│   │       ├── scheduler.ts                     # cron: sync/pricing/competitor/audit runs
│   │       ├── mode-guard.ts                    # R8 — kiểm tra mode 2 tầng
│   │       └── skills/                          # compose use cases thành 4 skill
│   │           ├── operations.skill.ts
│   │           ├── competitor.skill.ts
│   │           ├── revenue.skill.ts
│   │           └── sync-control.skill.ts
│   │
│   └── api/                         # Internal API — Dashboard CHỈ nói chuyện qua đây (R6)
│       └── src/
│           ├── server.ts                        # Fastify + auth middleware + zod validation
│           ├── routes/                          # bảng endpoint mục 8.1
│           └── auth.ts                          # token auth, actor logging, nonce cho action lớn
│
├── apps/
│   └── dashboard/                   # Next.js — module OTA & Revenue + AI Agent Center
│       └── src/
│           ├── app/(ota)/
│           │   ├── overview/        # mục 8.2
│           │   ├── bookings/        # Booking Monitor
│           │   ├── calendar/        # Calendar & Inventory 30/60/90
│           │   ├── pricing/         # Pricing Center + Approval Cards
│           │   ├── competitors/
│           │   ├── alerts/
│           │   └── settings/
│           ├── app/agent-center/    # OTA Agent Card — mục 8.3
│           ├── components/          # ApprovalCard, TtlCountdown, ConfidenceBadge,
│           │                        # FreshnessBadge, ModeBadge, TwoStepConfirm
│           └── lib/api-client.ts    # typed client sinh từ zod schemas
│
├── tests/
│   ├── golden/                      # ≥40 kịch bản — fixtures JSON + runner (mục 11.2)
│   │   ├── fixtures/
│   │   └── scenarios/
│   ├── contract/                    # contract test cho từng connector implementation
│   └── drills/                      # emergency-stop.drill.ts, restore.drill.ts, rollback-conflict.drill.ts
│
└── scripts/
    ├── seed-mock.ts                 # sinh dữ liệu mock (số room type thật sau Phase 0)
    ├── backup.ts · restore-drill.ts
    ├── audit-export.ts
    └── validate-config.ts           # zod-validate mọi file trong config/ — chạy trong CI
```

**Ghi chú kiến trúc quan trọng:** runtime state (SQLite `data/ota.db`), secrets (`.env`) và backups nằm **ngoài** `docs/` và `config/`, không bao giờ đồng bộ lên kho tài liệu công khai.

---

# 5. ĐẶC TẢ DOMAIN LAYER

> Toàn bộ mục 5 là **pure function/pure class**: không I/O, không đọc env, không gọi DB. Thời gian nhận qua tham số. Đây là nơi golden tests tập trung.

## 5.1. Booking lifecycle và dedupe

```text
NEW → CONFIRMED → MODIFIED → CANCELLED | NO_SHOW | COMPLETED
```

- Event bắt buộc có: `source_event_id`, `source_updated_at`, `ingested_at`, `event_type`, `version`.
- `dedupe_key = hash(ota, property_id, ota_booking_id, source_version || source_event_id)` — implement trong `domain/services/dedupe.ts`.
- Upsert theo source version: event cũ hơn version hiện tại → bỏ qua + log; event lặp → bỏ qua im lặng; event out-of-order → xếp lại theo `source_updated_at`.
- MODIFIED không được tạo double release/hold inventory: tính delta nights giữa bản cũ và mới.
- Stay nights = khoảng nửa mở `[check_in, check_out)`.

## 5.2. Inventory calculator

```text
availableInventory(roomType, stayDate) =
    physicalSellableRooms
  - activeBookingNights
  - maintenanceBlocks
  - confirmedInternalHolds
  - safetyBuffer          // 0 ở Tier 1–2 sau nghiệm thu; 1 ở Tier 3/pilot (Owner duyệt)
```

- Kết quả âm → không clamp về 0 âm thầm: trả về giá trị âm + domain event `NEGATIVE_INVENTORY` để use case tạo alert P1.
- Không auto-reopen dựa riêng vào cancellation event (R7).

## 5.3. Recommendation state machine + TTL

```text
DRAFT → RECOMMENDED → OWNER_REVIEW
      → APPROVED | MODIFIED | REJECTED | EXPIRED | STALE
APPROVED/MODIFIED → SCHEDULED → EXECUTING → PUBLISHED → VERIFIED
                  → COMPLETED | FAILED | ROLLED_BACK | MANUAL_REVIEW
```

- Transition guard viết dạng bảng `allowedTransitions: Record<State, State[]>`; transition không hợp lệ → throw `InvalidTransitionError`.
- `EXPIRED` và `STALE` là trạng thái hút (absorbing) đối với execute — không có cạnh nào từ chúng đến `SCHEDULED` (R4).

**TTL theo lead time** (`domain/policies/ttl-policy.ts`):

| Lead time đến stay date | TTL tối đa |
|---|---|
| 0–2 ngày | 2 giờ |
| 3–7 ngày | 6 giờ |
| 8–30 ngày | đến cuối ngày tạo (23:59 Asia/Ho_Chi_Minh) |
| > 30 ngày | 24 giờ |

**Stale triggers** (kiểm tra bởi `invalidate-stale-recommendations` use case, chạy mỗi sync run): thay đổi đáng kể của inventory, current rate, restrictions, event severity, sync health, hoặc `rule_version` ≠ lúc tạo. "Đáng kể" định nghĩa trong `pricing_rules.json` (ví dụ: inventory đổi ≥1 phòng, rate đổi ≥2%).

**Context hash** (`domain/services/context-hash.ts`): `sha256(canonical_json({stay_date, room_type_id, inventory, current_rate, restrictions, rule_version, schema_version}))`. Lưu lúc tạo recommendation; so lại ngay trước write (R3).

## 5.4. Pricing engine (`domain/services/pricing-engine.ts`)

```text
// Bước 1 — Reference Rate (ổn định, không phụ thuộc giá đang bán)
referenceRate = baseRate × seasonFactor × dayOfWeekFactor × eventFactor × productFactor
// productFactor chứa premium phòng view hồ nếu Owner khóa trong pricing_rules.json

// Bước 2 — Demand Adjustment (bounded)
demandAdjustment = clamp(
    wOcc  × occupancySignal
  + wPick × pickupSignal
  + wLead × leadTimeSignal
  + wComp × competitorSignal,   // competitor input phải pass freshness (5.6)
  -0.15, +0.15)                  // bound mặc định, config được
candidateRate = referenceRate × (1 + demandAdjustment)

// Bước 3 — Guardrails (R5 — duy nhất tại domain/policies/guardrails.ts)
finalRate   = clamp(candidateRate, priceFloor, priceCeiling)
assert effectiveNetRate(finalRate) ≥ minimumAcceptableNetRate   // fail → GuardrailViolation
```

- Weights, signal bounds, floor/ceiling, min net rate: đọc từ `config/pricing_rules.json` (validate bằng zod, có `rule_version`).
- `effectiveNetRate` = finalRate − commission − promotion stacking cost − payment cost (mỗi thành phần gắn nhãn `estimated|confirmed`).
- Rate = 0, giá ngoài floor/ceiling phát hiện từ dữ liệu OTA → **incident path** (alert), không phải input cho routine adjustment.
- Tối đa 1 routine change cho cùng (stay_date, room_type) trong 24h; ngoại lệ cần Owner re-approval kèm lý do.

## 5.5. Confidence score (`domain/services/scoring/confidence.ts`)

```text
confidence = 0.35×dataCompleteness + 0.25×dataFreshness
           + 0.20×competitorComparability + 0.20×syncHealth   // mỗi thành phần ∈ [0,1], kết quả ×100
```

| Điểm | Hành vi hệ thống |
|---|---|
| 80–100 High | Được phép vào bulk review |
| 60–79 Medium | Cảnh báo, bắt buộc review từng item |
| <60 Low | Không tạo action recommendation — chỉ hiển thị informational insight |

## 5.6. Competitor freshness (`domain/services/scoring/freshness.ts`)

| Stay window | Max age dùng trong pricing |
|---|---|
| 0–7 ngày | 24 giờ |
| 8–30 ngày | 72 giờ |
| 31–90 ngày | 7 ngày |
| Event/holiday | 24 giờ hoặc rule riêng |

Snapshot quá hạn → loại khỏi competitorSignal (không được "dùng tạm"). Comparability score thấp → loại khỏi median chính.

## 5.7. Allowlist Phase 4 (`domain/policies/allowlist.ts`)

Auto-close một stay date chỉ khi **TẤT CẢ** điều kiện đúng:

```text
pmsAvailableInventory == 0
&& !hasMappingError(roomType)
&& pmsDataAge <= freshnessThreshold
&& channelManagerDidNotAutoClose && !channelManagerReportingError
&& action.direction == DECREASE_AVAILABILITY_ONLY   // chỉ giảm, không bao giờ tăng
&& action.has(idempotencyKey) && action.willVerify && action.willNotifyImmediately
```

Auto-reopen: **không implement** (R7). Retry sync chính thức: được phép theo allowlist.

## 5.8. Agent modes (`domain/state-machines/agent-mode.ts`)

| Mode | Scheduler | Read/Alert | Write |
|---|---|---|---|
| `RUNNING` | on | on | chỉ approved/allowlist |
| `READ_ONLY` | on | on | off hoàn toàn |
| `PAUSED` | off (manual read run OK) | manual | off |
| `EMERGENCY_STOP` | minimal monitor | P1 alert vẫn bật | off cứng tại Action Executor |

---

# 6. ĐẶC TẢ APPLICATION LAYER — USE CASES

## 6.1. Contract chuẩn (mọi use case theo mẫu này)

```typescript
// application/use-cases/<nhóm>/<tên>.ts
// Mỗi use case: 1 class/function, constructor nhận ports, execute() nhận DTO đã validate.
// KHÔNG import adapter cụ thể. KHÔNG gọi Date.now() (dùng ClockPort). Mọi mutation trong UnitOfWork.
export interface UseCase<In, Out> { execute(input: In): Promise<Result<Out, DomainError>> }
```

## 6.2. Danh mục use case (Phase build trong ngoặc)

| Use case | Trigger | Tóm tắt hành vi |
|---|---|---|
| `IngestBookingEvents` (P1) | sync run / webhook | Validate → dedupe → upsert theo version → recompute stay-night inventory → phát domain events |
| `IngestRateInventory` (P1) | sync run | Đọc rate/inventory/restrictions theo tier → chuẩn hóa → lưu + freshness |
| `IngestCompetitorSnapshot` (P2) | competitor run / manual | Validate schema, tính comparability, lưu kèm source + timestamp |
| `ReconcileBookings` (P1) | sync run | So OTA events ↔ Skyhotel: missing/duplicate/out-of-order → alert P1/P2 |
| `ReconcileInventory` (P1) | sync run | So available inventory tính được ↔ PMS/OTA; âm hoặc lệch → alert |
| `GenerateRecommendations` (P2) | pricing run 06:00 | Freshness+sync health check → pricing engine → confidence → TTL + context_hash → RECOMMENDED |
| `InvalidateStaleRecommendations` (P2) | mỗi sync run | Quét recommendation mở, so context → STALE/EXPIRED |
| `SubmitDecision` (P2) | Dashboard POST | Approve/Modify/Reject qua Approval Service: actor, nonce, lý do, audit event |
| `RevalidateBeforeExecute` (P3) | trước execute | Re-read state, so context_hash; lệch → STALE + thông báo (R3) |
| `ExecuteAction` (P3) | sau revalidate | Idempotent write theo tier; transaction; ActionRecord đầy đủ before/after |
| `VerifyPublished` (P3) | sau execute | Đọc lại theo tier (ack/read-back 5–15ph; tier 3 checklist ≤30ph) → VERIFIED/FAILED |
| `RollbackAction` (P3) | Owner/failure | Compare-and-set: chỉ rollback khi version hiện tại == version VENHO vừa publish; khác → MANUAL_REVIEW |
| `RaiseAlert`/`AcknowledgeAlert`/`EscalateAlert` (P1) | mọi run | Tạo alert theo alert_rules; P1 → notifier ngay; SLA mục 8.4 |
| `BuildDailyBrief` (P1) | 06:30 daily | Tổng hợp số liệu → LLM explain (fallback template) → gửi notifier |
| `BuildWeeklyReview` (P2) | weekly | Occ/ADR/RevPAR/net, approval outcomes, comp set |
| `ExportAudit` (P1) | daily | JSONL append-only + checksum |
| `SetAgentMode`/`GetAgentStatus` (P0) | Dashboard/API | Đổi mode có auth 2 bước với EMERGENCY_STOP; ghi actor + audit |

## 6.3. Hai contract mẫu đầy đủ (các use case khác viết cùng độ chi tiết)

```typescript
// IngestBookingEvents — P1
Input:  { events: BookingEventDto[], source: 'tier1'|'tier2'|'tier3', runId: RunId }
Output: { ingested: number, duplicates: number, outOfOrder: number, anomalies: AnomalyDto[] }
Errors: ValidationError (event sai schema — event đó bị cách ly vào bảng quarantine, không chặn batch)
Side effects: upsert bookings, recompute inventory ngày liên quan, alert nếu anomaly, audit.
Invariants:  không double release/hold khi MODIFIED; đọc-ghi trong 1 UnitOfWork/batch.

// ExecuteAction — P3
Input:  { approvalId, actorRunId }
Precondition: recommendation ∈ {APPROVED, MODIFIED}; RevalidateBeforeExecute pass;
              agentMode cho phép write (mode-guard tầng 2 — R8); không trong freeze window.
Output: { actionId, status: 'PUBLISHED'|'FAILED', verificationScheduledAt }
Errors: StaleContextError → recommendation STALE, không ghi;
        UnauthorizedWriteError → alert P1 (không bao giờ được xảy ra);
        ConnectorError → retry theo policy, quá hạn → FAILED + MANUAL_REVIEW.
Side effects: ActionRecord {before, requested, idempotency_key, attempt_count}, audit, notify.
```

---

# 7. ĐẶC TẢ ADAPTERS LAYER

## 7.1. Ports chính (application định nghĩa — adapters implement)

```typescript
interface PmsConnectorPort {           // implementation theo tier sau G0
  readBookings(since: Cursor): Promise<BookingEventDto[]>
  readInventory(range: DateRange): Promise<RateInventoryDto[]>
  readRates(range: DateRange): Promise<RateInventoryDto[]>
  // Write — chỉ Tier 1/2 implement thật; Tier 3 trả về GuidedActionPackage (checklist cho Owner)
  pushRate(cmd: PushRateCmd & { idempotencyKey: string }): Promise<PushResult>
  pushRestriction(cmd: PushRestrictionCmd & { idempotencyKey: string }): Promise<PushResult>
  capabilities(): ConnectorCapabilities  // { canWrite, syncLatencySla, supportsWebhook }
}
interface LlmPort {                    // R1: chỉ được gọi từ reporting/explanation use cases
  explain(input: ExplanationInput): Promise<{ text: string; source: 'llm'|'template' }>
}
```

- Mọi connector method: timeout, retry policy (exponential backoff, max 3), schema validation output, cursor-based incremental read.
- `budget-guard.ts` bọc LlmPort: vượt ngân sách ngày → tự chuyển template, alert P3.

## 7.2. SQLite schema (Drizzle — `adapters/persistence/schema.ts`)

| Bảng | Cột chính | Ghi chú |
|---|---|---|
| `bookings` | booking_id PK, ota, ota_booking_id, dedupe_key UNIQUE, source_version, status, check_in, check_out, room_type_id, gross_amount, commission_est, net_est, currency, sync_status, timestamps, schema_version | index (ota, ota_booking_id) |
| `sync_events` | source_event_id, dedupe_key UNIQUE, ingested_at, payload_hash | bảng dedupe |
| `rate_inventory` | (room_type_id, stay_date, ota) PK, inventory, rate, restrictions JSON, source_version, verified_at | |
| `recommendations` | rec_id PK, stay_date, room_type_id, ota_scope, reference_rate, recommended_rate, factor_breakdown JSON, effective_net_rate, confidence, context_hash, rule_version, status, expires_at, stale_reason, approved_by, applied_at, verified_at, schema_version | index (status, expires_at) |
| `approvals` | approval_id PK, rec_id FK, actor, decision, reason, nonce, context_hash_at_decision, decided_at | |
| `actions` | action_id PK, approval_id FK, idempotency_key UNIQUE, before_value JSON, requested_value JSON, actual_after_value JSON, source_version_before, result_version, status, attempt_count, error_code, rollback_eligible, verification_result | |
| `alerts` | alert_id PK, severity P1..P4, condition_code, subject JSON, status, acked_by, acked_at, resolved_at | |
| `runs` | run_id PK, run_type, mode_at_start, rule_version, started_at, finished_at, result, stats JSON | |
| `competitor_snapshots` | snap_id PK, hotel_id, stay_date, collected_at, price fields, comparability, source | |
| `agent_control` | singleton row: mode, changed_by, changed_at, reason | mọi thay đổi ghi audit |
| `audit_events` | append-only: event_id, actor, action, entity, before/after hash, created_at | không có UPDATE/DELETE |
| `quarantine_events` | event sai schema chờ xử lý tay | |

Backup: incremental mỗi giờ + full encrypted daily (`scripts/backup.ts`); RPO 1 giờ, RTO 4 giờ; restore drill trước Phase 3 và mỗi quý.

---

# 8. ĐẶC TẢ INTERFACE LAYER

## 8.1. Internal API (Fastify) — Dashboard chỉ dùng các endpoint này (R6)

| Method + Path | Mô tả | Phase |
|---|---|---|
| `GET  /api/v1/overview` | KPI cards OTA Overview | P1 |
| `GET  /api/v1/bookings?status&ota&range` | Booking Monitor | P1 |
| `GET  /api/v1/inventory/calendar?days=30\|60\|90` | Calendar & Inventory | P1 |
| `GET  /api/v1/alerts?severity&status` · `POST /api/v1/alerts/:id/ack` | Alert center | P1 |
| `GET  /api/v1/agent/status` · `POST /api/v1/agent/mode` | Agent Card; mode change EMERGENCY_STOP cần confirm 2 bước + re-auth | P0/P1 |
| `POST /api/v1/agent/run` | Run Now (chỉ read-run khi PAUSED) | P1 |
| `GET  /api/v1/recommendations?status` | Pricing Center | P2 |
| `POST /api/v1/recommendations/:id/decision` | body: {decision, modifiedRate?, reason, nonce} → SubmitDecision | P2 |
| `GET  /api/v1/competitors/watch` | Competitor Watch | P2 |
| `GET  /api/v1/actions?status` · `POST /api/v1/actions/:id/rollback` | Action progress + conditional rollback | P3 |
| `GET  /api/v1/briefs/daily` · `GET /api/v1/reports/weekly` | Báo cáo | P1/P2 |

Chuẩn chung: auth token bắt buộc; mọi request validate bằng zod schema từ `shared`; mọi mutating endpoint ghi `audit_events` kèm actor; error format thống nhất `{code, message, details}`.

## 8.2. Dashboard — UX rules cho 12 phòng (bắt buộc)

- **Luôn hiển thị số phòng tuyệt đối cạnh %** (12 phòng: 1 phòng = ~8%). Component `OccupancyDisplay` nhận cả hai.
- Approval Card: current/reference/recommended/effective net rate, chênh lệch tiền + %, occupancy (%+phòng), pickup, comp median + data age, confidence badge, factor breakdown, explanation, **TTL countdown**, stale conditions. Nút Approve/Modify/Reject. Bulk chỉ enable khi mọi item HIGH confidence và hợp lệ.
- `TwoStepConfirm` bắt buộc cho: EMERGENCY_STOP, bulk action, action nhiều ngày.
- Freshness badge trên mọi dữ liệu có tuổi (sync, competitor, inventory).
- Mode badge của Agent hiển thị ở mọi trang OTA (góc phải trên) — Owner luôn biết agent đang ở mode nào.
- Tier 3: các action hiển thị thành **Guided Checklist** (bước thao tác trên Skyhotel/OTA + ô verify) — không giả lập tự động hóa không tồn tại.

## 8.3. OTA Agent Card (AI Agent Center)

Mode hiện tại + người đổi gần nhất; last run (run_id, duration, result, rule_version, connector version); data freshness + sync latency; queue (recommendations/actions/retries/alerts); model cost hôm nay so ngân sách; nút `Run Now / Read Only / Pause / Resume / Emergency Stop`.

## 8.4. Incident SLA (giữ nguyên v1.3)

P1: alert mobile <1 phút (≥95% test), ack 10ph, contain 30ph, resolve/mitigate 60ph. P2: ack 4h, xử lý 24h. P3/P4: weekly review/backlog.

---

# 9. AGENT RUNTIME

## 9.1. Lịch chạy (scheduler.ts — điều chỉnh theo tier G0)

| Run type | Tần suất mặc định | Use cases |
|---|---|---|
| `SYNC_RUN` | 15 phút (T1–2) / theo chu kỳ import (T3) | Ingest* → Reconcile* → InvalidateStale → RaiseAlert |
| `PRICING_RUN` | 06:00 hằng ngày | GenerateRecommendations |
| `COMPETITOR_RUN` | theo lịch comp set | IngestCompetitorSnapshot |
| `LISTING_AUDIT_RUN` | hằng tuần | audit listing/mapping/promotion + rate consistency |
| `BRIEF_RUN` | 06:30 hằng ngày | BuildDailyBrief |
| `EVENT_RUN` | ngay khi có webhook/event | như SYNC_RUN cho phạm vi hẹp |

## 9.2. Orchestrator (pseudocode chuẩn — implement đúng thứ tự)

```typescript
async function executeRun(runType: RunType) {
  const control = await controlRepo.get();                 // tầng 1 của R8
  if (!modeAllowsRun(control.mode, runType)) return skip(runType, control.mode);

  const run = await runs.start(runType, control.mode, ruleVersion());
  try {
    for (const step of pipelineFor(runType)) {
      await step.execute({ runId: run.id });               // mỗi step = 1 use case
    }                                                      // write steps tự kiểm mode lần 2
    await runs.finish(run.id, 'SUCCESS', stats);
  } catch (e) {
    await runs.finish(run.id, 'FAILED', { error: taxonomy(e) });
    if (isCritical(e)) await raiseAlert.execute({ severity: 'P1', ... });
    // KHÔNG throw tiếp — run kế tiếp vẫn chạy; unhandled failure = 0 tồn đọng (KPI)
  }
}
```

## 9.3. Bốn skill = composition của use cases

Skill không chứa business logic riêng — chỉ chọn pipeline: Operations (booking/listing/mapping), Competitor (snapshot+scoring), Revenue (pricing+TTL), Sync Control (reconcile+retry+auto-close P4). Logic thật nằm ở domain/application.

---

# 10. SCHEMAS (packages/shared/src/schemas)

Zod là nguồn sự thật; TS types export từ zod; JSON Schema sinh cho tài liệu. Mẫu chuẩn:

```typescript
export const RecommendationSchema = z.object({
  schema_version: z.literal(1),
  rec_id: z.string().ulid(),
  stay_date: z.string().date(),                    // Asia/Ho_Chi_Minh
  room_type_id: z.string(),
  ota_scope: z.enum(['AGODA', 'BOOKING', 'BOTH']),
  current_rate: Money, reference_rate: Money, recommended_rate: Money,
  factor_breakdown: z.record(z.string(), z.number()),
  effective_net_rate: Money.extend({ basis: z.enum(['estimated', 'confirmed']) }),
  confidence: z.number().min(0).max(100),
  data_freshness: z.record(z.string(), z.string().datetime()),
  context_hash: z.string().length(64),
  rule_version: z.string(),
  status: RecommendationStatus,
  expires_at: z.string().datetime(),
  stale_reason: z.string().nullable(),
  approved_by: z.string().nullable(), approved_at: Ts.nullable(),
  applied_at: Ts.nullable(), verified_at: Ts.nullable(),
});
// Money = { amount: number (VND integer), currency: 'VND', fx?: {original, rate, at} }
```

Viết tương tự cho: `BookingSchema`, `BookingEventSchema`, `RateInventorySchema`, `ActionSchema`, `AlertSchema`, `CompetitorSnapshotSchema`, `AgentControlSchema`, và schema cho **mọi file trong `config/`** (`scripts/validate-config.ts` chạy trong CI).

---

# 11. KIỂM THỬ VÀ NGHIỆM THU

## 11.1. Test layers

1. **Unit** (domain): pricing, inventory, TTL, confidence, state machines — coverage domain ≥90%.
2. **Contract** (mỗi connector): implementation thỏa `PmsConnectorPort` + capability flags đúng.
3. **Golden** (`tests/golden/`, ≥40 kịch bản, chạy 100% trên mock connector): xem 11.2.
4. **Integration**: pipeline đầy đủ với dữ liệu anonymized.
5. **Shadow mode** ≥14 ngày cho pricing (Phase 2) — agent đề xuất song song quyết định thật, log độ lệch.
6. **Canary write-back** (Phase 3): dry-run → 1 OTA × 1 room type × 1 stay date → 10 action đúng → mở rộng 3–7 ngày → 20 action liên tiếp đúng → mở rộng toàn phạm vi duyệt.
7. **Drills**: emergency stop giữa action, restore backup, rollback conflict.

## 11.2. Golden scenarios bắt buộc

Booking mới/sửa ngày/đổi room type/hủy/no-show · duplicate event · missing event · out-of-order event · inventory âm · room block · mapping sai · rate = 0 · vượt floor/ceiling · net rate dưới ngưỡng · stale competitor data · stale recommendation · TTL expired · promotion stacking · connector timeout/retry/partial failure · approval sau khi context đổi (phải STALE) · emergency stop giữa action · concurrent manual change + rollback conflict (phải MANUAL_REVIEW) · backup restore.

Mọi thay đổi `config/pricing_rules.json` hoặc nâng version agent → chạy lại toàn bộ golden suite (gate trong CI).

## 11.3. Booking test thật (Phase 3)

Owner duyệt ngân sách + ngày test; ngày xa, 1 phòng, rate kiểm soát; SOP hủy + phí + đối soát; kiểm Booking ID, modified/cancelled event, inventory release, audit trail.

---

# 12. KẾ HOẠCH BUILD THEO GIAI ĐOẠN (ánh xạ code)

**Tổng lịch:** build chủ động 18–22 tuần; elapsed 24–30 tuần (shadow mode, nghiệm thu 4 tuần, freeze window). Bắt đầu Thg 8/2026 → Module v1.0 khoảng Thg 2–3/2027.

| Phase | Thời lượng | Build (theo file tree mục 4) | DoD chính | Gate |
|---|---|---|---|---|
| **P0 — Nền móng** | 2 tuần, Thg 8/2026 | Scaffold monorepo đúng mục 4 · `shared/schemas` đầy đủ · domain: entities, state machines, guardrails, ttl-policy · `persistence` + migrations + backup/restore script · `connectors/mock` + `seed-mock` · agent skeleton (orchestrator + mode-guard + control API) · dashboard wireframe · **nghiệp vụ:** audit 3 hệ thống bằng tài khoản thật, báo giá CM, baseline giờ/tuần, mapping, comp set | Skeleton chạy end-to-end trên mock có run log; emergency stop test pass; restore thử thành công; G0 ký | **G0** chốt tier + runtime host |
| **P1 — Read-only Control Center** | 4 tuần, Thg 9/2026 | Connector theo tier G0 (read) · use cases ingest/reconcile/alerting/brief · API endpoints P1 · dashboard: Booking Monitor, Calendar, Alerts, Agent Card · notifier Telegram | 7 ngày không unhandled critical error/mất event; P1 giả lập tới mobile <1ph (≥95%); reconciliation giải thích được mọi mismatch | **G1** dữ liệu đủ tin cậy |
| **P2 — Recommendation + Approval** | 5 tuần (gồm 14 ngày shadow), Thg 10–giữa 11/2026 | pricing-engine + scoring + freshness · GenerateRecommendations + InvalidateStale · Approval Service + SubmitDecision · Pricing Center UI + TTL countdown + bulk guardrail · competitor ingest (extranet-first/manual) · Weekly Review | 100% recommendation đủ trường + context_hash + TTL; không expired/stale nào execute được; shadow 14 ngày xong, Owner duyệt rule set v1 | **G2** Owner chọn: dừng ở Operational MVP hoặc cho build write-back |
| **P3 — Controlled Write-back** | 4–5 tuần + freeze, cuối 11/2026–1/2027 | RevalidateBeforeExecute · ExecuteAction (idempotent) · VerifyPublished · RollbackAction (compare-and-set) · EMERGENCY_STOP 2 tầng · action progress UI · Tier 3: guided checklist | 100% golden bắt buộc pass; canary ≥20 action liên tiếp đúng, 0 unauthorized/stale/duplicate write; emergency stop + rollback drill pass | **G3** phạm vi production write + allowlist candidate |
| **P4 — Safe Automation** | 6 tuần (gồm 4 tuần nghiệm thu), Thg 2–3/2027 | Scheduler production + event triggers · continuous reconciliation theo SLA · retry chính thức · auto-close theo allowlist 5.7 · escalation + incident dashboard · audit export + backup monitoring | 4 tuần: 0 action ngoài allowlist; 0 mismatch vượt SLA không alert; giờ thủ công −≥60% baseline | **G4** = Module v1.0 Complete |
| **P5 — Learning** (v1.1+) | Sau 60–90 ngày dữ liệu sạch | Forecast-vs-actual, học từ approve/modify/reject/expired/stale, điều chỉnh weight có kiểm soát (offline eval → Owner approval → canary) | Không model tự deploy rule | — |

**Freeze window:** không deploy write production trong các ngày Owner khóa (mùa cao điểm/Tết) — kiểm tra trong `ExecuteAction` precondition.

---

# 13. QUY ƯỚC CODE VÀ DX

## 13.1. Conventions

- TS strict; không `any`; không `// @ts-ignore` (ngoại lệ phải có comment lý do + issue).
- Mọi boundary (API in/out, connector in/out, LLM out, config load) validate bằng zod — "parse, don't validate".
- Error taxonomy từ `shared/errors.ts`; không throw string; use case trả `Result<T, E>` thay vì throw xuyên layer.
- Tiền: VND integer (không float). Thời gian: ISO 8601 + Asia/Ho_Chi_Minh; domain nhận `ClockPort`.
- Logging: pino, structured JSON, mask PII tại logger level (R9); mọi log gắn `run_id` khi trong run.
- ESLint rule `import/no-restricted-paths` enforce Dependency Rule 2.1 — CI fail nếu vi phạm.

## 13.2. Env vars (.env.example)

```text
DATABASE_PATH=./data/ota.db
API_PORT=4801  API_AUTH_TOKEN=
LLM_PROVIDER=anthropic|openai|template   LLM_API_KEY=   LLM_DAILY_BUDGET_USD=
TELEGRAM_BOT_TOKEN=   TELEGRAM_CHAT_ID=
SKYHOTEL_* =            # theo tier sau G0
BACKUP_DIR=  BACKUP_ENCRYPTION_KEY=
TZ=Asia/Ho_Chi_Minh
```

## 13.3. Định nghĩa hoàn thành một PR/task

Typecheck + lint + unit pass · golden liên quan pass · không vi phạm R1–R10 · schema mới có version + migration · cập nhật doc liên quan trong `docs/` nếu đổi hành vi.

## 13.4. CLAUDE.md khởi tạo (Coding Agent tạo ở Phase 0)

```markdown
# CLAUDE.md — venho-ota
- Đọc PLAN_OTA.md trước mọi task; mục 0.2 là hard rules R1–R10.
- Kiến trúc: Clean Architecture, dependency chỉ hướng vào domain (PLAN_OTA §2.1).
- Chạy test: `pnpm test` · golden: `pnpm golden` · typecheck: `pnpm typecheck`.
- Không code vượt phase hiện tại (PLAN_OTA §12). Phase hiện tại: <cập nhật tay>.
- Gặp Open Item chưa khóa (PLAN_OTA §14) → hỏi Owner, không giả định.
- Không bao giờ viết auto-reopen. Không đặt LLM vào critical path.
```

---

# 14. OPEN ITEMS VÀ THỜI HẠN KHÓA (giữ nguyên v1.3)

| # | Quyết định | Deadline |
|---|---|---|
| 1 | Skyhotel CM/API/export và chi phí thật | Gate G0 |
| 2 | Runtime host: Mac mini, VPS hoặc mini server | Gate G0 |
| 3 | Notification: Telegram/Zalo/email/push | Trước Phase 1 |
| 4 | Room/rate mapping và physical inventory | Gate G0 |
| 5 | Primary/Secondary comp set | Trước Phase 2 |
| 6 | Floor, ceiling, Minimum Acceptable Net Rate | Trước Phase 2 |
| 7 | Rate Consistency Policy và promotion exceptions | Trước Phase 2 |
| 8 | Model provider và ngân sách model | Trước Phase 2 |
| 9 | Backup operator và emergency contact | Trước Phase 3 |
| 10 | Production freeze window | Trước Phase 3 |
| 11 | Scope canary write-back | Gate G2 |
| 12 | Pre-approved auto-close rule | Gate G3 |

---

# 15. QUYẾT ĐỊNH ĐÃ LOCK (giữ nguyên v1.3, diễn đạt code-level)

1. Skyhotel = hệ thống chính cho inventory/booking nội bộ; OTA = nguồn verify publish; VENHO OS = nguồn chính cho recommendation/approval/audit (source-of-record.ts).
2. Không hai inventory độc lập cho hai OTA.
3. Không file-based transaction giữa Agent và Dashboard (R6).
4. Business rules deterministic; LLM không chặn critical ops (R1).
5. Mọi write có approval hoặc allowlist (R2).
6. Revalidate trước mọi write (R3).
7. Expired/stale không bao giờ apply (R4).
8. Auto-reopen ∉ Module v1.0 (R7).
9. Không RPA làm lõi khi có CM/API/export chính thức.
10. Tối ưu effective net revenue, không đua giá thấp nhất.
11. Mọi action: idempotency + audit + verify + conditional rollback.
12. Phạm vi: Ven Hồ Hotel + Agoda + Booking.com.
13. Không write production trong freeze window.
14. Không multi-property/enterprise khi chưa có nhu cầu thật.
15. Phase 5 chỉ sau 60–90 ngày dữ liệu sạch.

---

# 16. KPI VÀ SLO (giữ nguyên v1.3)

Overbooking do lỗi VENHO OS: 0 · reservation event mất vĩnh viễn: 0 · late sync <1% theo SLA tier · P1 delivery <1ph (≥95%) · P1 mitigation ≤60ph · unhandled critical run failure: 0 tồn đọng · recommendation đủ trường: 100% · stale/expired bị apply: 0 · unauthorized write: 0 · action log: 100% · config change không qua test/approval: 0 · manual OTA time −≥60% · write success sau canary ≥99% · restore drill pass trước P3 và mỗi quý. Occupancy/ADR/RevPAR/Net RevPAR: chỉ đặt target sau 60–90 ngày baseline.

---

# 17. KẾT LUẬN

Tài liệu này chuyển Plan v1.3 thành đặc tả Clean Architecture: domain thuần chứa toàn bộ quy tắc nghiệp vụ và guardrail; application chứa use case có contract rõ; adapters cô lập mọi I/O theo tier; agent và dashboard chỉ là composition/interface. Một AI Coding Agent bắt đầu từ Phase 0 của mục 12, tuân thủ R1–R10, và dừng lại hỏi Owner tại mọi Open Item chưa khóa.

**END OF DOCUMENT — PLAN_OTA.md v1.4 (Implementation-Ready, tái cấu trúc từ v1.3 Final)**
