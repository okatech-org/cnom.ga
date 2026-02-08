import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { MapPin, Users, Activity, TrendingUp, BarChart3, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Data from the strategic report
const provinceData = [
    { name: "Estuaire", medecins: 1452, population: 1200000, ratio: 12.1 },
    { name: "Haut-Ogooué", medecins: 186, population: 252000, ratio: 7.4 },
    { name: "Ogooué-Maritime", medecins: 198, population: 180000, ratio: 11.0 },
    { name: "Woleu-Ntem", medecins: 89, population: 155000, ratio: 5.7 },
    { name: "Moyen-Ogooué", medecins: 67, population: 70000, ratio: 9.6 },
    { name: "Ngounié", medecins: 78, population: 100000, ratio: 7.8 },
    { name: "Nyanga", medecins: 45, population: 56000, ratio: 8.0 },
    { name: "Ogooué-Ivindo", medecins: 42, population: 64000, ratio: 6.6 },
    { name: "Ogooué-Lolo", medecins: 40, population: 65000, ratio: 6.2 },
];

const specialtyData = [
    { name: "Médecine Générale", value: 892, color: "#0D7377" },
    { name: "Chirurgie", value: 234, color: "#F5A623" },
    { name: "Pédiatrie", value: 189, color: "#3B82F6" },
    { name: "Gynécologie", value: 156, color: "#EC4899" },
    { name: "Cardiologie", value: 98, color: "#EF4444" },
    { name: "Anesthésie", value: 87, color: "#8B5CF6" },
    { name: "Radiologie", value: 76, color: "#06B6D4" },
    { name: "Autres", value: 465, color: "#6B7280" },
];

const ageData = [
    { tranche: "< 35 ans", hommes: 156, femmes: 189 },
    { tranche: "35-44 ans", hommes: 312, femmes: 287 },
    { tranche: "45-54 ans", hommes: 398, femmes: 245 },
    { tranche: "55-64 ans", hommes: 267, femmes: 123 },
    { tranche: "≥ 65 ans", hommes: 156, femmes: 64 },
];

const ratioData = provinceData.map(p => ({
    name: p.name,
    ratio: p.ratio,
    fill: p.ratio >= 10 ? "#0D7377" : p.ratio >= 7 ? "#F5A623" : "#EF4444"
}));

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                <p className="font-semibold text-foreground">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Statistiques = () => {
    const [activeTab, setActiveTab] = useState("provinces");

    const totalMedecins = provinceData.reduce((acc, p) => acc + p.medecins, 0);
    const avgRatio = (provinceData.reduce((acc, p) => acc + p.ratio, 0) / provinceData.length).toFixed(1);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20">
                {/* Hero Banner */}
                <section className="relative overflow-hidden bg-hero-gradient py-16 md:py-20">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cnom-sky/20 rounded-full blur-3xl" />
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                                    Démographie Médicale
                                </h1>
                                <p className="text-white/80 text-lg max-w-xl">
                                    Visualisation en temps réel de la répartition du corps médical gabonais
                                    pour le pilotage de la carte sanitaire nationale.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Button variant="secondary" size="lg" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Exporter les données
                                </Button>
                            </div>
                        </div>

                        {/* KPI Cards in Hero */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-10">
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Users className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">Médecins inscrits</span>
                                </div>
                                <span className="text-2xl md:text-3xl font-bold text-white">{totalMedecins.toLocaleString()}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">Provinces couvertes</span>
                                </div>
                                <span className="text-2xl md:text-3xl font-bold text-white">9 / 9</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Activity className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">Ratio national</span>
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl md:text-3xl font-bold text-white">{avgRatio}</span>
                                    <span className="text-white/50 text-sm">/ 10 000 hab.</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">Féminisation</span>
                                </div>
                                <span className="text-2xl md:text-3xl font-bold text-white">35%</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tab Navigation - Sticky */}
                <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
                    <div className="container mx-auto px-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 my-2">
                                <TabsTrigger value="provinces">Par Province</TabsTrigger>
                                <TabsTrigger value="ratio">Ratio / Hab.</TabsTrigger>
                                <TabsTrigger value="specialites">Par Spécialité</TabsTrigger>
                                <TabsTrigger value="ages">Pyramide des âges</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Charts Content */}
                <section className="py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsContent value="provinces">
                                <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-cnom">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-primary" />
                                                Répartition des médecins par province
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Effectifs cumulés au Tableau de l'Ordre</p>
                                        </div>
                                    </div>
                                    <div className="h-[450px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={provinceData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    stroke="hsl(var(--muted-foreground))"
                                                    width={120}
                                                    tick={{ fontSize: 13 }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar
                                                    dataKey="medecins"
                                                    name="Médecins"
                                                    fill="hsl(var(--primary))"
                                                    radius={[0, 6, 6, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <p className="text-sm text-muted-foreground">
                                            <strong className="text-foreground">Observation clé :</strong> L'Estuaire (Libreville) concentre <strong>66%</strong> du corps médical,
                                            révélant un déséquilibre territorial majeur. Les provinces de l'intérieur souffrent d'un déficit significatif en praticiens.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="ratio">
                                <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-cnom">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-primary" />
                                                Ratio médecins / 10 000 habitants
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Indicateur OMS de couverture sanitaire par province</p>
                                        </div>
                                    </div>
                                    <div className="h-[450px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={ratioData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" domain={[0, 15]} />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    stroke="hsl(var(--muted-foreground))"
                                                    width={120}
                                                    tick={{ fontSize: 13 }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar
                                                    dataKey="ratio"
                                                    name="Ratio"
                                                    radius={[0, 6, 6, 0]}
                                                >
                                                    {ratioData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-6 flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 rounded-full bg-[#0D7377]" />
                                            <span className="text-muted-foreground">≥ 10 (bonne couverture)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 rounded-full bg-[#F5A623]" />
                                            <span className="text-muted-foreground">7-10 (couverture moyenne)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                                            <span className="text-muted-foreground">&lt; 7 (zone à risque)</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="specialites">
                                <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-cnom">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-primary" />
                                                Répartition par spécialité médicale
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Distribution des 47 spécialités reconnues</p>
                                        </div>
                                    </div>
                                    <div className="h-[450px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={specialtyData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={160}
                                                    innerRadius={70}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                    labelLine={false}
                                                >
                                                    {specialtyData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <p className="text-sm text-muted-foreground">
                                            <strong className="text-foreground">Observation clé :</strong> La médecine générale représente <strong>41%</strong> du corps médical,
                                            suivie de la chirurgie (11%) et la pédiatrie (9%). Certaines spécialités critiques restent sous-représentées.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="ages">
                                <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-cnom">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                                                <Users className="w-5 h-5 text-primary" />
                                                Pyramide des âges du corps médical
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">Répartition par tranche d'âge et par genre</p>
                                        </div>
                                    </div>
                                    <div className="h-[450px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={ageData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                                                <YAxis
                                                    type="category"
                                                    dataKey="tranche"
                                                    stroke="hsl(var(--muted-foreground))"
                                                    width={80}
                                                    tick={{ fontSize: 13 }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Bar
                                                    dataKey="hommes"
                                                    name="Hommes"
                                                    fill="#3B82F6"
                                                    radius={[0, 6, 6, 0]}
                                                />
                                                <Bar
                                                    dataKey="femmes"
                                                    name="Femmes"
                                                    fill="#EC4899"
                                                    radius={[0, 6, 6, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-6 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                        <p className="text-sm text-muted-foreground">
                                            <strong className="text-foreground">⚠ Alerte démographique :</strong> <strong>35%</strong> du corps médical a plus de 55 ans,
                                            anticipant des départs en retraite significatifs d'ici 2030. La relève médicale est un enjeu stratégique.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Statistiques;
