/**
 * Expand informal claims into search queries (aliases, formats).
 * Does not hard-code verdicts — only retrieval queries.
 */

import { extractSportsTeams } from "./sports-result";

const PERSON_ALIASES: Array<{ match: RegExp; canonical: string }> = [
  { match: /\bkohli\b/i, canonical: "Virat Kohli" },
  { match: /\brohit\b/i, canonical: "Rohit Sharma" },
  { match: /\bmessi\b/i, canonical: "Lionel Messi" },
  { match: /\bdhoni\b|\bmsd\b/i, canonical: "MS Dhoni" },
  { match: /\bdharmendra(?:\s+deol)?\b/i, canonical: "Dharmendra" },
];

const DEATH_EVENT =
  /\b(died|dies|dead|death|passed away|passing away|demise|obituar(?:y|ies)?)\b/i;

const POLITICAL_DEATH_SUBJECT =
  /\b(modi|narendra modi|mamata|banerjee|rahul gandhi|amit shah|kejriwal|prime minister|chief minister)\b/i;

export function isDeathClaim(claim: string): boolean {
  return DEATH_EVENT.test(claim);
}

/** Tabloid death rumours about sitting politicians stay on the high evidence bar. */
export function isPoliticalDeathRumour(claim: string): boolean {
  return isDeathClaim(claim) && POLITICAL_DEATH_SUBJECT.test(claim);
}

export function celebrityObituaryClaim(claim: string): boolean {
  return isDeathClaim(claim) && !isPoliticalDeathRumour(claim);
}

export type CricketFormat = "test" | "odi" | "t20" | "all";

export function cricketFormatsMentioned(text: string): Set<CricketFormat> {
  const t = text.toLowerCase();
  const out = new Set<CricketFormat>();
  if (/\ball[-\s]?formats?\b/.test(t)) out.add("all");
  if (/\bt20i?s?\b|twenty-?20|t20 internationals/.test(t)) out.add("t20");
  if (/\bodis?\b|one[-\s]day internationals?/.test(t)) out.add("odi");
  if (/\btests?\b|\btest cricket\b|\btest format\b|\btest retirement\b|\btest internationals?\b/.test(t)) {
    out.add("test");
  }
  return out;
}

export function canonicalPersonNames(claim: string): string[] {
  return PERSON_ALIASES.filter((a) => a.match.test(claim)).map((a) => a.canonical);
}

export function expandSearchQueries(claim: string): string[] {
  const base = claim.replace(/[^\w\s-]/gi, " ").replace(/\s+/g, " ").trim();
  if (base.length < 3) return [];

  const queries: string[] = [base];
  const people = canonicalPersonNames(claim);
  const formats = cricketFormatsMentioned(claim);
  const retiring = /\bretir/i.test(claim);
  const teams = extractSportsTeams(claim);
  const resultClaim = /\b(won|win|beat|defeat|lost|lose|victory)\b/i.test(claim);
  const deathClaim = isDeathClaim(claim);

  if (teams.length >= 2 && (formats.has("test") || resultClaim)) {
    const fmt = formats.has("test") ? "Test cricket" : formats.has("odi") ? "ODI" : formats.has("t20") ? "T20" : "cricket";
    queries.unshift(`${teams[0]} vs ${teams[1]} ${fmt}`);
    if (resultClaim) queries.push(`${teams[0]} beat ${teams[1]} ${fmt}`);
  }

  for (const person of people) {
    let rest = base;
    for (const a of PERSON_ALIASES) {
      rest = rest.replace(a.match, " ").replace(/\s+/g, " ").trim();
    }
    queries.push(`${person} ${rest}`.replace(/\s+/g, " ").trim());
    if (retiring && formats.has("test")) {
      queries.push(`${person} retired from Test cricket`);
      queries.push(`${person} Test retirement`);
    }
    if (retiring && formats.has("t20") && !formats.has("test")) {
      queries.push(`${person} retired from T20I`);
    }
    if (retiring && formats.has("odi") && !formats.has("test") && !formats.has("t20")) {
      queries.push(`${person} retired from ODI`);
    }
    if (deathClaim) {
      queries.push(`${person} death`);
      queries.push(`${person} died`);
      queries.push(`${person} obituary`);
    }
  }

  if (deathClaim && people.length === 0) {
    const nameGuess = informalDeathSubject(claim);
    if (nameGuess) {
      queries.push(`${nameGuess} death`);
      queries.push(`${nameGuess} died`);
    }
  }

  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of queries) {
    const k = q.toLowerCase();
    if (k.length < 3 || seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  return out.slice(0, 5);
}

export function informalDeathSubject(claim: string): string {
  return claim
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !DEATH_STOP.has(w))
    .slice(0, 3)
    .map((w) => w.replace(/^\w/, (c) => c.toUpperCase()))
    .join(" ")
    .trim();
}

const DEATH_STOP = new Set([
  "died",
  "dies",
  "dead",
  "death",
  "passed",
  "away",
  "passing",
  "demise",
  "obituary",
  "obituaries",
  "killed",
  "rumour",
  "rumor",
  "fake",
  "news",
  "claim",
  "true",
  "false",
]);

/**
 * Require obituaries to name the claimed person, not a relative-only headline
 * that never mentions them.
 */
export function deathAttributedToClaim(claim: string, evidenceText: string): boolean {
  if (!isDeathClaim(claim)) return true;
  const blob = evidenceText.toLowerCase();
  if (!DEATH_EVENT.test(blob)) return false;

  const people = canonicalPersonNames(claim);
  const keys = people.length
    ? people.flatMap((p) => p.toLowerCase().split(/\s+/).filter((w) => w.length > 3))
    : informalDeathSubject(claim)
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);

  if (!keys.length) return DEATH_EVENT.test(blob);
  return keys.some((n) => blob.includes(n));
}

/**
 * For retirement claims, require the evidence to attribute retirement to the
 * claimed person (and claimed format when specified), not a teammate.
 */
export function retirementAttributedToClaim(claim: string, evidenceText: string): boolean {
  if (!/\bretir/i.test(claim)) return true;
  const blob = evidenceText.toLowerCase();
  if (!/\bretir/i.test(blob)) return false;

  const people = canonicalPersonNames(claim);
  const lastNames = people.map((p) => p.split(/\s+/).pop()!.toLowerCase());
  const names = lastNames.length ? lastNames : [];

  if (!names.length) return /\bretir/i.test(blob);

  const formats = cricketFormatsMentioned(claim);
  const formatAlt = formats.has("test")
    ? "test"
    : formats.has("t20")
      ? "t20i?"
      : formats.has("odi")
        ? "odi"
        : "";

  return names.some((n) => {
    const name = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const fmt = formatAlt || "(?:test|odi|t20i?)";
    const attributed = new RegExp(
      `${name}(?:['’]s)?\\s+${fmt}\\s+retirement` +
        `|${name}[^\\n.]{0,90}${fmt}\\s+retirement` +
        `|${name}[\\s\\S]{0,280}retir(?:ed|es|ement)\\s+from(?:\\s+the)?\\s+${fmt}` +
        `|retir(?:ed|es|ement)\\s+from(?:\\s+the)?\\s+${fmt}[\\s\\S]{0,120}${name}`,
      "i"
    );
    return attributed.test(blob);
  });
}
