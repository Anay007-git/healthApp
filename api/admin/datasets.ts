import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildAdminPayload, isAuthorizedAdmin } = require("../civic-loader.js");

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

  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    return res.status(200).json(await buildAdminPayload());
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load admin datasets";
    console.error("[admin/datasets]", message);
    return res.status(500).json({ success: false, error: message });
  }
}
