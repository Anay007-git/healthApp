import { hydrateDatabaseFromSnapshot, db as seedDb } from "@civiclens/database";
import type { CivicDatasetSnapshot, CivicLensDatabase } from "@civiclens/database";

let hydratedDb: CivicLensDatabase | null = null;
let hydratePromise: Promise<CivicLensDatabase> | null = null;
let dataSource: "memory" | "api" = "memory";

export function getCivicDb(): CivicLensDatabase {
  return hydratedDb ?? seedDb;
}

export function getCivicDataSource(): "memory" | "api" {
  return dataSource;
}

export async function hydrateCivicDbFromApi(baseUrl = "/api"): Promise<CivicLensDatabase> {
  if (hydratedDb) {
    return hydratedDb;
  }

  if (!hydratePromise) {
    hydratePromise = (async () => {
      try {
        const res = await fetch(`${baseUrl}/bootstrap`);
        if (!res.ok) {
          return seedDb;
        }

        const json = await res.json();
        if (!json?.success || !json?.data) {
          return seedDb;
        }

        const snapshot = {
          sources: json.data.sources ?? [],
          evidences: [],
          schemes: json.data.schemes ?? [],
          states: json.data.states ?? [],
          state_facts: json.data.stateFacts ?? [],
          state_audited_metrics: {},
          cag_reports: json.data.cagReports ?? [],
          manifesto_promises: json.data.manifestoPromises ?? [],
          ministers: json.data.ministers ?? [],
          stories: json.data.stories ?? [],
          party_funding: json.data.partyFunding ?? [],
          corporate_donors: json.data.corporateDonors ?? [],
          party_annual_income: json.data.partyAnnualIncome ?? [],
          party_meta_map: json.data.partyMetaMap ?? {},
          bonds_meta: json.data.bondsMeta ?? {},
          fact_check_claims: json.data.factChecks ?? [],
          viral_patterns: [],
        } as CivicDatasetSnapshot;

        hydratedDb = hydrateDatabaseFromSnapshot(snapshot);
        dataSource = json.dataSource === "postgresql" ? "api" : "memory";
        return hydratedDb;
      } catch {
        return seedDb;
      }
    })();
  }

  return hydratePromise;
}
