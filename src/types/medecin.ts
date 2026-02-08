// types/medecin.ts — All TypeScript types for the Espace Médecin

export type DoctorStatus = 'Candidat' | 'Inscrit' | 'Suspendu' | 'Radié' | 'Retraité' | 'Décédé';
export type Genre = 'M' | 'F';
export type SecteurExercice = 'Public' | 'Privé' | 'Mixte' | 'Militaire';
export type Province = 'Estuaire' | 'Haut-Ogooué' | 'Moyen-Ogooué' | 'Ngounié' | 'Nyanga' | 'Ogooué-Ivindo' | 'Ogooué-Lolo' | 'Ogooué-Maritime' | 'Woleu-Ntem';

export interface Doctor {
    id: string;
    user_id: string;
    numero_ordre: number;
    nom: string;
    prenoms: string;
    nom_naissance?: string;
    genre: Genre;
    specialite_principale: string;
    sous_specialite?: string;
    ville_exercice: string;
    province: Province;
    adresse_cabinet?: string;
    coordonnees_gps?: { lat: number; lng: number };
    telephone_pro: string;
    email: string;
    secteur_exercice: SecteurExercice;
    etablissement?: string;
    statut: DoctorStatus;
    date_inscription: string;
    diplome_principal: string;
    universite_obtention: string;
    annee_obtention: number;
    fonctions_ordinales?: string;
    photo_url?: string;
    created_at: string;
    updated_at: string;
}

export type PaymentType = 'inscription' | 'cotisation_annuelle' | 'cotisation_semestrielle' | 'cotisation_mensuelle';
export type PaymentMethod = 'airtel_money' | 'moov_money' | 'carte_bancaire';
export type PaymentStatus = 'en_attente' | 'confirme' | 'echoue' | 'rembourse';

export interface Payment {
    id: string;
    doctor_id: string;
    type: PaymentType;
    montant: number;
    moyen_paiement: PaymentMethod;
    reference_transaction: string;
    periode_couverte_debut?: string;
    periode_couverte_fin?: string;
    statut: PaymentStatus;
    recu_pdf_url?: string;
    created_at: string;
}

export type NotificationType = 'paiement' | 'dossier' | 'carte' | 'ordre' | 'systeme';

export interface Notification {
    id: string;
    doctor_id: string;
    type: NotificationType;
    titre: string;
    message: string;
    lue: boolean;
    lien_action?: string;
    created_at: string;
}

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'documents_required' | 'rejected' | 'validated';

export interface Application {
    id: string;
    user_id: string;
    status: ApplicationStatus;
    step_current: number;
    step_total: number;
    motif_rejet?: string;
    numero_ordre_attribue?: number;
    is_etranger: boolean;
    data: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export type DocumentRequestType = 'attestation_inscription' | 'attestation_bonne_conduite' | 'caducee_numerique' | 'attestation_fiscale';
export type DocumentRequestStatus = 'en_attente' | 'generee' | 'disponible' | 'rejetee';

export interface DocumentRequest {
    id: string;
    doctor_id: string;
    type: DocumentRequestType;
    motif?: string;
    statut: DocumentRequestStatus;
    document_genere_url?: string;
    created_at: string;
    processed_at?: string;
}

export type VerificationResult = 'inscrit' | 'cotisation_retard' | 'suspendu' | 'radie';

export interface Verification {
    id: string;
    doctor_id: string;
    localisation_approx?: string;
    resultat: VerificationResult;
    created_at: string;
}

export type DocumentVerificationStatus = 'en_attente' | 'verifie' | 'rejete';

export interface DossierDocument {
    id: string;
    type: string;
    nom_fichier: string;
    statut_verification: DocumentVerificationStatus;
    motif_rejet?: string;
}

// Periodicite options for payments
export type Periodicite = 'annuel' | 'semestriel' | 'mensuel';

export interface PeriodiciteOption {
    id: Periodicite;
    label: string;
    montant: number;
    echeances: string;
    nombre_paiements: number;
}
