/**
 * Category Utility Functions
 * Helper functions for category management, article filtering, and data processing
 */

import { Article, CategoryInfo } from '@/types';

/**
 * Category configuration mapping slugs to display names and feed sources
 */
export const CATEGORIES: Record<string, CategoryInfo> = {
  'us-news': {
    id: 'us-news',
    name: 'U.S. News',
    slug: 'us-news',
    description: 'Latest news from across the United States',
    feedUrls: [
      'https://feeds.npr.org/1001/rss.xml',
      'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
    ],
  },
  'world-news': {
    id: 'world-news',
    name: 'World News',
    slug: 'world-news',
    description: 'International news and global events',
    feedUrls: [
      'https://feeds.bbci.co.uk/news/world/rss.xml',
      'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    ],
  },
  sports: {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports news, scores, and analysis',
    feedUrls: [
      'https://www.espn.com/espn/rss/news',
      'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml',
    ],
  },
  technology: {
    id: 'technology',
    name: 'Technology',
    slug: 'technology',
    description: 'Tech news, gadgets, and innovations',
    feedUrls: [
      'https://feeds.arstechnica.com/arstechnica/index',
      'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Business and financial news',
    feedUrls: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
      'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    ],
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Entertainment, movies, music, and culture',
    feedUrls: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml',
      'https://www.hollywoodreporter.com/feed/',
    ],
  },
  health: {
    id: 'health',
    name: 'Health',
    slug: 'health',
    description: 'Health, wellness, and medical news',
    feedUrls: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
      'https://feeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC',
    ],
  },
  science: {
    id: 'science',
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries and research',
    feedUrls: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
      'https://www.sciencedaily.com/rss/all.xml',
    ],
  },
};

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES[slug];
}

/**
 * Get all available categories
 */
export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES);
}

/**
 * Map URL slug to category display name
 */
export function getCategoryName(slug: string): string {
  return CATEGORIES[slug]?.name || slug;
}

/**
 * Validate if a slug is a valid category
 */
export function isValidCategory(slug: string): boolean {
  return slug in CATEGORIES;
}

/**
 * Filter articles by category
 */
export function filterArticlesByCategory(
  articles: Article[],
  category: string
): Article[] {
  return articles.filter((article) => article.category === category);
}

/**
 * Sort articles by publication date (newest first)
 */
export function sortArticlesByDate(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.isoDate || a.pubDate).getTime();
    const dateB = new Date(b.isoDate || b.pubDate).getTime();
    return dateB - dateA;
  });
}

/**
 * Group articles by source
 */
export function groupArticlesBySource(
  articles: Article[]
): Record<string, Article[]> {
  return articles.reduce(
    (groups, article) => {
      const source = article.source;
      if (!groups[source]) {
        groups[source] = [];
      }
      groups[source].push(article);
      return groups;
    },
    {} as Record<string, Article[]>
  );
}

/**
 * Deduplicate articles based on title similarity
 * Simple implementation - can be enhanced with fuzzy matching
 */
export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  const unique: Article[] = [];

  for (const article of articles) {
    // Normalize title for comparison
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();

    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle);
      unique.push(article);
    }
  }

  return unique;
}

/**
 * Find related articles based on category and keywords
 */
export function findRelatedArticles(
  article: Article,
  allArticles: Article[],
  limit: number = 3
): Article[] {
  // Filter out the current article and get articles from same category
  const candidates = allArticles.filter(
    (a) => a.id !== article.id && a.category === article.category
  );

  // Sort by date and return most recent
  const sorted = sortArticlesByDate(candidates);
  return sorted.slice(0, limit);
}

/**
 * Extract domain from URL for display
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Format article date for display
 */
export function formatArticleDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Generate a unique ID for an article
 */
export function generateArticleId(article: {
  link: string;
  title: string;
}): string {
  return `${article.link}-${article.title}`.replace(/[^\w]/g, '-').slice(0, 100);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
