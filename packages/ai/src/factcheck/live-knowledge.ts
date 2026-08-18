import { ClaimCategory } from "@civiclens/types";

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

/**
 * Discovery-only live search. Google News, Wikipedia, and DuckDuckGo
 * are never treated as proof that a claim is true.
 */
export async function fetchLiveKnowledge(query: string): Promise<LiveKnowledgeResult | null> {
  const cleanQ = query.replace(/[^\w\s-]/gi, " ").trim();
  if (!cleanQ || cleanQ.length < 3) return null;

  const [news, wiki, ddg] = await Promise.all([fetchGoogleNews(cleanQ), fetchWikipedia(cleanQ), fetchDuckDuckGo(cleanQ)]);
  if (!news && !wiki && !ddg) return null;

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
  return news || wiki || ddg;
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
    const items: LiveNewsArticle[] = [];
    const itemRegex =
      /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?(?:<source[^>]*>(.*?)<\/source>)?[\s\S]*?<\/item>/gi;
    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      items.push({
        title: decodeXml(match[1]),
        link: decodeXml(match[2]),
        pubDate: decodeXml(match[3]),
        source: decodeXml(match[4] || "News Media"),
      });
    }
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

async function fetchWikipedia(cleanQ: string): Promise<LiveKnowledgeResult | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQ)}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "CivicLensFactChecker/2.0 (https://civiclens.in; research@civiclens.in)" },
      signal: AbortSignal.timeout(3500),
    });
    if (!searchRes.ok) return null;
    const searchData = (await searchRes.json()) as { query?: { search?: Array<{ title: string }> } };
    const results = searchData?.query?.search || [];
    if (!results.length) return null;
    const pageTitle = results[0].title;
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summaryRes = await fetch(summaryUrl, {
      headers: { "User-Agent": "CivicLensFactChecker/2.0 (https://civiclens.in; research@civiclens.in)" },
      signal: AbortSignal.timeout(3500),
    });
    if (!summaryRes.ok) return null;
    const summaryData = (await summaryRes.json()) as {
      title?: string;
      extract?: string;
      content_urls?: { desktop?: { page?: string } };
    };
    if (!summaryData?.extract) return null;
    return {
      title: summaryData.title || pageTitle,
      extract: `Wikipedia background context (not independent verification of time-sensitive claims): ${summaryData.extract}`,
      sourceUrl: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
      sourceLabel: `Wikipedia (background): ${summaryData.title || pageTitle}`,
      category: "GENERAL",
      channel: "WIKIPEDIA",
      isDiscoveryOnly: true,
    };
  } catch {
    return null;
  }
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
