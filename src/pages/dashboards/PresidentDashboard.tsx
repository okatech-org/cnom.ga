import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { ValidationPanel } from "@/components/dashboard/ValidationPanel";
import { WorkflowVisualizer } from "@/components/dashboard/WorkflowVisualizer";
import { 
  Users, FileCheck, TrendingUp, Clock, CheckCircle2, XCircle, 
  AlertCircle, ArrowRight, BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDemo } from "@/contexts/DemoContext";

interface ApplicationForValidation {
  id: string;
  numero_dossier: string | null;
  current_step: string;
  profile: {
    nom: string;
    prenom: string;
    specialite: string;
    province: string;
  } | null;
  submission_date: string | null;
}

// Demo data for president review
const DEMO_PRESIDENT_APPLICATIONS: ApplicationForValidation[] = [
  {
    id: "demo-pres-1",
    numero_dossier: "INS-2026-00041",
    current_step: "president_review",
    profile: { nom: "OBAME", prenom: "Albert", specialite: "Neurochirurgie", province: "Estuaire" },
    submission_date: "2026-02-05T10:00:00Z",
  },
  {
    id: "demo-pres-2",
    numero_dossier: "INS-2026-00042",
    current_step: "president_review",
    profile: { nom: "MBOUMBA", prenom: "Claire", specialite: "Oncologie", province: "Haut-Ogooué" },
    submission_date: "2026-02-04T14:30:00Z",
  },
];

const PresidentDashboard = () => {
  const [applications, setApplications] = useState<ApplicationForValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalMedecins: 1247,
    pending: 5,
    tauxConformite: 94,
    cotisations: "89M",
  });
  const { isDemoMode } = useDemo();

  const stats = [
    {
      title: "Médecins inscrits",
      value: statsData.totalMedecins.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Dossiers en attente",
      value: String(applications.length || statsData.pending),
      change: "validation finale",
      trend: "neutral",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Taux de conformité",
      value: `${statsData.tauxConformite}%`,
      change: "+3%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Cotisations perçues",
      value: `${statsData.cotisations} FCFA`,
      change: "ce semestre",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  const recentDecisions = [
    { name: "Dr. Alice MBOUMBA", decision: "approved", date: "03/02/2026" },
    { name: "Dr. Pierre OBIANG", decision: "approved", date: "02/02/2026" },
    { name: "Dr. Marc ESSONO", decision: "rejected", date: "01/02/2026", reason: "Diplôme non conforme" },
  ];

  const fetchApplications = useCallback(async () => {
    if (isDemoMode) {
      setApplications(DEMO_PRESIDENT_APPLICATIONS);
      setLoading(false);
      return;
    }

    try {
      const { data: appData, error } = await supabase
        .from("applications")
        .select("id, numero_dossier, current_step, submission_date, profile_id")
        .eq("current_step", "president_review")
        .order("submission_date", { ascending: true });

      if (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
        return;
      }

      if (appData && appData.length > 0) {
        const profileIds = appData.map((a) => a.profile_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, nom, prenom, specialite, province")
          .in("id", profileIds);

        const appsWithProfiles = appData.map((app) => ({
          ...app,
          current_step: app.current_step || "president_review",
          profile: profiles?.find((p) => p.id === app.profile_id) || null,
        }));

        setApplications(appsWithProfiles);
      } else {
        setApplications([]);
      }

      // Fetch stats
      const { count: medecinCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .not("numero_ordre", "is", null);

      setStatsData((prev) => ({
        ...prev,
        totalMedecins: medecinCount || prev.totalMedecins,
      }));
    } catch (err) {
      console.error("Error:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Realtime subscription
  useEffect(() => {
    if (isDemoMode) return;

    const channel = supabase
      .channel("president-applications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => fetchApplications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDemoMode, fetchApplications]);

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

        {/* Workflow Visualizer */}
        {applications.length > 0 && (
          <WorkflowVisualizer currentStep="president_review" />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Validations */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </CardContent>
              </Card>
            ) : applications.length > 0 ? (
              <ValidationPanel
                applications={applications}
                role="president"
                onActionComplete={fetchApplications}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-primary" />
                    Dossiers en attente de validation finale
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <p className="font-medium text-foreground">Aucun dossier en attente</p>
                  <p className="text-sm text-muted-foreground">
                    Tous les dossiers ont été traités
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

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
