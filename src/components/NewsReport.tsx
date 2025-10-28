/**
 * NewsReport Component - V2
 * Simplified, modern news display for category pages
 * Uses new ArticleCard design with clean layout
 */

'use client';

import { Clock } from 'lucide-react';
import { Article } from '@/types';
import ArticleCard from './ArticleCard';

interface NewsReportProps {
  category: string;
  categoryName: string;
  articles: Article[];
  lastUpdated?: Date;
}

export default function NewsReport({
  categoryName,
  articles,
  lastUpdated = new Date(),
}: NewsReportProps) {
  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen" style={{ paddingTop: '64px' }}>
      {/* Header Section */}
      <header className="section-spacing" style={{ background: 'var(--background-subtle)' }}>
        <div className="container max-w-4xl">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="heading-hero">{categoryName}</h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Latest news and updates in {categoryName.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2 text-meta">
              <Clock className="w-4 h-4" />
              <time dateTime={lastUpdated.toISOString()}>
                Updated {formatLastUpdated()}
              </time>
            </div>
          </div>

          {/* Article Count */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--background-elevated)', border: '1px solid var(--border)' }}>
            <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
              {articles.length}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {articles.length === 1 ? 'article' : 'articles'}
            </span>
          </div>
        </div>
      </header>

      {/* Articles Section */}
      <section className="section-spacing">
        <div className="container max-w-4xl">
          {articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  priority={index === 0}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                No articles available in this category at the moment.
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Check back later for updates.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      {articles.length > 0 && (
        <footer className="section-spacing text-center" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <p style={{ color: 'var(--text-secondary)' }}>
              Showing all {articles.length} article{articles.length !== 1 ? 's' : ''} in {categoryName}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Articles are aggregated from multiple trusted news sources
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
