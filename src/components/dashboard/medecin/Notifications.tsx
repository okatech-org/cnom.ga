import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, Settings, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Notification, NotificationType } from "@/types/medecin";
import { notificationTypeConfig } from "@/lib/status-utils";
import { formatRelativeDate } from "@/lib/payment-utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NotificationsProps {
    notifications: Notification[];
}

const ALL_TYPES: (NotificationType | "all")[] = ["all", "paiement", "dossier", "carte", "ordre", "systeme"];
const typeLabels: Record<string, string> = {
    all: "Toutes",
    paiement: "💰 Paiement",
    dossier: "📁 Dossier",
    carte: "🪪 Carte",
    ordre: "⚕️ Ordre",
    systeme: "⚙️ Système",
};

const Notifications = ({ notifications: initialNotifications }: NotificationsProps) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeFilter, setActiveFilter] = useState<NotificationType | "all">("all");
    const [showPreferences, setShowPreferences] = useState(false);
    const { toast } = useToast();

    const unreadCount = notifications.filter(n => !n.lue).length;
    const filtered = activeFilter === "all"
        ? notifications
        : notifications.filter(n => n.type === activeFilter);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, lue: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, lue: true })));
        toast({ title: "Notifications marquées comme lues" });
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast({ title: "Notification supprimée" });
    };

    return (
        <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    {unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-1.5 text-xs" disabled={unreadCount === 0}>
                        <CheckCheck className="w-3.5 h-3.5" />
                        Tout marquer comme lu
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowPreferences(!showPreferences)} className="gap-1.5 text-xs">
                        <Settings className="w-3.5 h-3.5" />
                        Préférences
                    </Button>
                </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map(type => (
                    <Button
                        key={type}
                        variant={activeFilter === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter(type)}
                        className="text-xs h-8"
                    >
                        {typeLabels[type]}
                    </Button>
                ))}
            </div>

            {/* Notification List */}
            <Card>
                <CardContent className="pt-4">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filtered.map((notif, index) => {
                                const typeConfig = notificationTypeConfig[notif.type];
                                return (
                                    <div key={notif.id}>
                                        <div className={cn(
                                            "flex items-start gap-3 p-3 rounded-lg transition-colors group",
                                            !notif.lue ? "bg-primary/5" : "hover:bg-muted/50"
                                        )}>
                                            {/* Icon */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg",
                                                typeConfig.bgColor
                                            )}>
                                                {typeConfig.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className={cn(
                                                            "text-sm",
                                                            !notif.lue ? "font-semibold text-foreground" : "font-medium text-foreground"
                                                        )}>
                                                            {notif.titre}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <Badge variant="outline" className={cn("text-[10px]", typeConfig.bgColor, typeConfig.color)}>
                                                                {typeConfig.label}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">{formatRelativeDate(notif.created_at)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                        {!notif.lue && (
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(notif.id)} title="Marquer comme lu">
                                                                <Check className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteNotification(notif.id)} title="Supprimer">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Unread dot */}
                                            {!notif.lue && (
                                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                                            )}
                                        </div>
                                        {index < filtered.length - 1 && <Separator className="my-0.5" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preferences Panel */}
            {showPreferences && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Préférences de notification
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {Object.entries(notificationTypeConfig).map(([type, config]) => (
                                <div key={type} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        <span>{config.icon}</span>
                                        <Label className="text-sm font-medium">{config.label}</Label>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground">Canaux préférés</h4>
                            <div className="flex items-center justify-between py-2">
                                <Label className="text-sm">Notifications Push</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <Label className="text-sm">Email</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <Label className="text-sm">SMS</Label>
                                <Switch />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Notifications;
