/**
 * EmptyState Component - V2.0
 * Beautiful empty states with creative illustrations and helpful messaging
 * Multiple variants for different scenarios with clear call-to-action
 */

'use client';

import {
  FileQuestion,
  RefreshCw,
  Home,
  Search,
  Bookmark,
  History,
  Newspaper,
  AlertCircle,
  Wifi,
  Settings,
  TrendingUp,
  Globe,
  Compass,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  variant?:
    | 'noResults'
    | 'noBookmarks'
    | 'noHistory'
    | 'noArticles'
    | 'error'
    | 'offline'
    | 'custom';
  title?: string;
  message?: string;
  showHomeLink?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  suggestions?: string[];
  icon?: React.ReactNode;
}

export default function EmptyState({
  variant = 'noArticles',
  title,
  message,
  showHomeLink = true,
  showRefresh = false,
  onRefresh,
  actionButton,
  suggestions,
  icon,
}: EmptyStateProps) {
  // Variant-specific configurations
  const variantConfig = {
    noResults: {
      icon: (
        <div className="relative">
          <Search className="w-16 h-16 text-[var(--accent-primary)]" strokeWidth={1.5} />
          <FileQuestion
            className="w-8 h-8 text-[var(--text-tertiary)] absolute -bottom-2 -right-2"
            strokeWidth={2}
          />
        </div>
      ),
      title: 'No Results Found',
      message:
        "We couldn't find any articles matching your search. Try different keywords or check your spelling.",
      suggestions: [
        'Use different or more general keywords',
        'Check your spelling and try again',
        'Try searching in a specific category',
        'Browse our latest articles instead',
      ],
    },
    noBookmarks: {
      icon: (
        <div className="relative">
          <Bookmark className="w-16 h-16 text-[var(--accent-primary)]" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--background-primary)]">
            <div className="w-3 h-3 rounded-full border-2 border-[var(--text-tertiary)]" />
          </div>
        </div>
      ),
      title: 'No Bookmarks Yet',
      message:
        'Start bookmarking articles you want to read later. They\'ll appear here for easy access.',
      suggestions: [
        'Bookmark articles by clicking the bookmark icon',
        'Organize your reading list for later',
        'Access your bookmarks anytime',
        'Keep track of important stories',
      ],
    },
    noHistory: {
      icon: (
        <div className="relative">
          <History className="w-16 h-16 text-[var(--accent-primary)]" strokeWidth={1.5} />
          <div className="absolute top-0 right-0 w-4 h-4">
            <div className="w-full h-full rounded-full bg-[var(--background-primary)]" />
          </div>
        </div>
      ),
      title: 'No Reading History',
      message:
        "You haven't read any articles yet. Start exploring to build your reading history.",
      suggestions: [
        'Browse articles by category',
        'Search for topics you\'re interested in',
        'Check out today\'s Daily Brief',
        'Your reading history will appear here',
      ],
    },
    noArticles: {
      icon: (
        <div className="relative flex items-center justify-center">
          <Newspaper className="w-16 h-16 text-[var(--accent-primary)]" strokeWidth={1.5} />
          <TrendingUp
            className="w-6 h-6 text-[var(--color-success)] absolute -top-2 -right-2"
            strokeWidth={2}
          />
        </div>
      ),
      title: 'No Articles Available',
      message:
        'There are currently no articles in this category. New articles are added regularly, so check back soon!',
      suggestions: [
        'Try a different category',
        'Check back in a few minutes',
        'Explore international news sources',
        'Browse the Daily Brief for curated stories',
      ],
    },
    error: {
      icon: (
        <div className="relative">
          <AlertCircle className="w-16 h-16 text-[var(--accent-danger)]" strokeWidth={1.5} />
          <RefreshCw
            className="w-6 h-6 text-[var(--text-secondary)] absolute -bottom-1 -right-1"
            strokeWidth={2}
          />
        </div>
      ),
      title: 'Something Went Wrong',
      message:
        'We encountered an error while loading articles. Please try refreshing the page or check back later.',
      suggestions: [
        'Refresh the page and try again',
        'Check your internet connection',
        'Try a different category',
        'Contact support if the issue persists',
      ],
    },
    offline: {
      icon: (
        <div className="relative">
          <Wifi className="w-16 h-16 text-[var(--text-tertiary)]" strokeWidth={1.5} />
          <div className="absolute inset-0 w-20 h-1 bg-[var(--accent-danger)] rotate-45 rounded-full transform translate-y-8" />
        </div>
      ),
      title: 'No Internet Connection',
      message:
        "It looks like you're offline. Please check your internet connection and try again.",
      suggestions: [
        'Check your WiFi or cellular connection',
        'Try turning airplane mode off',
        'Restart your router if using WiFi',
        'Check with your internet service provider',
      ],
    },
    custom: {
      icon: <Compass className="w-16 h-16 text-[var(--accent-primary)]" strokeWidth={1.5} />,
      title: title || 'Nothing Here Yet',
      message: message || 'Start exploring to see content here.',
      suggestions: suggestions || [],
    },
  };

  const config = variantConfig[variant];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const displaySuggestions = suggestions || config.suggestions;
  const displayIcon = icon || config.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
      {/* Icon Illustration */}
      <div className="flex justify-center mb-8">
        <div
          className="icon-container-lg rounded-full p-8"
          style={{
            background: 'var(--background-elevated)',
            border: '2px solid var(--border-primary)',
          }}
        >
          {displayIcon}
        </div>
      </div>

      {/* Title */}
      <h2
        className="text-3xl sm:text-4xl font-bold mb-4"
        style={{ color: 'var(--foreground)' }}
      >
        {displayTitle}
      </h2>

      {/* Message */}
      <p
        className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto"
        style={{ color: 'var(--text-secondary)' }}
      >
        {displayMessage}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap mb-12">
        {/* Custom Action Button */}
        {actionButton && (
          <>
            {actionButton.href ? (
              <Link href={actionButton.href}>
                <Button variant="primary" size="lg">
                  {actionButton.label}
                </Button>
              </Link>
            ) : (
              <Button variant="primary" size="lg" onClick={actionButton.onClick}>
                {actionButton.label}
              </Button>
            )}
          </>
        )}

        {/* Refresh Button */}
        {showRefresh && onRefresh && (
          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        )}

        {/* Home Link */}
        {showHomeLink && !actionButton && (
          <Link href="/">
            <Button variant="primary" size="lg" leftIcon={<Home className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
        )}
      </div>

      {/* Suggestions Section */}
      {displaySuggestions && displaySuggestions.length > 0 && (
        <div
          className="pt-8 border-t max-w-md mx-auto"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
              Suggestions
            </h3>
          </div>
          <ul className="text-sm space-y-2 text-left" style={{ color: 'var(--text-secondary)' }}>
            {displaySuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[var(--accent-primary)] mt-1">•</span>
                <span className="flex-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * SearchEmptyState - No search results variant
 */
export function SearchEmptyState({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      variant="noResults"
      title="No Results Found"
      message={
        query
          ? `We couldn't find any articles matching "${query}". Try different keywords or browse by category.`
          : "We couldn't find any articles matching your search."
      }
      actionButton={
        onClear
          ? {
              label: 'Clear Search',
              onClick: onClear,
            }
          : undefined
      }
      showHomeLink={true}
    />
  );
}

/**
 * BookmarksEmptyState - No bookmarks variant
 */
export function BookmarksEmptyState() {
  return (
    <EmptyState
      variant="noBookmarks"
      actionButton={{
        label: 'Explore Articles',
        href: '/',
      }}
      showHomeLink={false}
    />
  );
}

/**
 * HistoryEmptyState - No reading history variant
 */
export function HistoryEmptyState() {
  return (
    <EmptyState
      variant="noHistory"
      actionButton={{
        label: 'Start Reading',
        href: '/',
      }}
      showHomeLink={false}
    />
  );
}

/**
 * ErrorState - Error variant with retry
 */
export function ErrorState({
  error,
  onRetry,
}: {
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="error"
      message={
        error ||
        'We encountered an error while loading articles. Please try refreshing the page or check back later.'
      }
      showHomeLink={true}
      showRefresh={true}
      onRefresh={onRetry}
    />
  );
}

/**
 * OfflineState - Offline/no connection variant
 */
export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      variant="offline"
      showHomeLink={false}
      showRefresh={true}
      onRefresh={onRetry}
    />
  );
}

/**
 * CategoryEmptyState - No articles in category variant
 */
export function CategoryEmptyState({ categoryName }: { categoryName?: string }) {
  return (
    <EmptyState
      variant="noArticles"
      title="No Articles Available"
      message={
        categoryName
          ? `There are currently no articles in the ${categoryName} category. New articles are added regularly!`
          : 'There are currently no articles in this category. New articles are added regularly!'
      }
      actionButton={{
        label: 'Browse All Categories',
        href: '/',
      }}
      showRefresh={true}
    />
  );
}

/**
 * SettingsEmptyState - For settings sections
 */
export function SettingsEmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <EmptyState
      variant="custom"
      title={title}
      message={message}
      actionButton={{
        label: actionLabel,
        onClick: onAction,
      }}
      showHomeLink={false}
      icon={<Settings className="w-16 h-16 text-[var(--accent-primary)]" strokeWidth={1.5} />}
    />
  );
}
