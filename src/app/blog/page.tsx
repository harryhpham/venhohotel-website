import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BlogIndexContent from "@/components/sections/BlogIndexContent";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "West Lake Journal",
  description:
    "Khám phá Hồ Tây theo cách địa phương: cẩm nang Tây Hồ, cafe ven hồ, lịch trình Hà Nội và kinh nghiệm lưu trú gần Hồ Tây.",
  alternates: {
    canonical: "https://venhohotel.com/blog",
  },
  openGraph: {
    title: "West Lake Journal | Ven Hồ Hotel",
    description:
      "Cẩm nang địa phương về Hồ Tây, Nguyễn Đình Thi, cafe ven hồ và lưu trú tại Tây Hồ, Hà Nội.",
    url: "https://venhohotel.com/blog",
    images: [
      {
        url: "/images/Hero-lake/hero-lake.jpg",
        width: 1200,
        height: 630,
        alt: "West Lake Journal — Ven Hồ Hotel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "West Lake Journal | Ven Hồ Hotel",
    description:
      "Cẩm nang địa phương về Hồ Tây, Nguyễn Đình Thi, cafe ven hồ và lưu trú tại Tây Hồ, Hà Nội.",
    images: ["/images/Hero-lake/hero-lake.jpg"],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "West Lake Journal",
  description: "Cẩm nang Hồ Tây, Tây Hồ và lưu trú gần Hồ Tây từ Ven Hồ Hotel.",
  url: "https://venhohotel.com/blog",
  publisher: {
    "@type": "Organization",
    name: "Ven Hồ Hotel",
    url: "https://venhohotel.com",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: "https://venhohotel.com" },
    { "@type": "ListItem", position: 2, name: "West Lake Journal", item: "https://venhohotel.com/blog" },
  ],
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <BlogIndexContent />
      <Footer />
    </>
  );
}
