import { closePool, getPool, isPostgresUrl } from "./client";
import { loadEnvFiles } from "./env";
import { applyPostgresSchema } from "./seed-data";

async function migrate(): Promise<void> {
  loadEnvFiles();

  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    console.error("DATABASE_URL must be set to a PostgreSQL connection string.");
    console.error("Set it in your shell, or in Vercel → Project Settings → Environment Variables.");
    process.exit(1);
  }

  const pool = getPool();
  await applyPostgresSchema(pool);
  await closePool();
  console.log("Schema applied successfully.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
