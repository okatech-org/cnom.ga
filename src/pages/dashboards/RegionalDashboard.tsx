import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, CreditCard, BarChart3, MapPin, 
  TrendingUp, ArrowRight
} from "lucide-react";

const stats = [
  {
    title: "Médecins province",
    value: "156",
    change: "Estuaire",
    icon: Users,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    title: "Taux cotisation",
    value: "72%",
    change: "+8% vs national",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    title: "Densité médicale",
    value: "1.2",
    change: "pour 1000 hab.",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

const doctorsByCity = [
  { city: "Libreville", count: 98, percentage: 63 },
  { city: "Owendo", count: 32, percentage: 21 },
  { city: "Akanda", count: 18, percentage: 12 },
  { city: "Ntoum", count: 8, percentage: 5 },
];

const RegionalDashboard = () => {
  return (
    <DashboardLayout
      role="regional"
      roleTitle="Conseil Régional"
      roleIcon="🗺️"
      roleColor="bg-pink-600"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6" />
            <Badge className="bg-white/20 text-white">Province de l'Estuaire</Badge>
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">
            Tableau de bord régional
          </h1>
          <p className="text-white/80">
            Vue d'ensemble des médecins et indicateurs de votre province
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs mt-1 text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Distribution by City */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-600" />
              Répartition par ville
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {doctorsByCity.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item.city}</span>
                  <span className="text-sm text-muted-foreground">{item.count} médecins ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" className="h-16">
            <Users className="w-5 h-5 mr-2" />
            Voir tous les médecins
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="h-16">
            <BarChart3 className="w-5 h-5 mr-2" />
            Rapport provincial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegionalDashboard;
