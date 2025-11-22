/**
 * LoadingState Component - V2.0
 * Content-aware skeleton loaders that match actual layouts
 * Multiple variants for different content types
 */

'use client';

export interface LoadingStateProps {
  variant?: 'card' | 'list' | 'hero' | 'horizontal' | 'compact';
  count?: number;
  className?: string;
}

export default function LoadingState({
  variant = 'card',
  count = 3,
  className = '',
}: LoadingStateProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  // Hero variant - Large featured article skeleton
  if (variant === 'hero') {
    return (
      <div className={`article-card card-spacious ${className}`}>
        {/* Hero image skeleton */}
        <div className="skeleton w-full aspect-[16/9] rounded-xl mb-6" />

        {/* Category badge skeleton */}
        <div className="skeleton h-6 w-24 rounded-full mb-4" />

        {/* Title skeleton - 2 lines */}
        <div className="space-y-3 mb-4">
          <div className="skeleton h-10 w-full rounded-md" />
          <div className="skeleton h-10 w-4/5 rounded-md" />
        </div>

        {/* Meta info skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="skeleton h-4 w-32 rounded-md" />
          <div className="skeleton h-4 w-4 rounded-full" />
          <div className="skeleton h-4 w-24 rounded-md" />
        </div>

        {/* Snippet skeleton - 3 lines */}
        <div className="space-y-2 mb-6">
          <div className="skeleton h-5 w-full rounded-md" />
          <div className="skeleton h-5 w-full rounded-md" />
          <div className="skeleton h-5 w-3/4 rounded-md" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-40 rounded-md" />
          <div className="skeleton h-10 w-10 rounded-md" />
          <div className="skeleton h-10 w-10 rounded-md" />
        </div>
      </div>
    );
  }

  // Horizontal variant - Side-by-side skeleton
  if (variant === 'horizontal') {
    return (
      <div className="space-y-4">
        {skeletons.map((index) => (
          <div key={index} className={`article-card ${className}`}>
            <div className="flex gap-4 sm:gap-6">
              {/* Image skeleton */}
              <div className="flex-shrink-0">
                <div className="skeleton w-32 h-32 sm:w-48 sm:h-32 rounded-lg" />
              </div>

              {/* Content skeleton */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Category */}
                <div className="skeleton h-5 w-20 rounded-full" />

                {/* Title - 2 lines */}
                <div className="space-y-2">
                  <div className="skeleton h-6 w-full rounded-md" />
                  <div className="skeleton h-6 w-3/4 rounded-md" />
                </div>

                {/* Snippet - hidden on mobile */}
                <div className="hidden sm:block space-y-2">
                  <div className="skeleton h-4 w-full rounded-md" />
                  <div className="skeleton h-4 w-2/3 rounded-md" />
                </div>

                {/* Meta and actions */}
                <div className="flex items-center justify-between">
                  <div className="skeleton h-4 w-32 rounded-md" />
                  <div className="flex gap-2">
                    <div className="skeleton h-8 w-8 rounded-md" />
                    <div className="skeleton h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Compact variant - Minimal list skeleton
  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {skeletons.map((index) => (
          <div
            key={index}
            className={`pb-4 border-b border-[var(--border-primary)] ${className}`}
          >
            <div className="flex gap-3">
              {/* Small image */}
              <div className="flex-shrink-0">
                <div className="skeleton w-20 h-20 rounded-md" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title - 2 lines */}
                <div className="skeleton h-5 w-full rounded-md" />
                <div className="skeleton h-5 w-4/5 rounded-md" />

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="skeleton h-3 w-32 rounded-md" />
                  <div className="skeleton h-6 w-6 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List variant - Simple list skeleton
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {skeletons.map((index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border border-[var(--border-primary)] ${className}`}
          >
            <div className="flex items-center justify-between">
              {/* Title */}
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-3/4 rounded-md" />
                <div className="skeleton h-4 w-1/2 rounded-md" />
              </div>

              {/* Icon */}
              <div className="skeleton h-8 w-8 rounded-md ml-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card variant - Standard article card skeleton
  return (
    <div className={`grid gap-6 ${className}`}>
      {skeletons.map((index) => (
        <div key={index} className="article-card">
          {/* Image skeleton - 16:9 */}
          <div className="skeleton w-full aspect-[16/9] rounded-lg mb-4" />

          {/* Category badge skeleton */}
          <div className="skeleton h-5 w-20 rounded-full mb-3" />

          {/* Title skeleton - 3 lines */}
          <div className="space-y-2 mb-3">
            <div className="skeleton h-6 w-full rounded-md" />
            <div className="skeleton h-6 w-full rounded-md" />
            <div className="skeleton h-6 w-3/4 rounded-md" />
          </div>

          {/* Meta info skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton h-4 w-32 rounded-md" />
            <div className="skeleton h-4 w-4 rounded-full" />
            <div className="skeleton h-4 w-24 rounded-md" />
          </div>

          {/* Snippet skeleton - 3 lines */}
          <div className="space-y-2 mb-4">
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-2/3 rounded-md" />
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center justify-between">
            <div className="skeleton h-4 w-32 rounded-md" />
            <div className="flex gap-2">
              <div className="skeleton h-8 w-8 rounded-md" />
              <div className="skeleton h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Page Loading Skeleton
 * Full-page loading state with header and content
 */
export function PageLoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 animate-pulse">
      {/* Page header */}
      <div className="mb-8">
        <div className="skeleton h-12 w-64 rounded-md mb-4" />
        <div className="skeleton h-5 w-96 rounded-md" />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingState variant="card" count={6} />
      </div>
    </div>
  );
}

/**
 * Profile Loading Skeleton
 * For user profile pages
 */
export function ProfileLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Avatar and name */}
      <div className="flex items-center gap-4">
        <div className="skeleton w-24 h-24 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton h-8 w-48 rounded-md" />
          <div className="skeleton h-4 w-32 rounded-md" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 rounded-lg" />
        ))}
      </div>

      {/* Content sections */}
      <div className="space-y-4">
        <div className="skeleton h-6 w-40 rounded-md" />
        <div className="skeleton h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Legacy LoadingStateCompact - For backward compatibility
 */
export function LoadingStateCompact() {
  return <LoadingState variant="compact" count={5} />;
}
