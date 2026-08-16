# CivicLens Architecture Documentation

## Overview

**CivicLens** is built as a modular monorepo separating concerns across public presentation (`apps/web`), administration (`apps/admin`), API routing (`apps/api`), and domain packages (`packages/*`).

```text
USER / BROWSER
      ↓
[ apps/web ] ──(REST API)──> [ apps/api ] ──(Data Engine)──> [ packages/database ]
                                    │                               │
                                (AI Tool)                           ↓
                                    │                        [ Verified Seeds & DB ]
                             [ packages/ai ]
```

## Modular Components

1. **`packages/config`**: Centralized brand settings (`brand.ts`), color design tokens, and environment parameters.
2. **`packages/types`**: Unified TypeScript domain contracts for Evidence, Schemes, CAG Reports, Indicators, States, Ministers, and AI Responses.
3. **`packages/database`**: Drizzle ORM query layer and seed datasets.
4. **`packages/charts`**: Reusable D3 / SVG / Recharts visualization components (`IndiaMap`, `GenericBarChart`, `GenericLineChart`, `StatCard`).
5. **`packages/ui`**: Shared UI library including the **Evidence Verification Drawer**.
6. **`packages/ai`**: Non-hallucinating data-first AI executor returning structured JSON charts.
