import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemo } from "@/contexts/DemoContext";
import { MedecinSidebar } from "@/components/dashboard/MedecinSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

// Tab components
import DashboardOverview from "@/components/dashboard/medecin/DashboardOverview";
import CarteECPS from "@/components/dashboard/medecin/CarteECPS";
import MonDossier from "@/components/dashboard/medecin/MonDossier";
import MesPaiements from "@/components/dashboard/medecin/MesPaiements";
import MesDocuments from "@/components/dashboard/medecin/MesDocuments";
import Notifications from "@/components/dashboard/medecin/Notifications";
import MonProfil from "@/components/dashboard/medecin/MonProfil";

// Demo data
import {
  DEMO_DOCTOR,
  DEMO_APPLICATION,
  DEMO_PAYMENTS,
  DEMO_NOTIFICATIONS,
  DEMO_DOCUMENT_REQUESTS,
  DEMO_VERIFICATIONS,
  DEMO_DOSSIER_DOCUMENTS,
} from "@/lib/demo-medecin-data";

import type { Doctor, Payment, Notification as NotifType, Application, DocumentRequest, Verification, DossierDocument } from "@/types/medecin";
import drDansouPhoto from "@/assets/dr-dansou-photo.jpeg";

type TabId = "dashboard" | "ecps" | "dossier" | "paiements" | "documents" | "notifications" | "profil";

const tabTitles: Record<TabId, string> = {
  dashboard: "Tableau de bord",
  ecps: "Carte e-CPS",
  dossier: "Mon dossier",
  paiements: "Mes paiements",
  documents: "Mes documents",
  notifications: "Notifications",
  profil: "Mon profil",
};

const MedecinDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [loading, setLoading] = useState(true);

  // Data state
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<NotifType[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [dossierDocuments, setDossierDocuments] = useState<DossierDocument[]>([]);

  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isDemoMode, demoUser } = useDemo();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (isDemoMode) {
      setDoctor(DEMO_DOCTOR);
      setApplication(DEMO_APPLICATION);
      setPayments(DEMO_PAYMENTS);
      setNotifications(DEMO_NOTIFICATIONS);
      setDocumentRequests(DEMO_DOCUMENT_REQUESTS);
      setVerifications(DEMO_VERIFICATIONS);
      setDossierDocuments(DEMO_DOSSIER_DOCUMENTS);
      setLoading(false);
      return;
    }

    if (!user) return;

    try {
      // In production: fetch from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profileData) {
        navigate("/inscription");
        return;
      }

      // Map profile to Doctor type
      setDoctor({
        id: profileData.id,
        user_id: user.id,
        numero_ordre: parseInt(profileData.numero_ordre || "0"),
        nom: profileData.nom || "",
        prenoms: profileData.prenom || "",
        genre: "M",
        specialite_principale: profileData.specialite || "",
        ville_exercice: profileData.ville || "",
        province: (profileData.province || "Estuaire") as Doctor["province"],
        telephone_pro: profileData.telephone || "",
        email: profileData.email || "",
        secteur_exercice: (profileData.secteur || "Public") as Doctor["secteur_exercice"],
        etablissement: "",
        statut: "Inscrit",
        date_inscription: profileData.created_at || new Date().toISOString(),
        diplome_principal: "Doctorat en Médecine",
        universite_obtention: profileData.universite || "",
        annee_obtention: profileData.annee_obtention || 2020,
        created_at: profileData.created_at || new Date().toISOString(),
        updated_at: profileData.updated_at || new Date().toISOString(),
      } as Doctor);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      fetchData();
      return;
    }

    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, isDemoMode, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre espace…</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Aucune donnée trouvée.</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.lue).length;
  const cotisationAJour = payments.some(p => p.statut === "confirme" && p.type !== "inscription");
  const photoUrl = isDemoMode ? drDansouPhoto : doctor.photo_url;

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            doctor={doctor}
            payments={payments}
            notifications={notifications}
            application={application}
            onTabChange={(tab) => setActiveTab(tab as TabId)}
          />
        );
      case "ecps":
        return (
          <CarteECPS
            doctor={doctor}
            verifications={verifications}
            photoUrl={photoUrl}
          />
        );
      case "dossier":
        return (
          <MonDossier
            application={application}
            documents={dossierDocuments}
            doctorName={doctor.nom}
            doctorPrenoms={doctor.prenoms}
          />
        );
      case "paiements":
        return (
          <MesPaiements
            payments={payments}
            doctorStatut={doctor.statut}
          />
        );
      case "documents":
        return (
          <MesDocuments
            requests={documentRequests}
            doctorStatut={doctor.statut}
            cotisationAJour={cotisationAJour}
          />
        );
      case "notifications":
        return <Notifications notifications={notifications} />;
      case "profil":
        return <MonProfil doctor={doctor} photoUrl={photoUrl} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <MedecinSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabId)}
        unreadNotifications={unreadCount}
      />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Mode démonstration</strong> — Connecté en tant que <strong>Dr. {demoUser?.name || "Arnaud A. DANSOU"}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <DashboardHeader
          title={tabTitles[activeTab]}
          roleTitle="Médecin inscrit"
          roleIcon="🩺"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-6 pt-20 lg:pt-6">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default MedecinDashboard;
