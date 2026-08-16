import React, { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath, GeoProjection } from "d3-geo";
import { Search, ShieldCheck, BarChart2, Info } from "lucide-react";
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

import { StateProfile } from "@civiclens/types";

export interface IndiaMapProps {
  states: StateProfile[];
  selectedCode?: string;
  onSelectState?: (state: StateProfile) => void;
  onCompare?: (stateA: string, stateB: string) => void;
}

type IndiaFeature = Feature<Geometry, GeoJsonProperties>;
type IndiaGeoJSON = FeatureCollection<Geometry, GeoJsonProperties>;

interface MapState {
  code: string;
  name: string;
  feature: IndiaFeature;
}

/*
|--------------------------------------------------------------------------
| State name → application code mapping
|--------------------------------------------------------------------------
*/
const STATE_CODE_MAP: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OR",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TG",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "West Bengal": "WB",

  Delhi: "DL",

  "Jammu and Kashmir": "JK",
  "Jammu & Kashmir": "JK",

  Ladakh: "LA",

  Puducherry: "PY",
  Pondicherry: "PY",

  Chandigarh: "CH",

  "Andaman and Nicobar Islands": "AN",
  "Andaman & Nicobar Islands": "AN",

  Lakshadweep: "LD",

  "Dadra and Nagar Haveli and Daman and Diu": "DN",
  "Dadra & Nagar Haveli and Daman & Diu": "DN",
};

/*
|--------------------------------------------------------------------------
| Normalize GeoJSON state names
|--------------------------------------------------------------------------
*/
function normalizeStateName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/&/g, "and")
    .toLowerCase();
}

function getStateCode(feature: IndiaFeature): string | undefined {
  const props = feature.properties || {};

  const possibleNames = [
    props.ST_NM,
    props.st_nm,
    props.STNAME,
    props.NAME_1,
    props.name,
    props.NAME,
    props.State_Name,
    props.state_name,
  ].filter(Boolean);

  for (const value of possibleNames) {
    const normalized = normalizeStateName(String(value));

    const match = Object.entries(STATE_CODE_MAP).find(
      ([stateName]) => normalizeStateName(stateName) === normalized
    );

    if (match) {
      return match[1];
    }
  }

  return undefined;
}

function getStateName(feature: IndiaFeature): string {
  const props = feature.properties || {};

  return String(
    props.ST_NM ||
      props.st_nm ||
      props.STNAME ||
      props.NAME_1 ||
      props.name ||
      props.NAME ||
      props.State_Name ||
      props.state_name ||
      "Unknown"
  );
}

/*
|--------------------------------------------------------------------------
| Heatmap colors
|--------------------------------------------------------------------------
*/
function getStateScoreColor(score?: number): string {
  if (score == null) {
    return "#D6D3D1";
  }

  if (score >= 90) return "#166534";
  if (score >= 80) return "#15803D";
  if (score >= 70) return "#65A30D";
  if (score >= 60) return "#CA8A04";
  if (score >= 50) return "#D97706";
  if (score >= 40) return "#C2410C";

  return "#D95300";
}

/*
|--------------------------------------------------------------------------
| Label positioning overrides
|--------------------------------------------------------------------------
*/
const LABEL_OVERRIDES: Record<string, { dx: number; dy: number }> = {
  JK: { dx: 0, dy: 0 },
  LA: { dx: 0, dy: 0 },
  DL: { dx: 0, dy: 0 },
  SK: { dx: 0, dy: 0 },
  GA: { dx: 0, dy: 0 },
  PY: { dx: 0, dy: 0 },
  AN: { dx: 0, dy: 0 },
  LD: { dx: 0, dy: 0 },
};

