# VENHO OS — OTA-01 G0-C LEAN
## TECHNICAL IMPLEMENTATION SPECIFICATION & PHASED BUILD PLAN

**Tên tài liệu:** G0-C Lean OTA Agent — triển khai không thuê thêm Channel Manager  
**Mã module:** OTA-01 / G0-C  
**Phiên bản:** v1.0 Implementation Ready  
**Trạng thái:** Sẵn sàng chuyển giao cho VSCode/AI Coding Agent  
**Phạm vi:** Ven Hồ Hotel — 12 phòng — Skyhotel.vn, Agoda, Booking.com  
**Mô hình vận hành:** Solo Founder / Human-in-the-loop  
**Nguồn quản lý phòng chính:** Skyhotel.vn  
**Quyết định kiến trúc:** Không thuê thêm Channel Manager trong giai đoạn hiện tại  
**Mục tiêu:** Tận dụng Agent hiện có đang đăng nhập Skyhotel bằng username/password, giảm chi phí định kỳ, giảm thao tác thủ công và kiểm soát rủi ro overbooking.

---

# 0. QUYẾT ĐỊNH ĐÃ LOCK

## 0.1. Quyết định G0-C

VENHO OS triển khai OTA-01 theo nhánh **G0-C — Structured Data + Guided Manual Action**, không phụ thuộc Channel Manager trả phí.

Kiến trúc vận hành:

```text
Agoda / Booking.com
        │
        ├── Email booking mới / sửa / hủy
        ├── Extranet và dữ liệu giá công khai được phép sử dụng
        │
        ▼
OTA Email Ingestor + Competitor Snapshot
        │
        ▼
VENHO OTA Agent
        ├── Skyhotel Collector bằng browser automation
        ├── Booking Reconciliation Engine
        ├── Inventory Risk Engine
        ├── Revenue Recommendation Engine
        ├── Alert & Daily Brief
        └── Action Package Generator
        │
        ▼
Mother Dashboard — Owner Approval
        │
        ├── Owner thực hiện thủ công theo checklist
        └── Guided RPA điền sẵn, Owner xác nhận bước cuối
        │
        ▼
Skyhotel / Agoda / Booking.com
        │
        ▼
Agent đọc lại và xác minh
```

## 0.2. Các nguyên tắc bắt buộc

1. **Skyhotel là nguồn chính cho lịch phòng nội bộ, booking đã nhập, phòng khóa và doanh thu.**
2. **Agoda và Booking.com là nguồn gốc của booking OTA và trạng thái bán trên từng kênh.**
3. VENHO OS không giả định Skyhotel tự đồng bộ với hai OTA khi không có Channel Manager.
4. Agent không tự thay đổi giá, tồn phòng hoặc chính sách khi chưa có Owner Approval.
5. Không auto-reopen phòng trong Module v1.0.
6. Không lưu username/password trong source code, Markdown, JSON hoặc Git.
7. Browser automation chỉ là lớp thao tác có kiểm soát, không được coi là API chính thức.
8. Mọi hành động phải có log, idempotency key, before/after state và bước verify.
9. Khi dữ liệu không đủ tin cậy, hệ thống chuyển sang `MANUAL_REVIEW`, không tự suy đoán.
10. Rule Engine tính số liệu; AI chỉ giải thích, tóm tắt và hỗ trợ ra quyết định.

---

# 1. MỤC TIÊU KINH DOANH

## 1.1. Mục tiêu chính

- Không thuê thêm Channel Manager trong giai đoạn hiện tại.
- Tái sử dụng Agent hiện có đang đăng nhập Skyhotel để lấy báo cáo doanh thu.
- Theo dõi booking Agoda và Booking.com gần thời gian thực qua email.
- Phát hiện booking chưa được nhập vào Skyhotel.
- Phát hiện nguy cơ bán trùng hoặc inventory không được giảm kịp thời.
- Tạo đề xuất giá theo ngày, mùa, pickup, công suất và đối thủ.
- Owner duyệt trong Mother Dashboard.
- Tạo checklist thao tác chính xác hoặc Guided RPA để giảm thời gian nhập liệu.
- Xác minh lại sau khi Owner áp dụng thay đổi.
- Giảm tối thiểu 60% thời gian quản lý OTA lặp lại so với baseline.

## 1.2. Mục tiêu an toàn

- Không có hành động ghi ngoài phạm vi được phê duyệt.
- Không có đề xuất hết hạn hoặc stale được áp dụng.
- Không có booking OTA bị bỏ sót vĩnh viễn.
- Không lưu dữ liệu thẻ hoặc thông tin thanh toán nhạy cảm.
- Có Emergency Stop để tắt toàn bộ thao tác ghi.
- Có manual fallback khi Agent, trình duyệt hoặc mạng gặp lỗi.

---

# 2. PHẠM VI VÀ NGOÀI PHẠM VI

## 2.1. Trong phạm vi G0-C v1.0

- Đăng nhập Skyhotel bằng browser automation để đọc:
  - Doanh thu ngày.
  - Booking.
  - Check-in/check-out.
  - Lịch phòng.
  - Room block/phòng bảo trì.
  - Tồn phòng.
  - Giá đang lưu trong Skyhotel nếu giao diện cho phép đọc.
- Nhận email Agoda/Booking.com:
  - Booking mới.
  - Booking sửa đổi.
  - Booking hủy.
- Chuẩn hóa và đối chiếu booking OTA với Skyhotel.
- Cảnh báo booking thiếu, trùng, sai ngày, sai room type hoặc chưa giảm inventory.
- Tạo Daily OTA Brief.
- Tạo Pricing Recommendation 30 ngày tới.
- Quản lý comp set và competitor snapshot có cấu trúc.
- Owner Approval trong Mother Dashboard.
- Tạo Action Package cho:
  - Nhập booking vào Skyhotel.
  - Sửa booking.
  - Ghi nhận booking hủy.
  - Thay đổi giá Agoda/Booking.com.
  - Đóng bán khi inventory nguy hiểm.
- Guided RPA điền sẵn dữ liệu nhưng mặc định không bấm bước lưu cuối cùng.
- Đọc lại dữ liệu và verify sau thao tác.

## 2.2. Ngoài phạm vi G0-C v1.0

- Đồng bộ hai chiều thời gian thực tương đương Channel Manager.
- Auto-reopen inventory.
- Dynamic pricing hoàn toàn tự động.
- Tự tham gia promotion.
- Tự thay đổi chính sách hủy.
- Tự hủy hoặc từ chối booking.
- API trực tiếp Booking.com/Agoda dưới tư cách Connectivity Partner.
- Scraping quy mô lớn.
- Multi-property.
- Thêm OTA thứ ba.
- Lưu hoặc xử lý dữ liệu thẻ thanh toán.
- Thay thế hoàn toàn Skyhotel.

---

# 3. KIẾN TRÚC KỸ THUẬT

## 3.1. Stack triển khai mặc định

Để tiết kiệm chi phí và phù hợp hệ thống hiện tại:

- **Runtime host:** Mac mini hiện có, chạy liên tục.
- **Ngôn ngữ:** TypeScript.
- **Node.js:** 20 trở lên.
- **Browser automation:** Playwright.
- **Internal API:** Fastify.
- **Operational database:** SQLite ở chế độ WAL.
- **Schema validation:** Zod.
- **Scheduler:** node-cron hoặc scheduler nội bộ.
- **Dashboard:** Next.js hiện có của Mother Dashboard.
- **Testing:** Vitest + Playwright Test.
- **Logging:** Pino + JSONL audit export.
- **Secrets:** macOS Keychain; environment variable chỉ là fallback.
- **AI provider:** OpenAI hoặc Claude qua provider adapter.
- **Email source:** Gmail API polling; Make webhook là tùy chọn phụ nếu đã có sẵn.

## 3.2. Lý do chọn local-first

