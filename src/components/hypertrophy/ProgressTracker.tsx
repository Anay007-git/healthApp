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
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[77, 78, 79].map((val) => {
          const ratio = (val - wMin) / (wMax - wMin);
          const y = height - padding - ratio * (height - padding * 2);
          return (
            <g key={val}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} className="stroke-slate-800/40 stroke-1" strokeDasharray="4,4" />
              <text x={padding - 5} y={y + 3} className="fill-slate-500 text-[8px]" textAnchor="end">{val}kg</text>
            </g>
          );
        })}

        {/* Glow fill */}
        <path d={areaD} fill="url(#chartGlow)" />

        {/* Trend Line */}
        <path d={pathD} fill="none" className="stroke-blue-500 stroke-2" />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="3.5" className="fill-slate-950 stroke-blue-400 stroke-2 hover:fill-blue-500 transition-colors" />
            <text x={p.x} y={height - 2} className="fill-slate-500 text-[8px] text-center" textAnchor="middle">{p.day}</text>
            <text x={p.x} y={p.y - 8} className="fill-white text-[7px] opacity-0 group-hover:opacity-100 transition-opacity text-center font-bold" textAnchor="middle">{p.weight}kg</text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Weight Tracker Block */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              WEIGHT PROGRESSION CURVE
            </span>
            <h3 className="text-lg font-black text-white">Body Recomposition Log</h3>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
            TREND: LEAN GAIN (+0.2KG/WK)
          </span>
        </div>

        {/* Custom SVG line graph */}
        <div className="p-4 rounded-2xl bg-[#0B0F19]/50 border border-slate-800/40">
          {renderSvgLineChart()}
        </div>

        {/* Inputs */}
        <form onSubmit={handleAddDataPoint} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs font-semibold">
          <div>
            <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">DAY OF WEEK</label>
            <select
              value={inputDay}
              onChange={(e) => setInputDay(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-2.5 py-2"
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
            <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">WEIGHT (KG)</label>
            <input
              type="number"
              step="0.1"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
          <div>
            <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">VOL LOAD (KG)</label>
            <input
              type="number"
              value={inputVolume}
              onChange={(e) => setInputVolume(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Log Entry
          </button>
        </form>
      </div>

      {/* Strength Personal Records (PRs) Column */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md flex flex-col gap-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            STRENGTH HALL OF FAME
          </span>
          <h3 className="text-lg font-black text-white">Personal Records (PRs)</h3>
        </div>

        {/* PR list */}
        <div className="space-y-2.5 flex-1">
          {prs.map((pr, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#0B0F19]/60 border border-slate-800/60 flex items-center justify-between group hover:border-blue-500/20 transition-all duration-200"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">{pr.exercise}</span>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">RECORDED: {pr.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-400">{pr.weight}</span>
                <div className="p-1.5 rounded-lg bg-blue-500/5 text-blue-400 border border-blue-500/10">
                  <Zap className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add PR Form */}
        <form onSubmit={handleAddPR} className="space-y-3 border-t border-slate-800/60 pt-4 text-xs font-semibold">
          <div>
            <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">EXERCISE</label>
            <input
              type="text"
              placeholder="e.g. Incline Bench"
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">RECORD WEIGHT</label>
            <input
              type="text"
              placeholder="e.g. 100 kg"
              value={newExWeight}
              onChange={(e) => setNewExWeight(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 text-xs font-bold text-slate-200 border border-slate-800 transition-colors"
          >
            Log New Strength Record
          </button>
        </form>
      </div>
    </div>
  );
}
