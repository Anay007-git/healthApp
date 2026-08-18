import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, getPool, isPostgresUrl } from "./client";

async function migrate(): Promise<void> {
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    console.error("DATABASE_URL must be set to a PostgreSQL connection string.");
    process.exit(1);
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const schemaPath = join(here, "../../../../schema.sql");
  const sql = readFileSync(schemaPath, "utf8");

  const pool = getPool();
  await pool.query(sql);
  await closePool();
  console.log("Schema applied successfully.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
