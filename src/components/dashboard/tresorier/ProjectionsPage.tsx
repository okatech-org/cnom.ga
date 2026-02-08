import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calculator, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from "recharts";
import { formatCFA, formatCompactCFA } from "@/lib/finance-utils";
import { demoProjections, demoKPIs } from "@/lib/demo-tresorier-data";

const ProjectionsPage = () => {
    const [tauxCible, setTauxCible] = useState([80]);
    const [medecinsNouveaux, setMedecinsNouveaux] = useState([15]);

    const potentiel = demoKPIs.potentiel_maximal;
    const recettesPrevues = (potentiel * tauxCible[0]) / 100;
    const ecartBudget = recettesPrevues - potentiel;

    // Simulated monthly projection
    const projectionData = [
        { mois: 'Sep', pessimiste: 10_200_000 * 0.85, realiste: 10_200_000, optimiste: 10_200_000 * 1.12 },
        { mois: 'Oct', pessimiste: 11_500_000 * 0.85, realiste: 11_500_000, optimiste: 11_500_000 * 1.12 },
        { mois: 'Nov', pessimiste: 13_800_000 * 0.85, realiste: 13_800_000, optimiste: 13_800_000 * 1.12 },
        { mois: 'Déc', pessimiste: 14_900_000 * 0.85, realiste: 14_900_000, optimiste: 14_900_000 * 1.12 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        Projections budgétaires
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Simulation et prévisions financières — S2 2026
                    </p>
                </div>
            </div>

            {/* Simulator */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-amber-600" />
                        Simulateur interactif
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Taux de recouvrement cible</Label>
                                    <Badge variant="outline">{tauxCible[0]}%</Badge>
                                </div>
                                <Slider
                                    value={tauxCible}
                                    onValueChange={setTauxCible}
                                    max={100}
                                    min={50}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Nouveaux inscrits prévus (S2)</Label>
                                    <Badge variant="outline">{medecinsNouveaux[0]}</Badge>
                                </div>
                                <Slider
                                    value={medecinsNouveaux}
                                    onValueChange={setMedecinsNouveaux}
                                    max={50}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Recettes prévues</p>
                                <p className="text-xl font-bold text-emerald-600">{formatCompactCFA(recettesPrevues)}</p>
                            </div>
                            <div className={`p-4 rounded-lg border text-center ${ecartBudget >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-800'}`}>
                                <p className="text-xs text-muted-foreground mb-1">Écart vs budget</p>
                                <p className={`text-xl font-bold ${ecartBudget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {ecartBudget >= 0 ? '+' : ''}{formatCompactCFA(ecartBudget)}
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/10 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Inscriptions (est.)</p>
                                <p className="text-xl font-bold text-blue-600">{formatCompactCFA(medecinsNouveaux[0] * 50_000)}</p>
                            </div>
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/10 rounded-lg border border-amber-200 dark:border-amber-800 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Total projeté</p>
                                <p className="text-xl font-bold text-amber-600">{formatCompactCFA(recettesPrevues + medecinsNouveaux[0] * 50_000)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Scenarios */}
            <div className="grid gap-4 sm:grid-cols-3">
                {demoProjections.map((scenario) => (
                    <Card key={scenario.label} className={
                        scenario.label === 'Optimiste' ? 'border-emerald-200 dark:border-emerald-800' :
                            scenario.label === 'Pessimiste' ? 'border-red-200 dark:border-red-800' :
                                'border-amber-200 dark:border-amber-800'
                    }>
                        <CardContent className="p-5 text-center space-y-2">
                            <Badge variant={
                                scenario.label === 'Optimiste' ? 'default' :
                                    scenario.label === 'Pessimiste' ? 'destructive' :
                                        'secondary'
                            }>
                                {scenario.label}
                            </Badge>
                            <p className="text-sm text-muted-foreground">Taux: {scenario.taux_recouvrement}%</p>
                            <p className="text-2xl font-bold text-foreground">{formatCompactCFA(scenario.recettes_prevues)}</p>
                            <p className={`text-xs flex items-center justify-center gap-1 ${scenario.ecart_vs_budget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {scenario.ecart_vs_budget >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {formatCompactCFA(Math.abs(scenario.ecart_vs_budget))} vs budget
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Projection chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-600" />
                        Projections S2 2026 — 3 scénarios
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={projectionData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                            <Tooltip formatter={(v: number) => formatCFA(v)} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="optimiste" name="Optimiste" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="5 5" />
                            <Area type="monotone" dataKey="realiste" name="Réaliste" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                            <Area type="monotone" dataKey="pessimiste" name="Pessimiste" stroke="#ef4444" fill="#ef4444" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="5 5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectionsPage;