- Không phát sinh thêm phí VPS hoặc database ở MVP.
- Tận dụng Mac mini đang có.
- SQLite đủ cho một khách sạn 12 phòng và một Owner.
- Browser automation chạy ổn định hơn trên một máy cố định có persistent profile.
- Dữ liệu booking không cần đưa lên dịch vụ bên ngoài nếu chưa cần.
- Có thể nâng lên VPS/PostgreSQL sau khi có nhu cầu thật.

## 3.3. Topology

```text
┌─────────────────────────────────────────────────────────────┐
│ Mac mini                                                    │
│                                                             │
│  ┌────────────────────┐     ┌─────────────────────────────┐ │
│  │ Worker / Scheduler │────▶│ Skyhotel Playwright Adapter │ │
│  └────────────────────┘     └─────────────────────────────┘ │
│             │                                               │
│             ├──────────────▶ Gmail OTA Email Ingestor       │
│             │                                               │
│             ├──────────────▶ Reconciliation Engine          │
│             ├──────────────▶ Pricing Engine                 │
│             ├──────────────▶ Alert Service                  │
│             └──────────────▶ Action Package Generator       │
│                             │                               │
│                             ▼                               │
│                      SQLite / WAL                           │
│                             │                               │
│                             ▼                               │
│                       Fastify API                           │
│                             │                               │
│                             ▼                               │
│                  Next.js Mother Dashboard                   │
└─────────────────────────────────────────────────────────────┘
```

## 3.4. Nguyên tắc giao tiếp

- Dashboard không đọc/ghi trực tiếp SQLite.
- Dashboard gọi Internal API.
- Worker không gọi trực tiếp component UI.
- Business rules nằm trong `packages/domain`, không nằm trong browser selectors.
- Playwright adapter chỉ chịu trách nhiệm đọc hoặc điền dữ liệu giao diện.
- Mọi dữ liệu từ bên ngoài phải được validate bằng Zod trước khi lưu.
- Mọi write action phải kiểm tra Agent Mode ngay trước khi thực hiện.

---

# 4. CẤU TRÚC REPOSITORY

```text
venho-os/
├── apps/
│   ├── dashboard/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/api-client/
│   ├── api/
│   │   ├── src/routes/
│   │   ├── src/services/
│   │   ├── src/middleware/
│   │   └── src/server.ts
│   └── worker/
│       ├── src/jobs/
│       ├── src/scheduler/
│       ├── src/agent/
│       └── src/index.ts
│
├── packages/
│   ├── domain/
│   │   ├── booking/
│   │   ├── inventory/
│   │   ├── pricing/
│   │   ├── approval/
│   │   ├── action/
│   │   ├── alert/
│   │   └── agent-control/
│   ├── db/
│   │   ├── migrations/
│   │   ├── schema/
│   │   ├── repositories/
│   │   └── sqlite.ts
│   ├── connectors/
│   │   ├── skyhotel/
│   │   │   ├── pages/
│   │   │   ├── selectors/
│   │   │   ├── parsers/
│   │   │   ├── collector.ts
│   │   │   └── guided-writer.ts
│   │   ├── gmail/
│   │   │   ├── oauth.ts
│   │   │   ├── watcher.ts
│   │   │   ├── agoda-parser.ts
│   │   │   └── booking-parser.ts
│   │   └── notifications/
│   ├── reconciliation/
│   ├── pricing-engine/
│   ├── competitor-intelligence/
│   ├── reporting/
│   ├── audit/
│   └── ai-provider/
│
├── config/
│   └── ota/
│       ├── room-mapping.json
│       ├── rate-plan-mapping.json
│       ├── pricing-rules.json
│       ├── season-calendar.json
│       ├── event-calendar.json
│       ├── competitor-set.json
│       ├── alert-rules.json
│       ├── agent-control.json
│       └── selector-profile.json
│
├── data/
│   ├── ota.sqlite
│   ├── backups/
│   ├── audit-export/
│   ├── screenshots/
│   └── failed-pages/
│
├── tests/
│   ├── fixtures/
│   │   ├── skyhotel-html/
│   │   ├── agoda-emails/
│   │   └── booking-emails/
│   ├── golden/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   ├── setup-keychain.sh
│   ├── backup-db.sh
│   ├── restore-db.sh
│   ├── run-migrations.ts
│   └── health-check.ts
│
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

---

# 5. CẤU HÌNH VÀ FEATURE FLAGS

## 5.1. `.env.example`

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

## 5.2. Feature flags

### `SKYHOTEL_WRITE_MODE`

- `disabled`: chỉ đọc.
- `fill_only`: mở form và điền sẵn, Owner tự bấm Save.
- `confirm_save`: Owner xác nhận trong Dashboard, Agent bấm Save một lần.
- `preapproved`: chỉ dùng ở phiên bản sau khi có nghiệm thu riêng.

### `OTA_WRITE_MODE`

- `disabled`: chỉ tạo checklist.
- `guided`: mở extranet, điều hướng và điền sẵn.
- `confirm_publish`: Owner xác nhận hai bước trước nút Publish.
- `preapproved`: ngoài phạm vi G0-C v1.0.

### `AGENT_DEFAULT_MODE`

- `RUNNING`
- `READ_ONLY`
- `PAUSED`
- `EMERGENCY_STOP`

## 5.3. Mẫu `agent-control.json`

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

## 6.1. Mục tiêu

Tái sử dụng logic Agent hiện tại đang đăng nhập Skyhotel để báo cáo doanh thu, sau đó chuẩn hóa thành connector có cấu trúc.

Connector phải cung cấp:

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

## 6.2. Login

- Credential lấy từ macOS Keychain.
- Không ghi credential vào log.
- Dùng persistent browser profile để giữ session.
- Khi session hết hạn:
  1. thử login lại một lần;
  2. nếu gặp 2FA/Captcha, chuyển `AUTH_REQUIRED`;
  3. gửi alert cho Owner;
  4. không retry vô hạn.
- Không chạy hai phiên login song song.
- Dùng distributed/local lock để tránh hai job cùng điều khiển một browser profile.

## 6.3. Page Object Model

Không đặt selector trực tiếp trong business logic.

```text
SkyhotelLoginPage
SkyhotelDashboardPage
SkyhotelRevenueReportPage
SkyhotelBookingCalendarPage
SkyhotelBookingDetailPage
SkyhotelNewBookingPage
SkyhotelRoomStatusPage
```

Mỗi Page Object phải:

- Dùng selector theo role, label, text ổn định trước.
- Có fallback selector.
- Có `assertPageReady()`.
- Có timeout riêng.
- Chụp screenshot khi lỗi.
- Lưu HTML snapshot đã loại PII khi parser lỗi.
- Trả về DTO đã chuẩn hóa, không trả DOM element ra ngoài.

## 6.4. Selector profile

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

Selector profile được versioned. Mọi thay đổi selector phải chạy regression test trên HTML fixture trước khi deploy.

## 6.5. Dữ liệu thu thập tối thiểu

### DailyRevenueSnapshot

- business_date
- room_revenue
- other_revenue nếu có
- total_revenue
- occupied_rooms
- available_rooms
- check_ins
- check_outs
- cash/card/transfer nếu giao diện có
- collected_at
- source_page
- source_hash

### BookingSnapshot

- skyhotel_booking_id
- ota_name nếu có
- ota_booking_id nếu có
- guest_ref_masked
- check_in
- check_out
- room_type
- room_number nếu đã phân
- total_amount
- status
- created_at nếu có
- modified_at nếu có
- collected_at
- source_hash

### InventorySnapshot

- stay_date
- room_type
- physical_sellable
- sold
- blocked
- internal_hold
- available
- collected_at

## 6.6. Lịch chạy

- 06:00: full booking + inventory + doanh thu ngày trước.
- 12:00: booking + inventory.
- 18:00: booking + inventory.
- 22:00: booking + inventory + doanh thu tạm tính.
- Sau mỗi email OTA quan trọng: chạy targeted check theo booking ID/ngày lưu trú.
- Owner có nút `Run Now`.

---

# 7. OTA EMAIL INGESTOR

## 7.1. Mục tiêu

Email OTA là tín hiệu booking gần thời gian thực trong mô hình không có Channel Manager.

Nguồn:

- Agoda booking confirmation.
- Agoda modification/cancellation.
- Booking.com reservation confirmation.
- Booking.com modification/cancellation.

## 7.2. Quy trình ingest

```text
Gmail API
  → lọc sender/subject
  → lấy message_id + thread_id
  → xác minh sender allowlist
  → parse HTML/text
  → validate required fields
  → tạo source_event
  → dedupe
  → reconcile với Skyhotel
  → alert/action package
