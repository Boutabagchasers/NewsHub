/**
 * Articles Refresh API Route
 * Forces a fresh fetch of all articles, bypassing cache
 * POST /api/articles/refresh
 */

import { NextResponse } from 'next/server';
import { fetchMultipleFeeds } from '@/lib/rss-parser';
import { loadSources, cacheArticles } from '@/lib/data-store';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Load sources
    const sources = await loadSources();

    // Fetch fresh data
    const result = await fetchMultipleFeeds(sources);

    // Update cache
    if (result.articles.length > 0) {
      await cacheArticles(result.articles);
    }

    return NextResponse.json({
      articles: result.articles,
      errors: result.errors,
      lastUpdated: new Date().toISOString(),
      successCount: result.successCount,
      errorCount: result.errorCount,
      refreshed: true,
    });
  } catch (error) {
    logger.error('Error refreshing articles', error);

    return NextResponse.json(
      {
        articles: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        lastUpdated: new Date().toISOString(),
        refreshed: false,
      },
      { status: 500 }
    );
  }
}
