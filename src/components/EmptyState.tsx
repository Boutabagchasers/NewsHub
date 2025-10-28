/**
 * EmptyState Component
 * Displays a friendly message when no articles are available
 */

import { FileQuestion, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export default function EmptyState({
  title = 'No Articles Found',
  message = 'There are currently no articles available in this category. Please check back later.',
  showHomeLink = true,
  showRefresh = false,
  onRefresh,
}: EmptyStateProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-full p-6">
          <FileQuestion className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>

      <div className="flex gap-4 justify-center">
        {showHomeLink && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        )}

        {showRefresh && onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Suggestions
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>Try checking a different category</li>
          <li>Come back later for fresh content</li>
          <li>Check your internet connection</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Error state variant
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
      title="Unable to Load Articles"
      message={
        error ||
        'An error occurred while fetching articles. Please try again later.'
      }
      showHomeLink={true}
      showRefresh={true}
      onRefresh={onRetry}
    />
  );
}
