# VENHO OS — OTA-01 G0-C LEAN
## DENSE TECHNICAL SPEC v1.0

> AI/VSCode source-of-truth; token-optimized; implementation-ready.

## META
- Module: `OTA-01/G0-C`
- Property: Ven Hồ Hotel; 12 rooms
- Systems: `Skyhotel.vn`, `Agoda`, `Booking.com`
- Mode: Solo Founder; Human-in-the-loop
- SSOT: Skyhotel internal room calendar/bookings/revenue
- Decision: no paid Channel Manager
- Pattern: `Structured Data + Guided Manual Action`
- Host: existing Mac mini
- Goal: reuse current Skyhotel username/password revenue agent; reduce recurring cost/manual OTA work/overbooking risk

---

# 0. LOCKS

## 0.1 Architecture
```text
Agoda/Booking.com email/extranet/public permitted rates
  → OTA Email Ingestor + Competitor Snapshot
  → VENHO OTA Agent
      ├─ Skyhotel Playwright Collector
      ├─ Booking Reconciliation Engine
      ├─ Inventory Risk Engine
      ├─ Revenue Recommendation Engine
      ├─ Alert/Daily Brief
      └─ Action Package Generator
  → Mother Dashboard/Owner Approval
  → Manual checklist OR Guided RPA(fill-only; Owner final confirm)
  → Skyhotel/Agoda/Booking.com
  → read-back/verify/audit
```

## 0.2 Mandatory rules
- Skyhotel: internal calendar, entered bookings, room blocks, revenue SSOT.
- Agoda/Booking.com: OTA booking origin/channel sell-state.
- No assumption Skyhotel↔OTA sync without Channel Manager.
- No rate/inventory/policy write without Owner Approval.
- No `auto-reopen` in v1.0.
- No credentials in source/Markdown/JSON/Git/log.
- Browser automation ≠ official API; controlled UI adapter only.
- Every action: `idempotency_key`, before/after, verify, immutable audit.
- Low confidence/ambiguous result → `MANUAL_REVIEW`; never guess.
- Deterministic Rule Engine computes; LLM explains/summarizes only.
- Default write modes disabled/read-only.
- One property; two OTA only.

---

# 1. OBJECTIVES

## Business
- Zero new Channel Manager fee.
- Reuse current Skyhotel revenue agent.
- Near-real-time OTA event detection via email.
- Detect missing Skyhotel booking, delayed inventory reduction, double-sell risk.
- 30-day rate recommendations: date/season/pickup/occupancy/competitor.
- Owner approval in Mother Dashboard.
- Generate exact checklist/Guided RPA.
- Read-back verification after action.
- Manual repetitive OTA time reduction `>=60%` vs Phase-0 baseline.

## Safety
- Unauthorized writes: `0`.
- Expired/stale recommendation applied: `0`.
- Permanently missed OTA bookings: `0`.
- Card/payment data stored: `0`.
- Emergency Stop.
- Manual fallback for agent/browser/network failure.

---

# 2. SCOPE

## In v1.0
- Skyhotel Playwright read:
  - daily revenue
  - bookings
  - check-in/out
  - room calendar
  - room block/maintenance
  - inventory
  - current rates if exposed
- Gmail OTA ingest:
  - `NEW`
  - `MODIFIED`
  - `CANCELLED`
- Normalize/reconcile OTA↔Skyhotel.
- Alerts: missing/duplicate/date mismatch/room mapping/inventory lag.
- Daily OTA Brief.
- Pricing Recommendation: next 30 days.
- Comp set + structured snapshots.
- Dashboard Owner Approval.
- Action Packages:
  - create/modify/cancel-state Skyhotel booking
  - OTA rate update
  - OTA inventory update
  - close date
  - verify/manual review
- Guided RPA: fill-only default; no final Save.
- Read-back verify.

## Out
- Real-time bidirectional Channel Manager equivalence.
- Auto-reopen.
- Fully automatic dynamic pricing.
- Automatic promotion enrollment.
- Automatic cancellation-policy changes.
- Auto cancel/reject booking.
- Direct Booking.com/Agoda Connectivity Partner API.
- Large-scale scraping.
- Multi-property/third OTA.
- Card data processing/storage.
- Replace Skyhotel.

---

# 3. STACK/TOPOLOGY

## Stack
- Runtime: Mac mini; always-on.
- Language: TypeScript; strict.
- Node: `>=20`.
- Browser: Playwright.
- API: Fastify.
- DB: SQLite `WAL`.
- Validation: Zod.
- Scheduler: node-cron/internal.
- Dashboard: existing Next.js Mother Dashboard.
- Tests: Vitest + Playwright Test.
- Logging: Pino + JSONL audit export.
- Secrets: macOS Keychain; env fallback.
- AI: OpenAI/Claude via provider adapter.
- Email: Gmail API polling; optional Make webhook.
- Package manager: pnpm workspace.

## Runtime topology
```text
Worker/Scheduler
 ├─ Skyhotel Playwright Adapter
 ├─ Gmail OTA Ingestor
 ├─ Reconciliation Engine
 ├─ Inventory Risk Engine
 ├─ Pricing Engine
 ├─ Alert Service
 └─ Action Package Generator
        ↓
    SQLite/WAL
        ↓
    Fastify API
        ↓
    Next.js Dashboard
```

## Boundaries
- Dashboard never direct SQLite read/write.
- Dashboard→Internal API only.
- Worker never calls UI components.
- Business rules: `packages/domain`.
- Browser selectors: connector Page Objects only.
- External payload→Zod validate→persist.
- Agent Mode recheck immediately before every write.
- Local-first; migrate VPS/PostgreSQL only on real trigger.

---

# 4. REPOSITORY

