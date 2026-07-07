# Phần 8 — AI Agent Quản Lý Doanh Thu

## Tổng quan

Hệ thống gồm 2 thành phần:

| Thành phần | Công cụ | Mục đích |
|------------|---------|----------|
| **Scheduled Agent** | claude.ai/code routines | Báo cáo doanh thu email mỗi sáng 8h |
| **Google Sheets Dashboard** | Google Sheets + Looker Studio | Dashboard trực quan, nhập dữ liệu thủ công |

---

## A. Scheduled Agent — Báo Cáo Doanh Thu Hàng Ngày

### Cấu hình

| Thông tin | Chi tiết |
|-----------|----------|
| Routine ID | `trig_01YVD8GP1HiyZQtKmmb8inbH` |
| Lịch chạy | Mỗi ngày **8:00 sáng** (Bangkok UTC+7) |
| Model | claude-sonnet-4-6 |
| Connector | Gmail ✅ |
| Output | Email → hpham1504@gmail.com |
| Quản lý | https://claude.ai/code/routines/trig_01YVD8GP1HiyZQtKmmb8inbH |

### Nội dung email hàng ngày

Agent đọc Gmail tìm emails booking trong 24h qua, sau đó gửi báo cáo gồm:

1. **Đặt phòng hôm nay** — tên khách, loại phòng, nguồn (Website/Agoda/Booking/Direct)
2. **Công suất phòng** — X/12 phòng đang có khách
3. **Doanh thu ước tính** — hôm nay & cả tuần
4. **Phòng trống 3 ngày tới** — để chủ động fill
5. **Cảnh báo** — nếu cuối tuần còn > 6 phòng trống
6. **Hành động đề xuất** — 1 việc cụ thể để tối ưu

### Nguồn email agent đọc

| Nguồn | Dấu hiệu nhận biết |
|-------|--------------------|
| Form website | Subject: "Yêu cầu đặt phòng" hoặc "Ven Hồ Hotel" |
| Agoda | Sender: @agoda.com, subject: "booking" / "reservation" |
| Booking.com | Sender: @booking.com, subject: "reservation" |
| SkyHotel | Từ admin.skyhotel.vn |
| Trực tiếp | Không có email — cần nhập tay vào Google Sheets |

---

## B. Google Sheets Dashboard

### Link Google Sheets

*(cập nhật link sau khi tạo)*

### Cách dùng

1. Mở Google Sheets "Ven Hồ — Dashboard Doanh Thu"
2. Vào tab **Đặt phòng** → nhập booking mới vào cuối danh sách
3. Tab **Dashboard** tự động cập nhật biểu đồ
4. Xem Looker Studio để có dashboard đẹp hơn

### Cập nhật dữ liệu khi nào

- **Hàng ngày:** nhập booking mới nhận được (từ email hoặc SkyHotel)
- **Hàng tuần:** kiểm tra dashboard tổng hợp
- **Hàng tháng:** export báo cáo từ SkyHotel → copy vào Sheets

---

## Hướng dẫn chi tiết

- Xem `agent-prompt.md` — prompt đầy đủ của Scheduled Agent
- Xem `sheets-guide.md` — hướng dẫn setup Google Sheets & Looker Studio
