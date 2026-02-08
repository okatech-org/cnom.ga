import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import InstitutionSection from "@/components/InstitutionSection";
import ServicesHub from "@/components/ServicesHub";
import InscriptionModalites from "@/components/InscriptionModalites";
import ActualitesSection from "@/components/ActualitesSection";
import PartnersSection from "@/components/PartnersSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Institution (About + Stats + Challenges) */}
        <InstitutionSection />

        {/* 3. Services Hub (Directory + Map + e-CPS + Pharmaco) */}
        <ServicesHub />

        {/* 4. Inscription (Action) */}
        <InscriptionModalites />

        {/* 5. News (Updates) */}
        <ActualitesSection />

        {/* 6. Partners */}
        <PartnersSection />

        {/* 7. CTA (Médecin + Patient + Contact) */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