```

## 7.3. Sender allowlist

Cấu hình theo tài khoản thực tế trong Phase 0. Không hard-code địa chỉ email giả định trong business logic.

Mỗi rule gồm:

- ota
- sender_pattern
- subject_pattern
- event_type
- parser_version
- enabled

## 7.4. Trường cần parse

- OTA.
- OTA booking ID.
- Event type: `NEW`, `MODIFIED`, `CANCELLED`.
- Event timestamp.
- Booking creation/update timestamp nếu có.
- Check-in/check-out.
- Số đêm.
- Room type OTA.
- Số phòng.
- Số khách.
- Giá tổng.
- Tiền tệ.
- Chính sách hủy nếu có.
- Guest reference đã mask.
- Raw message hash.

## 7.5. Parser confidence

```text
Parser Confidence =
Required Fields Completeness
+ Sender Authenticity
+ Subject Pattern Match
+ OTA Booking ID Validity
+ Date Consistency
+ Room Mapping Match
```

Xử lý:

- `>= 0.98`: được đưa vào reconciliation tự động.
- `0.80–0.979`: lưu event, tạo `MANUAL_REVIEW`.
- `< 0.80`: không tạo booking action; tạo alert parser failure.

## 7.6. Dedupe

Dedupe key ưu tiên:

```text
gmail_message_id
```

Fallback:

```text
OTA + ota_booking_id + event_type + source_updated_at + payload_hash
```

Không được xử lý hai lần cùng một cancellation hoặc modification.

## 7.7. PII

- Không lưu body email đầy đủ lâu dài nếu không cần.
- Lưu message ID, hash và trường nghiệp vụ đã chuẩn hóa.
- Guest name chỉ lưu dạng mask.
- Xóa hoặc mã hóa raw payload sau thời gian retention cấu hình.
- Không đưa email đầy đủ vào LLM.

---

# 8. DATA MODEL

## 8.1. Bảng `source_events`

```text
id
source
source_event_id
event_type
entity_type
entity_external_id
payload_hash
parser_version
parser_confidence
source_created_at
source_updated_at
ingested_at
status
error_code
created_at
updated_at
```

Unique constraint:

```text
(source, source_event_id)
```

## 8.2. Bảng `bookings`

```text
id
ota
ota_booking_id
skyhotel_booking_id
guest_ref_masked
check_in
check_out
room_type_id
ota_room_type_text
quantity
guest_count
gross_amount
currency
status
source_version
context_hash
skyhotel_sync_status
last_reconciled_at
created_at
updated_at
```

Unique constraint:

```text
(ota, ota_booking_id)
```

## 8.3. Bảng `booking_versions`

Lưu lịch sử trước/sau cho modification và cancellation.

```text
id
booking_id
version_number
source_event_id
before_json
after_json
changed_fields_json
created_at
```

## 8.4. Bảng `inventory_snapshots`

```text
id
stay_date
room_type_id
physical_sellable
sold
blocked
internal_hold
safety_buffer
calculated_available
skyhotel_available
risk_level
source_collected_at
created_at
```

## 8.5. Bảng `rate_snapshots`

```text
id
channel
stay_date
room_type_id
rate_plan_id
headline_rate
effective_rate
currency
restrictions_json
source_collected_at
created_at
```

## 8.6. Bảng `competitor_snapshots`

```text
id
competitor_id
stay_date
nights
guests
room_type_text
display_price
tax_fee
total_price
currency
vnd_price
cancellation_policy
meal_plan
availability
comparability_score
source
collected_at
expires_at
created_at
```

## 8.7. Bảng `recommendations`

```text
id
stay_date
room_type_id
ota_scope
current_rate
reference_rate
recommended_rate
effective_net_rate
factor_breakdown_json
confidence
data_freshness_json
rule_version
context_hash
status
expires_at
stale_reason
created_at
updated_at
```

## 8.8. Bảng `approvals`

```text
id
recommendation_id
decision
modified_rate
reason
actor
nonce
context_hash
created_at
```

## 8.9. Bảng `action_packages`

```text
id
action_type
target_system
booking_id
recommendation_id
status
mode
instructions_json
before_state_json
requested_state_json
actual_state_json
idempotency_key
approved_by
approved_at
started_at
completed_at
verified_at
failure_reason
created_at
updated_at
```

## 8.10. Bảng `alerts`

```text
id
severity
type
entity_type
entity_id
title
description
recommended_action
status
detected_at
acknowledged_at
resolved_at
assigned_to
created_at
updated_at
```

## 8.11. Bảng `agent_runs`

```text
id
run_type
mode
started_at
finished_at
status
records_read
records_written
alerts_created
recommendations_created
error_count
cost_estimate
metadata_json
```

## 8.12. Bảng `audit_log`

Append-only:

```text
id
timestamp
actor_type
actor_id
action
entity_type
entity_id
before_json
after_json
result
run_id
correlation_id
checksum
```

---

# 9. BOOKING RECONCILIATION ENGINE

## 9.1. Mục tiêu

Đối chiếu booking OTA từ email với booking trong Skyhotel.

## 9.2. Matching order

1. Exact match bằng OTA booking ID.
2. Match bằng OTA + ngày check-in/out + room type + amount.
3. Match bằng ngày + room type + masked guest ref.
4. Nếu có nhiều hơn một candidate: `MANUAL_REVIEW`.
5. Không tự hợp nhất khi confidence thấp.

## 9.3. Booking state

```text
RECEIVED
→ PARSED
→ RECONCILING
→ MATCHED
→ SKYHOTEL_CONFIRMED
```

Nhánh lỗi:

```text
→ SKYHOTEL_MISSING
→ MAPPING_ERROR
→ DATA_CONFLICT
→ MANUAL_REVIEW
```

## 9.4. Workflow booking mới

1. Email mới được ingest.
2. Validate và dedupe.
3. Chạy targeted Skyhotel collector.
4. Tìm booking trong Skyhotel.
5. Nếu đã có và dữ liệu khớp:
   - đánh dấu `SKYHOTEL_CONFIRMED`;
   - tính lại inventory;
   - đóng event.
6. Nếu chưa có:
   - tạo alert P1/P2 theo lead time;
   - tạo Action Package “Nhập booking vào Skyhotel”.
7. Nếu `SKYHOTEL_WRITE_MODE=fill_only`:
   - mở form;
   - điền dữ liệu;
   - Owner kiểm tra và bấm Save.
8. Sau Save:
   - Agent đọc lại booking;
   - verify;
   - ghi audit.

## 9.5. Workflow booking sửa đổi

- So sánh field trước/sau.
- Đánh dấu thay đổi ảnh hưởng inventory:
  - check-in.
  - check-out.
  - room type.
  - quantity.
  - status.
- Không sửa trực tiếp khi:
  - booking đã check-in;
  - booking đã thanh toán phức tạp;
  - room type mới không còn phòng;
  - parser confidence thấp.
- Tạo Action Package với:
  - dữ liệu cũ;
  - dữ liệu mới;
  - ngày cần giải phóng;
  - ngày cần giữ;
  - cảnh báo conflict.

## 9.6. Workflow booking hủy

- Không tự xóa booking khỏi Skyhotel.
- Tạo action “Cập nhật trạng thái hủy”.
- Xác minh cancellation ID và thời điểm.
- Sau khi cập nhật Skyhotel:
  - tính lại inventory;
  - không auto-reopen OTA;
  - tạo đề xuất Owner mở lại nếu phù hợp.

## 9.7. Retry policy

Khi email OTA chưa thấy booking trong Skyhotel:

- Lần 1: ngay khi ingest.
- Lần 2: sau 5 phút.
- Lần 3: sau 15 phút.
- Lần 4: sau 30 phút.
- Sau 30 phút:
  - booking check-in trong 0–7 ngày: P1;
  - check-in trên 7 ngày: P2;
  - tạo action manual.

Retry phải idempotent và không tạo nhiều alert giống nhau.

---

# 10. INVENTORY RISK ENGINE

## 10.1. Công thức

```text
Safe Sellable Inventory
= Physical Sellable
- Confirmed Active Bookings
- Maintenance / Out-of-Service
- Confirmed Internal Holds
- Configured Safety Buffer
```

## 10.2. Safety buffer không áp dụng máy móc

Không đặt mặc định “1 phòng cho mọi room type”.

Quy tắc:

- Room type chỉ có 1 phòng: buffer mặc định 0; thay bằng đóng bán sớm hoặc allotment riêng.
- Room type có 2 phòng trở lên: có thể dùng buffer 1 trong pilot.
- Buffer cấu hình theo room type.
- Owner có thể chọn buffer cấp property nếu cơ cấu phòng cho phép.
- Dashboard phải hiển thị ảnh hưởng doanh thu của buffer.

## 10.3. Không mở toàn bộ inventory độc lập trên hai OTA

Khi không có Channel Manager, phải dùng **Channel Allotment Cap**.

Ví dụ logic, không hard-code số lượng:

```text
Agoda Cap + Booking.com Cap
≤ Safe Sellable Inventory + Shared Risk Allowance
```

`Shared Risk Allowance` mặc định bằng 0 trong pilot.

Mỗi room type có:

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

Các số thực tế chỉ được điền sau Phase 0.

## 10.4. Inventory risk levels

### Normal

- Safe sellable >= 3.
- Không có booking pending.
- Không có mapping error.

### Warning

- Safe sellable = 2.
- Có booking chưa reconcile trên 15 phút.
- Một kênh đang có allotment vượt cap.

### Critical

- Safe sellable <= 1 và hai OTA vẫn mở bán.
- Safe sellable = 0 nhưng một OTA vẫn có inventory.
- Booking OTA chưa nhập Skyhotel.
- Inventory âm.
- Modification làm trùng phòng.

## 10.5. Hành động khi có booking mới

Ngay sau event:

1. Recompute safe inventory.
2. Kiểm tra cap từng OTA.
3. Tạo task giảm inventory ở OTA còn lại nếu cần.
4. Nếu còn 0:
   - P1;
   - tạo Action Package “Close inventory”.
5. Không auto-reopen khi cancellation.
6. Owner quyết định mở lại sau khi review.

---

# 11. PRICING ENGINE

## 11.1. Nguyên tắc

- Không dùng LLM để sinh giá.
- Không chạy theo giá thấp nhất.
- Tối ưu doanh thu ròng.
- Mọi giá có floor, ceiling và minimum net rate.
- Dữ liệu đối thủ stale không được dùng trong tính toán.
- Tối đa một routine recommendation cho cùng ngày/room type trong 24 giờ.

## 11.2. Công thức

### Reference Rate

```text
Reference Rate
= Base Rate
× Season Factor
× Day-of-Week Factor
× Event Factor
× Product Factor
```

### Demand Adjustment

```text
Demand Adjustment
= Occupancy Weight × Occupancy Signal
+ Pickup Weight × Pickup Signal
+ Lead-Time Weight × Lead-Time Signal
+ Competitor Weight × Competitor Signal
```

### Candidate Rate

```text
Candidate Rate
= Reference Rate × (1 + Demand Adjustment)
```

### Guardrails

```text
Routine Adjustment ∈ [-15%, +15%]
Price Floor ≤ Recommended Rate ≤ Price Ceiling
Effective Net Rate ≥ Minimum Acceptable Net Rate
```

### Rounding

- Giá VND làm tròn theo bước cấu hình, mặc định 10.000 VND.
- Không làm tròn khiến net rate xuống dưới minimum.

## 11.3. Effective net rate

```text
Effective Net Rate
= Published Rate
- OTA Commission
- Promotion Cost
- Payment Cost
- Estimated Refund/Compensation Provision
```

Mọi thành phần phải có trạng thái:

- `confirmed`
- `estimated`
- `unknown`

Khi commission hoặc promotion cost không rõ, confidence bị giảm.

## 11.4. Confidence score

```text
Confidence =
35% Data Completeness
+ 25% Data Freshness
+ 20% Competitor Comparability
+ 20% Inventory Reliability
```

Xử lý:

- 80–100: High.
- 60–79: Medium.
- dưới 60: chỉ hiển thị insight, không đưa nút Apply.

## 11.5. TTL

- Stay date 0–2 ngày: 2 giờ.
- 3–7 ngày: 6 giờ.
- 8–30 ngày: đến cuối ngày.
- Trên 30 ngày: 24 giờ.

Recommendation chuyển `STALE` nếu:

- inventory thay đổi;
- current rate thay đổi;
- booking mới/sửa/hủy;
- event calendar thay đổi;
- competitor data hết hạn;
- pricing rule version thay đổi.

## 11.6. Recommendation fields

- stay_date
- room_type
- channel scope
- current rate
- reference rate
- recommended rate
- delta amount
- delta percent
- occupancy percent
- occupied rooms / physical rooms
- pickup
- lead time
- competitor median
- competitor freshness
- factor breakdown
- effective net rate
- confidence
- explanation
- TTL
- context hash
- rule version

---

# 12. COMPETITOR INTELLIGENCE

## 12.1. Giai đoạn MVP

Không xây scraping quy mô lớn.

Dữ liệu đầu vào ưu tiên:

1. Market insight trong extranet nếu có.
2. Owner nhập snapshot qua Dashboard.
3. CSV/XLSX import.
4. Agent đọc trang công khai ở tần suất thấp, chỉ sau khi Owner duyệt nguồn và phương pháp.

## 12.2. Comp set

- Primary: 5 khách sạn tương đồng nhất.
- Secondary: 5 khách sạn tham khảo.
- Watch List: đối thủ mới hoặc biến động.

## 12.3. Snapshot fields

- competitor_id
- stay_date
- nights
- guests
- room type
- display price
- taxes/fees
- total price
- currency
- cancellation
- breakfast
- availability
- source
- collected_at
- comparability score

## 12.4. Freshness

- 0–7 ngày: tối đa 24 giờ.
- 8–30 ngày: tối đa 72 giờ.
- 31–90 ngày: tối đa 7 ngày.
- Event/holiday: tối đa 24 giờ.

## 12.5. Comparability

Không đưa vào median chính nếu:

- khác phân khúc rõ ràng;
- căn hộ/homestay khác mô hình;
- điều kiện hủy khác hoàn toàn;
- giá chưa gồm thuế trong khi Ven Hồ đã gồm thuế;
- room type không tương đương;
- dữ liệu quá cũ.

---

# 13. ACTION PACKAGE

## 13.1. Mục tiêu

Thay vì tự ghi trực tiếp, Agent tạo một gói hành động rõ ràng để Owner duyệt và thực hiện.

## 13.2. Các loại Action Package

- `CREATE_SKYHOTEL_BOOKING`
- `MODIFY_SKYHOTEL_BOOKING`
- `CANCEL_SKYHOTEL_BOOKING`
- `UPDATE_OTA_RATE`
- `UPDATE_OTA_INVENTORY`
- `CLOSE_OTA_DATE`
- `VERIFY_STATE`
- `MANUAL_REVIEW`

## 13.3. Cấu trúc

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
  "requested_state": {
    "rate": 0
  },
  "instructions": [
    {
      "step": 1,
      "title": "Mở extranet",
      "expected_page": "Calendar"
    },
    {
      "step": 2,
      "title": "Chọn ngày và loại phòng"
    },
    {
      "step": 3,
      "title": "Nhập giá mới"
    },
    {
      "step": 4,
      "title": "Owner kiểm tra và xác nhận"
    }
  ],
  "verification": {
    "required": true,
    "method": "read_back"
  }
}
```

