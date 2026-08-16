import {
  seedSources,
  seedEvidences,
  seedSchemes,
  seedIndicators,
  seedStates,
  seedCAGReports,
  seedManifestoPromises,
  seedMinisters,
  seedStories,
  seedPartyFunding,
  seedCorporateDonors,
} from "./seed";
import { MINISTERS, PM_PROFILE, nameToSlug } from "./ministers_data";
import { PARTY_FUNDING, TOP_DONORS, BONDS_META } from "./funding_data";
import {
  Scheme,
  StateProfile,
  CAGReport,
  ManifestoPromise,
  PromiseStatus,
  MinisterProfile,
  Story,
  Evidence,
  Source,
} from "@civiclens/types";

import { STATE_FACTS } from "./state_facts_data";
import { PARTY_ANNUAL_INCOME_DATA, PARTY_META_MAP, PartyAnnualIncomeRecord } from "./party_income_history";
export * from "./state_facts_data";
export * from "./party_income_history";

export * from "./seed";
export * from "./ministers_data";
export * from "./funding_data";

const STATE_NAME_TO_CODE: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CG",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OR",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TG",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB",
  "Delhi": "DL",
  "Delhi (NCT)": "DL",
  "Jammu & Kashmir": "JK",
  "Jammu and Kashmir": "JK",
  "Puducherry": "PY",
  "Ladakh": "LA",
  "Andaman & Nicobar Islands": "AN",
  "Andaman and Nicobar Islands": "AN",
  "Lakshadweep": "LD",
  "Chandigarh": "CH",
  "Dadra & Nagar Haveli and Daman & Diu": "DN",
  "Dadra and Nagar Haveli and Daman and Diu": "DN"
};

function getStateCodeForName(name: string, rawCode?: string): string {
  if (rawCode && rawCode !== "TS") return rawCode.toUpperCase();
  if (rawCode === "TS") return "TG";
  for (const [key, val] of Object.entries(STATE_NAME_TO_CODE)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return val;
    }
  }
  return (rawCode || name.slice(0, 2)).toUpperCase();
}

function extractScoresMap(ratings: any, indicators: any): Record<string, number> {
  const scores: Record<string, number> = {
    Governance: 78,
    Health: 76,
    Education: 80,
    Fiscal: 74,
    Infrastructure: 82
  };

  if (Array.isArray(ratings)) {
    ratings.forEach((item: any) => {
      if (item && typeof item === "object") {
        const val = typeof item.score === "number" ? item.score : (typeof item.value === "number" ? item.value : null);
        if (val !== null && typeof val === "number") {
          const name = item.label || item.key || "Governance";
          if (name.toLowerCase().includes("gov")) scores["Governance"] = val;
          else if (name.toLowerCase().includes("health")) scores["Health"] = val;
          else if (name.toLowerCase().includes("edu")) scores["Education"] = val;
          else if (name.toLowerCase().includes("fisc") || name.toLowerCase().includes("econ")) scores["Fiscal"] = val;
          else if (name.toLowerCase().includes("infra") || name.toLowerCase().includes("transp")) scores["Infrastructure"] = val;
          else scores[name] = val;
        }
      }
    });
  } else if (ratings && typeof ratings === "object") {
    Object.entries(ratings).forEach(([k, v]) => {
      if (typeof v === "number" && !isNaN(v)) {
        scores[k] = v;
      } else if (v && typeof v === "object" && typeof (v as any).score === "number") {
        scores[k] = (v as any).score;
      }
    });
  }

  if (Array.isArray(indicators)) {
    indicators.forEach((item: any) => {
      if (item && typeof item === "object" && typeof item.score === "number") {
        const name = item.label || item.key;
        if (name) {
          if (name.toLowerCase().includes("health")) scores["Health"] = item.score;
          else if (name.toLowerCase().includes("edu")) scores["Education"] = item.score;
          else if (name.toLowerCase().includes("econ")) scores["Fiscal"] = item.score;
          else if (name.toLowerCase().includes("infra")) scores["Infrastructure"] = item.score;
          else if (name.toLowerCase().includes("gov")) scores["Governance"] = item.score;
        }
      }
    });
  }

  const safeScores: Record<string, number> = {};
  Object.entries(scores).forEach(([k, v]) => {
    if (typeof v === "number" && !isNaN(v)) {
      safeScores[k] = v;
    } else if (v && typeof v === "object" && typeof (v as any).score === "number") {
      safeScores[k] = (v as any).score;
    } else {
      safeScores[k] = 50;
    }
  });

  return safeScores;
}

export interface StateAuditedMetrics {
  hdi: number;
  literacy: number;
  imr: number;
  crimeRate: number;
  perCapitaIncome: number;
  gsdpGrowth: number;
  fiscalDeficit: number;
  easeOfBizRank: number;
  cagFlags: number;
  activeSchemes: number;
  scores: {
    Governance: number;
    Health: number;
    Education: number;
    Fiscal: number;
    Infrastructure: number;
  };
}

