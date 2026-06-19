"use client";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

export default function AboutContent() {
  const { lang } = useLang();
  const t = siteContent[lang].aboutPage;

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-[#1B2D4F] py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <p className="label-tag text-[#C9A84C] mb-4">{t.label}</p>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl text-white max-w-2xl">{t.heading}</h1>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#F7F4EF]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              <div>
                <p className="label-tag mb-4">{t.storyLabel}</p>
                <h2 className="font-display text-3xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
                  {t.storyLine1}<br />{t.storyLine2}
                </h2>
                <div className="space-y-4 font-sans text-[#6B6B6B] text-sm leading-relaxed">
                  <p>{t.body1}</p>
                  <p>{t.body2}</p>
                  <p>{t.body3}</p>
                </div>
              </div>

              <div className="space-y-8">
                {t.values.map((v) => (
                  <div key={v.title} className="border-l-2 border-[#C9A84C] pl-5">
                    <h3 className="font-display text-xl text-[#1A1A1A] mb-2">{v.title}</h3>
                    <p className="font-sans text-[#6B6B6B] text-sm leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/lien-he" className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide hover:bg-[#b8963d] transition-colors">
                {t.cta}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
