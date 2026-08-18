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
type WorkflowStatus = "DRAFT" | "IN REVIEW" | "VERIFIED" | "PUBLISHED";

interface CivicSnapshot {
  sources: any[];
  evidences: any[];
  schemes: any[];
  states: any[];
  state_facts: any[];
  state_audited_metrics: Record<string, unknown>;
  cag_reports: any[];
  manifesto_promises: any[];
  ministers: any[];
  stories: any[];
  party_funding: any[];
  corporate_donors: any[];
  party_annual_income: any[];
  party_meta_map: Record<string, unknown>;
  bonds_meta: Record<string, unknown>;
  fact_check_claims: any[];
  viral_patterns: any[];
}

function emptySnapshot(): CivicSnapshot {
  return {
    sources: [],
    evidences: [],
    schemes: [],
    states: [],
    state_facts: [],
    state_audited_metrics: {},
    cag_reports: [],
    manifesto_promises: [],
    ministers: [],
    stories: [],
    party_funding: [],
    corporate_donors: [],
    party_annual_income: [],
    party_meta_map: {},
    bonds_meta: {},
    fact_check_claims: [],
    viral_patterns: [],
  };
}

function parsePayload(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function loadCivicSnapshotFromNeon(): Promise<CivicSnapshot | null> {
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

  const snapshot = emptySnapshot();
  for (const row of rows) {
    const key = row.dataset_key as DatasetKey;
    if (!(key in snapshot)) continue;
    (snapshot as Record<string, unknown>)[key] = parsePayload(row.payload);
  }

  return snapshot;
}

async function loadUserSubmissionsFromNeon(): Promise<any[]> {
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

function schemeWorkflowStatus(scheme: any): WorkflowStatus {
  const score = scheme.evidenceScore ?? 0;
  const verdict = scheme.cagVerdict ?? "UNAUDITED";
  if (score >= 88 && verdict !== "CRITICAL_DEFICIT") return "PUBLISHED";
  if (score >= 75) return "VERIFIED";
  if (score >= 55) return "IN REVIEW";
  return "DRAFT";
}

function sourceWorkflowStatus(source: any): WorkflowStatus {
  return source.isOfficial ? "PUBLISHED" : "VERIFIED";
}

function cagFindingWorkflowStatus(status?: string): WorkflowStatus {
  switch (status) {
    case "RESOLVED":
      return "PUBLISHED";
    case "ACTION_TAKEN":
      return "VERIFIED";
    case "UNDER_REVIEW":
      return "IN REVIEW";
    default:
      return "DRAFT";
  }
}

function flattenCagFindings(reports: any[]) {
  const rows: any[] = [];
  for (const report of reports) {
    for (const finding of report.findings || []) {
      rows.push({
        id: finding.id,
        reportId: report.id,
        reportTitle: finding.title || report.title,
        ministry: finding.department || report.ministry,
        summary: finding.findingSummary || finding.recommendation || report.title,
        discrepancyCr: finding.financialImpactCr || 0,
        severity: finding.severity || "MEDIUM",
        status: cagFindingWorkflowStatus(finding.status),
        cagReportNo: report.reportNumber,
      });
    }
  }
  return rows;
}

function buildStateMinisters(stateFacts: any[]): any[] {
  const ministers: any[] = [];
  const seen = new Set<string>();

  for (const state of stateFacts) {
    const cm = state?.newGovtDetails?.cm || state?.cm;
    if (!cm?.name) continue;
    const key = `${state.stateCode || state.name}-${cm.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    ministers.push({
      ...cm,
      id: `cm-${state.stateCode || state.name}`,
      stateName: state.name,
      stateCode: state.stateCode,
      isCM: true,
      title: "Chief Minister",
      ministry: `${state.name} — Chief Minister`,
    });
  }

  return ministers;
}

function snapshotToBootstrapData(snapshot: CivicSnapshot) {
  const stateMinisters = buildStateMinisters(asArray(snapshot.state_facts));
  return {
    schemes: asArray(snapshot.schemes),
    states: asArray(snapshot.states),
    stateFacts: asArray(snapshot.state_facts),
    cagReports: asArray(snapshot.cag_reports),
    manifestoPromises: asArray(snapshot.manifesto_promises),
    ministers: asArray(snapshot.ministers),
    stateMinisters,
    stories: asArray(snapshot.stories),
    partyFunding: asArray(snapshot.party_funding),
    corporateDonors: asArray(snapshot.corporate_donors),
    partyAnnualIncome: asArray(snapshot.party_annual_income),
    partyMetaMap: asRecord(snapshot.party_meta_map),
    bondsMeta: asRecord(snapshot.bonds_meta),
    factChecks: asArray(snapshot.fact_check_claims),
    sources: asArray(snapshot.sources),
  };
}

export async function buildBootstrapPayload() {
  const snapshot = await loadCivicSnapshotFromNeon();
  if (!snapshot) {
    throw new Error(
      isPostgresConfigured()
        ? "No civic datasets found in PostgreSQL. Run npm run db:setup against DATABASE_URL."
        : "DATABASE_URL is not configured."
    );
  }

  return {
    success: true,
    dataSource: "postgresql",
    data: snapshotToBootstrapData(snapshot),
  };
}

export async function buildAdminPayload() {
  const snapshot = await loadCivicSnapshotFromNeon();
  if (!snapshot) {
    throw new Error(
      isPostgresConfigured()
        ? "No civic datasets found in PostgreSQL. Run npm run db:setup against DATABASE_URL."
        : "DATABASE_URL is not configured."
    );
  }

  const schemes = asArray<any>(snapshot.schemes);
  const sources = asArray<any>(snapshot.sources);
  const evidences = asArray<any>(snapshot.evidences);
  const cagReports = asArray<any>(snapshot.cag_reports);
  const cagFindings = flattenCagFindings(cagReports);
  const ministers = asArray<any>(snapshot.ministers);
  const stateMinisters = buildStateMinisters(asArray(snapshot.state_facts));
  const userSubmissions = await loadUserSubmissionsFromNeon();

  const counts = {
    schemes: schemes.length,
    states: asArray(snapshot.states).length,
    ministers: ministers.length,
    stateMinisters: stateMinisters.length,
    sources: sources.length,
    evidences: evidences.length,
    cagReports: cagReports.length,
    cagFindings: cagFindings.length,
    manifestoPromises: asArray(snapshot.manifesto_promises).length,
    stories: asArray(snapshot.stories).length,
    factChecks: asArray(snapshot.fact_check_claims).length,
    partyFunding: asArray(snapshot.party_funding).length,
    corporateDonors: asArray(snapshot.corporate_donors).length,
    partyAnnualIncome: asArray(snapshot.party_annual_income).length,
    stateFacts: asArray(snapshot.state_facts).length,
    totalCagLossCr: cagReports.reduce((sum, report) => sum + (report.totalLossCr || 0), 0),
  };

  return {
    success: true,
    dataSource: "postgresql",
    syncedAt: new Date().toISOString(),
    counts,
    data: {
      schemes: schemes.map((scheme) => ({
        ...scheme,
        adminStatus: schemeWorkflowStatus(scheme),
      })),
      sources: sources.map((source) => ({
        ...source,
        adminStatus: sourceWorkflowStatus(source),
      })),
      states: asArray(snapshot.states),
      stateFacts: asArray(snapshot.state_facts),
      cagReports,
      cagFindings,
      manifestoPromises: asArray(snapshot.manifesto_promises),
      ministers,
      stateMinisters,
      stories: asArray(snapshot.stories),
      partyFunding: asArray(snapshot.party_funding),
      corporateDonors: asArray(snapshot.corporate_donors),
      partyAnnualIncome: asArray(snapshot.party_annual_income),
      partyMetaMap: asRecord(snapshot.party_meta_map),
      bondsMeta: asRecord(snapshot.bonds_meta),
      factChecks: asArray(snapshot.fact_check_claims),
      evidences,
      userSubmissions,
    },
  };
}
