// Demo data for the Espace Président — Dr. Emmanuel OGANDAGA
import type { Doctor } from '@/types/medecin';
import type {
    DisciplinaryRecord, StatusChangeRequest, PresidentialDecision,
    AuditLog, AlertPresidentielle, PresidentNotification,
    ProvinceStats, SpecialiteStats, FinancialSummary, MonthlyRevenue,
    UnpaidBreakdown, InscriptionMonthly, AgePyramidEntry, FeminisationEntry,
    FluxAnnuelEntry, ActivityFeedItem, ValidationDossier,
} from '@/types/president';

// ── Demo Doctors (50 entries) ──
const SPECIALITES = ['Médecine Générale', 'Gynéco-Obstétrique', 'Pédiatrie', 'Chirurgie Dentaire', 'Cardiologie', 'Ophtalmologie', 'ORL', 'Dermatologie', 'Neurologie', 'Anesthésie-Réanimation', 'Radiologie', 'Chirurgie Générale', 'Psychiatrie', 'Urologie', 'Pneumologie'];
const PROVINCES: Doctor['province'][] = ['Estuaire', 'Haut-Ogooué', 'Ogooué-Maritime', 'Woleu-Ntem', 'Moyen-Ogooué', 'Ngounié', 'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo'];
const VILLES: Record<string, string> = { 'Estuaire': 'Libreville', 'Haut-Ogooué': 'Franceville', 'Ogooué-Maritime': 'Port-Gentil', 'Woleu-Ntem': 'Oyem', 'Moyen-Ogooué': 'Lambaréné', 'Ngounié': 'Mouila', 'Nyanga': 'Tchibanga', 'Ogooué-Ivindo': 'Makokou', 'Ogooué-Lolo': 'Koulamoutou' };
const NOMS = ['MELLA-MBOUMBA', 'EKOMI', 'DANSOU', 'MOUSSAVOU', 'NDONG', 'OBIANG', 'KOUMBA', 'NZAMBA', 'MINTSA', 'ONDO', 'MBOUMBA', 'NGUEMA', 'ESSONO', 'MBOUROU', 'EDZANG', 'ONDO METHOGO', 'BIYOGHE', 'ALLOGHO', 'NTOUTOUME', 'OVONO', 'MAGANGA', 'MEBIAME', 'ENGONGA', 'NKOGHE', 'EYANG', 'MAYOMBO', 'LEKOGO', 'ASSEKO', 'MABIKA', 'BONGO', 'MIKALA', 'OGOULA', 'MBENG', 'EYENE', 'NDJAVE', 'NDOUTOUME', 'OGANDAGA', 'AKUE', 'BIVIGOU', 'MOMBO', 'ELLA', 'TATY', 'MILAMA', 'MOUNGUENGUI', 'OYANE', 'MENGARA', 'EDOU', 'ABESSOLO', 'NZIENGUI', 'MAPANGOU'];
const PRENOMS_M = ['Jean-Pierre', 'Albert', 'François', 'Michel', 'André', 'Paul', 'Emmanuel', 'Jacques', 'Marcel', 'Léon', 'Pierre', 'Henri', 'Bernard', 'Robert', 'Thierry'];
const PRENOMS_F = ['Marie', 'Claire', 'Georgette', 'Madeleine', 'Françoise', 'Jeanne', 'Nicole', 'Sylvie', 'Patricia', 'Hélène', 'Anne', 'Véronique', 'Catherine', 'Isabelle', 'Christine'];