Giá trị thực tế không được hard-code trong template.

## 13.4. State machine

```text
DRAFT
→ READY
→ OWNER_APPROVED
→ IN_PROGRESS
→ APPLIED
→ VERIFIED
→ COMPLETED
```

Nhánh khác:

```text
→ REJECTED
→ EXPIRED
→ STALE
→ FAILED
→ MANUAL_REVIEW
```

## 13.5. Revalidation

Ngay trước khi bắt đầu:

- recommendation chưa hết TTL;
- context hash còn đúng;
- current rate/inventory chưa đổi;
- Agent Mode cho phép;
- target system không có active session conflict;
- không nằm trong freeze window.

Nếu sai bất kỳ điều kiện nào: chuyển `STALE`.

---

# 14. GUIDED RPA

## 14.1. Mức tự động hóa mặc định

### Phase đầu

- Agent mở đúng trang.
- Điều hướng đến đúng booking/ngày/room type.
- Điền sẵn dữ liệu.
- Chụp before screenshot.
- Dừng trước nút Save/Publish.
- Owner tự xác nhận.

### Sau nghiệm thu riêng

Có thể bật `confirm_save`:

- Owner duyệt trong Dashboard.
- Approval có nonce và context hash.
- Agent thực hiện một lần.
- Verify ngay.
- Không retry ghi tự động nếu kết quả không rõ.

