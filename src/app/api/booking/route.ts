import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Cấu hình email chưa sẵn sàng. Vui lòng liên hệ trực tiếp qua điện thoại." },
        { status: 503 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const { name, phone, email, checkin, checkout, room, guests, note } = body;

    // Validate bắt buộc
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Họ tên và số điện thoại là bắt buộc." },
        { status: 400 }
      );
    }

    const roomLabels: Record<string, string> = {
      "deluxe-double": "Phòng Deluxe Đôi",
      "double-lake-view": "Phòng Đôi View Hồ Tây",
      "standard-triple": "Phòng Tiêu Chuẩn Ba Người",
    };

    const roomLabel = room ? (roomLabels[room] ?? room) : "Chưa chọn";

    const formatDate = (d: string) => {
      if (!d) return "—";
      const [y, m, day] = d.split("-");
      return `${day}/${m}/${y}`;
    };

    const htmlEmail = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Yêu Cầu Đặt Phòng Mới</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F4EF;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F4EF;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#1B2D4F;padding:40px 48px;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;font-weight:600;">VEN HỒ HOTEL</p>
              <h1 style="margin:12px 0 0;font-size:28px;color:#ffffff;font-weight:400;letter-spacing:1px;">Yêu Cầu Đặt Phòng Mới</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#8EA3BF;">181 Nguyễn Đình Thi, Tây Hồ, Hà Nội</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
                Có một yêu cầu đặt phòng mới vừa được gửi qua website. Vui lòng liên hệ lại với khách trong vòng <strong>24 giờ</strong>.
              </p>

              <!-- INFO TABLE -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td colspan="2" style="padding-bottom:16px;border-bottom:2px solid #C9A84C;">
                    <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-weight:600;">Thông Tin Khách</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;width:40%;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Họ &amp; Tên</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;font-weight:600;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Điện Thoại</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">
                      <a href="tel:${phone}" style="color:#C9A84C;text-decoration:none;font-weight:600;">${phone}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Email</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${email || "—"}</p>
                  </td>
                </tr>

                <!-- BOOKING DETAILS -->
                <tr>
                  <td colspan="2" style="padding:28px 0 16px;border-bottom:2px solid #C9A84C;">
                    <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-weight:600;">Chi Tiết Đặt Phòng</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Loại Phòng</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${roomLabel}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Nhận Phòng</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${formatDate(checkin)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Trả Phòng</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${formatDate(checkout)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Số Khách</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${guests || "—"} người</p>
                  </td>
                </tr>
                ${
                  note
                    ? `<tr>
                  <td style="padding:14px 0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Ghi Chú</p>
                  </td>
                  <td style="padding:14px 0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;line-height:1.6;">${note}</p>
                  </td>
                </tr>`
                    : ""
                }
              </table>

              <!-- CTA BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
                <tr>
                  <td align="center">
                    <a href="tel:${phone}"
                       style="display:inline-block;background-color:#C9A84C;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:16px 40px;border-radius:1px;">
                      Gọi Lại Cho Khách
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#EDE8E0;padding:24px 48px;">
              <p style="margin:0;font-size:12px;color:#888;text-align:center;line-height:1.7;">
                Ven Hồ Hotel · 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội<br/>
                📞 024 3847 4646 · 🌐 venhohotel.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const { error } = await resend.emails.send({
      from: "Ven Hồ Hotel <no-reply@venhohotel.com>",
      to: ["venhohotel@gmail.com"],
      replyTo: email || undefined,
      subject: `[Đặt Phòng] ${name} — ${formatDate(checkin)} đến ${formatDate(checkout)}`,
      html: htmlEmail,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Không thể gửi email. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
