import { Users, MapPin, Stethoscope, TrendingUp } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";

const stats = [
  {
    icon: Users,
    value: "2 197",
    label: "Médecins inscrits",
    description: "Au Tableau de l'Ordre",
  },
  {
    icon: Stethoscope,
    value: "45+",
    label: "Spécialités",
    description: "Représentées au Gabon",
  },
  {
    icon: MapPin,
    value: "9",
    label: "Provinces",
    description: "Couverture nationale",
  },
  {
    icon: TrendingUp,
    value: "35%",
    label: "Féminisation",
    description: "Du corps médical",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-cnom-elevated order-2 lg:order-1">
            <img 
              src={aboutTeam} 
              alt="Équipe de médecins gabonais en réunion" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-lg font-semibold">Corps médical gabonais</p>
              <p className="text-white/80 text-sm">Une communauté engagée pour la santé publique</p>
            </div>
          </div>

          {/* Stats */}
          <div className="order-1 lg:order-2">
            <div className="text-center lg:text-left mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Le corps médical gabonais en chiffres
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Une vision claire et actualisée de la démographie médicale nationale
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative bg-card rounded-2xl p-5 md:p-6 shadow-cnom hover:shadow-cnom-elevated transition-all duration-300 border border-border/50 hover:border-primary/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>

                  {/* Value */}
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 font-display">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
