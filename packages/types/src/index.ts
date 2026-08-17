export type VerificationStatus = "VERIFIED" | "REVIEW_PENDING" | "UNVERIFIED" | "DISPUTED";

export interface Source {
  id: string;
  name: string;
  publisher: string;
  url?: string;
  publicationDate: string;
  sourceType: "GOVERNMENT_REPORT" | "CAG_AUDIT" | "UNION_BUDGET" | "PIB_RELEASE" | "ECI_AFFIDAVIT" | "INDEPENDENT_RESEARCH";
  documentUrl?: string;
  pageNumber?: number;
  isOfficial: boolean;
}

export interface Evidence {
  id: string;
  claim: string;
  evidenceSummary: string;
  sourceId: string;
  source?: Source;
  documentId?: string;
  pageNumber?: number;
  methodology?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  evidenceMatchScore?: number;
  auditTraceabilityScore?: number;
  groundDeliveryScore?: number;
  // Government Execution & Lagging Metrics
  successRate?: number;
  laggingRate?: number;
  evidenceScore?: number;
  cagVerdict?: string;
  successDetail?: string;
  laggingDetail?: string;
  schemeName?: string;
}

export type PipelineStage =
  | "PROMISE"
  | "POLICY"
  | "ANNOUNCEMENT"
  | "BUDGET"
  | "ALLOCATION"
  | "EXPENDITURE"
  | "IMPLEMENTATION"
  | "CAG_FINDING"
  | "OUTCOME";

export interface SchemeMilestone {
  id: string;
  schemeId: string;
  stage: PipelineStage;
  title: string;
  description: string;
  amountCr?: number;
  date: string;
  evidenceId?: string;
  evidence?: Evidence;
}

export interface Scheme {
  id: string;
  slug: string;
  name: string;
  hindiName?: string;
  ministry: string;
  launchYear: number;
  budgetAllocatedCr: number;
  expenditureCr: number;
  beneficiariesCount: number;
  coverageTarget: string;
  cagVerdict: "SATISFACTORY" | "PARTIAL_DISCREPANCY" | "CRITICAL_DEFICIT" | "UNAUDITED";
  evidenceScore: number; // 0 to 100
  summary: string;
  pipeline?: SchemeMilestone[];
  evidences?: Evidence[];
}

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface CAGFinding {
  id: string;
  reportId: string;
  title: string;
  department: string;
  financialImpactCr: number;
  severity: SeverityLevel;
  findingSummary: string;
  recommendation: string;
  govtResponse?: string;
  status: "OPEN" | "ACTION_TAKEN" | "RESOLVED" | "UNDER_REVIEW";
  evidenceId?: string;
  evidence?: Evidence;
}

export interface CAGReport {
  id: string;
  title: string;
  reportNumber: string;
  year: number;
  ministry: string;
  stateName?: string;
  totalLossCr: number;
  documentUrl?: string;
  findings?: CAGFinding[];
}

export interface StateIndicator {
  id: string;
  code: string;
  name: string;
  category: "Governance" | "Health" | "Education" | "Employment" | "Infrastructure" | "Fiscal" | "Crime" | "Welfare";
  unit: string;
  higherIsBetter: boolean;
  description: string;
}

export interface IndicatorValue {
  id: string;
  stateCode: string;
  indicatorCode: string;
  year: number;
  value: number;
  rank?: number;
  evidenceId?: string;
}

export interface StateProfile {
  code: string; // e.g., "MH", "WB", "DL"
  name: string;
  capital: string;
  population: number;
  scores: Record<string, number>; // Category scores out of 100
  indicators: IndicatorValue[];
  cagFindingsCount: number;
  activeSchemesCount: number;
}

export type PromiseStatus = "DELIVERED" | "PARTIALLY_DELIVERED" | "IN_PROGRESS" | "NOT_VERIFIED" | "NOT_DELIVERED";

export interface ManifestoPromise {
  id: string;
  year: 2014 | 2019 | 2024;
  category: string;
  promiseTitle: string;
  description: string;
  status: PromiseStatus;
  evidenceSummary: string;
  evidenceId?: string;
  evidence?: Evidence;
}

