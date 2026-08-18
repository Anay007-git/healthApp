const { isAuthorizedAdmin } = require("../civic-loader.js");

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

  return res.status(200).json({
    success: true,
    seeded: false,
    message: "Database already populated. Use npm run db:setup locally to re-seed.",
  });
}
