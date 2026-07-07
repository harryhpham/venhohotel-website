"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";
import { agodaUrl, bookingUrl } from "@/lib/data/ota";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

export default function ContactClient() {
  const { lang } = useLang();
  const t = siteContent[lang].contactPage;

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", checkin: "", checkout: "", room: "", guests: "", note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_page" }),
      });

      let data: { error?: string; success?: boolean } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error ${res.status}`);
      }

      if (res.ok) {
        setSubmitted(true);
        trackEvent("generate_lead", {
          event_category: "booking_form",
          room_type: form.room || "not_selected",
        });
        trackPixel("Lead", {
          content_name: form.room || "not_selected",
          num_guests: form.guests || "0",
          checkin: form.checkin || "",
          checkout: form.checkout || "",
        });
      } else {
        setError(data.error || t.errorDefault);
      }
    } catch {
      setError(t.errorNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-[#1B2D4F] py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <p className="label-tag text-[#C9A84C] mb-4">{t.label}</p>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl text-white">{t.heading}</h1>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#F7F4EF]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A] mb-8">{t.infoHeading}</h2>
                <div className="space-y-6">
                  {t.infoItems.map((item) => (
                    <div key={item.label} className="border-b border-[#D9D9D9] pb-5">
                      <p className="label-tag mb-1">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={item.track ? () => {
                            trackEvent(item.track, { event_category: "contact" });
                            trackPixel(item.pixelEvent);
                          } : undefined}
                          className="font-sans text-[#1A1A1A] hover:text-[#C9A84C] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-sans text-[#1A1A1A]">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-[#D9D9D9]">
                  <p className="label-tag mb-4">
                    {lang === "vi" ? "Đặt Phòng Trực Tuyến" : "Book Online"}
                  </p>
                  <div className="border border-[#D9D9D9] bg-white px-5 py-4 mb-3">
                    <p className="font-display text-xl text-[#1A1A1A] mb-1">
                      {t.directTitle}
                    </p>
                    <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                      {t.directBody}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {t.directBenefits.map((benefit) => (
                        <span key={benefit} className="label-tag border border-[#EDE8E0] px-2.5 py-1 text-[#6B6B6B]">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a
                      href={agodaUrl("contact_page")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent("agoda_click", { event_category: "ota" });
                        trackPixel("InitiateCheckout", { content_name: "agoda" });
                      }}
                      className="flex items-center justify-between border border-[#D9D9D9] px-5 py-4 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors group"
                    >
                      <span className="font-sans text-sm text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                        {lang === "vi" ? "Xem Ven Hồ trên Agoda" : "View Ven Ho on Agoda"}
                      </span>
                      <span className="font-sans text-xs text-[#6B6B6B] group-hover:text-[#C9A84C] transition-colors">8.5 ★</span>
                    </a>
                    <a
                      href={bookingUrl("contact_page")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent("booking_click", { event_category: "ota" });
                        trackPixel("InitiateCheckout", { content_name: "booking_com" });
                      }}
                      className="flex items-center justify-between border border-[#D9D9D9] px-5 py-4 hover:border-[#003580] hover:text-[#003580] transition-colors group"
                    >
                      <span className="font-sans text-sm text-[#1A1A1A] group-hover:text-[#003580] transition-colors">
                        {lang === "vi" ? "Đặt qua Booking.com" : "Book on Booking.com"}
                      </span>
                      <span className="font-sans text-xs text-[#6B6B6B] group-hover:text-[#003580] transition-colors">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A] mb-8">{t.formHeading}</h2>
                {submitted ? (
                  <div className="bg-[#EDE8E0] p-10 text-center">
                    <p className="font-display text-3xl text-[#C9A84C] mb-3">{t.thanks}</p>
                    <p className="font-sans text-[#6B6B6B]">{t.confirmation}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {t.fields.map((f) => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className="label-tag block mb-1.5">{f.label}</label>
                        <input
                          id={f.id}
                          type={f.type}
                          required={f.required}
                          placeholder={f.placeholder}
                          value={(form as Record<string, string>)[f.id]}
                          onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                          className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                        />
                      </div>
                    ))}

                    <div>
                      <label htmlFor="room" className="label-tag block mb-1.5">{t.roomLabel}</label>
                      <select
                        id="room"
                        value={form.room}
                        onChange={(e) => setForm({ ...form, room: e.target.value })}
                        className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                      >
                        <option value="">{t.roomPlaceholder}</option>
                        {t.roomOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="note" className="label-tag block mb-1.5">{t.noteLabel}</label>
                      <textarea
                        id="note"
                        rows={4}
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] resize-none"
                        placeholder={t.notePlaceholder}
                      />
                    </div>

                    {error && <p className="font-sans text-sm text-red-600 text-center">{error}</p>}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide py-4 hover:bg-[#b8963d] transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? t.submitting : t.submit}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
