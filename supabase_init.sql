CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;
CREATE POLICY "Allow anonymous inserts" ON leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Restrict select to authenticated users only" ON leads;
CREATE POLICY "Restrict select to authenticated users only" ON leads FOR SELECT TO authenticated USING (true);
