-- ══════════════════════════════════════════════════════════════════════════════
-- CivicLens Bharat — Official PostgreSQL Database Schema
-- Verifiable Civic Intelligence, Public Finance, CAG Audits & Political Funding
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── 1. DROP OBSOLETE / UNRELATED TABLES ───────────────────────────────────────
DROP TABLE IF EXISTS alternative_mappings CASCADE;
DROP TABLE IF EXISTS gyms CASCADE;
DROP TABLE IF EXISTS healthy_alternatives CASCADE;
DROP TABLE IF EXISTS healthy_cuisine_tags CASCADE;
DROP TABLE IF EXISTS junk_items CASCADE;
DROP TABLE IF EXISTS supplements CASCADE;

-- ── 2. PRIMARY SOURCES & EVIDENCE LEDGER ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    url TEXT,
    publication_date DATE,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN (
        'GOVERNMENT_REPORT', 'CAG_AUDIT', 'UNION_BUDGET', 'PIB_RELEASE', 
        'ECI_AFFIDAVIT', 'INDEPENDENT_RESEARCH', 'SUPREME_COURT_RECORD'
    )),
    document_url TEXT,
    page_number INT,
    is_official BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidences (
    id VARCHAR(100) PRIMARY KEY,
    claim TEXT NOT NULL,
    evidence_summary TEXT NOT NULL,
    source_id VARCHAR(100) REFERENCES sources(id) ON DELETE SET NULL,
    document_id VARCHAR(100),
    page_number INT,
    methodology TEXT,
    verification_status VARCHAR(50) DEFAULT 'VERIFIED' CHECK (verification_status IN (
        'VERIFIED', 'REVIEW_PENDING', 'UNVERIFIED', 'DISPUTED'
    )),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(255) DEFAULT 'CivicLens Audit Engine'
);