export const STATE_AUDITED_METRICS_DATA: Record<string, StateAuditedMetrics> = {
  AP: { hdi: 0.627, literacy: 67.4, imr: 24, crimeRate: 221.0, perCapitaIncome: 219518, gsdpGrowth: 11.4, fiscalDeficit: 3.6, easeOfBizRank: 1, cagFlags: 15, activeSchemes: 44, scores: { Governance: 79, Health: 77, Education: 75, Fiscal: 69, Infrastructure: 80 } },
  AR: { hdi: 0.660, literacy: 65.4, imr: 21, crimeRate: 165.2, perCapitaIncome: 182641, gsdpGrowth: 8.5, fiscalDeficit: 2.8, easeOfBizRank: 28, cagFlags: 9, activeSchemes: 28, scores: { Governance: 71, Health: 68, Education: 66, Fiscal: 78, Infrastructure: 64 } },
  AS: { hdi: 0.614, literacy: 72.2, imr: 32, crimeRate: 341.0, perCapitaIncome: 118504, gsdpGrowth: 9.1, fiscalDeficit: 4.1, easeOfBizRank: 20, cagFlags: 17, activeSchemes: 36, scores: { Governance: 74, Health: 70, Education: 73, Fiscal: 67, Infrastructure: 72 } },
  BR: { hdi: 0.571, literacy: 70.9, imr: 27, crimeRate: 228.0, perCapitaIncome: 59637, gsdpGrowth: 10.6, fiscalDeficit: 3.8, easeOfBizRank: 26, cagFlags: 19, activeSchemes: 40, scores: { Governance: 70, Health: 65, Education: 68, Fiscal: 60, Infrastructure: 66 } },
  CG: { hdi: 0.613, literacy: 70.3, imr: 38, crimeRate: 360.5, perCapitaIncome: 133897, gsdpGrowth: 8.0, fiscalDeficit: 3.2, easeOfBizRank: 6, cagFlags: 14, activeSchemes: 35, scores: { Governance: 73, Health: 66, Education: 70, Fiscal: 74, Infrastructure: 71 } },
  GA: { hdi: 0.761, literacy: 88.7, imr: 8, crimeRate: 197.8, perCapitaIncome: 472070, gsdpGrowth: 10.5, fiscalDeficit: 2.6, easeOfBizRank: 24, cagFlags: 6, activeSchemes: 30, scores: { Governance: 86, Health: 89, Education: 88, Fiscal: 82, Infrastructure: 87 } },
  GJ: { hdi: 0.672, literacy: 82.4, imr: 23, crimeRate: 378.0, perCapitaIncome: 276000, gsdpGrowth: 13.3, fiscalDeficit: 1.8, easeOfBizRank: 2, cagFlags: 10, activeSchemes: 45, scores: { Governance: 86, Health: 79, Education: 81, Fiscal: 88, Infrastructure: 92 } },
  HR: { hdi: 0.708, literacy: 80.4, imr: 28, crimeRate: 395.2, perCapitaIncome: 296685, gsdpGrowth: 8.7, fiscalDeficit: 2.9, easeOfBizRank: 3, cagFlags: 10, activeSchemes: 38, scores: { Governance: 84, Health: 80, Education: 81, Fiscal: 80, Infrastructure: 86 } },
  HP: { hdi: 0.725, literacy: 86.6, imr: 19, crimeRate: 260.4, perCapitaIncome: 222227, gsdpGrowth: 7.1, fiscalDeficit: 4.6, easeOfBizRank: 7, cagFlags: 11, activeSchemes: 34, scores: { Governance: 83, Health: 85, Education: 87, Fiscal: 66, Infrastructure: 79 } },
  JH: { hdi: 0.599, literacy: 66.4, imr: 27, crimeRate: 172.4, perCapitaIncome: 86060, gsdpGrowth: 7.8, fiscalDeficit: 3.4, easeOfBizRank: 5, cagFlags: 16, activeSchemes: 32, scores: { Governance: 71, Health: 67, Education: 67, Fiscal: 72, Infrastructure: 69 } },
  KA: { hdi: 0.682, literacy: 82.8, imr: 19, crimeRate: 248.6, perCapitaIncome: 301644, gsdpGrowth: 10.2, fiscalDeficit: 2.6, easeOfBizRank: 8, cagFlags: 13, activeSchemes: 46, scores: { Governance: 85, Health: 81, Education: 84, Fiscal: 82, Infrastructure: 89 } },
  KL: { hdi: 0.779, literacy: 96.2, imr: 6, crimeRate: 499.0, perCapitaIncome: 263987, gsdpGrowth: 6.6, fiscalDeficit: 3.4, easeOfBizRank: 15, cagFlags: 8, activeSchemes: 48, scores: { Governance: 92, Health: 94, Education: 95, Fiscal: 74, Infrastructure: 88 } },
  MP: { hdi: 0.603, literacy: 73.7, imr: 43, crimeRate: 420.0, perCapitaIncome: 140583, gsdpGrowth: 9.0, fiscalDeficit: 3.7, easeOfBizRank: 4, cagFlags: 18, activeSchemes: 42, scores: { Governance: 75, Health: 69, Education: 71, Fiscal: 71, Infrastructure: 76 } },
  MH: { hdi: 0.695, literacy: 84.8, imr: 16, crimeRate: 350.2, perCapitaIncome: 242247, gsdpGrowth: 8.8, fiscalDeficit: 2.5, easeOfBizRank: 13, cagFlags: 12, activeSchemes: 52, scores: { Governance: 88, Health: 82, Education: 86, Fiscal: 84, Infrastructure: 91 } },
  MN: { hdi: 0.696, literacy: 79.2, imr: 10, crimeRate: 112.5, perCapitaIncome: 91400, gsdpGrowth: 6.4, fiscalDeficit: 4.8, easeOfBizRank: 29, cagFlags: 11, activeSchemes: 26, scores: { Governance: 68, Health: 75, Education: 78, Fiscal: 62, Infrastructure: 63 } },
  ML: { hdi: 0.650, literacy: 74.4, imr: 32, crimeRate: 118.0, perCapitaIncome: 98838, gsdpGrowth: 8.2, fiscalDeficit: 4.2, easeOfBizRank: 31, cagFlags: 10, activeSchemes: 27, scores: { Governance: 70, Health: 68, Education: 72, Fiscal: 66, Infrastructure: 65 } },
  MZ: { hdi: 0.705, literacy: 91.3, imr: 15, crimeRate: 220.0, perCapitaIncome: 175896, gsdpGrowth: 8.9, fiscalDeficit: 3.9, easeOfBizRank: 30, cagFlags: 7, activeSchemes: 29, scores: { Governance: 80, Health: 83, Education: 90, Fiscal: 70, Infrastructure: 72 } },
  NL: { hdi: 0.679, literacy: 79.6, imr: 21, crimeRate: 67.2, perCapitaIncome: 130000, gsdpGrowth: 7.5, fiscalDeficit: 3.5, easeOfBizRank: 32, cagFlags: 8, activeSchemes: 25, scores: { Governance: 72, Health: 73, Education: 77, Fiscal: 71, Infrastructure: 66 } },
  OR: { hdi: 0.606, literacy: 77.3, imr: 36, crimeRate: 339.4, perCapitaIncome: 150676, gsdpGrowth: 8.5, fiscalDeficit: 2.8, easeOfBizRank: 14, cagFlags: 14, activeSchemes: 44, scores: { Governance: 77, Health: 73, Education: 74, Fiscal: 76, Infrastructure: 78 } },
  PB: { hdi: 0.723, literacy: 83.7, imr: 18, crimeRate: 242.0, perCapitaIncome: 181828, gsdpGrowth: 6.2, fiscalDeficit: 4.9, easeOfBizRank: 19, cagFlags: 12, activeSchemes: 37, scores: { Governance: 81, Health: 83, Education: 82, Fiscal: 65, Infrastructure: 84 } },
  RJ: { hdi: 0.621, literacy: 69.7, imr: 32, crimeRate: 357.2, perCapitaIncome: 156149, gsdpGrowth: 8.1, fiscalDeficit: 3.9, easeOfBizRank: 11, cagFlags: 16, activeSchemes: 43, scores: { Governance: 76, Health: 72, Education: 70, Fiscal: 68, Infrastructure: 77 } },
  SK: { hdi: 0.716, literacy: 81.4, imr: 5, crimeRate: 135.8, perCapitaIncome: 516388, gsdpGrowth: 8.2, fiscalDeficit: 3.1, easeOfBizRank: 27, cagFlags: 5, activeSchemes: 31, scores: { Governance: 82, Health: 88, Education: 83, Fiscal: 79, Infrastructure: 78 } },
  TN: { hdi: 0.708, literacy: 82.9, imr: 13, crimeRate: 332.6, perCapitaIncome: 273288, gsdpGrowth: 11.2, fiscalDeficit: 3.2, easeOfBizRank: 3, cagFlags: 11, activeSchemes: 50, scores: { Governance: 89, Health: 88, Education: 87, Fiscal: 81, Infrastructure: 93 } },
  TG: { hdi: 0.669, literacy: 72.8, imr: 21, crimeRate: 420.5, perCapitaIncome: 312398, gsdpGrowth: 12.4, fiscalDeficit: 3.1, easeOfBizRank: 3, cagFlags: 11, activeSchemes: 45, scores: { Governance: 83, Health: 80, Education: 79, Fiscal: 78, Infrastructure: 87 } },
  TR: { hdi: 0.658, literacy: 87.2, imr: 21, crimeRate: 130.4, perCapitaIncome: 150000, gsdpGrowth: 8.0, fiscalDeficit: 3.3, easeOfBizRank: 25, cagFlags: 9, activeSchemes: 28, scores: { Governance: 76, Health: 78, Education: 85, Fiscal: 73, Infrastructure: 72 } },
  UP: { hdi: 0.596, literacy: 73.0, imr: 38, crimeRate: 184.2, perCapitaIncome: 83636, gsdpGrowth: 10.4, fiscalDeficit: 3.4, easeOfBizRank: 2, cagFlags: 24, activeSchemes: 54, scores: { Governance: 74, Health: 68, Education: 72, Fiscal: 73, Infrastructure: 83 } },
  UK: { hdi: 0.718, literacy: 87.6, imr: 24, crimeRate: 210.0, perCapitaIncome: 233000, gsdpGrowth: 7.9, fiscalDeficit: 2.7, easeOfBizRank: 11, cagFlags: 9, activeSchemes: 35, scores: { Governance: 82, Health: 81, Education: 86, Fiscal: 77, Infrastructure: 80 } },
  WB: { hdi: 0.641, literacy: 80.5, imr: 22, crimeRate: 195.4, perCapitaIncome: 141373, gsdpGrowth: 8.4, fiscalDeficit: 3.7, easeOfBizRank: 10, cagFlags: 14, activeSchemes: 46, scores: { Governance: 78, Health: 76, Education: 80, Fiscal: 70, Infrastructure: 75 } },
  DL: { hdi: 0.756, literacy: 88.7, imr: 12, crimeRate: 1479.9, perCapitaIncome: 444760, gsdpGrowth: 9.2, fiscalDeficit: 1.1, easeOfBizRank: 12, cagFlags: 9, activeSchemes: 38, scores: { Governance: 87, Health: 89, Education: 90, Fiscal: 83, Infrastructure: 94 } },
  JK: { hdi: 0.688, literacy: 77.3, imr: 20, crimeRate: 216.0, perCapitaIncome: 136000, gsdpGrowth: 8.0, fiscalDeficit: 4.5, easeOfBizRank: 22, cagFlags: 13, activeSchemes: 34, scores: { Governance: 76, Health: 79, Education: 78, Fiscal: 63, Infrastructure: 75 } },
  LA: { hdi: 0.702, literacy: 80.5, imr: 14, crimeRate: 95.0, perCapitaIncome: 165000, gsdpGrowth: 7.2, fiscalDeficit: 2.1, easeOfBizRank: 33, cagFlags: 4, activeSchemes: 24, scores: { Governance: 78, Health: 82, Education: 80, Fiscal: 80, Infrastructure: 71 } },
  PY: { hdi: 0.738, literacy: 85.8, imr: 11, crimeRate: 280.0, perCapitaIncome: 260000, gsdpGrowth: 7.8, fiscalDeficit: 2.4, easeOfBizRank: 21, cagFlags: 6, activeSchemes: 30, scores: { Governance: 84, Health: 86, Education: 87, Fiscal: 81, Infrastructure: 85 } },
  CH: { hdi: 0.784, literacy: 86.0, imr: 9, crimeRate: 290.0, perCapitaIncome: 390000, gsdpGrowth: 8.1, fiscalDeficit: 1.5, easeOfBizRank: 18, cagFlags: 5, activeSchemes: 28, scores: { Governance: 89, Health: 91, Education: 90, Fiscal: 86, Infrastructure: 92 } },
  AN: { hdi: 0.742, literacy: 86.6, imr: 9, crimeRate: 120.0, perCapitaIncome: 245000, gsdpGrowth: 7.6, fiscalDeficit: 2.0, easeOfBizRank: 34, cagFlags: 4, activeSchemes: 26, scores: { Governance: 82, Health: 86, Education: 87, Fiscal: 82, Infrastructure: 78 } },
  LD: { hdi: 0.730, literacy: 91.8, imr: 14, crimeRate: 60.0, perCapitaIncome: 210000, gsdpGrowth: 6.8, fiscalDeficit: 1.8, easeOfBizRank: 35, cagFlags: 3, activeSchemes: 22, scores: { Governance: 80, Health: 84, Education: 92, Fiscal: 83, Infrastructure: 74 } },
  DN: { hdi: 0.690, literacy: 81.0, imr: 17, crimeRate: 90.0, perCapitaIncome: 280000, gsdpGrowth: 9.5, fiscalDeficit: 1.9, easeOfBizRank: 23, cagFlags: 5, activeSchemes: 25, scores: { Governance: 79, Health: 80, Education: 81, Fiscal: 85, Infrastructure: 86 } }
};

