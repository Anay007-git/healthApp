import {
  ClaimAnalysisResult,
  FactCheckVerdict,
  Source,
  AtomicClaimResult,
  StructuredEvidence,
} from "@civiclens/types";
import { db } from "@civiclens/database";
import { clampClaim } from "./sanitize";
import { decomposeClaim } from "./claim-decomposer";
import { classifyClaim, toClaimCategory, isTimeSensitive } from "./claim-classifier";
import { isOffTopicSportsEvidence } from "./sport-discipline";
import { detectLinguisticSignals } from "./linguistic";
import { matchKnownFactChecks, matchViralPhrase } from "./cache-matcher";
import { sportsSubjectsOverlap } from "./sports-result";
import { defaultEvidenceRetriever, EvidenceRetriever } from "./evidence-retriever";
import { matchEvidenceToClaim } from "./evidence-matcher";
import { rankEvidence } from "./evidence-ranker";
import { computeVerdict, aggregateAtomicVerdicts } from "./verdict-engine";
import { reasonOverEvidence } from "./llm-reasoner";
import { cacheGet, cacheSet, normalizeClaimKey, ttlForTopic } from "./cache";

export interface FactCheckEngineOptions {
  retriever?: EvidenceRetriever;
  skipLlm?: boolean;
  now?: Date;
}

function toSource(e: StructuredEvidence, idx: number): Source {
  const official = e.sourceTier === 1;
  const sourceType: Source["sourceType"] =
    e.sourceType === "PIB_RELEASE"
      ? "PIB_RELEASE"
      : e.sourceType === "CAG_AUDIT"
        ? "CAG_AUDIT"
        : e.sourceType === "ECI_AFFIDAVIT"
          ? "ECI_AFFIDAVIT"
          : official
            ? "GOVERNMENT_REPORT"
            : "INDEPENDENT_RESEARCH";
  return {
    id: e.id || `src-ev-${idx}`,
    name: e.sourceName,
    publisher: e.publisher,
    url: e.sourceUrl,
    publicationDate: e.publicationDate || e.retrievedAt.slice(0, 10),
    sourceType,
    isOfficial: official,
  };
}

function civicEntities(text: string) {
  const low = text.toLowerCase();
  const schemesMatched = db
    .getSchemes()
    .filter((s) => low.includes(s.name.toLowerCase()) || low.includes(s.slug.toLowerCase()))
    .map((s) => s.name);
  const ministersMatched = db
    .getMinisters()
    .filter((m) => {
      const n = (m.name || "").toLowerCase();
      return n.length > 3 && low.includes(n);
    })
    .map((m) => m.name);
  const statesMatched = db
    .getStates()
    .filter((st) => low.includes(st.name.toLowerCase()))
    .map((st) => st.name);
  const moneyMatches = text.match(/(?:Rs\.?|₹|INR)\s*[\d,]+(?:\.\d+)?\s*(?:cr|crore|lakh|thousand)?/gi) || [];
  return { schemes: schemesMatched, ministers: ministersMatched, states: statesMatched, monetaryValues: moneyMatches };
}

function cacheEvidenceFromKnown(
  claim: string,
  knownTitle: string,
  summary: string,
  url: string,
  publisher: string,
  date: string,
  cacheVerdict: string,
  originalDbClaim: string
): StructuredEvidence {
  const polarity =
    cacheVerdict === "FALSE" || cacheVerdict === "MISLEADING" || cacheVerdict === "SATIRE"
      ? `Fact-check record rates the matching claim FALSE/MISLEADING. Official clarification: ${summary}. This contradicts "${originalDbClaim}".`
      : `Fact-check record confirms: ${summary}. Official source supports the matching claim "${originalDbClaim}".`;
  return {
    id: `cache-${knownTitle.slice(0, 20)}`,
    atomicClaim: claim,
    sourceName: knownTitle,
    sourceUrl: url,
    sourceTier: 3,
    sourceType: "FACT_CHECK_ORG",
    publisher,
    publicationDate: date,
    retrievedAt: new Date().toISOString(),
    evidenceText: polarity,
    evidenceSummary: summary.slice(0, 280),
    supportsClaim: false,
    contradictsClaim: false,
    stance: "INSUFFICIENT",
    relevanceScore: 0,
    sourceQualityScore: 88,
    temporalMatchScore: 50,
    entityMatchScore: 50,
    numericMatchScore: 50,
    overallEvidenceScore: 0,
    whyItMatters: "High-value known fact-check cache. Used only after strong semantic match; not keyword overlap. Time-sensitive claims still require live evidence when available.",
    isDiscoveryOnly: false,
  };
}

