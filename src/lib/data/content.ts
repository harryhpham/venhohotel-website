export const siteContent = {
  vi: {
    nav: {
      rooms: "Phòng", amenities: "Tiện Ích", location: "Vị Trí",
      about: "Về Chúng Tôi", book: "Đặt Phòng",
    },
    hero: {
      label: "Tây Hồ, Hà Nội — Việt Nam",
      headline1: "Ngắm Nhìn", headline2: "Hồ Tây", headline3: "Từ Phòng Ngủ",
      subline: "181 Nguyễn Đình Thi, Tây Hồ, Hà Nội",
      cta_primary: "Đặt Phòng Ngay", cta_secondary: "Xem Phòng",
    },
    westLake: {
      label: "Trải Nghiệm Hồ Tây",
      headline: ["Nơi Hồ Tây", "Gặp Gỡ", "Sự Tinh Tế"],
      // Chỉnh sửa bài viết này thường xuyên — theo mùa hoặc dịp đặc biệt
      body: "Hồ Tây vào mùa hè lung linh dưới ánh đèn phản chiếu — những buổi tối dạo quanh hồ, thưởng thức kem tràng tiền và nghe gió thổi qua hàng liễu rủ.",
      quote: "Nằm trên giường ngắm Hồ Tây lúc lên đèn, còn gì thú vị hơn?",
      quoteAuthor: "Khách lưu trú tại Ven Hồ Hotel",
      scoreValue: "9.2", scoreLabel: "Điểm Vị Trí",
    },
    stats: {
      rooms: "Phòng Nghỉ", agoda: "Agoda Rating",
      location: "Điểm Vị Trí", service: "Dịch Vụ",
    },
    rooms: { label: "Phòng Nghỉ", heading: "Không Gian Ven Hồ", viewAll: "Xem tất cả phòng →" },
    reviews: {
      label: "Đánh Giá Khách Hàng",
      featuredQuote: "Nằm trên giường ngắm Hồ Tây lúc lên đèn, còn gì thú vị hơn?",
      featuredSource: "Khách lưu trú đã xác nhận · Agoda",
      overallScore: "8.5", overallLabel: "/ 10 — Rất Tốt",
      reviewCount: "45 đánh giá trên Agoda",
    },
    contact: {
      address: "181 Nguyễn Đình Thi, Tây Hồ, Hà Nội",
      phone: "024 3847 4646",
      checkin: "12:00 — 20:00", checkout: "6:00 — 12:00",
      tagline: "Nơi Hồ Tây Gặp Gỡ Sự Tinh Tế",
    },
  },

  en: {
    nav: {
      rooms: "Rooms", amenities: "Amenities", location: "Location",
      about: "About Us", book: "Book Now",
    },
    hero: {
      label: "Tay Ho, Hanoi — Vietnam",
      headline1: "Wake Up To", headline2: "West Lake", headline3: "From Your Bed",
      subline: "181 Nguyen Dinh Thi, Tay Ho, Hanoi",
      cta_primary: "Book Now", cta_secondary: "View Rooms",
    },
    westLake: {
      label: "West Lake Experience",
      headline: ["Where West Lake", "Meets", "Elegance"],
      // Update this body text regularly — by season or special occasion
      body: "West Lake shimmers in summer under reflected city lights — evening strolls around the lake, Trang Tien ice cream, and the breeze through weeping willows.",
      quote: "Lying on the bed admiring West Lake lit up at night — what could be more delightful?",
      quoteAuthor: "Verified guest at Ven Ho Hotel",
      scoreValue: "9.2", scoreLabel: "Location Score",
    },
    stats: {
      rooms: "Rooms", agoda: "Agoda Rating",
      location: "Location Score", service: "Service",
    },
    rooms: { label: "Rooms", heading: "Spaces at Ven Ho", viewAll: "View all rooms →" },
    reviews: {
      label: "Guest Reviews",
      featuredQuote: "Lying on the bed admiring West Lake lit up at night — what could be more delightful?",
      featuredSource: "Verified guest · Agoda",
      overallScore: "8.5", overallLabel: "/ 10 — Very Good",
      reviewCount: "45 reviews on Agoda",
    },
    contact: {
      address: "181 Nguyen Dinh Thi, Tay Ho, Hanoi",
      phone: "024 3847 4646",
      checkin: "12:00 PM — 8:00 PM", checkout: "6:00 AM — 12:00 PM",
      tagline: "Where West Lake Meets Elegance",
    },
  },
};

// ============================================================
// NỘI DUNG TUẦN NÀY — Cập nhật mỗi thứ Hai
// Sau khi cập nhật: npm run build → deploy lên Vercel
// Cùng nội dung này đăng lên Facebook page
// ============================================================
export const weeklyContent = {
  // Tiêu đề bài viết tuần này (dùng cho cả website và Facebook caption)
  title: "Hồ Tây mùa hè — Gió mát và ánh đèn lung linh",

  // Nội dung đầy đủ cho website (section Trải Nghiệm Hồ Tây)
  websiteBody: "Hồ Tây vào mùa hè lung linh dưới ánh đèn phản chiếu — những buổi tối dạo quanh hồ, thưởng thức kem tràng tiền và nghe gió thổi qua hàng liễu rủ.",

  // Caption ngắn cho Facebook (150-200 ký tự)
  facebookCaption: "Buổi tối tại Ven Hồ Hotel 🌙 Hồ Tây lên đèn từ cửa sổ phòng ngủ — khoảnh khắc không thể quên cho mỗi chuyến nghỉ dưỡng tại Hà Nội. Đặt phòng ngay hôm nay! 👇",

  // Hashtags cho Facebook
  hashtags: "#VenHoHotel #HoTay #WestLake #HaNoi #TayHo #KhachSanHaNoi #DuLichHaNoi #HotelHanoi",

  // Ảnh đại diện tuần này (từ public/images/)
  featuredImage: "/images/Lake-view/lake-view-1.jpg",

  // Ngày đăng
  publishDate: "2026-06-09",
};
