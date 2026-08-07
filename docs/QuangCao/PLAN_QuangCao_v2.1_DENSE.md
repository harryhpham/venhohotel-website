# PLAN_QuangCao_v2.1_DENSE.md
# VENHO Paid Acquisition OS — Build Spec (token-optimized)
# Full spec: PLAN_QuangCao_v2.1.md | Business rules SSOT: VENHO_OS_PAID_ACQUISITION_OS_v1.1.md (§refs trỏ về file này; conflict → business doc thắng)

## META-RULES (đọc trước)
- Build order S0→S8, không nhảy bước, mỗi step có DoD.
- Tuân thủ mọi khối DO-NOT.
- Không thêm lib/framework ngoài stack. Cần thêm → hỏi người.
- HARD GUARDRAIL v1: zero write lên ad platforms (Meta/Google/TikTok). Read-only.

## STACK
Python 3.12 | FastAPI | Pydantic v2 (schema-first → export JSON Schema) | SSOT=file .md/.json/.jsonl | SQLite=index rebuild-được | UI=Jinja2+HTMX (no JS build) | Agent=Claude Agent SDK | make | pytest+mocks (token-free) | ruff

## ARCHITECTURE
- Layers: Presentation → Application → Domain ← Infrastructure
- Domain: zero-dependency (stdlib+pydantic only, no I/O).
- Application chỉ biết ports (Protocol). Infra implement ports, không chứa business logic.
- Presentation không gọi Infra trực tiếp — luôn qua Engine.

## PRINCIPLES (bắt buộc)
1. File-first SSOT: `data/PAID_ACQUISITION_OS/`; SQLite rebuild 100% từ file (`make rebuild-index`).
2. Event-driven: EventBus in-process; append-only `data/events/YYYY-MM.jsonl`; write-ahead trước consumer.
3. Schema-first: Pydantic → `schemas/*.json` (`make export-schemas`); validate JSON input trước xử lý.
4. PermissionGuard: READ | RECOMMEND | ACT_WITH_APPROVAL — enforce ở Application.
5. Audit+Rollback: mọi ACT_WITH_APPROVAL → AGENT_LOG(rule_id, before, after, approver) + rollback().
6. Idempotent: natural keys — perf=`campaign_id+date`, conversion=`event_id`.
7. Mock-first: mọi adapter có mock; test không cần mạng/token.
8. Human-in-the-loop: không code path launch/budget-change/customer-upload thiếu approval record.
9. Platform Separation: Meta/Google/TikTok tách hoàn toàn — file tree riêng, SQLite partition `platform`, sync job độc lập (lỗi cô lập), page riêng. Cross-platform chỉ ở: Overview + AttributionEngine.

## FILE TREE
```text
venho-advertising/
├── CLAUDE.md / PLAN_QuangCao_v2.1.md / README.md / Makefile / pyproject.toml / .env.example / .gitignore
├── src/venho_ads/
│   ├── domain/                      # build #1, zero-dep
│   │   ├── entities/{campaign,audience,creative,budget,booking,conversion,experiment,recommendation,knowledge}.py
│   │   ├── value_objects/{money,utm,naming}.py
│   │   ├── rules/{launch_gate,pause_rules,scale_rules,kill_rules,budget_guardrails,economics}.py  # pure fn
│   │   └── events.py
│   ├── application/
│   │   ├── ports/{ad_platform_gateway,analytics_gateway,pms_gateway,repository,notifier,campaign_control}.py
│   │   ├── engines/{campaign,tracking,budget,attribution,optimization,reporting,knowledge}_engine.py
│   │   ├── event_bus.py
│   │   └── permission_guard.py
│   ├── infrastructure/
│   │   ├── gateways/{meta_ads,google_ads,tiktok_ads,ga4,skyhotel}.py   # READ-ONLY v1; tiktok=stub NotImplementedError("Phase 8")
│   │   ├── persistence/{file_repository,sqlite_index,event_log}.py
│   │   ├── notifications/console_notifier.py
│   │   └── mocks/{mock_meta,mock_google,mock_ga4,mock_skyhotel}.py
│   ├── presentation/
│   │   ├── web/app.py
│   │   ├── web/routes/{dashboard,platform,agent_console,campaigns,api}.py
│   │   ├── web/templates/{base,workspace,platform_workspace,agent_console}.html + partials/
│   │   ├── web/static/style.css
│   │   └── cli/main.py              # venho-ads: sync --platform, report, check, rebuild-index
│   └── agents/ads_ops/
│       ├── charter.md / agent.py
│       ├── skills/{daily_check,prelaunch_qa,search_terms_review,reconciliation,weekly_report}.py
│       ├── prompts/ (versioned md)
│       └── memory/
├── data/
│   ├── PAID_ACQUISITION_OS/         # SSOT, folder theo §24 v1.1
│   │   ├── 00_MASTER_INDEX.md, 01_STRATEGY/…09_KNOWLEDGE/
│   │   ├── 04_CAMPAIGNS/{META,GOOGLE,TIKTOK}/YYYY-MM/CAMPAIGN_ID/   # platform-first
│   │   └── 06_REPORTS/{META,GOOGLE,TIKTOK,OVERVIEW}/
│   ├── events/YYYY-MM.jsonl
│   ├── index/ads.sqlite             # gitignored, rebuildable
│   ├── imports/                     # Skyhotel CSV fallback
│   └── config/{settings.yaml,economics.yaml}
├── schemas/{campaign,performance_record,creative_record,booking,conversion_event,recommendation}.schema.json
└── tests/{unit,integration,contract}/
```

