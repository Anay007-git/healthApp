import { LinguisticSignal } from "@civiclens/types";

export function detectLinguisticSignals(text: string): {
  signalsDetected: LinguisticSignal[];
  redFlagPhrases: string[];
  sensationalismScore: number;
  phishingSuspected: boolean;
} {
  const signalsDetected: LinguisticSignal[] = [];
  const redFlagPhrases: string[] = [];

  const urgencyPatterns = [
    { pattern: /(?:forward|share)\s+(?:to|with)\s+(?:\d+|all|family|groups)/i, phrase: "Forward-to-others demand", exp: "Viral chain-forward mechanism designed to induce rapid unverified sharing." },
    { pattern: /(?:before|by)\s+(?:midnight|today|tomorrow|31st|exhausted|deleted)/i, phrase: "Artificial deadline urgency", exp: "Creates false FOMO / panic to prevent critical thinking." },
    { pattern: /(?:breaking|urgent|secret|confidential|must read|alert)/i, phrase: "Sensationalist Breaking Alert", exp: "Uses clickbait shock-value keywords to exaggerate importance." },
  ];

  urgencyPatterns.forEach((u) => {
    if (u.pattern.test(text)) {
      signalsDetected.push({ type: "URGENCY", phrase: u.phrase, weight: 0.85, explanation: u.exp });
      const match = text.match(u.pattern);
      if (match) redFlagPhrases.push(match[0]);
    }
  });

  const authorityPatterns = [
    { pattern: /(?:nasa\s+satellite|nasa\s+confirmed|who\s+declared|unesco\s+best|bbc\s+breaking|unreleased\s+circular|secret\s+order)/i, phrase: "Fabricated Institutional Authority", exp: "Attributing bogus claims to NASA, WHO, or UNESCO is a classic misinformation motif." },
    { pattern: /(?:supreme\s+court\s+ordered|rbi\s+banned|cag\s+exposed|cabinet\s+secretly)/i, phrase: "Misrepresented Constitutional Body", exp: "Invoking high constitutional bodies without gazette citations." },
  ];

  authorityPatterns.forEach((a) => {
    if (a.pattern.test(text)) {
      signalsDetected.push({ type: "AUTHORITY_FABRICATION", phrase: a.phrase, weight: 0.9, explanation: a.exp });
      const match = text.match(a.pattern);
      if (match) redFlagPhrases.push(match[0]);
    }
  });

  const scamLinkPattern = /(?:bit\.ly|tinyurl\.com|t\.me|\.xyz|\.apk|\.top|\.online|\.buzz|free-[\w-]+\.[\w]+|pm-[\w-]+\.online)/i;
  let phishingSuspected = false;
  if (scamLinkPattern.test(text)) {
    phishingSuspected = true;
    signalsDetected.push({
      type: "SCAM_LINK",
      phrase: "Suspicious Non-Government Domain / Shortlink",
      weight: 0.98,
      explanation: "Official Indian government schemes operate under .gov.in or .nic.in domains. Third-party shortlinks claiming official payouts are typically phishing.",
    });
    const match = text.match(scamLinkPattern);
    if (match) redFlagPhrases.push(match[0]);
  }

  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const totalLetters = (text.match(/[a-zA-Z]/g) || []).length;
  const exclamationCount = (text.match(/!/g) || []).length;
  if ((totalLetters > 20 && capsCount / totalLetters > 0.4) || exclamationCount >= 3) {
    signalsDetected.push({
      type: "EMOTIONAL_BAIT",
      phrase: "High Emotional Aggression / All-Caps",
      weight: 0.7,
      explanation: "Excessive capitalization and exclamation points are strong markers of sensationalist viral forwards.",
    });
  }

  const sensationalismScore = Math.min(
    98,
    Math.round(signalsDetected.reduce((acc, s) => acc + s.weight * 30, 8) + exclamationCount * 5)
  );

  return { signalsDetected, redFlagPhrases, sensationalismScore, phishingSuspected };
}
