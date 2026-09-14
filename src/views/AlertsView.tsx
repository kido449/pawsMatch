import React, { useState } from 'react';
import { Animal, Escalation } from '../types';
import { Avatar } from '../components/Avatar';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
  Calendar,
  Loader2,
} from 'lucide-react';

interface AlertsViewProps {
  escalations: Escalation[];
  animals: Animal[];
  isLoading: boolean;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  escalations,
  animals,
  isLoading,
}) => {
  const [resolvedIds, setResolvedIds] = useState<Set<string | number>>(new Set());
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string | number>>(new Set());

  const animalMap = new Map<string | number, Animal>(
    animals.map((a) => [String(a.id), a])
  );

  // Sort most recent first
  const sortedEscalations = [...escalations].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const handleAcknowledge = (id: string | number) => {
    setAcknowledgedIds((prev) => new Set(prev).add(id));
  };

  const handleResolve = (id: string | number) => {
    setResolvedIds((prev) => new Set(prev).add(id));
  };

  if (isLoading && escalations.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-28 text-[#78716C]">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-[#E59F4C]" />
        <span className="text-sm font-medium">Retrieving active triage escalations...</span>
      </div>
    );
  }

  const activeCount = sortedEscalations.filter((e) => !resolvedIds.has(e.id)).length;

  return (
    <div className="w-full space-y-6 reveal-on-scroll">
      {/* High-Impact Triage Banner (Radius 2.5rem) */}
      <div className="bg-[#E59F4C]/20 border border-[#E59F4C] rounded-[2.5rem] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-wellness">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E59F4C] text-[#292524] flex items-center justify-center font-bold shrink-0 shadow-xs mt-0.5">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-reenie text-3xl text-[#78716C] leading-none">
                priority attention ~
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#292524] tracking-tight">
                Sanctuary care escalations.
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#292524] text-[#FDFCF8]">
                Requires staff review
              </span>
            </div>
            <p className="text-sm text-[#78716C] mt-1 max-w-xl">
              Algorithmic overrides, behavioral nuances, and kennel capacity notices requiring gentle coordinator intervention.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3 bg-[#FDFCF8] border border-[#E8EFE8] rounded-full px-5 py-2.5 shadow-xs">
          <span className="text-xs font-semibold uppercase text-[#78716C]">Pending cases:</span>
          <span className="text-base font-bold text-[#292524]">{activeCount} notices</span>
        </div>
      </div>

      {/* Escalations List in 2rem to 4rem Containers */}
      {sortedEscalations.length === 0 ? (
        <div className="w-full bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-16 text-center text-[#78716C] shadow-wellness">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
          <h3 className="text-base font-bold text-[#292524]">All escalations resolved</h3>
          <p className="text-xs text-[#78716C] mt-1">No pending triage cases currently need attention.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEscalations.map((esc) => {
            const animal = esc.animal_id ? animalMap.get(String(esc.animal_id)) : null;
            const isResolved = resolvedIds.has(esc.id);
            const isAcknowledged = acknowledgedIds.has(esc.id);

            return (
              <div
                key={esc.id}
                id={`escalation-card-${esc.id}`}
                className={`rounded-[2rem] border transition-all p-6 shadow-wellness ${
                  isResolved
                    ? 'bg-[#FDFCF8]/60 border-[#E8EFE8] opacity-60'
                    : 'bg-[#FDFCF8] border-[#E59F4C]/60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="flex-1 min-w-0">
                    {/* Urgency Badge & Type */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                          isResolved
                            ? 'bg-[#E8EFE8] text-[#78716C]'
                            : 'bg-[#E59F4C] text-[#292524]'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{esc.type}</span>
                      </span>

                      <span className="flex items-center gap-1 text-xs text-[#78716C]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Logged {formatTimestamp(esc.created_at)}</span>
                      </span>

                      {isAcknowledged && !isResolved && (
                        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EFEDF4] text-[#292524] border border-[#ded7e8]">
                          Care review underway
                        </span>
                      )}

                      {isResolved && (
                        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E8EFE8] text-[#292524] border border-[#d2dfd2]">
                          Resolved & documented
                        </span>
                      )}
                    </div>

                    {/* Animal Attachment (if any) */}
                    {animal ? (
                      <div className="mb-3.5 inline-flex items-center gap-3 px-3.5 py-2 rounded-full bg-[#EFEDF4]/50 border border-[#EFEDF4] text-xs">
                        <Avatar
                          photoUrl={animal.photo_url}
                          name={animal.name}
                          size="sm"
                          className="w-7 h-7 rounded-full shadow-2xs"
                        />
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#292524]">{animal.name}</span>
                          <span className="text-[#78716C] text-xs font-medium">
                            ({animal.species} • {animal.breed})
                          </span>
                          {animal.special_needs_flag && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E59F4C]/25 text-[#292524] text-[10px] font-bold">
                              Special Needs
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEDF4]/50 text-xs text-[#78716C]">
                        <Calendar className="w-3.5 h-3.5 text-[#78716C]" />
                        <span>Facility-wide operations incident</span>
                      </div>
                    )}

                    {/* Details Box: High Contrast, Clear Typography */}
                    <div className="p-4 rounded-[1.4rem] bg-[#EFEDF4]/30 border border-[#EFEDF4] text-[#292524] text-sm leading-relaxed">
                      {esc.details}
                    </div>
                  </div>

                  {/* Human Action Controls */}
                  <div className="flex md:flex-col items-center sm:items-stretch gap-2.5 shrink-0 pt-2 md:pt-0">
                    {!isResolved ? (
                      <>
                        <button
                          type="button"
                          id={`resolve-btn-${esc.id}`}
                          onClick={() => handleResolve(esc.id)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] hover:bg-black active:bg-stone-950 text-[#FDFCF8] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark resolved</span>
                        </button>

                        {!isAcknowledged && (
                          <button
                            type="button"
                            id={`ack-btn-${esc.id}`}
                            onClick={() => handleAcknowledge(esc.id)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#EFEDF4]/50 text-[#292524] border border-[#E8EFE8] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-[#78716C]" />
                            <span>Acknowledge</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center px-4 py-2 text-xs font-medium text-[#78716C]">
                        Case closed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