```text
venho-os/
├─ apps/
│  ├─ dashboard/
│  │  ├─ app/
│  │  ├─ components/
│  │  └─ lib/api-client/
│  ├─ api/
│  │  ├─ src/routes/
│  │  ├─ src/services/
│  │  ├─ src/middleware/
│  │  └─ src/server.ts
│  └─ worker/
│     ├─ src/jobs/
│     ├─ src/scheduler/
│     ├─ src/agent/
│     └─ src/index.ts
├─ packages/
│  ├─ domain/
│  │  ├─ booking/
│  │  ├─ inventory/
│  │  ├─ pricing/
│  │  ├─ approval/
│  │  ├─ action/
│  │  ├─ alert/
│  │  └─ agent-control/
│  ├─ db/
│  │  ├─ migrations/
│  │  ├─ schema/
│  │  ├─ repositories/
│  │  └─ sqlite.ts
│  ├─ connectors/
│  │  ├─ skyhotel/
│  │  │  ├─ pages/
│  │  │  ├─ selectors/
│  │  │  ├─ parsers/
│  │  │  ├─ collector.ts
│  │  │  └─ guided-writer.ts
│  │  ├─ gmail/
│  │  │  ├─ oauth.ts
│  │  │  ├─ watcher.ts
│  │  │  ├─ agoda-parser.ts
│  │  │  └─ booking-parser.ts
│  │  └─ notifications/
│  ├─ reconciliation/
│  ├─ pricing-engine/
│  ├─ competitor-intelligence/
│  ├─ reporting/
│  ├─ audit/
│  └─ ai-provider/
├─ config/ota/
│  ├─ room-mapping.json
│  ├─ rate-plan-mapping.json
│  ├─ pricing-rules.json
│  ├─ season-calendar.json
│  ├─ event-calendar.json
│  ├─ competitor-set.json
│  ├─ alert-rules.json
│  ├─ agent-control.json
│  └─ selector-profile.json
├─ data/
│  ├─ ota.sqlite
│  ├─ backups/
│  ├─ audit-export/
│  ├─ screenshots/
│  └─ failed-pages/
├─ tests/
│  ├─ fixtures/{skyhotel-html,agoda-emails,booking-emails}/
│  ├─ golden/
│  ├─ integration/
│  └─ e2e/
├─ scripts/
│  ├─ setup-keychain.sh
│  ├─ backup-db.sh
│  ├─ restore-db.sh
│  ├─ run-migrations.ts
│  └─ health-check.ts
├─ .env.example
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
└─ README.md
```

---

# 5. ENV/FLAGS/CONTROL

## `.env.example`
```bash
NODE_ENV=development
API_HOST=127.0.0.1
API_PORT=4310
DASHBOARD_BASE_URL=http://127.0.0.1:3000

SQLITE_PATH=./data/ota.sqlite
AUDIT_EXPORT_DIR=./data/audit-export
SCREENSHOT_DIR=./data/screenshots

SKYHOTEL_BASE_URL=https://admin.skyhotel.vn
SKYHOTEL_BROWSER_PROFILE=./data/browser-profile/skyhotel
SKYHOTEL_HEADLESS=true

GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_LABEL_OTA=VENHO_OTA

AI_PROVIDER=openai
AI_MODEL=
AI_DAILY_BUDGET_USD=
AI_ENABLED_FOR_BRIEF=true
AI_ENABLED_FOR_EXPLANATION=true

NOTIFICATION_PROVIDER=
NOTIFICATION_TARGET=

AGENT_DEFAULT_MODE=READ_ONLY
SKYHOTEL_WRITE_MODE=disabled
OTA_WRITE_MODE=disabled

POLL_GMAIL_MINUTES=5
SKYHOTEL_SYNC_CRON=0 6,12,18,22 * * *
PRICING_RUN_CRON=30 6 * * *
DAILY_BRIEF_CRON=15 7 * * *
BACKUP_CRON=0 * * * *
```

## Modes
- `AGENT_DEFAULT_MODE`: `RUNNING|READ_ONLY|PAUSED|EMERGENCY_STOP`.
- `SKYHOTEL_WRITE_MODE`:
  - `disabled`
  - `fill_only`
  - `confirm_save`
  - `preapproved` (post-v1.0)
- `OTA_WRITE_MODE`:
  - `disabled`
  - `guided`
  - `confirm_publish`
  - `preapproved` (out v1.0)

## `agent-control.json`
```json
{
  "schema_version": "1.0",
  "mode": "READ_ONLY",
  "updated_at": "2026-07-13T00:00:00+07:00",
  "updated_by": "owner",
  "reason": "Initial safe mode",
  "write_permissions": {
    "skyhotel": false,
    "agoda": false,
    "booking_com": false
  },
  "kill_switch": {
    "active": false,
    "activated_at": null,
    "activated_by": null,
    "reason": null
  }
}
```

---

# 6. SKYHOTEL CONNECTOR

## Contract
```ts
interface SkyhotelConnector {
  collectDailyRevenue(date: string): Promise<DailyRevenueSnapshot>;
  collectBookings(range: DateRange): Promise<BookingSnapshot[]>;
  collectInventory(range: DateRange): Promise<InventorySnapshot[]>;
  collectRoomBlocks(range: DateRange): Promise<RoomBlockSnapshot[]>;
  collectRates?(range: DateRange): Promise<RateSnapshot[]>;
  collectSyncHealth(): Promise<ConnectorHealth>;
}
```

## Login/session
- Credentials: Keychain.
- Persistent dedicated browser profile.
- No credential logging.
- Expired session:
  1. one relogin attempt
  2. 2FA/Captcha→`AUTH_REQUIRED`
  3. alert Owner
  4. no infinite retry
- Single active login/browser profile lock.
- Separate profile per target system.

