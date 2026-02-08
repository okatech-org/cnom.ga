// types/tresorier.ts — Types pour l'Espace Trésorier(e) CNOM

export type PaymentType =
    | 'inscription'
    | 'cotisation_annuelle'
    | 'cotisation_semestrielle'
    | 'cotisation_mensuelle'
    | 'penalite'
    | 'regularisation';

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'refunded';

export type PaymentMethod =
    | 'airtel_money'
    | 'moov_money'
    | 'carte_bancaire'
    | 'virement_bancaire'
    | 'especes'
    | 'regularisation';

export type CotisationStatus = 'a_jour' | 'retard_leger' | 'retard_moyen' | 'retard_critique' | 'moratoire';

export interface TresorierPayment {
    id: string;
    doctor_id: string;
    amount: number;
    payment_type: PaymentType;
    payment_status: PaymentStatus;
    payment_method?: PaymentMethod;
    transaction_ref?: string;
    operator_ref?: string;
    period_start?: string;
    period_end?: string;
    exercice_fiscal: number;
    due_date?: string;
    paid_at?: string;
    receipt_url?: string;
    receipt_number?: string;
    penalite_amount: number;
    is_manual: boolean;
    manual_justification?: string;
    manual_attachment_url?: string;
    created_by?: string;
    webhook_received_at?: string;
    created_at: string;
    // Joins
    doctor?: DoctorFinancialView;
}

export interface DoctorFinancialView {
    id: string;
    numero_ordre: number;
    nom: string;
    prenoms: string;
    specialite: string;
    province: string;
    ville: string;
    secteur: string;
    statut: string;
    cotisation_status: CotisationStatus;
    dernier_paiement?: string;
    montant_du: number;
    retard_mois: number;
    niveau_relance: number;
    sous_moratoire: boolean;
}

export interface ReminderCampaign {
    id: string;
    titre: string;
    description?: string;
    cible_criteria: CibleCriteria;
    channels: ('sms' | 'email' | 'push')[];
    message_template: string;
    total_targeted: number;
    total_sent: number;
    total_delivered: number;
    total_opened: number;
    total_resulted_payment: number;
    total_revenue_generated: number;
    status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled';
    scheduled_at?: string;
    launched_by: string;
    created_at: string;
    completed_at?: string;
}

export interface CibleCriteria {
    retard_min_mois?: number;
    retard_max_mois?: number;
    provinces?: string[];
    specialites?: string[];
    niveau_relance?: number;
}

export interface PaymentReminder {
    id: string;
    doctor_id: string;
    reminder_level: number;
    channel: 'sms' | 'email' | 'push';
    message_content?: string;
    sent_at: string;
    delivered: boolean;
    opened: boolean;
    resulted_in_payment: boolean;
    payment_id?: string;
    campaign_id?: string;
}

export interface Moratorium {
    id: string;
    doctor_id: string;
    date_debut: string;
    date_fin: string;
    duree_mois: number;
    motif: 'nouveau_diplome' | 'cas_social' | 'prolongation_exceptionnelle';
    prolongation_de?: string;
    commentaire?: string;
    approuve_par?: string;
    statut: 'actif' | 'expire' | 'annule';
    created_at: string;
    doctor?: DoctorFinancialView;
}

export interface TariffConfig {
    id: string;
    code: string;
    libelle: string;
    montant: number;
    periodicite?: string;
    actif: boolean;
    date_effet: string;
    date_fin?: string;
}

export interface PenaltyConfig {
    id: string;
    tranche_debut_mois: number;
    tranche_fin_mois?: number;
    taux_penalite: number;
    plafond_montant?: number;
    actif: boolean;
}

export interface FinancialKPIs {
    recettes_totales: number;
    recettes_cotisations: number;
    recettes_inscriptions: number;
    taux_recouvrement: number;
    taux_recouvrement_objectif: number;
    impayes_total: number;
    impayes_nombre_medecins: number;
    paiements_aujourd_hui: number;
    montant_aujourd_hui: number;
    medecins_a_jour: number;
    medecins_total_actifs: number;
    moratoires_actifs: number;
    relances_en_cours: number;
    comparaison_n_moins_1: number;
    potentiel_maximal: number;
}

export interface RecouvrementStats {
    total_redevable: number;
    total_paye: number;
    retard_1_3_mois: { nombre: number; montant: number };
    retard_3_6_mois: { nombre: number; montant: number };
    retard_6_12_mois: { nombre: number; montant: number };
    retard_plus_12_mois: { nombre: number; montant: number };
}

export interface ProjectionScenario {
    label: string;
    taux_recouvrement: number;
    recettes_prevues: number;
    ecart_vs_budget: number;
}

export interface TresorierAlert {
    id: string;
    type: 'critique' | 'warning' | 'info' | 'action';
    icon: string;
    message: string;
    action?: string;
    actionTab?: string;
}

export interface TresorierNotification {
    id: string;
    type: 'paiement_recu' | 'paiement_echoue' | 'impaye_critique' | 'seuil_recouvrement' | 'moratoire_expire' | 'relance_envoyee' | 'saisie_manuelle' | 'rapport_genere' | 'systeme';
    titre: string;
    message: string;
    priorite: 'critique' | 'haute' | 'moyenne' | 'info';
    lue: boolean;
    date: string;
    lien_tab?: string;
}

export interface MonthlyRevenue {
    mois: string;
    cotisations: number;
    inscriptions: number;
    total: number;
    annee_precedente?: number;
}

export interface PaymentMethodStat {
    method: string;
    label: string;
    pourcentage: number;
    montant: number;
    color: string;
}

export interface ProvinceStat {
    province: string;
    medecins_actifs: number;
    a_jour: number;
    en_retard: number;
    taux_recouvrement: number;
    montant_percu: number;
}

export interface DocumentRequest {
    id: string;
    doctor_name: string;
    document_type: string;
    requested_at: string;
    status: 'en_attente' | 'genere' | 'envoye';
}

export interface TariffHistory {
    date: string;
    modification: string;
    ancien: string;
    nouveau: string;
    valide_par: string;
}

export interface ReminderConfig {
    id: string;
    label: string;
    delai: string;
    channels: { sms: boolean; email: boolean; push: boolean };
    message: string;
}
