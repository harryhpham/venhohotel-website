import RoomsContent from "@/components/sections/RoomsContent";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phòng Nghỉ",
  description:
    "3 loại phòng tại Ven Hồ Hotel — Deluxe Đôi, Đôi View Hồ Tây, Tiêu Chuẩn Ba Người. View Hồ Tây, đầy đủ tiện nghi. Từ 400,000đ/đêm.",
  openGraph: {
    images: [{ url: "/images/Lake-view/lake-view-1.jpg", alt: "Phòng view Hồ Tây tại Ven Hồ Hotel" }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: "https://venhohotel.com" },
    { "@type": "ListItem", position: 2, name: "Phòng Nghỉ", item: "https://venhohotel.com/phong" },
  ],
};

export default function RoomsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <RoomsContent />
    </>
  );
}