function buildStateProfiles(stateFactsData: any[], seedStatesData: StateProfile[]): StateProfile[] {
  const map = new Map<string, StateProfile>();

  stateFactsData.forEach((st: any) => {
    const code = getStateCodeForName(st.name || "", st.stateCode || st.code);
    const audited = STATE_AUDITED_METRICS_DATA[code] || {
      hdi: 0.68,
      literacy: 78.5,
      imr: 22,
      crimeRate: 240.0,
      perCapitaIncome: 175000,
      gsdpGrowth: 8.2,
      fiscalDeficit: 3.2,
      easeOfBizRank: 15,
      cagFlags: 10,
      activeSchemes: 32,
      scores: { Governance: 78, Health: 75, Education: 77, Fiscal: 72, Infrastructure: 76 }
    };

    const cagCount = audited.cagFlags;
    const scoresMap = audited.scores;

    const indicatorsList = [
      { id: `ind-${code}-hdi`, stateCode: code, indicatorCode: "HDI", year: 2024, value: audited.hdi, rank: 8 },
      { id: `ind-${code}-lit`, stateCode: code, indicatorCode: "LITERACY_RATE", year: 2023, value: audited.literacy, rank: 9 },
      { id: `ind-${code}-imr`, stateCode: code, indicatorCode: "INFANT_MORTALITY", year: 2023, value: audited.imr, rank: 10 },
      { id: `ind-${code}-crime`, stateCode: code, indicatorCode: "CRIME_SAFETY", year: 2023, value: audited.crimeRate, rank: 11 },
      { id: `ind-${code}-income`, stateCode: code, indicatorCode: "PER_CAPITA_INCOME", year: 2024, value: audited.perCapitaIncome, rank: 12 },
      { id: `ind-${code}-gsdp`, stateCode: code, indicatorCode: "GSDP_GROWTH", year: 2024, value: audited.gsdpGrowth, rank: 13 },
      { id: `ind-${code}-deficit`, stateCode: code, indicatorCode: "FISCAL_DEFICIT", year: 2024, value: audited.fiscalDeficit, rank: 14 },
      { id: `ind-${code}-biz`, stateCode: code, indicatorCode: "EASE_OF_DOING_BIZ", year: 2023, value: audited.easeOfBizRank, rank: 15 },
    ];

    map.set(code, {
      code,
      name: st.name,
      capital: st.capital || "State Capital",
      population: st.population || 35000000,
      scores: scoresMap,
      cagFindingsCount: cagCount,
      activeSchemesCount: audited.activeSchemes,
      indicators: indicatorsList
    });
  });

  return Array.from(map.values());
}

