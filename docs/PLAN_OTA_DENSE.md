# PLAN_OTA_DENSE.md — VENHO OS OTA-01 · v1.4-dense
Scope: Ven Hồ Hotel, 12 phòng, Agoda+Booking.com+Skyhotel.vn. Approver: Owner. Nguồn: PLAN_OTA.md v1.4 (doc gốc thắng khi mâu thuẫn).

## 0. HARD RULES R1–R10
- R1: LLM ∉ critical path (sync/reconcile/pricing/approval/write). LLM chỉ explanation/brief; lỗi → template fallback.
- R2: mọi external write cần (approval ∨ allowlist) + idempotency_key + audit.
- R3: trước write: re-read state, so context_hash; lệch → STALE, không ghi.
- R4: EXPIRED/STALE không bao giờ execute. Enforce tại domain state machine.
- R5: floor/ceiling/minNetRate/±15% enforce DUY NHẤT tại `domain/policies/guardrails.ts`.
- R6: Agent↔Dashboard không giao tiếp qua file. Chỉ Internal API + SQLite tx. File = config versioned + docs + audit export.
- R7: KHÔNG code auto-reopen (kể cả feature flag). ∉ Module v1.0.
- R8: check AgentControl.mode 2 tầng: đầu run + trước mỗi write tool call. EMERGENCY_STOP chặn cứng tại ActionExecutor.
- R9: secrets chỉ từ env; không commit/log. PII mask; không PAN/CVC.
- R10: mọi record có schema_version; mọi run có run_id+rule_version; audit append-only.

Workflow agent: 1 phase = 1 Step File (Input/Output/Tasks/DoD/OutOfScope). DoD task = typecheck+lint+test+golden pass. Không code vượt phase. Open Item chưa khóa → hỏi Owner.

## 1. MỐC SẢN PHẨM
- Operational MVP = P0–P2 (read+alert+recommend+approve, no write-back).
- Module v1.0 = P0–P4 (controlled write-back + safe automation).
- Module v1.1 = P5 learning, sau ≥60–90d dữ liệu sạch.
- Out-of-scope v1.0: direct OTA connectivity, no-approval dynamic pricing, auto-reopen, payment/dispute, multi-property, scraping trái ToS, review engine (→M1).

## 2. KIẾN TRÚC
- Clean Architecture, dependency chỉ hướng vào: `domain` ← `application` ← `adapters|api|agent|dashboard`. `shared` = types/zod only.
- Tiers: T1 Skyhotel CM · T2 Skyhotel API/webhook · T3 structured export+guided manual · T4 RPA (cấm làm lõi). Gate G0 chọn A/B/C. Trước G0: chỉ mock connector. Code tier-agnostic qua `PmsConnectorPort`.
- Deploy: P0–2 single-node (Mac mini always-on); trước P3: always-on/VPS xác nhận. Dashboard trên Vercel → chỉ gọi API HTTPS+token, không dùng FS Vercel. SQLite WAL, 1 writer (API+agent cùng process, UnitOfWork).

## 3. STACK (LOCK)
TS strict toàn repo · Node ≥20 · pnpm workspaces · Zod (schema=source of truth) · SQLite+WAL+Drizzle · Fastify · Next.js App Router+Tailwind · node-cron · LLM adapter (anthropic|openai|template) · Telegram notifier · Vitest+golden JSON · ESLint boundary rule.

