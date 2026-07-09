import { MetadataRoute } from "next";
import { blogCategories, blogPosts } from "@/lib/data/blog";
import { rooms } from "@/lib/data/rooms";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://venhohotel.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                       priority: 1.0, changeFrequency: "weekly",  lastModified: new Date() },
    { url: `${base}/phong`,            priority: 0.9, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/lien-he`,          priority: 0.9, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/blog`,             priority: 0.85, changeFrequency: "weekly",  lastModified: new Date() },
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

  const blogCategoryPages: MetadataRoute.Sitemap = Object.keys(blogCategories).map((category) => ({
    url: `${base}/blog/danh-muc/${category}`,
    priority: 0.65,
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    priority: post.slug === "ho-tay-co-gi-choi" ? 0.8 : 0.72,
    changeFrequency: "monthly" as const,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
  }));

  return [...staticPages, ...roomPages, ...blogCategoryPages, ...blogPages];
}