## DOMAIN
### Campaign entity (khớp §23 v1.1)
```python
campaign_id:str(=utm_id) platform:META|GOOGLE|TIKTOK name:str(naming.validate §11)
business_objective:str funnel_stage:A..E(§7) market:vn|intl offer_id:str
landing_page:HttpUrl conversion_event:str(taxonomy §8)
budget_daily/budget_total/max_loss:Money target_cpa:Money|None target_roas:float|None
utm_campaign:str utm_id:str start_date/end_date
status:CampaignStatus            # OBSERVED (từ sync): draft|pending_qa|pending_approval|approved|live|paused|ended|killed
desired_status:ACTIVE|STOPPED    # DESIRED (nút bấm)
control_mode:MANUAL|AUTO         # AUTO=agent act theo §26.2, chỉ campaign đó; default MANUAL
owner:str approval:ApprovalRecord|None
```
- Booking/ConversionEvent/Creative/Recommendation…: field 1:1 với §23 + §9.2 v1.1.
- DO-NOT: method gọi API trong entity; field ngoài spec; float cho tiền → Money(int VND).

### Value objects
```python
build_utm(market,objective,offer,yyyymm) -> "vh_{market}_{objective}_{offer}_{yyyymm}"  # lowercase, no-dấu, underscore §10
campaign_name_to_utm_campaign("META_VN_CONV_..._V1") -> "vn_conv_..._v1"  # bỏ prefix platform, lowercase §10.3
Money(amount:int, currency="VND")  # immutable
```
- DO-NOT: tự sửa UTM sai — raise ValueError.

### Rules (pure fn, no side-effect, no I/O)
```python
check_launch_gate(c,ctx)->GateResult(passed,failures)  # 11 điều kiện §19.1, thiếu 1 → fail
validate_budget_change(current,proposed,changes_this_week)->GuardrailResult  # max +20%/lần, ≤2 lần/tuần §17.3
contribution_profit(revenue,variable,payment,promo,incremental)->Money
max_cpa(cp,allowed_share)->Money
breakeven_roas(margin_rate)->float
# + pause_rules, scale_rules, kill_rules theo §19.2–19.4
```
- Business fail → Result object, không raise. Raise = lỗi lập trình.
- DO-NOT: gọi API/DB trong rule; hardcode economics (đọc economics.yaml ở Application, truyền vào); nới ngưỡng.

## APPLICATION
### Ports
```python
AdPlatformGateway: fetch_campaigns()->list[PlatformCampaign]; fetch_insights(day)->list[InsightRow]  # KHÔNG method ghi v1
PmsGateway: fetch_bookings(since)->list[Booking]
Repository: load(type,id); save(entity)->Path(atomic); list_ids(type)
CampaignControlPort: set_status(campaign_id,target)->ControlResult  # v1 binding: NullControlAdapter only
Notifier: send_alert(...)
```
### Engines → emit / consume
| Engine | Emit | Consume |
|---|---|---|
| Campaign (brief→QA→approval→registry) | CampaignCreated, CampaignApproved, DesiredStateChanged, StateDriftDetected | — |
| Tracking (health, dedup) | TrackingLost/Restored | — |
| Budget (caps, pacing) | BudgetExceeded | CampaignLaunched |
| Attribution (booking↔utm_id) | BookingConfirmed/Cancelled, LeadQualified, AttributionMissing | — |
| Optimization (→Recommendation, không act) | RecommendationCreated | BudgetExceeded, TrackingLost |
| Reporting (alerts, drafts) | ReportDrafted | all |
| Knowledge (learning sau approve) | KnowledgeUpdated | ExperimentCompleted |
- Per-platform: sync job riêng/platform, health riêng, exception cô lập. Event có field `platform`.
- DO-NOT: engine import infrastructure/; auto-act khi guardrail fail (→Recommendation+alert); nuốt gateway exception.

