import { useCallback, useEffect, useState } from "react";
import type { CivicLensDatabase } from "@civiclens/database";
import type { AdminDatasetsPayload } from "@civiclens/database";
import { db as seedDb } from "@civiclens/database";
import { fetchAdminDatasets, hydrateAdminDatabase } from "./admin-data";

export function useAdminData(isAuthenticated: boolean, adminToken: string) {
  const [payload, setPayload] = useState<AdminDatasetsPayload | null>(null);
  const [db, setDb] = useState<CivicLensDatabase>(seedDb);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !adminToken) return;
    setLoading(true);
    setError(null);
    try {
      const next = await fetchAdminDatasets(adminToken);
      setPayload(next);
      setDb(hydrateAdminDatabase(next));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sync datasets";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [adminToken, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && adminToken) {
      void refresh();
    }
  }, [isAuthenticated, adminToken, refresh]);

  return {
    payload,
    db,
    loading,
    error,
    refresh,
    dataSource: payload?.dataSource ?? "memory",
    syncedAt: payload?.syncedAt ?? null,
    counts: payload?.counts ?? null,
    data: payload?.data ?? null,
  };
}
