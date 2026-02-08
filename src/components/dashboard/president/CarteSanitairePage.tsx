import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from "lucide-react";
import { DEMO_PROVINCE_STATS } from "@/lib/demo-president-data";

const mapColor = (ratio: number) => ratio < 2.3 ? "#EF4444" : ratio < 5 ? "#F97316" : "#22C55E";

const CarteSanitairePage = () => {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const selected = DEMO_PROVINCE_STATS.find(p => p.province === selectedProvince);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Carte sanitaire du Gabon</h2>
                    <p className="text-sm text-muted-foreground">Répartition géographique et identification des déserts médicaux</p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500" /><span className="text-xs">&gt; 5 / 10 000 hab.</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500" /><span className="text-xs">2.3 – 5 / 10 000 hab.</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500" /><span className="text-xs">&lt; 2.3 / 10 000 hab. (Désert médical OMS)</span></div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Province Cards */}
                <div className="lg:col-span-2 grid gap-3 sm:grid-cols-3">
                    {DEMO_PROVINCE_STATS.map((p) => (
                        <Card
                            key={p.province}
                            className={`cursor-pointer transition-all hover:shadow-md ${selectedProvince === p.province ? "ring-2 ring-primary" : ""}`}
                            onClick={() => setSelectedProvince(p.province)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <p className="font-medium text-sm">{p.province}</p>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mapColor(p.ratio_pour_10000) }} />
                                </div>
                                <p className="text-2xl font-bold">{p.medecins}</p>
                                <p className="text-xs text-muted-foreground">médecins · {p.ratio_pour_10000}/10k hab.</p>
                                {p.is_desert_medical && <Badge variant="destructive" className="text-[10px] mt-2">Désert médical</Badge>}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Detail Panel */}
                <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4" />Détail province</CardTitle></CardHeader>
                    <CardContent>
                        {selected ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg">{selected.province}</h3>
                                    <p className="text-sm text-muted-foreground">Chef-lieu : {selected.chef_lieu}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-xs text-muted-foreground">Médecins</p><p className="text-xl font-bold">{selected.medecins}</p></div>
                                    <div><p className="text-xs text-muted-foreground">Population</p><p className="text-xl font-bold">{selected.population.toLocaleString()}</p></div>
                                    <div><p className="text-xs text-muted-foreground">Part nationale</p><p className="text-xl font-bold">{selected.pourcentage}%</p></div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Ratio / 10 000</p>
                                        <p className="text-xl font-bold" style={{ color: mapColor(selected.ratio_pour_10000) }}>{selected.ratio_pour_10000}</p>
                                    </div>
                                </div>
                                {selected.is_desert_medical && (
                                    <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">⚠️ Zone sous le seuil OMS</p>
                                        <p className="text-xs text-red-600 dark:text-red-400">Ratio inférieur à 2.3 médecins / 10 000 habitants</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground py-8 text-center">Sélectionnez une province pour voir les détails</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Full Table */}
            <Card>
                <CardHeader><CardTitle className="text-base">Tableau comparatif des provinces</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead>Province</TableHead><TableHead>Chef-lieu</TableHead><TableHead className="text-right">Médecins</TableHead><TableHead className="text-right">Population</TableHead><TableHead className="text-right">% national</TableHead><TableHead className="text-right">Ratio/10 000</TableHead><TableHead>Statut OMS</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>{DEMO_PROVINCE_STATS.map((p, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{p.province}</TableCell><TableCell>{p.chef_lieu}</TableCell>
                                <TableCell className="text-right">{p.medecins.toLocaleString()}</TableCell><TableCell className="text-right">{p.population.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{p.pourcentage}%</TableCell>
                                <TableCell className="text-right font-semibold" style={{ color: mapColor(p.ratio_pour_10000) }}>{p.ratio_pour_10000}</TableCell>
                                <TableCell>{p.is_desert_medical ? <Badge variant="destructive" className="text-xs">Désert</Badge> : <Badge variant="outline" className="text-xs text-emerald-600">OK</Badge>}</TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default CarteSanitairePage;
