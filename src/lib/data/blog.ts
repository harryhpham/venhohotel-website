export type BlogCategorySlug =
  | "kham-pha-ho-tay"
  | "am-thuc-ho-tay"
  | "cong-tac-ha-noi"
  | "luu-tru-ho-tay"
  | "ven-ho-stories";

export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  locale: "vi";
  title: string;
  excerpt: string;
  category: BlogCategorySlug;
  coverImage: string;
  alt: string;
  publishedAt: string;
  updatedAt?: string;
  author: "Ven Hồ Hotel";
  keywords: string[];
  readingTime: number;
  relatedSlugs: string[];
  ctaVariant: "rooms" | "direct-booking" | "west-lake-guide";
  intro: string[];
  quickAnswer: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
};

export const blogCategories: Record<BlogCategorySlug, { name: string; description: string }> = {
  "kham-pha-ho-tay": {
    name: "Khám phá Hồ Tây",
    description: "Cẩm nang trải nghiệm Hồ Tây, Nguyễn Đình Thi và khu vực Tây Hồ theo nhịp sống địa phương.",
  },
  "am-thuc-ho-tay": {
    name: "Ăn gì ở Hồ Tây",
    description: "Gợi ý cafe, món ăn và những điểm dừng chân dễ chịu quanh Hồ Tây.",
  },
  "cong-tac-ha-noi": {
    name: "Công tác Hà Nội",
    description: "Lịch trình gọn, tiện di chuyển và nghỉ ngơi cho khách đi công tác tại Hà Nội.",
  },
  "luu-tru-ho-tay": {
    name: "Lưu trú Hồ Tây",
    description: "Kinh nghiệm chọn khách sạn gần Hồ Tây, phù hợp cho nghỉ ngắn ngày hoặc ở dài hơn.",
  },
  "ven-ho-stories": {
    name: "Ven Hồ Stories",
    description: "Những câu chuyện nhỏ từ Ven Hồ Hotel và khu phố bên hồ.",
  },
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ho-tay-co-gi-choi",
    locale: "vi",
    title: "Hồ Tây Có Gì Chơi? Cẩm Nang Khám Phá Từ A-Z",
    excerpt:
      "Gợi ý cách khám phá Hồ Tây từ sáng đến tối: đi dạo Nguyễn Đình Thi, ngắm hoàng hôn, uống cafe ven hồ và chọn nơi lưu trú thuận tiện.",
    category: "kham-pha-ho-tay",
    coverImage: "/images/Hero-lake/hero-lake.jpg",
    alt: "Hồ Tây nhìn từ khu vực Nguyễn Đình Thi, Tây Hồ, Hà Nội",
    publishedAt: "2026-07-09",
    author: "Ven Hồ Hotel",
    keywords: ["Hồ Tây có gì chơi", "du lịch Hồ Tây", "Nguyễn Đình Thi Tây Hồ", "khách sạn gần Hồ Tây"],
    readingTime: 6,
    relatedSlugs: ["nguyen-dinh-thi-ho-tay", "top-cafe-view-ho-tay", "khach-san-gan-ho-tay"],
    ctaVariant: "west-lake-guide",
    intro: [
      "Hồ Tây là một trong những khu vực dễ chịu nhất để cảm nhận Hà Nội chậm hơn. Không chỉ có mặt hồ rộng, nơi đây còn có những con đường đẹp, nhiều quán cafe, nhà hàng, chùa cổ và các điểm dừng chân phù hợp cho cả du lịch lẫn công tác.",
      "Nếu bạn ở gần đường Nguyễn Đình Thi, việc khám phá Hồ Tây khá thuận tiện: buổi sáng có thể đi bộ ven hồ, ban ngày ghé các điểm văn hóa quanh Tây Hồ, chiều tối ngắm hoàng hôn và dùng bữa gần mặt nước.",
    ],
    quickAnswer:
      "Hồ Tây phù hợp để đi dạo, ngắm bình minh hoặc hoàng hôn, uống cafe ven hồ, khám phá chùa Trấn Quốc, thưởng thức ẩm thực khu Tây Hồ và chọn một khách sạn gần hồ để di chuyển nhẹ nhàng hơn.",
    sections: [
      {
        heading: "Buổi sáng: đi bộ ven Nguyễn Đình Thi",
        body: [
          "Nguyễn Đình Thi là một trong những tuyến đường đẹp để bắt đầu ngày mới ở Hồ Tây. Không khí sáng sớm thường thoáng, dễ đi bộ và có nhiều góc nhìn ra mặt hồ.",
          "Một lịch trình đơn giản là dậy sớm, đi bộ ven hồ, dùng bữa sáng nhẹ rồi quay lại khách sạn trước khi bắt đầu ngày tham quan hoặc làm việc.",
        ],
      },
      {
        heading: "Ban ngày: khám phá Tây Hồ theo cụm gần nhau",
        body: [
          "Thay vì chạy quá nhiều điểm xa nhau, bạn nên gom lịch trình theo cụm: khu hồ, các quán cafe, điểm văn hóa và nhà hàng gần nơi lưu trú.",
          "Cách đi này giúp tiết kiệm thời gian, đặc biệt nếu bạn chỉ có một hoặc hai ngày tại Hà Nội.",
        ],
      },
      {
        heading: "Chiều tối: dành thời gian cho hoàng hôn",
        body: [
          "Hoàng hôn là thời điểm Hồ Tây có nhiều cảm xúc nhất. Nếu thời tiết đẹp, chỉ cần một khoảng đi bộ ngắn ven hồ cũng đủ tạo cảm giác rất khác so với trung tâm phố đông.",
          "Bạn có thể kết hợp cafe chiều, ăn tối gần hồ rồi quay về nghỉ sớm nếu hôm sau cần bay hoặc làm việc.",
        ],
      },
      {
        heading: "Gần Ven Hồ Hotel",
        body: [
          "Ven Hồ Hotel nằm tại 181 Nguyễn Đình Thi, phù hợp với khách muốn ở gần Hồ Tây và ưu tiên lịch trình gọn. Từ khách sạn, bạn có thể bắt đầu ngày bằng một vòng đi bộ ven hồ trước khi di chuyển sang các khu vực khác của Hà Nội.",
        ],
      },
    ],
    faqs: [
      {
        question: "Nên đi Hồ Tây vào thời điểm nào trong ngày?",
        answer: "Sáng sớm và chiều muộn thường dễ chịu nhất để đi bộ, ngắm cảnh và chụp ảnh quanh hồ.",
      },
      {
        question: "Ở gần Hồ Tây có tiện đi trung tâm Hà Nội không?",
        answer: "Khu Tây Hồ phù hợp nếu bạn muốn không gian thoáng hơn nhưng vẫn cần di chuyển vào các quận trung tâm bằng taxi hoặc xe công nghệ.",
      },
      {
        question: "Có nên ở lại qua đêm gần Hồ Tây không?",
        answer: "Nên nếu bạn muốn trải nghiệm nhịp sống ven hồ, đi dạo buổi sáng và có không gian nghỉ yên hơn sau ngày dài.",
      },
    ],
  },
  {
    slug: "nguyen-dinh-thi-ho-tay",
    locale: "vi",
    title: "Nguyễn Đình Thi Hồ Tây: Vì Sao Đây Là Tuyến Đường Đáng Ở Khi Đến Hà Nội",
    excerpt:
      "Nguyễn Đình Thi có view hồ, nhịp sống chậm và vị trí thuận tiện cho khách muốn trải nghiệm Tây Hồ mà vẫn kết nối với trung tâm.",
    category: "kham-pha-ho-tay",
    coverImage: "/images/Lake-view/lake-view-1.jpg",
    alt: "View Hồ Tây từ khu vực Nguyễn Đình Thi",
    publishedAt: "2026-07-09",
    author: "Ven Hồ Hotel",
    keywords: ["Nguyễn Đình Thi Hồ Tây", "Tây Hồ Hà Nội", "ở đâu gần Hồ Tây"],
    readingTime: 4,
    relatedSlugs: ["ho-tay-co-gi-choi", "khach-san-gan-ho-tay", "top-cafe-view-ho-tay"],
    ctaVariant: "direct-booking",
    intro: [
      "Nguyễn Đình Thi là tuyến đường ven Hồ Tây quen thuộc với người Hà Nội. Với khách du lịch hoặc khách công tác, khu vực này có lợi thế rõ ràng: gần mặt nước, dễ đi bộ, nhiều điểm ăn uống và không quá tách biệt khỏi trung tâm.",
      "Nếu bạn muốn một nơi ở có cảm giác địa phương hơn so với các tuyến phố du lịch đông, đây là khu vực đáng cân nhắc.",
    ],
    quickAnswer:
      "Nguyễn Đình Thi đáng ở vì có không gian ven hồ, dễ đi bộ buổi sáng, gần nhiều điểm ăn uống Tây Hồ và thuận tiện để gọi xe đến các khu trung tâm.",
    sections: [
      {
        heading: "Không gian ven hồ giúp chuyến đi nhẹ hơn",
        body: [
          "Sau một ngày di chuyển hoặc làm việc, việc quay về một khu vực có mặt hồ và đường đi bộ thường tạo cảm giác dễ nghỉ hơn.",
          "Đây là điểm khác biệt lớn của khu Tây Hồ so với những khu phố quá dày đặc hoạt động.",
        ],
      },
      {
        heading: "Phù hợp cho cả du lịch và công tác",
        body: [
          "Khách công tác thường cần một nơi ngủ yên, dễ gọi xe và có các lựa chọn ăn uống gần đó. Khách du lịch lại cần điểm xuất phát thuận tiện để khám phá Hồ Tây.",
          "Nguyễn Đình Thi nằm ở giữa hai nhu cầu đó: đủ gần để trải nghiệm, đủ yên để nghỉ.",
        ],
      },
      {
        heading: "Gần Ven Hồ Hotel",
        body: [
          "Ven Hồ Hotel ở số 181 Nguyễn Đình Thi, phù hợp nếu bạn muốn chọn một điểm lưu trú nhỏ gọn, gần hồ và dễ liên hệ trực tiếp khi cần xác nhận phòng.",
        ],
      },
    ],
    faqs: [
      {
        question: "Nguyễn Đình Thi có gần Hồ Tây không?",
        answer: "Có. Đây là tuyến đường ven Hồ Tây, phù hợp để đi bộ và ngắm hồ vào sáng sớm hoặc chiều muộn.",
      },
      {
        question: "Khu này có phù hợp cho khách công tác không?",
        answer: "Có, nhất là với khách muốn nơi nghỉ yên hơn nhưng vẫn dễ di chuyển bằng taxi hoặc xe công nghệ.",
      },
    ],
  },
  {
    slug: "top-cafe-view-ho-tay",
    locale: "vi",
    title: "Cafe View Hồ Tây: Gợi Ý Cách Chọn Quán Đẹp Và Dễ Đi",
    excerpt:
      "Không cần chạy theo danh sách quá dài, bạn có thể chọn cafe Hồ Tây theo thời điểm trong ngày, góc nhìn và khoảng cách từ nơi lưu trú.",
    category: "am-thuc-ho-tay",
    coverImage: "/images/Lake-sunset/lake-sunset-1.jpg",
    alt: "Hoàng hôn Hồ Tây, Hà Nội",
    publishedAt: "2026-07-09",
    author: "Ven Hồ Hotel",
    keywords: ["cafe view Hồ Tây", "cafe Tây Hồ", "hoàng hôn Hồ Tây"],
    readingTime: 4,
    relatedSlugs: ["ho-tay-co-gi-choi", "nguyen-dinh-thi-ho-tay", "khach-san-gan-ho-tay"],
    ctaVariant: "west-lake-guide",
    intro: [
      "Cafe ven Hồ Tây là một trải nghiệm rất Hà Nội: không quá vội, nhiều ánh sáng và dễ ngồi lâu. Nhưng thay vì chỉ tìm quán nổi tiếng, bạn nên chọn theo thời điểm trong ngày và mục đích của mình.",
      "Buổi sáng hợp với quán yên, có chỗ ngồi thoáng. Buổi chiều nên ưu tiên góc ngắm hoàng hôn. Nếu đi công tác, một quán dễ gọi xe và có bàn ngồi làm việc sẽ thực tế hơn.",
    ],
    quickAnswer:
      "Để chọn cafe view Hồ Tây, hãy ưu tiên vị trí dễ đi từ nơi lưu trú, thời điểm có ánh sáng đẹp, chỗ ngồi thoải mái và không gian phù hợp với nhu cầu trò chuyện, làm việc hoặc ngắm cảnh.",
    sections: [
      {
        heading: "Chọn quán theo thời điểm trong ngày",
        body: [
          "Sáng sớm thích hợp cho cafe nhẹ, đọc sách hoặc chuẩn bị lịch trình. Chiều muộn phù hợp hơn nếu bạn muốn ngắm mặt hồ đổi màu.",
          "Nếu lịch trình ngắn, hãy chọn một quán gần khách sạn để không mất quá nhiều thời gian di chuyển.",
        ],
      },
      {
        heading: "Chọn theo nhu cầu thật",
        body: [
          "Đi một mình, đi cùng gia đình hay cần ngồi làm việc sẽ dẫn tới lựa chọn quán khác nhau. Một quán đẹp nhưng quá đông có thể không phù hợp nếu bạn cần nghỉ ngơi.",
          "Hãy ưu tiên trải nghiệm dễ chịu hơn là cố check-in quá nhiều điểm.",
        ],
      },
      {
        heading: "Gần Ven Hồ Hotel",
        body: [
          "Nếu lưu trú tại Ven Hồ Hotel, bạn có thể hỏi lễ tân gợi ý quán cafe gần khu Nguyễn Đình Thi theo thời điểm trong ngày. Cách hỏi địa phương thường giúp bạn chọn điểm đến thực tế hơn.",
        ],
      },
    ],
    faqs: [
      {
        question: "Cafe Hồ Tây nên đi sáng hay chiều?",
        answer: "Cả hai đều đẹp. Sáng hợp để bắt đầu ngày nhẹ nhàng, chiều hợp để ngắm hoàng hôn.",
      },
      {
        question: "Có cần đặt trước cafe Hồ Tây không?",
        answer: "Với các quán đông vào cuối tuần, bạn nên kiểm tra trước hoặc đi sớm hơn giờ cao điểm.",
      },
    ],
  },
  {
    slug: "khach-san-gan-ho-tay",
    locale: "vi",
    title: "Chọn Khách Sạn Gần Hồ Tây: Những Điều Nên Kiểm Tra Trước Khi Đặt",
    excerpt:
      "Một checklist ngắn giúp bạn chọn khách sạn gần Hồ Tây phù hợp: vị trí, loại phòng, kênh liên hệ, giờ nhận trả phòng và nhu cầu di chuyển.",
    category: "luu-tru-ho-tay",
    coverImage: "/images/Exterior/exterior-1.jpg",
    alt: "Mặt tiền Ven Hồ Hotel tại Nguyễn Đình Thi, Tây Hồ, Hà Nội",
    publishedAt: "2026-07-09",
    author: "Ven Hồ Hotel",
    keywords: ["khách sạn gần Hồ Tây", "hotel Tây Hồ", "khách sạn Nguyễn Đình Thi"],
    readingTime: 5,
    relatedSlugs: ["ho-tay-co-gi-choi", "nguyen-dinh-thi-ho-tay", "cong-tac-tay-ho-ha-noi"],
    ctaVariant: "rooms",
    intro: [
      "Tìm khách sạn gần Hồ Tây không chỉ là tìm nơi gần mặt hồ. Điều quan trọng hơn là nơi đó có phù hợp với cách bạn di chuyển, giờ bay, lịch làm việc và kiểu phòng bạn cần hay không.",
      "Một checklist ngắn trước khi đặt sẽ giúp bạn tránh chọn theo cảm tính và có trải nghiệm lưu trú dễ chịu hơn.",
    ],
    quickAnswer:
      "Khi chọn khách sạn gần Hồ Tây, hãy kiểm tra địa chỉ cụ thể, hình ảnh phòng thật, giờ check-in/check-out, kênh liên hệ trực tiếp, lựa chọn phòng và mức độ thuận tiện khi di chuyển.",
    sections: [
      {
        heading: "Kiểm tra địa chỉ và khu vực quanh khách sạn",
        body: [
          "Cùng là gần Hồ Tây nhưng trải nghiệm có thể khác nhau tùy tuyến đường. Hãy xem khách sạn nằm ở đâu, có dễ gọi xe không và có phù hợp với lịch trình của bạn không.",
          "Nếu bạn thích đi bộ ven hồ, khu Nguyễn Đình Thi là một lựa chọn đáng cân nhắc.",
        ],
      },
      {
        heading: "Xem loại phòng và hình ảnh thật",
        body: [
          "Nên xem kỹ loại phòng, số khách phù hợp, tiện nghi chính và ảnh phòng. Nếu cần view hồ hoặc phòng cho gia đình, hãy xác nhận trực tiếp trước khi đến.",
          "Điều này đặc biệt hữu ích vào cuối tuần hoặc mùa cao điểm.",
        ],
      },
      {
        heading: "Gần Ven Hồ Hotel",
        body: [
          "Ven Hồ Hotel có 12 phòng tại 181 Nguyễn Đình Thi, với các lựa chọn như Deluxe Đôi, Đôi View Hồ Tây và Tiêu Chuẩn Ba Người. Bạn có thể liên hệ trực tiếp để xác nhận phòng phù hợp trước khi đặt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Nên đặt trực tiếp hay qua OTA?",
        answer: "Bạn có thể dùng cả hai. Nếu cần hỏi nhanh về phòng cụ thể hoặc giờ đến, liên hệ trực tiếp với khách sạn thường tiện hơn.",
      },
      {
        question: "Check-in và check-out của Ven Hồ Hotel là mấy giờ?",
        answer: "Ven Hồ Hotel nhận phòng từ 13:00 và trả phòng lúc 12:00 trưa.",
      },
      {
        question: "Ven Hồ Hotel có bao nhiêu phòng?",
        answer: "Khách sạn có 12 phòng, nên bạn nên xác nhận sớm nếu đi vào thời điểm nhu cầu cao.",
      },
    ],
  },
  {
    slug: "cong-tac-tay-ho-ha-noi",
    locale: "vi",
    title: "Đi Công Tác Khu Tây Hồ: Cách Chọn Nơi Ở Và Lịch Trình Gọn",
    excerpt:
      "Gợi ý chọn nơi ở khi đi công tác quanh Tây Hồ: yên tĩnh, dễ gọi xe, có điểm ăn uống gần và thuận tiện nghỉ sau giờ làm.",
    category: "cong-tac-ha-noi",
    coverImage: "/images/Lake-night/lake-night.jpg",
    alt: "Hồ Tây buổi tối nhìn từ khu Tây Hồ, Hà Nội",
    publishedAt: "2026-07-09",
    author: "Ven Hồ Hotel",
    keywords: ["công tác Tây Hồ", "khách sạn công tác Hà Nội", "ở Tây Hồ khi đi công tác"],
    readingTime: 4,
    relatedSlugs: ["khach-san-gan-ho-tay", "nguyen-dinh-thi-ho-tay", "ho-tay-co-gi-choi"],
    ctaVariant: "direct-booking",
    intro: [
      "Khi đi công tác tại Hà Nội, nơi ở tốt không nhất thiết phải ở giữa khu đông nhất. Với nhiều người, một khách sạn yên, dễ gọi xe và có không gian nghỉ sau giờ làm lại quan trọng hơn.",
      "Khu Tây Hồ phù hợp với kiểu lưu trú đó: thoáng hơn, nhiều lựa chọn ăn uống và vẫn có thể kết nối đến các khu vực khác bằng xe công nghệ hoặc taxi.",
    ],
    quickAnswer:
      "Khi đi công tác khu Tây Hồ, hãy chọn nơi ở dễ gọi xe, có giờ nhận trả phòng rõ ràng, gần điểm ăn uống và đủ yên để nghỉ ngơi sau giờ làm.",
    sections: [
      {
        heading: "Ưu tiên lịch trình ít ma sát",
        body: [
          "Một chuyến công tác tốt thường phụ thuộc vào các chi tiết nhỏ: gọi xe nhanh, có nơi ăn gần, phòng đủ yên và lễ tân dễ liên hệ.",
          "Trước khi đặt phòng, bạn nên kiểm tra thời gian đến, nhu cầu xuất hóa đơn nếu có và số khách ở thực tế.",
        ],
      },
      {
        heading: "Giữ một khoảng nghỉ ven hồ",
        body: [
          "Nếu lịch làm việc dày, một vòng đi bộ ngắn quanh Hồ Tây vào sáng hoặc tối có thể giúp bạn cân bằng lại trước ngày tiếp theo.",
          "Đây là lý do nhiều khách công tác thích ở Tây Hồ thay vì chỉ chọn khu gần văn phòng.",
        ],
      },
      {
        heading: "Gần Ven Hồ Hotel",
        body: [
          "Ven Hồ Hotel phù hợp với khách cần nơi lưu trú gọn, dễ liên hệ, nằm gần Hồ Tây và có thể xác nhận phòng trực tiếp qua điện thoại hoặc form website.",
        ],
      },
    ],
    faqs: [
      {
        question: "Tây Hồ có phù hợp để đi công tác không?",
        answer: "Có, nếu bạn ưu tiên không gian nghỉ yên hơn, dễ gọi xe và có nhiều lựa chọn ăn uống sau giờ làm.",
      },
      {
        question: "Nên hỏi gì trước khi đặt phòng công tác?",
        answer: "Nên hỏi giờ nhận phòng, loại phòng, số khách, hình thức thanh toán và nhu cầu chứng từ nếu chuyến đi yêu cầu.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: BlogCategorySlug) {
  return blogPosts.filter((post) => post.category === category);
}

export function getRelatedPosts(post: BlogPost) {
  return post.relatedSlugs
    .map((slug) => getBlogPost(slug))
    .filter((related): related is BlogPost => Boolean(related));
}
