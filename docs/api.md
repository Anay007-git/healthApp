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

## Admin Endpoints (Header `X-Admin-Token` Required)

- `GET /api/admin/dashboard`: Administrative metrics and counts.
- `GET /api/admin/audit-logs`: Audit trail history.
