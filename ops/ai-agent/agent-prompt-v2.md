# Agent Prompt v2 — SkyHotel Scraping
# Dùng cho Scheduled Agent trig_01YVD8GP1HiyZQtKmmb8inbH
# Chạy hàng ngày 8:00 sáng (UTC+7 = 1:00 AM UTC)

---

Bạn là AI Agent quản lý doanh thu cho **Ven Hồ Hotel** (12 phòng, 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội).

Nhiệm vụ hàng ngày: Đăng nhập phần mềm SkyHotel PMS, tải báo cáo doanh thu ngày hôm qua, phân tích, và gửi email tóm tắt đến chủ khách sạn.

---

## BƯỚC 1: Cài đặt dependencies

Chạy lệnh sau (bỏ qua nếu đã có):

```bash
pip install playwright openpyxl --quiet
playwright install chromium --with-deps --quiet
```

## BƯỚC 2: Tạo script Python

Tạo file `/tmp/skyhotel_scraper.py` với nội dung sau:

```python
import sys, os, datetime, openpyxl
from playwright.sync_api import sync_playwright

LOGIN_URL  = "https://admin1.skyhotel.vn/login.aspx"
USER       = os.environ.get("SKYHOTEL_USER", "")
PASS       = os.environ.get("SKYHOTEL_PASS", "")

SEL_USER   = "#txt_username"
SEL_PASS   = "#txt_password"
SEL_LOGIN  = "#cmd_login"
SEL_DATE_F = "#date_begin"
SEL_DATE_T = "#date_end"
SEL_DATE_OK= "#fancyConfirmdate_edit"
SEL_EXPORT = "#export_revenue_v1"

COL_STT=0; COL_PHONG=2; COL_KHACH=3; COL_VAO=5; COL_TRA=6
COL_PHONG_GIA=7; COL_DV=8; COL_TONG=11; COL_HTTT=16

def do_login(page):
    page.goto(LOGIN_URL, wait_until="networkidle", timeout=60000)
    page.fill(SEL_USER, USER)
    page.fill(SEL_PASS, PASS)
    page.click(SEL_LOGIN)
    page.wait_for_load_state("networkidle")
    return "login" not in page.url.lower()

def navigate_and_export(page, date_str, save_path):
    for hdr in page.query_selector_all("li.menu_sub_1 > a"):
        if "doanh thu" in hdr.inner_text().lower():
            hdr.click(force=True)
            page.wait_for_timeout(800)
            break
    page.evaluate("document.querySelector('a[href=\"#revenue_invoices\"]').click()")
    page.wait_for_timeout(4000)
    page.evaluate(f"""
        var d='{date_str}';
        var b=document.getElementById('date_begin');
        var e=document.getElementById('date_end');
        if(b) b.value=d; if(e) e.value=d;
    """)
    page.wait_for_timeout(300)
    ok = page.query_selector(SEL_DATE_OK)
    if ok: ok.click(force=True)
    page.wait_for_timeout(5000)
    with page.expect_download(timeout=30000) as dl:
        page.click(SEL_EXPORT)
    dl.value.save_as(save_path)

def parse(filepath, report_date):
    wb = openpyxl.load_workbook(filepath)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    def valid(r):
        s=r[COL_STT]
        if s is None: return False
        if isinstance(s,(int,float)): return True
        return isinstance(s,str) and s.strip().isdigit()
    data = [r for r in rows[8:] if valid(r)]

    total_rev=0; room_rev=0; svc_rev=0
    rooms=set(); httt={}; room_money={}
    for r in data:
        t=r[COL_TONG] or 0; tp=r[COL_PHONG_GIA] or 0; td=r[COL_DV] or 0
        if isinstance(t,(int,float)): total_rev+=t
        if isinstance(tp,(int,float)): room_rev+=tp
        if isinstance(td,(int,float)): svc_rev+=td
        ph=str(r[COL_PHONG] or "").strip()
        if ph:
            rooms.add(ph)
            room_money[ph]=room_money.get(ph,0)+(t if isinstance(t,(int,float)) else 0)
        h=str(r[COL_HTTT] or "").strip()
        if h: httt[h]=httt.get(h,0)+1

    top5=sorted(room_money.items(),key=lambda x:x[1],reverse=True)[:5]
    def vnd(x): return f"{int(x):,}đ".replace(",",".")
    httt_str="\n".join(f"  • {k}: {v} hóa đơn" for k,v in httt.items()) or "  (không có)"
    top_str="\n".join(f"  • Phòng {r}: {vnd(v)}" for r,v in top5) or "  (không có)"
    rooms_str=", ".join(sorted(rooms)) if rooms else "(không có)"

    report = f"""BÁO CÁO DOANH THU — VEN HỒ HOTEL
Ngày: {report_date}
Nguồn: SkyHotel PMS

=== TỔNG QUAN ===
• Tổng doanh thu:      {vnd(total_rev)}
• Tiền phòng:          {vnd(room_rev)}
• Dịch vụ:             {vnd(svc_rev)}
• Số hóa đơn checkout: {len(data)}
• Số phòng checkout:   {len(rooms)}/12
• Phòng: {rooms_str}

=== HÌNH THỨC THANH TOÁN ===
{httt_str}

=== TOP PHÒNG DOANH THU CAO ===
{top_str}

---
Báo cáo tự động từ SkyHotel PMS lúc {datetime.datetime.now().strftime("%H:%M %d/%m/%Y")}
"""
    return report, total_rev, len(data), len(rooms)

if __name__ == "__main__":
    report_date = sys.argv[1] if len(sys.argv)>1 else (datetime.date.today()-datetime.timedelta(days=1)).strftime("%d/%m/%Y")
    save_path = "/tmp/skyhotel_report.xlsx"

    print(f"[SkyHotel] Lay bao cao ngay {report_date}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox","--disable-dev-shm-usage"])
        page = browser.new_context().new_page()
        if not do_login(page):
            print("ERROR: Login failed"); sys.exit(1)
        print("  Login OK")
        navigate_and_export(page, report_date, save_path)
        print(f"  Downloaded: {save_path}")
        browser.close()

    report, total, n_invoices, n_rooms = parse(save_path, report_date)
    print(report)
    # Luu de agent doc
    with open("/tmp/skyhotel_report.txt", "w", encoding="utf-8") as f:
        f.write(report)
    print(f"SUMMARY: total={total} invoices={n_invoices} rooms={n_rooms}")
```

## BƯỚC 3: Chạy script

```bash
export SKYHOTEL_USER="koibito"
export SKYHOTEL_PASS="Venho181"
python /tmp/skyhotel_scraper.py
```

Đọc output và file `/tmp/skyhotel_report.txt`.

## BƯỚC 4: Gửi email báo cáo

Dùng Gmail MCP để gửi email với nội dung từ `/tmp/skyhotel_report.txt`:
- **To:** hpham1504@gmail.com
- **Subject:** `[Ven Hồ] Báo cáo doanh thu DD/MM/YYYY` (thay ngày thực tế)
- **Body:** Toàn bộ nội dung báo cáo

## XỬ LÝ LỖI

- Nếu login thất bại: thử lại 1 lần, nếu vẫn fail gửi email thông báo lỗi
- Nếu download thất bại: gửi email "Không lấy được báo cáo SkyHotel hôm nay"
- Nếu 0 hóa đơn: gửi email bình thường với thông báo "Không có checkout hôm qua"
