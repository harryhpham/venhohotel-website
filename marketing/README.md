# Ven Hồ Hotel — Marketing & Analytics
**SEO · Analytics · Competitor Analysis · OTA**

---

## Modules hiện tại

| Module | Thư mục | Mô tả |
|--------|---------|-------|
| **Google Analytics GA4** | `ops/analytics/` | G-4242ESCGY7 — tracking, events |
| **SEO** | `ops/seo/` | robots.ts, sitemap.ts, JSON-LD, metadata |
| **Competitor Analysis** | `ops/competitor-analysis/` | 5 đối thủ khu Tây Hồ, Scheduled Agent |
| **AI Agent Doanh Thu** | `../venho-revenue-agent/` | Repo độc lập: Playwright → SkyHotel PMS → email |
| **OTA** | `ops/agoda/` | Agoda + Booking.com deep links, UTM |

---

## Kết quả hiện tại

- **Agoda:** 8.5/10 tổng thể · 9.2/10 vị trí (45 reviews)
- **SEO:** robots.ts, sitemap.ts (9 URLs), JSON-LD Hotel + HotelRoom
- **AI Agent:** GitHub Actions trong repo `venho-revenue-agent`; launchd local chỉ là backup

---

## OTA Links

- Agoda: `agodaUrl()` trong `src/lib/data/ota.ts`
- Booking.com: `bookingUrl()` với `aid=304142`

---

*Ven Hồ Hotel Marketing — ops/ là thư mục thực tế*
