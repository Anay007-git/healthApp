"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Flame, 
  Sparkles, 
  X, 
  ChevronRight, 
  Coffee, 
  GlassWater, 
  Pizza, 
  Cookie, 
  IceCream,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { JunkItem } from '@/lib/mockData';

interface SearchDashboardProps {
  initialJunkItems: JunkItem[];
}

const CATEGORIES = [
  { id: 'all', name: 'All Cravings', icon: Sparkles },
  { id: 'snacks', name: 'Snacks', icon: Cookie },
  { id: 'fastfood', name: 'Fast Food', icon: Pizza },
  { id: 'drinks', name: 'Drinks', icon: GlassWater },
  { id: 'desserts', name: 'Desserts', icon: IceCream },
  { id: 'breakfast', name: 'Breakfast', icon: Coffee },
];

export default function SearchDashboard({ initialJunkItems }: SearchDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter items in real time based on search query and category
  const filteredItems = useMemo(() => {
    return initialJunkItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialJunkItems, searchQuery, selectedCategory]);

  // Autocomplete suggestions (up to 5 items)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return initialJunkItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [initialJunkItems, searchQuery]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex-grow flex flex-col justify-start w-full max-w-full overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 mb-4 animate-fade-in">
          <Flame className="h-3.5 w-3.5 text-orange-600 fill-orange-200" />
          <span>Track and swap high-calorie cravings</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-text-app via-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          What are you craving today?
        </h1>
        <p className="mt-4 text-sm sm:text-base text-text-muted">
          Find healthier, low-fat, sugar-free, or fiber-rich alternatives to your favorite Indian comfort food and snacks instantly.
        </p>
      </div>

      {/* Search Bar & Auto-suggestions */}
      <div className="relative max-w-lg mx-auto w-full mb-10 z-30">
        <div className="flex items-center rounded-2xl border border-border-app bg-card-app px-4 py-3.5 shadow-lg focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-all duration-300">
          <Search className="h-5 w-5 text-text-muted mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type 'samosa', 'maggi', 'coke'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-text-app outline-none placeholder:text-text-muted font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-text-muted hover:text-text-app p-0.5 rounded-full hover:bg-border-app/40 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Suggestion list */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border-app bg-card-app p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {suggestions.map((item) => (
              <Link
                key={item.id}
                href={`/alternatives/${item.slug}`}
                className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-border-app/40 transition-all duration-150 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                    <Flame className="h-4 w-4 text-rose-500 fill-rose-100" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-app group-hover:text-brand-primary transition-colors">
                      {item.name}
                    </span>
                    <span className="ml-2.5 text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Swap Now
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Category Selection Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Filter Cravings
          </h2>
          {selectedCategory !== 'all' && (
            <button 
              onClick={() => setSelectedCategory('all')} 
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full py-2 px-4 text-xs font-bold border shrink-0 transition-all duration-200 active:scale-95 ${
                  active 
                    ? 'bg-brand-primary text-brand-primary-fg border-brand-primary shadow-md shadow-brand-primary/15'
                    : 'bg-card-app border-border-app text-text-app hover:bg-border-app/20'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'animate-bounce' : 'opacity-70'}`} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Browse Grid */}
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-app">
            {selectedCategory === 'all' 
              ? 'Popular Comfort Foods' 
              : `${CATEGORIES.find(c => c.id === selectedCategory)?.name} Craving List`}
          </h3>
          <span className="text-xs text-text-muted font-medium">
            {filteredItems.length} items
          </span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="group relative rounded-2xl border border-border-app bg-card-app p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-primary/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[9px] font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-md uppercase tracking-wider mb-2">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-text-app group-hover:text-brand-primary transition-colors">
                        {item.name}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-extrabold text-brand-secondary flex items-center gap-0.5">
                        <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-100" />
                        {item.calories}
                      </span>
                      <span className="text-[10px] text-text-muted font-medium leading-none">kcal</span>
                    </div>
                  </div>
                  
                  {/* Macros info pill bar */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-text-muted bg-border-app/20 p-2 rounded-xl border border-border-app/40">
                    <div className="text-center border-r border-border-app/50">
                      <div className="font-bold text-text-app">{item.fat}g</div>
                      <div>Fat</div>
                    </div>
                    <div className="text-center border-r border-border-app/50">
                      <div className="font-bold text-text-app">{item.sugar}g</div>
                      <div>Sugar</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-text-app">{item.sodium}mg</div>
                      <div>Sodium</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border-app/50">
                  <Link
                    href={`/alternatives/${item.slug}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-primary/5 hover:bg-brand-primary hover:text-brand-primary-fg text-brand-primary py-2.5 text-xs font-bold transition-all duration-300 group-hover:bg-brand-primary group-hover:text-brand-primary-fg shadow-sm active:scale-95"
                  >
                    View Healthy Swaps
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border-app bg-card-app/25">
            <HelpCircle className="mx-auto h-12 w-12 text-text-muted opacity-60 mb-3" />
            <h4 className="text-base font-bold text-text-app">No match found</h4>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              We couldn't find a matching craving. Try typing 'Maggi', 'Pizza', 'Samosa', or filter by another category.
            </p>
          </div>
        )}
      </div>

      
    </div>
  );
}