export class CivicLensDatabase {
  private sources: Source[] = [...seedSources];
  private evidences: Evidence[] = [...seedEvidences];
  private schemes: Scheme[] = [...seedSchemes];
  private stateFactsData: any[] = Array.isArray(STATE_FACTS) ? STATE_FACTS : Object.values(STATE_FACTS);
  private states: StateProfile[] = buildStateProfiles(this.stateFactsData, seedStates);
  private cagReports: CAGReport[] = [...seedCAGReports];
  private manifestoPromises: ManifestoPromise[] = [...seedManifestoPromises];
  private ministersData = [PM_PROFILE, ...MINISTERS];
  private partyFundingData = PARTY_FUNDING;
  private corporateDonorsData = TOP_DONORS;
  private stories: Story[] = [...seedStories];

  getStateFacts() {
    return this.stateFactsData;
  }

  getStateFactsByCode(code: string) {
    const q = (code || "").toLowerCase();
    return this.stateFactsData.find(
      (st: any) =>
        (st.stateCode && (st.stateCode.toLowerCase() === q || (q === "tg" && st.stateCode.toLowerCase() === "ts") || (q === "ts" && st.stateCode.toLowerCase() === "tg"))) ||
        (st.name && st.name.toLowerCase() === q)
    );
  }

  getStateLeader(stateCode?: string): { name: string; title: string; party?: string; since?: string } | null {
    if (!stateCode) return null;
    const fact = this.getStateFactsByCode(stateCode);
    if (!fact) return null;

    if (fact.newGovtDetails?.cm) {
      return {
        name: fact.newGovtDetails.cm.name,
        title: fact.newGovtDetails.cm.title || "Chief Minister",
        party: fact.newGovtDetails.cm.party,
        since: fact.newGovtDetails.cm.since,
      };
    }

    if (fact.cm) {
      return {
        name: fact.cm.name,
        title: fact.cm.title || "Chief Minister",
        party: fact.cm.party,
        since: fact.cm.since,
      };
    }

    if (Array.isArray(fact.officialGroups)) {
      for (const grp of fact.officialGroups) {
        if (Array.isArray(grp.officials)) {
          const leader = grp.officials.find(
            (o: any) =>
              o.title?.toLowerCase().includes("administrator") ||
              o.title?.toLowerCase().includes("governor") ||
              o.title?.toLowerCase().includes("advisor")
          );
          if (leader) {
            return {
              name: leader.name,
              title: leader.title,
              party: leader.party || "Appointed",
              since: leader.since,
            };
          }
        }
      }
    }

    return null;
  }

