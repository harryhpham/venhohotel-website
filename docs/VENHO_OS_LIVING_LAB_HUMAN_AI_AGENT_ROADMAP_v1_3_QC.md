# VENHO OS — LIVING LAB HUMAN + AI AGENT ROADMAP v1.3 (QC Consolidated)

**Kỳ kế hoạch:** Tháng 8/2026 – Tháng 7/2027
**Phạm vi:** Ven Hồ Hotel, 12 phòng
**Vai trò trong VENHO OS:** Sub-plan thuộc **L3 Planning OS**, làm đầu vào cho **L4 Execution OS**
**Nguyên tắc:** Living Lab First · Human-in-the-loop · Evidence Before Expansion · System Before Feature

**Thay đổi v1.2 → v1.3 (QC):** sửa 10 lỗi được phát hiện trong quy trình kiểm tra chất lượng — xem Changelog cuối tài liệu. Nội dung chiến lược của Harry giữ nguyên; chỉ sửa mâu thuẫn nội bộ, khôi phục các quyết định/mốc bị rơi, và bổ sung mapping với VENHO AI Studio để chống build trùng.

---

## 0. Mục tiêu tài liệu

Tài liệu này hợp nhất ba mục tiêu:

1. Tăng doanh thu và biên lợi nhuận của Ven Hồ Hotel.
2. Xây dựng các AI Agent giải quyết công việc vận hành thực tế.
3. Chuẩn hóa Agent, workflow và dữ liệu thành tài sản có thể productize.

Roadmap được tách thành hai đường song song:

- **Human Execution Roadmap:** các việc con người bắt buộc thực hiện, phê duyệt hoặc chịu trách nhiệm cuối cùng.
- **AI Agent Development Roadmap:** các năng lực AI cần xây, kiểm thử, đo lường và từng bước tự động hóa.

AI không thay người quản lý khách sạn. AI chịu trách nhiệm thu thập, phân tích, soạn thảo, cảnh báo và đề xuất. Founder giữ quyền phê duyệt các quyết định ảnh hưởng đến giá, ngân sách, tồn phòng, cam kết với khách và thương hiệu.

---

# PHẦN I — KIẾN TRÚC VÀ BASELINE

## 1. Hai kiến trúc phải tách biệt

### 1.1 VENHO OS — Company Operating System (kiến trúc đã khóa)

- L0 — Constitution
- L1 — Master Plan
- L2 — Governance OS
- L3 — Planning OS
- L4 — Execution OS *(v1.1 — seven-state task lifecycle, TASKS.md, Fast Lane)*
- L5 — Production OS *(v1.2 — Production Gates, Output Registry, No Orphan Output Rule)*
- L6 — Operations OS *(v1.1 — Read-Only Operations, review cycles, event triggers)*

> **[QC E1]** v1.2 liệt kê "L5 — Knowledge OS" và dừng ở L5, mâu thuẫn với bộ docs L4/L5/L6 đã hoàn thành và khóa. v1.3 khôi phục đúng kiến trúc đã khóa; tri thức nghiệp vụ nằm ở K-Core bên dưới, không phải một L-layer. **Nếu Harry chủ đích tái cấu trúc L-layer, việc đó phải làm bằng Change Request ở L2 Governance, không làm ngầm trong sub-plan.**

Tài liệu này không tạo thêm level và không thay đổi kiến trúc đã khóa.

### 1.2 K-Core — Business Knowledge Stack

1. K1 Knowledge
2. K2 Workflow
3. K3 Memory
4. K4 Decision
5. K5 Automation
6. K6 Business

**Quy tắc:** Không đưa Agent lên K5 Automation nếu K1–K4 chưa ổn định.

### 1.3 Quan hệ với VENHO AI Studio (M01–M10) — chống build trùng **[QC E6]**

VENHO AI Studio đã hoàn thành 10 module (430 tests, offline-first). Các AI Agent trong tài liệu này **không được reimplement** năng lực đã có. Quy tắc mapping:

| Agent | Quan hệ với AI Studio | Quy tắc build |
|---|---|---|
| A3 Content & Creative | **Dùng trực tiếp pipeline M01→M02→M05→M03→M04→M07** (DNA → prompt → content → validate → approval → publish) | A3 không phải codebase mới — là workflow + persona chạy trên Studio. Config persona đã có sẵn: `marketing_agent.yaml`, `linh_an_brand_agent.yaml` |
| A1, A2, A4, A5, A6, A7, A8 | Nghiệp vụ khách sạn nằm **ngoài** phạm vi Studio hiện tại | Build mới, nhưng nếu cần cognitive planning thì đi qua **M09 Agent Studio** (goal → plan → ModuleRequest → M04) thay vì tự viết orchestration layer riêng |
| A7 Control Tower | Khác M10 Workspace: M10 là presentation-only cho Studio; A7 tính KPI kinh doanh khách sạn | Không trộn lẫn — A7 có thể xuất snapshot cho M10 hiển thị, nhưng logic tính toán thuộc A7 |

