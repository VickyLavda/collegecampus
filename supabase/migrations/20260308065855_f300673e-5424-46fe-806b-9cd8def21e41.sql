-- Restrict community_posts SELECT to authenticated users
DROP POLICY "Anyone can view posts" ON public.community_posts;
CREATE POLICY "Authenticated users can view posts"
  ON public.community_posts FOR SELECT
  TO authenticated
  USING (true);

-- Restrict events SELECT to authenticated users
DROP POLICY "Anyone can view events" ON public.events;
CREATE POLICY "Authenticated users can view events"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

-- Restrict post_comments SELECT to authenticated users
DROP POLICY "Anyone can view comments" ON public.post_comments;
CREATE POLICY "Authenticated users can view comments"
  ON public.post_comments FOR SELECT
  TO authenticated
  USING (true);

-- Restrict post_likes SELECT to authenticated users
DROP POLICY "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Authenticated users can view likes"
  ON public.post_likes FOR SELECT
  TO authenticated
  USING (true);

-- Restrict event_attendees SELECT to authenticated users
DROP POLICY "Anyone can view attendees" ON public.event_attendees;
CREATE POLICY "Authenticated users can view attendees"
  ON public.event_attendees FOR SELECT
  TO authenticated
  USING (true);