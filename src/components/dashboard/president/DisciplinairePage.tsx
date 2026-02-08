import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Scale, Eye, Shield } from "lucide-react";
import { DEMO_DISCIPLINARY, DEMO_DOCTORS } from "@/lib/demo-president-data";
import { SANCTION_TYPE_LABELS, SANCTION_STATUS_LABELS } from "@/types/president";
import type { DisciplinaryRecord } from "@/types/president";

const statusColor: Record<string, string> = {
    en_cours: "bg-orange-100 text-orange-700 border-orange-200",
    execute: "bg-emerald-100 text-emerald-700 border-emerald-200",
    releve: "bg-blue-100 text-blue-700 border-blue-200",
    appel: "bg-red-100 text-red-700 border-red-200",
};

const DisciplinairePage = () => {
    const [selected, setSelected] = useState<DisciplinaryRecord | null>(null);
    const records = DEMO_DISCIPLINARY.map(d => ({
        ...d,
        doctor: DEMO_DOCTORS.find(doc => doc.id === d.doctor_id),
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Scale className="w-5 h-5" />Historique disciplinaire</h2>
                    <p className="text-sm text-muted-foreground">Accès privilégié RA-02 — Président / SG / Admin uniquement</p>
                </div>
                <Badge variant="outline" className="text-xs gap-1"><Shield className="w-3 h-3" />Accès restreint RA-02</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-orange-600">{records.filter(r => r.statut === 'en_cours').length}</p><p className="text-xs text-muted-foreground mt-1">Sanctions en cours</p></CardContent></Card>
                <Card><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-emerald-600">{records.filter(r => r.statut === 'execute').length}</p><p className="text-xs text-muted-foreground mt-1">Exécutées</p></CardContent></Card>
                <Card><CardContent className="p-5 text-center"><p className="text-2xl font-bold">{records.length}</p><p className="text-xs text-muted-foreground mt-1">Total dossiers</p></CardContent></Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead>Médecin</TableHead><TableHead>Type de sanction</TableHead><TableHead>Nature</TableHead><TableHead>Date décision</TableHead><TableHead>Durée</TableHead><TableHead>Statut</TableHead><TableHead className="w-12" />
                        </TableRow></TableHeader>
                        <TableBody>{records.map(r => (
                            <TableRow key={r.id}>
                                <TableCell className="font-medium">Dr. {r.doctor?.nom} {r.doctor?.prenoms?.charAt(0)}.</TableCell>
                                <TableCell className="text-sm">{SANCTION_TYPE_LABELS[r.type_sanction]}</TableCell>
                                <TableCell className="text-sm max-w-[200px] truncate">{r.nature_infraction}</TableCell>
                                <TableCell className="text-sm">{r.date_decision}</TableCell>
                                <TableCell className="text-sm">{r.duree_jours ? `${r.duree_jours}j` : '—'}</TableCell>
                                <TableCell><Badge variant="outline" className={`text-xs ${statusColor[r.statut]}`}>{SANCTION_STATUS_LABELS[r.statut]}</Badge></TableCell>
                                <TableCell><Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setSelected(r)}><Eye className="w-4 h-4" /></Button></TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
                <SheetContent className="sm:max-w-lg overflow-y-auto">
                    {selected && (
                        <>
                            <SheetHeader><SheetTitle>Dossier disciplinaire</SheetTitle></SheetHeader>
                            <div className="mt-6 space-y-6">
                                <section><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Médecin concerné</h4>
                                    <p className="font-medium">Dr. {selected.doctor?.nom} {selected.doctor?.prenoms}</p>
                                    <p className="text-sm text-muted-foreground">N° Ordre: {String(selected.doctor?.numero_ordre).padStart(4, '0')}</p>
                                </section>
                                <section><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Infraction</h4>
                                    <p className="text-sm">{selected.nature_infraction}</p>
                                </section>
                                <section><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sanction</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium">{SANCTION_TYPE_LABELS[selected.type_sanction]}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Statut</p><Badge variant="outline" className={`text-xs ${statusColor[selected.statut]}`}>{SANCTION_STATUS_LABELS[selected.statut]}</Badge></div>
                                        <div><p className="text-muted-foreground text-xs">Date décision</p><p className="font-medium">{selected.date_decision}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Date d'effet</p><p className="font-medium">{selected.date_effet}</p></div>
                                        {selected.duree_jours && <div><p className="text-muted-foreground text-xs">Durée</p><p className="font-medium">{selected.duree_jours} jours</p></div>}
                                        {selected.date_fin && <div><p className="text-muted-foreground text-xs">Date de fin</p><p className="font-medium">{selected.date_fin}</p></div>}
                                    </div>
                                    {selected.decision_detail && <p className="text-sm mt-3 p-3 bg-muted/50 rounded-lg">{selected.decision_detail}</p>}
                                </section>
                                <div className="flex gap-2">
                                    <Button size="sm">Confirmer exécution</Button>
                                    <Button variant="outline" size="sm">Lever la suspension</Button>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default DisciplinairePage;
