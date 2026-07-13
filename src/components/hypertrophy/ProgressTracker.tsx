"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  Zap,
  PlusCircle
} from "lucide-react";

interface ProgressPoint {
  day: string;
  weight: number;
  volume: number;
}

export default function ProgressTracker() {
  const [dataPoints, setDataPoints] = useState<ProgressPoint[]>([
    { day: "Mon", weight: 77.8, volume: 3400 },
    { day: "Tue", weight: 77.9, volume: 4200 },
    { day: "Wed", weight: 77.8, volume: 0 },
    { day: "Thu", weight: 78.1, volume: 4900 },
    { day: "Fri", weight: 78.2, volume: 3800 },
    { day: "Sat", weight: 78.3, volume: 0 },
    { day: "Sun", weight: 78.4, volume: 0 }
  ]);

  const [inputWeight, setInputWeight] = useState("78.5");
  const [inputVolume, setInputVolume] = useState("4500");
  const [inputDay, setInputDay] = useState("Mon");

  const [prs, setPrs] = useState<{ exercise: string; weight: string; date: string }[]>([
    { exercise: "Back Squat", weight: "120 kg", date: "2026-07-10" },
    { exercise: "Barbell Bench Press", weight: "95 kg", date: "2026-07-08" },
    { exercise: "Conventional Deadlift", weight: "160 kg", date: "2026-07-06" }
  ]);

  const [newExName, setNewExName] = useState("Barbell Hip Thrust");
  const [newExWeight, setNewExWeight] = useState("140 kg");

  const handleAddDataPoint = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    const v = parseInt(inputVolume) || 0;
    if (isNaN(w)) return;

    // Check if day already exists to replace, or append
    setDataPoints((prev) => {
      const idx = prev.findIndex((p) => p.day === inputDay);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { day: inputDay, weight: w, volume: v };
        return copy;
      } else {
        return [...prev, { day: inputDay, weight: w, volume: v }];
      }
    });
  };

  const handleAddPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName || !newExWeight) return;
    const dateStr = new Date().toISOString().split("T")[0];
    setPrs((prev) => [...prev, { exercise: newExName, weight: newExWeight, date: dateStr }]);
    setNewExName("");
    setNewExWeight("");
  };

  // SVG Chart calculation helper
  const renderSvgLineChart = () => {
    const wMin = 76;
    const wMax = 80;
    const height = 150;
    const width = 500;
    const padding = 20;

    const points = dataPoints.map((p, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (width - padding * 2);
      const ratio = (p.weight - wMin) / (wMax - wMin);
      const y = height - padding - ratio * (height - padding * 2);
      return { x, y, ...p };
    });

    if (points.length < 2) return null;

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    // Gradient area path
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <svg className="w-full h-44 font-mono overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[77, 78, 79].map((val) => {
          const ratio = (val - wMin) / (wMax - wMin);
          const y = height - padding - ratio * (height - padding * 2);
          return (
            <g key={val}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} className="stroke-slate-200 stroke-1" strokeDasharray="4,4" />
              <text x={padding - 5} y={y + 3} className="fill-slate-400 text-[8px]" textAnchor="end">{val}kg</text>
            </g>
          );
        })}

        {/* Glow fill */}
        <path d={areaD} fill="url(#chartGlow)" />

        {/* Trend Line */}
        <path d={pathD} fill="none" className="stroke-blue-600 stroke-2" />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="4" className="fill-white stroke-blue-600 stroke-2 hover:fill-blue-600 transition-colors" />
            <text x={p.x} y={height - 2} className="fill-slate-400 text-[8px] text-center" textAnchor="middle">{p.day}</text>
            <text x={p.x} y={p.y - 8} className="fill-slate-800 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity text-center font-bold" textAnchor="middle">{p.weight}kg</text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Weight Tracker Block */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              WEIGHT PROGRESSION CURVE
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">Body Recomposition Log</h3>
          </div>
          <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            TREND: LEAN GAIN (+0.2KG/WK)
          </span>
        </div>

        {/* Custom SVG line graph */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          {renderSvgLineChart()}
        </div>

        {/* Inputs */}
        <form onSubmit={handleAddDataPoint} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs font-semibold text-slate-600">
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1.5">DAY OF WEEK</label>
            <select
              value={inputDay}
              onChange={(e) => setInputDay(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-2 focus:outline-none"
            >
              <option value="Mon">Monday</option>
              <option value="Tue">Tuesday</option>
              <option value="Wed">Wednesday</option>
              <option value="Thu">Thursday</option>
              <option value="Fri">Friday</option>
              <option value="Sat">Saturday</option>
              <option value="Sun">Sunday</option>
            </select>
          </div>
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1.5">WEIGHT (KG)</label>
            <input
              type="number"
              step="0.1"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1.5">VOLUME (KG/WK)</label>
            <input
              type="number"
              value={inputVolume}
              onChange={(e) => setInputVolume(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Add Log Point
          </button>
        </form>
      </div>

      {/* PR / Records Block */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            PERSONAL STRENGTH PRs
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">Hall of Records</h3>
        </div>

        {/* PR list */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
          {prs.map((pr, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">{pr.exercise}</span>
                <span className="text-[9px] font-mono text-slate-400 block">{pr.date}</span>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 font-mono font-bold rounded-xl text-[10px]">
                {pr.weight}
              </span>
            </div>
          ))}
        </div>

        {/* Add PR form */}
        <form onSubmit={handleAddPR} className="space-y-3 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">EXERCISE</label>
            <input
              type="text"
              placeholder="e.g. Incline Bench Press"
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1">LOAD (KG / REPS)</label>
            <input
              type="text"
              placeholder="e.g. 100 kg x 5 reps"
              value={newExWeight}
              onChange={(e) => setNewExWeight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all shadow-sm"
          >
            Log New Bench PR
          </button>
        </form>
      </div>
    </div>
  );
}
