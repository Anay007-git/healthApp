import { SourceTier } from "@civiclens/types";
import { celebrityObituaryClaim } from "./query-expansion";

const TIER1_HOSTS = [
  "rbi.org.in",
  "pib.gov.in",
  "eci.gov.in",
  "cag.gov.in",
  "sci.gov.in",
  "main.sci.gov.in",
  "isro.gov.in",
  "india.gov.in",
  "nic.in",
  "gov.in",
  "sebi.gov.in",
  "irdai.gov.in",
  "trai.gov.in",
  "who.int",
  "nasa.gov",
  "fifa.com",
  "icc-cricket.com",
  "egazette.gov.in",
  "indiabudget.gov.in",
  "loksabha.nic.in",
  "rajyasabha.nic.in",
];

const TIER2_HOSTS = [
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "bbc.co.uk",
  "thehindu.com",
  "indianexpress.com",
  "ptinews.com",
  "pti.in",
  "espncricinfo.com",
  "cricinfo.com",
];

const TIER2_PUBLISHERS = [
  "reuters",
  "associated press",
  "ap",
  "bbc",
  "the hindu",
  "indian express",
  "pti",
  "espncricinfo",
  "cricinfo",
  "espn cricinfo",
  "icc",
  "bcci",
];

const TIER3_HOSTS = [
  "altnews.in",
  "boomlive.in",
  "factly.in",
  "factcheck.afp.com",
  "reuters.com/fact-check",
];

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Named desks found via Google News still count as journalism for sports and celebrity obituaries. */
const NEWS_DESK_PUBLISHERS = [
  "hindustan times",
  "times of india",
  "india today",
  "ndtv",
  "livemint",
  "mint",
  "cricbuzz",
  "wisden",
  "sky sports",
  "skysports",
  "the guardian",
  "news18",
  "ani",
  "al jazeera",
  "cricket.com.au",
  "abc news",
  "abc.net.au",
];

export function classifySourceForTopic(
  url: string,
  publisher: string | undefined,
  topic: string,
  claim = ""
): { tier: SourceTier; quality: number; type: string } {
  const base = classifySource(url, publisher);
  if (base.tier <= 2) return base;
  const pub = (publisher || "").toLowerCase();
  const namedDesk = NEWS_DESK_PUBLISHERS.some((p) => pub.includes(p));
  if (!namedDesk) return base;
  if (topic === "SPORTS" || celebrityObituaryClaim(claim)) {
    return { tier: 2, quality: 76, type: "QUALITY_JOURNALISM" };
  }
  return base;
}

export function classifySource(url: string, publisher?: string): {
  tier: SourceTier;
  quality: number;
  type: string;
} {
  const host = hostOf(url);
  const pub = (publisher || "").toLowerCase();
  const blob = `${host} ${pub} ${url.toLowerCase()}`;

  if (blob.includes("wikipedia.org")) {
    return { tier: 4, quality: 50, type: "WIKIPEDIA_CONTEXT" };
  }
  if (/(twitter|x\.com|facebook|instagram|telegram|whatsapp|reddit)/.test(blob)) {
    return { tier: 4, quality: 10, type: "SOCIAL_MEDIA" };
  }

  if (TIER3_HOSTS.some((h) => blob.includes(h)) || /fact.?check/.test(blob)) {
    return { tier: 3, quality: 82, type: "FACT_CHECK_ORG" };
  }
  if (
    TIER2_HOSTS.some((h) => host.endsWith(h) || host === h) ||
    TIER2_PUBLISHERS.some((p) => pub.includes(p) || blob.includes(p))
  ) {
    return { tier: 2, quality: 80, type: "QUALITY_JOURNALISM" };
  }
  if (TIER1_HOSTS.some((h) => host.endsWith(h) || host === h) || /\bicc\b|\bbcci\b/.test(pub)) {
    return { tier: 1, quality: 94, type: "PRIMARY_OFFICIAL" };
  }
  if (blob.includes("news.google.com") || blob.includes("google.com/rss")) {
    return { tier: 4, quality: 18, type: "GOOGLE_NEWS_DISCOVERY" };
  }
  if (blob.includes("duckduckgo.com")) {
    return { tier: 4, quality: 16, type: "DDG_DISCOVERY" };
  }

  return { tier: 4, quality: 22, type: "DISCOVERY" };
}

export function qualityBandLabel(score: number): string {
  if (score >= 90) return "primary/official";
  if (score >= 70) return "high-quality secondary";
  if (score >= 40) return "background context";
  return "discovery only";
}
