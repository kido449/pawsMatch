import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Award,
  Home,
  Calendar,
  AlertTriangle,
  Heart,
  HeartHandshake,
  Activity,
  CheckCircle2,
  Tag,
  FileText,
  Info,
} from 'lucide-react';
import { Animal, Applicant, Match, MatchStatus } from '../types';
import { Avatar } from './Avatar';

interface MatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  animal?: Animal | null;
  applicant?: Applicant | null;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  isOpen,
  onClose,
  match,
  animal,
  applicant,
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !match) return null;

  const score = match.score;
  const breakdown = match.score_breakdown || {};

  const getScoreColor = (val: number) => {
    if (val >= 90) return { bg: 'bg-[#E59F4C]', text: 'text-[#292524]', border: 'border-[#d88f3a]', bgLight: 'bg-[#E59F4C]/20' };
    if (val >= 75) return { bg: 'bg-[#E8EFE8]', text: 'text-[#292524]', border: 'border-[#d0ded0]', bgLight: 'bg-[#E8EFE8]/40' };
    if (val >= 60) return { bg: 'bg-[#EFEDF4]', text: 'text-[#292524]', border: 'border-[#ddd6e9]', bgLight: 'bg-[#EFEDF4]/40' };
    return { bg: 'bg-[#FDFCF8]', text: 'text-[#78716C]', border: 'border-[#E8EFE8]', bgLight: 'bg-[#FDFCF8]' };
  };

  const getScoreTierLabel = (val: number) => {
    if (val >= 90) return 'Optimal harmony match';
    if (val >= 75) return 'High compatibility';
    if (val >= 60) return 'Moderate fit';
    return 'Alternative fit recommended';
  };

  const getStatusBadge = (status: MatchStatus) => {
    switch (status.toLowerCase()) {
      case 'proposed':
        return 'bg-[#EFEDF4] text-[#292524] border-[#ded7e8]';
      case 'contacted':
        return 'bg-[#E8EFE8] text-[#292524] border-[#d2dfd2]';
      case 'interested':
        return 'bg-[#E59F4C]/25 text-[#292524] border-[#E59F4C]';
      case 'placed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'declined':
      default:
        return 'bg-[#FDFCF8] text-[#78716C] border-[#E8EFE8]';
    }
  };

  const animalName = animal ? animal.name : `Animal #${match.animal_id}`;
  const applicantName = applicant ? applicant.name : `Applicant #${match.applicant_id}`;
  const isFoster = applicant?.type.toLowerCase() === 'foster';

  const scoreTheme = getScoreColor(score);

  const breakdownMetrics = [
    {
      key: 'housing',
      label: 'Housing & Space Suitability',
      value: breakdown.housing,
      icon: Home,
      description: 'Yard availability, fencing security, and living space dimensions',
    },
    {
      key: 'experience',
      label: 'Applicant Experience Fit',
      value: breakdown.experience,
      icon: Award,
      description: 'Handling proficiency matched to companion energy and medical needs',
    },
    {
      key: 'lifestyle',
      label: 'Activity & Lifestyle Harmony',
      value: breakdown.lifestyle,
      icon: Activity,
      description: 'Daily schedule, outdoor recreation, and exercise routine compatibility',
    },
    {
      key: 'species_fit',
      label: 'Species & Temperament Comfort',
      value: breakdown.species_fit,
      icon: Heart,
      description: 'Prior pet experience and behavioral alignment with other animals',
    },
  ];

  return (
    <AnimatePresence>
      <div
        id="match-detail-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#292524]/60 backdrop-blur-xs overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        aria-hidden="true"
      >
        <motion.div
          id="match-detail-modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-modal-title"
          aria-describedby="match-modal-description"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="bg-[#FDFCF8] w-full max-w-3xl rounded-[2.5rem] shadow-wellness border border-[#E8EFE8] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#292524]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-[#E8EFE8] bg-[#EFEDF4]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E59F4C] flex items-center justify-center text-[#292524] shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="match-modal-title"
                    className="text-lg font-bold text-[#292524] tracking-tight"
                  >
                    Match harmony analysis.
                  </h2>
                  <span className="font-mono text-xs text-[#78716C] uppercase px-2.5 py-0.5 bg-white border border-[#E8EFE8] rounded-full">
                    #{String(match.id).toUpperCase()}
                  </span>
                </div>
                <p
                  id="match-modal-description"
                  className="text-xs text-[#78716C] mt-0.5"
                >
                  Algorithmic temperament and lifestyle scoring between candidate and applicant.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${getStatusBadge(
                  match.status
                )}`}
              >
                {match.status}
              </span>
              <button
                id="close-match-modal-button"
                type="button"
                onClick={onClose}
                aria-label="Close match details dialog"
                className="p-2 rounded-full text-[#78716C] hover:text-[#292524] hover:bg-[#EFEDF4] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Overall Score Highlight Banner (Radius: 2rem) */}
            <div
              id="match-overall-score-card"
              className={`p-6 rounded-[2rem] border ${scoreTheme.border} ${scoreTheme.bgLight} flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs`}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-20 h-20 rounded-[1.5rem] bg-[#FDFCF8] shadow-xs border border-[#E8EFE8] shrink-0">
                  <span className="text-3xl font-extrabold text-[#292524]">
                    {score}%
                  </span>
                  <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                    Score
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#292524]">
                      {getScoreTierLabel(score)}
                    </span>
                    <span className="text-xs text-[#78716C]">
                      ({animalName} &times; {applicantName})
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-1 max-w-md leading-relaxed">
                    {score >= 85
                      ? 'Exceptional compatibility profile. High probability of calm, permanent placement with minimal stress.'
                      : score >= 70
                      ? 'Solid pairing with minor environmental or schedule nuances noted by the shelter algorithm.'
                      : 'Specific accommodation or experience gaps identified. Recommended for gentle coordinator consultation.'}
                  </p>
                </div>
              </div>

              {/* Progress bar pill */}
              <div className="w-full sm:w-44 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between text-xs font-semibold text-[#78716C]">
                  <span>Shelter standard</span>
                  <span>70%</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#E8EFE8]">
                  <div
                    className={`h-full rounded-full ${scoreTheme.bg} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Side-by-side Animal and Applicant Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Animal Summary Container */}
              <div
                id="match-animal-summary"
                className="bg-[#E8EFE8]/30 border border-[#E8EFE8] rounded-[2rem] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8EFE8]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                      Animal companion
                    </span>
                    <span className="text-xs font-mono text-[#78716C]">
                      #{String(animal?.id || match.animal_id).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Avatar
                      photoUrl={animal?.photo_url}
                      name={animalName}
                      size="lg"
                      className="w-14 h-14 rounded-2xl shrink-0 shadow-xs border border-[#E8EFE8]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-[#292524] truncate">
                          {animalName}
                        </h4>
                        {animal?.status && (
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize bg-white text-[#292524] border border-[#E8EFE8]">
                            {animal.status.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {animal?.breed || 'Mixed Breed'} &bull; {animal?.age || 'Age unverified'}
                      </p>
                      <p className="text-xs font-medium text-[#78716C] mt-0.5">
                        Species: <span className="text-[#292524]">{animal?.species || 'Animal'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Special Needs Notice */}
                  {animal?.special_needs_flag && (
                    <div className="mt-4 p-3 rounded-[1.2rem] bg-[#E59F4C]/20 border border-[#E59F4C] flex items-start gap-2.5 text-xs text-[#292524]">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Care alert:</span> Requires gentle handling and patient home routine.
                      </div>
                    </div>
                  )}

                  {/* Behavior Tags */}
                  {animal?.behavior_tags && animal.behavior_tags.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#E8EFE8]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-2">
                        Temperament & qualities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {animal.behavior_tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-[#292524] border border-[#E8EFE8]"
                          >
                            <Tag className="w-2.5 h-2.5 text-[#78716C]" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Applicant Summary Container */}
              <div
                id="match-applicant-summary"
                className="bg-[#EFEDF4]/30 border border-[#EFEDF4] rounded-[2rem] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#EFEDF4]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                      Applicant profile
                    </span>
                    <span className="text-xs font-mono text-[#78716C]">
                      #{String(applicant?.id || match.applicant_id).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Avatar
                      photoUrl={applicant?.photo_url}
                      name={applicantName}
                      size="lg"
                      className="w-14 h-14 rounded-2xl shrink-0 shadow-xs border border-[#EFEDF4]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-[#292524] truncate">
                          {applicantName}
                        </h4>
                        {applicant?.type && (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isFoster
                                ? 'bg-[#E8EFE8] text-[#292524] border-[#d2dfd2]'
                                : 'bg-[#EFEDF4] text-[#292524] border-[#ded7e8]'
                            }`}
                          >
                            {isFoster ? (
                              <HeartHandshake className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Heart className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                            )}
                            <span className="capitalize">{applicant.type}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#78716C]">
                        <Award className="w-3.5 h-3.5 text-[#78716C]" />
                        <span>Experience:</span>
                        <span className="font-semibold text-[#292524]">
                          {applicant?.experience_level || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Housing & Date Details */}
                  <div className="mt-4 space-y-2 text-xs border-t border-[#EFEDF4] pt-3 text-[#78716C]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Home className="w-3.5 h-3.5" /> Dwelling:
                      </span>
                      <span className="text-right text-[#292524] font-medium">
                        {applicant?.housing_type || 'Residential'} · {applicant?.has_yard ? 'Yard' : 'No yard'}
                      </span>
                    </div>

                    {applicant?.application_date && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5" /> Date applied:
                        </span>
                        <span className="text-[#292524] font-medium">
                          {applicant.application_date}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown Metrics Grid in rounded containers */}
            <div id="match-score-breakdown-section" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#E59F4C]" />
                  <span>Compatibility factor breakdown</span>
                </h3>
                <span className="text-xs text-[#78716C]">Scored via /api/matches</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {breakdownMetrics.map((metric) => {
                  const val = metric.value;
                  const hasValue = val !== undefined && val !== null;
                  const metricVal = hasValue ? Number(val) : 0;
                  const metricTheme = getScoreColor(metricVal);
                  const Icon = metric.icon;

                  return (
                    <div
                      key={metric.key}
                      id={`metric-${metric.key}`}
                      className="p-4 bg-white border border-[#E8EFE8] rounded-[1.6rem] shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-xl bg-[#EFEDF4] text-[#292524]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-[#292524]">
                            {metric.label}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#292524]">
                          {hasValue ? `${metricVal}%` : 'N/A'}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#EFEDF4] rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full ${metricTheme.bg} transition-all duration-300`}
                          style={{ width: `${hasValue ? Math.min(100, Math.max(0, metricVal)) : 0}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-[#78716C] mt-2 line-clamp-1">
                        {metric.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Match Notes */}
              {breakdown.notes && (
                <div
                  id="match-notes-card"
                  className="p-4 rounded-[1.6rem] bg-[#E8EFE8]/40 border border-[#E8EFE8] text-xs text-[#292524] flex items-start gap-3"
                >
                  <Info className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#292524] block mb-0.5">
                      Harmony notes:
                    </span>
                    <p className="italic text-[#78716C] leading-relaxed">
                      &ldquo;{breakdown.notes}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-[#E8EFE8] bg-[#EFEDF4]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-[#78716C]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Record verified in Sunnydale sanctuary coordination log</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-semibold rounded-full bg-[#292524] text-[#FDFCF8] hover:bg-black transition-colors cursor-pointer shadow-xs"
            >
              Close details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
