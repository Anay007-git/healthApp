import { ensurePostgresReady, getPostgresTableCounts, isPostgresUrl, resolveAdminToken } from "@civiclens/database/server";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const token = req.headers["x-admin-token"];
  const expected = resolveAdminToken();
  if (!token || token !== expected) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    return res.status(400).json({
      success: false,
      error: "DATABASE_URL is not set in Vercel environment variables.",
    });
  }

  try {
    const seeded = await ensurePostgresReady();
    const counts = await getPostgresTableCounts();

    return res.status(200).json({
      success: true,
      seeded,
      message: seeded
        ? "Database schema ensured and civic data seeded."
        : "Database already had civic data — no re-seed needed.",
      counts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return res.status(500).json({ success: false, error: message });
  }
}