### PermissionGuard
- `@require_permission(level)`; agent level từ `settings.yaml:agent_permission_level`; nâng quyền = Change Request, không có API; denied → log PERMISSION_DENIED.

### 6.4 Campaign Control (Activate/Stop/Auto)
- Model: desired_status (nút, file-first) vs status (observed, sync) → DRIFT = desired≠observed.
- Buttons/campaign card: Activate→desired=ACTIVE; Stop→desired=STOPPED; Auto toggle→control_mode=AUTO (2-step confirm).
- v1: nút chỉ ghi desired+audit → sinh Action Checklist (thao tác tay Ads Manager) → sync xác nhận → drift badge tắt; drift>24h → alert.
- v2/A3: approval → CampaignControlPort thực thi API + rollback; AUTO do agent thực thi thật, emit AutoActionExecuted+notify.
- DO-NOT: bind adapter thật vào ControlPort ở v1; agent set desired khi MANUAL; AUTO default cho campaign mới.

## EVENTS
Format: `{event_id:uuid, name, platform:meta|google|tiktok|null, occurred_at:ISO Asia/Ho_Chi_Minh, payload, version:1}`
Catalog: CampaignCreated | CampaignApproved | CampaignLaunched(ghi tay v1) | BudgetExceeded | TrackingLost | CreativeRejected | LeadQualified | BookingConfirmed | BookingCancelled | ExperimentCompleted | RecommendationCreated | KnowledgeUpdated | DesiredStateChanged | StateDriftDetected | AutoActionExecuted(v2)
- Bus: in-process sync; write-ahead JSONL; consumer idempotent theo event_id.
- DO-NOT: broker ngoài (Kafka/Redis) v1; sửa/xóa dòng jsonl; xử lý event chưa log.

## INFRASTRUCTURE
- meta_ads/google_ads/ga4: read-only, token .env, retry×3 backoff, timeout 30s; trả DTO (PlatformCampaign, InsightRow), không raw JSON.
- skyhotel: fetch_bookings; không API → đọc CSV `data/imports/`, giữ nguyên PmsGateway interface.
- file_repository: entity→JSON theo §24; atomic write (tmp+os.replace); validate schema trước save.
- sqlite_index: tables campaigns/performance_daily/bookings/events, partition `platform`; không dữ liệu nào chỉ tồn tại trong SQLite.
- DO-NOT: method ghi platform v1; log secrets; gọi API trong unit test.

## PRESENTATION
- `/workspace` Overview (cross-platform DUY NHẤT): Current Objective, Needs Attention(badge platform), Bookings&Revenue tổng, Budget tổng §17.2, Agent Status, Quick Actions.
- `/workspace/{meta|google|tiktok}` — template chung `platform_workspace.html`: ①Status Board (cards + nút Activate/Stop/Auto + drift badge) ②Results(spend, qualified, bookings, CPA vs MaxCPA, ROAS) ③Budget pacing ④Tracking Health ⑤Experiments. Không trộn số liệu 2 platform trong 1 bảng. TikTok = "Locked until Phase 8". HTMX poll 60s.
- `/agent` Console: Approval Queue (approve/reject+lý do), Agent Log, Health.
- Mother Dashboard API:
```json
GET /api/agent/status → {"agent":"ads_ops","health":"ok|error|paused","capability_stage":"A1","permission_level":"recommend","approval_queue_count":3,"last_run":"ISO","level3_actions_7d":0,"rollbacks_7d":0}
GET /api/agent/actions → action items cho Home
```
- DO-NOT: biểu đồ chi tiết trên Mother Dashboard (§25.2); endpoint ghi không auth.

