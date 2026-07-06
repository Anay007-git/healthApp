"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Compass, Search, ChevronDown, Check, Activity } from 'lucide-react';

const POPULAR_LOCATIONS = [
  { name: 'Indiranagar, Bengaluru', lat: 12.971891, lng: 77.641151, pincode: '560038' },
  { name: 'Bandra West, Mumbai', lat: 19.060691, lng: 72.836250, pincode: '400050' },
  { name: 'Connaught Place, New Delhi', lat: 28.6304, lng: 77.2177, pincode: '110001' },
  { name: 'Gachibowli, Hyderabad', lat: 17.440081, lng: 78.348915, pincode: '500032' },
  { name: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8930, pincode: '411001' }
];

export default function Header() {
  const [location, setLocation] = useState('Indiranagar, Bengaluru');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingGeoloc, setLoadingGeoloc] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user_location');
    if (saved) {
      setLocation(saved);
    }
  }, []);

  const selectLocation = (locName: string, lat: number, lng: number) => {
    setLocation(locName);
    localStorage.setItem('user_location', locName);
    localStorage.setItem('user_lat', lat.toString());
    localStorage.setItem('user_lng', lng.toString());
    window.dispatchEvent(new Event('locationChanged'));
    setDropdownOpen(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingGeoloc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Attempt client-side reverse geocoding using OSM Nominatim for a premium feel
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`;
          const response = await fetch(url, {
            headers: { 'User-Agent': 'AnaySwapApp/1.0 (contact@anayswap.in)' }
          });
          if (response.ok) {
            const data = await response.json();
            const streetName = data.address?.road || data.address?.suburb || 'Local Street';
            const cityName = data.address?.city || data.address?.town || data.address?.state_district || 'Bengaluru';
            const matchedName = `${streetName}, ${cityName}`;
            
            setLocation(matchedName);
            localStorage.setItem('user_location', matchedName);
            localStorage.setItem('user_lat', latitude.toString());
            localStorage.setItem('user_lng', longitude.toString());
            window.dispatchEvent(new Event('locationChanged'));
            setLoadingGeoloc(false);
            setDropdownOpen(false);
            return;
          }
        } catch (err) {
          console.warn('Nominatim client reverse-geocode failed, using simulated name:', err);
        }

        const matchedName = `Near Sector 4 (Coords: ${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
        setLocation(matchedName);
        localStorage.setItem('user_location', matchedName);
        localStorage.setItem('user_lat', latitude.toString());
        localStorage.setItem('user_lng', longitude.toString());
        window.dispatchEvent(new Event('locationChanged'));
        setLoadingGeoloc(false);
        setDropdownOpen(false);
      },
      (error) => {
        console.error("Error obtaining location", error);
        let errorMsg = "Unable to retrieve location. Please check your browser location permissions.";
        if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out. Please try again or select a city manually.";
        }
        alert(errorMsg);
        setLoadingGeoloc(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-app glass">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-all duration-300 group-hover:bg-brand-primary group-hover:text-brand-primary-fg shadow-sm">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-tight bg-gradient-to-r from-brand-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent hidden min-[370px]:block">
                  AnaySwap
                </span>
                <span className="text-[10px] font-medium text-text-muted leading-none hidden sm:block">
                  Healthy Swaps
                </span>
              </div>
            </Link>

            <nav className="hidden sm:flex items-center gap-3.5 ml-4 border-l border-border-app/30 pl-4">
              <Link href="/" className="text-xs font-bold text-text-app hover:text-brand-primary transition-colors">
                Cravings
              </Link>
              <Link href="/diet-chart" className="text-xs font-bold text-text-app hover:text-brand-primary transition-colors">
                Diet Planner
              </Link>
            </nav>
          </div>

          {/* Location Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 rounded-full border border-border-app bg-card-app py-1 px-2.5 sm:py-1.5 sm:px-3.5 text-xs font-semibold shadow-sm transition-all duration-200 hover:bg-border-app/20 active:scale-95"
            >
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-primary" />
              <span className="max-w-[70px] min-[370px]:max-w-[120px] sm:max-w-[200px] truncate text-text-app">
                {location}
              </span>
              <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-text-muted" />
            </button>

            {dropdownOpen && (
              <>
                {/* Backdrop to close */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 z-20 w-72 origin-top-right rounded-2xl border border-border-app bg-card-app p-2.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 text-xs font-bold text-text-muted tracking-wider uppercase border-b border-border-app mb-1.5">
                    Your Location
                  </div>
                  
                  {/* Geolocation Button */}
                  <button
                    onClick={handleGeolocation}
                    disabled={loadingGeoloc}
                    className="flex w-full items-center gap-2 rounded-xl py-2 px-3 text-left text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition-colors duration-150 disabled:opacity-50"
                  >
                    <Compass className={`h-4 w-4 ${loadingGeoloc ? 'animate-spin' : ''}`} />
                    {loadingGeoloc ? 'Detecting coords...' : 'Detect My Location'}
                  </button>

                  <div className="my-1.5 border-t border-border-app" />
                  
                  <div className="space-y-0.5">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => selectLocation(loc.name, loc.lat, loc.lng)}
                        className="flex w-full items-center justify-between rounded-xl py-2 px-3 text-left text-xs text-text-app hover:bg-border-app/40 transition-colors duration-150"
                      >
                        <span className={location === loc.name ? 'font-semibold text-brand-primary' : ''}>
                          {loc.name}
                        </span>
                        {location === loc.name && (
                          <Check className="h-3.5 w-3.5 text-brand-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