## Page Objects
```text
SkyhotelLoginPage
SkyhotelDashboardPage
SkyhotelRevenueReportPage
SkyhotelBookingCalendarPage
SkyhotelBookingDetailPage
SkyhotelNewBookingPage
SkyhotelRoomStatusPage
```
Each:
- role/label/stable-text selector first; fallback selector.
- `assertPageReady()`.
- explicit timeout.
- screenshot on failure.
- PII-stripped HTML fixture on parser failure.
- DTO output only; no DOM leakage.

## Selector config
```json
{
  "schema_version": "1.0",
  "skyhotel": {
    "login": {
      "username": ["input[name='username']", "input[type='text']"],
      "password": ["input[name='password']", "input[type='password']"],
      "submit": ["button[type='submit']", "text=Đăng nhập"]
    },
    "revenue": {},
    "booking_calendar": {},
    "booking_detail": {}
  }
}
```
- Version selectors.
- Regression test fixture before deploy.

## DTO minimums
### `DailyRevenueSnapshot`
- `business_date`
- `room_revenue`
- `other_revenue?`
- `total_revenue`
- `occupied_rooms`
- `available_rooms`
- `check_ins`
- `check_outs`
- payment split if available
- `collected_at`
- `source_page`
- `source_hash`

### `BookingSnapshot`
- `skyhotel_booking_id`
- `ota_name?`
- `ota_booking_id?`
- `guest_ref_masked`
- `check_in`
- `check_out`
- `room_type`
- `room_number?`
- `total_amount`
- `status`
- `created_at?`
- `modified_at?`
- `collected_at`
- `source_hash`

### `InventorySnapshot`
- `stay_date`
- `room_type`
- `physical_sellable`
- `sold`
- `blocked`
- `internal_hold`
- `available`
- `collected_at`

## Schedule
- `06:00`: bookings+inventory+previous-day revenue.
- `12:00`: bookings+inventory.
- `18:00`: bookings+inventory.
- `22:00`: bookings+inventory+provisional revenue.
- OTA event: targeted check by booking ID/stay dates.
- Dashboard: `Run Now`.

---

# 7. OTA EMAIL INGESTOR

## Pipeline
```text
Gmail API
 → sender/subject filter
 → message_id/thread_id
 → sender allowlist verify
 → HTML/text parse
 → required-field validation
 → source_event
 → dedupe
 → Skyhotel reconciliation
 → alert/action package
```

## Rule fields
- `ota`
- `sender_pattern`
- `subject_pattern`
- `event_type`
- `parser_version`
- `enabled`
- Configure from actual account samples; no assumed sender hard-code.

## Parsed fields
- `ota`
- `ota_booking_id`
- `event_type=NEW|MODIFIED|CANCELLED`
- `event_timestamp`
- source created/updated timestamp
- `check_in`, `check_out`, nights
- `ota_room_type`
- `quantity`
- `guest_count`
- `gross_amount`, `currency`
- cancellation terms if present
- `guest_ref_masked`
- `raw_message_hash`

## Confidence
```text
ParserConfidence =
RequiredFieldsCompleteness
+ SenderAuthenticity
+ SubjectPatternMatch
+ OTABookingIdValidity
+ DateConsistency
+ RoomMappingMatch
```
- `>=0.98`: auto reconciliation.
- `0.80–0.979`: persist + `MANUAL_REVIEW`.
- `<0.80`: no booking action; parser-failure alert.

## Dedupe
- Primary: `gmail_message_id`.
- Fallback:
```text
OTA + ota_booking_id + event_type + source_updated_at + payload_hash
```
- Never process same cancellation/modification twice.

## PII
- Avoid long-term raw body.
- Persist message ID/hash/normalized fields.
- Mask guest identity.
- Encrypt/delete raw payload per retention.
- Never send full email to LLM.

---

# 8. DATA MODEL

## `source_events`
```text
id,source,source_event_id,event_type,entity_type,entity_external_id,
payload_hash,parser_version,parser_confidence,
source_created_at,source_updated_at,ingested_at,
status,error_code,created_at,updated_at
UNIQUE(source,source_event_id)
```

## `bookings`
```text
id,ota,ota_booking_id,skyhotel_booking_id,guest_ref_masked,
check_in,check_out,room_type_id,ota_room_type_text,
quantity,guest_count,gross_amount,currency,status,
source_version,context_hash,skyhotel_sync_status,last_reconciled_at,
created_at,updated_at
UNIQUE(ota,ota_booking_id)
```

## `booking_versions`
```text
id,booking_id,version_number,source_event_id,
before_json,after_json,changed_fields_json,created_at
```

## `inventory_snapshots`
```text
id,stay_date,room_type_id,physical_sellable,sold,blocked,
internal_hold,safety_buffer,calculated_available,skyhotel_available,
risk_level,source_collected_at,created_at
```

## `rate_snapshots`
```text
id,channel,stay_date,room_type_id,rate_plan_id,
headline_rate,effective_rate,currency,restrictions_json,
source_collected_at,created_at
```

## `competitor_snapshots`
```text
id,competitor_id,stay_date,nights,guests,room_type_text,
display_price,tax_fee,total_price,currency,vnd_price,
cancellation_policy,meal_plan,availability,comparability_score,
source,collected_at,expires_at,created_at
```

## `recommendations`
```text
id,stay_date,room_type_id,ota_scope,current_rate,reference_rate,
recommended_rate,effective_net_rate,factor_breakdown_json,confidence,
data_freshness_json,rule_version,context_hash,status,expires_at,
stale_reason,created_at,updated_at
```

## `approvals`
```text
id,recommendation_id,decision,modified_rate,reason,actor,
nonce,context_hash,created_at
```

## `action_packages`
```text
id,action_type,target_system,booking_id,recommendation_id,status,mode,
instructions_json,before_state_json,requested_state_json,actual_state_json,
idempotency_key,approved_by,approved_at,started_at,completed_at,
verified_at,failure_reason,created_at,updated_at
```

