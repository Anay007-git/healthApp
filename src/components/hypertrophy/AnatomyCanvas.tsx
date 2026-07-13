"use client";

import React, { useState } from "react";

interface AnatomyCanvasProps {
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string) => void;
  viewAngle: "front" | "back" | "side" | "reset";
}

export default function AnatomyCanvas({
  selectedMuscleId,
  onSelectMuscle,
  viewAngle: initialViewAngle,
}: AnatomyCanvasProps) {
  const [localView, setLocalView] = useState<"front" | "back">("front");

  // Sync view angle toggles from parent buttons
  React.useEffect(() => {
    if (initialViewAngle === "back") {
      setLocalView("back");
    } else if (initialViewAngle === "front" || initialViewAngle === "reset") {
      setLocalView("front");
    }
  }, [initialViewAngle]);

  const musclesData = {
    front: [
      { id: "neck", name: "Neck", path: "M90,70 L110,70 L114,90 L86,90 Z" },
      { id: "upper_chest", name: "Upper Chest", path: "M100,90 C88,90 70,95 66,108 C75,114 90,114 100,114 Z M100,90 C112,90 130,95 134,108 C125,114 110,114 100,114 Z" },
      { id: "lower_chest", name: "Lower Chest", path: "M100,114 C90,114 74,114 65,110 C65,124 85,134 100,134 Z M100,114 C110,114 126,114 135,110 C135,124 115,134 100,134 Z" },
      { id: "front_delts", name: "Front Delts", path: "M64,96 C52,98 50,112 58,124 C62,118 63,108 64,96 Z M136,96 C148,98 150,112 142,124 C138,118 137,108 136,96 Z" },
      { id: "side_delts", name: "Side Delts", path: "M56,98 C42,102 44,116 52,128 C56,120 56,108 56,98 Z M144,98 C158,102 156,116 148,128 C144,120 144,108 144,98 Z" },
      { id: "biceps", name: "Biceps", path: "M48,126 C36,134 38,154 48,162 C53,150 53,138 48,126 Z M152,126 C164,134 162,154 152,162 C147,150 147,138 152,126 Z" },
      { id: "forearms", name: "Forearms", path: "M47,164 C38,172 40,206 48,206 C51,192 51,176 47,164 Z M153,164 C162,172 160,206 152,206 C149,192 149,176 153,164 Z" },
      { id: "abs", name: "Abs (Six-Pack)", path: "M84,138 H116 V150 H84 Z M84,154 H116 V166 H84 Z M84,170 H116 V182 H84 Z" },
      { id: "obliques", name: "Obliques", path: "M80,136 C76,148 76,170 80,186 C82,170 82,148 80,136 Z M120,136 C124,148 124,170 120,186 C118,170 118,148 120,136 Z" },
      { id: "hip_flexors", name: "Hip Flexors", path: "M80,188 H98 V204 H84 Z M120,188 H102 V204 H116 Z" },
      { id: "quads", name: "Quads (Thighs)", path: "M84,208 C64,218 62,266 80,278 C85,264 86,234 84,208 Z M116,208 C136,218 138,266 120,278 C115,264 114,234 116,208 Z" },
      { id: "calves", name: "Calves", path: "M79,286 C66,296 68,334 77,344 C80,332 82,305 79,286 Z M121,286 C134,296 132,334 123,344 C120,332 118,305 121,286 Z" }
    ],
    back: [
      { id: "traps", name: "Traps", path: "M100,74 C84,80 84,98 100,104 C116,98 116,80 100,74 Z" },
      { id: "rhomboids", name: "Rhomboids", path: "M100,104 C88,104 88,124 100,126 C112,124 112,104 100,104 Z" },
      { id: "rear_delts", name: "Rear Delts", path: "M66,94 C54,96 52,110 60,122 C64,116 65,106 66,94 Z M134,94 C146,96 148,110 140,122 C136,116 135,106 134,94 Z" },
      { id: "triceps", name: "Triceps", path: "M48,124 C38,132 40,154 48,160 C52,148 52,136 48,124 Z M152,124 C162,132 160,154 152,160 C148,148 148,136 152,124 Z" },
      { id: "lats", name: "Lats (Width)", path: "M84,106 C70,114 70,144 80,156 C85,142 86,122 84,106 Z M116,106 C130,114 130,144 120,156 C115,142 114,122 116,106 Z" },
      { id: "spinal_erectors", name: "Lower Back", path: "M96,128 H104 V172 H96 Z" },
      { id: "glutes", name: "Glutes", path: "M99,176 C82,176 78,202 96,208 C98,202 99,188 99,176 Z M101,176 C118,176 122,202 104,208 C102,202 101,188 101,176 Z" },
      { id: "hamstrings", name: "Hamstrings", path: "M84,210 C68,220 66,268 82,278 C86,260 86,230 84,210 Z M116,210 C132,220 134,268 118,278 C114,260 114,230 116,210 Z" },
      { id: "calves", name: "Calves", path: "M79,286 C66,296 68,334 77,344 C80,332 82,305 79,286 Z M121,286 C134,296 132,334 123,344 C120,332 118,305 121,286 Z" }
    ]
  };

  const activeMuscles = musclesData[localView];

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col items-center justify-between rounded-3xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden">
      {/* Front / Back Toggle HUD */}
      <div className="flex w-full items-center justify-between z-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            HUMAN ANATOMICAL MAP
          </span>
          <span className="text-[9px] text-slate-400 font-mono">SELECTOR MODE: DIRECT CLICK</span>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setLocalView("front")}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
              localView === "front" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            FRONT
          </button>
          <button
            onClick={() => setLocalView("back")}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
              localView === "back" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            BACK
          </button>
        </div>
      </div>

      {/* Muscular SVG Graphic */}
      <div className="w-full flex-1 flex items-center justify-center my-4 select-none relative">
        <svg
          viewBox="0 0 200 400"
          className="w-full max-w-[280px] h-[360px] drop-shadow-sm transition-all"
        >
          {/* Mannequin Background Frame (Outline of body) */}
          <path
            d="M100,30 C76,30 76,55 76,65 L72,85 L52,90 L40,110 L44,152 L36,168 L42,208 L48,208 L62,208 L76,204 L80,208 L72,280 L74,346 L82,346 L86,280 L100,280 L114,280 L118,346 L126,346 L128,280 L120,208 L138,204 L152,208 L158,208 L164,208 L158,168 L160,152 L150,110 L128,90 L124,85 L120,65 C120,55 124,30 100,30 Z"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="2"
            className="transition-all"
          />

          {/* Mannequin Head (Visual background) */}
          <circle cx="100" cy="48" r="16" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="88" y1="64" x2="112" y2="64" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Interactive Muscle Path Layers */}
          {activeMuscles.map((muscle) => {
            const isSelected = selectedMuscleId === muscle.id;
            return (
              <path
                key={muscle.id}
                d={muscle.path}
                onClick={() => onSelectMuscle(muscle.id)}
                className={`cursor-pointer transition-all duration-300 stroke-[1.5] ${
                  isSelected
                    ? "fill-blue-600/90 stroke-blue-700 filter drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]"
                    : "fill-blue-500/10 stroke-blue-500/35 hover:fill-blue-500/30 hover:stroke-blue-500/60"
                }`}
              >
                <title>{muscle.name}</title>
              </path>
            );
          })}
        </svg>
      </div>

      {/* Cybernetic HUD overlay */}
      <div className="flex w-full justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[9px] font-mono text-slate-500">
        <span>VIEWPORT: FRONT_ALIGNED</span>
        <span className="flex items-center gap-1.5 text-blue-600 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          CALIBRATION: ONLINE
        </span>
      </div>
    </div>
  );
}
