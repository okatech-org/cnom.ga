import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, FileCheck, TrendingUp, Clock, CheckCircle2, XCircle, 
  AlertCircle, ArrowRight, BarChart3
} from "lucide-react";

const stats = [
  {
    title: "Médecins inscrits",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Dossiers en attente",
    value: "5",
    change: "validation finale",
    trend: "neutral",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    title: "Taux de conformité",
    value: "94%",
    change: "+3%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    title: "Cotisations perçues",
    value: "89M FCFA",
    change: "ce semestre",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

const pendingValidations = [
  { 
    id: 1, 
    name: "Dr. Jean-Pierre MOUELE", 
    specialite: "Cardiologie", 
    date: "08/02/2026",
    status: "pending",
    province: "Estuaire"
  },
  { 
    id: 2, 
    name: "Dr. Marie ONDO", 
    specialite: "Pédiatrie", 
    date: "07/02/2026",
    status: "pending",
    province: "Ogooué-Maritime"
  },
  { 
    id: 3, 
    name: "Dr. Paul NZUE", 
    specialite: "Chirurgie générale", 
    date: "06/02/2026",
    status: "pending",
    province: "Woleu-Ntem"
  },
  { 
    id: 4, 
    name: "Dr. Suzanne NDONG", 
    specialite: "Gynécologie", 
    date: "05/02/2026",
    status: "pending",
    province: "Estuaire"
  },
  { 
    id: 5, 
    name: "Dr. Emmanuel BIBANG", 
    specialite: "Médecine générale", 
    date: "04/02/2026",
    status: "pending",
    province: "Haut-Ogooué"
  },
];

const recentDecisions = [
  { name: "Dr. Alice MBOUMBA", decision: "approved", date: "03/02/2026" },
  { name: "Dr. Pierre OBIANG", decision: "approved", date: "02/02/2026" },
  { name: "Dr. Marc ESSONO", decision: "rejected", date: "01/02/2026", reason: "Diplôme non conforme" },
];

const PresidentDashboard = () => {
  return (
    <DashboardLayout
      role="president"
      roleTitle="Président CNOM"
      roleIcon="🏛️"
      roleColor="bg-primary"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-cnom-green-dark rounded-2xl p-6 text-white">
          <h1 className="font-display text-2xl font-bold mb-2">
            Bienvenue, Dr Emmanuel OGANDAGA
          </h1>
          <p className="text-white/80">
            Tableau de bord exécutif — Vue d'ensemble de l'Ordre National des Médecins du Gabon
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
                    <p className={`text-xs mt-1 ${stat.trend === "up" ? "text-emerald-600" : "text-muted-foreground"}`}>
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
          {/* Pending Validations */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Dossiers en attente de validation finale
              </CardTitle>
              <Badge variant="secondary">{pendingValidations.length} dossiers</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingValidations.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.specialite} • {item.province}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                      <Button size="sm" variant="outline">
                        Examiner
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Decisions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Décisions récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDecisions.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.decision === "approved" ? "bg-emerald-100" : "bg-red-100"
                  }`}>
                    {item.decision === "approved" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.decision === "approved" ? "Validé" : "Rejeté"} • {item.date}
                    </p>
                    {item.reason && (
                      <p className="text-xs text-red-600 mt-1">{item.reason}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Taux d'approbation</span>
                  <span className="font-medium text-foreground">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileCheck className="w-6 h-6 text-primary" />
                <span>Valider un dossier</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="w-6 h-6 text-primary" />
                <span>Consulter le répertoire</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <span>Voir les indicateurs</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <span>Cas disciplinaires</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PresidentDashboard;
