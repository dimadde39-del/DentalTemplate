-- Bilal Stom onboarding seed
-- Project ref: frucemzortchdwwcvqfk
-- Created on 2026-03-31

SELECT onboard_new_clinic('template', 'bilalstom', 'Bilal Stom', NULL);

UPDATE clinics SET
  primary_color   = '#1B6B45',
  contact_phone   = '+7 707 666 98 92',
  contact_email   = 'rizametov.ruslan77@gmail.com',
  instagram_url   = 'https://instagram.com/bilal_stom',
  google_maps_url = NULL,
  facebook_url    = NULL,
  theme           = '{"variant": "warm-clinic", "accent": "#1B6B45"}'::jsonb
WHERE slug = 'bilalstom';

DELETE FROM services
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom');

INSERT INTO services (clinic_id, name, description, price) VALUES
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Бесплатная консультация', 'Осмотр + план лечения', 'Бесплатно'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Профессиональная чистка', 'Скидка 30% по выходным', 'от 8 000 ₸'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Лечение кариеса', 'Световые пломбы', 'от 7 000 ₸'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Виниры', 'Керамические, за 1 единицу', '60 000 ₸'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Коронка из циркония', 'Безметалловая, высокая прочность', '60 000 ₸'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Керамическая коронка', 'Безметалловая эстетика', '50 000 ₸'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Имплантация', 'Alfa-Bio / DMI / Osstem', 'от 89 990 ₸'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Брекеты', 'Металл, керамика — на 1 челюсть', 'по консультации'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Удаление зуба', 'Простое и хирургическое', 'по консультации'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Снятие коронок', 'Аккуратное снятие без повреждений', '1 000 ₸');

DELETE FROM doctors
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom');

INSERT INTO doctors (clinic_id, name, specialty, photo_url) VALUES
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Ризаметов Руслан Шавкатович',
   'Директор, хирург-имплантолог (16 лет стажа)',
   NULL),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Умаров Мансур Икрамжанович',
   'Детский стоматолог, терапевт, хирург',
   NULL),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Аззамкулов Жасурбек Хаетжонович',
   'Ортопед, терапевт, хирург',
   NULL);

DELETE FROM reviews
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom');

INSERT INTO reviews (clinic_id, author, rating, comment) VALUES
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Айгуль М.', 5,
   'Руслан Шавкатович — настоящий профессионал. Сложный случай решил за один визит, без боли'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Дамир К.', 5,
   'Поставил циркониевые коронки у Жасурбека — идеально подобрал цвет, как родные зубы'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Алия Н.', 5,
   'Вожу ребёнка только к Мансуру Икрамжановичу. Ребёнок не боится, врач очень терпелив'),
  ((SELECT id FROM clinics WHERE slug = 'bilalstom'),
   'Сергей В.', 5,
   'Клиника работает с 2010 года и это чувствуется. Надёжно, доступно, всегда на связи');

UPDATE settings SET value = 'Мы создаём идеальные улыбки с 2010 года'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'hero_title';

UPDATE settings SET value = 'Bilal Stom — стоматология в Алматы. Имплантация, виниры, цирконий, детский врач. 2 филиала, работаем круглосуточно.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'hero_subtitle';

UPDATE settings SET value = 'Услуги клиники'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'services_title';

UPDATE settings SET value = 'Доступные цены, современное оборудование — микроскоп, цирконий, имплантация.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'services_subtitle';

UPDATE settings SET value = 'Наша команда'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'doctors_title';

UPDATE settings SET value = 'Руслан Шавкатович и команда — 16+ лет практики, сложные случаи, детская стоматология.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'doctors_subtitle';

UPDATE settings SET value = 'Пациенты о нас'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'testimonials_title';

UPDATE settings SET value = 'Более 800 оценок в 2ГИС с рейтингом 5.0 ⭐'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'bilalstom')
  AND key = 'testimonials_subtitle';

-- Demo CRM user is created separately through Supabase Auth Admin API:
-- email: demo@bilalstom.kz
-- password: BilalDemo2026

SELECT get_clinic_public_data('bilalstom');
