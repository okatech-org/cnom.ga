// lib/demo-tresorier-data.ts — Données de démonstration Espace Trésorier

import type {
    TresorierPayment, DoctorFinancialView, ReminderCampaign,
    Moratorium, TariffConfig, PenaltyConfig, FinancialKPIs,
    RecouvrementStats, TresorierAlert, TresorierNotification,
    MonthlyRevenue, PaymentMethodStat, ProvinceStat,
    DocumentRequest, TariffHistory, ReminderConfig, ProjectionScenario,
} from '@/types/tresorier';

// ────────── KPIs financiers ──────────
export const demoKPIs: FinancialKPIs = {
    recettes_totales: 127_500_000,
    recettes_cotisations: 89_200_000,
    recettes_inscriptions: 38_300_000,
    taux_recouvrement: 70.2,
    taux_recouvrement_objectif: 85,
    impayes_total: 38_300_000,
    impayes_nombre_medecins: 78,
    paiements_aujourd_hui: 12,
    montant_aujourd_hui: 720_000,
    medecins_a_jour: 245,
    medecins_total_actifs: 323,
    moratoires_actifs: 5,
    relances_en_cours: 42,
    comparaison_n_moins_1: 18.2,
    potentiel_maximal: 193_800_000,
};

// ────────── Recouvrement ──────────
export const demoRecouvrementStats: RecouvrementStats = {
    total_redevable: 193_800_000,
    total_paye: 127_500_000,
    retard_1_3_mois: { nombre: 32, montant: 3_840_000 },
    retard_3_6_mois: { nombre: 21, montant: 6_300_000 },
    retard_6_12_mois: { nombre: 15, montant: 10_800_000 },
    retard_plus_12_mois: { nombre: 10, montant: 17_360_000 },
};

// ────────── Revenus mensuels ──────────
export const demoMonthlyRevenue: MonthlyRevenue[] = [
    { mois: 'Jan', cotisations: 12_400_000, inscriptions: 5_200_000, total: 17_600_000, annee_precedente: 14_200_000 },
    { mois: 'Fév', cotisations: 15_800_000, inscriptions: 4_800_000, total: 20_600_000, annee_precedente: 16_900_000 },
    { mois: 'Mar', cotisations: 11_200_000, inscriptions: 3_600_000, total: 14_800_000, annee_precedente: 13_100_000 },
    { mois: 'Avr', cotisations: 9_800_000, inscriptions: 4_200_000, total: 14_000_000, annee_precedente: 11_800_000 },
    { mois: 'Mai', cotisations: 13_600_000, inscriptions: 6_100_000, total: 19_700_000, annee_precedente: 15_400_000 },
    { mois: 'Jun', cotisations: 10_400_000, inscriptions: 3_800_000, total: 14_200_000, annee_precedente: 12_200_000 },
    { mois: 'Jul', cotisations: 8_200_000, inscriptions: 3_200_000, total: 11_400_000, annee_precedente: 9_800_000 },
    { mois: 'Aoû', cotisations: 7_800_000, inscriptions: 2_800_000, total: 10_600_000, annee_precedente: 8_700_000 },
    { mois: 'Sep', cotisations: 0, inscriptions: 0, total: 0, annee_precedente: 10_200_000 },
    { mois: 'Oct', cotisations: 0, inscriptions: 0, total: 0, annee_precedente: 11_500_000 },
    { mois: 'Nov', cotisations: 0, inscriptions: 0, total: 0, annee_precedente: 13_800_000 },
    { mois: 'Déc', cotisations: 0, inscriptions: 0, total: 0, annee_precedente: 14_900_000 },
];

// ────────── Répartition méthodes de paiement ──────────
export const demoPaymentMethods: PaymentMethodStat[] = [
    { method: 'airtel_money', label: 'Airtel Money', pourcentage: 42, montant: 53_550_000, color: '#ef4444' },
    { method: 'moov_money', label: 'Moov Money', pourcentage: 33, montant: 42_075_000, color: '#3b82f6' },
    { method: 'virement_bancaire', label: 'Virement bancaire', pourcentage: 15, montant: 19_125_000, color: '#8b5cf6' },
    { method: 'carte_bancaire', label: 'Carte bancaire', pourcentage: 7, montant: 8_925_000, color: '#f59e0b' },
    { method: 'especes', label: 'Espèces', pourcentage: 3, montant: 3_825_000, color: '#6b7280' },
];

