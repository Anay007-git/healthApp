import { extractSportsTeams } from "./sports-result";
import { informalDeathSubject, isDeathClaim, isResignationClaim } from "./query-expansion";

export interface ClaimEntities {
  people: string[];
  organizations: string[];
  schemes: string[];
  locations: string[];
  institutions: string[];
  distinctiveTokens: string[];
}

const ORG_PATTERNS: Array<{ re: RegExp; name: string }> = [
  { re: /\brbi\b|reserve bank of india/i, name: "RBI" },
  { re: /\bpib\b|press information bureau/i, name: "PIB" },
  { re: /\beci\b|election commission/i, name: "Election Commission of India" },
  { re: /\bcag\b|comptroller and auditor/i, name: "CAG" },
  { re: /\bsebi\b/i, name: "SEBI" },
  { re: /\birdai\b/i, name: "IRDAI" },
  { re: /\btrai\b/i, name: "TRAI" },
  { re: /\bisro\b/i, name: "ISRO" },
  { re: /\bnasa\b/i, name: "NASA" },
  { re: /\bwho\b|world health organization/i, name: "WHO" },
  { re: /supreme court/i, name: "Supreme Court of India" },
  { re: /high court/i, name: "High Court" },
  { re: /lok sabha/i, name: "Lok Sabha" },
  { re: /rajya sabha/i, name: "Rajya Sabha" },
  { re: /parliament/i, name: "Parliament of India" },
  { re: /\bfifa\b/i, name: "FIFA" },
  { re: /\bicc\b|bcci\b/i, name: "ICC" },
  { re: /\bupi\b/i, name: "UPI" },
  { re: /gst\b/i, name: "GST" },
];

const PERSON_HINTS = [
  "modi",
  "mamata",
  "banerjee",
  "rahul gandhi",
  "amit shah",
  "kejriwal",
  "elon musk",
  "messi",
  "kohli",
  "rohit",
  "dharmendra",
  "pradhan",
];

const STOP = new Set([
  "india", "indian", "government", "the", "and", "did", "this", "that", "with", "from",
  "about", "have", "been", "were", "was", "will", "would", "could", "should", "official",
  "today", "news", "claim", "true", "false", "whether",
  "died", "dies", "dead", "death", "passed", "demise", "obituary",
]);

const RESIGN_STOP = new Set([
  "resigns",
  "resigned",
  "resignation",
  "minister",
  "chief",
  "prime",
  "union",
  "education",
  "government",
  "cabinet",
  "stepped",
  "quits",
  "quit",
]);

export function extractEntities(text: string): ClaimEntities {
  const low = text.toLowerCase();
  const organizations: string[] = [];
  const institutions: string[] = [];

  for (const p of ORG_PATTERNS) {
    if (p.re.test(text)) {
      organizations.push(p.name);
      institutions.push(p.name);
    }
  }

  const people = PERSON_HINTS.filter((n) => low.includes(n)).map((n) =>
    n.replace(/\b\w/g, (c) => c.toUpperCase())
  );
  if (isDeathClaim(text) && people.length === 0) {
    const guessed = informalDeathSubject(text);
    if (guessed) people.push(guessed);
  }
  if (isResignationClaim(text)) {
    const pair = text.match(/\b([A-Za-z]{3,})\s+([A-Za-z]{3,})\b/);
    if (pair && !RESIGN_STOP.has(pair[1].toLowerCase()) && !RESIGN_STOP.has(pair[2].toLowerCase())) {
      people.push(`${pair[1].replace(/^\w/, (c) => c.toUpperCase())} ${pair[2].replace(/^\w/, (c) => c.toUpperCase())}`);
    }
  }

  const schemeMatch = text.match(/\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,4}\s(?:Yojana|Yojna|Scheme|Mission|Abhiyan))\b/g) || [];
  const schemes = Array.from(new Set(schemeMatch));

  const locations: string[] = [];
  if (/\bindia\b/i.test(text)) locations.push("India");
  const stateRe =
    /\b(west bengal|uttar pradesh|madhya pradesh|andhra pradesh|tamil nadu|maharashtra|karnataka|kerala|bihar|delhi|gujarat|rajasthan|odisha|punjab|haryana|telangana|assam)\b/gi;
  let sm: RegExpExecArray | null;
  while ((sm = stateRe.exec(text)) !== null) locations.push(sm[1]);
  for (const team of extractSportsTeams(text)) {
    locations.push(team);
  }

  const distinctiveTokens = low
    .replace(/[^\p{L}\p{N}\s₹%]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));

  return {
    people: Array.from(new Set(people)),
    organizations: Array.from(new Set(organizations)),
    schemes,
    locations: Array.from(new Set(locations)),
    institutions: Array.from(new Set(institutions)),
    distinctiveTokens: Array.from(new Set(distinctiveTokens)).slice(0, 24),
  };
}

export function entityOverlapScore(claim: ClaimEntities, evidenceText: string): number {
  const elow = evidenceText.toLowerCase();
  const named = [...claim.people, ...claim.organizations, ...claim.schemes, ...claim.locations];
  const nameHit = (n: string, allowNameParts: boolean) => {
    const k = n.toLowerCase();
    if (elow.includes(k)) return true;
    const stripped = k.replace(/\s+of india\b/, "").trim();
    if (stripped.length > 3 && elow.includes(stripped)) return true;
    if (!allowNameParts) return false;
    return k
      .split(/\s+/)
      .filter((p) => p.length > 3)
      .some((p) => elow.includes(p));
  };
  if (named.length === 0) {
    const hits = claim.distinctiveTokens.filter((t) => elow.includes(t)).length;
    const ratio = claim.distinctiveTokens.length ? hits / claim.distinctiveTokens.length : 0.4;
    return Math.round(ratio * 70);
  }
  const peopleHits = claim.people.filter((n) => nameHit(n, true)).length;
  const otherNamed = [...claim.organizations, ...claim.schemes, ...claim.locations];
  const otherHits = otherNamed.filter((n) => nameHit(n, false)).length;
  const denom = claim.people.length + otherNamed.length;
  const hits = peopleHits + otherHits;
  if (claim.people.length && peopleHits > 0 && otherNamed.length === 0) {
    return Math.max(80, Math.round((hits / denom) * 100));
  }
  return Math.round((hits / denom) * 100);
}

export function claimDirection(text: string): "increase" | "decrease" | "ban" | "launch" | "win" | "neutral" {
  const t = text.toLowerCase();
  if (/\b(increas|hike|raised|hiked|upped)\b/.test(t)) return "increase";
  if (/\b(decreas|reduc|cut|lowered|slash)\b/.test(t)) return "decrease";
  if (/\b(ban|banned|prohibit|struck down)\b/.test(t)) return "ban";
  if (/\b(launch|announc|introduc|unveil)\b/.test(t)) return "launch";
  if (/\b(won|win|defeat|champion|lifted)\b/.test(t)) return "win";
  return "neutral";
}
