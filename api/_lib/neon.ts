const DEFAULT_DATABASE_URL =
  "postgresql://neondb_owner:npg_OBj2LtShf1Rv@ep-gentle-king-axtrdlfg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export function getDatabaseUrl(): string {
  return (process.env.DATABASE_URL || DEFAULT_DATABASE_URL).trim();
}

export function isPostgresConfigured(): boolean {
  const url = getDatabaseUrl();
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

function normalizeConnectionString(dbUrl: string): string {
  return dbUrl
    .replace("-pooler", "")
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require", "?sslmode=require");
}

function getNeonHttpUrl(dbUrl: string): string {
  const hostMatch = dbUrl.match(/@([^/?:]+)/);
  if (hostMatch?.[1]) {
    const host = hostMatch[1].replace("-pooler", "");
    return `https://${host}/sql`;
  }

  return "https://ep-gentle-king-axtrdlfg.c-4.us-east-2.aws.neon.tech/sql";
}

function getNeonHttpConfig() {
  const dbUrl = getDatabaseUrl();
  const connectionString = normalizeConnectionString(dbUrl);
  const httpUrl = getNeonHttpUrl(dbUrl);
  return { httpUrl, connectionString };
}

export interface NeonQueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
}

export async function neonQuery<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = []
): Promise<NeonQueryResult<T>> {
  const { httpUrl, connectionString } = getNeonHttpConfig();

  const response = await fetch(httpUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": connectionString,
    },
    body: JSON.stringify({ query, params }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data as { message?: string })?.message ||
      (data as { error?: string })?.error ||
      `Neon query failed (${response.status})`;
    throw new Error(message);
  }

  return {
    rows: ((data as { rows?: T[] }).rows || []) as T[],
    rowCount: (data as { rowCount?: number }).rowCount ?? 0,
  };
}
