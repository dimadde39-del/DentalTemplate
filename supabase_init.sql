-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    selected_service TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anonymous users cannot read or directly insert into the table
-- We drop default permissions and only allow inserting via RPC as SECURITY DEFINER

-- Create RPC for public lead insertion
CREATE OR REPLACE FUNCTION insert_public_lead(
    p_slug TEXT,
    p_name TEXT,
    p_phone TEXT,
    p_service TEXT
) RETURNS JSONB AS $$
DECLARE
    v_lead_id UUID;
BEGIN
    -- This is a stub for future multi-tenant logic.
    -- Right now, we insert the lead and use p_slug as the clinic_id
    INSERT INTO leads (clinic_id, name, phone, selected_service)
    VALUES (p_slug, p_name, p_phone, p_service)
    RETURNING id INTO v_lead_id;

    RETURN jsonb_build_object('success', true, 'lead_id', v_lead_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on the RPC to anon
GRANT EXECUTE ON FUNCTION insert_public_lead(TEXT, TEXT, TEXT, TEXT) TO anon;
