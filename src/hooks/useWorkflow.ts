import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type WorkflowStep = 
  | "draft" 
  | "submitted" 
  | "agent_review" 
  | "commission_review" 
  | "president_review" 
  | "completed" 
  | "rejected";

interface WorkflowAction {
  applicationId: string;
  action: "submit" | "agent_approve" | "commission_approve" | "commission_reject" | "commission_escalate" | "president_approve" | "president_reject";
  notes?: string;
}

interface WorkflowResult {
  success: boolean;
  newStep?: WorkflowStep;
  error?: string;
}

const STEP_TRANSITIONS: Record<string, { from: WorkflowStep[]; to: WorkflowStep }> = {
  submit: { from: ["draft"], to: "submitted" },
  agent_approve: { from: ["submitted"], to: "commission_review" },
  commission_approve: { from: ["commission_review"], to: "completed" },
  commission_reject: { from: ["commission_review"], to: "rejected" },
  commission_escalate: { from: ["commission_review"], to: "president_review" },
  president_approve: { from: ["president_review"], to: "completed" },
  president_reject: { from: ["president_review"], to: "rejected" },
};

export const useWorkflow = () => {
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const executeAction = useCallback(
    async ({ applicationId, action, notes }: WorkflowAction): Promise<WorkflowResult> => {
      if (!user) {
        return { success: false, error: "Utilisateur non authentifié" };
      }

      setProcessing(true);

      try {
        // Get current application state
        const { data: app, error: fetchError } = await supabase
          .from("applications")
          .select("id, status, current_step, profile_id")
          .eq("id", applicationId)
          .single();

        if (fetchError || !app) {
          return { success: false, error: "Dossier non trouvé" };
        }

        const currentStep = (app.current_step || "draft") as WorkflowStep;
        const transition = STEP_TRANSITIONS[action];

        if (!transition) {
          return { success: false, error: "Action non reconnue" };
        }

        if (!transition.from.includes(currentStep)) {
          return {
            success: false,
            error: `Cette action n'est pas autorisée à l'étape actuelle (${currentStep})`,
          };
        }

        // Build update object based on action
        const updateData: Record<string, unknown> = {
          current_step: transition.to,
          updated_at: new Date().toISOString(),
        };

        // Set status based on final step
        if (transition.to === "completed") {
          updateData.status = "validated";
          updateData.validation_date = new Date().toISOString();
          updateData.validated_by = user.id;
        } else if (transition.to === "rejected") {
          updateData.status = "rejected";
          updateData.rejection_reason = notes || "Dossier rejeté";
          updateData.validation_date = new Date().toISOString();
          updateData.validated_by = user.id;
        } else if (transition.to === "commission_review") {
          updateData.status = "under_review";
          updateData.agent_validated_by = user.id;
          updateData.agent_validated_at = new Date().toISOString();
        } else if (transition.to === "president_review") {
          updateData.commission_validated_by = user.id;
          updateData.commission_validated_at = new Date().toISOString();
          updateData.commission_decision = "pending_president";
        } else if (transition.to === "submitted") {
          updateData.status = "submitted";
          updateData.submission_date = new Date().toISOString();
        }

        // If commission approved directly
        if (action === "commission_approve") {
          updateData.commission_validated_by = user.id;
          updateData.commission_validated_at = new Date().toISOString();
          updateData.commission_decision = "approved";
        }

        if (action === "commission_reject") {
          updateData.commission_validated_by = user.id;
          updateData.commission_validated_at = new Date().toISOString();
          updateData.commission_decision = "rejected";
        }

        if (action === "president_approve" || action === "president_reject") {
          updateData.president_validated_by = user.id;
          updateData.president_validated_at = new Date().toISOString();
        }

        // Update application
        const { error: updateError } = await supabase
          .from("applications")
          .update(updateData)
          .eq("id", applicationId);

        if (updateError) {
          console.error("Update error:", updateError);
          return { success: false, error: "Erreur lors de la mise à jour" };
        }

        // Log the workflow action
        await supabase.from("workflow_logs").insert({
          application_id: applicationId,
          action,
          from_step: currentStep,
          to_step: transition.to,
          performed_by: user.id,
          notes,
          metadata: { timestamp: new Date().toISOString() },
        });

        // Generate order number if validated
        if (transition.to === "completed") {
          const { data: orderNumber } = await supabase.rpc("generate_dossier_number");
          
          if (orderNumber) {
            // Update profile with order number
            await supabase
              .from("profiles")
              .update({ numero_ordre: orderNumber.replace("INS-", "").replace(/-/g, "") })
              .eq("id", app.profile_id);
          }
        }

        toast({
          title: "Action effectuée",
          description: getSuccessMessage(action),
        });

        return { success: true, newStep: transition.to };
      } catch (err) {
        console.error("Workflow error:", err);
        return { success: false, error: "Erreur inattendue" };
      } finally {
        setProcessing(false);
      }
    },
    [user, toast]
  );

  return {
    executeAction,
    processing,
  };
};

function getSuccessMessage(action: string): string {
  const messages: Record<string, string> = {
    submit: "Dossier soumis avec succès",
    agent_approve: "Dossier transmis à la Commission",
    commission_approve: "Dossier validé et numéro d'Ordre attribué",
    commission_reject: "Dossier rejeté",
    commission_escalate: "Dossier transmis au Président",
    president_approve: "Dossier validé par le Président",
    president_reject: "Dossier rejeté par le Président",
  };
  return messages[action] || "Action effectuée";
}

export default useWorkflow;