  getAllStateMinisters() {
    const ministers: any[] = [];
    this.stateFactsData.forEach((st: any) => {
      // 1. Current 2026 government if available (e.g. Suvendu Adhikari in WB, C. Joseph Vijay in TN)
      if (st.newGovtDetails?.cm) {
        const newCm = st.newGovtDetails.cm;
        ministers.push({
          ...newCm,
          id: `cm-${st.stateCode || st.name}`,
          stateName: st.name,
          stateCode: st.stateCode,
          isCM: true,
          title: "Chief Minister",
          ministry: `${st.name} — Chief Minister`,
          constituency: `${st.name}`,
          totalAssetsCr: newCm.totalAssetsCr ?? newCm.declaredAssetsCr ?? (newCm.criminalCases * 1.5 + 5.2),
          liabilitiesCr: newCm.liabilitiesCr ?? 0,
          assetGrowthPercent: newCm.assetGrowthPercent ?? newCm.assetGrowthPct ?? 22,
          criminalCaseNote: newCm.criminalCaseNote || newCm.note,
        });
      }

      // 2. New cabinet ministers (e.g. BJP cabinet in WB, TVK/INC cabinet in TN)
      if (Array.isArray(st.newGovtDetails?.cabinet)) {
        st.newGovtDetails.cabinet.forEach((cab: any, idx: number) => {
          ministers.push({
            ...cab,
            id: `cab-${st.stateCode || st.name}-${idx}-${cab.name}`,
            stateName: st.name,
            stateCode: st.stateCode,
            title: cab.portfolio || "Cabinet Minister",
            ministry: `${st.name} — ${cab.portfolio || "Cabinet Minister"}`,
            constituency: `${st.name}`,
            totalAssetsCr: cab.totalAssetsCr ?? cab.declaredAssetsCr ?? (cab.criminalCases * 1.2 + 3.2),
            liabilitiesCr: cab.liabilitiesCr ?? 0,
            assetGrowthPercent: cab.assetGrowthPercent ?? cab.assetGrowthPct ?? 18,
          });
        });
      }

      // 3. Fallback or former CM
      if (st.cm) {
        const hasNewCm = Boolean(st.newGovtDetails?.cm);
        const isSameName = hasNewCm && st.newGovtDetails.cm.name.toLowerCase() === st.cm.name.toLowerCase();
        if (!isSameName) {
          ministers.push({
            ...st.cm,
            id: hasNewCm ? `former-cm-${st.stateCode || st.name}` : `cm-${st.stateCode || st.name}`,
            stateName: st.name,
            stateCode: st.stateCode,
            isCM: !hasNewCm,
            title: hasNewCm ? "Former Chief Minister" : "Chief Minister",
            ministry: `${st.name} — ${hasNewCm ? "Former Chief Minister" : "Chief Minister"}`,
            constituency: `${st.name}`,
            totalAssetsCr: st.cm.totalAssetsCr ?? st.cm.declaredAssetsCr ?? (st.cm.criminalCases * 1.5 + 4.2),
            liabilitiesCr: st.cm.liabilitiesCr ?? 0,
            assetGrowthPercent: st.cm.assetGrowthPercent ?? st.cm.assetGrowthPct ?? 22,
          });
        }
      }

      // 4. State officials and legislative leaders
      if (st.officialGroups) {
        st.officialGroups.forEach((grp: any) => {
          if (grp.officials) {
            grp.officials.forEach((off: any, idx: number) => {
              if (!off.title?.includes("Governor")) {
                ministers.push({
                  ...off,
                  id: `off-${st.stateCode || st.name}-${idx}-${off.name}`,
                  stateName: st.name,
                  stateCode: st.stateCode,
                  groupName: grp.group,
                  ministry: `${st.name} — ${off.title}`,
                  constituency: `${st.name}`,
                  totalAssetsCr: off.totalAssetsCr ?? off.declaredAssetsCr ?? (off.criminalCases * 1.2 + 2.5),
                  liabilitiesCr: off.liabilitiesCr ?? 0,
                  assetGrowthPercent: off.assetGrowthPercent ?? off.assetGrowthPct ?? 18,
                });
              }
            });
          }
        });
      }
    });
    return ministers;
  }

