# Original Architecture Documentation (`JCRYDER3/andhbhakt`)

This document provides a comprehensive technical audit and architectural breakdown of the inherited repository (`https://github.com/JCRYDER3/andhbhakt`) prior to its transformation into **CivicLens**.

---

## 1. Repository Structure & Workspace Layout

The original codebase is structured as a PNPM Monorepo using `pnpm-workspace.yaml`:

```text
andhbhakt/
├── artifacts/
│   ├── api-server/         # Express 5 REST API server
│   ├── govlens/            # React 19 + Vite frontend application
│   └── mockup-sandbox/     # Prototyping sandbox
├── lib/
│   ├── db/                 # Drizzle ORM database schemas & seed.sql
│   ├── api-spec/           # OpenAPI 3.1 specifications & Orval generated hooks
│   ├── api-zod/            # Auto-generated Zod validation schemas
│   ├── api-client-react/   # React Query API client hooks
│   ├── integrations/       # Replit connectors & integrations
│   ├── integrations-openai-ai-server/ # Express OpenAI integration
│   └── integrations-openai-ai-react/  # React OpenAI custom hook
├── scripts/                # Utility scripts & typecheck runners
├── package.json            # Monorepo root configuration
└── pnpm-workspace.yaml     # Workspace declaration
```

---

## 2. Frontend Architecture (`artifacts/govlens`)

* **Framework**: React 19 + Vite 6 + TypeScript 5.9
* **Styling**: Tailwind CSS v3 with dynamic theme variables.
* **Localization**: `i18next` support with static Hindi translations (`cag-reports-hi.json`).
* **State & Data Handling**:
  * Crucially, the platform relied almost entirely on **static TypeScript constants** stored directly inside `artifacts/govlens/src/data/` (e.g., `central-data.tsx`, `state-facts.tsx`, `minister-profile.tsx`).
  * `central-data.tsx` was a single massive **510 KB monolithic file** containing all scheme ratings, CAG audit references, and PIB entries.
  * Pages fetched minimal dynamic database content; dynamic calls were limited to user issue reporting and live news fetching.

### Existing Routes & Pages
1. `/` (`development-index.tsx`) — Civic summary dashboard, scheme scorecards, and key stats.
2. `/schemes` & `/scheme/:id` (`schemes.tsx`, `scheme-detail.tsx`) — Scheme filtering and detailed scorecards (PIB vs CAG).
3. `/state-facts` (`state-facts.tsx`) — State governance scores, infrastructure indicators, and financial management.
4. `/minister-profile` (`minister-profile.tsx`) — Minister affidavits, criminal cases declared, asset growth.
5. `/reports` (`reports.tsx`) — CAG audit reports filterable by state and severity.
6. `/rankings` (`rankings.tsx`) — State performance rankings.
7. `/funding` (`funding.tsx`) — Scheme budget allocation analysis.
8. `/admin-issues` (`admin-issues.tsx`) — Basic issue management dashboard for crowd-sourced feedback.

---

## 3. Backend & API Architecture (`artifacts/api-server`)

* **Framework**: Express 5 on Node.js 24.
* **Server Structure**: Modular router setup in `src/routes/` with middleware chains for authentication, rate-limiting, and bot defense.
* **Routes**:
  * `GET /api/schemes` — Scheme listing and metrics.
  * `GET /api/cag-audits` — CAG audit findings filtered by severity and department.
  * `GET /api/pib-entries` — Press Information Bureau releases.
  * `POST /api/issues` — Citizen feedback/issue submission.
  * `POST /api/admin/*` — Admin operations authenticated via headers.

---

## 4. Database Architecture (`lib/db`)

* **ORM**: Drizzle ORM querying PostgreSQL.
* **Core Schemas**:
  * `schemes`: `id`, `slug`, `name`, `category`, `launchedYear`, `budgetAllocated`, `cagVerdict`, `sourceUrl`, `updatedAt`.
  * `cag_audits`: `id`, `schemeId`, `findingTitle`, `financialLossCr`, `severity` (`CRITICAL`, `HIGH`, `MEDIUM`), `reportYear`, `cagDocumentUrl`.
  * `cag_state_reports`: State audit reports categorized by financial impact.
  * `pib_entries`: Government press releases indexed by scheme.
  * `issue_reports`: User feedback submissions.
  * `conversations` & `messages`: Chat session logging.

---

## 5. Security & Authentication Mechanisms

1. **Bot Defense**: Cloudflare Turnstile integration (`captcha-gate.tsx`).
2. **Session Security**: HMAC-signed session cookies requiring a 64-character `SESSION_SECRET`.
3. **Admin Verification**: Restricted to strict `X-Admin-Token` request headers; query parameters are explicitly forbidden.

---

## 6. Technical Debt & Rebuild Rationale

| Area | Inherited Limitation | CivicLens Upgrade |
|---|---|---|
| **Data Architecture** | Hardcoded 500KB TS files (`central-data.tsx`) | Fully normalized PostgreSQL schema + Drizzle ORM + Admin CMS |
| **Verification & Evidence** | Unstructured URLs in text strings | Explicit **Evidence Model** (Claim → Evidence → Source → Document → Page → Verification) |
| **Visual Styling** | Generic Tailwind cards & basic layouts | Premium editorial aesthetic (off-white background, serif typography, red accent, micro-interactions) |
| **Data Engine & AI** | Basic OpenAI API wrapper without tool execution | Data-first RAG & tool execution engine returning structured JSON charts |
| **Map & Comparison** | Static list view of states | Interactive MapLibre/SVG India map + multi-state comparison matrix |
| **Publishing** | No newsletter capability | **The Civic Brief** automated newsletter subsystem (Resend integration) |

---

## 7. Reusable Asset Inventory

The following assets and data points are extracted and refactored into CivicLens:
* Scheme taxonomy and verified budget allocation data points (2014–present).
* CAG audit finding classifications and financial loss metrics.
* State governance indicators (NFHS-5, NCRB, MOSPI datasets).
* ECI affidavit structure for minister profiles.
