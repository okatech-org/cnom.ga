import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, FileCheck, CreditCard, BarChart3, 
  Clock, CheckCircle2, ArrowRight, AlertCircle
} from "lucide-react";

const stats = [
  {
    title: "Dossiers en cours",
    value: "8",
    change: "validation intermédiaire",
    icon: FileCheck,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  {
    title: "Médecins actifs",
    value: "1,247",
    change: "+5 ce mois",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Cotisations S1",
    value: "89.2M",
    change: "FCFA perçus",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    title: "Tâches du jour",
    value: "12",
    change: "4 urgentes",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const pendingTasks = [
  { 
    id: 1, 
    title: "Valider dossier Dr. MOUELE",
    type: "inscription",
    priority: "high",
    deadline: "Aujourd'hui"
  },
  { 
    id: 2, 
    title: "Mise à jour fiche Dr. ONDO",
    type: "repertoire",
    priority: "medium",
    deadline: "Demain"
  },
  { 
    id: 3, 
    title: "Relance cotisation Dr. NZUE",
    type: "paiement",
    priority: "low",
    deadline: "Cette semaine"
  },
];

const SGDashboard = () => {
  return (
    <DashboardLayout
      role="sg"
      roleTitle="Secrétaire Général(e)"
      roleIcon="📋"
      roleColor="bg-violet-600"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-500 rounded-2xl p-6 text-white">
          <h1 className="font-display text-2xl font-bold mb-2">
            Bienvenue, Dr Georgette NDONG
          </h1>
          <p className="text-white/80">
            Tableau de bord administratif — Gestion quotidienne de l'Ordre
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

        {/* Tasks and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-600" />
                Tâches prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === "high" ? "bg-red-500" :
                      task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                    }`} />
                    <div>
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.deadline}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{task.type}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Voir toutes les tâches
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                Activité mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Dossiers traités</span>
                  <span className="font-medium">24/30</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Fiches mises à jour</span>
                  <span className="font-medium">45/50</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Relances effectuées</span>
                  <span className="font-medium">12/20</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SGDashboard;
