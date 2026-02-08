import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { DEMO_FINANCIAL_SUMMARY, DEMO_MONTHLY_REVENUE, DEMO_UNPAID_BREAKDOWN, DEMO_PROVINCE_STATS } from "@/lib/demo-president-data";

const CotisationsPage = () => {
    const fmt = (n: number) => `${(n / 1e6).toFixed(1)}M FCFA`;
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Wallet className="w-5 h-5" />Suivi des cotisations</h2>
                <p className="text-sm text-muted-foreground">Lecture seule — Module M4</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Recettes 2026", value: fmt(DEMO_FINANCIAL_SUMMARY.recettes_totales), color: "text-emerald-600", icon: TrendingUp },
                    { label: "Taux de recouvrement", value: `${DEMO_FINANCIAL_SUMMARY.taux_recouvrement}%`, color: "text-amber-600", icon: Wallet },
                    { label: "Impayés totaux", value: fmt(DEMO_FINANCIAL_SUMMARY.impayes_total), color: "text-red-500", icon: AlertTriangle },
                    { label: "Cotisations ce mois", value: fmt(DEMO_FINANCIAL_SUMMARY.cotisations_mois_courant), color: "text-blue-600", icon: Wallet },
                ].map((k, i) => (
                    <Card key={i}><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">{k.label}</p><p className={`text-xl font-bold mt-1 ${k.color}`}>{k.value}</p></div><k.icon className={`w-5 h-5 ${k.color}`} /></div></CardContent></Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card><CardHeader><CardTitle className="text-base">Recettes mensuelles</CardTitle></CardHeader>
                    <CardContent><ResponsiveContainer width="100%" height={250}>
                        <BarChart data={DEMO_MONTHLY_REVENUE}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mois" /><YAxis tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} /><Tooltip formatter={(v: number) => fmt(v)} /><Legend />
                            <Bar dataKey="cotisations" name="Cotisations" fill="#006B3F" /><Bar dataKey="inscriptions" name="Inscriptions" fill="#C8A951" />
                        </BarChart>
                    </ResponsiveContainer></CardContent>
                </Card>

                <Card><CardHeader><CardTitle className="text-base">Répartition des impayés par durée</CardTitle></CardHeader>
                    <CardContent><Table>
                        <TableHeader><TableRow><TableHead>Durée de retard</TableHead><TableHead className="text-right">Nombre</TableHead><TableHead className="text-right">Montant</TableHead></TableRow></TableHeader>
                        <TableBody>{DEMO_UNPAID_BREAKDOWN.map((u, i) => (
                            <TableRow key={i}><TableCell className="font-medium">{u.duree}</TableCell><TableCell className="text-right">{u.nombre}</TableCell><TableCell className="text-right font-medium text-red-500">{fmt(u.montant)}</TableCell></TableRow>
                        ))}</TableBody>
                    </Table></CardContent>
                </Card>
            </div>

            <Card><CardHeader><CardTitle className="text-base">Taux de recouvrement par province</CardTitle></CardHeader>
                <CardContent><Table>
                    <TableHeader><TableRow><TableHead>Province</TableHead><TableHead className="text-right">Médecins</TableHead><TableHead className="text-right">Taux estimé</TableHead></TableRow></TableHeader>
                    <TableBody>{DEMO_PROVINCE_STATS.map((p, i) => {
                        const taux = Math.max(50, 90 - i * 5);
                        return (
                            <TableRow key={i}><TableCell className="font-medium">{p.province}</TableCell><TableCell className="text-right">{p.medecins}</TableCell>
                                <TableCell className="text-right"><Badge variant="outline" className={`text-xs ${taux > 70 ? 'text-emerald-600 border-emerald-200' : 'text-red-500 border-red-200'}`}>{taux}%</Badge></TableCell>
                            </TableRow>
                        );
                    })}</TableBody>
                </Table></CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500"><CardContent className="p-4">
                <p className="text-sm font-medium text-red-600">⚠️ Signalement au bureau national (RG-M4-03)</p>
                <p className="text-sm text-muted-foreground mt-1">{DEMO_UNPAID_BREAKDOWN.find(u => u.duree === '>12 mois')?.nombre || 0} médecins avec un retard de cotisation supérieur à 12 mois.</p>
            </CardContent></Card>
        </div>
    );
};

export default CotisationsPage;
