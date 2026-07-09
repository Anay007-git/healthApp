-- Migration: Add Lab Report Verification Tables and Safeguard Triggers

-- 1. Create Enums for Status and Source Types
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'labdoor_match_status') THEN
        CREATE TYPE labdoor_match_status AS ENUM ('active', 'stale', 'broken');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lab_report_source_type') THEN
        CREATE TYPE lab_report_source_type AS ENUM ('sample_demo', 'brand_published', 'third_party_verified');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lab_report_status') THEN
        CREATE TYPE lab_report_status AS ENUM ('draft', 'published', 'expired', 'flagged');
    END IF;
END $$;

-- 2. Create labdoor_mappings Table (One-to-One mapping per supplement)
CREATE TABLE IF NOT EXISTS labdoor_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplement_id UUID NOT NULL UNIQUE REFERENCES supplements(id) ON DELETE CASCADE,
    labdoor_url TEXT NOT NULL,
    labdoor_slug VARCHAR(255),
    matched_by VARCHAR(255) NOT NULL,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    match_status labdoor_match_status DEFAULT 'active'
);

-- 3. Create lab_reports Table (One-to-One report per supplement)
CREATE TABLE IF NOT EXISTS lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplement_id UUID NOT NULL UNIQUE REFERENCES supplements(id) ON DELETE CASCADE,
    source_type lab_report_source_type NOT NULL DEFAULT 'sample_demo',
    issuing_lab VARCHAR(255),
    certificate_id VARCHAR(255),
    source_url TEXT,
    purity_score INT,
    label_accuracy_status TEXT,
    heavy_metals_status TEXT,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    status lab_report_status DEFAULT 'draft',
    CONSTRAINT chk_purity_score_range CHECK (purity_score >= 0 AND purity_score <= 100)
);

-- 4. Indexes for lookup performance
CREATE INDEX IF NOT EXISTS idx_labdoor_mappings_supplement_id ON labdoor_mappings(supplement_id);
CREATE INDEX IF NOT EXISTS idx_lab_reports_supplement_id ON lab_reports(supplement_id);

-- 5. Trigger Function to ensure sample_demo items do not have fabricated credentials when published
CREATE OR REPLACE FUNCTION check_published_lab_report() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND NEW.source_type = 'sample_demo' THEN
        IF NEW.certificate_id IS NOT NULL OR NEW.purity_score IS NOT NULL THEN
            RAISE EXCEPTION 'Demo/Sample reports cannot claim verified certificate IDs or purity scores.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Attach Trigger to lab_reports Table
DROP TRIGGER IF EXISTS trg_check_published_lab_report ON lab_reports;
CREATE TRIGGER trg_check_published_lab_report
BEFORE INSERT OR UPDATE ON lab_reports
FOR EACH ROW
EXECUTE FUNCTION check_published_lab_report();
