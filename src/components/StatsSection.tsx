import { Users, MapPin, Stethoscope, TrendingUp } from "lucide-react";

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
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Le corps médical gabonais en chiffres
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une vision claire et actualisée de la démographie médicale nationale
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative bg-card rounded-2xl p-6 md:p-8 shadow-cnom hover:shadow-cnom-elevated transition-all duration-300 border border-border/50 hover:border-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 bg-accent rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>

              {/* Value */}
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 font-display">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm md:text-base font-semibold text-foreground mb-1">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.description}
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary/5 transform rotate-45 translate-x-4 -translate-y-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
