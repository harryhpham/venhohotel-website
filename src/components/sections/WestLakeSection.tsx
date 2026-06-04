"use client";
import Image from "next/image";
import { useLang } from "@/lib/context/LangContext";
import { siteContent, weeklyContent } from "@/lib/data/content";

export default function WestLakeSection() {
  const { lang } = useLang();
  const c = siteContent[lang].westLake;
  return (
    <section className="bg-[#1B2D4F] py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="label-tag text-[#C9A84C] mb-4">{c.label}</p>
            <h2 className="font-display text-4xl md:text-5xl xl:text-6xl text-white leading-tight mb-6">
              {c.headline[0]}<br />
              <em className="text-[#C9A84C] not-italic">{c.headline[1]}</em><br />
              {c.headline[2]}
            </h2>
            <div className="w-8 h-px bg-[#C9A84C] mb-6" />

            {/* === NỘI DUNG TUẦN NÀY (cập nhật trong content.ts) === */}
            <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed mb-8">
              {weeklyContent.websiteBody}
            </p>

            <blockquote className="border-l-2 border-[#C9A84C] pl-5 mb-4">
              <p className="font-display text-xl md:text-2xl text-white/80 italic leading-relaxed">
                &ldquo;{c.quote}&rdquo;
              </p>
            </blockquote>
            <p className="font-sans text-white/40 text-xs tracking-widest uppercase">
              &mdash; {c.quoteAuthor}
            </p>
          </div>

          <div className="relative">
            {/* === ẢNH TUẦN NÀY (cập nhật featuredImage trong content.ts) === */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={weeklyContent.featuredImage}
                alt={weeklyContent.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-[#1B2D4F]/20" />
            </div>
            <div className="absolute -bottom-5 -left-5 md:-left-8 bg-[#C9A84C] px-5 py-4">
              <p className="font-mono text-white text-2xl font-medium">{c.scoreValue}</p>
              <p className="label-tag text-white/80 mt-0.5">{c.scoreLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
