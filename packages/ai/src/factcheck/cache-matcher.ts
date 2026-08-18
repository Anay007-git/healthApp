import { FactCheckClaim } from "@civiclens/types";
import { FACT_CHECK_CLAIMS, VIRAL_PATTERNS_DB } from "@civiclens/database";
import { extractEntities, claimDirection } from "./entities";
import { extractNumbers, extractYears } from "./numbers";
import { normalizeClaimKey } from "./cache";

const STOP = new Set([
  "india", "prime", "minister", "modi", "government", "today", "news", "official",
  "free", "scheme", "yojna", "yojana", "bjp", "congress", "the", "and", "for", "this",
]);

function tokens(text: string): string[] {
  return normalizeClaimKey(text)
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
}

export interface CacheMatch {
  claim: FactCheckClaim;
  score: number;
  reason: string;
}

export function matchKnownFactChecks(userText: string, known: FactCheckClaim[] = FACT_CHECK_CLAIMS): CacheMatch | null {
  const qYears = extractYears(userText);
  const qNums = extractNumbers(userText);
  const qEnt = extractEntities(userText);
  const qDir = claimDirection(userText);
  const qTok = tokens(userText);
  if (qTok.length < 2 && qEnt.organizations.length === 0) return null;

  let best: CacheMatch | null = null;

  for (const fc of known) {
    const corpus = `${fc.title} ${fc.claim}`;
    const fcYears = extractYears(corpus);
    if (qYears.length && fcYears.length && !qYears.some((y) => fcYears.includes(y))) {
      continue;
    }

    const tSim = jaccard(qTok, tokens(corpus));
    const fcEnt = extractEntities(corpus);
    const namedQ = [...qEnt.people, ...qEnt.organizations, ...qEnt.schemes].map((s) => s.toLowerCase());
    const namedF = [...fcEnt.people, ...fcEnt.organizations, ...fcEnt.schemes].map((s) => s.toLowerCase());
    const entHits = namedQ.filter((n) => namedF.includes(n) || corpus.toLowerCase().includes(n)).length;
    const entScore = namedQ.length ? entHits / namedQ.length : 0.3;

    const fcNums = extractNumbers(corpus);
    let numScore = 0.4;
    if (qNums.length && fcNums.length) {
      const anyExact = qNums.some((qn) =>
        fcNums.some((fn) => {
          if (qn.inr != null && fn.inr != null) return Math.abs(qn.inr - fn.inr) / Math.max(qn.inr, 1) < 0.02;
          return Math.abs(qn.value - fn.value) < 1e-6;
        })
      );
      numScore = anyExact ? 1 : 0.15;
    }

    const qIds: string[] = userText.match(/\d{5,}/g) ?? [];
    const fcIds: string[] = corpus.match(/\d{5,}/g) ?? [];
    const idHit = qIds.some((id) => fcIds.includes(id));
    if (idHit) numScore = Math.max(numScore, 1);
    const dirScore = qDir === "neutral" || qDir === claimDirection(corpus) ? 1 : 0.2;
    const redFlagHit = (fc.highlightedRedFlags || []).some((k) => k.length > 8 && userText.toLowerCase().includes(k.toLowerCase()));

    const score = tSim * 0.35 + entScore * 0.25 + numScore * 0.2 + dirScore * 0.1 + (redFlagHit ? 0.15 : 0);
    const distinctive = tSim >= 0.22 || redFlagHit || (entScore >= 0.5 && numScore >= 0.9) || entScore >= 0.8;

    if (score < 0.58 || !distinctive) continue;

    if (!best || score > best.score) {
      best = { claim: fc, score, reason: `semantic cache match score=${score.toFixed(2)}` };
    }
  }

  return best;
}

export function matchViralPhrase(userText: string): (typeof VIRAL_PATTERNS_DB)[number] | null {
  const low = userText.toLowerCase();
  for (const vp of VIRAL_PATTERNS_DB) {
    const hit = vp.trigger.find((tr) => tr.length >= 10 && low.includes(tr));
    if (hit) return vp;
  }
  return null;
}
