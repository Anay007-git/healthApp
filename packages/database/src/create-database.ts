import type { CivicLensDatabase } from "./index";
import type { CivicDatasetSnapshot, CivicDatasetSubmission } from "./pg/datasets";
import { loadCivicDatasetsFromPostgres, loadFactCheckSubmissionsFromPostgres } from "./pg/load";
import { isPostgresUrl } from "./pg/client";
import { hydrateDatabaseFromSnapshot } from "./index";

let databasePromise: Promise<CivicLensDatabase> | null = null;
let resolvedDatabase: CivicLensDatabase | null = null;

export async function createDatabaseFromSnapshot(
  snapshot: CivicDatasetSnapshot,
  submissions: CivicDatasetSubmission[] = []
): Promise<CivicLensDatabase> {
  return hydrateDatabaseFromSnapshot(snapshot, submissions);
}

export async function initDatabase(): Promise<CivicLensDatabase> {
  if (resolvedDatabase) {
    return resolvedDatabase;
  }

  if (!databasePromise) {
    databasePromise = (async () => {
      const { CivicLensDatabase: DbClass } = await import("./index");

      if (isPostgresUrl(process.env.DATABASE_URL)) {
        try {
          let snapshot = await loadCivicDatasetsFromPostgres();
          const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

          if (!snapshot && !isServerless) {
            try {
              const { ensurePostgresReady } = await import("./pg/seed-data");
              await ensurePostgresReady();
              snapshot = await loadCivicDatasetsFromPostgres();
            } catch (error) {
              console.warn("[database] Auto-seed failed:", error);
            }
          }

          if (snapshot) {
            let submissions: CivicDatasetSubmission[] = [];
            try {
              submissions = await loadFactCheckSubmissionsFromPostgres();
            } catch (error) {
              console.warn("[database] fact_check_submissions load skipped:", error);
            }

            resolvedDatabase = hydrateDatabaseFromSnapshot(snapshot, submissions);
            console.log("[database] Loaded civic datasets from PostgreSQL");
            return resolvedDatabase;
          }

          console.warn("[database] PostgreSQL configured but civic_datasets empty — using in-memory seeds");
        } catch (error) {
          console.warn("[database] Postgres load failed — using in-memory seeds:", error);
        }
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
