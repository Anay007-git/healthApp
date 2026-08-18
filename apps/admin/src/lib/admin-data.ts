import {
  hydrateDatabaseFromSnapshot,
  db as seedDb,
  buildAdminDatasetsPayload,
  type CivicLensDatabase,
  type CivicDatasetSnapshot,
  type AdminDatasetsPayload,
} from "@civiclens/database";

export type { AdminDatasetsPayload, AdminCagFindingRow, AdminDatasetCounts, AdminWorkflowStatus } from "@civiclens/database";

async function fetchBootstrapFallback(): Promise<AdminDatasetsPayload> {
  const res = await fetch("/api/bootstrap");
  if (!res.ok) {
    throw new Error(`Bootstrap fallback failed (${res.status})`);
  }

  const json = await res.json();
  if (!json?.success || !json?.data) {
    throw new Error("Invalid bootstrap response");
  }

  const data = json.data;
  const snapshot: CivicDatasetSnapshot = {
    sources: data.sources || [],
    evidences: [],
    schemes: data.schemes || [],
    states: data.states || [],
    state_facts: data.stateFacts || [],
    state_audited_metrics: {},
    cag_reports: data.cagReports || [],
    manifesto_promises: data.manifestoPromises || [],
    ministers: data.ministers || [],
    stories: data.stories || [],
    party_funding: data.partyFunding || [],
    corporate_donors: data.corporateDonors || [],
    party_annual_income: data.partyAnnualIncome || [],
    party_meta_map: data.partyMetaMap || {},
    bonds_meta: data.bondsMeta || {},
    fact_check_claims: data.factChecks || [],
    viral_patterns: [],
  };

  const db = hydrateDatabaseFromSnapshot(snapshot);
  return buildAdminDatasetsPayload(db);
}

export async function fetchAdminDatasets(adminToken: string): Promise<AdminDatasetsPayload> {
  const res = await fetch("/api/admin/datasets", {
    headers: {
      "X-Admin-Token": adminToken,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body.error ? String(body.error) : `Failed to sync admin datasets (${res.status})`;

    if (res.status >= 500) {
      try {
        return await fetchBootstrapFallback();
      } catch {
        throw new Error(detail);
      }
    }

    throw new Error(detail);
  }

  const json = await res.json();
  if (!json?.success || !json?.data) {
    throw new Error("Invalid admin datasets response");
  }

  return {
    dataSource: json.dataSource,
    syncedAt: json.syncedAt,
    counts: json.counts,
    data: json.data,
  };
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
