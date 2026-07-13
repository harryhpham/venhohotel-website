# VENHO OS — OTA MANAGEMENT & REVENUE AGENT
## KẾ HOẠCH PHÁT TRIỂN THEO GIAI ĐOẠN — v1.3 FINAL

**Mã module:** OTA-01  
**Tên module:** OTA Management & Revenue Agent  
**Phiên bản tài liệu:** v1.3 Final — QC Consolidated  
**Ngày rà soát:** 12/07/2026  
**Phạm vi:** Ven Hồ Hotel — 12 phòng — Agoda, Booking.com, Skyhotel.vn  
**Vị trí:** Module nghiệp vụ trong Mother Dashboard của VENHO OS  
**Chủ sở hữu phê duyệt:** Hotel Owner / Manager  
**Nguyên tắc:** Startup OS cho một người quản lý; an toàn trước, doanh thu ròng trước, tự động hóa có kiểm soát, không over-engineering.

---

# 0. TRẠNG THÁI TÀI LIỆU VÀ KẾT QUẢ QC

Tài liệu này thay thế bản kế hoạch v1.2 làm tài liệu triển khai chính thức cho OTA-01. Bản v1.2 vẫn được lưu làm lịch sử thay đổi.

## 0.1. Quy trình QC đã thực hiện

1. Phân tích toàn bộ 45 trang của v1.2, bao gồm kiến trúc, nghiệp vụ OTA, AI Agent, Dashboard, dữ liệu, bảo mật, KPI, workflow, roadmap, Definition of Done và phụ lục QC cũ.
2. Rà soát chéo giữa các mục để phát hiện mâu thuẫn về quyền hạn, trạng thái Agent, dữ liệu nguồn, write-back, timeline, kiểm thử, triển khai và phạm vi từng phase.
3. Sửa các lỗi nghiêm trọng, cao, trung bình và chuẩn hóa lại kiến trúc runtime, cơ chế phê duyệt, dữ liệu, pricing engine, kill switch, rollback và lộ trình.
4. Hợp nhất ba lộ trình rời trước đây — Phase nghiệp vụ, Track A Agent và Track I Dashboard — thành **một kế hoạch phát triển theo giai đoạn**, dễ triển khai và kiểm soát hơn cho solo founder.

## 0.2. Các lỗi trọng yếu đã được sửa

| # | Mức | Vấn đề trong v1.2 | Cách sửa trong v1.3 |
|---|---|---|---|
| 1 | Nghiêm trọng | Lẫn lộn giữa phiên bản tài liệu v1.2, module v1.0 và Phase 5 v1.1+ | Tách rõ **phiên bản tài liệu**, **Operational MVP**, **Module v1.0** và **Module v1.1 Learning** |
| 2 | Nghiêm trọng | Skyhotel được gọi là SSOT cho mọi dữ liệu, kể cả trạng thái đã publish trên OTA | Tạo **Source-of-Record Matrix** theo từng miền dữ liệu |
| 3 | Nghiêm trọng | Agent và Dashboard đọc/ghi trực tiếp file chung; không an toàn khi chạy khác máy hoặc trên Vercel/VPS | File-first chỉ dùng cho cấu hình, governance và export; runtime dùng **Internal API + SQLite/WAL** trong MVP |
| 4 | Nghiêm trọng | Không có idempotency, deduplication và xử lý event lặp/mất thứ tự | Bổ sung `source_event_id`, `dedupe_key`, version, cursor, idempotency key và reconciliation |
| 5 | Nghiêm trọng | Approval có thể bị áp dụng sau khi dữ liệu booking/rate đã thay đổi | Bổ sung `context_hash`, revalidation ngay trước write và tự chuyển `STALE` |
| 6 | Nghiêm trọng | Trạng thái `Killed` vẫn cho đọc/cảnh báo, gây mâu thuẫn ngữ nghĩa | Thay bằng bốn mode rõ ràng: `RUNNING`, `READ_ONLY`, `PAUSED`, `EMERGENCY_STOP` |
| 7 | Nghiêm trọng | Auto-reopen có thể mở lại phòng đang bảo trì hoặc vừa giữ cho direct booking | Loại auto-reopen khỏi Module v1.0; chỉ xem xét ở Phase 5 sau dữ liệu ổn định |
| 8 | Nghiêm trọng | Tổng thời lượng ghi 12–16 tuần nhưng lịch kéo dài 7–8 tháng; chưa tính shadow mode và nghiệm thu 4 tuần | Chuẩn hóa: **18–22 tuần build chủ động; 24–30 tuần elapsed** tùy freeze window và tier tích hợp |
| 9 | Cao | Runtime khóa cứng vào Claude Agent SDK/Claude Code, không phù hợp nguyên tắc AI-agnostic | Dùng provider adapter; OpenAI hoặc Claude đều thay thế được; Claude Code chỉ là công cụ phát triển, không phải runtime bắt buộc |
| 10 | Cao | `temperature 0` bị coi là đảm bảo tính quyết định | Rule Engine vẫn deterministic; LLM dùng structured output, schema validation và template fallback; LLM lỗi không chặn vận hành |
| 11 | Cao | Công thức nhân nhiều factor dễ khó giải thích và lệ thuộc giá hiện tại | Chuyển sang **Reference Rate + bounded demand adjustment** |
| 12 | Cao | Confidence score chưa có công thức | Định nghĩa score từ độ đầy đủ, độ mới, độ tương đồng comp set và sync health |
| 13 | Cao | Rollback có thể ghi đè thay đổi mới phát sinh sau lần publish | Dùng optimistic lock / compare-and-set; rollback chỉ thực hiện khi phiên bản hiện tại còn khớp |
| 14 | Cao | Dashboard ghi thẳng `APPROVAL_LOG.jsonl`, không có xác thực hành động | Approval đi qua Approval Service, lưu actor, nonce, context hash, lý do và audit event |
| 15 | Cao | Không có backup, restore, RPO/RTO | Bổ sung backup mã hóa, restore drill, RPO 1 giờ và RTO 4 giờ cho VENHO runtime |
| 16 | Cao | DoD “7 ngày không lỗi” và “100% write-back” quá tuyệt đối | Đổi sang không có lỗi không xử lý, pass 100% test bắt buộc và canary production có tiêu chí định lượng |
| 17 | Cao | Không có canary rollout trước khi bật write-back toàn bộ | Bổ sung dry-run → một OTA/một room type/một ngày → mở rộng từng bước |
| 18 | Cao | Competitor snapshot không có TTL sử dụng trong pricing | Quy định freshness theo lead time; dữ liệu stale bị loại khỏi tính giá |
| 19 | Cao | Chưa xử lý promotion stacking và effective net rate | Bổ sung promotion stack, commission, payment cost, tax/fee và trạng thái `estimated/confirmed` |
| 20 | Trung bình | “Parity” được dùng như quy tắc cố định dù mobile/member/geo rate có thể khác | Đổi thành **Rate Consistency Policy**, cấu hình ngoại lệ theo hợp đồng và chương trình từng OTA |
| 21 | Trung bình | Con số tiết kiệm 15–25 triệu/năm chưa có báo giá thực tế | Chuyển thành giả định; chỉ dùng sau khi nhận báo giá Skyhotel/CM tại Gate G0 |
| 22 | Trung bình | Không có giới hạn chi phí model | Sync/reconciliation không gọi LLM; đặt ngân sách model/ngày và cảnh báo vượt mức |
| 23 | Trung bình | Thiếu schema versioning và change control cho rules | Mọi record có `schema_version`; rules có version, effective date, owner approval và rollback |
| 24 | Trung bình | Booking test thật chưa có quy trình tài chính và hủy an toàn | Bổ sung test booking SOP, ngân sách test, phương án hủy và đối soát |
| 25 | Trung bình | Module v1.0 tuyên bố Owner không cần mở Skyhotel/OTA dù tier 3 vẫn thủ công | DoD được định nghĩa theo tier; tier 3 vẫn cần thao tác thủ công có checklist |
| 26 | Trung bình | Không có blackout/freeze window cho mùa cao điểm | Owner khóa lịch không triển khai write production trong các ngày nhạy cảm |
| 27 | Trung bình | Không có chỉ số vận hành Agent và connector | Bổ sung run success, latency, data freshness, action success, alert delivery và model cost |
| 28 | Nhẹ | Mock data mặc định 3 loại phòng có thể không đúng thực tế | Mock schema dùng số loại phòng thực tế sau Phase 0; trước đó dùng dữ liệu generic |

