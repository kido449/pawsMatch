import React, { useState } from 'react';
import { Animal, Applicant, Match, MatchStatus } from '../types';
import { Avatar } from '../components/Avatar';
import { MatchDetailModal } from '../components/MatchDetailModal';
import {
  GitPullRequest,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  Sparkles,
  Eye,
  Heart,
} from 'lucide-react';

interface MatchBoardViewProps {
  matches: Match[];
  animals: Animal[];
  applicants: Applicant[];
  isLoading: boolean;
}

const COLUMNS: { status: MatchStatus; label: string; pillColor: string; description: string }[] = [
  { status: 'proposed', label: 'Proposed', pillColor: 'bg-[#EFEDF4] text-[#292524] border-[#ded7e8]', description: 'Harmony scored matches' },
  { status: 'contacted', label: 'Contacted', pillColor: 'bg-[#E8EFE8] text-[#292524] border-[#d2dfd2]', description: 'Outreach in progress' },
  { status: 'interested', label: 'Interested', pillColor: 'bg-[#E59F4C]/25 text-[#292524] border-[#E59F4C]', description: 'Meet & greet scheduled' },
  { status: 'declined', label: 'Declined', pillColor: 'bg-[#FDFCF8] text-[#78716C] border-[#E8EFE8]', description: 'Alternative match needed' },
  { status: 'placed', label: 'Placed', pillColor: 'bg-emerald-100 text-emerald-900 border-emerald-300', description: 'Forever companion placed' },
];

