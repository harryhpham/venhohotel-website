import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/context/LangContext";
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://venhohotel.com"),
  title: {
    default: "Ven Hồ Hotel Hà Nội — Nghỉ Dưỡng Bên Hồ Tây",
    template: "%s | Ven Hồ Hotel",
  },
  description:
    "Khách sạn Ven Hồ tại 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội. View Hồ Tây, dịch vụ 24/7, đánh giá 8.5/10 Agoda. Đặt phòng từ 412,500đ/đêm.",
  keywords: [
    "Ven Ho Hotel",
    "khach san Tay Ho",
    "West Lake hotel Hanoi",
    "hotel Ha Noi",
    "Tay Ho hotel",
    "khach san Ho Tay",
  ],
  alternates: {
    canonical: "https://venhohotel.com",
    languages: {
      "x-default": "https://venhohotel.com",
      vi: "https://venhohotel.com",
    },
  },
  openGraph: {
    title: "Ven Hồ Hotel — Wake Up To West Lake",
    description:
      "Khách sạn view Hồ Tây, Tây Hồ, Hà Nội. Đánh giá 8.5/10 trên Agoda. Đặt phòng từ 412,500đ/đêm.",
    url: "https://venhohotel.com",
    siteName: "Ven Hồ Hotel",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/Hero-lake/hero-lake.jpg",
        width: 1200,
        height: 630,
        alt: "Ven Hồ Hotel — View Hồ Tây, Hà Nội",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ven Hồ Hotel — Wake Up To West Lake",
    description:
      "Khách sạn view Hồ Tây, Tây Hồ, Hà Nội. Từ 412,500đ/đêm. Đánh giá 8.5/10 Agoda.",
    images: ["/images/Hero-lake/hero-lake.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" dir="ltr">
      <body className="antialiased">
        <GoogleAnalytics />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
