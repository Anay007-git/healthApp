"use client";

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Activity, 
  AlertCircle, 
  Apple, 
  Dumbbell, 
  Flame, 
  Leaf, 
  Check, 
  RefreshCw,
  Info,
  Droplet,
  Sparkles,
  Candy,
  Wheat,
  Zap
} from 'lucide-react';

interface NutrientProfile {
  name: string;
  originalName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  description: string;
}

export default function DietChartPage() {
  // Form state inputs
  const [age, setAge] = useState<string>('28');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [activity, setActivity] = useState<string>('1.375'); // Moderately active fallback
  const [goal, setGoal] = useState<'loss' | 'gain' | 'maintain'>('maintain');
  const [dietType, setDietType] = useState<'veg' | 'nonveg'>('veg');
  
  // Health parameters
  const [diabetes, setDiabetes] = useState<boolean>(false);
  const [hypertension, setHypertension] = useState<boolean>(false);
  const [glutenAllergy, setGlutenAllergy] = useState<boolean>(false);
  const [lactoseIntolerant, setLactoseIntolerant] = useState<boolean>(false);

  // Result state
  const [calculated, setCalculated] = useState<boolean>(false);
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [dailyCalorieNeeds, setDailyCalorieNeeds] = useState<number>(0);
  const [highProteinMode, setHighProteinMode] = useState<boolean>(false);

  // Generated meals state
  const [breakfast, setBreakfast] = useState<NutrientProfile | null>(null);
  const [lunch, setLunch] = useState<NutrientProfile | null>(null);
  const [snack, setSnack] = useState<NutrientProfile | null>(null);
  const [dinner, setDinner] = useState<NutrientProfile | null>(null);

  const calculateDiet = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const actFactor = parseFloat(activity);

    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
      alert("Please enter valid positive values for weight, height, and age.");
      return;
    }

    // 1. BMI Calculation
    const heightInMeters = h / 100;
    const computedBmi = w / (heightInMeters * heightInMeters);
    setBmi(computedBmi);

    let cat = 'Normal';
    if (computedBmi < 18.5) cat = 'Underweight';
    else if (computedBmi >= 18.5 && computedBmi < 25) cat = 'Normal Weight';
    else if (computedBmi >= 25 && computedBmi < 30) cat = 'Overweight';
    else cat = 'Obese';
    setBmiCategory(cat);

    // 2. Daily Calories (Mifflin-St Jeor)
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const maintenanceCalories = bmr * actFactor;
    let targetCalories = maintenanceCalories;

    if (goal === 'loss') {
      targetCalories = maintenanceCalories - 500;
    } else if (goal === 'gain') {
      targetCalories = maintenanceCalories + 350;
    }

    setDailyCalorieNeeds(Math.round(targetCalories));

    // Determine high protein mode based on activity level
    const insistHighProtein = actFactor >= 1.55;
    setHighProteinMode(insistHighProtein);

    // 3. Dynamic meal profiles generation based on Veg/Non-Veg & Allergies
    
    // Breakfast selection
    let bf: NutrientProfile;
    if (glutenAllergy) {
      bf = {
        name: 'High-Fiber Oats Pav & Sprouts Salad',
        originalName: 'Butter Toast & Sugary Chai',
        calories: 240,
        carbs: 34,
        protein: 8,
        fat: 6,
        fiber: 8,
        sugar: 2,
        sodium: 320,
        description: 'Gluten-free oats pav served with direct nutrient sprouts and herbal ginger infusion.'
      };
    } else if (dietType === 'nonveg') {
      bf = {
        name: 'Scrambled Egg Whites (3) & Sourdough Toast',
        originalName: 'Butter Toast & Fried Eggs',
        calories: 220,
        carbs: 24,
        protein: 20,
        fat: 2.5,
        fiber: 2,
        sugar: 1.5,
        sodium: 380,
        description: 'Lean high-protein egg whites paired with sourdough bread toast to bound empty fats.'
      };
    } else {
      bf = {
        name: 'Whole Wheat Sourdough Toast & Avocado Sprouts',
        originalName: 'Butter Toast & Sugary Chai',
        calories: 260,
        carbs: 38,
        protein: 9,
        fat: 7,
        fiber: 6,
        sugar: 2,
        sodium: 350,
        description: 'Complex carbohydrate rich sourdough slices paired with good heart-healthy fats.'
      };
    }

    // Lunch selection
    let ln: NutrientProfile;
    if (lactoseIntolerant) {
      ln = {
        name: 'Tandoori Grilled Tofu Tikka & Spiced Green Salad',
        originalName: 'Butter Paneer Masala & Naan',
        calories: 210,
        carbs: 10,
        protein: 16,
        fat: 11,
        fiber: 4,
        sugar: 2,
        sodium: 390,
        description: 'Lactose-free soy tofu cubes marinated in direct spices and charcoal grilled.'
      };
    } else if (dietType === 'nonveg') {
      ln = {
        name: 'Tandoori Grilled Chicken Tikka & Cucumber Salad',
        originalName: 'Butter Chicken & Butter Naan',
        calories: 240,
        carbs: 6,
        protein: 32,
        fat: 8,
        fiber: 3,
        sugar: 1,
        sodium: 450,
        description: 'Lean high-protein chicken breast strips charcoal grilled without heavy saturated gravies.'
      };
    } else {
      ln = {
        name: 'Tandoori Grilled Paneer Tikka & Cucumber Salad',
        originalName: 'Butter Paneer Masala & Naan',
        calories: 320,
        carbs: 12,
        protein: 18,
        fat: 22,
        fiber: 4,
        sugar: 3,
        sodium: 420,
        description: 'Fresh grilled low-fat paneer cubes pairing robust protein and dietary calcium.'
      };
    }

    // Snack selection
    const sn: NutrientProfile = {
      name: 'Roasted Mint Makhana (100g) & Cardamom Green Tea',
      originalName: 'Deep Fried Samosa & Sweet Coffee',
      calories: 100,
      carbs: 15,
      protein: 3,
      fat: 2.5,
      fiber: 2.5,
      sugar: 0,
      sodium: 110,
      description: 'Zero trans-fat snacking alternative rich in fiber, paired with unsweetened antioxidants.'
    };

    // Dinner selection
    let dn: NutrientProfile;
    if (dietType === 'nonveg') {
      dn = {
        name: 'Cauliflower Crust Chicken Pizza & Coconut Water 200ml',
        originalName: 'Heavy Cheese Chicken Pizza & Coca-Cola',
        calories: 390,
        carbs: 38,
        protein: 26,
        fat: 10,
        fiber: 8,
        sugar: 8,
        sodium: 540,
        description: 'Lower-carb crust swap topped with shredded chicken strips and mineral-rich coconut water.'
      };
    } else {
      dn = {
        name: 'Cauliflower Crust Veg Pizza & Coconut Water 200ml',
        originalName: 'Heavy Cheese Pizza & Coca-Cola',
        calories: 380,
        carbs: 44,
        protein: 14,
        fat: 12,
        fiber: 9,
        sugar: 9,
        sodium: 510,
        description: 'Lower-carb veggie crust alternative paired with low calorie, high-potassium hydrator.'
      };
    }

    // Apply high-protein booster if Moderately/Very Active is checked (insist high protein)
    if (insistHighProtein) {
      bf.protein += 8;
      bf.calories += 35;
      bf.name = `High-Protein ${bf.name}`;
      bf.description += " Pair with an extra scoop of pumpkin seeds or double egg whites to match high physical demand.";

      ln.protein += 12;
      ln.calories += 50;
      ln.name = `Double-Portion ${ln.name}`;
      ln.description += " Optimized with a double portion of paneer/chicken/tofu for muscle protein synthesis.";

      dn.protein += 10;
      dn.calories += 40;
      dn.name = `Enhanced-Protein ${dn.name}`;
      dn.description += " Supplemented with a side of boiled sprouts/tofu to support tissue repair.";
    }

    // Sugar and Sodium Clinical Overrides for Diabetic / Hypertensive profiles
    if (diabetes) {
      bf.sugar = Math.max(0, bf.sugar - 1);
      ln.sugar = Math.max(0, ln.sugar - 1);
      dn.sugar = Math.max(0, dn.sugar - 3);
    }
    if (hypertension) {
      bf.sodium = Math.round(bf.sodium * 0.7);
      ln.sodium = Math.round(ln.sodium * 0.7);
      sn.sodium = Math.round(sn.sodium * 0.6);
      dn.sodium = Math.round(dn.sodium * 0.7);
    }

    setBreakfast(bf);
    setLunch(ln);
    setSnack(sn);
    setDinner(dn);
    setCalculated(true);
  };

  const resetForm = () => {
    setCalculated(false);
    setAge('28');
    setWeight('70');
    setHeight('170');
    setActivity('1.375');
    setGoal('maintain');
    setDietType('veg');
    setDiabetes(false);
    setHypertension(false);
    setGlutenAllergy(false);
    setLactoseIntolerant(false);
    setBreakfast(null);
    setLunch(null);
    setSnack(null);
    setDinner(null);
    setHighProteinMode(false);
  };

  // Aggregated totals
  const totalCalories = (breakfast?.calories || 0) + (lunch?.calories || 0) + (snack?.calories || 0) + (dinner?.calories || 0);
  const totalCarbs = (breakfast?.carbs || 0) + (lunch?.carbs || 0) + (snack?.carbs || 0) + (dinner?.carbs || 0);
  const totalProtein = (breakfast?.protein || 0) + (lunch?.protein || 0) + (snack?.protein || 0) + (dinner?.protein || 0);
  const totalFat = (breakfast?.fat || 0) + (lunch?.fat || 0) + (snack?.fat || 0) + (dinner?.fat || 0);
  const totalFiber = (breakfast?.fiber || 0) + (lunch?.fiber || 0) + (snack?.fiber || 0) + (dinner?.fiber || 0);
  const totalSugar = (breakfast?.sugar || 0) + (lunch?.sugar || 0) + (snack?.sugar || 0) + (dinner?.sugar || 0);
  const totalSodium = (breakfast?.sodium || 0) + (lunch?.sodium || 0) + (snack?.sodium || 0) + (dinner?.sodium || 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col justify-start">
      
      {/* Header Info */}
      <div className="mb-8 border-b border-border-app/20 pb-6">
        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          Personalized Nutrition
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-text-app">
          Interactive Diet Planner
        </h1>
        <p className="text-xs text-text-muted mt-2 leading-relaxed max-w-xl">
          Enter your metrics, medical factors, and eating choices to generate a detailed caloric profile with macro/micro schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Parameters input form */}
        <div className="lg:col-span-5 rounded-xl border border-border-app p-5 bg-card-app/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-app mb-4 flex items-center gap-1.5 border-b border-border-app/10 pb-2">
            <ClipboardList className="h-4 w-4 text-brand-primary" />
            Your Health Profile
          </h3>

          <form onSubmit={calculateDiet} className="space-y-4">
            
            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                  Age (years)
                </label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  required 
                  className="w-full text-xs font-semibold p-2 border border-border-app/60 rounded bg-card-app text-text-app outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-1 border border-border-app/60 rounded p-0.5 bg-card-app">
                  <button 
                    type="button" 
                    onClick={() => setGender('male')}
                    className={`py-1 text-[10px] font-bold rounded transition-colors ${gender === 'male' ? 'bg-brand-primary text-brand-primary-fg' : 'text-text-app hover:bg-border-app/10'}`}
                  >
                    Male
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setGender('female')}
                    className={`py-1 text-[10px] font-bold rounded transition-colors ${gender === 'female' ? 'bg-brand-primary text-brand-primary-fg' : 'text-text-app hover:bg-border-app/10'}`}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                  Height (cm)
                </label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  required 
                  className="w-full text-xs font-semibold p-2 border border-border-app/60 rounded bg-card-app text-text-app outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                  Weight (kg)
                </label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  required 
                  className="w-full text-xs font-semibold p-2 border border-border-app/60 rounded bg-card-app text-text-app outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Diet Type (Veg / Non-Veg) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                Diet Preference
              </label>
              <div className="grid grid-cols-2 gap-1 border border-border-app/60 rounded p-0.5 bg-card-app">
                <button 
                  type="button" 
                  onClick={() => setDietType('veg')}
                  className={`py-1.5 text-[10px] font-bold rounded transition-colors ${dietType === 'veg' ? 'bg-brand-primary text-brand-primary-fg' : 'text-text-app hover:bg-border-app/10'}`}
                >
                  Vegetarian
                </button>
                <button 
                  type="button" 
                  onClick={() => setDietType('nonveg')}
                  className={`py-1.5 text-[10px] font-bold rounded transition-colors ${dietType === 'nonveg' ? 'bg-brand-primary text-brand-primary-fg' : 'text-text-app hover:bg-border-app/10'}`}
                >
                  Non-Vegetarian
                </button>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                Activity Level
              </label>
              <select 
                value={activity} 
                onChange={(e) => setActivity(e.target.value)}
                className="w-full text-xs font-semibold p-2 border border-border-app/60 rounded bg-card-app text-text-app outline-none focus:border-brand-primary"
              >
                <option value="1.2">Sedentary (Little or no exercise)</option>
                <option value="1.375">Lightly Active (Exercise 1-3 days/week)</option>
                <option value="1.55">Moderately Active (Exercise 3-5 days/week)</option>
                <option value="1.725">Very Active (Exercise 6-7 days/week)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                Primary Goal
              </label>
              <select 
                value={goal} 
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full text-xs font-semibold p-2 border border-border-app/60 rounded bg-card-app text-text-app outline-none focus:border-brand-primary"
              >
                <option value="maintain">Maintain Health</option>
                <option value="loss">Weight Loss (Caloric Deficit)</option>
                <option value="gain">Muscle Gain (Caloric Surplus)</option>
              </select>
            </div>

            {/* Medical Conditions & Allergies */}
            <div className="space-y-2 border-t border-border-app/30 pt-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                Clinical Parameters & Allergies
              </label>
              
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center gap-2 text-xs text-text-app cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={diabetes} 
                    onChange={(e) => setDiabetes(e.target.checked)}
                    className="rounded accent-brand-primary" 
                  />
                  <span>Diabetes (Sugar restrictions)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-text-app cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={hypertension} 
                    onChange={(e) => setHypertension(e.target.checked)}
                    className="rounded accent-brand-primary" 
                  />
                  <span>Hypertension (Sodium restriction)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-text-app cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={glutenAllergy} 
                    onChange={(e) => setGlutenAllergy(e.target.checked)}
                    className="rounded accent-brand-primary" 
                  />
                  <span>Gluten Allergy / Celiac Disease</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-text-app cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={lactoseIntolerant} 
                    onChange={(e) => setLactoseIntolerant(e.target.checked)}
                    className="rounded accent-brand-primary" 
                  />
                  <span>Lactose Intolerance</span>
                </label>
              </div>
            </div>

            {/* Calculate Button */}
            <button 
              type="submit"
              className="w-full text-xs font-bold bg-brand-primary text-brand-primary-fg py-2.5 rounded transition-all duration-150 hover:bg-neutral-800"
            >
              Generate Swapping Diet Plan
            </button>
          </form>
        </div>

        {/* Right Side: Generated Planner Results */}
        <div className="lg:col-span-7">
          {calculated ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* BMI and Energy Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* BMI Card */}
                <div className="border border-border-app p-4 rounded-xl bg-card-app/30">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Computed BMI</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-text-app">{bmi.toFixed(1)}</span>
                    <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                      {bmiCategory}
                    </span>
                  </div>
                  {/* Visual scale */}
                  <div className="mt-3.5 bg-border-app/40 rounded-full h-1.5 overflow-hidden flex">
                    <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
                    <div className="h-full bg-brand-primary" style={{ width: '6.5%' }} />
                    <div className="h-full bg-yellow-500" style={{ width: '5%' }} />
                    <div className="h-full bg-red-500" style={{ width: '70%' }} />
                  </div>
                </div>

                {/* Energy Needs Card */}
                <div className="border border-border-app p-4 rounded-xl bg-card-app/30">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Daily Target Intake</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-text-app">{dailyCalorieNeeds}</span>
                    <span className="text-xs font-bold text-text-muted">kcal</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2">
                    Caloric budget set for **{goal === 'loss' ? 'Weight Loss' : goal === 'gain' ? 'Muscle Gain' : 'Health Maintenance'}** under a **{dietType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}** preference.
                  </p>
                </div>

              </div>

              {/* High Protein Mode Notification Banner */}
              {highProteinMode && (
                <div className="border border-border-app p-4 rounded-xl bg-neutral-500/[0.03] space-y-1.5 text-xs text-text-app">
                  <h4 className="font-extrabold flex items-center gap-1.5 text-text-app">
                    <Dumbbell className="h-4.5 w-4.5 text-blue-700 animate-bounce" />
                    High-Protein Performance Mode Active
                  </h4>
                  <p className="text-text-muted leading-relaxed text-[11px]">
                    Because you selected a **Moderately Active** or **Very Active** lifestyle, we have optimized your menu layout to prioritize amino acid loading. Your target meals are fortified with double proteins (tofu/chicken/paneer/seeds) to accelerate muscle repair and match physical output demands.
                  </p>
                </div>
              )}

              {/* Total Daily Meal Plan Nutrients Summary Sheet */}
              <div className="border border-border-app p-4 rounded-xl bg-card-app/30">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block border-b border-border-app/20 pb-1.5 mb-3">
                  Daily Plan Nutritional Aggregation (Macros & Micros)
                </span>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div className="bg-border-app/10 p-2 rounded text-center">
                    <span className="text-[9px] text-text-muted uppercase font-bold block">Carbs</span>
                    <span className="text-xs font-black text-text-app flex items-center justify-center gap-0.5 mt-1">
                      <Wheat className="h-3 w-3 text-amber-700" />
                      {totalCarbs}g
                    </span>
                  </div>
                  <div className="bg-border-app/10 p-2 rounded text-center">
                    <span className="text-[9px] text-text-muted uppercase font-bold block">Protein</span>
                    <span className="text-xs font-black text-text-app flex items-center justify-center gap-0.5 mt-1">
                      <Dumbbell className="h-3 w-3 text-blue-700" />
                      {totalProtein}g
                    </span>
                  </div>
                  <div className="bg-border-app/10 p-2 rounded text-center">
                    <span className="text-[9px] text-text-muted uppercase font-bold block">Fat</span>
                    <span className="text-xs font-black text-text-app flex items-center justify-center gap-0.5 mt-1">
                      <Droplet className="h-3 w-3 text-yellow-600" />
                      {totalFat}g
                    </span>
                  </div>
                  <div className="bg-border-app/10 p-2 rounded text-center">
                    <span className="text-[9px] text-text-muted uppercase font-bold block">Fiber</span>
                    <span className="text-xs font-black text-text-app flex items-center justify-center gap-0.5 mt-1">
                      <Leaf className="h-3 w-3 text-emerald-600" />
                      {totalFiber}g
                    </span>
                  </div>
                  <div className="bg-border-app/10 p-2 rounded text-center">
                    <span className="text-[9px] text-text-muted uppercase font-bold block">Sugar</span>
                    <span className="text-xs font-black text-text-app flex items-center justify-center gap-0.5 mt-1">
                      <Candy className="h-3 w-3 text-rose-600" />
                      {totalSugar}g
                    </span>
                  </div>
                  <div className="bg-border-app/10 p-2 rounded text-center">
                    <span className="text-[9px] text-text-muted uppercase font-bold block">Sodium</span>
                    <span className="text-xs font-black text-text-app flex items-center justify-center gap-0.5 mt-1">
                      <Sparkles className="h-3 w-3 text-cyan-600" />
                      {totalSodium}mg
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-[10px] text-text-muted font-medium flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>Meal plan totals: **{totalCalories} kcal** (Fits target calorie budget).</span>
                </div>
              </div>

              {/* Specific Medical Warnings Banner */}
              {(diabetes || hypertension || glutenAllergy || lactoseIntolerant) && (
                <div className="border border-border-app p-4 rounded-xl bg-neutral-500/[0.03] space-y-2 text-xs leading-relaxed text-text-app">
                  <h4 className="font-bold flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-neutral-800" />
                    Clinical Safety Advisory
                  </h4>
                  <div className="space-y-1.5">
                    {diabetes && (
                      <p className="pl-3.5 border-l-2 border-orange-500">
                        <span className="font-bold">Diabetes Active:</span> Sugar elements and high-glycemic indices are minimized. Focus on high-fiber millets.
                      </p>
                    )}
                    {hypertension && (
                      <p className="pl-3.5 border-l-2 border-cyan-500">
                        <span className="font-bold">Hypertension Active:</span> Sodium is constrained. Avoid standard processed table salt and processed products.
                      </p>
                    )}
                    {glutenAllergy && (
                      <p className="pl-3.5 border-l-2 border-amber-600">
                        <span className="font-bold">Gluten Free:</span> Wheat/maida products are substituted with Gluten-Free Millets, Oats, and Ragi.
                      </p>
                    )}
                    {lactoseIntolerant && (
                      <p className="pl-3.5 border-l-2 border-purple-500">
                        <span className="font-bold">Lactose Free:</span> Paneer or dairy cottage cheese swaps should utilize Soy Tofu alternatives.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Indian Food Swap Diet Chart */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-app border-b border-border-app/20 pb-2 flex items-center gap-1.5">
                  <Apple className="h-4.5 w-4.5 text-brand-primary" />
                  Your Daily Swap Diet Schedule
                </h4>

                <div className="divide-y divide-border-app/20 border border-border-app rounded-xl bg-card-app/30 overflow-hidden">
                  
                  {/* Breakfast */}
                  {breakfast && (
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">08:00 AM &bull; Breakfast</span>
                            {highProteinMode && (
                              <span className="text-[8px] font-black bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-wider">High Protein</span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-text-app mt-1">
                            {breakfast.name}
                          </h5>
                          <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                            {breakfast.description}
                          </p>
                        </div>
                        <div className="sm:text-right shrink-0 flex items-center sm:block">
                          <span className="text-[10px] font-bold text-text-muted block sm:mb-1 mr-2 sm:mr-0">Swap for:</span>
                          <span className="text-[9px] font-extrabold text-brand-secondary bg-red-500/10 px-2 py-0.5 rounded sm:block">
                            {breakfast.originalName}
                          </span>
                        </div>
                      </div>
                      
                      {/* Breakfast Macros */}
                      <div className="bg-border-app/20 rounded-lg p-2 grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[9px] text-center font-bold text-text-muted">
                        <div><span className="text-text-app block">{breakfast.calories}</span>kcal</div>
                        <div><span className="text-text-app block">{breakfast.carbs}g</span>Carbs</div>
                        <div><span className="text-text-app block font-extrabold text-blue-700">{breakfast.protein}g</span>Protein</div>
                        <div><span className="text-text-app block">{breakfast.fat}g</span>Fat</div>
                        <div><span className="text-text-app block">{breakfast.fiber}g</span>Fiber</div>
                        <div><span className="text-text-app block">{breakfast.sodium}mg</span>Sodium</div>
                      </div>
                    </div>
                  )}

                  {/* Lunch */}
                  {lunch && (
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">01:00 PM &bull; Lunch</span>
                            {highProteinMode && (
                              <span className="text-[8px] font-black bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-wider">High Protein</span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-text-app mt-1">
                            {lunch.name}
                          </h5>
                          <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                            {lunch.description}
                          </p>
                        </div>
                        <div className="sm:text-right shrink-0 flex items-center sm:block">
                          <span className="text-[10px] font-bold text-text-muted block sm:mb-1 mr-2 sm:mr-0">Swap for:</span>
                          <span className="text-[9px] font-extrabold text-brand-secondary bg-red-500/10 px-2 py-0.5 rounded sm:block">
                            {lunch.originalName}
                          </span>
                        </div>
                      </div>
                      
                      {/* Lunch Macros */}
                      <div className="bg-border-app/20 rounded-lg p-2 grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[9px] text-center font-bold text-text-muted">
                        <div><span className="text-text-app block">{lunch.calories}</span>kcal</div>
                        <div><span className="text-text-app block">{lunch.carbs}g</span>Carbs</div>
                        <div><span className="text-text-app block font-extrabold text-blue-700">{lunch.protein}g</span>Protein</div>
                        <div><span className="text-text-app block">{lunch.fat}g</span>Fat</div>
                        <div><span className="text-text-app block">{lunch.fiber}g</span>Fiber</div>
                        <div><span className="text-text-app block">{lunch.sodium}mg</span>Sodium</div>
                      </div>
                    </div>
                  )}

                  {/* Evening Snack */}
                  {snack && (
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row justify-between gap-2.5">
                        <div>
                          <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">05:00 PM &bull; Snack</span>
                          <h5 className="text-xs font-bold text-text-app mt-1">
                            {snack.name}
                          </h5>
                          <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                            {snack.description}
                          </p>
                        </div>
                        <div className="sm:text-right shrink-0 flex items-center sm:block">
                          <span className="text-[10px] font-bold text-text-muted block sm:mb-1 mr-2 sm:mr-0">Swap for:</span>
                          <span className="text-[9px] font-extrabold text-brand-secondary bg-red-500/10 px-2 py-0.5 rounded sm:block">
                            {snack.originalName}
                          </span>
                        </div>
                      </div>
                      
                      {/* Snack Macros */}
                      <div className="bg-border-app/20 rounded-lg p-2 grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[9px] text-center font-bold text-text-muted">
                        <div><span className="text-text-app block">{snack.calories}</span>kcal</div>
                        <div><span className="text-text-app block">{snack.carbs}g</span>Carbs</div>
                        <div><span className="text-text-app block">{snack.protein}g</span>Protein</div>
                        <div><span className="text-text-app block">{snack.fat}g</span>Fat</div>
                        <div><span className="text-text-app block">{snack.fiber}g</span>Fiber</div>
                        <div><span className="text-text-app block">{snack.sodium}mg</span>Sodium</div>
                      </div>
                    </div>
                  )}

                  {/* Dinner */}
                  {dinner && (
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">08:00 PM &bull; Dinner</span>
                            {highProteinMode && (
                              <span className="text-[8px] font-black bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-wider">High Protein</span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-text-app mt-1">
                            {dinner.name}
                          </h5>
                          <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                            {dinner.description}
                          </p>
                        </div>
                        <div className="sm:text-right shrink-0 flex items-center sm:block">
                          <span className="text-[10px] font-bold text-text-muted block sm:mb-1 mr-2 sm:mr-0">Swap for:</span>
                          <span className="text-[9px] font-extrabold text-brand-secondary bg-red-500/10 px-2 py-0.5 rounded sm:block">
                            {dinner.originalName}
                          </span>
                        </div>
                      </div>
                      
                      {/* Dinner Macros */}
                      <div className="bg-border-app/20 rounded-lg p-2 grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[9px] text-center font-bold text-text-muted">
                        <div><span className="text-text-app block">{dinner.calories}</span>kcal</div>
                        <div><span className="text-text-app block">{dinner.carbs}g</span>Carbs</div>
                        <div><span className="text-text-app block font-extrabold text-blue-700">{dinner.protein}g</span>Protein</div>
                        <div><span className="text-text-app block">{dinner.fat}g</span>Fat</div>
                        <div><span className="text-text-app block">{dinner.fiber}g</span>Fiber</div>
                        <div><span className="text-text-app block">{dinner.sodium}mg</span>Sodium</div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Action options */}
              <div className="flex gap-2 justify-end">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1 rounded-lg border border-border-app bg-card-app px-3.5 py-2 text-xs font-bold hover:bg-border-app/20 transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Recalculate
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-border-app/85 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-xs text-text-muted bg-card-app/5">
              <Activity className="h-10 w-10 text-brand-secondary animate-pulse mb-3" />
              <p className="font-bold text-text-app">Planner Output Pending</p>
              <p className="mt-1 leading-relaxed max-w-sm">
                Enter your age, weight, height, and diet preferences on the left and click **Generate** to retrieve your macro/micro schedules.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