## 4. FILE TREE
```text
venho-ota/
├── PLAN_OTA.md · CLAUDE.md · package.json · pnpm-workspace.yaml · tsconfig.base.json · .env.example · .gitignore
├── docs/            # 00_MASTER_INDEX, 01_MODULE_PLAN_v1.4, 02_OPERATING_RULES, 03_APPROVAL_POLICY,
│                    # 10_DASHBOARD_SPEC, 14_SOURCE_OF_RECORD_MATRIX, 15_CONNECTOR_CAPABILITY_REPORT,
│                    # 16_INCIDENT_SOP, 17_TEST_PLAN, 18_BACKUP_RECOVERY_PLAN, decisions/(G0..G4)
├── config/          # room_mapping, rate_plan_mapping, competitor_set, pricing_rules, season_calendar,
│                    # event_calendar, alert_rules, preapproved_rules, rate_consistency_policy (.json) + history/
├── packages/
│   ├── shared/src/{schemas/*, constants.ts, errors.ts}
│   ├── domain/src/
│   │   ├── entities/{Booking,RateInventory,Recommendation,ActionRecord,Alert}
│   │   ├── value-objects/{Money,StayDate,Percentage,RunId}
│   │   ├── state-machines/{booking-lifecycle,recommendation,agent-mode}.ts
│   │   ├── services/{pricing-engine,inventory-calculator,dedupe,context-hash}.ts
│   │   ├── services/scoring/{confidence,comparability,freshness}.ts
│   │   └── policies/{guardrails,ttl-policy,allowlist,rate-consistency,source-of-record}.ts
│   ├── application/src/
│   │   ├── ports/{pms-connector,ota-verify,repositories,unit-of-work,llm,notifier,clock}.port.ts
│   │   ├── use-cases/{ingest,reconcile,pricing,approval,execution,alerting,reporting,control}/
│   │   └── dto/
│   ├── adapters/src/
│   │   ├── persistence/{db,schema,migrations/,repositories/,unit-of-work}.ts
│   │   ├── connectors/{mock,skyhotel-cm,skyhotel-api,structured-import,ota-verify}/
│   │   ├── llm/{provider,anthropic,openai,template,budget-guard}.ts
│   │   ├── notifications/telegram.ts · audit/jsonl-exporter.ts · backup/snapshot.ts
│   ├── agent/src/{index,orchestrator,scheduler,mode-guard}.ts + skills/{operations,competitor,revenue,sync-control}.skill.ts
│   └── api/src/{server,auth}.ts + routes/
├── apps/dashboard/src/
│   ├── app/(ota)/{overview,bookings,calendar,pricing,competitors,alerts,settings}/
│   ├── app/agent-center/
│   ├── components/{ApprovalCard,TtlCountdown,ConfidenceBadge,FreshnessBadge,ModeBadge,TwoStepConfirm,OccupancyDisplay}
│   └── lib/api-client.ts
├── tests/{golden/{fixtures,scenarios},contract,drills}/
└── scripts/{seed-mock,backup,restore-drill,audit-export,validate-config}.ts
```
Runtime state (`data/ota.db`), `.env`, backups ∉ docs/config, không sync/commit.

## 5. DOMAIN
### 5.1 Booking
- Lifecycle: NEW→CONFIRMED→MODIFIED→CANCELLED|NO_SHOW|COMPLETED.
- Event fields: source_event_id, source_updated_at, ingested_at, event_type, version.
- dedupe_key = hash(ota, property_id, ota_booking_id, source_version||source_event_id).
- Upsert theo version: cũ hơn → skip+log; lặp → skip; out-of-order → sort theo source_updated_at.
- MODIFIED: tính delta nights, cấm double release/hold. Stay nights = [check_in, check_out).

### 5.2 Inventory
```
available = physicalSellable − activeBookingNights − maintenanceBlocks − confirmedInternalHolds − safetyBuffer
```
- buffer: 0 (T1–2 sau nghiệm thu) | 1 (T3/pilot, Owner duyệt).
- Kết quả âm: không clamp; emit NEGATIVE_INVENTORY → alert P1.
- Không reopen từ cancellation event đơn lẻ (R7).

### 5.3 Recommendation SM + TTL
```
DRAFT→RECOMMENDED→OWNER_REVIEW→APPROVED|MODIFIED|REJECTED|EXPIRED|STALE
APPROVED/MODIFIED→SCHEDULED→EXECUTING→PUBLISHED→VERIFIED→COMPLETED|FAILED|ROLLED_BACK|MANUAL_REVIEW
```
- allowedTransitions: Record<State,State[]>; sai → InvalidTransitionError. EXPIRED/STALE absorbing với execute.
- TTL theo lead time: 0–2d→2h · 3–7d→6h · 8–30d→EOD tạo (23:59 VN) · >30d→24h.
- Stale triggers (check mỗi sync run): Δ đáng kể inventory|current_rate|restrictions|event severity|sync health|rule_version. Ngưỡng "đáng kể" trong pricing_rules.json (vd inventory ≥1 phòng, rate ≥2%).
- context_hash = sha256(canonical_json{stay_date, room_type_id, inventory, current_rate, restrictions, rule_version, schema_version}).