export async function runFactCheck(rawClaimText: string, options: FactCheckEngineOptions = {}): Promise<ClaimAnalysisResult> {
  const text = clampClaim(rawClaimText);
  const retriever = options.retriever || defaultEvidenceRetriever;
  const linguistics = detectLinguisticSignals(text);
  const entities = civicEntities(text);

  if (text.length < 3) {
    return buildResult({
      text,
      verdict: "UNVERIFIED",
      confidenceScore: 10,
      truthSummary: "Claim too short to evaluate.",
      detailedDebunk: "Provide a complete factual statement.",
      linguistics,
      entities,
      evidence: [],
      atomicClaims: [],
      methodology: "Input rejected as too short.",
      conflicts: [],
      limitations: ["Insufficient input."],
      categoryTopic: "GENERAL",
    });
  }

  const cacheKey = `fc:v5:${normalizeClaimKey(text)}`;
  const cachedResult = cacheGet<ClaimAnalysisResult>(cacheKey);

  const atomics = decomposeClaim(text);
  const topics = atomics.map((a) => classifyClaim(a.text));
  const primaryTopic = classifyClaim(text);

  if (cachedResult && !isTimeSensitive(primaryTopic)) {
    return cachedResult;
  }

  const known = matchKnownFactChecks(text);
  const viral = known ? null : matchViralPhrase(text);

  const live = await retriever(text, primaryTopic).catch(() => [] as StructuredEvidence[]);

  const atomicResults: AtomicClaimResult[] = [];

  for (let i = 0; i < atomics.length; i++) {
    const atomic = atomics[i];
    let pool = [...live];
    if (known && sportsSubjectsOverlap(atomic.text, `${known.claim.title} ${known.claim.claim}`)) {
      pool = [
        cacheEvidenceFromKnown(
          atomic.text,
          known.claim.title,
          `${known.claim.truthSummary} ${known.claim.debunkExplanation}`,
          known.claim.officialClarificationUrl || "https://factcheck.pib.gov.in",
          known.claim.officialSourceLabel || known.claim.claimant,
          known.claim.dateReported,
          known.claim.verdict,
          known.claim.claim
        ),
        ...pool,
      ];
    } else if (viral) {
      pool = [
        cacheEvidenceFromKnown(
          atomic.text,
          viral.trigger[0],
          viral.truthSummary,
          "https://factcheck.pib.gov.in",
          "CivicLens viral-pattern cache (phrase match ≥10 chars)",
          new Date().toISOString().slice(0, 10),
          viral.verdict,
          viral.truthSummary
        ),
        ...pool,
      ];
    }

    const matched = rankEvidence(pool.map((e) => matchEvidenceToClaim(atomic.text, { ...e, atomicClaim: atomic.text })));
    let computed = computeVerdict(atomic.text, matched, topics[i]);

    const liveIsWeak = live.every((e) => e.isDiscoveryOnly || e.sourceTier === 4);
    if (known && (live.length === 0 || liveIsWeak)) {
      computed = {
        ...computed,
        verdict: known.claim.verdict,
        confidenceScore: Math.min(
          known.claim.confidenceScore,
          isTimeSensitive(topics[i]) ? 80 : known.claim.confidenceScore
        ),
        truthSummary: known.claim.truthSummary,
        detailedDebunk: `${known.claim.debunkExplanation} Cache applied after strong semantic match (${known.reason}).`,
      };
    } else if (viral && live.length === 0) {
      computed = {
        ...computed,
        verdict: viral.verdict,
        confidenceScore: Math.min(computed.confidenceScore || 85, 88),
        truthSummary: viral.truthSummary,
        detailedDebunk: viral.truthSummary,
      };
    }

    if (known && isTimeSensitive(topics[i]) && live.length === 0) {
      computed.limitations.push("Time-sensitive claim matched a known fact-check cache without fresh live evidence.");
      computed.confidenceScore = Math.min(computed.confidenceScore, 80);
    }

    if (!options.skipLlm) {
      const judged = await reasonOverEvidence(atomic.text, matched, {
        verdict: computed.verdict,
        confidenceScore: computed.confidenceScore,
        truthSummary: computed.truthSummary,
        detailedDebunk: computed.detailedDebunk,
        groundReality: computed.truthSummary,
      });
      computed = {
        ...computed,
        verdict: judged.verdict,
        confidenceScore: judged.confidenceScore,
        truthSummary: judged.truthSummary,
        detailedDebunk: judged.detailedDebunk || computed.detailedDebunk,
      };
    }

    atomicResults.push({
      claim: atomic.text,
      verdict: computed.verdict,
      confidenceScore: computed.confidenceScore,
      evidence: matched.slice(0, 8),
      topic: topics[i],
    });
  }

  const agg = aggregateAtomicVerdicts(text, atomicResults);
  let verdict = atomicResults.length === 1 ? atomicResults[0].verdict : agg.verdict;
  let confidenceScore = atomicResults.length === 1 ? atomicResults[0].confidenceScore : agg.confidenceScore;
  let truthSummary = atomicResults.length === 1 ? atomicResults[0].evidence.length ? computeTopSummary(atomicResults[0]) : agg.truthSummary : agg.truthSummary;
  let detailedDebunk = atomicResults.map((a) => `${a.claim} → ${a.verdict} (${a.confidenceScore}%).`).join(" ");

  if (linguistics.phishingSuspected && /yojna|yojana|scheme|recharge|free ₹|free rs/i.test(text)) {
    verdict = "FALSE";
    confidenceScore = Math.max(confidenceScore, 90);
    truthSummary =
      "This message pairs an official-scheme payout claim with a non-government shortlink/domain. Indian government schemes are not claimed via bit.ly/.xyz phishing pages.";
    detailedDebunk += " Phishing-channel evidence (unofficial domain) contradicts the claim that this is an official government scheme.";
  }

  const allEvidence = atomicResults.flatMap((a) => a.evidence);
  const conflicts = atomicResults.flatMap((a) =>
    a.evidence.filter((e) => e.stance === "CONTRADICTS").length && a.evidence.filter((e) => e.stance === "SUPPORTS").length
      ? [
          {
            summary: `Atomic claim "${a.claim}" has both supporting and contradicting evidence.`,
            sourceA: a.evidence.find((e) => e.stance === "SUPPORTS")?.publisher || "A",
            sourceB: a.evidence.find((e) => e.stance === "CONTRADICTS")?.publisher || "B",
            authorityNote: "Conflict is reported rather than resolved by first-hit selection.",
          },
        ]
      : []
  );

  const limitations = [...(agg.limitations || [])];

  const methodology = "Checked against live named sources (not a writing-style fake-news classifier).";

  if (atomicResults.length > 1) {
    truthSummary = agg.truthSummary;
    detailedDebunk = agg.detailedDebunk || detailedDebunk;
  } else if (atomicResults[0]) {
    const one = computeVerdict(atomicResults[0].claim, atomicResults[0].evidence, primaryTopic);
    truthSummary = one.truthSummary;
    detailedDebunk = one.detailedDebunk;
  }

  const result = buildResult({
    text,
    verdict,
    confidenceScore,
    truthSummary,
    detailedDebunk,
    linguistics,
    entities,
    evidence: allEvidence,
    atomicClaims: atomicResults,
    methodology,
    conflicts,
    limitations,
    categoryTopic: primaryTopic,
    evidenceId: known?.claim.evidenceId,
  });

  cacheSet(cacheKey, result, ttlForTopic(primaryTopic));
  return result;
}

