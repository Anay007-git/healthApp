import { initDatabase, createAdminDatasetsResponse, resolveAdminToken } from "@civiclens/database/server";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const token = req.headers["x-admin-token"];
  const expected = resolveAdminToken();
  if (!token || token !== expected) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const db = await initDatabase();
    return res.status(200).json(createAdminDatasetsResponse(db));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load admin datasets";
    return res.status(500).json({ success: false, error: message });
  }
}
