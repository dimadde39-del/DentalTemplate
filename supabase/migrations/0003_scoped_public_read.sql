-- 1. Удаляем широкие public_read политики
DROP POLICY IF EXISTS "public_read_services" ON services;
DROP POLICY IF EXISTS "public_read_doctors" ON doctors;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;

-- 2. Создаём скопированные public_read политики через PostgREST request.headers
CREATE POLICY "public_read_services" ON services
  FOR SELECT
  USING (clinic_id = (
    SELECT id FROM clinics
    WHERE slug = (current_setting('request.headers', true)::jsonb ->> 'x-tenant-slug')::text
  ));

CREATE POLICY "public_read_doctors" ON doctors
  FOR SELECT
  USING (clinic_id = (
    SELECT id FROM clinics
    WHERE slug = (current_setting('request.headers', true)::jsonb ->> 'x-tenant-slug')::text
  ));

CREATE POLICY "public_read_reviews" ON reviews
  FOR SELECT
  USING (clinic_id = (
    SELECT id FROM clinics
    WHERE slug = (current_setting('request.headers', true)::jsonb ->> 'x-tenant-slug')::text
  ));

-- Tenant isolation для авторизованных пользователей остаётся без изменений