**Nguyên tắc bất biến kế thừa từ Studio:** approval gate trước publish; config-first (YAML); mock/offline trong tests; single-purpose module; archive thuộc module con.

## 2. Baseline kinh doanh

| Chỉ số | Baseline quản trị |
|---|---:|
| Số phòng | 12 |
| Occupancy tham chiếu | 56% |
| ADR tham chiếu | 590.000 VND |
| Doanh thu "không hành động" | Khoảng 1,49 tỷ VND/năm |
| Ancillary hiện tại | Khoảng 0–3% doanh thu phòng |
| Review Agoda | 8,5/10 |
| Điểm vị trí | 9,2/10 |
| Điểm cleanliness/room cần cải thiện | Khoảng 7,9/10 |
| Nguồn lực | Solo founder + front office nhỏ |
| Ngân sách kiểm soát năm đầu | Tối đa 200 triệu VND |

Đây là baseline quản trị, không phải forecast kế toán được bảo đảm.

## 3. Chiến lược kênh năm 1

Kênh cốt lõi:

1. **Direct:** website, Google Hotel, Google Business Profile, điện thoại, Zalo.
2. **Agoda:** OTA trọng tâm cho demand APAC và visibility.
3. **Booking.com:** bổ sung demand quốc tế, khách công tác và độ phủ tìm kiếm.

Không mở thêm OTA mới trong năm 1 nếu ba kênh hiện tại chưa ổn định.

### Channel Manager — nguyên tắc an toàn

Với Agoda + Booking.com + Direct, đồng bộ tồn phòng thủ công có rủi ro overbooking. Vì vậy ưu tiên booking engine có two-way sync. Nếu không có, phải triển khai channel manager khi xuất hiện một trong các trigger:

- Booking đa kênh vượt 15 booking/tuần.
- Cần chỉnh tồn phòng thủ công trên 3 lần/ngày.
- Xảy ra near-overbooking hoặc overbooking.
- Founder/front office mất quá 3 giờ/tuần cho việc đồng bộ tồn phòng.

Mục tiêu tiết kiệm chi phí không được đặt cao hơn an toàn tồn phòng.

**Deadline cứng [QC E7]:** vendor booking engine cho direct phải chốt trước **15/09/2026**. Tiêu chí: two-way sync (hoặc lộ trình channel manager rõ), thanh toán ngay, mobile-first, song ngữ, feed giá cho Google Hotel, export dữ liệu sạch cho K3/A1.

---

# PHẦN II — DANH MỤC AI AGENT VÀ QUYỀN HẠN HUMAN

## 4. Danh mục AI Agent

| Mã | AI Agent | Mục tiêu | Ưu tiên |
|---|---|---|---|
| A1 | Guest Intelligence Agent | Chuẩn hóa dữ liệu booking, guest, kênh, revenue | Phase 1 |
| A2 | Review & Reputation Agent | Phân loại review, draft phản hồi, root-cause | Phase 1 |
| A3 | Content & Creative Agent | Copy, social, creative brief theo Visual DNA (chạy trên AI Studio) | Phase 1–2 |
| A4 | OTA Revenue Agent | Agoda/Booking.com, pricing, promotion, inventory, competitor | Phase 2 |
| A5 | Advertising Agent | Meta Ads, Google Ads, remarketing, budget recommendation | Phase 2 |
| A6 | Direct & CRM Agent | Pre-arrival, in-stay, post-stay, upsell, repeat | Phase 3 |
| A7 | Control Tower Agent | KPI, cảnh báo, monthly review | Phase 1–4 (liên tục) |
| A8 | Corporate Sales Assistant | Account list, proposal, follow-up, tracking | Phase 3 |

## 5. Ma trận Human-in-the-loop

| Hoạt động | AI được làm | Human bắt buộc làm |
|---|---|---|
| Dữ liệu | Thu thập, chuẩn hóa, phân tích | Xác nhận dữ liệu sai/thiếu |
| Giá phòng | Đề xuất giá và lý do | Phê duyệt giá, min-stay, close-out |
| Promotion OTA | Mô phỏng và đề xuất | Bật/tắt promotion, chấp nhận commission |
| Inventory | Cảnh báo và đề xuất | Phê duyệt cho đến khi sync an toàn |
| Review | Phân loại, draft | Duyệt tình huống nhạy cảm, xử lý vật lý |
| Quảng cáo | Lập plan, tạo variant, theo dõi | Launch, tăng ngân sách, duyệt claim |
| Content | Draft copy và brief | Duyệt tính xác thực và thương hiệu |
| CRM | Soạn và chạy flow đã duyệt | Khiếu nại, hoàn tiền, ngoại lệ |
| Corporate sales | Research, proposal, follow-up draft | Gặp, đàm phán, ký thỏa thuận |
| Housekeeping | Checklist, cảnh báo | Thực hiện, đào tạo, kiểm tra phòng |

