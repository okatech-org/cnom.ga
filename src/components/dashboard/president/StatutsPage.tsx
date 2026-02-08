import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RefreshCw, Check, X, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import { DEMO_STATUS_CHANGES } from "@/lib/demo-president-data";
import type { StatusChangeRequest, DoctorStatus } from "@/types/president";

const StatutsPage = () => {
    const [selected, setSelected] = useState<StatusChangeRequest | null>(null);
    const [comment, setComment] = useState("");
    const pending = DEMO_STATUS_CHANGES.filter(s => s.statut_demande === 'en_attente');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><RefreshCw className="w-5 h-5" />Changements de statut</h2>
                    <p className="text-sm text-muted-foreground">Validation des changements de statut des médecins — RG-M1-02</p>
                </div>
                <Badge variant="secondary">{pending.length} en attente</Badge>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead>Médecin</TableHead><TableHead>Ancien statut</TableHead><TableHead className="w-8" /><TableHead>Nouveau statut</TableHead><TableHead>Motif</TableHead><TableHead>Demandé par</TableHead><TableHead>Date</TableHead><TableHead className="w-24">Action</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>{DEMO_STATUS_CHANGES.map(sc => (
                            <TableRow key={sc.id}>
                                <TableCell className="font-medium">Dr. {sc.doctor?.nom} {sc.doctor?.prenoms?.charAt(0)}.</TableCell>
                                <TableCell><StatusBadge status={sc.ancien_statut as DoctorStatus} size="sm" /></TableCell>
                                <TableCell><ArrowRight className="w-4 h-4 text-muted-foreground" /></TableCell>
                                <TableCell><StatusBadge status={sc.nouveau_statut as DoctorStatus} size="sm" /></TableCell>
                                <TableCell className="text-sm max-w-[200px] truncate">{sc.motif}</TableCell>
                                <TableCell className="text-sm">{sc.demandeur?.name}</TableCell>
                                <TableCell className="text-sm">{new Date(sc.created_at).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell>
                                    {sc.statut_demande === 'en_attente' ? (
                                        <Button size="sm" onClick={() => { setSelected(sc); setComment(""); }}>Examiner</Button>
                                    ) : (
                                        <Badge variant="outline" className="text-xs">{sc.statut_demande === 'valide' ? '✅ Validé' : '❌ Rejeté'}</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Status Change Lifecycle */}
            <Card><CardHeader><CardTitle className="text-base">Cycle de vie des statuts</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
                        {['Inscrit', 'Suspendu', 'Retraité', 'Radié', 'Décédé', 'Omis'].map((s, i, arr) => (
                            <span key={s} className="flex items-center gap-2">
                                <StatusBadge status={s as DoctorStatus} size="sm" />
                                {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Validation Dialog */}
            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>Valider le changement de statut</DialogTitle></DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                <p className="font-medium">Dr. {selected.doctor?.nom} {selected.doctor?.prenoms}</p>
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={selected.ancien_statut as DoctorStatus} size="sm" />
                                    <ArrowRight className="w-4 h-4" />
                                    <StatusBadge status={selected.nouveau_statut as DoctorStatus} size="sm" />
                                </div>
                                <p className="text-sm text-muted-foreground"><span className="font-medium">Motif :</span> {selected.motif}</p>
                                <p className="text-sm text-muted-foreground"><span className="font-medium">Demandé par :</span> {selected.demandeur?.name} ({selected.demandeur?.role})</p>
                            </div>
                            <Textarea placeholder="Commentaire du Président (optionnel)..." value={comment} onChange={e => setComment(e.target.value)} rows={3} />
                        </div>
                    )}
                    <DialogFooter className="flex gap-2">
                        <Button variant="destructive" onClick={() => setSelected(null)}><X className="w-4 h-4 mr-2" />Rejeter</Button>
                        <Button onClick={() => setSelected(null)}><Check className="w-4 h-4 mr-2" />Approuver</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StatutsPage;
