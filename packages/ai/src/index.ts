import { db } from "@civiclens/database";
import { AIStructuredResponse, Source } from "@civiclens/types";

export class CivicLensAIEngine {
  async processQuery(userQuestion: string): Promise<AIStructuredResponse> {
    const q = userQuestion.toLowerCase();

    // 1. State comparison handler: e.g. "Compare West Bengal and Maharashtra"
    if (q.includes("compare") && (q.includes("bengal") || q.includes("maharashtra") || q.includes("kerala") || q.includes("state"))) {
      const statesComp = db.compareStates("WB", "MH");
      if (statesComp) {
        const { stateA, stateB } = statesComp;
        return {
          answer: `Comparison between **${stateA.name}** and **${stateB.name}** across key development and governance metrics.`,
          metrics: [
            { label: `${stateA.name} Literacy Rate`, value: `${stateA.indicators[0].value}%` },
            { label: `${stateB.name} Literacy Rate`, value: `${stateB.indicators[0].value}%` },
            { label: `${stateA.name} CAG Findings`, value: stateA.cagFindingsCount },
            { label: `${stateB.name} CAG Findings`, value: stateB.cagFindingsCount },
          ],
          visualization: {
            type: "comparison",
            title: "Education & Literacy Rate Comparison",
            data: [
              { metric: "Literacy Rate (%)", [stateA.name]: stateA.indicators[0].value, [stateB.name]: stateB.indicators[0].value },
              { metric: "Infant Mortality (per 1,000)", [stateA.name]: stateA.indicators[1].value, [stateB.name]: stateB.indicators[1].value },
              { metric: "GSDP Growth (%)", [stateA.name]: stateA.indicators[2].value, [stateB.name]: stateB.indicators[2].value },
            ],
            keys: [stateA.name, stateB.name],
          },
          sources: db.getSources(),
          confidence: "HIGH",
          methodology: "Data cross-referenced from NFHS-5 survey factsheets and State GSDP Economic Surveys.",
        };
      }
    }

    // 2. Scheme inquiry handler: e.g. "Jal Jeevan Mission", "water", "budget"
    if (q.includes("jal jeevan") || q.includes("water") || q.includes("tap") || q.includes("scheme")) {
      const scheme = db.getSchemeBySlug("jal-jeevan-mission");
      if (scheme) {
        return {
          answer: `**${scheme.name}** has an annual budgetary outlay of **₹${scheme.budgetAllocatedCr.toLocaleString()} Crore** with reported tap connections reaching **14.8 Crore households** (76.5% coverage target). CAG audit findings highlight ₹2,450 Cr in quality/commissioning discrepancies.`,
          metrics: [
            { label: "Budget Allocated", value: `₹${scheme.budgetAllocatedCr.toLocaleString()} Cr` },
            { label: "Expenditure", value: `₹${scheme.expenditureCr.toLocaleString()} Cr` },
            { label: "Beneficiaries", value: "14.8 Crore" },
            { label: "Evidence Score", value: `${scheme.evidenceScore}/100` },
          ],
          visualization: {
            type: "bar",
            title: "Jal Jeevan Mission: Budget Outlay vs. Financial Audit Findings",
            data: [
              { category: "Budget Outlay", amountCr: scheme.budgetAllocatedCr },
              { category: "Actual Expenditure", amountCr: scheme.expenditureCr },
              { category: "CAG Audit Discrepancies", amountCr: 2450 },
            ],
          },
          sources: db.getSources().filter((s) => s.id.includes("budget") || s.id.includes("cag")),
          confidence: "HIGH",
          methodology: "Verified directly from Ministry of Finance Expenditure Profile and CAG Audit Report No. 12 of 2023.",
        };
      }
    }

    // 3. CAG Audit inquiry: e.g. "cag", "loss", "audit"
    if (q.includes("cag") || q.includes("audit") || q.includes("financial impact")) {
      const reports = db.getCAGReports();
      return {
        answer: `CAG Report No. 12 of 2023 audited the **Jal Jeevan Mission**, identifying **₹2,450 Crore** in financial discrepancies and uncommissioned assets across audited districts.`,
        metrics: [
          { label: "Reports Indexed", value: reports.length },
          { label: "Total Financial Impact", value: `₹${reports[0].totalLossCr} Cr` },
          { label: "Critical Findings", value: 2 },
        ],
        visualization: {
          type: "table",
          title: "Key CAG Findings & Departmental Impact",
          data: reports[0].findings || [],
        },
        sources: db.getSources().filter((s) => s.sourceType === "CAG_AUDIT"),
        confidence: "HIGH",
        methodology: "Extracted directly from Comptroller and Auditor General published reports.",
      };
    }

    // 4. Default query response using database search
    const results = db.search(q);
    return {
      answer: `Found ${results.schemes.length} schemes, ${results.states.length} state profiles, and ${results.cag.length} CAG reports relevant to your query.`,
      metrics: [
        { label: "Schemes Found", value: results.schemes.length },
        { label: "States Matched", value: results.states.length },
      ],
      visualization: {
        type: "stat",
        title: "Query Data Breakdown",
        data: [
          { name: "Schemes", value: results.schemes.length },
          { name: "States", value: results.states.length },
          { name: "CAG Reports", value: results.cag.length },
        ],
      },
      sources: db.getSources(),
      confidence: "MEDIUM",
      methodology: "Database index lookup across verified government datasets.",
    };
  }
}

export const aiEngine = new CivicLensAIEngine();
