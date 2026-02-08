-- =============================================
-- CNOM Gabon - Système d'inscription des médecins
-- =============================================

-- 1. Types ENUM pour les statuts
CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'under_review', 'validated', 'rejected');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.payment_type AS ENUM ('inscription', 'cotisation_semestrielle', 'autre');
CREATE TYPE public.document_type AS ENUM ('photo_identite_1', 'photo_identite_2', 'diplome', 'casier_judiciaire', 'cv', 'homologation', 'lettre_inscription', 'autre');
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'approver', 'treasurer');
CREATE TYPE public.sector_type AS ENUM ('public', 'prive', 'mixte', 'militaire');
CREATE TYPE public.gender_type AS ENUM ('M', 'F');

-- 2. Table des profils médecins
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    -- Identité
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    nom_naissance TEXT,
    genre gender_type NOT NULL,
    date_naissance DATE NOT NULL,
    lieu_naissance TEXT NOT NULL,
    nationalite TEXT NOT NULL,
    -- Coordonnées
    email TEXT NOT NULL,
    telephone TEXT NOT NULL,
    adresse TEXT NOT NULL,
    ville TEXT NOT NULL,
    province TEXT NOT NULL,
    -- Diplômes
    diplome TEXT NOT NULL,
    universite TEXT NOT NULL,
    annee_obtention INTEGER NOT NULL,
    pays_obtention TEXT NOT NULL,
    specialite TEXT NOT NULL,
    sous_specialite TEXT,
    -- Exercice
    secteur sector_type NOT NULL,
    etablissement TEXT,
    adresse_cabinet TEXT,
    ville_cabinet TEXT NOT NULL,
    -- Numéro d'ordre (attribué après validation)
    numero_ordre TEXT UNIQUE,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table des documents justificatifs
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    document_type document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(profile_id, document_type)
);

-- 4. Table des demandes d'inscription
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    status application_status NOT NULL DEFAULT 'draft',
    submission_date TIMESTAMPTZ,
    validation_date TIMESTAMPTZ,
    rejection_reason TEXT,
    validated_by UUID REFERENCES auth.users(id),
    numero_dossier TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Table des paiements
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_type payment_type NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT, -- 'airtel_money', 'moov_money', 'bank_transfer'
    transaction_id TEXT UNIQUE,
    description TEXT,
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Table des rôles administrateurs (séparée des profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role admin_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- =============================================
-- FONCTIONS HELPER (SECURITY DEFINER)
-- =============================================

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = check_user_id
    )
$$;

-- Fonction pour vérifier si un utilisateur possède un profil
CREATE OR REPLACE FUNCTION public.get_profile_id(check_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM public.profiles WHERE user_id = check_user_id LIMIT 1
$$;

-- Fonction pour vérifier si un profil appartient à l'utilisateur
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = profile_id AND user_id = check_user_id
    )
$$;

-- Fonction pour générer un numéro de dossier
CREATE OR REPLACE FUNCTION public.generate_dossier_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    year_suffix TEXT;
    sequence_num INTEGER;
    new_number TEXT;
BEGIN
    year_suffix := to_char(now(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_dossier FROM 5 FOR 5) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM public.applications
    WHERE numero_dossier LIKE 'INS-' || year_suffix || '-%';
    
    new_number := 'INS-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 5, '0');
    RETURN new_number;
END;
$$;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ENABLE RLS
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - PROFILES
-- =============================================

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Les utilisateurs peuvent créer leur profil (une seule fois)
CREATE POLICY "Users can create own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent modifier leur profil
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()))
WITH CHECK (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - DOCUMENTS
-- =============================================

-- Les utilisateurs peuvent voir leurs propres documents
CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT
TO authenticated
USING (
    public.is_profile_owner(profile_id, auth.uid()) OR public.is_admin(auth.uid())
);

-- Les utilisateurs peuvent ajouter des documents à leur profil
CREATE POLICY "Users can insert own documents"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (public.is_profile_owner(profile_id, auth.uid()));

-- Les utilisateurs peuvent supprimer leurs propres documents
CREATE POLICY "Users can delete own documents"
ON public.documents FOR DELETE
TO authenticated
USING (public.is_profile_owner(profile_id, auth.uid()));

-- Les utilisateurs peuvent mettre à jour leurs documents
CREATE POLICY "Users can update own documents"
ON public.documents FOR UPDATE
TO authenticated
USING (public.is_profile_owner(profile_id, auth.uid()))
WITH CHECK (public.is_profile_owner(profile_id, auth.uid()));

-- =============================================
-- RLS POLICIES - APPLICATIONS
-- =============================================

-- Les utilisateurs peuvent voir leurs demandes
CREATE POLICY "Users can view own applications"
ON public.applications FOR SELECT
TO authenticated
USING (
    public.is_profile_owner(profile_id, auth.uid()) OR public.is_admin(auth.uid())
);

-- Les utilisateurs peuvent créer une demande pour leur profil
CREATE POLICY "Users can create own application"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (public.is_profile_owner(profile_id, auth.uid()));

-- Les utilisateurs peuvent modifier leur demande (si brouillon) ou les admins
CREATE POLICY "Users can update own draft application"
ON public.applications FOR UPDATE
TO authenticated
USING (
    (public.is_profile_owner(profile_id, auth.uid()) AND status = 'draft')
    OR public.is_admin(auth.uid())
)
WITH CHECK (
    (public.is_profile_owner(profile_id, auth.uid()) AND status = 'draft')
    OR public.is_admin(auth.uid())
);

-- =============================================
-- RLS POLICIES - PAYMENTS
-- =============================================

-- Les utilisateurs peuvent voir leurs paiements
CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
TO authenticated
USING (
    public.is_profile_owner(profile_id, auth.uid()) OR public.is_admin(auth.uid())
);

-- Les utilisateurs peuvent créer des paiements pour leur profil
CREATE POLICY "Users can create own payments"
ON public.payments FOR INSERT
TO authenticated
WITH CHECK (public.is_profile_owner(profile_id, auth.uid()));

-- =============================================
-- RLS POLICIES - USER_ROLES
-- =============================================

-- Seuls les admins peuvent voir les rôles
CREATE POLICY "Admins can view roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Seuls les super_admins peuvent gérer les rôles
CREATE POLICY "Super admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
    )
);

-- =============================================
-- STORAGE BUCKET pour les documents
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'medical-documents',
    'medical-documents',
    false,
    10485760, -- 10MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
);

-- Policies pour le bucket
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'medical-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'medical-documents'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR public.is_admin(auth.uid())
    )
);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'medical-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================
-- INDEX pour les performances
-- =============================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_documents_profile_id ON public.documents(profile_id);
CREATE INDEX idx_applications_profile_id ON public.applications(profile_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_payments_profile_id ON public.payments(profile_id);
CREATE INDEX idx_payments_status ON public.payments(payment_status);