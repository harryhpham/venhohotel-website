"use client";

import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/sections/BlogCard";
import { useLang } from "@/lib/context/LangContext";
import { blogCategories, getBlogCategory, getLocalizedBlogPosts } from "@/lib/data/blog";

const categorySlugs = Object.keys(blogCategories) as Array<keyof typeof blogCategories>;

export default function BlogIndexContent() {
  const { lang } = useLang();
  const posts = getLocalizedBlogPosts(lang);
  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  return (
    <main className="pt-20 bg-[#F7F4EF]">
      <section className="relative min-h-[72vh] flex items-end overflow-hidden">
        <Image
          src="/images/Hero-lake/hero-lake.jpg"
          alt="Hồ Tây nhìn từ khu Nguyễn Đình Thi, Tây Hồ, Hà Nội"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20 pb-14 md:pb-20">
          <p className="label-tag text-[#C9A84C] mb-4">West Lake Journal</p>
          <h1 className="font-display text-5xl md:text-7xl xl:text-8xl text-white leading-[0.95] max-w-4xl">
            {lang === "vi" ? "Khám Phá Hồ Tây" : "Explore West Lake"}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base md:text-lg leading-relaxed text-white/80">
            {lang === "vi"
              ? "Những câu chuyện, kinh nghiệm và gợi ý giúp bạn trải nghiệm Hà Nội chân thực hơn, từ Nguyễn Đình Thi đến những quán cafe ven hồ và lựa chọn lưu trú bên Hồ Tây."
              : "Stories, local tips and practical guides for experiencing Hanoi more naturally, from Nguyen Dinh Thi Street to lakeside coffee and easy stays by West Lake."}
          </p>
          <Link
            href="#latest"
            className="mt-8 inline-flex items-center justify-center bg-[#C9A84C] px-6 py-3 font-sans text-sm font-semibold tracking-wide text-white hover:bg-[#b8963d] transition-colors"
          >
            {lang === "vi" ? "Khám phá bài mới" : "Read latest stories"}
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-stretch">
            <Link href={`/blog/${featuredPost.slug}`} className="group relative min-h-[420px] overflow-hidden bg-[#1A1A1A]">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.alt}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <p className="label-tag text-[#C9A84C] mb-3">{lang === "vi" ? "Bài nổi bật" : "Featured Article"}</p>
                <h2 className="font-display text-4xl md:text-5xl text-white leading-tight max-w-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 max-w-2xl font-sans text-sm md:text-base leading-relaxed text-white/75">
                  {featuredPost.excerpt}
                </p>
              </div>
            </Link>

            <div className="bg-white border border-[#D9D9D9] p-6 md:p-8">
              <p className="label-tag mb-3">{lang === "vi" ? "Danh mục" : "Categories"}</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] mb-6">
                {lang === "vi" ? "Đi theo cách bạn muốn khám phá" : "Choose your way to explore"}
              </h2>
              <div className="space-y-3">
                {categorySlugs.map((slug) => {
                  const category = getBlogCategory(slug, lang);
                  return (
                  <Link
                    key={slug}
                    href={`/blog/danh-muc/${slug}`}
                    className="block border border-[#EDE8E0] px-4 py-4 hover:border-[#C9A84C] transition-colors"
                  >
                    <span className="font-sans text-sm font-semibold text-[#1A1A1A]">{category.name}</span>
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-[#6B6B6B]">{category.description}</span>
                  </Link>
                )})}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="latest" className="pb-16 md:pb-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
          <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="label-tag mb-3">Latest Stories</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A]">{lang === "vi" ? "Bài viết mới" : "Latest Stories"}</h2>
            </div>
            <Link href="/phong" className="font-sans text-sm font-semibold text-[#C9A84C] hover:text-[#1A1A1A] transition-colors">
              {lang === "vi" ? "Xem phòng tại Ven Hồ" : "View rooms at Ven Ho"}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1B2D4F] py-14 md:py-18">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="label-tag text-[#C9A84C] mb-3">{lang === "vi" ? "Lưu trú gần Hồ Tây" : "Stay Near West Lake"}</p>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              {lang === "vi" ? "Bắt đầu ngày mới từ Nguyễn Đình Thi" : "Start the day from Nguyen Dinh Thi"}
            </h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-white/65">
              {lang === "vi"
                ? "Ven Hồ Hotel tại 181 Nguyễn Đình Thi phù hợp cho khách muốn ở gần Hồ Tây, dễ đi bộ ven hồ và thuận tiện liên hệ trực tiếp khi cần xác nhận phòng."
                : "Ven Ho Hotel at 181 Nguyen Dinh Thi is a practical base for guests who want to stay near West Lake, walk by the water and confirm rooms directly."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/phong" className="inline-flex items-center justify-center bg-[#C9A84C] px-6 py-3 font-sans text-sm font-semibold text-white hover:bg-[#b8963d] transition-colors">
              {lang === "vi" ? "Xem phòng" : "View rooms"}
            </Link>
            <Link href="/lien-he" className="inline-flex items-center justify-center border border-white/25 px-6 py-3 font-sans text-sm font-semibold text-white hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              {lang === "vi" ? "Liên hệ đặt phòng" : "Contact to book"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
