import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp, TrendingDown, CreditCard, AlertTriangle,
    Users, CheckCircle2, Clock, ArrowRight, Wallet,
    CalendarCheck, Target, Activity
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { formatCFA, formatCompactCFA, formatDateTimeFR, paymentStatusConfig, paymentTypeLabels } from "@/lib/finance-utils";
import {
    demoKPIs, demoMonthlyRevenue, demoPaymentMethods,
    demoRecentPayments, demoAlerts, demoUnpaidDoctors
} from "@/lib/demo-tresorier-data";
import type { TresorierTabId } from "../TresorierSidebar";

interface DashboardFinancierProps {
    onNavigate: (tab: TresorierTabId) => void;
}

const DashboardFinancier = ({ onNavigate }: DashboardFinancierProps) => {
    const kpi = demoKPIs;

    const primaryStats = [
        {
            title: "Recettes totales",
            value: formatCompactCFA(kpi.recettes_totales),
            change: `+${kpi.comparaison_n_moins_1}% vs 2025`,
            trend: "up" as const,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        },
        {
            title: "Cotisations perçues",
            value: formatCompactCFA(kpi.recettes_cotisations),
            change: `S1 2026`,
            trend: "neutral" as const,
            icon: CreditCard,
            color: "text-amber-600",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
        },
        {
            title: "Impayés",
            value: formatCompactCFA(kpi.impayes_total),
            change: `${kpi.impayes_nombre_medecins} médecins`,
            trend: "down" as const,
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-100 dark:bg-red-900/30",
        },
        {
            title: "Taux de recouvrement",
            value: `${kpi.taux_recouvrement}%`,
            change: `Objectif: ${kpi.taux_recouvrement_objectif}%`,
            trend: "up" as const,
            icon: Target,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
        },
    ];

    const secondaryStats = [
        { label: "Paiements aujourd'hui", value: kpi.paiements_aujourd_hui, sub: formatCFA(kpi.montant_aujourd_hui), icon: Activity },
        { label: "Médecins à jour", value: `${kpi.medecins_a_jour}/${kpi.medecins_total_actifs}`, sub: `${((kpi.medecins_a_jour / kpi.medecins_total_actifs) * 100).toFixed(0)}%`, icon: Users },
        { label: "Moratoires actifs", value: kpi.moratoires_actifs, sub: "Dispenses", icon: CalendarCheck },
        { label: "Relances en cours", value: kpi.relances_en_cours, sub: "Campagnes", icon: Wallet },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
                <div className="relative">
                    <h1 className="font-display text-2xl font-bold mb-1">
                        Bienvenue, Dr Madeleine MELLA-MBOUMBA
                    </h1>
                    <p className="text-white/80 text-sm">
                        Tableau de bord financier — Exercice fiscal 2026
                    </p>
                </div>
            </div>

            {/* Primary KPIs */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {primaryStats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className={`text-xs ${stat.trend === "up" ? "text-emerald-600" :
                                            stat.trend === "down" ? "text-red-600" :
                                                "text-muted-foreground"
                                        }`}>
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Secondary stats row */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {secondaryStats.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                        <s.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-foreground">{s.value}</p>
                            <p className="text-[11px] text-muted-foreground">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alerts */}
            {demoAlerts.length > 0 && (
                <div className="space-y-2">
                    {demoAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-sm ${alert.type === 'critique' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                                    alert.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
                                        alert.type === 'action' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' :
                                            'bg-muted/50 border-border'
                                }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <span>{alert.icon}</span>
                                <span className="text-foreground">{alert.message}</span>
                            </div>
                            {alert.action && alert.actionTab && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs flex-shrink-0"
                                    onClick={() => onNavigate(alert.actionTab as TresorierTabId)}
                                >
                                    {alert.action}
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Charts + Recent Payments */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Revenue chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                            Revenus mensuels 2026
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={demoMonthlyRevenue.filter(m => m.total > 0)}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                                <Tooltip
                                    formatter={(value: number) => formatCFA(value)}
                                    labelStyle={{ fontWeight: 600 }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="cotisations" name="Cotisations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="inscriptions" name="Inscriptions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Payment methods pie */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Méthodes de paiement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={demoPaymentMethods}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="pourcentage"
                                    nameKey="label"
                                >
                                    {demoPaymentMethods.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => `${v}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-1.5 mt-2">
                            {demoPaymentMethods.map((m) => (
                                <div key={m.method} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                                        <span className="text-muted-foreground">{m.label}</span>
                                    </div>
                                    <span className="font-medium">{m.pourcentage}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recovery gauge + Recent payments + Top unpaid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recovery gauge */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Objectif recouvrement S1</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-foreground">
                                {formatCompactCFA(kpi.recettes_totales)}
                            </span>
                            <Badge variant="secondary">{kpi.taux_recouvrement}%</Badge>
                        </div>
                        <Progress value={kpi.taux_recouvrement} className="h-3" />
                        <p className="text-xs text-muted-foreground">
                            Potentiel maximal : {formatCompactCFA(kpi.potentiel_maximal)} — Il reste{" "}
                            {formatCompactCFA(kpi.potentiel_maximal - kpi.recettes_totales)} à percevoir
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => onNavigate('recouvrement')}
                        >
                            Plan de recouvrement
                            <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent payments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Derniers paiements</CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => onNavigate('historique')}>
                            Tout voir <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {demoRecentPayments.slice(0, 5).map((p) => {
                            const statusConf = paymentStatusConfig[p.payment_status];
                            return (
                                <div key={p.id} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${p.payment_status === 'confirmed' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                                p.payment_status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30' :
                                                    'bg-red-100 dark:bg-red-900/30'
                                            }`}>
                                            {p.payment_status === 'confirmed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
                                                p.payment_status === 'pending' ? <Clock className="w-3.5 h-3.5 text-amber-600" /> :
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-foreground truncate">
                                                Dr {p.doctor?.nom}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground truncate">
                                                {paymentTypeLabels[p.payment_type]}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs font-semibold text-foreground">{formatCFA(p.amount)}</p>
                                        <p className={`text-[10px] ${statusConf.color}`}>{statusConf.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Top unpaid */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Impayés critiques
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => onNavigate('impayes')}>
                            Tous <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {demoUnpaidDoctors.slice(0, 3).map((doc) => (
                            <div key={doc.id} className="p-2.5 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-medium text-foreground">
                                        Dr {doc.nom} {doc.prenoms}
                                    </p>
                                    <Badge variant="destructive" className="text-[10px] h-4">
                                        {doc.retard_mois} mois
                                    </Badge>
                                </div>
                                <p className="text-sm font-bold text-red-600">{formatCFA(doc.montant_du)}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardFinancier;
