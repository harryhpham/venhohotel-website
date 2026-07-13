# VENHO OS MOTHER DASHBOARD — DENSE BUILD SPEC v2.0

> Agent-read spec. Clean Arch modular monolith. TZ `Asia/Bangkok`. Living Lab: Ven Hồ Hotel 12 rooms. Dashboard = Presentation+Command+Approval ONLY (no metric calc, no booking normalize, no prompt build, no provider call at render).

## GOLDEN RULES
- Dep rule inward: `interface→application→domain`; `infrastructure` implements app ports; `domain` imports nothing (framework-free). Enforce via eslint-plugin-boundaries.
- A7 owns ALL metrics; FE/BFF read precomputed snapshots only.
- Evidence before automation; no approve/execute on stale required evidence; no automation-level raise while hard blocker exists.
- Approval ≠ execution ≠ publish (separate transitions+buttons); high-risk approve requires source OPENED first.
- Every external side effect: idempotent + reconciled + via Transactional Outbox (never inline).
- Policy-as-code: price band / budget envelope / automation level / inventory safety in versioned YAML/JSON, schema-validated. No hard-code in UI.
- No ML year1.
- Code banner: `@layer @context @owns @depends-on @invariant`; annotate guards w/ PLAN §.

## ADR (locked)
- 001 Modular Monolith (not microservices y1).
- 002 TypeScript strict e2e.
- 003 Next.js 15 App Router = single deploy (RSC keeps provider calls off render).
- 004 PostgreSQL 16 = system of record.
- 005 Drizzle ORM (SQL migrations). [alt Prisma]
- 006 Zod = single validation layer (API+usecase+fixtures).
- 007 pg-boss durable jobs (Postgres). [alt Graphile Worker]
- 008 Transactional Outbox (worker relay).
- 009 S3-compatible storage (R2/MinIO); DB stores URI only.
- 010 Secrets in vault; DB ref only.
- 011 Vitest(unit/integ)+Playwright(e2e).
- 012 Single repo `src/modules/*`, ESLint boundaries; promote→package later.
- 013 BFF read models local+precomputed (Home p95<500ms, 0 external call).
- Split→service only if: independent scale | deploy-coupling downtime | hard security boundary | external paying SLA | team outgrows monolith.

## CLEAN ARCH LAYERS (per context)
- `domain`: entities, VO, state-machines, domain-services, policy rules, invariants — PURE, 0 I/O.
- `application`: use cases (commands/queries), PORTS (repo/adapter interfaces), DTOs.
- `infrastructure`: Drizzle repos, provider adapters, outbox, queue, storage, secrets — implements ports.
- `interface`: Next route handlers, RSC, server actions, hooks — thin.
- `src/composition`: DI wiring (only place infra meets app).
- `domain`→∅ | `application`→domain+ownports | `infrastructure`→app+domain | `interface`→app usecases/DTOs.

## BOUNDED CONTEXTS (15) — src/modules/<ctx>
| ctx | owns | never | maps |
|---|---|---|---|
| identity | users, workspaces, members, roles, action-authorities, authZ | business data | — |
| execution | projects, objectives, milestones, tasks, task_steps, focus_state, Todays Focus, Current Work | metric calc, bookings | L4 |
| approval-decision | recommendations, evidence, approval_policies, approval_requests, decision_records, Decision Queue | gen recs, publish | K4 |
| agent-control | agent_definitions/instances/capabilities/runs/run_steps/dependencies, automation_policies, policy_violations, readiness, level-enforcement | subject-domain logic | K5, A1–A8 control plane |
| hospitality | properties, room_types, rooms, channels, bookings, booking_source_records, inventory_snapshots, rate_observations, competitor_* | Home UI, price decision, metric formula | A1/K3 |
| reputation | guest_reviews, review_topics, root_cause_items | compensation promise | A2 |
| marketing | campaigns, campaign_daily_metrics, corporate_accounts | auto-launch, budget override, signing | A5+A8 |
| crm | guest_profiles, consent_records, crm_journeys, crm_messages | complaint/refund exception | A6 |
| control-tower | metric_definitions, metric_snapshots, business_alerts, operating_pulse_snapshots | Home layout, content gen | A7/K6 |
| roadmap | roadmap_phases, phase_gates, gate_evaluations, budget_envelopes, budget_change_requests | — | Gates |
| creative | artifacts, artifact_versions, ai-studio adapter | 2nd content pipeline | A3/M10/M01–M09 |
| publishing | publication_items, publisher | approve==publish | M07 |
| activity | activity_events, notifications | PII/sensitive excerpts | log |
| module-registry | module_definitions, module_actions, workspace_modules, QuickActions | — | Registry |
| integration | integration_connections, jobs, sync_checkpoints, outbox relay, provider adapters | — | Providers/Jobs |
- Above: `src/bff/home` (read-model composer, 0 domain logic), `src/composition` (DI root).
- HARD: no K5 automation while K1–K4 readiness unmet (agent-control/domain/readiness.ts + worker recheck).

