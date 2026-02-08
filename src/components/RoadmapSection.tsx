import { CheckCircle2, Clock, ArrowRight, Target } from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    title: "Cadrage & Assainissement",
    duration: "4 mois",
    status: "completed",
    items: [
      "Audit juridique et mise en conformité APDPVP",
      "Nettoyage de la base de données existante",
      "Rédaction du cahier des charges technique",
      "Campagne de ré-enrôlement des médecins",
    ],
  },
  {
    phase: "Phase 2",
    title: "Développement Core",
    duration: "5 mois",
    status: "in-progress",
    items: [
      "Base de données centrale et Back-Office",
      "Numérisation industrielle des archives",
      "Intégration paiement mobile (Airtel/Moov)",
      "Validation conformité Privacy by Design",
    ],
  },
  {
    phase: "Phase 3",
    title: "Lancement Pilote",
    duration: "3 mois",
    status: "upcoming",
    items: [
      "Test avec le bureau national et présidents régionaux",
      "Validation des modules paiement et upload",
      "Formation du personnel administratif",
      "Correction des anomalies identifiées",
    ],
  },
  {
    phase: "Phase 4",
    title: "Déploiement National",
    duration: "9 mois",
    status: "upcoming",
    items: [
      "Obligation d'activation compte en ligne",
      "Lancement de l'Annuaire Public",
      "Déploiement de la Carte e-CPS",
      "Campagne grand public de communication",
    ],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-primary" />;
    case "in-progress":
      return <Clock className="w-5 h-5 text-cnom-gold animate-pulse" />;
    default:
      return <Target className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "border-primary bg-primary/5";
    case "in-progress":
      return "border-cnom-gold bg-cnom-gold/5";
    default:
      return "border-border bg-background";
  }
};

const RoadmapSection = () => {
  return (
    <section id="roadmap" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Feuille de route
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Transformation numérique en 18-24 mois
          </h2>
          <p className="text-muted-foreground text-lg">
            Une approche progressive et itérative pour digitaliser l'ensemble des processus 
            de l'Ordre National des Médecins du Gabon.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {phases.map((phase, index) => (
              <div
                key={phase.phase}
                className={`relative rounded-2xl border-2 p-6 lg:p-8 ${getStatusColor(phase.status)} transition-all hover:shadow-cnom`}
              >
                {/* Phase Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(phase.status)}
                    <span className="text-sm font-semibold text-primary">{phase.phase}</span>
                  </div>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {phase.duration}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  {phase.title}
                </h3>

                {/* Items */}
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Status Label */}
                {phase.status === "in-progress" && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-cnom-gold text-white text-xs font-semibold rounded-full">
                    En cours
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Objectif : Faire du CNOM-Gabon un modèle de régulation professionnelle moderne en Afrique Centrale à l'horizon 2027.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