## `alerts`
```text
id,severity,type,entity_type,entity_id,title,description,
recommended_action,status,detected_at,acknowledged_at,resolved_at,
assigned_to,created_at,updated_at
```

## `agent_runs`
```text
id,run_type,mode,started_at,finished_at,status,
records_read,records_written,alerts_created,recommendations_created,
error_count,cost_estimate,metadata_json
```

## `audit_log` append-only
```text
id,timestamp,actor_type,actor_id,action,entity_type,entity_id,
before_json,after_json,result,run_id,correlation_id,checksum
```

---

# 9. BOOKING RECONCILIATION

## Match order
1. exact OTA booking ID.
2. OTA+check-in/out+room type+amount.
3. dates+room type+masked guest ref.
4. multiple candidates→`MANUAL_REVIEW`.
5. low confidence→no merge.

## State
```text
RECEIVED→PARSED→RECONCILING→MATCHED→SKYHOTEL_CONFIRMED
                      ├→SKYHOTEL_MISSING
                      ├→MAPPING_ERROR
                      ├→DATA_CONFLICT
                      └→MANUAL_REVIEW
```

## New booking
1. ingest.
2. validate/dedupe.
3. targeted Skyhotel collect.
4. match.
5. match+equal→confirm; recompute inventory; close event.
6. missing→P1/P2 by lead time + `CREATE_SKYHOTEL_BOOKING`.
7. `fill_only`→open form/fill/Owner Save.
8. read-back→verify→audit.

## Modification
- Diff before/after.
- Inventory-impact fields: `check_in`,`check_out`,`room_type`,`quantity`,`status`.
- No direct edit if:
  - checked-in
  - complex payment
  - new room type unavailable
  - parser confidence low
- Action Package includes old/new, release dates, hold dates, conflicts.

## Cancellation
- Never delete automatically.
- Action: update cancellation status.
- Verify cancellation ID/timestamp.
- Post-update recompute inventory.
- No auto-reopen.
- Generate Owner reopen proposal only.

## Retry missing booking
- T+0, +5m, +15m, +30m.
- After 30m:
  - check-in `0–7d`→P1.
  - `>7d`→P2.
  - manual action.
- Retry idempotent; alert dedupe.

---

# 10. INVENTORY RISK

## Formula
```text
SafeSellableInventory =
PhysicalSellable
- ConfirmedActiveBookings
- Maintenance/OutOfService
- ConfirmedInternalHolds
- SafetyBuffer
```

## Safety buffer
- Per room type; not global hard-code.
- Room type 1 room: default buffer `0`; use close-early/allotment control.
- Room type `>=2`: pilot may use buffer `1`.
- Dashboard shows revenue impact.
- Owner-configured.

## Channel allotment cap
```text
AgodaCap + BookingComCap
<= SafeSellableInventory + SharedRiskAllowance
```
- `SharedRiskAllowance=0` pilot.
- Config example:
```json
{
  "room_type_id": "ROOM_TYPE_ACTUAL",
  "physical_rooms": 0,
  "safety_buffer": 0,
  "agoda_cap": 0,
  "booking_com_cap": 0,
  "primary_channel": "booking_com"
}
```
- Fill actual values Phase 0 only.

## Risk levels
- `NORMAL`:
  - safe sellable `>=3`
  - no pending booking
  - no mapping error
- `WARNING`:
  - safe sellable `=2`
  - unreconciled booking `>15m`
  - channel allotment exceeds cap
- `CRITICAL`:
  - safe sellable `<=1` + both OTA open
  - safe sellable `=0` + any OTA inventory
  - OTA booking missing Skyhotel
  - negative inventory
  - modification causes overlap

## On OTA event
1. recompute.
2. verify each OTA cap.
3. create reduce-inventory action for other channel.
4. if `0`: P1 + `CLOSE_OTA_DATE`.
5. cancellation: no auto-reopen.
6. Owner review/reopen.

---

# 11. PRICING ENGINE

## Principles
- No LLM-generated rate.
- Net revenue optimization; no lowest-price race.
- Floor/ceiling/minimum net mandatory.
- Stale competitor data excluded.
- Max one routine recommendation per stay-date/room-type/24h.

## Formula
```text
ReferenceRate =
BaseRate
× SeasonFactor
× DayOfWeekFactor
× EventFactor
× ProductFactor

DemandAdjustment =
OccupancyWeight×OccupancySignal
+ PickupWeight×PickupSignal
+ LeadTimeWeight×LeadTimeSignal
+ CompetitorWeight×CompetitorSignal

CandidateRate = ReferenceRate × (1 + DemandAdjustment)
```

## Guardrails
```text
RoutineAdjustment ∈ [-15%,+15%]
PriceFloor <= RecommendedRate <= PriceCeiling
EffectiveNetRate >= MinimumAcceptableNetRate
```
- VND rounding step configurable; default `10,000`.
- Rounding cannot breach min net.

## Effective net
```text
EffectiveNetRate =
PublishedRate
- OTACommission
- PromotionCost
- PaymentCost
- EstimatedRefundCompensationProvision
```
Each component: `confirmed|estimated|unknown`.
Unknown commission/promotion→confidence penalty.

## Confidence
```text
Confidence =
0.35 DataCompleteness
+0.25 DataFreshness
+0.20 CompetitorComparability
+0.20 InventoryReliability
```
- `80–100`: High.
- `60–79`: Medium.
- `<60`: insight only; no Apply.

## TTL
- stay `0–2d`: `2h`.
- `3–7d`: `6h`.
- `8–30d`: end-of-day.
- `>30d`: `24h`.

## Stale triggers
- inventory/current rate/booking changed.
- event calendar changed.
- competitor snapshot expired.
- pricing rule version changed.
- context hash mismatch.
- stale→no execution.