## FILE TREE
```text
venho-os/
├── package.json            # scripts: dev build worker test test:e2e migrate seed lint
├── tsconfig.json           # strict; aliases @domain @app @infra @shared @modules
├── .eslintrc.cjs           # eslint-plugin-boundaries → dep rule
├── .env.example
├── docker-compose.yml      # postgres:16 minio mailhog
├── drizzle.config.ts       # → src/**/infrastructure/persistence/schema/*.ts
├── docs/
│   ├── adr/                # 001..013 + new
│   ├── data-dictionary.md
│   ├── openapi.yaml        # frozen Stage0
│   ├── policies/{approval,automation}/*.policy.yaml   # versioned policy-as-code
│   ├── manifests/{agents/A1..A8.agent.json, modules/*.module.json}
│   └── runbooks/
├── migrations/0000_init.sql   # Drizzle, ordered, immutable
├── seed/{fixtures/home-snapshot.fixture.ts, seed.ts}   # seeds ws + "Ven Hồ Hotel" 12 rooms + channels
├── config/{env.ts(Zod fail-fast), timezone.ts(Asia/Bangkok+business-date), feature-flags.ts}
├── src/
│   ├── shared/                       # KERNEL pure
│   │   ├── kernel/{id.ts(UUIDv7 branded Id<T>), result.ts(Result/Ok/Err), errors.ts(codes §53),
│   │   │           clock.ts(Clock port), money.ts(NUMERIC14,2 VND), freshness.ts(per-source), pagination.ts}
│   │   ├── events/{domain-event.ts, outbox-event.ts}
│   │   ├── auth/{principal.ts(roles+authorities), authorize.ts(ws/property scope)}
│   │   └── schema/common.zod.ts
│   ├── modules/                      # each: domain/ application/{ports,commands,queries} infrastructure/ interface/
│   │   ├── identity/domain/{user,workspace,membership,role}.ts
│   │   │   └ application/{ports/identity.repo.ts, commands/invite-member.ts, queries/get-workspace-context.ts}
│   │   │   └ infrastructure/persistence/{schema/identity.schema.ts, identity.drizzle-repo.ts}, mappers/
│   │   ├── execution/domain/{task,task-state-machine(§27),focus,focus-scoring(§34PURE),project,objective,milestone,invariants}.ts
│   │   │   └ application/ports/{task.repo,focus.repo,alert.query-port,gate.query-port}.ts
│   │   │   └ application/commands/{transition-task,set-manual-focus,continue-work}.ts
│   │   │   └ application/queries/{compute-todays-focus,get-current-work}.ts
│   │   │   └ infrastructure/persistence/{schema/execution.schema.ts,*.drizzle-repo.ts}
│   │   ├── approval-decision/domain/{recommendation,recommendation-state-machine(§28),approval-request,
│   │   │        approval-state-machine(§29),decision-record(append-only),evidence,decision-queue-ranking(§35PURE),approval-policy}.ts
│   │   │   └ application/ports/{recommendation.repo,approval.repo,decision.repo,evidence.repo,policy.provider,outbox.port}.ts
│   │   │   └ application/commands/{submit-for-review,open-approval,approve,modify-and-approve,reject,request-changes,execute-recommendation,rollback}.ts
│   │   │   └ application/queries/{list-decision-queue,get-recommendation}.ts
│   │   ├── agent-control/domain/{agent-definition,agent-instance,capability,agent-run,agent-run-step,
│   │   │        agent-run-state-machine(§30),automation-policy(§23),automation-enforcement(§38PURE),readiness(§37),dependencies(§21.6)}.ts
│   │   │   └ application/ports/{agent.repo,run.repo,policy.repo,violation.repo,kcore-readiness.query-port,queue.port}.ts
│   │   │   └ application/commands/{run-capability,pause-agent,resume-agent,set-automation-policy,cancel-run,retry-run}.ts
│   │   │   └ application/queries/{list-agents,get-agent-health,evaluate-readiness}.ts
│   │   ├── hospitality/domain/{property,room-type,room,channel,booking,contribution(§39PURE),dedupe(§43PURE),
│   │   │        inventory-snapshot,rate-observation,competitor,channel-manager-trigger(§40PURE)}.ts
│   │   │   └ application/ports/{booking.repo,inventory.repo,rate.repo,source-record.repo,provider.sync-port,storage.port}.ts
│   │   │   └ application/commands/{validate-import,commit-import,sync-channel,reconcile-booking,merge-candidate}.ts
│   │   │   └ application/queries/{data-completeness,daily-pickup,list-bookings}.ts
│   │   ├── reputation/domain/{guest-review,review-topic,root-cause,root-cause-aggregation(§44PURE),risk-classification}.ts
│   │   ├── marketing/domain/{campaign,campaign-metrics,roas(§39),attribution,corporate-account}.ts
│   │   ├── crm/domain/{guest-profile,consent,journey,message,suppression}.ts
│   │   ├── control-tower/domain/{metric-definition,metric-snapshot,operating-pulse(§36PURE),business-alert,alert-state-machine(§31)}.ts
│   │   │   └ application/ports/{metric.repo,snapshot.repo,alert.repo,pulse.repo}.ts
│   │   │   └ application/commands/{compute-snapshot,raise-alert,acknowledge,resolve,suppress,recompute-pulse}.ts
│   │   │   └ application/queries/{get-operating-pulse,get-metrics,list-alerts}.ts
│   │   ├── roadmap/domain/{roadmap-phase,phase-gate,gate-evaluation,gate-state-machine(§33),gate-evaluation-engine(§41PURE),budget-envelope,budget-change-request}.ts
│   │   ├── creative/domain/{artifact,artifact-version}.ts
│   │   │   └ application/ports/{artifact.repo,ai-studio.port(§58)}.ts
│   │   │   └ application/commands/{create-social-package,create-video-script,validate-artifact,prepare-publication}.ts
│   │   │   └ infrastructure/adapters/ai-studio.adapter.ts   # creative.*→M01..M09 workflow
│   │   ├── publishing/domain/{publication-item,publication-state-machine(§32)}.ts
│   │   │   └ application/ports/{publication.repo,publisher.port,outbox.port}.ts
│   │   │   └ application/commands/{submit-for-approval,schedule,publish,mark-published}.ts
│   │   ├── activity/domain/{activity-event,notification,sanitizer}.ts
│   │   ├── module-registry/domain/{module-definition,module-action,quick-action-resolver}.ts
│   │   │   └ application/queries/resolve-quick-actions.ts
│   │   └── integration/domain/{retry-classification(§55PURE),sync-checkpoint}.ts
│   │       └ application/ports/{provider-adapter.port(§56),job-queue.port,outbox.repo,secret.port}.ts
│   │       └ application/commands/{dispatch-outbox,run-job(§54 13-step),reconcile}.ts
│   │       └ infrastructure/{queue/pgboss.queue.ts, outbox/outbox.relay.ts,
│   │              providers/{pms,agoda,booking,google-hotel,meta,make,manual-fallback}.adapter.ts,
│   │              secrets/secret-store.ts, persistence/{schema/integration.schema.ts,jobs.drizzle-repo.ts}}
│   ├── bff/home/{home-snapshot.query.ts(compose query-ports), home-snapshot.dto.ts(§46 Zod),
│   │             source-mapping.ts(§11), partial-error.ts(freshness+partialErrors)}
│   ├── composition/{container.ts, use-cases.ts, worker-container.ts}
│   ├── app/                          # Next App Router = INTERFACE only
│   │   ├── (dashboard)/{page.tsx(MotherDashboardPage RSC→bff/home), projects,tasks,knowledge,workbench,
│   │   │        creative-studio,agents,operations,publishing,reports,settings, loading.tsx,error.tsx,empty-states/}
│   │   └── api/v1/{workspaces/[id]/home/route.ts(§46), recommendations/…(§47), approvals/…(§48),
│   │        agents|agent-instances|agent-runs/…(§49), properties/[id]/{operating-pulse,metrics,alerts}(§50),
│   │        integrations|imports/…(§51), roadmap|phase-gates/…(§52)}
│   ├── components/                   # dumb prop-driven, 0 business logic
│   │   ├── layout/{WorkspaceHeader,SidebarNavigation}.tsx
│   │   ├── home/{TodaysFocusCard,CurrentWorkCard,OperatingPulseStrip,DecisionReviewCard,
│   │   │        PublicationApprovalCard,QuickActionsGrid,AgentWorkflowHealthCard,RecentActivityTimeline}.tsx
│   │   │        + states/{Loading,Empty,Stale,PartialError,NoPermission}.tsx
│   │   └── ui/                       # a11y §65
│   └── styles/ hooks/ lib/           # no domain logic
├── worker/index.ts                  # outbox relay + pg-boss jobs (§54)
└── tests/{unit(mirror domain §92), integration(§93), e2e(E2E-01..07 §94), failure-injection(§95), fixtures/}
```
- Pattern identical ×15 → parallel build. Pure domain → tests/unit 1:1. Boundaries lint = anti-leak. BFF imports query-ports only → cannot compute metric. All providers = 1 port; manual-CSV = adapter.

