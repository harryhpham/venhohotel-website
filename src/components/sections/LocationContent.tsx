"use client";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

export default function LocationContent() {
  const { lang } = useLang();
  const t = siteContent[lang].locationPage;

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
            <div className="aspect-[16/7] bg-[#EDE8E0] mb-12 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.2!2d105.8277!3d21.0510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5f34524c3d%3A0xbef9e2d4a0ae86b7!2s181%20Nguy%E1%BB%85n%20%C4%90%C3%ACnh%20Thi%2C%20T%C3%A2y%20H%E1%BB%93%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2svn!4v1700000000000"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Ven Ho Hotel location map"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <p className="label-tag mb-4">{t.addressLabel}</p>
                <h2 className="font-display text-3xl text-[#1A1A1A] mb-6">
                  {t.address1}<br />{t.address2}
                </h2>
                <div className="space-y-4 font-sans text-sm text-[#6B6B6B]">
                  {t.directions.map((d) => (
                    <p key={d.from}>
                      <strong className="text-[#1A1A1A]">{d.from}:</strong><br />{d.detail}
                    </p>
                  ))}
                </div>
                <a
                  href="https://maps.google.com/?q=181+Nguyen+Dinh+Thi,+Tay+Ho,+Ha+Noi"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 font-sans text-sm text-[#C9A84C] border-b border-[#C9A84C] pb-0.5 hover:text-[#b8963d] transition-colors"
                >
                  {t.openMaps}
                </a>
              </div>

              <div>
                <p className="label-tag mb-4">{t.nearbyLabel}</p>
                <div className="divide-y divide-[#D9D9D9]">
                  {t.nearby.map((item) => (
                    <div key={item.name} className="flex justify-between items-center py-3">
                      <span className="font-sans text-[#1A1A1A] text-sm">{item.name}</span>
                      <span className="font-mono text-[#C9A84C] text-xs shrink-0 ml-4">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
