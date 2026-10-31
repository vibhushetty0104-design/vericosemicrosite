import React, { useEffect, useRef, useState } from 'react';

/**
 * LivingMeridianBackground
 *
 * A signature living background inspired by branching vascular pathways.
 * - Deep forest-green foundation (#0B4036).
 * - Extended branching network of deep venous trunks, superficial saphenous channels,
 *   and communicating perforators in subtle sage (#8DAA9D / #E4ECE6).
 * - Restrained terracotta highlights (#CE5B40) at valvular junctions.
 * - Luminous circulation pulses travelling smoothly along anatomical vessel paths.
 * - Gentle ambient depth gradients without layout shift or text contrast competition.
 * - Performance: pauses animation when tab is inactive or element is off-screen.
 * - Accessibility: full static fallback for prefers-reduced-motion.
 */
export const LivingMeridianBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    const el = containerRef.current;
    if (!el) return;

    // Pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    // Pause when browser tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsPaused(!inView);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      style={{
        // Global pause control when off-screen or tab is hidden
        ['--meridian-play-state' as any]: isPaused ? 'paused' : 'running',
      }}
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {/* Subtle vascular radial glow for deep organic warmth */}
          <radialGradient id="meridian-glow-forest" cx="72%" cy="32%" r="55%">
            <stop offset="0%" stopColor="#145D4F" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#0B4036" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0B4036" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="meridian-glow-ambient" cx="25%" cy="65%" r="45%">
            <stop offset="0%" stopColor="#0E463B" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#0B4036" stopOpacity="0" />
          </radialGradient>

          {/* Gentle terracotta node glow */}
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#CE5B40" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#CE5B40" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#CE5B40" stopOpacity="0" />
          </radialGradient>

          {/* Luminous circulation pulse gradients */}
          <radialGradient id="terracotta-pulse-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F7F5EF" stopOpacity="1" />
            <stop offset="30%" stopColor="#CE5B40" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#A9472F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#CE5B40" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sage-pulse-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#E4ECE6" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#8DAA9D" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8DAA9D" stopOpacity="0" />
          </radialGradient>

          {/* Soft blur filter for luminous pulses */}
          <filter id="meridian-pulse-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Ambient atmospheric depth layers */}
        <rect width="100%" height="100%" fill="url(#meridian-glow-forest)" />
        <rect width="100%" height="100%" fill="url(#meridian-glow-ambient)" />

        {/* Background vascular branching pathways */}
        <g className="meridian-pathways">
          {/* Main deep venous trunk line (calm ascending flow) */}
          <path
            id="vessel-deep-trunk"
            d="M 980 950 C 960 780, 930 620, 970 440 C 990 350, 1060 260, 1100 80"
            stroke="#8DAA9D"
            strokeWidth="2.75"
            strokeLinecap="round"
            className="meridian-trunk-main"
          />

          {/* Secondary superficial channel (GSV analog) */}
          <path
            id="vessel-superficial-gsv"
            d="M 820 920 C 840 760, 890 640, 970 440"
            stroke="#E4ECE6"
            strokeWidth="1.85"
            strokeLinecap="round"
            className="meridian-tributary"
          />

          {/* Lower calf tributary feeder A */}
          <path
            id="vessel-calf-feeder-a"
            d="M 890 940 C 905 850, 925 720, 945 560"
            stroke="#8DAA9D"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="meridian-branch-left"
          />

          {/* Lower calf tributary feeder B */}
          <path
            id="vessel-calf-feeder-b"
            d="M 1030 920 C 1010 820, 980 700, 945 560"
            stroke="#E4ECE6"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.18"
            className="meridian-branch-right"
          />

          {/* Lateral communicators & perforator branches */}
          <path
            id="vessel-perforator-lateral"
            d="M 970 440 C 1030 460, 1120 480, 1220 540"
            stroke="#8DAA9D"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="meridian-perforator"
          />
          <path
            id="vessel-perforator-medial"
            d="M 945 560 C 890 590, 830 640, 780 720"
            stroke="#E4ECE6"
            strokeWidth="1.35"
            strokeLinecap="round"
            className="meridian-branch-left"
          />
          <path
            id="vessel-branch-proximal"
            d="M 980 320 C 1040 300, 1120 270, 1190 220"
            stroke="#8DAA9D"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="meridian-branch-right"
          />
          <path
            d="M 1070 200 C 1130 180, 1180 150, 1240 100"
            stroke="#E4ECE6"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.16"
          />

          {/* Left subtle background pathway (adds depth across wide viewports without text competition) */}
          <path
            d="M 220 940 C 260 760, 240 580, 310 380 C 350 280, 420 180, 460 60"
            stroke="#8DAA9D"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.12"
            className="meridian-ambient-left"
          />
          <path
            d="M 310 380 C 240 430, 180 490, 120 590"
            stroke="#E4ECE6"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.08"
          />

          {/* LIVING CIRCULATION PULSES (Small luminous packets travelling along vessels) */}
          {!reducedMotion && !isPaused && (
            <g className="meridian-luminous-pulses">
              {/* Pulse 1: Deep trunk primary circulation (ascending) */}
              <circle r="4" fill="url(#terracotta-pulse-glow)" filter="url(#meridian-pulse-filter)">
                <animateMotion
                  dur="8.5s"
                  repeatCount="indefinite"
                  path="M 980 950 C 960 780, 930 620, 970 440 C 990 350, 1060 260, 1100 80"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              </circle>

              {/* Pulse 2: Secondary wave along deep trunk */}
              <circle r="3" fill="url(#sage-pulse-glow)" filter="url(#meridian-pulse-filter)">
                <animateMotion
                  dur="8.5s"
                  begin="4.2s"
                  repeatCount="indefinite"
                  path="M 980 950 C 960 780, 930 620, 970 440 C 990 350, 1060 260, 1100 80"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              </circle>

              {/* Pulse 3: Superficial GSV flow into SFJ */}
              <circle r="3.2" fill="url(#sage-pulse-glow)" filter="url(#meridian-pulse-filter)">
                <animateMotion
                  dur="7s"
                  begin="1.5s"
                  repeatCount="indefinite"
                  path="M 820 920 C 840 760, 890 640, 970 440"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              </circle>

              {/* Pulse 4: Calf tributary feeder upward flow */}
              <circle r="2.5" fill="url(#terracotta-pulse-glow)" filter="url(#meridian-pulse-filter)">
                <animateMotion
                  dur="9s"
                  begin="3s"
                  repeatCount="indefinite"
                  path="M 890 940 C 905 850, 925 720, 945 560"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              </circle>

              {/* Pulse 5: Outward lateral perforator pulse */}
              <circle r="2.4" fill="url(#sage-pulse-glow)" filter="url(#meridian-pulse-filter)">
                <animateMotion
                  dur="6.5s"
                  begin="2.8s"
                  repeatCount="indefinite"
                  path="M 970 440 C 1030 460, 1120 480, 1220 540"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              </circle>
            </g>
          )}

          {/* Vascular Junction Nodes with restrained Terracotta pulse */}
          {/* Main saphenofemoral junction (SFJ) analog */}
          <g transform="translate(970, 440)">
            <circle r="16" fill="url(#node-glow)" className="meridian-node-glow" />
            <circle r="4" fill="#CE5B40" className="meridian-node-core" />
          </g>

          {/* Deep mid-thigh perforator junction */}
          <g transform="translate(945, 560)">
            <circle r="12" fill="url(#node-glow)" className="meridian-node-glow-alt" />
            <circle r="3" fill="#CE5B40" className="meridian-node-core" />
          </g>

          {/* Proximal junction */}
          <g transform="translate(980, 320)">
            <circle r="12" fill="url(#node-glow)" className="meridian-node-glow" />
            <circle r="2.75" fill="#CE5B40" className="meridian-node-core" />
          </g>

          {/* Distal communicators */}
          <g transform="translate(1100, 260)">
            <circle r="8" fill="url(#node-glow)" className="meridian-node-glow-alt" />
            <circle r="2.2" fill="#CE5B40" className="meridian-node-core" />
          </g>
        </g>
      </svg>
    </div>
  );
};