## CONVENTIONS (all ctx)
- IDs UUIDv7, branded `Id<T>`; external IDs never PK → *_source_records.
- Result<T,DomainError> across layers; interface maps Err→HTTP+code. No throw cross-layer.
- Error codes central: EVIDENCE_STALE, APPROVAL_REQUIRED, APPROVAL_EXPIRED, POLICY_LIMIT_EXCEEDED, AUTOMATION_LEVEL_NOT_ALLOWED, AGENT_DEPENDENCY_NOT_READY, INVENTORY_SAFETY_BLOCK, BUDGET_ENVELOPE_EXCEEDED, CONSENT_REQUIRED, PHASE_GATE_BLOCKED, SOURCE_DATA_INCOMPLETE, PROVIDER_RECONCILIATION_REQUIRED.
- Zod one layer (API+usecase+fixtures).
- Optimistic lock: `version` col; cmd takes expectedVersion (`If-Match`); mismatch→409.
- Idempotency-Key every side effect; worker checks pre-exec; dup→return prior result.
- TIMESTAMPTZ UTC; business date from property TZ; never in browser.
- Money VO over NUMERIC(14,2)+currency; no float; default VND.
- Freshness per-source (FRESH|STALE|UNKNOWN)+observed ts; no single lastSyncAt.
- AuthZ start of every usecase: ws-scope always, property-scope when apt, action-authorities for approvals.

## HOME BFF
- `GET /api/v1/workspaces/{id}/home?propertyId&projectId&date`; query-ports only; 0 external call.
- Layout order: Header→Todays Focus→Current Work→Operating Pulse/Critical Exceptions→Needs Decision&Review + Ready to Publish→Quick Actions + Agent/Workflow Health→Recent Activity.
- widget→port→cap: TodaysFocus[execution+A7 alerts+roadmap gates→computeTodaysFocus,1] · CurrentWork[execution→getCurrentWork,1] · OperatingPulse[control-tower snapshots→getOperatingPulse,≤4] · NeedsDecision[approval-decision→listDecisionQueue,≤5] · ReadyToPublish[publishing→listReadyToPublish] · QuickActions[module-registry→resolveQuickActions,≤6] · AgentHealth[agent-control→getAgentHealth,≤4] · RecentActivity[activity→listRecentActivity,≤10].
- Each section resolves independently: loading|empty|stale|partial_error|permission|ok; fail→Advisory, never crash. Envelope meta.partialErrors[], meta.sectionFreshness{}.

