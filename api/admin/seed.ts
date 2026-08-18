import { isAuthorizedAdmin } from "../_lib/admin-auth";
import { isPostgresConfigured, neonQuery } from "../_lib/neon";

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

  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (!isPostgresConfigured()) {
    return res.status(400).json({
      success: false,
      error: "DATABASE_URL is not set in Vercel environment variables.",
    });
  }

  try {
    const countResult = await neonQuery<{ count: number }>(
      "SELECT COUNT(*)::int AS count FROM civic_datasets"
    );
    const existing = countResult.rows[0]?.count ?? 0;

    if (existing > 0) {
      const tableCounts: Record<string, number> = {
        civic_datasets: existing,
      };
      for (const table of ["states", "schemes", "ministers", "fact_check_claims"]) {
        const result = await neonQuery<{ count: number }>(
          `SELECT COUNT(*)::int AS count FROM ${table}`
        );
        tableCounts[table] = result.rows[0]?.count ?? 0;
      }

      return res.status(200).json({
        success: true,
        seeded: false,
        message: "Database already had civic data — no re-seed needed.",
        counts: tableCounts,
      });
    }

    return res.status(409).json({
      success: false,
      seeded: false,
      error:
        "civic_datasets is empty. Run `npm run db:setup` locally against this DATABASE_URL, then redeploy.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed check failed";
    return res.status(500).json({ success: false, error: message });
  }
}
