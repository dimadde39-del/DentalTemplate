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
  v_normalized_slug text := lower(btrim(p_new_slug));
  v_normalized_name text := btrim(p_new_name);
  v_normalized_domain text := normalize_clinic_host(p_new_domain);
BEGIN
  IF auth.role() <> 'service_role' AND NOT is_platform_admin() THEN
    RAISE EXCEPTION 'unauthorized: platform_admin or service_role required';
  END IF;

  IF v_normalized_slug IS NULL OR v_normalized_slug = '' THEN
    RAISE EXCEPTION 'clinic slug is required';
  END IF;

  IF v_normalized_name IS NULL OR v_normalized_name = '' THEN
    RAISE EXCEPTION 'clinic name is required';
  END IF;

  IF EXISTS (SELECT 1 FROM clinics WHERE slug = v_normalized_slug) THEN
    RAISE EXCEPTION 'clinic slug already exists: %', v_normalized_slug;
  END IF;

  IF v_normalized_domain IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM clinics
       WHERE normalize_clinic_host(domain) = v_normalized_domain
     ) THEN
    RAISE EXCEPTION 'clinic domain already exists: %', v_normalized_domain;
  END IF;

  SELECT id INTO v_template_id FROM clinics WHERE slug = p_template_slug;
  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'template clinic not found: %', p_template_slug;
  END IF;

  INSERT INTO clinics (
    slug,
    name,
    domain,
    primary_color,
    contact_phone,
    contact_email,
    google_maps_url,
    instagram_url,
    facebook_url,
    theme
  )
  SELECT
    v_normalized_slug,
    v_normalized_name,
    v_normalized_domain,
    primary_color,
    contact_phone,
    contact_email,
    google_maps_url,
    instagram_url,
    facebook_url,
    COALESCE(theme, '{}'::jsonb)
  FROM clinics
  WHERE id = v_template_id
  RETURNING id INTO v_new_clinic_id;

  INSERT INTO services (clinic_id, name, description, price)
  SELECT v_new_clinic_id, name, description, price
  FROM services
  WHERE clinic_id = v_template_id;

  INSERT INTO doctors (clinic_id, name, specialty, photo_url)
  SELECT v_new_clinic_id, name, specialty, photo_url
  FROM doctors
  WHERE clinic_id = v_template_id;

  INSERT INTO reviews (clinic_id, author, rating, comment)
  SELECT v_new_clinic_id, author, rating, comment
  FROM reviews
  WHERE clinic_id = v_template_id;

  INSERT INTO settings (clinic_id, key, value)
  SELECT v_new_clinic_id, key, value
  FROM settings
  WHERE clinic_id = v_template_id
  ON CONFLICT (clinic_id, key) DO UPDATE
  SET value = EXCLUDED.value;

  RETURN v_new_clinic_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION onboard_new_clinic(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION onboard_new_clinic(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION onboard_new_clinic(text, text, text, text) TO service_role;
