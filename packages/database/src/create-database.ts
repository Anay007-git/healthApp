import type { CivicLensDatabase } from "./index";
import type { CivicDatasetSnapshot } from "./pg/datasets";
import { loadCivicDatasetsFromPostgres, loadFactCheckSubmissionsFromPostgres } from "./pg/load";
import { isPostgresUrl } from "./pg/client";
import { ensurePostgresReady } from "./pg/seed-data";

let databasePromise: Promise<CivicLensDatabase> | null = null;
let resolvedDatabase: CivicLensDatabase | null = null;

export async function createDatabaseFromSnapshot(
  snapshot: CivicDatasetSnapshot,
  submissions: unknown[] = []
): Promise<CivicLensDatabase> {
  const { CivicLensDatabase: DbClass } = await import("./index");
  return new DbClass({
    sources: snapshot.sources,
    evidences: snapshot.evidences,
    schemes: snapshot.schemes,
    stateFactsData: snapshot.state_facts,
    cagReports: snapshot.cag_reports,
    manifestoPromises: snapshot.manifesto_promises,
    ministersData: snapshot.ministers,
    stories: snapshot.stories,
    partyFundingData: snapshot.party_funding,
    corporateDonorsData: snapshot.corporate_donors,
    partyAnnualIncomeData: snapshot.party_annual_income,
    partyMetaMap: snapshot.party_meta_map,
    bondsMeta: snapshot.bonds_meta,
    factCheckClaims: snapshot.fact_check_claims,
    userSubmissions: submissions,
  });
}

export async function initDatabase(): Promise<CivicLensDatabase> {
  if (resolvedDatabase) {
    return resolvedDatabase;
  }

  if (!databasePromise) {
    databasePromise = (async () => {
      const { CivicLensDatabase: DbClass } = await import("./index");

      if (isPostgresUrl(process.env.DATABASE_URL)) {
        let snapshot = await loadCivicDatasetsFromPostgres();
        if (!snapshot) {
          try {
            await ensurePostgresReady();
            snapshot = await loadCivicDatasetsFromPostgres();
          } catch (error) {
            console.warn("[database] Auto-seed failed — using in-memory seeds:", error);
          }
        }

        if (snapshot) {
          const submissions = await loadFactCheckSubmissionsFromPostgres();
          resolvedDatabase = await createDatabaseFromSnapshot(snapshot, submissions);
          console.log("[database] Loaded civic datasets from PostgreSQL");
          return resolvedDatabase;
        }

        console.warn("[database] PostgreSQL configured but civic_datasets empty — using in-memory seeds");
      }

      resolvedDatabase = new DbClass();
      return resolvedDatabase;
    })();
  }

  return databasePromise;
}

export async function getDatabase(): Promise<CivicLensDatabase> {
  if (resolvedDatabase) {
    return resolvedDatabase;
  }
  return initDatabase();
}

export { isPostgresUrl };
