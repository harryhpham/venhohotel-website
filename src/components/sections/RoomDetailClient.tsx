"use client";
import { useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import Image from "next/image";
import { rooms } from "@/lib/data/rooms";

// Lightbox overlay
function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: readonly string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl w-12 h-12 flex items-center justify-center z-10" onClick={onClose}>
        &times;
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 font-mono text-sm z-10">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      <button
        className="absolute left-4 md:left-8 text-white/70 hover:text-white text-4xl w-14 h-14 flex items-center justify-center z-10 hover:bg-white/10 transition-colors"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        &#8592;
      </button>

      {/* Main image — large */}
      <div
        className="relative w-full max-w-5xl mx-16 md:mx-24"
        style={{ height: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={index}
          src={images[index]}
          alt={`Room photo ${index + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
          quality={95}
          priority
        />
      </div>

      {/* Next */}
      <button
        className="absolute right-4 md:right-8 text-white/70 hover:text-white text-4xl w-14 h-14 flex items-center justify-center z-10 hover:bg-white/10 transition-colors"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        &#8594;
      </button>

      {/* Thumbnail strip at bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4" onClick={(e) => e.stopPropagation()}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); }}
            className={`relative h-14 w-20 shrink-0 overflow-hidden transition-all ${i === index ? "ring-2 ring-[#C9A84C] opacity-100" : "opacity-40 hover:opacity-70"}`}
          >
            <Image src={img} alt={`thumb ${i+1}`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RoomGallery({ room }: { room: typeof rooms[number] }) {
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = [...room.images];

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevLight = useCallback(() => setLightbox((p) => p !== null ? (p - 1 + images.length) % images.length : null), [images.length]);
  const nextLight = useCallback(() => setLightbox((p) => p !== null ? (p + 1) % images.length : null), [images.length]);

  return (
    <>
      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox images={room.images} index={lightbox} onClose={closeLightbox} onPrev={prevLight} onNext={nextLight} />
      )}

      {/* Main image */}
      <div
        className="aspect-[16/7] relative overflow-hidden cursor-pointer group"
        onClick={() => openLightbox(selected)}
      >
        <Image
          key={selected}
          src={images[selected]}
          alt={`${room.nameVi} - anh ${selected + 1}`}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-[1.02]"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-[#1B2D4F]/20" />
        {room.view && (
          <div className="absolute top-6 left-6 z-10">
            <span className="label-tag bg-[#C9A84C] text-white px-3 py-1">View Ho Tay</span>
          </div>
        )}
        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white font-sans text-xs px-3 py-1.5 flex items-center gap-1.5 z-10">
          <span>&#8689;</span> {selected + 1} / {images.length}
        </div>
        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected((s) => (s - 1 + images.length) % images.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
            >&#8592;</button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected((s) => (s + 1) % images.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
            >&#8594;</button>
          </>
        )}
      </div>

      {/* Thumbnail grid — all images, 5 per row max */}
      {images.length > 1 && (
        <div className="bg-[#EDE8E0] px-4 md:px-6 xl:px-20 py-3 max-w-[1440px] mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative h-16 md:h-20 shrink-0 overflow-hidden transition-all ${
                  i === selected
                    ? "ring-2 ring-[#C9A84C] ring-offset-1 opacity-100 w-24 md:w-32"
                    : "opacity-60 hover:opacity-90 w-20 md:w-28"
                }`}
              >
                <Image src={img} alt={`${room.nameVi} ${i+1}`} fill className="object-cover" sizes="120px" quality={75} />
                {/* Click to enlarge hint on hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs">&#8689;</span>
                </div>
              </button>
            ))}
            {/* View all in lightbox button */}
            <button
              onClick={() => openLightbox(0)}
              className="h-16 md:h-20 w-20 md:w-24 shrink-0 bg-[#1A1A1A] text-white flex flex-col items-center justify-center gap-1 text-xs font-sans hover:bg-[#C9A84C] transition-colors"
            >
              <span className="text-lg">&#9638;</span>
              <span>Xem tat ca</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function RoomDetailClient({ slug }: { slug: string }) {
  const room = rooms.find((r) => r.slug === slug);
  if (!room) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <RoomGallery room={room} />

        <section className="py-16 md:py-24 bg-[#F7F4EF]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <p className="label-tag mb-3">{room.beds} &middot; {room.size}m&sup2;</p>
                <h1 className="font-display text-3xl md:text-5xl text-[#1A1A1A] mb-6">{room.nameVi}</h1>
                <div className="w-8 h-px bg-[#C9A84C] mb-6" />
                <p className="font-sans text-[#6B6B6B] text-base leading-relaxed mb-8">{room.description}</p>
                <h3 className="font-display text-xl text-[#1A1A1A] mb-4">Tien Nghi Phong</h3>
                <div className="grid grid-cols-2 gap-2">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2">
                      <span className="text-[#C9A84C] text-sm">&#9678;</span>
                      <span className="font-sans text-sm text-[#1A1A1A]">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:sticky lg:top-24 self-start">
                <div className="bg-white border border-[#D9D9D9] p-6">
                  {room.priceVnd ? (
                    <div className="mb-4">
                      <p className="label-tag mb-1">Gia tu</p>
                      <p className="font-mono text-3xl text-[#C9A84C] font-medium">{room.priceVnd.toLocaleString("vi-VN")}d</p>
                      <p className="font-sans text-[#6B6B6B] text-xs mt-0.5">/dem</p>
                    </div>
                  ) : (
                    <p className="font-sans text-[#6B6B6B] text-sm italic mb-4">Lien he de biet gia tot nhat</p>
                  )}
                  <Link href="/lien-he" className="block text-center w-full bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide py-4 hover:bg-[#b8963d] transition-colors min-h-[44px]">
                    Dat Phong Nay
                  </Link>
                  <a href="tel:02438474646" className="block text-center w-full mt-3 border border-[#D9D9D9] text-[#1A1A1A] font-sans text-sm py-4 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors min-h-[44px]">
                    Goi: 024 3847 4646
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-[#D9D9D9] p-4 z-40">
          <Link href="/lien-he" className="block text-center w-full bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide py-4 hover:bg-[#b8963d] transition-colors">
            Dat Phong Nay
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