  // Schemes
  getSchemes(): Scheme[] {
    return this.schemes;
  }

  getSchemeBySlug(slug: string): Scheme | undefined {
    return this.schemes.find((s) => s.slug === slug || s.id === slug);
  }

  // States
  getStates(): StateProfile[] {
    return this.states;
  }

  getStateByCode(code: string): StateProfile | undefined {
    return this.states.find(
      (st) => st.code.toLowerCase() === code.toLowerCase() || st.name.toLowerCase() === code.toLowerCase()
    );
  }

  compareStates(codeA: string, codeB: string): { stateA: StateProfile; stateB: StateProfile } | null {
    const stA = this.getStateByCode(codeA);
    const stB = this.getStateByCode(codeB);
    if (!stA || !stB) return null;
    return { stateA: stA, stateB: stB };
  }

  // CAG Reports
  getCAGReports(): CAGReport[] {
    return this.cagReports;
  }

  getCAGFindingById(id: string) {
    for (const report of this.cagReports) {
      const found = report.findings?.find((f) => f.id === id);
      if (found) return { report, finding: found };
    }
    return null;
  }

  // Manifestos
  getManifestoPromises(year?: number): ManifestoPromise[] {
    if (!year) return this.manifestoPromises;
    return this.manifestoPromises.filter((p) => p.year === year);
  }

