import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BlogCard from "@/components/sections/BlogCard";
import JsonLd from "@/components/seo/JsonLd";
import { blogCategories, getPostsByCategory, type BlogCategorySlug } from "@/lib/data/blog";

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
  const category = blogCategories[categorySlug];

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

  const category = blogCategories[categorySlug];
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
      <main className="pt-20 bg-[#F7F4EF]">
        <section className="bg-[#1B2D4F] py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <Link href="/blog" className="label-tag text-[#C9A84C] mb-4 inline-flex">West Lake Journal</Link>
            <h1 className="font-display text-4xl md:text-6xl text-white">{category.name}</h1>
            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-white/70">{category.description}</p>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {posts.map((post, index) => (
                <BlogCard key={post.slug} post={post} priority={index === 0} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