## Required recommendation payload
- stay date/room type/channel scope
- current/reference/recommended rate
- delta amount/percent
- occupancy % + absolute rooms
- pickup/lead time
- competitor median/freshness
- factor breakdown
- effective net rate
- confidence/explanation
- TTL/context hash/rule version

---

# 12. COMPETITOR INTELLIGENCE

## Input priority
1. OTA extranet market insight.
2. Owner Dashboard entry.
3. CSV/XLSX import.
4. Low-frequency public-page collection only after Owner approval.
- No large-scale scraping.

## Comp set
- Primary `5`.
- Secondary `5`.
- Watch List.

## Snapshot
- competitor ID
- stay date/nights/guests
- room type
- display price/taxes/fees/total/currency
- cancellation/breakfast/availability
- source/collected_at
- comparability score

## Freshness
- stay `0–7d`: max `24h`.
- `8–30d`: max `72h`.
- `31–90d`: max `7d`.
- holiday/event: max `24h`.

## Exclude from primary median
- materially different segment/model.
- apartment/homestay.
- incompatible cancellation.
- tax-inclusion mismatch.
- non-equivalent room.
- stale snapshot.

---

# 13. ACTION PACKAGE

## Types
```text
CREATE_SKYHOTEL_BOOKING
MODIFY_SKYHOTEL_BOOKING
CANCEL_SKYHOTEL_BOOKING
UPDATE_OTA_RATE
UPDATE_OTA_INVENTORY
CLOSE_OTA_DATE
VERIFY_STATE
MANUAL_REVIEW
```

## Schema
```json
{
  "schema_version": "1.0",
  "action_id": "act_xxx",
  "action_type": "UPDATE_OTA_RATE",
  "target_system": "booking_com",
  "mode": "guided",
  "status": "READY",
  "expires_at": "2026-07-13T18:00:00+07:00",
  "context_hash": "sha256:...",
  "before_state": {
    "stay_date": "2026-08-01",
    "room_type_id": "actual_room_type",
    "rate": 0
  },
  "requested_state": {"rate": 0},
  "instructions": [
    {"step": 1, "title": "Mở extranet", "expected_page": "Calendar"},
    {"step": 2, "title": "Chọn ngày và loại phòng"},
    {"step": 3, "title": "Nhập giá mới"},
    {"step": 4, "title": "Owner kiểm tra và xác nhận"}
  ],
  "verification": {"required": true, "method": "read_back"}
}
```
- Templates contain no real hard-coded rates.

## State
```text
DRAFT→READY→OWNER_APPROVED→IN_PROGRESS→APPLIED→VERIFIED→COMPLETED
 ├→REJECTED
 ├→EXPIRED
 ├→STALE
 ├→FAILED
 └→MANUAL_REVIEW
```

## Pre-execution revalidation
- TTL valid.
- context hash current.
- current rate/inventory unchanged.
- Agent Mode permits.
- no active session conflict.
- outside freeze window.
- Any fail→`STALE`.

---

# 14. GUIDED RPA

## Default
- Navigate correct page/entity/date/room type.
- Fill values.
- Capture before screenshot.
- Stop before Save/Publish.
- Owner final confirmation.

## Optional post-acceptance `confirm_save`
- Dashboard Owner approval.
- nonce+context hash.
- one execution.
- immediate verify.
- no blind write retry.

## Safety
- No fixed mouse coordinates.
- No Save unless page/entity/date/room-type assertions pass.
- No initial bulk writes.
- One entity/write action.
- Before/after screenshots.
- UI change→stop; no selector guessing.
- Captcha/2FA→Owner takeover.
- Mid-action expiry→`FAILED_SAFE`.
- One browser writer/system.
- Read retry allowed.
- Write retry only if:
  - prior write confirmed absent
  - idempotency check safe
  - approval valid
  - retry count `<=1`
- Uncertain→`MANUAL_REVIEW`.

---

# 15. INTERNAL API

## Health/agent
```http
GET  /api/v1/health
GET  /api/v1/agent/status
POST /api/v1/agent/run
POST /api/v1/agent/mode
POST /api/v1/agent/emergency-stop
```

## Booking/reconciliation
```http
GET  /api/v1/bookings
GET  /api/v1/bookings/:id
GET  /api/v1/bookings/:id/versions
POST /api/v1/reconciliation/run
POST /api/v1/reconciliation/:bookingId/retry
```

## Inventory
```http
GET /api/v1/inventory
GET /api/v1/inventory/risks
GET /api/v1/calendar
```

## Recommendation/approval
```http
GET  /api/v1/recommendations
GET  /api/v1/recommendations/:id
POST /api/v1/recommendations/:id/approve
POST /api/v1/recommendations/:id/modify
POST /api/v1/recommendations/:id/reject
```
```json
{
  "decision": "APPROVE",
  "actor": "owner",
  "nonce": "single-use-nonce",
  "context_hash": "sha256:...",
  "reason": "Approved for weekend demand"
}
```

## Actions
```http
GET  /api/v1/actions
GET  /api/v1/actions/:id
POST /api/v1/actions/:id/start
POST /api/v1/actions/:id/confirm
POST /api/v1/actions/:id/verify
POST /api/v1/actions/:id/fail
```

## Alerts
```http
GET  /api/v1/alerts
POST /api/v1/alerts/:id/acknowledge
POST /api/v1/alerts/:id/resolve
```

## Competitors
```http
GET  /api/v1/competitors
POST /api/v1/competitor-snapshots
POST /api/v1/competitor-snapshots/import
```

## API security
- bind `127.0.0.1`.
- local Dashboard/API MVP.
- session auth.
- CSRF protection.
- write endpoint rate limit.
- re-auth for Emergency Stop/write confirm.
- every POST→audit.
- no full PII response.

