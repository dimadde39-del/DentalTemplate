-- 1. ВКЛЮЧАЕМ РАСШИРЕНИЯ
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. СОЗДАЕМ ТАБЛИЦЫ (Если их нет, теперь они точно будут)
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  domain text,
  primary_color text DEFAULT '#0f766e',
  contact_phone text,
  contact_email text,
  google_maps_url text,
  instagram_url text,
  facebook_url text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, phone text, selected_service text, status text DEFAULT 'New', created_at timestamp DEFAULT now());
CREATE TABLE IF NOT EXISTS services (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, description text, price text, created_at timestamp DEFAULT now());
CREATE TABLE IF NOT EXISTS doctors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, specialty text, photo_url text, created_at timestamp DEFAULT now());
CREATE TABLE IF NOT EXISTS reviews (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), author text, rating int, comment text, created_at timestamp DEFAULT now());
CREATE TABLE IF NOT EXISTS settings (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text, value text, created_at timestamp DEFAULT now());

CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid REFERENCES auth.users PRIMARY KEY,
  clinic_id uuid REFERENCES clinics(id) NOT NULL
);

-- 3. ПРИНУДИТЕЛЬНОЕ ИСПРАВЛЕНИЕ ТИПОВ (Через динамический SQL, чтобы не было ошибок 42P01)
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN SELECT unnest(ARRAY['leads', 'services', 'doctors', 'reviews', 'settings']) 
    LOOP
        -- Добавляем колонку, если её нет
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS clinic_id uuid REFERENCES clinics(id)', t);
        
        -- Если колонка была текстом — конвертируем в UUID
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'clinic_id' AND data_type = 'text') THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN clinic_id TYPE uuid USING clinic_id::uuid', t);
        END IF;
    END LOOP;
END $$;

-- 4. ВКЛЮЧАЕМ RLS
DO $$ 
DECLARE t text;
BEGIN
    FOR t IN SELECT unnest(ARRAY['clinics', 'leads', 'services', 'doctors', 'reviews', 'settings', 'profiles']) 
    LOOP EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t); END LOOP;
END $$;

-- 5. ПОЛИТИКИ (Удаляем старые и ставим новые)
DO $$ 
DECLARE t text;
BEGIN
    FOR t IN SELECT unnest(ARRAY['leads', 'services', 'doctors', 'reviews', 'settings']) 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS "tenant_isolation_%s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "tenant_isolation_%s" ON %I FOR ALL USING (clinic_id = (SELECT clinic_id FROM profiles WHERE user_id = auth.uid()))', t, t);
        
        EXECUTE format('DROP POLICY IF EXISTS "public_read_%s" ON %I', t, t);
        EXECUTE format('CREATE POLICY "public_read_%s" ON %I FOR SELECT USING (true)', t, t);
    END LOOP;
END $$;

-- Специальные политики для clinics и profiles
DROP POLICY IF EXISTS "tenant_isolation_clinics" ON clinics;
CREATE POLICY "tenant_isolation_clinics" ON clinics FOR UPDATE USING (id = (SELECT clinic_id FROM profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "public_read_clinics" ON clinics;
CREATE POLICY "public_read_clinics" ON clinics FOR SELECT USING (true);
DROP POLICY IF EXISTS "tenant_isolation_profiles" ON profiles;
CREATE POLICY "tenant_isolation_profiles" ON profiles FOR SELECT USING (user_id = auth.uid());

-- 6. RPC ВЫШИБАЛА (Безопасный инсерт)
CREATE OR REPLACE FUNCTION insert_public_lead(p_slug text, p_name text, p_phone text, p_service text) 
RETURNS void SECURITY DEFINER SET search_path = public AS $$
DECLARE v_clinic_id uuid;
BEGIN
  SELECT id INTO v_clinic_id FROM clinics WHERE slug = p_slug;
  IF v_clinic_id IS NULL THEN RAISE EXCEPTION 'clinic not found: %', p_slug; END IF;
  INSERT INTO leads (clinic_id, name, phone, selected_service, status) VALUES (v_clinic_id, p_name, p_phone, p_service, 'New');
END; $$ LANGUAGE plpgsql;

CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(slug);

-- 7. ШАБЛОННАЯ КЛИНИКА
INSERT INTO clinics (slug, name, primary_color) VALUES ('template', 'Template Clinic', '#0f766e') ON CONFLICT (slug) DO NOTHING;

-- 8. АТОМАРНЫЙ ОНБОРДИНГ КЛИНИКИ
CREATE OR REPLACE FUNCTION onboard_new_clinic(
  p_template_slug text,
  p_new_slug text,
  p_new_name text,
  p_new_domain text
) RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_new_clinic_id uuid;
BEGIN
  -- copy clinic
  INSERT INTO clinics (slug, name, domain, primary_color, contact_phone, contact_email, google_maps_url, instagram_url, facebook_url)
  SELECT p_new_slug, p_new_name, p_new_domain, primary_color, contact_phone, contact_email, google_maps_url, instagram_url, facebook_url
  FROM clinics WHERE slug = p_template_slug
  RETURNING id INTO v_new_clinic_id;

  -- copy services, doctors, reviews (Columns matched to schema)
  INSERT INTO services (clinic_id, name, description, price) 
  SELECT v_new_clinic_id, name, description, price FROM services WHERE clinic_id = (SELECT id FROM clinics WHERE slug = p_template_slug);
  
  INSERT INTO doctors (clinic_id, name, specialty, photo_url) 
  SELECT v_new_clinic_id, name, specialty, photo_url FROM doctors WHERE clinic_id = (SELECT id FROM clinics WHERE slug = p_template_slug);
  
  INSERT INTO reviews (clinic_id, author, rating, comment) 
  SELECT v_new_clinic_id, author, rating, comment FROM reviews WHERE clinic_id = (SELECT id FROM clinics WHERE slug = p_template_slug);

  -- Postgres functions are transactional by default. If any statement fails, the entire function rolls back atomically.
END;
$$ LANGUAGE plpgsql;