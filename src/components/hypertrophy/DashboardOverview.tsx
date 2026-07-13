"use client";

import React from "react";
import {
  Flame,
  Zap,
  Activity,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Info
} from "lucide-react";

interface DashboardOverviewProps {
  onTabChange: (tab: string) => void;
}

export default function DashboardOverview({ onTabChange }: DashboardOverviewProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Premium Hero Banner Section */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#121A2E]/60 to-[#0A0D16]/90 border border-blue-500/10 shadow-2xl overflow-hidden flex flex-col justify-center min-h-[300px]">
        {/* Abstract Glowing Particles */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        <div className="relative space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 font-mono">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>VERSION 1.0 GENERATIVE ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-none tracking-tight text-white">
            Master Muscle Growth <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Through Science
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-medium max-w-md leading-relaxed">
            Learn anatomy, biomechanics, hypertrophy, and build smarter workouts with AI. Based on elite exercise science.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onTabChange("anatomy")}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-xl shadow-blue-500/10 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Activity className="h-4.5 w-4.5" />
              Explore Anatomy
            </button>
            <button
              onClick={() => onTabChange("planner")}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800/80 text-xs font-bold text-slate-200 border border-slate-800 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Calendar className="h-4.5 w-4.5 text-blue-500" />
              Build Workout
            </button>
            <button
              onClick={() => onTabChange("coach")}
              className="px-5 py-3 rounded-2xl bg-[#090D16]/80 hover:bg-[#121A2E]/80 text-xs font-bold text-blue-400 border border-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <BrainCircuit className="h-4.5 w-4.5" />
              AI Coach
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-3xl bg-[#0B0F19]/40 border border-slate-800/60 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/25 transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">LIFTING STREAK</span>
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Flame className="h-4.5 w-4.5 animate-bounce" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">12 Days</div>
          <div className="text-[10px] text-slate-400 mt-1">Consistency rating: 98%</div>
          <div className="w-full h-1 bg-slate-900 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-[85%] rounded-full" />
          </div>
        </div>

        {/* Recovery */}
        <div className="p-5 rounded-3xl bg-[#0B0F19]/40 border border-slate-800/60 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/25 transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">RECOVERY STATUS</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Zap className="h-4.5 w-4.5 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">82%</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Optimal: Ready for Heavy Legs</span>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-blue-500 w-[82%] rounded-full" />
          </div>
        </div>

        {/* Weekly Sets */}
        <div className="p-5 rounded-3xl bg-[#0B0F19]/40 border border-slate-800/60 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/25 transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">WEEKLY COMPLETED SETS</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">42 / 60 Sets</div>
          <div className="text-[10px] text-slate-400 mt-1">Recommended weekly cap: 72 sets</div>
          <div className="w-full h-1 bg-slate-900 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[70%] rounded-full" />
          </div>
        </div>

        {/* Body Weight */}
        <div className="p-5 rounded-3xl bg-[#0B0F19]/40 border border-slate-800/60 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/25 transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">BODY WEIGHT</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">78.4 kg</div>
          <div className="text-[10px] text-slate-400 mt-1">Goal: Lean Bulk (Target: 81 kg)</div>
          <div className="w-full h-1 bg-slate-900 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500 w-[45%] rounded-full" />
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Volume Warning */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0B0F19]/40 border border-slate-800/60 backdrop-blur-md flex flex-col gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
            Hypertrophy Engine Diagnostics
          </h2>
          
          <div className="space-y-3.5">
            {/* diagnostic 1 */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/10 flex gap-3 items-start">
              <Info className="h-4.5 w-4.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-blue-400">Volume Target Matched</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your current split is giving Chest 14 weekly sets, which resides perfectly within the 10-20 hypertrophic sweet-spot. Progressive overload active.
                </p>
              </div>
            </div>

            {/* diagnostic 2 */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/10 flex gap-3 items-start">
              <Info className="h-4.5 w-4.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-400">Junk Volume Alert (Warning)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Triceps volume is approaching 24 sets this week (including compound presses). Sets above 22 generally result in &quot;junk volume&quot; which causes fatigue without stimulating further protein synthesis. Consider swapping close-grip presses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hypertrophy Tip Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121A2E]/50 to-[#0A0D16]/50 border border-slate-800/60 backdrop-blur-md flex flex-col gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Sci-Fit Tip of the Day
          </h2>
          
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="text-xs font-bold text-slate-300">Lengthened Hypertrophy</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Recent studies suggest that training muscles at long muscle lengths (when the muscle is fully stretched, e.g. at the bottom of a squat or Romanian deadlift) produces substantially more muscle growth than partial reps in the contracted range. Control your eccentrics!
            </p>
          </div>

          <button
            onClick={() => onTabChange("academy")}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-850 flex items-center justify-center gap-1 group"
          >
            Go to Sci-Fit Academy
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
