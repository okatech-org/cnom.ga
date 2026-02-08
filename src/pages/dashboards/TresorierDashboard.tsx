import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  CreditCard, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle2, Clock, ArrowRight, PieChart, Download
} from "lucide-react";

const stats = [
  {
    title: "Recettes totales",
    value: "127.5M FCFA",
    change: "+18%",
    trend: "up",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    title: "Cotisations perçues",
    value: "89.2M FCFA",
    change: "S1 2026",
    trend: "neutral",
    icon: CreditCard,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Impayés",
    value: "38.3M FCFA",
    change: "23 médecins",
    trend: "down",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    title: "Taux de recouvrement",
    value: "70%",
    change: "+5% vs 2025",
    trend: "up",
    icon: PieChart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

const recentPayments = [
  { 
    id: 1, 
    name: "Dr. Jean MOUELE", 
    amount: "60 000 FCFA",
    type: "Cotisation S1",
    date: "08/02/2026",
    method: "Airtel Money",
    status: "completed"
  },
  { 
    id: 2, 
    name: "Dr. Marie ONDO", 
    amount: "50 000 FCFA",
    type: "Inscription",
    date: "07/02/2026",
    method: "Moov Money",
    status: "completed"
  },
  { 
    id: 3, 
    name: "Dr. Paul NZUE", 
    amount: "60 000 FCFA",
    type: "Cotisation S1",
    date: "06/02/2026",
    method: "Virement",
    status: "pending"
  },
];

const unpaidDoctors = [
  { name: "Dr. Albert OBAME", amount: "120 000 FCFA", months: 12, lastPayment: "02/2025" },
  { name: "Dr. Claire MBOUMBA", amount: "60 000 FCFA", months: 6, lastPayment: "08/2025" },
  { name: "Dr. Denis ESSONO", amount: "60 000 FCFA", months: 6, lastPayment: "08/2025" },
];

const TresorierDashboard = () => {
  return (
    <DashboardLayout
      role="tresorier"
      roleTitle="Trésorier(e)"
      roleIcon="💰"
      roleColor="bg-amber-600"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-6 text-white">
          <h1 className="font-display text-2xl font-bold mb-2">
            Bienvenue, Dr Madeleine MELLA-MBOUMBA
          </h1>
          <p className="text-white/80">
            Tableau de bord financier — Gestion des cotisations et trésorerie de l'Ordre
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${
                      stat.trend === "up" ? "text-emerald-600" : 
                      stat.trend === "down" ? "text-red-600" : "text-muted-foreground"
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Payments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Paiements récents
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div 
                    key={payment.id} 
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === "completed" ? "bg-emerald-100" : "bg-amber-100"
                      }`}>
                        {payment.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{payment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.type} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{payment.amount}</p>
                      <p className="text-xs text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Unpaid Doctors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Impayés prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unpaidDoctors.map((doctor, index) => (
                <div key={index} className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{doctor.name}</p>
                    <Badge variant="destructive" className="text-xs">{doctor.months} mois</Badge>
                  </div>
                  <p className="text-lg font-bold text-red-600">{doctor.amount}</p>
                  <p className="text-xs text-muted-foreground">Dernier paiement : {doctor.lastPayment}</p>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Voir tous les impayés
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Objectif de recouvrement S1 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">89.2M / 127M FCFA</span>
                  <Badge variant="secondary">70%</Badge>
                </div>
                <Progress value={70} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Il reste 37.8M FCFA à percevoir avant le 31 mars 2026
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Répartition par méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Airtel Money</span>
                  <span className="font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Moov Money</span>
                  <span className="font-medium">35%</span>
                </div>
                <Progress value={35} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Virement bancaire</span>
                  <span className="font-medium">20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TresorierDashboard;
