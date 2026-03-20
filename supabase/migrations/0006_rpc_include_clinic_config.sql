-- Update RPC to return clinic config alongside services/doctors/reviews
-- This eliminates the need for a separate .from('clinics').select() call
CREATE OR REPLACE FUNCTION get_clinic_public_data(p_slug text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_clinic_id uuid;
  v_clinic_row clinics%ROWTYPE;
BEGIN
  SELECT * INTO v_clinic_row FROM clinics WHERE slug = p_slug;
  IF v_clinic_row.id IS NULL THEN
    RAISE EXCEPTION 'clinic not found: %', p_slug;
  END IF;

  v_clinic_id := v_clinic_row.id;

  RETURN json_build_object(
    'clinic', json_build_object(
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
