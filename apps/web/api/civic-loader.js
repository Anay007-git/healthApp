const DEFAULT_DATABASE_URL =
  "postgresql://neondb_owner:npg_OBj2LtShf1Rv@ep-gentle-king-axtrdlfg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

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
];

const DEFAULT_ADMIN_TOKEN = "a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6";

function getDatabaseUrl() {
  return (process.env.DATABASE_URL || DEFAULT_DATABASE_URL).trim();
}

function isPostgresConfigured() {
  const url = getDatabaseUrl();
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

function normalizeConnectionString(dbUrl) {
  return dbUrl
    .replace("-pooler", "")
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require", "?sslmode=require");
}

function getNeonHttpUrl(dbUrl) {
  const hostMatch = dbUrl.match(/@([^/?:]+)/);
  if (hostMatch?.[1]) {
    const host = hostMatch[1].replace("-pooler", "");
    return `https://${host}/sql`;
  }
  return "https://ep-gentle-king-axtrdlfg.c-4.us-east-2.aws.neon.tech/sql";
}

async function neonQuery(query, params = []) {
  const dbUrl = getDatabaseUrl();
  const connectionString = normalizeConnectionString(dbUrl);
  const httpUrl = getNeonHttpUrl(dbUrl);

  const response = await fetch(httpUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": connectionString,
    },
    body: JSON.stringify({ query, params }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || `Neon query failed (${response.status})`;
    throw new Error(message);
  }

  return {
    rows: data.rows || [],
    rowCount: data.rowCount ?? 0,
  };
}

function parsePayload(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function emptySnapshot() {
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

async function loadCivicSnapshotFromNeon() {
  if (!isPostgresConfigured()) return null;

  const { rows } = await neonQuery(
    `SELECT dataset_key, payload
     FROM civic_datasets
     WHERE dataset_key = ANY($1::text[])`,
    [DATASET_KEYS]
  );

  if (!rows.length) return null;

  const snapshot = emptySnapshot();
  for (const row of rows) {
    if (row.dataset_key in snapshot) {
      snapshot[row.dataset_key] = parsePayload(row.payload);
    }
  }
  return snapshot;
}

async function loadUserSubmissionsFromNeon() {
  if (!isPostgresConfigured()) return [];
  try {
    const { rows } = await neonQuery(
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

function schemeWorkflowStatus(scheme) {
  const score = scheme.evidenceScore ?? 0;
  const verdict = scheme.cagVerdict ?? "UNAUDITED";
  if (score >= 88 && verdict !== "CRITICAL_DEFICIT") return "PUBLISHED";
  if (score >= 75) return "VERIFIED";
  if (score >= 55) return "IN REVIEW";
  return "DRAFT";
}

function sourceWorkflowStatus(source) {
  return source.isOfficial ? "PUBLISHED" : "VERIFIED";
}

function cagFindingWorkflowStatus(status) {
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

function flattenCagFindings(reports) {
  const rows = [];
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

function buildStateMinisters(stateFacts) {
  const ministers = [];
  const seen = new Set();
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

function snapshotToBootstrapData(snapshot) {
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

async function buildBootstrapPayload() {
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

async function buildAdminPayload() {
  const snapshot = await loadCivicSnapshotFromNeon();
  if (!snapshot) {
    throw new Error(
      isPostgresConfigured()
        ? "No civic datasets found in PostgreSQL. Run npm run db:setup against DATABASE_URL."
        : "DATABASE_URL is not configured."
    );
  }

  const schemes = asArray(snapshot.schemes);
  const sources = asArray(snapshot.sources);
  const evidences = asArray(snapshot.evidences);
  const cagReports = asArray(snapshot.cag_reports);
  const cagFindings = flattenCagFindings(cagReports);
  const ministers = asArray(snapshot.ministers);
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
      schemes: schemes.map((scheme) => ({ ...scheme, adminStatus: schemeWorkflowStatus(scheme) })),
      sources: sources.map((source) => ({ ...source, adminStatus: sourceWorkflowStatus(source) })),
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

function resolveAdminToken() {
  return (process.env.ADMIN_TOKEN || DEFAULT_ADMIN_TOKEN).trim();
}

function isAuthorizedAdmin(req) {
  const token = req.headers?.["x-admin-token"];
  if (!token || Array.isArray(token)) return false;
  return token === resolveAdminToken();
}

module.exports = {
  buildBootstrapPayload,
  buildAdminPayload,
  isAuthorizedAdmin,
  resolveAdminToken,
};