// Embedded fallback GeoJSON in case public URL fetch fails
const FALLBACK_INDIA_GEOJSON: IndiaGeoJSON = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { ST_NM: "Jammu and Kashmir" }, geometry: { type: "Polygon", coordinates: [[[74, 34], [76, 35], [76, 33], [74, 32], [74, 34]]] } },
    { type: "Feature", properties: { ST_NM: "Ladakh" }, geometry: { type: "Polygon", coordinates: [[[76, 35], [79, 35], [78, 32], [76, 33], [76, 35]]] } },
    { type: "Feature", properties: { ST_NM: "Himachal Pradesh" }, geometry: { type: "Polygon", coordinates: [[[76, 33], [78, 33], [77, 31], [75, 31], [76, 33]]] } },
    { type: "Feature", properties: { ST_NM: "Punjab" }, geometry: { type: "Polygon", coordinates: [[[74, 32], [76, 32], [76, 30], [74, 30], [74, 32]]] } },
    { type: "Feature", properties: { ST_NM: "Uttarakhand" }, geometry: { type: "Polygon", coordinates: [[[78, 31], [80, 31], [80, 29], [78, 29], [78, 31]]] } },
    { type: "Feature", properties: { ST_NM: "Haryana" }, geometry: { type: "Polygon", coordinates: [[[75, 30], [77, 30], [77, 28], [75, 28], [75, 30]]] } },
    { type: "Feature", properties: { ST_NM: "Delhi" }, geometry: { type: "Polygon", coordinates: [[[77, 28.7], [77.3, 28.7], [77.3, 28.4], [77, 28.4], [77, 28.7]]] } },
    { type: "Feature", properties: { ST_NM: "Rajasthan" }, geometry: { type: "Polygon", coordinates: [[[70, 30], [76, 28], [77, 24], [70, 24], [70, 30]]] } },
    { type: "Feature", properties: { ST_NM: "Uttar Pradesh" }, geometry: { type: "Polygon", coordinates: [[[77, 28], [84, 28], [84, 24], [78, 24], [77, 28]]] } },
    { type: "Feature", properties: { ST_NM: "Bihar" }, geometry: { type: "Polygon", coordinates: [[[84, 27], [88, 27], [88, 24], [84, 24], [84, 27]]] } },
    { type: "Feature", properties: { ST_NM: "Sikkim" }, geometry: { type: "Polygon", coordinates: [[[88, 28], [89, 28], [89, 27], [88, 27], [88, 28]]] } },
    { type: "Feature", properties: { ST_NM: "West Bengal" }, geometry: { type: "Polygon", coordinates: [[[88, 27], [89, 27], [88, 21.5], [87, 22], [88, 27]]] } },
    { type: "Feature", properties: { ST_NM: "Jharkhand" }, geometry: { type: "Polygon", coordinates: [[[84, 24], [87, 24], [87, 22], [84, 22], [84, 24]]] } },
    { type: "Feature", properties: { ST_NM: "Odisha" }, geometry: { type: "Polygon", coordinates: [[[83, 22], [87, 22], [85, 19], [82, 19], [83, 22]]] } },
    { type: "Feature", properties: { ST_NM: "Chhattisgarh" }, geometry: { type: "Polygon", coordinates: [[[80, 24], [83, 24], [83, 18], [80, 18], [80, 24]]] } },
    { type: "Feature", properties: { ST_NM: "Madhya Pradesh" }, geometry: { type: "Polygon", coordinates: [[[74, 26], [82, 26], [82, 21], [74, 21], [74, 26]]] } },
    { type: "Feature", properties: { ST_NM: "Gujarat" }, geometry: { type: "Polygon", coordinates: [[[68, 24], [74, 24], [73, 20], [68, 20], [68, 24]]] } },
    { type: "Feature", properties: { ST_NM: "Maharashtra" }, geometry: { type: "Polygon", coordinates: [[[72, 20], [80, 21], [80, 16], [73, 16], [72, 20]]] } },
    { type: "Feature", properties: { ST_NM: "Telangana" }, geometry: { type: "Polygon", coordinates: [[[77, 19], [81, 19], [81, 16], [77, 16], [77, 19]]] } },
    { type: "Feature", properties: { ST_NM: "Andhra Pradesh" }, geometry: { type: "Polygon", coordinates: [[[77, 16], [84, 19], [80, 13], [78, 13], [77, 16]]] } },
    { type: "Feature", properties: { ST_NM: "Karnataka" }, geometry: { type: "Polygon", coordinates: [[[74, 18], [78, 18], [77, 12], [74, 14], [74, 18]]] } },
    { type: "Feature", properties: { ST_NM: "Goa" }, geometry: { type: "Polygon", coordinates: [[[73.7, 15.8], [74.2, 15.8], [74.2, 14.9], [73.7, 14.9], [73.7, 15.8]]] } },
    { type: "Feature", properties: { ST_NM: "Kerala" }, geometry: { type: "Polygon", coordinates: [[[75, 12], [77, 12], [77, 8], [76, 8], [75, 12]]] } },
    { type: "Feature", properties: { ST_NM: "Tamil Nadu" }, geometry: { type: "Polygon", coordinates: [[[77, 13], [80, 13], [78, 8], [77, 8], [77, 13]]] } },
    { type: "Feature", properties: { ST_NM: "Assam" }, geometry: { type: "Polygon", coordinates: [[[90, 27], [95, 27], [95, 25], [90, 25], [90, 27]]] } },
    { type: "Feature", properties: { ST_NM: "Arunachal Pradesh" }, geometry: { type: "Polygon", coordinates: [[[92, 29], [97, 29], [96, 27], [92, 27], [92, 29]]] } },
    { type: "Feature", properties: { ST_NM: "Nagaland" }, geometry: { type: "Polygon", coordinates: [[[94, 27], [95.5, 27], [95, 25.5], [94, 25.5], [94, 27]]] } },
    { type: "Feature", properties: { ST_NM: "Manipur" }, geometry: { type: "Polygon", coordinates: [[[93.5, 25.5], [94.8, 25.5], [94.5, 24], [93.5, 24], [93.5, 25.5]]] } },
    { type: "Feature", properties: { ST_NM: "Mizoram" }, geometry: { type: "Polygon", coordinates: [[[92.5, 24], [93.5, 24], [93, 22], [92.5, 22], [92.5, 24]]] } },
    { type: "Feature", properties: { ST_NM: "Tripura" }, geometry: { type: "Polygon", coordinates: [[[91.2, 24.3], [92.3, 24.3], [92, 23], [91.2, 23], [91.2, 24.3]]] } },
    { type: "Feature", properties: { ST_NM: "Meghalaya" }, geometry: { type: "Polygon", coordinates: [[[89.8, 26], [92.8, 26], [92.5, 25], [89.8, 25], [89.8, 26]]] } },
    { type: "Feature", properties: { ST_NM: "Andaman and Nicobar Islands" }, geometry: { type: "Polygon", coordinates: [[[92.5, 13.5], [93.2, 13.5], [93.2, 6.5], [92.5, 6.5], [92.5, 13.5]]] } },
    { type: "Feature", properties: { ST_NM: "Lakshadweep" }, geometry: { type: "Polygon", coordinates: [[[71.5, 12], [72.5, 12], [72.5, 10.5], [71.5, 10.5], [71.5, 12]]] } },
    { type: "Feature", properties: { ST_NM: "Chandigarh" }, geometry: { type: "Polygon", coordinates: [[[76.7, 30.8], [76.85, 30.8], [76.85, 30.65], [76.7, 30.65], [76.7, 30.8]]] } },
    { type: "Feature", properties: { ST_NM: "Dadra and Nagar Haveli and Daman and Diu" }, geometry: { type: "Polygon", coordinates: [[[72.8, 20.6], [73.4, 20.6], [73.4, 20.1], [72.8, 20.1], [72.8, 20.6]]] } },
    { type: "Feature", properties: { ST_NM: "Puducherry" }, geometry: { type: "Polygon", coordinates: [[[79.7, 12.1], [80.0, 12.1], [80.0, 11.8], [79.7, 11.8], [79.7, 12.1]]] } },
  ],
};

