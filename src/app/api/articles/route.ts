/**
 * Articles API Route
 * Fetches all articles from RSS feeds with caching
 * GET /api/articles?category=sports
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchMultipleFeedsOptimized, fetchCategoryFeedsOptimized } from '@/lib/rss-parser-enhanced';
import { loadSources, getCachedArticles, cacheArticles } from '@/lib/data-store';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Load sources
    const sources = await loadSources();

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = await getCachedArticles();

      // If cache is fresh and no specific category requested, return cached data
      if (cachedData && cachedData.isFresh && !category) {
        return NextResponse.json({
          articles: cachedData.articles,
          errors: [],
          lastUpdated: cachedData.lastUpdated,
          cached: true,
        });
      }
    }

    // Fetch fresh data with enhanced parser
    let result;
    if (category) {
      result = await fetchCategoryFeedsOptimized(sources, category);
    } else {
      result = await fetchMultipleFeedsOptimized(sources);
    }

    // Cache the results if fetching all articles
    if (!category && result.articles.length > 0) {
      await cacheArticles(result.articles);
    }

    return NextResponse.json({
      articles: result.articles,
      errors: result.errors,
      lastUpdated: new Date().toISOString(),
      successCount: result.successCount,
      errorCount: result.errorCount,
      totalTime: result.totalTime,
      cached: false,
    });
  } catch (error) {
    logger.error('Error fetching articles', error);

    return NextResponse.json(
      {
        articles: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