function makeDoctor(i: number): Doctor {
    const isFemale = i % 3 === 0;
    const pIdx = i % PROVINCES.length;
    const province = PROVINCES[pIdx];
    return {
        id: `doc-${String(i).padStart(4, '0')}`,
        user_id: `user-${String(i).padStart(4, '0')}`,
        numero_ordre: i + 1,
        nom: NOMS[i % NOMS.length],
        prenoms: isFemale ? PRENOMS_F[i % PRENOMS_F.length] : PRENOMS_M[i % PRENOMS_M.length],
        genre: isFemale ? 'F' : 'M',
        specialite_principale: SPECIALITES[i % SPECIALITES.length],
        ville_exercice: VILLES[province],
        province,
        telephone_pro: `+241 0${6 + i % 3} ${String(10 + i).slice(-2)} ${String(30 + i).slice(-2)} ${String(40 + i).slice(-2)}`,
        email: `${NOMS[i % NOMS.length].toLowerCase().replace(/[- ]/g, '')}@cnom-gabon.ga`,
        secteur_exercice: i % 4 === 0 ? 'Privé' : i % 5 === 0 ? 'Mixte' : 'Public',
        etablissement: i % 4 === 0 ? 'Clinique privée' : 'CHU',
        statut: i === 15 ? 'Suspendu' : i === 30 ? 'Retraité' : 'Inscrit',
        date_inscription: `${2000 + (i % 25)}-${String(1 + (i % 12)).padStart(2, '0')}-15`,
        diplome_principal: 'Doctorat en Médecine',
        universite_obtention: i % 3 === 0 ? 'USS Libreville' : i % 3 === 1 ? 'Univ. Dakar' : 'CAMES',
        annee_obtention: 1998 + (i % 25),
        created_at: `${2000 + (i % 25)}-01-01T08:00:00Z`,
        updated_at: '2026-01-15T10:00:00Z',
    };
}

export const DEMO_DOCTORS: Doctor[] = Array.from({ length: 50 }, (_, i) => makeDoctor(i));

// ── Province Stats ──
export const DEMO_PROVINCE_STATS: ProvinceStats[] = [
    { province: 'Estuaire', chef_lieu: 'Libreville', medecins: 1450, pourcentage: 66, population: 1000000, ratio_pour_10000: 14.5, is_desert_medical: false },
    { province: 'Ogooué-Maritime', chef_lieu: 'Port-Gentil', medecins: 275, pourcentage: 12.5, population: 335000, ratio_pour_10000: 8.2, is_desert_medical: false },
    { province: 'Haut-Ogooué', chef_lieu: 'Franceville', medecins: 235, pourcentage: 10.7, population: 345000, ratio_pour_10000: 6.8, is_desert_medical: false },
    { province: 'Woleu-Ntem', chef_lieu: 'Oyem', medecins: 89, pourcentage: 4, population: 317000, ratio_pour_10000: 2.8, is_desert_medical: false },
    { province: 'Moyen-Ogooué', chef_lieu: 'Lambaréné', medecins: 67, pourcentage: 3, population: 216000, ratio_pour_10000: 3.1, is_desert_medical: false },
    { province: 'Ngounié', chef_lieu: 'Mouila', medecins: 45, pourcentage: 2, population: 204000, ratio_pour_10000: 2.2, is_desert_medical: true },
    { province: 'Nyanga', chef_lieu: 'Tchibanga', medecins: 32, pourcentage: 1.5, population: 168000, ratio_pour_10000: 1.9, is_desert_medical: true },
    { province: 'Ogooué-Ivindo', chef_lieu: 'Makokou', medecins: 21, pourcentage: 1, population: 190000, ratio_pour_10000: 1.1, is_desert_medical: true },
    { province: 'Ogooué-Lolo', chef_lieu: 'Koulamoutou', medecins: 16, pourcentage: 0.7, population: 177000, ratio_pour_10000: 0.9, is_desert_medical: true },
];

// ── Speciality Stats ──
export const DEMO_SPECIALITE_STATS: SpecialiteStats[] = [
    { specialite: 'Médecine Générale', nombre: 826, pourcentage: 37.6, taux_feminisation: 30, evolution_5ans: 12 },
    { specialite: 'Gynéco-Obstétrique', nombre: 231, pourcentage: 10.5, taux_feminisation: 55, evolution_5ans: 8 },
    { specialite: 'Pédiatrie', nombre: 215, pourcentage: 9.8, taux_feminisation: 60, evolution_5ans: 10 },
    { specialite: 'Chirurgie Dentaire', nombre: 189, pourcentage: 8.6, taux_feminisation: 45, evolution_5ans: 6 },
    { specialite: 'Cardiologie', nombre: 75, pourcentage: 3.4, taux_feminisation: 25, evolution_5ans: 15 },
    { specialite: 'Autres', nombre: 661, pourcentage: 30.1, taux_feminisation: 35, evolution_5ans: 9 },
];

