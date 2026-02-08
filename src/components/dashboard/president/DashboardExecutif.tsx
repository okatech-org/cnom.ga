import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, CreditCard, QrCode, AlertTriangle, ArrowRight } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { DEMO_ALERTS, DEMO_ACTIVITY_FEED, DEMO_INSCRIPTIONS_MONTHLY, DEMO_SPECIALITE_STATS } from "@/lib/demo-president-data";

interface DashboardExecutifProps {
    onTabChange: (tab: string) => void;
}

const KPI_CARDS = [
    { title: "Médecins inscrits (actifs)", value: "2 197", tendance: "+8.2% ce semestre", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Dossiers en attente de validation", value: "12", tendance: "-3 cette semaine", icon: FileCheck, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950/40" },
    { title: "Taux de recouvrement cotisations", value: "72.4%", tendance: "+5.1% vs année N-1", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-950/40" },
    { title: "Vérifications QR ce mois", value: "1 847", tendance: "+22% vs mois dernier", icon: QrCode, color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-950/40" },
];

const PIE_COLORS = ["#006B3F", "#C8A951", "#0EA5E9", "#F97316", "#8B5CF6", "#94A3B8"];

const DashboardExecutif = ({ onTabChange }: DashboardExecutifProps) => {
    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-cnom-green-dark rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-bold mb-1">Bonjour, Dr OGANDAGA</h1>
                        <p className="text-white/80">Voici la synthèse de l'activité de l'Ordre</p>
                    </div>
                    <div className="text-right text-white/70 text-sm">
                        <p>📅 08 Fév 2026</p>
                        <p>🔄 Dernière MàJ : il y a 5 min</p>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {KPI_CARDS.map((kpi, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                                    <p className="text-xs text-emerald-600 mt-1">{kpi.tendance}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Presidential Alerts */}
            <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Alertes prioritaires
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {DEMO_ALERTS.map((alert) => (
                        <button
                            key={alert.id}
                            onClick={() => onTabChange(alert.lien_action)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors text-left group"
                        >
                            <span className="text-sm">
                                {alert.priorite === "critique" ? "⚠️" : "ℹ️"}
                            </span>
                            <span className="flex-1 text-sm text-foreground">{alert.titre}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Inscriptions Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Évolution des inscriptions (6 mois)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={DEMO_INSCRIPTIONS_MONTHLY}>
                                <defs>
                                    <linearGradient id="soumisGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#006B3F" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#006B3F" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="validesGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C8A951" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#C8A951" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="soumis" name="Soumis" stroke="#006B3F" fill="url(#soumisGrad)" strokeWidth={2} />
                                <Area type="monotone" dataKey="valides" name="Validés" stroke="#C8A951" fill="url(#validesGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Specialty PieChart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Répartition par spécialité</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={DEMO_SPECIALITE_STATS} dataKey="pourcentage" nameKey="specialite" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} label={({ specialite, pourcentage }) => `${pourcentage}%`}>
                                    {DEMO_SPECIALITE_STATS.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => `${v}%`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Feed */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {DEMO_ACTIVITY_FEED.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                                <span className="text-xs text-muted-foreground font-mono w-12 flex-shrink-0 pt-0.5">{item.time}</span>
                                <span className="text-base">{item.icon}</span>
                                <span className="text-sm text-foreground">{item.message}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardExecutif;
