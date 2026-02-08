import { useState } from "react";
import { CreditCard, CheckCircle, Clock, AlertTriangle, Download, FileText, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Payment, PaymentMethod, Periodicite } from "@/types/medecin";
import { formatFCFA, formatDateFR, paymentTypeLabels, paymentMethodLabels, periodiciteOptions } from "@/lib/payment-utils";
import { paymentStatusLabels } from "@/lib/status-utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MesPaiementsProps {
    payments: Payment[];
    doctorStatut: string;
    periodiciteActuelle?: Periodicite;
}

const MesPaiements = ({ payments, doctorStatut, periodiciteActuelle = "semestriel" }: MesPaiementsProps) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "">("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [filterYear, setFilterYear] = useState<string>("all");
    const { toast } = useToast();

    const confirmedPayments = payments.filter(p => p.statut === "confirme");
    const pendingPayments = payments.filter(p => p.statut === "en_attente");
    const totalPaid = confirmedPayments.reduce((sum, p) => sum + p.montant, 0);
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.montant, 0);

    const currentPeriodicite = periodiciteOptions.find(p => p.id === periodiciteActuelle)!;
    const isAJour = doctorStatut === "Inscrit";

    const filteredPayments = filterYear === "all"
        ? payments
        : payments.filter(p => new Date(p.created_at).getFullYear().toString() === filterYear);

    const years = [...new Set(payments.map(p => new Date(p.created_at).getFullYear()))].sort((a, b) => b - a);

    const handlePayment = () => {
        setPaymentStep(3);
        toast({
            title: "Paiement simulé",
            description: "En mode démo, le paiement est simulé avec succès.",
        });
    };

    const resetModal = () => {
        setShowPaymentModal(false);
        setPaymentStep(1);
        setSelectedMethod("");
        setPhoneNumber("");
    };

    return (
        <div className="space-y-6">
            {/* Financial Summary */}
            <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                💰 Situation Financière
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p>Cotisation annuelle : <strong>{formatFCFA(120000)}</strong> (10 000 FCFA/mois)</p>
                                <p>Périodicité choisie : <strong>{currentPeriodicite.label}</strong></p>
                                <p>Prochain paiement : <strong>30/06/2026</strong> — <strong>{formatFCFA(currentPeriodicite.montant)}</strong></p>
                                <p className="flex items-center gap-1.5">
                                    Statut :
                                    {isAJour ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                                            <CheckCircle className="w-4 h-4" /> À jour
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                            <AlertTriangle className="w-4 h-4" /> Retard
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <Button onClick={() => setShowPaymentModal(true)} className="gap-2 self-start">
                            <CreditCard className="w-4 h-4" />
                            Payer maintenant
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Periodicity Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Options de périodicité</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {periodiciteOptions.map((option) => (
                            <div
                                key={option.id}
                                className={cn(
                                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    option.id === periodiciteActuelle
                                        ? "border-primary bg-primary/5"
                                        : "border-muted hover:border-primary/30"
                                )}
                            >
                                <p className="font-semibold">{option.label}</p>
                                <p className="text-lg font-bold text-primary mt-1">{formatFCFA(option.montant)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{option.echeances}</p>
                                {option.id === periodiciteActuelle && (
                                    <Badge variant="outline" className="mt-2 text-xs">Actuel</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total payé</p>
                                <p className="text-2xl font-bold">{formatFCFA(totalPaid)}</p>
                            </div>
                            <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">En attente</p>
                                <p className="text-2xl font-bold">{formatFCFA(totalPending)}</p>
                            </div>
                            <div className="w-11 h-11 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Transactions</p>
                                <p className="text-2xl font-bold">{payments.length}</p>
                            </div>
                            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Historique des paiements</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={filterYear} onValueChange={setFilterYear}>
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue placeholder="Filtrer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes</SelectItem>
                                {years.map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredPayments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Aucun paiement pour cette période</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Montant</TableHead>
                                        <TableHead>Moyen</TableHead>
                                        <TableHead>Référence</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Reçu</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map((payment) => {
                                        const statusInfo = paymentStatusLabels[payment.statut];
                                        return (
                                            <TableRow key={payment.id}>
                                                <TableCell className="text-sm whitespace-nowrap">
                                                    {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                                                </TableCell>
                                                <TableCell className="text-sm">{paymentTypeLabels[payment.type]}</TableCell>
                                                <TableCell className="text-sm font-medium">{formatFCFA(payment.montant)}</TableCell>
                                                <TableCell className="text-sm">
                                                    {paymentMethodLabels[payment.moyen_paiement]?.label || payment.moyen_paiement}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">{payment.reference_transaction}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {payment.statut === "confirme" && (
                                                        <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                                                            <Download className="w-3 h-3" /> PDF
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Modal */}
            <Dialog open={showPaymentModal} onOpenChange={resetModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {paymentStep === 1 && "Récapitulatif du paiement"}
                            {paymentStep === 2 && "Moyen de paiement"}
                            {paymentStep === 3 && "Confirmation"}
                        </DialogTitle>
                        <DialogDescription>
                            {paymentStep === 1 && "Vérifiez les détails avant de procéder"}
                            {paymentStep === 2 && "Choisissez votre moyen de paiement"}
                            {paymentStep === 3 && "Votre paiement a été traité"}
                        </DialogDescription>
                    </DialogHeader>

                    {paymentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium">Cotisation {currentPeriodicite.label.toLowerCase()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Montant</span>
                                    <span className="font-bold text-lg">{formatFCFA(currentPeriodicite.montant)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Période</span>
                                    <span>Janv. — Juin 2026</span>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => setPaymentStep(2)}>
                                Continuer
                            </Button>
                        </div>
                    )}

                    {paymentStep === 2 && (
                        <div className="space-y-4">
                            <RadioGroup
                                value={selectedMethod}
                                onValueChange={(v) => setSelectedMethod(v as PaymentMethod)}
                                className="space-y-3"
                            >
                                {Object.entries(paymentMethodLabels).map(([key, method]) => (
                                    <div key={key} className={cn(
                                        "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                        selectedMethod === key ? "border-primary bg-primary/5" : "border-muted"
                                    )}>
                                        <RadioGroupItem value={key} id={key} />
                                        <Label htmlFor={key} className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{method.icon}</span>
                                                <div>
                                                    <p className="font-medium">{method.label}</p>
                                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            {(selectedMethod === "airtel_money" || selectedMethod === "moov_money") && (
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Numéro de téléphone</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+241 XX XX XX XX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setPaymentStep(1)} className="flex-1">
                                    Retour
                                </Button>
                                <Button
                                    onClick={handlePayment}
                                    disabled={!selectedMethod}
                                    className="flex-1"
                                >
                                    Payer {formatFCFA(currentPeriodicite.montant)}
                                </Button>
                            </div>
                        </div>
                    )}

                    {paymentStep === 3 && (
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Paiement confirmé !</p>
                                <p className="text-sm text-muted-foreground mt-1">Transaction: TXN-2026-DEMO</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 gap-2">
                                    <Download className="w-4 h-4" />
                                    Télécharger le reçu
                                </Button>
                                <Button onClick={resetModal} className="flex-1">
                                    Terminé
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MesPaiements;
