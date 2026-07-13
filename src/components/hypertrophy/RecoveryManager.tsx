"use client";

import React, { useState } from "react";
import {
  Flame,
  Activity,
  AlertTriangle,
  Sliders
} from "lucide-react";

export default function RecoveryManager() {
  // recovery factors sliders
  const [sleep, setSleep] = useState(7.5);
  const [proteinMet, setProteinMet] = useState(true);
  const [soreness, setSoreness] = useState(2); // 1 = none, 5 = extremely sore

  // Volume sets dataset
  const [muscleVolume] = useState([
    { name: "Chest", sets: 14 },
    { name: "Back", sets: 16 },
    { name: "Shoulders", sets: 12 },
    { name: "Arms", sets: 18 },
    { name: "Legs", sets: 10 },
    { name: "Core", sets: 6 }
  ]);

  // Calculate recovery scores based on sliders
  const calculateRecoveryScore = () => {
    let score = 50;
    // Sleep: +5 per 0.5 hours above 6, cap at 9.5
    score += Math.max(0, (sleep - 6) * 10);
    // Protein: +15
    if (proteinMet) score += 15;
    // Soreness: -10 per scale level above 1
    score -= (soreness - 1) * 12;

    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const recoveryScore = calculateRecoveryScore();

  // Recovery status helper
  const getRecoveryState = (muscleName: string) => {
    // Basic dynamic mapping
    if (recoveryScore > 75) {
      if (muscleName === "Arms" && soreness > 3) return { label: "Recovering", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      return { label: "Fully Recovered", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    }
    if (recoveryScore > 50) {
      if (muscleName === "Legs" || muscleName === "Back") {
        return { label: "Recovering", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      }
      return { label: "Fully Recovered", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    }
    return { label: "Fatigued / Overloaded", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Recovery Recalculator Panel */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            RECOVERY RECALCULATOR
          </span>
          <h3 className="text-lg font-black text-white">Biological Inputs</h3>
        </div>

        {/* Sliders */}
        <div className="space-y-5 text-xs font-semibold text-slate-300">
          {/* Sleep */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono">
              <span>Sleep Duration</span>
              <span className="text-blue-400">{sleep} hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
            />
          </div>

          {/* Soreness */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono">
              <span>Muscle Soreness</span>
              <span className="text-blue-400">Level {soreness}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={soreness}
              onChange={(e) => setSoreness(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
            />
            <div className="flex justify-between text-[8px] font-mono text-slate-500">
              <span>NO SORENESS</span>
              <span>EXCRUCIATING</span>
            </div>
          </div>

          {/* Protein */}
          <div className="flex justify-between items-center bg-[#0B0F19]/80 border border-slate-850 p-4 rounded-2xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Protein Target Met?</span>
              <span className="text-[9px] text-slate-500 font-mono block">1.6 - 2.2g per kg bodyweight</span>
            </div>
            <button
              onClick={() => setProteinMet(!proteinMet)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase font-mono tracking-widest transition-all ${
                proteinMet
                  ? "bg-blue-600 border border-blue-500 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              {proteinMet ? "YES" : "NO"}
            </button>
          </div>
        </div>

        {/* Global calculated score circular gauge */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-col items-center gap-3">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">RECOVERY COEFFICIENT</span>
          
          <div className="relative flex items-center justify-center h-28 w-28">
            {/* Simple CSS radial border */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
            <div
              className={`absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-l-blue-500 border-b-transparent animate-spin`}
              style={{ animationDuration: "12s" }}
            />
            
            <div className="text-center space-y-0.5 z-10">
              <span className="text-3xl font-black text-white">{recoveryScore}%</span>
              <span className="block text-[8px] font-mono text-blue-400 font-bold uppercase">SCORE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Heatmap Column */}
      <div className="lg:col-span-8 space-y-6">
        {/* Heatmap Card */}
        <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Flame className="h-4.5 w-4.5" />
              MUSCLE RECOVERY HEATMAP
            </span>
            <h3 className="text-lg font-black text-white">Systemic Recovery Diagnostics</h3>
          </div>

          {/* Muscle Heatmap grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"].map((m) => {
              const state = getRecoveryState(m);
              return (
                <div
                  key={m}
                  className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-800/60 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{m}</span>
                  <span className={`px-2.5 py-1 rounded-xl text-[9px] font-mono font-black uppercase tracking-wider ${state.color}`}>
                    {state.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Volume Analyzer Card */}
        <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5" />
              WEEKLY SET VOLUME ANALYZER
            </span>
            <h3 className="text-lg font-black text-white">Mechanical Volume Thresholds</h3>
          </div>

          {/* Progress indicators for sets */}
          <div className="space-y-4">
            {muscleVolume.map((mv) => {
              const isJunk = mv.sets > 16;
              const percent = Math.min(100, (mv.sets / 20) * 100);

              return (
                <div key={mv.name} className="space-y-1.5 font-mono">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white uppercase">{mv.name}</span>
                    <div className="flex gap-2 items-center text-[10px]">
                      <span className="text-slate-400">{mv.sets} / 20 working sets</span>
                      {isJunk && (
                        <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-[8px] font-black">
                          JUNK VOL WARNING
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isJunk ? "bg-rose-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Science explainer alert */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/15 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block text-[9px] font-mono text-amber-400 uppercase tracking-widest font-black">
                JUNK VOLUME THRESHOLDS
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Research demonstrates that sets exceeding 20-22 per muscle group per week yield diminished hypertrophic adaptions while dramatically scaling central nervous fatigue. If your volume triggers a warning, decrease sets and raise load/RPE intensity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
