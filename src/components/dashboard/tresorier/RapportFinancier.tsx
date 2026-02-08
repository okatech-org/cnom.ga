import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3, TrendingUp, Download, PieChart, ArrowUpRight, ArrowDownRight,
    Calendar
} from "lucide-react";
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, AreaChart, Area
} from "recharts";
import { formatCFA, formatCompactCFA } from "@/lib/finance-utils";
import { demoKPIs, demoMonthlyRevenue, demoPaymentMethods, demoProvinceStats } from "@/lib/demo-tresorier-data";

const comparisonData = [
    { mois: 'Jan', _2025: 14_200_000, _2026: 17_600_000 },
    { mois: 'Fév', _2025: 16_900_000, _2026: 20_600_000 },
    { mois: 'Mar', _2025: 13_100_000, _2026: 14_800_000 },
    { mois: 'Avr', _2025: 11_800_000, _2026: 14_000_000 },
    { mois: 'Mai', _2025: 15_400_000, _2026: 19_700_000 },
    { mois: 'Jun', _2025: 12_200_000, _2026: 14_200_000 },
    { mois: 'Jul', _2025: 9_800_000, _2026: 11_400_000 },
    { mois: 'Aoû', _2025: 8_700_000, _2026: 10_600_000 },
];

const RapportFinancier = () => {
    const [subTab, setSubTab] = useState("synthese");

    const synthKPIs = [
        { label: "Recettes totales", value: formatCompactCFA(demoKPIs.recettes_totales), change: `+${demoKPIs.comparaison_n_moins_1}%`, up: true },
        { label: "Cotisations", value: formatCompactCFA(demoKPIs.recettes_cotisations), change: "70% des recettes", up: true },
        { label: "Inscriptions", value: formatCompactCFA(demoKPIs.recettes_inscriptions), change: "30% des recettes", up: true },
        { label: "Taux recouvrement", value: `${demoKPIs.taux_recouvrement}%`, change: `Obj: ${demoKPIs.taux_recouvrement_objectif}%`, up: false },
        { label: "Médecins à jour", value: `${demoKPIs.medecins_a_jour}`, change: `/${demoKPIs.medecins_total_actifs} actifs`, up: true },
        { label: "Impayés", value: formatCompactCFA(demoKPIs.impayes_total), change: `${demoKPIs.impayes_nombre_medecins} méd.`, up: false },
        { label: "Moratoires actifs", value: `${demoKPIs.moratoires_actifs}`, change: "Dispenses", up: true },
        { label: "Potentiel maximal", value: formatCompactCFA(demoKPIs.potentiel_maximal), change: "Budget annuel", up: true },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-violet-500" />
                        Rapport financier
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Analyse BI — Exercice fiscal 2026
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Exporter le rapport
                </Button>
            </div>

            <Tabs value={subTab} onValueChange={setSubTab} className="space-y-4">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="synthese" className="gap-1.5"><PieChart className="w-3.5 h-3.5" /> Synthèse</TabsTrigger>
                    <TabsTrigger value="evolution" className="gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Évolution</TabsTrigger>
                    <TabsTrigger value="comparaison" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Comparaison</TabsTrigger>
                    <TabsTrigger value="detail" className="gap-1.5"><Calendar className="w-3.5 h-3.5" /> Détail mensuel</TabsTrigger>
                </TabsList>

                {/* Synthèse */}
                <TabsContent value="synthese" className="space-y-4">
                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                        {synthKPIs.map((kpi, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                                    <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                                    <p className={`text-xs mt-0.5 flex items-center gap-0.5 ${kpi.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {kpi.change}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Répartition des recettes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={demoMonthlyRevenue.filter(m => m.total > 0)}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                                        <Tooltip formatter={(v: number) => formatCFA(v)} />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar dataKey="cotisations" name="Cotisations" stackId="a" fill="#f59e0b" />
                                        <Bar dataKey="inscriptions" name="Inscriptions" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Top provinces par recouvrement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {demoProvinceStats.slice(0, 5).map((p) => (
                                        <div key={p.province} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-foreground font-medium">{p.province}</span>
                                                <span className="text-muted-foreground">{p.taux_recouvrement}%</span>
                                            </div>
                                            <Progress value={p.taux_recouvrement} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Évolution */}
                <TabsContent value="evolution" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Évolution des recettes mensuelles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={demoMonthlyRevenue.filter(m => m.total > 0)}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                                    <Tooltip formatter={(v: number) => formatCFA(v)} />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Area type="monotone" dataKey="total" name="Total 2026" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                                    <Area type="monotone" dataKey="annee_precedente" name="Total 2025" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Comparaison */}
                <TabsContent value="comparaison" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">2026 vs 2025 — Comparaison mensuelle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                                    <Tooltip formatter={(v: number) => formatCFA(v)} />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Bar dataKey="_2025" name="2025" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="_2026" name="2026" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Détail */}
                <TabsContent value="detail" className="space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-medium">Mois</th>
                                            <th className="text-right p-3 font-medium">Cotisations</th>
                                            <th className="text-right p-3 font-medium">Inscriptions</th>
                                            <th className="text-right p-3 font-medium">Total</th>
                                            <th className="text-right p-3 font-medium">N-1</th>
                                            <th className="text-right p-3 font-medium">Écart</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demoMonthlyRevenue.filter(m => m.total > 0).map((m) => {
                                            const ecart = m.annee_precedente ? ((m.total - m.annee_precedente) / m.annee_precedente * 100).toFixed(1) : '—';
                                            return (
                                                <tr key={m.mois} className="border-b hover:bg-muted/50">
                                                    <td className="p-3 font-medium">{m.mois}</td>
                                                    <td className="p-3 text-right">{formatCompactCFA(m.cotisations)}</td>
                                                    <td className="p-3 text-right">{formatCompactCFA(m.inscriptions)}</td>
                                                    <td className="p-3 text-right font-semibold">{formatCompactCFA(m.total)}</td>
                                                    <td className="p-3 text-right text-muted-foreground">{m.annee_precedente ? formatCompactCFA(m.annee_precedente) : '—'}</td>
                                                    <td className="p-3 text-right">
                                                        {typeof ecart === 'string' && ecart !== '—' ? (
                                                            <span className={Number(ecart) >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                                {Number(ecart) >= 0 ? '+' : ''}{ecart}%
                                                            </span>
                                                        ) : '—'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RapportFinancier;
