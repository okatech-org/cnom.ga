import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { MapPin, Users, Activity, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const DashboardSection = () => {
  const [activeTab, setActiveTab] = useState("provinces");

  const totalMedecins = provinceData.reduce((acc, p) => acc + p.medecins, 0);
  const avgRatio = (provinceData.reduce((acc, p) => acc + p.ratio, 0) / provinceData.length).toFixed(1);

  return (
    <section id="statistiques" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Tableau de bord
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Démographie médicale du Gabon
          </h2>
          <p className="text-muted-foreground text-lg">
            Visualisation en temps réel de la répartition du corps médical gabonais
            pour le pilotage de la carte sanitaire nationale.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-foreground">{totalMedecins.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Médecins inscrits</p>
          </div>
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cnom-gold/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-cnom-gold" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-foreground">9</p>
            <p className="text-sm text-muted-foreground">Provinces couvertes</p>
          </div>
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cnom-sky-light rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-cnom-sky-dark" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-foreground">{avgRatio}</p>
            <p className="text-sm text-muted-foreground">Médecins / 10 000 hab.</p>
          </div>
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cnom-rose-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cnom-rose" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-foreground">35%</p>
            <p className="text-sm text-muted-foreground">Taux de féminisation</p>
          </div>
        </div>

        {/* Charts Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="provinces">Par Province</TabsTrigger>
            <TabsTrigger value="specialites">Par Spécialité</TabsTrigger>
            <TabsTrigger value="ages">Pyramide des âges</TabsTrigger>
          </TabsList>

          <TabsContent value="provinces">
            <div className="bg-background rounded-2xl p-6 lg:p-8 border border-border shadow-cnom">
              <h3 className="font-semibold text-lg text-foreground mb-6">
                Répartition des médecins par province
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={provinceData} layout="vertical" margin={{ left: 20, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="medecins"
                      name="Médecins"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                L'Estuaire (Libreville) concentre 66% du corps médical, révélant un déséquilibre territorial majeur.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specialites">
            <div className="bg-background rounded-2xl p-6 lg:p-8 border border-border shadow-cnom">
              <h3 className="font-semibold text-lg text-foreground mb-6">
                Répartition par spécialité médicale
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specialtyData}
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      innerRadius={60}
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
              <p className="text-sm text-muted-foreground mt-4 text-center">
                La médecine générale représente 41% du corps médical, suivie de la chirurgie (11%) et la pédiatrie (9%).
              </p>
            </div>
          </TabsContent>

          <TabsContent value="ages">
            <div className="bg-background rounded-2xl p-6 lg:p-8 border border-border shadow-cnom">
              <h3 className="font-semibold text-lg text-foreground mb-6">
                Pyramide des âges du corps médical
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData} layout="vertical" margin={{ left: 20, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      type="category"
                      dataKey="tranche"
                      stroke="hsl(var(--muted-foreground))"
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="hommes"
                      name="Hommes"
                      fill="#3B82F6"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey="femmes"
                      name="Femmes"
                      fill="#EC4899"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                35% du corps médical a plus de 55 ans, anticipant des départs en retraite significatifs d'ici 2030.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DashboardSection;
