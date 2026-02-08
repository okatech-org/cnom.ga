import { Shield, Download, Share2, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ECPSCard from "@/components/ECPSCard";
import QRCodeDynamic from "./QRCodeDynamic";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import type { Doctor, Verification } from "@/types/medecin";
import { formatDateFR, formatRelativeDate } from "@/lib/payment-utils";
import { cn } from "@/lib/utils";

interface CarteECPSProps {
    doctor: Doctor;
    verifications: Verification[];
    photoUrl?: string;
}

const CarteECPS = ({ doctor, verifications, photoUrl }: CarteECPSProps) => {
    const isActive = doctor.statut === "Inscrit";
    const isSuspended = doctor.statut === "Suspendu" || doctor.statut === "Radié";

    if (!isActive && !isSuspended) {
        return (
            <Card>
                <CardContent className="py-12">
                    <EmptyState
                        icon={Shield}
                        title="Carte e-CPS non disponible"
                        description="Votre carte professionnelle virtuelle sera disponible une fois votre dossier validé et votre cotisation payée."
                    />
                    <div className="flex justify-center mt-4">
                        <StatusBadge status={doctor.statut} />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const qrStatus = isSuspended
        ? (doctor.statut === "Radié" ? "radie" : "suspendu")
        : "active";

    const verifResultLabels: Record<string, { label: string; color: string }> = {
        inscrit: { label: "Vérifié ✅", color: "text-emerald-600" },
        cotisation_retard: { label: "Retard cotisation ⚠️", color: "text-amber-600" },
        suspendu: { label: "Suspendu ❌", color: "text-red-600" },
        radie: { label: "Radié ⛔", color: "text-red-800" },
    };

    return (
        <div className="space-y-6">
            {/* CPS Card + QR side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Carte Visuelle */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                Carte Professionnelle Virtuelle
                            </CardTitle>
                            <CardDescription>Cliquez sur la carte pour voir le verso</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ECPSCard
                                doctorName={doctor.nom}
                                firstName={doctor.prenoms}
                                specialty={doctor.specialite_principale}
                                orderNumber={String(doctor.numero_ordre)}
                                province={doctor.province}
                                city={doctor.ville_exercice}
                                status={isActive ? "active" : "suspended"}
                                validUntil="Tant que le statut est actif"
                                fonction={doctor.fonctions_ordinales || "MEMBRE"}
                                photoUrl={photoUrl}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* QR Code Dynamic */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-base">QR Code Dynamique</CardTitle>
                            <CardDescription className="text-xs">Renouvelé automatiquement toutes les 60 secondes</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <QRCodeDynamic
                                doctorId={doctor.id}
                                status={qrStatus as "active" | "retard" | "suspendu" | "radie"}
                            />
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="outline" className={cn(
                                    "text-xs",
                                    isActive ? "border-emerald-300 text-emerald-700 bg-emerald-50" : "border-red-300 text-red-700 bg-red-50"
                                )}>
                                    {isActive ? "● INSCRIT" : `● ${doctor.statut.toUpperCase()}`}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Actions */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Télécharger en PDF
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Partager
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Verification History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <History className="w-4 h-4" />
                        Historique des vérifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {verifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">Aucune vérification enregistrée</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date & Heure</TableHead>
                                        <TableHead>Localisation approx.</TableHead>
                                        <TableHead>Résultat</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {verifications.map((v) => {
                                        const result = verifResultLabels[v.resultat] || { label: v.resultat, color: "text-gray-600" };
                                        return (
                                            <TableRow key={v.id}>
                                                <TableCell className="text-sm">
                                                    {new Date(v.created_at).toLocaleDateString("fr-FR")} {new Date(v.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                                </TableCell>
                                                <TableCell className="text-sm">{v.localisation_approx || "—"}</TableCell>
                                                <TableCell className={cn("text-sm font-medium", result.color)}>{result.label}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CarteECPS;
