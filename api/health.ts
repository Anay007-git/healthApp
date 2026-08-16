export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const t0 = performance.now();
  try {
    const dbUrl =
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_OBj2LtShf1Rv@ep-gentle-king-axtrdlfg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    
    // Extract endpoint host and direct connection string for Neon HTTP SQL API
    const directHttpUrl = "https://ep-gentle-king-axtrdlfg.c-4.us-east-2.aws.neon.tech/sql";
    const directConnStr = dbUrl
      .replace("-pooler", "")
      .replace("&channel_binding=require", "")
      .replace("?channel_binding=require", "?sslmode=require");

    const response = await fetch(directHttpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Neon-Connection-String": directConnStr,
      },
      body: JSON.stringify({ query: "SELECT 1 as ping;" }),
    });

    const latency = Math.round(performance.now() - t0);

    if (response.ok) {
      return res.status(200).json({
        status: "healthy",
        database: "connected",
        latencyMs: latency,
        timestamp: new Date().toISOString(),
      });
    } else {
      const data = await response.json().catch(() => ({}));
      return res.status(500).json({
        status: "unhealthy",
        database: "error",
        error: data.message || "Failed to query database",
        latencyMs: latency,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: err.message,
      latencyMs: Math.round(performance.now() - t0),
    });
  }
}
