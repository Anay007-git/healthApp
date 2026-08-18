import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FACT_CHECK_CLAIMS, VIRAL_PATTERNS_DB } from "../fact_check_data";
import { PARTY_ANNUAL_INCOME_DATA, PARTY_META_MAP } from "../party_income_history";
import { BONDS_META } from "../funding_data";
import { STATE_AUDITED_METRICS_DATA } from "../index";
import { DATASET_KEYS, type DatasetKey } from "./datasets";
import type { Pool } from "pg";
import { getPool } from "./client";
import { seedNormalizedTables } from "./seed-normalized";

type SnapshotDb = {
  getStates(): unknown[];
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

export function collectCivicSnapshot(db: SnapshotDb): Record<DatasetKey, unknown> {
  return {
    sources: db.sources,
    evidences: db.evidences,
    schemes: db.schemes,
    states: db.getStates(),
    state_facts: db.stateFactsData,
    state_audited_metrics: STATE_AUDITED_METRICS_DATA,
    cag_reports: db.cagReports,
    manifesto_promises: db.manifestoPromises,
    ministers: db.ministersData,
    stories: db.stories,
    party_funding: db.partyFundingData,
    corporate_donors: db.corporateDonorsData,
    party_annual_income: PARTY_ANNUAL_INCOME_DATA,
    party_meta_map: PARTY_META_MAP,
    bonds_meta: BONDS_META,
    fact_check_claims: FACT_CHECK_CLAIMS,
    viral_patterns: VIRAL_PATTERNS_DB,
  };
}

export async function applyPostgresSchema(pool: Pool = getPool()): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url));
  const schemaPath = join(here, "../../../../schema.sql");
  const sql = readFileSync(schemaPath, "utf8");
  await pool.query(sql);
}

export async function isPostgresEmpty(pool: Pool = getPool()): Promise<boolean> {
  try {
    const result = await pool.query<{ count: number }>(
      "SELECT COUNT(*)::int AS count FROM civic_datasets"
    );
    return (result.rows[0]?.count ?? 0) === 0;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === "42P01") {
      return true;
    }
    throw error;
  }
}

export async function seedPostgresFromMemory(pool: Pool = getPool()): Promise<void> {
  const { CivicLensDatabase } = await import("../index");
  const memoryDb = new CivicLensDatabase();
  const snapshot = collectCivicSnapshot(memoryDb as unknown as SnapshotDb);

  for (const key of DATASET_KEYS) {
    await pool.query(
      `INSERT INTO civic_datasets (dataset_key, payload)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (dataset_key) DO UPDATE SET
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [key, JSON.stringify(snapshot[key])]
    );
  }

  await seedNormalizedTables(pool, snapshot);
}

export async function getPostgresTableCounts(pool: Pool = getPool()): Promise<Record<string, number>> {
  const tables = ["civic_datasets", "states", "schemes", "ministers", "fact_check_claims"];
  const counts: Record<string, number> = {};
  for (const table of tables) {
    const result = await pool.query<{ count: number }>(`SELECT COUNT(*)::int AS count FROM ${table}`);
    counts[table] = result.rows[0]?.count ?? 0;
  }
  return counts;
}

export async function ensurePostgresReady(pool: Pool = getPool()): Promise<boolean> {
  const empty = await isPostgresEmpty(pool);
  if (!empty) {
    return false;
  }

  try {
    await applyPostgresSchema(pool);
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code !== "42P01") {
      console.warn("[database] Schema apply skipped or partial:", error);
    }
  }

  console.log("[database] Postgres empty — seeding civic datasets from memory...");
  await seedPostgresFromMemory(pool);
  console.log("[database] Postgres seed complete.");
  return true;
}
