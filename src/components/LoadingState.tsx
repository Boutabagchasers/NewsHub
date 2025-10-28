/**
 * LoadingState Component
 * Skeleton loading UI for article cards with shimmer effect
 */

export default function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Category header skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* Article card skeletons */}
      {[1, 2, 3].map((index) => (
        <div key={index} className="mb-12 animate-pulse">
          {/* Image skeleton */}
          <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>

          {/* Caption skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Headline skeleton */}
          <div className="mb-3 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Source and timestamp skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Content snippet skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Read full article link skeleton */}
          <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>

          {/* Related articles skeleton */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Separator */}
          {index < 3 && (
            <div className="border-t border-gray-200 my-8"></div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Compact loading state for list view
 */
export function LoadingStateCompact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
      </div>

      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 flex gap-4 animate-pulse"
        >
          <div className="bg-gray-200 rounded h-24 w-32 flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
