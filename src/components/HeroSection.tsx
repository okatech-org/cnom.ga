import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Shield, CheckCircle, ArrowRight } from "lucide-react";
import heroDoctor from "@/assets/hero-doctor.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroDoctor} 
          alt="Médecin gabonais professionnel" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-cnom-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" className="text-white" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" className="text-white" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" className="text-white" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-fade-up opacity-0">
            <Shield className="w-4 h-4 text-cnom-gold" />
            <span>Plateforme officielle de l'Ordre National des Médecins</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight animate-fade-up opacity-0 stagger-1">
            Vérifiez l'inscription de votre{" "}
            <span className="text-cnom-gold">médecin</span>{" "}
            en un instant
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up opacity-0 stagger-2">
            L'Ordre National des Médecins du Gabon garantit la sécurité sanitaire 
            en vérifiant et régulant l'exercice de la médecine sur tout le territoire.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 animate-fade-up opacity-0 stagger-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cnom-gold to-white/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative flex items-center bg-white rounded-xl shadow-cnom-elevated overflow-hidden">
                <div className="flex-1 flex items-center px-5">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, spécialité ou N° d'Ordre..."
                    className="w-full py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                  />
                </div>
                <Button size="lg" className="m-2 px-6">
                  Rechercher
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white animate-fade-up opacity-0 stagger-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cnom-gold" />
              <span className="text-sm md:text-base">
                <strong className="font-bold">2 197+</strong> médecins inscrits
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cnom-gold" />
              <span className="text-sm md:text-base">
                <strong className="font-bold">9</strong> provinces couvertes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cnom-gold" />
              <span className="text-sm md:text-base">
                Vérification <strong className="font-bold">instantanée</strong>
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-up opacity-0 stagger-5">
            <Button variant="hero" size="xl" asChild>
              <Link to="/annuaire">
                Vérifier un médecin
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/auth?mode=signup">
                S'inscrire maintenant
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
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
