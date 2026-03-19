
-- Fix 1: Restrict hub_members INSERT to only work via the join_hub_by_code RPC
-- Remove the current permissive INSERT policy and replace with one that blocks direct inserts
-- The join_hub_by_code function uses SECURITY DEFINER so it bypasses RLS
DROP POLICY IF EXISTS "Users can join hubs" ON public.hub_members;
CREATE POLICY "Users can join hubs" ON public.hub_members
FOR INSERT TO authenticated
WITH CHECK (false);

-- Fix 2: Restrict event_attendees SELECT to own attendance or event creator
DROP POLICY IF EXISTS "Users can view event attendees" ON public.event_attendees;
CREATE POLICY "Users can view event attendees" ON public.event_attendees
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  OR EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND user_id = auth.uid())
);
