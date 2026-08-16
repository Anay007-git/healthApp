import React from "react";
import { Evidence } from "@civiclens/types";
import { X, CheckCircle, ExternalLink, FileText, ShieldCheck, HelpCircle } from "lucide-react";

export interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: Evidence | null;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ isOpen, onClose, evidence }) => {
  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-[#FBF9F5] text-[#111827] h-full shadow-2xl flex flex-col border-l border-[#E5E0D8] p-6 overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#991B1B]" />
            <span className="font-mono text-xs tracking-wider uppercase text-[#991B1B] font-bold">
              EVIDENCE VERIFICATION DRAWER
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#4B5563] hover:text-[#111827] hover:bg-[#E5E0D8]/50 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim */}
        <div className="mt-6">
          <label className="font-mono text-xs text-[#4B5563] uppercase tracking-wider">CLAIM</label>
          <p className="font-serif text-lg font-bold text-[#111827] mt-1 leading-snug">{evidence.claim}</p>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20">
            <CheckCircle className="w-3.5 h-3.5" />
            {evidence.verificationStatus}
          </span>
          {evidence.verifiedAt && (
            <span className="font-mono text-xs text-[#4B5563]">Verified on {evidence.verifiedAt}</span>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 bg-[#FFFFFF] p-4 rounded border border-[#E5E0D8]">
          <label className="font-mono text-xs text-[#4B5563] uppercase tracking-wider">EVIDENCE SUMMARY</label>
          <p className="text-sm text-[#111827] mt-1 leading-relaxed">{evidence.evidenceSummary}</p>
        </div>

        {/* Source Details */}
        {evidence.source && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-xs text-[#4B5563] uppercase tracking-wider">SOURCE</label>
              <p className="font-medium text-[#111827] text-sm mt-0.5">{evidence.source.name}</p>
              <p className="text-xs text-[#4B5563]">{evidence.source.publisher}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#F3EFE6] p-3 rounded text-xs font-mono border border-[#E5E0D8]">
              <div>
                <span className="text-[#4B5563] block">PUBLISHED</span>
                <span className="font-semibold text-[#111827]">{evidence.source.publicationDate}</span>
              </div>
              <div>
                <span className="text-[#4B5563] block">PAGE REF</span>
                <span className="font-semibold text-[#111827]">Page {evidence.pageNumber || evidence.source.pageNumber || "N/A"}</span>
              </div>
            </div>

            {evidence.source.url && (
              <a
                href={evidence.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#111827] text-[#FBF9F5] text-xs font-mono font-medium rounded hover:bg-[#991B1B] transition-colors"
              >
                <FileText className="w-4 h-4" />
                OPEN ORIGINAL SOURCE DOCUMENT
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Methodology */}
        {evidence.methodology && (
          <div className="mt-6 border-t border-[#E5E0D8] pt-4">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#4B5563] uppercase tracking-wider mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              VERIFICATION METHODOLOGY
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed italic">{evidence.methodology}</p>
          </div>
        )}

        <div className="mt-auto pt-6 text-center border-t border-[#E5E0D8]">
          <p className="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest">
            CIVICLENS EVIDENCE INTEGRITY ENGINE • VERIFIABLE DATA
          </p>
        </div>
      </div>
    </div>
  );
};
