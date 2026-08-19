#!/usr/bin/env node
/**
 * Generates static civic data snapshots for Vercel static fallback.
 * Run during build when DATABASE_URL is available.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const civicLoader = require(join(__dirname, "../api/civic-loader.js"));

async function main() {
  const outDir = join(__dirname, "../apps/web/public");
  await mkdir(outDir, { recursive: true });

  console.log("[generate-civic-snapshot] Loading civic data from Neon...");
  const bootstrap = await civicLoader.buildBootstrapPayload();
  const admin = await civicLoader.buildAdminPayload();

  await writeFile(join(outDir, "civic-bootstrap.json"), JSON.stringify(bootstrap));
  await writeFile(join(outDir, "civic-admin.json"), JSON.stringify(admin));

  console.log(
    `[generate-civic-snapshot] Wrote civic-bootstrap.json (${bootstrap.data.schemes.length} schemes) and civic-admin.json`
  );
}

main().catch((err) => {
  console.warn("[generate-civic-snapshot] Skipped:", err.message);
  process.exit(0);
});