// ── BI Charts Data ──
export const DEMO_INSCRIPTIONS_MONTHLY: InscriptionMonthly[] = [
    { mois: 'Sep', soumis: 45, valides: 38 }, { mois: 'Oct', soumis: 52, valides: 44 },
    { mois: 'Nov', soumis: 38, valides: 35 }, { mois: 'Déc', soumis: 60, valides: 50 },
    { mois: 'Jan', soumis: 55, valides: 48 }, { mois: 'Fév', soumis: 42, valides: 36 },
];

export const DEMO_AGE_PYRAMID: AgePyramidEntry[] = [
    { tranche: '<30', hommes: 85, femmes: 65 }, { tranche: '30-39', hommes: 280, femmes: 185 },
    { tranche: '40-49', hommes: 350, femmes: 210 }, { tranche: '50-59', hommes: 320, femmes: 150 },
    { tranche: '60+', hommes: 380, femmes: 172 },
];

export const DEMO_FEMINISATION: FeminisationEntry[] = [
    { annee: 2016, taux: 28 }, { annee: 2018, taux: 30 }, { annee: 2020, taux: 32 },
    { annee: 2022, taux: 33.5 }, { annee: 2024, taux: 34.2 }, { annee: 2026, taux: 35 },
];

export const DEMO_FLUX_ANNUELS: FluxAnnuelEntry[] = [
    { annee: 2021, inscriptions: 120, radiations: 5, deces: 8, retraites: 15 },
    { annee: 2022, inscriptions: 135, radiations: 3, deces: 6, retraites: 18 },
    { annee: 2023, inscriptions: 142, radiations: 4, deces: 7, retraites: 20 },
    { annee: 2024, inscriptions: 155, radiations: 2, deces: 5, retraites: 22 },
    { annee: 2025, inscriptions: 168, radiations: 3, deces: 9, retraites: 25 },
];

// ── Financial Data ──
export const DEMO_FINANCIAL_SUMMARY: FinancialSummary = {
    recettes_totales: 156400000,
    taux_recouvrement: 72.4,
    impayes_total: 42800000,
    cotisations_mois_courant: 18500000,
    comparaison_n_moins_1: 12,
};

export const DEMO_MONTHLY_REVENUE: MonthlyRevenue[] = [
    { mois: 'Sep', cotisations: 14200000, inscriptions: 2500000, total: 16700000 },
    { mois: 'Oct', cotisations: 15800000, inscriptions: 3000000, total: 18800000 },
    { mois: 'Nov', cotisations: 12100000, inscriptions: 1500000, total: 13600000 },
    { mois: 'Déc', cotisations: 16500000, inscriptions: 3500000, total: 20000000 },
    { mois: 'Jan', cotisations: 17200000, inscriptions: 2800000, total: 20000000 },
    { mois: 'Fév', cotisations: 18500000, inscriptions: 2200000, total: 20700000 },
];

export const DEMO_UNPAID_BREAKDOWN: UnpaidBreakdown[] = [
    { duree: '1-3 mois', nombre: 125, montant: 15000000 },
    { duree: '3-6 mois', nombre: 78, montant: 9360000 },
    { duree: '6-12 mois', nombre: 45, montant: 10800000 },
    { duree: '>12 mois', nombre: 32, montant: 7680000 },
];

// ── Alerts ──
export const DEMO_ALERTS: AlertPresidentielle[] = [
    { id: 'alert-1', type: 'escalade', priorite: 'critique', titre: '3 dossiers en escalade nécessitent votre validation finale', message: 'La Commission a transmis 3 dossiers nécessitant un arbitrage présidentiel.', lien_action: 'validation', created_at: '2026-02-08T10:00:00Z' },
    { id: 'alert-2', type: 'financier', priorite: 'haute', titre: '1 médecin avec cotisation en retard > 12 mois', message: 'Dr. XXXXX (N°0892) — retard de cotisation supérieur à 12 mois. Signalement au bureau national requis.', lien_action: 'cotisations', created_at: '2026-02-08T09:00:00Z' },
    { id: 'alert-3', type: 'disciplinaire', priorite: 'critique', titre: 'Décision disciplinaire en attente de confirmation', message: 'La chambre disciplinaire a prononcé une suspension. Votre confirmation est requise.', lien_action: 'disciplinaire', created_at: '2026-02-07T15:00:00Z' },
    { id: 'alert-4', type: 'statut', priorite: 'haute', titre: '2 demandes de changement de statut à valider', message: 'Demande de passage en retraité et suspension disciplinaire en attente de validation.', lien_action: 'statuts', created_at: '2026-02-07T11:00:00Z' },
];

