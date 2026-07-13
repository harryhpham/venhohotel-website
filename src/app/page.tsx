import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import BookingBar from "@/components/sections/BookingBar";
import StatsStrip from "@/components/sections/StatsStrip";
import FeaturedRooms from "@/components/sections/FeaturedRooms";
import WestLakeSection from "@/components/sections/WestLakeSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import NearbySection from "@/components/sections/NearbySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import LocationBlock from "@/components/sections/LocationBlock";
import JsonLd from "@/components/seo/JsonLd";

const hotelSchema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": "https://venhohotel.com/#hotel",
  name: "Ven Hồ Hotel",
  alternateName: "Ven Ho Hotel",
  description:
    "Khách sạn view Hồ Tây tại 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội. 12 phòng nghỉ, dịch vụ 24/7, cho thuê xe đạp.",
  url: "https://venhohotel.com",
  telephone: "+842438474646",
  email: "venhohotel@gmail.com",
  checkinTime: "13:00",
  checkoutTime: "12:00",
  numberOfRooms: 12,
  priceRange: "$$",
  currenciesAccepted: "VND, USD",
  paymentAccepted: "Cash, Credit Card",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "8.5",
    bestRating: "10",
    worstRating: "1",
    reviewCount: "45",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "181 Nguyễn Đình Thi",
    addressLocality: "Tây Hồ",
    addressRegion: "Hà Nội",
    postalCode: "100000",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 21.051,
    longitude: 105.8277,
  },
  image: [
    "https://venhohotel.com/images/Hero-lake/hero-lake.jpg",
    "https://venhohotel.com/images/Exterior/exterior-2.jpg",
    "https://venhohotel.com/images/Lake-view/lake-view-1.jpg",
  ],
  sameAs: [
    "https://www.facebook.com/venhohotelhanoi",
    "https://www.instagram.com/venhohotelhanoi",
  ],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "24-hour Front Desk", value: true },
    { "@type": "LocationFeatureSpecification", name: "Bicycle Rental", value: true },
    { "@type": "LocationFeatureSpecification", name: "West Lake View", value: true },
    { "@type": "LocationFeatureSpecification", name: "Room Service", value: true },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={hotelSchema} />
      <Navbar />
      <main>
        <Hero />
        <BookingBar />
        <StatsStrip />
        <FeaturedRooms />
        <WestLakeSection />
        <ServicesGrid />
        <NearbySection />
        <ReviewsSection />
        <LocationBlock />
      </main>
      <Footer />
    </>
  );
}
