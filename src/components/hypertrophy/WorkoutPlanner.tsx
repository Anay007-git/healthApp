"use client";

import React, { useState } from "react";
import { splits, exercises, WorkoutSplit } from "@/lib/hypertrophyData";
import {
  ClipboardList,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Sliders
} from "lucide-react";

export default function WorkoutPlanner() {
  // Planner generator form state
  const [age, setAge] = useState("24");
  const [weight, setWeight] = useState("78");
  const [height, setHeight] = useState("178");
  const [bodyFat, setBodyFat] = useState("15");
  const [experience, setExperience] = useState("Intermediate");
  const [frequency, setFrequency] = useState("4"); // 3 = Full Body, 4 = Upper Lower
  const [goal, setGoal] = useState("Hypertrophy");
  
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit>(() => {
    return splits.find(s => s.id === "upper_lower") || splits[0];
  });
  const [weekGroup, setWeekGroup] = useState<"weeks_1_4" | "weeks_5_8">("weeks_1_4");
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  
  // Weight logging state
  // Key format: hypertrophy_logs_[splitId]_[weekGroup]_[dayName]_[exId] = { set1: '', set2: '', set3: '' }
  const [weightLogs, setWeightLogs] = useState<{ [key: string]: { set1: string; set2: string; set3: string } }>(() => {
    const loadedLogs: Record<string, { set1: string; set2: string; set3: string }> = {};
    if (typeof window === "undefined") return loadedLogs;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("hypertrophy_logs_")) {
          const val = localStorage.getItem(key);
          if (val) {
            loadedLogs[key] = JSON.parse(val);
          }
        }
      }
    } catch (e) {
      console.warn("Could not load weights logs from localStorage", e);
    }
    return loadedLogs;
  });
  const [savedAlert, setSavedAlert] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Select split based on days/week frequency input
    const targetSplitId = frequency === "3" ? "full_body" : "upper_lower";
    const selected = splits.find((s) => s.id === targetSplitId) || splits[0];
    setActiveSplit(selected);
    setActiveDayIdx(0);
    
    // Trigger notification alert
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleWeightLogChange = (
    exId: string,
    setNum: "set1" | "set2" | "set3",
    value: string
  ) => {
    if (!activeSplit) return;
    const dayName = activeSplit.days[weekGroup][activeDayIdx].name;
    const storageKey = `hypertrophy_logs_${activeSplit.id}_${weekGroup}_${dayName}_${exId}`;

    const currentLog = weightLogs[storageKey] || { set1: "", set2: "", set3: "" };
    const updatedLog = { ...currentLog, [setNum]: value };

    // Update state
    setWeightLogs((prev) => ({
      ...prev,
      [storageKey]: updatedLog,
    }));

    // Update localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedLog));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllLogs = () => {
    if (!confirm("Are you sure you want to delete your logged weights history?")) return;
    try {
      Object.keys(weightLogs).forEach((key) => {
        localStorage.removeItem(key);
      });
      setWeightLogs({});
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 2 Column layout: Form inputs left, Generated schedule right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-blue-400" />
              AI Split Configuration
            </h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none">
              Hypertrophic Profiling Form
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold">
            {/* Height & Weight row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3.5 py-2.5"
                />
              </div>
            </div>

            {/* Age & Fat Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Body Fat %</label>
                <input
                  type="number"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3.5 py-2.5"
                />
              </div>
            </div>

            {/* Experience Dropdown */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Training Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Beginner">Beginner (Under 1 Year)</option>
                <option value="Intermediate">Intermediate (1-3 Years)</option>
                <option value="Advanced">Advanced (3+ Years)</option>
              </select>
            </div>

            {/* Goal Dropdown */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Primary Fitness Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Hypertrophy">Hypertrophy (Maximum Muscle)</option>
                <option value="Strength">Strength Base (Heavy Compounds)</option>
                <option value="Fat Loss">Recomposition (Loss Fat + Keep Muscle)</option>
                <option value="Powerbuilding">Powerbuilding (Max Squat/Bench + Size)</option>
              </select>
            </div>

            {/* Frequency Selection */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">Training Days per Week</label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setFrequency("3")}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    frequency === "3"
                      ? "bg-blue-600 border border-blue-500 text-white"
                      : "bg-[#0e1626] border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  3 Days (Full Body)
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("4")}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    frequency === "4"
                      ? "bg-blue-600 border border-blue-500 text-white"
                      : "bg-[#0e1626] border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  4 Days (Upper/Lower)
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black text-xs text-white shadow-xl shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4.5 w-4.5" />
              Generate Scientific Plan
            </button>
          </form>

          {/* Quick Clear Logs */}
          <button
            onClick={clearAllLogs}
            className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Workout Log History
          </button>
        </div>

        {/* Workout Plan Scheduler Column */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {activeSplit ? (
            <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6">
              {/* Dynamic generated banner alert */}
              {savedAlert && (
                <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs font-mono text-blue-400 text-center animate-bounce">
                  AI ENGINE GENERATED PLAN SUCCESSFULLY!
                </div>
              )}

              {/* Title & Phase Switcher */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1">
                    <ClipboardList className="h-4.5 w-4.5" />
                    GENERATED PROGRESSIVE OVERLOAD PLAN
                  </span>
                  <h3 className="text-xl font-black text-white">{activeSplit.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{activeSplit.schedule}</p>
                </div>

                {/* Week block toggle */}
                <div className="bg-[#0e1626] border border-slate-800/80 p-1.5 rounded-2xl flex gap-1.5 text-[10px] font-bold font-mono shadow-sm">
                  <button
                    onClick={() => {
                      setWeekGroup("weeks_1_4");
                      setActiveDayIdx(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      weekGroup === "weeks_1_4"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Weeks 1-4 (Strength Base)
                  </button>
                  <button
                    onClick={() => {
                      setWeekGroup("weeks_5_8");
                      setActiveDayIdx(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      weekGroup === "weeks_5_8"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Weeks 5-8 (Modified)
                  </button>
                </div>
              </div>

              {/* Day selection tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800/60 pb-3 font-mono">
                {activeSplit.days[weekGroup].map((day, idx) => (
                  <button
                    key={day.name}
                    onClick={() => setActiveDayIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                      activeDayIdx === idx
                        ? "bg-blue-500/10 border border-blue-500/35 text-blue-400"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-850"
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>

              {/* Day exercises table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#0e1626]/60 border border-slate-800/50 p-4 rounded-2xl">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">TODAY&apos;S INTENSITY FOCUS</span>
                    <span className="text-xs font-bold text-slate-300 block">
                      {activeSplit.days[weekGroup][activeDayIdx].focus}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    DIAGNOSTICS: NOMINAL
                  </span>
                </div>

                <div className="space-y-3">
                  {activeSplit.days[weekGroup][activeDayIdx].exercises.map((dayEx, idx) => {
                    const exDetail = exercises.find((e) => e.id === dayEx.exerciseId);
                    if (!exDetail) return null;

                    // Log local storage key
                    const storageKey = `hypertrophy_logs_${activeSplit.id}_${weekGroup}_${activeSplit.days[weekGroup][activeDayIdx].name}_${dayEx.exerciseId}`;
                    const currentLog = weightLogs[storageKey] || { set1: "", set2: "", set3: "" };

                    return (
                      <div
                        key={dayEx.exerciseId}
                        className="p-4 rounded-2xl bg-[#090D16]/50 border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-800 transition-colors"
                      >
                        {/* Left column: Exercise detail */}
                        <div className="space-y-1 md:max-w-md">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{idx + 1}. {exDetail.name}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                              {dayEx.sets}S x {dayEx.reps}R @ RPE{dayEx.rpe}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                              Rest: {dayEx.rest}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            {dayEx.notes}
                          </p>
                        </div>

                        {/* Right column: Log Weight inputs */}
                        <div className="flex flex-col gap-1.5 font-mono">
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black text-right hidden md:block">
                            LOG WEIGHTS (KG)
                          </span>
                          <div className="flex gap-1.5 items-center">
                            {/* Set 1 */}
                            <div className="flex flex-col gap-0.5 items-center">
                              <span className="text-[7px] text-slate-500">S1</span>
                              <input
                                type="text"
                                placeholder="--"
                                value={currentLog.set1}
                                onChange={(e) =>
                                  handleWeightLogChange(dayEx.exerciseId, "set1", e.target.value)
                                }
                                className="w-12 bg-[#0e1626] border border-slate-800 text-white rounded-lg py-1 text-center text-[10px] font-bold focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            {/* Set 2 */}
                            <div className="flex flex-col gap-0.5 items-center">
                              <span className="text-[7px] text-slate-500">S2</span>
                              <input
                                type="text"
                                placeholder="--"
                                value={currentLog.set2}
                                onChange={(e) =>
                                  handleWeightLogChange(dayEx.exerciseId, "set2", e.target.value)
                                }
                                className="w-12 bg-[#0e1626] border border-slate-800 text-white rounded-lg py-1 text-center text-[10px] font-bold focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            {/* Set 3 */}
                            <div className="flex flex-col gap-0.5 items-center">
                              <span className="text-[7px] text-slate-500">S3</span>
                              <input
                                type="text"
                                placeholder="--"
                                value={currentLog.set3}
                                onChange={(e) =>
                                  handleWeightLogChange(dayEx.exerciseId, "set3", e.target.value)
                                }
                                className="w-12 bg-[#0e1626] border border-slate-800 text-white rounded-lg py-1 text-center text-[10px] font-bold focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            {/* Saved confirmation indicator */}
                            <div className="h-5 w-5 flex items-center justify-center text-slate-700 bg-slate-900 border border-slate-800 rounded-lg">
                              <CheckCircle className={`h-3 w-3 ${
                                currentLog.set1 || currentLog.set2 || currentLog.set3
                                  ? "text-blue-500 animate-pulse"
                                  : "text-slate-700"
                              }`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md flex flex-col items-center justify-center text-center py-20">
              <ClipboardList className="h-10 w-10 text-slate-700 mb-3" />
              <div className="text-xs font-bold text-slate-400">Loading plan layout...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
