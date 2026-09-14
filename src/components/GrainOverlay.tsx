import React from 'react';

/**
 * Persistent 35% (0.35) opacity SVG fractal noise grain overlay
 * providing a tactile, paper-like feel for 'Digital Minimalism' & 'Digital Wellness'.
 */
export const GrainOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 w-full h-full select-none overflow-hidden"
      style={{ opacity: 0.35 }}
    >
      <svg
        className="w-full h-full opacity-100"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="fractal-noise-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0    0    0    1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#fractal-noise-grain)" fill="transparent" />
      </svg>
    </div>
  );
};
