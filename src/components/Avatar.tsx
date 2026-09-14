import React, { useState } from 'react';

interface AvatarProps {
  photoUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
}

const colorPalette = [
  'bg-emerald-100 text-emerald-800 border-emerald-300',
  'bg-sky-100 text-sky-800 border-sky-300',
  'bg-indigo-100 text-indigo-800 border-indigo-300',
  'bg-amber-100 text-amber-800 border-amber-300',
  'bg-teal-100 text-teal-800 border-teal-300',
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-violet-100 text-violet-800 border-violet-300',
  'bg-orange-100 text-orange-800 border-orange-300',
];

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
  className = '',
  id,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-medium',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-lg font-bold',
  }[size];

  const initials = getInitials(name);
  const colorClass = getColor(name);

  if (!photoUrl || hasError) {
    return (
      <div
        id={id}
        aria-label={name}
        className={`inline-flex items-center justify-center rounded-lg border select-none shrink-0 ${sizeClasses} ${colorClass} ${className}`}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`relative inline-block rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-stone-200 ${sizeClasses} ${className}`}
    >
      <img
        src={photoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
