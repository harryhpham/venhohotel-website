import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BlogCategoryContent from "@/components/sections/BlogCategoryContent";
import JsonLd from "@/components/seo/JsonLd";
import { blogCategories, getBlogCategory, getPostsByCategory, type BlogCategorySlug } from "@/lib/data/blog";

const base = "https://venhohotel.com";

function isCategorySlug(value: string): value is BlogCategorySlug {
  return value in blogCategories;
}

export function generateStaticParams() {
  return Object.keys(blogCategories).map((category) => ({ category }));
}

type BlogCategoryRouteProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: BlogCategoryRouteProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  if (!isCategorySlug(categorySlug)) return {};
  const category = getBlogCategory(categorySlug, "vi");

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: `${base}/blog/danh-muc/${categorySlug}`,
    },
    openGraph: {
      title: `${category.name} | West Lake Journal`,
      description: category.description,
      url: `${base}/blog/danh-muc/${categorySlug}`,
      images: [{ url: "/images/Hero-lake/hero-lake.jpg", alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | West Lake Journal`,
      description: category.description,
      images: ["/images/Hero-lake/hero-lake.jpg"],
    },
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryRouteProps) {
  const { category: categorySlug } = await params;
  if (!isCategorySlug(categorySlug)) notFound();

  const category = getBlogCategory(categorySlug, "vi");
  const posts = getPostsByCategory(categorySlug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: base },
      { "@type": "ListItem", position: 2, name: "West Lake Journal", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: category.name, item: `${base}/blog/danh-muc/${categorySlug}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <BlogCategoryContent categorySlug={categorySlug} posts={posts} />
      <Footer />
    </>
  );
}
