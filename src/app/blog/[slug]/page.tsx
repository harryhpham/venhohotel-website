import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BlogArticleContent from "@/components/sections/BlogArticleContent";
import JsonLd from "@/components/seo/JsonLd";
import { blogCategories, blogPosts, getBlogPost } from "@/lib/data/blog";

const base = "https://venhohotel.com";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: `${base}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${base}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: ["Ven Hồ Hotel"],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${base}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Ven Hồ Hotel",
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: "Ven Hồ Hotel",
      url: base,
    },
    mainEntityOfPage: `${base}/blog/${post.slug}`,
    articleSection: blogCategories[post.category].name,
    keywords: post.keywords.join(", "),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ven Hồ Hotel", item: base },
      { "@type": "ListItem", position: 2, name: "West Lake Journal", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${base}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <BlogArticleContent post={post} />
      <Footer />
    </>
  );
}
