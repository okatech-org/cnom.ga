import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Scale, RefreshCw, Wallet, FileCheck, Settings, Building } from "lucide-react";
import PriorityBadge from "@/components/dashboard/shared/PriorityBadge";
import { DEMO_PRESIDENT_NOTIFICATIONS } from "@/lib/demo-president-data";
import type { PresidentNotification, PresidentNotificationType } from "@/types/president";

const typeIcons: Record<PresidentNotificationType, typeof Bell> = {
    escalade: FileCheck, disciplinaire: Scale, statut: RefreshCw,
    financier: Wallet, inscription: FileCheck, systeme: Settings, ordre: Building,
};

interface NotificationsPageProps {
    onTabChange: (tab: string) => void;
}

const NotificationsPage = ({ onTabChange }: NotificationsPageProps) => {
    const [notifs, setNotifs] = useState<PresidentNotification[]>(DEMO_PRESIDENT_NOTIFICATIONS);

    const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, lue: true } : n));
    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, lue: true })));
    const unreadCount = notifs.filter(n => !n.lue).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</h2>
                    <p className="text-sm text-muted-foreground">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="w-4 h-4 mr-2" />Tout marquer comme lu</Button>
                )}
            </div>

            <div className="space-y-3">
                {notifs.map(n => {
                    const Icon = typeIcons[n.type] || Bell;
                    return (
                        <Card key={n.id} className={`transition-all ${!n.lue ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!n.lue ? 'bg-primary/10' : 'bg-muted'}`}>
                                        <Icon className={`w-5 h-5 ${!n.lue ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className={`text-sm ${!n.lue ? 'font-semibold' : 'font-medium'} text-foreground`}>{n.titre}</p>
                                            <PriorityBadge priority={n.priorite} />
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                            {n.lien_action && <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onTabChange(n.lien_action!)}>Voir →</Button>}
                                            {!n.lue && <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={() => markRead(n.id)}><Check className="w-3 h-3 mr-1" />Marquer lu</Button>}
                                        </div>
                                    </div>
                                    {!n.lue && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default NotificationsPage;
