/**
 * ArticleList Component
 * Compact list view for browsing multiple articles quickly
 * Alternative to the NewsReport format
 */

'use client';

import { useState } from 'react';
import { Grid, List, Calendar, Filter } from 'lucide-react';
import { Article, ViewMode } from '@/types';
import ArticleCard from './ArticleCard';
import { groupArticlesBySource } from '@/lib/category-utils';

interface ArticleListProps {
  categoryName: string;
  articles: Article[];
  lastUpdated?: Date;
  allowViewToggle?: boolean;
  defaultView?: ViewMode;
}

export default function ArticleList({
  categoryName,
  articles,
  lastUpdated = new Date(),
  allowViewToggle = true,
  defaultView = 'list',
}: ArticleListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [groupBySource, setGroupBySource] = useState(false);

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const groupedArticles = groupBySource
    ? groupArticlesBySource(articles)
    : { All: articles };

  return (
    <div className="article-list max-w-6xl mx-auto px-4 section-spacing">
      {/* Header with Controls */}
      <header className="mb-8 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{categoryName}</h1>

          {/* View Controls */}
          <div className="flex items-center gap-3">
            {/* Group by Source Toggle */}
            <button
              onClick={() => setGroupBySource(!groupBySource)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                groupBySource
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Group by Source
            </button>

            {/* View Mode Toggle */}
            {allowViewToggle && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-background-elevated text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('report')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'report'
                      ? 'bg-background-elevated text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={lastUpdated.toISOString()}>
              Updated {formatLastUpdated()}
            </time>
          </div>
          <span className="text-gray-400">•</span>
          <span>
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      {/* Article Grid/List */}
      {groupBySource ? (
        // Grouped by source
        <div className="space-y-8">
          {Object.entries(groupedArticles).map(([source, sourceArticles]) => (
            <section key={source}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {source}
                <span className="ml-2 text-base font-normal text-gray-600">
                  ({sourceArticles.length})
                </span>
              </h2>
              <div
                className={
                  viewMode === 'report'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : 'space-y-4'
                }
              >
                {sourceArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        // Ungrouped list
        <div
          className={
            viewMode === 'report'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }
        >
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <p>No articles available in this category.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Simple article list without controls
 */
export function ArticleListSimple({
  articles,
  columns = 1,
}: {
  articles: Article[];
  columns?: 1 | 2;
}) {
  return (
    <div
      className={
        columns === 2
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
          : 'space-y-4'
      }
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="compact" />
      ))}
    </div>
  );
}
