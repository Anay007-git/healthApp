import { EvidenceStance, StructuredEvidence } from "@civiclens/types";
import { extractEntities, entityOverlapScore, claimDirection } from "./entities";
import { extractNumbers, extractYears, numbersAlign, isAllocationLanguage, isExpenditureLanguage } from "./numbers";
import { containsPromptInjection, sanitizeEvidenceText } from "./sanitize";

const SUPPORT_CUES = /\b(confirm(?:ed|s)?|officially|announced|notified|gazetted|successfully|verif(?:y|ied)|true that|did (?:increase|launch|win|ban)|upheld|soft landing)\b/i;
const CONTRADICT_CUES = /\b(denied|debunk|false|not true|no such|did not|didn't|has not|never|rejected|refuted|incorrect|no gst|remains free|is not|not a)\b/i;
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

  if (injection) {
    if (stance === "SUPPORTS") stance = "NEUTRAL";
  }

  if (evidence.isDiscoveryOnly && stance === "SUPPORTS" && evidence.sourceTier === 4) {
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
