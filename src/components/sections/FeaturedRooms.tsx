"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { rooms } from "@/lib/data/rooms";
import { useLang } from "@/lib/context/LangContext";
import { siteContent } from "@/lib/data/content";

function RoomCard({ room }: { room: typeof rooms[number] }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = [...room.images];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % images.length);
    }, 10000); // 10 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Link href={`/phong/${room.slug}`} className="group block">
      <div className="aspect-[4/3] relative overflow-hidden mb-5">
        <Image
          key={imgIdx}
          src={images[imgIdx]}
          alt={room.nameVi}
          fill
          className="object-cover transition-opacity duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
        />
        {room.view && (
          <div className="absolute top-3 left-3 z-10">
            <span className="label-tag bg-[#C9A84C] text-white px-2 py-1">View Ho Tay</span>
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.slice(0, 6).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-white scale-125" : "bg-white/50"}`}
              />
            ))}
            {images.length > 6 && <span className="text-white/50 text-[10px] ml-1">+{images.length - 6}</span>}
          </div>
        )}
        <div className="absolute inset-0 bg-[#C9A84C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <p className="label-tag mb-2">{room.beds} &middot; {room.size}m&sup2;</p>
      <h3 className="font-display text-xl md:text-2xl text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors mb-2">{room.nameVi}</h3>
      <p className="font-sans text-[#6B6B6B] text-sm mb-3 line-clamp-2">{room.description}</p>
      {room.priceVnd ? (
        <p className="font-mono text-[#1A1A1A] text-sm">
          Tu <span className="text-[#C9A84C] font-medium">{room.priceVnd.toLocaleString("vi-VN")}d</span>/dem
        </p>
      ) : (
        <p className="font-sans text-[#6B6B6B] text-sm italic">Lien he de biet gia</p>
      )}
    </Link>
  );
}

export default function FeaturedRooms() {
  const { lang } = useLang();
  const t = siteContent[lang].rooms;
  return (
    <section className="py-20 md:py-32 bg-[#F7F4EF]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="mb-12 md:mb-16">
          <p className="label-tag mb-3">{t.label}</p>
          <h2 className="font-display text-4xl md:text-6xl text-[#1A1A1A]">{t.heading}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {rooms.map((room) => <RoomCard key={room.slug} room={room} />)}
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
