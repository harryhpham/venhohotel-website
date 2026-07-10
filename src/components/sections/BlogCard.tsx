import Image from "next/image";
import Link from "next/link";
import { getBlogCategory, type BlogLang, type BlogPost } from "@/lib/data/blog";

export default function BlogCard({ post, priority = false, lang = "vi" }: { post: BlogPost; priority?: boolean; lang?: BlogLang }) {
  const category = getBlogCategory(post.category, lang);
  const date = new Date(post.publishedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group border border-[#D9D9D9] bg-white">
      <Link href={`/blog/${post.slug}`} className="block min-h-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE8E0]">
          <Image
            src={post.coverImage}
            alt={post.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-5 md:p-6">
          <p className="label-tag mb-2">{category.name}</p>
          <h3 className="font-display text-2xl text-[#1A1A1A] leading-tight group-hover:text-[#C9A84C] transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#6B6B6B]">{post.excerpt}</p>
          <p className="mt-5 font-mono text-xs text-[#6B6B6B]">
            {post.readingTime} {lang === "vi" ? "phút đọc" : "min read"} · {date}
          </p>
        </div>
      </Link>
    </article>
  );
}
