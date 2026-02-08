import { 
  FileCheck, 
  CreditCard, 
  QrCode, 
  BarChart3, 
  Search,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileCheck,
    title: "Inscription 100% en ligne",
    description: "Soumettez votre dossier d'inscription au Tableau de l'Ordre depuis n'importe où, sans déplacement au siège.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    href: "#inscription",
  },
  {
    icon: QrCode,
    title: "Carte e-CPS virtuelle",
    description: "Votre carte professionnelle sécurisée accessible sur smartphone avec QR code de vérification instantanée.",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    href: "#ecps",
  },
  {
    icon: CreditCard,
    title: "Paiement mobile simplifié",
    description: "Réglez vos cotisations via Airtel Money ou Moov Money, avec reçus et attestations automatiques.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    href: "#cotisations",
  },
  {
    icon: Search,
    title: "Annuaire vérifié",
    description: "Permettez aux patients de vérifier le statut de leur médecin en temps réel, contre l'exercice illégal.",
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    href: "#annuaire",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord analytique",
    description: "Visualisez la carte sanitaire du Gabon : répartition par spécialité, province et pyramide des âges.",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    href: "#statistiques",
  },
];

const FeaturesSection = () => {
  return (
    <section id="modules" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            Modules de la plateforme
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Une plateforme complète pour{" "}
            <span className="text-primary">moderniser</span> l'Ordre
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Cinq modules intégrés pour digitaliser l'ensemble des processus administratifs, 
            réglementaires et de vérification de l'Ordre des Médecins du Gabon.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <a
              key={feature.title}
              href={feature.href}
              className="group relative bg-card rounded-2xl p-6 lg:p-8 shadow-cnom hover:shadow-cnom-elevated transition-all duration-300 border border-border/50 hover:border-primary/20 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon */}
              <div className={`relative w-14 h-14 ${feature.lightColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color.replace('bg-', 'text-')}`} />
              </div>

              {/* Content */}
              <h3 className="relative text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="relative text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Link */}
              <div className="relative flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" variant="secondary">
            Découvrir tous les modules
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
