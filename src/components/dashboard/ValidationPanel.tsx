import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckCircle2, XCircle, ArrowRight, Clock, 
  User, FileCheck, AlertTriangle, Send
} from "lucide-react";
import { useWorkflow } from "@/hooks/useWorkflow";

interface ApplicationForValidation {
  id: string;
  numero_dossier: string | null;
  current_step: string;
  profile: {
    nom: string;
    prenom: string;
    specialite: string;
    province: string;
  } | null;
  submission_date: string | null;
}

interface ValidationPanelProps {
  applications: ApplicationForValidation[];
  role: "agent" | "commission" | "president";
  onActionComplete?: () => void;
}

const stepLabels: Record<string, string> = {
  draft: "Brouillon",
  submitted: "Soumis",
  agent_review: "Vérification Agent",
  commission_review: "Commission",
  president_review: "Président",
  completed: "Validé",
  rejected: "Rejeté",
};

const roleActions = {
  agent: {
    title: "Vérification des documents",
    approveLabel: "Transmettre à la Commission",
    approveAction: "agent_approve" as const,
  },
  commission: {
    title: "Validation par la Commission",
    approveLabel: "Valider et attribuer N° Ordre",
    approveAction: "commission_approve" as const,
    escalateLabel: "Transmettre au Président",
    escalateAction: "commission_escalate" as const,
    rejectLabel: "Rejeter le dossier",
    rejectAction: "commission_reject" as const,
  },
  president: {
    title: "Validation finale",
    approveLabel: "Valider définitivement",
    approveAction: "president_approve" as const,
    rejectLabel: "Rejeter le dossier",
    rejectAction: "president_reject" as const,
  },
};

export const ValidationPanel = ({ applications, role, onActionComplete }: ValidationPanelProps) => {
  const [selectedApp, setSelectedApp] = useState<ApplicationForValidation | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const { executeAction, processing } = useWorkflow();

  const config = roleActions[role];

  const handleApprove = async (app: ApplicationForValidation) => {
    const result = await executeAction({
      applicationId: app.id,
      action: config.approveAction,
    });

    if (result.success) {
      onActionComplete?.();
    }
  };

  const handleEscalate = async (app: ApplicationForValidation) => {
    if (role !== "commission") return;

    const result = await executeAction({
      applicationId: app.id,
      action: "commission_escalate",
      notes: "Dossier transmis au Président pour décision",
    });

    if (result.success) {
      onActionComplete?.();
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !rejectReason.trim()) return;

    const rejectAction = role === "commission" ? "commission_reject" : "president_reject";

    const result = await executeAction({
      applicationId: selectedApp.id,
      action: rejectAction,
      notes: rejectReason,
    });

    if (result.success) {
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedApp(null);
      onActionComplete?.();
    }
  };

  const openRejectDialog = (app: ApplicationForValidation) => {
    setSelectedApp(app);
    setRejectDialogOpen(true);
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Aucun dossier en attente</h3>
          <p className="text-muted-foreground">
            Tous les dossiers ont été traités.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            {config.title}
          </CardTitle>
          <CardDescription>
            {applications.length} dossier(s) en attente de traitement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Dr. {app.profile?.prenom} {app.profile?.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {app.profile?.specialite} • {app.profile?.province}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {app.numero_dossier || app.id.slice(0, 8)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {stepLabels[app.current_step] || app.current_step}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(app)}
                    disabled={processing}
                    className="gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {config.approveLabel}
                  </Button>

                  {role === "commission" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEscalate(app)}
                      disabled={processing}
                      className="gap-1"
                    >
                      <Send className="w-4 h-4" />
                      Au Président
                    </Button>
                  )}

                  {(role === "commission" || role === "president") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openRejectDialog(app)}
                      disabled={processing}
                      className="gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Rejeter
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Rejeter le dossier
            </DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif du rejet. Cette information sera communiquée au médecin.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Motif du rejet (obligatoire)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || processing}
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ValidationPanel;
