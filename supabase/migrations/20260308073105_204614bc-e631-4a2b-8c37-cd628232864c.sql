
-- =============================================
-- Fix all RESTRICTIVE policies → PERMISSIVE
-- =============================================

-- hub_notes
DROP POLICY IF EXISTS "Hub members can view notes" ON public.hub_notes;
CREATE POLICY "Hub members can view notes" ON public.hub_notes FOR SELECT TO authenticated USING (is_hub_member(auth.uid(), hub_id));

DROP POLICY IF EXISTS "Hub members can create notes" ON public.hub_notes;
CREATE POLICY "Hub members can create notes" ON public.hub_notes FOR INSERT TO authenticated WITH CHECK (is_hub_member(auth.uid(), hub_id) AND (auth.uid() = created_by));

DROP POLICY IF EXISTS "Hub members can delete their own notes" ON public.hub_notes;
CREATE POLICY "Hub members can delete their own notes" ON public.hub_notes FOR DELETE TO authenticated USING (is_hub_member(auth.uid(), hub_id) AND (auth.uid() = created_by));

-- post_comments
DROP POLICY IF EXISTS "Authenticated users can view comments" ON public.post_comments;
CREATE POLICY "Authenticated users can view comments" ON public.post_comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.post_comments;
CREATE POLICY "Authenticated users can create comments" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.post_comments;
CREATE POLICY "Users can delete their own comments" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- hub_tasks
DROP POLICY IF EXISTS "Hub members can view tasks" ON public.hub_tasks;
CREATE POLICY "Hub members can view tasks" ON public.hub_tasks FOR SELECT TO authenticated USING (is_hub_member(auth.uid(), hub_id));

DROP POLICY IF EXISTS "Hub members can create tasks" ON public.hub_tasks;
CREATE POLICY "Hub members can create tasks" ON public.hub_tasks FOR INSERT TO authenticated WITH CHECK (is_hub_member(auth.uid(), hub_id) AND (auth.uid() = created_by));

DROP POLICY IF EXISTS "Hub members can update tasks" ON public.hub_tasks;
CREATE POLICY "Hub members can update tasks" ON public.hub_tasks FOR UPDATE TO authenticated USING (is_hub_member(auth.uid(), hub_id));

DROP POLICY IF EXISTS "Hub members can delete tasks" ON public.hub_tasks;
CREATE POLICY "Hub members can delete tasks" ON public.hub_tasks FOR DELETE TO authenticated USING (is_hub_member(auth.uid(), hub_id));

-- hub_members
DROP POLICY IF EXISTS "Users can view members of their hubs" ON public.hub_members;
CREATE POLICY "Users can view members of their hubs" ON public.hub_members FOR SELECT TO authenticated USING (is_hub_member(auth.uid(), hub_id));

DROP POLICY IF EXISTS "Users can join hubs" ON public.hub_members;
CREATE POLICY "Users can join hubs" ON public.hub_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave hubs" ON public.hub_members;
CREATE POLICY "Users can leave hubs" ON public.hub_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- post_likes
DROP POLICY IF EXISTS "Authenticated users can view likes" ON public.post_likes;
CREATE POLICY "Authenticated users can view likes" ON public.post_likes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.post_likes;
CREATE POLICY "Authenticated users can like posts" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON public.post_likes;
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- roommate_hubs
DROP POLICY IF EXISTS "Users can view their hubs (creator or member)" ON public.roommate_hubs;
CREATE POLICY "Users can view their hubs (creator or member)" ON public.roommate_hubs FOR SELECT TO authenticated USING ((auth.uid() = created_by) OR is_hub_member(auth.uid(), id));

DROP POLICY IF EXISTS "Authenticated users can create hubs" ON public.roommate_hubs;
CREATE POLICY "Authenticated users can create hubs" ON public.roommate_hubs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Hub members can update their hub" ON public.roommate_hubs;
CREATE POLICY "Hub members can update their hub" ON public.roommate_hubs FOR UPDATE TO authenticated USING (is_hub_member(auth.uid(), id));

-- event_attendees
DROP POLICY IF EXISTS "Authenticated users can view attendees" ON public.event_attendees;
CREATE POLICY "Authenticated users can view attendees" ON public.event_attendees FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can mark attendance" ON public.event_attendees;
CREATE POLICY "Authenticated users can mark attendance" ON public.event_attendees FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own attendance" ON public.event_attendees;
CREATE POLICY "Users can update their own attendance" ON public.event_attendees FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- supermarkets
DROP POLICY IF EXISTS "Anyone can view supermarkets" ON public.supermarkets;
CREATE POLICY "Anyone can view supermarkets" ON public.supermarkets FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert supermarkets" ON public.supermarkets;
CREATE POLICY "Admins can insert supermarkets" ON public.supermarkets FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update supermarkets" ON public.supermarkets;
CREATE POLICY "Admins can update supermarkets" ON public.supermarkets FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete supermarkets" ON public.supermarkets;
CREATE POLICY "Admins can delete supermarkets" ON public.supermarkets FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- events
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- hub_bills
DROP POLICY IF EXISTS "Hub members can view bills" ON public.hub_bills;
CREATE POLICY "Hub members can view bills" ON public.hub_bills FOR SELECT TO authenticated USING (is_hub_member(auth.uid(), hub_id));

DROP POLICY IF EXISTS "Hub members can create bills" ON public.hub_bills;
CREATE POLICY "Hub members can create bills" ON public.hub_bills FOR INSERT TO authenticated WITH CHECK (is_hub_member(auth.uid(), hub_id) AND (auth.uid() = created_by));

DROP POLICY IF EXISTS "Hub members can update bills" ON public.hub_bills;
CREATE POLICY "Hub members can update bills" ON public.hub_bills FOR UPDATE TO authenticated USING (is_hub_member(auth.uid(), hub_id));

DROP POLICY IF EXISTS "Hub members can delete bills" ON public.hub_bills;
CREATE POLICY "Hub members can delete bills" ON public.hub_bills FOR DELETE TO authenticated USING (is_hub_member(auth.uid(), hub_id));

-- profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- content_reports
DROP POLICY IF EXISTS "Authenticated users can report content" ON public.content_reports;
CREATE POLICY "Authenticated users can report content" ON public.content_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- community_posts
DROP POLICY IF EXISTS "Authenticated users can view posts" ON public.community_posts;
CREATE POLICY "Authenticated users can view posts" ON public.community_posts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.community_posts;
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
