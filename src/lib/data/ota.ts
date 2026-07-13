const AGODA_BASE =
  "https://www.agoda.com/en-gb/ven-ho-hotel-h37351491/hotel/hanoi-vn.html";
const BOOKING_BASE =
  "https://www.booking.com/hotel/vn/ven-ho-tay-ho.vi.html";
const BOOKING_LABEL =
  "gen173nr-10CBkoggI46AdIM1gEaPQBiAEBmAEzuAEHyAEM2AED6AEB-AEBiAIBqAIBuAKyqbPSBsACAdICJDIwMDg1MTZkLWJlMTgtNGRkMC04YzViLTYyYTFkM2JmMDI1Y9gCAeACAQ";

export function agodaUrl(campaign: string) {
  return `${AGODA_BASE}?utm_source=venhohotel.com&utm_medium=website&utm_campaign=${campaign}`;
}

type BookingOptions = {
  checkin?: string;
  checkout?: string;
  adults?: number;
  rooms?: number;
  lang?: "vi" | "en";
};

export function bookingUrl(campaign: string, options: BookingOptions = {}) {
  const params = new URLSearchParams({
    aid: "304142",
    label: BOOKING_LABEL,
    utm_source: "venhohotel.com",
    utm_medium: "website",
    utm_campaign: campaign,
    group_adults: String(options.adults ?? 2),
    no_rooms: String(options.rooms ?? 1),
    group_children: "0",
    lang: options.lang === "en" ? "en-gb" : "vi",
  });

  if (options.checkin) params.set("checkin", options.checkin);
  if (options.checkout) params.set("checkout", options.checkout);

  return `${BOOKING_BASE}?${params.toString()}`;
}
