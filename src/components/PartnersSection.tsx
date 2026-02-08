import { Building2, Globe, Shield, Database } from "lucide-react";

const partners = [
  {
    name: "ANINF",
    fullName: "Agence Nationale des Infrastructures Numériques",
    description: "Infrastructure cloud souveraine et interopérabilité e-Gabon SIS",
    icon: Database,
  },
  {
    name: "APDPVP",
    fullName: "Autorité de Protection des Données",
    description: "Conformité Loi 025/2023 et protection des données personnelles",
    icon: Shield,
  },
  {
    name: "e-Gabon SIS",
    fullName: "Système d'Information de Santé",
    description: "Intégration au système national de santé numérique",
    icon: Globe,
  },
  {
    name: "Ministère de la Santé",
    fullName: "République Gabonaise",
    description: "Tutelle et planification de la carte sanitaire nationale",
    icon: Building2,
  },
];

const PartnersSection = () => {
  return (
    <section className="py-16 bg-muted/50 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2">
            Partenaires institutionnels
          </p>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Un écosystème numérique souverain
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-background rounded-xl p-6 border border-border/50 hover:border-primary/20 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <partner.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-1">{partner.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{partner.fullName}</p>
              <p className="text-xs text-muted-foreground/80">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
