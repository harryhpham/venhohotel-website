"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useLang } from "@/lib/context/LangContext";
import { bookingUrl } from "@/lib/data/ota";
import { bookingIntentPayload } from "@/lib/tracking/meta-events";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookingBar() {
  const { lang } = useLang();
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [today, setToday] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const start = new Date();
      start.setDate(start.getDate() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      setToday(formatDate(new Date()));
      setCheckin(formatDate(start));
      setCheckout(formatDate(end));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkin || !checkout || checkout <= checkin) {
      setError(lang === "vi" ? "Ngày trả phòng phải sau ngày nhận phòng." : "Check-out must be after check-in.");
      return;
    }

    setError("");
    window.gtag?.("event", "booking_search", { source: "homepage_booking_bar", checkin, checkout, guests });
    window.fbq?.("track", "ViewContent", bookingIntentPayload("homepage_booking_bar"));
    window.open(bookingUrl("homepage_booking_bar", { checkin, checkout, adults: guests, lang }), "_blank", "noopener,noreferrer");
  }

  const copy = lang === "vi" ? {
    eyebrow: "Đặt phòng trực tuyến",
    title: "Kiểm tra phòng trống",
    checkin: "Nhận phòng",
    checkout: "Trả phòng",
    guests: "Số khách",
    guestUnit: "khách",
    search: "Kiểm tra trên Booking.com",
    direct: "Yêu cầu giá trực tiếp",
    note: "Booking.com xác nhận phòng ngay. Đặt trực tiếp để được tư vấn yêu cầu đặc biệt.",
  } : {
    eyebrow: "Online booking",
    title: "Check availability",
    checkin: "Check-in",
    checkout: "Check-out",
    guests: "Guests",
    guestUnit: "guests",
    search: "Check on Booking.com",
    direct: "Request a direct rate",
    note: "Booking.com offers instant confirmation. Contact us directly for special requests.",
  };

  return (
    <section id="booking" className="scroll-mt-20 border-b border-[#D9D9D9] bg-white py-8 md:py-10">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 xl:px-20">
        <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div>
            <p className="label-tag mb-2 text-[#80651F]">{copy.eyebrow}</p>
            <h2 className="font-display text-3xl text-[#1A1A1A] md:text-4xl">{copy.title}</h2>
          </div>
          <p className="max-w-xl font-sans text-xs leading-relaxed text-[#5A5A5A] md:text-right">{copy.note}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_0.75fr_1.35fr] md:items-end">
          <label className="block">
            <span className="mb-2 block font-sans text-xs font-semibold text-[#454545]">{copy.checkin}</span>
            <input
              type="date"
              required
              min={today}
              value={checkin}
              onChange={(event) => setCheckin(event.target.value)}
              className="h-12 w-full border border-[#BEBEBE] bg-white px-3 font-sans text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#9A7A28]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-sans text-xs font-semibold text-[#454545]">{copy.checkout}</span>
            <input
              type="date"
              required
              min={checkin || today}
              value={checkout}
              onChange={(event) => setCheckout(event.target.value)}
              className="h-12 w-full border border-[#BEBEBE] bg-white px-3 font-sans text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#9A7A28]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-sans text-xs font-semibold text-[#454545]">{copy.guests}</span>
            <select
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="h-12 w-full border border-[#BEBEBE] bg-white px-3 font-sans text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#9A7A28]"
            >
              {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {copy.guestUnit}</option>)}
            </select>
          </label>
          <button type="submit" className="flex h-12 items-center justify-center bg-[#C9A84C] px-4 font-sans text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#B89635]">
            {copy.search}
          </button>
        </form>

        <div className="mt-3 flex min-h-6 flex-wrap items-center justify-between gap-2">
          <p className="font-sans text-xs text-red-700" role="alert">{error}</p>
          <Link href="/lien-he" className="font-sans text-xs font-semibold text-[#1A1A1A] underline decoration-[#C9A84C] underline-offset-4 hover:text-[#80651F]">
            {copy.direct}
          </Link>
        </div>
      </div>
    </section>
  );
}
