"""
SkyHotel Scraper -- Ven Ho Hotel
Playwright script de dang nhap SkyHotel, export bao cao doanh thu, parse Excel.
Tat ca selectors da xac nhan qua discovery run.
"""

import sys
import os
import datetime
import smtplib
import openpyxl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from playwright.sync_api import sync_playwright

# --- CONFIG -------------------------------------------------------------------
LOGIN_URL     = "https://admin1.skyhotel.vn/login.aspx"

SKYHOTEL_USER = os.environ.get("SKYHOTEL_USER", "")
SKYHOTEL_PASS = os.environ.get("SKYHOTEL_PASS", "")

GMAIL_USER    = os.environ.get("GMAIL_USER", "")
GMAIL_APP_PASS = os.environ.get("GMAIL_APP_PASS", "")

# --- SELECTORS (tat ca da xac nhan) ------------------------------------------
SEL_USERNAME       = "#txt_username"
SEL_PASSWORD       = "#txt_password"
SEL_LOGIN_BTN      = "#cmd_login"
REVENUE_HASH       = "revenue_invoices"          # hash cua trang Doanh thu hoa don
SEL_DATE_FROM      = "#date_begin"               # input ngay bat dau
SEL_DATE_TO        = "#date_end"                 # input ngay ket thuc
SEL_DATE_OK        = "#fancyConfirmdate_edit"    # button OK cua date picker
SEL_EXPORT         = "#export_revenue_v1"        # button Xuat File
# -----------------------------------------------------------------------------

# Excel column indices (row 7 = headers, data starts row 8)
COL_STT       = 0   # STT
COL_MA_HD     = 1   # Ma hoa don
COL_PHONG     = 2   # Ten phong
COL_KHACH     = 3   # Ten khach hang
COL_VAO_LUC   = 5   # Checkin time
COL_TRA_LUC   = 6   # Checkout time
COL_TIEN_PHONG = 7  # Tien phong
COL_TIEN_DV   = 8   # Tien dich vu
COL_PHU_THU   = 9   # Phu thu
COL_GIAM_TRU  = 10  # Giam tru
COL_TONG_CONG = 11  # Tong cong (doanh thu)
COL_HINH_THUC = 16  # Hinh thuc thanh toan
COL_TRANG_THAI = 15 # Trang thai


def do_login(page):
    page.goto(LOGIN_URL, wait_until="networkidle", timeout=30000)
    page.fill(SEL_USERNAME, SKYHOTEL_USER)
    page.fill(SEL_PASSWORD, SKYHOTEL_PASS)
    page.click(SEL_LOGIN_BTN)
    page.wait_for_load_state("networkidle")
    return "login" not in page.url.lower()


def navigate_to_revenue(page, date_str: str):
    """Navigate den trang Doanh thu hoa don va load du lieu theo ngay."""
    # Mo accordion "Doanh thu" va click submenu
    for header in page.query_selector_all("li.menu_sub_1 > a"):
        if "doanh thu" in header.inner_text().lower():
            header.click(force=True)
            page.wait_for_timeout(800)
            break
    page.evaluate("document.querySelector('a[href=\"#revenue_invoices\"]').click()")
    page.wait_for_timeout(4000)

    # Date picker tu mo — fill ngay bang JS roi click OK
    page.evaluate(f"""
        var d = '{date_str}';
        var b = document.getElementById('date_begin');
        var e = document.getElementById('date_end');
        if (b) b.value = d;
        if (e) e.value = d;
    """)
    page.wait_for_timeout(300)
    ok = page.query_selector(SEL_DATE_OK)
    if ok:
        ok.click(force=True)
    page.wait_for_timeout(5000)


def download_report(page, save_path: str) -> str:
    """Click Xuat File va download. Tra ve duong dan file da luu."""
    with page.expect_download(timeout=30000) as dl_info:
        page.click(SEL_EXPORT)
    download = dl_info.value
    download.save_as(save_path)
    return save_path


