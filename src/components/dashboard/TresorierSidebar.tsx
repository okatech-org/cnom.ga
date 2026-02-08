import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, CreditCard, AlertTriangle, History,
    PenSquare, FileCheck, Settings, Megaphone, Clock,
    BarChart3, TrendingUp, Bell, User, LogOut, X,
    HelpCircle, Phone, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDemo } from "@/contexts/DemoContext";

export type TresorierTabId =
    | 'dashboard' | 'cotisations' | 'recouvrement' | 'impayes'
    | 'historique' | 'saisie' | 'recus'
    | 'baremes' | 'relances' | 'moratoires'
    | 'rapport' | 'projections'
    | 'notifications' | 'profil';

interface NavSection {
    label: string;
    items: NavItem[];
}

interface NavItem {
    id: TresorierTabId;
    label: string;
    icon: React.ElementType;
    badge?: number;
}

const navSections: NavSection[] = [
    {
        label: "Pilotage Financier",
        items: [
            { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
            { id: "cotisations", label: "Cotisations", icon: CreditCard },
            { id: "recouvrement", label: "Recouvrement", icon: TrendingUp },
            { id: "impayes", label: "Impayés", icon: AlertTriangle, badge: 78 },
        ],
    },
    {
        label: "Transactions",
        items: [
            { id: "historique", label: "Historique", icon: History },
            { id: "saisie", label: "Saisie manuelle", icon: PenSquare, badge: 2 },
            { id: "recus", label: "Reçus & Attestations", icon: FileCheck },
        ],
    },
    {
        label: "Configuration",
        items: [
            { id: "baremes", label: "Barèmes & Pénalités", icon: Settings },
            { id: "relances", label: "Relances auto.", icon: Megaphone },
            { id: "moratoires", label: "Moratoires", icon: Clock },
        ],
    },
    {
        label: "Reporting",
        items: [
            { id: "rapport", label: "Rapport financier", icon: BarChart3 },
            { id: "projections", label: "Projections", icon: TrendingUp },
        ],
    },
    {
        label: "Administration",
        items: [
            { id: "notifications", label: "Notifications", icon: Bell, badge: 4 },
            { id: "profil", label: "Mon profil", icon: User },
        ],
    },
];

interface TresorierSidebarProps {
    activeTab: TresorierTabId;
    onTabChange: (tab: TresorierTabId) => void;
    isOpen: boolean;
    onClose: () => void;
}

const TresorierSidebar = ({ activeTab, onTabChange, isOpen, onClose }: TresorierSidebarProps) => {
    const navigate = useNavigate();
    const { isDemoMode, demoUser, exitDemoMode } = useDemo();

    const handleSignOut = () => {
        if (isDemoMode) {
            exitDemoMode();
            navigate("/demo");
        } else {
            navigate("/");
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-950 border-r border-border transition-transform duration-300 flex flex-col",
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-amber-600 to-amber-500 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm">Trésorier(e)</p>
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

                {/* User info */}
                <div className="px-4 py-3 border-b border-border bg-amber-50/50 dark:bg-amber-950/20 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-sm">
                            MM
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {isDemoMode ? demoUser?.name : "Dr MELLA-MBOUMBA"}
                            </p>
                            <p className="text-xs text-muted-foreground">Trésorière du CNOM</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                    {navSections.map((section, sIdx) => (
                        <div key={section.label}>
                            {sIdx > 0 && <Separator className="my-2" />}
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                                {section.label}
                            </p>
                            {section.items.map((item) => {
                                const isActive = activeTab === item.id;
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onTabChange(item.id);
                                            onClose();
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                                            isActive
                                                ? "bg-amber-600 text-white shadow-sm"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="flex-1 text-left truncate">{item.label}</span>
                                        {item.badge && item.badge > 0 && (
                                            <Badge
                                                variant={isActive ? "secondary" : "destructive"}
                                                className={cn(
                                                    "text-xs min-w-[20px] justify-center h-5",
                                                    !isActive && "animate-pulse"
                                                )}
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Help section */}
                <div className="flex-shrink-0 border-t border-border">
                    <div className="px-4 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Aide</p>
                        <Link
                            to="#"
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Documentation
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                            <Phone className="w-3.5 h-3.5" />
                            +241 74 XX XX XX
                        </div>
                    </div>

                    {/* Sign out */}
                    <div className="px-4 py-3 border-t border-border">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => navigate("/demo")}
                            >
                                Retour démo
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSignOut}
                                className="h-8 w-8"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default TresorierSidebar;
