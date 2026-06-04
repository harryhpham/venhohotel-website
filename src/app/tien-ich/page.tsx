import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "Tiện Ích & Dịch Vụ | Ven Hồ Hotel",
  description: "Toàn bộ tiện ích và dịch vụ tại Ven Hồ Hotel — WiFi, bãi đỗ xe, xe đạp, lễ tân 24/7.",
};

const amenityGroups = [
  {
    group: "Trong Phòng",
    items: ["WiFi tốc độ cao", "Điều hòa nhiệt độ", "TV cáp màn hình phẳng", "Minibar", "Ấm đun nước điện", "Bàn làm việc"],
  },
  {
    group: "Phòng Tắm",
    items: ["Vòi hoa sen", "Máy sấy tóc", "Dép đi trong phòng", "Đồ dùng vệ sinh miễn phí"],
  },
  {
    group: "Dịch Vụ Khách Sạn",
    items: ["Lễ tân 24/7", "Bảo vệ 24/7", "Dọn phòng hàng ngày", "Dịch vụ phòng", "Lưu giữ hành lý"],
  },
  {
    group: "Tiện Ích Chung",
    items: ["WiFi toàn bộ khách sạn (miễn phí)", "Bãi đỗ xe miễn phí", "Cho thuê xe đạp", "Khu vực không hút thuốc"],
  },
];

export default function AmenitiesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-[#1B2D4F] py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <p className="label-tag text-[#C9A84C] mb-4">Tiện Ích</p>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl text-white">
              Đầy Đủ Tiện Nghi
            </h1>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#F7F4EF]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D9D9D9]">
              {amenityGroups.map((group) => (
                <div key={group.group} className="bg-[#F7F4EF] p-8 md:p-10">
                  <p className="label-tag mb-4">{group.group}</p>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <span className="text-[#C9A84C] text-sm shrink-0">◎</span>
                        <span className="font-sans text-[#1A1A1A] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Check-in policy */}
            <div className="mt-16 bg-[#EDE8E0] p-8 md:p-10">
              <p className="label-tag mb-4">Chính Sách Lưu Trú</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Check-in", value: "12:00 — 20:00" },
                  { label: "Check-out", value: "6:00 — 12:00" },
                  { label: "Trẻ em", value: "Dưới 9 tuổi miễn phí" },
                  { label: "Yêu cầu", value: "CMND + thẻ tín dụng" },
                ].map((p) => (
                  <div key={p.label}>
                    <p className="font-sans text-xs text-[#6B6B6B] uppercase tracking-widest mb-1">{p.label}</p>
                    <p className="font-display text-lg text-[#1A1A1A]">{p.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
