-- 1. Удаляем scoped public_read политики (current_setting hack)
DROP POLICY IF EXISTS "public_read_services" ON services;
DROP POLICY IF EXISTS "public_read_doctors" ON doctors;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;

-- 2. Запрещаем прямой SELECT для anon на эти таблицы
REVOKE SELECT ON services FROM anon;
REVOKE SELECT ON doctors FROM anon;
REVOKE SELECT ON reviews FROM anon;

-- 3. RPC: единая точка входа для публичных данных клиники
CREATE OR REPLACE FUNCTION get_clinic_public_data(p_slug text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_clinic_id uuid;
BEGIN
  SELECT id INTO v_clinic_id FROM clinics WHERE slug = p_slug;
  IF v_clinic_id IS NULL THEN
    RAISE EXCEPTION 'clinic not found: %', p_slug;
  END IF;

  RETURN json_build_object(
    'services', COALESCE((
      SELECT json_agg(row_to_json(s))
      FROM (SELECT id, name, description, price FROM services WHERE clinic_id = v_clinic_id) s
    ), '[]'::json),
    'doctors', COALESCE((
      SELECT json_agg(row_to_json(d))
      FROM (SELECT id, name, specialty, photo_url FROM doctors WHERE clinic_id = v_clinic_id) d
    ), '[]'::json),
    'reviews', COALESCE((
      SELECT json_agg(row_to_json(r))
      FROM (SELECT id, author, rating, comment FROM reviews WHERE clinic_id = v_clinic_id) r
    ), '[]'::json)
  );
END;
$$;

-- 4. Разрешаем анонимным пользователям вызывать RPC
GRANT EXECUTE ON FUNCTION get_clinic_public_data(text) TO anon;

-- 5. Индекс на clinics(slug) для производительности RPC lookup
CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(slug);
