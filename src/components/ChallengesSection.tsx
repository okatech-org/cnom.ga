import { AlertTriangle, Clock, FileX, Database, Shield } from "lucide-react";

const challenges = [
  {
    icon: AlertTriangle,
    title: "Exercice illégal de la médecine",
    problem: "Individus non qualifiés usurpant le titre de docteur ou médecins radiés continuant de pratiquer.",
    solution: "QR code sur carte professionnelle permettant une vérification instantanée du statut.",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Clock,
    title: "Latence de mise à jour",
    problem: "Délai de plusieurs semaines entre une décision disciplinaire et sa publication au Tableau.",
    solution: "Base de données centralisée avec mise à jour en temps réel (< 5 minutes).",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: FileX,
    title: "Processus présentiel coûteux",
    problem: "Obligation de déplacement à Libreville pour les médecins des régions (Oyem, Franceville, Tchibanga).",
    solution: "Inscription 100% en ligne avec upload sécurisé des pièces justificatives.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Database,
    title: "Absence de données exploitables",
    problem: "Impossible de répondre aux questions cruciales : combien de cardiologues dans le Haut-Ogooué ?",
    solution: "Tableau de bord analytique pour le pilotage de la carte sanitaire.",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
  },
];

const ChallengesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-foreground text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white/90 text-sm font-medium rounded-full mb-4">
            Pourquoi digitaliser ?
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            Défis actuels et solutions numériques
          </h2>
          <p className="text-white/70 text-lg">
            La digitalisation n'est pas une simple modernisation cosmétique — c'est une réponse 
            aux failles de sécurité sanitaire majeures identifiées dans le système actuel.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {challenges.map((challenge) => (
            <div
              key={challenge.title}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-12 h-12 ${challenge.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <challenge.icon className={`w-6 h-6 ${challenge.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">{challenge.title}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Problème</p>
                  <p className="text-white/70 text-sm">{challenge.problem}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-cnom-gold mb-1">Solution</p>
                  <p className="text-white text-sm font-medium">{challenge.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-xl lg:text-2xl text-white/90 font-display italic max-w-3xl mx-auto">
            "La digitalisation apparaît comme l'arme absolue contre l'exercice illégal : 
            le QR code permet une vérification instantanée de l'habilitation du praticien."
          </blockquote>
          <p className="mt-4 text-white/50 text-sm">— Rapport Stratégique CNOM-Gabon 2026</p>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
