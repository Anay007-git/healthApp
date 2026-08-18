import { FactCheckVerdict, StructuredEvidence, AtomicClaimResult, EvidenceConflict } from "@civiclens/types";
import { independentSourceCount } from "./evidence-ranker";
import { detectConflicts } from "./contradiction-detector";

export interface VerdictComputation {
  verdict: FactCheckVerdict;
  confidenceScore: number;
  truthSummary: string;
  detailedDebunk: string;
  conflicts: EvidenceConflict[];
  limitations: string[];
}

export function computeVerdict(atomicClaim: string, evidence: StructuredEvidence[], topic = "GENERAL"): VerdictComputation {
  const usable = evidence.filter((e) => e.stance !== "INSUFFICIENT" || e.sourceTier === 1);
  const supports = evidence.filter((e) => e.stance === "SUPPORTS");
  const contradicts = evidence.filter((e) => e.stance === "CONTRADICTS");
  const discoveryOnly = evidence.filter((e) => e.isDiscoveryOnly);
  const primarySupport = supports.filter((e) => e.sourceTier === 1);
  const highSupport = supports.filter((e) => e.sourceQualityScore >= 70);
  const wikiSupport = supports.filter((e) => e.sourceType === "WIKIPEDIA_CONTEXT" || /wikipedia/i.test(e.publisher));
  const highContra = contradicts.filter((e) => e.sourceQualityScore >= 70);
  const conflicts = detectConflicts(evidence);
  const limitations: string[] = [];

  const anonymousOnly =
    evidence.length > 0 &&
    evidence.every(
      (e) =>
        (e.isDiscoveryOnly && e.sourceQualityScore < 40) ||
        e.sourceType === "GOOGLE_NEWS_DISCOVERY" ||
        e.sourceType === "DDG_DISCOVERY"
    );

  if (anonymousOnly) {
    limitations.push("Anonymous discovery feeds cannot by themselves prove a claim true.");
  }

  const political = ["POLITICS", "GOVERNANCE", "ELECTIONS", "GOVERNMENT_SCHEMES"].includes(topic);
  const sportsOrScience = ["SPORTS", "SCIENCE", "TECHNOLOGY"].includes(topic);

  const indepSupport = independentSourceCount(highSupport);
  const indepContra = independentSourceCount(highContra);

  let verdict: FactCheckVerdict = "UNVERIFIED";
  let confidence = 35;
  let truthSummary = "Insufficient reliable evidence to verify or falsify this atomic claim. Absence of evidence is not evidence of falsehood.";
  let detailedDebunk =
    "The pipeline compared retrieved evidence against the exact atomic claim (entities, dates, numbers). No adequately matching primary or high-quality secondary evidence established the claim.";

  const allocConflict = conflicts.some((c) => (c.possibleExplanation || "").includes("ALLOCATION"));

  if (highContra.length && highSupport.length && !allocConflict) {
    verdict = "CONFLICTING_EVIDENCE";
    confidence = Math.min(88, 55 + Math.max(indepSupport, indepContra) * 8);
    truthSummary = "Reliable sources disagree about this claim. The first matching article was not treated as decisive.";
    detailedDebunk = conflicts.map((c) => `${c.summary} A: ${c.sourceA} B: ${c.sourceB} ${c.authorityNote} ${c.possibleExplanation || ""}`).join(" ");
  } else if (allocConflict && (highSupport.length || highContra.length)) {
    verdict = "MISLEADING";
    confidence = 72;
    truthSummary = "Sources discuss related fiscal figures, but allocation is not the same as expenditure. Treating them as one fact would be misleading.";
    detailedDebunk = conflicts[0]?.possibleExplanation + " " + conflicts[0]?.summary;
  } else if (highContra.length && primarySupport.length === 0) {
    const top = highContra.sort((a, b) => b.overallEvidenceScore - a.overallEvidenceScore)[0];
    verdict = "FALSE";
    confidence = Math.min(94, 60 + top.sourceQualityScore * 0.3 + indepContra * 6);
    truthSummary = `Reliable evidence contradicts the claim. ${top.publisher} reports: ${top.evidenceSummary}`;
    detailedDebunk = contradicts.map((e) => `${e.publisher}: ${e.evidenceSummary} (${e.whyItMatters})`).join(" ");
  } else if (primarySupport.length >= 1 && contradicts.filter((e) => e.sourceQualityScore >= 80).length === 0) {
    verdict = "VERIFIED_TRUE";
    confidence = Math.min(96, 70 + primarySupport.length * 8 + indepSupport * 4);
    truthSummary = `Primary/official evidence supports the claim. ${primarySupport[0].publisher}: ${primarySupport[0].evidenceSummary}`;
    detailedDebunk = supports.map((e) => `${e.publisher} (${e.publicationDate || "undated"}): ${e.evidenceSummary}`).join(" ");
  } else if (indepSupport >= 2 && highSupport.length >= 2 && contradicts.length === 0 && !anonymousOnly) {
    verdict = "VERIFIED_TRUE";
    confidence = Math.min(88, 58 + indepSupport * 8);
    truthSummary = `Multiple independent high-quality secondary sources support the claim, without a retrieved primary document.`;
    detailedDebunk = "Secondary corroboration is weaker than a primary gazette/order. Confidence is capped without a primary source.";
    limitations.push("No primary official document was successfully retrieved.");
  } else if (
    sportsOrScience &&
    highSupport.length >= 1 &&
    contradicts.length === 0 &&
    !anonymousOnly &&
    !political
  ) {
    verdict = "VERIFIED_TRUE";
    confidence = Math.min(82, 58 + highSupport[0].sourceQualityScore * 0.2 + (wikiSupport.length ? 6 : 0));
    truthSummary = `Named sports/science reporting supports the claim. ${highSupport[0].publisher}: ${highSupport[0].evidenceSummary}`;
    detailedDebunk = supports.map((e) => `${e.publisher}: ${e.evidenceSummary}`).join(" ");
    limitations.push("Confidence is capped without a primary federation/agency document.");
  } else if (sportsOrScience && wikiSupport.length >= 1 && highSupport.length === 0 && contradicts.length === 0 && !political) {
    verdict = "PARTIALLY_TRUE";
    confidence = 58;
    truthSummary = `Wikipedia background states the sports/science fact, but no primary or high-quality secondary outlet was independently retrieved.`;
    detailedDebunk = wikiSupport[0].evidenceSummary;
    limitations.push("Wikipedia cannot independently close a political/government claim and is only supporting context here.");
  } else if (highSupport.length === 1 && contradicts.length === 0 && !anonymousOnly && highSupport[0].sourceTier <= 2) {
    verdict = "PARTIALLY_TRUE";
    confidence = 62;
    truthSummary = "Some high-quality evidence supports part of the claim, but corroboration is limited.";
    detailedDebunk = highSupport[0].evidenceSummary;
    limitations.push("Single-source support is not full independent corroboration.");
  } else if (discoveryOnly.length && supports.length === 0 && contradicts.length === 0) {
    verdict = "UNVERIFIED";
    confidence = Math.min(45, 20 + discoveryOnly.length * 4);
    truthSummary = "News coverage or encyclopedia context discusses the topic but does not verify the specific claim.";
    detailedDebunk = "Google News / Wikipedia / Instant Answers were used only as discovery. Mentioning a claim is not the same as supporting it.";
  }

  if (verdict === "VERIFIED_TRUE" && anonymousOnly) {
    verdict = "UNVERIFIED";
    confidence = 30;
    truthSummary = "Discovery hits were not accepted as verification.";
    limitations.push("Blocked invalid path: anonymous discovery-only sources cannot yield VERIFIED_TRUE.");
  }

  if (political && wikiSupport.length && highSupport.length === 0 && primarySupport.length === 0 && verdict === "VERIFIED_TRUE") {
    verdict = "UNVERIFIED";
    confidence = 32;
    truthSummary = "Wikipedia cannot independently establish a time-sensitive political or government claim.";
  }

  if (usable.length === 0 && evidence.length === 0) {
    verdict = "UNVERIFIED";
    confidence = 20;
    limitations.push("No evidence retrieved. This is not a FALSE verdict.");
  }

  return { verdict, confidenceScore: Math.round(confidence), truthSummary, detailedDebunk, conflicts, limitations };
}

