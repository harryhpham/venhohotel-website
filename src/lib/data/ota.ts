const AGODA_BASE =
  "https://www.agoda.com/en-gb/ven-ho-hotel-h37351491/hotel/hanoi-vn.html";
const BOOKING_BASE =
  "https://www.booking.com/hotel/vn/ven-ho-tay-ho.vi.html";

export function agodaUrl(campaign: string) {
  return `${AGODA_BASE}?utm_source=venhohotel.com&utm_medium=website&utm_campaign=${campaign}`;
}

export function bookingUrl(campaign: string) {
  return `${BOOKING_BASE}?aid=304142&utm_source=venhohotel.com&utm_medium=website&utm_campaign=${campaign}`;
}
