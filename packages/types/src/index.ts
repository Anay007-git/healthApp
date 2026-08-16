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
  constituency: string;
  party: string;
  ministry: string;
  education: string;
  totalAssetsCr: number;
  liabilitiesCr: number;
  assetGrowthPercent: number;
  declaredCases: {
    pending: number;
    convicted: number;
    acquitted: number;
    details: string[];
  };
  affidavitSourceUrl: string;
  timeline: { year: number; role: string; party: string }[];
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

