import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import { formatDateTimeFR } from "@/lib/finance-utils";
import { demoNotifications } from "@/lib/demo-tresorier-data";
import type { TresorierNotification } from "@/types/tresorier";
import type { TresorierTabId } from "../TresorierSidebar";

const prioriteConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    critique: { label: "Critique", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800" },
    haute: { label: "Haute", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800" },
    moyenne: { label: "Moyenne", color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800" },
    info: { label: "Info", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" },
};

const typeIcons: Record<string, string> = {
    paiement_recu: '💰',
    paiement_echoue: '❌',
    impaye_critique: '🚨',
    seuil_recouvrement: '📊',
    moratoire_expire: '⏰',
    relance_envoyee: '📧',
    saisie_manuelle: '✍️',
    rapport_genere: '📄',
    systeme: '⚙️',
};

interface NotificationsPageProps {
    onNavigate: (tab: TresorierTabId) => void;
}

const NotificationsPage = ({ onNavigate }: NotificationsPageProps) => {
    const [notifications, setNotifications] = useState<TresorierNotification[]>(demoNotifications);
    const [filterPriorite, setFilterPriorite] = useState<string>("all");

    const filtered = notifications.filter(n =>
        filterPriorite === "all" || n.priorite === filterPriorite
    );

    const unreadCount = notifications.filter(n => !n.lue).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, lue: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, lue: true })));
    };

    const deleteNotif = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-500" />
                        Notifications
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">{unreadCount} non lue(s)</Badge>
                        )}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Alertes financières et notifications système
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Tout marquer lu
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {["all", "critique", "haute", "moyenne", "info"].map((p) => (
                    <Button
                        key={p}
                        variant={filterPriorite === p ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setFilterPriorite(p)}
                    >
                        {p === "all" ? "Toutes" : prioriteConfig[p]?.label || p}
                        {p !== "all" && (
                            <Badge variant="secondary" className="ml-1 text-[10px] h-4">
                                {notifications.filter(n => n.priorite === p).length}
                            </Badge>
                        )}
                    </Button>
                ))}
            </div>

            {/* Notification list */}
            <div className="space-y-2">
                {filtered.map((n) => {
                    const pConf = prioriteConfig[n.priorite];
                    return (
                        <div
                            key={n.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${n.lue
                                    ? 'bg-background border-border'
                                    : `${pConf.bgColor} border`
                                }`}
                        >
                            <span className="text-lg flex-shrink-0 mt-0.5">{typeIcons[n.type] || '🔔'}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className={`text-sm font-medium ${n.lue ? 'text-foreground' : 'text-foreground'}`}>
                                        {n.titre}
                                    </p>
                                    {!n.lue && (
                                        <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{n.message}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[10px] text-muted-foreground">{formatDateTimeFR(n.date)}</span>
                                    {n.lien_tab && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-amber-600"
                                            onClick={() => onNavigate(n.lien_tab as TresorierTabId)}
                                        >
                                            Voir →
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {!n.lue && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(n.id)} title="Marquer comme lu">
                                        <Check className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500" onClick={() => deleteNotif(n.id)} title="Supprimer">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Aucune notification</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
