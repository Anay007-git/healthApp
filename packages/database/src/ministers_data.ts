import ministersJson from "./ministers_list.json";

export interface MinisterProfile {
  name: string;
  title: string;
  ministry: string;
  party: string;
  since?: string;
  education: string;
  educationScore?: number;
  criminalCases: number;
  seriousCriminalCases?: number;
  criminalCaseNote?: string;
  affidavitYear?: number;
  wikiTitle?: string;
  assetGrowthPct?: number | null;
  assetGrowthNote?: string;
  slug: string;
  controversies?: string[];
  caseLinks?: { label: string; url: string }[];
  declaredAssetsCr?: number;
  declaredAssetsPrevCr?: number;
  declaredAssetsYear?: number;
  declaredAssetsPrevYear?: number;
  officialResidence?: string;
  cagReportIds?: string[];
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/["'()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const PM_PROFILE: MinisterProfile = (ministersJson[0] || {}) as MinisterProfile;
export const MINISTERS: MinisterProfile[] = (ministersJson.slice(1) || []) as MinisterProfile[];