---

# PHẦN III — PHẠM VI CHI TIẾT CÁC AGENT

## 6. A1 — Guest Intelligence Agent

### Chức năng

- Nhập dữ liệu PMS/Skyhotel, OTA, booking engine và file vận hành.
- Chuẩn hóa: ngày ở, ngày đặt, room type, channel, ADR, LOS, lead time, cancellation, quốc tịch, ancillary, repeat guest.
- Kiểm tra dữ liệu thiếu, trùng và sai định dạng.
- Tạo daily pickup và weekly performance.
- Cấp dữ liệu cho A4, A5 và A7.

### Definition of Done MVP

- ≥95% booking có đủ trường bắt buộc.
- Daily pickup chạy ổn định.
- Một Source of Truth duy nhất.
- Không còn nhiều file số liệu mâu thuẫn.

**Phụ thuộc:** schema input phụ thuộc vendor booking engine (deadline 15/09/2026) — thiết kế schema K3 v0 phải abstraction đủ để đổi vendor không vỡ pipeline.

## 7. A2 — Review & Reputation Agent

### Chức năng

- Thu thập review Agoda, Booking.com, Google.
- Phân loại: cleanliness, noise, mattress, bathroom, staff, view, location, value.
- Draft phản hồi song ngữ.
- Gắn mức độ: normal, complaint, high-risk, compensation required.
- Tạo weekly root-cause report.

### Guardrail

Không tự hứa bồi thường, hoàn tiền hoặc nhận lỗi pháp lý.

### KPI

- ≥95% review phản hồi trong 48 giờ từ hết Phase 2.
- Ít nhất một root-cause được xử lý thực tế mỗi tháng.
- Review tổng thể hướng tới 8,8/10.

## 8. A3 — Content & Creative Agent

### Chức năng

- Room copy song ngữ cho website và OTA.
- Social content theo content pillars đã khóa.
- Dùng Visual DNA Ven Hồ và Character Bible Linh An.
- Creative brief cho social, Reels, ads, seasonal package và landing page.
- Tái sử dụng một nội dung thành nhiều định dạng.

### Kiến trúc **[QC E6]**

A3 = workflow chạy trên VENHO AI Studio, không phải hệ mới: DNA (M01) → Prompt (M02) → Content (M05) / Video package (M06) → Validate (M03) → Approval (M04) → Publish (M07) → Analytics (M08). Persona qua M09 (`marketing_agent`, `linh_an_brand_agent`).

### Authenticity Guardrail

- Ảnh Agoda/Booking.com phải là ảnh thật hoặc ảnh thật được chỉnh hợp lý.
- Không dùng ảnh AI để đại diện sai cho phòng thật.
- Linh An phải được thể hiện là virtual brand persona.
- Không đưa claim chưa kiểm chứng vào quảng cáo hoặc OTA.

**Open item giữ từ v1.1 [QC E7]:** chuẩn disclosure Linh An theo từng platform (Instagram/TikTok/Facebook) phải hoàn thành **trước khi tách kênh KOL riêng** (dự kiến sau Q2/2027, khi canonical image engine và batch production đã ổn định).

## 9. A4 — OTA Revenue Agent

### Phạm vi

- Agoda.
- Booking.com.
- Direct rate parity.
- Google Hotel hỗ trợ direct.

### 9.1 OTA Content Management

- Audit tên phòng, mô tả, tiện nghi, chính sách, FAQ và ảnh.
- Kiểm tra đồng nhất giữa Agoda, Booking.com và website.
- Cảnh báo nội dung thiếu hoặc gây kỳ vọng sai.
- Đề xuất copy song ngữ theo từng OTA.

### 9.2 Pricing & Revenue Recommendation

Theo dõi occupancy, pickup, lead time, weekday/weekend, mùa, event, view/no-view, cancellation và competitor rate.

Đề xuất: BAR · Non-refundable · Mobile rate · LOS · Last-minute · Early bird · Corporate · Premium view.

Mỗi đề xuất phải có lý do, dữ liệu hỗ trợ, expected impact, risk và thời hạn áp dụng.

### 9.3 Promotion Management

Agoda: AGX/Sponsored Listing · Mobile · Early Bird · Last Minute · Campaign/flash deal khi phù hợp.

Booking.com: Genius · Mobile Rate · Country Rate · Basic Deal · Visibility program chỉ sau khi đo contribution net.

Agent phải tính giá net sau commission, promotion, media fee, payment fee và discount.

### 9.4 Inventory & Restriction