export function aggregateAtomicVerdicts(original: string, parts: AtomicClaimResult[]): VerdictComputation {
  if (parts.length === 1) {
    return {
      verdict: parts[0].verdict,
      confidenceScore: parts[0].confidenceScore,
      truthSummary: parts[0].evidence.length
        ? `Atomic claim: ${parts[0].claim}`
        : "Single atomic claim evaluated.",
      detailedDebunk: "",
      conflicts: [],
      limitations: [],
    };
  }

  const verdicts = parts.map((p) => p.verdict);
  const unique = new Set(verdicts);
  const avgConf = Math.round(parts.reduce((s, p) => s + p.confidenceScore, 0) / parts.length);

  if (unique.size === 1) {
    const v = parts[0].verdict;
    return {
      verdict: v,
      confidenceScore: avgConf,
      truthSummary:
        v === "UNVERIFIED"
          ? "Insufficient reliable evidence to verify or falsify this claim. Absence of evidence is not evidence of falsehood."
          : parts.map((p) => `${p.claim} → ${p.verdict} (${p.confidenceScore})`).join(" "),
      detailedDebunk: parts.map((p) => `${p.claim} → ${p.verdict} (${p.confidenceScore})`).join(" "),
      conflicts: [],
      limitations: [],
    };
  }

  const hasFalse = verdicts.includes("FALSE");
  const hasTrue = verdicts.includes("VERIFIED_TRUE") || verdicts.includes("PARTIALLY_TRUE");
  const hasConflict = verdicts.includes("CONFLICTING_EVIDENCE");

  let verdict: FactCheckVerdict = "MISLEADING";
  if (hasConflict) verdict = "CONFLICTING_EVIDENCE";
  else if (hasTrue && hasFalse) verdict = "MISLEADING";
  else if (hasTrue && verdicts.includes("UNVERIFIED")) verdict = "PARTIALLY_TRUE";
  else if (!hasTrue && !hasFalse) verdict = "UNVERIFIED";

  return {
    verdict,
    confidenceScore: Math.min(avgConf, 80),
    truthSummary: `The prompt contains multiple atomic claims with mixed evidence. Overall verdict ${verdict} does not replace per-claim results.`,
    detailedDebunk: parts.map((p, i) => `${i + 1}. "${p.claim}" → ${p.verdict} (${p.confidenceScore}%).`).join(" "),
    conflicts: [],
    limitations: ["Do not assign one verdict to a compound prompt when atomics differ."],
  };
}
