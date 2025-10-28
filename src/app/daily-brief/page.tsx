/**
 * Daily Brief Page
 * Displays a consolidated daily news brief with top stories from major categories
 */

'use client';

import { useEffect, useState } from 'react';
import DailyBriefSection from '@/components/DailyBriefSection';
import LoadingState from '@/components/LoadingState';
import { generateDailyBrief, formatBriefDate, getBriefStatistics } from '@/lib/daily-brief-utils';
import type { DailyBrief, Article } from '@/types';
import { Printer, Share2, RefreshCw, Download, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { logger } from '@/lib/logger';

/**
 * Fetch all articles for the brief from the API
 */
async function fetchAllArticles(): Promise<Article[]> {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/articles`, {
      cache: 'no-store', // Always fetch fresh for daily brief
    });

    if (!response.ok) {
      logger.error('Failed to fetch articles for daily brief', { statusText: response.statusText });
      return [];
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    logger.error('Error fetching articles for daily brief', error);
    return [];
  }
}

export default function DailyBriefPage() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load the brief
  useEffect(() => {
    async function loadBrief() {
      setIsLoading(true);
      try {
        const articles = await fetchAllArticles();
        const generatedBrief = generateDailyBrief(articles);
        setBrief(generatedBrief);
        setLastUpdated(new Date());
      } catch (error) {
        logger.error('Error loading daily brief', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadBrief();
  }, []);

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: `NewsHub Daily Brief - ${formatBriefDate(new Date())}`,
      text: 'Check out today\'s Daily Brief from NewsHub',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        logger.debug('Share cancelled or error', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Refresh brief
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const articles = await fetchAllArticles();
      const generatedBrief = generateDailyBrief(articles);
      setBrief(generatedBrief);
      setLastUpdated(new Date());
    } catch (error) {
      logger.error('Error refreshing brief', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Download as text
  const handleDownload = () => {
    if (!brief) return;

    const text = generateTextVersion(brief);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-brief-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!brief) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">
            Unable to Load Daily Brief
          </h2>
          <p className="text-gray-600">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = getBriefStatistics(brief);

  return (
    <div className="min-h-screen bg-light-gray print:bg-white">
      {/* Header */}
      <header className="bg-background-elevated border-b border-gray-200 shadow-sm print:shadow-none print:border-b-2 print:border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-primary print:text-black" />
              <h1 className="text-4xl font-bold text-navy print:text-black">
                Daily Brief
              </h1>
            </div>
            <p className="text-xl text-gray-600 print:text-black font-medium">
              {formatBriefDate(brief.date)}
            </p>
            <p className="text-sm text-gray-500 print:text-gray-700 mt-1">
              Your personalized news summary
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span className="font-medium">Print</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-light-gray hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">Share</span>
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-light-gray hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="font-medium">Refresh</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-light-gray hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Download</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 pt-4 border-t border-gray-200 print:border-gray-400">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 print:text-gray-700">
                  Total Articles:
                </span>
                <span className="font-bold text-navy print:text-black">
                  {stats.totalArticles}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 print:text-gray-700">
                  Categories:
                </span>
                <span className="font-bold text-navy print:text-black">
                  {stats.totalSections}
                </span>
              </div>
              <div className="flex items-center gap-2 print:flex">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 print:text-gray-700">
                  Last updated: {format(lastUpdated, 'h:mm a')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 section-spacing print:py-6">
        {brief.sections.map((section, index) => (
          <DailyBriefSection
            key={section.category}
            section={section}
            sectionNumber={index + 1}
            totalSections={brief.sections.length}
          />
        ))}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 print:border-gray-400 text-center">
          <p className="text-sm text-gray-600 print:text-gray-700">
            NewsHub Daily Brief &bull; Generated {format(brief.generatedAt, 'MMMM d, yyyy \'at\' h:mm a')}
          </p>
          <p className="text-xs text-gray-500 print:text-gray-600 mt-2">
            Articles aggregated from trusted news sources &bull; Visit newshub.com for more
          </p>
        </footer>
      </main>
    </div>
  );
}

// Helper function to generate text version for download
function generateTextVersion(brief: DailyBrief): string {
  const lines: string[] = [];

  lines.push('=' .repeat(60));
  lines.push('NEWSHUB DAILY BRIEF');
  lines.push(formatBriefDate(brief.date).toUpperCase());
  lines.push('=' .repeat(60));
  lines.push('');

  brief.sections.forEach((section, sectionIndex) => {
    lines.push('');
    lines.push(`${sectionIndex + 1}. ${section.category.toUpperCase()}`);
    lines.push('-'.repeat(60));
    lines.push('');

    if (section.summary) {
      lines.push(section.summary);
      lines.push('');
    }

    section.articles.forEach((article, articleIndex) => {
      lines.push(`${sectionIndex + 1}.${articleIndex + 1} ${article.title}`);
      lines.push(`    Source: ${article.sourceName}`);
      if (article.author) {
        lines.push(`    By: ${article.author}`);
      }
      lines.push(`    Time: ${format(new Date(article.pubDate), 'h:mm a')}`);
      if (article.contentSnippet) {
        lines.push(`    ${article.contentSnippet}`);
      }
      lines.push(`    Link: ${article.link}`);
      lines.push('');
    });
  });

  lines.push('');
  lines.push('=' .repeat(60));
  lines.push(`Generated: ${format(brief.generatedAt, 'MMMM d, yyyy \'at\' h:mm a')}`);
  lines.push(`Total Articles: ${brief.totalArticles}`);
  lines.push('=' .repeat(60));

  return lines.join('\n');
}
