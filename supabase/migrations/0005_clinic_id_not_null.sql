-- Enforce NOT NULL on clinic_id for all tenant tables
-- Prevents orphan rows that bypass RLS policies
ALTER TABLE leads ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE services ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE doctors ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE settings ALTER COLUMN clinic_id SET NOT NULL;
