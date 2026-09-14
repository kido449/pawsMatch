import React from 'react';

/**
 * Floating background ambient blobs with high-radius blurs (blur-[100px] to blur-[140px]),
 * looping on 6s cycles with translateY +/- 10px to create soft organic depth.
 * Colors: Sage (#E8EFE8), Lavender (#EFEDF4), Warm Amber (#E59F4C).
 */
export const AmbientBlobs: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Top Left: Gentle Sage Blob */}
      <div
        className="absolute -top-24 -left-20 w-[420px] h-[420px] rounded-full bg-[#E8EFE8] opacity-75 blur-[110px] animate-blob-1"
        style={{ willChange: 'transform' }}
      />

      {/* Top Right: Gentle Warm Amber Accent Blob */}
      <div
        className="absolute top-12 -right-24 w-[480px] h-[480px] rounded-full bg-[#E59F4C] opacity-25 blur-[130px] animate-blob-2"
        style={{ willChange: 'transform' }}
      />

      {/* Center Left: Lavender Blob */}
      <div
        className="absolute top-[45%] -left-32 w-[520px] h-[520px] rounded-full bg-[#EFEDF4] opacity-80 blur-[140px] animate-blob-3"
        style={{ willChange: 'transform' }}
      />

      {/* Bottom Right: Soft Sage / Peach Blend */}
      <div
        className="absolute bottom-10 right-[5%] w-[450px] h-[450px] rounded-full bg-[#E8EFE8] opacity-65 blur-[120px] animate-blob-1"
        style={{ willChange: 'transform' }}
      />

      {/* Bottom Center: Whispering Lavender */}
      <div
        className="absolute -bottom-24 left-[30%] w-[380px] h-[380px] rounded-full bg-[#EFEDF4] opacity-55 blur-[100px] animate-blob-2"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