---

# 16. DASHBOARD

## Menu
```text
OTA & Revenue
├─ G0-C Overview
├─ Booking Reconciliation
├─ Calendar & Inventory Risk
├─ Pricing Center
├─ Competitor Watch
├─ Action Queue
├─ Alerts
└─ Settings & Logs
AI Agent Center
└─ OTA Agent
```

## Overview cards
- Agent mode.
- Skyhotel/Gmail last sync.
- bookings new 24h.
- missing Skyhotel bookings.
- Owner-action bookings.
- Critical inventory.
- rooms sellable tonight.
- pending actions.
- pending pricing approvals.
- P1/P2.
- daily revenue.
- estimated manual time saved.

## Booking Reconciliation columns/actions
- OTA/OTA booking ID/event type/check-in-out/OTA room type.
- Skyhotel ID/match confidence/sync/risk/last checked.
- Retry check/Open Skyhotel/Create Action/Manual resolve/View email metadata/Version history.

## Calendar & Inventory Risk
- per date/room type:
  - physical/sold/blocked/buffer/safe sellable
  - Agoda cap/Booking.com cap
  - risk
  - pending OTA booking
  - required action
- Always absolute room counts + percentages.

## Pricing Center
- current/reference/recommended.
- occupancy absolute/%.
- pickup.
- comp median/freshness.
- net/confidence/TTL/explanation.
- Approve/Modify/Reject.
- Generate Action Package.

## Action Queue
- Need Approval.
- Ready Manual.
- Guided Ready.
- Waiting Verification.
- Failed/Manual Review.
- Completed.

## OTA Agent card
- mode/last-next run.
- browser/Gmail auth.
- connector health.
- latest error.
- Run Now/Read Only/Pause/Resume/Emergency Stop.
- model usage/cost.

---

# 17. ALERTS

## P1
- New booking check-in `0–7d`, missing Skyhotel `>30m`.
- safe inventory `0` while OTA still open.
- negative inventory.
- modification overlap.
- unauthorized write attempt.
- unknown post-write result.
- credential/security incident.
- Delivery target: `<1m` in `>=95%` tests.
- Owner acknowledge: `<10m`.
- mitigation: `<60m`.

## P2
- Missing Skyhotel booking check-in `>7d`.
- room mapping mismatch.
- rate/inventory update required.
- stale competitor data lowers confidence.
- Skyhotel collector fails twice.
- medium-confidence parser.

## P3/P4
- listing inconsistency.
- missing comp snapshot.
- low-confidence recommendation.
- promotion optimization.
- selector update needed.

## Dedupe
```text
alert_type + entity_id + active_context_hash
```
- Reopen only context changed or prior resolved.

---

# 18. SCHEDULER/LOCKING

| Job | Schedule | LLM |
|---|---:|---|
| Gmail OTA poll | 5m | No |
| Skyhotel full sync | 06:00,12:00,18:00,22:00 | No |
| Targeted Skyhotel check | OTA event | No |
| Reconciliation retry | +5/+15/+30m | No |
| Pricing run | 06:30 daily | No |
| Explanation generation | post-pricing | Yes+fallback |
| Daily OTA Brief | 07:15 | Yes+fallback |
| Weekly Revenue Review | Monday 08:00 | Yes |
| SQLite backup | hourly | No |
| Full encrypted backup | 02:00 daily | No |
| Audit JSONL export | 23:50 daily | No |

## Locks
- One instance/job type.
- Targeted checks parallel by booking ID; bounded concurrency.
- Browser writer concurrency `1` per system.
- Timeout→explicit failed state; no hanging.

---

# 19. SECURITY

## Keychain
```bash
security add-generic-password \
  -a "venho-ota-agent" \
  -s "skyhotel.username" \
  -w "<username>"

security add-generic-password \
  -a "venho-ota-agent" \
  -s "skyhotel.password" \
  -w "<password>"
```
- Wrapper reads secrets.
- No terminal/log echo.

## `.gitignore`
```gitignore
.env
data/*.sqlite
data/*.sqlite-*
data/browser-profile/
data/screenshots/
data/failed-pages/
data/backups/
gmail-token.json
*.secret
```

## Data/browser
- Mask guest data.
- No card data.
- No raw booking email to LLM.
- Screenshot PII blur/short retention.
- Encrypted backups.
- Dashboard session timeout.
- Emergency Stop two-step confirm.
- Browser profile filesystem restricted.
- No cloud-drive sync.
- No personal browsing profile.
- One profile/target.

---

# 20. BACKUP/RESTORE

## Targets
- RPO `<=1h`.
- critical audit immediate flush.
- RTO `<=4h`.
- manual fallback immediate.

## Retention
- online SQLite backup hourly.
- encrypted full daily.
- config/rules Git.
- audit JSONL daily.
- hourly `48`; daily `30`; monthly `12`.

## Restore drill
1. stop worker.
2. backup current DB.
3. restore latest to new file.
4. integrity check.
5. API test port.
6. verify bookings/alerts/recommendations/audit.
7. record restore report.
8. no real write.

---

# 21. EDGE CASES

- Duplicate email→message-ID dedupe; no second action.
- Modification before New:
  - upsert OTA ID
  - mark out-of-order
  - inspect Gmail thread
  - no create action if incomplete
- Skyhotel lacks OTA ID:
  - fallback dates/room/amount
  - multiple candidates→manual
- Room-type text change:
  - versioned mapping
  - no low-similarity fuzzy auto-map
  - Owner confirms
- Multi-room:
  - persist `quantity`
  - decrement each stay night by quantity
