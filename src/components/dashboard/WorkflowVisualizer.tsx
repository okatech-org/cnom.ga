import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, CheckCircle2, Clock, User, 
  FileCheck, Send, XCircle
} from "lucide-react";

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  role: string;
  icon: React.ReactNode;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "submitted",
    label: "Soumission",
    description: "Le médecin soumet son dossier complet",
    role: "Médecin",
    icon: <Send className="w-5 h-5" />,
  },
  {
    id: "agent_review",
    label: "Vérification Agent",
    description: "Vérification des documents et pièces justificatives",
    role: "Agent Administratif",
    icon: <FileCheck className="w-5 h-5" />,
  },
  {
    id: "commission_review",
    label: "Commission",
    description: "Examen du dossier et décision de validation",
    role: "Commission d'Inscription",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "president_review",
    label: "Président (optionnel)",
    description: "Validation finale pour les cas complexes",
    role: "Président CNOM",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    id: "completed",
    label: "Validé",
    description: "Attribution du numéro d'Ordre et activation e-CPS",
    role: "Système",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

interface WorkflowVisualizerProps {
  currentStep: string;
  showDetails?: boolean;
}

export const WorkflowVisualizer = ({ 
  currentStep, 
  showDetails = true 
}: WorkflowVisualizerProps) => {
  const currentIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);
  const isRejected = currentStep === "rejected";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Workflow de validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isRejected ? (
          <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">Dossier rejeté</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Le dossier a été rejeté. Consultez les motifs pour plus d'informations.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {WORKFLOW_STEPS.map((step, index) => {
                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  const isPending = index > currentIndex;

                  return (
                    <div key={step.id} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-primary text-primary-foreground animate-pulse"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      {showDetails && (
                        <div className="mt-2 text-center max-w-[100px]">
                          <p className={`text-xs font-medium ${
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Connecting Lines */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentIndex / (WORKFLOW_STEPS.length - 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Step Details */}
            {showDetails && currentIndex >= 0 && currentIndex < WORKFLOW_STEPS.length && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="default">Étape actuelle</Badge>
                  <span className="text-sm text-muted-foreground">
                    {WORKFLOW_STEPS[currentIndex].role}
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  {WORKFLOW_STEPS[currentIndex].description}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowVisualizer;
