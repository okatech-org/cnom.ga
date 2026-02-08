import { Scale, BookOpen, ShieldCheck, Users } from "lucide-react";

const missions = [
  {
    icon: Scale,
    title: "Régulation Administrative",
    description: "Tenue du Tableau de l'Ordre, acte administratif officiel recensant tous les médecins habilités à exercer au Gabon.",
  },
  {
    icon: ShieldCheck,
    title: "Juridiction Disciplinaire",
    description: "Pouvoir de sanction via les chambres disciplinaires pour juger les manquements au Code de déontologie médicale.",
  },
  {
    icon: BookOpen,
    title: "Surveillance Déontologique",
    description: "Veille au maintien des principes de moralité, de probité et de dévouement indispensables à l'exercice de la médecine.",
  },
  {
    icon: Users,
    title: "Protection du Public",
    description: "Lutte contre l'exercice illégal de la médecine et garantie de la sécurité sanitaire des patients gabonais.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              L'Institution
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              L'Ordre National des Médecins du Gabon
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Établi par l'<strong>Ordonnance n°34/75</strong>, l'Ordre National des Médecins du Gabon 
              est l'instance régulatrice de la profession médicale. Il est dirigé par un bureau élu 
              présidé par le <strong>Dr Emmanuel OGANDAGA</strong>.
            </p>
            <p className="text-muted-foreground mb-8">
              Dans un contexte où le Gabon s'affirme comme un leader régional en matière d'infrastructures 
              numériques sous l'impulsion de l'ANINF, l'Ordre entame sa transformation numérique pour garantir 
              la sécurité sanitaire, l'efficacité administrative et la conformité aux nouveaux standards légaux 
              (Loi n°025/2023 sur la protection des données).
            </p>

            {/* Bureau */}
            <div className="bg-muted/50 rounded-xl p-5 border border-border/50">
              <h4 className="font-semibold text-foreground mb-3">Bureau National</h4>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Président</p>
                  <p className="font-medium text-foreground">Dr Emmanuel OGANDAGA</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vice-Président</p>
                  <p className="font-medium text-foreground">Dr Cyrille MOUYOPA</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Secrétaire Générale</p>
                  <p className="font-medium text-foreground">Dr Georgette NDONG</p>
                </div>
              </div>
            </div>
          </div>

          {/* Missions Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {missions.map((mission) => (
              <div
                key={mission.title}
                className="bg-card rounded-xl p-5 border border-border/50 hover:border-primary/20 hover:shadow-cnom transition-all group"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <mission.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{mission.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{mission.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
