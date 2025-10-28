'use client';

/**
 * SearchResults Component
 * Displays search results with highlighting, filters, and sorting options
 */

import React, { useState } from 'react';
import { Filter, SortAsc, Grid, List } from 'lucide-react';
import type { SearchResult } from '@/types';
import { format } from 'date-fns';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  categories: string[];
  sources: string[];
  onFilterChange?: (filters: { categories: string[]; sources: string[] }) => void;
  onSortChange?: (sortBy: 'relevance' | 'date' | 'source') => void;
}

export default function SearchResults({
  results,
  query,
  categories,
  sources,
  onFilterChange,
  onSortChange,
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'source'>('relevance');

  // Handle category filter toggle
  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    onFilterChange?.({ categories: updated, sources: selectedSources });
  };

  // Handle source filter toggle
  const handleSourceToggle = (source: string) => {
    const updated = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source];

    setSelectedSources(updated);
    onFilterChange?.({ categories: selectedCategories, sources: updated });
  };

  // Handle sort change
  const handleSortChange = (newSortBy: 'relevance' | 'date' | 'source') => {
    setSortBy(newSortBy);
    onSortChange?.(newSortBy);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSources([]);
    onFilterChange?.({ categories: [], sources: [] });
  };

  // Highlight text helper
  const highlightText = (text: string, highlight: string): React.ReactElement => {
    if (!highlight.trim()) return <>{text}</>;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-sky-blue px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  // Active filter count
  const activeFilterCount = selectedCategories.length + selectedSources.length;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        {/* Left side - Filters and View */}
        <div className="flex items-center gap-4">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-sky-blue border-primary text-primary'
                : 'bg-background-elevated border-gray-300 hover:bg-background-subtle'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-background-subtle'
                  : 'bg-background-elevated hover:bg-gray-100'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-background-subtle'
                  : 'bg-background-elevated hover:bg-gray-100'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right side - Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'relevance' | 'date' | 'source')}
            className="px-3 py-1.5 border border-gray-300 rounded-lg bg-background-elevated text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="source">Source</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-light-gray rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Filter Results</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Categories Filter */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Categories
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sources Filter */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Sources
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sources.map(source => (
                  <label key={source} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source)}
                      onChange={() => handleSourceToggle(source)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{source}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }
      >
        {results.map((result) => (
          <SearchResultCard
            key={result.article.id}
            result={result}
            query={query}
            viewMode={viewMode}
            highlightText={highlightText}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Search Result Card Component
function SearchResultCard({
  result,
  query,
  viewMode,
  highlightText,
}: {
  result: SearchResult;
  query: string;
  viewMode: 'grid' | 'list';
  highlightText: (text: string, query: string) => React.ReactElement;
}) {
  const { article, relevanceScore, matchedFields } = result;

  return (
    <article
      className={`bg-background-elevated rounded-lg border border-gray-200 hover:shadow-lg transition-shadow ${
        viewMode === 'list' ? 'p-6' : 'p-4'
      }`}
    >
      {/* Category & Source Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 bg-sky-blue text-primary text-xs font-medium rounded">
          {article.category}
        </span>
        <span className="text-xs text-gray-500">
          {article.sourceName}
        </span>
        {relevanceScore > 0 && (
          <span className="ml-auto text-xs text-gray-400">
            Score: {relevanceScore}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 text-gray-900">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          {highlightText(article.title, query)}
        </a>
      </h3>

      {/* Content Snippet */}
      {article.contentSnippet && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {highlightText(article.contentSnippet, query)}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {article.author && <span>{article.author}</span>}
        <span>{format(new Date(article.pubDate), 'MMM d, yyyy')}</span>
        {matchedFields.length > 0 && (
          <span className="text-primary">
            Matched: {matchedFields.join(', ')}
          </span>
        )}
      </div>
    </article>
  );
}