- Cảnh báo overbooking.
- Đề xuất stop-sell, min-stay, close-out.
- Kiểm tra parity và inventory mismatch.
- Chưa tự thay inventory trong Phase 1–2 nếu chưa có API/channel manager ổn định.

### 9.5 Competitor Monitoring

Theo dõi 5–8 đối thủ cùng khu vực, phân khúc, view và mức review. Không tự giảm giá chỉ vì đối thủ giảm.

### 9.6 Approval Levels

- Level 0: chỉ đọc và báo cáo.
- Level 1: đề xuất, founder duyệt từng thay đổi.
- Level 2: tự áp dụng trong price band đã duyệt.
- Level 3: automation rộng sau tối thiểu 90 ngày dữ liệu ổn định.

Mục tiêu năm đầu tối đa là Level 2.

### KPI OTA

- Overbooking do sync: 0.
- Content completeness: 100%.
- Review response SLA: ≥95%.
- ADR cuối kỳ: khoảng 740.000 VND.
- Contribution net theo kênh được tính hàng tháng.
- **Checkpoint cuối Q4/2026 [QC E8]:** nếu weekday occupancy <55% **hoặc direct share <16–18%**, kích hoạt corrective plan (ưu tiên Google Hotel + direct trước khi tăng chi OTA).

## 10. A5 — Advertising Agent

### Phạm vi

- Google Ads.
- Meta Ads.
- Remarketing.
- Creative testing.
- Budget/anomaly monitoring.
- Attribution và ROAS.

### Điều kiện trước khi chạy ads

Không scale media trước khi:

1. Landing và booking flow hoạt động tốt.
2. GA4, Meta Pixel và conversion events pass end-to-end.
3. Tracking chạy đúng tối thiểu 14 ngày.
4. Giá/inventory giữa Direct và OTA không mâu thuẫn nghiêm trọng.
5. Root-cause cleanliness cấp cao đã được xử lý.

### Google Ads Roadmap

- **G1 Brand Protection:** Branded Search, Google Business, Google Hotel.
- **G2 High-intent Search:** "hotel West Lake Hanoi", "hotel near West Lake", "lake view hotel Hanoi".
- **G3 Remarketing:** visitor và booking abandoner.
- **G4 Expansion:** Performance Max chỉ sau khi tracking và creative đủ dữ liệu.

### Meta Ads Roadmap **[QC E5 — đổi nhãn M1/M2/M3 → MT1/MT2/MT3 để tránh đụng độ tên module]**

- **MT1 Remarketing:** website visitors, social engagers, video viewers.
- **MT2 Offer Campaign:** seasonal package, staycation, direct value-add, weekday/workcation.
- **MT3 Prospecting:** broad/Advantage, lookalike khi đủ dữ liệu.

### Nhiệm vụ

- Campaign brief và naming convention.
- Creative variants.
- UTM check.
- Theo dõi spend, CTR, CPC, CVR, CPA, ROAS.
- Phát hiện tracking anomaly.
- Đề xuất pause, scale hoặc chuyển budget.
- Weekly ads report và monthly learning log.

### Quyền hạn **[QC E9 — làm rõ mốc thời gian]**

Agent không tự launch, tăng tổng ngân sách, đổi offer hoặc dùng claim chưa duyệt. **Kể từ khi Phase 3 bắt đầu (Thg 2/2027)** và chỉ khi Gate Phase 2 đã pass, Agent được điều chỉnh nhỏ trong ngân sách đã duyệt, tối đa ±10%/ngày.

### KPI ban đầu

| Campaign | Ngưỡng mục tiêu |
|---|---:|
| Google Brand/Search ROAS | ≥5,0 |
| Google/Meta Remarketing ROAS | ≥4,0 |
| Meta Prospecting ROAS | ≥3,0 sau learning period |
| Tracking error | 0 lỗi nghiêm trọng |
| Budget anomaly | Cảnh báo trong 24 giờ |
| Campaign dưới 70% target | Review sau 14 ngày, không scale |

KPI phải tính theo contribution net, không chỉ doanh thu gộp.

## 11. A6 — Direct & CRM Agent

Ba flow:

1. Pre-arrival: check-in, transfer, upsell, local guide.
2. In-stay: support, Wi-Fi, breakfast/partner, late checkout, issue capture.
3. Post-stay 45–90 ngày: review request, repeat offer, seasonal reminder.

KPI:

- Direct share cuối kỳ ≥25%.
- Repeat booking có tracking nguồn.
- Ancillary đạt khoảng 70–75k/phòng bán.

## 12. A7 — Control Tower Agent

Dashboard bắt buộc:

- Occupancy, ADR, RevPAR.
- Direct share.
- Channel contribution net.
- Review score và SLA.
- Ancillary per occupied room.
- Lead time, cancellation.
- CAC/ROAS.
- Agent uptime.
- Founder hours saved.
- Open risks và open decisions.

