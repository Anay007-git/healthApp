import {
  hydrateDatabaseFromSnapshot,
  db as seedDb,
  type CivicLensDatabase,
  type CivicDatasetSnapshot,
  type AdminDatasetsPayload,
} from "@civiclens/database";

export type { AdminDatasetsPayload, AdminCagFindingRow, AdminDatasetCounts, AdminWorkflowStatus } from "@civiclens/database";

async function fetchJsonWithFallback(urls: string[], init?: RequestInit) {
  let lastError = "Request failed";
  for (const url of urls) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        lastError = body.error ? String(body.error) : `HTTP ${res.status} from ${url}`;
        continue;
      }
      const json = await res.json();
      if (json?.success && json?.data) {
        return json;
      }
      lastError = `Invalid response from ${url}`;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : `Failed to fetch ${url}`;
    }
  }
  throw new Error(lastError);
}

async function fetchBootstrapPayload() {
  return fetchJsonWithFallback(["/api/bootstrap", "/civic-bootstrap.json"]);
}

async function fetchAdminPayload(adminToken: string) {
  return fetchJsonWithFallback(["/api/admin/datasets", "/civic-admin.json"], {
    headers: { "X-Admin-Token": adminToken },
  });
}

export async function fetchAdminDatasets(adminToken: string): Promise<AdminDatasetsPayload> {
  try {
    const json = await fetchAdminPayload(adminToken);
    return {
      dataSource: json.dataSource,
      syncedAt: json.syncedAt,
      counts: json.counts,
      data: json.data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sync datasets";
    throw new Error(message);
  }
}

function snapshotFromPayload(payload: AdminDatasetsPayload): CivicDatasetSnapshot {
  const data = payload.data;
  return {
    sources: data.sources,
    evidences: data.evidences,
    schemes: data.schemes,
    states: data.states,
    state_facts: data.stateFacts,
    state_audited_metrics: {},
    cag_reports: data.cagReports,
    manifesto_promises: data.manifestoPromises,
    ministers: data.ministers,
    stories: data.stories,
    party_funding: data.partyFunding,
    corporate_donors: data.corporateDonors,
    party_annual_income: data.partyAnnualIncome,
    party_meta_map: data.partyMetaMap,
    bonds_meta: data.bondsMeta,
    fact_check_claims: data.factChecks,
    viral_patterns: [],
  };
}

export function hydrateAdminDatabase(payload: AdminDatasetsPayload): CivicLensDatabase {
  try {
    return hydrateDatabaseFromSnapshot(snapshotFromPayload(payload));
  } catch {
    return seedDb;
  }
}
