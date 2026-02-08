import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play, Monitor, Smartphone, CheckCircle2, ArrowRight, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Inscription 100% en ligne",
  "Carte e-CPS avec QR code",
  "Paiement mobile intégré",
  "Suivi en temps réel",
  "Annuaire vérifié",
  "Tableau de bord analytics"
];

const modules = [
  {
    icon: Users,
    title: "Répertoire numérique",
    description: "Identifiant unique pour chaque médecin avec vérification en temps réel."
  },
  {
    icon: Shield,
    title: "Inscription en ligne",
    description: "Workflow de validation complet avec suivi de dossier."
  },
  {
    icon: Zap,
    title: "Carte e-CPS",
    description: "Carte professionnelle virtuelle avec QR code dynamique."
  }
];

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-cnom-gold/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  Démonstration
                </span>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Découvrez la plateforme en action
                </h1>
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
                  <Button size="lg" className="gap-2">
                    <Play className="w-4 h-4" />
                    Voir la démo
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Monitor className="w-4 h-4" />
                    Essayer le bac à sable
                  </Button>
                </div>
              </div>

              {/* Video/Demo Preview */}
              <div className="relative">
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
                  
                  {/* Screen content */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-cnom-gold/20 relative flex items-center justify-center">
                    <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group">
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
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Les modules de la plateforme
              </h2>
              <p className="text-muted-foreground text-lg">
                Une suite complète d'outils pour moderniser la gestion de l'Ordre.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {modules.map((module, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-cnom-elevated transition-all group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <module.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {module.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {module.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Prêt à découvrir la plateforme ?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Contactez-nous pour une démonstration personnalisée ou accédez directement 
                à l'environnement de test.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  Demander une démo
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Accéder au bac à sable
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
