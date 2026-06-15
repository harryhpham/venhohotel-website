import type { Metadata } from "next";
import ContactClient from "@/components/sections/ContactClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Đặt Phòng",
  description:
    "Đặt phòng tại Ven Hồ Hotel — 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội. Gọi 024 3847 4646 hoặc điền form đặt phòng trực tuyến.",
  openGraph: {
    images: [
      {
        url: "/images/Hero-lake/hero-lake.jpg",
        alt: "Đặt phòng Ven Hồ Hotel — View Hồ Tây Hà Nội",
      },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: "https://venhohotel.com" },
    { "@type": "ListItem", position: 2, name: "Đặt Phòng", item: "https://venhohotel.com/lien-he" },
  ],
};

export default function LienHePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ContactClient />
    </>
  );
}
