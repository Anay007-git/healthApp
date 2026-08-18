import { StructuredEvidence } from "@civiclens/types";

export function rankEvidence(items: StructuredEvidence[]): StructuredEvidence[] {
  const withSyndicate = detectSyndication(items);
  return [...withSyndicate].sort((a, b) => b.overallEvidenceScore - a.overallEvidenceScore);
}

export function detectSyndication(items: StructuredEvidence[]): StructuredEvidence[] {
  return items.map((item, idx) => {
    const norm = normalizeHeadline(item.sourceName + " " + item.evidenceSummary);
    const twins = items.filter((other, j) => j !== idx && similar(norm, normalizeHeadline(other.sourceName + " " + other.evidenceSummary)));
    if (twins.length === 0) return item;
    return {
      ...item,
      syndicateGroup: `wire-${hash(norm)}`,
      overallEvidenceScore: Math.max(0, item.overallEvidenceScore - Math.min(20, twins.length * 6)),
    };
  });
}

function normalizeHeadline(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function similar(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const at = new Set(a.split(" ").filter((w) => w.length > 3));
  const bt = b.split(" ").filter((w) => w.length > 3);
  if (at.size === 0) return false;
  const hits = bt.filter((w) => at.has(w)).length;
  return hits / Math.max(at.size, bt.length) >= 0.72;
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export function independentSourceCount(items: StructuredEvidence[]): number {
  const groups = new Set<string>();
  for (const i of items) {
    groups.add(i.syndicateGroup || i.publisher || i.sourceUrl);
  }
  return groups.size;
}
