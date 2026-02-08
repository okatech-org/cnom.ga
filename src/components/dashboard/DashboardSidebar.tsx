import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, FileCheck, CreditCard, BarChart3, 
  Settings, LogOut, X, User, QrCode, FileText, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDemo } from "@/contexts/DemoContext";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badgeKey?: string;
}

interface DashboardSidebarProps {
  role: string;
  roleTitle: string;
  roleIcon: string;
  roleColor: string;
  isOpen: boolean;
  onClose: () => void;
}

// Navigation items par rôle avec clés de badge dynamiques
const roleNavItems: Record<string, NavItem[]> = {
  admin: [
    { label: "Tableau de bord", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Répertoire", href: "/admin/repertoire", icon: <Users className="w-4 h-4" /> },
    { label: "Inscriptions", href: "/admin/inscriptions", icon: <FileCheck className="w-4 h-4" />, badgeKey: "inscriptions" },
    { label: "Paiements", href: "/admin/paiements", icon: <CreditCard className="w-4 h-4" />, badgeKey: "paiements_pending" },
    { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Paramètres", href: "/admin/parametres", icon: <Settings className="w-4 h-4" /> },
  ],
  president: [
    { label: "Tableau de bord", href: "/dashboard/president", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Répertoire", href: "/dashboard/president/repertoire", icon: <Users className="w-4 h-4" /> },
    { label: "Validations finales", href: "/dashboard/president/validations", icon: <FileCheck className="w-4 h-4" />, badgeKey: "validations" },
    { label: "Indicateurs BI", href: "/dashboard/president/bi", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  sg: [
    { label: "Tableau de bord", href: "/dashboard/sg", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Répertoire", href: "/dashboard/sg/repertoire", icon: <Users className="w-4 h-4" /> },
    { label: "Inscriptions", href: "/dashboard/sg/inscriptions", icon: <FileCheck className="w-4 h-4" />, badgeKey: "inscriptions" },
    { label: "Suivi financier", href: "/dashboard/sg/finances", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Indicateurs BI", href: "/dashboard/sg/bi", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  tresorier: [
    { label: "Tableau de bord", href: "/dashboard/tresorier", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Cotisations", href: "/dashboard/tresorier/cotisations", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Recouvrement", href: "/dashboard/tresorier/recouvrement", icon: <Users className="w-4 h-4" />, badgeKey: "recouvrement" },
    { label: "Rapport financier", href: "/dashboard/tresorier/rapport", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  agent: [
    { label: "Tableau de bord", href: "/dashboard/agent", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Saisie fiches", href: "/dashboard/agent/fiches", icon: <Users className="w-4 h-4" />, badgeKey: "fiches" },
    { label: "Vérification dossiers", href: "/dashboard/agent/verification", icon: <FileCheck className="w-4 h-4" />, badgeKey: "verification" },
    { label: "Paiements", href: "/dashboard/agent/paiements", icon: <CreditCard className="w-4 h-4" />, badgeKey: "paiements" },
  ],
  commission: [
    { label: "Tableau de bord", href: "/dashboard/commission", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Dossiers à valider", href: "/dashboard/commission/validation", icon: <FileCheck className="w-4 h-4" />, badgeKey: "validation" },
    { label: "Historique", href: "/dashboard/commission/historique", icon: <Users className="w-4 h-4" /> },
  ],
  regional: [
    { label: "Tableau de bord", href: "/dashboard/regional", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Médecins province", href: "/dashboard/regional/medecins", icon: <Users className="w-4 h-4" /> },
    { label: "Cotisations région", href: "/dashboard/regional/cotisations", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Indicateurs", href: "/dashboard/regional/indicateurs", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  medecin: [
    { label: "Tableau de bord", href: "/medecin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Carte e-CPS", href: "/medecin/ecps", icon: <QrCode className="w-4 h-4" /> },
    { label: "Mon dossier", href: "/medecin/dossier", icon: <FileText className="w-4 h-4" /> },
    { label: "Mes paiements", href: "/medecin/paiements", icon: <CreditCard className="w-4 h-4" />, badgeKey: "paiements" },
    { label: "Mon profil", href: "/medecin/profil", icon: <User className="w-4 h-4" /> },
  ],
};

export const DashboardSidebar = ({ 
  role, 
  roleTitle, 
  roleIcon, 
  roleColor, 
  isOpen, 
  onClose 
}: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDemoMode, demoUser, exitDemoMode } = useDemo();
  const { counts } = useRealtimeNotifications({ role });

  const navItems = roleNavItems[role] || [];

  const handleSignOut = async () => {
    if (isDemoMode) {
      exitDemoMode();
      navigate("/demo");
    } else {
      await signOut();
      navigate("/");
    }
  };

  const displayName = isDemoMode ? demoUser?.name : user?.email?.split("@")[0];

  const getBadgeCount = (badgeKey?: string): number | null => {
    if (!badgeKey) return null;
    const count = counts[badgeKey];
    return typeof count === "number" && count > 0 ? count : null;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className={`h-16 flex items-center justify-between px-4 border-b border-border ${roleColor}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{roleIcon}</span>
            <div>
              <p className="font-semibold text-white text-sm">{roleTitle}</p>
              <p className="text-white/70 text-xs">e-CNOM Gabon</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: "calc(100% - 180px)" }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const badgeCount = getBadgeCount(item.badgeKey);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {badgeCount !== null && (
                  <Badge 
                    variant={isActive ? "secondary" : "default"} 
                    className={cn(
                      "text-xs min-w-[20px] justify-center",
                      !isActive && "bg-destructive text-destructive-foreground animate-pulse"
                    )}
                  >
                    {badgeCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {displayName || "Utilisateur"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isDemoMode ? "Mode démo" : "Connecté"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => navigate("/demo")}
            >
              Retour démo
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
