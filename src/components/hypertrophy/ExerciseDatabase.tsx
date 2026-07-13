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
      if (isPrimary(mId)) return "fill-blue-600/90 stroke-blue-500";
      if (isSecondary(mId)) return "fill-blue-600/20 stroke-blue-500/40";
      return "fill-slate-100 stroke-slate-200/50";
    };

    return (
      <div className="flex justify-center gap-6 p-4 rounded-3xl bg-slate-50 border border-slate-200">
        {/* Anterior View (Front) */}
        <div className="flex flex-col items-center gap-1.5 font-mono">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">ANTERIOR</span>
          <svg className="w-28 h-56" viewBox="0 0 100 200">
            {/* Outline Head */}
            <circle cx="50" cy="20" r="10" className="fill-slate-200 stroke-slate-300" />
            <rect x="47" y="30" width="6" height="8" className="fill-slate-200 stroke-slate-300" />

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

            {/* Calves */}
            <rect x="35" y="138" width="10" height="34" rx="3" className={getFill("calves")} />
            <rect x="55" y="138" width="10" height="34" rx="3" className={getFill("calves")} />
          </svg>
        </div>

        {/* Posterior View (Back) */}
        <div className="flex flex-col items-center gap-1.5 font-mono">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">POSTERIOR</span>
          <svg className="w-28 h-56" viewBox="0 0 100 200">
            {/* Outline Head */}
            <circle cx="50" cy="20" r="10" className="fill-slate-200 stroke-slate-300" />
            <rect x="47" y="30" width="6" height="8" className="fill-slate-200 stroke-slate-300" />

            {/* Traps */}
            <path d="M 38,42 L 50,34 L 62,42 L 50,56 Z" className={getFill("traps")} />

            {/* Lats */}
            <path d="M 32,54 L 46,56 L 46,78 L 34,78 Z" className={getFill("lats")} />
            <path d="M 68,54 L 54,56 L 54,78 L 66,78 Z" className={getFill("lats")} />

            {/* Rhomboids */}
            <rect x="44" y="48" width="12" height="14" rx="1" className={getFill("rhomboids")} />

            {/* Spinal Erectors */}
            <rect x="42" y="66" width="6" height="18" rx="1" className={getFill("spinal_erectors")} />
            <rect x="52" y="66" width="6" height="18" rx="1" className={getFill("spinal_erectors")} />

            {/* Triceps */}
            <rect x="25" y="52" width="7" height="15" rx="3" className={getFill("triceps")} />
            <rect x="68" y="52" width="7" height="15" rx="3" className={getFill("triceps")} />

            {/* Glutes */}
            <rect x="35" y="86" width="14" height="18" rx="4" className={getFill("glutes")} />
            <rect x="51" y="86" width="14" height="18" rx="4" className={getFill("glutes")} />

            {/* Hamstrings */}
            <rect x="34" y="108" width="13" height="34" rx="4" className={getFill("hamstrings")} />
            <rect x="53" y="108" width="13" height="34" rx="4" className={getFill("hamstrings")} />

            {/* Calves */}
            <rect x="35" y="146" width="10" height="30" rx="3" className={getFill("calves")} />
            <rect x="55" y="146" width="10" height="30" rx="3" className={getFill("calves")} />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Search & Selector Column */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            DIAGNOSTIC SEARCH
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">Exercise Directory</h3>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search biomechanics database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-2xl pl-10 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">EQUIPMENT</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-2 text-[10px] font-bold focus:outline-none"
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
              <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">TARGET MUSCLE</label>
              <select
                value={selectedMuscleFilter}
                onChange={(e) => setSelectedMuscleFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-2 text-[10px] font-bold focus:outline-none"
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
        <div className="flex-1 max-h-[460px] overflow-y-auto space-y-2 p-2 rounded-3xl bg-slate-50 border border-slate-100 overflow-x-hidden scrollbar-none">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 font-bold">No exercises match search criteria</div>
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
                      ? "bg-blue-50 border-blue-100 text-blue-600"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60 hover:border-slate-350"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold block">{ex.name}</span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                      {ex.equipment} • {primaryM ? primaryM.name.split(" ")[0] : ""}
                    </span>
                  </div>
                  <Dumbbell className={`h-4 w-4 transition-transform duration-200 group-hover:rotate-12 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Exercise Details Column */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeExercise ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1">
                  <Dumbbell className="h-3.5 w-3.5" />
                  {activeExercise.equipment} MOVEMENT
                </span>
                <h2 className="text-2xl font-black text-slate-900">{activeExercise.name}</h2>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="text-slate-500 bg-slate-100 border border-slate-250 px-2 py-0.5 rounded">
                    Diff: {activeExercise.difficulty}
                  </span>
                  <span className="text-slate-500 bg-slate-100 border border-slate-250 px-2 py-0.5 rounded">
                    Tempo: {activeExercise.tempo}
                  </span>
                </div>
              </div>

              {/* Video placeholder with real link */}
              <a
                href={activeExercise.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-[10px] font-mono text-blue-600 flex items-center gap-2 active:scale-95 transition-all shadow-sm font-bold"
              >
                <Play className="h-3.5 w-3.5 fill-blue-600" />
                PLAY TECHNIQUE VIDEO
              </a>
            </div>

            {/* Muscle Activation Mapping & Highlight Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Highlight SVGs */}
              {renderAnatomicalHighlights(activeExercise)}

              {/* Recruitment statistics */}
              <div className="flex flex-col gap-4 justify-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                  MUSCLE RECRUITMENT LOAD
                </span>

                <div className="space-y-3.5 font-mono">
                  {/* Primary */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800 uppercase">
                        {muscles.find((m) => m.id === activeExercise.primaryMuscle)?.name.split(" ")[0]} (Primary)
                      </span>
                      <span className="text-blue-600 font-black">{activeExercise.activationPrimary}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeExercise.activationPrimary}%` }} />
                    </div>
                  </div>

                  {/* Secondary muscles */}
                  {activeExercise.secondaryMuscles.map((mId) => (
                    <div key={mId} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-500 uppercase">
                          {muscles.find((m) => m.id === mId)?.name.split(" ")[0]} (Synergist)
                        </span>
                        <span className="text-slate-500 font-bold">{activeExercise.activationSecondary}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600/40 rounded-full" style={{ width: `${activeExercise.activationSecondary}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROM & Rest statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex gap-3">
                <Info className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">RANGE OF MOTION</span>
                  <span className="text-xs font-semibold text-slate-700 leading-tight block">{activeExercise.rom}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex gap-3">
                <Clock className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">REST INTERVAL</span>
                  <span className="text-xs font-semibold text-slate-700 leading-tight block">{activeExercise.rest} (Target RPE {activeExercise.rpe})</span>
                </div>
              </div>
            </div>

            {/* Execution Steps */}
            <div className="space-y-3.5">
              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">EXECUTION STEPS</span>
              <ol className="space-y-2 text-xs text-slate-600 font-medium">
                {activeExercise.execution.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="text-blue-600 font-black font-mono">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Mistakes & Warnings */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-[9px] font-mono text-rose-500 uppercase tracking-widest font-black">CRITICAL TECHNIQUE WARNINGS</span>
                <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-1 font-medium">
                  {activeExercise.mistakes.map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Substitutions & Science */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div className="space-y-2">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">ALTERNATIVE SWAPS</span>
                <div className="flex flex-wrap gap-2">
                  {activeExercise.alternatives.map((alt, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  HYPERTROPHY SCIENCE NOTE
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  {activeExercise.science}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center py-20 flex-1">
            <RotateCcw className="h-10 w-10 text-slate-400 mb-3 animate-spin" />
            <div className="text-xs font-bold text-slate-500">Loading details...</div>
          </div>
        )}
      </div>
    </div>
  );
}