// ── Activity Feed ──
export const DEMO_ACTIVITY_FEED: ActivityFeedItem[] = [
    { id: 'act-1', time: '14:32', icon: '✅', message: 'Dr. MBOUMBA validé par Commission (N° Ordre 2198)', type: 'validation' },
    { id: 'act-2', time: '14:15', icon: '💰', message: '12 cotisations reçues ce jour — Total: 1 200 000 FCFA', type: 'paiement' },
    { id: 'act-3', time: '13:48', icon: '📁', message: 'Nouveau dossier soumis : Dr. NDONG OBAME (Médecine Générale)', type: 'dossier' },
    { id: 'act-4', time: '13:01', icon: '🔄', message: 'Changement de statut : Dr. EKOMI → Retraité (validé par SG)', type: 'statut' },
    { id: 'act-5', time: '12:30', icon: '📱', message: 'Scan QR code #4521 — Dr. MOUSSAVOU vérifié à Port-Gentil', type: 'verification' },
    { id: 'act-6', time: '11:45', icon: '✅', message: 'Dr. KOUMBA F. validé par Commission (N° Ordre 2197)', type: 'validation' },
    { id: 'act-7', time: '11:12', icon: '💰', message: 'Cotisation Dr. NZAMBA R. — 60 000 FCFA (Airtel Money)', type: 'paiement' },
    { id: 'act-8', time: '10:30', icon: '📁', message: 'Dossier étranger soumis : Dr. SANNI K. (Nigéria → Gabon)', type: 'dossier' },
    { id: 'act-9', time: '09:15', icon: '📱', message: 'Scan QR code #4520 — Dr. ONDO vérifié à Libreville', type: 'verification' },
    { id: 'act-10', time: '08:45', icon: '🔄', message: 'Demande changement statut : Dr. OBIANG → Suspendu', type: 'statut' },
];

