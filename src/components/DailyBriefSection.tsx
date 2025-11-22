/**
 * DailyBriefSection Component - V2.0
 * Beautiful Daily Brief sections with magazine-style typography and pull quotes
 * Features: Serif headlines, section separators, print-friendly, compact variant
 */

import type { DailyBriefSection as DailyBriefSectionType } from '@/types';
import { format } from 'date-fns';
import { ExternalLink, Clock, Quote, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import Image from 'next/image';

interface DailyBriefSectionProps {
  section: DailyBriefSectionType;
  sectionNumber: number;
  totalSections: number;
  showPullQuote?: boolean;
}

export default function DailyBriefSection({
  section,
  sectionNumber,
  totalSections,
  showPullQuote = true,
}: DailyBriefSectionProps) {
  const { category, articles, summary } = section;

  // Get category slug for linking
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

  // Get a pull quote from the first article (if available)
  const pullQuote =
    showPullQuote && articles[0]?.contentSnippet
      ? articles[0].contentSnippet.split('.')[0] + '.'
      : null;

  return (
    <section className="mb-16 last:mb-0 print:mb-12">
      {/* Section Header - Magazine Style */}
      <div
        className="mb-8 pb-4 border-b-2"
        style={{ borderColor: 'var(--accent-primary)' }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              {/* Section Number Badge */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white text-xl font-bold print:w-10 print:h-10 print:text-lg"
                style={{ background: 'var(--accent-primary)' }}
              >
                {sectionNumber}
              </div>

              {/* Category Title - Serif Font */}
              <h2
                className="text-3xl md:text-4xl font-black uppercase tracking-tight print:text-2xl"
                style={{
                  fontFamily: "'Merriweather', Georgia, serif",
                  color: 'var(--foreground)',
                }}
              >
                {category}
              </h2>

              {/* Live Badge */}
              <Badge variant="primary" size="sm" className="print:hidden">
                <TrendingUp className="w-3 h-3 mr-1 inline-block" />
                Live
              </Badge>
            </div>

            {/* Summary */}
            {summary && (
              <p
                className="text-lg italic leading-relaxed ml-16 print:ml-12 print:text-base"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "'Merriweather', Georgia, serif",
                }}
              >
                &ldquo;{summary}&rdquo;
              </p>
            )}
          </div>

          {/* View All Link */}
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors print:hidden"
            style={{
              background: 'var(--background-subtle)',
              color: 'var(--accent-primary)',
            }}
          >
            <span>View All</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Pull Quote (from first article) */}
      {pullQuote && (
        <div
          className="mb-8 p-6 rounded-lg border-l-4 print:mb-6 print:p-4"
          style={{
            background: 'var(--background-subtle)',
            borderColor: 'var(--accent-primary)',
          }}
        >
          <div className="flex gap-4">
            <Quote
              className="w-8 h-8 flex-shrink-0 print:w-6 print:h-6"
              style={{ color: 'var(--accent-primary)' }}
            />
            <blockquote
              className="text-xl leading-relaxed print:text-lg"
              style={{
                fontFamily: "'Merriweather', Georgia, serif",
                color: 'var(--text-primary)',
              }}
            >
              {pullQuote}
            </blockquote>
          </div>
          <footer className="mt-3 ml-12 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            — {articles[0].sourceName}
          </footer>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-6 print:space-y-4">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className="flex gap-4 pb-6 border-b last:border-0 print:pb-4"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            {/* Article Number */}
            <div className="flex-shrink-0 w-12 print:w-10">
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg font-bold text-lg print:w-9 print:h-9 print:text-base"
                style={{
                  background: 'var(--background-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {index + 1}
              </div>
            </div>

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              {/* Title - Serif Font */}
              <h3
                className="text-xl md:text-2xl font-bold mb-3 leading-tight print:text-lg"
                style={{
                  fontFamily: "'Merriweather', Georgia, serif",
                  color: 'var(--foreground)',
                }}
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent-primary)] transition-colors"
                >
                  {article.title}
                </a>
              </h3>

              {/* Summary */}
              {article.contentSnippet && (
                <p
                  className="text-base leading-relaxed mb-3 line-clamp-2 print:text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {article.contentSnippet}
                </p>
              )}

              {/* Metadata */}
              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm print:text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {/* Source */}
                <span
                  className="font-semibold"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {article.sourceName}
                </span>

                {/* Separator */}
                <span>•</span>

                {/* Author */}
                {article.author && (
                  <>
                    <span>By {article.author}</span>
                    <span>•</span>
                  </>
                )}

                {/* Time */}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(article.pubDate), 'h:mm a')}
                </span>

                {/* Full Date (for print) */}
                <span className="hidden print:inline">
                  • {format(new Date(article.pubDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {/* Article Image (desktop only) */}
            {article.imageUrl && (
              <div className="hidden md:block flex-shrink-0 w-40 h-32 print:hidden">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Section Footer with decorative separator */}
      {sectionNumber < totalSections && (
        <div className="mt-12 pt-8 print:mt-8 print:pt-6">
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-0.5 w-24 rounded-full"
              style={{ background: 'var(--border-primary)' }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--accent-primary)' }}
            />
            <div
              className="h-0.5 w-24 rounded-full"
              style={{ background: 'var(--border-primary)' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * DailyBriefSectionCompact - Compact version for print/email
 * Minimal design optimized for readability in constrained spaces
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
    <section className="mb-8 page-break-inside-avoid">
      {/* Section Header */}
      <div className="mb-4">
        <h2
          className="text-xl font-black uppercase tracking-wide pb-2"
          style={{
            fontFamily: "'Merriweather', Georgia, serif",
            borderBottom: '2px solid #000',
            color: '#000',
          }}
        >
          {sectionNumber}. {category}
        </h2>
      </div>

      {/* Articles List */}
      <div className="space-y-3 ml-6">
        {articles.map((article, index) => (
          <article key={article.id} className="text-sm page-break-inside-avoid">
            <div className="flex gap-2">
              {/* Article Number */}
              <span
                className="font-bold flex-shrink-0"
                style={{ color: '#666' }}
              >
                {sectionNumber}.{index + 1}
              </span>

              {/* Article Content */}
              <div>
                {/* Title */}
                <h3
                  className="font-bold mb-1"
                  style={{
                    fontFamily: "'Merriweather', Georgia, serif",
                    color: '#000',
                  }}
                >
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs mb-1" style={{ color: '#666' }}>
                  {article.contentSnippet?.substring(0, 150)}
                  {(article.contentSnippet?.length || 0) > 150 ? '...' : ''}
                </p>

                {/* Metadata */}
                <p className="text-xs" style={{ color: '#999' }}>
                  {article.sourceName} &bull;{' '}
                  {format(new Date(article.pubDate), 'h:mm a')}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * DailyBriefTableOfContents - TOC for start of brief
 */
export function DailyBriefTableOfContents({
  sections,
}: {
  sections: DailyBriefSectionType[];
}) {
  return (
    <nav
      className="mb-12 p-6 rounded-lg print:mb-8 print:p-4"
      style={{
        background: 'var(--background-elevated)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <h2
        className="text-2xl font-black uppercase tracking-wide mb-6 print:text-xl print:mb-4"
        style={{
          fontFamily: "'Merriweather', Georgia, serif",
          color: 'var(--foreground)',
        }}
      >
        Today&apos;s Brief
      </h2>

      <ol className="space-y-3 print:space-y-2">
        {sections.map((section, index) => (
          <li key={section.category} className="flex items-start gap-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold flex-shrink-0 print:w-6 print:h-6 print:text-xs"
              style={{ background: 'var(--accent-primary)' }}
            >
              {index + 1}
            </span>
            <div className="flex-1 pt-1">
              <a
                href={`#section-${index + 1}`}
                className="font-semibold text-lg hover:text-[var(--accent-primary)] transition-colors print:text-base"
                style={{ color: 'var(--foreground)' }}
              >
                {section.category}
              </a>
              <p className="text-sm mt-1 print:text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {section.articles.length} article{section.articles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