/*
|--------------------------------------------------------------------------
| Component Implementation
|--------------------------------------------------------------------------
*/
export const IndiaMap: React.FC<IndiaMapProps> = ({
  states,
  selectedCode,
  onSelectState,
  onCompare,
}) => {
  const [geoData, setGeoData] = useState<IndiaGeoJSON | null>(FALLBACK_INDIA_GEOJSON);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateProfile | null>(() => {
    if (selectedCode) {
      return states.find((s) => s.code.toUpperCase() === selectedCode.toUpperCase()) || states[0] || null;
    }
    return states[0] || null;
  });
  const [hoveredState, setHoveredState] = useState<StateProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Governance");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareTarget, setCompareTarget] = useState("WB");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (selectedCode) {
      const match = states.find((s) => s.code.toUpperCase() === selectedCode.toUpperCase());
      if (match) setSelectedState(match);
    }
  }, [selectedCode, states]);

  /*
  |--------------------------------------------------------------------------
  | Load GeoJSON with fallback
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch("/maps/india.geojson");

        if (!response.ok) {
          throw new Error(`Unable to load India map: ${response.status}`);
        }

        const data = (await response.json()) as IndiaGeoJSON;

        if (!cancelled) {
          setGeoData(data);
          setError(null);
        }
      } catch (err) {
        console.warn("Using embedded fallback GeoJSON for India Map", err);
        if (!cancelled) {
          setGeoData(FALLBACK_INDIA_GEOJSON);
          setError(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | State lookup
  |--------------------------------------------------------------------------
  */
  const stateByCode = useMemo(() => {
    const map = new Map<string, StateProfile>();
    states.forEach((state) => {
      map.set(state.code, state);
    });
    return map;
  }, [states]);

  /*
  |--------------------------------------------------------------------------
  | Convert GeoJSON → usable map states
  |--------------------------------------------------------------------------
  */
  const mapStates = useMemo<MapState[]>(() => {
    if (!geoData) return [];

    return geoData.features
      .map((feature) => {
        const code = getStateCode(feature);

        if (!code) {
          return null;
        }

        return {
          code,
          name: getStateName(feature),
          feature,
        };
      })
      .filter(Boolean) as MapState[];
  }, [geoData]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */
  const filteredStates = states.filter((state) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      state.name.toLowerCase().includes(query) ||
      state.code.toLowerCase().includes(query) ||
      state.capital.toLowerCase().includes(query)
    );
  });

  /*
  |--------------------------------------------------------------------------
  | SVG dimensions & Projection
  |--------------------------------------------------------------------------
  */
  const width = 620;
  const height = 530;

  const projection = useMemo<GeoProjection | null>(() => {
    if (!geoData) return null;

    return geoMercator().fitExtent(
      [
        [20, 10],
        [width - 20, height - 70],
      ],
      geoData as any
    );
  }, [geoData]);

  const pathGenerator = useMemo(() => {
    if (!projection) return null;
    return geoPath(projection);
  }, [projection]);

  /*
  |--------------------------------------------------------------------------
  | Actions
  |--------------------------------------------------------------------------
  */
  const selectState = (state: StateProfile) => {
    setSelectedState(state);
    onSelectState?.(state);
  };

  const handleMouseEnter = (
    state: StateProfile,
    event: React.MouseEvent<SVGElement>
  ) => {
    setHoveredState(state);
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div className="bg-white border border-[#E8DEC8] rounded shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-3">
        <div>
          <span className="font-mono text-xs font-semibold text-[#D95300] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Geographic Intelligence Engine
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827] mt-0.5">
            India Governance Map
          </h3>
          <p className="text-xs text-[#4B5563] font-mono mt-0.5">
            D3-geo Mercator Projection with State Level Indicators
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {["Governance", "Health", "Education", "Fiscal", "Infrastructure"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
                activeCategory === category
                  ? "bg-[#D95300] text-white font-bold"
                  : "bg-[#F3EDE0] text-[#4B5563] hover:bg-[#E8DEC8]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP CANVAS */}
        <div className="lg:col-span-7">
          <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded p-3 relative">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-mono text-xs text-[#4B5563]">INDIA · STATE BOUNDARIES</span>
              <span className="font-mono text-xs text-[#D95300] font-bold">{activeCategory}</span>
            </div>

            {loading && (
              <div className="h-[460px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-[#D95300] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-mono text-xs text-[#4B5563]">Loading geographic data...</p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="h-[460px] flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <Info className="w-8 h-8 text-[#D95300] mx-auto mb-3" />
                  <p className="font-serif font-bold text-[#111827]">Map unavailable</p>
                  <p className="font-mono text-xs text-[#4B5563] mt-2">{error}</p>
                </div>
              </div>
            )}

            {!loading && geoData && projection && pathGenerator && (
              <div className="relative w-full">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-auto"
                  role="img"
                  aria-label="Interactive map of India"
                >
                  {mapStates.map(({ code, name, feature }, idx) => {
                    const state = stateByCode.get(code);
                    const score = state?.scores?.[activeCategory];
                    const isSelected = selectedState?.code === code;
                    const isHovered = hoveredState?.code === code;
                    const fill = isSelected
                      ? "#111827"
                      : isHovered
                      ? "#D95300"
                      : getStateScoreColor(score);
                    const d = pathGenerator(feature);

                    if (!d) return null;

                    return (
                      <path
                        key={`${code}-${idx}`}
                        d={d}
                        fill={fill}
                        stroke="#FFFFFF"
                        strokeWidth={isSelected ? 1.8 : 0.8}
                        strokeLinejoin="round"
                        className="cursor-pointer transition-all duration-150 hover:opacity-90"
                        onClick={() => state && selectState(state)}
                        onMouseEnter={(event) => state && handleMouseEnter(state, event)}
                        onMouseMove={(event) => {
                          const svg = event.currentTarget.ownerSVGElement;
                          if (!svg) return;
                          const rect = svg.getBoundingClientRect();
                          setTooltipPosition({
                            x: event.clientX - rect.left,
                            y: event.clientY - rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredState(null)}
                      />
                    );
                  })}

                  {/* DELHI CALLOUT PIN & BADGE ON MAP */}
                  {(() => {
                    const dlState = stateByCode.get("DL");
                    if (!dlState) return null;
                    const coords = projection([77.21, 28.61]);
                    if (!coords) return null;
                    const [px, py] = coords;
                    const isSel = selectedState?.code === "DL";
                    const isHov = hoveredState?.code === "DL";
                    const score = dlState.scores?.[activeCategory];
                    const fill = isSel ? "#111827" : isHov ? "#D95300" : getStateScoreColor(score);

                    return (
                      <g
                        key="delhi-pin"
                        className="cursor-pointer select-none"
                        onClick={() => selectState(dlState)}
                        onMouseEnter={(e) => handleMouseEnter(dlState, e)}
                        onMouseLeave={() => setHoveredState(null)}
                      >
                        {/* Target line from Delhi center */}
                        <line x1={px} y1={py} x2={px - 40} y2={py - 25} stroke="#111827" strokeWidth="1.2" strokeDasharray="2,2" />
                        {/* Circular core marker */}
                        <circle cx={px} cy={py} r={isSel ? 6 : 4.5} fill={fill} stroke="#FFFFFF" strokeWidth="1.5" />
                        {/* Interactive badge */}
                        <rect
                          x={px - 110}
                          y={py - 38}
                          width="78"
                          height="22"
                          rx="4"
                          fill={fill}
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                          className="transition-all"
                        />
                        <text
                          x={px - 71}
                          y={py - 23}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          Delhi (DL)
                        </text>
                      </g>
                    );
                  })()}

                  {/* ISLAND & UT OVERLAY CALLOUTS FOR EASY SELECTION */}
                  {[
                    { code: "LD", label: "Lakshadweep", x: 25, y: 470, w: 110 },
                    { code: "DL", label: "Delhi (NCT)", x: 145, y: 470, w: 100 },
                    { code: "PY", label: "Puducherry", x: 255, y: 470, w: 100 },
                    { code: "AN", label: "Andaman & Nicobar", x: 365, y: 470, w: 145 },
                    { code: "CH", label: "Chandigarh", x: 25, y: 498, w: 110 },
                    { code: "GA", label: "Goa", x: 145, y: 498, w: 100 },
                    { code: "DN", label: "Dadra & Nagar", x: 255, y: 498, w: 120 },
                    { code: "LA", label: "Ladakh", x: 385, y: 498, w: 90 },
                  ].map((island) => {
                    const st = stateByCode.get(island.code);
                    if (!st) return null;
                    const isSel = selectedState?.code === island.code;
                    const isHov = hoveredState?.code === island.code;
                    const score = st.scores?.[activeCategory];
                    const fill = isSel ? "#111827" : isHov ? "#D95300" : getStateScoreColor(score);
                    return (
                      <g
                        key={island.code}
                        className="cursor-pointer select-none transition-all"
                        onClick={() => selectState(st)}
                        onMouseEnter={(e) => handleMouseEnter(st, e)}
                        onMouseLeave={() => setHoveredState(null)}
                      >
                        <rect
                          x={island.x}
                          y={island.y}
                          width={island.w}
                          height="20"
                          rx="4"
                          fill={fill}
                          stroke="#FFFFFF"
                          strokeWidth="1"
                        />
                        <text
                          x={island.x + island.w / 2}
                          y={island.y + 13.5}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {island.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Tooltip with High Contrast & Guaranteed Readability */}
                {hoveredState && (
                  <div
                    className="absolute z-50 pointer-events-none rounded-lg shadow-2xl backdrop-blur-md"
                    style={{
                      left: Math.min(tooltipPosition.x + 12, 380),
                      top: Math.max(tooltipPosition.y - 40, 8),
                      backgroundColor: "rgba(17, 24, 39, 0.98)",
                      border: "1px solid #4B5563",
                      padding: "10px 14px",
                      minWidth: "190px",
                      color: "#FFFFFF",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <div style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "14px", fontFamily: "serif", lineHeight: 1.2 }}>
                      {hoveredState.name}
                    </div>
                    <div style={{ color: "#9CA3AF", fontSize: "10px", fontFamily: "monospace", marginTop: "2px" }}>
                      STATE CODE: <span style={{ color: "#F3F4F6", fontWeight: "bold" }}>{hoveredState.code}</span> {hoveredState.capital ? `• ${hoveredState.capital}` : ""}
                    </div>
                    <div style={{ borderTop: "1px solid #374151", margin: "8px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontSize: "11px", fontFamily: "monospace" }}>
                      <span style={{ color: "#9CA3AF" }}>{activeCategory} Score</span>
                      <strong style={{ color: "#F59E0B", fontWeight: "bold", fontSize: "12px" }}>
                        {hoveredState.scores?.[activeCategory] ?? "No data"}
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontSize: "11px", fontFamily: "monospace", marginTop: "4px" }}>
                      <span style={{ color: "#9CA3AF" }}>CAG Audit Findings</span>
                      <strong style={{ color: "#EF4444", fontWeight: "bold", fontSize: "12px" }}>
                        {hoveredState.cagFindingsCount}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="border-t border-[#E8DEC8] mt-3 pt-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <LegendItem color="#166534" label="90+" />
                <LegendItem color="#15803D" label="80–89" />
                <LegendItem color="#65A30D" label="70–79" />
                <LegendItem color="#CA8A04" label="60–69" />
                <LegendItem color="#D97706" label="50–59" />
                <LegendItem color="#D95300" label="<50" />
                <LegendItem color="#D6D3D1" label="No data" />
              </div>
            </div>
          </div>
        </div>

        {/* STATE PANEL */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 bg-[#FAF7F0] border border-[#E8DEC8] px-3 py-2 rounded">
            <Search className="w-4 h-4 text-[#4B5563]" />
            <input
              type="text"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="bg-transparent outline-none w-full text-sm font-mono text-[#111827]"
            />
            <span className="font-mono text-[10px] text-[#4B5563]">{filteredStates.length}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[230px] overflow-y-auto">
            {filteredStates.map((state) => {
              const score = state.scores?.[activeCategory];
              const selected = selectedState?.code === state.code;

              return (
                <button
                  key={state.code}
                  onClick={() => selectState(state)}
                  className="text-left p-2.5 border rounded-lg transition-all cursor-pointer shadow-2xs"
                  style={{
                    backgroundColor: selected ? "#111827" : "#FFFFFF",
                    borderColor: selected ? "#111827" : "#E8DEC8",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: selected ? "#FFFFFF" : "#111827" }}
                    >
                      {state.code}
                    </span>
                    <span
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{
                        backgroundColor: selected ? "#D95300" : "#F3EDE0",
                        color: selected ? "#FFFFFF" : "#D95300",
                      }}
                    >
                      {score ?? "—"}
                    </span>
                  </div>
                  <div
                    className="font-serif font-bold text-xs mt-1 truncate"
                    style={{ color: selected ? "#FFFFFF" : "#111827" }}
                  >
                    {state.name}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedState && (
            <div className="bg-white border border-[#E8DEC8] rounded-xl p-4 sm:p-5 shadow-xs overflow-hidden">
              <div className="flex items-start justify-between border-b border-[#E8DEC8] pb-4">
                <div>
                  <div className="font-mono text-[10px] text-[#D95300] font-bold uppercase">State intelligence</div>
                  <h4 className="font-serif text-2xl font-bold text-[#111827] mt-1">{selectedState.name}</h4>
                  <p className="font-mono text-[10px] text-[#4B5563] mt-1">{selectedState.capital}</p>
                </div>
                <span
                  className="px-2.5 py-1 rounded font-mono text-xs font-bold"
                  style={{ backgroundColor: "#111827", color: "#FFFFFF" }}
                >
                  {selectedState.code}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                {Object.entries(selectedState.scores || {}).map(([category, value]) => {
                  const displayVal = typeof value === "number" ? value : (value && typeof value === "object" && typeof (value as any).score === "number" ? (value as any).score : "—");
                  return (
                    <div key={category} className="bg-[#FAF7F0] border border-[#E8DEC8] rounded p-2.5">
                      <div className="font-mono text-[9px] text-[#6B7280] uppercase">{category}</div>
                      <div className="font-mono text-lg font-bold text-[#D95300] mt-1">
                        {displayVal}
                      </div>
                    </div>
                  );
                })}
              </div>

              {onCompare && (
                <div className="border-t border-[#E8DEC8] mt-4 pt-3.5 space-y-2 w-full min-w-0">
                  <span className="text-[10px] font-mono font-bold text-[#06038D] uppercase tracking-wider block">
                    COMPARE WITH ANOTHER STATE:
                  </span>
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <select
                      value={compareTarget}
                      onChange={(event) => setCompareTarget(event.target.value)}
                      className="flex-1 min-w-0 w-full bg-[#FAF7F0] border border-[#E8DEC8] rounded-lg px-2.5 py-2 text-xs font-serif font-bold text-[#0F172A] focus:outline-none focus:border-[#06038D] cursor-pointer shadow-2xs h-10 truncate"
                    >
                      {states
                        .filter((s) => s.code !== selectedState.code)
                        .map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={() => onCompare(selectedState.code, compareTarget)}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 saffron-btn px-3.5 py-2 rounded-lg font-serif text-xs font-bold transition-all shadow-xs cursor-pointer h-10 whitespace-nowrap"
                    >
                      <BarChart2 className="w-3.5 h-3.5 shrink-0" />
                      Compare
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#4B5563]">
      <span className="w-2.5 h-2.5 rounded-sm border border-white shadow-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
