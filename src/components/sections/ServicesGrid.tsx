const services = [
  { title: "WiFi Miễn Phí",     desc: "Kết nối tốc độ cao toàn bộ khách sạn",         icon: "◎" },
  { title: "Bãi Đỗ Xe Máy",     desc: "Miễn phí cho tất cả khách lưu trú",             icon: "◻" },
  { title: "Cho Thuê Xe Đạp",   desc: "Khám phá Hồ Tây theo cách chậm lại",           icon: "◈" },
  { title: "Dịch Vụ Phòng",     desc: "Phục vụ tận nơi theo yêu cầu",                  icon: "◇" },
  { title: "Lễ Tân 24/7",       desc: "Sẵn sàng hỗ trợ bất kỳ lúc nào",              icon: "◉" },
  { title: "Dọn Phòng",         desc: "Vệ sinh phòng hàng ngày",                       icon: "◆" },
];

export default function ServicesGrid() {
  return (
    <section className="py-16 md:py-32 bg-[#EDE8E0]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
        <div className="mb-10 md:mb-16">
          <p className="label-tag mb-3">Tiện Ích &amp; Dịch Vụ</p>
          <h2 className="font-display text-3xl md:text-6xl text-[#1A1A1A]">Đầy Đủ Tiện Nghi</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#D9D9D9]">
          {services.map((s) => (
            <div key={s.title} className="bg-[#EDE8E0] p-5 md:p-10 hover:bg-[#F7F4EF] transition-colors">
              <span className="text-[#C9A84C] text-xl md:text-2xl mb-3 md:mb-4 block">{s.icon}</span>
              <h3 className="font-display text-base md:text-2xl text-[#1A1A1A] mb-1 md:mb-2">{s.title}</h3>
              <p className="font-sans text-[#6B6B6B] text-xs md:text-sm leading-relaxed hidden sm:block">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
