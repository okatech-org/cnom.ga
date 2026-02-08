// lib/finance-utils.ts — Utilities financières pour le Trésorier

import type { CotisationStatus, PaymentStatus, PaymentType, PaymentMethod } from "@/types/tresorier";

/** Format montant en FCFA standard */
export const formatCFA = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
};

/** Format compact (89.2M FCFA) */
export const formatCompactCFA = (amount: number): string => {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(1)}Md FCFA`;
    }
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
    }
    if (amount >= 1_000) {
        return `${(amount / 1_000).toFixed(0)}K FCFA`;
    }
    return formatCFA(amount);
};

/** Format nombre seul sans devise */
export const formatNumber = (n: number): string => {
    return new Intl.NumberFormat('fr-FR').format(n);
};

/** Calcul de pénalité selon RG-M4-04 */
export const calculatePenalty = (
    montantDu: number,
    retardMois: number,
    penaltyConfig?: { taux: number; plafond: number }[]
): number => {
    const config = penaltyConfig || [
        { taux: 0, plafond: 0 },      // 1-3 mois: 0%
        { taux: 5, plafond: 30000 },   // 3-6 mois: 5%
        { taux: 10, plafond: 30000 },  // 6-12 mois: 10%
        { taux: 15, plafond: 30000 },  // >12 mois: 15%
    ];

    let taux = 0;
    let plafond = 30000;

    if (retardMois <= 3) {
        taux = config[0]?.taux || 0;
    } else if (retardMois <= 6) {
        taux = config[1]?.taux || 5;
        plafond = config[1]?.plafond || 30000;
    } else if (retardMois <= 12) {
        taux = config[2]?.taux || 10;
        plafond = config[2]?.plafond || 30000;
    } else {
        taux = config[3]?.taux || 15;
        plafond = config[3]?.plafond || 30000;
    }

    const penalite = (montantDu * taux) / 100;
    return Math.min(penalite, plafond);
};

/** Label du retard */
export const getRetardLabel = (mois: number): string => {
    if (mois === 0) return 'À jour';
    if (mois <= 3) return `${mois} mois`;
    if (mois <= 6) return `${mois} mois`;
    if (mois <= 12) return `${mois} mois`;
    return `${mois} mois`;
};

/** Couleur du retard */
export const getRetardColor = (mois: number): string => {
    if (mois === 0) return 'text-emerald-600';
    if (mois <= 3) return 'text-yellow-600';
    if (mois <= 6) return 'text-orange-600';
    return 'text-red-600';
};

/** Badge variant du retard */
export const getRetardBadgeVariant = (mois: number): string => {
    if (mois === 0) return 'bg-emerald-100 text-emerald-800';
    if (mois <= 3) return 'bg-yellow-100 text-yellow-800';
    if (mois <= 6) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
};

/** Config statut cotisation */
export const cotisationStatusConfig: Record<CotisationStatus, {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
}> = {
    a_jour: { label: 'À jour', color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: '✅' },
    retard_leger: { label: 'Retard léger', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '⚠️' },
    retard_moyen: { label: 'Retard 6-12 mois', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '🟠' },
    retard_critique: { label: 'Retard critique', color: 'text-red-600', bgColor: 'bg-red-100', icon: '🚨' },
    moratoire: { label: 'Sous moratoire', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '🎓' },
};

/** Label type de paiement */
export const paymentTypeLabels: Record<PaymentType, string> = {
    inscription: "Droits d'inscription",
    cotisation_annuelle: 'Cotisation annuelle',
    cotisation_semestrielle: 'Cotisation semestrielle',
    cotisation_mensuelle: 'Cotisation mensuelle',
    penalite: 'Pénalité de retard',
    regularisation: 'Régularisation',
};

/** Label méthode de paiement */
export const paymentMethodLabels: Record<PaymentMethod, string> = {
    airtel_money: 'Airtel Money',
    moov_money: 'Moov Money',
    carte_bancaire: 'Carte bancaire',
    virement_bancaire: 'Virement bancaire',
    especes: 'Espèces',
    regularisation: 'Régularisation',
};

/** Label statut de paiement */
export const paymentStatusConfig: Record<PaymentStatus, {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
}> = {
    pending: { label: 'En attente', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: '⏳' },
    confirmed: { label: 'Confirmé', color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: '✅' },
    failed: { label: 'Échoué', color: 'text-red-600', bgColor: 'bg-red-100', icon: '❌' },
    cancelled: { label: 'Annulé', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '🚫' },
    refunded: { label: 'Remboursé', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '↩️' },
};

/** Format date FR */
export const formatDateFR = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

/** Format date + heure FR */
export const formatDateTimeFR = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/** Format heure FR */
export const formatTimeFR = (dateStr: string): string => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/** Provinces du Gabon */
export const PROVINCES_GABON = [
    'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié',
    'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem',
] as const;

/** Spécialités médicales courantes */
export const SPECIALITES_MEDICALES = [
    'Médecine Générale', 'Chirurgie', 'Pédiatrie', 'Gynécologie-Obstétrique',
    'Cardiologie', 'Dermatologie', 'Ophtalmologie', 'ORL', 'Radiologie',
    'Anesthésie-Réanimation', 'Psychiatrie', 'Médecine Interne', 'Orthopédie',
    'Neurologie', 'Urologie', 'Gastro-entérologie',
] as const;