## 14.2. Quy tắc an toàn

- Không dùng tọa độ chuột cố định.
- Không click nút Save nếu trang không đúng booking/ngày/room type.
- Không ghi bulk action trong lần triển khai đầu.
- Mỗi write action chỉ xử lý một entity.
- Chụp screenshot trước/sau.
- Nếu giao diện thay đổi: dừng, không đoán selector.
- Nếu Captcha/2FA: Owner tiếp quản.
- Nếu session hết hạn giữa action: action chuyển `FAILED_SAFE`.
- Không mở hai browser writer cho cùng hệ thống.

## 14.3. Không tự retry write

Read có thể retry.

Write chỉ được retry nếu:

- hệ thống xác nhận lần trước chưa thực hiện;
- idempotency check cho thấy state chưa đổi;
- Owner approval còn hiệu lực;
- retry count chưa vượt 1.

Nếu không chắc chắn: `MANUAL_REVIEW`.

---

# 15. INTERNAL API

## 15.1. Health và Agent

```http
GET  /api/v1/health
GET  /api/v1/agent/status
POST /api/v1/agent/run
POST /api/v1/agent/mode
POST /api/v1/agent/emergency-stop
```

## 15.2. Booking và reconciliation

```http
GET  /api/v1/bookings
GET  /api/v1/bookings/:id
GET  /api/v1/bookings/:id/versions
POST /api/v1/reconciliation/run
POST /api/v1/reconciliation/:bookingId/retry
```

## 15.3. Inventory

```http
GET /api/v1/inventory
GET /api/v1/inventory/risks
GET /api/v1/calendar
```

## 15.4. Recommendations và approvals

```http
GET  /api/v1/recommendations
GET  /api/v1/recommendations/:id
POST /api/v1/recommendations/:id/approve
POST /api/v1/recommendations/:id/modify
POST /api/v1/recommendations/:id/reject
```

Approval request:

```json
{
  "decision": "APPROVE",
  "actor": "owner",
  "nonce": "single-use-nonce",
  "context_hash": "sha256:...",
  "reason": "Approved for weekend demand"
}
```

## 15.5. Actions

```http
GET  /api/v1/actions
GET  /api/v1/actions/:id
POST /api/v1/actions/:id/start
POST /api/v1/actions/:id/confirm
POST /api/v1/actions/:id/verify
POST /api/v1/actions/:id/fail
```

## 15.6. Alerts

```http
GET  /api/v1/alerts
POST /api/v1/alerts/:id/acknowledge
POST /api/v1/alerts/:id/resolve
```

## 15.7. Competitors

```http
GET  /api/v1/competitors
POST /api/v1/competitor-snapshots
POST /api/v1/competitor-snapshots/import
```

## 15.8. Bảo vệ API

- Bind mặc định `127.0.0.1`.
- Dashboard và API cùng máy trong MVP.
- Session authentication cho Dashboard.
- CSRF protection.
- Rate limit cho action endpoints.
- Re-authentication cho Emergency Stop và write confirmation.
- Mọi POST action ghi audit log.
- Không trả PII đầy đủ.

---

# 16. DASHBOARD SPEC G0-C

## 16.1. Menu

```text
OTA & Revenue
├── G0-C Overview
├── Booking Reconciliation
├── Calendar & Inventory Risk
├── Pricing Center
├── Competitor Watch
├── Action Queue
├── Alerts
└── Settings & Logs

AI Agent Center
└── OTA Agent
```

## 16.2. G0-C Overview

Card ưu tiên:

- Agent mode.
- Skyhotel last sync.
- Gmail OTA last sync.
- Booking mới 24 giờ.
- Booking chưa vào Skyhotel.
- Booking cần Owner xử lý.
- Inventory Critical.
- Phòng còn bán tối nay.
- Pending actions.
- Pricing recommendations chờ duyệt.
- P1/P2 alerts.
- Daily revenue.
- Manual time saved estimate.

## 16.3. Booking Reconciliation

Bảng:

- OTA.
- OTA booking ID.
- Event type.
- Check-in/out.
- OTA room type.
- Skyhotel booking ID.
- Match confidence.
- Sync status.
- Risk.
- Action.
- Last checked.

Nút:

- Retry Skyhotel check.
- Open Skyhotel.
- Create Action Package.
- Mark manually resolved.
- View email metadata.
- View version history.

## 16.4. Calendar & Inventory Risk

Mỗi ngày/room type hiển thị:

- physical rooms.
- sold.
- blocked.
- safety buffer.
- safe sellable.
- Agoda cap.
- Booking.com cap.
- risk badge.
- pending OTA booking.
- action required.

Không hiển thị chỉ phần trăm; luôn có số phòng tuyệt đối.

## 16.5. Pricing Center

Approval Card:

- current/reference/recommended.
- occupancy và số phòng.
- pickup.
- comp median.
- freshness.
- net rate.
- confidence.
- TTL.
- explanation.
- Approve/Modify/Reject.
- Generate Action Package.

## 16.6. Action Queue

Các nhóm:

- Need Owner Approval.
- Ready for Manual Action.
- Guided RPA Ready.
- Waiting Verification.
- Failed/Manual Review.
- Completed.

## 16.7. OTA Agent Card

- Mode.
- Last run.
- Next scheduled run.
- Browser auth state.
- Gmail auth state.
- Connector health.
- Error gần nhất.
- Run Now.
- Read Only.
- Pause.
- Resume.
- Emergency Stop.
- Model usage/cost.

---

# 17. ALERT RULES

## 17.1. P1 Critical

- Booking mới check-in trong 0–7 ngày chưa vào Skyhotel sau 30 phút.
- Safe inventory = 0 nhưng OTA vẫn cần đóng bán.
- Inventory âm.
- Booking modification gây trùng phòng.
- Unauthorized write attempt.
- Agent không xác định được kết quả sau write.
- Credential/security incident.

Mục tiêu:

- gửi điện thoại dưới 1 phút trong ít nhất 95% test;
- Owner acknowledge trong 10 phút;
- có mitigation trong 60 phút.