---

# 1. MỤC TIÊU VÀ PHẠM VI

OTA-01 là trung tâm điều hành Agoda và Booking.com trong VENHO OS. Module không thay thế Skyhotel hoặc OTA; module tạo lớp giám sát, phân tích, đề xuất, phê duyệt, thực thi có kiểm soát và audit.

## 1.1. Mục tiêu kinh doanh

- Không phát sinh overbooking do lỗi của VENHO OS hoặc sai đồng bộ không được phát hiện.
- Giảm tối thiểu 60% thời gian thao tác OTA lặp lại so với baseline Phase 0.
- Tăng khả năng bán phòng ngày thấp điểm và bảo vệ ADR ngày cao điểm.
- Tối ưu **Net Room Revenue**, không chạy theo giá thấp nhất thị trường.
- Phát hiện nhanh booking thiếu, tồn phòng lệch, giá publish sai, room/rate mapping lỗi.
- Owner xem, duyệt và kiểm soát toàn bộ từ Mother Dashboard.

## 1.2. Phạm vi Module v1.0

- Agoda, Booking.com và Skyhotel.
- Booking mới, sửa đổi, hủy và no-show khi nguồn cung cấp.
- Inventory, room block, closed date, rate và restrictions.
- Competitor set và snapshot giá có kiểm soát.
- Pricing recommendation có giải thích, confidence, TTL và Owner Approval.
- Dashboard OTA & Revenue và Card OTA Agent trong AI Agent Center.
- Controlled write-back, verify, audit, conditional rollback và emergency stop.
- Safe automation giới hạn trong pre-approved allowlist.

## 1.3. Ngoài phạm vi Module v1.0

- Trở thành Connectivity Partner trực tiếp của Booking.com hoặc Agoda.
- Dynamic pricing tự động hoàn toàn không có human approval.
- Auto-reopen inventory.
- Xử lý thẻ thanh toán, hoàn tiền hoặc tranh chấp tài chính tự động.
- Multi-property, chuỗi khách sạn hoặc thêm nhiều OTA.
- Scraping quy mô lớn hoặc hoạt động trái điều khoản nền tảng.
- Engine phản hồi review; chức năng này thuộc M1 Review Ops.

## 1.4. Mốc sản phẩm

- **Operational MVP:** hoàn thành Phase 0–2; đọc dữ liệu, cảnh báo, competitor intelligence và đề xuất giá có duyệt nhưng chưa write-back tự động.
- **Module v1.0:** hoàn thành Phase 0–4; controlled write-back và safe monitoring đạt nghiệm thu.
- **Module v1.1:** Phase 5 Learning & Optimization sau tối thiểu 60–90 ngày dữ liệu sạch.

---

# 2. KIẾN TRÚC VÀ NGUỒN DỮ LIỆU

## 2.1. Source-of-Record Matrix

| Miền dữ liệu | Nguồn có thẩm quyền | Vai trò VENHO OS |
|---|---|---|
| Phòng vật lý, trạng thái phòng, bảo trì, block nội bộ | Skyhotel PMS | Đọc, chuẩn hóa, đối chiếu, cảnh báo |
| Booking đang hoạt động và lưu trú | Skyhotel sau khi nhận từ CM; OTA dùng để đối chứng | Reconcile theo booking ID và version |
| Booking mới/sửa/hủy trên kênh | OTA/Channel Manager event | Kiểm tra đã vào Skyhotel và đã cập nhật inventory |
| Inventory có thể bán | Skyhotel + quy tắc block/buffer | Tính kiểm tra; không tạo lịch phòng độc lập cao hơn PMS |
| Giá/rule dự kiến gửi kênh | Skyhotel/Channel Manager | Đọc và thực hiện theo tier được duyệt |
| Giá/availability đã publish cuối cùng | Agoda và Booking.com hoặc acknowledgement chính thức của CM | Verify và cảnh báo mismatch |
| Recommendation, Approval, Action Log | VENHO OS | Nguồn chính thức duy nhất |
| Competitor snapshot | VENHO OS, kèm nguồn và timestamp | Dữ liệu tham khảo, không phải dữ liệu giao dịch |

**Lock:** Không dùng một khái niệm SSOT duy nhất cho tất cả miền dữ liệu. Skyhotel là hệ thống chính cho inventory và booking nội bộ; OTA là nguồn xác minh trạng thái publish; VENHO OS là nguồn chính cho quyết định và audit.

## 2.2. Tier tích hợp

1. **Tier 1 — Skyhotel Channel Manager:** ưu tiên khi đang có hoặc chi phí hợp lý.
2. **Tier 2 — API/Webhook chính thức của Skyhotel:** chỉ dùng sau khi Skyhotel cấp tài liệu, credential, giới hạn và quyền ghi bằng văn bản.
3. **Tier 3 — Structured export + manual action:** CSV/XLSX/email/report có schema; checklist thao tác và verify thủ công.
4. **Tier 4 — RPA dự phòng:** không dùng làm lõi MVP; chỉ sau phê duyệt riêng, quyền tối thiểu và có emergency stop.