Cảnh báo khi KPI lệch >10%, tracking hỏng, pickup thấp, giá dưới floor, inventory mismatch, budget vượt plan, complaint lặp lại hoặc workflow không chạy 4 tuần.

**Ranh giới với M10 Workspace:** A7 tính toán; M10 chỉ hiển thị. A7 có thể xuất snapshot cho M10, không ngược lại.

## 13. A8 — Corporate Sales Assistant

- Danh sách tối đa 10 account ưu tiên.
- Proposal và corporate rate sheet.
- Follow-up draft.
- Theo dõi room-night, conversion và repeat potential.

Founder thực hiện gặp gỡ và đàm phán.

---

# PHẦN IV — ROADMAP THEO GIAI ĐOẠN

## 14. Phase 0 — Preparation & Control Baseline

**Thời gian:** 14 ngày đầu tháng 8/2026
**Mục tiêu:** Khóa dữ liệu, chất lượng phòng và trách nhiệm.

### Human Execution

- Audit housekeeping: linen, mùi, ánh sáng, nước nóng, bathroom, noise.
- Chỉ định owner cho dữ liệu, review, OTA, ads.
- Xác nhận Direct + Agoda + Booking.com.
- Shortlist booking engine/channel manager (chốt vendor trước 15/09).
- Đo baseline giờ founder/tuần.
- Khóa ngân sách 200 triệu.

### AI Agent Development

- K3 schema v0.
- A1 MVP.
- Taxonomy A2.
- Control Tower markdown v0.
- Chuẩn hóa source files và naming.

### Gate

- Baseline data ≥90% completeness.
- Housekeeping critical issues có owner.
- Một Source of Truth.
- Chốt booking engine/channel sync approach.

## 15. Phase 1 — Foundation & Data Reliability

**Thời gian:** Tháng 8–9/2026
**Mục tiêu:** Dữ liệu đáng tin, review workflow và inventory an toàn.

### Human Roadmap

- Sửa chữa vật lý ưu tiên.
- Đào tạo front office dùng checklist.
- Audit Agoda/Booking.com listing.
- Chụp lại ảnh thật cần thiết.
- Chốt booking engine và sync (deadline 15/09).
- Duyệt response tone và escalation rules.

### AI Agent Roadmap

- A1 v1.
- A2 v1.
- A7 v0.
- A3 v0 (pilot trên Studio pipeline, content social/mood — không phải ảnh listing).
- A4 Level 0 read-only.

### Deliverables

- Hotel Knowledge Base v1.
- Review taxonomy.
- Daily pickup.
- Weekly root-cause.
- OTA listing audit.
- Inventory sync SOP.
- Tracking architecture.

### Gate (hết Phase 1)

- Data completeness ≥95%.
- Review SLA ≥80%.
- Inventory mismatch nghiêm trọng = 0.
- Weekly operating review chạy ổn định.
- Channel sync test pass.
- **Agent chạy thật: 3 (A1, A2, A7).**

## 16. Phase 2 — Revenue Activation: OTA + Paid Acquisition

**Thời gian:** Tháng 10/2026 – Tháng 1/2027
**Mục tiêu:** Tăng ADR, conversion và demand có kiểm soát.

### Human Roadmap

- Hoàn thiện landing song ngữ.
- Kết nối Google Business/Google Hotel.
- Duyệt price floor/ceiling.
- Duyệt promotion theo date-need.
- Duyệt campaign brief Meta/Google.
- Tạo package Noel/Tết.
- Kiểm tra phòng trước high-demand dates.

### AI Agent Roadmap

- A3 v1.
- A4 Level 1.
- A5 v0–v1.
- A7 tích hợp OTA + ads.
- A2 nâng SLA.

### OTA Milestones

- Tháng 10: content parity audit.
- Tháng 11: Pricing Calendar v0 và competitor monitor.
- Tháng 12: promotion recommendation.
- Tháng 1: high-demand rules, min-stay, non-ref, premium view.

### Ads Milestones

- Tháng 10: tracking validation và campaign architecture.
- Tháng 11: Google Brand Search (G1) + remarketing pilot (G3/MT1).
- Tháng 12: seasonal campaign (MT2) + Meta remarketing.
- Tháng 1: optimize theo contribution net.

### Gate (hết Phase 2)

- Tracking pass 14 ngày.
- OTA recommendation có approval log.
- ROAS đạt ngưỡng hoặc có learning rõ.
- ADR tăng nhưng review không giảm.
- Overbooking = 0.
- Checkpoint kênh: weekday occupancy ≥55% và direct share ≥16–18%; nếu không → corrective plan.
- **Founder hours saved ≥25% — điều kiện tiên quyết để founder dồn giờ vào corporate sales Thg 2 (Decision D5 cũ). Không đạt → hoãn corporate outreach, không hoãn việc giải phóng giờ.**
- **Agent chạy thật: 6 (+A3, A4, A5).**

