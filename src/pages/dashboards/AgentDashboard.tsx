import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, FileCheck, CreditCard, Clock, 
  Plus, Search, ArrowRight
} from "lucide-react";

const stats = [
  {
    title: "Fiches à saisir",
    value: "3",
    icon: Users,
    color: "text-sky-600",
    bgColor: "bg-sky-100",
  },
  {
    title: "Dossiers à vérifier",
    value: "15",
    icon: FileCheck,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    title: "Paiements à traiter",
    value: "7",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    title: "En attente",
    value: "5",
    icon: Clock,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
];

const recentFiles = [
  { name: "Dr. Jean MOUELE", status: "à vérifier", date: "08/02/2026" },
  { name: "Dr. Marie ONDO", status: "incomplet", date: "07/02/2026" },
  { name: "Dr. Paul NZUE", status: "vérifié", date: "06/02/2026" },
];

const AgentDashboard = () => {
  return (
    <DashboardLayout
      role="agent"
      roleTitle="Agent Administratif"
      roleIcon="👤"
      roleColor="bg-sky-600"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-500 rounded-2xl p-6 text-white">
          <h1 className="font-display text-2xl font-bold mb-2">
            Espace Agent Administratif
          </h1>
          <p className="text-white/80">
            Saisie et vérification des dossiers d'inscription
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
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button className="h-20 text-lg" variant="outline">
            <Plus className="w-6 h-6 mr-2" />
            Nouvelle fiche
          </Button>
          <Button className="h-20 text-lg" variant="outline">
            <Search className="w-6 h-6 mr-2" />
            Rechercher
          </Button>
          <Button className="h-20 text-lg" variant="outline">
            <FileCheck className="w-6 h-6 mr-2" />
            Vérifier un dossier
          </Button>
        </div>

        {/* Recent Files */}
        <Card>
          <CardHeader>
            <CardTitle>Dossiers récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      file.status === "vérifié" ? "default" :
                      file.status === "incomplet" ? "destructive" : "secondary"
                    }>
                      {file.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentDashboard;