## AGENT (ads_ops)
Loop: perceive(index+files) → analyze(rules) → recommend(Recommendation/alert/draft) → wait-human(Queue) → record(AGENT_LOG+memory)
Skills=SOP 1:1: daily_check(sáng, digest tách platform) | prelaunch_qa(khi PENDING_QA, GateResult) | search_terms_review(2×/tuần, negative kw recs) | reconciliation(daily, matched/unmatched) | weekly_report(T2, section/platform + tổng hợp)
- Enforce bằng code: PermissionGuard theo settings; gateway ghi không tồn tại v1; AUTO chỉ campaign control_mode=AUTO + rules §26.2, v1 chỉ Recommendation khẩn.
- DO-NOT: agent sửa charter.md/settings.yaml/domain/rules/; kết luận doanh thu từ số platform chưa đối soát (§9.6).

## CONFIG/SECURITY
- Secrets: .env only (gitignored). Flags: `booking_engine_live:false` (bật → mở begin_booking/select_dates §8.4), `platforms:{meta:true,google:true,tiktok:false}`, `agent_permission_level`.
- TZ Asia/Ho_Chi_Minh; tiền VND int. Naming: module snake_case, entity PascalCase, event PascalCase quá khứ.
- Log JSON structured, no PII. Git: 1 Step = 1 branch, PR ghi Step ID + DoD checklist.

## TESTING
- unit: domain/rules coverage 100% (pass + fail từng điều kiện + biên: đúng 20%, lần đổi thứ 2/tuần).
- integration: engine+mock+tmp data/; bắt buộc: brief→approved flow; reconcile match/unmatch; eventbus idempotency(2×event_id); 1 platform sync lỗi không ảnh hưởng platform khác.
- contract: golden files Meta/Google response → DTO.
- Zero network trong toàn bộ test.

## DATA FLOW (daily)
```text
06:00 sync meta ─┐ (job riêng, lỗi cô lập)
06:02 sync google┼▶ SqliteIndex(partition platform) + perf JSON + drift check(→StateDriftDetected)
06:04 sync tiktok┘
06:05 skyhotel bookings ▶ Attribution.reconcile(utm_id) → matched→BookingConfirmed | unmatched→AttributionMissing→Needs Attention
06:10 agent daily_check ▶ digest/platform → Queue/Home
Human: Console approve/reject → AGENT_LOG + Knowledge
```

## BUILD ORDER (Step Files: Objective/OutOfScope/DoD)
| Step | Build | DoD |
|---|---|---|
| S0 Skeleton | pyproject, Makefile, CLAUDE.md, tree rỗng, CI ruff+pytest | `make setup && make test` xanh |
| S1 Domain | entities+VO+rules+unit tests | rules coverage 100%; export-schemas đủ 6 |
| S2 Persist+Bus | file_repo, sqlite_index, event_log, event_bus | round-trip mọi entity; rebuild-index OK; idempotency pass |
| S3 Mocks+Engines | ports, mocks, 7 engines | integration pass toàn bộ với mock |
| S4 Real gateways | meta, google, ga4, skyhotel/CSV (read-only) | contract pass; sync 1 ngày thật OK |
| S5 Presentation | Overview+3 platform pages, nút A/S/Auto(desired+checklist), console, /api/agent/status | render từ index; nút ghi desired+audit; drift badge; approve/reject OK |
| S6 Agent A1 | loop + daily_check + weekly_report | digest tự sinh; founder check ≤5' |
| S7 Agent A2 | prelaunch_qa, search_terms, reconciliation | 100% campaign qua agent QA; lỗi UTM/naming=0 |
| S8 Hardening | audit, rollback stub, denied paths, backup | security checklist pass; docs updated |

OUT-OF-SCOPE toàn v1: write platform; auto-launch; TikTok; cross-platform budget optimizer; agent sửa rules. (§26.3)

## MAPPING
S0–S2→Phase0–1/A0 | S3–S5→Phase2–3 | S6→A1 | S7→Phase3–4/A2 | S8+v2→Phase7/A3 (NullControlAdapter→adapter thật, nút thực thi API, AUTO thật) | v3→Phase9/A4

## DoD v1 BUILD
☐ make setup/test/run trên máy sạch ☐ rules §19/§17 đủ + unit 100% ☐ SQLite rebuild từ file ☐ zero write-path platform ☐ Queue hoạt động, không recommendation tự thực thi ☐ /api/agent/status đúng schema ☐ test zero-network ☐ CLAUDE.md đủ cho session mới tiếp tục

## FINAL
Business Rules (v1.1) = chân lý → Domain mã hóa → Engine thực thi → Agent đề xuất → Người phê duyệt (Dashboard) → File là sự thật, DB là gương dựng lại được.
