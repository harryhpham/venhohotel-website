"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { rooms } from "@/lib/data/rooms";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

type RoomCardProps = {
  room: typeof rooms[number];
  lang: "vi" | "en";
  fromPrice: string;
  perNight: string;
  contactPrice: string;
  viewLakeTag: string;
};

function RoomCard({ room, lang, fromPrice, perNight, contactPrice, viewLakeTag }: RoomCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = [...room.images];

  const name = lang === "en" ? room.name : room.nameVi;
  const description = lang === "en"
    ? (room as Record<string, unknown>).descriptionEn as string
    : room.description;
  const beds = lang === "en"
    ? ((room as Record<string, unknown>).bedsEn as string | undefined) ?? room.beds
    : room.beds;

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <article className="group block">
      <div className="relative mb-5 aspect-[4/3] overflow-hidden">
        <Link href={`/phong/${room.slug}`} className="relative block h-full w-full" aria-label={name}>
          <Image
            key={imgIdx}
            src={images[imgIdx]}
            alt={name}
            fill
            className="object-cover transition-opacity duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-[#C9A84C]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
        {room.view && (
          <div className="absolute left-3 top-3 z-10">
            <span className="label-tag bg-[#C9A84C] px-2 py-1 text-[#1A1A1A]">{viewLakeTag}</span>
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center" role="group" aria-label={lang === "vi" ? "Chọn ảnh phòng" : "Select room image"}>
            {images.slice(0, 6).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIdx(i)}
                aria-label={lang === "vi" ? `Xem ảnh ${i + 1}` : `View image ${i + 1}`}
                aria-pressed={i === imgIdx}
                className="flex h-8 min-h-0 w-8 items-center justify-center"
              >
                <span className={`block h-2 w-2 rounded-full transition-all ${i === imgIdx ? "scale-125 bg-white" : "bg-white/60"}`} />
              </button>
            ))}
            {images.length > 6 && <span className="self-center text-[10px] text-white/80">+{images.length - 6}</span>}
          </div>
        )}
      </div>
      <Link href={`/phong/${room.slug}`} className="block">
        <p className="label-tag mb-2">{beds} &middot; {room.size}m&sup2;</p>
        <h3 className="mb-2 font-display text-xl text-[#1A1A1A] transition-colors group-hover:text-[#80651F] md:text-2xl">{name}</h3>
        <p className="mb-3 line-clamp-2 font-sans text-sm text-[#5A5A5A]">{description}</p>
        {room.priceVnd ? (
          <p className="font-mono text-sm text-[#1A1A1A]">
            {fromPrice} <span className="font-medium text-[#80651F]">
              {lang === "en" ? `$${room.priceUsd}` : `${room.priceVnd.toLocaleString("vi-VN")}đ`}
            </span>{perNight}
          </p>
        ) : (
          <p className="font-sans text-sm italic text-[#5A5A5A]">{contactPrice}</p>
        )}
      </Link>
    </article>
  );
}

export default function FeaturedRooms() {
  const { lang } = useLang();
  const t = siteContent[lang].rooms;
  const p = siteContent[lang].phongPage;
  return (
    <section className="py-20 md:py-32 bg-[#F7F4EF]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="mb-12 md:mb-16">
          <p className="label-tag mb-3">{t.label}</p>
          <h2 className="font-display text-4xl md:text-6xl text-[#1A1A1A]">{t.heading}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {rooms.map((room) => (
            <RoomCard
              key={room.slug}
              room={room}
              lang={lang}
              fromPrice={p.fromPrice}
              perNight={p.perNight}
              contactPrice={p.contactPrice}
              viewLakeTag={p.viewLakeTag}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/phong" className="inline-flex items-center gap-2 font-sans text-sm text-[#1A1A1A] border-b border-[#C9A84C] pb-0.5 hover:text-[#C9A84C] transition-colors tracking-wide">
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
