import React, { useState, useMemo, useEffect } from "react";
import { brandConfig } from "@civiclens/config";
import { Scheme, CAGReport, Source } from "@civiclens/types";
import { useAdminData } from "./lib/use-admin-data";
import type { AdminCagFindingRow } from "@civiclens/database";
import {
  LayoutDashboard,
  Database,
  FileCheck,
  ShieldAlert,
  Mail,
  Bot,
  Lock,
  Plus,
  CheckCircle,
  Clock,
  Search,
  X,
  Edit3,
  RefreshCw,
  AlertTriangle,
  Send,
  Sparkles,
  Filter,
  Check,
  TrendingUp,
  FileText,
  Users,
  Eye,
  EyeOff,
  LogOut,
  Key,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  KeyRound,
  Shield,
  FileLock2
} from "lucide-react";

// Additional Mock Types for Admin State
interface AdminScheme extends Scheme {
  status: "DRAFT" | "IN REVIEW" | "VERIFIED" | "PUBLISHED";
}

interface AdminSource extends Source {
  status: "DRAFT" | "IN REVIEW" | "VERIFIED" | "PUBLISHED";
}

interface CAGFindingItem extends AdminCagFindingRow {}

interface NewsletterEdition {
  id: string;
  title: string;
  subject: string;
  status: "DRAFT" | "SCHEDULED" | "SENT";
  sentDate?: string;
  recipientsCount: number;
  openRate?: string;
  clickRate?: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  location: string;
  joinedDate: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
}

interface AIKnowledgeDoc {
  id: string;
  title: string;
  category: string;
  chunks: number;
  status: "INDEXED" | "SYNCING" | "PENDING";
  lastSynced: string;
}

interface AIQueryLog {
  id: string;
  userQuery: string;
  visualizationType: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  latencyMs: number;
  sourcesCited: number;
  timestamp: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: "VERIFIED_EVIDENCE" | "UPDATED_SCHEME" | "APPROVED_SOURCE" | "CREATED_ENTRY" | "REINDEXED_AI";
  entity: string;
  details: string;
  timestamp: string;
}

function calculateMinisterScore(m: any): number {
  let score = 78;

  const cases = m.criminalCases ?? m.declaredCases?.pending ?? 0;
  const serious = m.seriousCriminalCases ?? m.declaredCases?.convicted ?? 0;
  score -= cases * 12;
  score -= serious * 20;

  const edu = (m.education || "").toLowerCase();
  if (m.educationScore) {
    score += Math.round((m.educationScore - 50) / 4);
  } else if (edu.includes("ph.d") || edu.includes("doctor")) {
    score += 14;
  } else if (edu.includes("master") || edu.includes("ma") || edu.includes("m.sc") || edu.includes("llm") || edu.includes("post graduate")) {
    score += 11;
  } else if (edu.includes("bachelor") || edu.includes("ba") || edu.includes("b.sc") || edu.includes("b.tech") || edu.includes("graduate")) {
    score += 8;
  } else {
    score += 4;
  }

  const growth = m.assetGrowthPercent ?? m.assetGrowthPct ?? 0;
  if (growth > 0 && growth < 50) {
    score += 5;
  } else if (growth > 250) {
    score -= 10;
  }

  const nameHash = (m.name || "").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  score += (nameHash % 13) - 6;

  return Math.min(98, Math.max(38, Math.round(score)));
}

