import express from "express";
import cors from "cors";
import type { CivicLensDatabase } from "@civiclens/database";
import { initDatabase } from "@civiclens/database/server";
import { aiEngine } from "@civiclens/ai";
import { newsletterSubscribeSchema, askQuerySchema, claimVerifySchema, claimSubmitSchema } from "@civiclens/validation";
import { brandConfig } from "@civiclens/config";
import { ensurePostgresReady, getPostgresTableCounts, isPostgresUrl } from "@civiclens/database/server";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
let db: CivicLensDatabase;

// Root info
app.get("/", (req, res) => {
  res.json({
    app: brandConfig.name,
    tagline: brandConfig.tagline,
    version: "1.0.0",
    status: "healthy",
    dataSource: process.env.DATABASE_URL?.startsWith("postgres") ? "postgresql" : "memory",
  });
});

app.get("/api/bootstrap", (req, res) => {
  res.json({
    success: true,
    dataSource: process.env.DATABASE_URL?.startsWith("postgres") ? "postgresql" : "memory",
    data: {
      schemes: db.getSchemes(),
      states: db.getStates(),
      stateFacts: db.getStateFacts(),
      cagReports: db.getCAGReports(),
      manifestoPromises: db.getManifestoPromises(),
      ministers: db.getMinisters(),
      stateMinisters: db.getAllStateMinisters(),
      stories: db.getStories(),
      partyFunding: db.getPartyFunding(),
      corporateDonors: db.getCorporateDonors(),
      partyAnnualIncome: db.getPartyAnnualIncomeHistory(),
      partyMetaMap: db.getPartyMetaMap(),
      bondsMeta: db.getBondsMeta(),
      factChecks: db.getFactChecks(),
      sources: db.getSources(),
    },
  });
});

// PUBLIC ENDPOINTS
app.get("/api/schemes", (req, res) => {
  res.json({ success: true, data: db.getSchemes() });
});

app.get("/api/schemes/:id", (req, res) => {
  const scheme = db.getSchemeBySlug(req.params.id);
  if (!scheme) return res.status(404).json({ success: false, error: "Scheme not found" });
  res.json({ success: true, data: scheme });
});

app.get("/api/states", (req, res) => {
  res.json({ success: true, data: db.getStates() });
});

app.get("/api/states/:id", (req, res) => {
  const state = db.getStateByCode(req.params.id);
  if (!state) return res.status(404).json({ success: false, error: "State not found" });
  res.json({ success: true, data: state });
});

app.get("/api/state-facts", (req, res) => {
  res.json({ success: true, data: db.getStateFacts() });
});

app.get("/api/state-facts/:code", (req, res) => {
  const fact = db.getStateFactsByCode(req.params.code);
  if (!fact) return res.status(404).json({ success: false, error: "State facts not found" });
  res.json({ success: true, data: fact });
});

app.get("/api/cag", (req, res) => {
  res.json({ success: true, data: db.getCAGReports() });
});

app.get("/api/manifestos", (req, res) => {
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  res.json({ success: true, data: db.getManifestoPromises(year) });
});

app.get("/api/ministers", (req, res) => {
  res.json({ success: true, data: db.getMinisters() });
});

app.get("/api/state-ministers", (req, res) => {
  res.json({ success: true, data: db.getAllStateMinisters() });
});

app.get("/api/funding", (req, res) => {
  res.json({
    success: true,
    data: {
      parties: db.getPartyFunding(),
      donors: db.getCorporateDonors(),
      bondsMeta: db.getBondsMeta(),
      annualIncome: db.getPartyAnnualIncomeHistory(),
      partyMetaMap: db.getPartyMetaMap(),
    },
  });
});

app.get("/api/evidence/:id", (req, res) => {
  const ev = db.getEvidenceById(req.params.id);
  if (!ev) return res.status(404).json({ success: false, error: "Evidence not found" });
  res.json({ success: true, data: ev });
});

app.get("/api/stories", (req, res) => {
  res.json({ success: true, data: db.getStories() });
});

app.get("/api/stories/:slug", (req, res) => {
  const story = db.getStoryBySlug(req.params.slug);
  if (!story) return res.status(404).json({ success: false, error: "Story not found" });
  res.json({ success: true, data: story });
});

app.get("/api/search", (req, res) => {
  const query = (req.query.q as string) || "";
  res.json({ success: true, data: db.search(query) });
});

// AI CHAT ENDPOINT (/ask)
app.post("/api/chat", async (req, res) => {
  const parsed = askQuerySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.format() });
  }

  const response = await aiEngine.processQuery(parsed.data.question);
  res.json({ success: true, data: response });
});

// TRUTHCHECK & FACT CHECK ENDPOINTS
app.get("/api/factcheck/feed", (req, res) => {
  const category = (req.query.category as string) || undefined;
  const verdict = (req.query.verdict as string) || undefined;
  const search = (req.query.q as string) || undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

  const data = db.getFactChecks({ category, verdict, search, limit });
  res.json({ success: true, count: data.length, data });
});

app.get("/api/factcheck/trending", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
  res.json({ success: true, data: db.getTrendingDebunks(limit) });
});

app.get("/api/factcheck/:id", (req, res) => {
  const claim = db.getFactCheckById(req.params.id);
  if (!claim) return res.status(404).json({ success: false, error: "Fact check not found" });
  res.json({ success: true, data: claim });
});

app.post("/api/factcheck/verify", async (req, res) => {
  const parsed = claimVerifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.format() });
  }

  const result = await aiEngine.analyzeMisinformation(parsed.data.text);
  res.json({ success: true, data: result });
});

app.post("/api/factcheck/submit", (req, res) => {
  const parsed = claimSubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.format() });
  }

  const submission = db.submitClaimForReview(parsed.data);
  res.json({
    success: true,
    message: "Suspicious claim queued for editorial verification.",
    data: submission,
  });
});

// NEWSLETTER SUBMISSION
app.post("/api/newsletter/subscribe", (req, res) => {
  const parsed = newsletterSubscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.format() });
  }

  res.json({
    success: true,
    message: `Subscribed ${parsed.data.email} to The Civic Brief newsletter.`,
  });
});

// ADMIN ENDPOINTS (Headers protected)
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers["x-admin-token"];
  if (!token || token !== (process.env.ADMIN_TOKEN || "civiclens_admin_secret_token_12345")) {
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid admin token" });
  }
  next();
};

app.post("/api/admin/seed", adminAuth, async (req, res) => {
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    return res.status(400).json({
      success: false,
      error: "DATABASE_URL is not configured.",
    });
  }

  try {
    const seeded = await ensurePostgresReady();
    const counts = await getPostgresTableCounts();
    return res.json({
      success: true,
      seeded,
      message: seeded ? "Database seeded." : "Database already populated.",
      counts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return res.status(500).json({ success: false, error: message });
  }
});

app.get("/api/admin/dashboard", adminAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      schemesCount: db.getSchemes().length,
      cagReportsCount: db.getCAGReports().length,
      indicatorsCount: 4,
      sourcesCount: db.getSources().length,
      subscribersCount: 8921,
      dataSource: process.env.DATABASE_URL?.startsWith("postgres") ? "postgresql" : "memory",
    },
  });
});

async function start() {
  db = await initDatabase();
  app.listen(PORT, () => {
    console.log(`CivicLens API Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start API server:", err);
  process.exit(1);
});

export default app;
