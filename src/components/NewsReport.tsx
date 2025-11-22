/**
 * NewsReport Component - V2.0
 * Magazine-style layout for category pages with featured stories and visual hierarchy
 * Features: Hero article, grid layout, section separators, related articles
 */

'use client';

import { Clock, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { Article } from '@/types';
import ArticleCard from './ArticleCard';
import { CategoryEmptyState } from './EmptyState';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import { useState } from 'react';

interface NewsReportProps {
  category: string;
  categoryName: string;
  articles: Article[];
  lastUpdated?: Date;
  showFeatured?: boolean;
  relatedCategories?: Array<{ name: string; slug: string }>;
}

export default function NewsReport({
  categoryName,
  articles,
  lastUpdated = new Date(),
  showFeatured = true,
  relatedCategories = [],
}: NewsReportProps) {
  const [visibleCount, setVisibleCount] = useState(12);

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Split articles into featured and regular
  const featuredArticle = showFeatured && articles.length > 0 ? articles[0] : null;
  const topStories = articles.slice(1, 4); // Articles 2-4
  const regularArticles = articles.slice(4); // Rest of articles
  const visibleArticles = regularArticles.slice(0, visibleCount - 4);
  const hasMore = regularArticles.length > visibleCount - 4;

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="min-h-screen" style={{ paddingTop: '64px' }}>
        <div className="section-spacing">
          <CategoryEmptyState categoryName={categoryName} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: '64px' }}>
      {/* Header Section - Magazine Style */}
      <header
        className="section-spacing border-b"
        style={{
          background: 'var(--background-subtle)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Category Title */}
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="heading-display" style={{ fontSize: '3rem' }}>
                    {categoryName}
                  </h1>
                  <Badge variant="primary" size="sm">
                    <TrendingUp className="w-3 h-3 mr-1 inline-block" />
                    Live
                  </Badge>
                </div>
                <p
                  className="text-xl max-w-2xl"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Latest news and in-depth coverage of {categoryName.toLowerCase()}
                </p>
              </div>

              {/* Last Updated */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: 'var(--background-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <Clock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-sm">
                  <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                    Updated
                  </div>
                  <time
                    dateTime={lastUpdated.toISOString()}
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {formatLastUpdated()}
                  </time>
                </div>
              </div>
            </div>

            {/* Article Count & Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'var(--background-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <span className="font-bold text-lg" style={{ color: 'var(--accent-primary)' }}>
                  {articles.length}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {articles.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              {/* Related Categories */}
              {relatedCategories.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Related:
                  </span>
                  {relatedCategories.map((cat) => (
                    <Link key={cat.slug} href={`/category/${cat.slug}`}>
                      <Badge variant="secondary" size="sm" className="hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer">
                        {cat.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="section-spacing">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Featured Article - Hero Treatment */}
            {featuredArticle && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h2
                    className="text-xl font-bold uppercase tracking-wide"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Featured Story
                  </h2>
                </div>
                <ArticleCard article={featuredArticle} priority={true} variant="hero" />
              </section>
            )}

            {/* Top Stories - Horizontal Cards */}
            {topStories.length > 0 && (
              <section className="mb-16">
                <div
                  className="flex items-center gap-2 mb-6 pb-3 border-b"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h2
                    className="text-xl font-bold uppercase tracking-wide"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Top Stories
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ background: 'var(--border-primary)' }}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {topStories.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                      showCategory={false}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* More Articles - Grid Layout */}
            {regularArticles.length > 0 && (
              <section>
                <div
                  className="flex items-center gap-2 mb-6 pb-3 border-b"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <h2
                    className="text-xl font-bold uppercase tracking-wide"
                    style={{ color: 'var(--foreground)' }}
                  >
                    More in {categoryName}
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ background: 'var(--border-primary)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {regularArticles.length} article{regularArticles.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Article Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                  {visibleArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                      showCategory={false}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Load More Articles
                    </Button>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Summary */}
      <footer
        className="section-spacing border-t text-center"
        style={{
          background: 'var(--background-subtle)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="container max-w-4xl">
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            {visibleCount >= articles.length
              ? `Showing all ${articles.length} article${articles.length !== 1 ? 's' : ''}`
              : `Showing ${Math.min(visibleCount, articles.length)} of ${articles.length} articles`}{' '}
            in {categoryName}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Articles are aggregated from multiple trusted news sources and updated in real-time
          </p>

          {/* Quick Links */}
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <Link href="/">
              <Button variant="ghost" size="sm">
                All Categories
              </Button>
            </Link>
            <Link href="/daily-brief">
              <Button variant="ghost" size="sm">
                Daily Brief
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" size="sm">
                Search Articles
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * NewsReportCompact - Compact variant for sidebar or widgets
 */
export function NewsReportCompact({
  categoryName,
  articles,
  maxArticles = 5,
}: {
  categoryName: string;
  articles: Article[];
  maxArticles?: number;
}) {
  const displayArticles = articles.slice(0, maxArticles);

  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: 'var(--background-elevated)',
        border: '1px solid var(--border-primary)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
          {categoryName}
        </h3>
        <Badge variant="secondary" size="sm">
          {articles.length}
        </Badge>
      </div>

      {/* Compact Article List */}
      <div className="space-y-4">
        {displayArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="compact"
            showCategory={false}
            showBookmark={false}
          />
        ))}
      </div>

      {/* View All Link */}
      {articles.length > maxArticles && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <Link href={`/category/${categoryName.toLowerCase()}`} className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
            View all {articles.length} articles →
          </Link>
        </div>
      )}
    </div>
  );
}
