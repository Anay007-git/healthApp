import {
  buildAdminDatasetsPayload,
  db as memoryDb,
  hydrateDatabaseFromSnapshot,
  type CivicDatasetSnapshot,
} from "@civiclens/database";
import { isPostgresConfigured, neonQuery } from "./neon";

const DATASET_KEYS = [
  "sources",
  "evidences",
  "schemes",
  "states",
  "state_facts",
  "state_audited_metrics",
  "cag_reports",
  "manifesto_promises",
  "ministers",
  "stories",
  "party_funding",
  "corporate_donors",
  "party_annual_income",
  "party_meta_map",
  "bonds_meta",
  "fact_check_claims",
  "viral_patterns",
] as const;

type DatasetKey = (typeof DATASET_KEYS)[number];

async function loadCivicSnapshotFromNeon(): Promise<CivicDatasetSnapshot | null> {
  if (!isPostgresConfigured()) {
    return null;
  }

  const { rows } = await neonQuery<{ dataset_key: string; payload: unknown }>(
    `SELECT dataset_key, payload
     FROM civic_datasets
     WHERE dataset_key = ANY($1::text[])`,
    [DATASET_KEYS as unknown as string[]]
  );

  if (rows.length === 0) {
    return null;
  }

  const snapshot = {} as CivicDatasetSnapshot;
  for (const row of rows) {
    snapshot[row.dataset_key as DatasetKey] = row.payload as never;
  }

  return snapshot;
}

async function loadUserSubmissionsFromNeon() {
  if (!isPostgresConfigured()) {
    return [];
  }

  try {
    const { rows } = await neonQuery<{
      id: string;
      claim_text: string;
      source_platform: string;
      url: string | null;
      user_contact: string | null;
      upvotes: number;
      status: string;
      submitted_at: string;
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
      submittedAt: row.submitted_at?.split("T")[0] ?? row.submitted_at,
      upvotes: row.upvotes,
      status: row.status,
    }));
  } catch {
    return [];
  }
}

export async function loadCivicDatabase() {
  const snapshot = await loadCivicSnapshotFromNeon();
  if (snapshot) {
    const submissions = await loadUserSubmissionsFromNeon();
    return {
      db: hydrateDatabaseFromSnapshot(snapshot, submissions),
      dataSource: "postgresql" as const,
    };
  }

  return {
    db: memoryDb,
    dataSource: "memory" as const,
  };
}

export async function buildBootstrapPayload() {
  const { db, dataSource } = await loadCivicDatabase();
  return {
    success: true,
    dataSource,
    data: {
      schemes: db.getSchemes(),
      states: db.getStates(),
      stateFacts: db.getStateFacts(),
      cagReports: db.getCAGReports(),
      manifestoPromises: db.getManifestoPromises(),
      ministers: db.getMinisters(),
      stateMinisters: db.getAllStateMinisters(),
      stories: db.getStories(),
      partyFunding: db.getPartyFunding(),
      corporateDonors: db.getCorporateDonors(),
      partyAnnualIncome: db.getPartyAnnualIncomeHistory(),
      partyMetaMap: db.getPartyMetaMap(),
      bondsMeta: db.getBondsMeta(),
      factChecks: db.getFactChecks(),
      sources: db.getSources(),
    },
  };
}

export async function buildAdminPayload() {
  const { db, dataSource } = await loadCivicDatabase();
  const payload = buildAdminDatasetsPayload(db);
  return {
    success: true,
    dataSource,
    ...payload,
  };
}