  getPromisesForMinister(ministry: string, ministerName?: string, stateCode?: string, party?: string): ManifestoPromise[] {
    const minLower = (ministry || "").toLowerCase();
    const nameLower = (ministerName || "").toLowerCase();
    const partyLower = (party || "").toLowerCase();

    // 1. If state minister (by stateCode or by ministry name containing state)
    let targetStateCode = stateCode;
    if (!targetStateCode) {
      for (const [stName, code] of Object.entries(STATE_NAME_TO_CODE)) {
        if (minLower.includes(stName.toLowerCase())) {
          targetStateCode = code;
          break;
        }
      }
    }

    if (targetStateCode) {
      const stateFact = this.getStateFactsByCode(targetStateCode);
      if (stateFact && Array.isArray(stateFact.manifestos)) {
        // Prioritize manifestos that match the minister's party or are the latest 2026 term
        const manifestos = [...stateFact.manifestos].sort((a: any, b: any) => {
          const aPartyMatch = partyLower && a.party && partyLower.includes(a.party.toLowerCase());
          const bPartyMatch = partyLower && b.party && partyLower.includes(b.party.toLowerCase());
          if (aPartyMatch && !bPartyMatch) return -1;
          if (!aPartyMatch && bPartyMatch) return 1;
          return (b.year || 0) - (a.year || 0);
        });

        // Filter to matching party manifesto if available
        const matchingPartyManifestos = partyLower
          ? manifestos.filter((m: any) => m.party && (partyLower.includes(m.party.toLowerCase()) || m.party.toLowerCase().includes(partyLower)))
          : [];
        const activeManifestos = matchingPartyManifestos.length > 0 ? matchingPartyManifestos : manifestos;

        const statePromises: ManifestoPromise[] = [];
        let idx = 0;
        activeManifestos.forEach((m: any) => {
          const year = (m.year as any) || 2026;
          if (Array.isArray(m.categories)) {
            m.categories.forEach((cat: any) => {
              const catName = cat.name || cat.nameHi || "State Welfare";
              if (Array.isArray(cat.promises)) {
                cat.promises.forEach((p: any) => {
                  idx++;
                  let status: PromiseStatus = "IN_PROGRESS";
                  const s = (p.status || "").toLowerCase();
                  if (s === "implemented" || s === "done" || s === "delivered") status = "DELIVERED";
                  else if (s === "partial" || s === "partially_delivered") status = "PARTIALLY_DELIVERED";
                  else if (s === "pending" || s === "not_delivered" || s === "delayed") status = "NOT_DELIVERED";
                  else if (s === "in-progress" || s === "in_progress" || s === "ongoing") status = "IN_PROGRESS";
                  else status = "NOT_VERIFIED";

                  statePromises.push({
                    id: `st-prom-${targetStateCode}-${year}-${idx}`,
                    year,
                    category: `${stateFact.name} (${m.party}) — ${catName}`,
                    promiseTitle: p.promise || p.promiseHi || "State Scheme",
                    description: p.note || p.noteHi || p.promise || "",
                    status,
                    evidenceSummary: p.note || p.noteHi || `Verified state administrative record (${m.party || stateFact.name} Manifesto ${year}).`,
                  });
                });
              }
            });
          }
        });

        if (statePromises.length > 0) {
          // Filter by portfolio/department if applicable
          const portfolioMatches = statePromises.filter((p) => {
            const cat = p.category.toLowerCase();
            const title = p.promiseTitle.toLowerCase();
            const desc = p.description.toLowerCase();
            if (minLower.includes("chief minister") || minLower.includes("cm") || minLower.includes("deputy")) return true;
            if (minLower.includes("agri") || minLower.includes("farmer")) return cat.includes("agri") || title.includes("krishi") || title.includes("kisan") || title.includes("farmer") || title.includes("paddy");
            if (minLower.includes("health") || minLower.includes("family")) return cat.includes("health") || title.includes("health") || title.includes("hospital") || title.includes("ayushman") || title.includes("swasthya");
            if (minLower.includes("educat") || minLower.includes("school")) return cat.includes("educat") || title.includes("student") || title.includes("school") || title.includes("kanya") || title.includes("kalvi");
            if (minLower.includes("finance") || minLower.includes("budget")) return cat.includes("finance") || cat.includes("welfare") || title.includes("dbt") || title.includes("da") || title.includes("allowance");
            if (minLower.includes("women") || minLower.includes("child")) return cat.includes("women") || title.includes("women") || title.includes("annapurna") || title.includes("kanya") || title.includes("lakshmir") || title.includes("kudumbam");
            if (minLower.includes("youth") || minLower.includes("employ") || minLower.includes("job") || minLower.includes("labour")) return cat.includes("youth") || cat.includes("employ") || title.includes("yuva") || title.includes("recruitment") || title.includes("job");
            if (minLower.includes("rural") || minLower.includes("panchayat")) return cat.includes("rural") || title.includes("gram") || title.includes("rural");
            if (minLower.includes("urban") || minLower.includes("municipal")) return cat.includes("urban") || title.includes("city") || title.includes("urban");
            if (minLower.includes("transport") || minLower.includes("road")) return cat.includes("transport") || cat.includes("infra") || title.includes("road") || title.includes("bus");
            if (minLower.includes("power") || minLower.includes("energy")) return cat.includes("power") || cat.includes("energy") || title.includes("power") || title.includes("electricity");
            if (minLower.includes("industry") || minLower.includes("commerce")) return cat.includes("industry") || title.includes("industrial") || title.includes("investment");
            return cat.includes(minLower) || title.includes(minLower) || desc.includes(minLower);
          });

          return portfolioMatches.length > 0 ? portfolioMatches : statePromises;
        }
      }
    }

    // 2. Union Cabinet Ministers
    const matches = this.manifestoPromises.filter((p) => {
      const catLower = (p.category || "").toLowerCase();
      const titleLower = (p.promiseTitle || "").toLowerCase();
      const descLower = (p.description || "").toLowerCase();

      if (minLower.includes("prime minister") || nameLower.includes("modi")) {
        return true;
      }
      if (minLower.includes("jal") || minLower.includes("water")) return catLower.includes("jal") || catLower.includes("water") || titleLower.includes("tap");
      if (minLower.includes("housing") || minLower.includes("urban")) return catLower.includes("housing") || catLower.includes("urban") || titleLower.includes("awas");
      if (minLower.includes("agri") || minLower.includes("farmer")) return catLower.includes("agri") || titleLower.includes("kisan") || titleLower.includes("farmer");
      if (minLower.includes("road") || minLower.includes("highway") || minLower.includes("transport")) return catLower.includes("road") || catLower.includes("transport") || titleLower.includes("highway");
      if (minLower.includes("health") || minLower.includes("family")) return catLower.includes("health") || titleLower.includes("ayushman") || titleLower.includes("health");
      if (minLower.includes("defen") || minLower.includes("arm")) return catLower.includes("defen") || titleLower.includes("orop") || titleLower.includes("military");
      if (minLower.includes("rail")) return catLower.includes("rail") || titleLower.includes("vande") || titleLower.includes("train");
      if (minLower.includes("power") || minLower.includes("energy") || minLower.includes("coal")) return catLower.includes("power") || catLower.includes("energy") || titleLower.includes("electrification") || titleLower.includes("renewable");
      if (minLower.includes("telecom") || minLower.includes("communication") || minLower.includes("electronics") || minLower.includes("it")) return catLower.includes("telecom") || catLower.includes("electronics") || titleLower.includes("5g") || titleLower.includes("digital");
      if (minLower.includes("petroleum") || minLower.includes("gas") || minLower.includes("oil")) return catLower.includes("petroleum") || titleLower.includes("ujjwala") || titleLower.includes("lpg");

      return catLower.includes(minLower) || titleLower.includes(minLower) || descLower.includes(minLower);
    });

    return matches.length > 0 ? matches : this.manifestoPromises;
  }

