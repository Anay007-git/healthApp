import { SourceTier } from "@civiclens/types";

export interface PlannedSource {
  name: string;
  publisher: string;
  homepage: string;
  searchUrl: string;
  tier: SourceTier;
  sourceType: string;
}

const PIB: PlannedSource = {
  name: "Press Information Bureau",
  publisher: "Government of India",
  homepage: "https://pib.gov.in",
  searchUrl: "https://pib.gov.in/SearchAll.aspx",
  tier: 1,
  sourceType: "PIB_RELEASE",
};

const RBI: PlannedSource = {
  name: "Reserve Bank of India",
  publisher: "RBI",
  homepage: "https://www.rbi.org.in",
  searchUrl: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
  tier: 1,
  sourceType: "GOVERNMENT_REPORT",
};

const ECI: PlannedSource = {
  name: "Election Commission of India",
  publisher: "ECI",
  homepage: "https://www.eci.gov.in",
  searchUrl: "https://www.eci.gov.in",
  tier: 1,
  sourceType: "ECI_AFFIDAVIT",
};

const SCI: PlannedSource = {
  name: "Supreme Court of India",
  publisher: "Supreme Court of India",
  homepage: "https://www.sci.gov.in",
  searchUrl: "https://www.sci.gov.in",
  tier: 1,
  sourceType: "GOVERNMENT_REPORT",
};

const CAG: PlannedSource = {
  name: "Comptroller and Auditor General of India",
  publisher: "CAG",
  homepage: "https://cag.gov.in",
  searchUrl: "https://cag.gov.in",
  tier: 1,
  sourceType: "CAG_AUDIT",
};

const ISRO: PlannedSource = {
  name: "ISRO",
  publisher: "Department of Space",
  homepage: "https://www.isro.gov.in",
  searchUrl: "https://www.isro.gov.in",
  tier: 1,
  sourceType: "GOVERNMENT_REPORT",
};

const NASA: PlannedSource = {
  name: "NASA",
  publisher: "NASA",
  homepage: "https://www.nasa.gov",
  searchUrl: "https://www.nasa.gov",
  tier: 1,
  sourceType: "GOVERNMENT_REPORT",
};

const WHO: PlannedSource = {
  name: "World Health Organization",
  publisher: "WHO",
  homepage: "https://www.who.int",
  searchUrl: "https://www.who.int",
  tier: 1,
  sourceType: "GOVERNMENT_REPORT",
};

const FIFA: PlannedSource = {
  name: "FIFA",
  publisher: "FIFA",
  homepage: "https://www.fifa.com",
  searchUrl: "https://www.fifa.com",
  tier: 1,
  sourceType: "GOVERNMENT_REPORT",
};

const ICC: PlannedSource = {
  name: "ICC",
  publisher: "International Cricket Council",
  homepage: "https://www.icc-cricket.com",
  searchUrl: "https://www.icc-cricket.com",
  tier: 1,
  sourceType: "GOVERNMENT_REPORT",
};

const TIER2: PlannedSource[] = [
  { name: "Reuters", publisher: "Reuters", homepage: "https://www.reuters.com", searchUrl: "https://www.reuters.com", tier: 2, sourceType: "INDEPENDENT_RESEARCH" },
  { name: "Associated Press", publisher: "AP", homepage: "https://apnews.com", searchUrl: "https://apnews.com", tier: 2, sourceType: "INDEPENDENT_RESEARCH" },
  { name: "BBC", publisher: "BBC", homepage: "https://www.bbc.com", searchUrl: "https://www.bbc.com", tier: 2, sourceType: "INDEPENDENT_RESEARCH" },
  { name: "The Hindu", publisher: "The Hindu", homepage: "https://www.thehindu.com", searchUrl: "https://www.thehindu.com", tier: 2, sourceType: "INDEPENDENT_RESEARCH" },
  { name: "Indian Express", publisher: "Indian Express", homepage: "https://indianexpress.com", searchUrl: "https://indianexpress.com", tier: 2, sourceType: "INDEPENDENT_RESEARCH" },
];

const TIER3: PlannedSource[] = [
  { name: "Alt News", publisher: "Alt News", homepage: "https://www.altnews.in", searchUrl: "https://www.altnews.in", tier: 3, sourceType: "INDEPENDENT_RESEARCH" },
  { name: "BOOM", publisher: "BOOM Live", homepage: "https://www.boomlive.in", searchUrl: "https://www.boomlive.in", tier: 3, sourceType: "INDEPENDENT_RESEARCH" },
  { name: "Factly", publisher: "Factly", homepage: "https://factly.in", searchUrl: "https://factly.in", tier: 3, sourceType: "INDEPENDENT_RESEARCH" },
  { name: "AFP Fact Check", publisher: "AFP", homepage: "https://factcheck.afp.com", searchUrl: "https://factcheck.afp.com", tier: 3, sourceType: "INDEPENDENT_RESEARCH" },
];

export function planSources(claim: string, topic: string): PlannedSource[] {
  const t = claim.toLowerCase();
  const primary: PlannedSource[] = [];

  if (/\brbi\b|repo rate|bank rate|monetary policy/.test(t)) primary.push(RBI);
  if (/supreme court|sci\.gov/.test(t)) primary.push(SCI);
  if (/election|evm|voter list|\beci\b/.test(t)) primary.push(ECI);
  if (/\bcag\b|audit report|expenditure/.test(t)) primary.push(CAG);
  if (/\bisro\b|chandrayaan|gaganyaan/.test(t)) primary.push(ISRO);
  if (/\bnasa\b/.test(t)) primary.push(NASA);
  if (/\bwho\b|pandemic|vaccine/.test(t) && topic === "HEALTH") primary.push(WHO);
  if (/fifa|world cup|messi/.test(t)) primary.push(FIFA);
  if (/cricket|icc|test cricket|\btests\b|kohli|bcci/.test(t) || topic === "SPORTS") {
    primary.push(ICC);
    primary.push({
      name: "BCCI",
      publisher: "Board of Control for Cricket in India",
      homepage: "https://www.bcci.tv",
      searchUrl: "https://www.bcci.tv",
      tier: 1,
      sourceType: "GOVERNMENT_REPORT",
    });
    primary.push({
      name: "ESPNcricinfo",
      publisher: "ESPNcricinfo",
      homepage: "https://www.espncricinfo.com",
      searchUrl: "https://www.espncricinfo.com",
      tier: 2,
      sourceType: "INDEPENDENT_RESEARCH",
    });
  }
  if (/gst|finance ministry|budget|insurance/.test(t)) {
    primary.push({
      name: "Ministry of Finance",
      publisher: "Government of India",
      homepage: "https://www.finmin.nic.in",
      searchUrl: "https://www.finmin.nic.in",
      tier: 1,
      sourceType: "GOVERNMENT_REPORT",
    });
  }
  if (/scheme|yojana|pib|ministry|government/.test(t)) primary.push(PIB);

  const seen = new Set<string>();
  const ordered = [...primary, ...TIER2, ...TIER3].filter((s) => {
    if (seen.has(s.homepage)) return false;
    seen.add(s.homepage);
    return true;
  });
  return ordered.slice(0, 10);
}
