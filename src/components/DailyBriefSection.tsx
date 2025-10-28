/**
 * DailyBriefSection Component
 * Displays a section of the Daily Brief with articles from a specific category
 */

import type { DailyBriefSection as DailyBriefSectionType } from '@/types';
import { format } from 'date-fns';
import { ExternalLink, Clock } from 'lucide-react';

interface DailyBriefSectionProps {
  section: DailyBriefSectionType;
  sectionNumber: number;
  totalSections: number;
}

export default function DailyBriefSection({
  section,
  sectionNumber,
  totalSections,
}: DailyBriefSectionProps) {
  const { category, articles, summary } = section;

  // Get category slug for linking
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="mb-12 last:mb-0">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-primary">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white text-sm font-bold rounded-full">
              {sectionNumber}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy uppercase tracking-wide">
              {category}
            </h2>
          </div>
          {summary && (
            <p className="text-sm text-gray-600 mt-2 ml-11 italic">
              {summary}
            </p>
          )}
        </div>
        <a
          href={`/category/${categorySlug}`}
          className="text-sm text-primary hover:underline flex items-center gap-1 print:hidden"
        >
          View all
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className="flex gap-4 pb-5 border-b border-gray-200 last:border-0"
          >
            {/* Article Number */}
            <div className="flex-shrink-0 w-12">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-light-gray text-gray-700 font-bold rounded-lg">
                {index + 1}
              </span>
            </div>

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-lg font-semibold text-navy mb-2 leading-tight">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {article.title}
                </a>
              </h3>

              {/* Summary */}
              {article.contentSnippet && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.contentSnippet}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                {/* Source */}
                <span className="font-medium text-primary">
                  {article.sourceName}
                </span>

                {/* Author */}
                {article.author && (
                  <span className="flex items-center gap-1">
                    By {article.author}
                  </span>
                )}

                {/* Time */}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(article.pubDate), 'h:mm a')}
                </span>

                {/* Full Date (for print) */}
                <span className="hidden print:inline">
                  {format(new Date(article.pubDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {/* Article Image (optional) */}
            {article.imageUrl && (
              <div className="hidden md:block flex-shrink-0 w-32 h-24">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Section Footer with separator for non-last sections */}
      {sectionNumber < totalSections && (
        <div className="mt-8 pt-8 border-t border-gray-300">
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary-light rounded-full mx-auto" />
        </div>
      )}
    </section>
  );
}

/**
 * Compact version for print/email
 */
export function DailyBriefSectionCompact({
  section,
  sectionNumber,
}: {
  section: DailyBriefSectionType;
  sectionNumber: number;
}) {
  const { category, articles } = section;

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-800 pb-2">
          {sectionNumber}. {category}
        </h2>
      </div>

      {/* Articles List */}
      <div className="space-y-3 ml-6">
        {articles.map((article, index) => (
          <article key={article.id} className="text-sm">
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 flex-shrink-0">
                {sectionNumber}.{index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-xs mb-1">
                  {article.contentSnippet?.substring(0, 150)}
                  {(article.contentSnippet?.length || 0) > 150 ? '...' : ''}
                </p>
                <p className="text-gray-500 text-xs">
                  {article.sourceName} &bull; {format(new Date(article.pubDate), 'h:mm a')}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
