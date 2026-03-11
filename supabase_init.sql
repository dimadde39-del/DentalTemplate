CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for form submissions)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;
CREATE POLICY "Allow anonymous inserts" ON leads FOR INSERT TO anon WITH CHECK (true);

-- Restrict select/update/delete to authenticated admins
DROP POLICY IF EXISTS "Restrict select to authenticated users only" ON leads;
CREATE POLICY "Restrict select to authenticated users only" ON leads FOR SELECT TO authenticated USING (true);