def parse_excel(filepath: str, report_date: str) -> dict:
    """Parse file Excel tu SkyHotel va tra ve dict tong hop doanh thu."""
    wb = openpyxl.load_workbook(filepath)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))

    # Data bat dau tu row index 8 (row 0-6 la header info, row 7 la column labels)
    # STT co the la string ('1','2',...) hoac int
    def is_data_row(r):
        stt = r[COL_STT]
        if stt is None:
            return False
        if isinstance(stt, (int, float)):
            return True
        return isinstance(stt, str) and stt.strip().isdigit()

    data_rows = [r for r in rows[8:] if is_data_row(r)]

    total_revenue = 0
    total_room_revenue = 0
    total_service_revenue = 0
    rooms_set = set()
    payment_methods = {}

    for r in data_rows:
        tong = r[COL_TONG_CONG] or 0
        tien_phong = r[COL_TIEN_PHONG] or 0
        tien_dv = r[COL_TIEN_DV] or 0
        giam = r[COL_GIAM_TRU] or 0
        phu_thu = r[COL_PHU_THU] or 0

        if isinstance(tong, (int, float)):
            total_revenue += tong
        if isinstance(tien_phong, (int, float)):
            total_room_revenue += tien_phong
        if isinstance(tien_dv, (int, float)):
            total_service_revenue += tien_dv

        phong = r[COL_PHONG]
        if phong:
            rooms_set.add(str(phong).strip())

        httt = str(r[COL_HINH_THUC] or "").strip()
        if httt:
            payment_methods[httt] = payment_methods.get(httt, 0) + 1

    # Top phong
    room_revenue = {}
    for r in data_rows:
        phong = str(r[COL_PHONG] or "").strip()
        tong = r[COL_TONG_CONG] or 0
        if phong and isinstance(tong, (int, float)):
            room_revenue[phong] = room_revenue.get(phong, 0) + tong

    top_rooms = sorted(room_revenue.items(), key=lambda x: x[1], reverse=True)[:5]

    # Khach theo ten
    guests = [str(r[COL_KHACH] or "").strip() for r in data_rows if r[COL_KHACH]]

    return {
        "report_date": report_date,
        "total_invoices": len(data_rows),
        "total_revenue": int(total_revenue),
        "room_revenue": int(total_room_revenue),
        "service_revenue": int(total_service_revenue),
        "rooms_checked_out": sorted(rooms_set),
        "rooms_count": len(rooms_set),
        "payment_methods": payment_methods,
        "top_rooms": top_rooms,
        "guests": guests,
    }


def format_vnd(amount: int) -> str:
    return f"{amount:,}đ".replace(",", ".")


def build_email_body(data: dict) -> str:
    date = data["report_date"]
    rev = format_vnd(data["total_revenue"])
    room_rev = format_vnd(data["room_revenue"])
    svc_rev = format_vnd(data["service_revenue"])
    n_invoices = data["total_invoices"]
    n_rooms = data["rooms_count"]

    rooms_str = ", ".join(data["rooms_checked_out"]) if data["rooms_checked_out"] else "(không có)"

    httt_lines = "\n".join(
        f"  • {k}: {v} hóa đơn" for k, v in data["payment_methods"].items()
    ) or "  (không có)"

    top_str = "\n".join(
        f"  • Phòng {r}: {format_vnd(int(v))}" for r, v in data["top_rooms"]
    ) or "  (không có)"

    return f"""BÁO CÁO DOANH THU — VEN HỒ HOTEL
Ngày: {date}
Nguồn: SkyHotel PMS (admin1.skyhotel.vn)

=== TỔNG QUAN ===
• Tổng doanh thu:      {rev}
• Tiền phòng:          {room_rev}
• Dịch vụ:             {svc_rev}
• Số hóa đơn checkout: {n_invoices}
• Số phòng checkout:   {n_rooms}
• Phòng: {rooms_str}

=== HÌNH THỨC THANH TOÁN ===
{httt_lines}

=== TOP PHÒNG DOANH THU CAO ===
{top_str}

---
Email tự động từ AI Agent lúc {datetime.datetime.now().strftime("%H:%M %d/%m/%Y")}
"""


def send_email(body: str, report_date: str) -> bool:
    if not GMAIL_USER or not GMAIL_APP_PASS:
        print("[Email] GMAIL_USER / GMAIL_APP_PASS chua set — bo qua gui email")
        return False
    subject = f"[Ven Hồ] Báo cáo doanh thu {report_date}"
    msg = MIMEMultipart()
    msg["From"] = GMAIL_USER
    msg["To"] = GMAIL_USER
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as srv:
            srv.login(GMAIL_USER, GMAIL_APP_PASS)
            srv.send_message(msg)
        print(f"[Email] Da gui den {GMAIL_USER}")
        return True
    except Exception as e:
        print(f"[Email] Loi: {e}")
        return False


def run(report_date: str = None, download_dir: str = None) -> dict:
    """
    Chay full flow: login -> export -> parse -> tra ve dict + email body.
    report_date: 'dd/mm/yyyy', mac dinh la hom qua.
    download_dir: thu muc luu file xlsx, mac dinh la thu muc cua script.
    """
    if not report_date:
        report_date = (datetime.date.today() - datetime.timedelta(days=1)).strftime("%d/%m/%Y")
    if not download_dir:
        download_dir = os.path.dirname(__file__) or "."

    if not SKYHOTEL_USER or not SKYHOTEL_PASS:
        raise ValueError("Thieu credentials: set SKYHOTEL_USER va SKYHOTEL_PASS env vars")

    save_path = os.path.join(download_dir, "skyhotel_report.xlsx")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        page = browser.new_context().new_page()

        if not do_login(page):
            raise RuntimeError("Dang nhap SkyHotel that bai")

        navigate_to_revenue(page, report_date)
        download_report(page, save_path)
        browser.close()

    data = parse_excel(save_path, report_date)
    data["email_body"] = build_email_body(data)
    send_email(data["email_body"], report_date)
    return data


if __name__ == "__main__":
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

    report_date = sys.argv[1] if len(sys.argv) > 1 else None
    result = run(report_date)
    print(result["email_body"])
    print(f"\nDu lieu raw:")
    for k, v in result.items():
        if k != "email_body":
            print(f"  {k}: {v}")
