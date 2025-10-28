/**
 * Enhanced RSS Parser Library
 * Includes retry logic, exponential backoff, and batching
 */

import Parser from 'rss-parser';
import { Article } from '@/types';
import { logger } from './logger';

// RSS Parser instance with optimized settings
const parser = new Parser({
  timeout: 8000, // Reduced from 10s to 8s
  headers: {
    'User-Agent': 'NewsHub/1.0',
  },
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
    ],
  },
});

export interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: string;
  active: boolean;
  sourceName: string;
}

export interface FeedResult {
  source: RSSSource;
  articles: Article[];
  error?: string;
  responseTime?: number;
}

export interface FeedResponse {
  articles: Article[];
  errors: string[];
  successCount: number;
  errorCount: number;
  totalTime: number;
}

/**
 * Delay utility for exponential backoff
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch a single RSS feed with retry logic and exponential backoff
 */
export async function fetchRSSFeedWithRetry(
  source: RSSSource,
  maxRetries: number = 3
): Promise<FeedResult> {
  const startTime = Date.now();
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const feed = await parser.parseURL(source.url);
      const responseTime = Date.now() - startTime;

      const articles: Article[] = feed.items.map((item, index) => {
        // Generate unique ID
        const id = item.guid || item.link || `${source.id}-${index}`;

        // Extract image from multiple sources
        let imageUrl: string | undefined;

        // Try media:content
        const mediaContent = (item as unknown as Record<string, unknown>)['media:content'] as { $?: { url?: string } } | undefined;
        if (mediaContent?.$ && mediaContent.$.url) {
          imageUrl = mediaContent.$.url;
        }

        // Try media:thumbnail
        if (!imageUrl) {
          const mediaThumbnail = (item as unknown as Record<string, unknown>)['media:thumbnail'] as { $?: { url?: string } } | undefined;
          if (mediaThumbnail?.$ && mediaThumbnail.$.url) {
            imageUrl = mediaThumbnail.$.url;
          }
        }

        // Try enclosure
        if (!imageUrl && item.enclosure?.url) {
          imageUrl = item.enclosure.url;
        }

        // Try extracting from content
        if (!imageUrl && item.content) {
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            imageUrl = imgMatch[1];
          }
        }

        // Try content:encoded
        if (!imageUrl && (item as unknown as Record<string, unknown>)['content:encoded']) {
          const contentEncoded = (item as unknown as Record<string, unknown>)['content:encoded'];
          if (typeof contentEncoded === 'string') {
            const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
              imageUrl = imgMatch[1];
            }
          }
        }

        return {
          id,
          title: item.title || 'Untitled',
          link: item.link || '',
          pubDate: item.pubDate || new Date().toISOString(),
          isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
          author: item.creator || (item as { author?: string }).author,
          content: item.content || item.contentSnippet || '',
          contentSnippet: item.contentSnippet || item.content?.substring(0, 200) || '',
          categories: item.categories,
          guid: item.guid,
          source: source.id,
          sourceName: source.sourceName || source.name,
          category: source.category,
          imageUrl,
        };
      });

      return {
        source,
        articles,
        responseTime,
      };
    } catch (error) {
      lastError = error as Error;
      logger.error(`RSS fetch attempt ${attempt + 1} failed for ${source.name}`, error);

      // Don't retry if it's the last attempt
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 500ms, 1s, 2s
        const delayMs = Math.pow(2, attempt) * 500;
        await delay(delayMs);
      }
    }
  }

  // All retries exhausted
  const responseTime = Date.now() - startTime;
  return {
    source,
    articles: [],
    error: `Failed after ${maxRetries} attempts: ${lastError?.message}`,
    responseTime,
  };
}

/**
 * Fetch multiple RSS feeds in parallel with batching
 * Prevents overwhelming servers and improves reliability
 */
export async function fetchMultipleFeedsOptimized(
  sources: RSSSource[],
  batchSize: number = 5
): Promise<FeedResponse> {
  const startTime = Date.now();
  const activeSources = sources.filter(s => s.active);
  const results: FeedResult[] = [];

  // Process in batches
  for (let i = 0; i < activeSources.length; i += batchSize) {
    const batch = activeSources.slice(i, i + batchSize);

    logger.info(`Fetching batch ${Math.floor(i / batchSize) + 1} (${batch.length} feeds)`);

    const batchResults = await Promise.all(
      batch.map(source => fetchRSSFeedWithRetry(source))
    );

    results.push(...batchResults);

    // Small delay between batches to be respectful to servers
    if (i + batchSize < activeSources.length) {
      await delay(100);
    }
  }

  // Aggregate results
  const articles: Article[] = [];
  const errors: string[] = [];
  let successCount = 0;
  let errorCount = 0;

  results.forEach(result => {
    if (result.error) {
      errors.push(result.error);
      errorCount++;
    } else {
      articles.push(...result.articles);
      successCount++;
    }
  });

  const totalTime = Date.now() - startTime;

  logger.info(`RSS fetch complete: ${successCount} succeeded, ${errorCount} failed in ${totalTime}ms`);

  return {
    articles,
    errors,
    successCount,
    errorCount,
    totalTime,
  };
}

/**
 * Fetch feeds for a specific category with optimization
 */
export async function fetchCategoryFeedsOptimized(
  sources: RSSSource[],
  category: string
): Promise<FeedResponse> {
  const categorySources = sources.filter(
    s => s.active && s.category === category
  );

  return fetchMultipleFeedsOptimized(categorySources);
}

/**
 * Validate an RSS feed URL with timeout
 */
export async function validateRSSFeed(url: string): Promise<{
  valid: boolean;
  error?: string;
  feedTitle?: string;
  itemCount?: number;
  hasHTTPS?: boolean;
}> {
  try {
    // Warn about HTTP URLs
    const hasHTTPS = url.startsWith('https://');

    const feed = await parser.parseURL(url);

    return {
      valid: true,
      feedTitle: feed.title,
      itemCount: feed.items.length,
      hasHTTPS,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      valid: false,
      error: errorMessage,
      hasHTTPS: url.startsWith('https://'),
    };
  }
}
