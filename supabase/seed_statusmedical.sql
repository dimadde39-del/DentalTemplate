-- Status Medical Clinic onboarding seed
-- Project ref: frucemzortchdwwcvqfk
-- Source notes:
--   1. Base clinic cloned via onboard_new_clinic('template', ...).
--   2. Content enriched from https://status-dental-center.kz on 2026-03-27.
--   3. Variant is warm-clinic with Sky Stom blue accent (#00A1D6).

SELECT onboard_new_clinic('template', 'statusmedical', 'Status Medical Clinic', NULL);

UPDATE clinics SET
  primary_color   = '#00A1D6',
  contact_phone   = '+7 776 035 65 33',
  contact_email   = 'status_medical_clinic@gmail.com',
  google_maps_url = NULL,
  instagram_url   = 'https://instagram.com/status_medical_clinic',
  facebook_url    = NULL,
  theme           = '{"variant":"warm-clinic","accent":"#00A1D6"}'::jsonb
WHERE slug = 'statusmedical';

DELETE FROM services
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical');

INSERT INTO services (clinic_id, name, description, price) VALUES
  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Бесплатная консультация',
   'Профилактический осмотр, первичная диагностика и маршрут лечения',
   'Бесплатно'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Первичная консультация терапевта',
   'Осмотр, жалобы, диагностика и первичный план лечения',
   '3 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Лечение кариеса',
   'Современное терапевтическое лечение с анестезией и реставрацией',
   'от 20 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Лечение периодонтита',
   'Лечение воспаления каналов и тканей вокруг корня зуба',
   'от 50 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Художественная реставрация',
   'Эстетическое восстановление формы и анатомии зуба',
   'от 50 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Эндо перелечивание 1 к/к',
   'Повторное эндодонтическое лечение одного корневого канала',
   'от 50 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Первичная консультация ортодонта',
   'Осмотр прикуса, диагностика и подбор метода коррекции',
   'от 8 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Каппа ретейнер / от бруксизма',
   'Каппы для удержания результата лечения или защиты от стираемости',
   'от 45 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Set up элайнеров',
   'Цифровое планирование ортодонтического лечения на элайнерах',
   'от 99 500 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Первичная консультация ортопеда',
   'Осмотр, диагностика и план протезирования',
   'от 5 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Съемные протезы',
   'Полное или частичное съемное протезирование',
   'от 94 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Коронки',
   'Восстановление зубов коронками и ортопедическими конструкциями',
   'от 67 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Винир E-max',
   'Керамический винир для эстетической коррекции улыбки',
   'от 182 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Устранение рецессии в области 1 зуба',
   'Пластика мягких тканей в зоне одного зуба',
   'от 106 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   '3D сканер',
   'Цифровое сканирование зубных рядов и мягких тканей',
   '30 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Build up / наращивание зуба под коронку',
   'Подготовка разрушенного зуба под ортопедическую конструкцию',
   'от 50 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Профессиональная чистка зубов',
   'Комплексная гигиена полости рта, Air Flow и ультразвук',
   'от 21 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Пульпит 1-канальный',
   'Эндодонтическое лечение одноканального зуба',
   'от 50 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Брекеты',
   'Ортодонтическое лечение брекет-системами',
   'от 188 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Коррекция брекет-системы',
   'Плановая активация и контроль ортодонтического лечения',
   'от 11 800 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Ортодонтическая пластинка',
   'Съемная пластинка для коррекции прикуса у детей и подростков',
   'от 141 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Элайнеры, полный курс',
   'Полный курс выравнивания зубов прозрачными каппами',
   'от 2 398 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Протез ALL-ON-4/6',
   'Комплексное протезирование на 4 или 6 имплантах',
   'от 1 463 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Первичная консультация хирурга',
   'Хирургический осмотр, план удаления или имплантации',
   'от 8 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Гингивопластика',
   'Коррекция уровня и формы десны',
   'от 24 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Синус-лифтинг',
   'Костная пластика верхней челюсти перед имплантацией',
   'от 293 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Имплантация',
   'Установка дентального импланта с международными системами',
   'от 153 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Удаление зуба',
   'Простое и сложное удаление зубов, включая зубы мудрости',
   'от 18 000 ₸'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Имплантация Straumann (Швейцария)',
   'Премиальная имплантация на системе Straumann',
   'от 457 000 ₸');

DELETE FROM doctors
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical');

INSERT INTO doctors (clinic_id, name, specialty, photo_url) VALUES
  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Шахзад Абдураимов',
   'Хирург-имплантолог, главный врач',
   NULL),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Муталов Саид Саидрахимович',
   'Имплантолог, ортопед',
   NULL),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Дуйсенбаев Куандык Зарифбайулы',
   'Терапевт, ортопед, хирург',
   NULL),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Тогабай Токжан Батыркызы',
   'Хирург, терапевт',
   NULL),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Динтай Баглан Сериккызы',
   'Ортодонт, ортопед',
   NULL),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Оразова Асылжан Сериковна',
   'Детский ортодонт',
   NULL),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Дубеков Алмаз Тулеуханович',
   'Ортопед, терапевт',
   NULL);

DELETE FROM reviews
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical');

INSERT INTO reviews (clinic_id, author, rating, comment) VALUES
  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Тогжан Баймагамбетова', 5,
   'Приходила на консультацию, так как сейчас в поисках стоматологии на установку брекетов себе и дочери. Клиника как из фильмов зарубежных, а специалисты все как на подбор.'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Гульмира Есентимирова', 5,
   'Хочу выразить огромную благодарность врачу стоматологу Темирлана Бекмухамбетова за профессионализм и внимательное отношение. Лечение прошло комфортно и безболезненно, врач всё подробно объяснял и был очень аккуратен.'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Эльмира Галайко', 5,
   'Ставили дочери брекеты у Ахрора Бахтияровича. Цены приемлемые. Носили почти два года. Сейчас у дочери отличная улыбка, спасибо за внимательность и чуткое отношение.'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Лаура Успанова', 5,
   'Была у врача Темирлана Бекмухамбетова, вырвал мне уже второй мудрый зуб и я ничего не почувствовала. Всё сделал быстро, аккуратно и очень внимательно.'),

  ((SELECT id FROM clinics WHERE slug = 'statusmedical'),
   'Maria Rybnikova', 5,
   'Лучшая стоматология в которой я была за всю жизнь. Записалась поздно вечером сразу на утро следующего дня, доктор сразу назвал финальную стоимость и никто не пытался продать лишнюю процедуру.');

UPDATE settings SET value = 'Современная стоматология для всей семьи'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'hero_title';

UPDATE settings SET value = 'Status Medical Clinic — 3 филиала в Алматы. Имплантация, виниры, брекеты, лечение. Работаем ежедневно до 24:00. Рейтинг 4.9, 170+ отзывов.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'hero_subtitle';

UPDATE settings SET value = 'Наши услуги'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'services_title';

UPDATE settings SET value = 'Полный спектр — от чистки до имплантации. Доступные цены и рассрочка.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'services_subtitle';

UPDATE settings SET value = 'Наши специалисты'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'doctors_title';

UPDATE settings SET value = 'Команда опытных стоматологов в трёх филиалах Алматы.'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'doctors_subtitle';

UPDATE settings SET value = 'Отзывы пациентов'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'testimonials_title';

UPDATE settings SET value = 'Более 170 отзывов с рейтингом 4.9 ⭐'
WHERE clinic_id = (SELECT id FROM clinics WHERE slug = 'statusmedical')
  AND key = 'testimonials_subtitle';

SELECT get_clinic_public_data('statusmedical');
