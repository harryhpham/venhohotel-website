"use client";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

export default function AmenitiesContent() {
  const { lang } = useLang();
  const t = siteContent[lang].amenitiesPage;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D9D9D9]">
              {t.groups.map((group) => (
                <div key={group.group} className="bg-[#F7F4EF] p-8 md:p-10">
                  <p className="label-tag mb-4">{group.group}</p>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <span className="text-[#C9A84C] text-sm shrink-0">◎</span>
                        <span className="font-sans text-[#1A1A1A] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-[#EDE8E0] p-8 md:p-10">
              <p className="label-tag mb-4">{t.policyLabel}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {t.policy.map((p) => (
                  <div key={p.label}>
                    <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-1">{p.label}</p>
                    <p className="font-display text-lg text-[#1A1A1A]">{p.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