## 2.3. Decision Gate G0

Không bắt đầu xây connector production hoặc write-back trước khi Owner chốt một nhánh:

| Nhánh | Điều kiện | Hệ quả |
|---|---|---|
| G0-A | Skyhotel CM hoạt động, map được Agoda/Booking.com, chi phí chấp nhận | Tier 1; ưu tiên read/write qua CM/PMS |
| G0-B | Skyhotel cung cấp API/Webhook chính thức phù hợp | Tier 2; xây connector có contract test |
| G0-C | Không có CM/API phù hợp hoặc chi phí không hợp lý | Tier 3; Operational MVP vẫn triển khai, Phase 3–4 thu hẹp thành guided action + verify |

## 2.4. Kiến trúc runtime MVP

```text
Agoda / Booking.com
        ↕
Skyhotel / Channel Manager / Structured Export
        ↕
VENHO Integration Adapter
        ↕
Normalization + Reconciliation + Rule Engine
        ↕
Approval Service + Action Executor + Verification
        ↕
Operational Store (SQLite/WAL trong single-node MVP)
        ↕
Internal API
        ↕
Mother Dashboard + AI Agent Center
```

### File-first được giữ như sau

- Markdown/JSON versioned: policy, mapping, pricing rules, comp set, season calendar, alert rules, pre-approved rules.
- SQLite/WAL: runtime state, jobs, approvals, alerts, action status và dedupe.
- JSONL export: immutable audit export hằng ngày.
- Backup: encrypted database snapshot + config repository.

Dashboard **không ghi trực tiếp file log** và không gọi tool hệ thống. Dashboard gọi Internal API; API thực hiện authorization, validation, transaction và audit.

## 2.5. Deployment topology

- Phase 0–2 có thể chạy trên Mac mini nếu luôn bật và có kết nối ổn định.
- Trước Phase 3, runtime write-back phải chạy trên thiết bị always-on có backup điện/mạng hoặc VPS đáng tin cậy.
- Nếu Mother Dashboard chạy trên Vercel, runtime state bắt buộc nằm ở persistent database/service; không dùng filesystem cục bộ của Vercel.
- Runtime phải hỗ trợ provider adapter để OpenAI hoặc Claude có thể thay thế nhau.

---

# 3. CẤU TRÚC OTA AI AGENT

## 3.1. Nguyên tắc

1. Rule Engine quyết định số liệu; LLM chỉ giải thích và tóm tắt.
2. LLM không nằm trên critical path của sync, reconciliation hoặc write-back.
3. LLM lỗi thì dùng template explanation; hệ thống vẫn tiếp tục đọc, cảnh báo và thực hiện rule đã duyệt.
4. Mọi tool call có schema, timeout, retry policy và idempotency key.
5. Mọi run có `run_id`, `rule_version`, `schema_version`, thời gian bắt đầu/kết thúc và kết quả.
6. Không truyền dữ liệu thẻ hoặc PII đầy đủ vào model.

## 3.2. Bốn skill

### A. OTA Operations Skill

- Theo dõi booking mới/sửa/hủy/no-show.
- Audit listing, promotion, room/rate mapping và trạng thái review.
- Phát hiện closed date, rate bằng 0, thiếu inventory, restriction bất thường.
- Liên kết review chưa phản hồi sang M1 Review Ops.

### B. Competitor Intelligence Skill

- Quản lý Primary 5, Secondary 5 và Watch List.
- Chuẩn hóa giá theo số khách, thuế/phí, bữa sáng và chính sách hủy.
- Tính comparability score và freshness.
- Không dùng dữ liệu stale hoặc khách sạn khác phân khúc làm đầu vào chính.

### C. Revenue Recommendation Skill

- Tính giá theo ngày và room type bằng Rule Engine.
- Tính effective net rate, confidence và TTL.
- Giải thích factor breakdown.
- Không tự publish nếu chưa qua approval và revalidation.

### D. Inventory & Sync Control Skill

- Reconcile booking, inventory, rate và restriction.
- Phát hiện event lặp, event thiếu, event sai thứ tự, mapping lỗi và sync delay.
- Retry chức năng chính thức theo allowlist.
- Auto-close khẩn cấp chỉ từ Phase 4 và theo rule rất chặt.

## 3.3. Chế độ điều khiển Agent

| Mode | Scheduler | Read/Alert | Write system |
|---|---|---|---|
| `RUNNING` | Bật | Bật | Chỉ hành động đã duyệt/allowlist |
| `READ_ONLY` | Bật | Bật | Tắt hoàn toàn |
| `PAUSED` | Tắt run theo lịch | Manual read run được phép | Tắt |
| `EMERGENCY_STOP` | Monitor tối thiểu vẫn chạy | P1 alert vẫn bật | Tắt cứng tại Action Executor |

Emergency stop được kiểm tra ở hai tầng: trước mỗi run và ngay trước mỗi write tool call.

## 3.4. Quyền hạn

### Tự động không cần duyệt

- Đọc, chuẩn hóa, reconcile và dedupe dữ liệu.
- Tạo alert, report, Daily Brief và recommendation.
- Ghi audit log.
- Retry read hoặc refresh dữ liệu không làm thay đổi trạng thái bán.

### Cần Owner Approval

- Thay đổi rate, restriction, minimum stay, promotion, policy, allotment hoặc mapping.
- Đóng/mở bán ngoài emergency rule.
- Bulk action nhiều ngày hoặc nhiều room type.

### Pre-approved allowlist Phase 4

- Retry đồng bộ bằng chức năng chính thức.
- Auto-close khi tất cả điều kiện cùng đúng:
  - PMS available inventory = 0;
  - không có mapping error;
  - dữ liệu PMS mới hơn ngưỡng freshness;
  - CM không tự đóng hoặc đang báo lỗi;
  - hành động chỉ giảm availability, không tăng;
  - action có idempotency key, verify và thông báo tức thời.

**Auto-reopen không thuộc Module v1.0.**

### Cấm

- Hủy hoặc từ chối booking hợp lệ.
- Sửa dữ liệu thanh toán/thẻ.
- Vượt floor/ceiling hoặc Minimum Acceptable Net Rate.
- Xóa audit log.
- Scraping trái điều khoản.
- Tự tham gia promotion hoặc phá giá.

---

# 4. DỮ LIỆU, TÍNH NHẤT QUÁN VÀ AUDIT

