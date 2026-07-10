"use client";

import Link from "next/link";
import BlogCard from "@/components/sections/BlogCard";
import { useLang } from "@/lib/context/LangContext";
import {
  getBlogCategory,
  getLocalizedBlogPost,
  type BlogCategorySlug,
  type BlogPost,
} from "@/lib/data/blog";

export default function BlogCategoryContent({
  categorySlug,
  posts,
}: {
  categorySlug: BlogCategorySlug;
  posts: BlogPost[];
}) {
  const { lang } = useLang();
  const category = getBlogCategory(categorySlug, lang);
  const localizedPosts = posts.map((post) => getLocalizedBlogPost(post, lang));

  return (
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
            {localizedPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} priority={index === 0} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
