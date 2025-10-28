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
import { searchArticles, getUniqueCategories, getUniqueSources, getDidYouMeanSuggestions } from '@/lib/search-utils';
import { Article, SearchOptions } from '@/types';
import { AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">
              Search NewsHub
            </h1>
            <p className="text-lg text-gray-600">
              Find articles across all categories and sources
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <SearchBar autoFocus={true} showShortcut={true} />
          </div>

          {/* Search Tips */}
          <div className="max-w-2xl mx-auto bg-background-elevated rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy mb-4">
              Search Tips
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">&bull;</span>
                <span>Search by keywords, topics, or phrases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">&bull;</span>
                <span>Filter results by category or source</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">&bull;</span>
                <span>Sort by relevance, date, or source</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">&bull;</span>
                <span>Use Ctrl+K (or Cmd+K on Mac) to quickly focus the search bar</span>
              </li>
            </ul>
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search Bar */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <SearchBar initialQuery={query} showShortcut={true} />
          </div>

          {/* Results Summary */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-navy mb-2">
              Search Results for &quot;{query}&quot;
            </h1>
            <p className="text-gray-600">
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
                <div className="mt-8 p-6 bg-sky-blue rounded-lg border border-primary">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-navy mb-2">
                        Did you mean:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {didYouMeanSuggestions.map((suggestion, index) => (
                          <a
                            key={index}
                            href={`/search?q=${encodeURIComponent(suggestion)}`}
                            className="px-3 py-1 bg-background-elevated text-primary rounded-full text-sm hover:bg-sky-blue-light transition-colors border border-primary"
                          >
                            {suggestion}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div className="mt-8 p-6 bg-background-elevated rounded-lg border border-gray-200">
                <h3 className="font-semibold text-navy mb-4">
                  Browse by Category
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['U.S. News', 'World News', 'Technology', 'Sports'].map((category) => (
                    <a
                      key={category}
                      href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-4 py-2 bg-light-gray text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