### 5.4 Pricing engine
```
referenceRate = baseRate × season × dow × event × product   // product chứa premium view hồ (Owner lock)
demandAdj = clamp(wOcc×occ + wPick×pickup + wLead×leadTime + wComp×comp, −0.15, +0.15)
candidate = referenceRate × (1 + demandAdj)
final = clamp(candidate, floor, ceiling); assert effNetRate(final) ≥ minAcceptableNetRate  // fail → GuardrailViolation
```
- weights/bounds/floor/ceiling/minNet: config/pricing_rules.json (zod, rule_version).
- effNetRate = final − commission − promoStacking − paymentCost; mỗi thành phần `estimated|confirmed`.
- rate=0 | ngoài floor/ceiling từ OTA data → incident path, không vào routine adjustment.
- Max 1 routine change/(stay_date,room_type)/24h; ngoại lệ = Owner re-approval + lý do.
- Competitor input phải pass freshness 5.6.

### 5.5 Confidence
```
conf = 100×(0.35×completeness + 0.25×freshness + 0.20×comparability + 0.20×syncHealth)
```
80–100 High → bulk OK · 60–79 Medium → warn, review từng item · <60 Low → chỉ insight, không action rec.

### 5.6 Competitor freshness (max age cho pricing)
0–7d→24h · 8–30d→72h · 31–90d→7d · event/holiday→24h|rule riêng. Quá hạn → loại khỏi compSignal. Comparability thấp → loại khỏi median.

### 5.7 Allowlist P4 (auto-close, ALL đúng)
```
pmsAvail==0 ∧ !mappingError ∧ pmsDataAge≤freshness ∧ CM!autoClosed ∧ CM!error
∧ direction==DECREASE_ONLY ∧ has(idempotencyKey) ∧ willVerify ∧ willNotify
```
Retry sync chính thức: allowed. Auto-reopen: NOT IMPLEMENTED.

### 5.8 Agent modes
RUNNING(sched:on, read:on, write:approved/allowlist) · READ_ONLY(on,on,off) · PAUSED(off,manual,off) · EMERGENCY_STOP(minimal monitor, P1 on, write hard-off).

## 6. USE CASES (application)
Contract: `UseCase<In,Out>.execute → Result<Out,DomainError>`; ports qua constructor; ClockPort thay Date.now(); mutation trong UnitOfWork.

| UC (phase) | Trigger → hành vi |
|---|---|
| IngestBookingEvents (P1) | sync/webhook → validate→dedupe→upsert version→recompute inventory→events |
| IngestRateInventory (P1) | sync → đọc theo tier→chuẩn hóa→lưu+freshness |
| IngestCompetitorSnapshot (P2) | comp run/manual → validate→comparability→lưu+source+ts |
| ReconcileBookings (P1) | sync → OTA↔Skyhotel: missing/dup/out-of-order→P1/P2 |
| ReconcileInventory (P1) | sync → computed↔PMS/OTA; âm/lệch→alert |
| GenerateRecommendations (P2) | 06:00 → freshness+syncHealth check→engine→conf→TTL+context_hash→RECOMMENDED |
| InvalidateStaleRecommendations (P2) | mỗi sync → quét open recs→STALE/EXPIRED |
| SubmitDecision (P2) | POST → approve/modify/reject: actor,nonce,reason,audit |
| RevalidateBeforeExecute (P3) | pre-execute → re-read, so hash; lệch→STALE (R3) |
| ExecuteAction (P3) | post-revalidate → idempotent write theo tier; tx; ActionRecord before/after |
| VerifyPublished (P3) | post-execute → ack/read-back 5–15ph (T1–2) | checklist ≤30ph (T3) → VERIFIED/FAILED |
| RollbackAction (P3) | Owner/failure → CAS: currentVersion==publishedVersion mới rollback; khác→MANUAL_REVIEW |
| Raise/Ack/EscalateAlert (P1) | mọi run → theo alert_rules; P1→notifier ngay |
| BuildDailyBrief (P1) | 06:30 → số liệu→LLM|template→notifier |
| BuildWeeklyReview (P2) | weekly → occ/ADR/RevPAR/net, approval outcomes, comp |
| ExportAudit (P1) | daily → JSONL+checksum |
| SetAgentMode/GetAgentStatus (P0) | API → EMERGENCY_STOP cần 2-step+re-auth; actor+audit |

