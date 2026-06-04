import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Về Chúng Tôi | Ven Hồ Hotel",
  description: "Câu chuyện và giá trị của Ven Hồ Hotel — mini hotel view Hồ Tây, Tây Hồ, Hà Nội.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-[#1B2D4F] py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <p className="label-tag text-[#C9A84C] mb-4">Về Chúng Tôi</p>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl text-white max-w-2xl">
              Nơi Hồ Tây Gặp Gỡ Sự Tinh Tế
            </h1>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#F7F4EF]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              <div>
                <p className="label-tag mb-4">Câu Chuyện Của Chúng Tôi</p>
                <h2 className="font-display text-3xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
                  Một Góc Bình Yên<br />Giữa Lòng Tây Hồ
                </h2>
                <div className="space-y-4 font-sans text-[#6B6B6B] text-sm leading-relaxed">
                  <p>
                    Ven Hồ Hotel tọa lạc tại 181 Nguyễn Đình Thi — một trong những con phố đẹp nhất
                    ven hồ Tây, nơi cây xanh và mặt hồ tạo nên khung cảnh thơ mộng bốn mùa.
                  </p>
                  <p>
                    Chúng tôi được xây dựng với triết lý đơn giản: mang đến không gian nghỉ ngơi
                    chân thực, gần gũi với thiên nhiên nhưng đầy đủ tiện nghi hiện đại. Mỗi buổi
                    sáng thức dậy nhìn ra Hồ Tây là một trải nghiệm khó quên.
                  </p>
                  <p>
                    Với 10 phòng nghỉ được thiết kế tinh tế, đội ngũ phục vụ tận tâm 24/7 và vị trí
                    đặc biệt — ngay cạnh mặt hồ, Ven Hồ Hotel là lựa chọn lý tưởng cho cả khách
                    du lịch và người muốn tìm một góc bình yên tại Hà Nội.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="space-y-8">
                {[
                  {
                    title: "View Hồ Tây Độc Đáo",
                    desc: "Phòng nhìn trực tiếp ra Hồ Tây — đặc biệt huyền ảo vào buổi tối khi đèn phản chiếu xuống mặt nước.",
                  },
                  {
                    title: "Vị Trí 9.2/10",
                    desc: "Điểm vị trí cao nhất trong tất cả các hạng mục đánh giá trên Agoda — ngay sát hồ, gần mọi điểm du lịch.",
                  },
                  {
                    title: "Dịch Vụ Tận Tâm",
                    desc: "Lễ tân và bảo vệ 24/7, sẵn sàng hỗ trợ từ đặt xe đến gợi ý nhà hàng địa phương.",
                  },
                  {
                    title: "Trải Nghiệm Xe Đạp",
                    desc: "Khám phá vòng quanh Hồ Tây bằng xe đạp — cách tuyệt vời nhất để cảm nhận nhịp sống Tây Hồ.",
                  },
                ].map((v) => (
                  <div key={v.title} className="border-l-2 border-[#C9A84C] pl-5">
                    <h3 className="font-display text-xl text-[#1A1A1A] mb-2">{v.title}</h3>
                    <p className="font-sans text-[#6B6B6B] text-sm leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-white font-sans font-medium text-sm tracking-wide hover:bg-[#b8963d] transition-colors"
              >
                Đặt Phòng Ngay
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
