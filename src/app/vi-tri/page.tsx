import LocationContent from "@/components/sections/LocationContent";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vị Trí",
  description:
    "Ven Hồ Hotel tại 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội. Cách sân bay Nội Bài 19.4km, cách Phố Cổ 3.6km, ngay cạnh Hồ Tây.",
  openGraph: {
    images: [{ url: "/images/Hero-lake/hero-lake.jpg", alt: "Ven Hồ Hotel — View Hồ Tây, 181 Nguyễn Đình Thi, Tây Hồ Hà Nội" }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: "https://venhohotel.com" },
    { "@type": "ListItem", position: 2, name: "Vị Trí", item: "https://venhohotel.com/vi-tri" },
  ],
};

export default function LocationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <LocationContent />
    </>
  );
}
