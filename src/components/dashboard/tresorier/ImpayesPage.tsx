import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { AlertTriangle, Search, Eye, Mail, Flag, X } from "lucide-react";
import { formatCFA, formatDateFR, getRetardBadgeVariant, cotisationStatusConfig } from "@/lib/finance-utils";
import { demoUnpaidDoctors } from "@/lib/demo-tresorier-data";
import type { DoctorFinancialView } from "@/types/tresorier";

const ImpayesPage = () => {
    const [search, setSearch] = useState("");
    const [filterRetard, setFilterRetard] = useState("all");
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorFinancialView | null>(null);

    const filtered = demoUnpaidDoctors.filter((d) => {
        const matchSearch = `${d.nom} ${d.prenoms} ${d.numero_ordre}`.toLowerCase().includes(search.toLowerCase());
        const matchRetard = filterRetard === "all" ||
            (filterRetard === "leger" && d.retard_mois <= 3) ||
            (filterRetard === "moyen" && d.retard_mois > 3 && d.retard_mois <= 6) ||
            (filterRetard === "grave" && d.retard_mois > 6 && d.retard_mois <= 12) ||
            (filterRetard === "critique" && d.retard_mois > 12);
        return matchSearch && matchRetard;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Gestion des impayés
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {demoUnpaidDoctors.length} médecins en situation d'impayé — Total : {formatCFA(demoUnpaidDoctors.reduce((s, d) => s + d.montant_du, 0))}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Exporter CSV</Button>
                    <Button variant="destructive" size="sm">
                        <Flag className="w-4 h-4 mr-1" />
                        Signaler au Bureau
                    </Button>
                </div>
            </div>

            {/* Segmentation summary */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "1-3 mois", count: demoUnpaidDoctors.filter(d => d.retard_mois <= 3).length, color: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800", textColor: "text-yellow-700 dark:text-yellow-400" },
                    { label: "3-6 mois", count: demoUnpaidDoctors.filter(d => d.retard_mois > 3 && d.retard_mois <= 6).length, color: "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800", textColor: "text-orange-700 dark:text-orange-400" },
                    { label: "6-12 mois", count: demoUnpaidDoctors.filter(d => d.retard_mois > 6 && d.retard_mois <= 12).length, color: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800", textColor: "text-red-600" },
                    { label: "> 12 mois", count: demoUnpaidDoctors.filter(d => d.retard_mois > 12).length, color: "bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-700", textColor: "text-red-700 dark:text-red-400" },
                ].map((seg) => (
                    <div key={seg.label} className={`p-3 rounded-lg border ${seg.color} text-center`}>
                        <p className={`text-2xl font-bold ${seg.textColor}`}>{seg.count}</p>
                        <p className="text-xs text-muted-foreground">{seg.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un médecin..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterRetard} onValueChange={setFilterRetard}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Retard" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les retards</SelectItem>
                        <SelectItem value="leger">1-3 mois</SelectItem>
                        <SelectItem value="moyen">3-6 mois</SelectItem>
                        <SelectItem value="grave">6-12 mois</SelectItem>
                        <SelectItem value="critique">&gt; 12 mois</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>N° Ordre</TableHead>
                                <TableHead>Médecin</TableHead>
                                <TableHead>Spécialité</TableHead>
                                <TableHead>Province</TableHead>
                                <TableHead className="text-center">Retard</TableHead>
                                <TableHead className="text-center">Relance</TableHead>
                                <TableHead className="text-right">Montant dû</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-mono text-xs">{doc.numero_ordre}</TableCell>
                                    <TableCell className="font-medium">Dr {doc.nom} {doc.prenoms}</TableCell>
                                    <TableCell className="text-sm">{doc.specialite}</TableCell>
                                    <TableCell className="text-sm">{doc.province}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRetardBadgeVariant(doc.retard_mois)}`}>
                                            {doc.retard_mois} mois
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="text-xs">{doc.niveau_relance}/5</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-red-600">{formatCFA(doc.montant_du)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedDoctor(doc)}>
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <Mail className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        Aucun résultat pour les filtres sélectionnés
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail modal */}
            <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Fiche impayé — Dr {selectedDoctor?.nom} {selectedDoctor?.prenoms}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedDoctor && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">N° Ordre</p>
                                    <p className="font-medium">{selectedDoctor.numero_ordre}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Spécialité</p>
                                    <p className="font-medium">{selectedDoctor.specialite}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Province</p>
                                    <p className="font-medium">{selectedDoctor.province}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Secteur</p>
                                    <p className="font-medium capitalize">{selectedDoctor.secteur}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Dernier paiement</p>
                                    <p className="font-medium">{selectedDoctor.dernier_paiement ? formatDateFR(selectedDoctor.dernier_paiement) : '—'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Niveau de relance</p>
                                    <p className="font-medium">{selectedDoctor.niveau_relance}/5</p>
                                </div>
                            </div>

                            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Montant total dû</p>
                                        <p className="text-2xl font-bold text-red-600">{formatCFA(selectedDoctor.montant_du)}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRetardBadgeVariant(selectedDoctor.retard_mois)}`}>
                                        {selectedDoctor.retard_mois} mois de retard
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" className="flex-1">
                                    <Mail className="w-4 h-4 mr-1" />
                                    Envoyer relance
                                </Button>
                                <Button variant="destructive" size="sm" className="flex-1">
                                    <Flag className="w-4 h-4 mr-1" />
                                    Signaler au Bureau
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImpayesPage;