## 4.1. Booking lifecycle

`NEW → CONFIRMED → MODIFIED → CANCELLED / NO_SHOW / COMPLETED`

- Mỗi event có `source_event_id`, `source_updated_at`, `ingested_at`, `event_type`, `version`.
- Dedupe bằng OTA + property + booking ID + source version/event ID.
- Modified event không được tạo double inventory release/hold.
- Stay nights tính theo khoảng `[check_in, check_out)`.

## 4.2. Inventory formula

```text
Available Inventory theo room type và stay_date
= Physical Sellable Rooms
- Active Booking Nights
- Maintenance / Out-of-Service Blocks
- Confirmed Internal Holds
- Safety Buffer
```

- Safety buffer mặc định 0 ở Tier 1–2 sau nghiệm thu.
- Safety buffer 1 phòng trong Tier 3 hoặc giai đoạn pilot nếu Owner duyệt.
- Không auto-reopen dựa riêng vào cancellation event.

## 4.3. Record bắt buộc

### BookingRecord

- `schema_version`, `booking_id`, `ota`, `ota_booking_id`
- `source_event_id`, `source_version`, `dedupe_key`
- `guest_ref_masked`, `check_in`, `check_out`
- `room_type_id`, `rate_plan_id`, `occupancy`
- `gross_amount`, `commission_estimate`, `net_estimate`, `currency`
- `status`, `booked_at`, `modified_at`, `cancelled_at`
- `sync_status`, `last_synced_at`, `source_updated_at`

### RateInventoryRecord

- `schema_version`, `room_type_id`, `ota_room_type_id`, `rate_plan_id`
- `stay_date`, `inventory`, `rate`, `currency`
- `restrictions`, `source`, `source_version`
- `sync_status`, `last_synced_at`, `verified_at`

### RecommendationRecord

- `schema_version`, `rec_id`, `stay_date`, `room_type_id`, `ota_scope`
- `current_rate`, `reference_rate`, `recommended_rate`
- `factor_breakdown`, `effective_net_rate`, `confidence`
- `data_freshness`, `context_hash`, `rule_version`
- `status`, `expires_at`, `stale_reason`
- `approved_by`, `approved_at`, `applied_at`, `verified_at`

### ActionRecord

- `action_id`, `approval_id`, `idempotency_key`, `actor`
- `before_value`, `requested_value`, `actual_after_value`
- `source_version_before`, `result_version`
- `status`, `attempt_count`, `error_code`
- `rollback_eligible`, `verification_result`

## 4.4. Recommendation state machine

```text
DRAFT
→ RECOMMENDED
→ OWNER_REVIEW
→ APPROVED / MODIFIED / REJECTED / EXPIRED / STALE
→ SCHEDULED
→ EXECUTING
→ PUBLISHED
→ VERIFIED
→ COMPLETED / FAILED / ROLLED_BACK / MANUAL_REVIEW
```

### TTL mặc định

| Lead time đến stay date | TTL tối đa |
|---|---|
| 0–2 ngày | 2 giờ |
| 3–7 ngày | 6 giờ |
| 8–30 ngày | Đến cuối ngày tạo |
| Trên 30 ngày | 24 giờ |

Recommendation tự chuyển `STALE` trước TTL nếu inventory, current rate, restriction, event severity, sync health hoặc rule version thay đổi đáng kể.

## 4.5. Atomicity và concurrency

- Mọi approval và action dùng transaction.
- Write-back dùng idempotency key.
- Trước write phải re-read current state và so `context_hash`/version.
- Nếu state đã đổi, không ghi; chuyển `STALE` và yêu cầu recommendation mới.
- Bulk approval là tập hợp các recommendation riêng; mỗi ngày/room type vẫn được validate độc lập.

## 4.6. Audit và retention

- Audit log append-only; không xóa qua Dashboard.
- Log runtime và approval giữ tối thiểu 24 tháng.
- Competitor snapshot giữ tối thiểu 12 tháng.
- PII trong log luôn mask; không lưu PAN/CVC hoặc ảnh thẻ.
- JSONL audit export được tạo hằng ngày và checksum.

---

# 5. PRICING ENGINE

## 5.1. Mục tiêu

```text
Net Room Revenue
= Gross Room Revenue
- OTA Commission
- Promotion Cost
- Payment Cost
- Refund / Compensation Cost
```

Mọi giá đề xuất phải thỏa:

```text
Price Floor ≤ Recommended Rate ≤ Price Ceiling
Effective Net Rate ≥ Minimum Acceptable Net Rate
```

## 5.2. Công thức MVP đã sửa

### Bước 1 — Reference Rate

```text
Reference Rate
= Base Rate
× Season Factor
× Day-of-Week Factor
× Event Factor
× Product / Room Factor
```

Product Factor bao gồm premium của phòng view hồ nếu được Owner khóa trong Pricing Rules.

### Bước 2 — Demand Adjustment

```text
Demand Adjustment
= weighted Occupancy Signal
+ weighted Pickup Signal
+ weighted Lead-Time Signal
+ weighted Competitor Signal
```

- Mỗi signal nằm trong khoảng cấu hình.
- Tổng routine adjustment mặc định bị chặn trong `[-15%, +15%]`.
- Candidate Rate = Reference Rate × (1 + Demand Adjustment).
- Lỗi giá, rate bằng 0 hoặc giá ngoài floor/ceiling được xử lý như incident, không dùng routine adjustment.

### Bước 3 — Guardrails

- Floor, ceiling và minimum net rate.
- Tối đa một routine change cho cùng stay date + room type trong 24 giờ.
- Ngoại lệ cần Owner re-approval và lý do.
- Không dùng thông tin competitor stale.
- Không giảm giá chỉ để thấp nhất comp set.

## 5.3. Confidence score

```text
Confidence =
35% Data Completeness
+ 25% Data Freshness
+ 20% Competitor Comparability
+ 20% Sync Health
```

| Điểm | Xử lý |
|---|---|
| 80–100 | High — được phép đưa vào bulk review |
| 60–79 | Medium — hiển thị cảnh báo và yêu cầu xem từng item |
| Dưới 60 | Low — không đưa khuyến nghị hành động; chỉ hiển thị informational insight |

## 5.4. Promotion và rate consistency

- Phân biệt headline rate, mobile/member/geo rate, promotion và effective guest price.
- Tính promotion stacking trước khi tính net rate.
- Rate Consistency Policy do Owner khóa sau khi đối chiếu hợp đồng từng OTA.
- Mobile/member/geo promotion được coi là ngoại lệ hợp lệ nếu đã cấu hình.
- Mismatch chỉ cảnh báo khi vượt policy đã khóa, không áp một quy tắc parity tuyệt đối cho mọi rate.

