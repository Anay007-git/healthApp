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
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>("upper_chest");
  const [viewAngle, setViewAngle] = useState<"front" | "back" | "side" | "reset">("front");

  const selectedMuscle = muscles.find((m) => m.id === selectedMuscleId) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 3D Visualizer Column */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Controls HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-blue-650" />
            <span className="text-xs font-bold text-slate-700">CAMERA ROTATION HUD</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewAngle("front")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewAngle === "front"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200"
              }`}
            >
              Anterior (Front)
            </button>
            <button
              onClick={() => setViewAngle("back")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewAngle === "back"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200"
              }`}
            >
              Posterior (Back)
            </button>
            <button
              onClick={() => setViewAngle("side")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewAngle === "side"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200"
              }`}
            >
              Lateral (Side)
            </button>
            <button
              onClick={() => setViewAngle("reset")}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center"
              title="Reset view"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* WebGL Canvas */}
        <div className="h-[480px] w-full relative">
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
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-2">
            SELECT TARGET REGION DIRECTLY
          </label>
          <select
            value={selectedMuscleId || ""}
            onChange={(e) => setSelectedMuscleId(e.target.value || null)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors"
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
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6 flex-1 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Title / Header */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-bold">
                {selectedMuscle.group} MUSCULATURE
              </span>
              <h2 className="text-2xl font-black text-slate-900">{selectedMuscle.name}</h2>
              <div className="text-[11px] font-mono text-slate-400 italic">{selectedMuscle.scientificName}</div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {selectedMuscle.description}
            </p>

            {/* Anatomical Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">ORIGIN</span>
                <span className="text-xs font-semibold text-slate-700 leading-tight block">{selectedMuscle.origin}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">INSERTION</span>
                <span className="text-xs font-semibold text-slate-700 leading-tight block">{selectedMuscle.insertion}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">PRIMARY ACTIONS</span>
                <span className="text-xs font-semibold text-slate-700 leading-tight block">{selectedMuscle.action}</span>
              </div>
            </div>

            {/* Training Stats Block */}
            <div className="grid grid-cols-3 gap-2.5 border-t border-b border-slate-100 py-4 font-mono">
              <div className="text-center">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-1">DIFFICULTY</span>
                <div className={`text-xs font-black inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md ${
                  selectedMuscle.growDifficulty === "Easy" ? "text-emerald-600 bg-emerald-50" :
                  selectedMuscle.growDifficulty === "Medium" ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50"
                }`}>
                  <Zap className="h-3 w-3" />
                  {selectedMuscle.growDifficulty}
                </div>
              </div>
              <div className="text-center border-l border-r border-slate-100">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-1">RECOVERY</span>
                <span className="text-xs font-bold text-slate-800 block">{selectedMuscle.recoveryTime}</span>
              </div>
              <div className="text-center">
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-1">WEEKLY VOLUME</span>
                <span className="text-xs font-bold text-slate-800 block">{selectedMuscle.weeklySets}</span>
              </div>
            </div>

            {/* Scientific notes */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 relative">
              <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                BIOMECHANICS INTEL
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                {selectedMuscle.scientificNotes}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center flex-1 py-12">
            <Activity className="h-10 w-10 text-slate-300 mb-3 animate-pulse" />
            <div className="text-xs font-bold text-slate-700">No Muscle Selected</div>
            <p className="text-[10px] text-slate-400 max-w-[200px] mt-1 leading-snug">
              Click a muscle group on the human vector map or select one using the dropdown above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
