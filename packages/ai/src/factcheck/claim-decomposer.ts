import { extractNumbers, extractYears } from "./numbers";
import { clampClaim } from "./sanitize";

export interface AtomicClaim {
  text: string;
  hasDate: boolean;
  hasNumber: boolean;
}

function toDeclarative(clause: string): string {
  let c = clause.trim().replace(/^[?!.]+|[?!.]+$/g, "");
  c = c.replace(/^(did|does|do|is|are|was|were|has|have)\s+/i, "");
  c = c.replace(/^(the\s+)?(fact that|claim that|whether)\s+/i, "");
  if (c.length) c = c.charAt(0).toUpperCase() + c.slice(1);
  if (c && !/[.]$/.test(c)) c += ".";
  return c;
}

export function decomposeClaim(rawInput: string): AtomicClaim[] {
  const input = clampClaim(rawInput);
  if (!input) return [];

  const cleaned = input
    .replace(/\s+/g, " ")
    .replace(/\band did\b/gi, " and ")
    .replace(/\band does\b/gi, " and ");

  // Split only independent clauses. Do not clone “occurred in YEAR” — that glued
  // “lifts 2026 world cup” into “liftsworld cup” and forced users to retest every prompt.
  const parts = cleaned
    .split(/\s+(?:and|;|\u2014|\u2013)\s+|\.(?:\s+|$)|,(?=\s+(?:did|does|and))/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 8);

  const clauses = parts.length > 1 ? parts : [cleaned];
  const atomics: AtomicClaim[] = [];
  const seen = new Set<string>();

  const push = (text: string) => {
    const t = toDeclarative(text);
    const key = t.toLowerCase();
    if (t.length < 8 || seen.has(key)) return;
    seen.add(key);
    atomics.push({
      text: t,
      hasDate: extractYears(t).length > 0,
      hasNumber: extractNumbers(t).length > 0,
    });
  };

  for (const clause of clauses) {
    push(clause);
  }

  if (atomics.length === 0) {
    push(cleaned);
  }

  return atomics.slice(0, 8);
}
