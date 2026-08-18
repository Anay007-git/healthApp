import { EvidenceStance, StructuredEvidence } from "@civiclens/types";
import { extractEntities, entityOverlapScore, claimDirection } from "./entities";
import { extractNumbers, extractYears, numbersAlign, isAllocationLanguage, isExpenditureLanguage } from "./numbers";
import { containsPromptInjection, sanitizeEvidenceText } from "./sanitize";
import { cricketFormatsMentioned, retirementAttributedToClaim } from "./query-expansion";
import { sportsResultConflict, parseSportsResult } from "./sports-result";

const SUPPORT_CUES =
  /\b(confirm(?:ed|s)?|officially|announced|notified|gazetted|successfully|verif(?:y|ied)|true that|did (?:increase|launch|win|ban)|upheld|soft landing|retir(?:e|ed|es|ement)|stepped down|won|beat|defeated|victory|thrashed)\b/i;
const CONTRADICT_CUES = /\b(denied|debunk|false|not true|no such|did not|didn't|has not|never (?:happened|occurred|took place)|rejected|refuted|incorrect|no gst|remains free|is not|not a)\b/i;
const DISCUSS_CUES = /\b(said|claimed|alleged|rumour|rumor|unverified|reportedly|according to social)\b/i;

export function matchEvidenceToClaim(atomicClaim: string, evidence: StructuredEvidence): StructuredEvidence {
  const claim = atomicClaim;
  const text = sanitizeEvidenceText(`${evidence.evidenceText} ${evidence.evidenceSummary} ${evidence.sourceName}`);
  const injection = containsPromptInjection(evidence.evidenceText || "");

  const claimEnt = extractEntities(claim);
  const entityMatchScore = entityOverlapScore(claimEnt, text);

  const claimYears = extractYears(claim);
  const evidenceYears = extractYears(text);
  const pubYear = evidence.publicationDate ? extractYears(evidence.publicationDate) : [];
  let temporalMatchScore = 70;
  if (claimYears.length) {
    const eventHit = claimYears.some((y) => evidenceYears.includes(y));
    const pubOnly = !eventHit && claimYears.some((y) => pubYear.includes(y));
    if (eventHit) temporalMatchScore = 90;
    else if (pubOnly) temporalMatchScore = 35;
    else if (evidenceYears.length && !eventHit) temporalMatchScore = 20;
    else temporalMatchScore = 40;
  }

  const num = numbersAlign(extractNumbers(claim), extractNumbers(text));
  const numericMatchScore = num.score;

  const cDir = claimDirection(claim);
  const eDir = claimDirection(text);
  const directionClash = cDir !== "neutral" && eDir !== "neutral" && cDir !== eDir;

  const allocVsSpend =
    (isAllocationLanguage(claim) && isExpenditureLanguage(text)) ||
    (isExpenditureLanguage(claim) && isAllocationLanguage(text));

  let stance: EvidenceStance = "INSUFFICIENT";
  const relevant = entityMatchScore >= 45 && (claimYears.length === 0 || temporalMatchScore >= 35);

  if (!relevant) {
    stance = "INSUFFICIENT";
  } else if (num.contradicted && !allocVsSpend) {
    stance = "CONTRADICTS";
  } else if (directionClash && numericMatchScore < 80) {
    stance = "CONTRADICTS";
  } else if (CONTRADICT_CUES.test(text) && entityMatchScore >= 50) {
    stance = "CONTRADICTS";
  } else if (DISCUSS_CUES.test(text) && !SUPPORT_CUES.test(text) && evidence.isDiscoveryOnly) {
    stance = "NEUTRAL";
  } else if (num.exact && entityMatchScore >= 55 && temporalMatchScore >= 60 && SUPPORT_CUES.test(text)) {
    stance = "SUPPORTS";
  } else if (entityMatchScore >= 70 && temporalMatchScore >= 60 && !num.contradicted && (SUPPORT_CUES.test(text) || (!DISCUSS_CUES.test(text) && !evidence.isDiscoveryOnly && evidence.sourceTier <= 2))) {
    stance = "SUPPORTS";
  } else if (entityMatchScore >= 50) {
    stance = "NEUTRAL";
  }

  const claimFormats = cricketFormatsMentioned(claim);
  const evidenceFormats = cricketFormatsMentioned(text);
  const retirementClaim = /\bretir/i.test(claim);
  if (retirementClaim && stance === "SUPPORTS" && !retirementAttributedToClaim(claim, text)) {
    stance = "NEUTRAL";
  }
  if (
    retirementClaim &&
    claimFormats.has("test") &&
    !claimFormats.has("t20") &&
    !claimFormats.has("odi") &&
    !claimFormats.has("all") &&
    evidenceFormats.has("t20") &&
    !evidenceFormats.has("test") &&
    !evidenceFormats.has("all") &&
    /\bretir/i.test(text)
  ) {
    if (/\b(continues? to play|remains? (?:an? )?test|available for test)/i.test(text)) {
      stance = "CONTRADICTS";
    } else if (stance === "SUPPORTS") {
      stance = "NEUTRAL";
    }
  }

  const sportsSides = sportsResultConflict(claim, text);
  if (sportsSides === "CONTRADICTS") stance = "CONTRADICTS";
  else if (sportsSides === "SUPPORTS" && relevant && !num.contradicted) stance = "SUPPORTS";
  else if (parseSportsResult(claim).winner && stance === "SUPPORTS" && sportsSides !== "SUPPORTS") {
    stance = /\b(won|beat|defeated|victory|win)\b/i.test(text) ? stance : "NEUTRAL";
  }

  if (injection) {
    if (stance === "SUPPORTS") stance = "NEUTRAL";
  }

  // Anonymous Google News / social discovery cannot SUPPORT merely by mentioning the topic.
  // Named quality publishers (ESPNcricinfo, BBC, Reuters, ICC) and Wikipedia extracts that
  // actually assert the fact may SUPPORT after matching.
  const anonymousDiscovery =
    evidence.isDiscoveryOnly &&
    evidence.sourceTier === 4 &&
    evidence.sourceQualityScore < 40 &&
    evidence.sourceType !== "WIKIPEDIA_CONTEXT";
  if (anonymousDiscovery && stance === "SUPPORTS") {
    stance = "NEUTRAL";
  }

  const relevanceScore = Math.round(
    entityMatchScore * 0.45 + temporalMatchScore * 0.25 + numericMatchScore * 0.2 + (relevant ? 10 : 0)
  );

  const overallEvidenceScore = Math.round(
    evidence.sourceQualityScore * 0.35 +
      relevanceScore * 0.25 +
      entityMatchScore * 0.15 +
      temporalMatchScore * 0.15 +
      numericMatchScore * 0.1
  );

  const why =
    stance === "SUPPORTS"
      ? "Text aligns with the atomic claim on entities, dates, and numbers."
      : stance === "CONTRADICTS"
        ? "Source discusses the same subject but reports a conflicting fact, date, or number."
        : stance === "NEUTRAL"
          ? "Source discusses the topic but does not establish the specific claim."
          : "Insufficient overlap with the exact atomic claim (entity, date, or number mismatch).";

  return {
    ...evidence,
    atomicClaim: claim,
    evidenceText: text,
    supportsClaim: stance === "SUPPORTS",
    contradictsClaim: stance === "CONTRADICTS",
    stance,
    relevanceScore: Math.min(100, relevanceScore),
    temporalMatchScore,
    entityMatchScore,
    numericMatchScore,
    overallEvidenceScore: Math.min(100, overallEvidenceScore),
    whyItMatters: evidence.whyItMatters || why,
  };
}
