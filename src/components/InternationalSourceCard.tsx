/**
 * InternationalSourceCard Component - V2.0
 * Beautiful cards for international news outlets with flags, logos, and hover previews
 * Features: Country flags, language indicators, favorite functionality, quick stats
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Star, Globe, TrendingUp, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button, IconButton } from './ui/button';

/**
 * International News Outlet Interface
 */
interface InternationalOutlet {
  name: string;
  language: string;
  url: string;
  description: string;
  category: string;
  favicon?: string; // Optional favicon/logo URL
  readership?: string; // Optional readership stat (e.g., "5M+ readers")
  established?: string; // Optional founding year
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
  variant?: 'default' | 'compact';
  showStats?: boolean;
}

/**
 * InternationalSourceCard Component
 * Displays international news outlets with country flags, logos, and quick stats
 */
export default function InternationalSourceCard({
  outlet,
  country,
  countryFlag,
  isFavorite = false,
  onToggleFavorite,
  variant = 'default',
  showStats = true,
}: InternationalSourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(outlet.name);
    }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        className="relative p-4 rounded-lg transition-all cursor-pointer"
        style={{
          background: isHovered ? 'var(--background-subtle)' : 'var(--background-elevated)',
          border: '1px solid var(--border-primary)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          {/* Flag & Favicon */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">{countryFlag}</span>
            {outlet.favicon && (
              <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={outlet.favicon}
                  alt={`${outlet.name} logo`}
                  fill
                  sizes="24px"
                  className="object-contain"
                  unoptimized={!outlet.favicon.startsWith('http')}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>
              {outlet.name}
            </h4>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>{country}</span>
              <span>•</span>
              <span>{outlet.language}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {onToggleFavorite && (
              <IconButton
                icon={<Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />}
                onClick={handleFavoriteClick}
                variant="ghost"
                size="sm"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                style={{
                  color: isFavorite ? 'var(--color-warning)' : 'var(--text-tertiary)',
                }}
              />
            )}
            <a href={outlet.url} target="_blank" rel="noopener noreferrer">
              <IconButton
                icon={<ExternalLink className="w-4 h-4" />}
                variant="ghost"
                size="sm"
                aria-label="Visit site"
              />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - Full card
  return (
    <article
      className="relative rounded-lg transition-all group"
      style={{
        background: 'var(--background-elevated)',
        border: '1px solid var(--border-primary)',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {/* Flag & Logo */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl flex-shrink-0">{countryFlag}</span>
              {outlet.favicon && (
                <div
                  className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 p-1"
                  style={{
                    border: '1px solid var(--border-primary)',
                    background: 'var(--background-primary)',
                  }}
                >
                  <Image
                    src={outlet.favicon}
                    alt={`${outlet.name} logo`}
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                    unoptimized={!outlet.favicon.startsWith('http')}
                  />
                </div>
              )}
            </div>

            {/* Outlet Name */}
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              {outlet.name}
            </h3>

            {/* Country & Language */}
            <div className="flex items-center gap-2 text-sm flex-wrap" style={{ color: 'var(--text-tertiary)' }}>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{country}</span>
              </div>
              <span>•</span>
              <span>{outlet.language}</span>
            </div>
          </div>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <IconButton
              icon={<Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />}
              onClick={handleFavoriteClick}
              variant="ghost"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{
                color: isFavorite ? 'var(--color-warning)' : 'var(--text-tertiary)',
              }}
            />
          )}
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <Badge variant="secondary" size="sm">
            {outlet.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {outlet.description}
        </p>

        {/* Quick Stats - Hover Preview */}
        {showStats && (outlet.readership || outlet.established) && (
          <div
            className={`mb-4 p-3 rounded-lg transition-all ${
              isHovered ? 'opacity-100' : 'opacity-60'
            }`}
            style={{
              background: 'var(--background-subtle)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="flex items-center gap-4 text-xs">
              {outlet.readership && (
                <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <Users className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  <span>{outlet.readership}</span>
                </div>
              )}
              {outlet.established && (
                <>
                  {outlet.readership && <span style={{ color: 'var(--text-tertiary)' }}>•</span>}
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                    <span>Est. {outlet.established}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Visit Site Button */}
        <a
          href={outlet.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            variant={isHovered ? 'primary' : 'outline'}
            size="md"
            fullWidth
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            Visit Site
          </Button>
        </a>
      </div>

      {/* Hover Indicator */}
      {isHovered && (
        <div
          className="absolute top-0 right-0 w-1 h-full rounded-r-lg"
          style={{ background: 'var(--accent-primary)' }}
        />
      )}
    </article>
  );
}

/**
 * InternationalSourceCardSkeleton - Loading state
 */
export function InternationalSourceCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div
        className="p-4 rounded-lg animate-pulse"
        style={{
          background: 'var(--background-elevated)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="skeleton w-8 h-8 rounded" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg animate-pulse"
      style={{
        background: 'var(--background-elevated)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="skeleton w-8 h-8 rounded" />
            <div className="skeleton w-10 h-10 rounded-lg" />
          </div>
          <div className="skeleton h-6 w-48 rounded mb-2" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
      </div>
      <div className="skeleton h-5 w-20 rounded-full mb-4" />
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      <div className="skeleton h-10 w-full rounded-lg" />
    </div>
  );
}
