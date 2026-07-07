# Hướng Dẫn Google Sheets Dashboard — Ven Hồ Hotel

## Tổng quan

Google Sheets làm "sổ theo dõi doanh thu" — Harry nhập liệu vào đây, biểu đồ tự cập nhật. Looker Studio kết nối với Sheets để hiển thị dashboard đẹp hơn trên điện thoại.

---

## BƯỚC 1: Tạo Google Sheets mới

1. Mở [sheets.google.com](https://sheets.google.com)
2. Nhấn **+ Trang tính mới** (New spreadsheet)
3. Đặt tên: **Ven Hồ — Dashboard Doanh Thu**

---

## BƯỚC 2: Tạo 3 tab (sheet)

Nhấn dấu **+** ở dưới cùng để thêm tab. Đặt tên 3 tab:

| Tab | Tên | Mục đích |
|-----|-----|----------|
| 1 | `Đặt phòng` | Nhập danh sách booking |
| 2 | `Dashboard` | Biểu đồ tự động |
| 3 | `Lịch phòng` | Xem phòng nào bận ngày nào |

---

## BƯỚC 3: Setup tab "Đặt phòng"

### Cột tiêu đề (hàng 1)

Nhập vào từng ô:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 |
|----|----|----|----|----|----|----|-----|
| Ngày nhận | Tên khách | Loại phòng | Check-in | Check-out | Số đêm | Nguồn | Giá (đ) |

### Dữ liệu mẫu (hàng 2 trở đi)

Mỗi lần có booking mới, nhập 1 hàng:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| 15/06/2026 | Nguyễn Văn A | Deluxe Đôi | 16/06/2026 | 18/06/2026 | 2 | Agoda | 825000 |
| 15/06/2026 | Smith John | View Hồ Tây | 17/06/2026 | 20/06/2026 | 3 | Booking.com | 0 |
| 15/06/2026 | Trần Thị B | Tiêu Chuẩn | 15/06/2026 | 16/06/2026 | 1 | Website | 412500 |

> **Cột Nguồn** chỉ dùng: `Website` / `Agoda` / `Booking.com` / `Direct`  
> **Cột Giá** nhập 0 nếu chưa biết giá (booking.com thường trả hoa hồng sau)

### Định dạng cột

- Cột A, D, E: Format → Number → **Date** (dd/mm/yyyy)
- Cột H: Format → Number → **Number** (không dùng currency để dễ tính toán)
- Cố định hàng 1: View → **Freeze → 1 row**

---

## BƯỚC 4: Setup tab "Dashboard"

Trong tab Dashboard, tạo các ô tổng hợp tự động:

### Ô tổng quan tháng hiện tại (ví dụ nhập thủ công vào ô A1:B6)

| Ô | Nhãn | Công thức |
|---|------|-----------|
| A1 | Tổng booking tháng này | `=COUNTIFS('Đặt phòng'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'Đặt phòng'!A:A,"<="&EOMONTH(TODAY(),0))` |
| A2 | Tổng doanh thu tháng này (đ) | `=SUMIFS('Đặt phòng'!H:H,'Đặt phòng'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'Đặt phòng'!A:A,"<="&EOMONTH(TODAY(),0))` |
| A3 | Booking từ Website | `=COUNTIF('Đặt phòng'!G:G,"Website")` |
| A4 | Booking từ Agoda | `=COUNTIF('Đặt phòng'!G:G,"Agoda")` |
| A5 | Booking từ Booking.com | `=COUNTIF('Đặt phòng'!G:G,"Booking.com")` |
| A6 | Booking trực tiếp | `=COUNTIF('Đặt phòng'!G:G,"Direct")` |

### Tạo biểu đồ tròn — Tỷ lệ nguồn booking

1. Chọn ô A3:B6 (nhãn + số lượng)
2. Insert → **Chart** → Chọn **Pie chart**
3. Đặt tiêu đề: "Nguồn đặt phòng"

### Tạo biểu đồ cột — Doanh thu theo tháng

Tạo bảng thủ công (hoặc dùng pivot table):

| A | B |
|---|---|
| Tháng | Doanh thu |
| Tháng 6/2026 | *(nhập tay cuối tháng)* |
| Tháng 7/2026 | *(nhập tay cuối tháng)* |

Sau đó Insert → Chart → **Column chart**

---

## BƯỚC 5: Setup tab "Lịch phòng"

Dùng để xem nhanh phòng nào trống ngày nào.

### Cấu trúc đơn giản

- Cột A: Ngày (từ 01/06 → 31/12)
- Cột B: Deluxe Đôi 1
- Cột C: Deluxe Đôi 2
- Cột D: View Hồ Tây 1
- ...đến hết 12 phòng

Nhập tên khách vào ô tương ứng với ngày họ ở. Dùng màu nền để phân biệt: xanh = có khách, trắng = trống.

> Cách đơn giản nhất: mỗi sáng Harry mở Sheets, nhìn tab Lịch phòng để biết hôm nay trống bao nhiêu phòng.

---

## BƯỚC 6: Kết nối Looker Studio (tùy chọn)

Looker Studio cho phép xem dashboard đẹp hơn, trên điện thoại, không cần mở Sheets.

### Cách tạo

1. Mở [lookerstudio.google.com](https://lookerstudio.google.com)
2. Nhấn **Create → Report**
3. Chọn data source: **Google Sheets**
4. Chọn file "Ven Hồ — Dashboard Doanh Thu" → tab "Đặt phòng"
5. Thêm các chart:
   - **Scorecard**: Tổng booking tháng, Tổng doanh thu
   - **Pie chart**: Tỷ lệ nguồn booking
   - **Time series**: Doanh thu theo ngày
6. Share link → Harry bookmark trên điện thoại

> Looker Studio miễn phí, dữ liệu tự cập nhật khi Sheets thay đổi.

---

## Quy trình hàng ngày của Harry

| Thời điểm | Việc làm |
|-----------|----------|
| **8:00 sáng** | Nhận email báo cáo từ AI Agent (tự động) |
| **8:05 sáng** | Mở Sheets → nhập booking mới từ email vào tab "Đặt phòng" |
| **Cuối tuần** | Xem tab Dashboard để review tuần |
| **Cuối tháng** | Export từ SkyHotel → copy vào Sheets để có dữ liệu đầy đủ |

---

## Lưu ý

- **SkyHotel** là nguồn dữ liệu chính xác nhất — dùng để đối chiếu cuối tháng
- **Google Sheets** là nơi tổng hợp nhanh hàng ngày từ tất cả nguồn
- **AI Agent email** giúp Harry không bỏ sót booking nào dù bận
