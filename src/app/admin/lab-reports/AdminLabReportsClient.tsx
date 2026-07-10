'use client';

import React, { useState } from 'react';
import { Supplement } from '@/lib/mockData';
import { LabReport } from '@/lib/db';
import { Shield, ExternalLink, Check, AlertTriangle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AdminLabReportsClientProps {
  supplements: Supplement[];
  initialMappings: any[];
  initialReports: LabReport[];
  adminToken: string;
}

export default function AdminLabReportsClient({
  supplements,
  initialMappings,
  initialReports,
  adminToken
}: AdminLabReportsClientProps) {
  const [mappings, setMappings] = useState<any[]>(initialMappings);
  const [reports, setReports] = useState<LabReport[]>(initialReports);

  // Match Form State
  const [selectedSuppId, setSelectedSuppId] = useState('');
  const [labdoorUrl, setLabdoorUrl] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Publish Form State
  const [pubSuppId, setPubSuppId] = useState('');
  const [purityScore, setPurityScore] = useState('95');
  const [labelAccuracy, setLabelAccuracy] = useState('Passed');
  const [heavyMetals, setHeavyMetals] = useState('Clear (Lead & Mercury undetected)');
  const [verifiedBy, setVerifiedBy] = useState('System Admin');
  const [certificateId, setCertificateId] = useState('');
  const [loadingPub, setLoadingPub] = useState(false);
  const [pubSuccess, setPubSuccess] = useState('');
  const [pubError, setPubError] = useState('');

  // Supplement search term
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSupplements = supplements.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Save Mapping (POST)
  const handleSaveMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuppId || !labdoorUrl) return;

    setLoadingSave(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const res = await fetch('/api/admin/lab-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ supplementId: selectedSuppId, labdoorUrl })
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(data.message || 'Mapping saved as DRAFT successfully.');
        setLabdoorUrl('');
        
        // Refresh local items
        const updatedMaps = [
          ...mappings.filter((m) => m.supplement_id !== selectedSuppId),
          { supplement_id: selectedSuppId, labdoor_url: labdoorUrl, match_status: 'active' }
        ];
        const updatedReps = [
          ...reports.filter((r) => r.supplement_id !== selectedSuppId),
          data.report || {
            supplement_id: selectedSuppId,
            source_type: 'third_party_verified' as const,
            issuing_lab: 'Labdoor (USA)',
            source_url: labdoorUrl,
            status: 'draft' as const
          }
        ];
        setMappings(updatedMaps);
        setReports(updatedReps);
      } else {
        setSaveError(data.error || 'Failed to save mapping.');
      }
    } catch (err) {
      setSaveError('Network error occurred.');
    } finally {
      setLoadingSave(false);
    }
  };

  // Publish Report (PUT)
  const handlePublishReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubSuppId) return;

    setLoadingPub(true);
    setPubSuccess('');
    setPubError('');

    try {
      const res = await fetch('/api/admin/lab-reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          supplementId: pubSuppId,
          purityScore: Number(purityScore),
          labelAccuracyStatus: labelAccuracy,
          heavyMetalsStatus: heavyMetals,
          verifiedBy,
          certificateId
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPubSuccess(data.message || 'Lab report published successfully.');
        
        // Refresh local items
        setReports(prev =>
          prev.map((r) =>
            r.supplement_id === pubSuppId
              ? {
                  ...r,
                  status: 'published' as const,
                  purity_score: Number(purityScore),
                  label_accuracy_status: labelAccuracy,
                  heavy_metals_status: heavyMetals,
                  verified_by: verifiedBy,
                  certificate_id: certificateId || `CERT-${pubSuppId.substring(0, 8).toUpperCase()}`
                }
              : r
          )
        );
        
        // Reset states
        setPubSuppId('');
        setPurityScore('95');
        setCertificateId('');
      } else {
        setPubError(data.error || 'Failed to publish report.');
      }
    } catch (err) {
      setPubError('Network error occurred.');
    } finally {
      setLoadingPub(false);
    }
  };

  const getMappingForSupplement = (id: string) => {
    return mappings.find((m) => m.supplement_id === id);
  };

  const getReportForSupplement = (id: string) => {
    return reports.find((r) => r.supplement_id === id);
  };

  return (
    <div className="min-h-screen bg-background-app text-text-app p-4 sm:p-8 flex flex-col justify-start items-center">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-app/40 pb-5">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-text-app flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-primary" />
              Supplement Lab Verification matches
            </h1>
            <p className="text-[10px] font-bold text-text-muted mt-1">
              Associate marketplace items with certified analysis portals.
            </p>
          </div>
          <Link
            href="/gyms-supplements"
            className="px-4 py-2 rounded-xl border border-border-app bg-card-app/40 hover:bg-border-app/10 text-xs font-black text-text-app transition-all shrink-0 cursor-pointer self-start sm:self-auto"
          >
            ← Back to App
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Step 1: Mapping Association Form */}
          <div className="rounded-2xl border border-border-app bg-card-app p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/10 text-[10px] font-black text-brand-primary">
                1
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-text-app">
                Associate Labdoor Report
              </h2>
            </div>
            
            <form onSubmit={handleSaveMapping} className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                  Supplement Search
                </label>
                <input
                  type="text"
                  placeholder="Filter supplements list..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border-app/60 bg-card-app/20 text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary mb-2"
                />

                <select
                  value={selectedSuppId}
                  onChange={(e) => setSelectedSuppId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                >
                  <option value="">-- Choose Supplement --</option>
                  {filteredSupplements.map((s) => {
                    const mapped = getMappingForSupplement(s.id);
                    const rep = getReportForSupplement(s.id);
                    let suffix = ' [Unlinked]';
                    if (mapped) {
                      suffix = ` [${rep?.status.toUpperCase() || 'UNLINKED'}]`;
                    }
                    return (
                      <option key={s.id} value={s.id}>
                        {s.brand} - {s.name}{suffix}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                  Labdoor Report URL
                </label>
                <input
                  type="url"
                  placeholder="https://labdoor.com/review/..."
                  value={labdoorUrl}
                  onChange={(e) => setLabdoorUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-text-muted/40"
                  required
                />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-bold rounded-xl flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}
              {saveError && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loadingSave || !selectedSuppId || !labdoorUrl}
                className="w-full py-2.5 rounded-xl bg-brand-primary text-brand-primary-fg hover:opacity-90 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-[0.98] disabled:opacity-50"
              >
                {loadingSave ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Draft...
                  </>
                ) : (
                  <>
                    Save Mapping (Draft)
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Step 2: Publish Report Form */}
          <div className="rounded-2xl border border-border-app bg-card-app p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-600">
                2
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-text-app">
                Publish Lab Report (Verify Drafts)
              </h2>
            </div>

            <form onSubmit={handlePublishReport} className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                  Draft Report to Publish
                </label>
                <select
                  value={pubSuppId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setPubSuppId(id);
                    const matchedRep = reports.find(r => r.supplement_id === id);
                    if (matchedRep) {
                      setPurityScore(String(matchedRep.purity_score || '95'));
                      setLabelAccuracy(matchedRep.label_accuracy_status || 'Passed');
                      setHeavyMetals(matchedRep.heavy_metals_status || 'Clear (Lead & Mercury undetected)');
                      setCertificateId(matchedRep.certificate_id || '');
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                >
                  <option value="">-- Select Draft --</option>
                  {reports
                    .filter((r) => r.status === 'draft')
                    .map((r) => {
                      const supp = supplements.find((s) => s.id === r.supplement_id);
                      return (
                        <option key={r.supplement_id} value={r.supplement_id}>
                          {supp ? `${supp.brand} - ${supp.name}` : r.supplement_id}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                    Purity Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={purityScore}
                    onChange={(e) => setPurityScore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                    Label Accuracy Status
                  </label>
                  <input
                    type="text"
                    value={labelAccuracy}
                    onChange={(e) => setLabelAccuracy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                    Heavy Metals Screening
                  </label>
                  <input
                    type="text"
                    value={heavyMetals}
                    onChange={(e) => setHeavyMetals(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">
                    Verified By (Auditor Signature)
                  </label>
                  <input
                    type="text"
                    value={verifiedBy}
                    onChange={(e) => setVerifiedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-app bg-card-app text-xs text-text-app font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    required
                  />
                </div>
              </div>

              {pubSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-bold rounded-xl flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{pubSuccess}</span>
                </div>
              )}
              {pubError && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{pubError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loadingPub || !pubSuppId}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white hover:opacity-90 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-[0.98] disabled:opacity-50"
              >
                {loadingPub ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Approve & Publish Certificate
                    <Sparkles className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Mappings & Reports Registry List */}
        <div className="rounded-2xl border border-border-app bg-card-app p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-app">
            Verified Registry Status ({reports.length} matched items)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-text-app border-collapse">
              <thead>
                <tr className="border-b border-border-app/40 text-[9px] font-black text-text-muted uppercase tracking-wider">
                  <th className="py-2.5">Supplement</th>
                  <th className="py-2.5">Labdoor URL</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Score</th>
                  <th className="py-2.5">Certificate ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-app/20">
                {reports.map((rep) => {
                  const supp = supplements.find((s) => s.id === rep.supplement_id);
                  const mapped = getMappingForSupplement(rep.supplement_id);
                  
                  return (
                    <tr key={rep.supplement_id} className="hover:bg-border-app/5">
                      <td className="py-3 font-bold">
                        {supp ? (
                          <>
                            {supp.brand} <span className="text-text-muted font-normal">- {supp.name}</span>
                          </>
                        ) : (
                          rep.supplement_id
                        )}
                      </td>
                      <td className="py-3">
                        {mapped ? (
                          <a
                            href={mapped.labdoor_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary hover:underline inline-flex items-center gap-1"
                          >
                            Labdoor Page
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-text-muted">Not specified</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                            rep.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/15'
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/15'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-center sm:text-left">
                        {rep.purity_score !== null && rep.purity_score !== undefined ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-black">
                            {rep.purity_score}%
                          </span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3 font-mono font-bold text-text-muted">
                        {rep.certificate_id || '—'}
                      </td>
                    </tr>
                  );
                })}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-muted font-bold">
                      No active mappings or certificates registered. Get started by entering details above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
