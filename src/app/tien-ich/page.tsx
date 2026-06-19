import AmenitiesContent from "@/components/sections/AmenitiesContent";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tiện Ích & Dịch Vụ",
  description:
    "Toàn bộ tiện ích tại Ven Hồ Hotel — WiFi miễn phí, bãi đỗ xe, cho thuê xe đạp, lễ tân & bảo vệ 24/7, dọn phòng hàng ngày.",
  openGraph: {
    images: [{ url: "/images/Exterior/exterior-3.jpg", alt: "Ven Hồ Hotel — Tiện ích đầy đủ, Tây Hồ Hà Nội" }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: "https://venhohotel.com" },
    { "@type": "ListItem", position: 2, name: "Tiện Ích & Dịch Vụ", item: "https://venhohotel.com/tien-ich" },
  ],
};

export default function AmenitiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <AmenitiesContent />
    </>
  );
}
