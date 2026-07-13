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
      if (muscleName === "Arms" && soreness > 3) return { label: "Recovering", color: "text-amber-700 bg-amber-50 border-amber-100" };
      return { label: "Fully Recovered", color: "text-emerald-700 bg-emerald-50 border-emerald-100" };
    }
    if (recoveryScore > 50) {
      if (muscleName === "Legs" || muscleName === "Back") {
        return { label: "Recovering", color: "text-amber-700 bg-amber-50 border-amber-100" };
      }
      return { label: "Fully Recovered", color: "text-emerald-700 bg-emerald-50 border-emerald-100" };
    }
    return { label: "Fatigued / Overloaded", color: "text-rose-700 bg-rose-50 border-rose-100" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Recovery Recalculator Panel */}
      <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            RECOVERY CALIBRATOR
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">Coefficient Simulator</h3>
        </div>

        {/* Big circle progress dial */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl relative">
          <div className="relative h-28 w-28 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="absolute inset-0 h-full w-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-slate-200"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-blue-600 transition-all duration-500"
                strokeWidth="7"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 48}`}
                strokeDashoffset={`${2 * Math.PI * 48 * (1 - recoveryScore / 100)}`}
              />
            </svg>
            <div className="text-center space-y-0.5">
              <span className="text-2xl font-black text-slate-800">{recoveryScore}%</span>
              <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none">Readiness</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs font-bold text-slate-700">
              {recoveryScore > 75
                ? "Anabolic Window Open: Heavy Compounds Approved"
                : recoveryScore > 50
                ? "Moderate Fatigue: Consider Accessory Hypertrophy Sets"
                : "System Shock: Deload / Rest Recommended"}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs font-semibold text-slate-600">
          {/* Sleep */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px]">
              <span>SLEEP QUANTITY</span>
              <span className="text-blue-600 font-bold">{sleep} hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Soreness */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px]">
              <span>TARGET MUSCLE SORENESS LEVEL</span>
              <span className="text-blue-600 font-bold">Lvl {soreness}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={soreness}
              onChange={(e) => setSoreness(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[8px] font-mono text-slate-400">
              <span>NONE</span>
              <span>EXTREME</span>
            </div>
          </div>

          {/* Protein */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold text-slate-800">Target Protein Synthesis Met?</span>
              <span className="block text-[8px] font-mono text-slate-400">(&gt;1.6g/kg daily weight target)</span>
            </div>
            <input
              type="checkbox"
              checked={proteinMet}
              onChange={(e) => setProteinMet(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Volume set analyzer */}
      <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Activity className="h-4.5 w-4.5 animate-pulse" />
            WEEKLY VOLUME HEADS-UP DISPLAY
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">Anatomy Group Set Recalibrator</h3>
        </div>

        {/* Set volumes lists */}
        <div className="space-y-4 font-mono text-xs">
          {muscleVolume.map((item) => {
            const limit = 20; // Generic safety limit for junk volume
            const isExceeded = item.sets > limit;
            const isOptimal = item.sets >= 10 && item.sets <= limit;
            const status = getRecoveryState(item.name);

            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-800 uppercase">{item.name} Volume</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{item.sets} / {limit} sets</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isExceeded
                        ? "bg-rose-500"
                        : isOptimal
                        ? "bg-blue-600"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, (item.sets / limit) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Junk volume warning alert box */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs leading-relaxed">
            <span className="block text-[9px] font-mono text-rose-500 uppercase tracking-widest font-black">JUNK VOLUME ALARM DETECTED</span>
            <p className="text-[11px] text-slate-700 font-medium">
              Weekly sets for <span className="font-bold text-rose-600">Arms</span> exceed 20 sets. Research proves set allocations beyond 20 sets per week yield diminishing hypertrophic returns and introduce excessive systemic fatigue. Lower volume to maximize mechanical tension quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
