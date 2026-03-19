-- 1. Создаём функцию текущей клиники (STABLE + SECURITY DEFINER)
CREATE OR REPLACE FUNCTION current_clinic_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT clinic_id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 2. Удаляем все public_read политики (PII breach vector)
DROP POLICY IF EXISTS "public_read_leads" ON leads;
DROP POLICY IF EXISTS "public_read_services" ON services;
DROP POLICY IF EXISTS "public_read_doctors" ON doctors;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
DROP POLICY IF EXISTS "public_read_settings" ON settings;

-- 3. Удаляем старые tenant_isolation политики (inline subquery)
DROP POLICY IF EXISTS "tenant_isolation_leads" ON leads;
DROP POLICY IF EXISTS "tenant_isolation_services" ON services;
DROP POLICY IF EXISTS "tenant_isolation_doctors" ON doctors;
DROP POLICY IF EXISTS "tenant_isolation_reviews" ON reviews;
DROP POLICY IF EXISTS "tenant_isolation_settings" ON settings;

-- 4. Создаём строгие политики с USING + WITH CHECK
CREATE POLICY "tenant_isolation" ON leads
  FOR ALL
  USING (clinic_id = current_clinic_id())
  WITH CHECK (clinic_id = current_clinic_id());

CREATE POLICY "tenant_isolation" ON services
  FOR ALL
  USING (clinic_id = current_clinic_id())
  WITH CHECK (clinic_id = current_clinic_id());

CREATE POLICY "tenant_isolation" ON doctors
  FOR ALL
  USING (clinic_id = current_clinic_id())
  WITH CHECK (clinic_id = current_clinic_id());

CREATE POLICY "tenant_isolation" ON reviews
  FOR ALL
  USING (clinic_id = current_clinic_id())
  WITH CHECK (clinic_id = current_clinic_id());

CREATE POLICY "tenant_isolation" ON settings
  FOR ALL
  USING (clinic_id = current_clinic_id())
  WITH CHECK (clinic_id = current_clinic_id());

-- 5. Публичные маршруты (services, doctors, reviews) нуждаются в SELECT для анонимных посетителей клиники
CREATE POLICY "public_read_services" ON services
  FOR SELECT
  USING (true);

CREATE POLICY "public_read_doctors" ON doctors
  FOR SELECT
  USING (true);

CREATE POLICY "public_read_reviews" ON reviews
  FOR SELECT
  USING (true);

-- 6. Индексы для производительности RLS (если отсутствуют)
CREATE INDEX IF NOT EXISTS idx_leads_clinic_id ON leads(clinic_id);
CREATE INDEX IF NOT EXISTS idx_services_clinic_id ON services(clinic_id);
CREATE INDEX IF NOT EXISTS idx_doctors_clinic_id ON doctors(clinic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_id ON reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_settings_clinic_id ON settings(clinic_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
