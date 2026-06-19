"use client";

import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

const icons = ["◎", "◻", "◈", "◇", "◉", "◆"];

export default function ServicesGrid() {
  const { lang } = useLang();
  const t = siteContent[lang].services;

  return (
    <section className="py-16 md:py-32 bg-[#EDE8E0]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="mb-10 md:mb-16">
          <p className="label-tag mb-3">{t.label}</p>
          <h2 className="font-display text-3xl md:text-6xl text-[#1A1A1A]">{t.heading}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#D9D9D9]">
          {t.items.map((s, i) => (
            <div key={s.title} className="bg-[#EDE8E0] p-5 md:p-10 hover:bg-[#F7F4EF] transition-colors">
              <span className="text-[#C9A84C] text-xl md:text-2xl mb-3 md:mb-4 block">{icons[i]}</span>
              <h3 className="font-display text-base md:text-2xl text-[#1A1A1A] mb-1 md:mb-2">{s.title}</h3>
              <p className="font-sans text-[#6B6B6B] text-xs md:text-sm leading-relaxed hidden sm:block">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
