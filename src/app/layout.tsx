import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/context/LangContext";

export const metadata: Metadata = {
  title: "Ven Ho Hotel Ha Noi — Nghi Duong Ben Ho Tay",
  description: "Khach san Ven Ho tai 181 Nguyen Dinh Thi, Tay Ho, Ha Noi. View Ho Tay, dich vu 24/7. Book from 412,500d/night.",
  keywords: ["Ven Ho Hotel", "khach san Tay Ho", "West Lake hotel Hanoi"],
  openGraph: {
    title: "Ven Ho Hotel — Wake Up To West Lake",
    description: "Hotel with West Lake view, Tay Ho, Hanoi. Rated 8.5/10 on Agoda.",
    url: "https://venhohotel.com",
    siteName: "Ven Ho Hotel",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
