"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

export default function Footer() {
  const { lang } = useLang();
  const c = siteContent[lang].contact;

  const links = [
    { href: "/phong",        label: lang === "vi" ? "Phòng" : "Rooms" },
    { href: "/tien-ich",     label: lang === "vi" ? "Tiện Ích" : "Amenities" },
    { href: "/vi-tri",       label: lang === "vi" ? "Vị Trí" : "Location" },
    { href: "/ve-chung-toi", label: lang === "vi" ? "Về Chúng Tôi" : "About" },
    { href: "/lien-he",      label: lang === "vi" ? "Liên Hệ" : "Contact" },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-8 md:mb-10">

          {/* Brand */}
          <div>
            {/* Logo in a small white pill so RGB logo shows correctly */}
            <div className="inline-block bg-white px-3 py-1.5 mb-3">
              <Image
                src="/logonew.png"
                alt="Ven Ho Hotel"
                width={100}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="font-sans text-white/50 text-sm leading-relaxed">
              {c.tagline}
            </p>
            <p className="font-sans text-white/40 text-xs mt-1">{c.address}</p>
          </div>

          {/* Nav */}
          <div>
            <p className="label-tag text-white/40 mb-3">
              {lang === "vi" ? "Điều Hướng" : "Navigation"}
            </p>
            <ul className="space-y-1.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-white/60 hover:text-[#C9A84C] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label-tag text-white/40 mb-3">
              {lang === "vi" ? "Liên Hệ" : "Contact"}
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${c.phone.replace(/\s/g, "")}`}
                className="block font-mono text-sm text-white/60 hover:text-[#C9A84C] transition-colors"
              >
                {c.phone}
              </a>
              <a
                href="https://www.facebook.com/venhohotel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-[#C9A84C] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <p className="font-sans text-white/40 text-xs">
                {lang === "vi" ? `Check-in: ${c.checkin}` : `Check-in: ${c.checkin}`}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-sans text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Ven Hồ Hotel. All rights reserved.
          </p>
          <p className="font-sans text-white/20 text-xs">{c.address}, Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
