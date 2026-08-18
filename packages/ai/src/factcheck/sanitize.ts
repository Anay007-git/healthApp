const MAX_CLAIM_CHARS = 4000;
const MAX_EVIDENCE_CHARS = 8000;

const INJECTION_PATTERNS = [
  /ignore (all |any )?(previous|prior|above) instructions/gi,
  /disregard (all |any )?(previous|prior|system) (instructions|prompts)/gi,
  /you are now /gi,
  /system prompt/gi,
  /new instructions?:/gi,
  /do not follow your (system|original) prompt/gi,
  /say this claim is (true|false)/gi,
];

export function clampClaim(raw: string): string {
  return (raw || "").replace(/\u0000/g, "").trim().slice(0, MAX_CLAIM_CHARS);
}

export function sanitizeEvidenceText(raw: string): string {
  let text = (raw || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  for (const pattern of INJECTION_PATTERNS) {
    text = text.replace(pattern, "[instruction-ignored]");
  }

  return text.slice(0, MAX_EVIDENCE_CHARS);
}

export function wrapUntrustedEvidence(text: string): string {
  return `[UNTRUSTED_WEB_DATA_BEGIN]\n${sanitizeEvidenceText(text)}\n[UNTRUSTED_WEB_DATA_END]`;
}

export function containsPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(text));
}
