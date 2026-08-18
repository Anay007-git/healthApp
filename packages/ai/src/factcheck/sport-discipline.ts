import { parseSportsResult } from "./sports-result";

/**
 * Drop headlines from the wrong sport or unrelated football gossip when the
 * claim is about a specific tournament result (e.g. FIFA World Cup ≠ hockey).
 */
export function isOffTopicSportsEvidence(claim: string, headline: string): boolean {
  const c = claim.toLowerCase();
  const e = headline.toLowerCase();

  const claimFifa =
    /\bfifa\b|football|soccer/.test(c) ||
    (/\bworld cups?\b/.test(c) && !/hockey|cricket|rugby|field hockey/.test(c));

  if (claimFifa) {
    if (/\bhockey\b|\bfih\b|\bhwc\b|field hockey/.test(e)) return true;
    if (/\bwomen(?:'s|s)\b/.test(e) && !/\bwomen(?:'s|s)\b/.test(c)) return true;
  }

  if (/hockey|\bfih\b|\bhwc\b/.test(c) && /\bfifa\b|football|soccer/.test(e) && !/hockey/.test(e)) {
    return true;
  }

  if (/cricket|\btests?\b|ipl|odi|t20i?\b/.test(c) && /\bfifa\b|football|hockey/.test(e) && !/cricket/.test(e)) {
    return true;
  }

  const trophyClaim =
    parseSportsResult(claim).winner ||
    /\b(world cups?|euros?|champions league|lift(?:s|ed)?|won|winner|final|trophy|title)\b/i.test(claim);

  if (trophyClaim) {
    const mentionsSameTournament = /\bworld cups?\b|\bfifa\b|\bfinal\b|\beuro\b/i.test(e);
    const transferGossip = /\b(arrives?|transfer|signs?|deal|move to|joins)\b/i.test(e);
    if (transferGossip && !mentionsSameTournament) return true;
    if (claimFifa && !mentionsSameTournament && !parseSportsResult(headline).winner) {
      const teamInClaim = parseSportsResult(claim).winner?.toLowerCase();
      if (teamInClaim && !e.includes(teamInClaim) && !/\bworld cups?\b|\bfifa\b/.test(e)) return true;
    }
  }

  return false;
}
