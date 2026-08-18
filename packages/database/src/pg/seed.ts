import { CivicLensDatabase } from "../index";
import { FACT_CHECK_CLAIMS, VIRAL_PATTERNS_DB } from "../fact_check_data";
import { PARTY_ANNUAL_INCOME_DATA, PARTY_META_MAP } from "../party_income_history";
import { BONDS_META } from "../funding_data";
import { STATE_AUDITED_METRICS_DATA } from "../index";
import { DATASET_KEYS, type DatasetKey } from "./datasets";
import { closePool, getPool, isPostgresUrl } from "./client";

function collectSnapshot(db: CivicLensDatabase): Record<DatasetKey, unknown> {
  const memory = db as unknown as {
    sources: unknown[];
    evidences: unknown[];
    schemes: unknown[];
    stateFactsData: unknown[];
    cagReports: unknown[];
    manifestoPromises: unknown[];
    ministersData: unknown[];
    stories: unknown[];
    partyFundingData: unknown[];
    corporateDonorsData: unknown[];
    factCheckClaims: unknown[];
  };

  return {
    sources: memory.sources,
    evidences: memory.evidences,
    schemes: memory.schemes,
    state_facts: memory.stateFactsData,
    state_audited_metrics: STATE_AUDITED_METRICS_DATA,
    cag_reports: memory.cagReports,
    manifesto_promises: memory.manifestoPromises,
    ministers: memory.ministersData,
    stories: memory.stories,
    party_funding: memory.partyFundingData,
    corporate_donors: memory.corporateDonorsData,
    party_annual_income: PARTY_ANNUAL_INCOME_DATA,
    party_meta_map: PARTY_META_MAP,
    bonds_meta: BONDS_META,
    fact_check_claims: FACT_CHECK_CLAIMS,
    viral_patterns: VIRAL_PATTERNS_DB,
  };
}

async function seedNormalizedTables(pool: ReturnType<typeof getPool>, snapshot: Record<DatasetKey, unknown>) {
  const schemes = snapshot.schemes as Array<Record<string, unknown>>;
  for (const scheme of schemes) {
    await pool.query(
      `INSERT INTO schemes (
        id, slug, name, hindi_name, ministry, launch_year, budget_allocated_cr,
        expenditure_cr, beneficiaries_count, coverage_target, cag_verdict, evidence_score, summary
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        hindi_name = EXCLUDED.hindi_name,
        ministry = EXCLUDED.ministry,
        launch_year = EXCLUDED.launch_year,
        budget_allocated_cr = EXCLUDED.budget_allocated_cr,
        expenditure_cr = EXCLUDED.expenditure_cr,
        beneficiaries_count = EXCLUDED.beneficiaries_count,
        coverage_target = EXCLUDED.coverage_target,
        cag_verdict = EXCLUDED.cag_verdict,
        evidence_score = EXCLUDED.evidence_score,
        summary = EXCLUDED.summary`,
      [
        scheme.id,
        scheme.slug,
        scheme.name,
        scheme.hindiName ?? null,
        scheme.ministry,
        scheme.launchYear,
        scheme.budgetAllocatedCr,
        scheme.expenditureCr,
        scheme.beneficiariesCount ?? 0,
        scheme.coverageTarget ?? "",
        scheme.cagVerdict ?? "UNAUDITED",
        scheme.evidenceScore ?? 85,
        scheme.summary,
      ]
    );
  }

  const stateFacts = snapshot.state_facts as Array<Record<string, unknown>>;
  for (const st of stateFacts) {
    const code = String(st.stateCode || st.code || "").toUpperCase();
    if (!code) continue;
    await pool.query(
      `INSERT INTO state_facts (state_code, state_name, payload)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (state_code) DO UPDATE SET
         state_name = EXCLUDED.state_name,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [code, st.name || code, JSON.stringify(st)]
    );
  }

  const claims = snapshot.fact_check_claims as Array<Record<string, unknown>>;
  for (const claim of claims) {
    const slug = String(claim.id || claim.slug || "").replace(/^fc-/, "");
    await pool.query(
      `INSERT INTO fact_check_claims (id, slug, title, claim, category, verdict, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug,
         title = EXCLUDED.title,
         claim = EXCLUDED.claim,
         category = EXCLUDED.category,
         verdict = EXCLUDED.verdict,
         payload = EXCLUDED.payload`,
      [
        claim.id,
        slug || claim.id,
        claim.title,
        claim.claim,
        claim.category,
        claim.verdict,
        JSON.stringify(claim),
      ]
    );
  }
}

async function seed(): Promise<void> {
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    console.error("DATABASE_URL must be set to a PostgreSQL connection string.");
    process.exit(1);
  }

  const memoryDb = new CivicLensDatabase();
  const snapshot = collectSnapshot(memoryDb);
  const pool = getPool();

  for (const key of DATASET_KEYS) {
    await pool.query(
      `INSERT INTO civic_datasets (dataset_key, payload)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (dataset_key) DO UPDATE SET
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [key, JSON.stringify(snapshot[key])]
    );
    console.log(`Seeded dataset: ${key}`);
  }

  await seedNormalizedTables(pool, snapshot);
  await closePool();
  console.log("All civic datasets seeded to PostgreSQL.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
