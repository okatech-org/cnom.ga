-- Drop the overly permissive insert policy and replace with a more secure one
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a secure insert policy for notifications
-- Only admins and authenticated users can insert notifications for themselves
CREATE POLICY "Authenticated users can insert own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
    auth.uid() IS NOT NULL AND (
        user_id = auth.uid() OR 
        is_admin(auth.uid())
    )
);

-- Add delete policy for notifications
CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (user_id = auth.uid());