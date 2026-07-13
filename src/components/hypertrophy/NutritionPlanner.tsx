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

    return {
      maintenance: Math.round(maintenance),
      targetCalories,
      protein,
      carbs,
      fat,
      water
    };
  };

  const macros = calculateMacros();

  // Percentage calculations for bars
  const totalKcal = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  const pPct = ((macros.protein * 4) / totalKcal) * 100;
  const cPct = ((macros.carbs * 4) / totalKcal) * 100;
  const fPct = ((macros.fat * 9) / totalKcal) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Nutrition input selectors */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            NUTRITIONAL CONTROLLER
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">Macros Calibrator</h3>
        </div>

        <div className="space-y-4 text-xs font-semibold text-slate-655">
          {/* Weight */}
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1.5">CURRENT BODYWEIGHT (KG)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none"
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1.5">TRAINING OBJECTIVE</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl px-3.5 py-2 focus:outline-none"
            >
              <option value="lean_bulk">Lean Bulk (+250 kcal)</option>
              <option value="clean_bulk">Clean Bulk (+450 kcal)</option>
              <option value="cut">Fat Cut (-400 kcal)</option>
              <option value="fat_loss">Aggressive Deficit (-600 kcal)</option>
            </select>
          </div>

          {/* Activity */}
          <div>
            <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1.5">DAILY ENERGY EXPENDITURE</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-850 rounded-xl px-3.5 py-2 focus:outline-none"
            >
              <option value="sedentary">Sedentary (Desk work / No training)</option>
              <option value="moderate">Moderately Active (Train 3-4x / wk)</option>
              <option value="active">Very Active (Train 5-6x / wk)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[9px] text-slate-400 font-mono">FORMULA: HARRIS_BENEDICT</span>
          <span className="text-[10px] text-blue-600 font-bold">ONLINE</span>
        </div>
      </div>

      {/* Target calories & macros display */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              NUTRITION SYNTHESIS SUMMARY
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">Anabolic Calorie Budget</h3>
          </div>

          <div className="text-right">
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">Target Energy</span>
            <span className="text-3xl font-black text-slate-850">{macros.targetCalories} kcal</span>
          </div>
        </div>

        {/* Macros split progress bars */}
        <div className="space-y-4">
          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">MACRONUTRIENT DISTRIBUTION</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Protein */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Protein</span>
                <span className="font-mono text-slate-500">{macros.protein}g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${pPct}%` }} />
              </div>
              <span className="text-[9px] text-slate-450 block font-mono">Preserves & builds muscle tissue ({Math.round(pPct)}% kcal)</span>
            </div>

            {/* Carbs */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Carbs</span>
                <span className="font-mono text-slate-500">{macros.carbs}g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${cPct}%` }} />
              </div>
              <span className="text-[9px] text-slate-450 block font-mono">Energizes anaerobic pathways ({Math.round(cPct)}% kcal)</span>
            </div>

            {/* Fat */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Fat</span>
                <span className="font-mono text-slate-500">{macros.fat}g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: `${fPct}%` }} />
              </div>
              <span className="text-[9px] text-slate-450 block font-mono">Regulates hormone production ({Math.round(fPct)}% kcal)</span>
            </div>
          </div>
        </div>

        {/* Fluid hydration alert */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-105 flex gap-3 items-center">
          <Droplets className="h-5 w-5 text-blue-650 flex-shrink-0" />
          <div className="space-y-0.5 text-xs text-slate-700">
            <span className="block text-[9px] font-mono text-blue-650 uppercase tracking-widest font-black">HYDRATION PROTOCOL</span>
            <span>Consume <span className="font-bold text-blue-650">{macros.water} Liters</span> of filtered water daily to maintain cellular swelling/hydration.</span>
          </div>
        </div>

        {/* Micronutrients / Supplements recommendations */}
        <div className="space-y-3.5 border-t border-slate-100 pt-4">
          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">RECOMMENDED SUPPLEMENT DOSAGES</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
              <Clock className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">Creatine Monohydrate</span>
                <span className="block font-bold">5g Daily (Anytime)</span>
                <p className="text-[10px] text-slate-500 font-medium">Saturates intramuscular phosphocreatine pools. Boosts power & cellular swelling.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
              <Clock className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">Caffeine Anhydrous</span>
                <span className="block font-bold">150-300mg (30-45m Pre-Workout)</span>
                <p className="text-[10px] text-slate-500 font-medium">Antagonizes adenosine receptors. Decreases Rate of Perceived Exertion (RPE).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
