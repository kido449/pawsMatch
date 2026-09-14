import React, { useState } from 'react';
import { OutreachMessage } from '../types';
import {
  Send,
  CheckCircle2,
  Clock,
  Mail,
  Loader2,
  Filter,
} from 'lucide-react';

interface OutreachViewProps {
  outreachMessages: OutreachMessage[];
  onMarkAsSent: (id: string | number) => Promise<void>;
  isLoading: boolean;
}

export const OutreachView: React.FC<OutreachViewProps> = ({
  outreachMessages,
  onMarkAsSent,
  isLoading,
}) => {
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent'>('all');
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const filtered = outreachMessages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.status.toLowerCase() === filter;
  });

  const handleMarkAsSent = async (id: string | number) => {
    setUpdatingId(id);
    try {
      await onMarkAsSent(id);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading && outreachMessages.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-28 text-[#78716C]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E59F4C] mr-3" />
        <span className="text-sm font-medium">Loading outreach communications...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 reveal-on-scroll">
      {/* Header Container (Radius: 2.5rem) */}
      <div className="bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-6 sm:p-8 shadow-wellness flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-reenie text-3xl text-[#78716C] leading-none">
              heartfelt communication ~
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292524]">
              Outreach letters & drafts.
            </h1>
            <span className="px-3.5 py-1 text-xs font-semibold bg-[#EFEDF4] text-[#292524] rounded-full border border-[#ded7e8]">
              {filtered.length} messages
            </span>
          </div>
          <p className="text-sm text-[#78716C] mt-1">
            Personalized match drafts prepared for applicant follow-up and sanctuary visits.
          </p>
        </div>

        {/* Filters Pills */}
        <div className="flex items-center gap-1 rounded-full bg-[#EFEDF4]/60 border border-[#E8EFE8] p-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#292524] text-[#FDFCF8]'
                : 'text-[#78716C] hover:text-[#292524]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              filter === 'draft'
                ? 'bg-[#292524] text-[#FDFCF8]'
                : 'text-[#78716C] hover:text-[#292524]'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              filter === 'sent'
                ? 'bg-[#292524] text-[#FDFCF8]'
                : 'text-[#78716C] hover:text-[#292524]'
            }`}
          >
            Sent
          </button>
        </div>
      </div>

      {/* Message List in 2rem Containers */}
      {filtered.length === 0 ? (
        <div className="w-full bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-16 text-center text-[#78716C] shadow-wellness">
          <Filter className="w-10 h-10 mx-auto mb-3 text-[#E59F4C]" />
          <h3 className="text-base font-semibold text-[#292524]">No outreach messages found</h3>
          <p className="text-xs text-[#78716C] mt-1">Check drafts or trigger new matches in the engine.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => {
            const isSent = msg.status.toLowerCase() === 'sent';
            const isUpdating = updatingId === msg.id;

            return (
              <div
                key={msg.id}
                id={`outreach-msg-${msg.id}`}
                className="bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2rem] shadow-wellness hover:border-[#E59F4C] transition-all p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isSent
                          ? 'bg-[#E8EFE8] text-[#292524] border border-[#d2dfd2]'
                          : 'bg-[#E59F4C]/25 text-[#292524] border border-[#E59F4C]'
                      }`}
                    >
                      {isSent ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-[#292524]" />
                      )}
                      <span>{msg.status}</span>
                    </span>

                    <span className="text-xs font-mono text-[#78716C]">
                      Match Ref: #{String(msg.match_id).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#292524] mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#78716C] shrink-0" />
                    <span>{msg.subject}</span>
                  </h3>

                  <div className="bg-[#EFEDF4]/35 border border-[#EFEDF4] rounded-[1.4rem] p-4 text-xs sm:text-sm text-[#292524] leading-relaxed">
                    {msg.body}
                  </div>
                </div>

                {/* Action button */}
                <div className="sm:self-center shrink-0">
                  {isSent ? (
                    <div className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#E8EFE8] text-[#292524] text-xs font-semibold border border-[#d2dfd2] select-none">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Sent to applicant</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id={`mark-sent-btn-${msg.id}`}
                      disabled={isUpdating}
                      onClick={() => handleMarkAsSent(msg.id)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#292524] hover:bg-black active:bg-stone-950 text-[#FDFCF8] text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Mark as sent</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