// ────────── Provinces ──────────
export const demoProvinceStats: ProvinceStat[] = [
    { province: 'Estuaire', medecins_actifs: 142, a_jour: 112, en_retard: 30, taux_recouvrement: 78.9, montant_percu: 56_800_000 },
    { province: 'Haut-Ogooué', medecins_actifs: 45, a_jour: 32, en_retard: 13, taux_recouvrement: 71.1, montant_percu: 18_000_000 },
    { province: 'Ogooué-Maritime', medecins_actifs: 38, a_jour: 25, en_retard: 13, taux_recouvrement: 65.8, montant_percu: 15_200_000 },
    { province: 'Woleu-Ntem', medecins_actifs: 28, a_jour: 22, en_retard: 6, taux_recouvrement: 78.6, montant_percu: 11_200_000 },
    { province: 'Moyen-Ogooué', medecins_actifs: 22, a_jour: 17, en_retard: 5, taux_recouvrement: 77.3, montant_percu: 8_800_000 },
    { province: 'Ngounié', medecins_actifs: 18, a_jour: 13, en_retard: 5, taux_recouvrement: 72.2, montant_percu: 7_200_000 },
    { province: 'Nyanga', medecins_actifs: 14, a_jour: 11, en_retard: 3, taux_recouvrement: 78.6, montant_percu: 5_600_000 },
    { province: 'Ogooué-Ivindo', medecins_actifs: 10, a_jour: 8, en_retard: 2, taux_recouvrement: 80.0, montant_percu: 3_200_000 },
    { province: 'Ogooué-Lolo', medecins_actifs: 6, a_jour: 5, en_retard: 1, taux_recouvrement: 83.3, montant_percu: 1_500_000 },
];

