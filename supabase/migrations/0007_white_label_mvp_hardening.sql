CREATE OR REPLACE FUNCTION normalize_clinic_host(p_value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
RETURNS NULL ON NULL INPUT
AS $$
  SELECT NULLIF(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          lower(trim(trailing '.' from btrim(p_value))),
          '^https?://',
          ''
        ),
        '/.*$',
        ''
      ),
      ':\d+$',
      ''
    ),
    ''
  );
$$;

DELETE FROM settings a
USING settings b
WHERE a.ctid < b.ctid
  AND a.clinic_id = b.clinic_id
  AND a.key = b.key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_clinic_key_unique
  ON settings(clinic_id, key);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clinics_domain_normalized
  ON clinics ((normalize_clinic_host(domain)))
  WHERE normalize_clinic_host(domain) IS NOT NULL;

CREATE OR REPLACE FUNCTION get_clinic_public_data(p_slug text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_clinic_id uuid;
  v_clinic_row clinics%ROWTYPE;
  v_content jsonb;
BEGIN
  SELECT * INTO v_clinic_row FROM clinics WHERE slug = p_slug;
  IF v_clinic_row.id IS NULL THEN
    RAISE EXCEPTION 'clinic not found: %', p_slug;
  END IF;

  v_clinic_id := v_clinic_row.id;

  SELECT COALESCE(
    jsonb_object_agg(s.key, s.value),
    '{}'::jsonb
  )
  INTO v_content
  FROM settings s
  WHERE s.clinic_id = v_clinic_id
    AND s.key = ANY (
      ARRAY[
        'hero_title',
        'hero_subtitle',
        'services_title',
        'services_subtitle',
        'doctors_title',
        'doctors_subtitle',
        'testimonials_title',
        'testimonials_subtitle'
      ]
    );

  RETURN jsonb_build_object(
    'clinic', jsonb_build_object(
      'id', v_clinic_row.id,
      'slug', v_clinic_row.slug,
      'name', v_clinic_row.name,
      'domain', v_clinic_row.domain,
      'primary_color', v_clinic_row.primary_color,
      'contact_phone', v_clinic_row.contact_phone,
      'contact_email', v_clinic_row.contact_email,
      'google_maps_url', v_clinic_row.google_maps_url,
      'instagram_url', v_clinic_row.instagram_url,
      'facebook_url', v_clinic_row.facebook_url
    ),
    'content', v_content,
    'services', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'description', s.description,
          'price', s.price
        )
        ORDER BY s.created_at, s.name
      )
      FROM services s
      WHERE s.clinic_id = v_clinic_id
    ), '[]'::jsonb),
    'doctors', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', d.id,
          'name', d.name,
          'specialty', d.specialty,
          'photo_url', d.photo_url
        )
        ORDER BY d.created_at, d.name
      )
      FROM doctors d
      WHERE d.clinic_id = v_clinic_id
    ), '[]'::jsonb),
    'reviews', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'author', r.author,
          'rating', r.rating,
          'comment', r.comment
        )
        ORDER BY r.created_at, r.author
      )
      FROM reviews r
      WHERE r.clinic_id = v_clinic_id
    ), '[]'::jsonb)
  )::json;
END;
$$;

GRANT EXECUTE ON FUNCTION get_clinic_public_data(text) TO anon;

CREATE OR REPLACE FUNCTION resolve_clinic_host(p_host text)
RETURNS text
SECURITY DEFINER
SET search_path = public
STABLE
LANGUAGE plpgsql
AS $$
DECLARE
  v_normalized_host text := normalize_clinic_host(p_host);
  v_slug text;
BEGIN
  IF v_normalized_host IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT c.slug
  INTO v_slug
  FROM clinics c
  WHERE normalize_clinic_host(c.domain) = v_normalized_host
  LIMIT 1;

  RETURN v_slug;
END;
$$;

REVOKE EXECUTE ON FUNCTION resolve_clinic_host(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION resolve_clinic_host(text) TO anon;

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
    facebook_url
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
    facebook_url
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

INSERT INTO settings (clinic_id, key, value)
SELECT clinic.id, seed.key, seed.value
FROM clinics AS clinic
CROSS JOIN (
  VALUES
    ('hero_title', 'Premium Dental Care Tailored to Every Smile'),
    ('hero_subtitle', 'A modern clinic experience built around transparent treatment plans and trusted specialists.'),
    ('services_title', 'Signature Services'),
    ('services_subtitle', 'Comprehensive dentistry for prevention, restoration, and confident smile design.'),
    ('doctors_title', 'Meet the Specialists'),
    ('doctors_subtitle', 'Experienced clinicians focused on comfort, precision, and long-term outcomes.'),
    ('testimonials_title', 'Patient Reviews'),
    ('testimonials_subtitle', 'Stories from patients who trusted our team with their care.')
) AS seed(key, value)
WHERE clinic.slug = 'template'
ON CONFLICT (clinic_id, key) DO UPDATE
SET value = EXCLUDED.value;
