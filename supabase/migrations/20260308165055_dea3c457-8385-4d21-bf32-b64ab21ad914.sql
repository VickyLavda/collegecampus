CREATE POLICY "Admins can view content reports" ON public.content_reports
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));