## ALGORITHMS (pure, tests/unit 1:1)
- **8.1 focus-scoring** priority: (1)valid manual focus in business-date (2)IN_PROGRESS continuable (3)critical actionable safety alert (4)hard gate due/failing (5)approved rec needs manual exec (6)normal by score (7)empty. Critical alert valid iff: human owner + action route + !dup/!suppressed + evidence fresh.
  `focus_score = priority*.25 + due_urgency*.20 + continuity*.20 + milestone_gate*.15 + business_impact*.10 + effort_fit*.10`
  impact bands: safety/guest-commit 100; revenue-block 90; data-reliability-block 85; revenue-opt 70; prod/marketing 55; housekeeping 50–90; docs 30. AUTO_SUGGESTED persist only on Continue/Select.
- **8.2 decision-queue** hard order: 1 inventory safety→2 guest-commit/legal/compensation→3 budget overspend→4 price/promo expiry→5 publication schedule→6 normal review. In-tier:
  `decision_score = safety*.30 + deadline*.20 + financial*.20 + guest_brand*.15 + evidence_fresh*.10 + waiting_age*.05`. Home≤5, full=filter.
- **8.3 operating-pulse** (A7 computes, Dashboard reads) per domain→HEALTHY|WATCH|ACTION_REQUIRED|UNKNOWN +1 reason +1 action.
  revenue{occupancy,ADR,RevPAR,pickup,direct_share,contribution_net}→top exception only.
  inventory ACTION_REQUIRED if: serious mismatch|near-overbooking|sync stale>thresh|manual-sync>limit|conn expired.
  reputation{review SLA,high-risk,repeated root-cause,rating trend}. agent/data{A1 completeness,run health,workflow fail,evidence fresh,job dead-letter}.
- **8.4 automation-enforcement** (server=final gate): requested_action→load instance→load active policy→validate level→scope→price/budget/inventory bounds→data freshness→approval/decision→enqueue. FE disable=UX only. Breach→block+write policy_violations+alert+NO enqueue.
- **8.5 readiness** score{K1 knowledge,K2 workflow,K3 data completeness/quality,K4 decision-policy,test coverage,approval policy set,run reliability,human owner}. HARD BLOCKERS override: data completeness<thresh | no approval policy | external non-idempotent | no rollback/manual fallback | workflow<4wk stable | evidence freshness undefined | security/consent fail. Result `{status:NOT_READY|READ_ONLY_READY|RECOMMENDATION_READY|LIMITED_AUTOMATION_READY, score, hardBlockers[], evidence[]}`.
- **8.6 contribution** `net_contribution = gross_room_revenue − discount − commission − media_fee_allocated − payment_fee − variable_fulfillment − compensation_or_refund`. ROAS/budget use `net_contribution/media_spend`, never gross.
- **8.7 dedupe** exact `property+channel+external_booking_id`; fallback prob{checkin/out,guest-contact hash,room_type,gross,booked-ts proximity}=review candidate only, no auto-merge; merge audited+reversible.
- **8.8 channel-manager-trigger** ACTION_REQUIRED if: multi-channel bookings>15/wk | manual inventory edits>3/day | near/actual overbooking | founder sync>3h/wk | required direct integration lacks 2-way sync. Creates task/decision; never buy/switch vendor.
- **8.9 gate-eval** runs: schedule|source-metric change|near deadline|human req. Hard fail→block dependent capability+alert+focus candidate; waiver only via L2 Decision Record. metric unavailable→UNKNOWN not PASS.
- **8.10 freshness** per-source: inventory min–hr; booking pickup days; ads spend 24h; reviews 24–48h; competitor by stay-date window; monthly after closing.

## DATA MODEL
- Principles: PG=SoR; UUID PK; TIMESTAMPTZ UTC; business date by property TZ; every business table workspace_id (hotel+property_id); real cols not JSON (JSONB=validated ext only); `version`; soft-delete where recover; PII split analytics; external IDs≠PK; rec carries evidence+freshness; side effects idempotent.
- Foundation (all req): users, workspaces, workspace_members, projects, objectives, milestones, tasks, task_steps, workspace_focus_state, artifacts, artifact_versions, review_items, publication_items, activity_events, notifications, module_definitions, module_actions, workspace_modules, integration_connections, jobs, sync_checkpoints, outbox_events.
- Task states: BACKLOG READY IN_PROGRESS BLOCKED IN_REVIEW DONE CANCELLED.

**hospitality:**
- `properties`(id PK, workspace_id, name, timezone IANA, currency CHAR3=VND, room_count>0, status[ACTIVE|PAUSED|ARCHIVED], created_at, updated_at)
- `room_types`(id PK, property_id, code uniq/prop, name, capacity SMALLINT>0, view_type?, is_active, metadata_json JSONB)
- `rooms`(id PK, property_id, room_type_id, room_number uniq/prop, status[ACTIVE|OUT_OF_ORDER|ARCHIVED])
- `channels`(id PK, workspace_id, channel_key[DIRECT|AGODA|BOOKING|GOOGLE_HOTEL|PHONE|ZALO], display_name, channel_type[DIRECT|OTA|META|OFFLINE], is_core_year1, status) UNIQ(workspace_id,channel_key)
- `bookings`(id PK, workspace_id, property_id, channel_id, external_booking_id?, booking_status[PENDING|CONFIRMED|CHECKED_IN|CHECKED_OUT|CANCELLED|NO_SHOW], booked_at, check_in_date, check_out_date>checkin, room_nights, room_type_id, room_id?, guest_profile_id?, currency, gross_room_revenue, discount_amount, commission_amount, payment_fee, media_fee_allocated, net_contribution calc, lead_time_days calc, is_repeat_guest?, source_updated_at, ingested_at, data_quality_status[VALID|WARNING|INVALID], version) UNIQ(property_id,channel_id,external_booking_id)
- `booking_source_records`(id PK, booking_id, provider_key, external_id, source_hash, raw_storage_uri encrypted, observed_at) — raw never on Home
- `inventory_snapshots`(id PK, property_id, room_type_id, channel_id, stay_date, available_rooms≥0, restriction_json, observed_at, freshness_status[FRESH|STALE|UNKNOWN]) IDX(property_id,stay_date,room_type_id,channel_id)
- `rate_observations`(id PK, property_id, channel_id, room_type_id, stay_date, rate_plan_key[BAR|NON_REF|MOBILE], gross_rate, estimated_net_rate, currency, observed_at)
- `competitor_properties`/`competitor_rate_observations`{identity,segment match,distance,review score,room/view comparability,stay_date,rate,cancellation,observed,source} — stale>thresh ≠ auto-rec

