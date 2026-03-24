-- Sky Stom onboarding seed
-- Project ref: frucemzortchdwwcvqfk
-- Notes:
--   1. This script assumes the `template` clinic already exists.
--   2. Four doctor photos were matched and uploaded to the public `doctors` bucket.
--      `daur.png` was excluded because the prompt explicitly marks Daur as director,
--      not a doctor. `aibek.png` did not match any doctor listed in the prompt.

SELECT onboard_new_clinic('template', 'skystom', 'Sky Stom', NULL);

UPDATE clinics SET
  primary_color   = '#00A1D6',
  contact_phone   = '+7 776 293 33 30',
  contact_email   = 'skystom.2021@gmail.com',
  google_maps_url = NULL,
  instagram_url   = 'https://instagram.com/sky.stom',
  facebook_url    = 'https://facebook.com/Sky.stom'
WHERE slug = 'skystom';

DELETE FROM services
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom');

INSERT INTO services (clinic_id, name, description, price) VALUES
  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Бесплатная консультация',
   'Первичный осмотр + индивидуальный план лечения',
   'Бесплатно'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Профессиональная чистка',
   'Ультразвук + Air Flow — комплексная гигиена полости рта',
   'от 7 500 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Лечение кариеса / пульпита',
   'Современное лечение с анестезией и качественной пломбировкой',
   'от 7 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Брекеты металлические (Ю. Корея)',
   'Южнокорейская металлическая брекет-система, 1 челюсть',
   '25 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Брекеты керамические (Ю. Корея)',
   'Эстетичная керамическая брекет-система, 1 челюсть',
   '40 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Брекеты сапфировые (Ю. Корея)',
   'Прозрачная сапфировая брекет-система, 1 челюсть',
   '80 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Брекеты металлические (США)',
   'Американская металлическая брекет-система, 1 челюсть',
   'от 37 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Самолигирующие брекеты (H4, AO)',
   'Премиум самолигирующая система American Orthodontics, 1 челюсть',
   'от 130 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Пластинки / ретейнеры',
   'Ортодонтические пластинки и несъёмные ретейнеры',
   '30 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Каппы / элайнеры',
   'Прозрачные каппы для коррекции прикуса',
   '10 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Коррекция брекетов',
   'Плановая коррекция и активация брекет-системы',
   'от 4 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Виниры',
   'Эстетические керамические виниры E-max, за 1 единицу',
   '75 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Имплантация',
   'Установка импланта (Osstem, IDL, Biohorizons и др.)',
   'от 75 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Удаление зуба',
   'Простое, сложное удаление и удаление зубов мудрости',
   'по консультации'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Рентген-диагностика',
   'Прицельный снимок, ОПТГ (панорамный), КТ (3D)',
   'по прайсу');

DELETE FROM doctors
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom');

INSERT INTO doctors (clinic_id, name, specialty, photo_url) VALUES
  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Аружан Акбаралиевна',
   'Ортодонт, терапевт',
   'https://frucemzortchdwwcvqfk.supabase.co/storage/v1/object/public/doctors/skystom/aruzhan.png'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Халида Саматовна',
   'Ортопед, эстетическая стоматология',
   'https://frucemzortchdwwcvqfk.supabase.co/storage/v1/object/public/doctors/skystom/khalida.png'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Назым Нурлановна',
   'Терапевт, ортодонт',
   'https://frucemzortchdwwcvqfk.supabase.co/storage/v1/object/public/doctors/skystom/nazym.png'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Гульназ Еркиновна',
   'Ортодонт',
   NULL),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Асылхан Канатович',
   'Терапевт, хирург',
   'https://frucemzortchdwwcvqfk.supabase.co/storage/v1/object/public/doctors/skystom/asylkhan.png'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Нарбек Маратович',
   'Стоматолог общей практики',
   NULL);

DELETE FROM reviews
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom');

INSERT INTO reviews (clinic_id, author, rating, comment) VALUES
  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Akerke K.', 5,
   'Нарбек Маратович и Нурали — огонь! Всё на высшем уровне 🫶🏻'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Baha Maku', 5,
   'Огромная благодарность Асылхану Канатовичу за профессионализм и внимательное отношение'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Zhanerke Ospanbek', 5,
   'Алия — самая компетентная, брекеты поставили идеально, результат превзошёл ожидания'),

  ((SELECT id FROM clinics WHERE slug = 'skystom'),
   'Динара М.', 5,
   'Гульназ Еркиновна — очень внимательный и чуткий специалист, подробно объясняет каждый шаг лечения');

UPDATE settings SET value = 'Ваша улыбка — наша забота'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'hero_title';

UPDATE settings SET value = 'Sky Stom — современная стоматология в Алматы. Брекеты от 25 000 ₸, имплантация, виниры. Бесплатная консультация, 2300+ отзывов.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'hero_subtitle';

UPDATE settings SET value = 'Наши услуги'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'services_title';

UPDATE settings SET value = 'От профгигиены до имплантации — доступные цены и проверенное качество.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'services_subtitle';

UPDATE settings SET value = 'Наши специалисты'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'doctors_title';

UPDATE settings SET value = 'Опытная команда ортодонтов, хирургов и терапевтов, которым доверяют тысячи пациентов.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'doctors_subtitle';

UPDATE settings SET value = 'Отзывы пациентов'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'testimonials_title';

UPDATE settings SET value = 'Более 2300 отзывов в Google и 2ГИС с рейтингом 4.9 ⭐'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'skystom')
  AND key = 'testimonials_subtitle';

SELECT get_clinic_public_data('skystom');
