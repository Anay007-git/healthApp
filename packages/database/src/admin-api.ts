import type { CivicLensDatabase } from "@civiclens/database";
import { buildAdminDatasetsPayload } from "@civiclens/database";

export function createAdminDatasetsResponse(db: CivicLensDatabase) {
  const payload = buildAdminDatasetsPayload(db);
  return {
    success: true,
    ...payload,
    data: payload.data,
  };
}