**reputation:**
- `guest_reviews`(id, property_id, channel_id, external_review_id?, rating NUMERIC4,2?, review_text?, review_language?, reviewed_at, risk_level[NORMAL|COMPLAINT|HIGH_RISK|COMPENSATION_REQUIRED], response_status[NONE|DRAFTED|APPROVAL_REQUIRED|APPROVED|POSTED], source_updated_at)
- `review_topics`(review_id, topic_key[cleanliness|noise|mattress|bathroom|staff|view|location|value], sentiment[POSITIVE|NEUTRAL|NEGATIVE], confidence, evidence_excerpt_hash, model_version)
- `root_cause_items`(topic, recurrence_count, severity, first/last_observed, human_owner, corrective_task, status, verified_resolved_date)

**marketing:**
- `campaigns`(provider, campaign_external_id, campaign_type[G1..G4|MT1..MT3], approved_budget_envelope, status, launch_approval_id, tracking_readiness, start/end)
- `campaign_daily_metrics`(spend, impressions, clicks, sessions, conversions, gross_revenue, net_contribution, CTR/CPC/CVR/CPA/ROAS, attribution_model, data_freshness, source_ts)
- `corporate_accounts`(account_name, priority_rank 1–10, segment, contact_refs, opportunity_stage, proposed_rate, approved_rate, est_room_nights, follow_up_date, human_owner, negotiation_status) — A8 no signed agreement w/o human confirm

**crm:**
- `guest_profiles`(internal_id, name/masked, encrypted contacts, language, consent_status, repeat_status, last_stay, suppression_flags) min PII
- `consent_records`(guest_profile, purpose, channel, status[GRANTED|WITHDRAWN|UNKNOWN], source, granted/withdrawn_time, evidence_ref)
- `crm_journeys`[PRE_ARRIVAL|IN_STAY|POST_STAY] / `crm_messages`(template_version, consent_decision, approval_policy, delivery_status, idempotency_key, guest_exception_flag)

**agent-control:**
- `agent_definitions`(agent_key PK A1..A8, name, purpose, owner_module_key, build_order, max_automation_level_year1 0–3, status[ACTIVE|PAUSED|DEPRECATED], manifest_version, manifest_json)
- `agent_instances`(ws/property, agent_key, version, status[SETUP_REQUIRED|READ_ONLY|ACTIVE|DEGRADED|PAUSED], automation_level, last_successful_run, health, config_ref, policy_set_id)
- `agent_capabilities`(capability_key, agent_key, action_type, required_input_schema, output_schema, required_approval_policy, execution_mode, risk_class, required_kcore_readiness)
- `agent_runs`(instance, capability, trigger_type, status, input_snapshot_hash, evidence_set, outputs, model/provider_version, cost, started/finished, correlation_id, failure_classification)
- `agent_run_steps`(sequence, step_type, tool/module, in/out_hash, status, approval_wait_state, retry_count)
- `agent_dependencies`: A4→A1+A7 · A5→tracking+A7 · A3→AI Studio · A6→consent · A8→founder-hours-saved gate

**approval-decision:**
- `recommendations`(id, workspace_id, property_id?, agent_key, recommendation_type[PRICE|PROMOTION|INVENTORY|BUDGET|RESPONSE|CRM|CORPORATE_RATE], title, summary, proposed_action_json, expected_impact_json, risk_json, valid_from?, expires_at, status SM, evidence_set_id, source_freshness_status[FRESH|STALE|MIXED], version, created_at)
- `evidence_sets`/`evidence_records`(source_type, source_entity_id, source_version/hash, observed_time, freshness_threshold, confidence, summary, provenance_uri, human_verified) — no approve if req evidence stale
- `approval_policies`(action_type, risk_class, required_role, source_must_be_opened, dual_confirmation, allowed_automation_level, max_price_delta, max_budget_delta, inventory_conditions, expiry, rollback_requirement)
- `approval_requests`(source_type/version, policy_id/version, risk_level, status, assigned_approver, due_time, viewed_token/time, decision_note, expiry, approval_result) UNIQ source/version/policy cycle
- `decision_records`(append-only: decision_type, approved/rejected/modified, human_actor, recommendation_version, policy_version, evidence_set, reason, effective_period, rollback_condition, created) — never edit; correction=new linked

**agent-control automation:**
- `automation_policies`(agent/capability, level[0 read-only|1 recommend+approve-each|2 auto-apply-in-band|3 broad], price_floor/ceiling, max_change_percent, allowed dates/room_types/channels, budget_envelope, required_data_freshness, suspension_triggers, effective_from/to, approved_decision_record)
- `policy_violations` — over-policy: block server-side+record+alert+no enqueue

