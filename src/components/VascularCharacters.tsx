import React from 'react';

interface CharacterProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
  badgePosition?: 'top' | 'bottom';
}

/**
 * Valvy — The Venous Valve Companion
 * Symbolizes healthy, one-way bicuspid valve leaflets preventing backward venous reflux.
 * Restrained medical aesthetic: botanical teal, forest pine, warm ivory, subtle terracotta flow dot.
 */
export const ValvyCharacter: React.FC<CharacterProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
  badgePosition = 'bottom',
}) => {
  const sizeMap = {
    sm: { w: 60, h: 64, badge: 'text-[9.5px]' },
    md: { w: 84, h: 90, badge: 'text-[10.5px]' },
    lg: { w: 108, h: 116, badge: 'text-[11.5px]' },
  };
  const current = sizeMap[size];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none flex flex-col items-center animate-float-valvy ${className}`}
    >
      {showBadge && badgePosition === 'top' && (
        <span className={`mb-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EDE8]/95 border border-[#0A3B32]/15 text-[#0A3B32] font-mono font-semibold tracking-wider uppercase shadow-xs ${current.badge}`}>
          Valvy · 1-Way Flow
        </span>
      )}

      <svg
        width={current.w}
        height={current.h}
        viewBox="0 0 100 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_12px_rgba(10,59,50,0.12)]"
      >
        {/* Vein Wall Guide Lines */}
        <path
          d="M16 10 C16 40, 14 70, 16 98"
          stroke="#0A3B32"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.25"
        />
        <path
          d="M84 10 C84 40, 86 70, 84 98"
          stroke="#0A3B32"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.25"
        />

        {/* Upward Laminar Flow Streamline */}
        <path
          d="M50 94 L50 78"
          stroke="#C85A3F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <polygon points="50,70 46,76 54,76" fill="#C85A3F" />

        {/* Left Bicuspid Valve Leaflet */}
        <path
          d="M20 54 C30 52, 44 44, 48 30 C45 36, 35 44, 20 46 Z"
          fill="#1D6356"
          stroke="#0A3B32"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right Bicuspid Valve Leaflet */}
        <path
          d="M80 54 C70 52, 56 44, 52 30 C55 36, 65 44, 80 46 Z"
          fill="#1D6356"
          stroke="#0A3B32"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Valve Core Body (Friendly Guardian Capsule) */}
        <rect
          x="32"
          y="20"
          width="36"
          height="44"
          rx="18"
          fill="#FAF7F2"
          stroke="#0A3B32"
          strokeWidth="2.5"
        />

        {/* Soft Cheeks Accent */}
        <ellipse cx="39" cy="44" rx="3.5" ry="2" fill="#C85A3F" fillOpacity="0.3" />
        <ellipse cx="61" cy="44" rx="3.5" ry="2" fill="#C85A3F" fillOpacity="0.3" />

        {/* Calm Smiling Eyes */}
        <path
          d="M40 37 Q44 33 46 37"
          stroke="#0A3B32"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M54 37 Q56 33 60 37"
          stroke="#0A3B32"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Gentle Understated Smile */}
        <path
          d="M47 45 Q50 49 53 45"
          stroke="#0A3B32"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Little Leaflet Cap (Protective Crown) */}
        <path
          d="M44 14 C47 8, 53 8, 56 14 C53 17, 47 17, 44 14 Z"
          fill="#1D6356"
          stroke="#0A3B32"
          strokeWidth="1.5"
        />
      </svg>

      {showBadge && badgePosition === 'bottom' && (
        <span className={`mt-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EDE8]/95 border border-[#0A3B32]/15 text-[#0A3B32] font-mono font-semibold tracking-wider uppercase shadow-xs ${current.badge}`}>
          Valvy · 1-Way Flow
        </span>
      )}
    </div>
  );
};

/**
 * Hemo — The Friendly Red Blood Cell Companion
 * Symbolizes oxygen-depleted erythrocytes moving smoothly against gravity toward the heart.
 * Restrained medical aesthetic: warm terracotta, soft ivory, understated serene face.
 */
