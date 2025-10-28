'use client';

import React, { useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';

/**
 * International News Outlet Interface
 */
interface InternationalOutlet {
  name: string;
  language: string;
  url: string;
  description: string;
  category: string;
}

/**
 * Props for InternationalSourceCard component
 */
interface InternationalSourceCardProps {
  outlet: InternationalOutlet;
  country: string;
  countryFlag: string;
  isFavorite?: boolean;
  onToggleFavorite?: (outletName: string) => void;
}

/**
 * InternationalSourceCard Component
 *
 * Displays a single international news outlet as a card with:
 * - Outlet name and country
 * - Language and category
 * - Description
 * - Visit site button
 * - Add to favorites button
 */
export default function InternationalSourceCard({
  outlet,
  country,
  countryFlag,
  isFavorite = false,
  onToggleFavorite,
}: InternationalSourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(outlet.name);
    }
  };

  return (
    <div
      className="relative bg-background-elevated border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{countryFlag}</span>
            <h3 className="text-lg font-semibold text-gray-900">{outlet.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{country}</span>
            <span className="text-gray-400">•</span>
            <span>{outlet.language}</span>
          </div>
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={20}
              fill={isFavorite ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
          {outlet.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{outlet.description}</p>

      {/* Visit Site Button */}
      <a
        href={outlet.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
          isHovered
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <span>Visit Site</span>
        <ExternalLink size={16} />
      </a>
    </div>
  );
}
