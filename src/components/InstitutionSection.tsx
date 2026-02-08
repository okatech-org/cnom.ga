import { Scale, Users, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import councilMeeting from "@/assets/council-meeting-v2.png";
import { Badge } from "@/components/ui/badge";

const stats = [
    { value: "2 197", label: "Médecins" },
    { value: "9", label: "Provinces" },
    { value: "45+", label: "Spécialités" },
    { value: "35%", label: "Femmes" },
];

const challenges = [
    {
        title: "Exercice Illégal",
        desc: "Lutte contre les faux médecins",
        icon: AlertTriangle,
        color: "text-red-500",
        bg: "bg-red-50"
    },
    {
        title: "Latence Admin",
        desc: "Mise à jour en temps réel",
        icon: TrendingUp,
        color: "text-amber-500",
        bg: "bg-amber-50"
    },
    {
        title: "Centralisation",
        desc: "Services dématérialisés",
        icon: Scale,
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
];

const InstitutionSection = () => {
    return (
        <section id="institution" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Left Column: Identité & Missions */}
                    <div className="lg:w-1/2">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                            L'Institution
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Garant de la déontologie médicale au Gabon
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                            L'Ordre National des Médecins, présidé par le <strong>Dr Emmanuel OGANDAGA</strong>,
                            est l'instance régulatrice de la profession.
                        </p>
                        <p className="text-muted-foreground mb-8">
                            Notre mission est triple : surveiller la déontologie, qualifier les professionnels
                            et conseiller les pouvoirs publics pour garantir la sécurité sanitaire des gabonais.
                        </p>

                        {/* Bureau Compact */}
                        <div className="bg-muted/30 border border-border rounded-xl p-5 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                    EO
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Dr Emmanuel OGANDAGA</h4>
                                    <p className="text-sm text-muted-foreground">Président du Conseil National</p>
                                </div>
                            </div>
                        </div>

                        {/* Compact Challenges List */}
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Nos Défis Prioritaires</h4>
                            <div className="space-y-3">
                                {challenges.map((c) => (
                                    <div key={c.title} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <c.icon className={`w-4 h-4 ${c.color}`} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground text-sm">{c.title}</div>
                                            <div className="text-xs text-muted-foreground">{c.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visuals & Stats */}
                    <div className="lg:w-1/2 space-y-6">
                        {/* Featured Image with Overlay Stats */}
                        <div className="relative rounded-2xl overflow-hidden shadow-cnom-elevated group h-full min-h-[400px]">
                            <img
                                src={councilMeeting}
                                alt="Conseil de l'Ordre"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <h3 className="text-white font-display text-2xl font-bold mb-6">
                                    Une profession en chiffres
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                                            <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                            <div className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InstitutionSection;
