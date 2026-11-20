import Banner from "@/components/home/Banner";
import CategorySection from "@/components/home/CategorySection";
import FeaturesItems from "@/components/home/FeaturesItems";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturesItems />
      <CategorySection />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </>
  );
}