## 17.2. P2 High

- Booking check-in trên 7 ngày chưa vào Skyhotel.
- Room mapping không khớp.
- Rate hoặc inventory cần cập nhật.
- Competitor data stale làm recommendation giảm confidence.
- Skyhotel collector lỗi trên hai lần liên tiếp.
- Email parser confidence trung bình.

## 17.3. P3/P4

- Listing inconsistency.
- Comp snapshot thiếu.
- Recommendation low confidence.
- Gợi ý tối ưu promotion.
- Selector profile cần cập nhật.

## 17.4. Dedupe alert

Một vấn đề không tạo nhiều alert liên tục.

Dedupe key:

```text
alert_type + entity_id + active_context_hash
```

Alert chỉ mở lại khi context thay đổi hoặc alert cũ đã resolved.

---

# 18. SCHEDULER

## 18.1. Job mặc định

| Job | Lịch | LLM |
|---|---:|---|
| Gmail OTA poll | 5 phút | Không |
| Skyhotel full sync | 06:00, 12:00, 18:00, 22:00 | Không |
| Targeted Skyhotel check | Sau OTA event | Không |
| Reconciliation retry | 5/15/30 phút | Không |
| Pricing run | 06:30 hằng ngày | Không |
| Explanation generation | Sau pricing run | Có, có fallback |
| Daily OTA Brief | 07:15 | Có, có fallback |
| Weekly Revenue Review | Thứ Hai 08:00 | Có |
| Database backup | Mỗi giờ | Không |
| Full encrypted backup | 02:00 hằng ngày | Không |
| Audit JSONL export | 23:50 hằng ngày | Không |

## 18.2. Job locking

- Một job type chỉ có một instance chạy.
- Targeted check có thể chạy song song nếu khác booking ID nhưng phải giới hạn concurrency.
- Browser writer luôn concurrency = 1 cho mỗi target system.
- Job quá timeout phải chuyển trạng thái rõ ràng; không treo vô hạn.

---

# 19. SECURITY

## 19.1. Credentials

Khuyến nghị macOS Keychain:

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

Ứng dụng đọc qua wrapper riêng. Không in giá trị ra terminal/log.

## 19.2. Git

`.gitignore` bắt buộc:

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

## 19.3. Data protection

- Guest data mask trong log.
- Không lưu thẻ.
- Không gửi raw booking email vào LLM.
- Screenshot phải được làm mờ hoặc giới hạn retention nếu có PII.
- Database backup mã hóa.
- Dashboard có session timeout.
- Emergency Stop yêu cầu xác nhận hai bước.

## 19.4. Browser profile

- Phân quyền filesystem chỉ user runtime được đọc.
- Không đồng bộ browser profile lên cloud drive.
- Không dùng profile duyệt web cá nhân.
- Mỗi target system dùng profile riêng.

---

# 20. BACKUP VÀ PHỤC HỒI

## 20.1. Mục tiêu

- RPO: tối đa 1 giờ cho runtime data.
- Audit quan trọng flush ngay.
- RTO: tối đa 4 giờ.
- Manual fallback dùng ngay khi runtime dừng.

## 20.2. Backup

- SQLite online backup mỗi giờ.
- Full encrypted backup hằng ngày.
- Config/rules lưu Git.
- Audit JSONL export hằng ngày.
- Giữ:
  - hourly: 48 bản;
  - daily: 30 bản;
  - monthly: 12 bản.

## 20.3. Restore drill

Trước khi bật Guided RPA:

1. Dừng worker.
2. Sao lưu database hiện tại.
3. Restore bản backup gần nhất sang file mới.
4. Chạy integrity check.
5. Khởi động API ở test port.
6. Kiểm tra booking, alert, recommendation, audit.
7. Ghi biên bản restore.
8. Không ghi vào hệ thống thật trong drill.

---

# 21. EDGE CASES BẮT BUỘC XỬ LÝ

## 21.1. Email đến trùng

- Dedupe bằng Gmail message ID.
- Không tạo hai booking/action.

## 21.2. Email modification đến trước email new

- Upsert theo OTA booking ID.
- Đánh dấu out-of-order.
- Tìm event cũ trong Gmail thread.
- Không tự nhập booking nếu dữ liệu chưa đủ.

## 21.3. Booking không có OTA booking ID trong Skyhotel

- Match phụ bằng ngày, room type, amount.
- Nếu có nhiều candidate: manual review.

## 21.4. Room type text thay đổi

- Mapping versioned.
- Không fuzzy-map tự động khi similarity thấp.
- Cần Owner confirm mapping mới.

## 21.5. Booking nhiều phòng

- Lưu `quantity`.
- Inventory giảm theo quantity cho từng stay night.
- Không coi một booking ID luôn bằng một phòng.

## 21.6. Check-out không chiếm đêm

Stay night tính theo:

```text
[check_in, check_out)
```

## 21.7. Cancellation sau check-in

- Không tự giải phóng toàn bộ.
- Manual review.

## 21.8. Booking đã sửa thủ công trong Skyhotel

- Reconciliation phát hiện context khác.
- Không ghi đè.
- Tạo conflict report.

## 21.9. Skyhotel giao diện đổi

- Page readiness fail.
- Chụp screenshot.
- Dừng job.
- P2/P1 tùy ảnh hưởng.
- Không đoán selector mới trong production.

## 21.10. Mạng mất giữa Save

- Không tự retry ngay.
- Mở lại và đọc state.
- Nếu state đã đúng: mark verified.
- Nếu state chưa đổi: Owner quyết định retry.
- Nếu không xác định: manual review.

## 21.11. Recommendation đã duyệt nhưng có booking mới

- Context hash đổi.
- Recommendation chuyển `STALE`.
- Không cho action chạy.

## 21.12. Một room type chỉ có một phòng

- Không áp safety buffer 1.
- Dùng close-early rule và P1 threshold riêng.
- Không mở đồng thời inventory độc lập trên hai OTA nếu rủi ro không kiểm soát được.

## 21.13. Owner vắng mặt

- Recommendation hết TTL thì expire.
- Không auto-apply.
- P1 vẫn gửi tới backup contact nếu đã cấu hình.
- Giá hiện tại được giữ nguyên.

## 21.14. AI provider lỗi

- Pricing vẫn chạy.
- Daily Brief dùng template.
- Không chặn reconciliation.
- Ghi model failure nhưng không tạo P1 trừ khi báo cáo bắt buộc không gửi được.

---

# 22. TEST PLAN

## 22.1. Unit tests

- Inventory formula.
- Stay-night calculation.
- Dedupe.
- Event ordering.
- Booking modification diff.
- TTL.
- Stale context.
- Pricing floor/ceiling.
- Minimum net rate.
- Confidence.
- Alert dedupe.
- State machines.

## 22.2. Connector tests

- Login success.
- Session expired.
- 2FA required.
- Page changed.
- Empty table.
- Pagination.
- Slow page.
- Partial data.
- Revenue parser.
- Booking parser.
- Inventory parser.

Dùng HTML fixture, không cần login thật cho regression test.

## 22.3. Email parser tests

Tối thiểu:

- Agoda new.
- Agoda modified.
- Agoda cancelled.
- Booking.com new.
- Booking.com modified.
- Booking.com cancelled.
- Plain text.
- HTML.
- Missing amount.
- Missing room type.
- Multi-room.
- Currency khác VND.
- Duplicate.
- Forwarded email.
- Fake sender.

## 22.4. Golden scenarios

Tối thiểu 40 scenario:

1. Booking mới đã có trong Skyhotel.
2. Booking mới chưa có.
3. Duplicate email.
4. Modification đổi ngày.
5. Modification đổi room type.
6. Modification giảm số đêm.
7. Cancellation bình thường.
8. Cancellation sau check-in.
9. Multi-room booking.
10. Inventory âm.
11. One-room room type.
12. Safety buffer.
13. Mapping missing.
14. Rate bằng 0.
15. Recommendation dưới floor.
16. Net rate dưới minimum.
17. Competitor stale.
18. Recommendation expired.
19. Recommendation stale sau booking mới.
20. Owner modify rate.
21. Guided fill only.
22. Session expired.
23. 2FA.
24. Captcha.
25. Selector changed.
26. Network loss before Save.
27. Network loss after Save.
28. Unknown write result.
29. Emergency stop before write.
30. Emergency stop giữa run.
31. AI provider unavailable.
32. Gmail API unavailable.
33. Skyhotel unavailable.
34. Restore database.
35. Concurrent manual edit.
36. Alert dedupe.
37. Bulk action rejected.
38. Freeze window.
39. Invalid currency.
40. Audit checksum.

## 22.5. Acceptance thresholds

- Unit tests: 100% critical business rules pass.
- Golden tests: 100% pass trước mỗi phase gate.
- Không có stale write.
- Không có duplicate write.
- Không có credential trong log.
- 7 ngày read-only pilot không có unhandled critical error.
- Guided RPA: tối thiểu 20 action liên tiếp đúng trước khi xem xét `confirm_save`.

---

# 23. ROADMAP TRIỂN KHAI

## PHASE G0C-0 — AUDIT VÀ LOCK DỮ LIỆU

**Thời lượng:** 1 tuần  
**Mục tiêu:** xác định chính xác giao diện, room types, rate plans và email OTA thực tế.

### Công việc

- Kiểm tra Agent báo cáo doanh thu hiện có.
- Tách logic login/collect thành Skyhotel connector.
- Chốt danh sách room type thực tế.
- Chốt physical inventory từng room type.
- Chốt mapping Agoda/Booking.com/Skyhotel.
- Thu thập mẫu email new/modified/cancelled của hai OTA.
- Chốt sender allowlist.
- Chốt safety buffer và allotment cap ban đầu.
- Chốt notification channel.
- Đo baseline giờ/tuần quản lý OTA.
- Tạo dữ liệu fixture đã ẩn PII.

### Deliverables

- `G0C_AUDIT_REPORT.md`
- `room-mapping.json`
- `rate-plan-mapping.json`
- `email-parser-rules.json`
- `inventory-policy.json`
- fixture set
- risk register

### DoD

- Mapping được Owner duyệt.
- Có ít nhất một mẫu email cho mỗi event type đang sử dụng.
- Connector hiện tại chạy được trong mock/test.
- Không còn quyết định nền tảng chưa chốt.

---

## PHASE G0C-1 — SKYHOTEL STRUCTURED COLLECTOR

**Thời lượng:** 2 tuần  
**Mục tiêu:** chuyển Agent báo cáo doanh thu thành connector có dữ liệu chuẩn hóa.

### Công việc

- Playwright persistent profile.
- Keychain credential adapter.
- Daily revenue collector.
- Booking collector.
- Inventory collector.
- Page Object Model.
- Screenshot/error handling.
- SQLite schema và migrations.
- Agent run log.
- Scheduler 4 lần/ngày.
- Backup mỗi giờ.

### DoD

- 7 ngày chạy read-only không mất dữ liệu.
- Doanh thu đối chiếu đúng với Skyhotel.
- Booking và inventory snapshot có schema hợp lệ.
- Session expiry được xử lý an toàn.
- Backup/restore test pass.

---

## PHASE G0C-2 — OTA EMAIL INGESTION VÀ RECONCILIATION

**Thời lượng:** 2 tuần  
**Mục tiêu:** phát hiện booking mới/sửa/hủy và kiểm tra Skyhotel.

### Công việc

- Gmail OAuth.
- Gmail label/filter.
- Agoda parser.
- Booking.com parser.
- Dedupe.
- Parser confidence.
- Booking matching.
- Reconciliation retry.
- P1/P2 alerts.
- Manual review queue.

### DoD

- Tất cả fixture email parse đúng.
- Duplicate không tạo record thứ hai.
- Booking thiếu trong Skyhotel tạo alert đúng SLA.
- Modification/cancellation không làm sai inventory.
- Không lưu raw PII không cần thiết.

---

## PHASE G0C-3 — DASHBOARD READ-ONLY VÀ ACTION QUEUE

**Thời lượng:** 2 tuần  
**Mục tiêu:** Owner vận hành theo dõi từ Mother Dashboard.

### Công việc

- Internal API.
- G0-C Overview.
- Booking Reconciliation.
- Calendar & Inventory Risk.
- Alerts.
- OTA Agent Card.
- Run Now.
- Acknowledge/Resolve.
- Generate Action Package.
- Audit view.

### DoD

- Owner xem được toàn bộ booking pending.
- Owner biết ngày/room type có nguy cơ.
- Mọi action cần làm có checklist.
- Không cần mở database/file.
- API action endpoints có auth/audit.

---

## PHASE G0C-4 — PRICING VÀ COMPETITOR INTELLIGENCE

**Thời lượng:** 2–3 tuần  
**Mục tiêu:** tạo đề xuất giá có kiểm soát.

### Công việc

- Pricing rules.
- Season/event calendar.
- Floor/ceiling/minimum net rate.
- Competitor set.
- Snapshot form/import.
- Confidence và freshness.
- Recommendation state machine.
- Approval Cards.
- Daily/Weekly Revenue Brief.
- Shadow mode 14 ngày.

### DoD

- Recommendation 30 ngày tới.
- 100% recommendation có TTL/context hash/rule version.
- Low confidence không có nút Apply.
- Shadow mode đủ 14 ngày.
- Owner duyệt rule set v1.

---

## PHASE G0C-5 — GUIDED ACTION VÀ VERIFY

**Thời lượng:** 2–3 tuần  
**Mục tiêu:** giảm thao tác nhập liệu nhưng giữ Owner ở bước quyết định cuối.

### Công việc

- Skyhotel `fill_only`.
- OTA guided navigation.
- Before/after screenshot.
- Revalidation.
- Verification service.
- Action state machine.
- Emergency Stop.
- Freeze window.
- Manual fallback SOP.

### DoD

- 20 guided actions liên tiếp đúng.
- Không bấm Save tự động trong mode mặc định.
- Không stale action.
- Unknown result luôn chuyển manual review.
- Emergency Stop drill thành công.

---

## PHASE G0C-6 — PILOT VẬN HÀNH

**Thời lượng:** 4 tuần  
**Mục tiêu:** xác nhận hiệu quả và quyết định có cần nâng cấp.

### Theo dõi

- Booking missed.
- Near-overbooking.
- Thời gian thao tác thủ công.
- Alert accuracy.
- Parser accuracy.
- Connector uptime.
- Recommendation acceptance.
- Revenue trend.
- Chi phí AI.
- Số lần selector phải sửa.

### DoD

- Không có booking bị bỏ sót vĩnh viễn.
- Không có overbooking do VENHO OS.
- Thời gian thao tác giảm ít nhất 60%.
- Owner vận hành được không cần terminal.
- Có báo cáo quyết định:
  - tiếp tục G0-C;
  - nâng Guided RPA;
  - hoặc xem xét Channel Manager.

---

# 24. DEFINITION OF DONE TOÀN MODULE G0-C v1.0

Module hoàn thành khi:

- Agent hiện có được chuyển thành Skyhotel connector có cấu trúc.
- Booking Agoda/Booking.com được ingest từ email.
- Booking mới/sửa/hủy được đối chiếu với Skyhotel.
- Booking thiếu tạo alert và Action Package.
- Dashboard hiển thị inventory risk theo room type và ngày.
- Safety buffer/allotment cap được cấu hình thực tế.
- Pricing Recommendation có Owner Approval, TTL và stale protection.
- Competitor data có freshness và comparability.
- Guided RPA chỉ điền sẵn, không tự Save mặc định.
- Mọi action có before/after, audit và verify.
- Có Emergency Stop.
- Có hourly backup và restore drill.
- Không lưu credential trong source.
- Không có overbooking do lỗi module trong pilot.
- Giảm ít nhất 60% thời gian thao tác lặp lại.
- Owner vận hành tác vụ thường nhật từ Mother Dashboard.

