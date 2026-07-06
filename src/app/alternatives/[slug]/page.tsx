import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Flame, 
  Heart, 
  Info, 
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wheat,
  Candy,
  Droplet,
  Dumbbell,
  Leaf,
  Shield,
  Milk,
  Zap,
  Sparkles
} from 'lucide-react';

import { getJunkItemBySlug, getAlternativesForJunkItem } from '@/lib/db';
import NearbyLivePanel from '@/components/NearbyLivePanel';
import { getDynamicSwap } from '@/lib/dynamicSwaps';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function AlternativePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let junkItem = await getJunkItemBySlug(slug);
  let alternatives: any[] = [];
  let similarityReason = '';

  if (junkItem) {
    alternatives = await getAlternativesForJunkItem(junkItem.id);
  } else {
    // If not in database, attempt to classify and construct a dynamic swap on the fly!
    const dynamicData = getDynamicSwap(slug);
    if (dynamicData) {
      junkItem = dynamicData.junkItem;
      alternatives = [dynamicData.alternative];
      similarityReason = dynamicData.similarityReason;
    }
  }

  if (!junkItem) {
    notFound();
  }

  const getDiffPercent = (junkVal: number, altVal: number) => {
    if (junkVal === 0) return altVal > 0 ? `+${(altVal * 100).toFixed(0)}%` : '0%';
    const pct = ((altVal - junkVal) / junkVal) * 100;
    const sign = pct > 0 ? '+' : '';
    return `${sign}${pct.toFixed(0)}%`;
  };

  const hasAlt = alternatives.length > 0;
  const primaryAlt = alternatives[0];

  // Detailed Macro & Micro Nutrients Comparison Matrix with specific high contrast colorful icons
  const comparisonMetrics = hasAlt ? [
    { label: 'Calories', junkVal: junkItem.calories, altVal: primaryAlt.calories, max: 600, unit: ' kcal', type: 'lower', icon: <Flame className="h-4 w-4 shrink-0 text-orange-600 fill-orange-100" /> },
    { label: 'Carbohydrates', junkVal: junkItem.carbs ?? 0, altVal: primaryAlt.carbs ?? 0, max: 100, unit: 'g', type: 'lower', icon: <Wheat className="h-4 w-4 shrink-0 text-amber-700" /> },
    { label: 'Sugar', junkVal: junkItem.sugar, altVal: primaryAlt.sugar, max: 60, unit: 'g', type: 'lower', icon: <Candy className="h-4 w-4 shrink-0 text-rose-600 fill-rose-100" /> },
    { label: 'Total Fat', junkVal: junkItem.fat, altVal: primaryAlt.fat, max: 45, unit: 'g', type: 'lower', icon: <Droplet className="h-4 w-4 shrink-0 text-yellow-600 fill-yellow-100" /> },
    { label: 'Protein', junkVal: junkItem.protein ?? 0, altVal: primaryAlt.protein, max: 35, unit: 'g', type: 'higher', icon: <Dumbbell className="h-4 w-4 shrink-0 text-blue-700" /> },
    { label: 'Fiber', junkVal: junkItem.fiber ?? 0, altVal: primaryAlt.fiber, max: 15, unit: 'g', type: 'higher', icon: <Leaf className="h-4 w-4 shrink-0 text-emerald-600 fill-emerald-100" /> },
    { label: 'Sodium', junkVal: junkItem.sodium, altVal: primaryAlt.sodium, max: 1200, unit: 'mg', type: 'lower', icon: <Sparkles className="h-4 w-4 shrink-0 text-cyan-600" /> },
    { label: 'Iron (Fe)', junkVal: junkItem.iron ?? 0, altVal: primaryAlt.iron ?? 0, max: 10, unit: 'mg', type: 'higher', icon: <Shield className="h-4 w-4 shrink-0 text-red-700 fill-red-100" /> },
    { label: 'Calcium (Ca)', junkVal: junkItem.calcium ?? 0, altVal: primaryAlt.calcium ?? 0, max: 400, unit: 'mg', type: 'higher', icon: <Milk className="h-4 w-4 shrink-0 text-indigo-600" /> },
    { label: 'Potassium (K)', junkVal: junkItem.potassium ?? 0, altVal: primaryAlt.potassium ?? 0, max: 600, unit: 'mg', type: 'higher', icon: <Zap className="h-4 w-4 shrink-0 text-violet-600 fill-violet-100" /> }
  ] : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 flex-grow flex flex-col justify-start">
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-black" />
          Back to cravings
        </Link>
      </div>

      {/* Header Title */}
      <div className="mb-8 border-b border-border-app/20 pb-6">
        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          Nutrition Swap
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-text-app">
          {junkItem.name} &rarr; <span className="text-brand-primary">{primaryAlt.name}</span>
        </h1>
        <p className="text-xs text-text-muted mt-2 leading-relaxed max-w-2xl">
          {primaryAlt?.description || 'A healthier alternative item crafted to swap processed fats and refined carbs with fiber-rich ingredients.'}
        </p>
      </div>

      {/* Primary Swap Content Layout */}
      <div className="space-y-8">
        
        {/* Why it works banner */}
        <div className="rounded-xl border border-border-app/30 bg-emerald-500/[0.04] p-4 flex gap-3 items-start">
          <ShieldCheck className="h-5 w-5 text-emerald-600 fill-emerald-100 shrink-0 mt-0.5" />
          <div className="text-xs text-text-app leading-relaxed">
            <span className="font-bold text-emerald-800">Why swap?</span> {similarityReason || alternatives.map(alt => alt.similarity_reason).join(' ')}
          </div>
        </div>

        {/* Nutritional Comparison Table */}
        {hasAlt && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-app flex items-center gap-1.5">
              <Info className="h-4 w-4 text-blue-600 fill-blue-50" />
              Nutritional Comparison (per 100g)
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-border-app/60 bg-card-app/30">
              <table className="min-w-full divide-y divide-border-app/20 text-xs text-left">
                <thead>
                  <tr className="bg-border-app/10 font-bold text-text-app border-b border-border-app/20">
                    <th className="px-2.5 py-3 sm:px-4 font-semibold">Nutrient</th>
                    <th className="px-2.5 py-3 sm:px-4 font-semibold text-text-muted">
                      <span className="hidden sm:inline">{junkItem.name}</span>
                      <span className="sm:hidden">Craving</span>
                    </th>
                    <th className="px-2.5 py-3 sm:px-4 font-semibold text-brand-primary">
                      <span className="hidden sm:inline">{primaryAlt.name}</span>
                      <span className="sm:hidden">Swap</span>
                    </th>
                    <th className="px-2.5 py-3 sm:px-4 font-semibold text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-app/20 font-medium">
                  {comparisonMetrics.map((metric) => {
                    const isImprovement = metric.type === 'lower' 
                      ? metric.altVal < metric.junkVal 
                      : metric.altVal > metric.junkVal;

                    const percentDiff = getDiffPercent(metric.junkVal, metric.altVal);

                    return (
                      <tr key={metric.label} className="hover:bg-border-app/10 transition-colors">
                        <td className="px-2.5 py-2 sm:px-4 sm:py-2.5 text-text-app font-bold flex items-center gap-1.5">
                          {metric.icon}
                          <span>{metric.label}</span>
                        </td>
                        <td className="px-2.5 py-2 sm:px-4 sm:py-2.5 text-text-muted">{metric.junkVal}{metric.unit}</td>
                        <td className="px-2.5 py-2 sm:px-4 sm:py-2.5 text-text-app">{metric.altVal}{metric.unit}</td>
                        <td className="px-2.5 py-2 sm:px-4 sm:py-2.5 text-right">
                          <span className={`inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-extrabold ${isImprovement ? 'text-brand-primary bg-emerald-500/10 px-1.5 py-0.5 rounded' : 'text-brand-secondary bg-red-500/10 px-1.5 py-0.5 rounded'}`}>
                            {metric.type === 'lower' ? (
                              isImprovement ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />
                            ) : (
                              isImprovement ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                            )}
                            {percentDiff.replace('+', '')} {metric.type === 'lower' ? (isImprovement ? 'less' : 'more') : (isImprovement ? 'boost' : 'less')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Near Location Live Suggestions Section */}
        {hasAlt && (
          <NearbyLivePanel 
            alternativeName={primaryAlt.name} 
            alternativeCategory={primaryAlt.category} 
            alternativeSlug={primaryAlt.slug}
          />
        )}

      </div>

    </div>
  );
}
