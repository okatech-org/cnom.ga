import { useNavigate } from "react-router-dom";
import { QrCode, CreditCard, FileText, Bell, CheckCircle, AlertTriangle, Clock, ArrowRight, Download, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/shared/StatCard";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import type { Doctor, Payment, Notification, Application } from "@/types/medecin";
import { doctorStatusConfig, cotisationStatusConfig } from "@/lib/status-utils";
import { formatFCFA, formatRelativeDate } from "@/lib/payment-utils";
import { notificationTypeConfig } from "@/lib/status-utils";
import { cn } from "@/lib/utils";

interface DashboardOverviewProps {
    doctor: Doctor;
    payments: Payment[];
    notifications: Notification[];
    application: Application | null;
    onTabChange: (tab: string) => void;
}

const DashboardOverview = ({
    doctor,
    payments,
    notifications,
    application,
    onTabChange,
}: DashboardOverviewProps) => {
    const navigate = useNavigate();
    const statusConfig = doctorStatusConfig[doctor.statut];
    const StatusIcon = statusConfig.icon;

    const unreadNotifications = notifications.filter(n => !n.lue);
    const latestNotifications = notifications.slice(0, 3);

    const isAJour = payments.some(p => p.statut === "confirme" && p.type !== "inscription");
    const cotisationConfig = isAJour ? cotisationStatusConfig.a_jour : cotisationStatusConfig.retard;

    const nextPaymentDate = "30/06/2026";
    const nextPaymentAmount = 60000;

    const dossierComplete = application?.status === "validated";

    return (
        <div className="space-y-6">
            {/* Status Banner */}
            <Card className={cn("border-l-4", statusConfig.borderColor)}>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", statusConfig.bgColor)}>
                            <StatusIcon className={cn("w-6 h-6", statusConfig.color)} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <StatusBadge status={doctor.statut} />
                                <span className={cn("inline-flex items-center gap-1 text-sm font-medium px-2.5 py-0.5 rounded-full", cotisationConfig.badgeClass)}>
                                    <cotisationConfig.icon className="w-3.5 h-3.5" />
                                    {cotisationConfig.label}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{statusConfig.message}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards - Grid 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                    title="Carte e-CPS"
                    value={doctor.statut === "Inscrit" ? "Active" : "Inactive"}
                    subtitle={`N° Ordre: ${doctor.numero_ordre}`}
                    icon={QrCode}
                    iconColor="text-violet-600"
                    iconBg="bg-violet-100 dark:bg-violet-900/30"
                    action={{ label: "Voir ma carte", onClick: () => onTabChange("ecps") }}
                />
                <StatCard
                    title="Cotisation"
                    value={`Prochaine: ${nextPaymentDate}`}
                    subtitle={`Montant: ${formatFCFA(nextPaymentAmount)}`}
                    icon={CreditCard}
                    iconColor="text-amber-600"
                    iconBg="bg-amber-100 dark:bg-amber-900/30"
                    action={{ label: "Payer", onClick: () => onTabChange("paiements") }}
                />
                <StatCard
                    title="Mon dossier"
                    value={dossierComplete ? "Complet ✅" : "En cours"}
                    subtitle={dossierComplete ? "Validé et inscrit" : `Étape ${application?.step_current || 1}/${application?.step_total || 6}`}
                    icon={FileText}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                    action={{ label: "Voir détails", onClick: () => onTabChange("dossier") }}
                />
                <StatCard
                    title="Notifications"
                    value={`${unreadNotifications.length} non lue${unreadNotifications.length > 1 ? "s" : ""}`}
                    subtitle={notifications.length > 0 ? `${notifications.length} au total` : "Aucune notification"}
                    icon={Bell}
                    iconColor="text-indigo-600"
                    iconBg="bg-indigo-100 dark:bg-indigo-900/30"
                    action={{ label: "Consulter", onClick: () => onTabChange("notifications") }}
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button
                            variant="outline"
                            className="h-auto py-3 px-4 justify-start gap-3"
                            onClick={() => onTabChange("paiements")}
                        >
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium">Payer ma cotisation</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto py-3 px-4 justify-start gap-3"
                            onClick={() => onTabChange("paiements")}
                        >
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Download className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">Télécharger un reçu</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto py-3 px-4 justify-start gap-3"
                            onClick={() => onTabChange("documents")}
                        >
                            <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileCheck className="w-4 h-4 text-violet-600" />
                            </div>
                            <span className="text-sm font-medium">Demander une attestation</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Latest Notifications */}
            {latestNotifications.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Dernières notifications</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => onTabChange("notifications")} className="gap-1 text-xs">
                            Tout voir <ArrowRight className="w-3 h-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {latestNotifications.map((notif) => {
                            const typeConfig = notificationTypeConfig[notif.type];
                            return (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/50",
                                        !notif.lue && "bg-primary/5 border border-primary/10"
                                    )}
                                    onClick={() => onTabChange("notifications")}
                                >
                                    <span className="text-lg flex-shrink-0 mt-0.5">{typeConfig.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-sm", !notif.lue ? "font-semibold" : "font-medium")}>
                                            {notif.titre}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.message}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                                        {formatRelativeDate(notif.created_at)}
                                    </span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DashboardOverview;
