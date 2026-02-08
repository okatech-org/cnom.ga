import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { PenSquare, Search, CheckCircle2, AlertTriangle, Upload, User } from "lucide-react";
import { formatCFA, formatDateTimeFR, paymentTypeLabels, paymentMethodLabels } from "@/lib/finance-utils";

const pendingSaisies = [
    { id: 'SM-001', doctor: 'Dr ELLA MBA Josiane', type: 'cotisation_semestrielle' as const, amount: 60_000, method: 'especes' as const, date: '2026-02-08T09:00:00', status: 'en_verification' },
    { id: 'SM-002', doctor: 'Dr ZOGO Fernand', type: 'regularisation' as const, amount: 80_000, method: 'virement_bancaire' as const, date: '2026-02-07T14:30:00', status: 'en_verification' },
];

const SaisieManuelle = () => {
    const [form, setForm] = useState({
        doctorSearch: '',
        doctorSelected: '',
        type: '',
        amount: '',
        method: '',
        reference: '',
        justification: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <PenSquare className="w-5 h-5 text-amber-600" />
                    Saisie manuelle de paiement
                </h2>
                <p className="text-sm text-muted-foreground">
                    Enregistrement des paiements reçus hors plateforme (espèces, virements manuels)
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Nouveau paiement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Doctor search */}
                            <div className="space-y-2">
                                <Label>Médecin</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher par nom ou N° d'ordre..."
                                        value={form.doctorSearch}
                                        onChange={(e) => setForm({ ...form, doctorSearch: e.target.value })}
                                        className="pl-10"
                                    />
                                </div>
                                {form.doctorSearch.length > 2 && (
                                    <div className="bg-muted/50 rounded-lg p-2 space-y-1 border">
                                        <button
                                            type="button"
                                            className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"
                                            onClick={() => setForm({ ...form, doctorSearch: 'Dr ELLA MBA Josiane (N° 1412)', doctorSelected: 'D-1412' })}
                                        >
                                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>Dr ELLA MBA Josiane — N° 1412 — Gynéco-Obstétrique</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"
                                            onClick={() => setForm({ ...form, doctorSearch: 'Dr ZOGO Fernand (N° 1389)', doctorSelected: 'D-1389' })}
                                        >
                                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>Dr ZOGO Fernand — N° 1389 — Médecine Générale</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Payment type */}
                            <div className="space-y-2">
                                <Label>Type de paiement</Label>
                                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(paymentTypeLabels).map(([k, v]) => (
                                            <SelectItem key={k} value={k}>{v}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label>Montant (FCFA)</Label>
                                <Input
                                    type="number"
                                    placeholder="60 000"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                />
                                {form.amount && Number(form.amount) > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        = {formatCFA(Number(form.amount))}
                                    </p>
                                )}
                            </div>

                            {/* Method */}
                            <div className="space-y-2">
                                <Label>Méthode de paiement</Label>
                                <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner la méthode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="especes">Espèces</SelectItem>
                                        <SelectItem value="virement_bancaire">Virement bancaire</SelectItem>
                                        <SelectItem value="carte_bancaire">Carte bancaire</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reference */}
                            <div className="space-y-2">
                                <Label>Référence externe (optionnel)</Label>
                                <Input
                                    placeholder="N° de reçu, réf. virement..."
                                    value={form.reference}
                                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                                />
                            </div>

                            {/* Justification */}
                            <div className="space-y-2">
                                <Label>Justification *</Label>
                                <Textarea
                                    placeholder="Motif de la saisie manuelle..."
                                    value={form.justification}
                                    onChange={(e) => setForm({ ...form, justification: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {/* Attachment */}
                            <div className="space-y-2">
                                <Label>Pièce justificative</Label>
                                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-amber-400 transition-colors cursor-pointer">
                                    <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Cliquer ou déposer un fichier (PDF, image)</p>
                                </div>
                            </div>

                            {/* Validation warnings */}
                            {form.amount && Number(form.amount) > 150_000 && (
                                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2 border border-amber-200 dark:border-amber-800">
                                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                    Montant inhabituellement élevé — veuillez vérifier
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={!form.doctorSelected || !form.type || !form.amount || !form.justification}>
                                Enregistrer le paiement
                            </Button>

                            {submitted && (
                                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Paiement enregistré avec succès — en attente de vérification
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Pending queue */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            Saisies en vérification
                            <Badge variant="secondary">{pendingSaisies.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingSaisies.map((s) => (
                                <div key={s.id} className="p-3 bg-amber-50 dark:bg-amber-950/10 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-foreground">{s.doctor}</p>
                                        <Badge variant="outline" className="text-[10px]">En vérification</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{paymentTypeLabels[s.type]}</span>
                                        <span className="font-medium text-foreground">{formatCFA(s.amount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                        <span>{paymentMethodLabels[s.method]}</span>
                                        <span>{formatDateTimeFR(s.date)}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button variant="default" size="sm" className="flex-1 h-7 text-xs bg-emerald-600 hover:bg-emerald-700">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Valider
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs text-red-600">
                                            Rejeter
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SaisieManuelle;
