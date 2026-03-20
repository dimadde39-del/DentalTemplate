DO $$
DECLARE
  v_clinic_id uuid;
BEGIN
  INSERT INTO clinics (slug, name, primary_color, contact_phone, contact_email)
  VALUES (
    'global-dent',
    'Global Dent Clinic',
    '#1e3a8a',
    '+7 707 470 90 88',
    'global.dent.24@gmail.com'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    primary_color = EXCLUDED.primary_color,
    contact_phone = EXCLUDED.contact_phone,
    contact_email = EXCLUDED.contact_email
  RETURNING id INTO v_clinic_id;

  INSERT INTO doctors (id, clinic_id, name, specialty, photo_url) VALUES
    (gen_random_uuid(), v_clinic_id, 'Tofik Abilov', 'Chief physician and implant surgeon with 26 years of experience', '/doctors/abilov.png'),
    (gen_random_uuid(), v_clinic_id, 'Alimzhan Zhomartovich', 'Implant surgeon focused on All-on-4 and sinus lift cases', '/doctors/alimzhan.png'),
    (gen_random_uuid(), v_clinic_id, 'Erik Yusupbekov', 'Implant surgeon and prosthodontist', '/doctors/erik.png'),
    (gen_random_uuid(), v_clinic_id, 'Kamalidin Abidinov', 'General dentist and restorative care specialist', '/doctors/kamalidin.png'),
    (gen_random_uuid(), v_clinic_id, 'Danara Kuzherbayeva', 'General and pediatric dentist', '/doctors/danara.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO services (id, clinic_id, name, description, price) VALUES
    (gen_random_uuid(), v_clinic_id, 'Straumann Implant', 'Premium implant treatment with long-term restorative planning.', '450000'),
    (gen_random_uuid(), v_clinic_id, 'MIS / AlphaBio Implant', 'Reliable implant placement with a more accessible treatment budget.', '160000'),
    (gen_random_uuid(), v_clinic_id, 'Professional Dental Cleaning', 'Plaque and tartar removal with a preventive care consultation.', '13500'),
    (gen_random_uuid(), v_clinic_id, 'Caries Treatment', 'Modern restorative treatment with aesthetic light-cured fillings.', '7000')
  ON CONFLICT DO NOTHING;

  INSERT INTO reviews (id, clinic_id, author, rating, comment) VALUES
    (gen_random_uuid(), v_clinic_id, 'Ruslan M.', 5, 'Straumann implant treatment was smooth from consultation to recovery. The care felt premium and precise.'),
    (gen_random_uuid(), v_clinic_id, 'Asel K.', 5, 'Our family trusts the team completely. My child now comes to appointments calmly and confidently.'),
    (gen_random_uuid(), v_clinic_id, 'Marat T.', 5, 'The All-on-4 surgery was handled at a very high level and the recovery guidance was excellent.'),
    (gen_random_uuid(), v_clinic_id, 'Aigerim N.', 5, 'Caries treatment was painless, efficient, and the clinic experience felt clean and modern.'),
    (gen_random_uuid(), v_clinic_id, 'Dmitriy S.', 5, 'The crowns were color-matched perfectly and the final result felt natural from day one.')
  ON CONFLICT DO NOTHING;

  INSERT INTO settings (clinic_id, key, value)
  VALUES
    (v_clinic_id, 'hero_title', 'Global Dent Premium Implant Center'),
    (v_clinic_id, 'hero_subtitle', 'Implantology, restorative dentistry, and specialist-led treatment plans for demanding patients.'),
    (v_clinic_id, 'services_title', 'Popular Treatments'),
    (v_clinic_id, 'services_subtitle', 'From premium implants to daily restorative care, every service is tailored to long-term oral health.'),
    (v_clinic_id, 'doctors_title', 'Meet Our Doctors'),
    (v_clinic_id, 'doctors_subtitle', 'A multidisciplinary team focused on surgical precision, comfort, and durable outcomes.'),
    (v_clinic_id, 'testimonials_title', 'Patient Feedback'),
    (v_clinic_id, 'testimonials_subtitle', 'Reviews from patients who trusted Global Dent with complex and routine dental care.')
  ON CONFLICT (clinic_id, key) DO UPDATE SET
    value = EXCLUDED.value;

  RAISE NOTICE 'Demo clinic created with ID: %', v_clinic_id;
END $$;