export interface MinisterProfile {
  id: string;
  name: string;
  slug?: string;
  title?: string;
  currentPosition?: string;
  constituency: string;
  party: string;
  ministry: string;
  photoUrl?: string;
  education: string;
  educationDetails?: {
    degree?: string;
    institution?: string;
    summary?: string;
  };
  totalAssetsCr: number;
  declaredAssetsCr?: number;
  liabilitiesCr: number;
  assetGrowthPercent: number;
  assetGrowthPct?: number;
  criminalCases?: number;
  seriousCriminalCases?: number;
  criminalCaseNote?: string;
  declaredCases?: {
    pending: number;
    convicted: number;
    acquitted: number;
    details: string[];
  };
  affidavitSourceUrl?: string;
  timeline?: { year: number; role: string; party: string }[];
  scamsAndCorruption?: {
    title: string;
    financialImpact: string;
    description: string;
    status: string;
  }[];
  epicFailures?: {
    achievement: string;
    outlay: string;
    status: string;
  }[];
  controversies?: string[];
  keyWorks?: {
    achievement: string;
    outlay: string;
    status: string;
  }[];
  workScoreBreakdown?: {
    schemeDelivery: number;
    integrityAndCleanGovernance: number;
    policyCompetence: number;
    publicResponsiveness: number;
    overallScore: number;
  };
  performanceScore?: number;
  stateName?: string;
  stateCode?: string;
  isCM?: boolean;
  groupName?: string;
}

export interface StorySection {
  id: string;
  narrative: string;
  visualizationType?: string;
  visualizationData?: any;
  evidenceId?: string;
  timelineDate?: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  coverImageUrl?: string;
  sections: StorySection[];
}

export type VisualizationType =
  | "stat"
  | "table"
  | "line"
  | "bar"
  | "area"
  | "scatter"
  | "map"
  | "timeline"
  | "comparison"
  | "sankey"
  | "evidence_graph";

export interface AIStructuredResponse {
  answer: string;
  metrics?: { label: string; value: string | number; change?: string }[];
  visualization?: {
    type: VisualizationType;
    title?: string;
    data: any[];
    keys?: string[];
  };
  sources: Source[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  methodology: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  preferences: string[]; // ["CAG", "Economy", "Schemes", "States", "Elections", "Governance"]
  status: "ACTIVE" | "UNSUBSCRIBED";
}

export interface PartyFundingRecord {
  party: string;
  shortName: string;
  amount: number;
  color: string;
  coalition: string;
  ideology: string;
  partyName?: string;
  shortCode?: string;
  totalFundingCr?: number;
  electoralBondsCr?: number;
  percentageShare?: number;
  yearlyBreakdown?: { year: number; bondsCr: number }[];
  auditNotes?: string;
}

export interface CorporateDonorRecord {
  rank: number;
  name: string;
  shortName: string;
  sector: string;
  amount: number;
  note?: string;
  parties: { party: string; shortName: string; amount: number }[];
  contracts?: any[];
  donorName?: string;
  totalDonatedCr?: number;
  primaryRecipientParty?: string;
  recipientBreakdown?: Record<string, number | undefined>;
  cagAuditFlag?: string;
}

// ----------------------------------------------------
// TruthCheck™ & Fake News Detection Types
// ----------------------------------------------------

export type FactCheckVerdict =
  | "FALSE"
  | "MISLEADING"
  | "UNVERIFIED"
  | "VERIFIED_TRUE"
  | "SATIRE";

export type ClaimCategory =
  | "SCHEMES"
  | "ELECTIONS"
  | "ECONOMY"
  | "HEALTH"
  | "CAG_CORRUPTION"
  | "GOVERNANCE"
  | "LEGAL"
  | "GENERAL";

export interface LinguisticSignal {
  type: "URGENCY" | "SENSATIONALISM" | "SCAM_LINK" | "AUTHORITY_FABRICATION" | "EMOTIONAL_BAIT";
  phrase: string;
  weight: number; // 0 to 1
  explanation: string;
}

export interface FactCheckClaim {
  id: string;
  title: string;
  claim: string;
  claimant: string;
  verdict: FactCheckVerdict;
  truthSummary: string;
  debunkExplanation: string;
  category: ClaimCategory;
  viralityScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  dateReported: string;
  highlightedRedFlags: string[];
  officialClarificationUrl?: string;
  officialSourceLabel?: string;
  evidenceId?: string;
  evidence?: Evidence;
  suggestedAction?: string;
}

export interface ClaimAnalysisResult {
  verdict: FactCheckVerdict;
  confidenceScore: number; // 0 to 100
  sensationalismScore: number; // 0 to 100
  truthSummary: string;
  detailedDebunk: string;
  groundReality: string;
  originalClaim: string;
  signalsDetected: LinguisticSignal[];
  redFlagPhrases: string[];
  matchedCivicEntities: {
    schemes?: string[];
    ministers?: string[];
    cagAudits?: string[];
    states?: string[];
    monetaryValues?: string[];
  };
  primarySources: Source[];
  evidenceId?: string;
  shareableDebunkText: string;
  category: ClaimCategory;
}

export interface FactCheckSubmission {
  id: string;
  claimText: string;
  sourcePlatform: string;
  url?: string;
  userContact?: string;
  submittedAt: string;
  upvotes: number;
  status: "PENDING_REVIEW" | "VERIFIED" | "DEBUNKED";
}

