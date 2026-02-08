import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, QrCode, FileText, CreditCard, User, 
  LogOut, X, Bell, Settings, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDemo } from "@/contexts/DemoContext";
import { useAuth } from "@/hooks/useAuth";
import logoCnom from "@/assets/logo-cnom.png";
import drDansouPhoto from "@/assets/dr-dansou-photo.jpeg";

interface MedecinSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: "ecps", label: "Carte e-CPS", icon: QrCode, badge: null },
  { id: "dossier", label: "Mon dossier", icon: FileText, badge: null },
  { id: "paiements", label: "Mes paiements", icon: CreditCard, badge: "2" },
  { id: "profil", label: "Mon profil", icon: User, badge: null },
];

export const MedecinSidebar = ({ 
  isOpen, 
  onClose,
  activeTab = "ecps",
  onTabChange
}: MedecinSidebarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDemoMode, demoUser, exitDemoMode } = useDemo();

  const handleSignOut = async () => {
    if (isDemoMode) {
      exitDemoMode();
      navigate("/demo");
    } else {
      await signOut();
      navigate("/");
    }
  };

  const displayName = isDemoMode 
    ? demoUser?.name 
    : user?.email?.split("@")[0] || "Médecin";

  const handleNavClick = (tabId: string) => {
    onTabChange?.(tabId);
    onClose();
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
        {/* Header with Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-border bg-gradient-to-r from-primary to-cnom-green-dark">
          <div className="flex items-center gap-3">
            <img 
              src={logoCnom} 
              alt="CNOM Gabon" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="font-semibold text-white text-sm">Mon Espace</p>
              <p className="text-white/70 text-xs">Médecin inscrit</p>
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

        {/* User Info Card */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
            {isDemoMode && demoUser?.role === "medecin" ? (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={drDansouPhoto} 
                  alt={`Dr. ${displayName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Dr. {displayName}
              </p>
              <p className="text-xs text-muted-foreground">
                {isDemoMode ? "Mode démonstration" : "Médecin inscrit"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 mb-3">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Links */}
        <div className="px-4 mt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 mb-3">
            Aide
          </p>
          <Link 
            to="/contact" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Assistance</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          {isDemoMode && (
            <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                🔬 Mode démonstration actif
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Accueil
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              title={isDemoMode ? "Quitter la démo" : "Déconnexion"}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MedecinSidebar;