## 5.5. Occupancy và lead time guardrail

| Occupancy | Gợi ý ban đầu |
|---|---|
| 0–30% | Xem xét giảm nhẹ hoặc promotion có điều kiện |
| 31–55% | Giữ hoặc điều chỉnh nhỏ theo pickup |
| 56–75% | Tăng nhẹ nếu pickup tốt |
| 76–90% | Tăng giá, hạn chế discount sâu |
| Trên 90% | Tăng rõ ràng; bảo vệ inventory và net rate |

Với 12 phòng, Dashboard luôn hiển thị cả phần trăm và số phòng tuyệt đối.

---

# 6. COMPETITOR INTELLIGENCE

## 6.1. Comp set

- Primary: 5 khách sạn gần nhất về phân khúc và sản phẩm.
- Secondary: 5 khách sạn tham khảo thị trường.
- Watch List: khách sạn mới hoặc biến động mạnh.

## 6.2. Comparability score

Tối thiểu đánh giá:

- Khu vực và khoảng cách.
- Phân khúc và mô hình lưu trú.
- Room size, occupancy, view và tiện nghi.
- Refundability, meal plan, tax/fee.
- Review score và số lượng review.
- Giá trị tương đương của room type.

Competitor có score thấp không được tính vào median chính.

## 6.3. Snapshot fields

- Collected timestamp theo Asia/Ho_Chi_Minh.
- Stay date, nights, guests, room type.
- Display price, tax/fee, total price.
- Currency gốc, tỷ giá, giá VND và thời điểm tỷ giá.
- Cancellation, meal plan, availability.
- Source, collection method, comparability score.

## 6.4. Freshness

| Stay window | Max age để dùng trong pricing |
|---|---|
| 0–7 ngày | 24 giờ |
| 8–30 ngày | 72 giờ |
| 31–90 ngày | 7 ngày |
| Event/holiday | 24 giờ hoặc theo rule riêng |

Ưu tiên dữ liệu từ extranet/market insight hoặc nguồn được cấp phép. Không dùng scraping quy mô lớn.

---

# 7. WORKFLOW CHÍNH

## 7.1. Booking mới/sửa/hủy

1. Nhận event hoặc đọc snapshot mới.
2. Validate schema và dedupe.
3. Upsert booking theo source version.
4. Recompute stay-night inventory.
5. Reconcile với Skyhotel.
6. Cập nhật Dashboard.
7. Tạo P1/P2 nếu missing, duplicate, mapping sai hoặc inventory mismatch.
8. Ghi run/action audit.

## 7.2. Pricing recommendation

1. Kiểm tra freshness và sync health.
2. Thu thập inventory, occupancy, pickup, current rate, season/event và comp data.
3. Rule Engine tính reference rate, demand adjustment, guardrail và confidence.
4. Tạo recommendation + context hash + TTL.
5. LLM hoặc template sinh explanation.
6. Owner approve/modify/reject.
7. Revalidate ngay trước execute.
8. Write-back theo tier hoặc tạo guided manual action.
9. Verify published state.
10. Hoàn tất, failed, manual review hoặc conditional rollback.

## 7.3. Verify và rollback

- Tier 1–2: verify acknowledgement và read-back trong 5–15 phút; nếu nguồn chỉ cập nhật chậm, dùng SLA đã xác nhận tại G0.
- Tier 3: Owner áp thủ công và đánh dấu verify bằng checklist trong tối đa 30 phút.
- Rollback chỉ thực hiện khi current version vẫn bằng version do VENHO vừa publish.
- Nếu đã có thay đổi mới từ người dùng/OTA/PMS, không rollback tự động; chuyển `MANUAL_REVIEW`.

## 7.4. Incident workflow

### P1 Critical

- Nguy cơ overbooking, missing reservation, unauthorized write, inventory âm hoặc OTA mở bán khi PMS = 0.
- Alert mobile mục tiêu dưới 1 phút trong 95% bài test.
- Owner acknowledge mục tiêu 10 phút.
- Contain mục tiêu 30 phút.
- Resolve hoặc có manual mitigation trong 60 phút.

### P2 High

- Rate/restriction/mapping mismatch chưa có booking risk tức thời.
- Acknowledge trong 4 giờ; xử lý trong 24 giờ.

### P3/P4

- Listing inconsistency, dữ liệu thiếu, gợi ý tối ưu.
- Xử lý theo Weekly Review hoặc backlog.

---

# 8. DASHBOARD VÀ AI AGENT CENTER

## 8.1. Menu

```text
VENHO OS
├── Overview
├── Hotel Operations
├── Marketing
├── Advertising
├── OTA & Revenue
│   ├── OTA Overview
│   ├── Booking Monitor
│   ├── Calendar & Inventory
│   ├── Pricing Center
│   ├── Competitor Watch
│   ├── Promotions
│   ├── Reviews & Listing Health
│   ├── Alerts
│   └── Settings & Logs
└── AI Agent Center
    └── OTA Agent
```

## 8.2. OTA Overview

- Occupancy hôm nay và 7/14/30 ngày.
- Phòng còn bán tối nay.
- Booking mới/sửa/hủy 24 giờ.
- ADR, RevPAR, Net RevPAR trên OTA.
- Doanh thu, hoa hồng và promotion cost theo OTA.
- Pickup, sync health và data freshness.
- Pending approval, expiring TTL, stale recommendation.
- P1/P2 alert và rate consistency mismatch.

## 8.3. Pricing Approval Card

- Stay date, room type, OTA scope.
- Current, reference, recommended và effective net rate.
- Tiền và phần trăm chênh lệch.
- Occupancy: phần trăm + số phòng.
- Pickup, comp median, data age và confidence.
- Factor breakdown và explanation.
- TTL và stale conditions.
- Approve, Modify, Reject; bulk action chỉ khi mọi item hợp lệ.
- Xác nhận hai bước cho action lớn hoặc nhiều ngày.

## 8.4. OTA Agent Card

- Mode hiện tại.
- Last run, duration, result, rule version, connector version.
- Data freshness và sync latency.
- Queue: recommendations, actions, retries, alerts.
- Model usage/cost của ngày.
- Run Now, Read Only, Pause, Resume và Emergency Stop.
- Re-authentication hoặc confirmation hai bước cho Emergency Stop và bulk write.

## 8.5. DoD theo tier

- Tier 1–2: tác vụ thường nhật có thể hoàn thành trong Dashboard; OTA/Skyhotel chỉ mở khi audit sâu hoặc incident.
- Tier 3: Dashboard tạo checklist/action package; Owner vẫn mở Skyhotel/OTA để áp và verify thủ công.

