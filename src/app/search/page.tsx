/**
 * Search Results Page
 * Displays search results with filters, sorting, and empty states
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { searchArticles, getUniqueCategories, getUniqueSources, getDidYouMeanSuggestions } from '@/lib/search-utils';
import { Article, SearchOptions } from '@/types';
import { AlertCircle, Search as SearchIcon } from 'lucide-react';
import { logger } from '@/lib/logger';

interface SearchPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate metadata for search page
 */
export async function generateMetadata(props: SearchPageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';

  return {
    title: query ? `Search: ${query} - NewsHub` : 'Search - NewsHub',
    description: 'Search for news articles across all categories and sources',
  };
}

/**
 * Fetch all articles for searching from the API
 */
async function fetchAllArticles(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles`, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      logger.error('Failed to fetch articles for search', { statusText: response.statusText });
      return [];
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    logger.error('Error fetching articles for search', error);
    return [];
  }
}

/**
 * Search Page Component
 */
export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const sortBy = typeof searchParams?.sort === 'string' ? searchParams.sort as 'relevance' | 'date' | 'source' : 'relevance';

  // If no query, show search interface only
  if (!query || query.trim().length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <SearchIcon className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
              <h1 className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                Search NewsHub
              </h1>
            </div>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Find articles across all categories and sources
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <SearchBar autoFocus={true} showShortcut={true} />
          </div>

          {/* Search Tips */}
          <div className="max-w-2xl mx-auto">
            <Card variant="elevated" padding="lg">
              <CardContent>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                  Search Tips
                </h2>
                <ul className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
                  <li className="flex items-start gap-3">
                    <span className="mt-1" style={{ color: 'var(--accent-primary)' }}>•</span>
                    <span>Search by keywords, topics, or phrases</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1" style={{ color: 'var(--accent-primary)' }}>•</span>
                    <span>Filter results by category or source</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1" style={{ color: 'var(--accent-primary)' }}>•</span>
                    <span>Sort by relevance, date, or source</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1" style={{ color: 'var(--accent-primary)' }}>•</span>
                    <span>Use Ctrl+K (or Cmd+K on Mac) to quickly focus the search bar</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Fetch articles and perform search
  const allArticles = await fetchAllArticles();
  const searchOptions: SearchOptions = {
    sortBy,
  };

  const results = searchArticles(allArticles, query, searchOptions);
  const categories = getUniqueCategories(allArticles);
  const sources = getUniqueSources(allArticles);

  // Get "Did you mean" suggestions if no results
  const didYouMeanSuggestions = results.length === 0
    ? getDidYouMeanSuggestions(allArticles, query)
    : [];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search Bar */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <SearchBar initialQuery={query} showShortcut={true} />
          </div>

          {/* Results Summary */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Search Results for &quot;{query}&quot;
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {results.length === 0
                ? 'No results found'
                : `Found ${results.length} ${results.length === 1 ? 'article' : 'articles'}`}
            </p>
          </div>
        </div>

        {/* Results or Empty State */}
        <Suspense fallback={<LoadingState />}>
          {results.length > 0 ? (
            <SearchResults
              results={results}
              query={query}
              categories={categories}
              sources={sources}
            />
          ) : (
            <div className="max-w-2xl mx-auto">
              <EmptyState
                title="No Results Found"
                message={`We couldn't find any articles matching "${query}". Try different keywords or check your spelling.`}
                showHomeLink={false}
              />

              {/* Did You Mean Suggestions */}
              {didYouMeanSuggestions.length > 0 && (
                <div className="mt-8">
                  <Card variant="default" padding="lg">
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-info)' }} />
                        <div>
                          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                            Did you mean:
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {didYouMeanSuggestions.map((suggestion, index) => (
                              <a
                                key={index}
                                href={`/search?q=${encodeURIComponent(suggestion)}`}
                                className="px-3 py-1 rounded-full text-sm transition-colors"
                                style={{
                                  background: 'var(--background-subtle)',
                                  color: 'var(--accent-primary)',
                                  border: '1px solid var(--border-primary)'
                                }}
                              >
                                {suggestion}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Popular Categories */}
              <div className="mt-8">
                <Card variant="elevated" padding="lg">
                  <CardContent>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                      Browse by Category
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['U.S. News', 'World News', 'Technology', 'Sports'].map((category) => (
                        <a
                          key={category}
                          href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                          style={{
                            background: 'var(--background-subtle)',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {category}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
