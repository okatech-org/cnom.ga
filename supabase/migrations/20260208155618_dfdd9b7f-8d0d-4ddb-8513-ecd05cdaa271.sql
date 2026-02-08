-- Add validation workflow tracking to applications
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS agent_validated_by uuid,
ADD COLUMN IF NOT EXISTS agent_validated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS commission_validated_by uuid,
ADD COLUMN IF NOT EXISTS commission_validated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS commission_decision text CHECK (commission_decision IN ('approved', 'rejected', 'pending_president')),
ADD COLUMN IF NOT EXISTS president_validated_by uuid,
ADD COLUMN IF NOT EXISTS president_validated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS current_step text DEFAULT 'draft' CHECK (current_step IN ('draft', 'submitted', 'agent_review', 'commission_review', 'president_review', 'completed', 'rejected'));

-- Create notifications table for real-time updates
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    role text,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'action')),
    action_url text,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid() OR role IN (
    SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = auth.uid()
));

CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create workflow_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.workflow_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    action text NOT NULL,
    from_step text,
    to_step text,
    performed_by uuid NOT NULL,
    performed_at timestamp with time zone NOT NULL DEFAULT now(),
    notes text,
    metadata jsonb
);

-- Enable RLS on workflow_logs
ALTER TABLE public.workflow_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for workflow_logs
CREATE POLICY "Admins can view workflow logs" 
ON public.workflow_logs 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert workflow logs" 
ON public.workflow_logs 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Enable realtime for notifications and applications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;

-- Create function to get pending counts by role
CREATE OR REPLACE FUNCTION public.get_pending_counts(user_role text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    CASE user_role
        WHEN 'agent' THEN
            SELECT jsonb_build_object(
                'verification', (SELECT COUNT(*) FROM applications WHERE status = 'submitted' AND current_step = 'submitted'),
                'fiches', (SELECT COUNT(*) FROM applications WHERE status = 'draft'),
                'paiements', (SELECT COUNT(*) FROM payments WHERE payment_status = 'pending')
            ) INTO result;
        WHEN 'commission' THEN
            SELECT jsonb_build_object(
                'validation', (SELECT COUNT(*) FROM applications WHERE current_step = 'commission_review'),
                'historique', (SELECT COUNT(*) FROM applications WHERE status IN ('validated', 'rejected') AND commission_validated_at > now() - interval '30 days')
            ) INTO result;
        WHEN 'president' THEN
            SELECT jsonb_build_object(
                'validations', (SELECT COUNT(*) FROM applications WHERE current_step = 'president_review'),
                'total_medecins', (SELECT COUNT(*) FROM profiles WHERE numero_ordre IS NOT NULL)
            ) INTO result;
        WHEN 'sg' THEN
            SELECT jsonb_build_object(
                'inscriptions', (SELECT COUNT(*) FROM applications WHERE status IN ('submitted', 'under_review')),
                'en_cours', (SELECT COUNT(*) FROM applications WHERE current_step NOT IN ('draft', 'completed', 'rejected'))
            ) INTO result;
        WHEN 'tresorier' THEN
            SELECT jsonb_build_object(
                'recouvrement', (SELECT COUNT(*) FROM payments WHERE payment_status = 'pending'),
                'cotisations_mois', (SELECT COUNT(*) FROM payments WHERE payment_status = 'completed' AND paid_at > date_trunc('month', now()))
            ) INTO result;
        WHEN 'admin' THEN
            SELECT jsonb_build_object(
                'inscriptions', (SELECT COUNT(*) FROM applications WHERE status NOT IN ('draft', 'validated', 'rejected')),
                'paiements_pending', (SELECT COUNT(*) FROM payments WHERE payment_status = 'pending'),
                'total_medecins', (SELECT COUNT(*) FROM profiles)
            ) INTO result;
        ELSE
            result := '{}'::jsonb;
    END CASE;
    
    RETURN result;
END;
$$;