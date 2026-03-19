DO $$
DECLARE
  v_clinic_id uuid;
BEGIN
  -- Clinic
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

  -- Doctors
  INSERT INTO doctors (id, clinic_id, name, specialty, photo_url) VALUES
    (gen_random_uuid(), v_clinic_id, 'Абилов Тофик Исламович', 'Главный врач, хирург-имплантолог (26 лет стажа)', '/doctors/abilov.jpg'),
    (gen_random_uuid(), v_clinic_id, 'Алимжан Жомартович', 'Хирург-имплантолог (All-on-4, синус-лифтинг)', '/doctors/alimzhan.jpg'),
    (gen_random_uuid(), v_clinic_id, 'Юсупбеков Эрик Рустамович', 'Хирург-имплантолог, ортопед', '/doctors/erik.jpg'),
    (gen_random_uuid(), v_clinic_id, 'Камалидин Абидинович', 'Стоматолог-терапевт', '/doctors/kamalidin.jpg'),
    (gen_random_uuid(), v_clinic_id, 'Кужербаева Данара Жанибековна', 'Стоматолог-терапевт, детский врач', '/doctors/danara.jpg')
  ON CONFLICT DO NOTHING;

  -- Services
  INSERT INTO services (id, clinic_id, name, description, price) VALUES
    (gen_random_uuid(), v_clinic_id, 'Имплантат Straumann', 'Премиальная имплантация с пожизненной гарантией', '450000'),
    (gen_random_uuid(), v_clinic_id, 'Имплантат MIS / AlphaBio', 'Надежная имплантация по доступной цене', '160000'),
    (gen_random_uuid(), v_clinic_id, 'Профессиональная чистка зубов', 'Удаление камня и налета (Акция)', '13500'),
    (gen_random_uuid(), v_clinic_id, 'Лечение кариеса', 'Премиальные световые пломбы', '7000')
  ON CONFLICT DO NOTHING;

  -- Reviews
  INSERT INTO reviews (id, clinic_id, author, rating, comment) VALUES
    (gen_random_uuid(), v_clinic_id, 'Руслан М.', 5, 'Тофик Исламович — врач от бога! Ставил импланты Straumann, всё прошло идеально, золотые руки. Рекомендую всем!'),
    (gen_random_uuid(), v_clinic_id, 'Асель К.', 5, 'Вожу ребенка только к Данаре Жанибековне. Настоящая зубная фея — ребенок перестал бояться стоматолога!'),
    (gen_random_uuid(), v_clinic_id, 'Марат Т.', 5, 'Делал All-on-4 у Алимжана Жомартовича. Операция прошла на высшем уровне, через 3 месяца уже полноценно жую. Спасибо огромное!'),
    (gen_random_uuid(), v_clinic_id, 'Айгерим Н.', 5, 'Лечила кариес у Камалидина Абидиновича — никакой боли, пломба как родная. Клиника чистая, современная, персонал вежливый.'),
    (gen_random_uuid(), v_clinic_id, 'Дмитрий С.', 5, 'Эрик Рустамович поставил коронки — идеально подобрал цвет, сидят как влитые. Профессионал высокого класса, буду обращаться снова.')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Demo clinic created with ID: %', v_clinic_id;
END $$;