---

# 9. BẢO MẬT, BACKUP VÀ QUẢN TRỊ

## 9.1. Security

- Secrets trong environment/secret manager; không lưu trong Markdown/JSON/source.
- 2FA cho Agoda, Booking.com và Skyhotel.
- Tài khoản kỹ thuật riêng nếu được hỗ trợ.
- Least privilege và phân quyền read/write.
- Dashboard có authentication, session expiry và audit actor.
- Không lưu hoặc gửi dữ liệu thẻ vào VENHO OS/LLM.

## 9.2. Backup và recovery

- SQLite/WAL backup incremental ít nhất mỗi giờ.
- Full encrypted backup hằng ngày.
- Config/rules versioned trong Git hoặc kho file có version history.
- RPO mục tiêu: 1 giờ cho runtime state; audit/action quan trọng được flush ngay.
- RTO mục tiêu: 4 giờ cho Dashboard/Agent; manual OTA/PMS SOP dùng ngay khi hệ thống ngừng.
- Restore drill tối thiểu mỗi quý và trước Phase 3 go-live.

## 9.3. Change governance

Mọi thay đổi mapping, pricing rule, pre-approved rule hoặc connector phải có:

- Version và changelog.
- Owner approval.
- Golden test pass.
- Effective date.
- Rollback version.
- Không deploy production trong freeze window.

## 9.4. Cost control

- Sync/reconciliation không gọi LLM.
- Daily Brief và explanation có cache, structured output và token budget.
- Cảnh báo khi model cost vượt ngân sách ngày/tháng do Owner đặt.
- Provider có thể thay đổi giữa OpenAI và Claude mà không sửa business rules.

---

# 10. KIỂM THỬ VÀ NGHIỆM THU

## 10.1. Test layers

1. Unit test cho inventory, pricing, TTL, confidence và state machine.
2. Schema/contract test cho từng connector.
3. Golden test tối thiểu 40 kịch bản trên mock.
4. Integration test với dữ liệu anonymized.
5. Shadow mode tối thiểu 14 ngày cho pricing.
6. Canary write-back trước khi mở rộng.
7. Restore drill, emergency stop drill và incident drill.

## 10.2. Golden scenarios tối thiểu

- Booking mới, sửa ngày, đổi room type, hủy và no-show.
- Duplicate event, missing event, event out-of-order.
- Inventory âm, room block, mapping sai.
- Rate = 0, vượt floor/ceiling, net rate dưới ngưỡng.
- Stale competitor data, stale recommendation, TTL expired.
- Promotion stacking.
- Connector timeout, retry, partial failure.
- Approval sau khi context thay đổi.
- Kill/emergency stop giữa action.
- Concurrent manual change và rollback conflict.
- Backup restore.

## 10.3. Canary write-back

1. Dry-run ghi proposal nhưng không gửi hệ thống.
2. Một OTA + một room type + một stay date.
3. Tối thiểu 10 action thành công và verify đúng.
4. Mở rộng sang 3–7 ngày.
5. Tối thiểu 20 action liên tiếp đúng, không stale write, không unauthorized action.
6. Mới mở rộng toàn bộ phạm vi đã duyệt.

## 10.4. Booking test thật

- Owner duyệt ngân sách và ngày test.
- Dùng ngày xa, một phòng, rate kiểm soát.
- Ghi rõ phương án hủy, phí có thể phát sinh và đối soát.
- Kiểm tra Booking ID, modified/cancelled event, inventory release và audit trail.

---

# 11. KPI VÀ SLO

| Chỉ số | Mục tiêu |
|---|---|
| Overbooking do lỗi VENHO OS | 0 |
| Reservation event bị mất vĩnh viễn | 0 |
| Late sync event | <1% theo SLA tier |
| P1 alert delivery | <1 phút trong ≥95% test/production events có kênh khả dụng |
| P1 mitigation | ≤60 phút |
| Unhandled critical run failure | 0 tồn đọng |
| Recommendation đủ trường | 100% |
| Stale/expired recommendation bị apply | 0 |
| Unauthorized write | 0 |
| Action log đầy đủ | 100% |
| Rule/config change không qua test/approval | 0 |
| Manual OTA time reduction | ≥60% so với baseline Phase 0 |
| Write action success sau canary | ≥99%; mọi failure phải verify và có trạng thái rõ |
| Backup restore drill | Pass trước Phase 3 và mỗi quý |

Occupancy, ADR, RevPAR và Net RevPAR chỉ đặt target tăng sau 60–90 ngày baseline đủ sạch.

---

# 12. KẾ HOẠCH PHÁT TRIỂN THEO GIAI ĐOẠN

## Tổng lịch

- **Build chủ động:** khoảng 18–22 tuần.
- **Elapsed calendar:** khoảng 24–30 tuần do shadow mode, nghiệm thu 4 tuần và freeze window.
- Mốc dự kiến nếu bắt đầu tháng 8/2026: hoàn thành Module v1.0 trong khoảng tháng 2–3/2027.
- Mỗi phase là một Step File theo L4 Execution OS, có Input, Output, Task, DoD, Risks và Out of Scope.

---

## PHASE 0 — AUDIT, LOCK KIẾN TRÚC VÀ NỀN MÓNG

**Thời lượng:** 2 tuần — dự kiến tháng 8/2026  
**Mục tiêu:** xác minh hệ thống thật và khóa các quyết định nền tảng.

### Công việc

**Nghiệp vụ và tích hợp**

- Audit Agoda, Booking.com và Skyhotel bằng tài khoản thực tế.
- Xác nhận Channel Manager, cost, room/rate mapping, modified/cancelled behavior.
- Yêu cầu Skyhotel xác nhận API/Webhook/export và quyền read/write bằng văn bản.
- Đo baseline giờ/tuần quản lý OTA.
- Chốt room types, rate plans, physical inventory và room blocks.
- Chốt comp set ban đầu.

**Kiến trúc và Agent**

- Chốt Gate G0 và runtime host.
- Tạo provider-agnostic Agent skeleton.
- Tạo operational store, Internal API skeleton và audit pipeline.
- Định nghĩa schemas, idempotency, state machines và tool contracts.
- Tạo mock providers theo số room type thực tế hoặc generic trước khi mapping xong.

**Dashboard**

- Khóa navigation, OTA Overview wireframe và OTA Agent Card wireframe.
- Chốt notification channel mobile.

**Governance**

- Chốt Rate Consistency Policy draft.
- Chốt Minimum Acceptable Net Rate draft.
- Chốt freeze window, backup operator và emergency contact.

### Deliverables

