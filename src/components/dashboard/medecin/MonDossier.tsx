import { CheckCircle, Clock, FileText, Upload, Download, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Application, DossierDocument } from "@/types/medecin";
import { docVerifStatusLabels } from "@/lib/status-utils";
import { cn } from "@/lib/utils";

interface MonDossierProps {
    application: Application | null;
    documents: DossierDocument[];
    doctorName: string;
    doctorPrenoms: string;
}

// Step definitions
const STEPS = [
    { label: "Création", shortLabel: "1" },
    { label: "Informations", shortLabel: "2" },
    { label: "Diplômes", shortLabel: "3" },
    { label: "Justificatifs", shortLabel: "4" },
    { label: "Paiement", shortLabel: "5" },
    { label: "Validation", shortLabel: "6" },
];

const DossierStepper = ({ currentStep, totalSteps, status }: { currentStep: number; totalSteps: number; status: string }) => {
    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex items-center min-w-[500px]">
                {STEPS.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    const isRejected = status === "rejected";

                    return (
                        <div key={index} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-1.5">
                                <div className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                                    isCompleted && "bg-emerald-500 text-white",
                                    isCurrent && !isRejected && "bg-primary text-primary-foreground animate-pulse",
                                    isCurrent && isRejected && "bg-red-500 text-white",
                                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                                )}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.shortLabel}
                                </div>
                                <span className={cn(
                                    "text-[10px] sm:text-xs font-medium text-center whitespace-nowrap",
                                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-0.5 mx-1",
                                    stepNum < currentStep ? "bg-emerald-500" : "bg-muted"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MonDossier = ({ application, documents, doctorName, doctorPrenoms }: MonDossierProps) => {
    const currentStep = application?.step_current || 1;
    const totalSteps = application?.step_total || 6;
    const status = application?.status || "draft";
    const isValidated = status === "validated";

    return (
        <div className="space-y-6">
            {/* Stepper */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Progression du dossier</CardTitle>
                </CardHeader>
                <CardContent>
                    <DossierStepper currentStep={currentStep} totalSteps={totalSteps} status={status} />
                </CardContent>
            </Card>

            {/* Dossier Recap */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Récapitulatif du dossier
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Identity Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Identité</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Nom</p>
                                <p className="font-medium">{doctorName}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Prénoms</p>
                                <p className="font-medium">{doctorPrenoms}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Diplomas Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Diplômes & Qualifications</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Diplôme principal</p>
                                <p className="font-medium">Doctorat en Médecine</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Université & Année</p>
                                <p className="font-medium">USS — 2018</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Documents Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pièces justificatives</h4>
                        <div className="space-y-2">
                            {documents.map((doc) => {
                                const verifStatus = docVerifStatusLabels[doc.statut_verification];
                                return (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium capitalize">{doc.type.replace(/_/g, " ")}</p>
                                                <p className="text-xs text-muted-foreground truncate">{doc.nom_fichier}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm flex-shrink-0">{verifStatus.icon} {verifStatus.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Payment Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Paiement des droits d'inscription</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Montant</p>
                                <p className="font-medium">50 000 FCFA</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Statut</p>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    Payé ✅
                                </Badge>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Référence</p>
                                <p className="font-medium font-mono text-xs">TXN-2019-0001</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rejection Notice */}
            {application?.motif_rejet && (
                <Card className="border-red-200 dark:border-red-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-800 dark:text-red-200">Motif du rejet</p>
                                <p className="text-sm text-red-600 dark:text-red-300 mt-1">{application.motif_rejet}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="mt-4 gap-2">
                            <Upload className="w-4 h-4" />
                            Soumettre un dossier corrigé
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Validated notice + N° Ordre */}
            {isValidated && (
                <Card className="border-emerald-200 dark:border-emerald-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-emerald-800 dark:text-emerald-200">Dossier validé</p>
                                <p className="text-sm text-emerald-600 dark:text-emerald-300">
                                    Numéro d'Ordre attribué : <strong>{application?.numero_ordre_attribue}</strong>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger le récapitulatif
                </Button>
            </div>
        </div>
    );
};

export default MonDossier;
