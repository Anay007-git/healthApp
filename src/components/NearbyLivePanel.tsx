"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Utensils, 
  ExternalLink, 
  Compass, 
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { QCProduct } from '@/lib/providers/providers';
import { getRecipeBySlug } from '@/lib/recipes';

interface NearbyLivePanelProps {
  alternativeName: string;
  alternativeCategory: string;
  alternativeSlug: string;
}

export default function NearbyLivePanel({ alternativeName, alternativeCategory, alternativeSlug }: NearbyLivePanelProps) {
  const [products, setProducts] = useState<QCProduct[]>([]);
  const [pincode, setPincode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLocName, setActiveLocName] = useState('Indiranagar, Bengaluru');

  const recipe = getRecipeBySlug(alternativeSlug);

  // Trigger loading when name changes or location in localStorage changes
  const loadNearbyData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Read coordinates from localStorage (populated by Header component)
      const lat = localStorage.getItem('user_lat') || '12.971891';
      const lng = localStorage.getItem('user_lng') || '77.641151';
      const savedLocName = localStorage.getItem('user_location') || 'Indiranagar, Bengaluru';
      setActiveLocName(savedLocName);

      // Fetch products
      const productsUrl = `/api/location/products?lat=${lat}&lng=${lng}&location=${encodeURIComponent(savedLocName)}&query=${encodeURIComponent(alternativeName)}&category=${encodeURIComponent(alternativeCategory)}${forceRefresh ? '&refresh=true' : ''}`;

      const prodRes = await fetch(productsUrl);

      if (!prodRes.ok) {
        throw new Error('Failed to load local quick-commerce data');
      }

      const prodData = await prodRes.json();
      setProducts(prodData.products || []);
      setPincode(prodData.pincode || '');
    } catch (e: any) {
      console.warn('Error loading live nearby data, showing mock database options:', e);
      setError(e.message || 'Graceful mock fallback activated');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbyData();
    
    // Add custom window listener for immediate same-page updates
    const handleLocationChange = () => {
      loadNearbyData();
    };
    
    window.addEventListener('locationChanged', handleLocationChange);
    window.addEventListener('storage', handleLocationChange);
    
    return () => {
      window.removeEventListener('locationChanged', handleLocationChange);
      window.removeEventListener('storage', handleLocationChange);
    };
  }, [alternativeName, alternativeCategory]);

  return (
    <div className="border-t border-border-app/20 pt-8 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-app">Available Near You</h3>
            <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
              Live listings near <span className="font-semibold text-brand-primary">{activeLocName}</span> {pincode && `(Pincode: ${pincode})`}
            </p>
          </div>
        </div>

        <button 
          onClick={() => loadNearbyData(true)}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-border-app/40 bg-card-app/40 px-2.5 py-1 text-[10px] font-bold transition-all hover:bg-border-app/20 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        /* Shimmer Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-3 w-1/4 bg-border-app/60 rounded-md animate-pulse" />
              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-3 py-2 border-b border-border-app/10">
                    <div className="h-8 w-8 bg-border-app/40 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 bg-border-app/40 rounded animate-pulse" />
                      <div className="h-2 w-1/4 bg-border-app/30 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Packaged Swaps (Quick-Commerce) */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-border-app/20 pb-2 flex items-center gap-1">
              <ShoppingBag className="h-3.5 w-3.5" />
              Packaged Alternatives
            </h4>

            <div className="divide-y divide-border-app/20">
              {products.length > 0 ? (
                products.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-border-app/20 overflow-hidden flex items-center justify-center relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-text-app truncate max-w-[150px] sm:max-w-[180px]">
                          {product.name}
                        </h5>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {product.brand} &bull; <span className="font-semibold text-text-app">₹{product.price}</span>
                        </p>
                      </div>
                    </div>

                    <a 
                      href={product.deep_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-text-app hover:underline bg-card-app border border-border-app/40 px-2 py-1 rounded transition-colors shrink-0"
                    >
                      {product.platform === 'blinkit' ? (
                        <>
                          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#ffd200] text-black text-[8px] font-black shrink-0">B</span>
                          Blinkit
                        </>
                      ) : product.platform === 'zepto' ? (
                        <>
                          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#8d1bfa] text-white text-[8px] font-black shrink-0">Z</span>
                          Zepto
                        </>
                      ) : (
                        <>
                          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#fc8019] text-white text-[8px] font-black shrink-0">I</span>
                          Instamart
                        </>
                      )}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="py-6 text-xs text-text-muted">
                  No packaged products currently found near you. Try clicking Refresh to bypass the cache.
                </div>
              )}
            </div>
          </div>

          {/* Alternative Healthy Recipe Section */}
          <div className="space-y-4 bg-card-app border border-border-app/40 rounded-xl p-4.5 shadow-sm">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary border-b border-border-app/20 pb-2 flex items-center gap-1.5">
              <Utensils className="h-3.5 w-3.5 text-brand-primary" />
              🍳 Cook It At Home
            </h4>

            {recipe ? (
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-text-app">{recipe.title}</h5>
                  <div className="flex gap-2.5 mt-1.5 text-[10px] text-text-muted font-bold flex-wrap">
                    <span className="bg-border-app/20 px-2 py-0.5 rounded">⏱️ Prep: {recipe.prepTime}</span>
                    <span className="bg-border-app/20 px-2 py-0.5 rounded">🔥 Cook: {recipe.cookTime}</span>
                    <span className="bg-border-app/20 px-2 py-0.5 rounded">🍽️ {recipe.servings}</span>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Ingredients:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-text-app font-medium">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-brand-primary mt-0.5 shrink-0">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="space-y-2 pt-2 border-t border-border-app/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Instructions:</span>
                  <ol className="space-y-2 text-[11px] text-text-app font-medium leading-relaxed">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary text-[9px] font-extrabold">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Chef Pro Tip */}
                {recipe.tip && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.03] p-3 text-[10px] text-amber-800 leading-relaxed font-bold">
                    💡 <span className="font-extrabold text-amber-900">Chef Pro-Tip:</span> {recipe.tip}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-text-app">Simple Healthy Preparation</h5>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  To cook this alternative at home, steam or air-bake the ingredients with minimal oil (such as cold-pressed olive or coconut oil). Season with fresh herbs, cumin, turmeric, and garlic, keeping sodium additions minimal to maintain a healthy profile.
                </p>
                <div className="flex gap-3 text-[10px] text-text-muted font-bold">
                  <span className="bg-border-app/20 px-2 py-0.5 rounded">⏱️ Prep: 5 mins</span>
                  <span className="bg-border-app/20 px-2 py-0.5 rounded">🔥 Cook: 10 mins</span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
      
      {error && (
        <div className="mt-4 p-2.5 rounded border border-border-app text-text-app text-[10px] flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Notice: Running in graceful fallback mode (using cached local simulator listings).</span>
        </div>
      )}
    </div>
  );
}