- `00_OTA_MASTER_INDEX.md`
- `01_OTA_MODULE_PLAN_v1.3.md`
- `02_OTA_OPERATING_RULES.md`
- `04_OTA_ROOM_MAPPING.json`
- `05_OTA_RATE_PLAN_MAPPING.json`
- `13_OTA_AGENT_CONTROL.json`
- Connector capability report.
- G0 Decision Record.
- Baseline report.

### Definition of Done

- G0 được Owner ký duyệt.
- Mapping và source-of-record matrix được xác minh.
- Agent skeleton chạy end-to-end trên mock, có run log và emergency stop test.
- Database backup/restore thử thành công.
- Không còn Open Item chặn Phase 1.

### Out of Scope

- Pricing recommendation production.
- Write-back.
- Auto action.

---

## PHASE 1 — READ-ONLY OTA CONTROL CENTER

**Thời lượng:** 4 tuần — dự kiến tháng 9/2026  
**Mục tiêu:** nhìn thấy dữ liệu OTA/Skyhotel, reconcile và cảnh báo mà không thay đổi hệ thống.

### Công việc

**Connector và data**

- Đọc booking, inventory, rate và sync status theo tier G0.
- Chuẩn hóa, dedupe, event versioning và data freshness.
- Booking/inventory reconciliation.
- Pipe booking chuẩn hóa sang schema dùng chung với M5.

**Agent**

- Operations Skill read-only.
- Sync Control Skill read-only.
- Daily Brief bằng structured template/LLM fallback.
- P1/P2 alert.

**Dashboard**

- Booking Monitor.
- Calendar & Inventory 30/60/90 ngày.
- Sync status, Alerts và data freshness badge.
- OTA Agent Card hiển thị mode, run, error và version.

**QA**

- Chạy song song với quy trình thủ công tối thiểu 7 ngày.
- Giả lập missing booking, duplicate event, inventory mismatch và connector outage.

### Definition of Done

- 7 ngày liên tục không có unhandled critical error hoặc mất event.
- P1 giả lập đến điện thoại dưới 1 phút trong ≥95% lần test.
- Reconciliation giải thích được mọi mismatch.
- Owner kiểm tra OTA hằng ngày từ Dashboard; thao tác còn lại được ghi rõ theo tier.

### Gate G1

Chỉ sang Phase 2 khi dữ liệu booking/inventory đủ tin cậy và mapping không còn lỗi chưa xử lý.

---

## PHASE 2 — REVENUE RECOMMENDATION VÀ OWNER APPROVAL

**Thời lượng:** 5 tuần, gồm 2 tuần shadow mode — dự kiến tháng 10 đến giữa tháng 11/2026  
**Mục tiêu:** tạo recommendation chất lượng cao nhưng chưa tự write-back.

### Công việc

**Pricing**

- Khóa Base Rate, Season, DOW, Event và Product Factor.
- Khóa floor, ceiling, minimum net rate và promotion cost.
- Xây Reference Rate + bounded Demand Adjustment.
- Xây confidence, TTL và stale invalidation.

**Competitor**

- Comp set, comparability score, snapshot schema và freshness policy.
- Nhập thủ công/extranet-first trong MVP; không scraping quy mô lớn.

**Agent**

- Revenue Skill deterministic.
- Explanation layer với structured output và fallback.
- Recommendation state machine.

**Dashboard**

- Pricing Center và Approval Card.
- Approve/Modify/Reject qua Approval Service.
- TTL countdown, stale status và bulk review có guardrail.
- Weekly Revenue Review.

**Shadow mode**

- Agent đề xuất song song với quyết định thực tế của Owner trong 14 ngày.
- Ghi độ lệch, lý do Owner sửa/từ chối và chất lượng confidence.

### Definition of Done

- 100% recommendation có đủ trường bắt buộc, context hash, TTL và rule version.
- Không recommendation expired/stale nào có thể chuyển sang execute.
- 30 ngày tới có insight hoặc recommendation hợp lệ; low-confidence item không giả vờ đưa ra hành động chắc chắn.
- Shadow mode 14 ngày hoàn tất và Owner phê duyệt rule set v1.

### Gate G2

Owner quyết định:

- Dừng ở Operational MVP và vận hành manual apply; hoặc
- Cho phép xây Controlled Write-back Phase 3.

---

## PHASE 3 — CONTROLLED WRITE-BACK

**Thời lượng:** 4–5 tuần + freeze window nếu có — dự kiến cuối tháng 11/2026 đến tháng 1/2027  
**Mục tiêu:** action được duyệt có thể áp dụng an toàn, verify và dừng khẩn cấp.

### Điều kiện vào

- G2 được Owner duyệt.
- Phase 2 ổn định tối thiểu 14 ngày.
- Test environment hoặc phương án live test an toàn đã chốt.
- Không nằm trong production freeze window.
- Restore drill đã pass.

### Công việc

- Action Executor và Approval Service.
- Revalidation trước write.
- Idempotent apply rate/restriction.
- Verify theo tier.
- Conditional rollback.
- READ_ONLY và EMERGENCY_STOP hai tầng.
- Dashboard hiển thị action progress, verification và manual review.
- Tier 3: tạo guided action checklist, không giả lập tự động hóa không tồn tại.

### Canary rollout

- Dry-run.
- Một OTA, một room type, một stay date.
- 10 action thành công.
- Mở rộng 3–7 ngày.
- 20 action liên tiếp đúng và verify hoàn chỉnh.

### Definition of Done

- Pass 100% golden tests bắt buộc.
- Không unauthorized write, stale write hoặc duplicate write trong canary.
- Tối thiểu 20 action canary liên tiếp đúng.
- Emergency stop và conditional rollback drill thành công.
- Mọi action có before/after, actor, approval, rule version và verification.

### Gate G3

Owner phê duyệt phạm vi action được phép ở production và pre-approved rule candidate cho Phase 4.

---

## PHASE 4 — SAFE AUTOMATION VÀ INVENTORY MONITORING

**Thời lượng:** 6 tuần, gồm 4 tuần nghiệm thu — dự kiến tháng 2–3/2027  
**Mục tiêu:** giảm thao tác lặp lại nhưng không mở rộng quyền Agent quá mức.

### Công việc

- Scheduler và event trigger production.
- Continuous reconciliation theo SLA tier.
- Retry sync chính thức.
- Pre-approved auto-close emergency rule.
- Alert escalation và incident dashboard.
- Action allowlist runtime.
- Automated audit export và backup monitoring.

### Không thực hiện trong Phase 4

- Auto-reopen.
- Dynamic pricing không approval.
- Tự bật promotion.
- Auto change policy/mapping.

### Definition of Done

