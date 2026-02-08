import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import DirectoryPreview from "@/components/DirectoryPreview";
import EcpsSection from "@/components/EcpsSection";
import ActualitesSection from "@/components/ActualitesSection";
import PharmacovigilanceSection from "@/components/PharmacovigilanceSection";
import DemoSection from "@/components/DemoSection";
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
        <ActualitesSection />
        <PharmacovigilanceSection />
        <DemoSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
