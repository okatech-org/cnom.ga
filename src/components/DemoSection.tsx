import { Link } from "react-router-dom";
import { Play, Monitor, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import digitalAdmin from "@/assets/digital-admin.jpg";

const features = [
  "Inscription 100% en ligne",
  "Carte e-CPS avec QR code",
  "Paiement mobile intégré",
  "Suivi en temps réel",
  "Annuaire vérifié",
  "Tableau de bord analytics"
];

const DemoSection = () => {
  return (
    <section id="demo" className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-background to-cnom-gold/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video/Demo Preview */}
          <div className="relative order-2 lg:order-1">
            <div className="relative bg-foreground rounded-3xl overflow-hidden shadow-2xl">
              {/* Browser mockup */}
              <div className="bg-foreground/90 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/10 rounded-lg px-4 py-1.5 text-white/60 text-sm">
                    cnom-gabon.ga/demo
                  </div>
                </div>
              </div>
              
              {/* Screen content with real image */}
              <div className="aspect-video relative">
                <img 
                  src={digitalAdmin} 
                  alt="Médecin utilisant la plateforme numérique" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group">
                  <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                  <span className="text-white text-sm">Découvrez la plateforme en 3 minutes</span>
                  <span className="text-white/70 text-sm">03:24</span>
                </div>
              </div>
            </div>

            {/* Floating device */}
            <div className="absolute -bottom-6 -right-6 bg-background rounded-2xl shadow-cnom-elevated p-3 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">PWA disponible</p>
                  <p className="text-xs text-muted-foreground">iOS & Android</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Démonstration
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Découvrez la plateforme en action
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Explorez les fonctionnalités de la nouvelle plateforme numérique du CNOM. 
              De l'inscription en ligne à la carte e-CPS, découvrez comment nous simplifions 
              vos démarches administratives.
            </p>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/demo">
                  <Play className="w-4 h-4" />
                  Voir la démo
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link to="/demo">
                  <Monitor className="w-4 h-4" />
                  Essayer le bac à sable
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
