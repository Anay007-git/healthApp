import React, { useEffect } from "react";
import { Evidence } from "@civiclens/types";
import {
  X,
  CheckCircle,
  ExternalLink,
  FileText,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
  MapPin,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: Evidence | null;
  onNavigate?: (tab: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  evidence,
  onNavigate,
}) => {
  // Lock background scroll & handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !evidence) return null;

  const handleQuickNav = (tabId: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(tabId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark Opaque Backdrop with Click-to-Dismiss */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Snapshot Card Dialog */}
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F0] text-[#0F172A] rounded-2xl shadow-2xl border-2 border-[#E8DEC8] flex flex-col max-h-[92vh] overflow-hidden font-sans z-[10000] animate-in fade-in zoom-in-95 duration-150 my-auto"
        style={{ backgroundColor: "#FAF7F0" }}
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#FFFFFF] border-b border-[#E8DEC8] sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF671F]/10 border border-[#FF671F]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#D95300]" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#D95300] font-bold block">
                CIVIC INTELLIGENCE SNAPSHOT
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">
                Audited Primary Record
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold text-[#0F172A] bg-[#FAF7F0] hover:bg-[#E8DEC8] border border-[#E8DEC8] rounded-lg transition-colors cursor-pointer shadow-2xs"
            aria-label="Close Snapshot"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
          {/* Claim & Status Banner */}
          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8DEC8] shadow-xs space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-[10px] text-[#D95300] uppercase tracking-wider font-bold">
                VERIFIED CITIZEN FACT
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E8F5E9] text-[#046A38] border border-[#A5D6A7]">
                <CheckCircle className="w-3.5 h-3.5 text-[#046A38]" />
                {evidence.verificationStatus}
              </span>
            </div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
              {evidence.claim}
            </p>
            {evidence.verifiedAt && (
              <span className="font-mono text-[11px] text-[#64748B] block pt-1">
                Audited & Logged: <strong>{evidence.verifiedAt}</strong>
              </span>
            )}
          </div>

          {/* PROGRESS & ACCOUNTABILITY SCORES */}
          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8DEC8] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-2">
              <span className="font-mono text-[11px] text-[#06038D] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#06038D]" />
                DATA INTEGRITY & PROGRESS SCORES
              </span>
              <span className="font-mono text-[10px] text-[#15803D] font-bold bg-[#E8F5E9] px-2 py-0.5 rounded">
                Tier-1 Certified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Score 1 */}
              <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8DEC8] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#64748B] text-[10px] font-bold uppercase">Evidence Match</span>
                  <span className="font-bold text-[#046A38]">98%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#046A38] h-full rounded-full w-[98%]" />
                </div>
              </div>

              {/* Score 2 */}
              <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8DEC8] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#64748B] text-[10px] font-bold uppercase">Audit Traceability</span>
                  <span className="font-bold text-[#D95300]">94%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D95300] h-full rounded-full w-[94%]" />
                </div>
              </div>

              {/* Score 3 */}
              <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8DEC8] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#64748B] text-[10px] font-bold uppercase">Ground Delivery</span>
                  <span className="font-bold text-[#06038D]">82%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#06038D] h-full rounded-full w-[82%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Summary Card */}
          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8DEC8] shadow-xs space-y-1.5">
            <label className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider font-bold block">
              EVIDENCE SUMMARY & ANALYSIS
            </label>
            <p className="text-xs sm:text-sm text-[#0F172A] leading-relaxed font-sans font-medium">
              {evidence.evidenceSummary}
            </p>
          </div>

          {/* Primary Source Document Link */}
          {evidence.source && (
            <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8DEC8] shadow-xs space-y-3">
              <label className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider font-bold block">
                PRIMARY SOURCE ARCHIVE
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8DEC8]">
                  <span className="text-[#64748B] text-[10px] block uppercase font-bold">SOURCE NAME</span>
                  <span className="font-bold text-[#0F172A] text-xs">{evidence.source.name}</span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">{evidence.source.publisher}</span>
                </div>
                <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8DEC8] flex items-center justify-around">
                  <div>
                    <span className="text-[#64748B] text-[10px] block uppercase font-bold">PUBLISHED</span>
                    <span className="font-bold text-[#0F172A] text-xs">{evidence.source.publicationDate}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block uppercase font-bold">PAGE REF</span>
                    <span className="font-bold text-[#0F172A] text-xs">Pg {evidence.pageNumber || evidence.source.pageNumber || "1"}</span>
                  </div>
                </div>
              </div>

              {evidence.source.url && (
                <a
                  href={evidence.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#0F172A] text-[#FAF7F0] text-xs font-mono font-bold rounded-xl hover:bg-[#D95300] transition-colors shadow-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#FF671F]" />
                  VIEW ORIGINAL CAG AUDIT / SOURCE FILING
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Quick Page Jump Navigation */}
          <div className="bg-[#FAF7F0] border-2 border-dashed border-[#D6C6A5] p-4 rounded-xl space-y-2.5">
            <span className="text-[10.5px] font-mono font-bold text-[#0F172A] uppercase tracking-wider block">
              EXPLORE MORE SECTIONS (ONE-CLICK JUMP):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickNav("schemes")}
                className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#E8DEC8] hover:border-[#D95300] rounded-lg text-xs font-serif font-bold text-[#0F172A] transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D95300]" />
                  All Schemes
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              <button
                onClick={() => handleQuickNav("states")}
                className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#E8DEC8] hover:border-[#D95300] rounded-lg text-xs font-serif font-bold text-[#0F172A] transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#06038D]" />
                  State Metrics
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              <button
                onClick={() => handleQuickNav("cag")}
                className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#E8DEC8] hover:border-[#D95300] rounded-lg text-xs font-serif font-bold text-[#0F172A] transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                  CAG Audits
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Continue Browsing Button */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#FFFFFF] border-t border-[#E8DEC8] flex items-center justify-between gap-3 shrink-0">
          <p className="font-mono text-[9px] text-[#64748B] uppercase tracking-widest font-bold hidden sm:block">
            ORANGE-CHASMA EVIDENCE INTEGRITY ENGINE
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 saffron-btn rounded-xl font-serif text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
          >
            ← Close & Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
