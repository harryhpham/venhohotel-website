"use client";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

export default function StatsStrip() {
  const { lang } = useLang();
  const t = siteContent[lang].stats;
  const stats = [
    { value: "12",      label: t.rooms },
    { value: "8.5/10", label: t.agoda },
    { value: "9.2/10", label: t.location },
    { value: "24/7",   label: t.service },
  ];
  return (
    <section className="bg-[#1B2D4F] py-6 md:py-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-white/20">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center py-2">
              <span className="font-mono text-xl md:text-3xl text-[#C9A84C] font-medium tracking-tight">{stat.value}</span>
              <span className="label-tag text-white/60 mt-1 text-[0.6rem] md:text-[0.65rem]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
