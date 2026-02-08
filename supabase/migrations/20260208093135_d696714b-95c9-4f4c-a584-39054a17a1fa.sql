-- Corriger les fonctions avec search_path manquant

-- Fonction generate_dossier_number avec search_path
CREATE OR REPLACE FUNCTION public.generate_dossier_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fonction update_updated_at_column avec search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;