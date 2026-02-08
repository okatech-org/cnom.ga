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
import { History, Search, Eye, Download, X, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { formatCFA, formatDateTimeFR, paymentTypeLabels, paymentMethodLabels, paymentStatusConfig } from "@/lib/finance-utils";
import { demoRecentPayments } from "@/lib/demo-tresorier-data";
import type { TresorierPayment } from "@/types/tresorier";

const HistoriquePaiements = () => {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState<TresorierPayment | null>(null);

    const filtered = demoRecentPayments.filter((p) => {
        const matchSearch = `${p.doctor?.nom || ''} ${p.doctor?.prenoms || ''} ${p.transaction_ref || ''}`.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || p.payment_status === filterStatus;
        const matchType = filterType === "all" || p.payment_type === filterType;
        return matchSearch && matchStatus && matchType;
    });

    const totalAmount = filtered.reduce((s, p) => s + p.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <History className="w-5 h-5 text-blue-500" />
                        Historique des paiements
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Transactions financières — Exercice 2026
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Exporter CSV
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par nom ou référence..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous statuts</SelectItem>
                        <SelectItem value="confirmed">Confirmé</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="failed">Échoué</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous types</SelectItem>
                        <SelectItem value="cotisation_semestrielle">Cotisation semestrielle</SelectItem>
                        <SelectItem value="cotisation_annuelle">Cotisation annuelle</SelectItem>
                        <SelectItem value="cotisation_mensuelle">Cotisation mensuelle</SelectItem>
                        <SelectItem value="inscription">Inscription</SelectItem>
                        <SelectItem value="regularisation">Régularisation</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead>Médecin</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Méthode</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((p) => {
                                const statusConf = paymentStatusConfig[p.payment_status];
                                return (
                                    <TableRow key={p.id}>
                                        <TableCell className="text-xs">{formatDateTimeFR(p.created_at)}</TableCell>
                                        <TableCell className="font-mono text-xs">{p.transaction_ref || '—'}</TableCell>
                                        <TableCell className="font-medium text-sm">
                                            Dr {p.doctor?.nom} {p.doctor?.prenoms}
                                        </TableCell>
                                        <TableCell className="text-xs">{paymentTypeLabels[p.payment_type]}</TableCell>
                                        <TableCell className="text-xs">{p.payment_method ? paymentMethodLabels[p.payment_method] : '—'}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.bgColor} ${statusConf.color}`}>
                                                {statusConf.icon} {statusConf.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-sm">{formatCFA(p.amount)}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedPayment(p)}>
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>

                {/* Summary row */}
                <div className="px-4 py-3 bg-muted/50 border-t flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{filtered.length} transaction(s)</span>
                    <span className="font-bold text-foreground">Total : {formatCFA(totalAmount)}</span>
                </div>
            </Card>

            {/* Detail modal */}
            <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Détail du paiement</DialogTitle>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Référence</p>
                                    <p className="font-mono font-medium">{selectedPayment.transaction_ref || selectedPayment.id}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Statut</p>
                                    <p className={`font-medium ${paymentStatusConfig[selectedPayment.payment_status].color}`}>
                                        {paymentStatusConfig[selectedPayment.payment_status].icon} {paymentStatusConfig[selectedPayment.payment_status].label}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Médecin</p>
                                    <p className="font-medium">Dr {selectedPayment.doctor?.nom} {selectedPayment.doctor?.prenoms}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">N° Ordre</p>
                                    <p className="font-medium">{selectedPayment.doctor?.numero_ordre}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Type</p>
                                    <p className="font-medium">{paymentTypeLabels[selectedPayment.payment_type]}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Méthode</p>
                                    <p className="font-medium">{selectedPayment.payment_method ? paymentMethodLabels[selectedPayment.payment_method] : '—'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Montant</p>
                                    <p className="text-lg font-bold text-foreground">{formatCFA(selectedPayment.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="font-medium">{formatDateTimeFR(selectedPayment.created_at)}</p>
                                </div>
                                {selectedPayment.penalite_amount > 0 && (
                                    <div>
                                        <p className="text-muted-foreground">Pénalité incluse</p>
                                        <p className="font-medium text-red-600">{formatCFA(selectedPayment.penalite_amount)}</p>
                                    </div>
                                )}
                                {selectedPayment.receipt_number && (
                                    <div>
                                        <p className="text-muted-foreground">N° Reçu</p>
                                        <p className="font-mono font-medium">{selectedPayment.receipt_number}</p>
                                    </div>
                                )}
                            </div>
                            {selectedPayment.is_manual && selectedPayment.manual_justification && (
                                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">Saisie manuelle</p>
                                    <p className="text-sm text-foreground">{selectedPayment.manual_justification}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HistoriquePaiements;
