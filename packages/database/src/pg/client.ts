import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function isPostgresUrl(url?: string): boolean {
  const value = (url || process.env.DATABASE_URL || "").trim();
  return value.startsWith("postgres://") || value.startsWith("postgresql://");
}

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString || !isPostgresUrl(connectionString)) {
      throw new Error("DATABASE_URL must be a PostgreSQL connection string");
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
      max: 10,
    });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params);
}
