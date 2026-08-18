const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "169.254.169.254",
]);

function isPrivateIpv4(host: string): boolean {
  const m = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

export function assertSafeHttpUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (BLOCKED_HOSTS.has(host) || host.endsWith(".internal") || host.endsWith(".local")) return null;
    if (isPrivateIpv4(host)) return null;
    if (host.includes("localhost")) return null;
    return url;
  } catch {
    return null;
  }
}

export async function fetchSafeText(rawUrl: string, timeoutMs: number, maxBytes = 400_000): Promise<string | null> {
  const url = assertSafeHttpUrl(rawUrl);
  if (!url) return null;
  try {
    const res = await fetch(url.toString(), {
      redirect: "follow",
      headers: {
        "User-Agent": "CivicLensFactChecker/2.0 (evidence-retrieval; research@civiclens.in)",
        Accept: "text/html,application/xhtml+xml,application/xml,application/json,text/plain",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > maxBytes ? buf.slice(0, maxBytes) : buf;
    return new TextDecoder("utf-8").decode(slice);
  } catch {
    return null;
  }
}
