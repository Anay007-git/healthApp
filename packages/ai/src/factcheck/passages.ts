import { extractEntities } from "./entities";
import { stripMarkup } from "./sanitize";

const CHROME =
  /\b(jump to content|main menu|personal tools|create account|log in|enable accessible|contents move to sidebar|toggle .* subsection)\b/i;

function windowAround(text: string, size = 700): string {
  const needles = [
    /retir(?:ed|es|ement)\s+from(?:\s+the)?\s+test/i,
    /test\s+retirement/i,
    /retir(?:ed|es|ement)\s+from(?:\s+the)?\s+t20/i,
    /retir(?:ed|es|ement)\s+from(?:\s+the)?\s+odi/i,
    /\b(?:retired|retirement|retires)\b/i,
  ];
  for (const re of needles) {
    const m = re.exec(text);
    if (!m) continue;
    const start = Math.max(0, m.index - 180);
    return text.slice(start, start + size).trim();
  }
  return text.slice(0, size);
}

/** Pull sentences from a large page that actually overlap the claim. */
export function extractClaimRelevantPassages(raw: string, claim: string, maxChars = 2800): string {
  const text = stripMarkup(raw, 400_000);
  if (!text) return "";

  const ents = extractEntities(claim);
  const people = ents.people.map((p) => p.toLowerCase());
  const tokens = ents.distinctiveTokens.filter((t) => t.length > 3);

  const chunks = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20 && !CHROME.test(s));
  const scored = chunks.map((s, i) => {
    const low = s.toLowerCase();
    let score = 0;
    for (const p of people) {
      if (low.includes(p)) score += 5;
    }
    for (const t of tokens) {
      if (low.includes(t)) score += 1;
    }
    if (/\bretir/.test(low)) score += 6;
    if (/\b(test cricket|t20i|odi|announc|confirm|officially)\b/.test(low)) score += 2;
    if (CHROME.test(low)) score -= 25;
    return { s, score, i };
  });

  const kept = scored.filter((x) => x.score >= 6).sort((a, b) => b.score - a.score || a.i - b.i);
  if (!kept.length) {
    if (/\bretir/.test(text.toLowerCase())) return windowAround(text, maxChars);
    return "";
  }

  const ordered = kept.sort((a, b) => a.i - b.i);
  let out = "";
  for (const k of ordered) {
    const piece = k.s.length > 900 ? windowAround(k.s, 900) : k.s;
    if (CHROME.test(piece) && !/\bretir/.test(piece.toLowerCase())) continue;
    if (out.length + piece.length + 1 > maxChars) break;
    out += (out ? " " : "") + piece;
  }
  return out || windowAround(text, maxChars);
}
