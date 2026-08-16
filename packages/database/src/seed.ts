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
export const seedStories: Story[] = [
  {
    id: "story-jjm-audit-2024",
    slug: "jal-jeevan-mission-audit-findings",
    title: "Jal Jeevan Mission: CAG Uncovers 44% Non-Functional Taps in Sampled Arid Districts",
    subtitle: "An in-depth investigation into ₹28,400 Cr tap-water allocations across Rajasthan, Uttar Pradesh, and Bihar reveals ghost connections on paper vs ground delivery.",
    author: "CivicLens Investigative Desk",
    publishedAt: "2024-08-15",
    readTimeMinutes: 5,
    coverImageUrl: "/maps/water.jpg",
    sections: [
      {
        id: "sec-1",
        narrative: "The Comptroller and Auditor General of India (Report No. 14/2024) audited functional tap connections across 12 arid districts. While official dashboards reported 92% coverage, physical field sampling revealed 44% of households had zero running water due to uncommissioned pipelines and dried-up over-exploited aquifers.",
        evidenceId: "ev-cag-jjm-audit",
        timelineDate: "2024-08-15"
      },
      {
        id: "sec-2",
        narrative: "Utilization certificates worth ₹2,840 crore were found missing in Gram Panchayat accounting records, pointing to significant reconciliation delays between state nodal agencies and contractors.",
        evidenceId: "ev-cag-jjm-audit",
        timelineDate: "2024-08-15"
      }
    ]
  },
  {
    id: "story-electoral-bonds-flow",
    slug: "electoral-bonds-cash-flow-breakdown",
    title: "Decoding the ₹16,518 Crore Electoral Bonds Money Trail",
    subtitle: "How infrastructure contractors, mining conglomerates, and pharmaceutical giants distributed political contributions between 2018 and 2024.",
    author: "Civic Data Analytics Lab",
    publishedAt: "2024-07-28",
    readTimeMinutes: 6,
    sections: [
      {
        id: "sec-eb-1",
        narrative: "Following the Supreme Court verdict striking down the Electoral Bonds scheme as unconstitutional, State Bank of India disclosed 22,217 bond redemptions. The top 10 political parties collected over 93% of the total ₹16,518 crore pool, with single-party dominance in major corporate donor contributions.",
        timelineDate: "2024-07-28"
      }
    ]
  },
  {
    id: "story-ayushman-bharat-discrepancy",
    slug: "ayushman-bharat-hospital-audit",
    title: "Ayushman Bharat PM-JAY: Audit Highlights Ghost Claims & Biometric Deficits",
    subtitle: "CAG audit across 7 states flags ₹480 Cr in questioned treatment claims, including billing for already deceased beneficiaries and overlapping inpatient admissions.",
    author: "Public Health Governance Unit",
    publishedAt: "2024-06-12",
    readTimeMinutes: 4,
    sections: [
      {
        id: "sec-ab-1",
        narrative: "CAG Performance Audit Report No. 11/2023 reviewed 3.8 crore pre-authorized claims under Pradhan Mantri Jan Arogya Yojana. Key findings included invalid Aadhaar linking (over 7.5 lakh registrations under single placeholder numbers) and private hospital claims approved without mandatory pre-authorization telemetry.",
        timelineDate: "2024-06-12"
      }
    ]
  },
  {
    id: "story-fiscal-federalism-mh-up",
    slug: "state-finances-fiscal-divide-2024",
    title: "The Fiscal Divide: Maharashtra's ₹4.8 Lakh Cr Revenue vs UP's Welfare Expansion",
    subtitle: "Comparative analysis of state own-tax revenues, central tax devolution ratios, and capital expenditure quality across India's largest state economies.",
    author: "Macro-Governance Analysis Desk",
    publishedAt: "2024-05-20",
    readTimeMinutes: 7,
    sections: [
      {
        id: "sec-ff-1",
        narrative: "While Maharashtra generates over 72% of its budget through own-tax revenue (GST, Stamp Duty, Petroleum VAT), Uttar Pradesh relies on Central Tax Devolution for over 48% of its total receipts. Both models face distinct debt sustainability benchmarks under the 16th Finance Commission guidelines.",
        timelineDate: "2024-05-20"
      }
    ]
  }
];
export const seedPartyFunding: PartyFundingRecord[] = [];
export const seedCorporateDonors: CorporateDonorRecord[] = [];

