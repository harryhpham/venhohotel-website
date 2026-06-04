import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import Image from "next/image";
import { rooms } from "@/lib/data/rooms";

export const metadata = {
  title: "Phòng Nghỉ | Ven Hồ Hotel",
  description: "Các loại phòng tại Ven Hồ Hotel — Tây Hồ, Hà Nội. View Hồ Tây, đầy đủ tiện nghi.",
};

export default function RoomsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-[#1B2D4F] py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <p className="label-tag text-[#C9A84C] mb-4">Phòng Nghỉ</p>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl text-white">
              Không Gian Ven Hồ
            </h1>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#F7F4EF]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20 space-y-16 md:space-y-24">
            {rooms.map((room, idx) => (
              <div key={room.slug} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className={`aspect-[4/3] relative overflow-hidden ${idx % 2 !== 0 ? "lg:order-2" : ""}`}>
                  <Image src={room.images[0]} alt={room.nameVi} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  {room.view && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="label-tag bg-[#C9A84C] text-white px-3 py-1">View Hồ Tây</span>
                    </div>
                  )}
                </div>
                <div className={idx % 2 !== 0 ? "lg:order-1" : ""}>
                  <p className="label-tag mb-3">{room.beds} · {room.size}m²</p>
                  <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] mb-4">{room.nameVi}</h2>
                  <p className="font-sans text-[#6B6B6B] text-sm leading-relaxed mb-6">{room.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.map((a) => (
                      <span key={a} className="label-tag border border-[#D9D9D9] px-3 py-1.5 text-[#6B6B6B]">{a}</span>
                    ))}
                  </div>
                  {room.priceVnd ? (
                    <p className="font-mono text-[#1A1A1A] mb-6">
                      Từ <span className="text-[#C9A84C] text-xl font-medium">{room.priceVnd.toLocaleString("vi-VN")}đ</span>/đêm
                    </p>
                  ) : (
                    <p className="font-sans text-[#6B6B6B] text-sm italic mb-6">Liên hệ để biết giá</p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/lien-he" className="inline-flex items-center justify-center px-6 py-3 bg-[#C9A84C] text-white font-sans text-sm font-medium tracking-wide hover:bg-[#b8963d] transition-colors min-h-[44px]">
                      Đặt Phòng
                    </Link>
                    <Link href={`/phong/${room.slug}`} className="inline-flex items-center justify-center px-6 py-3 border border-[#D9D9D9] text-[#1A1A1A] font-sans text-sm tracking-wide hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors min-h-[44px]">
                      Xem Chi Tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