## 17. Phase 3 — Direct Growth, CRM & Semi-Automation

**Thời gian:** Tháng 2–4/2027
**Mục tiêu:** Giảm phụ thuộc OTA, giải phóng thời gian founder, tăng ancillary.

### Human Roadmap

- Founder tiếp cận tối đa 10 corporate accounts.
- Xây partner network: transfer, bike, café/breakfast, anniversary.
- Duyệt CRM consent và offers.
- Đàm phán corporate rate.
- Review booking engine/channel manager.

### AI Agent Roadmap

- A8 v1 (Thg 2 — phục vụ corporate sales).
- A6 v1 (Thg 3 — phục vụ CRM).
- A4 tiến Level 2 trong price band đã duyệt.
- A5 tối ưu budget theo funnel.
- A7 tính contribution net đầy đủ.

### Milestones

- Ba CRM flow chạy thật.
- Direct share 22–23% vào tháng 3.
- Ancillary đo được.
- Founder hours saved khoảng 40%.
- Pricing Calendar đủ dữ liệu high/soft season.
- **Case study nội bộ v1 hoàn thành cuối Phase 3 [QC E10]** — nền cho case study công khai ở Phase 4.

### Gate (hết Phase 3)

- Workflow chạy ≥4 tuần.
- Không có lỗi guest communication nghiêm trọng.
- Direct/corporate booking có attribution.
- A4 chứng minh tác động tích cực.
- **Agent chạy thật: 8 (+A6, A8).**

## 18. Phase 4 — Productization & External Validation

**Thời gian:** Tháng 5–7/2027
**Mục tiêu:** Case study, pilot ngoài Ven Hồ và quyết định productize.

### Human Roadmap

- Phỏng vấn 10 chủ mini hotel/homestay.
- Bán pilot cho 1–2 khách hàng.
- Onboarding và support thủ công có kiểm soát.
- Tổng kết năm và quyết định giữ/bỏ module.
- Khóa ngân sách năm 2.
- Hoàn thành chuẩn disclosure Linh An theo platform — điều kiện mở kênh KOL riêng (sau Q2/2027).

### AI Agent Roadmap

Ưu tiên productize:

1. OTA Revenue Agent / Pricing Calendar.
2. Review & Reputation Agent add-on.
3. Control Tower reporting.
4. Advertising Agent chỉ productize sau khi có case study đủ dữ liệu.

### Điều kiện productize OTA Agent

- Chạy tại Ven Hồ tối thiểu hai chu kỳ mùa vụ.
- Có dữ liệu ADR/RevPAR/contribution net.
- Chạy được cho khách sạn thứ hai mà không sửa core.
- Có audit log.
- Có onboarding checklist và DoD.

### Gate hoàn thành năm 1

- 1 case study công khai.
- 1–2 khách hàng trả tiền ngoài Ven Hồ.
- Ít nhất một module đạt Technical Validation.
- Continue/Pivot/Kill rõ cho từng Agent.
- Roadmap năm 2 dựa trên evidence.

---

# PHẦN V — ROADMAP TÁCH HUMAN VÀ AI THEO THÁNG

| Tháng | Human Roadmap | AI Agent Roadmap |
|---|---|---|
| 8/2026 | Audit phòng, housekeeping, dữ liệu, owner | A1 MVP, A2 taxonomy, A7 v0 |
| 9/2026 | Chốt booking engine/sync (15/09), OTA listing audit | A1 v1, A2 v1, A4 Level 0 |
| 10/2026 | Landing, Google Business/Hotel, tracking | A3 v1, A5 tracking, A4 content audit |
| 11/2026 | Duyệt giá/promotion high season | A4 Pricing Calendar v0, Google Brand pilot (G1) |
| 12/2026 | Package lễ, kiểm soát trải nghiệm | A3 seasonal, Meta remarketing (MT1), A4 promo |
| 1/2027 | Duyệt min-stay/non-ref/premium view | A4 high-demand rules, A5 optimization |
| 2/2027 | Corporate outreach, partner negotiation | A8 v1, proposal generator |
| 3/2027 | CRM approval, repeat campaign | A6 v1, A7 contribution dashboard |
| 4/2027 | Ancillary deployment, pilot offer design | A4 Level 2, productization pack v0, case study nội bộ |
| 5/2027 | Staycation campaign, ICP interviews | A3 full calendar, A5 CAC comparison |
| 6/2027 | Weekday offers, pilot onboarding | A4 soft-season rules, external pilot |
| 7/2027 | Annual review, budget year 2 | Validation report, case study công khai, roadmap |

---

# PHẦN VI — KPI VÀ NGÂN SÁCH

## 19. KPI khách sạn cuối kỳ