// ── Validation Queue ──
export const DEMO_VALIDATION_QUEUE: ValidationDossier[] = [
    {
        id: 'val-1', candidat_nom: 'OBIANG NGUEMA', candidat_prenoms: 'Pierre', specialite: 'Chirurgie',
        type: 'national', soumis_le: '2026-01-15', etape_actuelle: 'escalade_commission', priorite: 'haute',
        motif_escalade: 'Doute sur authenticité du diplôme — vérification CAMES en cours',
        date_naissance: '1985-03-22', nationalite: 'Gabonaise', telephone: '+241 077 12 34 56',
        email: 'p.obiang@email.ga', diplome: 'Doctorat en Chirurgie', universite: 'Université de Dakar',
        annee_diplome: 2012, verification_api: 'non_verifie',
        pieces_justificatives: [{ nom: 'Diplôme', statut: 'en_attente' }, { nom: 'Casier judiciaire', statut: 'conforme' }, { nom: 'Photo identité', statut: 'conforme' }, { nom: 'CNI', statut: 'conforme' }],
        avis_agent: { date: '2026-01-20', commentaire: 'Pièces reçues, diplôme à vérifier', decision: 'Transmis à la Commission' },
        avis_commission: { date: '2026-01-28', commentaire: 'Vérification CAMES non conclusive, escalade au Président', decision: 'Escalade' },
        avis_sg: null,
        paiement_inscription: { montant: 50000, statut: 'paye', reference: 'TXN-2026-0055' },
    },
    {
        id: 'val-2', candidat_nom: 'SANNI', candidat_prenoms: 'Karim', specialite: 'Médecine Générale',
        type: 'etranger', soumis_le: '2026-01-22', etape_actuelle: 'validation_renforcee', priorite: 'moyenne',
        motif_escalade: 'Médecin étranger — validation renforcée obligatoire',
        date_naissance: '1990-07-14', nationalite: 'Nigériane', telephone: '+241 066 98 76 54',
        email: 'k.sanni@email.com', diplome: 'MBBS', universite: 'University of Lagos',
        annee_diplome: 2015, verification_api: 'verifie',
        pieces_justificatives: [{ nom: 'Diplôme', statut: 'conforme' }, { nom: 'Homologation', statut: 'conforme' }, { nom: 'CV', statut: 'conforme' }, { nom: 'Certificat de non-radiation', statut: 'conforme' }, { nom: 'Photo identité', statut: 'conforme' }],
        avis_agent: { date: '2026-01-25', commentaire: 'Dossier étranger complet, toutes pièces conformes', decision: 'Transmis à la Commission' },
        avis_commission: { date: '2026-02-01', commentaire: 'Dossier étranger — renvoyé au Président pour validation renforcée', decision: 'Validation renforcée' },
        avis_sg: { date: '2026-02-03', commentaire: 'Avis favorable', decision: 'Favorable' },
        paiement_inscription: { montant: 50000, statut: 'paye', reference: 'TXN-2026-0060' },
    },
    {
        id: 'val-3', candidat_nom: 'MINTSA MI ELLA', candidat_prenoms: 'Jeanne', specialite: 'Pédiatrie',
        type: 'national', soumis_le: '2026-02-01', etape_actuelle: 'arbitrage_sg', priorite: 'moyenne',
        motif_escalade: 'Désaccord entre Commission et SG sur la spécialité déclarée',
        date_naissance: '1988-11-30', nationalite: 'Gabonaise', telephone: '+241 074 55 66 77',
        email: 'j.mintsa@email.ga', diplome: 'Doctorat en Pédiatrie', universite: 'USS Libreville',
        annee_diplome: 2016, verification_api: 'verifie',
        pieces_justificatives: [{ nom: 'Diplôme', statut: 'conforme' }, { nom: 'Casier judiciaire', statut: 'conforme' }, { nom: 'Photo identité', statut: 'conforme' }, { nom: 'CNI', statut: 'conforme' }],
        avis_agent: { date: '2026-02-03', commentaire: 'Dossier complet', decision: 'Transmis' },
        avis_commission: { date: '2026-02-05', commentaire: 'Spécialité déclarée: Pédiatrie, diplôme mentionne Médecine Générale', decision: 'Demande arbitrage' },
        avis_sg: { date: '2026-02-06', commentaire: 'Le diplôme de spécialité en pédiatrie est un DES obtenu après le doctorat', decision: 'Favorable sous réserve arbitrage Président' },
        paiement_inscription: { montant: 50000, statut: 'paye', reference: 'TXN-2026-0062' },
    },
];

// ── Past Decisions ──
export const DEMO_PAST_DECISIONS: PresidentialDecision[] = [
    { id: 'dec-1', president_id: 'pres-001', type_decision: 'validation_inscription', reference_dossier: 'val-past-1', commentaire: undefined, candidat_nom: 'Dr. MOUSSAVOU L.', numero_ordre: 2196, created_at: '2026-02-05T14:00:00Z' },
    { id: 'dec-2', president_id: 'pres-001', type_decision: 'validation_inscription', reference_dossier: 'val-past-2', commentaire: 'Dossier étranger complet', candidat_nom: 'Dr. KOUMBA F.', numero_ordre: 2195, created_at: '2026-01-28T11:30:00Z' },
    { id: 'dec-3', president_id: 'pres-001', type_decision: 'rejet_inscription', reference_dossier: 'val-past-3', commentaire: 'Diplôme non homologué', candidat_nom: 'Dr. NZAMBA R.', numero_ordre: undefined, created_at: '2026-01-15T09:00:00Z' },
];

