import React, { useEffect, useState } from 'react';
import { MERIDBOT_POSES, MeridbotPose } from '../../content/meridbot';
import './meridbot.css';

/*
 * Meridbot avatar. The pose PNGs share a 578×432 canvas with the figure at the same place in every
 * pose (x 128–408, y 64–368), so the figure is cropped with CSS rather than with edited copies of
 * the artwork, and swapping poses never makes the character jump.
 */
const CROP = { x: 120, y: 52, w: 300, h: 324 };
const CANVAS = { w: 578, h: 432 };

let preloaded = false;
function preloadPoses() {
  if (preloaded || typeof Image === 'undefined') return;
  preloaded = true;
  Object.values(MERIDBOT_POSES).forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });
}

interface MeridbotProps {
  pose: MeridbotPose;
  /** Rendered height in px; width follows the figure's proportions. */
  height: number;
  /** Increment to play one short wiggle (skipped under reduced motion). */
  wiggleKey?: number;
  /** Accessible description; omit when the avatar is decorative. */
  label?: string;
  className?: string;
}

export const Meridbot: React.FC<MeridbotProps> = ({ pose, height, wiggleKey = 0, label, className = '' }) => {
  const [wiggling, setWiggling] = useState(false);

  useEffect(() => {
    preloadPoses();
  }, []);

  useEffect(() => {
    if (!wiggleKey) return;
    setWiggling(true);
    const t = window.setTimeout(() => setWiggling(false), 600);
    return () => window.clearTimeout(t);
  }, [wiggleKey]);

  const k = height / CROP.h;
  return (
    <span
      className={`mv-bot ${wiggling ? 'is-wiggling' : ''} ${className}`}
      style={{ width: Math.round(CROP.w * k), height }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <img
        src={MERIDBOT_POSES[pose]}
        alt=""
        draggable={false}
        decoding="async"
        width={Math.round(CANVAS.w * k)}
        height={Math.round(CANVAS.h * k)}
        style={{ left: Math.round(-CROP.x * k), top: Math.round(-CROP.y * k) }}
      />
    </span>
  );
};
