import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import ChallengesSection from "@/components/ChallengesSection";
import FeaturesSection from "@/components/FeaturesSection";
import DirectoryPreview from "@/components/DirectoryPreview";
import EcpsSection from "@/components/EcpsSection";
import DashboardSection from "@/components/DashboardSection";
import GabonMap from "@/components/GabonMap";
import RoadmapSection from "@/components/RoadmapSection";
import ActualitesSection from "@/components/ActualitesSection";
import PharmacovigilanceSection from "@/components/PharmacovigilanceSection";
import DemoSection from "@/components/DemoSection";
import PartnersSection from "@/components/PartnersSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import InscriptionModalites from "@/components/InscriptionModalites";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <ChallengesSection />
        <FeaturesSection />
        <InscriptionModalites />
        <DirectoryPreview />
        <EcpsSection />
        <DashboardSection />
        <GabonMap />
        <RoadmapSection />
        <ActualitesSection />
        <PharmacovigilanceSection />
        <DemoSection />
        <PartnersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
