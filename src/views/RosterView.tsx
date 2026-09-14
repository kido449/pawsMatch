import React, { useState, useMemo } from 'react';
import { Animal } from '../types';
import { Avatar } from '../components/Avatar';
import {
  Search,
  AlertCircle,
  Tag,
  Loader2,
  Filter,
} from 'lucide-react';

interface RosterViewProps {
  animals: Animal[];
  isLoading: boolean;
}

export const RosterView: React.FC<RosterViewProps> = ({ animals, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'dog' | 'cat' | 'other'>('all');
  const [specialNeedsOnly, setSpecialNeedsOnly] = useState(false);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch =
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (animal.behavior_tags || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesSpecies =
        speciesFilter === 'all' ||
        animal.species.toLowerCase().includes(speciesFilter);

      const matchesSpecialNeeds = !specialNeedsOnly || animal.special_needs_flag;

      return matchesSearch && matchesSpecies && matchesSpecialNeeds;
    });
  }, [animals, searchQuery, speciesFilter, specialNeedsOnly]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E8EFE8] text-[#292524] border border-[#d2dfd2]">
            Available
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E59F4C]/25 text-[#292524] border border-[#E59F4C]">
            Pending
          </span>
        );
      case 'placed':
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            Placed
          </span>
        );
      case 'medical_hold':
      case 'medical hold':
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EFEDF4] text-[#292524] border border-[#ded7e8]">
            Care hold
          </span>
        );
      default:
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FDFCF8] text-[#78716C] border border-[#E8EFE8]">
            {status}
          </span>
        );
    }
  };

  if (isLoading && animals.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-28 text-[#78716C]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E59F4C] mr-3" />
        <span className="text-sm font-medium">Loading sanctuary animal roster...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 reveal-on-scroll">
      {/* Header & Filter Controls Container (Radius: 2.5rem) */}
      <div className="bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-6 sm:p-8 shadow-wellness flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-reenie text-3xl text-[#78716C] leading-none">
              loving sanctuary residents ~
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292524]">
              Shelter animal roster.
            </h1>
            <span className="px-3.5 py-1 text-xs font-semibold bg-[#EFEDF4] text-[#292524] rounded-full border border-[#ded7e8]">
              {filteredAnimals.length} residents
            </span>
          </div>
          <p className="text-sm text-[#78716C] mt-1">
            Active companions at Sunnydale Sanctuary awaiting their peaceful forever homes.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#78716C]" />
            <input
              type="text"
              placeholder="Search companion, breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E8EFE8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#E59F4C] focus:border-[#E59F4C] shadow-2xs text-[#292524]"
            />
          </div>

          {/* Species filters */}
          <div className="flex items-center gap-1 rounded-full bg-[#EFEDF4]/60 border border-[#E8EFE8] p-1 text-xs">
            <button
              onClick={() => setSpeciesFilter('all')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                speciesFilter === 'all'
                  ? 'bg-[#292524] text-[#FDFCF8]'
                  : 'text-[#78716C] hover:text-[#292524]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSpeciesFilter('dog')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                speciesFilter === 'dog'
                  ? 'bg-[#292524] text-[#FDFCF8]'
                  : 'text-[#78716C] hover:text-[#292524]'
              }`}
            >
              Dogs
            </button>
            <button
              onClick={() => setSpeciesFilter('cat')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                speciesFilter === 'cat'
                  ? 'bg-[#292524] text-[#FDFCF8]'
                  : 'text-[#78716C] hover:text-[#292524]'
              }`}
            >
              Cats
            </button>
          </div>

          {/* Special Needs toggle */}
          <button
            onClick={() => setSpecialNeedsOnly(!specialNeedsOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
              specialNeedsOnly
                ? 'bg-[#E59F4C] text-[#292524] border-[#d88f3a]'
                : 'bg-white text-[#78716C] border-[#E8EFE8] hover:bg-[#EFEDF4]/40'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#292524]" />
            <span>Gentle care needs</span>
          </button>
        </div>
      </div>

      {/* Roster Card Grid (Radius: 2rem) */}
      {filteredAnimals.length === 0 ? (
        <div className="w-full bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2.5rem] p-16 text-center text-[#78716C] shadow-wellness">
          <Filter className="w-10 h-10 mx-auto mb-3 text-[#E59F4C]" />
          <h3 className="text-base font-semibold text-[#292524]">No companions match your criteria</h3>
          <p className="text-xs text-[#78716C] mt-1">Try changing your search terms or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAnimals.map((animal) => (
            <div
              key={animal.id}
              id={`animal-card-${animal.id}`}
              className="bg-[#FDFCF8] border border-[#E8EFE8] rounded-[2rem] p-5 shadow-wellness hover:border-[#E59F4C] transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Animal Header */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-[#E8EFE8]">
                  <Avatar
                    photoUrl={animal.photo_url}
                    name={animal.name}
                    size="lg"
                    className="w-16 h-16 rounded-2xl shadow-xs shrink-0 border border-[#E8EFE8]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold text-[#292524] truncate">
                        {animal.name}
                      </h3>
                    </div>
                    {getStatusBadge(animal.status)}
                    <p className="text-xs text-[#78716C] truncate mt-1">
                      {animal.breed}
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className="py-3.5 space-y-2 text-xs text-[#78716C]">
                  <div className="flex justify-between">
                    <span>Species & size:</span>
                    <span className="font-semibold text-[#292524] capitalize">
                      {animal.species} &bull; {animal.size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age / life stage:</span>
                    <span className="font-semibold text-[#292524]">
                      {animal.age || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intake date:</span>
                    <span className="font-medium text-[#292524]">
                      {animal.intake_date || 'Recent'}
                    </span>
                  </div>
                </div>

                {/* Special Needs Notice */}
                {animal.special_needs_flag && (
                  <div className="mb-3 p-2.5 rounded-[1.2rem] bg-[#E59F4C]/20 border border-[#E59F4C] flex items-center gap-2 text-xs text-[#292524]">
                    <AlertCircle className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="font-medium truncate">Special behavioral / diet need</span>
                  </div>
                )}

                {/* Behavior Tags */}
                {animal.behavior_tags && animal.behavior_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E8EFE8]">
                    {animal.behavior_tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EFEDF4] text-[#292524] border border-[#ded7e8]"
                      >
                        <Tag className="w-2.5 h-2.5 text-[#78716C]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-[#E8EFE8] flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-reenie text-xl text-[#78716C]">Sunnydale Sanctuary</span>
                <span className="font-mono text-[11px]">#{animal.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
