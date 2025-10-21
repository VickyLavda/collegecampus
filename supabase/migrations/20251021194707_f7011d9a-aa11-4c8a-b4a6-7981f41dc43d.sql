-- Fix search_path warning by setting explicit search_path for all functions
-- (Already done in handle_new_user, is_hub_member, update_updated_at_column, join_hub_by_code)

-- Fix generate_invite_code function
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  code TEXT;
BEGIN
  code := upper(substring(md5(random()::text) from 1 for 6));
  RETURN code;
END;
$function$;