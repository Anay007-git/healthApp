import { ClaimCategory, InternalClaimTopic } from "@civiclens/types";
import { extractEntities } from "./entities";

interface TopicSignal {
  topic: InternalClaimTopic;
  weight: number;
  patterns: RegExp[];
}

const SIGNALS: TopicSignal[] = [
  { topic: "FINANCE", weight: 3, patterns: [/\brbi\b/, /repo rate/, /\bsebi\b/, /\birdai\b/, /gst/, /upi/, /banknote/, /rupee/] },
  { topic: "ECONOMY", weight: 2, patterns: [/gdp/, /inflation/, /budget/, /fiscal/, /tax/, /crore/, /lakh/] },
  { topic: "ELECTIONS", weight: 3, patterns: [/election/, /\beci\b/, /\bevm\b/, /voter/, /ballot/, /lok sabha poll/] },
  { topic: "COURTS", weight: 3, patterns: [/supreme court/, /high court/, /judgment/, /verdict/, /bench/] },
  { topic: "LEGAL", weight: 2, patterns: [/ban(ned)?/, /act 20\d{2}/, /notified/, /gazette/, /traffic police/, /digilocker/] },
  { topic: "GOVERNMENT_SCHEMES", weight: 3, patterns: [/yojana/, /yojna/, /scheme/, /pm-?kisan/, /ayushman/, /pmay/, /mgnrega/, /jal jeevan/] },
  { topic: "SPORTS", weight: 3, patterns: [/cricket/, /fifa/, /world cup/, /test match/, /\btests?\b/, /ipl/, /olympic/, /football/, /messi/, /kohli/, /wicket/, /retired from test/, /test cricket/] },
  { topic: "SCIENCE", weight: 3, patterns: [/isro/, /nasa/, /chandrayaan/, /satellite/, /vaccine trial/, /peer-reviewed/] },
  { topic: "TECHNOLOGY", weight: 2, patterns: [/\bai\b/, /chatgpt/, /smartphone/, /app store/] },
  { topic: "HEALTH", weight: 3, patterns: [/who /, /covid/, /vaccine/, /hospital/, /lockdown/, /pandemic/, /medical/] },
  { topic: "INTERNATIONAL", weight: 2, patterns: [/united nations/, /treaty/, /ukraine/, /china/, /pakistan/] },
  { topic: "EDUCATION", weight: 2, patterns: [/neet/, /nta/, /ugc/, /exam/, /university/] },
  { topic: "CRIME", weight: 2, patterns: [/arrested/, /fir\b/, /murder/, /scam syndicate/] },
  { topic: "POLITICS", weight: 2, patterns: [/party/, /bjp/, /congress/, /tmc/, /minister resigned/] },
  { topic: "GOVERNANCE", weight: 1.5, patterns: [/government/, /ministry/, /cabinet/, /pib/, /parliament/] },
];

export function classifyClaim(claim: string): InternalClaimTopic {
  const low = claim.toLowerCase();
  const entities = extractEntities(claim);
  const scores = new Map<InternalClaimTopic, number>();

  const bump = (t: InternalClaimTopic, n: number) => scores.set(t, (scores.get(t) || 0) + n);

  for (const org of entities.organizations) {
    if (["RBI", "SEBI", "IRDAI", "TRAI", "GST", "UPI"].includes(org)) bump("FINANCE", 5);
    if (org === "Election Commission of India") bump("ELECTIONS", 6);
    if (org === "Supreme Court of India" || org === "High Court") bump("COURTS", 6);
    if (org === "CAG") bump("GOVERNANCE", 4);
    if (org === "ISRO" || org === "NASA") bump("SCIENCE", 6);
    if (org === "WHO") bump("HEALTH", 5);
    if (org === "FIFA" || org === "ICC") bump("SPORTS", 6);
    if (org === "PIB" || org === "Parliament of India" || org === "Lok Sabha") bump("GOVERNANCE", 3);
  }
  if (entities.schemes.length) bump("GOVERNMENT_SCHEMES", 5);
  if (entities.people.some((p) => /kohli|rohit|messi/i.test(p)) && /\b(test|odi|t20|cricket|retired|retire)\b/i.test(low)) {
    bump("SPORTS", 5);
  }

  for (const s of SIGNALS) {
    for (const p of s.patterns) {
      if (p.test(low)) bump(s.topic, s.weight);
    }
  }

  let best: InternalClaimTopic = "GENERAL";
  let bestScore = 0;
  for (const [topic, score] of scores) {
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

export function toClaimCategory(topic: InternalClaimTopic, claimText = ""): ClaimCategory {
  if (/\bcag\b/i.test(claimText)) return "CAG_CORRUPTION";
  switch (topic) {
    case "ELECTIONS":
      return "ELECTIONS";
    case "ECONOMY":
    case "FINANCE":
      return "ECONOMY";
    case "HEALTH":
      return "HEALTH";
    case "SCIENCE":
    case "TECHNOLOGY":
      return "SCIENCE_TECH";
    case "SPORTS":
      return "SPORTS";
    case "LEGAL":
    case "COURTS":
      return "LEGAL";
    case "GOVERNMENT_SCHEMES":
      return "SCHEMES";
    case "INTERNATIONAL":
      return "WORLD_NEWS";
    case "GOVERNANCE":
    case "POLITICS":
    case "EDUCATION":
      return "GOVERNANCE";
    default:
      return "GENERAL";
  }
}

export function isTimeSensitive(topic: InternalClaimTopic): boolean {
  return ["POLITICS", "ELECTIONS", "SPORTS", "GOVERNANCE", "FINANCE", "GOVERNMENT_SCHEMES", "CRIME"].includes(topic);
}
