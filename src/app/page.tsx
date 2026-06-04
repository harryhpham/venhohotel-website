import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import StatsStrip from "@/components/sections/StatsStrip";
import FeaturedRooms from "@/components/sections/FeaturedRooms";
import WestLakeSection from "@/components/sections/WestLakeSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import NearbySection from "@/components/sections/NearbySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import LocationBlock from "@/components/sections/LocationBlock";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
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