ExecuteAction preconditions: rec∈{APPROVED,MODIFIED} ∧ revalidate pass ∧ modeAllowsWrite (tầng 2 R8) ∧ !freezeWindow.
Errors: ValidationError(event→quarantine, không chặn batch) · StaleContextError→STALE · UnauthorizedWriteError→P1 · ConnectorError→retry(exp backoff, max3)→FAILED+MANUAL_REVIEW.

## 7. ADAPTERS
### 7.1 Ports
```ts
PmsConnectorPort: readBookings(cursor), readInventory(range), readRates(range),
  pushRate(cmd+idempotencyKey), pushRestriction(cmd+idempotencyKey),   // T3 → GuidedActionPackage
  capabilities(): {canWrite, syncLatencySla, supportsWebhook}
LlmPort: explain(input) → {text, source:'llm'|'template'}   // chỉ reporting/explanation gọi
```
Mọi connector: timeout, retry exp backoff max3, zod output, cursor incremental. budget-guard bọc LlmPort: vượt ngân sách/ngày → template + P3.

### 7.2 SQLite (Drizzle)
- bookings(booking_id PK, ota, ota_booking_id, dedupe_key UQ, source_version, status, check_in/out, room_type_id, gross, commission_est, net_est, currency, sync_status, ts*, schema_version; idx(ota,ota_booking_id))
- sync_events(source_event_id, dedupe_key UQ, ingested_at, payload_hash)
- rate_inventory((room_type_id,stay_date,ota) PK, inventory, rate, restrictions JSON, source_version, verified_at)
- recommendations(rec_id PK, stay_date, room_type_id, ota_scope, reference/recommended_rate, factor_breakdown JSON, eff_net_rate, confidence, context_hash, rule_version, status, expires_at, stale_reason, approved_by, applied_at, verified_at, schema_version; idx(status,expires_at))
- approvals(approval_id PK, rec_id FK, actor, decision, reason, nonce, context_hash_at_decision, decided_at)
- actions(action_id PK, approval_id FK, idempotency_key UQ, before/requested/actual_after JSON, source_version_before, result_version, status, attempt_count, error_code, rollback_eligible, verification_result)
- alerts(alert_id PK, severity P1–4, condition_code, subject JSON, status, acked_by/at, resolved_at)
- runs(run_id PK, run_type, mode_at_start, rule_version, started/finished_at, result, stats JSON)
- competitor_snapshots(snap_id PK, hotel_id, stay_date, collected_at, price*, comparability, source)
- agent_control(singleton: mode, changed_by/at, reason)
- audit_events(append-only; no UPDATE/DELETE)
- quarantine_events
Backup: incremental 1h + full encrypted daily; RPO 1h, RTO 4h; restore drill trước P3 + quarterly.

## 8. INTERFACE
### 8.1 API (Fastify; auth token; zod; audit actor; error {code,message,details})
```
GET  /api/v1/overview                     P1
GET  /api/v1/bookings?status&ota&range    P1
GET  /api/v1/inventory/calendar?days=30|60|90   P1
GET  /api/v1/alerts?severity&status · POST /alerts/:id/ack   P1
GET  /api/v1/agent/status · POST /agent/mode (E_STOP: 2-step+re-auth)   P0/1
POST /api/v1/agent/run    (PAUSED → chỉ read-run)   P1
GET  /api/v1/recommendations?status       P2
POST /api/v1/recommendations/:id/decision {decision,modifiedRate?,reason,nonce}   P2
GET  /api/v1/competitors/watch            P2
GET  /api/v1/actions?status · POST /actions/:id/rollback   P3
GET  /api/v1/briefs/daily · GET /reports/weekly   P1/2
```
### 8.2 UX rules (12 phòng)
- Luôn % + số phòng tuyệt đối (OccupancyDisplay).
- ApprovalCard: current/reference/recommended/effNet, Δ tiền+%, occ, pickup, comp median+age, conf badge, factor breakdown, explanation, TTL countdown, stale conditions; bulk chỉ khi ALL HIGH conf.
- TwoStepConfirm: EMERGENCY_STOP, bulk, multi-day.
- Freshness badge mọi dữ liệu có tuổi. ModeBadge mọi trang OTA.
- T3: action → Guided Checklist (bước Skyhotel/OTA + ô verify).
### 8.3 Agent Card
mode+người đổi · last run(run_id,duration,result,rule_version,connector_ver) · freshness+latency · queue(recs/actions/retries/alerts) · model cost vs budget · Run Now/Read Only/Pause/Resume/E-Stop.
### 8.4 Incident SLA
P1: alert<1ph(≥95%), ack 10ph, contain 30ph, resolve/mitigate 60ph · P2: ack 4h, fix 24h · P3/4: weekly/backlog.

