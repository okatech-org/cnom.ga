import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  FileCheck, CheckCircle2, XCircle, Clock, 
  ArrowRight, Eye
} from "lucide-react";

const stats = [
  {
    title: "À valider",
    value: "7",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    title: "Validés ce mois",
    value: "23",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    title: "Rejetés",
    value: "3",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

const pendingDossiers = [
  { 
    id: 1, 
    name: "Dr. Jean MOUELE", 
    specialite: "Cardiologie",
    documents: "8/8",
    status: "complet",
    date: "08/02/2026"
  },
  { 
    id: 2, 
    name: "Dr. Marie ONDO", 
    specialite: "Pédiatrie",
    documents: "8/8",
    status: "complet",
    date: "07/02/2026"
  },
  { 
    id: 3, 
    name: "Dr. Paul NZUE", 
    specialite: "Chirurgie",
    documents: "7/8",
    status: "incomplet",
    date: "06/02/2026"
  },
];

const CommissionDashboard = () => {
  return (
    <DashboardLayout
      role="commission"
      roleTitle="Commission d'Inscription"
      roleIcon="✅"
      roleColor="bg-emerald-600"
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 text-white">
          <h1 className="font-display text-2xl font-bold mb-2">
            Commission d'Inscription
          </h1>
          <p className="text-white/80">
            Validation des dossiers et attribution des numéros d'Ordre
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

        {/* Pending Dossiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Dossiers en attente de validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDossiers.map((dossier) => (
                <div key={dossier.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      dossier.status === "complet" ? "bg-emerald-100" : "bg-amber-100"
                    }`}>
                      <FileCheck className={`w-5 h-5 ${
                        dossier.status === "complet" ? "text-emerald-600" : "text-amber-600"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{dossier.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dossier.specialite} • Documents : {dossier.documents}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={dossier.status === "complet" ? "default" : "secondary"}>
                      {dossier.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Examiner
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button className="h-16" variant="default">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Valider et attribuer N° Ordre
          </Button>
          <Button className="h-16" variant="outline">
            <XCircle className="w-5 h-5 mr-2" />
            Rejeter avec motif
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommissionDashboard;
