"use client";

import React, { useState } from "react";
import { exercises, Exercise, muscles } from "@/lib/hypertrophyData";
import {
  Search,
  Dumbbell,
  Play,
  RotateCcw,
  AlertTriangle,
  Info,
  Clock,
  Sparkles
} from "lucide-react";

export default function ExerciseDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("All");
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>("All");
  const [activeExerciseId, setActiveExerciseId] = useState<string>("back_squat");

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquip = selectedEquipment === "All" || ex.equipment === selectedEquipment;
    const matchesMuscle =
      selectedMuscleFilter === "All" ||
      ex.primaryMuscle === selectedMuscleFilter ||
      ex.secondaryMuscles.includes(selectedMuscleFilter);
    return matchesSearch && matchesEquip && matchesMuscle;
  });

  const activeExercise = exercises.find((ex) => ex.id === activeExerciseId) || exercises[0];

  // Helper to render static SVG muscle highlights based on selected exercise
  const renderAnatomicalHighlights = (ex: Exercise) => {
    const isPrimary = (mId: string) => ex.primaryMuscle === mId;
    const isSecondary = (mId: string) => ex.secondaryMuscles.includes(mId);

    // Get color based on muscle role
    const getFill = (mId: string) => {
      if (isPrimary(mId)) return "fill-blue-500/80 stroke-blue-400";
      if (isSecondary(mId)) return "fill-blue-800/40 stroke-blue-600/60";
      return "fill-slate-900/60 stroke-slate-800/40";
    };

    return (
      <div className="flex justify-center gap-6 p-4 rounded-3xl bg-[#090D16]/50 border border-slate-800/60 backdrop-blur-md">
        {/* Anterior View (Front) */}
        <div className="flex flex-col items-center gap-1.5 font-mono">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">ANTERIOR</span>
          <svg className="w-32 h-64" viewBox="0 0 100 200">
            {/* Outline Head */}
            <circle cx="50" cy="20" r="10" className="fill-slate-950 stroke-slate-800/40" />
            <rect x="47" y="30" width="6" height="8" className="fill-slate-950 stroke-slate-800/40" />

            {/* Deltoids (Shoulders) */}
            <circle cx="34" cy="45" r="7" className={getFill("front_delts")} />
            <circle cx="66" cy="45" r="7" className={getFill("front_delts")} />

            {/* Chest */}
            <path d="M 37,42 L 50,45 L 50,58 L 36,55 Z" className={getFill("chest")} />
            <path d="M 63,42 L 50,45 L 50,58 L 64,55 Z" className={getFill("chest")} />

            {/* Biceps */}
            <rect x="26" y="52" width="7" height="15" rx="3" className={getFill("biceps")} />
            <rect x="67" y="52" width="7" height="15" rx="3" className={getFill("biceps")} />

            {/* Forearms */}
            <rect x="23" y="68" width="6" height="18" rx="2" className={getFill("forearms")} />
            <rect x="71" y="68" width="6" height="18" rx="2" className={getFill("forearms")} />

            {/* Abs */}
            <rect x="42" y="60" width="16" height="24" rx="2" className={getFill("abs")} />

            {/* Obliques */}
            <path d="M 36,60 L 42,60 L 42,84 L 38,84 Z" className={getFill("obliques")} />
            <path d="M 64,60 L 58,60 L 58,84 L 62,84 Z" className={getFill("obliques")} />

            {/* Quads */}
            <rect x="34" y="94" width="13" height="38" rx="4" className={getFill("quads")} />
            <rect x="53" y="94" width="13" height="38" rx="4" className={getFill("quads")} />

            {/* Calves (anterior) */}
            <rect x="36" y="138" width="9" height="28" rx="2" className={getFill("calves")} />
            <rect x="55" y="138" width="9" height="28" rx="2" className={getFill("calves")} />
          </svg>
        </div>

        {/* Posterior View (Back) */}
        <div className="flex flex-col items-center gap-1.5 font-mono">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">POSTERIOR</span>
          <svg className="w-32 h-64" viewBox="0 0 100 200">
            {/* Outline Head */}
            <circle cx="50" cy="20" r="10" className="fill-slate-950 stroke-slate-800/40" />
            <rect x="47" y="30" width="6" height="8" className="fill-slate-950 stroke-slate-800/40" />

            {/* Traps */}
            <path d="M 50,38 L 40,46 L 50,55 L 60,46 Z" className={getFill("traps")} />

            {/* Rear delts */}
            <circle cx="34" cy="45" r="7" className={getFill("rear_delts")} />
            <circle cx="66" cy="45" r="7" className={getFill("rear_delts")} />

            {/* Lats */}
            <path d="M 38,50 M 50,54 L 50,78 L 38,70 Z" className={getFill("lats")} />
            <path d="M 62,50 M 50,54 L 50,78 L 62,70 Z" className={getFill("lats")} />

            {/* Rhomboids */}
            <rect x="43" y="47" width="14" height="12" rx="1" className={getFill("rhomboids")} />

            {/* Triceps */}
            <rect x="25" y="52" width="7" height="15" rx="3" className={getFill("triceps")} />
            <rect x="68" y="52" width="7" height="15" rx="3" className={getFill("triceps")} />

            {/* Spinal Erectors */}
            <rect x="46" y="60" width="8" height="24" rx="1" className={getFill("spinal_erectors")} />

            {/* Glutes */}
            <circle cx="41" cy="94" r="11" className={getFill("glutes")} />
            <circle cx="59" cy="94" r="11" className={getFill("glutes")} />

            {/* Hamstrings */}
            <rect x="34" y="106" width="13" height="30" rx="3" className={getFill("hamstrings")} />
            <rect x="53" y="106" width="13" height="30" rx="3" className={getFill("hamstrings")} />

            {/* Calves */}
            <rect x="35" y="140" width="11" height="28" rx="2" className={getFill("calves")} />
            <rect x="54" y="140" width="11" height="28" rx="2" className={getFill("calves")} />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Exercise Search & List Column */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Search & Filters */}
        <div className="p-4 rounded-3xl bg-[#090D16]/40 border border-slate-800/60 backdrop-blur-md space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search exercise database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800/60 text-white rounded-2xl pl-9 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">EQUIPMENT</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-2.5 py-2 text-[10px] font-bold"
              >
                <option value="All">All Equipment</option>
                <option value="Barbell">Barbell</option>
                <option value="Dumbbell">Dumbbell</option>
                <option value="Cable">Cable</option>
                <option value="Machine">Machine</option>
                <option value="Bodyweight">Bodyweight</option>
              </select>
            </div>

            <div>
              <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">TARGET MUSCLE</label>
              <select
                value={selectedMuscleFilter}
                onChange={(e) => setSelectedMuscleFilter(e.target.value)}
                className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-2.5 py-2 text-[10px] font-bold"
              >
                <option value="All">All Muscles</option>
                {muscles.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name.split(" ")[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex-1 max-h-[460px] overflow-y-auto space-y-2 p-2 rounded-3xl bg-[#090D16]/20 border border-slate-800/40 overflow-x-hidden scrollbar-none">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 font-bold">No exercises match search criteria</div>
          ) : (
            filteredExercises.map((ex) => {
              const isActive = ex.id === activeExerciseId;
              const primaryM = muscles.find((m) => m.id === ex.primaryMuscle);
              return (
                <button
                  key={ex.id}
                  onClick={() => setActiveExerciseId(ex.id)}
                  className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between border transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-[#090D16]/50 border-slate-800/60 text-slate-300 hover:bg-slate-800/20 hover:border-slate-800"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold block">{ex.name}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                      {ex.equipment} • {primaryM ? primaryM.name.split(" ")[0] : ""}
                    </span>
                  </div>
                  <Dumbbell className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-12 ${isActive ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"}`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Exercise Details Column */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeExercise ? (
          <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1">
                  <Dumbbell className="h-3.5 w-3.5" />
                  {activeExercise.equipment} MOVEMENT
                </span>
                <h2 className="text-2xl font-black text-white">{activeExercise.name}</h2>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    Diff: {activeExercise.difficulty}
                  </span>
                  <span className="text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    Tempo: {activeExercise.tempo}
                  </span>
                </div>
              </div>

              {/* Video placeholder with real link */}
              <a
                href={activeExercise.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/30 text-[10px] font-mono text-blue-400 flex items-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <Play className="h-3.5 w-3.5 fill-blue-400" />
                PLAY TECHNIQUE VIDEO
              </a>
            </div>

            {/* Muscle Activation Mapping & Highlight Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Highlight SVGs */}
              {renderAnatomicalHighlights(activeExercise)}

              {/* Recruitment statistics */}
              <div className="flex flex-col gap-4 justify-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  MUSCLE RECRUITMENT LOAD
                </span>

                <div className="space-y-3.5 font-mono">
                  {/* Primary */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white uppercase">
                        {muscles.find((m) => m.id === activeExercise.primaryMuscle)?.name.split(" ")[0]} (Primary)
                      </span>
                      <span className="text-blue-400 font-black">{activeExercise.activationPrimary}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeExercise.activationPrimary}%` }} />
                    </div>
                  </div>

                  {/* Secondary muscles */}
                  {activeExercise.secondaryMuscles.map((mId) => (
                    <div key={mId} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-400 uppercase">
                          {muscles.find((m) => m.id === mId)?.name.split(" ")[0]} (Synergist)
                        </span>
                        <span className="text-slate-400 font-bold">{activeExercise.activationSecondary}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-700/60 rounded-full" style={{ width: `${activeExercise.activationSecondary}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROM & Rest statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/60 pt-4">
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex gap-3">
                <Info className="h-4.5 w-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">RANGE OF MOTION</span>
                  <span className="text-xs font-semibold text-slate-300 leading-tight block">{activeExercise.rom}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex gap-3">
                <Clock className="h-4.5 w-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">REST INTERVAL</span>
                  <span className="text-xs font-semibold text-slate-300 leading-tight block">{activeExercise.rest} (Target RPE {activeExercise.rpe})</span>
                </div>
              </div>
            </div>

            {/* Execution Steps */}
            <div className="space-y-3.5">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">EXECUTION STEPS</span>
              <ol className="space-y-2 text-xs text-slate-300 font-medium">
                {activeExercise.execution.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="text-blue-500 font-black font-mono">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Mistakes & Warnings */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/15 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-[9px] font-mono text-rose-400 uppercase tracking-widest font-black">CRITICAL TECHNIQUE WARNINGS</span>
                <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-1 font-medium">
                  {activeExercise.mistakes.map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Substitutions & Science */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/60 pt-4">
              <div className="space-y-2">
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">ALTERNATIVE SWAPS</span>
                <div className="flex flex-wrap gap-2">
                  {activeExercise.alternatives.map((alt, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-850 text-xs font-bold text-slate-300">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/15">
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  HYPERTROPHY SCIENCE NOTE
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {activeExercise.science}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md flex flex-col items-center justify-center text-center py-20 flex-1">
            <RotateCcw className="h-10 w-10 text-slate-700 mb-3 animate-spin" />
            <div className="text-xs font-bold text-slate-400">Loading details...</div>
          </div>
        )}
      </div>
    </div>
  );
}