## 9. RUNTIME
Schedule: SYNC_RUN 15ph(T1–2)|import-cycle(T3) → Ingest*→Reconcile*→InvalidateStale→Alert · PRICING_RUN 06:00 · COMPETITOR_RUN theo comp lịch · LISTING_AUDIT weekly (+rate consistency) · BRIEF_RUN 06:30 · EVENT_RUN on webhook.
```ts
executeRun(type){ ctl=control.get(); if(!modeAllowsRun(ctl.mode,type)) return skip;
  run=runs.start(type,ctl.mode,ruleVersion());
  try{ for(step of pipelineFor(type)) step.execute({runId}) }   // write steps tự check mode lần 2
  catch(e){ runs.finish(FAILED,taxonomy(e)); if(critical) raiseAlert(P1); /* no rethrow */ }
  runs.finish(SUCCESS,stats) }
```
Skills = composition use cases, không business logic riêng: operations|competitor|revenue|sync-control.

## 10. SCHEMAS (shared, zod = source of truth)
- Money = {amount: VND integer, currency:'VND', fx?:{original,rate,at}}. Time: ISO8601 + Asia/Ho_Chi_Minh.
- RecommendationSchema: schema_version, rec_id(ulid), stay_date, room_type_id, ota_scope∈{AGODA,BOOKING,BOTH}, current/reference/recommended_rate, factor_breakdown, effective_net_rate{basis:estimated|confirmed}, confidence 0–100, data_freshness, context_hash(64), rule_version, status, expires_at, stale_reason?, approved_by/at?, applied_at?, verified_at?.
- Tương tự: Booking, BookingEvent, RateInventory, Action, Alert, CompetitorSnapshot, AgentControl + schema cho MỌI file config/ (validate-config.ts trong CI).

## 11. TEST
Layers: unit(domain ≥90% cov) · contract(mỗi connector vs port+capabilities) · golden(≥40, 100% mock) · integration(anonymized) · shadow ≥14d(P2) · canary(P3) · drills(e-stop giữa action, restore, rollback conflict).
Golden bắt buộc: booking new/modify-date/change-room/cancel/no-show · dup event · missing event · out-of-order · inventory âm · room block · mapping sai · rate=0 · vượt floor/ceiling · net<min · stale comp · stale rec · TTL expired · promo stacking · connector timeout/retry/partial · approval sau context đổi→STALE · e-stop giữa action · concurrent change+rollback→MANUAL_REVIEW · backup restore.
Đổi pricing_rules.json | version agent → rerun full golden (CI gate).
Canary: dry-run → 1 OTA×1 room×1 date → 10 OK → 3–7 ngày → 20 OK liên tiếp → full scope duyệt.
Booking test thật (P3): Owner duyệt budget+ngày; ngày xa, 1 phòng, rate kiểm soát; SOP hủy+phí+đối soát; verify bookingID/modified/cancelled/inventory release/audit.

## 12. PHASES (build 18–22w; elapsed 24–30w; start 8/2026 → v1.0 ~2–3/2027)
| P | Dài | Build | DoD | Gate |
|---|---|---|---|---|
| P0 | 2w, 8/26 | scaffold tree §4 · shared schemas · domain(entities,SM,guardrails,ttl) · persistence+migrations+backup · mock connector+seed · agent skeleton(orchestrator+mode-guard+control API) · dashboard wireframe · NGHIỆP VỤ: audit 3 hệ thống tài khoản thật, báo giá CM, baseline giờ/tuần, mapping, comp set | skeleton E2E mock+run log; e-stop test pass; restore OK; G0 ký | G0: tier+host |
| P1 | 4w, 9/26 | connector read theo G0 · ingest/reconcile/alerting/brief · API P1 · dashboard: BookingMonitor,Calendar,Alerts,AgentCard · Telegram | 7d không unhandled critical/mất event; P1 mobile<1ph ≥95%; reconciliation giải thích mọi mismatch | G1: data tin cậy |
| P2 | 5w (gồm 14d shadow), 10–giữa 11/26 | pricing engine+scoring+freshness · GenerateRecs+InvalidateStale · ApprovalService+SubmitDecision · PricingCenter UI+TTL+bulk guard · comp ingest (extranet-first/manual) · WeeklyReview | 100% rec đủ trường+hash+TTL; 0 expired/stale executable; shadow 14d xong, Owner duyệt rule v1 | G2: dừng MVP ∨ build P3 |
| P3 | 4–5w+freeze, cuối 11/26–1/27 | Revalidate · ExecuteAction idempotent · VerifyPublished · Rollback CAS · E_STOP 2 tầng · action UI · T3 guided checklist | 100% golden pass; canary ≥20 OK, 0 unauthorized/stale/dup write; e-stop+rollback drill pass | G3: prod scope+allowlist |
| P4 | 6w (4w nghiệm thu), 2–3/27 | scheduler prod+event triggers · continuous reconcile SLA · retry chính thức · auto-close §5.7 · escalation+incident dash · audit export+backup monitor | 4w: 0 ngoài allowlist; 0 mismatch vượt SLA không alert; giờ thủ công −≥60% | G4 = v1.0 done |
| P5 | v1.1+, sau 60–90d | forecast-vs-actual; học approve/modify/reject/expired/stale; weight offline eval→Owner→canary | model không tự deploy rule | — |
Freeze window: check trong ExecuteAction precondition.

