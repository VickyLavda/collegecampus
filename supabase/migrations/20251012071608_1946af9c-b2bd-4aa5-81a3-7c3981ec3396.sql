-- Create profiles table for student information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Cyprus', 'Greece')),
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create supermarkets table
CREATE TABLE public.supermarkets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Cyprus', 'Greece')),
  phone TEXT,
  hours TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on supermarkets
ALTER TABLE public.supermarkets ENABLE ROW LEVEL SECURITY;

-- Supermarkets policies (everyone can read)
CREATE POLICY "Anyone can view supermarkets"
  ON public.supermarkets
  FOR SELECT
  USING (true);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, country, city)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.email, ''),
    COALESCE(new.raw_user_meta_data->>'country', 'Greece'),
    COALESCE(new.raw_user_meta_data->>'city', '')
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supermarkets_updated_at
  BEFORE UPDATE ON public.supermarkets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample supermarkets for Cyprus
INSERT INTO public.supermarkets (name, address, city, country, phone, hours) VALUES
('Alphamega Hypermarket', 'Limassol City Center', 'Limassol', 'Cyprus', '+357 25 123456', '08:00-21:00'),
('Papantoniou Supermarket', 'Nicosia Mall', 'Nicosia', 'Cyprus', '+357 22 234567', '08:00-21:00'),
('Metro Supermarket', 'Larnaca Avenue', 'Larnaca', 'Cyprus', '+357 24 345678', '07:30-22:00'),
('Lidl Cyprus', 'Paphos Center', 'Paphos', 'Cyprus', '+357 26 456789', '08:00-21:00');

-- Insert sample supermarkets for Greece
INSERT INTO public.supermarkets (name, address, city, country, phone, hours) VALUES
('AB Vassilopoulos', 'Syntagma Square', 'Athens', 'Greece', '+30 210 1234567', '08:00-21:00'),
('Sklavenitis', 'Aristotelous Street', 'Thessaloniki', 'Greece', '+30 231 2345678', '08:00-22:00'),
('Masoutis', 'Patras Center', 'Patras', 'Greece', '+30 261 3456789', '08:00-21:00'),
('My Market', 'Heraklion Plaza', 'Heraklion', 'Greece', '+30 281 4567890', '07:30-21:30'),
('Galaxias', 'Larissa Avenue', 'Larissa', 'Greece', '+30 241 5678901', '08:00-21:00');