// ── Disciplinary ──
export const DEMO_DISCIPLINARY: DisciplinaryRecord[] = [
    { id: 'disc-1', doctor_id: 'doc-0015', type_sanction: 'suspension_temporaire', nature_infraction: 'Exercice illégal de la médecine dans un cadre non autorisé', date_decision: '2025-11-15', date_effet: '2025-12-01', duree_jours: 180, date_fin: '2026-05-30', decision_detail: 'Suspension de 6 mois prononcée par la chambre disciplinaire suite à plainte.', statut: 'en_cours', created_at: '2025-11-15T10:00:00Z', updated_at: '2025-12-01T08:00:00Z' },
    { id: 'disc-2', doctor_id: 'doc-0022', type_sanction: 'avertissement', nature_infraction: 'Non-respect du secret médical', date_decision: '2025-08-03', date_effet: '2025-08-03', duree_jours: undefined, statut: 'execute', confirme_par: 'pres-001', created_at: '2025-08-03T14:00:00Z', updated_at: '2025-08-03T14:00:00Z' },
    { id: 'disc-3', doctor_id: 'doc-0008', type_sanction: 'radiation', nature_infraction: 'Fraude documentaire avérée sur diplôme de spécialité', date_decision: '2024-03-22', date_effet: '2024-04-01', duree_jours: undefined, decision_detail: 'Radiation définitive. Diplôme de spécialité falsifié, confirmé par enquête CAMES.', statut: 'en_cours', confirme_par: 'pres-001', created_at: '2024-03-22T09:00:00Z', updated_at: '2024-04-01T08:00:00Z' },
];

// ── Status Changes ──
export const DEMO_STATUS_CHANGES: StatusChangeRequest[] = [
    { id: 'sc-1', doctor_id: 'doc-0005', ancien_statut: 'Inscrit', nouveau_statut: 'Retraité', demande_par: 'sg-001', motif: 'Départ en retraite — 65 ans atteints', statut_demande: 'en_attente', created_at: '2026-02-01T10:00:00Z', demandeur: { email: 'sg@cnom-gabon.ga', role: 'sg', name: 'Dr. Georgette NDONG' }, doctor: DEMO_DOCTORS[5] },
    { id: 'sc-2', doctor_id: 'doc-0015', ancien_statut: 'Inscrit', nouveau_statut: 'Suspendu', demande_par: 'disc-chambre', motif: 'Décision disciplinaire #2026-003 — Suspension temporaire', statut_demande: 'en_attente', created_at: '2026-02-05T14:00:00Z', demandeur: { email: 'chambre@cnom-gabon.ga', role: 'commission', name: 'Chambre Disciplinaire' }, doctor: DEMO_DOCTORS[15] },
    { id: 'sc-3', doctor_id: 'doc-0030', ancien_statut: 'Suspendu', nouveau_statut: 'Inscrit', demande_par: 'sg-001', motif: 'Fin de suspension — Réintégration après purge de sanction', statut_demande: 'en_attente', created_at: '2026-02-06T09:00:00Z', demandeur: { email: 'sg@cnom-gabon.ga', role: 'sg', name: 'Dr. Georgette NDONG' }, doctor: DEMO_DOCTORS[30] },
];

