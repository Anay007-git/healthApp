"use client";

import React, { useState } from "react";
import AnatomyCanvas from "./AnatomyCanvas";
import { muscles, exercises, WorkoutSplit } from "@/lib/hypertrophyData";
import {
  Flame,
  Zap,
  Activity,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Info,
  Sliders,
  CheckCircle,
  HelpCircle,
  Clock,
  Award,
  AlertTriangle,
  Send,
  Droplets,
  BookOpen
} from "lucide-react";

interface DashboardOverviewProps {
  onTabChange: (tab: string) => void;
}

export default function DashboardOverview({ onTabChange }: DashboardOverviewProps) {
  // Muscle anatomy selection
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>("upper_chest");
  const [viewAngle, setViewAngle] = useState<"front" | "back" | "side" | "reset">("front");

  // Recovery calculator states
  const [sleep, setSleep] = useState(7.5);
  const [proteinMet, setProteinMet] = useState(true);
  const [soreness, setSoreness] = useState(2);

  // Calorie macros calculator states
  const [weight, setWeight] = useState("78");
  const [goal, setGoal] = useState("lean_bulk");
  const [activity, setActivity] = useState("moderate");

  // AI coach chat states
  const [chatMessages, setChatMessages] = useState([
    { sender: "coach", text: "Hello! Ask me any biomechanical questions about target muscles or RIR sets." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Get active muscle info
  const activeMuscle = muscles.find((m) => m.id === selectedMuscleId) || muscles[0];

  // Calculate recovery coefficient
  const calculateRecoveryScore = () => {
    let score = 50;
    score += Math.max(0, (sleep - 6) * 10);
    if (proteinMet) score += 15;
    score -= (soreness - 1) * 12;
    return Math.min(100, Math.max(0, Math.round(score)));
  };
  const recoveryScore = calculateRecoveryScore();

  // Calculate nutrition macros
  const calculateMacros = () => {
    const wt = parseFloat(weight) || 75;
    let base = wt * 22;
    if (activity === "sedentary") base *= 1.2;
    else if (activity === "moderate") base *= 1.4;
    else base *= 1.6;

    let cal = base;
    let protPerKg = 2.0;

    if (goal === "lean_bulk") {
      cal += 250;
      protPerKg = 2.0;
    } else if (goal === "clean_bulk") {
      cal += 450;
      protPerKg = 2.2;
    } else if (goal === "cut") {
      cal -= 400;
      protPerKg = 2.4;
    }

    cal = Math.round(cal);
    const protein = Math.round(wt * protPerKg);
    const fat = Math.round((cal * 0.25) / 9);
    const carbs = Math.round((cal - protein * 4 - fat * 9) / 4);
    return { cal, protein, carbs, fat };
  };
  const macrosData = calculateMacros();

  // Chat message submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simple reactive text logic
    setTimeout(() => {
      let reply = "Based on mechanical tension principles, take sets within 1-3 Reps in Reserve (RPE 7-9) for optimal myofibrillar hypertrophy.";
      const query = chatInput.toLowerCase();
      if (query.includes("chest")) reply = "To prioritize clavicular head growth, use incline dumbbells at a 30-degree incline. Keep shoulders depressed.";
      else if (query.includes("back")) reply = "Focus on wide-grip lat pulldowns with elbows tucked close, or chest-supported rows to failure.";

      setChatMessages((prev) => [...prev, { sender: "coach", text: reply }]);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Dense Bento Header Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md overflow-hidden flex flex-col justify-center">
        {/* Glow */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-[80px] pointer-events-none" />
        <div className="relative space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold tracking-wider font-mono">
            <Sparkles className="h-3 w-3" />
            <span>HYPERTROPHY BIOMECHANICS ENGINE ACTIVE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Master Muscle Growth & Volume Science
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed font-medium">
            Learn anatomical recruitment, calculate custom macro balances, avoid junk volume, and optimize workouts with science.
          </p>
        </div>
      </div>

      {/* Primary 3D Anatomy & Muscle Details Bento Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Bento Cell 1: Anatomy Selector (SVG vector human map) */}
        <div className="lg:col-span-6 flex flex-col">
          <AnatomyCanvas
            selectedMuscleId={selectedMuscleId}
            onSelectMuscle={(id) => setSelectedMuscleId(id)}
            viewAngle={viewAngle}
          />
        </div>

        {/* Bento Cell 2: Real-time Biomechanics Diagnostic Panel */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5" />
                BIOMECHANICAL SCAN
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 capitalize">
                {activeMuscle.name} Anatomical Specs
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Function Description</span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {activeMuscle.description}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Training Science Rules</span>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>{activeMuscle.scientificNotes}</span>
              </p>
            </div>

            {/* Optimal Movements list */}
            <div className="space-y-2.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Recommended Movements</span>
              <div className="flex flex-wrap gap-1.5">
                {activeMuscle.exercises.map((exId) => {
                  const ex = exercises.find((e) => e.id === exId);
                  return (
                    <span key={exId} className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600">
                      {ex?.name || exId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[9px] text-slate-400 font-mono">MAP CONTROLLER: ONLINE</span>
            <button
              onClick={() => onTabChange("anatomy")}
              className="text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-1"
            >
              Full Anatomy Deck <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bento Grid Row (Macros, Recovery, Volume) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Bento Cell 3: Recovery Coefficient Dial */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black">RECOVERY INDEX</span>
                <h3 className="text-sm font-extrabold text-slate-900">Sleep & Soreness Coefficient</h3>
              </div>
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-500">
                <Flame className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span>Sleep: {sleep}h</span>
                  <span className="text-blue-600">Slider</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span>Soreness: Lvl {soreness}/5</span>
                  <span className="text-blue-600">Slider</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={soreness}
                  onChange={(e) => setSoreness(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-mono">RECOVERY COEFFICIENT</span>
              <span className="text-lg font-black text-slate-800">{recoveryScore}% Readiness</span>
            </div>
            <button
              onClick={() => onTabChange("recovery")}
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              Analyze Heatmap
            </button>
          </div>
        </div>

        {/* Bento Cell 4: Weekly Volume Analyzer */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black">VOLUME THRESHOLD</span>
                <h3 className="text-sm font-extrabold text-slate-900">Weekly Set Target Tracker</h3>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Zap className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="space-y-2.5 font-mono text-[10px]">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Chest Volume</span>
                  <span className="text-slate-500">14 / 20 sets</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[70%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Back Volume</span>
                  <span className="text-slate-500">16 / 20 sets</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[80%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Triceps (Junk Warning!)</span>
                  <span className="text-rose-500 font-bold">24 / 20 sets</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-mono">STATUS: EXCEEDED CAP</span>
            <button
              onClick={() => onTabChange("recovery")}
              className="text-blue-600 hover:underline font-bold"
            >
              Analyze Volume
            </button>
          </div>
        </div>

        {/* Bento Cell 5: Calorie & Macros Planner */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black">MACRO CALIBRATION</span>
                <h3 className="text-sm font-extrabold text-slate-900">Anabolic Diet Calibrator</h3>
              </div>
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Droplets className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
              <div>
                <label className="block text-[8px] font-mono text-slate-400 uppercase mb-0.5">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[8px] font-mono text-slate-400 uppercase mb-0.5">Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800"
                >
                  <option value="lean_bulk">Lean Bulk</option>
                  <option value="clean_bulk">Clean Bulk</option>
                  <option value="cut">Cut</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-mono">CALORIE CAP</span>
              <span className="text-base font-black text-slate-850">{macrosData.cal} kcal</span>
            </div>
            <button
              onClick={() => onTabChange("nutrition")}
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              Macros Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Tertiary Bento Row: AI Coach Chatbot & Academy lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Bento Cell 6: Chatbot console */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-[360px]">
          <div className="space-y-1 pb-3 border-b border-slate-100 flex-shrink-0">
            <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4" />
              AI COMPANION CONSOLE
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">Biomechanical Query Link</h3>
          </div>

          {/* Chat text logs */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 scrollbar-none text-[11px] font-medium leading-relaxed">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl max-w-[85%] ${
                  msg.sender === "coach"
                    ? "bg-slate-50 border border-slate-100 text-slate-700 mr-auto rounded-tl-none"
                    : "bg-blue-600 text-white ml-auto rounded-tr-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input prompt */}
          <form onSubmit={handleChatSubmit} className="flex gap-2 flex-shrink-0 border-t border-slate-100 pt-3">
            <input
              type="text"
              placeholder="Ask about incline press or lats wide..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white shadow-sm flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Bento Cell 7: Academy Slide reader */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-[360px]">
          <div className="space-y-4">
            <div className="space-y-1 pb-3 border-b border-slate-100">
              <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                SCI-FIT ACADEMY NEWS
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">Current Academy Syllabus</h3>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-bold text-slate-800">Mechanical Tension vs Fatigue</span>
                  <span className="block text-[8px] font-mono text-slate-400">Syllabus Block 1 • 6 min</span>
                </div>
                <span className="text-[8px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold uppercase">Active</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="space-y-0.5 opacity-60">
                  <span className="block text-[10px] font-bold text-slate-850">Progressive Overload Blueprint</span>
                  <span className="block text-[8px] font-mono text-slate-400">Syllabus Block 2 • 8 min</span>
                </div>
                <span className="text-[8px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase">Locked</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onTabChange("academy")}
            className="w-full py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50/50 text-[10px] font-bold text-blue-600 transition-colors flex items-center justify-center gap-1"
          >
            Launch Academy Desk <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
    </div>
  );
}
