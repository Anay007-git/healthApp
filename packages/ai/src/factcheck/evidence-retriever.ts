import { StructuredEvidence } from "@civiclens/types";
import { fetchLiveKnowledge } from "./live-knowledge";
import { planSources } from "./source-planner";
import { classifySource } from "./source-quality";
import { fetchSafeText } from "./ssrf";
import { sanitizeEvidenceText } from "./sanitize";
import { cacheGet, cacheSet, ttlForTopic } from "./cache";
import { db } from "@civiclens/database";

export type EvidenceRetriever = (claim: string, topic: string) => Promise<StructuredEvidence[]>;

function baseEvidence(
  partial: Partial<StructuredEvidence> &
    Pick<StructuredEvidence, "id" | "atomicClaim" | "sourceName" | "sourceUrl" | "publisher" | "evidenceText">
): StructuredEvidence {
  const meta = classifySource(partial.sourceUrl, partial.publisher);
  const tier = partial.sourceTier ?? meta.tier;
  const quality = partial.sourceQualityScore ?? meta.quality;
  const text = sanitizeEvidenceText(partial.evidenceText);
  return {
    ...partial,
    retrievedAt: partial.retrievedAt || new Date().toISOString(),
    evidenceSummary: partial.evidenceSummary || text.slice(0, 280),
    supportsClaim: false,
    contradictsClaim: false,
    stance: "INSUFFICIENT",
    relevanceScore: 0,
    temporalMatchScore: 50,
    entityMatchScore: 50,
    numericMatchScore: 50,
    overallEvidenceScore: 0,
    publicationDate: partial.publicationDate,
    eventDate: partial.eventDate,
    isDiscoveryOnly: partial.isDiscoveryOnly,
    whyItMatters: partial.whyItMatters,
    evidenceText: text,
    sourceTier: tier,
    sourceQualityScore: quality,
    sourceType: partial.sourceType ?? meta.type,
  };
}

