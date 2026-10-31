/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, RotateCcw, Info, ArrowUp, CheckCircle2 } from 'lucide-react';
import { Vascular3DViewer } from '../simulation/3d/Vascular3DViewer';
import { ANATOMICAL_STRUCTURES, AnatomicalStructure } from '../simulation/3d/LegAnatomy3D';

interface LegCirculationExplorer3DProps {
  className?: string;
}

export const LegCirculationExplorer3D: React.FC<LegCirculationExplorer3DProps> = ({
  className = '',
}) => {
  const [selectedId, setSelectedId] = useState<string | null>('gsv');
  const [cameraResetKey, setCameraResetKey] = useState<number>(0);
  const [visibleLayers, setVisibleLayers] = useState({
    muscles: true,
    deepVeins: true,
    superficialVeins: true,
    perforators: true,
    valves: true,
  });

  const selectedStructure: AnatomicalStructure | null = selectedId
    ? ANATOMICAL_STRUCTURES[selectedId] ?? null
    : null;

  const handleResetCamera = () => {
    setCameraResetKey((prev) => prev + 1);
  };

  const toggleLayer = (layerKey: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  return (
    <section
      id="explore-circulation"
      aria-labelledby="explore-circulation-title"
      className={`rounded-3xl border border-mv-outline/70 bg-white p-6 sm:p-8 lg:p-10 shadow-card ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-mv-outline/50 pb-6 mb-7">
        <div className="max-w-[48rem]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest font-mono text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5">
            <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
            <span>SECTION 01 &bull; 3D LOWER-LIMB ANATOMY</span>
          </div>
          <h2
            id="explore-circulation-title"
            className="font-serif text-[26px] sm:text-[32px] lg:text-[36px] font-semibold text-mv-forest leading-[1.18] tracking-[-0.015em]"
          >
            Explore Leg Circulation: How Blood Returns Against Gravity
          </h2>
          <p className="mt-2.5 text-[15px] sm:text-[16px] leading-relaxed text-mv-ink-muted">
            Unlike arteries pressurized by the heart’s beat, veins in your legs rely on a cooperative system of deep veins, superficial veins, connecting perforators, and the calf muscle pump to return deoxygenated blood upward.
          </p>
        </div>

        {/* Camera Reset */}
        <button
          type="button"
          onClick={handleResetCamera}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-mv-ivory hover:bg-mv-pale border border-mv-outline/60 text-mv-forest text-[13px] font-medium transition-colors cursor-pointer self-start md:self-auto shrink-0 shadow-2xs"
          title="Reset 3D camera to default position"
        >
          <RotateCcw className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Main Interactive Stage: 3D Viewport (Left) + Structure Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-stretch">
        
        {/* Left Column: 3D Canvas with Layer Toggles */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Layer Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-mv-ivory border border-mv-outline/60 mb-3">
            <span className="text-[11.5px] font-mono uppercase tracking-wider text-mv-ink-muted px-1.5 font-semibold">
              Filter Layers:
            </span>
            {[
              { key: 'muscles', label: 'Calf Muscles' },
              { key: 'deepVeins', label: 'Deep Veins' },
              { key: 'superficialVeins', label: 'Superficial GSV' },
              { key: 'perforators', label: 'Perforators' },
            ].map((layer) => {
              const isVisible = visibleLayers[layer.key as keyof typeof visibleLayers];
              return (
                <button
                  key={layer.key}
                  type="button"
                  onClick={() => toggleLayer(layer.key as keyof typeof visibleLayers)}
                  className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-all cursor-pointer ${
                    isVisible
                      ? 'bg-mv-forest text-white border-mv-forest shadow-2xs'
                      : 'bg-white text-mv-ink-muted border-mv-outline/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  {layer.label}
                </button>
              );
            })}
          </div>

          {/* 3D Viewport */}
          <div className="relative flex-1 rounded-2xl border border-mv-outline/60 overflow-hidden shadow-inner min-h-[420px] sm:min-h-[460px] lg:min-h-[500px]">
            <Vascular3DViewer
              mode="explore"
              selectedStructureId={selectedId}
              onSelectStructure={setSelectedId}
              visibleLayers={visibleLayers}
              cameraResetKey={cameraResetKey}
              isVaricose={false}
            />

            {/* Canvas Hint */}
            <div className="pointer-events-none absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/85 backdrop-blur-xs border border-mv-outline/50 text-mv-forest text-[11px] font-mono shadow-xs">
              <span>Drag to rotate &bull; Scroll to zoom &bull; Click structures</span>
            </div>

            {/* Normal Upward Flow Indicator */}
            <div className="pointer-events-none absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-mv-outline/50 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" aria-hidden="true" />
              <ArrowUp className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
              <span className="font-mono text-[11.5px] font-bold text-mv-forest uppercase">
                Normal Heartward Flow
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Progressive Disclosure Structure Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="rounded-2xl bg-[#FAF8F3] border border-mv-outline/60 p-6 sm:p-7 shadow-xs">
            
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-mv-forest" aria-hidden="true" />
              <span className="font-mono text-[11.5px] font-bold tracking-wider uppercase text-mv-ink-muted">
                Anatomical Structure Detail
              </span>
            </div>

            <h3 className="font-serif text-[23px] sm:text-[25px] font-semibold text-mv-forest leading-snug">
              {selectedStructure ? selectedStructure.name : 'Select a Structure to Inspect'}
            </h3>

            <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.65] text-mv-ink">
              {selectedStructure
                ? selectedStructure.description
                : 'Click any vein or muscle in the 3D model, or select from the options below, to inspect its role in circulation.'}
            </p>

            {selectedStructure && (
              <div className="mt-5 p-4.5 rounded-xl bg-white border border-mv-outline/50 space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-mv-terracotta font-semibold block">
                  Function in Leg Circulation
                </span>
                <p className="text-[14px] text-mv-ink leading-relaxed">
                  {selectedStructure.clinicalNote}
                </p>
              </div>
            )}

            {/* Quick Structure Selector Buttons */}
            <div className="mt-6 pt-4 border-t border-mv-outline/50">
              <span className="font-mono text-[11px] uppercase tracking-wider text-mv-ink-muted block mb-2.5">
                Quick Select Anatomy:
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.values(ANATOMICAL_STRUCTURES).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-all cursor-pointer ${
                      selectedId === item.id
                        ? 'bg-mv-forest text-white border-mv-forest shadow-2xs'
                        : 'bg-white hover:bg-mv-pale/50 text-mv-forest border-mv-outline/60'
                    }`}
                  >
                    {item.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Flow Direction Summary Pill */}
            <div className="mt-6 pt-4 border-t border-mv-outline/50 flex items-center gap-3 text-[13px] text-mv-ink-muted">
              <CheckCircle2 className="w-4 h-4 text-mv-forest shrink-0" aria-hidden="true" />
              <span>
                <strong>Direction of travel:</strong> Blood in healthy veins flows strictly upward from foot to groin, and inward from superficial to deep veins.
              </span>
            </div>

          </div>

          {/* Educational Disclaimer */}
          <div className="mt-4 p-4 rounded-xl bg-mv-pale/40 border border-mv-outline/50 flex items-start gap-3">
            <Info className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12.5px] leading-relaxed text-mv-ink-muted">
              <strong>Educational anatomical visualization.</strong> Simplified for learning; not intended for diagnosis or treatment decisions.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
