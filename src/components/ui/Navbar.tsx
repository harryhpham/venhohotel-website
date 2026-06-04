"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

const FB_URL = "https://www.facebook.com/venhohotel";

export default function Navbar() {
  const { lang, setLang } = useLang();
  const t = siteContent[lang].nav;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/phong",        label: t.rooms },
    { href: "/tien-ich",     label: t.amenities },
    { href: "/vi-tri",       label: t.location },
    { href: "/ve-chung-toi", label: t.about },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#F7F4EF]/96 backdrop-blur-sm shadow-sm" : "bg-transparent"
    }`}>
      <nav className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20 flex items-center justify-between h-16 md:h-[76px]">

        {/* Logo — 20% bigger: was h-10, now h-12 */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logonew.png"
            alt="Ven Ho Hotel"
            width={144}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav — bigger font, semibold */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm lg:text-[15px] font-sans font-semibold text-[#1A1A1A] hover:text-[#C9A84C] transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right cluster: Facebook + VI/EN + Book */}
        <div className="hidden md:flex items-center gap-2">
          {/* Facebook icon button */}
          <a
            href={FB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-9 h-9 flex items-center justify-center border border-[#D9D9D9] hover:border-[#C9A84C] hover:text-[#C9A84C] text-[#6B6B6B] transition-colors rounded-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Language toggle */}
          <div className="flex items-center border border-[#D9D9D9] text-xs font-sans font-semibold overflow-hidden rounded-sm">
            <button
              onClick={() => setLang("vi")}
              className={`px-3 py-1.5 transition-colors ${lang === "vi" ? "bg-[#1A1A1A] text-white" : "text-[#6B6B6B] hover:text-[#1A1A1A]"}`}
            >
              VI
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 transition-colors ${lang === "en" ? "bg-[#1A1A1A] text-white" : "text-[#6B6B6B] hover:text-[#1A1A1A]"}`}
            >
              EN
            </button>
          </div>

          {/* Book CTA */}
          <Link
            href="/lien-he"
            className="px-5 py-2.5 bg-[#C9A84C] text-white text-sm font-sans font-semibold tracking-wide hover:bg-[#b8963d] transition-colors"
          >
            {t.book}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {/* Facebook icon on mobile */}
          <a href={FB_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            className="w-9 h-9 flex items-center justify-center text-[#6B6B6B]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <button
            className="flex flex-col gap-1.5 p-2 min-w-[44px] min-h-[44px] items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300 ${open ? "rotate-45 translate-y-[8px]" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300 ${open ? "-rotate-45 -translate-y-[8px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#F7F4EF] z-40 flex flex-col items-center justify-center gap-6 px-6 overflow-y-auto">
          {/* Lang toggle */}
          <div className="flex items-center border border-[#D9D9D9] font-sans font-semibold overflow-hidden">
            <button onClick={() => setLang("vi")} className={`px-6 py-3 text-sm transition-colors ${lang === "vi" ? "bg-[#1A1A1A] text-white" : "text-[#6B6B6B]"}`}>VI</button>
            <button onClick={() => setLang("en")} className={`px-6 py-3 text-sm transition-colors ${lang === "en" ? "bg-[#1A1A1A] text-white" : "text-[#6B6B6B]"}`}>EN</button>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-medium text-[#1A1A1A] hover:text-[#C9A84C] transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/lien-he"
            onClick={() => setOpen(false)}
            className="w-full max-w-xs text-center px-6 py-4 bg-[#C9A84C] text-white font-sans font-semibold tracking-wide hover:bg-[#b8963d] transition-colors min-h-[44px] flex items-center justify-center"
          >
            {t.book}
          </Link>
        </div>
      )}
    </header>
  );
}
