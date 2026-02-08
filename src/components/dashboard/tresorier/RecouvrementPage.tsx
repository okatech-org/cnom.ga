import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, AlertTriangle, ArrowRight, Users, Zap } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from "recharts";
import { formatCFA, formatCompactCFA, getRetardBadgeVariant } from "@/lib/finance-utils";
import { demoRecouvrementStats, demoRecoveryRateEvolution, demoKPIs } from "@/lib/demo-tresorier-data";
import type { TresorierTabId } from "../TresorierSidebar";

interface RecouvrementPageProps {
    onNavigate: (tab: TresorierTabId) => void;
}

const RecouvrementPage = ({ onNavigate }: RecouvrementPageProps) => {
    const stats = demoRecouvrementStats;

    const pipelineStages = [
        { label: "Total redevable", count: stats.retard_1_3_mois.nombre + stats.retard_3_6_mois.nombre + stats.retard_6_12_mois.nombre + stats.retard_plus_12_mois.nombre, montant: stats.total_redevable - stats.total_paye, color: "bg-gray-200 dark:bg-gray-700" },
        { label: "1-3 mois", count: stats.retard_1_3_mois.nombre, montant: stats.retard_1_3_mois.montant, color: "bg-yellow-400" },
        { label: "3-6 mois", count: stats.retard_3_6_mois.nombre, montant: stats.retard_3_6_mois.montant, color: "bg-orange-400" },
        { label: "6-12 mois", count: stats.retard_6_12_mois.nombre, montant: stats.retard_6_12_mois.montant, color: "bg-red-400" },
        { label: "> 12 mois", count: stats.retard_plus_12_mois.nombre, montant: stats.retard_plus_12_mois.montant, color: "bg-red-600" },
    ];

    const kpiCards = [
        { label: "Taux actuel", value: `${demoKPIs.taux_recouvrement}%`, target: `Objectif: ${demoKPIs.taux_recouvrement_objectif}%`, icon: Target, ok: demoKPIs.taux_recouvrement >= demoKPIs.taux_recouvrement_objectif },
        { label: "Total impayés", value: formatCompactCFA(demoKPIs.impayes_total), target: `${demoKPIs.impayes_nombre_medecins} médecins`, icon: AlertTriangle, ok: false },
        { label: "Relances actives", value: `${demoKPIs.relances_en_cours}`, target: "Campagnes en cours", icon: Zap, ok: true },
        { label: "Taux progression", value: "+8.2%", target: "vs. trimestre précédent", icon: TrendingUp, ok: true },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Plan de recouvrement</h2>
                    <p className="text-sm text-muted-foreground">Pilotage et suivi du recouvrement des cotisations</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => onNavigate('relances')}>
                        <Zap className="w-4 h-4 mr-1" />
                        Lancer relance
                    </Button>
                    <Button variant="outline" size="sm">Exporter</Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((kpi, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <kpi.icon className={`w-5 h-5 ${kpi.ok ? 'text-emerald-500' : 'text-amber-500'}`} />
                                <Badge variant={kpi.ok ? "default" : "destructive"} className="text-[10px]">
                                    {kpi.ok ? '✓' : '⚠'}
                                </Badge>
                            </div>
                            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                            <p className="text-xs text-muted-foreground">{kpi.target}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pipeline funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-600" />
                            Pipeline d'impayés
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pipelineStages.map((stage, i) => {
                            const maxMontant = pipelineStages[0].montant || 1;
                            const pct = (stage.montant / maxMontant) * 100;
                            return (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded ${stage.color}`} />
                                            <span className="text-foreground font-medium">{stage.label}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="text-muted-foreground">{stage.count} méd.</span>
                                            <span className="font-semibold">{formatCompactCFA(stage.montant)}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className={`h-2 rounded-full ${stage.color} transition-all`} style={{ width: `${Math.max(pct, 5)}%` }} />
                                    </div>
                                </div>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => onNavigate('impayes')}
                        >
                            Détail des impayés <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Recovery rate evolution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            Évolution du taux de recouvrement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={demoRecoveryRateEvolution}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 11 }} domain={[40, 100]} tickFormatter={(v) => `${v}%`} />
                                <Tooltip formatter={(v: number) => `${v}%`} />
                                <ReferenceLine y={85} stroke="#22c55e" strokeDasharray="5 5" label={{ value: "Objectif 85%", fontSize: 10, fill: "#22c55e" }} />
                                <Line type="monotone" dataKey="taux" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Segments */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Segmentation par tranche de retard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-4">
                        {[
                            { label: "1-3 mois", ...stats.retard_1_3_mois, severity: "retard_leger" },
                            { label: "3-6 mois", ...stats.retard_3_6_mois, severity: "retard_moyen" },
                            { label: "6-12 mois", ...stats.retard_6_12_mois, severity: "retard_critique" },
                            { label: "> 12 mois", ...stats.retard_plus_12_mois, severity: "very_critical" },
                        ].map((seg, i) => (
                            <div key={i} className={`p-4 rounded-lg border ${i === 0 ? 'bg-yellow-50 dark:bg-yellow-950/10 border-yellow-200 dark:border-yellow-800' :
                                    i === 1 ? 'bg-orange-50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-800' :
                                        'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-800'
                                }`}>
                                <p className="text-sm font-medium text-foreground mb-1">{seg.label}</p>
                                <p className="text-2xl font-bold text-foreground">{seg.nombre}</p>
                                <p className="text-xs text-muted-foreground">médecins</p>
                                <p className="text-sm font-semibold mt-1">{formatCompactCFA(seg.montant)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecouvrementPage;
