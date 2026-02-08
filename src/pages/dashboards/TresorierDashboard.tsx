import { useState } from "react";
import { useDemo } from "@/contexts/DemoContext";
import TresorierSidebar from "@/components/dashboard/TresorierSidebar";
import type { TresorierTabId } from "@/components/dashboard/TresorierSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

// Tab components
import DashboardFinancier from "@/components/dashboard/tresorier/DashboardFinancier";
import CotisationsPage from "@/components/dashboard/tresorier/CotisationsPage";
import RecouvrementPage from "@/components/dashboard/tresorier/RecouvrementPage";
import ImpayesPage from "@/components/dashboard/tresorier/ImpayesPage";
import HistoriquePaiements from "@/components/dashboard/tresorier/HistoriquePaiements";
import SaisieManuelle from "@/components/dashboard/tresorier/SaisieManuelle";
import RecusAttestations from "@/components/dashboard/tresorier/RecusAttestations";
import BaremesPage from "@/components/dashboard/tresorier/BaremesPage";
import RelancesPage from "@/components/dashboard/tresorier/RelancesPage";
import MoratoiresPage from "@/components/dashboard/tresorier/MoratoiresPage";
import RapportFinancier from "@/components/dashboard/tresorier/RapportFinancier";
import ProjectionsPage from "@/components/dashboard/tresorier/ProjectionsPage";
import NotificationsPage from "@/components/dashboard/tresorier/NotificationsPage";
import ProfilPage from "@/components/dashboard/tresorier/ProfilPage";

const TAB_TITLES: Record<TresorierTabId, string> = {
  dashboard: "Tableau de bord financier",
  cotisations: "Suivi des cotisations",
  recouvrement: "Plan de recouvrement",
  impayes: "Gestion des impayés",
  historique: "Historique des paiements",
  saisie: "Saisie manuelle",
  recus: "Reçus & Attestations",
  baremes: "Barèmes & Pénalités",
  relances: "Relances automatiques",
  moratoires: "Gestion des moratoires",
  rapport: "Rapport financier",
  projections: "Projections budgétaires",
  notifications: "Notifications",
  profil: "Mon profil",
};

const TresorierDashboard = () => {
  const [activeTab, setActiveTab] = useState<TresorierTabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDemoMode } = useDemo();

  const handleNavigate = (tab: TresorierTabId) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardFinancier onNavigate={handleNavigate} />;
      case "cotisations":
        return <CotisationsPage />;
      case "recouvrement":
        return <RecouvrementPage onNavigate={handleNavigate} />;
      case "impayes":
        return <ImpayesPage />;
      case "historique":
        return <HistoriquePaiements />;
      case "saisie":
        return <SaisieManuelle />;
      case "recus":
        return <RecusAttestations />;
      case "baremes":
        return <BaremesPage />;
      case "relances":
        return <RelancesPage />;
      case "moratoires":
        return <MoratoiresPage />;
      case "rapport":
        return <RapportFinancier />;
      case "projections":
        return <ProjectionsPage />;
      case "notifications":
        return <NotificationsPage onNavigate={handleNavigate} />;
      case "profil":
        return <ProfilPage />;
      default:
        return <DashboardFinancier onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <TresorierSidebar
        activeTab={activeTab}
        onTabChange={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Demo banner */}
        {isDemoMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              🎭 Mode démonstration — Dr Madeleine MELLA-MBOUMBA (Trésorière)
            </p>
          </div>
        )}

        {/* Header */}
        <DashboardHeader
          title={TAB_TITLES[activeTab]}
          roleTitle="Trésorier(e)"
          roleIcon="💰"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <div className="p-6 pt-20 lg:pt-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TresorierDashboard;
