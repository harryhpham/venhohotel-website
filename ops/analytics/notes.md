# Google Analytics (GA4) — Ven Hồ Hotel

> Hoàn thành: 10/06/2026

---

## Thông tin tài khoản

| Trường | Giá trị |
|--------|---------|
| Tài khoản GA4 | Ven Ho Hotel |
| Property | venhohotel.com |
| Measurement ID | `G-4242ESCGY7` |
| URL quản lý | https://analytics.google.com |
| Timezone | Vietnam (UTC+7) |
| Currency | VND |

---

## Files đã chỉnh trong codebase

### 1. `src/components/ui/GoogleAnalytics.tsx` ← file mới
Load GA4 script trên toàn site. Dùng `next/script` với `strategy="afterInteractive"` (tương đương `async` trong HTML thuần nhưng tối ưu cho Next.js).

```tsx
import Script from "next/script";

const GA_ID = "G-4242ESCGY7";

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
```

### 2. `src/app/layout.tsx` ← thêm 2 dòng
Import và render `<GoogleAnalytics />` trong Root Layout — load GA4 trên tất cả 7 trang.

```tsx
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";

// trong <body>:
<GoogleAnalytics />
```

### 3. `src/app/lien-he/page.tsx` ← thêm conversion events
- **`generate_lead`** — fire khi form đặt phòng submit thành công (kèm `room_type`)
- **`phone_click`** — fire khi khách click số điện thoại 024 3847 4646

```tsx
function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

// Sau khi form submit thành công:
trackEvent("generate_lead", {
  event_category: "booking_form",
  room_type: form.room || "not_selected",
});

// Khi click SĐT:
onClick={() => trackEvent("phone_click", { event_category: "contact" })}
```

---

## Events đang track

| Event | Trigger | Params |
|-------|---------|--------|
| `page_view` | Tự động — mọi trang | url, title |
| `generate_lead` | Submit form đặt phòng thành công | `room_type` |
| `phone_click` | Click SĐT trong trang Liên Hệ | `event_category: contact` |

---

## Cách xem data

### Realtime (ngay lập tức)
GA4 → **Reports → Realtime** — hiển thị events trong 30 phút gần nhất.

### DebugView (khi test)
GA4 → **Admin → DebugView** — cần cài extension **Google Tag Assistant** trên Chrome và bật lên.

### Reports thông thường (sau 24–48h)
- **Acquisition** — khách đến từ đâu (Google, Facebook, trực tiếp...)
- **Engagement → Events** — danh sách tất cả events
- **Engagement → Conversions** — nếu mark `generate_lead` là conversion

---

## Đánh dấu Conversion (khuyến nghị)

Để GA4 tính `generate_lead` là conversion (hiện doanh số, không chỉ traffic):

1. GA4 → **Admin → Events**
2. Tìm `generate_lead` → bật toggle **Mark as conversion**

---

## Ghi chú kỹ thuật

- Không dùng `<script>` HTML thô trong Next.js — dùng `next/script` để tránh conflict với client-side routing
- `afterInteractive` = load sau khi trang hydrate xong → không block render
- GA4 **không gửi data trên localhost** — phải test trên venhohotel.com
- DebugView yêu cầu debug mode — bật qua extension hoặc tham số URL
