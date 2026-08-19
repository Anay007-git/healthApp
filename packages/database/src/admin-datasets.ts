import type { CivicLensDatabase } from "./index";
import type { CAGReport, Scheme, Source } from "@civiclens/types";

export type AdminWorkflowStatus = "DRAFT" | "IN REVIEW" | "VERIFIED" | "PUBLISHED";

export interface AdminCagFindingRow {
  id: string;
  reportTitle: string;
  ministry: string;
  summary: string;
  discrepancyCr: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: AdminWorkflowStatus;
  cagReportNo: string;
  reportId: string;
}

export interface AdminDatasetCounts {
  schemes: number;
  states: number;
  ministers: number;
  stateMinisters: number;
  sources: number;
  evidences: number;
  cagReports: number;
  cagFindings: number;
  manifestoPromises: number;
  stories: number;
  factChecks: number;
  partyFunding: number;
  corporateDonors: number;
  partyAnnualIncome: number;
  stateFacts: number;
  totalCagLossCr: number;
}

export function schemeWorkflowStatus(scheme: Scheme): AdminWorkflowStatus {
  const score = scheme.evidenceScore ?? 0;
  const verdict = scheme.cagVerdict ?? "UNAUDITED";
  if (score >= 88 && verdict !== "CRITICAL_DEFICIT") return "PUBLISHED";
  if (score >= 75) return "VERIFIED";
  if (score >= 55) return "IN REVIEW";
  return "DRAFT";
}

export function sourceWorkflowStatus(source: Source): AdminWorkflowStatus {
  return source.isOfficial ? "PUBLISHED" : "VERIFIED";
}

export function cagFindingWorkflowStatus(status?: string): AdminWorkflowStatus {
  switch (status) {
    case "RESOLVED":
      return "PUBLISHED";
    case "ACTION_TAKEN":
      return "VERIFIED";
    case "UNDER_REVIEW":
      return "IN REVIEW";
    default:
      return "DRAFT";
  }
}

export function flattenCagFindings(reports: CAGReport[]): AdminCagFindingRow[] {
  const rows: AdminCagFindingRow[] = [];
  for (const report of reports) {
    for (const finding of report.findings || []) {
      rows.push({
        id: finding.id,
        reportId: report.id,
        reportTitle: finding.title || report.title,
        ministry: finding.department || report.ministry,
        summary: finding.findingSummary || finding.recommendation || report.title,
        discrepancyCr: finding.financialImpactCr || 0,
        severity: finding.severity || "MEDIUM",
        status: cagFindingWorkflowStatus(finding.status),
        cagReportNo: report.reportNumber,
      });
    }
  }
  return rows;
}

export function buildAdminDatasetsPayload(db: CivicLensDatabase) {
  const schemes = db.getSchemes();
  const cagReports = db.getCAGReports();
  const cagFindings = flattenCagFindings(cagReports);
  const ministers = db.getMinisters();
  const stateMinisters = db.getAllStateMinisters();
  const sources = db.getSources();
  const evidences = db.getEvidences();

  const counts: AdminDatasetCounts = {
    schemes: schemes.length,
    states: db.getStates().length,
    ministers: ministers.length,
    stateMinisters: stateMinisters.length,
    sources: sources.length,
    evidences: evidences.length,
    cagReports: cagReports.length,
    cagFindings: cagFindings.length,
    manifestoPromises: db.getManifestoPromises().length,
    stories: db.getStories().length,
    factChecks: db.getFactChecks().length,
    partyFunding: db.getPartyFunding().length,
    corporateDonors: db.getCorporateDonors().length,
    partyAnnualIncome: db.getPartyAnnualIncomeHistory().length,
    stateFacts: db.getStateFacts().length,
    totalCagLossCr: cagReports.reduce((sum, report) => sum + (report.totalLossCr || 0), 0),
  };

  return {
    dataSource: process.env.DATABASE_URL?.startsWith("postgres") ? "postgresql" : "memory",
    syncedAt: new Date().toISOString(),
    counts,
    data: {
      schemes: schemes.map((scheme) => ({
        ...scheme,
        adminStatus: schemeWorkflowStatus(scheme),
      })),
      sources: sources.map((source) => ({
        ...source,
        adminStatus: sourceWorkflowStatus(source),
      })),
      states: db.getStates(),
      stateFacts: db.getStateFacts(),
      cagReports,
      cagFindings,
      manifestoPromises: db.getManifestoPromises(),
      ministers,
      stateMinisters,
      stories: db.getStories(),
      partyFunding: db.getPartyFunding(),
      corporateDonors: db.getCorporateDonors(),
      partyAnnualIncome: db.getPartyAnnualIncomeHistory(),
      partyMetaMap: db.getPartyMetaMap(),
      bondsMeta: db.getBondsMeta(),
      factChecks: db.getFactChecks(),
      evidences,
      userSubmissions: db.getUserSubmissions(),
    },
  };
}

export type AdminDatasetsPayload = ReturnType<typeof buildAdminDatasetsPayload>;
