import { aiEngine } from "@civiclens/ai";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const text = req.body?.text;
  if (!text || typeof text !== "string" || text.trim().length < 3) {
    return res.status(400).json({ success: false, error: "Claim text must be at least 3 characters long" });
  }
  if (text.length > 4000) {
    return res.status(400).json({ success: false, error: "Claim text must be at most 4000 characters" });
  }

  try {
    const result = await aiEngine.analyzeMisinformation(text);
    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Fact check failed" });
  }
}
