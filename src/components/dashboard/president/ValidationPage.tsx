import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckSquare, ArrowLeft, FileCheck, XCircle, RotateCcw, Send, Check, X, RefreshCw, ArrowRight } from "lucide-react";
import PriorityBadge from "@/components/dashboard/shared/PriorityBadge";
import { DEMO_VALIDATION_QUEUE, DEMO_PAST_DECISIONS } from "@/lib/demo-president-data";
import type { ValidationDossier } from "@/types/president";

const ETAPE_LABELS: Record<string, string> = { escalade_commission: "Escalade Commission", validation_renforcee: "Validation renforcée", arbitrage_sg: "Arbitrage SG/Comm." };
const TYPE_FLAGS: Record<string, string> = { national: "🇬🇦 National", etranger: "🌍 Étranger" };

const ValidationPage = () => {
    const [selected, setSelected] = useState<ValidationDossier | null>(null);
    const [decision, setDecision] = useState<string>("");
    const [comment, setComment] = useState("");

    if (selected) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => setSelected(null)} className="gap-2"><ArrowLeft className="w-4 h-4" />Retour à la file</Button>

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div><h2 className="text-xl font-bold">Examen — Dr. {selected.candidat_nom} {selected.candidat_prenoms}</h2><p className="text-sm text-muted-foreground">{selected.specialite} · {TYPE_FLAGS[selected.type]}</p></div>
                    <PriorityBadge priority={selected.priorite} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Candidate Info */}
                    <Card><CardHeader><CardTitle className="text-base">Informations du candidat</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div><p className="text-muted-foreground text-xs">Nom complet</p><p className="font-medium">Dr. {selected.candidat_nom} {selected.candidat_prenoms}</p></div>
                                <div><p className="text-muted-foreground text-xs">Nationalité 🔓</p><p className="font-medium">{selected.nationalite}</p></div>
                                <div><p className="text-muted-foreground text-xs">Date de naissance 🔓</p><p className="font-medium">{selected.date_naissance}</p></div>
                                <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{selected.email}</p></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Diplomas */}
                    <Card><CardHeader><CardTitle className="text-base">Diplômes & Qualifications</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div><p className="text-muted-foreground text-xs">Diplôme</p><p className="font-medium">{selected.diplome}</p></div>
                                <div><p className="text-muted-foreground text-xs">Université</p><p className="font-medium">{selected.universite}</p></div>
                                <div><p className="text-muted-foreground text-xs">Année</p><p className="font-medium">{selected.annee_diplome}</p></div>
                                <div><p className="text-muted-foreground text-xs">Vérification API</p>
                                    <Badge variant={selected.verification_api === 'verifie' ? 'default' : 'destructive'} className="text-xs">
                                        {selected.verification_api === 'verifie' ? '✅ Vérifié' : selected.verification_api === 'non_verifie' ? '⚠️ Non vérifié' : '❌ Rejeté'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pièces */}
                    <Card><CardHeader><CardTitle className="text-base">Pièces justificatives</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {selected.pieces_justificatives?.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                        <span className="text-sm">{p.nom}</span>
                                        <Badge variant={p.statut === 'conforme' ? 'default' : p.statut === 'en_attente' ? 'secondary' : 'destructive'} className="text-xs">
                                            {p.statut === 'conforme' ? '✅ Conforme' : p.statut === 'en_attente' ? '⏳ En attente' : '❌ Manquant'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Workflow Opinions */}
                    <Card><CardHeader><CardTitle className="text-base">Avis dans le workflow</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {selected.avis_agent && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground mb-1">Agent — {selected.avis_agent.date}</p><p className="text-sm">{selected.avis_agent.commentaire}</p><Badge variant="outline" className="mt-2 text-xs">{selected.avis_agent.decision}</Badge></div>}
                            {selected.avis_commission && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground mb-1">Commission — {selected.avis_commission.date}</p><p className="text-sm">{selected.avis_commission.commentaire}</p><Badge variant="outline" className="mt-2 text-xs">{selected.avis_commission.decision}</Badge></div>}
                            {selected.avis_sg && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground mb-1">Secrétaire Général — {selected.avis_sg.date}</p><p className="text-sm">{selected.avis_sg.commentaire}</p><Badge variant="outline" className="mt-2 text-xs">{selected.avis_sg.decision}</Badge></div>}
                            {selected.motif_escalade && <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800"><p className="text-xs font-medium text-amber-700 dark:text-amber-300">Motif d'escalade</p><p className="text-sm mt-1">{selected.motif_escalade}</p></div>}
                        </CardContent>
                    </Card>
                </div>

                {/* Payment */}
                {selected.paiement_inscription && (
                    <Card><CardContent className="p-4 flex items-center justify-between">
                        <div><p className="text-sm font-medium">Droits d'inscription</p><p className="text-xs text-muted-foreground">{selected.paiement_inscription.montant.toLocaleString()} FCFA · Réf: {selected.paiement_inscription.reference}</p></div>
                        <Badge variant={selected.paiement_inscription.statut === 'paye' ? 'default' : 'secondary'}>{selected.paiement_inscription.statut === 'paye' ? '✅ Payé' : '⏳ En attente'}</Badge>
                    </CardContent></Card>
                )}

                {/* Presidential Decision */}
                <Card className="border-2 border-primary/30">
                    <CardHeader><CardTitle className="flex items-center gap-2">🏛️ Décision Présidentielle</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup value={decision} onValueChange={setDecision} className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50"><RadioGroupItem value="valider" id="d1" /><Label htmlFor="d1" className="flex-1 cursor-pointer"><span className="font-medium">✅ Valider l'inscription</span><span className="block text-xs text-muted-foreground">Attribution automatique du N° Ordre</span></Label></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50"><RadioGroupItem value="rejeter" id="d2" /><Label htmlFor="d2" className="flex-1 cursor-pointer"><span className="font-medium">❌ Rejeter le dossier</span><span className="block text-xs text-muted-foreground">Motif obligatoire (RG-M2-04)</span></Label></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50"><RadioGroupItem value="complement" id="d3" /><Label htmlFor="d3" className="flex-1 cursor-pointer"><span className="font-medium">🔄 Demander des compléments</span></Label></div>
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50"><RadioGroupItem value="renvoi" id="d4" /><Label htmlFor="d4" className="flex-1 cursor-pointer"><span className="font-medium">↩️ Renvoyer à la Commission</span></Label></div>
                        </RadioGroup>
                        <Textarea placeholder="Commentaire / instructions..." value={comment} onChange={e => setComment(e.target.value)} rows={3} />
                        <Button className="w-full" disabled={!decision} onClick={() => setSelected(null)}>
                            <Send className="w-4 h-4 mr-2" />Soumettre la décision
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div><h2 className="text-xl font-bold text-foreground">Validation des dossiers</h2><p className="text-sm text-muted-foreground">File de validation présidentielle — Module M2</p></div>
                <Badge variant="secondary" className="text-sm">{DEMO_VALIDATION_QUEUE.length} dossiers en attente</Badge>
            </div>

            {/* Queue Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead>#</TableHead><TableHead>Candidat</TableHead><TableHead>Spécialité</TableHead><TableHead>Type</TableHead><TableHead>Soumis le</TableHead><TableHead>Étape</TableHead><TableHead>Priorité</TableHead><TableHead className="w-24">Action</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>{DEMO_VALIDATION_QUEUE.map((d, i) => (
                            <TableRow key={d.id}>
                                <TableCell>{i + 1}</TableCell><TableCell className="font-medium">Dr. {d.candidat_nom} {d.candidat_prenoms?.charAt(0)}.</TableCell>
                                <TableCell>{d.specialite}</TableCell><TableCell>{TYPE_FLAGS[d.type]}</TableCell><TableCell className="text-sm">{d.soumis_le}</TableCell>
                                <TableCell><Badge variant="outline" className="text-xs">{ETAPE_LABELS[d.etape_actuelle]}</Badge></TableCell>
                                <TableCell><PriorityBadge priority={d.priorite} /></TableCell>
                                <TableCell><Button size="sm" onClick={() => setSelected(d)}>Examiner</Button></TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Past Decisions */}
            <Card><CardHeader><CardTitle className="text-base">Décisions récentes</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {DEMO_PAST_DECISIONS.map(d => (
                            <div key={d.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                                <span>{d.type_decision.includes('validation') ? '✅' : '❌'}</span>
                                <div className="flex-1"><p className="text-sm font-medium">{d.candidat_nom}</p><p className="text-xs text-muted-foreground">{d.commentaire || d.type_decision} {d.numero_ordre ? `· N° Ordre ${d.numero_ordre}` : ''}</p></div>
                                <span className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ValidationPage;