// ────────── Paiements récents ──────────
export const demoRecentPayments: TresorierPayment[] = [
    {
        id: 'PAY-2026-001', doctor_id: 'D001', amount: 60_000,
        payment_type: 'cotisation_semestrielle', payment_status: 'confirmed',
        payment_method: 'airtel_money', transaction_ref: 'AM-240208-001',
        exercice_fiscal: 2026, paid_at: '2026-02-08T14:30:00', receipt_number: 'REC-2026-0145',
        penalite_amount: 0, is_manual: false, created_at: '2026-02-08T14:30:00',
        doctor: { id: 'D001', numero_ordre: 1245, nom: 'MOUELE', prenoms: 'Jean-Pierre', specialite: 'Chirurgie', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'a_jour', dernier_paiement: '2026-02-08', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: false },
    },
    {
        id: 'PAY-2026-002', doctor_id: 'D002', amount: 50_000,
        payment_type: 'inscription', payment_status: 'confirmed',
        payment_method: 'moov_money', transaction_ref: 'MM-240207-003',
        exercice_fiscal: 2026, paid_at: '2026-02-07T10:15:00', receipt_number: 'REC-2026-0144',
        penalite_amount: 0, is_manual: false, created_at: '2026-02-07T10:15:00',
        doctor: { id: 'D002', numero_ordre: 1312, nom: 'ONDO NDONG', prenoms: 'Marie-Claire', specialite: 'Pédiatrie', province: 'Estuaire', ville: 'Libreville', secteur: 'public', statut: 'actif', cotisation_status: 'a_jour', dernier_paiement: '2026-02-07', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: false },
    },
    {
        id: 'PAY-2026-003', doctor_id: 'D003', amount: 60_000,
        payment_type: 'cotisation_semestrielle', payment_status: 'pending',
        payment_method: 'virement_bancaire', transaction_ref: 'VB-240206-001',
        exercice_fiscal: 2026, paid_at: undefined, receipt_number: undefined,
        penalite_amount: 0, is_manual: false, created_at: '2026-02-06T16:45:00',
        doctor: { id: 'D003', numero_ordre: 1089, nom: 'NZUE OBAME', prenoms: 'Paul', specialite: 'Cardiologie', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_leger', dernier_paiement: '2025-11-15', montant_du: 60_000, retard_mois: 3, niveau_relance: 1, sous_moratoire: false },
    },
    {
        id: 'PAY-2026-004', doctor_id: 'D004', amount: 120_000,
        payment_type: 'cotisation_annuelle', payment_status: 'confirmed',
        payment_method: 'airtel_money', transaction_ref: 'AM-240206-002',
        exercice_fiscal: 2026, paid_at: '2026-02-06T09:20:00', receipt_number: 'REC-2026-0143',
        penalite_amount: 0, is_manual: false, created_at: '2026-02-06T09:20:00',
        doctor: { id: 'D004', numero_ordre: 998, nom: 'BONGO', prenoms: 'Stéphane', specialite: 'Médecine Générale', province: 'Haut-Ogooué', ville: 'Franceville', secteur: 'public', statut: 'actif', cotisation_status: 'a_jour', dernier_paiement: '2026-02-06', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: false },
    },
    {
        id: 'PAY-2026-005', doctor_id: 'D005', amount: 60_000,
        payment_type: 'cotisation_semestrielle', payment_status: 'failed',
        payment_method: 'moov_money', transaction_ref: 'MM-240205-007',
        exercice_fiscal: 2026, paid_at: undefined, receipt_number: undefined,
        penalite_amount: 0, is_manual: false, created_at: '2026-02-05T18:10:00',
        doctor: { id: 'D005', numero_ordre: 1178, nom: 'EKOME', prenoms: 'Angélique', specialite: 'Gynécologie-Obstétrique', province: 'Ogooué-Maritime', ville: 'Port-Gentil', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_leger', dernier_paiement: '2025-10-20', montant_du: 60_000, retard_mois: 4, niveau_relance: 2, sous_moratoire: false },
    },
    {
        id: 'PAY-2026-006', doctor_id: 'D006', amount: 10_000,
        payment_type: 'cotisation_mensuelle', payment_status: 'confirmed',
        payment_method: 'airtel_money', transaction_ref: 'AM-240205-003',
        exercice_fiscal: 2026, paid_at: '2026-02-05T11:45:00', receipt_number: 'REC-2026-0142',
        penalite_amount: 0, is_manual: false, created_at: '2026-02-05T11:45:00',
        doctor: { id: 'D006', numero_ordre: 1402, nom: 'MAMBOUNDOU', prenoms: 'Serge-Leslie', specialite: 'Dermatologie', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'a_jour', dernier_paiement: '2026-02-05', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: false },
    },
    {
        id: 'PAY-2026-007', doctor_id: 'D007', amount: 60_000,
        payment_type: 'cotisation_semestrielle', payment_status: 'confirmed',
        payment_method: 'carte_bancaire', transaction_ref: 'CB-240204-001',
        exercice_fiscal: 2026, paid_at: '2026-02-04T15:00:00', receipt_number: 'REC-2026-0141',
        penalite_amount: 0, is_manual: false, created_at: '2026-02-04T15:00:00',
        doctor: { id: 'D007', numero_ordre: 887, nom: 'NTOUTOUME', prenoms: 'Fabrice', specialite: 'Ophtalmologie', province: 'Woleu-Ntem', ville: 'Oyem', secteur: 'public', statut: 'actif', cotisation_status: 'a_jour', dernier_paiement: '2026-02-04', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: false },
    },
    {
        id: 'PAY-2026-008', doctor_id: 'D008', amount: 72_000,
        payment_type: 'regularisation', payment_status: 'confirmed',
        payment_method: 'especes', transaction_ref: 'ESP-240203-001',
        exercice_fiscal: 2026, paid_at: '2026-02-03T09:30:00', receipt_number: 'REC-2026-0140',
        penalite_amount: 12_000, is_manual: true, manual_justification: 'Paiement en espèces au guichet — régularisation S2 2025',
        created_at: '2026-02-03T09:30:00',
        doctor: { id: 'D008', numero_ordre: 1056, nom: 'ASSOUMOU', prenoms: 'Blanche', specialite: 'Psychiatrie', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_leger', dernier_paiement: '2026-02-03', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: false },
    },
];

// ────────── Médecins impayés ──────────
export const demoUnpaidDoctors: DoctorFinancialView[] = [
    { id: 'U001', numero_ordre: 756, nom: 'OBAME ESSONO', prenoms: 'Albert', specialite: 'Médecine Générale', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_critique', dernier_paiement: '2024-08-15', montant_du: 240_000, retard_mois: 18, niveau_relance: 5, sous_moratoire: false },
    { id: 'U002', numero_ordre: 891, nom: 'MBOUMBA NZIGOU', prenoms: 'Claire', specialite: 'Chirurgie', province: 'Haut-Ogooué', ville: 'Franceville', secteur: 'public', statut: 'actif', cotisation_status: 'retard_critique', dernier_paiement: '2025-01-10', montant_du: 180_000, retard_mois: 13, niveau_relance: 4, sous_moratoire: false },
    { id: 'U003', numero_ordre: 1023, nom: 'ESSONO NGUEMA', prenoms: 'Denis', specialite: 'Pédiatrie', province: 'Ogooué-Maritime', ville: 'Port-Gentil', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_moyen', dernier_paiement: '2025-05-20', montant_du: 120_000, retard_mois: 9, niveau_relance: 3, sous_moratoire: false },
    { id: 'U004', numero_ordre: 1134, nom: 'NDONG MBA', prenoms: 'Félicienne', specialite: 'Cardiologie', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_moyen', dernier_paiement: '2025-06-30', montant_du: 100_000, retard_mois: 8, niveau_relance: 3, sous_moratoire: false },
    { id: 'U005', numero_ordre: 1256, nom: 'KOMBILA', prenoms: 'Armand', specialite: 'ORL', province: 'Woleu-Ntem', ville: 'Oyem', secteur: 'public', statut: 'actif', cotisation_status: 'retard_moyen', dernier_paiement: '2025-07-15', montant_du: 80_000, retard_mois: 7, niveau_relance: 2, sous_moratoire: false },
    { id: 'U006', numero_ordre: 1345, nom: 'BIBANG BI NDONG', prenoms: 'Sandrine', specialite: 'Radiologie', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_leger', dernier_paiement: '2025-09-01', montant_du: 60_000, retard_mois: 5, niveau_relance: 2, sous_moratoire: false },
    { id: 'U007', numero_ordre: 1389, nom: 'ZOGO', prenoms: 'Fernand', specialite: 'Médecine Générale', province: 'Ngounié', ville: 'Mouila', secteur: 'public', statut: 'actif', cotisation_status: 'retard_leger', dernier_paiement: '2025-10-05', montant_du: 50_000, retard_mois: 4, niveau_relance: 1, sous_moratoire: false },
    { id: 'U008', numero_ordre: 1412, nom: 'ELLA MBA', prenoms: 'Josiane', specialite: 'Gynécologie-Obstétrique', province: 'Haut-Ogooué', ville: 'Franceville', secteur: 'privé', statut: 'actif', cotisation_status: 'retard_leger', dernier_paiement: '2025-11-20', montant_du: 30_000, retard_mois: 3, niveau_relance: 1, sous_moratoire: false },
];

// ────────── Moratoires ──────────
export const demoMoratoriums: Moratorium[] = [
    {
        id: 'MOR-001', doctor_id: 'M001', date_debut: '2025-09-01', date_fin: '2026-09-01',
        duree_mois: 12, motif: 'nouveau_diplome', commentaire: 'Internat terminé en juin 2025',
        approuve_par: 'Bureau CNOM', statut: 'actif', created_at: '2025-08-20',
        doctor: { id: 'M001', numero_ordre: 1456, nom: 'OYANE ONDO', prenoms: 'Cécile', specialite: 'Anesthésie-Réanimation', province: 'Estuaire', ville: 'Libreville', secteur: 'public', statut: 'actif', cotisation_status: 'moratoire', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: true },
    },
    {
        id: 'MOR-002', doctor_id: 'M002', date_debut: '2025-06-01', date_fin: '2026-06-01',
        duree_mois: 12, motif: 'cas_social', commentaire: 'Congé longue maladie',
        approuve_par: 'Bureau CNOM', statut: 'actif', created_at: '2025-05-15',
        doctor: { id: 'M002', numero_ordre: 1201, nom: 'MENGUE M\'OBIANG', prenoms: 'Patrick', specialite: 'Médecine Interne', province: 'Estuaire', ville: 'Libreville', secteur: 'privé', statut: 'actif', cotisation_status: 'moratoire', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: true },
    },
    {
        id: 'MOR-003', doctor_id: 'M003', date_debut: '2026-01-01', date_fin: '2027-01-01',
        duree_mois: 12, motif: 'nouveau_diplome', commentaire: 'Premier exercice au Gabon',
        approuve_par: 'Bureau CNOM', statut: 'actif', created_at: '2025-12-20',
        doctor: { id: 'M003', numero_ordre: 1478, nom: 'AKAGHA EKOGA', prenoms: 'Didier', specialite: 'Neurologie', province: 'Estuaire', ville: 'Libreville', secteur: 'public', statut: 'actif', cotisation_status: 'moratoire', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: true },
    },
    {
        id: 'MOR-004', doctor_id: 'M004', date_debut: '2025-03-01', date_fin: '2026-03-01',
        duree_mois: 12, motif: 'cas_social',
        approuve_par: 'Présidente', statut: 'actif', created_at: '2025-02-15',
        doctor: { id: 'M004', numero_ordre: 967, nom: 'BIYOGHE BI NTOUGOU', prenoms: 'Jeanne', specialite: 'Psychiatrie', province: 'Ogooué-Maritime', ville: 'Port-Gentil', secteur: 'privé', statut: 'actif', cotisation_status: 'moratoire', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: true },
    },
    {
        id: 'MOR-005', doctor_id: 'M005', date_debut: '2025-10-01', date_fin: '2026-04-01',
        duree_mois: 6, motif: 'prolongation_exceptionnelle', prolongation_de: 'MOR-001-OLD',
        commentaire: 'Extension exceptionnelle pour raison humanitaire',
        approuve_par: 'Bureau CNOM', statut: 'actif', created_at: '2025-09-25',
        doctor: { id: 'M005', numero_ordre: 1102, nom: 'NGOVOGUI', prenoms: 'Samuel', specialite: 'Orthopédie', province: 'Haut-Ogooué', ville: 'Moanda', secteur: 'public', statut: 'actif', cotisation_status: 'moratoire', montant_du: 0, retard_mois: 0, niveau_relance: 0, sous_moratoire: true },
    },
];

// ────────── Barèmes ──────────
export const demoTariffs: TariffConfig[] = [
    { id: 'T01', code: 'INS-001', libelle: "Droits d'inscription — Médecin", montant: 50_000, actif: true, date_effet: '2024-01-01' },
    { id: 'T02', code: 'COT-ANN', libelle: 'Cotisation annuelle', montant: 120_000, periodicite: 'annuelle', actif: true, date_effet: '2024-01-01' },
    { id: 'T03', code: 'COT-SEM', libelle: 'Cotisation semestrielle', montant: 60_000, periodicite: 'semestrielle', actif: true, date_effet: '2024-01-01' },
    { id: 'T04', code: 'COT-MEN', libelle: 'Cotisation mensuelle', montant: 10_000, periodicite: 'mensuelle', actif: true, date_effet: '2024-01-01' },
    { id: 'T05', code: 'INS-SPE', libelle: "Droits d'inscription — Spécialiste", montant: 75_000, actif: true, date_effet: '2024-01-01' },
];

export const demoPenaltyConfig: PenaltyConfig[] = [
    { id: 'PEN-01', tranche_debut_mois: 0, tranche_fin_mois: 3, taux_penalite: 0, actif: true },
    { id: 'PEN-02', tranche_debut_mois: 3, tranche_fin_mois: 6, taux_penalite: 5, plafond_montant: 30_000, actif: true },
    { id: 'PEN-03', tranche_debut_mois: 6, tranche_fin_mois: 12, taux_penalite: 10, plafond_montant: 30_000, actif: true },
    { id: 'PEN-04', tranche_debut_mois: 12, taux_penalite: 15, plafond_montant: 30_000, actif: true },
];

// ────────── Campagnes de relance ──────────
export const demoCampaigns: ReminderCampaign[] = [
    {
        id: 'CAMP-001', titre: 'Relance S1 2026 — Retards > 6 mois',
        description: 'Campagne ciblée pour les médecins avec un retard supérieur à 6 mois',
        cible_criteria: { retard_min_mois: 6 }, channels: ['sms', 'email'],
        message_template: 'Dr {nom}, votre cotisation CNOM est en retard de {mois} mois. Montant dû: {montant}. Régularisez-vous via e-CNOM.',
        total_targeted: 25, total_sent: 25, total_delivered: 23, total_opened: 18,
        total_resulted_payment: 7, total_revenue_generated: 840_000,
        status: 'completed', launched_by: 'Dr MELLA-MBOUMBA',
        created_at: '2026-01-15', completed_at: '2026-01-20',
    },
    {
        id: 'CAMP-002', titre: 'Rappel bienveillant — Retards 1-3 mois',
        cible_criteria: { retard_min_mois: 1, retard_max_mois: 3 }, channels: ['push'],
        message_template: 'Rappel amical : votre cotisation CNOM pour le S1 2026 est à régler. Merci !',
        total_targeted: 32, total_sent: 32, total_delivered: 30, total_opened: 22,
        total_resulted_payment: 12, total_revenue_generated: 720_000,
        status: 'completed', launched_by: 'Dr MELLA-MBOUMBA',
        created_at: '2026-01-25', completed_at: '2026-01-28',
    },
    {
        id: 'CAMP-003', titre: 'Alerte critique — Retards > 12 mois',
        cible_criteria: { retard_min_mois: 12 }, channels: ['sms', 'email', 'push'],
        message_template: 'URGENT — Dr {nom}, votre cotisation est impayée depuis {mois} mois. Sans régularisation, une signalisation au Bureau sera effectuée.',
        total_targeted: 10, total_sent: 10, total_delivered: 9, total_opened: 8,
        total_resulted_payment: 2, total_revenue_generated: 480_000,
        status: 'completed', launched_by: 'Dr MELLA-MBOUMBA',
        created_at: '2026-02-01', completed_at: '2026-02-05',
    },
];

// ────────── Alertes financières ──────────
export const demoAlerts: TresorierAlert[] = [
    { id: 'A1', type: 'critique', icon: '🚨', message: '3 paiements échoués dans les dernières 24h', action: 'Voir l\'historique', actionTab: 'historique' },
    { id: 'A2', type: 'warning', icon: '⚠️', message: 'Taux de recouvrement à 70.2% — objectif S1 : 85%', action: 'Plan de recouvrement', actionTab: 'recouvrement' },
    { id: 'A3', type: 'info', icon: '📈', message: '12 paiements reçus aujourd\'hui (+720 000 FCFA)', action: undefined, actionTab: undefined },
    { id: 'A4', type: 'action', icon: '📋', message: '2 moratoires expirent dans les 30 prochains jours', action: 'Gérer les moratoires', actionTab: 'moratoires' },
];

// ────────── Notifications trésorier ──────────
export const demoNotifications: TresorierNotification[] = [
    { id: 'N01', type: 'paiement_recu', titre: 'Paiement reçu', message: 'Dr MOUELE Jean-Pierre — 60 000 FCFA (Cotisation S1) via Airtel Money', priorite: 'info', lue: false, date: '2026-02-08T14:30:00', lien_tab: 'historique' },
    { id: 'N02', type: 'paiement_echoue', titre: 'Paiement échoué', message: 'Dr EKOME Angélique — 60 000 FCFA via Moov Money (timeout opérateur)', priorite: 'haute', lue: false, date: '2026-02-05T18:10:00', lien_tab: 'historique' },
    { id: 'N03', type: 'impaye_critique', titre: 'Impayé critique', message: 'Dr OBAME ESSONO Albert — retard 18 mois (240 000 FCFA) — niveau relance 5', priorite: 'critique', lue: false, date: '2026-02-08T08:00:00', lien_tab: 'impayes' },
    { id: 'N04', type: 'seuil_recouvrement', titre: 'Seuil recouvrement', message: 'Le taux de recouvrement S1 2026 a franchi 70% (objectif: 85%)', priorite: 'moyenne', lue: true, date: '2026-02-07T09:00:00', lien_tab: 'dashboard' },
    { id: 'N05', type: 'moratoire_expire', titre: 'Moratoire bientôt expiré', message: 'Le moratoire de Dr BIYOGHE BI NTOUGOU Jeanne expire le 01/03/2026', priorite: 'haute', lue: false, date: '2026-02-06T10:00:00', lien_tab: 'moratoires' },
    { id: 'N06', type: 'relance_envoyee', titre: 'Relance envoyée', message: 'Campagne "Alerte critique" terminée : 10 médecins ciblés, 2 paiements résultants', priorite: 'info', lue: true, date: '2026-02-05T16:00:00', lien_tab: 'relances' },
    { id: 'N07', type: 'saisie_manuelle', titre: 'Saisie manuelle', message: 'Paiement espèces enregistré pour Dr ASSOUMOU Blanche — 72 000 FCFA', priorite: 'moyenne', lue: true, date: '2026-02-03T09:35:00', lien_tab: 'saisie' },
    { id: 'N08', type: 'rapport_genere', titre: 'Rapport disponible', message: 'Le rapport financier de janvier 2026 est prêt à télécharger', priorite: 'info', lue: true, date: '2026-02-01T12:00:00', lien_tab: 'rapport' },
    { id: 'N09', type: 'systeme', titre: 'Mise à jour système', message: 'Le webhook Airtel Money a été reconnecté après une interruption de 15 min', priorite: 'info', lue: true, date: '2026-01-31T22:45:00' },
];

// ────────── Document Requests ──────────
export const demoDocumentRequests: DocumentRequest[] = [
    { id: 'DOC-001', doctor_name: 'Dr MOUELE Jean-Pierre', document_type: 'Attestation de cotisation', requested_at: '2026-02-08T10:00:00', status: 'en_attente' },
    { id: 'DOC-002', doctor_name: 'Dr BONGO Stéphane', document_type: 'Reçu de paiement n° REC-2026-0143', requested_at: '2026-02-06T11:00:00', status: 'genere' },
    { id: 'DOC-003', doctor_name: 'Dr NTOUTOUME Fabrice', document_type: 'Relevé annuel 2025', requested_at: '2026-02-04T09:30:00', status: 'envoye' },
    { id: 'DOC-004', doctor_name: 'Dr ONDO NDONG Marie-Claire', document_type: 'Attestation de cotisation', requested_at: '2026-02-03T14:15:00', status: 'en_attente' },
];

// ────────── Tariff History ──────────
export const demoTariffHistory: TariffHistory[] = [
    { date: '2024-01-01', modification: 'Création barème initial', ancien: '—', nouveau: '120 000 FCFA/an', valide_par: 'Bureau CNOM' },
    { date: '2024-01-01', modification: 'Ajout cotisation mensuelle', ancien: '—', nouveau: '10 000 FCFA/mois', valide_par: 'Bureau CNOM' },
    { date: '2024-06-15', modification: "Droits inscription spécialiste", ancien: '50 000 FCFA', nouveau: '75 000 FCFA', valide_par: 'Assemblée Générale' },
];

// ────────── Reminder Config ──────────
export const demoReminderConfig: ReminderConfig[] = [
    { id: 'R1', label: 'Niveau 1 — Rappel bienveillant', delai: 'J+30 après échéance', channels: { sms: false, email: true, push: true }, message: 'Rappel : votre cotisation CNOM est à régler.' },
    { id: 'R2', label: 'Niveau 2 — Relance formelle', delai: 'J+90 après échéance', channels: { sms: true, email: true, push: true }, message: 'Votre cotisation est impayée depuis 3 mois.' },
    { id: 'R3', label: 'Niveau 3 — Mise en demeure', delai: 'J+180 après échéance', channels: { sms: true, email: true, push: false }, message: 'MISE EN DEMEURE — Régularisez votre situation.' },
    { id: 'R4', label: 'Niveau 4 — Signalement Bureau', delai: 'J+365 après échéance', channels: { sms: true, email: true, push: false }, message: 'Signalement au Bureau du CNOM imminent.' },
];

// ────────── Projections ──────────
export const demoProjections: ProjectionScenario[] = [
    { label: 'Pessimiste', taux_recouvrement: 72, recettes_prevues: 139_536_000, ecart_vs_budget: -54_264_000 },
    { label: 'Réaliste', taux_recouvrement: 80, recettes_prevues: 155_040_000, ecart_vs_budget: -38_760_000 },
    { label: 'Optimiste', taux_recouvrement: 90, recettes_prevues: 174_420_000, ecart_vs_budget: -19_380_000 },
];

// ────────── Recovery rate evolution ──────────
export const demoRecoveryRateEvolution = [
    { mois: 'Mar 25', taux: 52 },
    { mois: 'Avr 25', taux: 55 },
    { mois: 'Mai 25', taux: 58 },
    { mois: 'Jun 25', taux: 61 },
    { mois: 'Jul 25', taux: 59 },
    { mois: 'Aoû 25', taux: 62 },
    { mois: 'Sep 25', taux: 64 },
    { mois: 'Oct 25', taux: 66 },
    { mois: 'Nov 25', taux: 67 },
    { mois: 'Déc 25', taux: 68 },
    { mois: 'Jan 26', taux: 69 },
    { mois: 'Fév 26', taux: 70.2 },
];
