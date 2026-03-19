-- 1. Добавляем колонку role в profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'clinic_admin';

-- 2. Назначаем платформенного администратора (замените email на реальный)
-- UPDATE profiles
-- SET role = 'platform_admin'
-- WHERE user_id = (
--   SELECT id FROM auth.users
--   WHERE email = 'your-admin@email.com'
-- );

-- 3. Хелпер: проверка роли platform_admin
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS boolean
STABLE
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE user_id = auth.uid()),
    ''
  ) = 'platform_admin';
$$;

-- 4. Перезаписываем onboard_new_clinic с проверкой роли
CREATE OR REPLACE FUNCTION onboard_new_clinic(
  p_template_slug text,
  p_new_slug text,
  p_new_name text,
  p_new_domain text
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_template_id uuid;
  v_new_clinic_id uuid;
BEGIN
  -- Проверка: только platform_admin может создавать клиники
  IF NOT is_platform_admin() THEN
    RAISE EXCEPTION 'unauthorized: platform_admin role required';
  END IF;

  SELECT id INTO v_template_id FROM clinics WHERE slug = p_template_slug;
  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'template clinic not found: %', p_template_slug;
  END IF;

  -- Копируем клинику
  INSERT INTO clinics (slug, name, domain, primary_color, contact_phone, contact_email, google_maps_url, instagram_url, facebook_url)
  SELECT p_new_slug, p_new_name, p_new_domain, primary_color, contact_phone, contact_email, google_maps_url, instagram_url, facebook_url
  FROM clinics WHERE id = v_template_id
  RETURNING id INTO v_new_clinic_id;

  -- Копируем services
  INSERT INTO services (clinic_id, name, description, price)
  SELECT v_new_clinic_id, name, description, price
  FROM services WHERE clinic_id = v_template_id;

  -- Копируем doctors
  INSERT INTO doctors (clinic_id, name, specialty, photo_url)
  SELECT v_new_clinic_id, name, specialty, photo_url
  FROM doctors WHERE clinic_id = v_template_id;

  -- Копируем reviews
  INSERT INTO reviews (clinic_id, author, rating, comment)
  SELECT v_new_clinic_id, author, rating, comment
  FROM reviews WHERE clinic_id = v_template_id;

  RETURN v_new_clinic_id;
END;
$$;

-- 5. Ограничиваем доступ: только authenticated могут вызывать, проверка внутри функции
REVOKE EXECUTE ON FUNCTION onboard_new_clinic(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION onboard_new_clinic(text, text, text, text) TO authenticated;
