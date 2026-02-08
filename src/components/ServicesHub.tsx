import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, QrCode, AlertTriangle, ArrowRight, ShieldCheck, Database, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ecpsVerification from "@/assets/ecps-verification-v2.png";

const services = [
    {
        id: "annuaire",
        label: "Annuaire Public",
        icon: Search,
        description: "Trouvez un médecin vérifié",
        color: "text-primary",
        bgColor: "bg-primary/10",
    },
    {
        id: "carte",
        label: "Carte Sanitaire",
        icon: MapPin,
        description: "Répartition géographique",
        color: "text-secondary",
        bgColor: "bg-secondary/10",
    },
    {
        id: "ecps",
        label: "e-CPS",
        icon: QrCode,
        description: "Identité numérique",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
    },
    {
        id: "pharmaco",
        label: "Pharmacovigilance",
        icon: AlertTriangle,
        description: "Signaler un effet indésirable",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
    },
];

const ServicesHub = () => {
    const [activeService, setActiveService] = useState("annuaire");

    return (
        <section id="services" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                        Ecosystème Numérique
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Services en ligne
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Des outils modernes pour faciliter l'accès à l'information et sécuriser la pratique médicale.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Navigation Sidebar / Tabs */}
                    <div className="lg:col-span-4 space-y-3">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setActiveService(service.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${activeService === service.id
                                    ? "bg-background border-primary shadow-cnom scale-[1.02]"
                                    : "bg-background/50 border-transparent hover:bg-background hover:border-border"
                                    }`}
                            >
                                <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center transition-colors group-hover:scale-110`}>
                                    <service.icon className={`w-6 h-6 ${service.color}`} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${activeService === service.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                                        {service.label}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                </div>
                                {activeService === service.id && (
                                    <ArrowRight className="w-5 h-5 text-primary ml-auto animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-background rounded-2xl border border-border shadow-cnom h-full min-h-[400px] overflow-hidden relative">

                            {/* Annuaire Content */}
                            {activeService === "annuaire" && (
                                <div className="p-8 h-full flex flex-col justify-center animate-fade-in">
                                    <Badge className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20">Annuaire National</Badge>
                                    <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                                        Vérifiez l'inscription d'un médecin en temps réel
                                    </h3>
                                    <p className="text-muted-foreground text-lg mb-8">
                                        Accédez à la liste officielle des médecins habilités à exercer au Gabon.
                                        Recherchez par nom, spécialité ou localité.
                                    </p>

                                    <div className="bg-muted/50 p-6 rounded-xl border border-border mb-8">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Cardiologue à Libreville..."
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                                />
                                            </div>
                                            <Link to="/annuaire">
                                                <Button size="lg" className="w-full sm:w-auto">Rechercher</Button>
                                            </Link>
                                        </div>
                                        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary" /> Vérifié 100%</span>
                                            <span className="flex items-center gap-1"><Database className="w-4 h-4 text-primary" /> Mise à jour quotidienne</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Carte Sanitaire Content */}
                            {activeService === "carte" && (
                                <div className="p-8 h-full flex flex-col justify-center animate-fade-in relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-20 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <Badge variant="outline" className="w-fit mb-4 border-secondary text-secondary">Géolocalisation</Badge>
                                    <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                                        Carte Sanitaire Interactive
                                    </h3>
                                    <p className="text-muted-foreground text-lg mb-8">
                                        Visualisez la répartition des médecins sur le territoire, identifiez les déserts médicaux et les zones de forte densité.
                                        Un outil d'aide à la décision publique.
                                    </p>

                                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                        <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/20">
                                            <div className="text-2xl font-bold text-secondary mb-1">9/9</div>
                                            <div className="text-sm text-muted-foreground">Provinces couvertes</div>
                                        </div>
                                        <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/20">
                                            <div className="text-2xl font-bold text-secondary mb-1">10.2</div>
                                            <div className="text-sm text-muted-foreground">Médecins / 10k hab.</div>
                                        </div>
                                    </div>

                                    <Link to="/annuaire?tab=carte">
                                        <Button size="lg" className="w-fit gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                            <MapPin className="w-4 h-4" />
                                            Explorer la carte complète
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* e-CPS Content */}
                            {activeService === "ecps" && (
                                <div className="grid md:grid-cols-2 h-full animate-fade-in">
                                    <div className="p-8 flex flex-col justify-center">
                                        <Badge className="w-fit mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">Innovation</Badge>
                                        <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                                            Carte Professionnelle de Santé (e-CPS)
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            La carte d'identité professionnelle numérique. Sécurisée par QR code cryptographique, elle garantit l'habilitation du porteur.
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            <li className="flex items-center gap-2 text-sm text-foreground">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><QrCode className="w-3 h-3" /></div>
                                                Scan de vérification instantané
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-foreground">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><ShieldCheck className="w-3 h-3" /></div>
                                                Infalsifiable et révocable
                                            </li>
                                        </ul>
                                        <Button variant="outline">En savoir plus</Button>
                                    </div>
                                    <div className="relative h-full bg-muted">
                                        <img src={ecpsVerification} alt="e-CPS" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
                                    </div>
                                </div>
                            )}

                            {/* Pharmaco Content */}
                            {activeService === "pharmaco" && (
                                <div className="p-8 h-full flex flex-col justify-center animate-fade-in bg-amber-50/30">
                                    <Badge variant="destructive" className="w-fit mb-4 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200">Santé Publique</Badge>
                                    <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                                        Pharmacovigilance
                                    </h3>
                                    <p className="text-muted-foreground text-lg mb-8">
                                        Participez à la surveillance de la sécurité des médicaments. Signalez tout effet indésirable suspecté.
                                        Votre déclaration contribue à la sécurité de tous.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link to="/pharmacovigilance">
                                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                Faire un signalement
                                            </Button>
                                        </Link>
                                        <div className="flex items-center gap-4 px-4 py-2 bg-card rounded-lg border border-amber-200 text-sm text-amber-800">
                                            <Stethoscope className="w-4 h-4" />
                                            Réservé aux professionnels et patients
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesHub;
