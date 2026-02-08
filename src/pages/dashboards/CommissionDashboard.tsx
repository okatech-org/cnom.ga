import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { ValidationPanel } from "@/components/dashboard/ValidationPanel";
import { WorkflowVisualizer } from "@/components/dashboard/WorkflowVisualizer";
import { FileCheck, CheckCircle2, XCircle, Clock, BarChart3 } from "lucide-react";
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

// Demo data
const DEMO_APPLICATIONS: ApplicationForValidation[] = [
  {
    id: "demo-1",
    numero_dossier: "INS-2026-00045",
    current_step: "commission_review",
    profile: { nom: "MOUELE", prenom: "Jean-Pierre", specialite: "Cardiologie", province: "Estuaire" },
    submission_date: "2026-02-08T10:00:00Z",
  },
  {
    id: "demo-2",
    numero_dossier: "INS-2026-00046",
    current_step: "commission_review",
    profile: { nom: "ONDO", prenom: "Marie", specialite: "Pédiatrie", province: "Ogooué-Maritime" },
    submission_date: "2026-02-07T14:30:00Z",
  },
  {
    id: "demo-3",
    numero_dossier: "INS-2026-00047",
    current_step: "commission_review",
    profile: { nom: "NZUE", prenom: "Paul", specialite: "Chirurgie générale", province: "Woleu-Ntem" },
    submission_date: "2026-02-06T09:15:00Z",
  },
];

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

const CommissionDashboard = () => {
  const [applications, setApplications] = useState<ApplicationForValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDemoMode } = useDemo();

  const fetchApplications = useCallback(async () => {
    if (isDemoMode) {
      setApplications(DEMO_APPLICATIONS);
      setLoading(false);
      return;
    }

    try {
      const { data: appData, error } = await supabase
        .from("applications")
        .select("id, numero_dossier, current_step, submission_date, profile_id")
        .eq("current_step", "commission_review")
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
          current_step: app.current_step || "submitted",
          profile: profiles?.find((p) => p.id === app.profile_id) || null,
        }));

        setApplications(appsWithProfiles);
      } else {
        setApplications([]);
      }
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

  // Set up realtime subscription
  useEffect(() => {
    if (isDemoMode) return;

    const channel = supabase
      .channel("commission-applications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
        },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDemoMode, fetchApplications]);

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
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.title === "À valider" ? applications.length : stat.value}
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
        <WorkflowVisualizer currentStep="commission_review" />

        {/* Validation Panel */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des dossiers...</p>
            </CardContent>
          </Card>
        ) : (
          <ValidationPanel
            applications={applications}
            role="commission"
            onActionComplete={fetchApplications}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommissionDashboard;
