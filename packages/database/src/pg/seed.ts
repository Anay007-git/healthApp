import { closePool, isPostgresUrl } from "./client";
import { loadEnvFiles } from "./env";
import { getPool } from "./client";
import { applyPostgresSchema } from "./seed-data";
import { printTableCounts } from "./seed-normalized";
import { ensurePostgresReady } from "./seed-data";

async function seed(): Promise<void> {
  loadEnvFiles();

  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    console.error("DATABASE_URL must be set to a PostgreSQL connection string.");
    console.error("Set it in your shell, or in Vercel → Project Settings → Environment Variables.");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL!;
  const hostHint = dbUrl.includes("@") ? dbUrl.split("@")[1]?.split("/")[0] : "configured host";
  console.log(`Seeding Postgres at ${hostHint} ...`);

  const pool = getPool();
  await applyPostgresSchema(pool);
  await ensurePostgresReady(pool);
  await printTableCounts(pool);
  await closePool();
  console.log("\nAll civic datasets seeded to PostgreSQL.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