- Stay nights: `[check_in,check_out)`.
- Cancellation after check-in→manual; no full release.
- Manual Skyhotel edit→context conflict; no overwrite.
- Skyhotel UI change→page-ready fail/screenshot/stop/alert; no production selector guess.
- Network loss around Save:
  - no immediate retry
  - read state
  - correct→verified
  - unchanged→Owner retry decision
  - unknown→manual
- Approved recommendation + new booking→context changed→`STALE`.
- One-room room type:
  - buffer `0`
  - close-early rule
  - avoid independent dual-OTA inventory
- Owner absent:
  - TTL expiry
  - no auto-apply
  - P1 backup contact
  - current rate retained
- AI provider fail:
  - pricing/reconciliation continue
  - template brief
  - model failure log
- Gmail unavailable→alert/retry; scheduled Skyhotel checks continue.
- Skyhotel unavailable→alert; no assumptions/writes.
- Concurrent manual edit→context mismatch/stale.
- Invalid currency→quarantine/manual.
- Freeze window→block writes.

---

# 22. TESTS

## Unit
- inventory formula.
- stay-night.
- dedupe/event ordering.
- modification diff.
- TTL/stale context.
- floor/ceiling/min net.
- confidence.
- alert dedupe.
- state machines.

## Connector
- login/session expiry/2FA.
- changed page/empty table/pagination/slow/partial.
- revenue/booking/inventory parser.
- Fixture-based; no live login required for regression.

## Email parser
- Agoda/Booking.com: New/Modified/Cancelled.
- plain/HTML.
- missing amount/room type.
- multi-room.
- non-VND.
- duplicate.
- forwarded/fake sender.

## Golden `>=40`
1. new booking matched
2. new missing
3. duplicate email
4. modify dates
5. modify room
6. shorten stay
7. normal cancellation
8. post-check-in cancellation
9. multi-room
10. negative inventory
11. one-room type
12. safety buffer
13. mapping missing
14. zero rate
15. below floor
16. below minimum net
17. stale competitor
18. expired recommendation
19. stale after booking
20. Owner modified rate
21. fill-only
22. expired session
23. 2FA
24. Captcha
25. selector changed
26. network loss pre-Save
27. network loss post-Save
28. unknown write
29. Emergency Stop pre-write
30. Emergency Stop mid-run
31. AI unavailable
32. Gmail unavailable
33. Skyhotel unavailable
34. DB restore
35. concurrent edit
36. alert dedupe
37. bulk action rejected
38. freeze window
39. invalid currency
40. audit checksum

## Acceptance
- Critical business-rule unit tests: 100%.
- Golden tests: 100% before phase gate.
- stale write: 0.
- duplicate write: 0.
- credential leakage: 0.
- read-only pilot: 7 days, no unhandled critical error.
- Guided RPA: 20 correct consecutive actions before `confirm_save`.

---

# 23. PHASED BUILD

## G0C-0 Audit/lock — 1w
### Build
- Audit current revenue agent.
- Extract login/collector.
- Lock real room types/physical inventory.
- Lock Agoda/Booking.com/Skyhotel mapping.
- Collect actual New/Modified/Cancelled email samples.
- Lock sender allowlist.
- Lock safety buffer/allotment caps.
- Lock notification channel.
- Baseline manual OTA hours/week.
- PII-stripped fixtures.
### Outputs
- `G0C_AUDIT_REPORT.md`
- `room-mapping.json`
- `rate-plan-mapping.json`
- `email-parser-rules.json`
- `inventory-policy.json`
- fixtures
- risk register
### DoD
- Owner-approved mapping.
- samples for each used event type.
- connector mock/test run.
- zero foundational open decisions.

## G0C-1 Skyhotel Structured Collector — 2w
### Build
- Playwright persistent profile.
- Keychain adapter.
- revenue/booking/inventory collectors.
- Page Objects.
- screenshots/error handling.
- SQLite/migrations.
- run logs/scheduler/backups.
### DoD
- 7-day read-only.
- revenue matches Skyhotel.
- valid booking/inventory schemas.
- safe session-expiry handling.
- backup/restore pass.

## G0C-2 Email/Reconciliation — 2w
### Build
- Gmail OAuth/label.
- Agoda/Booking parsers.
- dedupe/confidence.
- matching/retry.
- P1/P2.
- manual queue.
### DoD
- all fixtures parse.
- no duplicate records.
- missing booking alert SLA.
- modification/cancellation inventory-safe.
- no unnecessary raw PII.

## G0C-3 Dashboard Read-only/Action Queue — 2w
### Build
- Fastify API.
- Overview.
- Reconciliation.
- Calendar/Risk.
- Alerts.
- Agent Card.
- Run Now/Ack/Resolve.
- Action Package/audit.
### DoD
- Owner sees all pending bookings/risks/tasks.
- no DB/file access required.
- auth/audit write endpoints.

## G0C-4 Pricing/Competitor — 2–3w
### Build
- pricing/season/event/floor/ceiling/min-net.
- comp set/snapshot.
- confidence/freshness.
- recommendation/approval.
- Daily/Weekly Brief.
- 14-day shadow mode.
### DoD
- 30-day recommendations.
- every rec: TTL/context hash/rule version.
- low confidence no Apply.
- 14-day shadow complete.
- Owner-approved rule set v1.

## G0C-5 Guided Action/Verify — 2–3w
### Build
- Skyhotel `fill_only`.
- OTA guided navigation.
- screenshots.
- revalidation/verification.
- action state.
- Emergency Stop/freeze window.
- manual fallback SOP.
### DoD
- 20 consecutive correct guided actions.
- no default auto-Save.
- no stale action.
- unknown→manual.
- Emergency Stop drill pass.

## G0C-6 Pilot — 4w
### Measure
- missed bookings.
- near-overbooking.
- manual hours.
- alert/parser accuracy.
- connector uptime.
- recommendation acceptance.
- revenue trend.
- AI cost.
- selector maintenance.
### DoD
- no permanently missed booking.
- no module-caused overbooking.
- manual time `>=60%` reduction.
- no terminal needed.
- decision report: continue G0-C / enhance Guided RPA / reconsider CM.

