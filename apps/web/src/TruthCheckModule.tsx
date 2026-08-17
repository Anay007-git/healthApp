import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  Bot,
  Flame,
  FileText,
  Filter,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  Send,
  X,
  Radio,
  Check,
  AlertOctagon,
  Scale,
  Zap,
} from "lucide-react";
import { FactCheckClaim, ClaimAnalysisResult, FactCheckVerdict, ClaimCategory, Evidence } from "@civiclens/types";
import { db, FACT_CHECK_CLAIMS } from "@civiclens/database";
import { aiEngine } from "@civiclens/ai";

interface TruthCheckModuleProps {
  onOpenEvidence: (evidenceId?: string) => void;
}

const SAMPLE_VIRAL_CLAIMS = [
  {
    label: "📱 Free ₹5,000 Scheme Link",
    text: "URGENT: Prime Minister Modi is offering free ₹5,000 mobile recharge under PM Free Yojna before 31st! Click bit.ly/pm-recharge-free and forward to 10 groups to claim now!",
  },
  {
    label: "💳 18% GST on UPI",
    text: "Breaking: Govt announced 18% GST tax on all GPay, PhonePe, and UPI payments above ₹2,000 starting from next week. Share with all shopkeepers.",
  },
  {
    label: "💵 ₹500 Note Green Strip",
    text: "Audio from bank manager: RBI declared all ₹500 notes where the green strip is near Gandhi photo fake and invalid from today. Check your notes immediately.",
  },
  {
    label: "🗳️ SC Banned EVMs",
    text: "Supreme Court 5-judge bench ordered immediate ban on EVMs and mandated 100% paper ballots for all upcoming elections in landmark order.",
  },
  {
    label: "🏥 CAG ₹7.5L Cr Ayushman Scam",
    text: "CAG audit tabled in Parliament exposed ₹7.5 Lakh Crore corruption in Ayushman Bharat PM-JAY where money was stolen on number 9999999999.",
  },
  {
    label: "🚗 DigiLocker ₹25k Fine",
    text: "Traffic police banned phone documents. Showing DigiLocker or mParivahan RC will attract ₹25,000 fine and vehicle seizure from tomorrow.",
  },
];

const CATEGORY_TABS: { id: ClaimCategory | "ALL"; label: string }[] = [
  { id: "ALL", label: "All Radar (10)" },
  { id: "SCHEMES", label: "Schemes & Subsidies" },
  { id: "ECONOMY", label: "Economy & Currency" },
  { id: "CAG_CORRUPTION", label: "CAG & Corruption" },
  { id: "ELECTIONS", label: "Elections & Voting" },
  { id: "HEALTH", label: "Health & Alerts" },
  { id: "LEGAL", label: "Legal & Traffic" },
];

