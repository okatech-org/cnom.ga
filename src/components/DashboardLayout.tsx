import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useDemo } from "@/contexts/DemoContext";

interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
  roleTitle: string;
  roleIcon: string;
  roleColor: string;
}

// Map pour obtenir le titre de la page depuis le chemin
const getPageTitle = (pathname: string, role: string): string => {
  const pathParts = pathname.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  
  const titleMap: Record<string, string> = {
    repertoire: "Répertoire",
    inscriptions: "Inscriptions",
    paiements: "Paiements",
    analytics: "Analytics",
    parametres: "Paramètres",
    validations: "Validations finales",
    bi: "Indicateurs BI",
    finances: "Suivi financier",
    cotisations: "Cotisations",
    recouvrement: "Recouvrement",
    rapport: "Rapport financier",
    fiches: "Saisie fiches",
    verification: "Vérification dossiers",
    validation: "Dossiers à valider",
    historique: "Historique",
    medecins: "Médecins province",
    indicateurs: "Indicateurs",
  };

  return titleMap[lastPart] || "Tableau de bord";
};

export const DashboardLayout = ({ children, role, roleTitle, roleIcon, roleColor }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDemoMode, demoUser } = useDemo();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname, role);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        roleTitle={roleTitle}
        roleIcon={roleIcon}
        roleColor={roleColor}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Mode démonstration</strong> — Vous êtes connecté en tant que <strong>{demoUser?.title}</strong>. Les données sont fictives.
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <DashboardHeader
          title={pageTitle}
          roleTitle={roleTitle}
          roleIcon={roleIcon}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <div className="p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
