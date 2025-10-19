-- Create roommate hubs table
CREATE TABLE public.roommate_hubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hub members table
CREATE TABLE public.hub_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES public.roommate_hubs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hub_id, user_id)
);

-- Create hub tasks table
CREATE TABLE public.hub_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES public.roommate_hubs(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL DEFAULT 'once',
  assigned_to UUID REFERENCES auth.users(id),
  completed BOOLEAN NOT NULL DEFAULT false,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hub bills table
CREATE TABLE public.hub_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES public.roommate_hubs(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hub notes table
CREATE TABLE public.hub_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES public.roommate_hubs(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roommate_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_notes ENABLE ROW LEVEL SECURITY;

-- Helper function to check hub membership
CREATE OR REPLACE FUNCTION public.is_hub_member(_user_id UUID, _hub_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.hub_members
    WHERE user_id = _user_id AND hub_id = _hub_id
  )
$$;

-- RLS Policies for roommate_hubs
CREATE POLICY "Users can view hubs they are members of"
ON public.roommate_hubs FOR SELECT
USING (public.is_hub_member(auth.uid(), id));

CREATE POLICY "Authenticated users can create hubs"
ON public.roommate_hubs FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Hub members can update their hub"
ON public.roommate_hubs FOR UPDATE
USING (public.is_hub_member(auth.uid(), id));

-- RLS Policies for hub_members
CREATE POLICY "Users can view members of their hubs"
ON public.hub_members FOR SELECT
USING (public.is_hub_member(auth.uid(), hub_id));

CREATE POLICY "Users can join hubs"
ON public.hub_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave hubs"
ON public.hub_members FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for hub_tasks
CREATE POLICY "Hub members can view tasks"
ON public.hub_tasks FOR SELECT
USING (public.is_hub_member(auth.uid(), hub_id));

CREATE POLICY "Hub members can create tasks"
ON public.hub_tasks FOR INSERT
WITH CHECK (public.is_hub_member(auth.uid(), hub_id) AND auth.uid() = created_by);

CREATE POLICY "Hub members can update tasks"
ON public.hub_tasks FOR UPDATE
USING (public.is_hub_member(auth.uid(), hub_id));

CREATE POLICY "Hub members can delete tasks"
ON public.hub_tasks FOR DELETE
USING (public.is_hub_member(auth.uid(), hub_id));

-- RLS Policies for hub_bills
CREATE POLICY "Hub members can view bills"
ON public.hub_bills FOR SELECT
USING (public.is_hub_member(auth.uid(), hub_id));

CREATE POLICY "Hub members can create bills"
ON public.hub_bills FOR INSERT
WITH CHECK (public.is_hub_member(auth.uid(), hub_id) AND auth.uid() = created_by);

CREATE POLICY "Hub members can update bills"
ON public.hub_bills FOR UPDATE
USING (public.is_hub_member(auth.uid(), hub_id));

CREATE POLICY "Hub members can delete bills"
ON public.hub_bills FOR DELETE
USING (public.is_hub_member(auth.uid(), hub_id));

-- RLS Policies for hub_notes
CREATE POLICY "Hub members can view notes"
ON public.hub_notes FOR SELECT
USING (public.is_hub_member(auth.uid(), hub_id));

CREATE POLICY "Hub members can create notes"
ON public.hub_notes FOR INSERT
WITH CHECK (public.is_hub_member(auth.uid(), hub_id) AND auth.uid() = created_by);

CREATE POLICY "Hub members can delete their own notes"
ON public.hub_notes FOR DELETE
USING (public.is_hub_member(auth.uid(), hub_id) AND auth.uid() = created_by);

-- Triggers for updated_at
CREATE TRIGGER update_roommate_hubs_updated_at
BEFORE UPDATE ON public.roommate_hubs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hub_tasks_updated_at
BEFORE UPDATE ON public.hub_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hub_bills_updated_at
BEFORE UPDATE ON public.hub_bills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  code := upper(substring(md5(random()::text) from 1 for 6));
  RETURN code;
END;
$$;