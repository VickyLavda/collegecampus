-- Update the handle_new_user function to use first_name from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, country, city)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.email, ''),
    COALESCE(new.raw_user_meta_data->>'country', 'Greece'),
    COALESCE(new.raw_user_meta_data->>'city', '')
  );
  RETURN new;
END;
$function$;