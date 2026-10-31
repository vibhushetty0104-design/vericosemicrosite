import React from 'react';

interface EditorialTextRevealProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  staggerMs?: number;
  initialDelayMs?: number;
  id?: string;
}

/**
 * EditorialTextReveal
 *
 * Smooth, editorial word-by-word text reveal:
 * - Uses inline-block spans with natural whitespace to prevent Cumulative Layout Shift (CLS).
 * - Full sentence announced to assistive technology via aria-label without fragmented letters.
 * - Under prefers-reduced-motion, animation is bypassed and rendered immediately static.
 */
export const EditorialTextReveal: React.FC<EditorialTextRevealProps> = ({
  text,
  className = '',
  tag: Tag = 'h1',
  staggerMs = 50,
  initialDelayMs = 40,
  id,
}) => {
  const words = text.split(' ');

  return (
    <Tag
      id={id}
      aria-label={text}
      className={`relative ${className}`}
    >
      <span aria-hidden="true" className="inline">
        {words.map((word, idx) => (
          <span
            key={`${word}-${idx}`}
            className="inline-block whitespace-nowrap editorial-word-reveal"
            style={{
              animationDelay: `${initialDelayMs + idx * staggerMs}ms`,
            }}
          >
            {word}
            {idx < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
};
