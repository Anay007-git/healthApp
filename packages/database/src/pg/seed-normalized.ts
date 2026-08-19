import type { Pool } from "pg";
import type { DatasetKey } from "./datasets";

type Snapshot = Record<DatasetKey, unknown>;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function seedNormalizedTables(pool: Pool, snapshot: Snapshot): Promise<void> {
  await pool.query("TRUNCATE TABLE corporate_donors RESTART IDENTITY");
  await pool.query("TRUNCATE TABLE party_annual_income RESTART IDENTITY");

  const sources = asArray<Record<string, unknown>>(snapshot.sources);
  for (const source of sources) {
    await pool.query(
      `INSERT INTO sources (id, name, publisher, url, publication_date, source_type, document_url, page_number, is_official)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         publisher = EXCLUDED.publisher,
         url = EXCLUDED.url,
         publication_date = EXCLUDED.publication_date,
         source_type = EXCLUDED.source_type,
         document_url = EXCLUDED.document_url,
         page_number = EXCLUDED.page_number,
         is_official = EXCLUDED.is_official`,
      [
        source.id,
        source.name,
        source.publisher,
        source.url ?? null,
        source.publicationDate ?? null,
        source.sourceType,
        source.documentUrl ?? null,
        source.pageNumber ?? null,
        source.isOfficial ?? true,
      ]
    );
  }

  const evidences = asArray<Record<string, unknown>>(snapshot.evidences);
  const evidenceIds = new Set(evidences.map((evidence) => String(evidence.id)));
  const validEvidenceId = (value: unknown): string | null => {
    if (!value) return null;
    const id = String(value);
    return evidenceIds.has(id) ? id : null;
  };

  for (const evidence of evidences) {
    await pool.query(
      `INSERT INTO evidences (id, claim, evidence_summary, source_id, document_id, page_number, methodology, verification_status, verified_at, verified_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         claim = EXCLUDED.claim,
         evidence_summary = EXCLUDED.evidence_summary,
         source_id = EXCLUDED.source_id,
         document_id = EXCLUDED.document_id,
         page_number = EXCLUDED.page_number,
         methodology = EXCLUDED.methodology,
         verification_status = EXCLUDED.verification_status,
         verified_at = EXCLUDED.verified_at,
         verified_by = EXCLUDED.verified_by`,
      [
        evidence.id,
        evidence.claim,
        evidence.evidenceSummary,
        evidence.sourceId ?? null,
        evidence.documentId ?? null,
        evidence.pageNumber ?? null,
        evidence.methodology ?? null,
        evidence.verificationStatus ?? "VERIFIED",
        evidence.verifiedAt ?? null,
        evidence.verifiedBy ?? null,
      ]
    );
  }

  const schemes = asArray<Record<string, unknown>>(snapshot.schemes);
  for (const scheme of schemes) {
    await pool.query(
      `INSERT INTO schemes (
        id, slug, name, hindi_name, ministry, launch_year, budget_allocated_cr,
        expenditure_cr, beneficiaries_count, coverage_target, cag_verdict, evidence_score, summary
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        hindi_name = EXCLUDED.hindi_name,
        ministry = EXCLUDED.ministry,
        launch_year = EXCLUDED.launch_year,
        budget_allocated_cr = EXCLUDED.budget_allocated_cr,
        expenditure_cr = EXCLUDED.expenditure_cr,
        beneficiaries_count = EXCLUDED.beneficiaries_count,
        coverage_target = EXCLUDED.coverage_target,
        cag_verdict = EXCLUDED.cag_verdict,
        evidence_score = EXCLUDED.evidence_score,
        summary = EXCLUDED.summary`,
      [
        scheme.id,
        scheme.slug,
        scheme.name,
        scheme.hindiName ?? null,
        scheme.ministry,
        scheme.launchYear,
        scheme.budgetAllocatedCr,
        scheme.expenditureCr,
        scheme.beneficiariesCount ?? 0,
        scheme.coverageTarget ?? "",
        scheme.cagVerdict ?? "UNAUDITED",
        scheme.evidenceScore ?? 85,
        scheme.summary,
      ]
    );

    const pipeline = asArray<Record<string, unknown>>(scheme.pipeline);
    for (const step of pipeline) {
      await pool.query(
        `INSERT INTO scheme_milestones (id, scheme_id, stage, title, description, amount_cr, milestone_date, evidence_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET
           scheme_id = EXCLUDED.scheme_id,
           stage = EXCLUDED.stage,
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           amount_cr = EXCLUDED.amount_cr,
           milestone_date = EXCLUDED.milestone_date,
           evidence_id = EXCLUDED.evidence_id`,
        [
          step.id,
          scheme.id,
          step.stage,
          step.title,
          step.description,
          step.amountCr ?? null,
          step.date,
          validEvidenceId(step.evidenceId),
        ]
      );
    }
  }

  const stateFacts = asArray<Record<string, unknown>>(snapshot.state_facts);
  for (const st of stateFacts) {
    const code = String(st.stateCode || st.code || "").toUpperCase();
    if (!code) continue;
    await pool.query(
      `INSERT INTO state_facts (state_code, state_name, payload)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (state_code) DO UPDATE SET
         state_name = EXCLUDED.state_name,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [code, st.name || code, JSON.stringify(st)]
    );
  }

  const states = asArray<Record<string, unknown>>(snapshot.states);
  const stateCodes = new Set(states.map((state) => String(state.code).toUpperCase()));
  const validStateCode = (value: unknown): string | null => {
    if (!value) return null;
    const code = String(value).toUpperCase();
    return stateCodes.has(code) ? code : null;
  };

  for (const state of states) {
    const fact = stateFacts.find((st) => String(st.stateCode || st.code || "").toUpperCase() === String(state.code).toUpperCase());
    const cm = (fact?.cm as Record<string, unknown> | undefined) || (fact?.newGovtDetails as Record<string, unknown> | undefined)?.cm as Record<string, unknown> | undefined;

    await pool.query(
      `INSERT INTO states (
        code, name, capital, population, chief_minister, cm_party, scores,
        cag_findings_count, active_schemes_count
      ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9)
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        capital = EXCLUDED.capital,
        population = EXCLUDED.population,
        chief_minister = EXCLUDED.chief_minister,
        cm_party = EXCLUDED.cm_party,
        scores = EXCLUDED.scores,
        cag_findings_count = EXCLUDED.cag_findings_count,
        active_schemes_count = EXCLUDED.active_schemes_count`,
      [
        state.code,
        state.name,
        state.capital ?? "State Capital",
        state.population ?? 0,
        cm?.name ?? null,
        cm?.party ?? null,
        JSON.stringify(state.scores ?? {}),
        state.cagFindingsCount ?? 0,
        state.activeSchemesCount ?? 0,
      ]
    );

    const indicators = asArray<Record<string, unknown>>(state.indicators);
    for (const indicator of indicators) {
      await pool.query(
        `INSERT INTO state_indicators (id, state_code, indicator_code, indicator_name, category, year, value, rank, unit, higher_is_better)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO UPDATE SET
           state_code = EXCLUDED.state_code,
           indicator_code = EXCLUDED.indicator_code,
           indicator_name = EXCLUDED.indicator_name,
           category = EXCLUDED.category,
           year = EXCLUDED.year,
           value = EXCLUDED.value,
           rank = EXCLUDED.rank,
           unit = EXCLUDED.unit,
           higher_is_better = EXCLUDED.higher_is_better`,
        [
          indicator.id,
          state.code,
          indicator.indicatorCode ?? indicator.code ?? "METRIC",
          indicator.indicatorName ?? indicator.name ?? indicator.indicatorCode ?? "Indicator",
          indicator.category ?? "Governance",
          indicator.year ?? 2024,
          indicator.value ?? 0,
          indicator.rank ?? null,
          indicator.unit ?? null,
          indicator.higherIsBetter ?? true,
        ]
      );
    }
  }

  const cagReports = asArray<Record<string, unknown>>(snapshot.cag_reports);
  for (const report of cagReports) {
    await pool.query(
      `INSERT INTO cag_reports (id, title, report_number, year, ministry, state_name, total_loss_cr, document_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         report_number = EXCLUDED.report_number,
         year = EXCLUDED.year,
         ministry = EXCLUDED.ministry,
         state_name = EXCLUDED.state_name,
         total_loss_cr = EXCLUDED.total_loss_cr,
         document_url = EXCLUDED.document_url`,
      [
        report.id,
        report.title,
        report.reportNumber,
        report.year,
        report.ministry,
        report.stateName ?? null,
        report.totalLossCr ?? 0,
        report.documentUrl ?? null,
      ]
    );

    const findings = asArray<Record<string, unknown>>(report.findings);
    for (const finding of findings) {
      await pool.query(
        `INSERT INTO cag_findings (id, report_id, title, department, financial_impact_cr, severity, finding_summary, recommendation, govt_response, status, evidence_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO UPDATE SET
           report_id = EXCLUDED.report_id,
           title = EXCLUDED.title,
           department = EXCLUDED.department,
           financial_impact_cr = EXCLUDED.financial_impact_cr,
           severity = EXCLUDED.severity,
           finding_summary = EXCLUDED.finding_summary,
           recommendation = EXCLUDED.recommendation,
           govt_response = EXCLUDED.govt_response,
           status = EXCLUDED.status,
           evidence_id = EXCLUDED.evidence_id`,
        [
          finding.id,
          report.id,
          finding.title,
          finding.department,
          finding.financialImpactCr ?? 0,
          finding.severity ?? "MEDIUM",
          finding.findingSummary,
          finding.recommendation,
          finding.govtResponse ?? null,
          finding.status ?? "OPEN",
          validEvidenceId(finding.evidenceId),
        ]
      );
    }
  }

  const manifestos = asArray<Record<string, unknown>>(snapshot.manifesto_promises);
  for (const promise of manifestos) {
    const evidenceId = validEvidenceId(promise.evidenceId);
    await pool.query(
      `INSERT INTO manifesto_promises (
        id, state_code, state_name, party, term_year, category, promise_title,
        promise_text, status, evidence_summary, evidence_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (id) DO UPDATE SET
        state_code = EXCLUDED.state_code,
        state_name = EXCLUDED.state_name,
        party = EXCLUDED.party,
        term_year = EXCLUDED.term_year,
        category = EXCLUDED.category,
        promise_title = EXCLUDED.promise_title,
        promise_text = EXCLUDED.promise_text,
        status = EXCLUDED.status,
        evidence_summary = EXCLUDED.evidence_summary,
        evidence_id = EXCLUDED.evidence_id`,
      [
        promise.id,
        validStateCode(promise.stateCode),
        promise.stateName ?? "National",
        promise.party ?? "Union Government",
        promise.year ?? promise.termYear ?? 2019,
        promise.category,
        promise.promiseTitle,
        promise.description ?? promise.promiseText ?? "",
        promise.status ?? "IN_PROGRESS",
        promise.evidenceSummary ?? null,
        evidenceId,
      ]
    );
  }

  const ministers = asArray<Record<string, unknown>>(snapshot.ministers);
  for (const minister of ministers) {
    const slug = String(minister.slug || minister.name || minister.id).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const declaredCases = minister.declaredCases as Record<string, unknown> | undefined;
    const ministerId = minister.id ?? `m-${slug}`;
    await pool.query(
      `INSERT INTO ministers (
        id, slug, name, title, ministry, constituency, party, state_code, state_name,
        total_assets_cr, liabilities_cr, asset_growth_percent, criminal_cases_pending,
        criminal_cases_convicted, declared_cases, affidavit_url, timeline
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,$17::jsonb)
      ON CONFLICT (slug) DO UPDATE SET
        id = EXCLUDED.id,
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        ministry = EXCLUDED.ministry,
        constituency = EXCLUDED.constituency,
        party = EXCLUDED.party,
        state_code = EXCLUDED.state_code,
        state_name = EXCLUDED.state_name,
        total_assets_cr = EXCLUDED.total_assets_cr,
        liabilities_cr = EXCLUDED.liabilities_cr,
        asset_growth_percent = EXCLUDED.asset_growth_percent,
        criminal_cases_pending = EXCLUDED.criminal_cases_pending,
        criminal_cases_convicted = EXCLUDED.criminal_cases_convicted,
        declared_cases = EXCLUDED.declared_cases,
        affidavit_url = EXCLUDED.affidavit_url,
        timeline = EXCLUDED.timeline`,
      [
        ministerId,
        slug,
        minister.name,
        minister.title ?? minister.currentPosition ?? null,
        minister.ministry ?? "Public Office",
        minister.constituency ?? "National",
        minister.party ?? "Independent",
        validStateCode(minister.stateCode),
        minister.stateName ?? null,
        minister.totalAssetsCr ?? minister.declaredAssetsCr ?? 0,
        minister.liabilitiesCr ?? 0,
        minister.assetGrowthPercent ?? minister.assetGrowthPct ?? 0,
        minister.criminalCases ?? declaredCases?.pending ?? 0,
        minister.seriousCriminalCases ?? declaredCases?.convicted ?? 0,
        JSON.stringify(declaredCases ?? { pending: 0, convicted: 0, acquitted: 0, details: [] }),
        minister.affidavitSourceUrl ?? null,
        JSON.stringify(minister.timeline ?? []),
      ]
    );
  }

  const partyFunding = asArray<Record<string, unknown>>(snapshot.party_funding);
  for (const party of partyFunding) {
    const code = String(party.shortName || party.shortCode || party.partyCode || party.party).slice(0, 50);
    await pool.query(
      `INSERT INTO party_funding (party_code, party_name, electoral_bonds_cr, total_funding_cr, percentage_share, color, coalition, ideology)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (party_code) DO UPDATE SET
         party_name = EXCLUDED.party_name,
         electoral_bonds_cr = EXCLUDED.electoral_bonds_cr,
         total_funding_cr = EXCLUDED.total_funding_cr,
         percentage_share = EXCLUDED.percentage_share,
         color = EXCLUDED.color,
         coalition = EXCLUDED.coalition,
         ideology = EXCLUDED.ideology`,
      [
        code,
        party.party ?? party.partyName ?? code,
        party.electoralBondsCr ?? party.bondsAmount ?? party.amount ?? 0,
        party.totalFundingCr ?? party.amount ?? 0,
        party.percentageShare ?? null,
        party.color ?? "#0F172A",
        party.coalition ?? "Other",
        party.ideology ?? null,
      ]
    );
  }

  const donors = asArray<Record<string, unknown>>(snapshot.corporate_donors);
  for (const donor of donors) {
    const breakdown: Record<string, number> = {};
    for (const entry of asArray<Record<string, unknown>>(donor.parties)) {
      const key = String(entry.shortName || entry.party || "Other");
      breakdown[key] = Number(entry.amount ?? 0);
    }

    await pool.query(
      `INSERT INTO corporate_donors (
        donor_rank, donor_name, short_name, sector, amount_cr,
        primary_recipient_party, recipient_breakdown, cag_audit_flag, note
      ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9)`,
      [
        donor.rank ?? 0,
        donor.name,
        donor.shortName ?? null,
        donor.sector ?? "Corporate",
        donor.amount ?? 0,
        asArray<Record<string, unknown>>(donor.parties)[0]?.shortName ?? null,
        JSON.stringify(breakdown),
        donor.cagAuditFlag ?? null,
        donor.note ?? null,
      ]
    );
  }

  const annualIncome = asArray<Record<string, unknown>>(snapshot.party_annual_income);
  for (const row of annualIncome) {
    const partyIncomes: Record<string, number> = {};
    for (const key of ["BJP", "INC", "TMC", "BRS", "BJD", "DMK", "AAP", "CPM", "BSP", "SP", "TDP", "YSRCP", "others"]) {
      if (row[key] !== undefined) {
        partyIncomes[key] = Number(row[key]);
      }
    }

    await pool.query(
      `INSERT INTO party_annual_income (
        year_label, financial_year, era, is_election_year, election_note, event_note, party_incomes, total_cr
      ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8)`,
      [
        row.year,
        row.fy,
        row.era,
        row.isElectionYear ?? false,
        row.electionNote ?? null,
        row.eventNote ?? null,
        JSON.stringify(partyIncomes),
        row.total ?? 0,
      ]
    );
  }

  const stories = asArray<Record<string, unknown>>(snapshot.stories);
  for (const story of stories) {
    await pool.query(
      `INSERT INTO stories (id, slug, title, subtitle, author, published_at, read_time_minutes, cover_image_url, sections)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug,
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         author = EXCLUDED.author,
         published_at = EXCLUDED.published_at,
         read_time_minutes = EXCLUDED.read_time_minutes,
         cover_image_url = EXCLUDED.cover_image_url,
         sections = EXCLUDED.sections`,
      [
        story.id,
        story.slug,
        story.title,
        story.subtitle ?? null,
        story.author,
        story.publishedAt ?? new Date().toISOString(),
        story.readTimeMinutes ?? 5,
        story.coverImageUrl ?? null,
        JSON.stringify(story.sections ?? []),
      ]
    );
  }

  const claims = asArray<Record<string, unknown>>(snapshot.fact_check_claims);
  for (const claim of claims) {
    const slug = String(claim.id || claim.slug || "").replace(/^fc-/, "");
    await pool.query(
      `INSERT INTO fact_check_claims (id, slug, title, claim, category, verdict, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug,
         title = EXCLUDED.title,
         claim = EXCLUDED.claim,
         category = EXCLUDED.category,
         verdict = EXCLUDED.verdict,
         payload = EXCLUDED.payload`,
      [
        claim.id,
        slug || claim.id,
        claim.title,
        claim.claim,
        claim.category,
        claim.verdict,
        JSON.stringify(claim),
      ]
    );
  }
}

export async function printTableCounts(pool: Pool): Promise<void> {
  const tables = [
    "civic_datasets",
    "sources",
    "evidences",
    "schemes",
    "scheme_milestones",
    "states",
    "state_indicators",
    "state_facts",
    "cag_reports",
    "cag_findings",
    "manifesto_promises",
    "ministers",
    "party_funding",
    "corporate_donors",
    "party_annual_income",
    "stories",
    "fact_check_claims",
  ];

  console.log("\nPostgres row counts:");
  for (const table of tables) {
    const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
    console.log(`  ${table.padEnd(22)} ${result.rows[0].count}`);
  }
}
