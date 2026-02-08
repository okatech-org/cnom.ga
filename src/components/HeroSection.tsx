import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Shield, CheckCircle, ArrowRight } from "lucide-react";
import heroDoctorsLeft from "@/assets/hero-doctors-left.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image - Full width/height */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroDoctorsLeft}
          alt="Médecins gabonais professionnels"
          className="w-full h-full object-cover object-left" // Focus on left side content
        />
        {/* Subtle gradient overlay ONLY on the right to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Empty Space (Reserved for the doctors in the image) */}
          <div className="hidden lg:block">
            {/* The doctors are here */}
          </div>

          {/* Right - Text Content */}
          <div className="max-w-xl ml-auto lg:pl-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cnom-green/10 backdrop-blur-sm rounded-full text-cnom-green-dark text-sm font-medium mb-8 animate-fade-up opacity-0 border border-cnom-green/20">
              <Shield className="w-4 h-4 text-cnom-green" />
              <span>Plateforme officielle de l'Ordre</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-up opacity-0 stagger-1 drop-shadow-sm">
              Vérifiez l'inscription de votre{" "}
              <span className="text-cnom-green">médecin</span>{" "}
              en un instant
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed animate-fade-up opacity-0 stagger-2 font-medium">
              L'Ordre National des Médecins du Gabon garantit la sécurité sanitaire
              en vérifiant et régulant l'exercice de la médecine sur tout le territoire.
            </p>

            {/* Search Bar */}
            <div className="mb-8 animate-fade-up opacity-0 stagger-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cnom-green to-cnom-gold rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="flex-1 flex items-center px-5">
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <input
                      type="text"
                      placeholder="Nom, spécialité ou N° d'Ordre..."
                      className="w-full py-4 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base font-medium"
                    />
                  </div>
                  <Button size="lg" className="m-2 px-6 bg-cnom-green hover:bg-cnom-green-dark text-white">
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-800 animate-fade-up opacity-0 stagger-4 mb-8">
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/40">
                <CheckCircle className="w-4 h-4 text-cnom-green" />
                <span className="text-sm font-medium">
                  <strong>2 197+</strong> médecins
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/40">
                <CheckCircle className="w-4 h-4 text-cnom-green" />
                <span className="text-sm font-medium">
                  <strong>9</strong> provinces
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/40">
                <CheckCircle className="w-4 h-4 text-cnom-green" />
                <span className="text-sm font-medium">
                  Vérification <strong>instantanée</strong>
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-up opacity-0 stagger-5">
              <Button size="xl" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20" asChild>
                <Link to="/annuaire">
                  Vérifier un médecin
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="bg-white/80 hover:bg-white border-slate-200 text-slate-900" asChild>
                <Link to="/auth?mode=signup">
                  Espace Médecin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave - Darker fill to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
