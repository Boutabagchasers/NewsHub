/**
 * RSS Parser Library
 * Handles fetching and parsing RSS feeds with error handling and timeout support
 */

import Parser from 'rss-parser';
import { Article } from '@/types';

// RSS Parser instance
const parser = new Parser({
  timeout: 10000, // 10 second timeout per feed
  headers: {
    'User-Agent': 'NewsHub/1.0',
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
}

export interface FeedResponse {
  articles: Article[];
  errors: string[];
  successCount: number;
  errorCount: number;
}

/**
 * Fetch and parse a single RSS feed
 */
export async function fetchRSSFeed(source: RSSSource): Promise<FeedResult> {
  try {
    const feed = await parser.parseURL(source.url);

    const articles: Article[] = feed.items.map((item, index) => {
      // Generate a unique ID
      const id = item.guid || item.link || `${source.id}-${index}`;

      // Extract image from content or enclosure
      let imageUrl: string | undefined;

      // Check for enclosures (common in RSS feeds)
      if (item.enclosure?.url) {
        imageUrl = item.enclosure.url;
      }

      // Check content for images
      if (!imageUrl && item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }

      // Fallback to content:encoded if available
      if (!imageUrl && (item as Record<string, unknown>)['content:encoded']) {
        const contentEncoded = (item as Record<string, unknown>)['content:encoded'];
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
        author: item.creator || item.author,
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
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      source,
      articles: [],
      error: `Failed to fetch ${source.name}: ${errorMessage}`,
    };
  }
}

/**
 * Fetch multiple RSS feeds in parallel
 */
export async function fetchMultipleFeeds(sources: RSSSource[]): Promise<FeedResponse> {
  // Filter only active sources
  const activeSources = sources.filter(s => s.active);

  // Fetch all feeds in parallel
  const results = await Promise.all(
    activeSources.map(source => fetchRSSFeed(source))
  );

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

  return {
    articles,
    errors,
    successCount,
    errorCount,
  };
}

/**
 * Fetch feeds for a specific category
 */
export async function fetchCategoryFeeds(
  sources: RSSSource[],
  category: string
): Promise<FeedResponse> {
  const categorySources = sources.filter(
    s => s.active && s.category === category
  );

  return fetchMultipleFeeds(categorySources);
}

/**
 * Validate an RSS feed URL
 */
export async function validateRSSFeed(url: string): Promise<{
  valid: boolean;
  error?: string;
  feedTitle?: string;
  itemCount?: number;
}> {
  try {
    const feed = await parser.parseURL(url);

    return {
      valid: true,
      feedTitle: feed.title,
      itemCount: feed.items.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      valid: false,
      error: errorMessage,
    };
  }
}