**control-tower:**
- `metric_definitions`(metric_key, name, formula_version, unit, grain[daily|weekly|monthly], source_dependencies, freshness_requirement, threshold_rules, owner=A7)
- `metric_snapshots`(property, metric_key, period, value, num/denom, formula_version, data_completeness, freshness, calculated_at, evidence_set)
- `business_alerts`(alert_type, severity, status, metric/rec/source, detected_at, action_deadline, assigned_owner, suppression_key, resolution)
- `operating_pulse_snapshots`(revenue/inventory/reputation/agent-data health, status/reason/action, generated_at, expires_at) — Dashboard reads only

**roadmap:**
- `roadmap_phases`(phase_code 0–4, start/end, objective, status, sequence)
- `phase_gates`(gate_key, phase, metric/condition, operator, threshold, hard/soft, required_evidence, owner)
- `gate_evaluations`(gate_version, evaluation_time, result[PASS|FAIL|WAIVED|UNKNOWN], evidence, human_waiver_decision, notes)
- `budget_envelopes`(category, approved_amount, spent, committed, remaining, period, decision_record, status)
- `budget_change_requests` — increase>envelope→approval

## STATE MACHINES (transition tables, canTransition()→Err on illegal)
- **Task**: →BACKLOG→READY→IN_PROGRESS⇄BLOCKED(→READY|IN_PROGRESS) · IN_PROGRESS⇄IN_REVIEW→DONE · {READY,IN_PROGRESS,BLOCKED}→CANCELLED · DONE|CANCELLED→end
- **Recommendation**: DRAFT→READY_FOR_REVIEW→{APPROVED|MODIFIED|REJECTED|EXPIRED} · MODIFIED→{APPROVED|REJECTED} · APPROVED→{QUEUED|APPLIED(manual confirmed)} · QUEUED→EXECUTING→{APPLIED|FAILED} · APPLIED→ROLLED_BACK · FAILED→READY_FOR_REVIEW(new evidence). Rules: APPROVED≠applied; approval voids on expiry/source-version change; MODIFIED stores human action; APPLIED needs ext/manual confirm; rollback links original.
- **Approval**: PENDING→OPENED→{APPROVED|REJECTED|CHANGES_REQUESTED} · CHANGES_REQUESTED→PENDING · {PENDING,OPENED}→{EXPIRED|STALE}. High-risk must OPENED before decision.
- **AgentRun**: QUEUED→RUNNING→{WAITING_APPROVAL⇄RUNNING|SUCCEEDED|FAILED|CANCELLED} · WAITING_APPROVAL→CANCELLED · FAILED→{QUEUED(retryable)|DEAD_LETTER}
- **Alert**: OPEN→{ACKNOWLEDGED→IN_PROGRESS→RESOLVED | SUPPRESSED} · ACKNOWLEDGED→SUPPRESSED · SUPPRESSED→OPEN(expired) · RESOLVED→REOPENED→IN_PROGRESS
- **Publication**: DRAFT→READY_FOR_APPROVAL→APPROVED→SCHEDULED/QUEUED→PUBLISHING→{PUBLISHED|FAILED}. Approve≠publish.
- **PhaseGate**: NOT_EVALUATED→EVALUATING→{PASS|FAIL|UNKNOWN} · FAIL→WAIVED(Decision Record only) · PASS→REOPENED(evidence invalidated)

## API
- Rules: prefix `/api/v1`; Zod validate; correlation ID; Idempotency-Key side effects; If-Match/expectedVersion mutations; stable codes; ws/property authZ; no raw provider payload; no needless PII. Route Handler=thin: validate→usecase→map Result.
- Home: `GET /workspaces/{id}/home?propertyId&projectId&date`→{workspace,property,currentProject,todayFocus{type[TASK|ALERT|GATE|RECOMMENDATION|EMPTY],sourceId,objective,priority,milestone,nextAction,estimatedMinutes,selectionMode[MANUAL|CONTINUING|AUTO_SUGGESTED],reasonCode},currentWork,operatingPulse[{key,status,reason,actionUrl}],needsDecisionReview[],readyToPublish[],quickActions[],agentHealth[],recentActivity[],header{businessDate,overallFreshness,unreadNotifications},phase{code,name,gateStatus},meta{generatedAt,partialErrors[],sectionFreshness{}}}
- Recommendations: GET /workspaces/{id}/recommendations · GET /recommendations/{id} · POST /{id}/{submit-review,approve,modify-and-approve,reject,execute,rollback}. execute req: valid approval + non-expired + policy pass + fresh evidence + idempotency key.
- Approvals: GET /workspaces/{id}/approvals · POST /approvals/{id}/{open,approve,reject,request-changes}. High-risk req viewed token.
- Agents: GET /workspaces/{id}/agents · GET /agent-instances/{id} · POST /agent-instances/{id}/{run,pause,resume} · PUT /agent-instances/{id}/automation-policy · GET /agent-runs/{id} · POST /agent-runs/{id}/{cancel,retry}. FE never calls provider.
- ControlTower: GET /properties/{id}/{operating-pulse,metrics,alerts} · POST /alerts/{id}/{acknowledge,resolve,suppress}. metric detail returns formula_version.
- Ingestion: POST /integrations/{id}/sync · POST /imports/bookings/{validate,commit} · GET /imports/{id} · webhooks allowlist+sig verify. Import=validate/preview→commit.
- PhaseGates: GET /roadmap/phases · GET /phase-gates · POST /phase-gates/{id}/{evaluate,waive,reopen}. Waive req Decision Record.