## 13. CONVENTIONS + ENV
- TS strict; no any; no @ts-ignore (trừ comment+issue). Parse-don't-validate (zod mọi boundary).
- Errors từ shared/errors.ts; use case trả Result<T,E>; no throw string.
- VND integer; ClockPort trong domain/app. pino structured, PII mask, run_id gắn log.
- ESLint import/no-restricted-paths enforce §2 (CI fail nếu vi phạm).
- Commits: feat(domain)|feat(agent)|test(golden)|fix.
```
DATABASE_PATH=./data/ota.db · API_PORT=4801 · API_AUTH_TOKEN=
LLM_PROVIDER=anthropic|openai|template · LLM_API_KEY= · LLM_DAILY_BUDGET_USD=
TELEGRAM_BOT_TOKEN= · TELEGRAM_CHAT_ID= · SKYHOTEL_*= (sau G0)
BACKUP_DIR= · BACKUP_ENCRYPTION_KEY= · TZ=Asia/Ho_Chi_Minh
```
CLAUDE.md: đọc PLAN trước task; R1–R10; §2 dependency rule; pnpm test|golden|typecheck; không vượt phase (ghi phase hiện tại); Open Item chưa khóa → hỏi; không auto-reopen; LLM ∉ critical path.

## 14. OPEN ITEMS (deadline)
1 Skyhotel CM/API/export+chi phí→G0 · 2 runtime host→G0 · 3 notification channel→P1 · 4 mapping+physical inventory→G0 · 5 comp set→P2 · 6 floor/ceiling/minNet→P2 · 7 RateConsistencyPolicy+promo exceptions→P2 · 8 model provider+budget→P2 · 9 backup operator+emergency contact→P3 · 10 freeze window→P3 · 11 canary scope→G2 · 12 auto-close rule→G3.

## 15. LOCKS
1 Skyhotel=chính (inventory/booking nội bộ); OTA=verify publish; VENHO=rec/approval/audit. 2 không 2 inventory độc lập. 3 no file-tx Agent↔Dashboard. 4 rules deterministic, LLM không chặn ops. 5 write cần approval|allowlist. 6 revalidate trước write. 7 expired/stale không apply. 8 auto-reopen ∉ v1.0. 9 no RPA lõi khi có CM/API/export. 10 tối ưu eff net revenue, không đua giá. 11 action = idempotency+audit+verify+CAS rollback. 12 scope: Ven Hồ+Agoda+Booking. 13 no prod write trong freeze. 14 no multi-property. 15 P5 sau 60–90d data sạch.

## 16. KPI/SLO
Overbooking lỗi VENHO=0 · event mất vĩnh viễn=0 · late sync<1% SLA tier · P1 delivery<1ph ≥95% · P1 mitigation≤60ph · unhandled critical run=0 tồn · rec đủ trường=100% · stale/expired applied=0 · unauthorized write=0 · action log=100% · config change không test/approval=0 · manual time −≥60% · write success sau canary≥99% · restore drill pass trước P3+quarterly. Occ/ADR/RevPAR/NetRevPAR: target sau 60–90d baseline.

**END — PLAN_OTA_DENSE.md v1.4-dense**
