import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Search } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cnom-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Doctors */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors group">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cnom-gold/30 transition-colors">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Vous êtes médecin ?
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Inscrivez-vous au Tableau de l'Ordre ou accédez à votre espace personnel 
              pour gérer votre dossier, vos cotisations et votre carte e-CPS.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" className="flex-1" asChild>
                <Link to="/auth?mode=signup">
                  S'inscrire maintenant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" className="flex-1" asChild>
                <Link to="/auth">
                  Connexion
                </Link>
              </Button>
            </div>
          </div>

          {/* For Public */}
          <div className="bg-cnom-gold/20 backdrop-blur-sm rounded-2xl p-8 border border-cnom-gold/30 hover:bg-cnom-gold/25 transition-colors group">
            <div className="w-14 h-14 bg-cnom-gold/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cnom-gold/50 transition-colors">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Vous êtes patient ?
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Vérifiez que votre médecin est bien inscrit au Tableau de l'Ordre. 
              Protégez-vous contre l'exercice illégal de la médecine.
            </p>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/annuaire">
                Vérifier un médecin
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-status-active rounded-full" />
            Plateforme officielle
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cnom-gold rounded-full" />
            Données sécurisées
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            Conforme APDPVP
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
