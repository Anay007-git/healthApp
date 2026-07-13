"use client";

import React, { useState } from "react";
import {
  Sliders,
  Clock,
  Sparkles,
  Droplets
} from "lucide-react";

export default function NutritionPlanner() {
  const [weight, setWeight] = useState("78");
  const [goal, setGoal] = useState("lean_bulk"); // lean_bulk, clean_bulk, maintenance, cut, fat_loss
  const [activity, setActivity] = useState("moderate"); // sedentary, moderate, active

  // Macro calculation logic
  const calculateMacros = () => {
    const wt = parseFloat(weight) || 75;
    
    // Step 1: Base Maintenance Calories (simplified Harris-Benedict)
    let maintenance = wt * 22;
    if (activity === "sedentary") maintenance *= 1.2;
    else if (activity === "moderate") maintenance *= 1.4;
    else maintenance *= 1.6;

    let targetCalories = maintenance;
    let proteinPerKg = 2.0;

    // Step 2: Goal Adjustment
    if (goal === "lean_bulk") {
      targetCalories += 250; // Moderate surplus
      proteinPerKg = 2.0;
    } else if (goal === "clean_bulk") {
      targetCalories += 450; // Heavy surplus
      proteinPerKg = 2.2;
    } else if (goal === "cut") {
      targetCalories -= 400; // Moderate deficit
      proteinPerKg = 2.4; // Higher protein to preserve LBM
    } else if (goal === "fat_loss") {
      targetCalories -= 600; // Large deficit
      proteinPerKg = 2.6; // Even higher protein
    }

    targetCalories = Math.round(targetCalories);

    // Step 3: Macros calculations
    // Protein: 4 kcal/g
    const protein = Math.round(wt * proteinPerKg);
    const proteinKcal = protein * 4;

    // Fat: 9 kcal/g (target 25% of total calories)
    const fat = Math.round((targetCalories * 0.25) / 9);
    const fatKcal = fat * 9;

    // Carbs: 4 kcal/g (remaining calories)
    const carbs = Math.round((targetCalories - proteinKcal - fatKcal) / 4);

    // Water: 35ml per kg + 1L for training
    const water = ((wt * 35) / 1000 + 1).toFixed(1);

    return { calories: targetCalories, protein, carbs, fat, water };
  };

  const macros = calculateMacros();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Inputs Column */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            CALORIE & MACRO CALCULATOR
          </span>
          <h3 className="text-lg font-black text-white">Anabolic Calibration</h3>
        </div>

        <div className="space-y-4 text-xs font-semibold text-slate-300">
          {/* Weight */}
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">WEIGHT (KG)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Goal selection */}
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">DIETARY GOAL</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="lean_bulk">Lean Bulk (+250 kcal surplus)</option>
              <option value="clean_bulk">Clean Bulk (+450 kcal surplus)</option>
              <option value="maintenance">Maintenance (Energy Balance)</option>
              <option value="cut">Moderate Cut (-400 kcal deficit)</option>
              <option value="fat_loss">Aggressive Recomp (-600 kcal deficit)</option>
            </select>
          </div>

          {/* Activity */}
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1.5">TRAINING ACTIVITY</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-[#0e1626] border border-slate-800 text-white rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="sedentary">Sedentary (1-2 workouts/wk)</option>
              <option value="moderate">Moderate (3-4 workouts/wk)</option>
              <option value="active">Active (5+ workouts/wk)</option>
            </select>
          </div>
        </div>

        {/* Calculated outputs list */}
        <div className="pt-4 border-t border-slate-800/60 space-y-3 font-mono">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest block">TARGET DAILY CALORIES</span>
            <span className="text-3xl font-black text-white">{macros.calories} kcal</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[8px] text-slate-500 font-bold">PROTEIN</span>
              <span className="font-bold text-white text-sm">{macros.protein}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[8px] text-slate-500 font-bold">CARBS</span>
              <span className="font-bold text-white text-sm">{macros.carbs}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[8px] text-slate-500 font-bold">FATS</span>
              <span className="font-bold text-white text-sm">{macros.fat}g</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4.5 w-4.5 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-bold">TARGET WATER</span>
            </div>
            <span className="text-xs font-black text-white">{macros.water} Liters</span>
          </div>
        </div>
      </div>

      {/* Timing and Supplement Guides Column */}
      <div className="lg:col-span-8 space-y-6">
        {/* Nutrient timing */}
        <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Nutrient Timing Strategies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
            {/* Pre */}
            <div className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-850 space-y-1.5">
              <span className="text-[9px] font-mono text-blue-400 font-black uppercase block">Pre-Workout (2-3 hrs)</span>
              <span className="font-bold text-white block">Starch Carbs + Protein</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Consume 40g slow carbs (e.g. oats, rice) and 30g protein. This creates circulating amino acids and maximizes glycogen fullness for energy.
              </p>
            </div>

            {/* Intra */}
            <div className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-850 space-y-1.5">
              <span className="text-[9px] font-mono text-blue-400 font-black uppercase block">Intra-Workout</span>
              <span className="font-bold text-white block">Hydration + EAA / Fast Carbs</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Focus on sipping water with electrolytes. If training exceeds 75+ mins, add 20g fast-acting carbs to maintain blood glucose and reduce muscle breakdown.
              </p>
            </div>

            {/* Post */}
            <div className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-850 space-y-1.5">
              <span className="text-[9px] font-mono text-blue-400 font-black uppercase block">Post-Workout (0-2 hrs)</span>
              <span className="font-bold text-white block">Rapid Protein + Glycogen</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Consume 35-40g high-quality whey or isolate along with 50-60g fast carbs. This spikes Muscle Protein Synthesis (MPS) and prompts rapid glycogen restoration.
              </p>
            </div>
          </div>
        </div>

        {/* Supplementation */}
        <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Hypertrophy-Specific Supplement Guide
          </h3>

          <div className="space-y-3">
            {/* Supplement 1 */}
            <div className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 md:max-w-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Creatine Monohydrate</span>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold">ESSENTIAL</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Increases cellular phosphocreatine stores, which aids rapid ATP restoration during heavy sets of squats or presses. Also draws water inside the muscle cells (intracellular hydration) causing a direct hypertrophic swelling stimulus.
                </p>
              </div>
              <div className="text-right font-mono flex-shrink-0">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">DOSAGE</span>
                <span className="text-xs font-bold text-blue-400">5g Daily (Anytime)</span>
              </div>
            </div>

            {/* Supplement 2 */}
            <div className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 md:max-w-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Caffeine Anhydrous</span>
                  <span className="text-[8px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase font-bold">PRE-WORKOUT</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Reduces Rate of Perceived Exertion (RPE) and increases motor unit recruitment. Amplifies peak force output, letting you hit more reps under high mechanical tension.
                </p>
              </div>
              <div className="text-right font-mono flex-shrink-0">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">DOSAGE</span>
                <span className="text-xs font-bold text-blue-400">3-6 mg/kg (30-60 min pre)</span>
              </div>
            </div>

            {/* Supplement 3 */}
            <div className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 md:max-w-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Beta-Alanine</span>
                  <span className="text-[8px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded uppercase font-bold">PERFORMANCE</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Acts as a lactic acid buffer by increasing muscle carnosine levels. Best suited for high-rep sets (12+ reps) where metabolic stress and burning limit performance.
                </p>
              </div>
              <div className="text-right font-mono flex-shrink-0">
                <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black mb-0.5">DOSAGE</span>
                <span className="text-xs font-bold text-blue-400">3.2g Daily (Beta-tingle)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
