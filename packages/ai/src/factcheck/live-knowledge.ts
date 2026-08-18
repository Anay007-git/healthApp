import { ClaimCategory } from "@civiclens/types";
import { canonicalPersonNames, expandSearchQueries } from "./query-expansion";

export interface LiveNewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface LiveKnowledgeResult {
  title: string;
  extract: string;
  sourceUrl: string;
  sourceLabel: string;
  publicationDate?: string;
  category: ClaimCategory;
  recentArticles?: LiveNewsArticle[];
  channel: "GOOGLE_NEWS" | "WIKIPEDIA" | "DUCKDUCKGO";
  isDiscoveryOnly: true;
  wikiTitle?: string;
  wikiExtract?: string;
  wikiUrl?: string;
}

function decodeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function field(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decodeXml(m[1]).trim() : "";
}

export function parseGoogleNewsRss(xml: string): LiveNewsArticle[] {
  const items: LiveNewsArticle[] = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null && items.length < 8) {
    const block = match[1];
    const title = field(block, "title");
    if (!title) continue;
    const sourceTag = field(block, "source");
    const fromTitle = title.split(/\s+[-|]\s+/).pop()?.trim() || "";
    items.push({
      title,
      link: field(block, "link"),
      pubDate: field(block, "pubDate"),
      source: sourceTag || fromTitle || "News Media",
    });
  }
  return items;
}

const WIKI_UA = { "User-Agent": "CivicLensFactChecker/2.0 (https://civiclens.in; research@civiclens.in)" };

/**
 * Discovery-only live search. Google News, Wikipedia, and DuckDuckGo
 * are never treated as proof that a claim is true by channel alone.
 */
export async function fetchLiveKnowledge(query: string): Promise<LiveKnowledgeResult | null> {
  const queries = expandSearchQueries(query);
  const cleanQ = queries[0] || query.replace(/[^\w\s-]/gi, " ").trim();
  if (!cleanQ || cleanQ.length < 3) return null;

  const newsQueries = queries.slice(0, 2);
  const [newsSettled, wiki] = await Promise.all([
    Promise.all(newsQueries.map((q) => fetchGoogleNews(q))),
    fetchWikipedia(query, queries),
  ]);

  const news = mergeNews(newsSettled.filter(Boolean) as LiveKnowledgeResult[]);
  if (!news && !wiki) return null;

  if (news && wiki) {
    return {
      ...news,
      extract: `${news.extract}\n\n${wiki.extract}`,
      title: news.title,
      wikiTitle: wiki.title,
      wikiExtract: wiki.extract,
      wikiUrl: wiki.sourceUrl,
    };
  }
  return news || wiki;
}

function mergeNews(results: LiveKnowledgeResult[]): LiveKnowledgeResult | null {
  if (!results.length) return null;
  const seen = new Set<string>();
  const items: LiveNewsArticle[] = [];
  for (const r of results) {
    for (const art of r.recentArticles || []) {
      const k = art.title.toLowerCase().slice(0, 80);
      if (seen.has(k)) continue;
      seen.add(k);
      items.push(art);
    }
  }
  if (!items.length) return results[0];
  const top = items[0];
  const bullets = items
    .slice(0, 8)
    .map(
      (it) =>
        `• ${it.source} (${it.pubDate ? new Date(it.pubDate).toISOString().split("T")[0] : "undated"}): "${it.title}"`
    )
    .join("\n");
  return {
    ...results[0],
    title: top.title,
    sourceUrl: top.link,
    sourceLabel: `${top.source} (via Google News discovery)`,
    publicationDate: top.pubDate ? new Date(top.pubDate).toISOString().split("T")[0] : undefined,
    extract: `Google News discovery (not verification):\n${bullets}`,
    recentArticles: items.slice(0, 8),
  };
}

