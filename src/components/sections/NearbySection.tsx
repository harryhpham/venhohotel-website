"use client";

import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

export default function NearbySection() {
  const { lang } = useLang();
  const t = siteContent[lang].nearby;
  const items = siteContent[lang].locationPage.nearby;

  return (
    <section className="py-16 md:py-32 bg-[#F7F4EF]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="mb-10 md:mb-16">
          <p className="label-tag mb-3">{t.label}</p>
          <h2 className="font-display text-3xl md:text-6xl text-[#1A1A1A]">{t.heading}</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 md:pb-0 md:grid md:grid-cols-4 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          {items.map((item) => (
            <div key={item.name} className="min-w-[160px] md:min-w-0 snap-start border border-[#D9D9D9] p-4 md:p-6 bg-white flex-shrink-0 md:flex-shrink">
              <p className="font-sans text-[#6B6B6B] text-[10px] md:text-xs tracking-widest uppercase mb-1">{item.distance}</p>
              <h3 className="font-display text-sm md:text-lg text-[#1A1A1A] leading-tight">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
