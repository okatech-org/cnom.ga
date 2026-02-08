// types/president.ts — All TypeScript types for the Espace Président CNOM

import type { Doctor, DoctorStatus, Province } from './medecin';

// ── Roles ──
export type UserRole = 'admin' | 'president' | 'sg' | 'tresorier' | 'agent' | 'commission' | 'regional' | 'medecin';

export interface UserRoleRecord {
    id: string;
    user_id: string;
    role: UserRole;
    province?: string;
    is_active: boolean;
}

// ── Disciplinary ──
export type SanctionType = 'avertissement' | 'blame' | 'suspension_temporaire' | 'suspension_definitive' | 'radiation' | 'interdiction_exercice';
export type SanctionStatus = 'en_cours' | 'execute' | 'releve' | 'appel';

export const SANCTION_TYPE_LABELS: Record<SanctionType, string> = {
    avertissement: 'Avertissement',
    blame: 'Blâme',
    suspension_temporaire: 'Suspension temporaire',
    suspension_definitive: 'Suspension définitive',
    radiation: 'Radiation',
    interdiction_exercice: "Interdiction d'exercice",
};

export const SANCTION_STATUS_LABELS: Record<SanctionStatus, string> = {
    en_cours: 'En cours',
    execute: 'Exécuté',
    releve: 'Relevé',
    appel: 'En appel',
};

export interface DisciplinaryRecord {
    id: string;
    doctor_id: string;
    doctor?: Doctor;
    type_sanction: SanctionType;
    nature_infraction: string;
    date_decision: string;
    date_effet: string;
    duree_jours?: number;
    date_fin?: string;
    decision_detail?: string;
    statut: SanctionStatus;
    confirme_par?: string;
    created_at: string;
    updated_at: string;
}

// ── Status Changes ──
export type StatusChangeRequestStatus = 'en_attente' | 'valide' | 'rejete';

export interface StatusChangeRequest {
    id: string;
    doctor_id: string;
    ancien_statut: DoctorStatus;
    nouveau_statut: DoctorStatus;
    demande_par: string;
    valide_par?: string;
    motif: string;
    commentaire_president?: string;
    statut_demande: StatusChangeRequestStatus;
    created_at: string;
    processed_at?: string;
    // Joined data
    doctor?: Doctor;
    demandeur?: { email: string; role: string; name: string };
}

// ── Presidential Decisions ──
export type PresidentialDecisionType =
    | 'validation_inscription' | 'rejet_inscription'
    | 'validation_statut' | 'rejet_statut'
    | 'confirmation_disciplinaire' | 'levee_suspension'
    | 'complement_demande' | 'renvoi_commission';

export interface PresidentialDecision {
    id: string;
    president_id: string;
    type_decision: PresidentialDecisionType;
    reference_dossier?: string;
    commentaire?: string;
    candidat_nom?: string;
    numero_ordre?: number;
    created_at: string;
}

// ── Audit Logs ──
export interface AuditLog {
    id: string;
    user_id?: string;
    user_role?: string;
    user_email?: string;
    user_name?: string;
    action: string;
    module?: 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'AUTH' | 'SYSTEM';
    detail?: string;
    target_table?: string;
    target_id?: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

// ── Presidential Alerts ──
export type AlertType = 'escalade' | 'disciplinaire' | 'statut' | 'financier' | 'inscription';
export type AlertPriority = 'critique' | 'haute' | 'moyenne' | 'info';

export interface AlertPresidentielle {
    id: string;
    type: AlertType;
    priorite: AlertPriority;
    titre: string;
    message: string;
    lien_action: string; // tab id to navigate to
    created_at: string;
}

// ── Notifications ──
export type PresidentNotificationType = 'escalade' | 'disciplinaire' | 'statut' | 'financier' | 'inscription' | 'systeme' | 'ordre';

export interface PresidentNotification {
    id: string;
    type: PresidentNotificationType;
    priorite: AlertPriority;
    titre: string;
    message: string;
    lue: boolean;
    lien_action?: string;
    created_at: string;
}

// ── KPI & BI ──
export interface KPIData {
    label: string;
    value: number | string;
    tendance?: number;
    tendance_label?: string;
    icon: string;
    color: string;
}

export interface ProvinceStats {
    province: Province;
    chef_lieu: string;
    medecins: number;
    pourcentage: number;
    population: number;
    ratio_pour_10000: number;
    is_desert_medical: boolean; // < 2.3 / 10,000
}

export interface SpecialiteStats {
    specialite: string;
    nombre: number;
    pourcentage: number;
    taux_feminisation: number;
    evolution_5ans: number;
}

export interface FinancialSummary {
    recettes_totales: number;
    taux_recouvrement: number;
    impayes_total: number;
    cotisations_mois_courant: number;
    comparaison_n_moins_1: number; // percentage
}

export interface MonthlyRevenue {
    mois: string;
    cotisations: number;
    inscriptions: number;
    total: number;
}

export interface UnpaidBreakdown {
    duree: string;
    nombre: number;
    montant: number;
}

export interface InscriptionMonthly {
    mois: string;
    soumis: number;
    valides: number;
}

export interface AgePyramidEntry {
    tranche: string;
    hommes: number;
    femmes: number;
}

export interface FeminisationEntry {
    annee: number;
    taux: number;
}

export interface FluxAnnuelEntry {
    annee: number;
    inscriptions: number;
    radiations: number;
    deces: number;
    retraites: number;
}

export interface ActivityFeedItem {
    id: string;
    time: string;
    icon: string;
    message: string;
    type: 'validation' | 'paiement' | 'dossier' | 'statut' | 'verification';
}

// ── Validation Queue (M2) ──
export type ValidationDossierType = 'national' | 'etranger';
export type ValidationPriorite = 'haute' | 'moyenne' | 'basse';
export type EtapeActuelle = 'escalade_commission' | 'validation_renforcee' | 'arbitrage_sg';

export interface ValidationDossier {
    id: string;
    candidat_nom: string;
    candidat_prenoms: string;
    specialite: string;
    type: ValidationDossierType;
    soumis_le: string;
    etape_actuelle: EtapeActuelle;
    priorite: ValidationPriorite;
    motif_escalade?: string;
    // Detailed data
    date_naissance?: string;
    nationalite?: string;
    photo_url?: string;
    telephone?: string;
    email?: string;
    diplome?: string;
    universite?: string;
    annee_diplome?: number;
    verification_api?: 'verifie' | 'non_verifie' | 'rejete';
    pieces_justificatives?: { nom: string; statut: 'conforme' | 'en_attente' | 'manquant' }[];
    avis_agent?: { date: string; commentaire: string; decision: string };
    avis_commission?: { date: string; commentaire: string; decision: string };
    avis_sg?: { date: string; commentaire: string; decision: string } | null;
    paiement_inscription?: { montant: number; statut: 'paye' | 'en_attente'; reference?: string };
}

// Re-export Doctor for convenience
export type { Doctor, DoctorStatus, Province };
