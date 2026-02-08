import { useState, useMemo } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import PresidentSidebar from "@/components/dashboard/PresidentSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardExecutif from "@/components/dashboard/president/DashboardExecutif";
import AnalytiquePage from "@/components/dashboard/president/AnalytiquePage";
import CarteSanitairePage from "@/components/dashboard/president/CarteSanitairePage";
import RepertoirePage from "@/components/dashboard/president/RepertoirePage";
import ValidationPage from "@/components/dashboard/president/ValidationPage";
import DisciplinairePage from "@/components/dashboard/president/DisciplinairePage";
import StatutsPage from "@/components/dashboard/president/StatutsPage";
import CotisationsPage from "@/components/dashboard/president/CotisationsPage";
import AuditPage from "@/components/dashboard/president/AuditPage";
import NotificationsPage from "@/components/dashboard/president/NotificationsPage";
import ProfilPage from "@/components/dashboard/president/ProfilPage";
import { DEMO_PRESIDENT_NOTIFICATIONS } from "@/lib/demo-president-data";

type PresidentTab = "dashboard" | "analytique" | "carte" | "repertoire" | "validation" | "disciplinaire" | "statuts" | "cotisations" | "audit" | "notifications" | "profil";

const TAB_TITLES: Record<PresidentTab, string> = {
  dashboard: "Tableau de bord exécutif",
  analytique: "Analytique — Business Intelligence",
  carte: "Carte sanitaire du Gabon",
  repertoire: "Répertoire des Médecins",
  validation: "Validation des dossiers",
  disciplinaire: "Historique disciplinaire",
  statuts: "Changements de statut",
  cotisations: "Suivi des cotisations",
  audit: "Journal d'audit",
  notifications: "Notifications",
  profil: "Mon profil",
};

const PresidentDashboard = () => {
  const [activeTab, setActiveTab] = useState<PresidentTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadNotifications = useMemo(
    () => DEMO_PRESIDENT_NOTIFICATIONS.filter(n => !n.lue).length,
    []
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as PresidentTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardExecutif onTabChange={handleTabChange} />;
      case "analytique": return <AnalytiquePage />;
      case "carte": return <CarteSanitairePage />;
      case "repertoire": return <RepertoirePage />;
      case "validation": return <ValidationPage />;
      case "disciplinaire": return <DisciplinairePage />;
      case "statuts": return <StatutsPage />;
      case "cotisations": return <CotisationsPage />;
      case "audit": return <AuditPage />;
      case "notifications": return <NotificationsPage onTabChange={handleTabChange} />;
      case "profil": return <ProfilPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <PresidentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadNotifications={unreadNotifications}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <DashboardHeader
          title={TAB_TITLES[activeTab]}
          subtitle="Espace Présidentiel — Back-Office Exécutif"
          isDemoMode={true}
          leftSlot={
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          }
        />

        {/* Content */}
        <main className="p-6">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default PresidentDashboard;
