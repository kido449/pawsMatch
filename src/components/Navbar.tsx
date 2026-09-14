import React from 'react';
import { TabKey } from '../types';
import {
  LayoutDashboard,
  Dog,
  Users,
  GitPullRequest,
  Send,
  AlertTriangle,
  Heart,
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  openEscalationsCount?: number;
}

const navItems: {
  key: TabKey;
  label: string;
  hash: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'dashboard', label: 'Overview', hash: '#dashboard', icon: LayoutDashboard },
  { key: 'animals', label: 'Roster', hash: '#animals', icon: Dog },
  { key: 'applicants', label: 'Applicants', hash: '#applicants', icon: Users },
  { key: 'matches', label: 'Match Board', hash: '#matches', icon: GitPullRequest },
  { key: 'outreach', label: 'Outreach', hash: '#outreach', icon: Send },
  { key: 'escalations', label: 'Alerts', hash: '#escalations', icon: AlertTriangle },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  openEscalationsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#E8EFE8] shadow-wellness select-none">
      <div className="w-full px-4 sm:px-8 flex items-center justify-between h-16 max-w-[1700px] mx-auto">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-[#E59F4C] flex items-center justify-center text-[#292524] shadow-xs">
            <Heart className="w-5 h-5 fill-[#292524]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#292524] leading-none">
                PawsMatch
              </span>
              <span className="font-reenie text-xl text-[#78716C] leading-none">
                wellness
              </span>
            </div>
            <span className="text-[10px] text-[#78716C] font-medium tracking-wide uppercase mt-0.5">
              Sunnydale Rescue Sanctuary
            </span>
          </div>
        </div>

        {/* Center: Six Navigation Tabs in Pill Container (Radius: 2rem to 4rem) */}
        <nav
          className="flex items-center space-x-1 sm:space-x-1.5 p-1 rounded-full bg-[#EFEDF4]/70 border border-[#E8EFE8] overflow-x-auto scrollbar-none"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            const Icon = item.icon;
            const isAlertTab = item.key === 'escalations';

            return (
              <a
                key={item.key}
                id={`nav-tab-${item.key}`}
                href={item.hash}
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(item.key);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FDFCF8] text-[#292524] font-semibold shadow-xs border border-[#E8EFE8]'
                    : 'text-[#78716C] hover:text-[#292524] hover:bg-[#FDFCF8]/60'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#292524]' : 'text-[#78716C]'
                  }`}
                />
                <span>{item.label}</span>
                {isAlertTab && openEscalationsCount > 0 && (
                  <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#E59F4C] text-[#292524]">
                    {openEscalationsCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Shelter Status */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-full bg-[#E8EFE8] border border-[#d8e4d8] text-[11px] font-medium text-[#292524] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Shelter ID: SAR-402</span>
          </div>
        </div>
      </div>
    </header>
  );
};