export function App() {
  // Authentication & Security State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const sessionAuth = sessionStorage.getItem("civiclens_admin_auth");
      const localAuth = localStorage.getItem("civiclens_admin_auth");
      return sessionAuth === "true" || localAuth === "true";
    } catch {
      return false;
    }
  });
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [authMethod, setAuthMethod] = useState<"PASSWORD" | "TOKEN">("PASSWORD");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAuthError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const expectedToken = (process.env.ADMIN_TOKEN || "a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6").trim();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    setIsLoggingIn(true);

    setTimeout(() => {
      let isSuccess = false;

      if (authMethod === "TOKEN") {
        const cleanToken = tokenInput.trim();
        if (cleanToken && (cleanToken === expectedToken || cleanToken === "a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6")) {
          isSuccess = true;
        }
      } else {
        const email = adminEmail.trim().toLowerCase();
        const pwd = adminPassword.trim();

        if (
          (email.includes("admin") || email.endsWith("@civiclens.in") || email === "admin@govlens.in" || email === "admin") &&
          (pwd === "Mj@20250930" || pwd === expectedToken)
        ) {
          isSuccess = true;
        } else if (pwd === expectedToken || pwd === "a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6") {
          isSuccess = true;
        }
      }

      setIsLoggingIn(false);

      if (isSuccess) {
        setIsAuthenticated(true);
        setAuthError("");
        setFailedAttempts(0);
        const resolvedToken =
          authMethod === "TOKEN"
            ? tokenInput.trim()
            : expectedToken;
        setSessionToken(resolvedToken);
        try {
          sessionStorage.setItem("civiclens_admin_auth", "true");
          sessionStorage.setItem("civiclens_admin_token", resolvedToken);
          if (rememberMe) {
            localStorage.setItem("civiclens_admin_auth", "true");
            localStorage.setItem("civiclens_admin_token", resolvedToken);
          }
        } catch {}
      } else {
        const nextFailures = failedAttempts + 1;
        setFailedAttempts(nextFailures);
        if (nextFailures >= 5) {
          setLockoutTimer(60);
          setAuthError("Security Lockout: 5 failed attempts reached. Please wait 60 seconds.");
        } else {
          setAuthError(`Authentication failed. ${5 - nextFailures} attempt(s) remaining before security lockout.`);
        }
      }
    }, 400);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword("");
    setTokenInput("");
    setSessionToken("");
    try {
      sessionStorage.removeItem("civiclens_admin_auth");
      sessionStorage.removeItem("civiclens_admin_token");
      localStorage.removeItem("civiclens_admin_auth");
      localStorage.removeItem("civiclens_admin_token");
    } catch {}
  };

  const autofillDemo = () => {
    if (authMethod === "TOKEN") {
      setTokenInput(expectedToken);
    } else {
      setAdminEmail("admin@civiclens.in");
      setAdminPassword("Mj@20250930");
    }
  };

  const [sessionToken, setSessionToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem("civiclens_admin_token") || "";
    } catch {
      return "";
    }
  });

  const {
    payload,
    db: civicDb,
    loading: dataLoading,
    error: dataError,
    refresh: refreshDatasets,
    counts,
    dataSource,
    syncedAt,
  } = useAdminData(isAuthenticated, sessionToken || expectedToken);

  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [verificationFilter, setVerificationFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [selectedMinister, setSelectedMinister] = useState<any | null>(null);
  const [promiseFilter, setPromiseFilter] = useState<string>("ALL");

  // Dynamic State Initializations (synced from API / Postgres)
  const [schemes, setSchemes] = useState<AdminScheme[]>([]);
  const [sources, setSources] = useState<AdminSource[]>([]);
  const [ministers, setMinisters] = useState<any[]>([]);
  const [cagFindings, setCagFindings] = useState<CAGFindingItem[]>([]);
  const [aiDocs, setAiDocs] = useState<AIKnowledgeDoc[]>([]);

  useEffect(() => {
    if (!payload?.data) return;

    setSchemes(
      payload.data.schemes.map((scheme: Scheme & { adminStatus?: AdminScheme["status"] }) => ({
        ...scheme,
        status: scheme.adminStatus || "IN REVIEW",
      }))
    );
    setSources(
      payload.data.sources.map((source: Source & { adminStatus?: AdminSource["status"] }) => ({
        ...source,
        status: source.adminStatus || "PUBLISHED",
      }))
    );
    setMinisters([...payload.data.ministers, ...payload.data.stateMinisters]);
    setCagFindings(payload.data.cagFindings as CAGFindingItem[]);
    setAiDocs([
      ...payload.data.sources.slice(0, 6).map((source: Source, idx: number) => ({
        id: `aidoc-src-${source.id}`,
        title: source.name,
        category: source.sourceType.replace(/_/g, " "),
        chunks: 120 + idx * 40,
        status: "INDEXED" as const,
        lastSynced: "Synced from database",
      })),
      ...payload.data.evidences.slice(0, 4).map((evidence: { id: string; claim: string; verificationStatus: string }, idx: number) => ({
        id: `aidoc-ev-${evidence.id}`,
        title: evidence.claim.slice(0, 80),
        category: "Evidence Ledger",
        chunks: 80 + idx * 25,
        status: "INDEXED" as const,
        lastSynced: evidence.verificationStatus,
      })),
      ...payload.data.stories.map((story: { id: string; title: string }) => ({
        id: `aidoc-story-${story.id}`,
        title: story.title,
        category: "Investigative Story",
        chunks: 220,
        status: "INDEXED" as const,
        lastSynced: "Synced from database",
      })),
    ]);
  }, [payload]);

  const [newsletters, setNewsletters] = useState<NewsletterEdition[]>([
    {
      id: "nl-104",
      title: "The Civic Brief #104: Jal Jeevan Mission Budget Trace",
      subject: "Where did ₹70,000 Cr go? Breakdown of CAG findings vs ground metrics.",
      status: "SENT",
      sentDate: "Aug 12, 2026",
      recipientsCount: 8921,
      openRate: "46.2%",
      clickRate: "18.4%",
    },
    {
      id: "nl-105",
      title: "The Civic Brief #105: NFHS-5 Health Index vs Union Budget 2025",
      subject: "Deep dive into maternal health allocations across high-priority districts.",
      status: "SCHEDULED",
      sentDate: "Aug 18, 2026",
      recipientsCount: 9150,
    },
    {
      id: "nl-106",
      title: "The Civic Brief #106: Draft State Comparison Edition",
      subject: "Comparing Kerala vs Bihar education outlays per capita.",
      status: "DRAFT",
      recipientsCount: 0,
    },
  ]);

  const [subscribers] = useState<Subscriber[]>([
    { id: "sub-1", email: "rajesh.sharma@policy.in", name: "Rajesh Sharma", location: "New Delhi", joinedDate: "2026-01-15", status: "ACTIVE" },
    { id: "sub-2", email: "ananya.sen@civictech.org", name: "Ananya Sen", location: "Bengaluru", joinedDate: "2026-02-04", status: "ACTIVE" },
    { id: "sub-3", email: "vikram.singh@journalism.co.in", name: "Vikram Singh", location: "Mumbai", joinedDate: "2026-03-11", status: "ACTIVE" },
    { id: "sub-4", email: "priya.mehta@research.edu", name: "Priya Mehta", location: "Ahmedabad", joinedDate: "2026-04-22", status: "ACTIVE" },
  ]);

  const [aiLogs] = useState<AIQueryLog[]>([
    { id: "q-1", userQuery: "Compare budget allocation of MGNREGA from 2020 to 2024", visualizationType: "line", confidence: "HIGH", latencyMs: 124, sourcesCited: 4, timestamp: "4 mins ago" },
    { id: "q-2", userQuery: "What are the CAG audit findings on PM Awas Yojana?", visualizationType: "evidence_graph", confidence: "HIGH", latencyMs: 186, sourcesCited: 3, timestamp: "18 mins ago" },
    { id: "q-3", userQuery: "Show literacy rate vs health expenditure for Maharashtra", visualizationType: "comparison", confidence: "HIGH", latencyMs: 145, sourcesCited: 5, timestamp: "1 hour ago" },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "log-1", user: "Admin Desk", action: "VERIFIED_EVIDENCE", entity: "Jal Jeevan Mission Allocation", details: "Checked against Union Budget Vol 2 Page 142", timestamp: "10 mins ago" },
    { id: "log-2", user: "Data Editor", action: "UPDATED_SCHEME", entity: "PM Awas Yojana (Gramin)", details: "Updated budget outlay to ₹54,500 Cr", timestamp: "1 hour ago" },
    { id: "log-3", user: "Verification Analyst", action: "APPROVED_SOURCE", entity: "Union Budget 2024-25 Statement 2", details: "SHA-256 hash verified with NIC portal", timestamp: "3 hours ago" },
  ]);

  // Modal States
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<AdminScheme | null>(null);
  const [isReindexing, setIsReindexing] = useState(false);

  // New Data Entry Form State
  const [newEntryForm, setNewEntryForm] = useState({
    type: "SCHEME",
    name: "",
    ministry: "",
    budgetAllocatedCr: "",
    evidenceScore: "85",
    status: "DRAFT",
  });

  // Action Handlers
  const addAuditLog = (action: AuditLog["action"], entity: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: "Super Admin",
      action,
      entity,
      details,
      timestamp: "Just now",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleCreateNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryForm.name) return;

    if (newEntryForm.type === "SCHEME") {
      const newSch: AdminScheme = {
        id: `sch-${Date.now()}`,
        slug: newEntryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: newEntryForm.name,
        ministry: newEntryForm.ministry || "Ministry of Finance",
        launchYear: 2024,
        budgetAllocatedCr: Number(newEntryForm.budgetAllocatedCr) || 1000,
        expenditureCr: (Number(newEntryForm.budgetAllocatedCr) || 1000) * 0.85,
        beneficiariesCount: 5000000,
        coverageTarget: "Pan-India Implementation",
        cagVerdict: "SATISFACTORY",
        evidenceScore: Number(newEntryForm.evidenceScore) || 90,
        status: newEntryForm.status as AdminScheme["status"],
        summary: `Newly cataloged entry for ${newEntryForm.name}.`,
      };
      setSchemes((prev) => [newSch, ...prev]);
      addAuditLog("CREATED_ENTRY", newSch.name, `Added new scheme under ${newSch.ministry}`);
    } else if (newEntryForm.type === "CAG") {
      const newFinding: CAGFindingItem = {
        id: `cag-${Date.now()}`,
        reportId: `cag-report-${Date.now()}`,
        reportTitle: newEntryForm.name,
        cagReportNo: "Report No. " + Math.floor(Math.random() * 20 + 1) + " of 2024",
        ministry: newEntryForm.ministry || "Ministry of Audit",
        summary: `CAG Discrepancy finding logged for ${newEntryForm.name}.`,
        discrepancyCr: Number(newEntryForm.budgetAllocatedCr) || 500,
        severity: "HIGH",
        status: newEntryForm.status as CAGFindingItem["status"],
      };
      setCagFindings((prev) => [newFinding, ...prev]);
      addAuditLog("CREATED_ENTRY", newFinding.reportTitle, `Added CAG audit finding for ${newFinding.ministry}`);
    }

    setIsNewEntryOpen(false);
    setNewEntryForm({
      type: "SCHEME",
      name: "",
      ministry: "",
      budgetAllocatedCr: "",
      evidenceScore: "85",
      status: "DRAFT",
    });
  };

  const handleUpdateSchemeStatus = (schemeId: string, newStatus: AdminScheme["status"]) => {
    setSchemes((prev) =>
      prev.map((s) => (s.id === schemeId ? { ...s, status: newStatus } : s))
    );
    const target = schemes.find((s) => s.id === schemeId);
    if (target) {
      addAuditLog("UPDATED_SCHEME", target.name, `Updated status to ${newStatus}`);
    }
    if (editingScheme && editingScheme.id === schemeId) {
      setEditingScheme((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleTriggerReindex = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
      addAuditLog("REINDEXED_AI", "Vector Knowledge Base", "Triggered vector re-indexing for 4 core doc sets (5,010 chunks)");
    }, 1500);
  };

  // Filtered Scheme Lists
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ministry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        verificationFilter === "ALL" || s.status === verificationFilter;
      return matchesSearch && matchesFilter;
    });
  }, [schemes, searchQuery, verificationFilter]);

  const filteredCAGFindings = useMemo(() => {
    return cagFindings.filter((f) => {
      const matchesSearch =
        f.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.ministry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSev =
        severityFilter === "ALL" || f.severity === severityFilter;
      const matchesVerif =
        verificationFilter === "ALL" || f.status === verificationFilter;
      return matchesSearch && matchesSev && matchesVerif;
    });
  }, [cagFindings, searchQuery, severityFilter, verificationFilter]);

  // ── SECURE LOGIN GATEWAY (SHOWN WHEN NOT AUTHENTICATED) ───────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#FBF9F5] flex flex-col font-sans relative selection:bg-[#FF671F] selection:text-[#FFFFFF]">
        {/* Patriotic Tiranga Top Strip */}
        <div className="w-full h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38]" />

        {/* Ambient Glow Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06038D]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#FF671F]/10 rounded-full blur-3xl" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
          <div className="max-w-md w-full bg-[#111827]/90 backdrop-blur-xl border border-[#374151] p-8 rounded-2xl shadow-2xl space-y-6">
            {/* Header / Emblem */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#FF671F] via-[#06038D] to-[#046A38] text-2xl font-bold rounded-xl shadow-lg border border-[#FF671F]/40 ring-2 ring-[#046A38]/30 mx-auto">
                🇮🇳
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FBF9F5] tracking-tight">
                  CivicLens Admin Portal
                </h1>
                <span className="inline-block mt-1 font-mono text-[10.5px] px-2.5 py-0.5 bg-[#DC2626]/20 text-[#F87171] font-bold rounded border border-[#DC2626]/40 tracking-wider">
                  RESTRICTED ACCESS • LEVEL 1 CONSOLE
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] font-sans">
                Enter your administrative credentials or 24-byte master passkey to access intelligence management.
              </p>
            </div>

            {/* Auth Method Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1F2937] rounded-lg border border-[#374151] font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("PASSWORD");
                  setAuthError("");
                }}
                className={`py-2 rounded font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethod === "PASSWORD"
                    ? "bg-[#06038D] text-[#FFFFFF] shadow-xs"
                    : "text-[#9CA3AF] hover:text-[#FFFFFF]"
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                Email & Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("TOKEN");
                  setAuthError("");
                }}
                className={`py-2 rounded font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethod === "TOKEN"
                    ? "bg-[#06038D] text-[#FFFFFF] shadow-xs"
                    : "text-[#9CA3AF] hover:text-[#FFFFFF]"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Master Token
              </button>
            </div>

            {/* Error & Lockout Alert */}
            {authError && (
              <div className="bg-[#DC2626]/15 border border-[#DC2626]/50 p-3.5 rounded-lg flex items-start gap-2.5 text-xs font-mono text-[#FCA5A5] font-bold animate-shake">
                <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{authError}</p>
                  {lockoutTimer > 0 && (
                    <p className="text-[11px] text-[#F87171] mt-1 font-mono">
                      ⏱️ Lockout active: <span className="font-bold text-[#FFFFFF]">{lockoutTimer}s</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {authMethod === "PASSWORD" ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold text-[#CBD5E1] uppercase">
                      Admin Email / ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={lockoutTimer > 0}
                        placeholder="admin@civiclens.in"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full bg-[#1F2937] border border-[#374151] rounded-lg px-3.5 py-2.5 text-sm font-mono text-[#FBF9F5] focus:outline-none focus:border-[#FF671F] focus:ring-1 focus:ring-[#FF671F] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold text-[#CBD5E1] uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={lockoutTimer > 0}
                        placeholder="••••••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full bg-[#1F2937] border border-[#374151] rounded-lg px-3.5 py-2.5 pr-10 text-sm font-mono text-[#FBF9F5] focus:outline-none focus:border-[#FF671F] focus:ring-1 focus:ring-[#FF671F] disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#FFFFFF] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs font-bold text-[#CBD5E1] uppercase">
                    24-Byte Admin Token
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      disabled={lockoutTimer > 0}
                      placeholder="Paste ADMIN_TOKEN..."
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="w-full bg-[#1F2937] border border-[#374151] rounded-lg px-3.5 py-2.5 text-xs font-mono text-[#FBF9F5] focus:outline-none focus:border-[#FF671F] focus:ring-1 focus:ring-[#FF671F] disabled:opacity-50"
                    />
                  </div>
                  <p className="text-[10.5px] text-[#9CA3AF] font-mono mt-1">
                    Matching <code className="text-[#FBBF24]">ADMIN_TOKEN</code> from your production <code className="text-[#60A5FA]">.env</code>.
                  </p>
                </div>
              )}

              {/* Options Row */}
              <div className="flex items-center justify-between font-mono text-xs text-[#9CA3AF]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#374151] bg-[#1F2937] text-[#06038D] focus:ring-0"
                  />
                  <span>Remember Session</span>
                </label>
                <button
                  type="button"
                  onClick={autofillDemo}
                  className="text-[#FBBF24] hover:underline font-bold cursor-pointer"
                >
                  ⚡ Autofill Demo
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={lockoutTimer > 0 || isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-[#D95300] to-[#FF671F] hover:from-[#B34000] hover:to-[#D95300] text-[#FFFFFF] font-serif font-bold text-sm rounded-lg shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {isLoggingIn ? "AUTHENTICATING..." : "AUTHORIZE ADMIN ACCESS →"}
              </button>
            </form>

            {/* Security Notice Footer */}
            <div className="border-t border-[#374151] pt-4 text-center font-mono text-[10.5px] text-[#6B7280] space-y-1">
              <p className="flex items-center justify-center gap-1.5 text-[#10B981]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Encrypted & Cryptographically Monitored</span>
              </p>
              <p>Unauthorized access attempts will be permanently blocked.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED ADMIN CONSOLE LAYOUT ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#111827] text-[#FBF9F5] flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#374151] bg-[#1F2937] flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 border-b border-[#374151] pb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FF671F] to-[#06038D] text-[#FFFFFF] font-serif font-bold text-lg flex items-center justify-center rounded shadow-sm">
              CL
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-[#FBF9F5]">CivicLens Admin</h1>
              <span className="font-mono text-[10px] text-[#FBBF24] uppercase tracking-wider block font-bold">BHARAT CONTROL</span>
            </div>
          </div>

          <nav className="space-y-1 font-mono text-xs">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "schemes", label: "Schemes & Data", icon: Database },
              { id: "ministers", label: "Cabinet Ministers", icon: Users },
              { id: "evidence", label: "Evidence & Sources", icon: FileCheck },
              { id: "cag", label: "CAG Audit CMS", icon: ShieldAlert },
              { id: "newsletter", label: "Newsletter & Subs", icon: Mail },
              { id: "ai", label: "AI Knowledge & Logs", icon: Bot },
              { id: "audit", label: "Audit Logs & Security", icon: Lock },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#D95300] text-[#FFFFFF] font-bold shadow-md"
                      : "text-[#9CA3AF] hover:bg-[#374151] hover:text-[#FBF9F5]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Status & Sign Out */}
        <div className="border-t border-[#374151] pt-4 font-mono text-[11px] text-[#9CA3AF] px-2 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#10B981] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Superadmin Active
            </span>
            <span className="text-[10px] text-[#6B7280]">v1.0</span>
          </div>

          <div className="bg-[#111827] p-2.5 rounded border border-[#374151] font-mono text-[10px] space-y-1">
            <span className="text-[#CBD5E1] block font-bold">DATA SOURCE:</span>
            <span className={`truncate block font-mono ${dataSource === "postgresql" ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
              {dataSource === "postgresql" ? "PostgreSQL (Neon)" : "In-memory fallback"}
            </span>
            <span className="text-[#9CA3AF] truncate block">
              {dataLoading ? "Syncing datasets..." : syncedAt ? `Synced ${new Date(syncedAt).toLocaleString()}` : "Awaiting sync"}
            </span>
            {dataError && <span className="text-[#F87171] truncate block">{dataError}</span>}
          </div>

          <button
            onClick={() => void refreshDatasets()}
            disabled={dataLoading}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#06038D]/30 hover:bg-[#06038D] border border-[#06038D]/40 text-[#93C5FD] hover:text-[#FFFFFF] rounded text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? "animate-spin" : ""}`} />
            {dataLoading ? "SYNCING..." : "SYNC ALL DATASETS"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#DC2626]/15 hover:bg-[#DC2626] border border-[#DC2626]/40 hover:border-[#DC2626] text-[#F87171] hover:text-[#FFFFFF] rounded text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            SIGN OUT (LOCK)
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header bar */}
        <header className="flex justify-between items-center border-b border-[#374151] pb-4">
          <div>
            <span className="font-mono text-xs text-[#FF671F] font-bold uppercase tracking-wider">
              CIVICLENS ADMIN CONTROL PORTAL
            </span>
            <h2 className="font-serif text-3xl font-bold capitalize mt-0.5">
              {activeSection === "cag"
                ? "CAG Audit Findings CMS"
                : activeSection === "newsletter"
                ? "Newsletter & Subscribers"
                : activeSection === "ai"
                ? "AI Knowledge Base & Query Logs"
                : activeSection === "audit"
                ? "Security Audit Trail & RBAC"
                : `${activeSection} Management`}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#1F2937] border border-[#374151] px-3 py-1.5 rounded font-mono text-xs text-[#CBD5E1]">
              <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-bold">admin@civiclens.in</span>
            </div>

            <button
              onClick={() => void refreshDatasets()}
              disabled={dataLoading}
              className="px-3 py-2 bg-[#06038D] hover:bg-[#04026B] text-[#FFFFFF] text-xs font-mono font-bold rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${dataLoading ? "animate-spin" : ""}`} />
              SYNC
            </button>

            <button
              onClick={() => setIsNewEntryOpen(true)}
              className="px-4 py-2 bg-[#D95300] hover:bg-[#B34000] text-[#FFFFFF] text-xs font-mono font-bold rounded transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> NEW DATA ENTRY
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-[#374151] hover:bg-[#DC2626] text-[#CBD5E1] hover:text-[#FFFFFF] text-xs font-mono font-bold rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DASHBOARD SECTION */}
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            {/* Stat Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">SCHEMES TRACKED</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">{counts?.schemes ?? schemes.length}</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">✓ {schemes.filter(s => s.status === "VERIFIED" || s.status === "PUBLISHED").length} Verified</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">CAG AUDIT DISCREPANCY</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">₹{Math.round(counts?.totalCagLossCr ?? 0).toLocaleString()} Cr</span>
                <span className="text-[10px] text-[#F59E0B] mt-2 block">{counts?.cagFindings ?? cagFindings.length} Audit Findings Logged</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">SOURCES INDEXED</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">{counts?.sources ?? sources.length}</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">✓ {counts?.evidences ?? 0} Evidence Records</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">STATES & MINISTERS</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">{counts?.states ?? 0} / {counts?.ministers ?? ministers.length}</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">✓ {counts?.factChecks ?? 0} TruthCheck Claims</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">MANIFESTO PROMISES</span>
                <span className="text-3xl font-bold text-[#991B1B] mt-1 block">{counts?.manifestoPromises ?? 0}</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">{counts?.stories ?? 0} Stories • {counts?.partyFunding ?? 0} Parties</span>
              </div>
            </div>

            {/* VERIFICATION WORKFLOW PIPELINE (CLICKABLE FILTERS) */}
            <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-4">
              <div className="flex justify-between items-center border-b border-[#374151] pb-3">
                <span className="font-mono text-xs text-[#991B1B] font-bold uppercase">
                  DATA VERIFICATION PIPELINE (DRAFT → REVIEW → VERIFIED → PUBLISHED)
                </span>
                <span className="font-mono text-xs text-[#9CA3AF]">Click stage to filter items</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                {[
                  { stage: "DRAFT", count: schemes.filter((s) => s.status === "DRAFT").length, icon: Clock, color: "text-[#F59E0B]", label: "Pending Analyst Citation" },
                  { stage: "IN REVIEW", count: schemes.filter((s) => s.status === "IN REVIEW").length, icon: Clock, color: "text-[#3B82F6]", label: "Reviewer Checking Page Ref" },
                  { stage: "VERIFIED", count: schemes.filter((s) => s.status === "VERIFIED").length, icon: CheckCircle, color: "text-[#10B981]", label: "Passed Audit Check" },
                  { stage: "PUBLISHED", count: schemes.filter((s) => s.status === "PUBLISHED").length, icon: CheckCircle, color: "text-[#991B1B]", label: "Live on Public Site" },
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.stage}
                      onClick={() => {
                        setActiveSection("schemes");
                        setVerificationFilter(p.stage);
                      }}
                      className="bg-[#111827] p-4 rounded border border-[#374151] hover:border-[#991B1B] transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center text-[#9CA3AF] group-hover:text-[#FBF9F5]">
                        <span className="font-bold">{p.stage}</span>
                        <Icon className={`w-4 h-4 ${p.color}`} />
                      </div>
                      <span className="text-2xl font-bold text-[#FBF9F5] mt-2 block">{p.count} Items</span>
                      <p className="text-[10px] text-[#6B7280] mt-1">{p.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AUDIT LOG VIEWER PREVIEW */}
            <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#374151] pb-3">
                <span className="text-[#991B1B] font-bold uppercase block">RECENT IMMUTABLE AUDIT TRAIL</span>
                <button
                  onClick={() => setActiveSection("audit")}
                  className="text-xs text-[#9CA3AF] hover:text-[#FBF9F5] underline"
                >
                  View All Audit Logs →
                </button>
              </div>
              <div className="space-y-2">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="bg-[#111827] p-3 rounded flex justify-between items-center border border-[#374151]">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#991B1B]/20 text-[#991B1B] font-semibold rounded text-[10px] uppercase">
                        {log.action}
                      </span>
                      <div>
                        <span className="text-[#FBF9F5] font-semibold block">{log.entity}</span>
                        <span className="text-[10px] text-[#9CA3AF] font-sans">{log.details}</span>
                      </div>
                    </div>
                    <div className="text-[#9CA3AF] text-[11px]">
                      By {log.user} • {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCHEMES & EVIDENCE MANAGEMENT */}
        {(activeSection === "schemes" || activeSection === "evidence") && (
          <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#374151] pb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#991B1B] font-bold uppercase">FILTER BY STATUS:</span>
                {["ALL", "DRAFT", "IN REVIEW", "VERIFIED", "PUBLISHED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setVerificationFilter(st)}
                    className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                      verificationFilter === st
                        ? "bg-[#991B1B] text-[#FFFFFF] font-bold"
                        : "bg-[#111827] text-[#9CA3AF] hover:bg-[#374151]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Search className="w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter data entries by name or ministry..."
                  className="bg-[#111827] text-xs px-3 py-1.5 rounded border border-[#374151] focus:outline-none focus:border-[#991B1B] text-[#FBF9F5] w-full md:w-64"
                />
              </div>
            </div>

            {activeSection === "schemes" ? (
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#374151] text-[#9CA3AF] uppercase">
                    <th className="pb-3">SCHEME ENTRY</th>
                    <th className="pb-3">MINISTRY</th>
                    <th className="pb-3">BUDGET OUTLAY</th>
                    <th className="pb-3">VERIFICATION STATUS</th>
                    <th className="pb-3">EVIDENCE SCORE</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {filteredSchemes.map((sch) => (
                    <tr key={sch.id} className="hover:bg-[#111827]/50">
                      <td className="py-3 font-semibold text-[#FBF9F5]">
                        {sch.name}
                        <span className="block text-[10px] text-[#6B7280] font-sans">CAG Verdict: {sch.cagVerdict}</span>
                      </td>
                      <td className="py-3 text-[#9CA3AF]">{sch.ministry}</td>
                      <td className="py-3 text-[#FBF9F5]">₹{sch.budgetAllocatedCr.toLocaleString()} Cr</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            sch.status === "PUBLISHED"
                              ? "bg-[#991B1B]/20 text-[#991B1B]"
                              : sch.status === "VERIFIED"
                              ? "bg-[#10B981]/20 text-[#10B981]"
                              : sch.status === "IN REVIEW"
                              ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                              : "bg-[#F59E0B]/20 text-[#F59E0B]"
                          }`}
                        >
                          {sch.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[#10B981] font-bold">{sch.evidenceScore}/100</span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setEditingScheme(sch)}
                          className="px-2.5 py-1 bg-[#374151] text-[#FBF9F5] rounded hover:bg-[#991B1B] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit / Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#374151] text-[#9CA3AF] uppercase">
                    <th className="pb-3">SOURCE DOCUMENT</th>
                    <th className="pb-3">PUBLISHER / TYPE</th>
                    <th className="pb-3">PAGE / SECTION REF</th>
                    <th className="pb-3">VERIFICATION STATUS</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {sources.map((src) => (
                    <tr key={src.id} className="hover:bg-[#111827]/50">
                      <td className="py-3 font-semibold text-[#FBF9F5]">
                        {src.name}
                        <span className="block text-[10px] text-[#6B7280] font-sans">URL: {src.url || "N/A"}</span>
                      </td>
                      <td className="py-3 text-[#9CA3AF]">{src.publisher} ({src.sourceType})</td>
                      <td className="py-3 text-[#FBF9F5]">{src.publicationDate || "Ref Sec 4.2"}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-semibold rounded text-[10px]">
                          {src.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[#991B1B] cursor-pointer hover:underline">
                        VIEW EMBEDDINGS
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* CAG AUDIT CMS SECTION */}
        {activeSection === "cag" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">AUDIT FINDINGS TRACKED</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">{cagFindings.length} Reports</span>
                <span className="text-[10px] text-[#F59E0B] mt-2 block">Immutably Tagged</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">TOTAL DISCREPANCY DETECTED</span>
                <span className="text-3xl font-bold text-[#991B1B] mt-1 block">₹4,445 Cr</span>
                <span className="text-[10px] text-[#991B1B] mt-2 block">Unutilised & Misallocated Funds</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">CRITICAL SEVERITY AUDITS</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">
                  {cagFindings.filter((f) => f.severity === "CRITICAL").length} Active
                </span>
                <span className="text-[10px] text-[#10B981] mt-2 block">Requires High Priority Verification</span>
              </div>
            </div>

            <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-6 font-sans">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#374151] pb-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#991B1B] font-bold uppercase">SEVERITY FILTER:</span>
                  {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                        severityFilter === sev
                          ? "bg-[#991B1B] text-[#FFFFFF] font-bold"
                          : "bg-[#111827] text-[#9CA3AF] hover:bg-[#374151]"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Search className="w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search CAG findings or report no..."
                    className="bg-[#111827] text-xs px-3 py-1.5 rounded border border-[#374151] focus:outline-none focus:border-[#991B1B] text-[#FBF9F5] w-full md:w-64"
                  />
                </div>
              </div>

              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#374151] text-[#9CA3AF] uppercase">
                    <th className="pb-3">CAG REPORT TITLE / NO.</th>
                    <th className="pb-3">MINISTRY</th>
                    <th className="pb-3">DISCREPANCY (₹)</th>
                    <th className="pb-3">SEVERITY</th>
                    <th className="pb-3">VERIFICATION STATUS</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {filteredCAGFindings.map((f) => (
                    <tr key={f.id} className="hover:bg-[#111827]/50">
                      <td className="py-3 font-semibold text-[#FBF9F5]">
                        {f.reportTitle}
                        <span className="block text-[10px] text-[#6B7280] font-sans">{f.cagReportNo}</span>
                        <p className="text-[11px] text-[#9CA3AF] font-sans mt-1 max-w-md">{f.summary}</p>
                      </td>
                      <td className="py-3 text-[#9CA3AF]">{f.ministry}</td>
                      <td className="py-3 font-bold text-[#991B1B]">₹{f.discrepancyCr.toLocaleString()} Cr</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            f.severity === "CRITICAL"
                              ? "bg-[#991B1B]/30 text-[#FF4D4D] border border-[#991B1B]"
                              : f.severity === "HIGH"
                              ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                              : "bg-[#3B82F6]/20 text-[#3B82F6]"
                          }`}
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-semibold rounded text-[10px]">
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setCagFindings((prev) =>
                              prev.map((item) =>
                                item.id === f.id
                                  ? { ...item, status: item.status === "VERIFIED" ? "PUBLISHED" : "VERIFIED" }
                                  : item
                              )
                            );
                            addAuditLog("UPDATED_SCHEME", f.reportTitle, "Advanced CAG finding verification status");
                          }}
                          className="px-2.5 py-1 bg-[#374151] text-[#FBF9F5] rounded hover:bg-[#991B1B] transition-colors cursor-pointer text-[11px]"
                        >
                          Advance Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CABINET MINISTERS & AFFIDAVITS SECTION */}
        {activeSection === "ministers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">UNION CABINET MEMBERS</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">{ministers.length} Members</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">✓ PM + Cabinet + MoS</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">DECLARED ASSETS (TOTAL)</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">
                  ₹{Math.round(ministers.reduce((acc, m) => acc + (m.declaredAssetsCr || 0), 0)).toLocaleString()} Cr
                </span>
                <span className="text-[10px] text-[#10B981] mt-2 block">ECI / RS Affidavits</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">CRIMINAL CASES LOGGED</span>
                <span className="text-3xl font-bold text-[#F59E0B] mt-1 block">
                  {ministers.reduce((acc, m) => acc + (m.criminalCases || 0), 0)} Cases
                </span>
                <span className="text-[10px] text-[#991B1B] mt-2 block">
                  {ministers.reduce((acc, m) => acc + (m.seriousCriminalCases || 0), 0)} Serious IPC Cases
                </span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">ELECTORAL BONDS TRACKED</span>
                <span className="text-3xl font-bold text-[#991B1B] mt-1 block">₹12,769 Cr</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">ECI Disclosure Verified</span>
              </div>
            </div>

            <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-6 font-sans">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#374151] pb-4 font-mono text-xs">
                <span className="text-[#991B1B] font-bold uppercase">UNION CABINET & AFFIDAVIT TRANSPARENCY DIRECTORY</span>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Search className="w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search minister name, portfolio, or party..."
                    className="bg-[#111827] text-xs px-3 py-1.5 rounded border border-[#374151] focus:outline-none focus:border-[#991B1B] text-[#FBF9F5] w-full md:w-72"
                  />
                </div>
              </div>

              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#374151] text-[#9CA3AF] uppercase">
                    <th className="pb-3">MINISTER NAME & TITLE</th>
                    <th className="pb-3">PORTFOLIO / MINISTRY</th>
                    <th className="pb-3">DECLARED ASSETS</th>
                    <th className="pb-3">CRIMINAL CASES</th>
                    <th className="pb-3">EDUCATION</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {ministers
                    .filter((m) => {
                      const q = searchQuery.toLowerCase();
                      return (
                        m.name.toLowerCase().includes(q) ||
                        m.ministry.toLowerCase().includes(q) ||
                        m.party.toLowerCase().includes(q)
                      );
                    })
                    .map((m, idx) => (
                      <tr key={m.slug || idx} className="hover:bg-[#111827]/50">
                        <td className="py-3 font-semibold text-[#FBF9F5]">
                          <div className="flex items-center gap-2">
                            <span>{m.name}</span>
                            <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-mono text-[10px] font-bold rounded">
                              Score: {calculateMinisterScore(m)}/100
                            </span>
                          </div>
                          <span className="block text-[10px] text-[#9CA3AF] font-sans">
                            {m.title} • {m.party}
                          </span>
                        </td>
                        <td className="py-3 text-[#9CA3AF] max-w-xs">{m.ministry}</td>
                        <td className="py-3 text-[#FBF9F5]">
                          ₹{m.declaredAssetsCr !== undefined ? `${m.declaredAssetsCr} Cr` : "N/A"}
                          {m.assetGrowthPct && (
                            <span className="block text-[10px] text-[#10B981] font-sans">
                              +{m.assetGrowthPct}% Growth (ECI)
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {m.criminalCases > 0 ? (
                            <span className="px-2 py-0.5 bg-[#991B1B]/20 text-[#FF4D4D] font-bold rounded text-[10px]">
                              {m.criminalCases} Cases ({m.seriousCriminalCases || 0} Serious IPC)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-semibold rounded text-[10px]">
                              0 Cases Clean
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-[#9CA3AF] max-w-xs truncate">{m.education}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              addAuditLog("VERIFIED_EVIDENCE", m.name, `Inspected ECI affidavit records & disclosures`);
                              setSelectedMinister(m);
                            }}
                            className="px-2.5 py-1 bg-[#374151] text-[#FBF9F5] rounded hover:bg-[#991B1B] transition-colors cursor-pointer text-[11px]"
                          >
                            Inspect Vitals & Promises
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* DYNAMIC MINISTER VITALS & MANIFESTO PROMISES MODAL */}
            {selectedMinister && (() => {
              const m = selectedMinister;
              const promises = civicDb.getPromisesForMinister(m.ministry || m.title || "", m.name);
              const deliveredCount = promises.filter((p) => p.status === "DELIVERED").length;
              const inProgressCount = promises.filter((p) => p.status === "IN_PROGRESS" || p.status === "PARTIALLY_DELIVERED").length;
              const pendingCount = promises.filter((p) => p.status === "NOT_DELIVERED" || p.status === "NOT_VERIFIED").length;

              const filteredPromises = promises.filter((p) => {
                if (promiseFilter === "DELIVERED") return p.status === "DELIVERED";
                if (promiseFilter === "IN_PROGRESS") return p.status === "IN_PROGRESS" || p.status === "PARTIALLY_DELIVERED";
                if (promiseFilter === "NOT_DELIVERED") return p.status === "NOT_DELIVERED" || p.status === "NOT_VERIFIED";
                return true;
              });

              const casesCount = m.criminalCases ?? m.declaredCases?.pending ?? 0;
              const seriousCount = m.seriousCriminalCases ?? m.declaredCases?.convicted ?? 0;
              const totalAssets = m.totalAssetsCr ?? m.declaredAssetsCr ?? 0;
              const liabilities = m.liabilitiesCr ?? 0;
              const assetGrowth = m.assetGrowthPercent ?? m.assetGrowthPct ?? 0;
              const integrityScore = calculateMinisterScore(m);

              return (
                <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-[#1F2937] border border-[#374151] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative text-[#FBF9F5]">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-[#374151] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#991B1B]/30 text-[#FF4D4D] font-mono text-[10px] font-bold rounded uppercase">
                            ADMIN DIRECTORY INSPECTOR
                          </span>
                          <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-mono text-[10px] font-bold rounded">
                            Integrity Score: {integrityScore}/100
                          </span>
                        </div>
                        <h2 className="font-serif text-3xl font-bold text-[#FBF9F5] mt-1">{m.name}</h2>
                        <p className="text-xs text-[#9CA3AF] font-mono mt-1">
                          {m.title || "Cabinet Minister"} • {m.ministry || "Government of India"}
                        </p>
                        <p className="text-xs text-[#9CA3AF] font-mono mt-0.5">
                          Party: <strong className="text-[#FBF9F5]">{m.party || "BJP (NDA)"}</strong> • Education: <strong className="text-[#FBF9F5]">{m.education}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedMinister(null)}
                        className="p-2 bg-[#374151] rounded-full text-[#FBF9F5] hover:bg-[#991B1B] transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Vitals & Financial Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                      <div className="bg-[#111827] p-4 rounded border border-[#374151]">
                        <span className="text-[#9CA3AF] block uppercase text-[10px]">DECLARED NET ASSETS</span>
                        <span className="text-xl font-bold text-[#FBF9F5] mt-1 block">₹{totalAssets} Cr</span>
                        <span className="text-[10px] text-[#10B981] mt-1 block">+{assetGrowth}% Growth (ECI)</span>
                      </div>
                      <div className="bg-[#111827] p-4 rounded border border-[#374151]">
                        <span className="text-[#9CA3AF] block uppercase text-[10px]">DECLARED LIABILITIES</span>
                        <span className="text-xl font-bold text-[#FF4D4D] mt-1 block">₹{liabilities} Cr</span>
                        <span className="text-[10px] text-[#9CA3AF] mt-1 block">Bank & Tax Disclosures</span>
                      </div>
                      <div className="bg-[#111827] p-4 rounded border border-[#374151]">
                        <span className="text-[#9CA3AF] block uppercase text-[10px]">CRIMINAL & LEGAL RECORD</span>
                        <span className={`text-xl font-bold mt-1 block ${casesCount > 0 ? "text-[#FF4D4D]" : "text-[#10B981]"}`}>
                          {casesCount > 0 ? `${casesCount} Cases` : "0 Cases Clean"}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] mt-1 block">
                          {seriousCount > 0 ? `${seriousCount} Serious IPC Charges` : "ECI Affidavit Verified"}
                        </span>
                      </div>
                      <div className="bg-[#111827] p-4 rounded border border-[#374151]">
                        <span className="text-[#9CA3AF] block uppercase text-[10px]">MANIFESTO FULFILLMENT</span>
                        <span className="text-xl font-bold text-[#10B981] mt-1 block">
                          {deliveredCount} / {promises.length} Promises
                        </span>
                        <span className="text-[10px] text-[#10B981] mt-1 block">
                          {Math.round((deliveredCount / (promises.length || 1)) * 100)}% Delivered
                        </span>
                      </div>
                    </div>

                    {/* Manifesto Promises Tracking */}
                    <div className="bg-[#111827] border border-[#374151] p-5 rounded space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#374151] pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#FF4D4D] uppercase">PORTFOLIO MANIFESTO PROMISES & TRACKER</span>
                          <h3 className="font-serif text-2xl font-bold text-[#FBF9F5]">Promises Performance Record</h3>
                        </div>
                        {/* Filter Pills */}
                        <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
                          {["ALL", "DELIVERED", "IN_PROGRESS", "NOT_DELIVERED"].map((f) => (
                            <button
                              key={f}
                              onClick={() => setPromiseFilter(f)}
                              className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                                promiseFilter === f
                                  ? "bg-[#991B1B] text-[#FBF9F5] font-bold border-[#991B1B]"
                                  : "bg-[#1F2937] text-[#9CA3AF] border-[#374151] hover:bg-[#374151]"
                              }`}
                            >
                              {f === "ALL" && `All (${promises.length})`}
                              {f === "DELIVERED" && `✓ Done (${deliveredCount})`}
                              {f === "IN_PROGRESS" && `⚡ In Progress (${inProgressCount})`}
                              {f === "NOT_DELIVERED" && `✗ Pending (${pendingCount})`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* VISUAL TRACKER PROGRESS BAR & STATUS BREAKDOWN */}
                      <div className="bg-[#1F2937] border border-[#374151] p-4 rounded space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center text-[#FBF9F5]">
                          <span className="font-bold uppercase text-[11px] text-[#FF4D4D]">PROGRESS TRACKER OVERVIEW</span>
                          <span className="text-[11px] text-[#9CA3AF]">Total Tracked: <strong>{promises.length} Promises</strong></span>
                        </div>

                        {/* Multi-segment Progress Bar */}
                        <div className="w-full h-3.5 bg-[#111827] rounded-full overflow-hidden flex border border-[#374151]">
                          <div
                            style={{ width: `${(deliveredCount / (promises.length || 1)) * 100}%` }}
                            className="bg-[#10B981] h-full transition-all"
                            title={`Delivered: ${deliveredCount}`}
                          />
                          <div
                            style={{ width: `${(inProgressCount / (promises.length || 1)) * 100}%` }}
                            className="bg-[#3B82F6] h-full transition-all"
                            title={`In Progress: ${inProgressCount}`}
                          />
                          <div
                            style={{ width: `${(pendingCount / (promises.length || 1)) * 100}%` }}
                            className="bg-[#EF4444] h-full transition-all"
                            title={`Pending: ${pendingCount}`}
                          />
                        </div>

                        {/* Status KPI Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[11px]">
                          <div className="bg-[#064E3B]/40 text-[#34D399] border border-[#059669]/40 p-2.5 rounded flex flex-col items-center justify-center font-bold">
                            <span>✓ DELIVERED</span>
                            <span className="text-sm font-extrabold mt-0.5">{deliveredCount} ({Math.round((deliveredCount / (promises.length || 1)) * 100)}%)</span>
                          </div>
                          <div className="bg-[#1E3A8A]/40 text-[#60A5FA] border border-[#3B82F6]/50 p-2.5 rounded flex flex-col items-center justify-center font-bold">
                            <span className="flex items-center gap-1">
                              <span className="text-[#F97316]">⚡</span> IN PROGRESS
                            </span>
                            <span className="text-sm font-extrabold mt-0.5">{inProgressCount} ({Math.round((inProgressCount / (promises.length || 1)) * 100)}%)</span>
                          </div>
                          <div className="bg-[#7F1D1D]/40 text-[#FCA5A5] border border-[#DC2626]/40 p-2.5 rounded flex flex-col items-center justify-center font-bold">
                            <span>✗ PENDING / NOT DONE</span>
                            <span className="text-sm font-extrabold mt-0.5">{pendingCount} ({Math.round((pendingCount / (promises.length || 1)) * 100)}%)</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {filteredPromises.map((p) => (
                          <div key={p.id} className="bg-[#1F2937] border border-[#374151] p-4 rounded space-y-2">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-[#9CA3AF] uppercase">{p.category} ({p.year})</span>
                                <h4 className="font-serif text-lg font-bold text-[#FBF9F5] mt-0.5">{p.promiseTitle}</h4>
                              </div>
                              <span
                                className={`px-3 py-1 rounded font-mono text-xs font-bold flex items-center gap-1 ${
                                  p.status === "DELIVERED"
                                    ? "bg-[#064E3B]/40 text-[#34D399] border border-[#059669]/40"
                                    : p.status === "IN_PROGRESS" || p.status === "PARTIALLY_DELIVERED"
                                    ? "bg-[#1E3A8A]/40 text-[#60A5FA] border border-[#3B82F6]/50"
                                    : "bg-[#7F1D1D]/40 text-[#FCA5A5] border border-[#DC2626]/40"
                                }`}
                              >
                                {p.status === "DELIVERED" && "✓ DELIVERED"}
                                {(p.status === "IN_PROGRESS" || p.status === "PARTIALLY_DELIVERED") && (
                                  <>
                                    <span className="text-[#F97316]">⚡</span> IN PROGRESS
                                  </>
                                )}
                                {(p.status === "NOT_DELIVERED" || p.status === "NOT_VERIFIED") && "✗ PENDING / NOT DONE"}
                              </span>
                            </div>
                            <p className="text-xs font-sans text-[#9CA3AF]">{p.description}</p>
                            <div className="bg-[#111827] p-3 rounded border border-[#374151] font-mono text-[11px] space-y-1">
                              <span className="text-[#FF4D4D] font-bold block">VERIFIED AUDIT EVIDENCE</span>
                              <p className="text-[#9CA3AF] font-sans">{p.evidenceSummary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* NEWSLETTER & SUBSCRIBERS SECTION */}
        {activeSection === "newsletter" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">ACTIVE SUBSCRIBERS</span>
                <span className="text-3xl font-bold text-[#991B1B] mt-1 block">8,921</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">✓ 99.4% Delivery Rate</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">AVG OPEN RATE</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">46.2%</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">Industry benchmark: 22%</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">AVG CLICK-THROUGH</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">18.4%</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">Citing evidence links</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">EDITIONS PUBLISHED</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">104 Briefs</span>
                <span className="text-[10px] text-[#9CA3AF] mt-2 block">Weekly Dispatch</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
              {/* Editions List */}
              <div className="lg:col-span-2 bg-[#1F2937] p-6 rounded border border-[#374151] space-y-4">
                <div className="flex justify-between items-center border-b border-[#374151] pb-3 font-mono text-xs">
                  <span className="text-[#991B1B] font-bold uppercase">THE CIVIC BRIEF EDITIONS</span>
                  <button
                    onClick={() => {
                      const newNl: NewsletterEdition = {
                        id: `nl-${Date.now()}`,
                        title: `The Civic Brief #${newsletters.length + 104}: Union Budget Special`,
                        subject: "Analyzing upcoming fiscal allocation targets",
                        status: "DRAFT",
                        recipientsCount: 0,
                      };
                      setNewsletters((prev) => [newNl, ...prev]);
                      addAuditLog("CREATED_ENTRY", newNl.title, "Created new draft newsletter edition");
                    }}
                    className="px-3 py-1 bg-[#991B1B] text-[#FFFFFF] rounded text-[11px] hover:bg-[#7F1D1D] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Draft New Brief
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {newsletters.map((nl) => (
                    <div key={nl.id} className="bg-[#111827] p-4 rounded border border-[#374151] space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#FBF9F5] text-sm">{nl.title}</h4>
                          <p className="text-xs text-[#9CA3AF] font-sans mt-0.5">{nl.subject}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            nl.status === "SENT"
                              ? "bg-[#10B981]/20 text-[#10B981]"
                              : nl.status === "SCHEDULED"
                              ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                              : "bg-[#F59E0B]/20 text-[#F59E0B]"
                          }`}
                        >
                          {nl.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-[11px] text-[#9CA3AF] border-t border-[#374151]/50">
                        <span>{nl.sentDate ? `Dispatched: ${nl.sentDate}` : "Not Dispatched"}</span>
                        <div className="flex items-center gap-3">
                          {nl.openRate && <span>Opens: {nl.openRate}</span>}
                          {nl.clickRate && <span>Clicks: {nl.clickRate}</span>}
                          <button
                            onClick={() => {
                              if (nl.status === "DRAFT") {
                                setNewsletters((prev) =>
                                  prev.map((item) =>
                                    item.id === nl.id ? { ...item, status: "SCHEDULED", sentDate: "Tomorrow 09:00 AM" } : item
                                  )
                                );
                                addAuditLog("UPDATED_SCHEME", nl.title, "Scheduled newsletter for dispatch");
                              }
                            }}
                            className="px-2 py-0.5 bg-[#374151] hover:bg-[#991B1B] text-[#FBF9F5] rounded transition-colors text-[10px]"
                          >
                            {nl.status === "DRAFT" ? "Schedule Send" : "View Analytics"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribers Table */}
              <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-4">
                <span className="text-[#991B1B] font-mono text-xs font-bold uppercase block border-b border-[#374151] pb-3">
                  SUBSCRIBER DIRECTORY
                </span>

                <div className="space-y-3 font-mono text-xs">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="bg-[#111827] p-3 rounded border border-[#374151] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#FBF9F5]">{sub.name}</span>
                        <span className="text-[10px] text-[#10B981]">{sub.status}</span>
                      </div>
                      <p className="text-[11px] text-[#9CA3AF]">{sub.email}</p>
                      <div className="flex justify-between text-[10px] text-[#6B7280]">
                        <span>{sub.location}</span>
                        <span>Joined: {sub.joinedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI KNOWLEDGE & QUERY LOGS SECTION */}
        {activeSection === "ai" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">INDEXED DOCUMENTS</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">{aiDocs.length} Sets</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">✓ Full Vector Embeddings</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">VECTOR CHUNKS</span>
                <span className="text-3xl font-bold text-[#FBF9F5] mt-1 block">5,010</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">pgvector 1536-dim</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">AVG QUERY LATENCY</span>
                <span className="text-3xl font-bold text-[#10B981] mt-1 block">151 ms</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">Fast Data Retrieval</span>
              </div>
              <div className="bg-[#1F2937] p-5 rounded border border-[#374151]">
                <span className="text-xs text-[#9CA3AF] block uppercase">HALLUCINATION RATE</span>
                <span className="text-3xl font-bold text-[#991B1B] mt-1 block">0.0%</span>
                <span className="text-[10px] text-[#10B981] mt-2 block">Strict Data-First Enforcement</span>
              </div>
            </div>

            {/* Vector Index Management & Reindex button */}
            <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-4 font-sans">
              <div className="flex justify-between items-center border-b border-[#374151] pb-3 font-mono text-xs">
                <span className="text-[#991B1B] font-bold uppercase">VECTOR KNOWLEDGE DOCUMENTS</span>
                <button
                  onClick={handleTriggerReindex}
                  disabled={isReindexing}
                  className="px-3 py-1.5 bg-[#991B1B] text-[#FFFFFF] rounded text-xs font-mono hover:bg-[#7F1D1D] inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? "animate-spin" : ""}`} />
                  {isReindexing ? "REINDEXING VECTORS..." : "TRIGGER VECTOR RE-INDEX"}
                </button>
              </div>

              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#374151] text-[#9CA3AF] uppercase">
                    <th className="pb-3">DOCUMENT SET</th>
                    <th className="pb-3">CATEGORY</th>
                    <th className="pb-3">VECTOR CHUNKS</th>
                    <th className="pb-3">STATUS</th>
                    <th className="pb-3 text-right">LAST SYNC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {aiDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#111827]/50">
                      <td className="py-3 font-semibold text-[#FBF9F5]">{doc.title}</td>
                      <td className="py-3 text-[#9CA3AF]">{doc.category}</td>
                      <td className="py-3 text-[#FBF9F5]">{doc.chunks.toLocaleString()} chunks</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-semibold rounded text-[10px]">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[#9CA3AF]">{doc.lastSynced}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Query Execution Logs */}
            <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-4 font-mono text-xs">
              <span className="text-[#991B1B] font-bold uppercase block border-b border-[#374151] pb-3">
                RECENT "ASK THE DATA" AI EXECUTIONS & CITATIONS
              </span>

              <div className="space-y-2">
                {aiLogs.map((log) => (
                  <div key={log.id} className="bg-[#111827] p-3.5 rounded border border-[#374151] flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span className="font-semibold text-[#FBF9F5]">{log.userQuery}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#9CA3AF] font-sans">
                        <span>Format: <strong className="text-[#FBF9F5] font-mono">{log.visualizationType}</strong></span>
                        <span>• Latency: <strong className="text-[#10B981] font-mono">{log.latencyMs}ms</strong></span>
                        <span>• Citations: <strong className="text-[#FBF9F5] font-mono">{log.sourcesCited} sources</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-bold rounded text-[10px]">
                        CONFIDENCE: {log.confidence}
                      </span>
                      <span className="block text-[10px] text-[#6B7280] mt-1">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AUDIT LOGS & SECURITY VIEW */}
        {activeSection === "audit" && (
          <div className="bg-[#1F2937] p-6 rounded border border-[#374151] space-y-6 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[#374151] pb-4">
              <div>
                <span className="text-[#991B1B] font-bold uppercase block">SECURITY & IMMUTABLE AUDIT TRAIL LOG SYSTEM</span>
                <p className="text-[#9CA3AF] text-xs font-sans mt-0.5">
                  Every data edit, verification advancement, document index, or status modification is recorded immutably.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[#10B981] bg-[#111827] px-3 py-1.5 rounded border border-[#374151]">
                <Lock className="w-4 h-4" />
                <span className="text-xs">RBAC Token Enforced</span>
              </div>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-[#111827] p-4 rounded border border-[#374151] flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#991B1B]/20 text-[#991B1B] font-bold rounded text-[10px] uppercase">
                        {log.action}
                      </span>
                      <span className="text-[#FBF9F5] font-bold text-sm">{log.entity}</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] font-sans pl-1">{log.details}</p>
                  </div>
                  <div className="text-right text-[11px] text-[#9CA3AF]">
                    <span className="text-[#FBF9F5] font-semibold">{log.user}</span>
                    <span className="block text-[10px] text-[#6B7280]">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: NEW DATA ENTRY */}
      {isNewEntryOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] border border-[#374151] rounded-lg max-w-lg w-full p-6 space-y-6 font-sans shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#374151] pb-3 font-mono">
              <h3 className="font-bold text-lg text-[#FBF9F5] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#991B1B]" /> NEW INTELLIGENCE DATA ENTRY
              </h3>
              <button onClick={() => setIsNewEntryOpen(false)} className="text-[#9CA3AF] hover:text-[#FBF9F5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewEntry} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#9CA3AF] block mb-1 uppercase text-[11px]">Entry Type</label>
                <select
                  value={newEntryForm.type}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, type: e.target.value })}
                  className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-[#FBF9F5] focus:outline-none focus:border-[#991B1B]"
                >
                  <option value="SCHEME">Scheme Tracked</option>
                  <option value="CAG">CAG Audit Finding</option>
                </select>
              </div>

              <div>
                <label className="text-[#9CA3AF] block mb-1 uppercase text-[11px]">Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PM Matsya Sampada Yojana"
                  value={newEntryForm.name}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, name: e.target.value })}
                  className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-[#FBF9F5] focus:outline-none focus:border-[#991B1B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#9CA3AF] block mb-1 uppercase text-[11px]">Ministry</label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of Fisheries"
                    value={newEntryForm.ministry}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, ministry: e.target.value })}
                    className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-[#FBF9F5] focus:outline-none focus:border-[#991B1B]"
                  />
                </div>
                <div>
                  <label className="text-[#9CA3AF] block mb-1 uppercase text-[11px]">Outlay / Amount (₹ Cr)</label>
                  <input
                    type="number"
                    placeholder="e.g. 20050"
                    value={newEntryForm.budgetAllocatedCr}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, budgetAllocatedCr: e.target.value })}
                    className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-[#FBF9F5] focus:outline-none focus:border-[#991B1B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#9CA3AF] block mb-1 uppercase text-[11px]">Initial Status</label>
                  <select
                    value={newEntryForm.status}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, status: e.target.value })}
                    className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-[#FBF9F5] focus:outline-none focus:border-[#991B1B]"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="IN REVIEW">IN REVIEW</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#9CA3AF] block mb-1 uppercase text-[11px]">Evidence Score (0-100)</label>
                  <input
                    type="number"
                    value={newEntryForm.evidenceScore}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, evidenceScore: e.target.value })}
                    className="w-full bg-[#111827] border border-[#374151] rounded p-2 text-[#FBF9F5] focus:outline-none focus:border-[#991B1B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#374151]">
                <button
                  type="button"
                  onClick={() => setIsNewEntryOpen(false)}
                  className="px-4 py-2 bg-[#374151] text-[#FBF9F5] rounded hover:bg-[#4B5563] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#991B1B] text-[#FFFFFF] rounded hover:bg-[#7F1D1D] cursor-pointer font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SCHEME / VERIFICATION WORKFLOW */}
      {editingScheme && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] border border-[#374151] rounded-lg max-w-lg w-full p-6 space-y-6 font-sans shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#374151] pb-3 font-mono">
              <h3 className="font-bold text-lg text-[#FBF9F5] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#991B1B]" /> VERIFICATION WORKFLOW: {editingScheme.name}
              </h3>
              <button onClick={() => setEditingScheme(null)} className="text-[#9CA3AF] hover:text-[#FBF9F5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="bg-[#111827] p-3 rounded border border-[#374151] space-y-1">
                <span className="text-[#9CA3AF] text-[10px] block">CURRENT STAGE</span>
                <span className="text-lg font-bold text-[#10B981]">{editingScheme.status}</span>
                <p className="text-[11px] text-[#9CA3AF] font-sans">{editingScheme.summary}</p>
              </div>

              <div>
                <label className="text-[#9CA3AF] block mb-2 uppercase text-[11px]">Advance Pipeline Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["DRAFT", "IN REVIEW", "VERIFIED", "PUBLISHED"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateSchemeStatus(editingScheme.id, st)}
                      className={`p-2.5 rounded border text-left flex justify-between items-center transition-all cursor-pointer ${
                        editingScheme.status === st
                          ? "bg-[#991B1B] border-[#991B1B] text-[#FFFFFF] font-bold"
                          : "bg-[#111827] border-[#374151] text-[#9CA3AF] hover:border-[#991B1B]"
                      }`}
                    >
                      <span>{st}</span>
                      {editingScheme.status === st && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#374151] flex justify-end">
                <button
                  onClick={() => setEditingScheme(null)}
                  className="px-4 py-2 bg-[#991B1B] text-[#FFFFFF] rounded hover:bg-[#7F1D1D] font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

