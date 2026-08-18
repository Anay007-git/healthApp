export const DEFAULT_ADMIN_TOKEN = "a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6";

export function resolveAdminToken(): string {
  return (process.env.ADMIN_TOKEN || DEFAULT_ADMIN_TOKEN).trim();
}

export function isAuthorizedAdmin(req: { headers?: Record<string, string | string[] | undefined> }): boolean {
  const token = req.headers?.["x-admin-token"];
  if (!token || Array.isArray(token)) {
    return false;
  }
  return token === resolveAdminToken();
}