-- ── 3. CENTRAL & STATE GOVERNMENT SCHEMES ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    ministry VARCHAR(255) NOT NULL,
    launch_year INT NOT NULL,
    budget_allocated_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    expenditure_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    beneficiaries_count BIGINT DEFAULT 0,
    coverage_target TEXT,
    cag_verdict VARCHAR(50) DEFAULT 'UNAUDITED' CHECK (cag_verdict IN (
        'SATISFACTORY', 'PARTIAL_DISCREPANCY', 'CRITICAL_DEFICIT', 'UNAUDITED'
    )),
    evidence_score INT DEFAULT 85 CHECK (evidence_score BETWEEN 0 AND 100),
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scheme_milestones (
    id VARCHAR(100) PRIMARY KEY,
    scheme_id VARCHAR(100) REFERENCES schemes(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL CHECK (stage IN (
        'PROMISE', 'POLICY', 'ANNOUNCEMENT', 'BUDGET', 'ALLOCATION', 
        'EXPENDITURE', 'IMPLEMENTATION', 'CAG_FINDING', 'OUTCOME'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount_cr NUMERIC(12, 2),
    milestone_date DATE NOT NULL,
    evidence_id VARCHAR(100) REFERENCES evidences(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 4. CAG AUDITS & FINANCIAL DISCREPANCIES ──────────────────────────────────

CREATE TABLE IF NOT EXISTS cag_reports (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    report_number VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    state_name VARCHAR(100),
    total_loss_cr NUMERIC(12, 2) DEFAULT 0.00,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cag_findings (
    id VARCHAR(100) PRIMARY KEY,
    report_id VARCHAR(100) REFERENCES cag_reports(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    financial_impact_cr NUMERIC(12, 2) DEFAULT 0.00,
    severity VARCHAR(50) DEFAULT 'MEDIUM' CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    finding_summary TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    govt_response TEXT,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ACTION_TAKEN', 'RESOLVED', 'UNDER_REVIEW')),
    evidence_id VARCHAR(100) REFERENCES evidences(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 5. STATE & UT PROFILES, LEADERSHIP & INDICATORS ──────────────────────────

CREATE TABLE IF NOT EXISTS states (
    code VARCHAR(10) PRIMARY KEY, -- 'AP', 'WB', 'DL', 'MH', etc.
    name VARCHAR(100) UNIQUE NOT NULL,
    capital VARCHAR(100) NOT NULL,
    population BIGINT NOT NULL DEFAULT 0,
    chief_minister VARCHAR(255),
    cm_party VARCHAR(100),
    administrative_head VARCHAR(255),
    governing_group VARCHAR(255),
    gsdp_cr NUMERIC(14, 2),
    literacy_rate NUMERIC(5, 2),
    scores JSONB DEFAULT '{}'::jsonb,
    cag_findings_count INT DEFAULT 0,
    active_schemes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS state_indicators (
    id VARCHAR(100) PRIMARY KEY,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE CASCADE,
    indicator_code VARCHAR(100) NOT NULL,
    indicator_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    value NUMERIC(12, 4) NOT NULL,
    rank INT,
    unit VARCHAR(50),
    higher_is_better BOOLEAN DEFAULT true,
    evidence_id VARCHAR(100) REFERENCES evidences(id) ON DELETE SET NULL
);

-- ── 6. ELECTION MANIFESTO TRACKER ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS manifesto_promises (
    id VARCHAR(100) PRIMARY KEY,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE CASCADE,
    state_name VARCHAR(100) NOT NULL,
    party VARCHAR(100) NOT NULL,
    term_year INT NOT NULL, -- 2014, 2019, 2024, 2026
    category VARCHAR(100) NOT NULL,
    promise_title VARCHAR(255) NOT NULL,
    promise_text TEXT NOT NULL,
    promise_text_hi TEXT,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS' CHECK (status IN (
        'DELIVERED', 'PARTIALLY_DELIVERED', 'IN_PROGRESS', 'NOT_VERIFIED', 'NOT_DELIVERED', 'BROKEN', 'PENDING'
    )),
    evidence_summary TEXT,
    verified_note TEXT,
    evidence_id VARCHAR(100) REFERENCES evidences(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 7. CABINET & STATE MINISTERS (ECI AFFIDAVIT DATA) ────────────────────────

CREATE TABLE IF NOT EXISTS ministers (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    ministry VARCHAR(255),
    constituency VARCHAR(255),
    party VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    state_name VARCHAR(100),
    group_name VARCHAR(255),
    education VARCHAR(255),
    total_assets_cr NUMERIC(12, 2) DEFAULT 0.00,
    liabilities_cr NUMERIC(12, 2) DEFAULT 0.00,
    asset_growth_percent NUMERIC(6, 2) DEFAULT 0.00,
    criminal_cases_pending INT DEFAULT 0,
    criminal_cases_convicted INT DEFAULT 0,
    declared_cases JSONB DEFAULT '{"pending":0,"convicted":0,"acquitted":0,"details":[]}'::jsonb,
    affidavit_url TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 8. POLITICAL PARTY FUNDING & ELECTORAL BONDS ─────────────────────────────

CREATE TABLE IF NOT EXISTS party_funding (
    party_code VARCHAR(50) PRIMARY KEY, -- 'BJP', 'INC', 'TMC', 'BRS', etc.
    party_name VARCHAR(255) NOT NULL,
    electoral_bonds_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_funding_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    percentage_share NUMERIC(5, 2) DEFAULT 0.00,
    color VARCHAR(20) DEFAULT '#0F172A',
    coalition VARCHAR(50) DEFAULT 'Other',
    ideology TEXT,
    yearly_breakdown JSONB DEFAULT '[]'::jsonb,
    audit_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS corporate_donors (
    id SERIAL PRIMARY KEY,
    donor_rank INT NOT NULL,
    donor_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    sector VARCHAR(100) NOT NULL,
    amount_cr NUMERIC(12, 2) NOT NULL,
    primary_recipient_party VARCHAR(100),
    recipient_breakdown JSONB DEFAULT '{}'::jsonb,
    cag_audit_flag TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS party_annual_income (
    id SERIAL PRIMARY KEY,
    year_label VARCHAR(20) NOT NULL, -- '2004-05', '2024-25'
    financial_year INT NOT NULL, -- 2005, 2025
    era VARCHAR(100) NOT NULL,
    is_election_year BOOLEAN DEFAULT false,
    election_note TEXT,
    event_note TEXT,
    party_incomes JSONB NOT NULL, -- {"BJP": 4281.5, "INC": 1240.2, ...}
    total_cr NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 9. INVESTIGATIVE STORIES, NEWSLETTER & ISSUES ────────────────────────────

CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    author VARCHAR(255) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_time_minutes INT DEFAULT 5,
    cover_image_url TEXT,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    preferences TEXT[] DEFAULT ARRAY['CAG', 'Economy', 'Schemes', 'States', 'Elections', 'Governance'],
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'UNSUBSCRIBED'))
);

CREATE TABLE IF NOT EXISTS admin_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED')),
    details TEXT,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 10. CIVIC DATASET SNAPSHOTS (seed migration from in-memory JSON/TS) ─────

CREATE TABLE IF NOT EXISTS civic_datasets (
    dataset_key VARCHAR(100) PRIMARY KEY,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_check_claims (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    claim TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    verdict VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_check_submissions (
    id VARCHAR(100) PRIMARY KEY,
    claim_text TEXT NOT NULL,
    source_platform VARCHAR(100) NOT NULL,
    url TEXT,
    user_contact VARCHAR(255),
    upvotes INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'IN_REVIEW', 'PUBLISHED', 'REJECTED')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS state_facts (
    state_code VARCHAR(10) PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 11. OPTIMIZED INDEXES ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_schemes_slug ON schemes(slug);
CREATE INDEX IF NOT EXISTS idx_schemes_ministry ON schemes(ministry);
CREATE INDEX IF NOT EXISTS idx_cag_reports_year ON cag_reports(year);
CREATE INDEX IF NOT EXISTS idx_manifesto_state_term ON manifesto_promises(state_code, term_year);
CREATE INDEX IF NOT EXISTS idx_ministers_slug ON ministers(slug);
CREATE INDEX IF NOT EXISTS idx_ministers_party ON ministers(party);
CREATE INDEX IF NOT EXISTS idx_party_annual_income_fy ON party_annual_income(financial_year);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
