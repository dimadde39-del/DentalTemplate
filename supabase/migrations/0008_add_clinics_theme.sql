ALTER TABLE clinics
ADD COLUMN IF NOT EXISTS theme jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE clinics
SET theme = COALESCE(theme, '{}'::jsonb) || jsonb_build_object(
  'variant',
  'warm-clinic',
  'accent',
  '#00A1D6'
)
WHERE slug = 'skystom';

UPDATE clinics
SET theme = COALESCE(theme, '{}'::jsonb) || jsonb_build_object(
  'variant',
  'dark-tech',
  'accent',
  '#00A1D6'
)
WHERE slug = 'global-dent';

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
      'facebook_url', v_clinic_row.facebook_url,
      'theme', COALESCE(v_clinic_row.theme, '{}'::jsonb)
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
