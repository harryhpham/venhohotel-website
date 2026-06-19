import AboutContent from "@/components/sections/AboutContent";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về Chúng Tôi",
  description:
    "Câu chuyện và giá trị của Ven Hồ Hotel — mini hotel view Hồ Tây tại 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội. Đánh giá vị trí 9.2/10 trên Agoda.",
  openGraph: {
    images: [{ url: "/images/Exterior/exterior-2.jpg", alt: "Ven Hồ Hotel — 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội" }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: "https://venhohotel.com" },
    { "@type": "ListItem", position: 2, name: "Về Chúng Tôi", item: "https://venhohotel.com/ve-chung-toi" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <AboutContent />
    </>
  );
}
