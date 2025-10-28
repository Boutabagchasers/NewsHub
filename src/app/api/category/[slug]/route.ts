/**
 * Category Articles API Route
 * Fetches articles for a specific category with deduplication
 * GET /api/category/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchCategoryFeeds } from '@/lib/rss-parser';
import { loadSources } from '@/lib/data-store';
import {
  isValidCategory,
  sortArticlesByDate,
  deduplicateArticles,
  findRelatedArticles,
} from '@/lib/category-utils';
import { getMockArticlesForCategory as getMockArticles } from '@/data/mock-articles';
import { Article } from '@/types';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  try {
    const { slug } = await context.params;

    logger.debug('Category request received', { slug });

    // Validate category
    if (!isValidCategory(slug)) {
      logger.warn('Invalid category requested', { slug });

      // Return 200 with empty articles instead of 404 to prevent page errors
      return NextResponse.json({
        articles: [],
        errors: [`Invalid category: ${slug}`],
        lastUpdated: new Date().toISOString(),
        category: slug,
        successCount: 0,
        errorCount: 1,
        usedFallback: false,
      });
    }

    logger.debug('Loading sources for category', { slug });

    // Load sources
    let sources;
    try {
      sources = await loadSources();
      logger.debug('Loaded sources', { total: sources.length });

      const categorySources = sources.filter(s => s.active && s.category === slug);
      logger.debug('Active sources found', { slug, count: categorySources.length });
    } catch (sourceError) {
      logger.error('Error loading sources', sourceError);

      // If sources fail to load and we're in development, use mock data
      if (isDevelopment) {
        const mockData: Article[] = getMockArticles(slug);
        logger.info('Using mock data fallback', { slug, count: mockData.length });

        return NextResponse.json({
          articles: mockData,
          errors: ['Sources failed to load - using mock data'],
          lastUpdated: new Date().toISOString(),
          category: slug,
          successCount: 0,
          errorCount: 1,
          usedFallback: true,
          isDevelopment: true,
        });
      }

      throw sourceError;
    }

    logger.debug('Fetching RSS feeds', { slug });

    // Fetch articles for this category with timeout
    let result;
    try {
      // Add a timeout wrapper to prevent hanging
      result = await Promise.race([
        fetchCategoryFeeds(sources, slug),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Feed fetch timeout')), 30000)
        )
      ]);

      logger.debug('RSS fetch completed', { articles: result.articles.length, errors: result.errorCount });
    } catch (fetchError) {
      logger.error('Error fetching RSS feeds', fetchError);

      // In development, fall back to mock data if RSS fails
      if (isDevelopment) {
        const mockData: Article[] = getMockArticles(slug);
        logger.info('RSS fetch failed - using mock data', { slug, count: mockData.length });

        return NextResponse.json({
          articles: mockData,
          errors: [fetchError instanceof Error ? fetchError.message : 'RSS fetch failed'],
          lastUpdated: new Date().toISOString(),
          category: slug,
          successCount: 0,
          errorCount: 1,
          usedFallback: true,
          isDevelopment: true,
        });
      }

      throw fetchError;
    }

    // If no articles fetched and in development, use mock data
    if (result.articles.length === 0 && isDevelopment) {
      const mockData: Article[] = getMockArticles(slug);
      logger.info('No RSS articles - using mock data', { slug, count: mockData.length });

      return NextResponse.json({
        articles: mockData,
        errors: result.errors,
        lastUpdated: new Date().toISOString(),
        category: slug,
        successCount: 0,
        errorCount: result.errorCount,
        usedFallback: true,
        isDevelopment: true,
      });
    }

    // Process articles
    let articles = sortArticlesByDate(result.articles);
    articles = deduplicateArticles(articles);

    // Add related articles to each
    articles = articles.map((article) => ({
      ...article,
      relatedArticles: findRelatedArticles(article, articles, 3),
    }));

    logger.info('Returning processed articles', { slug, count: articles.length });

    return NextResponse.json({
      articles,
      errors: result.errors,
      lastUpdated: new Date().toISOString(),
      category: slug,
      successCount: result.successCount,
      errorCount: result.errorCount,
      usedFallback: false,
      isDevelopment,
    });
  } catch (error) {
    logger.error('Unhandled error in category route', error);

    // Last resort fallback for development
    if (isDevelopment) {
      const { slug } = await context.params;
      const mockData: Article[] = getMockArticles(slug);

      return NextResponse.json({
        articles: mockData,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        lastUpdated: new Date().toISOString(),
        category: slug,
        successCount: 0,
        errorCount: 1,
        usedFallback: true,
        isDevelopment: true,
      });
    }

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