| KPI | Mục tiêu |
|---|---:|
| Occupancy | 67–68% |
| ADR | Khoảng 740.000 VND |
| RevPAR | Khoảng 500.000 VND |
| Direct share | ≥25% |
| Agoda review | 8,8/10 |
| Ancillary | 70–75k/phòng bán |
| Overbooking do sync | 0 |

## 20. KPI AI Agent — đo theo Gate cuối mỗi Phase **[QC E2 + E4]**

**Định nghĩa "chạy thật":** Agent có người dùng thật hàng tuần, chạy liên tục ≥4 tuần, output được dùng trong quyết định vận hành (không phải demo).

| KPI | Hết Phase 1 (Thg 9) | Hết Phase 2 (Thg 1) | Hết Phase 3 (Thg 4) | Hết Phase 4 (Thg 7) |
|---|---:|---:|---:|---:|
| Agent chạy thật | 3 (A1, A2, A7) | 6 (+A3, A4, A5) | 8 (+A6, A8) | 8 ổn định |
| Workflow chạy ≥4 tuần | 2 | 5 | 8 | 10 |
| Review response <48h | 80% | 95% | 100% | 100% |
| Founder hours saved | Baseline | −25% (điều kiện tiên quyết D5) | −40% | −50% |
| External paying customer | 0 | 0 | 0–1 | 1–2 |
| Case study | 0 | 0 | 1 nội bộ | 1 công khai |

## 21. Phân bổ ngân sách 200 triệu VND

| Nhóm | Ngân sách |
|---|---:|
| Physical quality & housekeeping | 30 triệu |
| Booking engine, tracking, direct infrastructure | 35 triệu |
| Content, ảnh thật, creative | 30 triệu |
| Paid media: Google + Meta + OTA visibility | 65 triệu |
| CRM, AI tools, automation, data | 20 triệu |
| Dự phòng | 20 triệu |
| **Tổng** | **200 triệu** |

### Quy tắc giải ngân

- Media không scale trước tracking pass 14 ngày.
- Không dùng dự phòng để bù campaign kém hiệu quả.
- Nếu uplift ròng sau commission, discount và media thấp hơn 1,5 lần chi tiêu lũy kế ở review giữa kỳ, giảm media và giữ hạ tầng.
- Mọi ngân sách tăng ngoài envelope phải có Decision Record.

---

# PHẦN VII — RỦI RO, KILL RULES VÀ STACK

## 22. Rủi ro chính

| Rủi ro | Mức độ | Guardrail |
|---|---|---|
| Build Agent thay vì bán phòng | Cao | Chỉ build khi phục vụ doanh thu hiện tại |
| Build trùng năng lực AI Studio đã có | Cao | Mapping mục 1.3; A3 bắt buộc chạy trên Studio pipeline |
| Overbooking | Cao | Two-way sync hoặc channel manager trigger |
| AI giảm giá quá mức | Cao | Price floor, approval, contribution net |
| Ads chạy trước tracking | Cao | Tracking pass 14 ngày |
| Ảnh AI sai kỳ vọng | Cao | OTA dùng ảnh thật |
| Review nhạy cảm gửi sai | Cao | Escalation + human approval |
| Founder quá tải | Cao | Giới hạn WIP và Fast Lane; gate −25% giờ trước corporate sales |
| Dữ liệu khách dùng sai | Cao | Consent, access control, minimum data |
| Platform/API thay đổi | Trung bình | Manual fallback + provider abstraction |

## 23. Kill/Pivot Rules

Review sau 90 ngày nếu Agent/workflow:

- Không có người dùng thật.
- Không tạo thời gian tiết kiệm hoặc doanh thu.
- Không có feedback chất lượng.
- Lỗi vận hành vượt giá trị tạo ra.
- Không chạy ổn định đủ 4 tuần.
- Không áp dụng cho khách sạn thứ hai mà phải viết lại core.

Quyết định bắt buộc: **Continue / Simplify / Pivot / Kill**.

## 24. Development Stack

- **OpenAI:** Master Plan, sub-plan, business analysis, architecture review, QA.
- **VSCode:** môi trường triển khai chính.
- **Claude Code:** coding, refactor, implementation.
- **Codex Extension:** coding song song và review.
- **Make.com:** workflow automation giai đoạn đầu.
- **Markdown/JSON:** Source of Truth.
- **Human approval layer:** bắt buộc với giá, budget, inventory và guest commitments.

Không thêm công cụ mới khi công cụ hiện tại chưa trở thành bottleneck rõ ràng.

## 25. Thứ tự build bắt buộc **[QC E3 — sửa mâu thuẫn A6/A8]**

