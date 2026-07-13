"use client";

import React, { useState } from "react";
import { splits, exercises, WorkoutSplit } from "@/lib/hypertrophyData";
import {
  ClipboardList,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Sliders,
  Award,
  Info
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
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleLogChange = (exId: string, setKey: "set1" | "set2" | "set3", val: string) => {
    const logKey = `hypertrophy_logs_${activeSplit.id}_${weekGroup}_${activeSplit.days[weekGroup][activeDayIdx].name}_${exId}`;
    
    const updatedLogs = { ...weightLogs };
    if (!updatedLogs[logKey]) {
      updatedLogs[logKey] = { set1: "", set2: "", set3: "" };
    }
    updatedLogs[logKey][setKey] = val;
    setWeightLogs(updatedLogs);

    // Save to localStorage
    try {
      localStorage.setItem(logKey, JSON.stringify(updatedLogs[logKey]));
    } catch (e) {
      console.error("Failed saving logs to localStorage", e);
    }
  };

  const clearAllLogs = () => {
    if (confirm("Are you sure you want to reset all workout weight logging history?")) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("hypertrophy_logs_")) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        setWeightLogs({});
        alert("Weight log history successfully cleared.");
      } catch (e) {
        console.warn("Could not clear logs", e);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Dynamic Calibration Form Column */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6 h-fit">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            CALIBRATION CONTROLLERS
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">Anabolic Splitting</h3>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold text-slate-600">
          <div className="grid grid-cols-2 gap-3.5">
            {/* Age */}
            <div>
              <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">AGE (YRS)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>
            {/* Height */}
            <div>
              <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">HEIGHT (CM)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Weight */}
            <div>
              <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">WEIGHT (KG)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>
            {/* Body Fat */}
            <div>
              <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">BODY FAT (%)</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Experience level */}
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">TRAINING LEVEL</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="Novice">Novice (&lt;1 year experience)</option>
              <option value="Intermediate">Intermediate (1-3 years experience)</option>
              <option value="Advanced">Advanced (3+ years experience)</option>
            </select>
          </div>

          {/* Goal selection */}
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">PRIMARY OBJECTIVE</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="Hypertrophy">Myofibrillar Hypertrophy (Mass)</option>
              <option value="Strength">Sarcoplasmic Recomp & Strength</option>
              <option value="Power">Athletic Conditioning</option>
            </select>
          </div>

          {/* Frequency Toggle options */}
          <div className="space-y-1">
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">WEEKLY SPLIT FREQUENCY</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency("3")}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  frequency === "3"
                    ? "bg-blue-600 border border-blue-500 text-white"
                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800"
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
                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800"
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
          className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Workout Log History
        </button>
      </div>

      {/* Workout Plan Scheduler Column */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {activeSplit ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Dynamic generated banner alert */}
            {savedAlert && (
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 text-center font-bold animate-bounce">
                AI ENGINE GENERATED PLAN SUCCESSFULLY!
              </div>
            )}

            {/* Title & Phase Switcher */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1">
                  <ClipboardList className="h-4.5 w-4.5" />
                  GENERATED PROGRESSIVE OVERLOAD PLAN
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{activeSplit.name}</h3>
                <p className="text-[10px] text-slate-400 font-mono">{activeSplit.schedule}</p>
              </div>

              {/* Week block toggle */}
              <div className="bg-slate-50 border border-slate-200 p-1 rounded-2xl flex gap-1 text-[10px] font-bold font-mono shadow-sm">
                <button
                  onClick={() => {
                    setWeekGroup("weeks_1_4");
                    setActiveDayIdx(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    weekGroup === "weeks_1_4"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
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
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Weeks 5-8 (Modified)
                </button>
              </div>
            </div>

            {/* Day selector tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {activeSplit.days[weekGroup].map((day, idx) => (
                <button
                  key={day.name}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    idx === activeDayIdx
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>

            {/* Day exercises table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">TODAY&apos;S INTENSITY FOCUS</span>
                  <span className="text-xs font-bold text-slate-700 block">
                    {activeSplit.days[weekGroup][activeDayIdx].focus}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold">
                  DIAGNOSTICS: NOMINAL
                </span>
              </div>

              <div className="space-y-3">
                {activeSplit.days[weekGroup][activeDayIdx].exercises.map((dayEx) => {
                  const exDetail = exercises.find((e) => e.id === dayEx.exerciseId);
                  if (!exDetail) return null;

                  const logKey = `hypertrophy_logs_${activeSplit.id}_${weekGroup}_${activeSplit.days[weekGroup][activeDayIdx].name}_${dayEx.exerciseId}`;
                  const currentLog = weightLogs[logKey] || { set1: "", set2: "", set3: "" };

                  return (
                    <div
                      key={dayEx.exerciseId}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Name & Target */}
                      <div className="space-y-1 md:max-w-xs">
                        <span className="text-xs font-bold text-slate-800 block">{exDetail.name}</span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                          Target: {dayEx.sets} sets x {dayEx.reps} reps (RPE {dayEx.rpe})
                        </span>
                      </div>

                      {/* Working Set Weight log inputs */}
                      <div className="flex items-center gap-3.5 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                          <Award className="h-3.5 w-3.5 text-blue-600" />
                          <span>LOG LOAD (KG):</span>
                        </div>

                        <div className="flex gap-2">
                          {/* Set 1 */}
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] font-mono text-slate-400 mb-0.5">SET 1</span>
                            <input
                              type="text"
                              placeholder="kg"
                              value={currentLog.set1}
                              onChange={(e) => handleLogChange(dayEx.exerciseId, "set1", e.target.value)}
                              className="w-12 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-center font-bold text-slate-700 focus:outline-none"
                            />
                          </div>

                          {/* Set 2 */}
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] font-mono text-slate-400 mb-0.5">SET 2</span>
                            <input
                              type="text"
                              placeholder="kg"
                              value={currentLog.set2}
                              onChange={(e) => handleLogChange(dayEx.exerciseId, "set2", e.target.value)}
                              className="w-12 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-center font-bold text-slate-700 focus:outline-none"
                            />
                          </div>

                          {/* Set 3 */}
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] font-mono text-slate-400 mb-0.5">SET 3</span>
                            <input
                              type="text"
                              placeholder="kg"
                              value={currentLog.set3}
                              onChange={(e) => handleLogChange(dayEx.exerciseId, "set3", e.target.value)}
                              className="w-12 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-center font-bold text-slate-700 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warmup protocol box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
              <Info className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">WARMUP PROTOCOL RECOMMENDATION</span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Perform 2 sets of warmups prior to your heavy compounds: Set 1 at 50% of working weight for 8 reps, and Set 2 at 75% for 4 reps. Control the eccentrics (2-3s) to prepare tendons and motor unit pathways.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center py-20 flex-1">
            <ClipboardList className="h-8 w-8 text-slate-350 animate-pulse mx-auto mb-2" />
            <div className="text-xs text-slate-500 font-bold">Plan loading...</div>
          </div>
        )}
      </div>
    </div>
  );
}
