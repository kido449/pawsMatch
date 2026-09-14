import React, { useState, useMemo } from 'react';
import { Applicant } from '../types';
import { Avatar } from '../components/Avatar';
import {
  Search,
  Calendar,
  Home,
  Award,
  Filter,
  Loader2,
  HeartHandshake,
  Heart,
  X,
  RotateCcw,
} from 'lucide-react';

interface ApplicantsViewProps {
  applicants: Applicant[];
  isLoading: boolean;
}

export const ApplicantsView: React.FC<ApplicantsViewProps> = ({ applicants, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'adopter' | 'foster'>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');

  // Extract unique experience levels dynamically from the fetched applicants data
  const availableExperienceLevels = useMemo(() => {
    const levels = new Set<string>();
    applicants.forEach((a) => {
      if (a.experience_level) {
        levels.add(a.experience_level);
      }
    });
    ['Beginner', 'Intermediate', 'Experienced'].forEach((lvl) => levels.add(lvl));
    return Array.from(levels);
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesSearch =
        !searchQuery.trim() ||
        applicant.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

      const matchesType =
        typeFilter === 'all' ||
        applicant.type.toLowerCase() === typeFilter.toLowerCase();

      const matchesExperience =
        experienceFilter === 'all' ||
        applicant.experience_level.toLowerCase() === experienceFilter.toLowerCase();

      return matchesSearch && matchesType && matchesExperience;
    });
  }, [applicants, searchQuery, typeFilter, experienceFilter]);

  const isFiltered = searchQuery.trim() !== '' || typeFilter !== 'all' || experienceFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setExperienceFilter('all');
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getExperienceBadge = (level: string) => {
    const lower = level.toLowerCase();
    if (lower.includes('experienced') || lower.includes('advanced')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EFEDF4] text-[#292524] border border-[#dcd6e8]">
          {level}
        </span>
      );
    }
    if (lower.includes('intermediate')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EFE8] text-[#292524] border border-[#d2dfd2]">
          {level}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FDFCF8] text-[#78716C] border border-[#E8EFE8]">
        {level}
      </span>
    );
  };

  if (isLoading && applicants.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-28 text-[#78716C]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E59F4C] mr-3" />
        <span className="text-sm font-medium">Loading applicant records...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 reveal-on-scroll">
      {/* Header and Controls Container with 2rem to 4rem Border-Radius */}
      <div className="bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-6 sm:p-8 shadow-wellness">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E8EFE8]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-reenie text-3xl text-[#78716C] leading-none">
                compassionate guardians ~
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292524]">
                Foster & adopter registry.
              </h1>
              <span className="px-3.5 py-1 text-xs font-semibold bg-[#EFEDF4] text-[#292524] rounded-full border border-[#e0daec]">
                {filteredApplicants.length} of {applicants.length} registered
              </span>
            </div>
            <p className="text-sm text-[#78716C] mt-1">
              Screened animal caregivers ready for compatibility evaluation and loving home placement.
            </p>
          </div>

          {/* Filter controls toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search bar: Find applicants by name */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#78716C]" />
              <input
                id="applicant-search-input"
                type="text"
                placeholder="Search applicants by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-white border border-[#E8EFE8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#E59F4C] focus:border-[#E59F4C] shadow-2xs text-[#292524]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear applicant search"
                  className="absolute right-3 top-2.5 text-[#78716C] hover:text-[#292524] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Applicant Type Filter Pills: all / adopter / foster */}
            <div className="flex items-center gap-1 bg-[#EFEDF4]/60 border border-[#E8EFE8] rounded-full p-1 shadow-2xs text-xs">
              <button
                id="filter-type-all"
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-[#292524] text-[#FDFCF8]'
                    : 'text-[#78716C] hover:text-[#292524]'
                }`}
              >
                All types
              </button>
              <button
                id="filter-type-adopter"
                type="button"
                onClick={() => setTypeFilter('adopter')}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  typeFilter === 'adopter'
                    ? 'bg-[#292524] text-[#FDFCF8]'
                    : 'text-[#78716C] hover:text-[#292524]'
                }`}
              >
                Adopters
              </button>
              <button
                id="filter-type-foster"
                type="button"
                onClick={() => setTypeFilter('foster')}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  typeFilter === 'foster'
                    ? 'bg-[#292524] text-[#FDFCF8]'
                    : 'text-[#78716C] hover:text-[#292524]'
                }`}
              >
                Fosters
              </button>
            </div>

            {/* Experience Level Filter */}
            <div className="flex items-center gap-2 bg-white border border-[#E8EFE8] rounded-full px-4 py-2 shadow-2xs text-xs">
              <label htmlFor="applicant-experience-filter" className="text-xs font-semibold text-[#78716C] whitespace-nowrap">
                Experience:
              </label>
              <select
                id="applicant-experience-filter"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="bg-transparent text-xs text-[#292524] font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">All levels</option>
                {availableExperienceLevels.map((level) => (
                  <option key={level} value={level.toLowerCase()}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button */}
            {isFiltered && (
              <button
                id="reset-applicant-filters-btn"
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#292524] bg-[#E59F4C]/25 hover:bg-[#E59F4C] rounded-full transition-colors cursor-pointer"
                title="Reset search and all active filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Summary */}
        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 text-xs mt-4 pt-4 border-t border-[#E8EFE8]/70">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] mr-1">
              Active filters:
            </span>
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEDF4] border border-[#ded7e8] text-[#292524] text-xs font-medium">
                Name: &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-500 cursor-pointer"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFE8] border border-[#d2dfd2] text-[#292524] text-xs font-medium capitalize">
                Type: {typeFilter}
                <button
                  type="button"
                  onClick={() => setTypeFilter('all')}
                  className="hover:text-red-500 cursor-pointer"
                  aria-label="Remove type filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {experienceFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E59F4C]/20 border border-[#E59F4C] text-[#292524] text-xs font-medium capitalize">
                Experience: {experienceFilter}
                <button
                  type="button"
                  onClick={() => setExperienceFilter('all')}
                  className="hover:text-red-500 cursor-pointer"
                  aria-label="Remove experience filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#292524] hover:underline font-semibold ml-auto cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Applicants List in Rounded Containers (Radius 2rem to 4rem) */}
      {filteredApplicants.length === 0 ? (
        <div className="w-full bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-16 text-center text-[#78716C] shadow-wellness">
          <Filter className="w-10 h-10 mx-auto mb-3 text-[#E59F4C]" />
          <h3 className="text-base font-semibold text-[#292524]">No applicants match current criteria</h3>
          <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
            Try adjusting search terms or resetting the type and experience filters.
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#E8EFE8] hover:bg-[#dbe7db] text-[#292524] transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApplicants.map((applicant) => {
            const isFoster = applicant.type.toLowerCase() === 'foster';

            return (
              <div
                key={applicant.id}
                id={`applicant-card-${applicant.id}`}
                className="bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2rem] p-6 shadow-wellness hover:border-[#d9e7d9] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Avatar and Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={applicant.name}
                        size="md"
                        statusDot={applicant.has_yard ? 'online' : undefined}
                      />
                      <div>
                        <h3 className="font-bold text-base text-[#292524] tracking-tight leading-snug">
                          {applicant.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#78716C] mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-[#78716C]" />
                          <span>Applied {formatDate(applicant.application_date)}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                        isFoster
                          ? 'bg-[#E8EFE8] text-[#292524] border border-[#d0ded0]'
                          : 'bg-[#EFEDF4] text-[#292524] border border-[#ddd7e9]'
                      }`}
                    >
                      {isFoster ? (
                        <HeartHandshake className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Heart className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                      )}
                      <span>{isFoster ? 'Foster Home' : 'Adopter'}</span>
                    </span>
                  </div>

                  {/* Attributes Grid */}
                  <div className="space-y-2.5 pt-3 border-t border-[#E8EFE8] text-xs text-[#292524]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#78716C] flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#78716C]" />
                        <span>Dwelling & yard:</span>
                      </span>
                      <span className="font-semibold text-[#292524]">
                        {applicant.housing_type} · {applicant.has_yard ? 'Fenced Yard' : 'No Yard'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#78716C] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#78716C]" />
                        <span>Experience level:</span>
                      </span>
                      <div>{getExperienceBadge(applicant.experience_level)}</div>
                    </div>

                    {applicant.preferred_size && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#78716C]">Preferred size:</span>
                        <span className="font-semibold text-[#292524] capitalize">
                          {applicant.preferred_size}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Bio */}
                  {applicant.notes && (
                    <div className="mt-4 p-3.5 rounded-[1.2rem] bg-[#EFEDF4]/40 border border-[#EFEDF4] text-xs text-[#78716C] italic leading-relaxed">
                      &ldquo;{applicant.notes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-[#E8EFE8] flex items-center justify-between text-xs text-[#78716C]">
                  <span className="font-reenie text-xl text-[#78716C]">ready for placement</span>
                  <span className="font-medium text-[#292524]">ID: {applicant.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
