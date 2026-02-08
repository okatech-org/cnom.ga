import { useState } from "react";
import { FileText, Download, Plus, Clock, CheckCircle, FileCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { DocumentRequest, DocumentRequestType } from "@/types/medecin";
import { documentRequestStatusLabels } from "@/lib/status-utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MesDocumentsProps {
    requests: DocumentRequest[];
    doctorStatut: string;
    cotisationAJour: boolean;
}

const DOCUMENT_CATALOGUE = [
    {
        type: "attestation_inscription" as DocumentRequestType,
        label: "Attestation d'inscription",
        description: "Certifie l'inscription au Tableau de l'Ordre",
        condition: "Si statut \"Inscrit\"",
        format: "PDF",
        requiresValidation: false,
    },
    {
        type: "attestation_bonne_conduite" as DocumentRequestType,
        label: "Attestation de bonne conduite",
        description: "Certifie l'absence de sanctions disciplinaires",
        condition: "Si aucun historique",
        format: "PDF",
        requiresValidation: true,
    },
    {
        type: "caducee_numerique" as DocumentRequestType,
        label: "Caducée numérique",
        description: "Version numérique officielle du caducée",
        condition: "Inscrit + cotisation à jour",
        format: "PDF/Image",
        requiresValidation: false,
    },
    {
        type: "attestation_fiscale" as DocumentRequestType,
        label: "Attestation fiscale annuelle",
        description: "Récapitulatif des cotisations payées dans l'année",
        condition: "En fin d'année",
        format: "PDF",
        requiresValidation: false,
    },
];

const documentTypeLabels: Record<DocumentRequestType, string> = {
    attestation_inscription: "Attestation d'inscription",
    attestation_bonne_conduite: "Attestation de bonne conduite",
    caducee_numerique: "Caducée numérique",
    attestation_fiscale: "Attestation fiscale annuelle",
};

const MesDocuments = ({ requests, doctorStatut, cotisationAJour }: MesDocumentsProps) => {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedType, setSelectedType] = useState<DocumentRequestType | "">("");
    const [motif, setMotif] = useState("");
    const { toast } = useToast();

    const isInscrit = doctorStatut === "Inscrit";

    const handleSubmitRequest = () => {
        toast({
            title: "Demande soumise",
            description: "Votre demande de document a été envoyée. Vous serez notifié de sa disponibilité.",
        });
        setShowRequestModal(false);
        setSelectedType("");
        setMotif("");
    };

    return (
        <div className="space-y-6">
            {/* Document Catalogue */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Documents disponibles</CardTitle>
                    <Button onClick={() => setShowRequestModal(true)} size="sm" className="gap-1.5">
                        <Plus className="w-4 h-4" />
                        Demander un document
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {DOCUMENT_CATALOGUE.map((doc) => {
                            const isAvailable = doc.type === "attestation_inscription"
                                ? isInscrit
                                : doc.type === "caducee_numerique"
                                    ? isInscrit && cotisationAJour
                                    : true;

                            return (
                                <div
                                    key={doc.type}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all",
                                        isAvailable ? "border-border hover:border-primary/30" : "border-border opacity-60"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileCheck className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{doc.label}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Format: {doc.format}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{doc.condition}</span>
                                        {isAvailable && !doc.requiresValidation && (
                                            <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                                                <Download className="w-3 h-3" />
                                                Télécharger
                                            </Button>
                                        )}
                                        {isAvailable && doc.requiresValidation && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1 text-xs h-7"
                                                onClick={() => {
                                                    setSelectedType(doc.type);
                                                    setShowRequestModal(true);
                                                }}
                                            >
                                                <Plus className="w-3 h-3" />
                                                Demander
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Request History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Historique des demandes</CardTitle>
                </CardHeader>
                <CardContent>
                    {requests.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Aucune demande de document</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date demande</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Date génération</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((req) => {
                                        const statusInfo = documentRequestStatusLabels[req.statut];
                                        return (
                                            <TableRow key={req.id}>
                                                <TableCell className="text-sm">
                                                    {new Date(req.created_at).toLocaleDateString("fr-FR")}
                                                </TableCell>
                                                <TableCell className="text-sm">{documentTypeLabels[req.type]}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {req.processed_at
                                                        ? new Date(req.processed_at).toLocaleDateString("fr-FR")
                                                        : "—"}
                                                </TableCell>
                                                <TableCell>
                                                    {req.statut === "disponible" && (
                                                        <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                                                            <Download className="w-3 h-3" /> Télécharger
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

            {/* Request Modal */}
            <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Demander un document officiel</DialogTitle>
                        <DialogDescription>Sélectionnez le type de document et soumettez votre demande</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Type de document</Label>
                            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as DocumentRequestType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DOCUMENT_CATALOGUE.map(doc => (
                                        <SelectItem key={doc.type} value={doc.type}>{doc.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Motif de la demande <span className="text-muted-foreground">(optionnel)</span></Label>
                            <Textarea
                                placeholder="Précisez le motif de votre demande..."
                                value={motif}
                                onChange={(e) => setMotif(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <Button
                            onClick={handleSubmitRequest}
                            disabled={!selectedType}
                            className="w-full"
                        >
                            Soumettre la demande
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MesDocuments;
