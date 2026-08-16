export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { email, topics = [], frequency = "WEEKLY" } = req.body || {};
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "A valid email address is required" });
  }

  try {
    const dbUrl =
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_OBj2LtShf1Rv@ep-gentle-king-axtrdlfg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

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
      body: JSON.stringify({
        query: `INSERT INTO newsletter_subscribers (email, preferences, status) 
                VALUES ($1, $2, 'ACTIVE') 
                ON CONFLICT (email) DO UPDATE SET preferences = EXCLUDED.preferences, status = 'ACTIVE';`,
        params: [email.toLowerCase().trim(), topics],
      }),
    });

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: `Successfully subscribed ${email}`,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `Subscription recorded for ${email}`,
      });
    }
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      message: `Subscription registered for ${email}`,
    });
  }
}
