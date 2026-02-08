import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { WorkflowVisualizer } from "@/components/dashboard/WorkflowVisualizer";
import { 
  Users, FileCheck, CreditCard, Clock, 
  Plus, Search, ArrowRight, CheckCircle2, Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDemo } from "@/contexts/DemoContext";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useToast } from "@/hooks/use-toast";

interface ApplicationData {
  id: string;
  numero_dossier: string | null;
  current_step: string;
  status: string;
  profile: {
    nom: string;
    prenom: string;
    specialite: string;
  } | null;
  submission_date: string | null;
}

// Demo data
const DEMO_APPLICATIONS: ApplicationData[] = [
  {
    id: "demo-1",
    numero_dossier: "INS-2026-00048",
    current_step: "submitted",
    status: "submitted",
    profile: { nom: "MOUELE", prenom: "Jean", specialite: "Cardiologie" },
    submission_date: "2026-02-08T10:00:00Z",
  },
  {
    id: "demo-2",
    numero_dossier: "INS-2026-00049",
    current_step: "submitted",
    status: "submitted",
    profile: { nom: "ONDO", prenom: "Marie", specialite: "Pédiatrie" },
    submission_date: "2026-02-07T14:30:00Z",
  },
  {
    id: "demo-3",
    numero_dossier: "INS-2026-00050",
    current_step: "submitted",
    status: "submitted",
    profile: { nom: "NZUE", prenom: "Paul", specialite: "Chirurgie" },
    submission_date: "2026-02-06T09:15:00Z",
  },
];

const AgentDashboard = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDemoMode } = useDemo();
  const { executeAction, processing } = useWorkflow();
  const { toast } = useToast();

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
      value: String(applications.length),
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

  const fetchApplications = useCallback(async () => {
    if (isDemoMode) {
      setApplications(DEMO_APPLICATIONS);
      setLoading(false);
      return;
    }

    try {
      const { data: appData, error } = await supabase
        .from("applications")
        .select("id, numero_dossier, current_step, status, submission_date, profile_id")
        .eq("current_step", "submitted")
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
          .select("id, nom, prenom, specialite")
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

  // Realtime subscription
  useEffect(() => {
    if (isDemoMode) return;

    const channel = supabase
      .channel("agent-applications")
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

  const handleVerify = async (app: ApplicationData) => {
    if (isDemoMode) {
      toast({
        title: "Mode démo",
        description: "Dossier transmis à la Commission (simulation)",
      });
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      return;
    }

    const result = await executeAction({
      applicationId: app.id,
      action: "agent_approve",
    });

    if (result.success) {
      fetchApplications();
    }
  };

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

        {/* Workflow Visualizer */}
        <WorkflowVisualizer currentStep="submitted" showDetails={false} />

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-sky-600" />
              Dossiers en attente de vérification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun dossier en attente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Dr. {app.profile?.prenom} {app.profile?.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {app.profile?.specialite} • {app.numero_dossier || app.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        À vérifier
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVerify(app)}
                        disabled={processing}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Vérifier
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleVerify(app)}
                        disabled={processing}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Valider
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentDashboard;
