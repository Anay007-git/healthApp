"use client";

import React, { useState } from "react";
import AnatomyCanvas from "./AnatomyCanvas";
import { muscles } from "@/lib/hypertrophyData";
import {
  Compass,
  Activity,
  Zap,
  RotateCcw,
  Sparkles
} from "lucide-react";

export default function AnatomyViewer() {
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>("chest");
  const [viewAngle, setViewAngle] = useState<"front" | "back" | "side" | "reset">("front");

  const selectedMuscle = muscles.find((m) => m.id === selectedMuscleId) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 3D Visualizer Column */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Controls HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-[#090D16]/40 border border-slate-800/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-blue-400" />
            <span className="text-xs font-bold text-slate-300">CAMERA ROTATION HUD</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewAngle("front")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewAngle === "front"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Anterior (Front)
            </button>
            <button
              onClick={() => setViewAngle("back")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewAngle === "back"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Posterior (Back)
            </button>
            <button
              onClick={() => setViewAngle("side")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewAngle === "side"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Lateral (Side)
            </button>
            <button
              onClick={() => setViewAngle("reset")}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center"
              title="Reset view"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas */}
        <div className="h-[550px] w-full relative">
          <AnatomyCanvas
            selectedMuscleId={selectedMuscleId}
            onSelectMuscle={(id) => setSelectedMuscleId(id)}
            viewAngle={viewAngle}
          />
        </div>
      </div>

      {/* Muscle Details Side Panel */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Muscle Selector Dropdown */}
        <div className="p-4 rounded-3xl bg-[#090D16]/40 border border-slate-800/60 backdrop-blur-md">
          <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-2">
            SELECT TARGET REGION DIRECTLY
          </label>
          <select
            value={selectedMuscleId || ""}
            onChange={(e) => setSelectedMuscleId(e.target.value || null)}
            className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="" disabled>-- Choose a muscle --</option>
            {muscles
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.group})
                </option>
              ))}
          </select>
        </div>

        {/* Scientific Details Panel */}
        {selectedMuscle ? (
          <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md flex flex-col gap-6 flex-1 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient subtle backglow */}
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-[50px] pointer-events-none" />

            {/* Title / Header */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                {selectedMuscle.group} MUSCULATURE
              </span>
              <h2 className="text-2xl font-black text-white">{selectedMuscle.name}</h2>
              <div className="text-[11px] font-mono text-slate-500 italic">{selectedMuscle.scientificName}</div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {selectedMuscle.description}
            </p>

            {/* Anatomical Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">ORIGIN</span>
                <span className="text-xs font-semibold text-slate-300 leading-tight block">{selectedMuscle.origin}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">INSERTION</span>
                <span className="text-xs font-semibold text-slate-300 leading-tight block">{selectedMuscle.insertion}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/50 col-span-2">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">PRIMARY ACTIONS</span>
                <span className="text-xs font-semibold text-slate-300 leading-tight block">{selectedMuscle.action}</span>
              </div>
            </div>

            {/* Training Stats Block */}
            <div className="grid grid-cols-3 gap-2.5 border-t border-b border-slate-800/60 py-4 font-mono">
              <div className="text-center">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold mb-1">DIFFICULTY</span>
                <div className={`text-xs font-black inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md ${
                  selectedMuscle.growDifficulty === "Easy" ? "text-emerald-400 bg-emerald-500/10" :
                  selectedMuscle.growDifficulty === "Medium" ? "text-amber-400 bg-amber-500/10" : "text-rose-400 bg-rose-500/10"
                }`}>
                  <Zap className="h-3 w-3" />
                  {selectedMuscle.growDifficulty}
                </div>
              </div>
              <div className="text-center border-l border-r border-slate-800/60">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold mb-1">RECOVERY</span>
                <span className="text-xs font-bold text-white block">{selectedMuscle.recoveryTime}</span>
              </div>
              <div className="text-center">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold mb-1">WEEKLY VOLUME</span>
                <span className="text-xs font-bold text-white block">{selectedMuscle.weeklySets}</span>
              </div>
            </div>

            {/* Scientific notes */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/15 relative">
              <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                BIOMECHANICS INTEL
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                {selectedMuscle.scientificNotes}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md flex flex-col items-center justify-center text-center flex-1 py-12">
            <Activity className="h-10 w-10 text-slate-600 mb-3 animate-pulse" />
            <div className="text-xs font-bold text-slate-400">No Muscle Selected</div>
            <p className="text-[10px] text-slate-500 max-w-[200px] mt-1 leading-snug">
              Click a muscle group on the 3D grid or select one using the dropdown above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
