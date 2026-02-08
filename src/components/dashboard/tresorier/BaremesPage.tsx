import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Settings, Edit2, Save, History, Shield } from "lucide-react";
import { formatCFA, formatDateFR } from "@/lib/finance-utils";
import { demoTariffs, demoPenaltyConfig, demoTariffHistory } from "@/lib/demo-tresorier-data";

const BaremesPage = () => {
    const [editingTariff, setEditingTariff] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-500" />
                        Barèmes & Pénalités
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Configuration des tarifs de cotisation et pénalités de retard
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded-lg px-3 py-1.5 border border-amber-200 dark:border-amber-800">
                    <Shield className="w-3.5 h-3.5" />
                    Modifications soumises à validation Bureau
                </div>
            </div>

            {/* Tariff grid */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Grille tarifaire en vigueur</CardTitle>
                    <Badge variant="outline">Depuis le 01/01/2024</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Libellé</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead>Périodicité</TableHead>
                                <TableHead className="text-center">Actif</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {demoTariffs.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-mono text-xs">{t.code}</TableCell>
                                    <TableCell className="font-medium">{t.libelle}</TableCell>
                                    <TableCell className="text-right">
                                        {editingTariff === t.id ? (
                                            <Input type="number" defaultValue={t.montant} className="w-32 h-8 text-right" />
                                        ) : (
                                            <span className="font-semibold">{formatCFA(t.montant)}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm capitalize">{t.periodicite || '—'}</TableCell>
                                    <TableCell className="text-center">
                                        <Switch checked={t.actif} disabled />
                                    </TableCell>
                                    <TableCell>
                                        {editingTariff === t.id ? (
                                            <Button variant="default" size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditingTariff(null)}>
                                                <Save className="w-3 h-3 mr-1" />
                                                Sauver
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditingTariff(t.id)}>
                                                <Edit2 className="w-3 h-3 mr-1" />
                                                Modifier
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Penalty tiers */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Tranches de pénalité (RG-M4-04)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tranche</TableHead>
                                <TableHead className="text-center">Taux</TableHead>
                                <TableHead className="text-center">Plafond</TableHead>
                                <TableHead className="text-center">Actif</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {demoPenaltyConfig.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        {p.tranche_debut_mois} — {p.tranche_fin_mois ? `${p.tranche_fin_mois} mois` : '∞'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={p.taux_penalite === 0 ? "secondary" : "destructive"} className="text-xs">
                                            {p.taux_penalite}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {p.plafond_montant ? formatCFA(p.plafond_montant) : '—'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Switch checked={p.actif} disabled />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="w-4 h-4 text-muted-foreground" />
                        Historique des modifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Modification</TableHead>
                                <TableHead>Ancien</TableHead>
                                <TableHead>Nouveau</TableHead>
                                <TableHead>Validé par</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {demoTariffHistory.map((h, i) => (
                                <TableRow key={i}>
                                    <TableCell className="text-xs">{h.date}</TableCell>
                                    <TableCell className="font-medium text-sm">{h.modification}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{h.ancien}</TableCell>
                                    <TableCell className="text-sm font-medium">{h.nouveau}</TableCell>
                                    <TableCell className="text-sm">{h.valide_par}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default BaremesPage;
