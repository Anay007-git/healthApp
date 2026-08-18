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
        let snapshot = await loadCivicDatasetsFromPostgres();
        if (!snapshot) {
          try {
            const { ensurePostgresReady } = await import("./pg/seed-data");
            await ensurePostgresReady();
            snapshot = await loadCivicDatasetsFromPostgres();
          } catch (error) {
            console.warn("[database] Auto-seed failed — using in-memory seeds:", error);
          }
        }

        if (snapshot) {
          const submissions = await loadFactCheckSubmissionsFromPostgres();
          resolvedDatabase = hydrateDatabaseFromSnapshot(snapshot, submissions);
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