---

# 25. KPI VẬN HÀNH

| KPI | Mục tiêu |
|---|---:|
| Booking OTA bị bỏ sót vĩnh viễn | 0 |
| Duplicate event gây double action | 0 |
| Booking chưa vào Skyhotel đúng SLA | <1% |
| P1 alert đến điện thoại | <1 phút trong ≥95% test |
| Stale/expired action được thực hiện | 0 |
| Unauthorized write | 0 |
| Audit log đầy đủ | 100% |
| Parser confidence cao nhưng parse sai | <1% sau pilot |
| Manual OTA time reduction | ≥60% |
| Skyhotel collector success | ≥99% trong giờ vận hành |
| Guided action đúng và verify được | ≥99% |
| Overbooking do module | 0 |
| Backup restore drill | Pass |
| LLM dùng cho sync/reconciliation | 0 |

---

# 26. COST CONTROL

## 26.1. Chi phí không phát sinh

- Không thuê Channel Manager mới.
- Không mua database cloud.
- Không cần VPS ở MVP nếu Mac mini chạy ổn.
- Không dùng LLM cho polling, parsing, reconciliation hoặc pricing calculation.
- Không cần scraping service.

## 26.2. Chi phí có thể phát sinh

- AI token cho explanation và Daily Brief.
- Make nếu Owner chọn Make thay Gmail API.
- Điện và mạng cho Mac mini.
- Công bảo trì selector khi Skyhotel/OTA đổi giao diện.
- Phí VPS trong tương lai nếu cần uptime cao hơn.

## 26.3. Giới hạn chi phí AI

- Daily Brief tối đa một lần/ngày.
- Recommendation explanation tạo theo batch.
- Cache explanation theo context hash.
- Dùng template khi vượt budget.
- Dashboard hiển thị model usage/cost.
- Sync và alert tuyệt đối không phụ thuộc AI.

---

# 27. ĐIỀU KIỆN TÁI XÉT CHANNEL MANAGER

Chỉ mở lại quyết định mua Channel Manager khi có ít nhất một trong các điều kiện:

1. Có một lần overbooking hoặc near-miss nghiêm trọng do độ trễ giữa hai OTA.
2. Thời gian thao tác OTA còn trên 3–4 giờ/tuần sau khi G0-C ổn định.
3. Công suất trên 80% thường xuyên và inventory thay đổi nhanh.
4. Có booking gần đồng thời từ Agoda và Booking.com.
5. Mở thêm OTA thứ ba.
6. Thêm khách sạn thứ hai.
7. Giao diện OTA/Skyhotel thay đổi quá thường xuyên làm chi phí bảo trì RPA cao.
8. Mac mini hoặc mạng không bảo đảm uptime.
9. Chi phí nhân công + rủi ro lớn hơn báo giá Channel Manager.
10. Owner muốn auto inventory synchronization thực sự.

Khi chưa có trigger, G0-C tiếp tục là phương án ưu tiên.

---

# 28. QUY TẮC CHO AI CODING AGENT TRONG VSCODE

AI Coding Agent phải tuân thủ:

1. Đọc toàn bộ tài liệu này trước khi code.
2. Chỉ triển khai đúng phase được giao.
3. Không tự mở rộng sang Channel Manager/API OTA.
4. Không tự bật write mode.
5. Không hard-code username/password.
6. Không bỏ qua Zod validation.
7. Không đặt business logic trong Playwright Page Object.
8. Không sử dụng `any` trừ trường hợp được ghi chú rõ.
9. TypeScript strict mode.
10. Mọi migration phải có rollback hoặc backup instruction.
11. Mọi endpoint ghi phải có auth, audit và idempotency.
12. Mọi action phải kiểm tra Agent Mode ngay trước write.
13. Mọi browser failure phải fail-safe, không đoán.
14. Không gửi PII đầy đủ vào LLM.
15. Không gọi LLM trong reconciliation.
16. Mọi thay đổi pricing rule phải chạy golden tests.
17. Mọi thay đổi selector phải chạy connector regression tests.
18. Không merge code khi critical test chưa pass.
19. Cập nhật `CHANGELOG.md` và Step File sau mỗi phase.
20. Không tuyên bố hoàn thành khi chưa đạt Definition of Done.

---

# 29. THỨ TỰ CODE ĐỀ XUẤT CHO VSCODE

## Sprint 1

1. Tạo monorepo.
2. Cấu hình TypeScript strict, ESLint, Prettier, Vitest.
3. Tạo SQLite + migrations.
4. Tạo domain schemas.
5. Tạo audit logger.
6. Tạo agent-control service.
7. Viết unit test inventory và booking state.

## Sprint 2

1. Tách Agent Skyhotel hiện có thành connector.
2. Tạo Page Objects.
3. Tạo Keychain adapter.
4. Tạo revenue/booking/inventory parsers.
5. Tạo fixture regression tests.
6. Tạo scheduler và run log.

## Sprint 3

1. Gmail OAuth.
2. Email watcher.
3. Agoda parser.
4. Booking.com parser.
5. Dedupe.
6. Reconciliation engine.
7. Alert service.

## Sprint 4

1. Fastify API.
2. Dashboard Overview.
3. Booking Reconciliation.
4. Calendar & Inventory Risk.
5. Agent Card.
6. Action Queue.

## Sprint 5

1. Pricing Engine.
2. Competitor snapshot.
3. Recommendation state.
4. Approval Service.
5. Daily/Weekly Brief.
6. Shadow mode.

## Sprint 6

1. Guided Skyhotel writer.
2. Guided OTA writer.
3. Verification.
4. Emergency Stop.
5. Backup/restore drill.
6. Pilot.

---

# 30. CHECKLIST GO-LIVE

## Read-only go-live

- [ ] Mapping đã duyệt.
- [ ] Credential trong Keychain.
- [ ] `.env` không được commit.
- [ ] Gmail parser fixture pass.
- [ ] Skyhotel connector test pass.
- [ ] Backup pass.
- [ ] Notification test pass.
- [ ] Agent mode = `READ_ONLY`.
- [ ] Emergency Stop hoạt động.
- [ ] Owner xem được Dashboard.

## Guided action go-live

- [ ] Read-only chạy ổn 14 ngày.
- [ ] Golden tests pass 100%.
- [ ] Context hash/stale test pass.
- [ ] Before/after screenshot hoạt động.
- [ ] `SKYHOTEL_WRITE_MODE=fill_only`.
- [ ] `OTA_WRITE_MODE=guided`.
- [ ] Không có auto Save.
- [ ] Owner đã duyệt freeze window.
- [ ] Manual fallback SOP đã in/lưu.
- [ ] Restore drill pass.

---

# 31. KẾT LUẬN

G0-C là phương án phù hợp nhất cho Ven Hồ Hotel ở giai đoạn hiện tại:

- Không phát sinh thêm phí Channel Manager định kỳ.
- Tận dụng Skyhotel và Agent doanh thu đang có.
- Dùng email OTA làm tín hiệu booking gần thời gian thực.
- Dùng rule engine và AI Agent để phân tích, cảnh báo và đề xuất.
- Giữ Owner ở điểm quyết định cuối.
- Dùng Guided RPA để giảm thao tác nhưng không đánh đổi an toàn.
- Có lộ trình nâng cấp rõ ràng nếu quy mô hoặc rủi ro tăng.

**Quyết định cuối:** triển khai G0-C theo thứ tự `Read-only → Reconciliation → Pricing → Guided Action → Pilot`. Không bật tự động ghi toàn phần trong Module v1.0.

---

**END OF DOCUMENT**  
**VENHO OS — OTA-01 G0-C LEAN TECHNICAL IMPLEMENTATION SPEC v1.0**
