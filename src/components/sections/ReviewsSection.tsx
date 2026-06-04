"use client";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

const scores = [
  { label: { vi: "Vị Trí",   en: "Location"   }, value: 9.2 },
  { label: { vi: "Dịch Vụ",  en: "Service"    }, value: 8.5 },
  { label: { vi: "Tiện Nghi",    en: "Amenities"  }, value: 8.1 },
  { label: { vi: "Vệ Sinh",      en: "Cleanliness"}, value: 7.9 },
  { label: { vi: "Phòng",        en: "Room"       }, value: 7.9 },
];

export default function ReviewsSection() {
  const { lang } = useLang();
  const c = siteContent[lang].reviews;
  return (
    <section className="py-20 md:py-32 bg-[#1B2D4F]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col justify-center">
            <p className="label-tag text-[#C9A84C] mb-6">{c.label}</p>
            <div className="text-[#C9A84C] font-display text-6xl leading-none mb-4">&ldquo;</div>
            <blockquote className="font-display text-2xl md:text-3xl text-white leading-relaxed italic mb-6">
              {c.featuredQuote}
            </blockquote>
            <p className="font-sans text-white/50 text-xs tracking-widest uppercase mb-8">
              &mdash; {c.featuredSource}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-5xl text-[#C9A84C] font-medium">{c.overallScore}</span>
              <div>
                <p className="font-sans text-white/80 text-sm">{c.overallLabel}</p>
                <p className="font-sans text-white/50 text-xs">{c.reviewCount}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-5">
            {scores.map((s) => (
              <div key={s.label.vi}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-sans text-white/70 text-sm">{s.label[lang]}</span>
                  <span className="font-mono text-[#C9A84C] text-sm">{s.value}</span>
                </div>
                <div className="h-px bg-white/10 relative">
                  <div className="absolute top-0 left-0 h-px bg-[#C9A84C]" style={{ width: `${(s.value / 10) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
