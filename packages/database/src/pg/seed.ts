import { CivicLensDatabase } from "../index";
import { FACT_CHECK_CLAIMS, VIRAL_PATTERNS_DB } from "../fact_check_data";
import { PARTY_ANNUAL_INCOME_DATA, PARTY_META_MAP } from "../party_income_history";
import { BONDS_META } from "../funding_data";
import { STATE_AUDITED_METRICS_DATA } from "../index";
import { DATASET_KEYS, type DatasetKey } from "./datasets";
import { closePool, getPool, isPostgresUrl } from "./client";
import { loadEnvFiles } from "./env";
import { printTableCounts, seedNormalizedTables } from "./seed-normalized";

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
    states: db.getStates(),
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

async function seed(): Promise<void> {
  loadEnvFiles();

  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    console.error("DATABASE_URL must be set to a PostgreSQL connection string.");
    console.error("Create a .env file in the repo root or export DATABASE_URL before running db:seed.");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL!;
  const hostHint = dbUrl.includes("@") ? dbUrl.split("@")[1]?.split("/")[0] : "configured host";
  console.log(`Seeding Postgres at ${hostHint} ...`);

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

  console.log("Seeding normalized tables...");
  await seedNormalizedTables(pool, snapshot);
  await printTableCounts(pool);
  await closePool();
  console.log("\nAll civic datasets seeded to PostgreSQL.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