## JOBS & INTEGRATION
- **run-job 13-step** (worker): claim atomic→check idempotency→load immutable capability/policy version→load secret ref→validate input→check evidence freshness→check approval→check automation policy→exec provider/module→reconcile uncertain→update domain→write activity+outbox→release lock.
- **Outbox**: cmd changes DB+side effect → commit domain+write outbox_events SAME tx → relay reads→dispatch→mark dispatched. Guarantee: no "DB ok but job not enqueued".
- **retry-classification**(pure): retryable{timeout,rate-limit,5xx,lock contention,net blip}; permanent-until-human{invalid payload,permission/scope,expired/disconnected,policy reject,unsupported media,consent absent,stale approval,safety block}.
- **ProviderAdapter port**: `validateConnection():HealthResult · fetchChanges(cursor?):SyncBatch · execute(cmd,idempotencyKey):ProviderResult · reconcile(ref):ReconcileResult`. Providers: pms,agoda,booking,google-hotel,meta,make,manual-fallback.
- **manual-fallback**: CSV import/export + human confirm + manual exec record + evidence attach. No fake automation.
- **ai-studio.adapter**: Home calls creative.{create_social_package,create_video_script,validate_artifact,prepare_publication} → maps M01→M02→M05/M06→M03→M04→M07→M08. Home never calls Studio module direct.

## FRONTEND
- Component tree: MotherDashboardPage>{WorkspaceHeader,SidebarNavigation,TodaysFocusCard,CurrentWorkCard,OperatingPulseStrip,DecisionReviewCard,PublicationApprovalCard,QuickActionsGrid,AgentWorkflowHealthCard,RecentActivityTimeline}. Prop-driven, 0 business logic.
- Sidebar: Home Workspace·Projects·Tasks·Knowledge·Workbench·Creative Studio·Agents·Operations·Publishing·Reports·Settings. Agents=control/status/config not chat. Operations=OTA/booking/review/CRM/front-office. Reports=A7 snapshots+history no FE math. Hide non-enabled via registry.
- Hierarchy: TodaysFocus>CurrentWork>critical exception/decision>publish approval>QuickAction>health/activity. No large charts on Home.
- DecisionReviewCard row: type icon,title,agent/source,risk/severity,expiry/deadline,evidence freshness,primary action. High-risk no 1-click approve until detail opened.
- OperatingPulse UI: ≤4, no number wall, click→A7 detail, UNKNOWN≠HEALTHY, stale shows ts.
- AgentHealth UI: agent,status,last successful run,blocker,repair/configure/open. Level NOT changeable on Home.
- Responsive desktop: Focus+CurrentWork top, Pulse below, Decision∥Publish, QuickActions∥AgentHealth. Mobile: Focus→CurrentWork→CriticalPulse→DecisionQueue→Publish→QuickActions→AgentHealth→Activity.
- a11y: full keyboard, status not color-only, visible focus, touch≥44px, SR announce job/approval, reduced-motion, confirm irreversible.

## EDGE CASES (→named tests)
- booking/inv: PMS+OTA same→link source+dedupe · external ID change→no overwrite,reconcile · neg inventory→safety block,no auto-publish · partial sync→per-channel state · stale inv but Home opens→Pulse ACTION_REQUIRED,local exec ok.
- price/promo: expire pre-approval→EXPIRED · competitor stale→no auto-apply,lower conf · below floor→server block · stack neg net→block+risk explain · accepted+timeout→reconcile pre-retry.
- review/guest: compensation→human-only · legal-risk draft→policy validator+escalate · consent withdrawn→stop CRM+min audit · open complaint→suppress promo.
- ads: tracking broken+spend→critical alert+block scale · over envelope→block auto-adjust · ±10% pre Phase3 gate→policy violation.
- agent/AI: malformed→schema fail · hallucinated source→evidence must resolve source record · prompt injection upload→untrusted+tool allowlist · 4wk run output unused→not "live".
- phase: gate metric unavailable→UNKNOWN not PASS · human waive hard gate→Decision Record · founder-hours-saved fail→corporate outreach blocked.

## SECURITY/GOVERNANCE
- AuthZ: ws-scope every query; property-scope when needed; roles OWNER/EDITOR/VIEWER + authorities PRICE_APPROVER,INVENTORY_APPROVER,BUDGET_APPROVER,PUBLISH_APPROVER,GUEST_COMMITMENT_APPROVER. Solo founder may hold all but policy must exist.
- PII: minimize; encrypt contacts; never in logs; mask UI; retention; purpose-specific consent; export/delete.
- Secrets: vault; DB ref only; token never in payload/logs/URL/activity.
- Audit mandatory: price/promo approval, inventory change, budget change, external publish, guest message, compensation/refund, automation-level change, gate waiver, agent-policy change.
- Policy-as-code: approval/automation versioned YAML/JSON schema-validated in docs/policies. No hard-code in UI.

## PERF/OBS
- Targets: Home p95<500ms; 0 external in Home path; first usable<2.5s; command feedback<200ms pending; fixed limit+index every query; pulse precomputed.
- Metrics: API latency/errors, DB latency, Home partial errors, freshness breach, job-queue latency, agent success/fail/cost, rec approval rate, applied-impact, policy violations, reconciliation count, dead-letter, founder-hours-saved completeness.
- Health separate: application/database/integration/agent/data-freshness/business-safety. No single green dot.

