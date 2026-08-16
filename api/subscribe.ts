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

  const { email, topics = ["SCHEMES", "CAG_AUDITS", "STATE_BENCHMARKS"], frequency = "WEEKLY" } = req.body || {};
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "A valid email address is required" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const resendApiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASSWORD || "";
  const fromEmail = process.env.EMAIL_FROM || '"Orange-Chasma Civic Brief" <newsletter@anaytech.in>';

  // 1. Record subscription in Neon Database
  try {
    const dbUrl =
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_OBj2LtShf1Rv@ep-gentle-king-axtrdlfg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

    const directHttpUrl = "https://ep-gentle-king-axtrdlfg.c-4.us-east-2.aws.neon.tech/sql";
    const directConnStr = dbUrl
      .replace("-pooler", "")
      .replace("&channel_binding=require", "")
      .replace("?channel_binding=require", "?sslmode=require");

    await fetch(directHttpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Neon-Connection-String": directConnStr,
      },
      body: JSON.stringify({
        query: `INSERT INTO newsletter_subscribers (email, preferences, status) 
                VALUES ($1, $2, 'ACTIVE') 
                ON CONFLICT (email) DO UPDATE SET preferences = EXCLUDED.preferences, status = 'ACTIVE';`,
        params: [cleanEmail, topics],
      }),
    });
  } catch (dbErr) {
    console.error("Database subscription error:", dbErr);
  }

  // 2. Send Welcome Confirmation Email via Resend if API key is configured
  let emailSent = false;
  let emailError: string | null = null;

  if (resendApiKey) {
    try {
      const welcomeHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to The Civic Brief</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F0; margin: 0; padding: 24px; color: #0F172A;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8DEC8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="background-color: #0F172A; padding: 24px; text-align: center; border-bottom: 3px solid #D95300;">
                <h1 style="color: #FAF7F0; margin: 0; font-size: 22px; font-family: Georgia, serif; letter-spacing: 1px;">
                  🕶️ ORANGE-CHASMA
                </h1>
                <p style="color: #FF671F; margin: 4px 0 0 0; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 2px;">
                  THE CIVIC BRIEF • BHARAT CIVIC INTELLIGENCE
                </p>
              </div>

              <div style="padding: 32px 24px;">
                <h2 style="font-size: 20px; color: #0F172A; margin-top: 0; font-family: Georgia, serif;">
                  Welcome to Independent, Verifiable Civic Intelligence.
                </h2>
                <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                  Thank you for subscribing to <strong>The Civic Brief</strong>. You will receive concise, evidence-backed audits on government schemes, public finances, CAG parliamentary findings, and state governance benchmarks.
                </p>

                <div style="background-color: #FAF7F0; border-left: 4px solid #D95300; padding: 16px; margin: 24px 0; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; font-weight: bold; color: #0F172A;">
                    Your Subscription Profile:
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569; font-family: monospace;">
                    • Email: <strong>${cleanEmail}</strong><br>
                    • Cadence: <strong>${frequency} Edition</strong><br>
                    • Focus Areas: <strong>${Array.isArray(topics) ? topics.join(", ") : "All Governance Areas"}</strong>
                  </p>
                </div>

                <h3 style="font-size: 15px; color: #0F172A; font-family: Georgia, serif; margin-bottom: 8px;">
                  What You Get With Each Brief:
                </h3>
                <ul style="font-size: 13px; color: #475569; line-height: 1.6; padding-left: 20px; margin: 0 0 24px 0;">
                  <li><strong>CAG Audit Disclosures:</strong> Real loss calculations, unadjusted state treasury bills, and ghost beneficiary flags.</li>
                  <li><strong>Scheme Delivery Tracking:</strong> Promise-to-outcome pipeline verified against DBT transaction telemetry.</li>
                  <li><strong>State Governance Matrix:</strong> Side-by-side socio-economic indicator comparisons across all 36 States & UTs.</li>
                </ul>

                <div style="text-align: center; margin-top: 32px;">
                  <a href="https://www.anaytech.in" style="background-color: #D95300; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: bold; border-radius: 6px; display: inline-block; font-family: monospace;">
                    EXPLORE LIVE DASHBOARD →
                  </a>
                </div>
              </div>

              <div style="background-color: #FAF7F0; border-top: 1px solid #E8DEC8; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748B; font-family: monospace;">
                <p style="margin: 0;">
                  Orange-Chasma • 100% Primary Verifiable Sources<br>
                  Official Dispatch: <a href="mailto:newsletter@anaytech.in" style="color: #D95300;">newsletter@anaytech.in</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [cleanEmail],
          subject: "Welcome to The Civic Brief • Orange-Chasma",
          html: welcomeHtml,
        }),
      });

      if (resendRes.ok) {
        emailSent = true;
      } else {
        const errData = await resendRes.json();
        emailError = errData?.message || "Failed to send confirmation email via Resend";
      }
    } catch (err: any) {
      emailError = err.message;
    }
  }

  return res.status(200).json({
    success: true,
    emailSent,
    message: emailSent
      ? `Successfully subscribed! Confirmation email sent from newsletter@anaytech.in to ${cleanEmail}.`
      : `Subscription recorded for ${cleanEmail}.`,
    error: emailError,
  });
}