// ── Audit Logs ──
function makeAuditLogs(): AuditLog[] {
    const actions = [
        { action: 'Validation intermédiaire', module: 'M2' as const, role: 'sg', name: 'Dr. NDONG G.', detail: 'Dossier #2026-042' },
        { action: 'Modification fiche', module: 'M1' as const, role: 'agent', name: 'Agent MBOU', detail: 'Dr. MOUSSAVOU — ville changée' },
        { action: 'Paiement reçu', module: 'M4' as const, role: undefined, name: 'Système', detail: 'TXN-2026-0089 — 60 000 FCFA' },
        { action: 'Connexion Back-Office', module: 'AUTH' as const, role: 'president', name: 'Dr. OGANDAGA E.', detail: 'Connexion réussie' },
        { action: 'Export rapport PDF', module: 'M5' as const, role: 'president', name: 'Dr. OGANDAGA E.', detail: 'Rapport démographique annuel' },
        { action: 'Création fiche médecin', module: 'M1' as const, role: 'agent', name: 'Agent ESSONO', detail: 'Dr. BIYOGHE — nouvelle fiche' },
        { action: 'Vérification QR', module: 'M3' as const, role: undefined, name: 'Système', detail: 'QR #4521 — Dr. MOUSSAVOU' },
        { action: 'Rejet dossier', module: 'M2' as const, role: 'commission', name: 'Commission', detail: 'Dossier #2026-038 — diplôme non conforme' },
        { action: 'Changement statut', module: 'M1' as const, role: 'sg', name: 'Dr. NDONG G.', detail: 'Dr. EKOMI → Retraité' },
        { action: 'Cotisation manuelle', module: 'M4' as const, role: 'tresorier', name: 'Dr. MELLA-MBOUMBA', detail: 'Dr. ONDO — 120 000 FCFA' },
    ];
    const logs: AuditLog[] = [];
    for (let i = 0; i < 100; i++) {
        const a = actions[i % actions.length];
        const h = 14 - Math.floor(i / 10);
        const m = 59 - (i % 60);
        logs.push({
            id: `audit-${String(i).padStart(4, '0')}`,
            user_id: a.role ? `user-${a.role}` : undefined,
            user_role: a.role,
            user_name: a.name,
            user_email: a.role ? `${a.role}@cnom-gabon.ga` : undefined,
            action: a.action,
            module: a.module,
            detail: a.detail,
            ip_address: a.role ? '10.0.1.' + (10 + (i % 20)) : undefined,
            created_at: `2026-02-${String(8 - Math.floor(i / 20)).padStart(2, '0')}T${String(Math.max(8, h)).padStart(2, '0')}:${String(Math.max(0, m)).padStart(2, '0')}:00Z`,
        });
    }
    return logs;
}
export const DEMO_AUDIT_LOGS: AuditLog[] = makeAuditLogs();

// ── Notifications ──
export const DEMO_PRESIDENT_NOTIFICATIONS: PresidentNotification[] = [
    { id: 'pn-1', type: 'escalade', priorite: 'critique', titre: 'Dossier escaladé par la Commission — action requise', message: 'Le dossier de Dr. OBIANG NGUEMA P. a été escaladé. La Commission demande un arbitrage présidentiel.', lue: false, lien_action: 'validation', created_at: '2026-02-08T10:00:00Z' },
    { id: 'pn-2', type: 'disciplinaire', priorite: 'critique', titre: 'Nouvelle décision disciplinaire à confirmer', message: 'La chambre disciplinaire a prononcé une suspension temporaire. Votre confirmation est requise pour exécution.', lue: false, lien_action: 'disciplinaire', created_at: '2026-02-07T15:00:00Z' },
    { id: 'pn-3', type: 'statut', priorite: 'haute', titre: 'Changement de statut en attente de votre validation', message: 'Dr. EKOMI J.-P. — Demande passage Inscrit → Retraité par le SG.', lue: false, lien_action: 'statuts', created_at: '2026-02-07T11:00:00Z' },
    { id: 'pn-4', type: 'financier', priorite: 'haute', titre: 'Retard > 12 mois détecté — signalement bureau', message: 'Dr. XXXXX (N°0892) accumule un retard de cotisation de 14 mois. Signalement au bureau national requis.', lue: false, lien_action: 'cotisations', created_at: '2026-02-06T16:00:00Z' },
    { id: 'pn-5', type: 'inscription', priorite: 'moyenne', titre: 'Nouveau dossier étranger — validation renforcée', message: 'Dr. SANNI K. (nationalité nigériane) — dossier complet, en attente de validation renforcée.', lue: true, lien_action: 'validation', created_at: '2026-02-05T09:00:00Z' },
    { id: 'pn-6', type: 'systeme', priorite: 'info', titre: 'Rapport mensuel généré', message: 'Le rapport démographique de janvier 2026 est disponible au téléchargement.', lue: true, lien_action: 'analytique', created_at: '2026-02-01T08:00:00Z' },
    { id: 'pn-7', type: 'ordre', priorite: 'info', titre: 'Assemblée Générale — convocation', message: 'L\'Assemblée Générale du CNOM est prévue le 15 mars 2026. Ordre du jour en préparation.', lue: true, created_at: '2026-01-28T10:00:00Z' },
    { id: 'pn-8', type: 'systeme', priorite: 'info', titre: 'Maintenance planifiée', message: 'Maintenance du portail le 20 février 2026 de 02h à 06h.', lue: true, created_at: '2026-01-20T10:00:00Z' },
];