export const HemoCharacter: React.FC<CharacterProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
  badgePosition = 'bottom',
}) => {
  const sizeMap = {
    sm: { w: 60, h: 64, badge: 'text-[9.5px]' },
    md: { w: 80, h: 86, badge: 'text-[10.5px]' },
    lg: { w: 104, h: 110, badge: 'text-[11.5px]' },
  };
  const current = sizeMap[size];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none flex flex-col items-center animate-float-hemo ${className}`}
    >
      {showBadge && badgePosition === 'top' && (
        <span className={`mb-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#C85A3F]/20 text-[#A7452D] font-mono font-semibold tracking-wider uppercase shadow-xs ${current.badge}`}>
          Hemo · Returning Upward
        </span>
      )}

      <svg
        width={current.w}
        height={current.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_12px_rgba(200,90,63,0.18)]"
      >
        {/* Trailing Micro-Flow Bubbles */}
        <circle cx="28" cy="82" r="3" fill="#FAF7F2" stroke="#0A3B32" strokeWidth="1.2" strokeOpacity="0.3" />
        <circle cx="36" cy="90" r="2" fill="#E5EDE8" stroke="#0A3B32" strokeWidth="1" strokeOpacity="0.25" />

        {/* Erythrocyte Biconcave Outer Disk */}
        <ellipse
          cx="50"
          cy="48"
          rx="38"
          ry="32"
          fill="#C85A3F"
          stroke="#0A3B32"
          strokeWidth="2.5"
        />

        {/* Erythrocyte Inner Dimple (Biconcave Contour) */}
        <ellipse
          cx="50"
          cy="48"
          rx="24"
          ry="19"
          fill="#FAF7F2"
          stroke="#A7452D"
          strokeWidth="1.5"
        />

        {/* Friendly Serene Eyes */}
        <circle cx="43" cy="45" r="2.2" fill="#0A3B32" />
        <circle cx="57" cy="45" r="2.2" fill="#0A3B32" />

        {/* Quiet Friendly Smile */}
        <path
          d="M47 52 Q50 56 53 52"
          stroke="#0A3B32"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Warm Cheek Highlight */}
        <ellipse cx="38" cy="50" rx="2.5" ry="1.5" fill="#C85A3F" fillOpacity="0.3" />
        <ellipse cx="62" cy="50" rx="2.5" ry="1.5" fill="#C85A3F" fillOpacity="0.3" />

        {/* Upward Flow Direction Indicator */}
        <path
          d="M50 14 L50 6"
          stroke="#0A3B32"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        <polygon points="50,2 47,8 53,8" fill="#0A3B32" fillOpacity="0.6" />
      </svg>

      {showBadge && badgePosition === 'bottom' && (
        <span className={`mt-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#C85A3F]/20 text-[#A7452D] font-mono font-semibold tracking-wider uppercase shadow-xs ${current.badge}`}>
          Hemo · Returning Upward
        </span>
      )}
    </div>
  );
};

/**
 * Flux — The Laminar Flow Circulation Companion
 * Symbolizes smooth, non-turbulent venous return and clear vein lumens.
 * Restrained medical aesthetic: deep pine, soft sage, warm ivory.
 */
export const FluxCharacter: React.FC<CharacterProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
  badgePosition = 'bottom',
}) => {
  const sizeMap = {
    sm: { w: 60, h: 64, badge: 'text-[9.5px]' },
    md: { w: 80, h: 86, badge: 'text-[10.5px]' },
    lg: { w: 100, h: 108, badge: 'text-[11.5px]' },
  };
  const current = sizeMap[size];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none flex flex-col items-center animate-float-flux ${className}`}
    >
      {showBadge && badgePosition === 'top' && (
        <span className={`mb-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EDE8] border border-[#0A3B32]/15 text-[#0A3B32] font-mono font-semibold tracking-wider uppercase shadow-xs ${current.badge}`}>
          Flux · Laminar Flow
        </span>
      )}

      <svg
        width={current.w}
        height={current.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_12px_rgba(10,59,50,0.12)]"
      >
        {/* Flow Drop Ribbon Silhouette */}
        <path
          d="M50 14 C34 32, 22 52, 24 68 C26 84, 40 92, 50 92 C60 92, 74 84, 76 68 C78 52, 66 32, 50 14 Z"
          fill="#FAF7F2"
          stroke="#0A3B32"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Laminar Contour Lines */}
        <path
          d="M34 66 C36 78, 44 84, 50 84 C56 84, 64 78, 66 66"
          stroke="#1D6356"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Gentle Eyes */}
        <path
          d="M40 56 Q43 52 46 56"
          stroke="#0A3B32"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M54 56 Q57 52 60 56"
          stroke="#0A3B32"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Gentle Smile */}
        <path
          d="M47 64 Q50 67 53 64"
          stroke="#0A3B32"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Sage Inner Glow Core */}
        <circle cx="50" cy="40" r="5" fill="#E5EDE8" />
      </svg>

      {showBadge && badgePosition === 'bottom' && (
        <span className={`mt-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EDE8] border border-[#0A3B32]/15 text-[#0A3B32] font-mono font-semibold tracking-wider uppercase shadow-xs ${current.badge}`}>
          Flux · Laminar Flow
        </span>
      )}
    </div>
  );
};