export const MatchBoardView: React.FC<MatchBoardViewProps> = ({
  matches,
  animals,
  applicants,
  isLoading,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | number | null>(null);

  const animalMap = new Map<string | number, Animal>(
    animals.map((a) => [String(a.id), a])
  );
  const applicantMap = new Map<string | number, Applicant>(
    applicants.map((a) => [String(a.id), a])
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-[#E59F4C] text-[#292524] border-[#d88f3a] font-bold';
    if (score >= 75) return 'bg-[#E8EFE8] text-[#292524] border-[#d4e1d4] font-semibold';
    if (score >= 60) return 'bg-[#EFEDF4] text-[#292524] border-[#ddd7e9] font-medium';
    return 'bg-[#FDFCF8] text-[#78716C] border-[#E8EFE8]';
  };

  if (isLoading && matches.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-28 text-[#78716C]">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-[#E59F4C]" />
        <span className="text-sm font-medium">Loading sanctuary match board...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 reveal-on-scroll">
      {/* Board Header Container (2.5rem radius) */}
      <div className="bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-6 sm:p-8 shadow-wellness flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-reenie text-3xl text-[#78716C] leading-none">
              tender compatibility ~
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292524]">
              Placement harmony board.
            </h1>
            <span className="px-3.5 py-1 text-xs font-semibold bg-[#EFEDF4] text-[#292524] rounded-full border border-[#ded7e8]">
              {matches.length} active pairings
            </span>
          </div>
          <p className="text-sm text-[#78716C] mt-1">
            Kanban workflow tracking algorithmic temperament pairings from proposed through placed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8EFE8] text-[#292524] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#E59F4C]" />
            <span>High harmony &ge; 90%</span>
          </div>
        </div>
      </div>

      {/* 5-Column Kanban Board Layout in 2rem to 4rem Containers */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colMatches = matches.filter(
            (m) => m.status.toLowerCase() === col.status
          );

          return (
            <div
              key={col.status}
              id={`kanban-col-${col.status}`}
              className="bg-[#EFEDF4]/40 border border-[#E8EFE8] rounded-[2rem] flex flex-col min-h-[520px] p-3 shadow-wellness"
            >
              {/* Column Header */}
              <div className="p-3 mb-2 flex items-center justify-between border-b border-[#E8EFE8]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#292524] uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${col.pillColor}`}>
                      {colMatches.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                    {col.description}
                  </p>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[750px] pr-0.5">
                {colMatches.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#dcd4e8] rounded-[1.5rem] bg-[#FDFCF8]/50">
                    <span className="text-xs text-[#78716C] italic font-medium">No matches in {col.label.toLowerCase()}</span>
                  </div>
                ) : (
                  colMatches.map((match) => {
                    const animal = animalMap.get(String(match.animal_id));
                    const applicant = applicantMap.get(String(match.applicant_id));
                    const isExpanded = expandedMatchId === match.id;

                    return (
                      <div
                        key={match.id}
                        id={`match-card-${match.id}`}
                        onClick={() => setSelectedMatch(match)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedMatch(match);
                          }
                        }}
                        className="bg-[#FDFCF8] border border-[#E8EFE8] hover:border-[#E59F4C] rounded-[1.8rem] p-4 shadow-wellness transition-all hover:scale-[1.02] cursor-pointer group text-left relative"
                      >
                        {/* Top: Score Badge & Actions */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs border shadow-2xs ${getScoreColor(
                              match.score
                            )}`}
                          >
                            {match.score}% fit
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMatch(match);
                            }}
                            className="text-[#78716C] hover:text-[#292524] p-1.5 rounded-full hover:bg-[#EFEDF4] transition-colors"
                            title="View full score breakdown"
                            aria-label={`View match details for ${animal?.name ?? 'animal'} and ${applicant?.name ?? 'applicant'}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Pairing Information: Animal + Applicant */}
                        <div className="space-y-2.5">
                          {/* Animal Row */}
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#E8EFE8] flex items-center justify-center text-xs font-bold text-[#292524] shrink-0">
                              {animal?.name?.charAt(0) ?? 'A'}
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider block">
                                Companion
                              </span>
                              <span className="text-xs font-bold text-[#292524] truncate block">
                                {animal ? animal.name : `Animal #${match.animal_id}`}
                              </span>
                              {animal && (
                                <span className="text-[11px] text-[#78716C] truncate block">
                                  {animal.breed} · {animal.size}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Connector */}
                          <div className="flex items-center gap-2 pl-4 text-[#78716C]">
                            <div className="w-0.5 h-3 bg-[#E8EFE8]" />
                            <span className="font-reenie text-xl text-[#E59F4C] leading-none">with</span>
                          </div>

                          {/* Applicant Row */}
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              name={applicant?.name ?? `Applicant ${match.applicant_id}`}
                              size="sm"
                            />
                            <div className="overflow-hidden">
                              <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider block">
                                Applicant ({applicant?.type ?? 'Guardian'})
                              </span>
                              <span className="text-xs font-bold text-[#292524] truncate block">
                                {applicant ? applicant.name : `Applicant #${match.applicant_id}`}
                              </span>
                              {applicant && (
                                <span className="text-[11px] text-[#78716C] truncate block">
                                  {applicant.housing_type} · {applicant.experience_level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expandable breakdown quick-peek */}
                        {match.breakdown && (
                          <div className="mt-3 pt-2.5 border-t border-[#E8EFE8]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedMatchId(isExpanded ? null : match.id);
                              }}
                              className="w-full flex items-center justify-between text-[11px] font-semibold text-[#78716C] hover:text-[#292524] transition-colors py-0.5"
                            >
                              <span>Factors</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-1.5 text-[10px] text-[#78716C] bg-[#EFEDF4]/40 p-2.5 rounded-[1.2rem] border border-[#EFEDF4]">
                                {Object.entries(match.breakdown).map(([key, val]) => (
                                  <div key={key} className="flex justify-between items-center">
                                    <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                    <span className="font-bold text-[#292524]">{val}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Details Full Modal */}
      <MatchDetailModal
        match={selectedMatch}
        animal={selectedMatch ? animalMap.get(String(selectedMatch.animal_id)) : undefined}
        applicant={selectedMatch ? applicantMap.get(String(selectedMatch.applicant_id)) : undefined}
        isOpen={selectedMatch !== null}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
};
