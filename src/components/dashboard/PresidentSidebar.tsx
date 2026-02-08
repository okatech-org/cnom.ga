import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, BarChart3, Map, ClipboardList, CheckSquare, Scale,
    RefreshCw, Wallet, FileText, Bell, User, LogOut, X, HelpCircle, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDemo } from "@/contexts/DemoContext";
import { useAuth } from "@/hooks/useAuth";
import logoCnom from "@/assets/logo-cnom.png";

interface PresidentSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    unreadNotifications?: number;
}

const SECTIONS = [
    {
        label: "PILOTAGE",
        items: [
            { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
            { id: "analytique", label: "Analytique (BI)", icon: BarChart3 },
            { id: "carte", label: "Carte sanitaire", icon: Map },
        ],
    },
    {
        label: "GESTION DU TABLEAU",
        items: [
            { id: "repertoire", label: "Répertoire Médecins", icon: ClipboardList },
            { id: "validation", label: "Validation dossiers", icon: CheckSquare },
            { id: "disciplinaire", label: "Disciplinaire", icon: Scale },
            { id: "statuts", label: "Changements statut", icon: RefreshCw },
        ],
    },
    {
        label: "FINANCES",
        items: [
            { id: "cotisations", label: "Suivi cotisations", icon: Wallet },
        ],
    },
    {
        label: "ADMINISTRATION",
        items: [
            { id: "audit", label: "Journal d'audit", icon: FileText },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "profil", label: "Mon profil", icon: User },
        ],
    },
];

export const PresidentSidebar = ({
    isOpen, onClose, activeTab = "dashboard", onTabChange, unreadNotifications = 0,
}: PresidentSidebarProps) => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { isDemoMode, exitDemoMode } = useDemo();

    const handleSignOut = async () => {
        if (isDemoMode) { exitDemoMode(); navigate("/demo"); }
        else { await signOut(); navigate("/"); }
    };

    const handleNavClick = (tabId: string) => {
        onTabChange?.(tabId);
        onClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={onClose} />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border transition-transform duration-300 flex flex-col",
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-border bg-gradient-to-r from-primary to-cnom-green-dark flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <img src={logoCnom} alt="CNOM Gabon" className="w-12 h-12 object-contain" />
                        <div>
                            <p className="font-semibold text-white text-sm">Présidence</p>
                            <p className="text-white/70 text-xs">Back-Office Exécutif</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* User Info Card */}
                <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-cnom-gold to-cnom-gold-dark rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                            🏛️
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">Dr Emmanuel OGANDAGA</p>
                            <p className="text-xs text-muted-foreground">Président du Conseil National</p>
                            <Badge variant="outline" className="mt-1 text-[10px] bg-cnom-gold/20 text-cnom-gold-dark border-cnom-gold/40 font-bold tracking-wide">
                                PRÉSIDENT
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {SECTIONS.map((section) => (
                        <div key={section.label} className="mb-4">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 mb-2">
                                {section.label}
                            </p>
                            {section.items.map((item) => {
                                const isActive = activeTab === item.id;
                                const Icon = item.icon;
                                const isNotifTab = item.id === "notifications";
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
                                        {isNotifTab && unreadNotifications > 0 && (
                                            <Badge
                                                variant={isActive ? "secondary" : "default"}
                                                className={cn("text-xs min-w-[20px] justify-center", !isActive && "bg-red-500 text-white")}
                                            >
                                                {unreadNotifications}
                                            </Badge>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Help Section */}
                <div className="px-4 py-3 border-t border-border flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 mb-2">Aide</p>
                    <Link to="/#contact" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <HelpCircle className="w-4 h-4" /><span>Documentation</span>
                    </Link>
                    <a href="tel:+24101440000" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Phone className="w-4 h-4" /><span>Support technique</span>
                    </a>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-background flex-shrink-0">
                    {isDemoMode && (
                        <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-800 dark:text-amber-200 text-center">🔬 Mode démonstration actif</p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate("/")}>
                            Accueil site
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleSignOut} title={isDemoMode ? "Quitter la démo" : "Déconnexion"}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default PresidentSidebar;