## ROADMAP (order, no skip Exit Gate)
`Contracts→DB Core→Execution/Approval→Home BFF→Frontend Shell→Hospitality Data→A1→A2+A7→A3 Studio→A4→A5→A8→A6→Productization`. Agent order A1→A2/A7→A3→A4→A5→A8→A6 (A8 before A6).
- **S0 Freeze contracts**: freeze enums/SM/manifests/approval-policy schema/Home response; ADRs; OpenAPI skeleton+codes+idempotency/concurrency; FE fixtures no logic. Build docs/{adr,openapi,policies,manifests}, seed/fixtures, shared/kernel. Gate: no DB code while status ambiguous.
- **S1 Dashboard Core**: identity,execution,activity,module-registry; focus service; artifact/review/publication skeleton; jobs/outbox; Home v1; shell/header/sidebar; Focus,CurrentWork,Review,Publish,QuickActions,Activity; all UI states. Gate: runs on seeded/local, no external dep.
- **S2 Agent/Decision plane**: agent-control+approval-decision full; Decision+AgentHealth cards; detail pages; level read-only. Gate: mock rec→approve→execute via mock adapter, full audit.
- **S3 Hospitality+A1**: properties/rooms/channels/bookings, source mapping, import validate/commit, dedupe/reconcile, data-quality, daily pickup. Gate: ≥95% req booking fields; single SoT; stable pickup; vendor abstraction no schema lock.
- **S4 A2+A7**: review ingest/taxonomy/root-cause; metric def/snapshots; pulse; alerts; phases/gates. Gate: A1/A2/A7 live; SLA+data health measurable; Home computes no KPI.
- **S5 A3**: AI Studio adapter, artifact mapping, approval+publishing link, persona refs; Creative entry; job progress; review/publish. Gate: A3 uses M01–M09, no 2nd pipeline.
- **S6 A4 OTA**: rate/inv/competitor obs, net contribution, pricing rec, price-band policy, inventory safety, CM triggers. Gate: Level0 first, Level1 after data reliability; overbooking-by-sync=0; no Level2 w/o ≥90d+evidence+policy.
- **S7 A5 Ads**: campaign/tracking, attribution, budget envelope, anomaly; ±10% only after Gate Phase2. Gate: tracking 14d pass; server-side enforce.
- **S8 A8 Corporate**: accounts/opps, proposal artifacts, follow-up, attribution. Gate: founder hours saved≥25% or waiver+Decision Record.
- **S9 A6 CRM**: consent, journeys, templates, suppression, delivery logs, ancillary. Gate: no serious guest-comm error; consent audit complete.
- **S10 Productization**: tenant-neutral config, provider-abstraction tests, onboarding checklist, seed/config packs, migration/import, 2nd-property validation, Continue/Simplify/Pivot/Kill records.

## TESTS
- unit(mirror domain): task transitions, focus ranking, decision-queue ranking, rec expiry, evidence freshness, approval source-version, policy limits, readiness blockers, contribution net, dedupe candidates, gate eval, consent suppression, budget envelope.
- integration: DB tx+outbox, dup idempotency, cross-ws/property isolation, approve-then-source-change, provider-timeout-reconcile, partial channel success, CSV preview→commit, agent dep degraded, gate-fail blocks capability, A3 adapter contract.
- e2e(Playwright): E2E-01 continue work(Home→Continue→CurrentWork→activity→refresh persists) · E2E-02 critical inv alert(A7→focus candidate→detail→action→resolve) · E2E-03 price rec(draft→evidence→approval→policy→exec/manual→applied→impact) · E2E-04 content publish(artifact→validate→approval→separate publish→dup click→1 post) · E2E-05 ads budget block(over envelope→block→alert→budget approval) · E2E-06 CRM consent(withdrawn→suppress→no job) · E2E-07 gate dep(hours<25%→A8 blocked→Decision Record waiver).
- failure-injection: provider down, token expired, DB fail after cmd pre-outbox, worker restart, stale metric, malformed AI, dup webhook, corrupt CSV row, uncertain side effect, storage missing.

## DoD
- Core: Home action-first; Focus+CurrentWork dominate; Pulse exceptions only; Decision Queue unified; publish≠approval; QuickActions registry-driven.
- Data: canonical not vendor-locked; A1=booking SoT; A7 owns formula/snapshot; recs carry evidence/provenance; PII/consent controlled.
- Agent: A1–A8 definition/capability/dependency; A3 uses Studio; A7≠M10; level enforced server-side; no "live" on demo.
- Safety: price floor/ceiling; budget envelope; inventory safety; approval policies; idempotency/reconcile; audit/rollback/manual fallback.
- Eng: tests pass; migration/backup/restore; observability; no external in Home render; partial-fail isolation; mobile/a11y; ESLint boundary green.

## GUARDRAILS — NEVER
1 A7 formula in React · 2 new content pipeline for A3 · 3 mix M10+A7 · 4 hard-code QuickActions · 5 automate pre K1–K4 readiness · 6 approve+execute 1-click high-risk · 7 gross instead of contribution net for media · 8 retry external w/o reconcile · 9 token/PII in logs · 10 gate PASS while UNKNOWN · 11 new OTA beyond Direct+Agoda+Booking.com y1 · 12 bypass price/budget/inventory policy client-side · 13 A6 before A8 w/o roadmap change · 14 Dashboard owns all business logic.
- Required outputs: DB migrations, domain enums/SM, JSON-Schema/YAML manifests, approval/automation policies, OpenAPI, domain services, Home BFF, FE components, agent/module adapters, worker/outbox, unit/integ/e2e tests, seed, backup/restore, deploy/rollback, data dictionary, ADRs.

> Agents recommend. Policy limits authority. Humans own decisions. Dashboard = one operable workspace; boundary enforced by compiler+linter.
