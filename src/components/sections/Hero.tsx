"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

export default function Hero() {
  const { lang } = useLang();
  const c = siteContent[lang].hero;
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-end">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/Hero-lake/hero-lake.jpg"
          alt="Ho Tay West Lake Hanoi"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a2e]/85 via-[#1B2D4F]/30 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20 pb-16 md:pb-24">
        <p className="label-tag text-[#C9A84C] mb-4 md:mb-6">{c.label}</p>
        <h1 className="font-display text-[2.5rem] md:text-[4rem] xl:text-[6rem] leading-[1.05] text-white mb-4 md:mb-6 max-w-3xl">
          {c.headline1}<br />
          <em className="text-[#C9A84C] not-italic">{c.headline2}</em><br />
          {c.headline3}
        </h1>
        <p className="font-sans text-white/70 text-sm md:text-base mb-8 md:mb-10 tracking-wide">{c.subline}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/lien-he" className="inline-flex items-center justify-center px-7 py-3.5 bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide hover:bg-[#b8963d] transition-colors min-h-[44px]">
            {c.cta_primary}
          </Link>
          <Link href="/phong" className="inline-flex items-center justify-center px-7 py-3.5 border border-white/50 text-white font-sans text-sm tracking-wide hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors min-h-[44px]">
            {c.cta_secondary}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="label-tag text-white/50 text-[0.55rem]">{lang === "vi" ? "Cuon xuong" : "Scroll down"}</span>
        <div className="w-px h-8 bg-white/30 animate-pulse" />
      </div>
    </section>
  );
}
