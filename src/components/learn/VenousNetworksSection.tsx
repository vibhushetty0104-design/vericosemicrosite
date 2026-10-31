/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ShieldCheck, ArrowRight, ArrowDownRight, Activity } from 'lucide-react';

interface VenousNetworksSectionProps {
  className?: string;
  onExploreAnatomyClick?: () => void;
}

export const VenousNetworksSection: React.FC<VenousNetworksSectionProps> = ({
  className = '',
  onExploreAnatomyClick,
}) => {
  const [activeNetwork, setActiveNetwork] = useState<'superficial' | 'deep' | 'perforator'>('superficial');

  return (
    <section
      id="venous-networks"
      aria-labelledby="venous-networks-title"
      className={`rounded-3xl border border-mv-outline/70 bg-white p-6 sm:p-8 lg:p-10 shadow-card ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-mv-outline/50 pb-6 mb-8">
        <div className="max-w-[48rem]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest font-mono text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5">
            <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
            <span>SECTION 03 &bull; VENOUS ARCHITECTURE</span>
          </div>
          <h2
            id="venous-networks-title"
            className="font-serif text-[26px] sm:text-[32px] lg:text-[36px] font-semibold text-mv-forest leading-[1.18] tracking-[-0.015em]"
          >
            The Three Venous Networks of the Lower Limb
          </h2>
          <p className="mt-2.5 text-[15px] sm:text-[16px] leading-relaxed text-mv-ink-muted">
            The lower limb is organized into three interconnected venous systems separated by the deep muscular fascia. Knowing which network is affected helps clinicians determine the right care pathway.
          </p>
        </div>

        {onExploreAnatomyClick && (
          <button
            type="button"
            onClick={onExploreAnatomyClick}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>View in 3D Explorer</span>
            <ArrowRight className="w-3.5 h-3.5 text-mv-terracotta" />
          </button>
        )}
      </div>

      {/* Cross-Section Architectural Diagram */}
      <div className="mb-10 rounded-2xl bg-[#FAF8F3] border border-mv-outline/60 p-6 sm:p-7">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
              Fascial Plane Cross-Section
            </span>
            <h3 className="font-serif text-[20px] sm:text-[22px] font-semibold text-mv-forest">
              How the Three Systems Connect
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-mv-ink-muted">
              Superficial veins sit just below the skin. Deep veins run protected beneath the tough deep fascia within the muscle. Perforators act as one-way bridges channeling blood inward from superficial into deep veins.
            </p>
          </div>

          {/* Clean SVG Architectural Diagram */}
          <div className="w-full max-w-[420px] shrink-0 bg-white rounded-xl p-4 border border-mv-outline/60 shadow-2xs">
            <svg viewBox="0 0 400 130" className="w-full h-auto">
              {/* Skin Layer */}
              <rect x="10" y="8" width="380" height="12" rx="4" fill="#EBD9D2" />
              <text x="20" y="17" fontSize="8.5" fill="#7A4B3D" fontWeight="bold">SKIN &amp; SUBCUTANEOUS FAT</text>

              {/* Superficial Vein (GSV) */}
              <rect x="40" y="26" width="120" height="18" rx="6" fill="#CE5B40" fillOpacity="0.2" stroke="#CE5B40" strokeWidth="2" />
              <text x="50" y="38" fontSize="8.5" fill="#A9472F" fontWeight="bold">Superficial Vein (GSV)</text>

              {/* Deep Muscular Fascia (Boundary Line) */}
              <line x1="10" y1="56" x2="390" y2="56" stroke="#0B4036" strokeWidth="2.5" strokeDasharray="5 4" />
              <text x="260" y="52" fontSize="8" fill="#0B4036" fontWeight="bold">DEEP MUSCULAR FASCIA</text>

              {/* Perforator Vein Crossing Fascia */}
              <path d="M 100,44 L 100,72 L 200,72" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
              <polygon points="190,69 200,72 190,75" fill="#D97706" />
              <text x="106" y="66" fontSize="7.5" fill="#B45309" fontWeight="bold">Perforator (Inward &rarr;)</text>

              {/* Deep Vein inside Muscle */}
              <rect x="10" y="76" width="380" height="46" rx="6" fill="#8DAA9D" fillOpacity="0.15" />
              <text x="20" y="116" fontSize="8" fill="#0B4036" fontWeight="bold">CALF MUSCLE COMPARTMENT</text>

              <rect x="200" y="84" width="160" height="22" rx="6" fill="#0B4036" fillOpacity="0.25" stroke="#0B4036" strokeWidth="2" />
              <text x="210" y="98" fontSize="8.5" fill="#0B4036" fontWeight="bold">Deep Vein (Popliteal / Tibial)</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Three Coordinated Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
        
        {/* Card 1: Superficial Venous System */}
        <article
          onClick={() => setActiveNetwork('superficial')}
          className={`p-6 sm:p-7 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeNetwork === 'superficial'
              ? 'bg-white border-mv-terracotta shadow-card ring-1 ring-mv-terracotta/30'
              : 'bg-white/80 border-mv-outline/60 hover:border-mv-outline hover:bg-white shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-mv-terracotta/10 text-mv-terracotta">
                Network 01
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-mv-ink-muted">
                Above Fascia
              </span>
            </div>

            <h3 className="font-serif text-[21px] sm:text-[23px] font-semibold text-mv-forest">
              Superficial Venous System
            </h3>

            <p className="mt-2.5 text-[14.5px] leading-relaxed text-mv-ink-muted">
              Located in the subcutaneous fat layer above the muscular fascia. Dominated by the <strong>Great Saphenous Vein (GSV)</strong> along the inner leg and the <strong>Small Saphenous Vein (SSV)</strong> behind the calf.
            </p>

            <div className="mt-5 space-y-2.5 pt-4 border-t border-mv-outline/50 text-[13px] text-mv-ink">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta shrink-0 mt-1.5" />
                <span><strong>Location:</strong> Directly under the skin without muscular support.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta shrink-0 mt-1.5" />
                <span><strong>Role:</strong> Drains blood from skin and superficial tissues (~10–15% of leg return).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta shrink-0 mt-1.5" />
                <span><strong>Clinical impact:</strong> Primary site of visible varicose veins and spider veins. Safely treated with laser (EVLA), RFA, or medical adhesive.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-mv-outline/50 font-mono text-[12px] font-bold text-mv-terracotta flex items-center justify-between">
            <span>Target of Varicose Vein Treatment</span>
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </article>

        {/* Card 2: Deep Venous System */}
        <article
          onClick={() => setActiveNetwork('deep')}
          className={`p-6 sm:p-7 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeNetwork === 'deep'
              ? 'bg-white border-mv-forest shadow-card ring-1 ring-mv-forest/30'
              : 'bg-white/80 border-mv-outline/60 hover:border-mv-outline hover:bg-white shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-mv-forest/10 text-mv-forest">
                Network 02
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-mv-ink-muted">
                Beneath Fascia
              </span>
            </div>

            <h3 className="font-serif text-[21px] sm:text-[23px] font-semibold text-mv-forest">
              Deep Venous System
            </h3>

            <p className="mt-2.5 text-[14.5px] leading-relaxed text-mv-ink-muted">
              Encased inside tight muscular compartments alongside major arteries (Popliteal, Femoral, and Tibial veins). Directly compressed by calf muscles during movement.
            </p>

            <div className="mt-5 space-y-2.5 pt-4 border-t border-mv-outline/50 text-[13px] text-mv-ink">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mv-forest shrink-0 mt-1.5" />
                <span><strong>Location:</strong> Deep inside muscular compartments beneath tough fascia.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mv-forest shrink-0 mt-1.5" />
                <span><strong>Role:</strong> Carries &gt;85% to 90% of total venous blood back to the heart.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mv-forest shrink-0 mt-1.5" />
                <span><strong>Clinical impact:</strong> Site of serious Deep Vein Thrombosis (DVT). These veins are vital highways and are never ablated or removed.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-mv-outline/50 font-mono text-[12px] font-bold text-mv-forest flex items-center justify-between">
            <span>Essential Highway &bull; Never Closed</span>
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </article>

        {/* Card 3: Perforating Veins */}
        <article
          onClick={() => setActiveNetwork('perforator')}
          className={`p-6 sm:p-7 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeNetwork === 'perforator'
              ? 'bg-white border-amber-600 shadow-card ring-1 ring-amber-600/30'
              : 'bg-white/80 border-mv-outline/60 hover:border-mv-outline hover:bg-white shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800">
                Network 03
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-mv-ink-muted">
                Piercing Fascia
              </span>
            </div>

            <h3 className="font-serif text-[21px] sm:text-[23px] font-semibold text-mv-forest">
              Perforating Veins
            </h3>

            <p className="mt-2.5 text-[14.5px] leading-relaxed text-mv-ink-muted">
              Connecting channels that pass through the deep fascia. Equipped with one-way valves directing blood strictly inward from superficial into deep veins.
            </p>

            <div className="mt-5 space-y-2.5 pt-4 border-t border-mv-outline/50 text-[13px] text-mv-ink">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span><strong>Location:</strong> Punctures through the muscular fascia at key anatomical levels.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span><strong>Role:</strong> Drains superficial blood inward to be propelled by the calf pump.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span><strong>Clinical impact:</strong> If valves fail, high deep pressure surges outward into skin veins, contributing to ankle swelling, skin staining, and venous ulcers.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-mv-outline/50 font-mono text-[12px] font-bold text-amber-800 flex items-center justify-between">
            <span>One-Way Flow: Superficial &rarr; Deep</span>
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </article>

      </div>
    </section>
  );
};
