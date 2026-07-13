"use client";

import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/sections/BlogCard";
import { useLang } from "@/lib/context/LangContext";
import { getBlogCategory, getLocalizedBlogPost, getLocalizedRelatedPosts, type BlogLang, type BlogPost } from "@/lib/data/blog";

function ctaCopy(variant: BlogPost["ctaVariant"], lang: BlogLang) {
  if (variant === "rooms") {
    return {
      title: lang === "vi" ? "Tìm nơi lưu trú gần Hồ Tây?" : "Looking for a stay near West Lake?",
      body: lang === "vi"
        ? "Ven Hồ Hotel tại 181 Nguyễn Đình Thi có các lựa chọn phòng gọn, dễ liên hệ và phù hợp để bắt đầu lịch trình quanh Tây Hồ."
        : "Ven Ho Hotel at 181 Nguyen Dinh Thi offers compact room choices, easy direct contact and a convenient start for exploring Tay Ho.",
      primary: lang === "vi" ? "Xem phòng" : "View rooms",
      href: "/phong",
    };
  }

  if (variant === "direct-booking") {
    return {
      title: lang === "vi" ? "Cần xác nhận phòng nhanh?" : "Need to confirm a room quickly?",
      body: lang === "vi"
        ? "Bạn có thể liên hệ trực tiếp Ven Hồ Hotel để hỏi loại phòng, thời gian đến và lựa chọn phù hợp cho chuyến đi."
        : "You can contact Ven Ho Hotel directly to ask about room types, arrival time and the best option for your trip.",
      primary: lang === "vi" ? "Liên hệ khách sạn" : "Contact the hotel",
      href: "/lien-he",
    };
  }

  return {
    title: lang === "vi" ? "Ở gần Hồ Tây để khám phá nhẹ hơn" : "Stay near West Lake for an easier trip",
    body: lang === "vi"
      ? "Nếu bạn muốn bắt đầu ngày mới bằng một vòng đi bộ ven hồ, Ven Hồ Hotel là một điểm lưu trú thuận tiện trên đường Nguyễn Đình Thi."
      : "If you want to begin the day with a lakeside walk, Ven Ho Hotel is a convenient stay on Nguyen Dinh Thi Street.",
    primary: lang === "vi" ? "Xem vị trí" : "View location",
    href: "/vi-tri",
  };
}

export default function BlogArticleContent({ post }: { post: BlogPost }) {
  const { lang } = useLang();
  const localizedPost = getLocalizedBlogPost(post, lang);
  const category = getBlogCategory(post.category, lang);
  const relatedPosts = getLocalizedRelatedPosts(post, lang);
  const cta = ctaCopy(post.ctaVariant, lang);
  const date = new Date(post.publishedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="pt-20 bg-[#F7F4EF]">
      <article>
        <header className="relative min-h-[68vh] flex items-end overflow-hidden bg-[#1A1A1A]">
          <Image
            src={post.coverImage}
            alt={localizedPost.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="relative z-10 w-full max-w-[1040px] mx-auto px-4 md:px-6 pb-12 md:pb-16">
            <Link href={`/blog/danh-muc/${post.category}`} className="label-tag text-[#C9A84C] mb-4 inline-flex">
              {category.name}
            </Link>
            <h1 className="font-display text-4xl md:text-6xl xl:text-7xl leading-[1] text-white">
              {localizedPost.title}
            </h1>
            <p className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-white/78">
              {localizedPost.excerpt}
            </p>
            <p className="mt-6 font-mono text-xs text-white/55">
              {post.readingTime} {lang === "vi" ? "phút đọc" : "min read"} · {date} · Ven Ho Hotel
            </p>
          </div>
        </header>

        <div className="max-w-[1040px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-10 lg:gap-14">
            <div>
              <div className="bg-white border border-[#D9D9D9] px-5 py-5 md:px-7 md:py-6 mb-10">
                <p className="label-tag mb-2">{lang === "vi" ? "Trả lời nhanh" : "Quick Answer"}</p>
                <p className="font-sans text-base leading-relaxed text-[#1A1A1A]">{localizedPost.quickAnswer}</p>
              </div>

              <div className="space-y-6 font-sans text-[17px] leading-[1.85] text-[#333]">
                {localizedPost.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-12 space-y-12">
                {localizedPost.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-3xl md:text-4xl leading-tight text-[#1A1A1A] mb-4">{section.heading}</h2>
                    <div className="space-y-5 font-sans text-[17px] leading-[1.85] text-[#333]">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <section className="mt-12 bg-[#1B2D4F] px-6 py-7 md:px-8 md:py-8">
                <p className="label-tag text-[#C9A84C] mb-3">Ven Ho Hotel</p>
                <h2 className="font-display text-3xl text-white mb-3">{cta.title}</h2>
                <p className="font-sans text-sm leading-relaxed text-white/70">{cta.body}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link href={cta.href} className="inline-flex items-center justify-center bg-[#C9A84C] px-5 py-3 font-sans text-sm font-semibold text-[#1A1A1A] hover:bg-[#b8963d] transition-colors">
                    {cta.primary}
                  </Link>
                  <a href="tel:02438474646" className="inline-flex items-center justify-center border border-white/25 px-5 py-3 font-sans text-sm font-semibold text-white hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                    {lang === "vi" ? "Gọi khách sạn" : "Call hotel"}
                  </a>
                </div>
              </section>

              <section className="mt-12">
                <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] mb-5">
                  {lang === "vi" ? "Câu hỏi thường gặp" : "Frequently Asked Questions"}
                </h2>
                <div className="space-y-3">
                  {localizedPost.faqs.map((faq) => (
                    <div key={faq.question} className="border border-[#D9D9D9] bg-white px-5 py-4">
                      <h3 className="font-sans text-sm font-semibold text-[#1A1A1A]">{faq.question}</h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-[#6B6B6B]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="border border-[#D9D9D9] bg-white p-5">
                <p className="label-tag mb-3">{lang === "vi" ? "Liên kết nhanh" : "Quick Links"}</p>
                <div className="space-y-2">
                  <Link href="/blog" className="block font-sans text-sm text-[#6B6B6B] hover:text-[#C9A84C]">West Lake Journal</Link>
                  <Link href="/blog/ho-tay-co-gi-choi" className="block font-sans text-sm text-[#6B6B6B] hover:text-[#C9A84C]">
                    {lang === "vi" ? "Cẩm nang Hồ Tây" : "West Lake Guide"}
                  </Link>
                  <Link href="/phong" className="block font-sans text-sm text-[#6B6B6B] hover:text-[#C9A84C]">
                    {lang === "vi" ? "Phòng tại Ven Hồ" : "Rooms at Ven Ho"}
                  </Link>
                  <Link href="/lien-he" className="block font-sans text-sm text-[#6B6B6B] hover:text-[#C9A84C]">
                    {lang === "vi" ? "Liên hệ đặt phòng" : "Contact to book"}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 xl:px-20">
            <p className="label-tag mb-3">Related Posts</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mb-8">
              {lang === "vi" ? "Đọc tiếp" : "Read Next"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug} post={related} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