```text
A1 Guest Intelligence
        ↓
A2 Review + A7 Control Tower
        ↓
A3 Content (trên Studio pipeline)
        ↓
A4 OTA Revenue
        ↓
A5 Advertising
        ↓
A8 Corporate Sales (Thg 2 — theo tháng doanh thu)
        ↓
A6 Direct & CRM (Thg 3 — theo tháng doanh thu)
        ↓
Productization
```

Nguyên tắc quyết định thứ tự: **tháng doanh thu cần gì thì build cái đó** — corporate sales (Thg 2) đến trước CRM (Thg 3), nên A8 build trước A6. A4 và A5 không được automation đầy đủ nếu A1/A7 chưa cung cấp dữ liệu đủ tin cậy.

---

# PHẦN VIII — DECISIONS LOCKED V1.3

1. Channel năm 1: Direct + Agoda + Booking.com.
2. Không mở thêm OTA trước khi ba kênh hiện tại ổn định.
3. Channel manager áp dụng theo trigger an toàn; vendor booking engine chốt trước 15/09/2026.
4. Tổng ngân sách tối đa 200 triệu VND.
5. Ảnh OTA phải là ảnh thật; AI chỉ enhance hợp lý.
6. Linh An là virtual brand persona, minh bạch; kênh KOL riêng chỉ mở sau khi có chuẩn disclosure theo platform.
7. OTA Revenue Agent là Agent ưu tiên productize đầu tiên.
8. Advertising Agent chỉ productize sau khi có case study.
9. Founder phê duyệt giá, promotion, budget, inventory và cam kết với khách.
10. Roadmap luôn tách Human Execution và AI Agent Development.
11. A3 Content chạy trên VENHO AI Studio pipeline — không build hệ content thứ hai.
12. Founder hours saved −25% là gate bắt buộc trước khi bắt đầu corporate sales.

---

# PHẦN IX — DANH SÁCH CHAT CHUYÊN SÂU TIẾP THEO

1. A1 — Guest Intelligence Agent Plan.
2. A2 — Review & Reputation Agent Plan.
3. A3 — Content & Creative Agent Plan (tích hợp Studio M01–M09).
4. A4 — OTA Revenue Agent Plan: Agoda + Booking.com.
5. A5 — Advertising Agent Plan: Meta + Google.
6. A6 — Direct Booking & CRM Agent Plan.
7. A7 — Control Tower Agent Plan.
8. A8 — Corporate Sales Assistant Plan.
9. Human Operations Plan: Housekeeping + Front Office.
10. Channel Manager & Booking Engine Selection Plan (deadline 15/09).
11. Budget & Financial Control Plan.
12. Productization Plan for Mini Hotels.

Mỗi chat phải kết thúc bằng: Scope · Out of Scope · Architecture · Human roles · Agent roles · Data schema · Workflows · Approval gates · KPI · Risks · Definition of Done · Roadmap · Freeze decision.

---

# CHANGELOG v1.2 → v1.3 (QC)

| # | Lỗi | Sửa |
|---|---|---|
| E1 | Kiến trúc L-layer sai (L5 = Knowledge OS, thiếu L6) mâu thuẫn docs đã khóa | Khôi phục L0–L6 đúng (L5 Production, L6 Operations); ghi chú nếu muốn tái cấu trúc phải qua Change Request L2 |
| E2 | KPI Agent 3/5/7/8 không khớp roadmap | Sửa thành 3/6/8/8 + định nghĩa "chạy thật" |
| E3 | Sơ đồ build A6 trước A8 mâu thuẫn bảng tháng | Đảo A8 (Thg 2) trước A6 (Thg 3), ghi rõ nguyên tắc "tháng doanh thu quyết định" |
| E4 | KPI theo quý lệch ranh giới Phase | Chuyển toàn bộ KPI đo tại Gate cuối mỗi Phase |
| E5 | Nhãn Meta M1/M2/M3 đụng độ tên module | Đổi thành MT1/MT2/MT3 |
| E6 | Thiếu mapping A1–A8 ↔ AI Studio M01–M10 | Thêm mục 1.3; A3 bắt buộc chạy trên Studio; A7 tách ranh giới với M10; thêm rủi ro "build trùng" |
| E7 | Mất deadline booking engine 15/09 và open item disclosure Linh An | Khôi phục cả hai (mục 3, mục 8, Phase 4, Decisions #3 và #6) |
| E8 | Mất checkpoint direct share 16–18% cuối Q4 | Khôi phục vào KPI OTA + Gate Phase 2 |
| E9 | "Sau Phase 3" mơ hồ cho quyền A5 ±10% | Làm rõ: từ khi Phase 3 bắt đầu và Gate Phase 2 đã pass |
| E10 | Mất mốc case study nội bộ Q1/27 | Khôi phục vào Milestones Phase 3 + bảng KPI |

Bổ sung không phải sửa lỗi: Decisions #11, #12 (khóa hệ quả của E6 và của gate founder hours).