async function fetchGoogleNews(cleanQ: string): Promise<LiveKnowledgeResult | null> {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(cleanQ)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const newsRes = await fetch(rssUrl, {
      headers: {
        "User-Agent": "CivicLensFactChecker/2.0 (discovery-only; research@civiclens.in)",
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!newsRes.ok) return null;
    const xml = await newsRes.text();
    const items = parseGoogleNewsRss(xml);
    if (items.length === 0) return null;
    const topItem = items[0];
    const dateStr = topItem.pubDate
      ? new Date(topItem.pubDate).toISOString().split("T")[0]
      : undefined;
    const bullets = items
      .map(
        (it) =>
          `• ${it.source} (${it.pubDate ? new Date(it.pubDate).toISOString().split("T")[0] : "undated"}): "${it.title}"`
      )
      .join("\n");
    return {
      title: topItem.title,
      extract: `Google News discovery (not verification):\n${bullets}`,
      sourceUrl: topItem.link,
      sourceLabel: `${topItem.source} (via Google News discovery)`,
      publicationDate: dateStr,
      category: "GENERAL",
      recentArticles: items,
      channel: "GOOGLE_NEWS",
      isDiscoveryOnly: true,
    };
  } catch {
    return null;
  }
}

async function fetchWikipedia(originalClaim: string, queries: string[]): Promise<LiveKnowledgeResult | null> {
  try {
    const searchHits = await wikipediaSearch(queries[0] || originalClaim);
    const pageTitle = pickWikipediaTitle(searchHits, originalClaim) || (await findWikipediaTitle(queries, originalClaim));
    if (!pageTitle && !searchHits.length) return null;

    const snippets = searchHits
      .map((h) => h.snippet.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
      .filter((s) => s.length > 40)
      .slice(0, 3)
      .join(" ");

    let summaryExtract = "";
    let canonicalUrl = pageTitle
      ? `https://en.wikipedia.org/wiki/${encodeURIComponent((pageTitle || "").replace(/ /g, "_"))}`
      : "https://en.wikipedia.org";
    let title = pageTitle || originalClaim;
    if (pageTitle) {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
      const summaryRes = await fetch(summaryUrl, { headers: WIKI_UA, signal: AbortSignal.timeout(3000) });
      if (summaryRes.ok) {
        const summaryData = (await summaryRes.json()) as {
          title?: string;
          extract?: string;
          content_urls?: { desktop?: { page?: string } };
        };
        summaryExtract = summaryData?.extract || "";
        title = summaryData.title || pageTitle;
        canonicalUrl = summaryData.content_urls?.desktop?.page || canonicalUrl;
      }
    }

    const combined = [snippets, summaryExtract].filter(Boolean).join(" ");
    if (!combined) return null;

    return {
      title,
      extract: combined.slice(0, 3500),
      sourceUrl: canonicalUrl,
      sourceLabel: `Wikipedia (background): ${title}`,
      category: "GENERAL",
      channel: "WIKIPEDIA",
      isDiscoveryOnly: true,
    };
  } catch {
    return null;
  }
}

async function wikipediaSearch(q: string): Promise<Array<{ title: string; snippet: string }>> {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&srsearch=${encodeURIComponent(q)}&utf8=&format=json&origin=*`;
  const searchRes = await fetch(searchUrl, { headers: WIKI_UA, signal: AbortSignal.timeout(3000) });
  if (!searchRes.ok) return [];
  const searchData = (await searchRes.json()) as {
    query?: { search?: Array<{ title: string; snippet?: string }> };
  };
  return (searchData?.query?.search || []).map((r) => ({ title: r.title, snippet: r.snippet || "" }));
}

function pickWikipediaTitle(hits: Array<{ title: string }>, originalClaim: string): string | null {
  const preferred = canonicalPersonNames(originalClaim).map((n) => n.toLowerCase());
  const named = hits.find((r) => preferred.some((p) => r.title.toLowerCase().includes(p)));
  return (named || hits[0])?.title || null;
}

async function findWikipediaTitle(queries: string[], originalClaim: string): Promise<string | null> {
  const preferred = canonicalPersonNames(originalClaim).map((n) => n.toLowerCase());
  for (const q of queries) {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, { headers: WIKI_UA, signal: AbortSignal.timeout(3500) });
    if (!searchRes.ok) continue;
    const searchData = (await searchRes.json()) as { query?: { search?: Array<{ title: string }> } };
    const results = searchData?.query?.search || [];
    if (!results.length) continue;
    const named = results.find((r) => preferred.some((p) => r.title.toLowerCase().includes(p)));
    return (named || results[0]).title;
  }
  return null;
}

async function fetchDuckDuckGo(cleanQ: string): Promise<LiveKnowledgeResult | null> {
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQ)}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl, { signal: AbortSignal.timeout(2500) });
    if (!ddgRes.ok) return null;
    const ddgData = (await ddgRes.json()) as {
      AbstractText?: string;
      Heading?: string;
      AbstractURL?: string;
      AbstractSource?: string;
    };
    if (!ddgData?.AbstractText && !ddgData?.Heading) return null;
    return {
      title: ddgData.Heading || cleanQ,
      extract: `DuckDuckGo Instant Answer (discovery only, not verification): ${ddgData.AbstractText || ddgData.Heading}`,
      sourceUrl: ddgData.AbstractURL || "https://duckduckgo.com",
      sourceLabel: `${ddgData.AbstractSource || "DuckDuckGo"} (discovery)`,
      category: "GENERAL",
      channel: "DUCKDUCKGO",
      isDiscoveryOnly: true,
    };
  } catch {
    return null;
  }
}
