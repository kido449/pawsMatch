import React from 'react';
import { Sparkles, Heart, ArrowDown, Users, Dog, Sun } from 'lucide-react';
import { TabKey } from '../types';

interface HeroSectionProps {
  onRunMatchEngine?: () => void;
  isRunningEngine?: boolean;
  onNavigateTab?: (tab: TabKey) => void;
  availableCount?: number;
  occupancyPct?: number;
  placedCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRunMatchEngine,
  isRunningEngine = false,
  onNavigateTab,
  availableCount = 18,
  occupancyPct = 89,
  placedCount = 14,
}) => {
  const handleScrollDown = () => {
    const target = document.getElementById('operations-census-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-wellness-section"
      aria-label="Welcome to PawsMatch Sanctuary"
      className="relative w-full min-h-[82vh] md:min-h-[88vh] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-wellness mb-10 flex flex-col justify-between border border-[#E8EFE8] bg-[#FDFCF8] text-[#292524] select-none"
    >
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          src="/output.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center animate-tracking-camera transition-transform duration-1000 ease-out"
        />

        {/* Cinematic Golden Hour Lens Flare Overlay */}
        <div
          className="absolute -top-20 right-10 sm:right-28 w-96 h-96 rounded-full bg-gradient-to-br from-[#E59F4C]/40 via-[#F5A623]/20 to-transparent blur-3xl pointer-events-none animate-lens-flare mix-blend-screen"
          aria-hidden="true"
        />

        {/* Drifting Golden Sunlight Motes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-[#E59F4C]/70 blur-xs animate-mote-1" />
          <span className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-[#FFF4DC]/80 blur-xs animate-mote-2" />
          <span className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-[#E59F4C]/60 blur-xs animate-mote-3" />
        </div>

        {/* Balanced Composition: Subtle Negative Space on Left for Text Legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#292524]/90 via-[#292524]/35 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#292524]/85 via-[#292524]/35 to-transparent max-w-3xl"
          aria-hidden="true"
        />
        {/* Soft pastel ambient warmth wash */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#EFEDF4]/15 via-transparent to-[#E59F4C]/20 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Top Header Bar inside Hero */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-wrap items-center justify-between gap-4">
        {/* Sanctuary Pill Badge with Golden Hour Live Indicator */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FDFCF8]/90 backdrop-blur-md border border-[#E8EFE8] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E59F4C] animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-[#292524]">
            Sunnydale Sanctuary
          </span>
          <span className="text-xs text-[#78716C]">·</span>
          <span className="font-reenie text-xl text-[#292524] tracking-normal font-normal">
            golden hour meadow
          </span>
          <Sun className="w-3.5 h-3.5 text-[#E59F4C] ml-0.5" />
        </div>

      </div>

      {/* Main Hero Typography & Call-To-Action (Sentence-case only, 48px–96px) */}
      <div className="relative z-10 px-6 sm:px-10 md:px-14 py-8 max-w-4xl reveal-on-scroll">
        {/* Expressive Whimsical Cursive Accent */}
        <div className="flex items-center gap-3 mb-2 sm:mb-4">
          <span className="font-reenie text-4xl sm:text-5xl md:text-6xl text-[#E59F4C] font-normal leading-none drop-shadow-sm">
            where love has four paws and a wagging tail ~
          </span>
          <Sparkles className="w-5 h-5 text-[#E59F4C] shrink-0" />
        </div>

        {/* Primary Headline (Outfit font, 48px to 96px, sentence-case, tracking-tight) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#FDFCF8] tracking-[-0.025em] leading-[1.04] mb-4 sm:mb-6 drop-shadow-sm">
          Where gentle companions find their humans.
        </h1>

        {/* Narrative Description (Digital Wellness aesthetic) */}
        <p className="text-base sm:text-xl text-[#EFEDF4] max-w-2xl font-normal leading-relaxed mb-8 drop-shadow-xs">
          An intentional animal rescue hub prioritizing holistic well-being, compatibility-first matching, and loving lifelong foster connections.
        </p>

        {/* CTAs with Gen-Z Lifestyle & Digital Wellness Aesthetic */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {onRunMatchEngine && (
            <button
              id="hero-run-engine-btn"
              type="button"
              onClick={onRunMatchEngine}
              disabled={isRunningEngine}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#E59F4C] hover:bg-[#d88f3a] active:bg-[#c87e2b] text-[#292524] font-semibold text-sm sm:text-base tracking-tight shadow-wellness transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-[#292524] text-[#292524]" />
              <span>{isRunningEngine ? 'Processing match algorithms...' : 'Run compatibility engine'}</span>
            </button>
          )}

          {onNavigateTab && (
            <>
              <button
                id="hero-browse-roster-btn"
                type="button"
                onClick={() => onNavigateTab('animals')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-[#E8EFE8] hover:bg-[#dce7dc] text-[#292524] font-semibold text-sm sm:text-base tracking-tight transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <Dog className="w-4 h-4" />
                <span>Explore companion roster</span>
              </button>

              <button
                id="hero-view-applicants-btn"
                type="button"
                onClick={() => onNavigateTab('applicants')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-[#EFEDF4] hover:bg-[#e4dfed] text-[#292524] font-semibold text-sm sm:text-base tracking-tight transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <Users className="w-4 h-4" />
                <span>Foster & adopter network</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Ticker & Ambient Pill Metrics (Container radius: 2rem to 4rem) */}
      <div className="relative z-10 p-6 sm:p-10 border-t border-white/10 bg-[#292524]/40 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Micro Badges in Sage, Lavender, and Warm Amber */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[2rem] bg-[#E8EFE8] text-[#292524] text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>{occupancyPct}% sanctuary capacity</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[2rem] bg-[#EFEDF4] text-[#292524] text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>{placedCount} placed this cycle</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[2rem] bg-[#E59F4C] text-[#292524] text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-700" />
            <span>{availableCount} animals ready for home</span>
          </div>
        </div>

        {/* Soft Scroll Down Button */}
        <button
          type="button"
          onClick={handleScrollDown}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#FDFCF8] hover:text-[#E59F4C] transition-colors cursor-pointer group self-start md:self-auto"
        >
          <span>Scroll to operational metrics</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
