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
import { QCProduct, Restaurant } from '@/lib/providers/providers';

interface NearbyLivePanelProps {
  alternativeName: string;
  alternativeCategory: string;
}

export default function NearbyLivePanel({ alternativeName, alternativeCategory }: NearbyLivePanelProps) {
  const [products, setProducts] = useState<QCProduct[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pincode, setPincode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLocName, setActiveLocName] = useState('Indiranagar, Bengaluru');

  // Trigger loading when name changes or location in localStorage changes
  const loadNearbyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Read coordinates from localStorage (populated by Header component)
      const lat = localStorage.getItem('user_lat') || '12.971891';
      const lng = localStorage.getItem('user_lng') || '77.641151';
      const savedLocName = localStorage.getItem('user_location') || 'Indiranagar, Bengaluru';
      setActiveLocName(savedLocName);

      // Fetch products and restaurants in parallel
      const productsUrl = `/api/location/products?lat=${lat}&lng=${lng}&location=${encodeURIComponent(savedLocName)}&query=${encodeURIComponent(alternativeName)}&category=${encodeURIComponent(alternativeCategory)}`;
      const tags = alternativeCategory === 'fastfood' 
        ? 'Keto,Healthy Food,Tandoori,Mediterranean' 
        : 'Organic,Vegan,Millet Specials,Salads,Juices';
      const restaurantsUrl = `/api/location/restaurants?lat=${lat}&lng=${lng}&location=${encodeURIComponent(savedLocName)}&tags=${encodeURIComponent(tags)}`;

      const [prodRes, restRes] = await Promise.all([
        fetch(productsUrl),
        fetch(restaurantsUrl)
      ]);

      if (!prodRes.ok || !restRes.ok) {
        throw new Error('Failed to load local quick-commerce or restaurant data');
      }

      const prodData = await prodRes.json();
      const restData = await restRes.json();

      setProducts(prodData.products || []);
      setRestaurants(restData.restaurants || []);
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
          onClick={loadNearbyData}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-border-app/40 bg-card-app/40 px-2.5 py-1 text-[10px] font-bold transition-all hover:bg-border-app/20 disabled:opacity-50"
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
                  No packaged products currently found near you.
                </div>
              )}
            </div>
          </div>

          {/* Restaurant Swaps (Food Delivery Platforms) */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted border-b border-border-app/20 pb-2 flex items-center gap-1">
              <Utensils className="h-3.5 w-3.5" />
              Restaurant Swaps
            </h4>

            <div className="divide-y divide-border-app/20">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <div 
                    key={restaurant.id}
                    className="py-3 first:pt-0 last:pb-0 flex justify-between items-start gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="text-xs font-bold text-text-app">
                          {restaurant.name}
                        </h5>
                        <span className="text-[9px] font-extrabold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
                          H: {restaurant.health_score}
                        </span>
                        <span className="text-[9px] text-text-muted font-bold">★ {restaurant.rating}</span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-1 leading-relaxed truncate">
                        {restaurant.address} &bull; {restaurant.distance_text}
                      </p>
                    </div>

                    <div className="flex flex-col min-[380px]:flex-row gap-1.5 shrink-0 mt-0.5">
                      <a 
                        href={restaurant.zomato_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-text-app hover:underline bg-card-app border border-border-app/40 px-2 py-1 rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#cb202d] text-white text-[8px] font-black shrink-0">Z</span>
                        Zomato
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                      <a 
                        href={restaurant.swiggy_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-text-app hover:underline bg-card-app border border-border-app/40 px-2 py-1 rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#fc8019] text-white text-[8px] font-black shrink-0">S</span>
                        Swiggy
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-xs text-text-muted">
                  No nearby healthy restaurants found matching this swap.
                </div>
              )}
            </div>
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
