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
  locale: "vi" | "en";
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

export type BlogLang = "vi" | "en";

export const blogCategories: Record<BlogCategorySlug, Record<BlogLang, { name: string; description: string }>> = {
  "kham-pha-ho-tay": {
    vi: {
      name: "Khám phá Hồ Tây",
      description: "Cẩm nang trải nghiệm Hồ Tây, Nguyễn Đình Thi và khu vực Tây Hồ theo nhịp sống địa phương.",
    },
    en: {
      name: "Explore West Lake",
      description: "Local guides to West Lake, Nguyen Dinh Thi Street and the Tay Ho area.",
    },
  },
  "am-thuc-ho-tay": {
    vi: {
      name: "Ăn gì ở Hồ Tây",
      description: "Gợi ý cafe, món ăn và những điểm dừng chân dễ chịu quanh Hồ Tây.",
    },
    en: {
      name: "Eat & Drink",
      description: "Coffee, casual meals and easy stops around West Lake.",
    },
  },
  "cong-tac-ha-noi": {
    vi: {
      name: "Công tác Hà Nội",
      description: "Lịch trình gọn, tiện di chuyển và nghỉ ngơi cho khách đi công tác tại Hà Nội.",
    },
    en: {
      name: "Business in Hanoi",
      description: "Simple stays and smoother schedules for business travelers in Hanoi.",
    },
  },
  "luu-tru-ho-tay": {
    vi: {
      name: "Lưu trú Hồ Tây",
      description: "Kinh nghiệm chọn khách sạn gần Hồ Tây, phù hợp cho nghỉ ngắn ngày hoặc ở dài hơn.",
    },
    en: {
      name: "Stay Near West Lake",
      description: "Practical notes for choosing a hotel near West Lake for short or longer stays.",
    },
  },
  "ven-ho-stories": {
    vi: {
      name: "Ven Hồ Stories",
      description: "Những câu chuyện nhỏ từ Ven Hồ Hotel và khu phố bên hồ.",
    },
    en: {
      name: "Ven Ho Stories",
      description: "Small stories from Ven Ho Hotel and the neighborhood by the lake.",
    },
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

type BlogPostTranslation = Pick<
  BlogPost,
  "title" | "excerpt" | "alt" | "keywords" | "intro" | "quickAnswer" | "sections" | "faqs"
>;

const englishPosts: Record<string, BlogPostTranslation> = {
  "ho-tay-co-gi-choi": {
    title: "What To Do Around West Lake Hanoi: A Local Guide",
    excerpt:
      "A simple guide to West Lake from morning to evening: walk along Nguyen Dinh Thi, catch sunset, find coffee by the water and stay nearby.",
    alt: "West Lake seen from the Nguyen Dinh Thi area in Tay Ho, Hanoi",
    keywords: ["what to do in West Lake Hanoi", "West Lake travel guide", "Nguyen Dinh Thi Tay Ho", "hotel near West Lake"],
    intro: [
      "West Lake is one of the easiest places to experience a calmer side of Hanoi. Beyond the wide water view, the area has walkable streets, coffee shops, restaurants, temples and simple stops that work well for both leisure and business trips.",
      "If you stay near Nguyen Dinh Thi Street, exploring West Lake is straightforward: walk by the lake in the morning, visit nearby cultural spots during the day, then return for sunset and dinner close to the water.",
    ],
    quickAnswer:
      "West Lake is ideal for walking, sunrise or sunset views, lakeside coffee, visiting Tran Quoc Pagoda, trying Tay Ho food and choosing a hotel near the lake for easier movement.",
    sections: [
      {
        heading: "Morning: walk along Nguyen Dinh Thi",
        body: [
          "Nguyen Dinh Thi is one of the pleasant streets for starting a day around West Lake. Early mornings are usually cooler, quieter and open to wide lake views.",
          "A simple plan is to wake up early, walk by the lake, have a light breakfast and return to the hotel before sightseeing or work.",
        ],
      },
      {
        heading: "Daytime: keep your route compact",
        body: [
          "Instead of crossing the city for too many stops, group your route around the lake, nearby coffee shops, cultural sites and restaurants close to your stay.",
          "This saves time, especially if you only have one or two days in Hanoi.",
        ],
      },
      {
        heading: "Late afternoon: make time for sunset",
        body: [
          "Sunset is when West Lake feels most atmospheric. On a clear day, even a short walk near the water can feel very different from the busier parts of central Hanoi.",
          "You can pair it with afternoon coffee, dinner nearby and an early return if you have work or a flight the next morning.",
        ],
      },
      {
        heading: "Near Ven Ho Hotel",
        body: [
          "Ven Ho Hotel is located at 181 Nguyen Dinh Thi, a practical base for guests who want to stay close to West Lake and keep the day simple. From the hotel, you can begin with a short lakeside walk before moving to other parts of Hanoi.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best time to visit West Lake?",
        answer: "Early morning and late afternoon are usually the most comfortable times for walking, views and photos around the lake.",
      },
      {
        question: "Is West Lake convenient for central Hanoi?",
        answer: "Tay Ho works well if you prefer a more open area while still being able to reach central districts by taxi or ride-hailing apps.",
      },
      {
        question: "Should I stay overnight near West Lake?",
        answer: "Yes, if you want a calmer lakeside rhythm, morning walks and a quieter place to return to after a long day.",
      },
    ],
  },
  "nguyen-dinh-thi-ho-tay": {
    title: "Nguyen Dinh Thi, West Lake: Why This Street Is Worth Staying On",
    excerpt:
      "Nguyen Dinh Thi offers lake views, a slower local rhythm and a convenient base for experiencing Tay Ho while staying connected to central Hanoi.",
    alt: "West Lake view from the Nguyen Dinh Thi area",
    keywords: ["Nguyen Dinh Thi West Lake", "Tay Ho Hanoi", "where to stay near West Lake"],
    intro: [
      "Nguyen Dinh Thi is a familiar lakeside street for Hanoians. For travelers and business guests, the area has clear advantages: close to the water, easy to walk, near food and coffee, and not too far from the city center.",
      "If you want a stay that feels more local than the busiest tourist streets, this area is worth considering.",
    ],
    quickAnswer:
      "Nguyen Dinh Thi is worth staying on because it is by the lake, easy for morning walks, close to Tay Ho food and coffee, and convenient for taking a car into central districts.",
    sections: [
      {
        heading: "A lakeside setting makes the trip lighter",
        body: [
          "After a day of travel or work, returning to an area with water views and walkable streets often feels easier to rest in.",
          "That is one of Tay Ho's biggest differences from denser city neighborhoods.",
        ],
      },
      {
        heading: "Useful for both leisure and business",
        body: [
          "Business guests often need a quiet room, easy transport and nearby food. Leisure travelers need a good base for exploring West Lake.",
          "Nguyen Dinh Thi sits between those needs: close enough to experience the area, calm enough to rest.",
        ],
      },
      {
        heading: "Near Ven Ho Hotel",
        body: [
          "Ven Ho Hotel is at 181 Nguyen Dinh Thi, suitable for guests looking for a compact stay near the lake with easy direct contact before arrival.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Nguyen Dinh Thi close to West Lake?",
        answer: "Yes. It is a lakeside street, suitable for walking and lake views in the morning or late afternoon.",
      },
      {
        question: "Is this area suitable for business travelers?",
        answer: "Yes, especially for guests who want a quieter stay while still being able to move around by taxi or ride-hailing apps.",
      },
    ],
  },
  "top-cafe-view-ho-tay": {
    title: "West Lake View Cafes: How To Choose A Good, Easy Stop",
    excerpt:
      "Instead of chasing a long list, choose a West Lake cafe by time of day, view, seating and distance from where you stay.",
    alt: "Sunset over West Lake in Hanoi",
    keywords: ["West Lake cafe", "Tay Ho cafe", "West Lake sunset"],
    intro: [
      "Lakeside coffee is a very Hanoi experience: slower, bright and easy to linger over. But instead of only looking for famous places, choose based on the time of day and what you actually need.",
      "Morning works well for quiet coffee and planning the day. Late afternoon is better for sunset views. If you are in Hanoi for work, an easy-to-reach cafe with comfortable seating may matter more.",
    ],
    quickAnswer:
      "To choose a West Lake cafe, prioritize a location close to your stay, good light for the time of day, comfortable seating and a space that fits conversation, work or lake views.",
    sections: [
      {
        heading: "Choose by time of day",
        body: [
          "Early morning is good for light coffee, reading or planning. Late afternoon is better if you want to watch the lake change color.",
          "If your schedule is short, choose somewhere near the hotel so you do not spend too much time moving around.",
        ],
      },
      {
        heading: "Choose by your real need",
        body: [
          "Solo travel, family time and work calls all require different kinds of cafes. A beautiful but crowded cafe may not be the best choice if you need to rest.",
          "A comfortable experience is usually better than trying to check off too many places.",
        ],
      },
      {
        heading: "Near Ven Ho Hotel",
        body: [
          "If you stay at Ven Ho Hotel, ask the front desk for cafe suggestions around Nguyen Dinh Thi based on the time of day. Local guidance often leads to a more practical choice.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I visit West Lake cafes in the morning or afternoon?",
        answer: "Both can be good. Morning is calmer; late afternoon is better for sunset.",
      },
      {
        question: "Do I need to book a cafe in advance?",
        answer: "For popular places on weekends, it is worth checking ahead or going before peak hours.",
      },
    ],
  },
  "khach-san-gan-ho-tay": {
    title: "Choosing A Hotel Near West Lake: What To Check Before Booking",
    excerpt:
      "A short checklist for choosing a hotel near West Lake: location, room type, direct contact, check-in time and transport needs.",
    alt: "Ven Ho Hotel exterior on Nguyen Dinh Thi Street, Tay Ho, Hanoi",
    keywords: ["hotel near West Lake", "Tay Ho hotel", "hotel on Nguyen Dinh Thi"],
    intro: [
      "Finding a hotel near West Lake is not only about being close to the water. The better question is whether the location fits your transport, flight time, work schedule and room needs.",
      "A short checklist before booking can help you avoid guesswork and make the stay easier.",
    ],
    quickAnswer:
      "When choosing a hotel near West Lake, check the exact address, real room photos, check-in and check-out times, direct contact options, room choices and transport convenience.",
    sections: [
      {
        heading: "Check the address and surrounding area",
        body: [
          "Two hotels can both be near West Lake but feel very different depending on the street. Check where the hotel is, how easy it is to get a car and whether it fits your plan.",
          "If you like lakeside walks, Nguyen Dinh Thi is a useful area to consider.",
        ],
      },
      {
        heading: "Look at room type and real photos",
        body: [
          "Check the room type, guest capacity, key amenities and room photos. If you need a lake view or a family room, confirm directly before arrival.",
          "This is especially useful on weekends or during busy periods.",
        ],
      },
      {
        heading: "Near Ven Ho Hotel",
        body: [
          "Ven Ho Hotel has 12 rooms at 181 Nguyen Dinh Thi, including Deluxe Double, Double Lake View and Standard Triple options. You can contact the hotel directly to confirm the right room before booking.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I book directly or through an OTA?",
        answer: "Both can work. If you need to ask about a specific room or arrival time, direct contact with the hotel is often more convenient.",
      },
      {
        question: "What are Ven Ho Hotel's check-in and check-out times?",
        answer: "Check-in is from 13:00 and check-out is at 12:00 noon.",
      },
      {
        question: "How many rooms does Ven Ho Hotel have?",
        answer: "The hotel has 12 rooms, so it is best to confirm early during busy periods.",
      },
    ],
  },
  "cong-tac-tay-ho-ha-noi": {
    title: "Business Travel In Tay Ho: Choosing A Stay And Keeping The Schedule Simple",
    excerpt:
      "A practical guide for business stays around Tay Ho: quiet rooms, easy transport, nearby food and a calmer place to return to after work.",
    alt: "West Lake at night in Tay Ho, Hanoi",
    keywords: ["business travel Tay Ho", "business hotel Hanoi", "stay in Tay Ho for work"],
    intro: [
      "For a business trip in Hanoi, the best place to stay does not always have to be in the busiest district. For many guests, a quiet hotel, easy transport and a place to rest after work matter more.",
      "Tay Ho fits that style of stay: more open, with many food options, while still connected to other parts of Hanoi by taxi or ride-hailing apps.",
    ],
    quickAnswer:
      "For business travel in Tay Ho, choose a stay with easy car access, clear check-in and check-out times, nearby dining and a quiet room for rest after work.",
    sections: [
      {
        heading: "Prioritize a low-friction schedule",
        body: [
          "A good business stay often depends on small details: quick transport, nearby food, a quiet room and a front desk that is easy to contact.",
          "Before booking, check your arrival time, invoice needs if any and the actual number of guests.",
        ],
      },
      {
        heading: "Keep a small lakeside break",
        body: [
          "If your work schedule is dense, a short walk around West Lake in the morning or evening can help reset the day.",
          "That is why many business guests like Tay Ho instead of staying only near office districts.",
        ],
      },
      {
        heading: "Near Ven Ho Hotel",
        body: [
          "Ven Ho Hotel is suitable for guests who need a compact stay, easy contact, a location near West Lake and the option to confirm rooms directly by phone or website form.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Tay Ho suitable for business travel?",
        answer: "Yes, especially if you prefer a quieter stay, easy car access and food options after work.",
      },
      {
        question: "What should I ask before booking a business stay?",
        answer: "Ask about check-in time, room type, number of guests, payment method and invoice needs if required.",
      },
    ],
  },
};

export function getBlogCategory(category: BlogCategorySlug, lang: BlogLang = "vi") {
  return blogCategories[category][lang];
}

export function getLocalizedBlogPost(post: BlogPost, lang: BlogLang = "vi"): BlogPost {
  if (lang === "vi") return post;
  const translation = englishPosts[post.slug];
  return translation ? { ...post, ...translation, locale: "en" } : post;
}

export function getLocalizedBlogPosts(lang: BlogLang = "vi") {
  return blogPosts.map((post) => getLocalizedBlogPost(post, lang));
}

export function getLocalizedRelatedPosts(post: BlogPost, lang: BlogLang = "vi") {
  return getRelatedPosts(post).map((related) => getLocalizedBlogPost(related, lang));
}

export function getPostsByCategory(category: BlogCategorySlug) {
  return blogPosts.filter((post) => post.category === category);
}

export function getRelatedPosts(post: BlogPost) {
  return post.relatedSlugs
    .map((slug) => getBlogPost(slug))
    .filter((related): related is BlogPost => Boolean(related));
}
