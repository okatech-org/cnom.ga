import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import DirectoryPreview from "@/components/DirectoryPreview";
import EcpsSection from "@/components/EcpsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <DirectoryPreview />
        <EcpsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
