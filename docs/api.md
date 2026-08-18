# CivicLens REST API Documentation

## Base URL
`http://localhost:3001`

## Public Endpoints

### 1. Schemes
- `GET /api/schemes`: Fetch all schemes with budget and pipeline data.
- `GET /api/schemes/:id`: Fetch specific scheme details.

### 2. State Intelligence
- `GET /api/states`: Fetch state profiles, scores, and indicators.
- `GET /api/states/:id`: Fetch specific state profile.

### 3. CAG Audits
- `GET /api/cag`: Fetch CAG audit reports and findings.

### 4. Ask the Data AI Chatbot
- `POST /api/chat`: Submit user natural language query.
  - **Body**: `{ "question": "Compare West Bengal and Maharashtra" }`
  - **Response**: Structured JSON containing `answer`, `metrics`, `visualization`, `sources`, and `methodology`.

### 5. Newsletter
- `POST /api/newsletter/subscribe`: Subscribe email to The Civic Brief.

### 6. TruthCheck fact verification
- `POST /api/factcheck/verify`
  - **Body**: `{ "text": "Did RBI increase the repo rate in 2025?" }`
  - **Response**: `ClaimAnalysisResult` (`verdict`, `confidenceScore`, `truthSummary`, `detailedDebunk`, `primarySources`, plus optional `atomicClaims`, `methodology`, `structuredEvidence`).
  - Discovery sources (Google News / Wikipedia / DuckDuckGo) never independently yield `VERIFIED_TRUE`.
- `GET /api/factcheck/feed` — indexed fact-check cards
- `GET /api/factcheck/trending`
- `POST /api/factcheck/submit` — crowd submission queue

## Admin Endpoints (Header `X-Admin-Token` Required)

- `GET /api/admin/dashboard`: Administrative metrics and counts.
- `GET /api/admin/audit-logs`: Audit trail history.