---

# 24. MODULE DoD

- Current agent converted to structured Skyhotel connector.
- Agoda/Booking.com email ingestion.
- New/modified/cancelled reconciliation.
- Missing booking alert+Action Package.
- Dashboard date/room-type inventory risk.
- Actual safety buffer/allotment caps configured.
- Pricing: Owner Approval+TTL+stale protection.
- Competitor: freshness+comparability.
- Guided RPA default fill-only.
- Every action: before/after/audit/verify.
- Emergency Stop.
- hourly backup+restore drill.
- no source credentials.
- no module-caused pilot overbooking.
- manual repetitive work reduction `>=60%`.
- daily operation via Mother Dashboard.

---

# 25. KPI

| KPI | Target |
|---|---:|
| Permanently missed OTA booking | 0 |
| Duplicate event→double action | 0 |
| Missing Skyhotel booking beyond SLA | <1% |
| P1 mobile delivery | <1m in >=95% tests |
| Stale/expired action executed | 0 |
| Unauthorized write | 0 |
| Complete audit | 100% |
| High-confidence parser error | <1% post-pilot |
| Manual OTA time reduction | >=60% |
| Skyhotel collector success | >=99% operating hours |
| Guided action verified | >=99% |
| Module-caused overbooking | 0 |
| Backup restore drill | Pass |
| LLM in sync/reconciliation | 0 |

---

# 26. COST CONTROL

## No new cost
- Channel Manager.
- cloud DB.
- VPS in MVP.
- LLM for polling/parsing/reconciliation/pricing math.
- scraping service.

## Possible cost
- AI explanation/brief tokens.
- optional Make.
- Mac mini electricity/network.
- selector maintenance.
- future VPS.

## AI budget controls
- one Daily Brief/day.
- batch explanations.
- cache by `context_hash`.
- template fallback over budget.
- dashboard model usage/cost.
- sync/alert independent of AI.

---

# 27. CHANNEL MANAGER RECONSIDERATION TRIGGERS

Reopen CM decision if any:
1. serious overbooking/near-miss from dual-OTA delay.
2. stable G0-C manual OTA work still `>3–4h/week`.
3. frequent occupancy `>80%`, fast inventory churn.
4. near-simultaneous Agoda/Booking.com bookings.
5. third OTA.
6. second property.
7. UI changes make RPA maintenance expensive.
8. Mac mini/network uptime insufficient.
9. labor+risk cost > CM quote.
10. Owner requires true automatic inventory sync.

No trigger→G0-C remains default.

---

# 28. VSCODE AI CODING RULES

1. Read full spec before code.
2. Implement assigned phase only.
3. No CM/direct OTA API scope expansion.
4. Never enable write mode autonomously.
5. No hard-coded credentials.
6. Zod validation mandatory.
7. No business logic in Page Objects.
8. No `any` without documented exception.
9. TypeScript strict.
10. Migration: rollback or backup instruction.
11. Write endpoint: auth+audit+idempotency.
12. Check Agent Mode immediately pre-write.
13. Browser failure→fail-safe; no guessing.
14. No full PII to LLM.
15. No LLM in reconciliation.
16. Pricing rule change→golden tests.
17. Selector change→connector regression tests.
18. No merge with failed critical test.
19. Update `CHANGELOG.md`+Step File each phase.
20. Do not claim completion before DoD.

---

# 29. CODE ORDER

## Sprint 1
- monorepo.
- TS strict/ESLint/Prettier/Vitest.
- SQLite/migrations.
- domain schemas.
- audit logger.
- agent-control.
- inventory/booking-state unit tests.

## Sprint 2
- refactor current Skyhotel agent→connector.
- Page Objects.
- Keychain.
- revenue/booking/inventory parsers.
- fixtures/regression.
- scheduler/run logs.

## Sprint 3
- Gmail OAuth/watcher.
- Agoda/Booking parsers.
- dedupe.
- reconciliation.
- alerts.

## Sprint 4
- Fastify API.
- Overview.
- Booking Reconciliation.
- Calendar/Risk.
- Agent Card.
- Action Queue.

## Sprint 5
- Pricing.
- competitor snapshots.
- recommendation state.
- approval.
- Daily/Weekly Brief.
- shadow mode.

## Sprint 6
- Guided Skyhotel/OTA writers.
- verification.
- Emergency Stop.
- backup/restore drill.
- pilot.

---

# 30. GO-LIVE CHECKLIST

## Read-only
- [ ] mapping approved
- [ ] credentials Keychain
- [ ] `.env` uncommitted
- [ ] email fixtures pass
- [ ] Skyhotel connector pass
- [ ] backup pass
- [ ] notification pass
- [ ] mode=`READ_ONLY`
- [ ] Emergency Stop works
- [ ] Dashboard visible

## Guided
- [ ] read-only stable 14d
- [ ] golden tests 100%
- [ ] context hash/stale tests pass
- [ ] before/after screenshot
- [ ] `SKYHOTEL_WRITE_MODE=fill_only`
- [ ] `OTA_WRITE_MODE=guided`
- [ ] no auto-Save
- [ ] freeze window approved
- [ ] manual fallback SOP stored/printed
- [ ] restore drill pass

---

# 31. FINAL LOCK

- Build order: `Read-only → Reconciliation → Pricing → Guided Action → Pilot`.
- No full autonomous write in v1.0.
- Skyhotel remains primary room-management system.
- Email OTA = near-real-time event signal.
- Deterministic rules = decisions/numbers.
- LLM = explanation/brief only.
- Owner = final authority.
- G0-C = default until CM trigger occurs.
