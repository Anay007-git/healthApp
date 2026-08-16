import {
  Scheme,
  CAGReport,
  StateProfile,
  ManifestoPromise,
  MinisterProfile,
  Story,
  Source,
  Evidence,
  StateIndicator,
  PartyFundingRecord,
  CorporateDonorRecord,
} from "@civiclens/types";

import schemesJson from "./schemes_data.json";
import cagJson from "./cag_data.json";
import manifestoJson from "./manifesto_promises.json";

export const seedManifestoPromises: ManifestoPromise[] = manifestoJson as ManifestoPromise[];

export const seedSources: Source[] = [
  {
    id: "src-budget-2024",
    name: "Union Budget Expenditure Profile",
    publisher: "Ministry of Finance, Government of India",
    url: "https://www.indiabudget.gov.in",
    publicationDate: "2024-02-01",
    sourceType: "UNION_BUDGET",
    documentUrl: "https://www.indiabudget.gov.in/doc/eb/stat2.pdf",
    pageNumber: 142,
    isOfficial: true,
  },
  {
    id: "src-cag-portal",
    name: "CAG of India Official Audit Repository",
    publisher: "Comptroller and Auditor General of India",
    url: "https://cag.gov.in",
    publicationDate: "2024-01-01",
    sourceType: "CAG_AUDIT",
    isOfficial: true,
  }
];

export const seedEvidences: Evidence[] = [
  {
    id: "ev-cag-national-audit",
    claim: "CAG audit performance findings across core central government schemes",
    evidenceSummary: "Compiled directly from Comptroller and Auditor General of India Performance & Compliance Audit Reports (2015-2026).",
    sourceId: "src-cag-portal",
    methodology: "Official parliamentary CAG audit report filings and state-level audit samplings.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "GovLens Transparency Desk",
  }
];

export const seedSchemes: Scheme[] = schemesJson as Scheme[];
export const seedCAGReports: CAGReport[] = cagJson as CAGReport[];

export const seedIndicators: StateIndicator[] = [
  { id: "ind-hdi", code: "HDI", name: "Human Development Index (HDI)", category: "Governance", unit: "Index", higherIsBetter: true, description: "NITI Aayog / UNDP Human Development Index score." },
  { id: "ind-literacy", code: "LITERACY_RATE", name: "Literacy Rate (%)", category: "Education", unit: "%", higherIsBetter: true, description: "Percentage of population aged 7 and above who can read and write." },
  { id: "ind-imr", code: "INFANT_MORTALITY", name: "Infant Mortality Rate", category: "Health", unit: "per 1,000", higherIsBetter: false, description: "Number of infant deaths under 1 year per 1,000 live births." },
  { id: "ind-crime-safety", code: "CRIME_SAFETY", name: "Crime Rate (Safety Index)", category: "Crime", unit: "per 100k", higherIsBetter: false, description: "NCRB reported cognizable violent crime rate per 100,000 population." }
];

export const seedStates: StateProfile[] = [
  {
    code: "MH",
    name: "Maharashtra",
    capital: "Mumbai",
    population: 126380000,
    scores: { Governance: 81, Health: 79, Education: 84, Fiscal: 76, Infrastructure: 88 },
    cagFindingsCount: 14,
    activeSchemesCount: 42,
    indicators: [
      { id: "v1a", stateCode: "MH", indicatorCode: "HDI", year: 2024, value: 0.701, rank: 5 },
      { id: "v1", stateCode: "MH", indicatorCode: "LITERACY_RATE", year: 2023, value: 84.8, rank: 6 }
    ]
  },
  {
    code: "WB",
    name: "West Bengal",
    capital: "Kolkata",
    population: 99084000,
    scores: { Governance: 72, Health: 75, Education: 77, Fiscal: 68, Infrastructure: 74 },
    cagFindingsCount: 22,
    activeSchemesCount: 38,
    indicators: [
      { id: "v5a", stateCode: "WB", indicatorCode: "HDI", year: 2024, value: 0.641, rank: 14 },
      { id: "v5", stateCode: "WB", indicatorCode: "LITERACY_RATE", year: 2023, value: 76.3, rank: 14 }
    ]
  }
];


export const seedMinisters: MinisterProfile[] = [];
export const seedStories: Story[] = [];
export const seedPartyFunding: PartyFundingRecord[] = [];
export const seedCorporateDonors: CorporateDonorRecord[] = [];