export const defaultEvidenceRetriever: EvidenceRetriever = async (claim, topic) => {
  const key = `ev:${topic}:${claim.toLowerCase().slice(0, 180)}`;
  const cached = cacheGet<StructuredEvidence[]>(key);
  if (cached) return cached;

  const planned = planSources(claim, topic);

  const primaryP = Promise.all(
    planned
      .filter((p) => p.tier === 1)
      .slice(0, 3)
      .map(async (p) => {
        const html = await fetchSafeText(p.homepage, 4000);
        if (!html) return null;
        const text = sanitizeEvidenceText(html);
        if (text.length < 40) return null;
        return baseEvidence({
          id: `primary-${p.name}`,
          atomicClaim: claim,
          sourceName: p.name,
          sourceUrl: p.homepage,
          publisher: p.publisher,
          sourceTier: 1,
          sourceType: p.sourceType,
          sourceQualityScore: 94,
          evidenceText: text.slice(0, 4000),
          evidenceSummary: text.slice(0, 280),
          whyItMatters: `Primary/official source (${p.name}) selected by dynamic source routing.`,
        });
      })
  );

  const discoveryP = (async () => {
    const live = await fetchLiveKnowledge(claim);
    if (!live) return [] as StructuredEvidence[];
    const items: StructuredEvidence[] = [];
    if (live.recentArticles?.length) {
      for (const [idx, art] of live.recentArticles.slice(0, 5).entries()) {
        const meta = classifySource(art.link, art.source);
        const knownOutlet = meta.tier <= 2;
        items.push(
          baseEvidence({
            id: `gn-${idx}-${art.source}`,
            atomicClaim: claim,
            sourceName: art.title,
            sourceUrl: art.link,
            publisher: art.source,
            publicationDate: art.pubDate ? safeDate(art.pubDate) : undefined,
            sourceTier: meta.tier,
            sourceType: meta.type,
            sourceQualityScore: meta.quality,
            evidenceText: art.title,
            evidenceSummary: art.title,
            isDiscoveryOnly: !knownOutlet,
            whyItMatters: knownOutlet
              ? `${art.source} was found via Google News discovery, then scored as a named publisher. The headline is compared to the claim; coverage alone is not proof.`
              : "Google News is a discovery channel. An unknown outlet mentioning the topic does not prove the claim is true.",
          })
        );
      }
    }
    if (live.wikiExtract || live.channel === "WIKIPEDIA") {
      const extract = live.wikiExtract || live.extract;
      items.push(
        baseEvidence({
          id: "wiki-background",
          atomicClaim: claim,
          sourceName: live.wikiTitle || live.title,
          sourceUrl: live.wikiUrl || live.sourceUrl,
          publisher: "Wikipedia",
          sourceTier: 4,
          sourceType: "WIKIPEDIA_CONTEXT",
          sourceQualityScore: 50,
          evidenceText: extract,
          evidenceSummary: extract.slice(0, 280),
          isDiscoveryOnly: false,
          whyItMatters:
            "Wikipedia is background context. It may support stable sports/science records if the extract states the fact, but cannot independently verify time-sensitive political/government claims.",
        })
      );
    } else if (!live.recentArticles?.length) {
      items.push(
        baseEvidence({
          id: `live-${live.channel}`,
          atomicClaim: claim,
          sourceName: live.title,
          sourceUrl: live.sourceUrl,
          publisher: live.sourceLabel,
          publicationDate: live.publicationDate,
          sourceTier: 4,
          sourceQualityScore: 18,
          evidenceText: live.extract,
          evidenceSummary: live.extract.slice(0, 280),
          isDiscoveryOnly: true,
          whyItMatters: "DuckDuckGo Instant Answer is discovery only, not verification.",
        })
      );
    }
    return items;
  })();

  const civicP = Promise.resolve().then(() => {
    const hits = db.search(claim);
    const items: StructuredEvidence[] = [];
    for (const scheme of hits.schemes.slice(0, 2)) {
      items.push(
        baseEvidence({
          id: `db-scheme-${scheme.id}`,
          atomicClaim: claim,
          sourceName: scheme.name,
          sourceUrl: "https://indiabudget.gov.in",
          publisher: scheme.ministry,
          sourceTier: 1,
          sourceQualityScore: 90,
          evidenceText: `${scheme.name} (${scheme.ministry}): budget allocated ₹${scheme.budgetAllocatedCr} crore; expenditure ₹${scheme.expenditureCr} crore; ${scheme.summary}. CAG verdict ${scheme.cagVerdict}.`,
          evidenceSummary: scheme.summary,
          whyItMatters:
            "CivicLens scheme registry (budget/CAG seeds). Compared to the atomic claim; not assumed to verify unrelated statements.",
        })
      );
    }
    for (const cag of hits.cag.slice(0, 2)) {
      items.push(
        baseEvidence({
          id: `db-cag-${cag.id}`,
          atomicClaim: claim,
          sourceName: cag.title,
          sourceUrl: cag.documentUrl || "https://cag.gov.in",
          publisher: "CAG",
          sourceTier: 1,
          sourceQualityScore: 95,
          evidenceText: `${cag.title}. ${(cag.findings || []).map((f) => f.findingSummary).join(" ")} Total flagged impact ₹${cag.totalLossCr} crore.`,
          evidenceSummary: cag.title,
          whyItMatters: "CAG audit records are primary for expenditure/irregularity claims. Allocation ≠ expenditure.",
        })
      );
    }
    return items;
  });

  const settled = await Promise.allSettled([primaryP, discoveryP, civicP]);
  const collected: StructuredEvidence[] = [];
  for (const s of settled) {
    if (s.status !== "fulfilled") continue;
    const val = s.value;
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item) collected.push(item);
      }
    }
  }

  const unique = dedupe(collected);
  cacheSet(key, unique, ttlForTopic(topic));
  return unique;
};

function safeDate(raw: string): string | undefined {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
}

function dedupe(items: StructuredEvidence[]): StructuredEvidence[] {
  const seen = new Set<string>();
  const out: StructuredEvidence[] = [];
  for (const i of items) {
    const k = `${i.sourceUrl}|${i.evidenceSummary.slice(0, 80)}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  return out;
}
