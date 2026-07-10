import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, ExternalLink } from 'lucide-react';

export interface LabReport {
  id?: string;
  supplement_id: string;
  source_type: 'sample_demo' | 'brand_published' | 'third_party_verified';
  issuing_lab?: string | null;
  certificate_id?: string | null;
  source_url?: string | null;
  purity_score?: number | null;
  label_accuracy_status?: string | null;
  heavy_metals_status?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  status: 'draft' | 'published' | 'expired' | 'flagged';
}

interface LabReportBadgeProps {
  report?: LabReport | null;
}

export const LabReportBadge: React.FC<LabReportBadgeProps> = ({ report }) => {
  // If no report exists, default to sample_demo state
  const activeReport: LabReport = report || {
    supplement_id: '',
    source_type: 'sample_demo',
    status: 'draft'
  };

  const {
    source_type,
    issuing_lab,
    source_url,
    purity_score,
    verified_by,
    label_accuracy_status,
    heavy_metals_status
  } = activeReport;

  if (source_type === 'brand_published') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 shadow-sm transition-all duration-200 hover:border-blue-500/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Brand-Published COA
              </h5>
              <p className="text-[10px] font-bold text-text-app mt-0.5">
                Manufacturer Self-Declared Analysis
              </p>
              <p className="text-[9px] text-text-muted mt-1 leading-relaxed max-w-[280px]">
                This analysis certificate is published directly by the manufacturer. It has not been independently audited by our platforms.
              </p>
            </div>
          </div>

          {source_url && (
            <a
              href={source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95"
            >
              COA Document
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  if (source_type === 'third_party_verified') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/40">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Third-Party Verified Grade
                </h5>
                {issuing_lab && (
                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
                    {issuing_lab}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-text-app mt-1">
                Audited Purity Profile
              </p>
              
              <div className="flex gap-4 mt-3 flex-wrap">
                {label_accuracy_status && (
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">Label Accuracy</span>
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">{label_accuracy_status}</span>
                  </div>
                )}
                {heavy_metals_status && (
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">Heavy Metals Check</span>
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">{heavy_metals_status}</span>
                  </div>
                )}
              </div>

              {verified_by && (
                <p className="text-[8px] text-text-muted font-medium mt-3">
                  Approved validation: <span className="font-extrabold text-text-app">Verified by {verified_by}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2.5 self-stretch sm:self-auto shrink-0 justify-between sm:justify-start">
            {purity_score !== null && purity_score !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-text-muted">Purity Index</span>
                <div className="flex items-center justify-center font-black text-xs text-brand-primary-fg bg-emerald-500 h-7 w-12 rounded-lg shadow-sm">
                  {purity_score}%
                </div>
              </div>
            )}

            {source_url && (
              <a
                href={source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:opacity-90 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                View full report
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default/Pending:
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 shadow-sm transition-all duration-200 hover:border-amber-500/40">
      <div className="flex items-start gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
          <Shield className="h-4.5 w-4.5 animate-pulse" />
        </div>
        <div>
          <h5 className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Lab Verification Pending
          </h5>
          <p className="text-[10px] font-bold text-text-app mt-0.5">
            Lab report will be published soon
          </p>
          <p className="text-[9px] text-text-muted mt-1 leading-relaxed max-w-[320px]">
            Labdoor testing and certificate auditing are currently underway. Verified purity index, label accuracy, and heavy metals screening results will be updated soon.
          </p>
        </div>
      </div>
    </div>
  );
};
