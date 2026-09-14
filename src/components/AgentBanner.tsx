import React from 'react';
import { Bot, ChevronRight, Sparkles } from 'lucide-react';

interface AgentBannerProps {
  onOpenChat: () => void;
}

export const AgentBanner: React.FC<AgentBannerProps> = ({ onOpenChat }) => {
  return (
    <aside
      aria-label="ShelterOps Assistant"
      className="w-full bg-[#E8EFE8]/70 border-b border-[#dce7dc] px-4 sm:px-8 py-2 flex items-center justify-between text-xs text-[#292524]"
    >
      <button
        id="agent-banner-button"
        onClick={onOpenChat}
        type="button"
        className="group flex items-center gap-2.5 font-medium hover:text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#E59F4C] rounded-full px-2 py-0.5 transition-all text-left"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E59F4C] text-[#292524] shadow-xs shrink-0">
          <Bot className="w-3.5 h-3.5" />
        </span>
        <span className="flex items-center gap-2">
          <span className="font-semibold text-[#292524]">
            Shelter Care AI Assistant:
          </span>
          <span className="text-[#78716C] group-hover:text-[#292524] transition-colors">
            Ask questions regarding rescue match fit, triage criteria, or applicant notes
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#292524] group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-[#78716C] font-normal">
        <Sparkles className="w-3.5 h-3.5 text-[#E59F4C]" />
        <span>Grounded in real-time kennel occupancy, temperament scores & applicant data</span>
      </div>
    </aside>
  );
};
