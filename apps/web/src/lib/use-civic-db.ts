import { useEffect, useState } from "react";
import type { CivicLensDatabase } from "@civiclens/database";
import { getCivicDataSource, getCivicDb, hydrateCivicDbFromApi } from "./civic-db";

export function useCivicDb() {
  const [db, setDb] = useState<CivicLensDatabase>(getCivicDb());
  const [ready, setReady] = useState(false);
  const [dataSource, setDataSource] = useState<"memory" | "api">(getCivicDataSource());

  useEffect(() => {
    let active = true;
    hydrateCivicDbFromApi()
      .then((instance) => {
        if (!active) return;
        setDb(instance);
        setDataSource(getCivicDataSource());
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return { db, ready, dataSource };
}
