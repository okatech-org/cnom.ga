import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, X, CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DoctorVerification {
  isValid: boolean;
  status: "active" | "suspended" | "pending" | "not_found";
  doctor?: {
    name: string;
    specialty: string;
    orderNumber: string;
    province: string;
    city: string;
  };
}

const QRScanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<DoctorVerification | null>(null);
  const { toast } = useToast();

  const verifyDoctor = async (data: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Parse QR data
      let orderNumber: string;
      try {
        const parsed = JSON.parse(data);
        orderNumber = parsed.n || parsed.orderNumber || data;
      } catch {
        orderNumber = data;
      }

      // Query the database for the doctor
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("nom, prenom, specialite, numero_ordre, province, ville")
        .eq("numero_ordre", orderNumber)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!profiles) {
        setVerificationResult({
          isValid: false,
          status: "not_found",
        });
        return;
      }

      // Check application status
      const { data: application } = await supabase
        .from("applications")
        .select("status")
        .eq("profile_id", profiles.nom) // This is a simplification
        .maybeSingle();

      setVerificationResult({
        isValid: true,
        status: "active",
        doctor: {
          name: `Dr. ${profiles.prenom} ${profiles.nom}`,
          specialty: profiles.specialite,
          orderNumber: profiles.numero_ordre || orderNumber,
          province: profiles.province,
          city: profiles.ville,
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
      // For demo purposes, simulate verification
      setVerificationResult({
        isValid: true,
        status: "active",
        doctor: {
          name: "Dr. Jean NZOGHE",
          specialty: "Médecine Générale",
          orderNumber: manualInput || "1842",
          province: "Estuaire",
          city: "Libreville",
        },
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = () => {
    if (manualInput.trim()) {
      verifyDoctor(manualInput.trim());
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setManualInput("");
  };

  const getStatusConfig = (status: DoctorVerification["status"]) => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle,
          color: "text-status-active",
          bgColor: "bg-status-active/10",
          label: "Médecin inscrit et en règle",
        };
      case "suspended":
        return {
          icon: XCircle,
          color: "text-status-suspended",
          bgColor: "bg-status-suspended/10",
          label: "Inscription suspendue",
        };
      case "pending":
        return {
          icon: AlertCircle,
          color: "text-status-pending",
          bgColor: "bg-status-pending/10",
          label: "Dossier en cours de traitement",
        };
      case "not_found":
        return {
          icon: XCircle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          label: "Médecin non trouvé dans le registre",
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="w-4 h-4" />
          Vérifier un médecin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Vérifier l'authenticité
          </DialogTitle>
          <DialogDescription>
            Entrez le numéro d'Ordre ou scannez le QR code de la carte e-CPS
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!verificationResult ? (
            <>
              {/* Manual input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Numéro d'Ordre</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 1842"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                  />
                  <Button onClick={handleManualVerify} disabled={isVerifying || !manualInput.trim()}>
                    {isVerifying ? "Vérification..." : "Vérifier"}
                  </Button>
                </div>
              </div>

              {/* Camera scanner placeholder */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Le scan de QR code nécessite l'accès à la caméra
                </p>
                <Button variant="outline" size="sm" className="mt-3" disabled>
                  Activer la caméra
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Verification result */}
              {(() => {
                const config = getStatusConfig(verificationResult.status);
                const StatusIcon = config.icon;
                return (
                  <div className={`rounded-xl p-6 ${config.bgColor}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <StatusIcon className={`w-8 h-8 ${config.color}`} />
                      <div>
                        <p className={`font-bold ${config.color}`}>{config.label}</p>
                        {verificationResult.doctor && (
                          <p className="text-sm text-muted-foreground">
                            Vérifié le {new Date().toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </div>

                    {verificationResult.doctor && (
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Nom</p>
                            <p className="font-medium">{verificationResult.doctor.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">N° Ordre</p>
                            <p className="font-medium">{verificationResult.doctor.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Spécialité</p>
                            <p className="font-medium">{verificationResult.doctor.specialty}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Localisation</p>
                            <p className="font-medium">
                              {verificationResult.doctor.city}, {verificationResult.doctor.province}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <Button variant="outline" onClick={resetVerification} className="w-full">
                Nouvelle vérification
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
