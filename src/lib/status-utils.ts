import { CheckCircle, AlertTriangle, XCircle, Clock, Ban } from "lucide-react";
import type { DoctorStatus, ApplicationStatus, PaymentStatus, NotificationType, DocumentRequestStatus, DocumentVerificationStatus } from "@/types/medecin";

// Doctor status configuration
export const doctorStatusConfig: Record<DoctorStatus, {
    label: string;
    color: string;
    borderColor: string;
    bgColor: string;
    icon: typeof CheckCircle;
    message: string;
}> = {
    Inscrit: {
        label: "Inscrit et en règle",
        color: "text-emerald-700 dark:text-emerald-400",
        borderColor: "border-l-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        icon: CheckCircle,
        message: "Votre inscription est active et vos cotisations sont à jour.",
    },
    Candidat: {
        label: "Dossier en cours",
        color: "text-blue-700 dark:text-blue-400",
        borderColor: "border-l-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        icon: Clock,
        message: "Votre dossier est en cours d'examen.",
    },
    Suspendu: {
        label: "Suspendu",
        color: "text-red-700 dark:text-red-400",
        borderColor: "border-l-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        icon: XCircle,
        message: "Votre inscription est suspendue suite à une décision disciplinaire.",
    },
    Radié: {
        label: "Radié",
        color: "text-red-900 dark:text-red-300",
        borderColor: "border-l-red-800",
        bgColor: "bg-red-100 dark:bg-red-950/50",
        icon: Ban,
        message: "Vous avez été radié de l'Ordre des Médecins.",
    },
    Retraité: {
        label: "Retraité",
        color: "text-gray-700 dark:text-gray-400",
        borderColor: "border-l-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-950/30",
        icon: CheckCircle,
        message: "Vous êtes inscrit en tant que médecin retraité.",
    },
    Décédé: {
        label: "Décédé",
        color: "text-gray-500",
        borderColor: "border-l-gray-500",
        bgColor: "bg-gray-100",
        icon: XCircle,
        message: "",
    },
};

// Cotisation-specific status (overlays on doctor status)
export const cotisationStatusConfig = {
    a_jour: {
        label: "À jour",
        color: "text-emerald-700",
        badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: CheckCircle,
    },
    retard: {
        label: "Cotisation en retard",
        color: "text-amber-700",
        badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        icon: AlertTriangle,
    },
};

// Application status
export const applicationStatusConfig: Record<ApplicationStatus, {
    label: string;
    color: string;
    stepIndex: number;
}> = {
    draft: { label: "Création", color: "text-gray-500", stepIndex: 0 },
    submitted: { label: "Soumis", color: "text-blue-600", stepIndex: 2 },
    under_review: { label: "En examen", color: "text-amber-600", stepIndex: 3 },
    documents_required: { label: "Pièces requises", color: "text-orange-600", stepIndex: 3 },
    rejected: { label: "Rejeté", color: "text-red-600", stepIndex: -1 },
    validated: { label: "Validé", color: "text-emerald-600", stepIndex: 5 },
};

// Payment status
export const paymentStatusLabels: Record<PaymentStatus, { label: string; color: string }> = {
    en_attente: { label: "En attente", color: "bg-amber-100 text-amber-800" },
    confirme: { label: "Confirmé", color: "bg-emerald-100 text-emerald-800" },
    echoue: { label: "Échoué", color: "bg-red-100 text-red-800" },
    rembourse: { label: "Remboursé", color: "bg-blue-100 text-blue-800" },
};

// Notification type config
export const notificationTypeConfig: Record<NotificationType, {
    icon: string;
    color: string;
    bgColor: string;
    label: string;
}> = {
    paiement: { icon: "💰", color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", label: "Paiement" },
    dossier: { icon: "📁", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/30", label: "Dossier" },
    carte: { icon: "🪪", color: "text-violet-600", bgColor: "bg-violet-50 dark:bg-violet-950/30", label: "Carte" },
    ordre: { icon: "⚕️", color: "text-indigo-600", bgColor: "bg-indigo-50 dark:bg-indigo-950/30", label: "Ordre" },
    systeme: { icon: "⚙️", color: "text-gray-600", bgColor: "bg-gray-50 dark:bg-gray-950/30", label: "Système" },
};

// Document request status
export const documentRequestStatusLabels: Record<DocumentRequestStatus, { label: string; color: string }> = {
    en_attente: { label: "En attente", color: "bg-amber-100 text-amber-800" },
    generee: { label: "Générée", color: "bg-blue-100 text-blue-800" },
    disponible: { label: "Disponible", color: "bg-emerald-100 text-emerald-800" },
    rejetee: { label: "Rejetée", color: "bg-red-100 text-red-800" },
};

// Document verification status
export const docVerifStatusLabels: Record<DocumentVerificationStatus, { label: string; icon: string }> = {
    en_attente: { label: "En attente", icon: "⏳" },
    verifie: { label: "Vérifié", icon: "✅" },
    rejete: { label: "Rejeté", icon: "❌" },
};
