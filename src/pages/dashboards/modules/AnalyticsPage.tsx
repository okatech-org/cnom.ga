import { BarChart3, TrendingUp, Users, CreditCard, FileCheck, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Mock data
const inscriptionsTrend = [
  { mois: "Sep", inscriptions: 12, validations: 10 },
  { mois: "Oct", inscriptions: 18, validations: 15 },
  { mois: "Nov", inscriptions: 15, validations: 14 },
  { mois: "Déc", inscriptions: 22, validations: 18 },
  { mois: "Jan", inscriptions: 28, validations: 24 },
  { mois: "Fév", inscriptions: 35, validations: 30 },
];

const revenueData = [
  { mois: "Sep", cotisations: 12500000, inscriptions: 4500000 },
  { mois: "Oct", cotisations: 15800000, inscriptions: 5400000 },
  { mois: "Nov", cotisations: 14200000, inscriptions: 4500000 },
  { mois: "Déc", cotisations: 18900000, inscriptions: 6600000 },
  { mois: "Jan", cotisations: 22100000, inscriptions: 8400000 },
  { mois: "Fév", cotisations: 25600000, inscriptions: 10500000 },
];

const specialitesData = [
  { name: "Médecine Générale", value: 542, color: "#0D6E3F" },
  { name: "Cardiologie", value: 89, color: "#3B82F6" },
  { name: "Pédiatrie", value: 124, color: "#F59E0B" },
  { name: "Gynécologie", value: 98, color: "#EC4899" },
  { name: "Chirurgie", value: 156, color: "#8B5CF6" },
  { name: "Autres", value: 238, color: "#6B7280" },
];

const provincesData = [
  { province: "Estuaire", medecins: 687, pourcentage: 55 },
  { province: "Ogooué-Maritime", medecins: 156, pourcentage: 12.5 },
  { province: "Haut-Ogooué", medecins: 134, pourcentage: 10.7 },
  { province: "Woleu-Ntem", medecins: 89, pourcentage: 7.1 },
  { province: "Moyen-Ogooué", medecins: 67, pourcentage: 5.4 },
  { province: "Ngounié", medecins: 45, pourcentage: 3.6 },
  { province: "Nyanga", medecins: 32, pourcentage: 2.6 },
  { province: "Ogooué-Ivindo", medecins: 21, pourcentage: 1.7 },
  { province: "Ogooué-Lolo", medecins: 16, pourcentage: 1.3 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fr-FR", { 
    style: "currency", 
    currency: "XAF",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
};

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de Bord Analytique</h1>
          <p className="text-muted-foreground">Indicateurs clés et visualisations pour le pilotage de l'Ordre</p>
        </div>
        <Select defaultValue="6months">
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="3months">3 derniers mois</SelectItem>
            <SelectItem value="6months">6 derniers mois</SelectItem>
            <SelectItem value="1year">1 an</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Médecins inscrits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,247</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +8.2% ce semestre
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Nouvelles inscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">35</p>
            <p className="text-sm text-muted-foreground mt-1">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Recettes (mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(36100000)}</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +15.8% vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Taux de recouvrement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">78.4%</p>
            <p className="text-sm text-muted-foreground mt-1">Objectif : 85%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="inscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inscriptions">Inscriptions</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="repartition">Répartition</TabsTrigger>
        </TabsList>

        <TabsContent value="inscriptions" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des inscriptions</CardTitle>
                <CardDescription>Nouvelles inscriptions et validations par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={inscriptionsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="inscriptions" stackId="1" stroke="#0D6E3F" fill="#0D6E3F" fillOpacity={0.6} name="Inscriptions" />
                    <Area type="monotone" dataKey="validations" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Validations" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par spécialité</CardTitle>
                <CardDescription>Distribution des médecins par domaine</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={specialitesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {specialitesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des recettes</CardTitle>
              <CardDescription>Cotisations et frais d'inscription par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="cotisations" name="Cotisations" fill="#0D6E3F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inscriptions" name="Inscriptions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repartition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Répartition géographique
              </CardTitle>
              <CardDescription>Nombre de médecins par province</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provincesData.map((item) => (
                  <div key={item.province} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{item.province}</div>
                    <div className="flex-1">
                      <div className="h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.pourcentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="font-bold">{item.medecins}</span>
                      <span className="text-muted-foreground text-sm ml-1">({item.pourcentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
