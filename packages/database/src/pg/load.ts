import type { CivicDatasetSnapshot, CivicDatasetSubmission } from "./datasets";
import { DATASET_KEYS, type DatasetKey } from "./datasets";
import { getPool, isPostgresUrl } from "./client";

export async function loadCivicDatasetsFromPostgres(): Promise<CivicDatasetSnapshot | null> {
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    return null;
  }

  const pool = getPool();
  const { rows } = await pool.query<{ dataset_key: string; payload: unknown }>(
    `SELECT dataset_key, payload FROM civic_datasets WHERE dataset_key = ANY($1::text[])`,
    [DATASET_KEYS as unknown as string[]]
  );

  if (rows.length === 0) {
    return null;
  }

  const snapshot = {} as CivicDatasetSnapshot;
  for (const row of rows) {
    snapshot[row.dataset_key as DatasetKey] = row.payload as never;
  }

  const missing = DATASET_KEYS.filter((key) => !(key in snapshot));
  if (missing.length > 0) {
    console.warn(`[database] Missing civic datasets in Postgres: ${missing.join(", ")}`);
  }

  return snapshot;
}

export async function loadFactCheckSubmissionsFromPostgres(): Promise<CivicDatasetSubmission[]> {
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    return [];
  }

  const pool = getPool();
  const { rows } = await pool.query<{
    id: string;
    claim_text: string;
    source_platform: string;
    url: string | null;
    user_contact: string | null;
    upvotes: number;
    status: string;
    submitted_at: Date;
  }>(
    `SELECT id, claim_text, source_platform, url, user_contact, upvotes, status, submitted_at
     FROM fact_check_submissions
     ORDER BY submitted_at DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    claimText: row.claim_text,
    sourcePlatform: row.source_platform,
    url: row.url ?? undefined,
    userContact: row.user_contact ?? undefined,
    submittedAt: row.submitted_at.toISOString().split("T")[0],
    upvotes: row.upvotes,
    status: row.status as CivicDatasetSubmission["status"],
  }));
}

export async function insertFactCheckSubmissionToPostgres(submission: {
  id: string;
  claimText: string;
  sourcePlatform: string;
  url?: string;
  userContact?: string;
  upvotes?: number;
  status?: string;
}): Promise<void> {
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    return;
  }

  const pool = getPool();
  await pool.query(
    `INSERT INTO fact_check_submissions (id, claim_text, source_platform, url, user_contact, upvotes, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      submission.id,
      submission.claimText,
      submission.sourcePlatform,
      submission.url ?? null,
      submission.userContact ?? null,
      submission.upvotes ?? 1,
      submission.status ?? "PENDING_REVIEW",
    ]
  );
}