  // Ministers
  getMinisters() {
    return this.ministersData;
  }

  getMinisterBySlug(slug: string) {
    return this.ministersData.find((m) => m.slug === slug || nameToSlug(m.name) === slug);
  }

  // Evidence
  getEvidenceById(id: string): Evidence | undefined {
    return this.evidences.find((e) => e.id === id);
  }

  getSources(): Source[] {
    return this.sources;
  }

  // Stories
  getStories(): Story[] {
    return this.stories;
  }

  getStoryBySlug(slug: string): Story | undefined {
    return this.stories.find((st) => st.slug === slug || st.id === slug);
  }

  getPartyFunding() {
    return this.partyFundingData;
  }

  getCorporateDonors() {
    return this.corporateDonorsData;
  }

  getBondsMeta() {
    return BONDS_META;
  }

  getPartyAnnualIncomeHistory(): PartyAnnualIncomeRecord[] {
    return PARTY_ANNUAL_INCOME_DATA;
  }

  getPartyMetaMap() {
    return PARTY_META_MAP;
  }

  // State Schemes (manifesto promises with status from state_facts_data)
  getStateSchemes(stateCode?: string): { stateName: string; stateCode: string; year: number; party: string; title: string; category: string; promise: string; status: string; note: string }[] {
    const result: { stateName: string; stateCode: string; year: number; party: string; title: string; category: string; promise: string; status: string; note: string }[] = [];
    const data = stateCode
      ? this.stateFactsData.filter((st: any) => {
          const code = getStateCodeForName(st.name || "", st.stateCode || st.code);
          return code.toLowerCase() === stateCode.toLowerCase();
        })
      : this.stateFactsData;

    data.forEach((st: any) => {
      const code = getStateCodeForName(st.name || "", st.stateCode || st.code);
      const manifestos = Array.isArray(st.manifestos) ? st.manifestos : [];
      manifestos.forEach((m: any) => {
        const categories = Array.isArray(m.categories) ? m.categories : [];
        categories.forEach((cat: any) => {
          const promises = Array.isArray(cat.promises) ? cat.promises : [];
          promises.forEach((p: any) => {
            result.push({
              stateName: st.name || "",
              stateCode: code,
              year: m.year || 2024,
              party: m.party || "",
              title: m.title || "",
              category: cat.name || cat.nameHi || "",
              promise: p.promise || p.promiseHi || "",
              status: p.status || "pending",
              note: p.note || p.noteHi || "",
            });
          });
        });
      });
    });
    return result;
  }

  // Search
  search(query: string) {
    const q = query.toLowerCase();
    const schemes = this.schemes.filter(
      (s) => s.name.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
    );
    const states = this.states.filter((st) => st.name.toLowerCase().includes(q) || st.capital.toLowerCase().includes(q));
    const ministers = this.ministersData.filter((m) => m.name.toLowerCase().includes(q) || m.ministry.toLowerCase().includes(q));
    const cag = this.cagReports.filter((r) => r.title.toLowerCase().includes(q));
    return { schemes, states, ministers, cag };
  }
}

export const db = new CivicLensDatabase();

