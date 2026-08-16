# CivicLens

> Understand India through evidence, not noise.

**CivicLens** is India's interactive civic intelligence and data-visualization platform. It combines data journalism, public policy analysis, financial audit tracking, interactive maps, scrollytelling investigations, non-hallucinating AI data queries, and evidence traceability.

---

## Technical Architecture

CivicLens is structured as a modular PNPM Monorepo:

```text
CivicLens/
├── apps/
│   ├── web/               # Public Website (React 19, Vite, Editorial Theme)
│   ├── admin/             # Intelligence CMS Panel (React 19, Verification Workflow)
│   └── api/               # Express 5 REST API Server with Zod Validation
├── packages/
│   ├── ui/                # Shared Editorial UI Library & Evidence Drawer
│   ├── database/          # Drizzle ORM Schema, Verified Seeds & Queries
│   ├── charts/            # D3 / Recharts / SVG Interactive Map & Visualization Suite
│   ├── ai/                # Data-First AI Tool Executor & Response Builder
│   ├── types/             # Shared TypeScript Interfaces
│   ├── validation/        # Zod Validation Schemas
│   └── config/            # Centralized Brand Configuration & Tokens
├── docs/                  # System & Architecture Documentation
└── package.json           # Monorepo Root Configuration
```

---

## Core Features

- **Evidence Drawer**: Every data metric, chart point, or AI response is traceable to primary sources (Union Budget, CAG Audits, NFHS-5, ECI Affidavits).
- **Government Scheme Intelligence**: Interactive *Promise → Budget → Expenditure → CAG Finding → Outcome* pipeline step visualizer.
- **Interactive India Map**: SVG/GeoJSON state map with indicator heatmaps and state comparison matrix.
- **CAG Investigations**: Audit findings, severity categorization, and money-flow visualizer.
- **Ask the Data AI Assistant**: Non-hallucinating chatbot executing backend tools and outputting structured JSON charts.
- **Admin Verification CMS**: Multi-role RBAC workflow (`DRAFT` → `REVIEW` → `VERIFIED` → `PUBLISHED`) with audit logs.
- **The Civic Brief Newsletter**: Subscriber management with topic preferences.

---

## Quick Start

```bash
# Option A: Using standard npm (works out-of-the-box on Windows/macOS/Linux)
npm run dev:web      # Starts Public Web App (Port 3000)
npm run dev:admin    # Starts Admin CMS Panel (Port 3002)
npm run dev:api      # Starts REST API Server (Port 3001)

# Option B: Using npx pnpm
npx pnpm dev:web
npx pnpm dev:admin
npx pnpm dev:api
```

---

## Attribution & License

Built upon open-source foundations with full respect for original software licensing.
License: MIT
