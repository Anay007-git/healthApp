import express from "express";
import cors from "cors";
import { db } from "@civiclens/database";
import { aiEngine } from "@civiclens/ai";
import { newsletterSubscribeSchema, askQuerySchema } from "@civiclens/validation";
import { brandConfig } from "@civiclens/config";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Root info
app.get("/", (req, res) => {
  res.json({
    app: brandConfig.name,
    tagline: brandConfig.tagline,
    version: "1.0.0",
    status: "healthy",
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

app.get("/api/admin/dashboard", adminAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      schemesCount: db.getSchemes().length,
      cagReportsCount: db.getCAGReports().length,
      indicatorsCount: 4,
      sourcesCount: db.getSources().length,
      subscribersCount: 8921,
    },
  });
});

app.listen(PORT, () => {
  console.log(`CivicLens API Server running on port ${PORT}`);
});

export default app;