function computeTopSummary(a: AtomicClaimResult): string {
  const top = a.evidence.find((e) => e.stance === "SUPPORTS" || e.stance === "CONTRADICTS") || a.evidence[0];
  return top ? `${a.verdict}: ${top.evidenceSummary}` : a.claim;
}

function evidenceForDisplay(claim: string, items: StructuredEvidence[]): StructuredEvidence[] {
  const ranked = [...items]
    .filter((e) => !isOffTopicSportsEvidence(claim, `${e.sourceName} ${e.evidenceText}`))
    .sort((a, b) => {
      const order: Record<string, number> = { SUPPORTS: 0, CONTRADICTS: 1, NEUTRAL: 2, INSUFFICIENT: 9 };
      const stanceDiff = (order[a.stance] ?? 8) - (order[b.stance] ?? 8);
      if (stanceDiff !== 0) return stanceDiff;
      return b.overallEvidenceScore - a.overallEvidenceScore;
    });
  const useful = ranked.filter((e) => e.stance !== "INSUFFICIENT" || e.overallEvidenceScore >= 45);
  return (useful.length ? useful : ranked.filter((e) => e.stance !== "INSUFFICIENT")).slice(0, 6);
}

function buildResult(args: {
  text: string;
  verdict: FactCheckVerdict;
  confidenceScore: number;
  truthSummary: string;
  detailedDebunk: string;
  linguistics: ReturnType<typeof detectLinguisticSignals>;
  entities: ReturnType<typeof civicEntities>;
  evidence: StructuredEvidence[];
  atomicClaims: AtomicClaimResult[];
  methodology: string;
  conflicts: ClaimAnalysisResult["conflicts"];
  limitations: string[];
  categoryTopic: string;
  evidenceId?: string;
}): ClaimAnalysisResult {
  const icon = args.verdict === "VERIFIED_TRUE" || args.verdict === "PARTIALLY_TRUE" ? "✅" : args.verdict === "UNVERIFIED" ? "🔍" : "❌";
  const displayEvidence = evidenceForDisplay(args.text, args.evidence);
  const sources = displayEvidence.filter((e) => e.stance !== "INSUFFICIENT" || e.sourceTier <= 2).slice(0, 6);
  const primarySources = (sources.length ? sources : displayEvidence.slice(0, 3)).map(toSource);

  const shareableDebunkText = `${icon} *CIVICLENS TRUTHCHECK*\n\n⚖️ *VERDICT*: ${args.verdict}\n📊 *CONFIDENCE*: ${args.confidenceScore}/100\n📌 *CLAIM*: "${args.text}"\n\n${icon} *WHY*: ${args.truthSummary}\n🛡️ CivicLens.in`;

  return {
    verdict: args.verdict,
    confidenceScore: args.confidenceScore,
    sensationalismScore: args.linguistics.sensationalismScore,
    truthSummary: args.truthSummary,
    detailedDebunk: args.detailedDebunk,
    groundReality: args.truthSummary,
    originalClaim: args.text,
    signalsDetected: args.linguistics.signalsDetected,
    redFlagPhrases: Array.from(new Set(args.linguistics.redFlagPhrases)),
    matchedCivicEntities: args.entities,
    primarySources,
    evidenceId: args.evidenceId,
    shareableDebunkText,
    category: toClaimCategory(classifyClaim(args.text), args.text),
    atomicClaims: args.atomicClaims,
    methodology: args.methodology,
    conflicts: args.conflicts,
    limitations: args.limitations,
    structuredEvidence: displayEvidence,
  };
}
