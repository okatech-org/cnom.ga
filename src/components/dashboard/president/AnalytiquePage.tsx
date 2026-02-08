import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, TrendingUp, Activity, Gauge, Calendar, CreditCard, QrCode, FileText, Clock } from "lucide-react";
import {
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
    ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";
import {
    DEMO_SPECIALITE_STATS, DEMO_AGE_PYRAMID, DEMO_FEMINISATION, DEMO_FLUX_ANNUELS,
    DEMO_PROVINCE_STATS, DEMO_MONTHLY_REVENUE, DEMO_UNPAID_BREAKDOWN, DEMO_INSCRIPTIONS_MONTHLY,
    DEMO_FINANCIAL_SUMMARY,
} from "@/lib/demo-president-data";

const PIE_COLORS = ["#006B3F", "#C8A951", "#0EA5E9", "#F97316", "#8B5CF6", "#94A3B8", "#EC4899", "#14B8A6", "#EF4444", "#6366F1"];
const mapColor = (ratio: number) => ratio < 2.3 ? "#EF4444" : ratio < 5 ? "#F97316" : "#22C55E";

const AnalytiquePage = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Business Intelligence</h2>
                    <p className="text-sm text-muted-foreground">Tableau de bord analytique complet — Module M5</p>
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export rapport</Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="demographie">Démographie</TabsTrigger>
                    <TabsTrigger value="geographie">Géographie</TabsTrigger>
                    <TabsTrigger value="finances">Finances</TabsTrigger>
                    <TabsTrigger value="activite">Activité</TabsTrigger>
                </TabsList>

                {/* ── Vue d'ensemble ── */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Total médecins inscrits", value: "2 197", sub: "1 980 actifs · 217 inactifs", icon: Users, color: "text-primary" },
                            { label: "Nouveaux inscrits (semestre)", value: "168", sub: "+12% vs S2-2025", icon: TrendingUp, color: "text-emerald-600" },
                            { label: "Ratio médecin/10 000 hab.", value: "9.8", sub: "Moyenne nationale", icon: Gauge, color: "text-blue-600" },
                            { label: "Taux de féminisation", value: "35%", sub: "+2% sur 5 ans", icon: Users, color: "text-pink-500" },
                            { label: "Taux de recouvrement", value: "72.4%", sub: "+5.1% vs N-1", icon: CreditCard, color: "text-amber-600" },
                            { label: "Recettes 2026", value: "156.4M FCFA", sub: "+12% vs 2025", icon: CreditCard, color: "text-emerald-600" },
                            { label: "Vérifications QR / mois", value: "1 847", sub: "+22% vs mois dernier", icon: QrCode, color: "text-violet-600" },
                            { label: "Délai moyen traitement", value: "18 j", sub: "-3j vs trimestre dernier", icon: Clock, color: "text-orange-500" },
                        ].map((k, i) => (
                            <Card key={i}><CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-xl font-bold mt-1">{k.value}</p><p className="text-xs text-muted-foreground mt-1">{k.sub}</p></div>
                                    <k.icon className={`w-5 h-5 ${k.color}`} />
                                </div>
                            </CardContent></Card>
                        ))}
                    </div>
                </TabsContent>

                {/* ── Démographie ── */}
                <TabsContent value="demographie" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Age Pyramid */}
                        <Card><CardHeader><CardTitle className="text-base">Pyramide des âges</CardTitle></CardHeader>
                            <CardContent><ResponsiveContainer width="100%" height={260}>
                                <BarChart data={DEMO_AGE_PYRAMID} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="tranche" type="category" width={50} tick={{ fontSize: 12 }} />
                                    <Tooltip /><Legend />
                                    <Bar dataKey="hommes" name="Hommes" fill="#006B3F" />
                                    <Bar dataKey="femmes" name="Femmes" fill="#C8A951" />
                                </BarChart>
                            </ResponsiveContainer></CardContent>
                        </Card>

                        {/* Specialty Pie */}
                        <Card><CardHeader><CardTitle className="text-base">Répartition par spécialité</CardTitle></CardHeader>
                            <CardContent><ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={DEMO_SPECIALITE_STATS} dataKey="pourcentage" nameKey="specialite" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                                        {DEMO_SPECIALITE_STATS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                    </Pie><Tooltip formatter={(v: number) => `${v}%`} /><Legend />
                                </PieChart>
                            </ResponsiveContainer></CardContent>
                        </Card>

                        {/* Feminization */}
                        <Card><CardHeader><CardTitle className="text-base">Évolution du taux de féminisation</CardTitle></CardHeader>
                            <CardContent><ResponsiveContainer width="100%" height={220}>
                                <LineChart data={DEMO_FEMINISATION}>
                                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="annee" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} unit="%" />
                                    <Tooltip formatter={(v: number) => `${v}%`} /><Line type="monotone" dataKey="taux" name="Taux" stroke="#EC4899" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer></CardContent>
                        </Card>

                        {/* Annual Flows */}
                        <Card><CardHeader><CardTitle className="text-base">Flux annuels (5 ans)</CardTitle></CardHeader>
                            <CardContent><ResponsiveContainer width="100%" height={220}>
                                <BarChart data={DEMO_FLUX_ANNUELS}>
                                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="annee" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip /><Legend />
                                    <Bar dataKey="inscriptions" name="Inscriptions" fill="#006B3F" />
                                    <Bar dataKey="radiations" name="Radiations" fill="#EF4444" />
                                    <Bar dataKey="deces" name="Décès" fill="#94A3B8" />
                                    <Bar dataKey="retraites" name="Retraites" fill="#C8A951" />
                                </BarChart>
                            </ResponsiveContainer></CardContent>
                        </Card>
                    </div>

                    {/* Specialty Table */}
                    <Card><CardHeader><CardTitle className="text-base">Détail par spécialité</CardTitle></CardHeader>
                        <CardContent><Table>
                            <TableHeader><TableRow>
                                <TableHead>Spécialité</TableHead><TableHead className="text-right">Nombre</TableHead><TableHead className="text-right">%</TableHead><TableHead className="text-right">Féminisation</TableHead><TableHead className="text-right">Évol. 5 ans</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>{DEMO_SPECIALITE_STATS.map((s, i) => (
                                <TableRow key={i}><TableCell className="font-medium">{s.specialite}</TableCell><TableCell className="text-right">{s.nombre}</TableCell><TableCell className="text-right">{s.pourcentage}%</TableCell><TableCell className="text-right">{s.taux_feminisation}%</TableCell><TableCell className="text-right text-emerald-600">+{s.evolution_5ans}%</TableCell></TableRow>
                            ))}</TableBody>
                        </Table></CardContent>
                    </Card>
                </TabsContent>

                {/* ── Géographie ── */}
                <TabsContent value="geographie" className="space-y-6">
                    <Card><CardHeader><CardTitle className="text-base">Répartition géographique des médecins</CardTitle></CardHeader>
                        <CardContent><Table>
                            <TableHeader><TableRow>
                                <TableHead>Province</TableHead><TableHead>Chef-lieu</TableHead><TableHead className="text-right">Médecins</TableHead><TableHead className="text-right">%</TableHead><TableHead className="text-right">Ratio / 10 000</TableHead><TableHead>Statut</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>{DEMO_PROVINCE_STATS.map((p, i) => (
                                <TableRow key={i}><TableCell className="font-medium">{p.province}</TableCell><TableCell>{p.chef_lieu}</TableCell><TableCell className="text-right">{p.medecins.toLocaleString()}</TableCell><TableCell className="text-right">{p.pourcentage}%</TableCell>
                                    <TableCell className="text-right"><span style={{ color: mapColor(p.ratio_pour_10000) }} className="font-semibold">{p.ratio_pour_10000}</span></TableCell>
                                    <TableCell>{p.is_desert_medical ? <Badge variant="destructive" className="text-xs">Désert médical</Badge> : <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">OK</Badge>}</TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table></CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-red-500"><CardContent className="p-4">
                        <p className="text-sm font-medium text-red-600 mb-1">⚠️ Seuil OMS : 2.3 médecins / 10 000 habitants</p>
                        <p className="text-sm text-muted-foreground">4 provinces sous le seuil : Ogooué-Lolo (0.9), Ogooué-Ivindo (1.1), Nyanga (1.9), Ngounié (2.2)</p>
                    </CardContent></Card>
                </TabsContent>

                {/* ── Finances ── */}
                <TabsContent value="finances" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Recettes 2026", value: `${(DEMO_FINANCIAL_SUMMARY.recettes_totales / 1e6).toFixed(1)}M FCFA`, color: "text-emerald-600" },
                            { label: "Taux de recouvrement", value: `${DEMO_FINANCIAL_SUMMARY.taux_recouvrement}%`, color: "text-amber-600" },
                            { label: "Impayés totaux", value: `${(DEMO_FINANCIAL_SUMMARY.impayes_total / 1e6).toFixed(1)}M FCFA`, color: "text-red-500" },
                            { label: "Cotisations ce mois", value: `${(DEMO_FINANCIAL_SUMMARY.cotisations_mois_courant / 1e6).toFixed(1)}M FCFA`, color: "text-blue-600" },
                        ].map((k, i) => (
                            <Card key={i}><CardContent className="p-5"><p className="text-xs text-muted-foreground">{k.label}</p><p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p></CardContent></Card>
                        ))}
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card><CardHeader><CardTitle className="text-base">Évolution des recettes mensuelles</CardTitle></CardHeader>
                            <CardContent><ResponsiveContainer width="100%" height={250}>
                                <BarChart data={DEMO_MONTHLY_REVENUE}>
                                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mois" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
                                    <Tooltip formatter={(v: number) => `${(v / 1e6).toFixed(1)}M FCFA`} /><Legend />
                                    <Bar dataKey="cotisations" name="Cotisations" fill="#006B3F" />
                                    <Bar dataKey="inscriptions" name="Inscriptions" fill="#C8A951" />
                                </BarChart>
                            </ResponsiveContainer></CardContent>
                        </Card>
                        <Card><CardHeader><CardTitle className="text-base">Répartition des impayés</CardTitle></CardHeader>
                            <CardContent><ResponsiveContainer width="100%" height={250}>
                                <BarChart data={DEMO_UNPAID_BREAKDOWN} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} /><YAxis dataKey="duree" type="category" width={80} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(v: number) => `${(v / 1e6).toFixed(1)}M FCFA`} />
                                    <Bar dataKey="montant" name="Montant" fill="#EF4444" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer></CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ── Activité ── */}
                <TabsContent value="activite" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card><CardHeader><CardTitle className="text-base">Nouvelles inscriptions / mois</CardTitle></CardHeader>
                            <CardContent><ResponsiveContainer width="100%" height={220}>
                                <LineChart data={DEMO_INSCRIPTIONS_MONTHLY}>
                                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mois" /><YAxis /><Tooltip />
                                    <Line type="monotone" dataKey="soumis" name="Soumis" stroke="#006B3F" strokeWidth={2} />
                                    <Line type="monotone" dataKey="valides" name="Validés" stroke="#C8A951" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer></CardContent>
                        </Card>
                        <Card className="grid gap-4 sm:grid-cols-3 p-6">
                            {[{ label: "Dossiers incomplets", value: "23", color: "text-orange-500" }, { label: "Taux validation", value: "92%", color: "text-emerald-600" }, { label: "Délai moyen", value: "18j", color: "text-blue-600" }].map((k, i) => (
                                <div key={i} className="text-center"><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p><p className="text-xs text-muted-foreground mt-1">{k.label}</p></div>
                            ))}
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalytiquePage;