export function TruthCheckModule({ onOpenEvidence }: TruthCheckModuleProps) {
  // DeepScan Studio Input & State
  const [claimInput, setClaimInput] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [scanResult, setScanResult] = useState<ClaimAnalysisResult | null>(null);

  // Radar Feed Filters
  const [selectedCategory, setSelectedCategory] = useState<ClaimCategory | "ALL">("ALL");
  const [selectedVerdict, setSelectedVerdict] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Copy Feedback State
  const [copiedClaimId, setCopiedClaimId] = useState<string | null>(null);
  const [scannerCopied, setScannerCopied] = useState<boolean>(false);

  // Crowdsourced Submit Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submitText, setSubmitText] = useState<string>("");
  const [submitPlatform, setSubmitPlatform] = useState<string>("WhatsApp");
  const [submitUrl, setSubmitUrl] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");

  // Live Claim Scan Execution
  const handleScanClaim = async (textToScan?: string) => {
    const query = textToScan || claimInput;
    if (!query.trim()) return;

    setIsScanning(true);
    setScanResult(null);
    setScanStep(1);

    // Step 1: Linguistic Analysis
    await new Promise((r) => setTimeout(r, 350));
    setScanStep(2);

    // Step 2: Database Cross-Check
    await new Promise((r) => setTimeout(r, 450));
    setScanStep(3);

    // Step 3: Synthesis
    try {
      const res = await fetch("/api/factcheck/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setScanResult(json.data);
          setIsScanning(false);
          setScanStep(4);
          return;
        }
      }
    } catch {
      // Fallback directly to in-engine analyzer
    }

    const localResult = await aiEngine.analyzeMisinformation(query);
    setScanResult(localResult);
    setIsScanning(false);
    setScanStep(4);
  };

  const handleCopyDebunk = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClaimId(id);
    setTimeout(() => setCopiedClaimId(null), 2500);
  };

  const handleCopyScannerDebunk = (text: string) => {
    navigator.clipboard.writeText(text);
    setScannerCopied(true);
    setTimeout(() => setScannerCopied(false), 2500);
  };

  const handleSubmitNewClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitText.trim()) return;

    try {
      const res = await fetch("/api/factcheck/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimText: submitText,
          sourcePlatform: submitPlatform,
          url: submitUrl || undefined,
        }),
      });
      if (res.ok) {
        setSubmitSuccess("Claim registered! Our audit desk will index official gazettes and publish the debunk verification.");
      } else {
        db.submitClaimForReview({ claimText: submitText, sourcePlatform: submitPlatform, url: submitUrl });
        setSubmitSuccess("Claim queued for verification against official gazettes.");
      }
    } catch {
      db.submitClaimForReview({ claimText: submitText, sourcePlatform: submitPlatform, url: submitUrl });
      setSubmitSuccess("Claim queued for verification against official gazettes.");
    }

    setTimeout(() => {
      setSubmitText("");
      setSubmitUrl("");
      setSubmitSuccess("");
      setIsSubmitModalOpen(false);
    }, 2000);
  };

  // Filtered radar debunks
  const claims = db.getFactChecks({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
    verdict: selectedVerdict === "ALL" ? undefined : selectedVerdict,
    search: searchQuery || undefined,
  });

  const getVerdictBadge = (verdict: FactCheckVerdict) => {
    switch (verdict) {
      case "FALSE":
        return {
          label: "FALSE / FABRICATED (नकली / असत्य)",
          bg: "bg-[#DC2626]",
          textColor: "text-white",
          border: "border-black",
          pillBg: "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]",
          icon: AlertOctagon,
        };
      case "MISLEADING":
        return {
          label: "MISLEADING / OUT OF CONTEXT (भ्रामक)",
          bg: "bg-[#EA580C]",
          textColor: "text-white",
          border: "border-black",
          pillBg: "bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]",
          icon: AlertTriangle,
        };
      case "VERIFIED_TRUE":
        return {
          label: "VERIFIED TRUE / OFFICIAL (सत्यापित)",
          bg: "bg-[#16A34A]",
          textColor: "text-white",
          border: "border-black",
          pillBg: "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]",
          icon: CheckCircle2,
        };
      case "SATIRE":
        return {
          label: "SATIRE / HUMOR (व्यंग्य)",
          bg: "bg-[#9333EA]",
          textColor: "text-white",
          border: "border-black",
          pillBg: "bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]",
          icon: Sparkles,
        };
      default:
        return {
          label: "UNVERIFIED / NO OFFICIAL RECORD (अपुष्ट)",
          bg: "bg-[#EAB308]",
          textColor: "text-black",
          border: "border-black",
          pillBg: "bg-[#FEF9C3] text-[#A16207] border-[#FDE047]",
          icon: Info,
        };
    }
  };

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* PATRIOTIC & CIVIC HEADER */}
      <section className="text-center space-y-4 border-b border-[#E8DEC8] pb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF671F]/10 text-[#06038D] text-xs font-mono font-black uppercase rounded-full tracking-wider border-2 border-[#FF671F]/40 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-[#FF671F]" />
          सत्यमेव जयते • EVIDENCE-POWERED MISINFORMATION RADAR
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-[#0F172A] max-w-4xl mx-auto leading-tight">
          TruthCheck™: Detect Fake News Through <span className="bg-gradient-to-r from-[#FF671F] via-[#06038D] to-[#046A38] bg-clip-text text-transparent">Audited Evidence</span>.
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#475569] max-w-3xl mx-auto font-sans leading-relaxed">
          Paste any viral WhatsApp message, sensational news headline, fake scheme link, or political claim. Our engine cross-references Union Gazettes, CAG audits, ECI filings, and PIB Fact Check records.
        </p>

        {/* Quick Stat Counters */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 font-mono text-xs">
          <div className="bg-white px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
            <span className="text-[#475569]">DEBUNKS INDEXED: </span>
            <strong className="text-[#06038D]">{FACT_CHECK_CLAIMS.length} Verified</strong>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
            <span className="text-[#475569]">ENGINE METHOD: </span>
            <strong className="text-[#046A38]">100% Primary Gazette Match</strong>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
            <span className="text-[#475569]">LICENSE: </span>
            <strong className="text-[#FF671F]">Open-Source & 100% Free</strong>
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE CLAIM SCANNER WORKBENCH (DEEPSCAN STUDIO) */}
      <section className="bg-white border-2 border-black p-4 sm:p-7 md:p-9 rounded-2xl shadow-[6px_6px_0px_#000000] space-y-6">
        <div className="border-b-2 border-black pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF671F] flex items-center justify-center rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
              <Radio className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-xs font-black text-[#D95300] uppercase tracking-wider block">
                INTERACTIVE VERIFICATION STUDIO
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#0F172A]">
                DeepScan™ Viral Claim Analyzer
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-[#FAF7F0] hover:bg-[#FFE877] text-black text-xs font-mono font-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5 text-[#06038D]" />
            <span>Submit New Rumor →</span>
          </button>
        </div>

        {/* Input Textarea & Action Area */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              placeholder="Paste viral WhatsApp forward, social media headline, or unverified claim here... (e.g. 'Govt giving free ₹5000 recharge under PM Modi scheme click bit.ly/...')"
              value={claimInput}
              onChange={(e) => setClaimInput(e.target.value)}
              className="w-full bg-[#FAF7F0] border-2 border-black p-4 rounded-xl font-sans text-sm sm:text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#06038D] shadow-inner resize-y leading-relaxed"
            />
            {claimInput && (
              <button
                onClick={() => setClaimInput("")}
                className="absolute top-3 right-3 p-1.5 bg-white border border-black rounded-lg hover:bg-red-50 text-[#DC2626] shadow-xs cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Try Sample Chips */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#475569]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>TEST COMMON VIRAL FORWARDS:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_VIRAL_CLAIMS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setClaimInput(sample.text);
                    handleScanClaim(sample.text);
                  }}
                  className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#FFE877] text-black text-xs font-mono font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Scan Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => handleScanClaim()}
              disabled={isScanning || !claimInput.trim()}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#06038D] hover:bg-[#046A38] text-white text-sm font-mono font-black border-2 border-black rounded-xl shadow-[4px_4px_0px_#000000] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AUDITING GAZETTES & CLAIM...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-[#00E599]" />
                  <span>SCAN & DEBUNK CLAIM NOW →</span>
                </>
              )}
            </button>

            <span className="text-xs font-mono text-[#64748B] text-center sm:text-left">
              Triangulates linguistic NLP heuristics with Union Budget, CAG audits & PIB releases.
            </span>
          </div>
        </div>

        {/* Real-time Scanning Progress Animation */}
        {isScanning && (
          <div className="bg-[#FAF7F0] border-2 border-black p-6 rounded-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono font-black text-black">
              <span>SCANNING TELEMETRY IN PROGRESS</span>
              <span className="text-[#06038D]">STEP {scanStep} OF 3</span>
            </div>

            <div className="w-full bg-[#E8DEC8] h-3 rounded-full overflow-hidden border border-black">
              <div
                className="bg-[#00E599] h-full transition-all duration-300 border-r border-black"
                style={{ width: `${(scanStep / 3) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className={`p-3 rounded-lg border-2 border-black flex items-center gap-2 ${scanStep >= 1 ? "bg-[#FFE877]" : "bg-white opacity-60"}`}>
                <span className="font-black">1.</span>
                <span>Linguistic & Urgency Scan</span>
              </div>
              <div className={`p-3 rounded-lg border-2 border-black flex items-center gap-2 ${scanStep >= 2 ? "bg-[#FFE877]" : "bg-white opacity-60"}`}>
                <span className="font-black">2.</span>
                <span>Gazette & Scheme Cross-Match</span>
              </div>
              <div className={`p-3 rounded-lg border-2 border-black flex items-center gap-2 ${scanStep >= 3 ? "bg-[#00E599]" : "bg-white opacity-60"}`}>
                <span className="font-black">3.</span>
                <span>Verdict & Counter-Evidence</span>
              </div>
            </div>
          </div>
        )}

        {/* SCAN RESULT CARD (NEO-BRUTALIST REALISM) */}
        {!isScanning && scanResult && (() => {
          const badge = getVerdictBadge(scanResult.verdict);
          const BadgeIcon = badge.icon;

          return (
            <div className="bg-[#FFFDF9] border-2 border-black p-5 sm:p-7 rounded-2xl shadow-[6px_6px_0px_#000000] space-y-6 animate-in fade-in duration-300">
              {/* Verdict Header Banner */}
              <div className={`${badge.bg} ${badge.textColor} border-2 border-black p-4 sm:p-5 rounded-xl shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black text-white rounded-lg border border-white">
                    <BadgeIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider block font-bold text-white/90">
                      CIVICLENS TRUTHCHECK™ VERDICT
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-black text-white tracking-tight">
                      {badge.label}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded-lg border border-white">
                    CONFIDENCE: {scanResult.confidenceScore}%
                  </span>
                  <span className="px-3 py-1 bg-[#FFE877] text-black font-mono text-xs font-black rounded-lg border border-black">
                    SENSATIONALISM: {scanResult.sensationalismScore}/100
                  </span>
                </div>
              </div>

              {/* Ground Truth vs Claim Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm">
                <div className="bg-[#FAF7F0] border-2 border-black p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-black text-[#DC2626]">
                    <AlertTriangle className="w-4 h-4" />
                    <span>THE VIRAL CLAIM SCANNED:</span>
                  </div>
                  <p className="text-black font-medium leading-relaxed italic bg-white p-3 rounded-lg border border-black/30">
                    "{scanResult.originalClaim}"
                  </p>
                </div>

                <div className="bg-[#DCFCE7] border-2 border-black p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-black text-[#15803D]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>THE GROUND REALITY (सच्चाई):</span>
                  </div>
                  <p className="text-[#0F172A] font-bold leading-relaxed bg-white p-3 rounded-lg border border-black/30">
                    {scanResult.groundReality}
                  </p>
                </div>
              </div>

              {/* Detailed Debunk Explanation */}
              <div className="bg-white border-2 border-black p-5 rounded-xl space-y-2.5">
                <span className="font-mono text-xs font-black text-[#06038D] uppercase tracking-wider block">
                  DETAILED FACT-CHECK & REGULATORY DEBUNK:
                </span>
                <p className="text-sm font-sans text-[#334155] leading-relaxed">
                  {scanResult.detailedDebunk}
                </p>
              </div>

              {/* Red-Flag Trigger Phrases & Linguistic Signals */}
              {scanResult.signalsDetected && scanResult.signalsDetected.length > 0 && (
                <div className="space-y-3 font-mono text-xs">
                  <span className="font-black text-black uppercase tracking-wider block flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#DC2626]" />
                    DETECTED MANIPULATION & RED-FLAG SIGNALS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {scanResult.signalsDetected.map((sig, i) => (
                      <div key={i} className="bg-[#FEF2F2] border-2 border-black p-3 rounded-lg space-y-1 shadow-[2px_2px_0px_#000]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#DC2626]">{sig.phrase}</span>
                          <span className="px-1.5 py-0.2 bg-[#DC2626] text-white rounded text-[10px]">
                            {sig.type}
                          </span>
                        </div>
                        <p className="text-[11px] font-sans text-[#475569]">{sig.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shareable WhatsApp Debunk Box */}
              <div className="bg-[#FAF7F0] border-2 border-black p-4 sm:p-5 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                  <span className="font-black text-black uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#06038D]" />
                    SHAREABLE WHATSAPP DEBUNK CARD:
                  </span>
                  <button
                    onClick={() => handleCopyScannerDebunk(scanResult.shareableDebunkText)}
                    className="px-3 py-1.5 bg-[#00E599] hover:bg-[#00c984] text-black font-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    {scannerCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{scannerCopied ? "COPIED TO CLIPBOARD!" : "COPY WHATSAPP DEBUNK"}</span>
                  </button>
                </div>
                <pre className="bg-white p-3 rounded-lg border border-black/40 text-[11px] font-mono text-[#0F172A] whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {scanResult.shareableDebunkText}
                </pre>
              </div>

              {/* Primary Gazette Evidence Links */}
              {scanResult.primarySources && scanResult.primarySources.length > 0 && (
                <div className="border-t-2 border-black pt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#06038D]" />
                    <span className="font-black text-black">PRIMARY EVIDENCE CITATION:</span>
                    <span className="text-[#475569]">{scanResult.primarySources[0]?.name || "Official PIB Fact Check Archive"}</span>
                  </div>
                  {scanResult.evidenceId && (
                    <button
                      onClick={() => onOpenEvidence(scanResult.evidenceId)}
                      className="px-3 py-1 bg-[#FFE877] text-black font-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] hover:bg-[#ffd83d] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect in Evidence Drawer →</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </section>

      {/* SECTION 2: VIRAL MISINFORMATION RADAR (TRENDING FEED) */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#DC2626] animate-ping" />
              <span className="font-mono text-xs font-black text-[#D95300] uppercase tracking-wider">
                LIVE VIRAL MISINFORMATION RADAR
              </span>
            </div>
            <h3 className="font-serif text-3xl font-black text-[#0F172A]">
              Trending Hoaxes & Verified Debunks in India
            </h3>
            <p className="text-xs text-[#475569] font-mono mt-0.5">
              Verified debunk archive cross-referenced with PIB Fact Check, RBI, CAG, Supreme Court & Union Ministries.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-white border-2 border-black px-3.5 py-2 rounded-xl font-mono text-xs shadow-[3px_3px_0px_#000]">
            <Search className="w-4 h-4 text-[#475569]" />
            <input
              type="text"
              placeholder="Search viral claim, keyword, or scheme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-64 text-black focus:outline-none placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#DC2626] hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs: Category & Verdict */}
        <div className="space-y-3 font-mono text-xs">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 table-scroll">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg border-2 border-black font-black whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-[#06038D] text-white shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black hover:bg-[#FFE877]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Verdict Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] font-bold">VERDICT:</span>
            {["ALL", "FALSE", "MISLEADING"].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVerdict(v)}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-black transition-all cursor-pointer ${
                  selectedVerdict === v
                    ? "bg-black text-white border-black"
                    : "bg-[#FAF7F0] text-[#475569] border-[#E8DEC8] hover:bg-white"
                }`}
              >
                {v === "ALL" ? "All Verdicts" : v === "FALSE" ? "❌ False Only" : "⚠️ Misleading Only"}
              </button>
            ))}
          </div>
        </div>

        {/* Debunk Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {claims.map((claim: FactCheckClaim) => {
            const badge = getVerdictBadge(claim.verdict);
            const isCopied = copiedClaimId === claim.id;

            const shareableText = `🚨 *CIVICLENS TRUTHCHECK DEBUNK*\n\n❌ *VERDICT*: ${claim.verdict}\n📌 *CLAIM*: "${claim.title}"\n\n✅ *GROUND REALITY*: ${claim.truthSummary}\n\n🔍 *OFFICIAL EVIDENCE*: Verified by ${claim.officialSourceLabel || "Press Information Bureau (PIB)"}.\n${claim.officialClarificationUrl ? `🔗 Link: ${claim.officialClarificationUrl}\n` : ""}⚠️ *DO NOT CIRCULATE UNVERIFIED FORWARDS.* Verified via CivicLens.in`;

            return (
              <div
                key={claim.id}
                className="bg-white border-2 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg border-2 border-black font-mono text-[11px] font-black ${badge.bg} text-white shadow-[1px_1px_0px_#000]`}>
                      {claim.verdict === "FALSE" ? "❌ FALSE / FABRICATED" : "⚠️ MISLEADING"}
                    </span>

                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="px-2 py-0.5 bg-[#FFE877] text-black font-black rounded border border-black">
                        🔥 Virality: {claim.viralityScore}%
                      </span>
                      <span className="text-[#64748B] hidden sm:inline">• {claim.category}</span>
                    </div>
                  </div>

                  {/* Title & Viral Claim */}
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-black text-[#0F172A] leading-snug">
                      {claim.title}
                    </h4>
                    <span className="font-mono text-[11px] text-[#DC2626] font-bold block mt-1">
                      Viral Claim: "{claim.claim}"
                    </span>
                  </div>

                  {/* Ground Reality Box */}
                  <div className="bg-[#FAF7F0] border border-black/30 p-3 rounded-xl space-y-1">
                    <span className="font-mono text-[10px] font-black text-[#046A38] uppercase block">
                      ✓ THE GROUND TRUTH:
                    </span>
                    <p className="font-sans text-xs text-[#0F172A] font-semibold leading-relaxed">
                      {claim.truthSummary}
                    </p>
                  </div>

                  {/* Detailed Explanation */}
                  <p className="font-sans text-xs text-[#475569] leading-relaxed line-clamp-3">
                    {claim.debunkExplanation}
                  </p>

                  {/* Red Flag Tags */}
                  {claim.highlightedRedFlags && claim.highlightedRedFlags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {claim.highlightedRedFlags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] text-[10px] font-mono font-bold rounded border border-[#FCA5A5]"
                        >
                          🚩 {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="border-t-2 border-black pt-3 flex items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold text-[#06038D] truncate">
                      {claim.officialSourceLabel || "PIB Fact Check"}
                    </span>
                    {claim.officialClarificationUrl && (
                      <a
                        href={claim.officialClarificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 bg-[#FAF7F0] border border-black rounded hover:bg-[#FFE877] transition-colors"
                        title="Open official gazette / source"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-black" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyDebunk(shareableText, claim.id)}
                      className="px-2.5 py-1 bg-[#FAF7F0] hover:bg-[#FFE877] text-black font-black border border-black rounded shadow-[1px_1px_0px_#000] transition-all flex items-center gap-1 cursor-pointer text-[11px]"
                      title="Copy formatted WhatsApp debunk"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? "Copied!" : "Copy Debunk"}</span>
                    </button>

                    {claim.evidenceId && (
                      <button
                        onClick={() => onOpenEvidence(claim.evidenceId)}
                        className="px-2.5 py-1 bg-[#06038D] hover:bg-[#046A38] text-white font-black border border-black rounded shadow-[1px_1px_0px_#000] transition-all cursor-pointer text-[11px]"
                      >
                        Evidence →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: CITIZEN RUMOR SUBMISSION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F0] border-2 border-black rounded-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-[8px_8px_0px_#000000] relative">
            <div className="flex justify-between items-start border-b-2 border-black pb-3">
              <div>
                <span className="font-mono text-xs font-black text-[#D95300] uppercase tracking-wider">
                  CITIZEN FACT-CHECK DESK
                </span>
                <h3 className="font-serif text-2xl font-black text-[#0F172A]">
                  Submit Unverified Forward for Audit
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 bg-white border-2 border-black rounded-lg hover:bg-red-50 text-black cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewClaim} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="font-black text-black uppercase">PASTE THE VIRAL FORWARD / RUMOR:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste the exact text, claims, or audio note transcript you received on WhatsApp or social media..."
                  value={submitText}
                  onChange={(e) => setSubmitText(e.target.value)}
                  className="w-full bg-white border-2 border-black p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#06038D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-black text-black uppercase">SOURCE PLATFORM:</label>
                  <select
                    value={submitPlatform}
                    onChange={(e) => setSubmitPlatform(e.target.value)}
                    className="w-full bg-white border-2 border-black p-2.5 rounded-lg text-black font-bold focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp Forward / Group</option>
                    <option value="Telegram">Telegram Channel</option>
                    <option value="Twitter/X">Twitter / X Post</option>
                    <option value="YouTube">YouTube Video / Short</option>
                    <option value="Facebook">Facebook Post / Reel</option>
                    <option value="Instagram">Instagram Reel</option>
                    <option value="Other">Other / SMS</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-black uppercase">SUSPICIOUS URL (OPTIONAL):</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={submitUrl}
                    onChange={(e) => setSubmitUrl(e.target.value)}
                    className="w-full bg-white border-2 border-black p-2.5 rounded-lg text-black focus:outline-none"
                  />
                </div>
              </div>

              {submitSuccess && (
                <div className="p-3 bg-[#DCFCE7] border-2 border-black rounded-lg text-[#15803D] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2.5 bg-white border-2 border-black text-black font-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#06038D] hover:bg-[#046A38] text-white font-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-[#00E599]" />
                  <span>Queue for Verification →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
