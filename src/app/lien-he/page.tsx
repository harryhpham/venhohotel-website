"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", checkin: "", checkout: "", room: "", guests: "", note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data: { error?: string; success?: boolean } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error ${res.status}`);
      }

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Không thể gửi yêu cầu. Vui lòng thử lại.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng gọi trực tiếp 024 3847 4646.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#1B2D4F] py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <p className="label-tag text-[#C9A84C] mb-4">Liên Hệ & Đặt Phòng</p>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl text-white">
              Đặt Phòng Ngay
            </h1>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#F7F4EF]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Info */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A] mb-8">
                  Thông Tin Liên Hệ
                </h2>
                <div className="space-y-6">
                  {[
                    { label: "Địa Chỉ", value: "181 Nguyễn Đình Thi, Tây Hồ, Hà Nội" },
                    { label: "Điện Thoại", value: "024 3847 4646", href: "tel:02438474646" },
                    { label: "Facebook", value: "facebook.com/venhohotel", href: "https://www.facebook.com/venhohotel" },
                    { label: "Check-in", value: "12:00 PM — 20:00 PM" },
                    { label: "Check-out", value: "6:00 AM — 12:00 PM" },
                  ].map((item) => (
                    <div key={item.label} className="border-b border-[#D9D9D9] pb-5">
                      <p className="label-tag mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer"
                          className="font-sans text-[#1A1A1A] hover:text-[#C9A84C] transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-sans text-[#1A1A1A]">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A] mb-8">
                  Gửi Yêu Cầu Đặt Phòng
                </h2>
                {submitted ? (
                  <div className="bg-[#EDE8E0] p-10 text-center">
                    <p className="font-display text-3xl text-[#C9A84C] mb-3">Cảm ơn!</p>
                    <p className="font-sans text-[#6B6B6B]">
                      Chúng tôi sẽ liên hệ lại trong vòng 24 giờ để xác nhận đặt phòng.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { id: "name",    label: "Họ & Tên *", type: "text",  placeholder: "Nguyễn Văn A", required: true },
                      { id: "phone",   label: "Điện Thoại *", type: "tel", placeholder: "0912 345 678", required: true },
                      { id: "email",   label: "Email", type: "email",       placeholder: "email@example.com" },
                      { id: "checkin", label: "Ngày Nhận Phòng", type: "date" },
                      { id: "checkout",label: "Ngày Trả Phòng", type: "date" },
                      { id: "guests",  label: "Số Khách", type: "number",  placeholder: "2" },
                    ].map((f) => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className="label-tag block mb-1.5">{f.label}</label>
                        <input
                          id={f.id}
                          type={f.type}
                          required={f.required}
                          placeholder={f.placeholder}
                          value={(form as Record<string, string>)[f.id]}
                          onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                          className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                        />
                      </div>
                    ))}

                    <div>
                      <label htmlFor="room" className="label-tag block mb-1.5">Loại Phòng</label>
                      <select
                        id="room"
                        value={form.room}
                        onChange={(e) => setForm({ ...form, room: e.target.value })}
                        className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] min-h-[44px]"
                      >
                        <option value="">-- Chọn loại phòng --</option>
                        <option value="deluxe-double">Phòng Deluxe Đôi</option>
                        <option value="double-lake-view">Phòng Đôi View Hồ Tây</option>
                        <option value="standard-triple">Phòng Tiêu Chuẩn Ba Người</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="note" className="label-tag block mb-1.5">Ghi Chú</label>
                      <textarea
                        id="note"
                        rows={4}
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        className="w-full border border-[#D9D9D9] bg-white px-4 py-3 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C] resize-none"
                        placeholder="Yêu cầu đặc biệt, dịp kỷ niệm, v.v..."
                      />
                    </div>

                    {error && (
                      <p className="font-sans text-sm text-red-600 text-center">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide py-4 hover:bg-[#b8963d] transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Đang gửi..." : "Gửi Yêu Cầu Đặt Phòng"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
