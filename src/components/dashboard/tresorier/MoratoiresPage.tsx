import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Clock, PlusCircle, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import { formatDateFR } from "@/lib/finance-utils";
import { demoMoratoriums } from "@/lib/demo-tresorier-data";

const motifLabels: Record<string, string> = {
    nouveau_diplome: "Nouveau diplôme",
    cas_social: "Cas social",
    prolongation_exceptionnelle: "Prolongation exceptionnelle",
};

const statutConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    actif: { label: "Actif", color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
    expire: { label: "Expiré", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
    annule: { label: "Annulé", color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-900/30" },
};

const MoratoiresPage = () => {
    // Compute expiring soon
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const expiringSoon = demoMoratoriums.filter(m => {
        const end = new Date(m.date_fin);
        return m.statut === 'actif' && end.getTime() - now.getTime() < thirtyDays && end.getTime() > now.getTime();
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Gestion des moratoires
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Dispenses et délais de paiement exceptionnels
                    </p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Nouveau moratoire
                </Button>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 text-center">
                        <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                        <p className="text-2xl font-bold text-foreground">
                            {demoMoratoriums.filter(m => m.statut === 'actif').length}
                        </p>
                        <p className="text-xs text-muted-foreground">Moratoires actifs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <AlertTriangle className="w-6 h-6 mx-auto text-amber-500 mb-1" />
                        <p className="text-2xl font-bold text-foreground">{expiringSoon.length}</p>
                        <p className="text-xs text-muted-foreground">Expire dans 30 jours</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Calendar className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                        <p className="text-2xl font-bold text-foreground">
                            {demoMoratoriums.reduce((s, m) => s + m.duree_mois, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Mois cumulés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Expiring soon alert */}
            {expiringSoon.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Moratoires expirant bientôt
                    </p>
                    <div className="space-y-2">
                        {expiringSoon.map((m) => (
                            <div key={m.id} className="flex items-center justify-between text-sm">
                                <span className="text-foreground">
                                    Dr {m.doctor?.nom} {m.doctor?.prenoms} — expire le {formatDateFR(m.date_fin)}
                                </span>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                    Prolonger
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Tous les moratoires</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Médecin</TableHead>
                                <TableHead>Motif</TableHead>
                                <TableHead>Début</TableHead>
                                <TableHead>Fin</TableHead>
                                <TableHead className="text-center">Durée</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead>Approuvé par</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {demoMoratoriums.map((m) => {
                                const sConf = statutConfig[m.statut];
                                return (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium text-sm">
                                            Dr {m.doctor?.nom} {m.doctor?.prenoms}
                                            <br />
                                            <span className="text-[10px] text-muted-foreground">N° {m.doctor?.numero_ordre}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {motifLabels[m.motif] || m.motif}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{formatDateFR(m.date_debut)}</TableCell>
                                        <TableCell className="text-sm">{formatDateFR(m.date_fin)}</TableCell>
                                        <TableCell className="text-center">{m.duree_mois} mois</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sConf.bgColor} ${sConf.color}`}>
                                                {sConf.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{m.approuve_par || '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="outline" size="sm" className="h-7 text-xs">Prolonger</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MoratoiresPage;
