import { MetadataRoute } from "next";
import { rooms } from "@/lib/data/rooms";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://venhohotel.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                       priority: 1.0, changeFrequency: "weekly",  lastModified: new Date() },
    { url: `${base}/phong`,            priority: 0.9, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/lien-he`,          priority: 0.9, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/tien-ich`,         priority: 0.7, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/vi-tri`,           priority: 0.7, changeFrequency: "yearly",  lastModified: new Date() },
    { url: `${base}/ve-chung-toi`,     priority: 0.6, changeFrequency: "yearly",  lastModified: new Date() },
  ];

  const roomPages: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${base}/phong/${room.slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as const,
    lastModified: new Date(),
  }));

  return [...staticPages, ...roomPages];
}
