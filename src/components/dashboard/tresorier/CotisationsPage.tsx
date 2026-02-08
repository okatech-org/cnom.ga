import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { CreditCard, MapPin, Stethoscope, Calendar, BarChart3 } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from "recharts";
import { formatCFA, formatCompactCFA } from "@/lib/finance-utils";
import { demoKPIs, demoProvinceStats, demoTariffs } from "@/lib/demo-tresorier-data";

const specialiteData = [
    { specialite: "Médecine Générale", medecins: 128, a_jour: 98, taux: 76.6 },
    { specialite: "Chirurgie", medecins: 42, a_jour: 34, taux: 81.0 },
    { specialite: "Pédiatrie", medecins: 35, a_jour: 28, taux: 80.0 },
    { specialite: "Gynéco-Obstétrique", medecins: 30, a_jour: 22, taux: 73.3 },
    { specialite: "Cardiologie", medecins: 22, a_jour: 18, taux: 81.8 },
    { specialite: "Dermatologie", medecins: 18, a_jour: 15, taux: 83.3 },
    { specialite: "Ophtalmologie", medecins: 16, a_jour: 12, taux: 75.0 },
    { specialite: "Autres", medecins: 32, a_jour: 18, taux: 56.3 },
];

const periodiciteData = [
    { mode: "Annuel", medecins: 145, pourcentage: 44.9, montant_unitaire: 120_000 },
    { mode: "Semestriel", medecins: 128, pourcentage: 39.6, montant_unitaire: 60_000 },
    { mode: "Mensuel", medecins: 50, pourcentage: 15.5, montant_unitaire: 10_000 },
];

const CotisationsPage = () => {
    const [activeSubTab, setActiveSubTab] = useState("globale");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Suivi des cotisations</h2>
                    <p className="text-sm text-muted-foreground">Vue globale du recouvrement par cotisations — Exercice 2026</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Exporter CSV</Button>
                </div>
            </div>

            {/* Tariff reference */}
            <Card className="bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800">
                <CardContent className="py-3 px-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-medium text-amber-800 dark:text-amber-300">Barème en vigueur :</span>
                        {demoTariffs.filter(t => t.actif && t.periodicite).map(t => (
                            <Badge key={t.id} variant="outline" className="bg-white dark:bg-gray-900">
                                {t.libelle} — {formatCFA(t.montant)}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Sub-tabs */}
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="globale" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Vue globale</TabsTrigger>
                    <TabsTrigger value="province" className="gap-1.5"><MapPin className="w-3.5 h-3.5" /> Province</TabsTrigger>
                    <TabsTrigger value="specialite" className="gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Spécialité</TabsTrigger>
                    <TabsTrigger value="periodicite" className="gap-1.5"><Calendar className="w-3.5 h-3.5" /> Périodicité</TabsTrigger>
                </TabsList>

                {/* Vue globale */}
                <TabsContent value="globale" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card>
                            <CardContent className="p-5 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Cotisations perçues</p>
                                <p className="text-2xl font-bold text-emerald-600">{formatCompactCFA(demoKPIs.recettes_cotisations)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-5 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Médecins à jour</p>
                                <p className="text-2xl font-bold text-foreground">{demoKPIs.medecins_a_jour} / {demoKPIs.medecins_total_actifs}</p>
                                <Progress value={(demoKPIs.medecins_a_jour / demoKPIs.medecins_total_actifs) * 100} className="h-2 mt-2" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-5 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Taux de recouvrement</p>
                                <p className="text-2xl font-bold text-blue-600">{demoKPIs.taux_recouvrement}%</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Comparaison provinces</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={demoProvinceStats} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                                    <YAxis type="category" dataKey="province" tick={{ fontSize: 11 }} width={110} />
                                    <Tooltip formatter={(v: number) => `${v}%`} />
                                    <Bar dataKey="taux_recouvrement" name="Taux recouvrement" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Province */}
                <TabsContent value="province" className="space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Province</TableHead>
                                        <TableHead className="text-center">Médecins</TableHead>
                                        <TableHead className="text-center">À jour</TableHead>
                                        <TableHead className="text-center">En retard</TableHead>
                                        <TableHead className="text-center">Taux</TableHead>
                                        <TableHead className="text-right">Montant perçu</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {demoProvinceStats.map((p) => (
                                        <TableRow key={p.province}>
                                            <TableCell className="font-medium">{p.province}</TableCell>
                                            <TableCell className="text-center">{p.medecins_actifs}</TableCell>
                                            <TableCell className="text-center text-emerald-600">{p.a_jour}</TableCell>
                                            <TableCell className="text-center text-red-600">{p.en_retard}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={p.taux_recouvrement >= 75 ? "default" : "destructive"} className="text-xs">
                                                    {p.taux_recouvrement}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{formatCompactCFA(p.montant_percu)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Spécialité */}
                <TabsContent value="specialite" className="space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Spécialité</TableHead>
                                        <TableHead className="text-center">Médecins</TableHead>
                                        <TableHead className="text-center">À jour</TableHead>
                                        <TableHead className="text-center">Taux</TableHead>
                                        <TableHead>Progression</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {specialiteData.map((s) => (
                                        <TableRow key={s.specialite}>
                                            <TableCell className="font-medium">{s.specialite}</TableCell>
                                            <TableCell className="text-center">{s.medecins}</TableCell>
                                            <TableCell className="text-center text-emerald-600">{s.a_jour}</TableCell>
                                            <TableCell className="text-center">{s.taux}%</TableCell>
                                            <TableCell>
                                                <Progress value={s.taux} className="h-2 w-24" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Périodicité */}
                <TabsContent value="periodicite" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {periodiciteData.map((p) => (
                            <Card key={p.mode}>
                                <CardContent className="p-5 text-center space-y-2">
                                    <CreditCard className="w-8 h-8 mx-auto text-amber-600" />
                                    <p className="font-semibold text-foreground">{p.mode}</p>
                                    <p className="text-2xl font-bold text-foreground">{p.medecins}</p>
                                    <p className="text-xs text-muted-foreground">{p.pourcentage}% des médecins</p>
                                    <Badge variant="outline">{formatCFA(p.montant_unitaire)}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CotisationsPage;
