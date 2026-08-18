import { EvidenceConflict, StructuredEvidence } from "@civiclens/types";
import { isAllocationLanguage, isExpenditureLanguage } from "./numbers";

export function detectConflicts(items: StructuredEvidence[]): EvidenceConflict[] {
  const supports = items.filter((e) => e.stance === "SUPPORTS");
  const contradicts = items.filter((e) => e.stance === "CONTRADICTS");
  if (supports.length === 0 || contradicts.length === 0) return [];

  const a = [...supports].sort((x, y) => y.sourceQualityScore - x.sourceQualityScore)[0];
  const b = [...contradicts].sort((x, y) => y.sourceQualityScore - x.sourceQualityScore)[0];

  const allocSpend =
    (isAllocationLanguage(a.evidenceText) && isExpenditureLanguage(b.evidenceText)) ||
    (isExpenditureLanguage(a.evidenceText) && isAllocationLanguage(b.evidenceText));

  return [
    {
      summary: allocSpend
        ? "Sources report different fiscal concepts (allocation vs expenditure), which is not necessarily a contradiction."
        : "Independent sources disagree about the same atomic claim.",
      sourceA: `${a.publisher}: ${a.evidenceSummary.slice(0, 220)}`,
      sourceB: `${b.publisher}: ${b.evidenceSummary.slice(0, 220)}`,
      authorityNote:
        a.sourceQualityScore === b.sourceQualityScore
          ? "Sources have similar authority; do not pick the first result."
          : `${a.sourceQualityScore >= b.sourceQualityScore ? a.publisher : b.publisher} has higher source-quality (authority), not automatically higher truth.`,
      possibleExplanation: allocSpend
        ? "ALLOCATION ≠ EXPENDITURE. Budgeted outlay and audited spend are different facts."
        : "Difference may reflect dates, methodology, preliminary vs final figures, or definitions.",
    },
  ];
}
