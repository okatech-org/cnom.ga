import type { PaymentType, PaymentMethod, Periodicite, PeriodiciteOption } from "@/types/medecin";

// Format amount in FCFA
export const formatFCFA = (amount: number): string => {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
};

// Payment type labels
export const paymentTypeLabels: Record<PaymentType, string> = {
    inscription: "Frais d'inscription",
    cotisation_annuelle: "Cotisation annuelle",
    cotisation_semestrielle: "Cotisation semestrielle",
    cotisation_mensuelle: "Cotisation mensuelle",
};

// Payment method labels
export const paymentMethodLabels: Record<PaymentMethod, { label: string; icon: string; description: string }> = {
    airtel_money: {
        label: "Airtel Money",
        icon: "📱",
        description: "Paiement via Airtel Money — saisissez votre numéro de téléphone",
    },
    moov_money: {
        label: "Moov Money",
        icon: "📱",
        description: "Paiement via Moov Money — saisissez votre numéro de téléphone",
    },
    carte_bancaire: {
        label: "Carte bancaire",
        icon: "💳",
        description: "Visa / Mastercard — paiement sécurisé PCI-DSS",
    },
};

// Periodicite options
export const periodiciteOptions: PeriodiciteOption[] = [
    {
        id: "annuel",
        label: "Annuel",
        montant: 120000,
        echeances: "1 paiement unique",
        nombre_paiements: 1,
    },
    {
        id: "semestriel",
        label: "Semestriel",
        montant: 60000,
        echeances: "2 paiements (mars + juin)",
        nombre_paiements: 2,
    },
    {
        id: "mensuel",
        label: "Mensuel",
        montant: 10000,
        echeances: "12 paiements mensuels",
        nombre_paiements: 12,
    },
];

// Calculate moratorium date (6 months after graduation)
export const calculateMoratoriumDate = (dateSoutenance: string): Date => {
    const date = new Date(dateSoutenance);
    date.setMonth(date.getMonth() + 6);
    return date;
};

// Check if moratorium is still active
export const isMoratoriumActive = (dateSoutenance: string): boolean => {
    const moratoriumEnd = calculateMoratoriumDate(dateSoutenance);
    return new Date() < moratoriumEnd;
};

// Format date in French
export const formatDateFR = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

// Format date relative (il y a X)
export const formatRelativeDate = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return formatDateFR(dateString);
};
