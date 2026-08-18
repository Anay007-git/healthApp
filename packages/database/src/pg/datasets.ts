import type {
  CAGReport,
  Evidence,
  FactCheckClaim,
  ManifestoPromise,
  MinisterProfile,
  Scheme,
  Source,
  Story,
} from "@civiclens/types";
import type { PartyAnnualIncomeRecord } from "../party_income_history";
import type { StateAuditedMetrics } from "../index";

export const DATASET_KEYS = [
  "sources",
  "evidences",
  "schemes",
  "states",
  "state_facts",
  "state_audited_metrics",
  "cag_reports",
  "manifesto_promises",
  "ministers",
  "stories",
  "party_funding",
  "corporate_donors",
  "party_annual_income",
  "party_meta_map",
  "bonds_meta",
  "fact_check_claims",
  "viral_patterns",
] as const;

export type DatasetKey = (typeof DATASET_KEYS)[number];

export interface CivicDatasetSnapshot {
  sources: Source[];
  evidences: Evidence[];
  schemes: Scheme[];
  states: unknown[];
  state_facts: unknown[];
  state_audited_metrics: Record<string, StateAuditedMetrics>;
  cag_reports: CAGReport[];
  manifesto_promises: ManifestoPromise[];
  ministers: MinisterProfile[];
  stories: Story[];
  party_funding: unknown[];
  corporate_donors: unknown[];
  party_annual_income: PartyAnnualIncomeRecord[];
  party_meta_map: Record<string, unknown>;
  bonds_meta: Record<string, unknown>;
  fact_check_claims: FactCheckClaim[];
  viral_patterns: unknown[];
}

export type CivicDatasetPayload = CivicDatasetSnapshot[DatasetKey];
