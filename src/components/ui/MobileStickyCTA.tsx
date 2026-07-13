"use client";

import Link from "next/link";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function trackPhoneClick() {
  window.gtag?.("event", "phone_click", {
    event_category: "contact",
    source: "mobile_sticky_cta",
  });
  window.fbq?.("track", "Contact", { source: "mobile_sticky_cta" });
}

function trackBookingClick() {
  window.gtag?.("event", "booking_cta_click", {
    event_category: "direct_booking",
    source: "mobile_sticky_cta",
  });
  window.fbq?.("track", "Lead", { source: "mobile_sticky_cta" });
}

export default function MobileStickyCTA() {
  const { lang } = useLang();
  const t = siteContent[lang].mobileCta;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D9D9D9] bg-white/96 px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-2">
        <a
          href="tel:02438474646"
          onClick={trackPhoneClick}
          className="flex min-w-0 items-center justify-center border border-[#D9D9D9] px-2 text-center font-sans text-xs font-semibold text-[#1A1A1A] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
        >
          {t.call}
        </a>
        <Link
          href="/#booking"
          onClick={trackBookingClick}
          className="flex min-w-0 items-center justify-center bg-[#C9A84C] px-2 text-center font-sans text-xs font-semibold text-[#1A1A1A] transition-colors hover:bg-[#b8963d]"
        >
          {t.book}
        </Link>
      </div>
    </div>
  );
}
