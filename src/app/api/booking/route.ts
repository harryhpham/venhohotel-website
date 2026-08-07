import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeText(value: unknown, maxLength = 500) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, maxLength);
}

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }

  const bucket = rateLimitBuckets.get(clientKey);
  if (!bucket) {
    rateLimitBuckets.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(getClientKey(req))) {
      return NextResponse.json(
        { error: "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const company = normalizeText(body.company, 120);

    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Cấu hình email chưa sẵn sàng. Vui lòng liên hệ trực tiếp qua điện thoại." },
        { status: 503 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const name = normalizeText(body.name, 120);
    const phone = normalizeText(body.phone, 40);
    const email = normalizeText(body.email, 160);
    const checkin = normalizeText(body.checkin, 20);
    const checkout = normalizeText(body.checkout, 20);
    const room = normalizeText(body.room, 80);
    const guests = normalizeText(body.guests, 20);
    const note = normalizeText(body.note, 1200);
    const source = normalizeText(body.source, 80) || "booking_page";
    // Campaign attribution captured on the landing page (see
    // lib/tracking/attribution.ts). utm_content is the Growth Agent's
    // publication_id, which is how an enquiry gets matched back to the exact
    // post that produced it — `venho-analytics attribute` consumes this value.
    const utmSource = normalizeText(body.utm_source, 120);
    const utmMedium = normalizeText(body.utm_medium, 120);
    const utmContent = normalizeText(body.utm_content, 120);

    // Validate bắt buộc
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Họ tên và số điện thoại là bắt buộc." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
      return NextResponse.json(
        { error: "Ngày trả phòng phải sau ngày nhận phòng." },
        { status: 400 }
      );
    }

    const roomLabels: Record<string, string> = {
      "deluxe-double": "Phòng Deluxe Đôi",
      "double-lake-view": "Phòng Đôi View Hồ Tây",
      "standard-triple": "Phòng Tiêu Chuẩn Ba Người",
    };

    const roomLabel = room ? (roomLabels[room] ?? room) : "Chưa chọn";
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeRoomLabel = escapeHtml(roomLabel);
    const safeGuests = escapeHtml(guests);
    const safeNote = escapeHtml(note);
    const safeSource = escapeHtml(source);
    const campaignLabel = [utmSource, utmMedium].filter(Boolean).join(" · ");
    const safeCampaign = escapeHtml(campaignLabel);
    const safeUtmContent = escapeHtml(utmContent);

    const formatDate = (d: string) => {
      if (!d) return "—";
      const [y, m, day] = d.split("-");
      if (!y || !m || !day) return escapeHtml(d);
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
                    <p style="margin:0;font-size:15px;color:#1A1A1A;font-weight:600;">${safeName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Điện Thoại</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">
                      <a href="tel:${safePhone}" style="color:#C9A84C;text-decoration:none;font-weight:600;">${safePhone}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Email</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${safeEmail || "—"}</p>
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
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${safeRoomLabel}</p>
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
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${safeGuests || "—"} người</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Nguồn</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${safeSource}</p>
                  </td>
                </tr>
                ${
                  utmContent || campaignLabel
                    ? `<tr>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Bài Đăng Dẫn Đến</p>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #EDE8E0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;">${safeUtmContent || "—"}</p>
                    ${campaignLabel ? `<p style="margin:4px 0 0;font-size:12px;color:#999;">${safeCampaign}</p>` : ""}
                  </td>
                </tr>`
                    : ""
                }
                ${
                  note
                    ? `<tr>
                  <td style="padding:14px 0;vertical-align:top;">
                    <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">Ghi Chú</p>
                  </td>
                  <td style="padding:14px 0;vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#1A1A1A;line-height:1.6;">${safeNote}</p>
                  </td>
                </tr>`
                    : ""
                }
              </table>

              <!-- CTA BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
                <tr>
                  <td align="center">
                    <a href="tel:${safePhone}"
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
