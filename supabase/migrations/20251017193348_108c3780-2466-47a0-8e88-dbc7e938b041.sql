-- Add latitude and longitude columns to supermarkets table
ALTER TABLE public.supermarkets
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;

-- Update existing supermarket with coordinates (Papantoniou Supermarket, Nicosia Mall)
UPDATE public.supermarkets
SET latitude = 35.1566, longitude = 33.3909
WHERE name = 'Papantoniou Supermarket' AND city = 'Nicosia';

-- Add more supermarkets in Cyprus
INSERT INTO public.supermarkets (name, address, city, country, phone, hours, latitude, longitude)
VALUES
  ('Alphamega Hypermarket', 'Makarios Avenue 123', 'Nicosia', 'Cyprus', '+357 22 445566', '08:00-22:00', 35.1725, 33.3642),
  ('Lidl Nicosia', 'Grivas Dhigenis 45', 'Nicosia', 'Cyprus', '+357 22 334455', '07:00-21:00', 35.1589, 33.3823),
  ('Carrefour Express', 'Stasikratous 15', 'Nicosia', 'Cyprus', '+357 22 776688', '08:00-20:00', 35.1701, 33.3678),
  ('Metro Supermarket', 'Athalassa Avenue', 'Nicosia', 'Cyprus', '+357 22 889900', '08:00-21:00', 35.1445, 33.3512);

-- Add supermarkets in Athens, Greece
INSERT INTO public.supermarkets (name, address, city, country, phone, hours, latitude, longitude)
VALUES
  ('AB Vassilopoulos', 'Panepistimiou 32', 'Athens', 'Greece', '+30 210 3234567', '08:00-21:00', 37.9838, 23.7275),
  ('Lidl Athens Center', 'Stadiou 45', 'Athens', 'Greece', '+30 210 4567890', '07:00-21:00', 37.9794, 23.7348),
  ('Sklavenitis', 'Kifissias Avenue 123', 'Athens', 'Greece', '+30 210 6789012', '08:00-22:00', 38.0342, 23.7978),
  ('My Market', 'Vouliagmenis 78', 'Athens', 'Greece', '+30 210 8901234', '08:00-21:00', 37.9519, 23.7536),
  ('Masoutis Supermarket', 'Alexandras Avenue 56', 'Athens', 'Greece', '+30 210 7890123', '08:00-21:00', 37.9967, 23.7511);

-- Add supermarkets in Thessaloniki, Greece
INSERT INTO public.supermarkets (name, address, city, country, phone, hours, latitude, longitude)
VALUES
  ('AB Vassilopoulos Thessaloniki', 'Tsimiski 45', 'Thessaloniki', 'Greece', '+30 231 0234567', '08:00-21:00', 40.6358, 22.9431),
  ('Lidl Thessaloniki', 'Egnatia 89', 'Thessaloniki', 'Greece', '+30 231 0456789', '07:00-21:00', 40.6403, 22.9353),
  ('Masoutis Thessaloniki', 'Mitropoleos 23', 'Thessaloniki', 'Greece', '+30 231 0678901', '08:00-22:00', 40.6345, 22.9389);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_supermarkets_location ON public.supermarkets(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_supermarkets_city_country ON public.supermarkets(city, country);
