import React, { useEffect } from "react";
import { Evidence } from "@civiclens/types";
import { X, CheckCircle, ExternalLink, FileText, ShieldCheck, HelpCircle } from "lucide-react";

export interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: Evidence | null;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ isOpen, onClose, evidence }) => {
  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Opaque Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel - Solid Opaque Background */}
      <div
        className="relative w-full max-w-lg bg-[#FAF7F0] text-[#0F172A] h-full shadow-2xl flex flex-col border-l-2 border-[#E8DEC8] p-5 sm:p-6 overflow-y-auto font-sans z-[10000]"
        style={{ backgroundColor: "#FAF7F0", opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4 sticky top-0 bg-[#FAF7F0] pt-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF671F]/10 border border-[#FF671F]/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#D95300]" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#D95300] font-bold block">
                AUDITED EVIDENCE VAULT
              </span>
              <h3 className="font-serif text-lg font-bold text-[#0F172A] leading-none">
                Primary Source Verification
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#475569] hover:text-[#0F172A] bg-[#FFFFFF] hover:bg-[#E8DEC8] border border-[#E8DEC8] rounded-lg transition-colors cursor-pointer"
            aria-label="Close Evidence Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim */}
        <div className="mt-5">
          <label className="font-mono text-[11px] text-[#D95300] uppercase tracking-wider font-bold">VERIFIED CLAIM</label>
          <p className="font-serif text-xl font-bold text-[#0F172A] mt-1 leading-snug">{evidence.claim}</p>
        </div>

        {/* Status Badge */}
        <div className="mt-3.5 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E8F5E9] text-[#046A38] border border-[#A5D6A7]">
            <CheckCircle className="w-4 h-4 text-[#046A38]" />
            {evidence.verificationStatus}
          </span>
          {evidence.verifiedAt && (
            <span className="font-mono text-xs text-[#64748B] font-medium">Verified: {evidence.verifiedAt}</span>
          )}
        </div>

        {/* Summary Card */}
        <div className="mt-5 bg-[#FFFFFF] p-4 rounded-xl border border-[#E8DEC8] shadow-xs space-y-1">
          <label className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider font-bold">EVIDENCE SUMMARY</label>
          <p className="text-sm text-[#0F172A] leading-relaxed font-sans">{evidence.evidenceSummary}</p>
        </div>

        {/* Source Details */}
        {evidence.source && (
          <div className="mt-5 space-y-3.5">
            <div>
              <label className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider font-bold">PRIMARY SOURCE</label>
              <p className="font-serif font-bold text-[#0F172A] text-base mt-0.5">{evidence.source.name}</p>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">{evidence.source.publisher}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#FFFFFF] p-3.5 rounded-xl text-xs font-mono border border-[#E8DEC8]">
              <div>
                <span className="text-[#64748B] text-[10px] block uppercase font-bold">PUBLISHED DATE</span>
                <span className="font-bold text-[#0F172A] text-xs">{evidence.source.publicationDate}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block uppercase font-bold">DOCUMENT PAGE</span>
                <span className="font-bold text-[#0F172A] text-xs">Page {evidence.pageNumber || evidence.source.pageNumber || "N/A"}</span>
              </div>
            </div>

            {evidence.source.url && (
              <a
                href={evidence.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0F172A] text-[#FAF7F0] text-xs font-mono font-bold rounded-xl hover:bg-[#D95300] transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FF671F]" />
                OPEN ORIGINAL AUDIT / SOURCE FILING
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Methodology */}
        {evidence.methodology && (
          <div className="mt-5 border-t border-[#E8DEC8] pt-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#64748B] uppercase tracking-wider font-bold mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#06038D]" />
              VERIFICATION METHODOLOGY
            </div>
            <p className="text-xs text-[#475569] leading-relaxed font-sans italic bg-[#FFFFFF] p-3 rounded-lg border border-[#E8DEC8]">
              {evidence.methodology}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-6 text-center border-t border-[#E8DEC8]">
          <p className="font-mono text-[9.5px] text-[#64748B] uppercase tracking-widest font-bold">
            ORANGE-CHASMA EVIDENCE INTEGRITY ENGINE • VERIFIABLE DATA
          </p>
        </div>
      </div>
    </div>
  );
};
