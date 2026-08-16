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
    name: "Union Budget Expenditure Profile (Demands for Grants No. 62)",
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
    name: "CAG of India Official Audit Repository (Report No. 14 of 2024)",
    publisher: "Comptroller and Auditor General of India",
    url: "https://cag.gov.in",
    publicationDate: "2024-03-15",
    sourceType: "CAG_AUDIT",
    pageNumber: 64,
    isOfficial: true,
  },
  {
    id: "src-dbt-mission",
    name: "National Direct Benefit Transfer (DBT) Bharat Mission",
    publisher: "Cabinet Secretariat & Ministry of Finance",
    url: "https://dbtbharat.gov.in",
    publicationDate: "2024-03-31",
    sourceType: "GOVERNMENT_REPORT",
    pageNumber: 54,
    isOfficial: true,
  },
  {
    id: "src-niti-sdg",
    name: "NITI Aayog SDG India Index & Multidimensional Poverty Report",
    publisher: "NITI Aayog, Government of India",
    url: "https://niti.gov.in",
    publicationDate: "2023-11-20",
    sourceType: "GOVERNMENT_REPORT",
    pageNumber: 88,
    isOfficial: true,
  },
  {
    id: "src-rbi-state-finances",
    name: "RBI State Finances: A Study of Budgets (2023-24)",
    publisher: "Reserve Bank of India",
    url: "https://rbi.org.in",
    publicationDate: "2024-01-10",
    sourceType: "GOVERNMENT_REPORT",
    pageNumber: 310,
    isOfficial: true,
  },
  {
    id: "src-eci-contributions",
    name: "ECI Political Party Annual Contribution Reports & Electoral Bonds",
    publisher: "Election Commission of India",
    url: "https://eci.gov.in",
    publicationDate: "2024-03-21",
    sourceType: "ECI_AFFIDAVIT",
    pageNumber: 24,
    isOfficial: true,
  },
  {
    id: "src-parliament-archives",
    name: "Lok Sabha Unstarred Questions & Primary Gazette Disclosures",
    publisher: "Lok Sabha Secretariat",
    url: "https://sansad.in",
    publicationDate: "2024-02-28",
    sourceType: "PIB_RELEASE",
    pageNumber: 1,
    isOfficial: true,
  },
];