- 4 tuần nghiệm thu không có action ngoài allowlist.
- Không inventory mismatch vượt SLA mà không tạo alert.
- Mọi auto action có notification, verify và immutable audit.
- Thời gian OTA thủ công giảm tối thiểu 60% so với baseline.
- Owner vận hành quy trình thường nhật trong Mother Dashboard theo đúng giới hạn tier.

### Module v1.0 Complete

Module v1.0 được khóa khi Gate G4 được Owner ký duyệt.

---

## PHASE 5 — LEARNING & OPTIMIZATION

**Thời điểm:** sau tối thiểu 60–90 ngày dữ liệu production sạch  
**Thuộc phiên bản:** Module v1.1+

### Mục tiêu

- Đánh giá forecast vs actual.
- Học từ Approve/Modify/Reject/Expired/Stale.
- Điều chỉnh weight có kiểm soát.
- Đánh giá promotion và Net RevPAR.
- Xem xét auto-reopen hoặc mở rộng action chỉ khi có bằng chứng an toàn.

### Nguyên tắc

- Không để model tự học và tự deploy rule.
- Mọi rule mới phải qua offline evaluation, Owner Approval và canary.
- Không mở rộng multi-property hoặc OTA mới nếu chưa có nhu cầu thực tế.

---

# 13. CẤU TRÚC FILE VÀ THÀNH PHẦN TRIỂN KHAI

```text
VENHO_OS/
└── MODULES/
    └── OTA_01/
        ├── 00_OTA_MASTER_INDEX.md
        ├── 01_OTA_MODULE_PLAN_v1.3.md
        ├── 02_OTA_OPERATING_RULES.md
        ├── 03_OTA_APPROVAL_POLICY.md
        ├── 04_OTA_ROOM_MAPPING.json
        ├── 05_OTA_RATE_PLAN_MAPPING.json
        ├── 06_OTA_COMPETITOR_SET.json
        ├── 07_OTA_PRICING_RULES.json
        ├── 08_OTA_SEASON_CALENDAR.json
        ├── 09_OTA_ALERT_RULES.json
        ├── 10_OTA_DASHBOARD_SPEC.md
        ├── 11_OTA_EVENT_CALENDAR.json
        ├── 12_OTA_PREAPPROVED_RULES.json
        ├── 13_OTA_AGENT_CONTROL.json
        ├── 14_OTA_SOURCE_OF_RECORD_MATRIX.md
        ├── 15_OTA_CONNECTOR_CAPABILITY_REPORT.md
        ├── 16_OTA_INCIDENT_SOP.md
        ├── 17_OTA_TEST_PLAN.md
        ├── 18_OTA_BACKUP_RECOVERY_PLAN.md
        ├── CONFIG_HISTORY/
        ├── EXPORTS/
        │   ├── AUDIT/
        │   ├── BOOKINGS/
        │   ├── INVENTORY/
        │   ├── RATES/
        │   ├── COMPETITORS/
        │   └── REPORTS/
        └── TEMPLATES/
            ├── DAILY_OTA_BRIEF.md
            ├── WEEKLY_REVENUE_REVIEW.md
            └── INCIDENT_REPORT.md
```

Runtime database và secrets không đặt trong thư mục tài liệu đồng bộ công khai.

---

# 14. OPEN ITEMS VÀ THỜI HẠN KHÓA

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

# 15. QUYẾT ĐỊNH CẦN LOCK

1. Skyhotel là hệ thống chính cho inventory, room status và booking nội bộ; OTA là nguồn xác minh trạng thái publish.
2. Agoda và Booking.com không vận hành bằng hai inventory độc lập.
3. Operational runtime không dùng file chung làm cơ chế transaction giữa Agent và Dashboard.
4. Business rules deterministic; LLM chỉ giải thích và không chặn critical operations.
5. Mọi write phải có approval hoặc nằm trong pre-approved allowlist.
6. Mọi approval phải được revalidate trước write.
7. Recommendation expired hoặc stale không bao giờ được apply.
8. Auto-reopen không thuộc Module v1.0.
9. Không dùng RPA làm lõi nếu có CM/API/export chính thức.
10. Không chạy theo giá thấp nhất; tối ưu effective net revenue.
11. Mọi action có idempotency, audit, verify và conditional rollback.
12. Module chỉ phục vụ Ven Hồ Hotel, Agoda và Booking.com trong giai đoạn hiện tại.
13. Không triển khai write production trong freeze window.
14. Không mở rộng enterprise/multi-property khi chưa có nhu cầu thực tế.
15. Phase 5 không được bắt đầu trước khi đủ 60–90 ngày dữ liệu sạch.

---

# 16. NGUỒN CHÍNH THỨC ĐÃ KIỂM TRA LẠI

- Booking.com Connectivity APIs: tài liệu chính thức xác định API dành cho Connectivity Partners để quản lý availability, reservations và prices.
- Booking.com Connectivity Portal: tại thời điểm rà soát đang thông báo tạm dừng tích hợp connectivity provider mới; OTA-01 không nên xây direct Booking.com connectivity trong MVP.
- Agoda Partner Hub: hướng dẫn chính thức cho phép property chọn Channel Manager và yêu cầu mapping property ID, room type ID và rate plan ID; Agoda cũng lưu ý booking có thể gửi email khi channel manager gặp sự cố.
- Skyhotel Changelog: có nội dung về Channel Manager và xử lý booking Modified/Amended; năng lực API/Webhook và quyền tài khoản cụ thể vẫn phải xác minh trực tiếp tại Phase 0.

**Nguyên tắc:** Không coi một chức năng tích hợp là khả dụng chỉ dựa trên website công khai; phải có bằng chứng từ tài khoản thật, log thực tế hoặc xác nhận bằng văn bản của nhà cung cấp.

---

# 17. KẾT LUẬN

OTA-01 được triển khai theo hướng an toàn và thực dụng cho khách sạn 12 phòng:

- Phase 0 khóa kết nối và kiến trúc thật.
- Phase 1 tạo Control Center read-only.
- Phase 2 tạo Operational MVP với recommendation và approval.
- Phase 3 bổ sung controlled write-back bằng canary.
- Phase 4 chỉ tự động hóa các hành động an toàn đã được phê duyệt trước.
- Phase 5 mới dùng dữ liệu thực tế để tối ưu.

Bản v1.3 loại bỏ các điểm có thể gây overbooking, stale write, xung đột file, rollback sai, Agent vượt quyền và timeline không thực tế. Đây là bản kế hoạch phát triển theo giai đoạn dùng làm tài liệu triển khai chính thức cho OTA-01.

**END OF DOCUMENT — VENHO OS OTA-01 PHASED DEVELOPMENT PLAN v1.3 FINAL**
