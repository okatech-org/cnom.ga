import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, FileCheck, CreditCard, BarChart3, 
  Settings, LogOut, Menu, X, ChevronDown, Bell, User, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemo } from "@/contexts/DemoContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
  roleTitle: string;
  roleIcon: string;
  roleColor: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
}

const roleNavItems: Record<string, NavItem[]> = {
  admin: [
    { label: "Tableau de bord", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Répertoire", href: "/admin/repertoire", icon: <Users className="w-4 h-4" /> },
    { label: "Inscriptions", href: "/admin/inscriptions", icon: <FileCheck className="w-4 h-4" />, badge: "12" },
    { label: "Paiements", href: "/admin/paiements", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Paramètres", href: "/admin/parametres", icon: <Settings className="w-4 h-4" /> },
  ],
  president: [
    { label: "Tableau de bord", href: "/dashboard/president", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Répertoire", href: "/dashboard/president/repertoire", icon: <Users className="w-4 h-4" /> },
    { label: "Validations finales", href: "/dashboard/president/validations", icon: <FileCheck className="w-4 h-4" />, badge: "5" },
    { label: "Indicateurs BI", href: "/dashboard/president/bi", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  sg: [
    { label: "Tableau de bord", href: "/dashboard/sg", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Répertoire", href: "/dashboard/sg/repertoire", icon: <Users className="w-4 h-4" /> },
    { label: "Inscriptions", href: "/dashboard/sg/inscriptions", icon: <FileCheck className="w-4 h-4" />, badge: "8" },
    { label: "Suivi financier", href: "/dashboard/sg/finances", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Indicateurs BI", href: "/dashboard/sg/bi", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  tresorier: [
    { label: "Tableau de bord", href: "/dashboard/tresorier", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Cotisations", href: "/dashboard/tresorier/cotisations", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Recouvrement", href: "/dashboard/tresorier/recouvrement", icon: <Users className="w-4 h-4" />, badge: "23" },
    { label: "Rapport financier", href: "/dashboard/tresorier/rapport", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  agent: [
    { label: "Tableau de bord", href: "/dashboard/agent", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Saisie fiches", href: "/dashboard/agent/fiches", icon: <Users className="w-4 h-4" /> },
    { label: "Vérification dossiers", href: "/dashboard/agent/verification", icon: <FileCheck className="w-4 h-4" />, badge: "15" },
    { label: "Paiements", href: "/dashboard/agent/paiements", icon: <CreditCard className="w-4 h-4" /> },
  ],
  commission: [
    { label: "Tableau de bord", href: "/dashboard/commission", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Dossiers à valider", href: "/dashboard/commission/validation", icon: <FileCheck className="w-4 h-4" />, badge: "7" },
    { label: "Historique", href: "/dashboard/commission/historique", icon: <Users className="w-4 h-4" /> },
  ],
  regional: [
    { label: "Tableau de bord", href: "/dashboard/regional", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Médecins province", href: "/dashboard/regional/medecins", icon: <Users className="w-4 h-4" /> },
    { label: "Cotisations région", href: "/dashboard/regional/cotisations", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Indicateurs", href: "/dashboard/regional/indicateurs", icon: <BarChart3 className="w-4 h-4" /> },
  ],
};

export const DashboardLayout = ({ children, role, roleTitle, roleIcon, roleColor }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isDemoMode, demoUser, exitDemoMode } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = roleNavItems[role] || [];

  const handleSignOut = async () => {
    if (isDemoMode) {
      exitDemoMode();
      navigate("/demo");
    } else {
      await signOut();
      navigate("/demo");
    }
  };

  const displayEmail = isDemoMode ? demoUser?.email : user?.email;
  const displayName = isDemoMode ? demoUser?.name : user?.email?.split("@")[0];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{roleIcon}</span>
            <span className="font-semibold text-foreground">{roleTitle}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{displayEmail || "Utilisateur"}</DropdownMenuLabel>
              {isDemoMode && (
                <DropdownMenuLabel className="font-normal text-xs text-amber-600">Mode démo</DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {isDemoMode ? "Quitter la démo" : "Déconnexion"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border transition-transform duration-300",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
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
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {displayName || "demo@cnom-gabon.ga"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isDemoMode ? "Mode démo" : "Utilisateur"}
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

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
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

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-background border-b border-border">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.href === location.pathname)?.label || "Tableau de bord"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{displayName || "Demo"}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                {isDemoMode && (
                  <DropdownMenuLabel className="font-normal text-xs text-amber-600">Mode démo actif</DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/demo")}>
                  Retour à la démo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {isDemoMode ? "Quitter la démo" : "Déconnexion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
