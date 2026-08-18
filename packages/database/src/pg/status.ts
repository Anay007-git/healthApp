import { closePool, getPool, isPostgresUrl } from "./client";
import { loadEnvFiles } from "./env";
import { printTableCounts } from "./seed-normalized";

async function status(): Promise<void> {
  loadEnvFiles();

  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    console.error("DATABASE_URL must be set to a PostgreSQL connection string.");
    process.exit(1);
  }

  const pool = getPool();
  await printTableCounts(pool);
  await closePool();
}

status().catch((err) => {
  console.error("Status check failed:", err);
  process.exit(1);
});
