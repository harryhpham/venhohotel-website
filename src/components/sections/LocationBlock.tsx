"use client";

import { useState } from "react";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";
import { contactPayload, leadPayload } from "@/lib/tracking/meta-events";
import { currentAttribution } from "@/lib/tracking/attribution";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export default function LocationBlock() {
  const { lang } = useLang();
  const t = siteContent[lang].locationBlock;

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", date: "", note: "", company: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          checkin: form.date,
          note: form.note,
          company: form.company,
          source: "homepage_quick_contact",
          // Which published post this visit came from, if any (see
          // lib/tracking/attribution.ts).
          ...currentAttribution(),
        }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error ${res.status}`);
      }

      if (!res.ok) {
        setError(data.error || (lang === "vi" ? "Không thể gửi yêu cầu. Vui lòng thử lại." : "Cannot send request. Please try again."));
        return;
      }

      setSubmitted(true);
      window.gtag?.("event", "generate_lead", {
        event_category: "booking_form",
        form_location: "homepage_quick_contact",
      });
      window.fbq?.("track", "Lead", leadPayload("homepage_quick_contact"));
    } catch {
      setError(lang === "vi"
        ? "Không thể kết nối đến máy chủ. Vui lòng gọi trực tiếp 024 3847 4646."
        : "Cannot connect to server. Please call directly at 024 3847 4646.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-[#F7F4EF]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="mb-12 md:mb-16">
          <p className="label-tag mb-3">{t.label}</p>
          <h2 className="font-display text-4xl md:text-6xl text-[#1A1A1A]">{t.heading}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Map + info */}
          <div>
            <div className="aspect-[4/3] bg-[#EDE8E0] mb-6 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.2!2d105.8277!3d21.0510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5f34524c3d%3A0xbef9e2d4a0ae86b7!2s181%20Nguy%E1%BB%85n%20%C4%90%C3%ACnh%20Thi%2C%20T%C3%A2y%20H%E1%BB%93%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2svn!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ven Ho Hotel map"
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <span className="text-[#C9A84C] mt-0.5">◎</span>
                <div>
                  <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-0.5">{t.addressLabel}</p>
                  <p className="font-sans text-[#1A1A1A] text-sm">181 Nguyễn Đình Thi, Tây Hồ, Hà Nội</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#C9A84C] mt-0.5">◎</span>
                <div>
                  <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-0.5">{t.phoneLabel}</p>
                  <a
                    href="tel:02438474646"
                    onClick={() => window.fbq?.("track", "Contact", contactPayload("phone", "location_block"))}
                    className="font-mono text-[#1A1A1A] text-sm hover:text-[#C9A84C] transition-colors"
                  >
                    024 3847 4646
                  </a>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#C9A84C] mt-0.5">◎</span>
                <div>
                  <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-0.5">{t.checkinLabel}</p>
                  <p className="font-sans text-[#1A1A1A] text-sm">{t.checkinValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick booking form */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[#1A1A1A] mb-8">{t.formHeading}</h3>
            {submitted ? (
              <div className="bg-[#EDE8E0] p-8 text-center">
                <p className="font-display text-2xl text-[#C9A84C] mb-2">{t.thanks}</p>
                <p className="font-sans text-[#6B6B6B] text-sm">{t.confirmation}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <div>
                  <label htmlFor="lb-name" className="label-tag block mb-1.5">{t.nameLabel}</label>
                  <input
                    id="lb-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                    placeholder={t.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="lb-phone" className="label-tag block mb-1.5">{t.phoneFieldLabel}</label>
                  <input
                    id="lb-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                    placeholder={t.phonePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="lb-date" className="label-tag block mb-1.5">{t.dateLabel}</label>
                  <input
                    id="lb-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="lb-note" className="label-tag block mb-1.5">{t.noteLabel}</label>
                  <textarea
                    id="lb-note"
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] resize-none"
                    placeholder={t.notePlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C9A84C] text-[#1A1A1A] font-sans font-semibold text-sm tracking-wide py-4 hover:bg-[#b8963d] transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (lang === "vi" ? "Đang gửi..." : "Sending...") : t.submit}
                </button>
                {error && <p className="font-sans text-sm text-red-600 text-center">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
