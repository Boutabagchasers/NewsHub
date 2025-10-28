/**
 * Dynamic Category Page
 * Displays articles for a specific category using NewsReport component
 * Handles loading, error, and empty states
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsReport from '@/components/NewsReport';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import {
  getCategoryBySlug,
  getCategoryName,
  isValidCategory,
} from '@/lib/category-utils';
import { Article, CategoryPageProps } from '@/types';

/**
 * Force dynamic rendering for category pages
 * RSS feeds are fetched on-demand, not at build time
 */
export const dynamic = 'force-dynamic';

/**
 * Generate metadata for the page
 */
export async function generateMetadata(
  props: CategoryPageProps
): Promise<Metadata> {
  const params = await props.params;
  const categoryName = getCategoryName(params.slug);

  return {
    title: `${categoryName} - NewsHub`,
    description: `Latest ${categoryName.toLowerCase()} articles from trusted news sources`,
  };
}

/**
 * Fetch articles for a category from the API
 */
async function fetchCategoryArticles(slug: string): Promise<{
  articles: Article[];
  usedFallback?: boolean;
  isDevelopment?: boolean;
  errors?: string[];
}> {
  // Validate category
  if (!isValidCategory(slug)) {
    console.error(`[Page] Invalid category slug: ${slug}`);
    return { articles: [] };
  }

  try {
    // Fetch from API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/category/${slug}`;

    console.log(`[Page] Fetching articles from: ${url}`);

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.error(`[Page] API returned ${response.status}: ${response.statusText}`);
      console.error(`[Page] URL attempted: ${url}`);
    }

    const data = await response.json();

    console.log(`[Page] Received ${data.articles?.length || 0} articles for ${slug}`);
    if (data.usedFallback) {
      console.log(`[Page] Using fallback/mock data`);
    }
    if (data.errors?.length > 0) {
      console.warn(`[Page] API errors:`, data.errors);
    }

    return {
      articles: data.articles || [],
      usedFallback: data.usedFallback,
      isDevelopment: data.isDevelopment,
      errors: data.errors,
    };
  } catch (error) {
    console.error(`[Page] Exception fetching articles for ${slug}:`, error);
    return { articles: [] };
  }
}

/**
 * Category Page Component
 */
export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const { slug } = params;

  // Validate category exists
  if (!isValidCategory(slug)) {
    notFound();
  }

  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  // Fetch articles
  const result = await fetchCategoryArticles(slug);
  const { articles, usedFallback, isDevelopment, errors } = result;

  // Show empty state if no articles
  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Development Error Info */}
        {isDevelopment && errors && errors.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 pt-8">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Development Error</h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <EmptyState
          title={`No ${category.name} Articles Available`}
          message={`We're currently updating our ${category.name.toLowerCase()} feed. Please check back shortly for the latest articles.`}
          showHomeLink={true}
        />
      </div>
    );
  }

  // Render news report
  return (
    <Suspense fallback={<LoadingState />}>
      {/* Development Mode Banner */}
      {usedFallback && isDevelopment && (
        <div className="bg-golden-sun border-b-4 border-sun-orange py-3">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm font-bold text-navy">
              🔧 DEVELOPMENT MODE - Using Mock Data (Real RSS feeds will load in production)
            </p>
          </div>
        </div>
      )}

      <NewsReport
        category={slug}
        categoryName={category.name}
        articles={articles}
        lastUpdated={new Date()}
      />
    </Suspense>
  );
}
