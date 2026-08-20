import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildBootstrapPayload } = require("./civic-loader.js");

function resolveStaticOrigin(req: { headers?: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers?.["x-forwarded-host"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return `https://${forwarded.split(",")[0].trim()}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://www.anaytech.in";
}

async function loadStaticBootstrapFallback(
  req: { headers?: Record<string, string | string[] | undefined> }
): Promise<Record<string, unknown> | null> {
  const origin = resolveStaticOrigin(req);
  const res = await fetch(`${origin}/civic-bootstrap.json`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json?.success || !json?.data) return null;
  return {
    ...json,
    dataSource: json.dataSource === "postgresql" ? "postgresql-static-fallback" : "static-fallback",
  };
}

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
    return res.status(200).json(await buildBootstrapPayload());
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bootstrap failed";
    console.error("[bootstrap]", message);

    try {
      const fallback = await loadStaticBootstrapFallback(req);
      if (fallback) {
        console.warn("[bootstrap] served static civic-bootstrap.json fallback");
        return res.status(200).json(fallback);
      }
    } catch (fallbackErr: unknown) {
      const fallbackMessage =
        fallbackErr instanceof Error ? fallbackErr.message : "Static fallback failed";
      console.error("[bootstrap] static fallback error:", fallbackMessage);
    }

    return res.status(500).json({ success: false, error: message });
  }
}
