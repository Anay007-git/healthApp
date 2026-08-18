import { initDatabase } from "@civiclens/database";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const db = await initDatabase();
    return res.status(200).json({
      success: true,
      dataSource: process.env.DATABASE_URL?.startsWith("postgres") ? "postgresql" : "memory",
      data: {
        schemes: db.getSchemes(),
        states: db.getStates(),
        stateFacts: db.getStateFacts(),
        cagReports: db.getCAGReports(),
        manifestoPromises: db.getManifestoPromises(),
        ministers: db.getMinisters(),
        stateMinisters: db.getAllStateMinisters(),
        stories: db.getStories(),
        partyFunding: db.getPartyFunding(),
        corporateDonors: db.getCorporateDonors(),
        partyAnnualIncome: db.getPartyAnnualIncomeHistory(),
        partyMetaMap: db.getPartyMetaMap(),
        bondsMeta: db.getBondsMeta(),
        factChecks: db.getFactChecks(),
        sources: db.getSources(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bootstrap failed";
    return res.status(500).json({ success: false, error: message });
  }
}