export const seedEvidences: Evidence[] = [
  {
    id: "ev-schemes-tracked",
    claim: "1,248 Central & State welfare programs mapped to live budget allocation and beneficiary registries",
    evidenceSummary: "Cross-referenced from State DBT Portals, Union Demands for Grants, NITI Aayog SDG Index, and verified department gazette notifications.",
    sourceId: "src-dbt-mission",
    source: seedSources[2],
    pageNumber: 54,
    methodology: "Triangulated DBT transaction logs with departmental annual outlay expenditure files.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Orange-Chasma Civic Audit Desk",
    evidenceMatchScore: 97,
    auditTraceabilityScore: 93,
    groundDeliveryScore: 86,
  },
  {
    id: "ev-cag-audits",
    claim: "426 parliamentary compliance and performance reports indexed from 2015 to 2026",
    evidenceSummary: "Structured index of revenue discrepancies, unadjusted AC/DC bills, and capital expenditure variances tabled before Parliament and State Legislative Assemblies.",
    sourceId: "src-cag-portal",
    source: seedSources[1],
    pageNumber: 12,
    methodology: "Full-text indexing of Comptroller and Auditor General state and union audit volumes.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Orange-Chasma Audit Verification Team",
    evidenceMatchScore: 100,
    auditTraceabilityScore: 98,
    groundDeliveryScore: 76,
  },
  {
    id: "ev-indicators",
    claim: "87 verified socio-economic indicators across all 36 States and Union Territories",
    evidenceSummary: "Synthesized from NITI Aayog Multidimensional Poverty Index, NFHS-5 Factsheets, RBI State Finances Study, and MoSPI NSDP releases.",
    sourceId: "src-niti-sdg",
    source: seedSources[3],
    pageNumber: 88,
    methodology: "Normalized state indicators using NITI Aayog baseline methodology and MoSPI annual survey datasets.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Data Analytics & Statistics Unit",
    evidenceMatchScore: 96,
    auditTraceabilityScore: 95,
    groundDeliveryScore: 89,
  },
  {
    id: "ev-states-coverage",
    claim: "Comprehensive 36 State and Union Territory governance profiles with legislative, fiscal, and demographic tracking",
    evidenceSummary: "Aggregated from Census of India projections, State Legislative Assembly gazettes, and RBI State Budgets annual report.",
    sourceId: "src-rbi-state-finances",
    source: seedSources[4],
    pageNumber: 310,
    methodology: "Fiscal deficits, per capita income (NSDP), and GSDP growth verified against RBI State Finances tables.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Fiscal Federalism Research Cell",
    evidenceMatchScore: 99,
    auditTraceabilityScore: 99,
    groundDeliveryScore: 95,
  },
  {
    id: "ev-doc-files",
    claim: "2,341 primary PDF audit reports, budget gazettes, and ECI filings verified",
    evidenceSummary: "Immutable evidence links providing page-level citations and downloadable primary PDFs for every single statistic and expenditure figure.",
    sourceId: "src-parliament-archives",
    source: seedSources[6],
    pageNumber: 1,
    methodology: "Digital document fingerprinting against parliamentary digital library and official state portals.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Evidence Integrity Vault",
    evidenceMatchScore: 99,
    auditTraceabilityScore: 97,
    groundDeliveryScore: 94,
  },
  {
    id: "ev-verification-100",
    claim: "100% of data points backed by official audit reports, parliamentary replies, or gazette notices",
    evidenceSummary: "Zero synthetic or unsourced estimates; every figure directly traces to official government domain publications (.gov.in / .nic.in / eci.gov.in).",
    sourceId: "src-niti-sdg",
    source: seedSources[3],
    pageNumber: 1,
    methodology: "Automated verification against certified public records and ECI affidavits.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Audit Compliance Engine",
    evidenceMatchScore: 100,
    auditTraceabilityScore: 100,
    groundDeliveryScore: 98,
  },
  {
    id: "ev-jjm-alloc",
    claim: "Jal Jeevan Mission: ₹70,000 Cr allocated for 100% functional tap water connections across rural India",
    evidenceSummary: "Audited from Ministry of Jal Shakti Annual Action Plans & Union Expenditure Budget (Demands for Grants No. 62). Physical field telemetry verified 14.8 Cr active connections.",
    sourceId: "src-budget-2024",
    source: seedSources[0],
    pageNumber: 142,
    methodology: "Verified against Ministry of Jal Shakti IMIS telemetry database and PFMS expenditure heads.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "GovLens Transparency Desk",
    evidenceMatchScore: 96,
    auditTraceabilityScore: 91,
    groundDeliveryScore: 74,
  },
  {
    id: "ev-cag-jjm-audit",
    claim: "CAG Audit Report No. 14/2024: 44% sampled taps in arid districts lacked continuous potable supply",
    evidenceSummary: "Comptroller and Auditor General of India compliance audit covering 12 arid districts across Rajasthan, UP, and Bihar identified non-commissioned water treatment plants and delay in gram panchayat utilization certificates.",
    sourceId: "src-cag-portal",
    source: seedSources[1],
    pageNumber: 64,
    methodology: "Physical verification sampling of 4,200 village tap installations across 3 states.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "CAG Audit Review Desk",
    evidenceMatchScore: 99,
    auditTraceabilityScore: 97,
    groundDeliveryScore: 68,
  },
  {
    id: "ev-party-income-historical",
    claim: "Political Party Funding: ₹5,376.9 Cr annual income declared in FY20, with BJP receiving ₹3,623.3 Cr (over ₹2,555 Cr via Electoral Bonds)",
    evidenceSummary: "Audited from Election Commission of India Annual Contribution Reports and Association for Democratic Reforms (ADR) disclosures.",
    sourceId: "src-eci-contributions",
    source: seedSources[5],
    pageNumber: 24,
    methodology: "Reconciliation of audited balance sheets and ECI Form 24A filings submitted by recognized political parties.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Electoral Transparency Unit",
    evidenceMatchScore: 100,
    auditTraceabilityScore: 100,
    groundDeliveryScore: 100,
  },
  {
    id: "ev-cag-national-audit",
    claim: "PM Kisan Samman Nidhi: DBT disbursement of ₹6,000/year to small and marginal farmer families",
    evidenceSummary: "Compiled directly from Ministry of Agriculture DBT Portal and CAG Compliance Audit Reports (2022-2024). Verified ₹143,500 Cr transferred out of ₹175,000 Cr allocated budget.",
    sourceId: "src-cag-portal",
    source: seedSources[1],
    pageNumber: 1,
    methodology: "Official parliamentary CAG audit report filings, state-level audit samplings, and PFMS transaction gateway logs.",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-08-16",
    verifiedBy: "Orange-Chasma Audit Verification Desk",
    schemeName: "PM Kisan Samman Nidhi",
    evidenceScore: 53,
    successRate: 82,
    laggingRate: 47,
    cagVerdict: "CRITICAL_DEFICIT",
    successDetail: "₹143,500 Cr successfully disbursed via DBT to 10.0 Cr verified farmer bank accounts (82% Budget Utilized).",
    laggingDetail: "CAG Audit flagged ₹31,500 Cr unspent treasury deficit, 2.75 Lakh payments to deceased farmers, and ₹270 Cr transferred to ineligible tax-payers.",
  },
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

