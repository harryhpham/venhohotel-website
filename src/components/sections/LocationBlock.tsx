"use client";

import { useState } from "react";

export default function LocationBlock() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", note: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 md:py-32 bg-[#F7F4EF]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="mb-12 md:mb-16">
          <p className="label-tag mb-3">Vị Trí & Đặt Phòng</p>
          <h2 className="font-display text-4xl md:text-6xl text-[#1A1A1A]">
            Tìm Chúng Tôi
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Map + info */}
          <div>
            {/* Google Maps embed */}
            <div className="aspect-[4/3] bg-[#EDE8E0] mb-6 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.2!2d105.8277!3d21.0510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5f34524c3d%3A0xbef9e2d4a0ae86b7!2s181%20Nguy%E1%BB%85n%20%C4%90%C3%ACnh%20Thi%2C%20T%C3%A2y%20H%E1%BB%93%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2svn!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ Ven Hồ Hotel"
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <span className="text-[#C9A84C] mt-0.5">◎</span>
                <div>
                  <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-0.5">Địa Chỉ</p>
                  <p className="font-sans text-[#1A1A1A] text-sm">181 Nguyễn Đình Thi, Tây Hồ, Hà Nội</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#C9A84C] mt-0.5">◎</span>
                <div>
                  <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-0.5">Điện Thoại</p>
                  <a href="tel:02438474646" className="font-mono text-[#1A1A1A] text-sm hover:text-[#C9A84C] transition-colors">
                    024 3847 4646
                  </a>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[#C9A84C] mt-0.5">◎</span>
                <div>
                  <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-0.5">Check-in / Check-out</p>
                  <p className="font-sans text-[#1A1A1A] text-sm">12:00 — 20:00 / trước 12:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick booking form */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[#1A1A1A] mb-8">
              Liên Hệ Nhanh
            </h3>
            {submitted ? (
              <div className="bg-[#EDE8E0] p-8 text-center">
                <p className="font-display text-2xl text-[#C9A84C] mb-2">Cảm ơn bạn!</p>
                <p className="font-sans text-[#6B6B6B] text-sm">
                  Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="label-tag block mb-1.5">Họ & Tên</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="label-tag block mb-1.5">Số Điện Thoại</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                    placeholder="0912 345 678"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="label-tag block mb-1.5">Ngày Dự Kiến</label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="note" className="label-tag block mb-1.5">Ghi Chú</label>
                  <textarea
                    id="note"
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] resize-none"
                    placeholder="Loại phòng, số người, yêu cầu đặc biệt..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide py-4 hover:bg-[#b8963d] transition-colors min-h-[44px]"
                >
                  Gửi Yêu Cầu
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
