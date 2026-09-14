import React from 'react';
import { DashboardStats, TabKey } from '../types';
import {
  Building,
  Dog,
  Users,
  AlertTriangle,
  Play,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { HeroSection } from '../components/HeroSection';

interface OverviewViewProps {
  stats: DashboardStats | null;
  isRunningEngine: boolean;
  onRunMatchEngine: () => void;
  onNavigateTab: (tab: TabKey) => void;
  isLoading: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  isRunningEngine,
  onRunMatchEngine,
  onNavigateTab,
  isLoading,
}) => {
  if (isLoading && !stats) {
    return (
      <div className="w-full flex items-center justify-center py-28 text-[#78716C]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#E59F4C]" />
          <span className="text-sm font-medium">Gathering sanctuary metrics...</span>
        </div>
      </div>
    );
  }

  const occupancyPct = stats?.occupancy_pct ?? 0;
  const kennelsUsed = stats?.kennels_used ?? 0;
  const kennelsTotal = stats?.kennels_total ?? 0;
  const available = stats?.available_animals ?? 0;
  const pending = stats?.pending_animals ?? 0;
  const placed = stats?.placed_animals ?? 0;
  const activeApplicants = stats?.active_applicants ?? 0;
  const openEscalations = stats?.open_escalations ?? 0;

  return (
    <div className="w-full space-y-10 pb-16">
      {/* Fullscreen Video Hero Section (Where woman and dogs are playing and are happy) */}
      <HeroSection
        onRunMatchEngine={onRunMatchEngine}
        isRunningEngine={isRunningEngine}
        onNavigateTab={onNavigateTab}
        availableCount={available}
        occupancyPct={occupancyPct}
        placedCount={placed}
      />

      {/* Operational Census Section with Digital Wellness Styling */}
      <div id="operations-census-section" className="w-full space-y-6 reveal-on-scroll">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EFE8]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-reenie text-3xl text-[#78716C] leading-none">
                daily sanctuary rhythm ~
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292524]">
              Shelter operations & living census.
            </h2>
            <p className="text-sm text-[#78716C] mt-1 max-w-2xl">
              Real-time kennel occupancy, behavioral triage, and applicant pipeline at Sunnydale Rescue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="run-match-engine-btn"
              type="button"
              onClick={onRunMatchEngine}
              disabled={isRunningEngine}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#E59F4C] hover:bg-[#d88f3a] active:bg-[#c87e2b] disabled:opacity-60 text-[#292524] text-sm font-semibold rounded-full shadow-wellness transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {isRunningEngine ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#292524]" />
                  <span>Computing pairings...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run match engine</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Stat Cards in 2rem to 4rem Border-Radius Containers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {/* Card 1: Kennel Occupancy (Sage Accent) */}
          <div className="bg-[#FDFCF8] p-6 rounded-[2rem] border border-[#E8EFE8] shadow-wellness hover:border-[#d8e5d8] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Kennel occupancy
              </span>
              <span className="p-2 rounded-2xl bg-[#E8EFE8] text-[#292524]">
                <Building className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-[#292524]">
                  {occupancyPct}%
                </span>
                <span className="text-xs text-[#78716C] font-medium">
                  {kennelsUsed} of {kennelsTotal} beds
                </span>
              </div>
              {/* Occupancy bar */}
              <div className="w-full bg-[#E8EFE8]/70 h-2.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    occupancyPct > 90
                      ? 'bg-amber-600'
                      : occupancyPct > 75
                      ? 'bg-amber-400'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                />
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8EFE8] flex items-center justify-between text-xs text-[#78716C]">
              <span>{kennelsTotal - kennelsUsed} spaces open</span>
              <button
                type="button"
                onClick={() => onNavigateTab('animals')}
                className="text-[#292524] hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View roster</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Companion Animals Census (Lavender Accent) */}
          <div className="bg-[#FDFCF8] p-6 rounded-[2rem] border border-[#EFEDF4] shadow-wellness hover:border-[#e2ddec] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Available animals
              </span>
              <span className="p-2 rounded-2xl bg-[#EFEDF4] text-[#292524]">
                <Dog className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-[#292524]">
                  {available}
                </span>
                <span className="text-xs text-emerald-800 font-medium px-2 py-0.5 rounded-full bg-emerald-50">
                  Ready for homes
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-[#78716C]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> {pending} pending
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {placed} adopted
                </span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-[#EFEDF4] flex items-center justify-between text-xs text-[#78716C]">
              <span>Total census: {available + pending + placed}</span>
              <button
                type="button"
                onClick={() => onNavigateTab('matches')}
                className="text-[#292524] hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Match board</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Active Foster & Adopter Applicants (Amber Accent) */}
          <div className="bg-[#FDFCF8] p-6 rounded-[2rem] border border-[#E59F4C]/40 shadow-wellness hover:border-[#E59F4C] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Active applicants
              </span>
              <span className="p-2 rounded-2xl bg-[#E59F4C]/30 text-[#292524]">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-[#292524]">
                  {activeApplicants}
                </span>
                <span className="text-xs text-indigo-800 font-medium px-2 py-0.5 rounded-full bg-[#EFEDF4]">
                  Fosters & adopters
                </span>
              </div>
              <p className="text-xs text-[#78716C] mt-2 line-clamp-2">
                Verified background profiles ready for compatibility pairing.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E59F4C]/30 flex items-center justify-between text-xs text-[#78716C]">
              <span className="font-reenie text-xl text-[#78716C]">growing network</span>
              <button
                type="button"
                onClick={() => onNavigateTab('applicants')}
                className="text-[#292524] hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Review list</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 4: Open Escalations (Care alerts) */}
          <div
            className={`p-6 rounded-[2rem] border shadow-wellness flex flex-col justify-between transition-all group ${
              openEscalations > 0
                ? 'bg-[#FDFCF8] border-amber-300'
                : 'bg-[#FDFCF8] border-[#E8EFE8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Open care alerts
              </span>
              <span
                className={`p-2 rounded-2xl ${
                  openEscalations > 0
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-[#E8EFE8] text-[#292524]'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-[#292524]">
                  {openEscalations}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    openEscalations > 0
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {openEscalations > 0 ? 'Requires attention' : 'All clear'}
                </span>
              </div>
              <p className="text-xs text-[#78716C] mt-2 line-clamp-2">
                {openEscalations > 0
                  ? 'High-priority medical and behavioral flags pending resolution.'
                  : 'All shelter incidents and medical holds currently resolved.'}
              </p>
            </div>
            <div
              className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
                openEscalations > 0 ? 'border-amber-200' : 'border-[#E8EFE8]'
              }`}
            >
              <span className={openEscalations > 0 ? 'text-amber-900 font-semibold' : 'text-[#78716C]'}>
                {openEscalations > 0 ? 'Urgent care' : 'Peaceful status'}
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('escalations')}
                className="text-[#292524] hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Open alerts</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Holistic Sanctuary Life & Coordination Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* 2-Column Life Cycle Guide (2.5rem radius) */}
          <div className="lg:col-span-2 bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-7 sm:p-8 shadow-wellness">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8EFE8]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#E8EFE8] flex items-center justify-center text-[#292524]">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#292524]">
                  Gentle sanctuary coordination cycle.
                </h3>
              </div>
              <span className="font-reenie text-2xl text-[#78716C]">intentional matching</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-5 rounded-[1.8rem] bg-[#E8EFE8]/50 border border-[#E8EFE8] space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8EFE8] text-[#292524]">
                  01 · Roster intake
                </span>
                <h4 className="text-sm font-semibold text-[#292524]">Mindful assessment</h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Medical examinations, energy levels, and behavioral tagging clarify special needs before placement.
                </p>
              </div>

              <div className="p-5 rounded-[1.8rem] bg-[#EFEDF4]/60 border border-[#EFEDF4] space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#EFEDF4] text-[#292524]">
                  02 · Harmony engine
                </span>
                <h4 className="text-sm font-semibold text-[#292524]">Compatibility scoring</h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Calculates harmony between applicant lifestyle, outdoor yard access, and the dog's temperament.
                </p>
              </div>

              <div className="p-5 rounded-[1.8rem] bg-[#E59F4C]/20 border border-[#E59F4C]/30 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#E59F4C]/30 text-[#292524]">
                  03 · Forever outreach
                </span>
                <h4 className="text-sm font-semibold text-[#292524]">Tender connections</h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Generates compassionate communications and tracks home visits for stress-free adoptions.
                </p>
              </div>
            </div>
          </div>

          {/* Sanctuary Notice Card (Radius: 2.5rem, Soft Black #292524 Theme with Warm Amber Accent) */}
          <div className="bg-[#292524] text-[#FDFCF8] rounded-[2.5rem] p-7 sm:p-8 shadow-wellness flex flex-col justify-between relative overflow-hidden">
            {/* Soft decorative background glow */}
            <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#E59F4C]/15 blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-[#E59F4C] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Sanctuary harmony note</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#FDFCF8] mb-2">
                Compassionate kennel triage.
              </h3>
              <p className="text-xs text-[#EFEDF4]/80 leading-relaxed">
                Current shelter capacity is operating at {occupancyPct}%. Pairing companions with approved foster families prevents stress and creates calm environments for recovery.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="font-reenie text-2xl text-[#E59F4C]">sunnydale rescue</span>
              <button
                type="button"
                onClick={() => onNavigateTab('escalations')}
                className="text-xs font-semibold text-[#E59F4C] hover:text-[#f3c27e] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>View {openEscalations} care notes</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
