-- Fix RoomMate Hub RLS and add join RPC

-- 1) Update SELECT policy so creators can read their hubs immediately after insert
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'roommate_hubs' 
      AND policyname = 'Users can view hubs they are members of'
  ) THEN
    DROP POLICY "Users can view hubs they are members of" ON public.roommate_hubs;
  END IF;
END $$;

CREATE POLICY "Users can view their hubs (creator or member)"
ON public.roommate_hubs
FOR SELECT
USING ( auth.uid() = created_by OR is_hub_member(auth.uid(), id) );

-- 2) Create a SECURITY DEFINER function to join by invite code without exposing hubs via SELECT
CREATE OR REPLACE FUNCTION public.join_hub_by_code(_invite_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _hub_id uuid;
  _code text := upper(trim(_invite_code));
BEGIN
  SELECT id INTO _hub_id FROM public.roommate_hubs WHERE invite_code = _code LIMIT 1;
  IF _hub_id IS NULL THEN
    RAISE EXCEPTION 'invalid_invite_code';
  END IF;

  -- Add membership if not already a member
  IF NOT EXISTS (
    SELECT 1 FROM public.hub_members 
    WHERE hub_id = _hub_id AND user_id = auth.uid()
  ) THEN
    INSERT INTO public.hub_members (hub_id, user_id)
    VALUES (_hub_id, auth.uid());
  END IF;

  RETURN _hub_id;
END;
$$;