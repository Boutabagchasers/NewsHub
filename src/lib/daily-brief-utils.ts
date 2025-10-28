/**
 * Daily Brief Utilities
 * Functions for generating and managing the Daily Brief consolidated news page
 */

import type { Article, DailyBrief, DailyBriefSection } from '@/types';
import { sortArticlesByDate, deduplicateArticles } from './category-utils';

// Categories to include in the Daily Brief
const BRIEF_CATEGORIES = ['U.S. News', 'World News', 'Sports', 'Technology'];

// Number of top articles per category
const ARTICLES_PER_CATEGORY = 5;

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// In-memory cache (in production, use Redis or similar)
let briefCache: {
  brief: DailyBrief | null;
  timestamp: number;
} = {
  brief: null,
  timestamp: 0,
};

/**
 * Calculate article importance score
 * Higher scores indicate more important articles
 */
function calculateImportanceScore(article: Article): number {
  let score = 0;

  // Recent articles get higher scores
  const articleDate = new Date(article.isoDate || article.pubDate);
  const hoursSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60);

  if (hoursSincePublished < 6) {
    score += 10;
  } else if (hoursSincePublished < 12) {
    score += 7;
  } else if (hoursSincePublished < 24) {
    score += 5;
  } else if (hoursSincePublished < 48) {
    score += 3;
  }

  // Articles with images are often more important
  if (article.imageUrl) {
    score += 2;
  }

  // Articles with authors tend to be more substantial
  if (article.author) {
    score += 1;
  }

  // Longer content snippets suggest more detailed articles
  const contentLength = article.contentSnippet?.length || 0;
  if (contentLength > 200) {
    score += 2;
  } else if (contentLength > 100) {
    score += 1;
  }

  return score;
}

/**
 * Select top articles for a category
 * Considers both recency and importance
 */
function selectTopArticles(articles: Article[], limit: number = ARTICLES_PER_CATEGORY): Article[] {
  // Sort by date first
  const sortedByDate = sortArticlesByDate(articles);

  // Calculate importance scores
  const articlesWithScores = sortedByDate.map(article => ({
    article,
    score: calculateImportanceScore(article),
  }));

  // Sort by combined score (importance + recency already factored in)
  articlesWithScores.sort((a, b) => b.score - a.score);

  // Return top N articles
  return articlesWithScores.slice(0, limit).map(item => item.article);
}

/**
 * Group articles by category
 */
function groupArticlesByCategory(articles: Article[]): Record<string, Article[]> {
  const groups: Record<string, Article[]> = {};

  for (const article of articles) {
    const category = article.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(article);
  }

  return groups;
}

/**
 * Generate a section summary for a category
 * Creates a brief overview of the top stories
 */
function generateSectionSummary(articles: Article[], categoryName: string): string {
  if (articles.length === 0) {
    return `No ${categoryName.toLowerCase()} stories available at this time.`;
  }

  const topStory = articles[0];

  // Extract key topics from titles
  const topics = new Set<string>();
  articles.forEach(article => {
    // Simple keyword extraction (in production, use NLP)
    const words = article.title.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 5 && !['about', 'their', 'which', 'where', 'these'].includes(word)) {
        topics.add(word);
      }
    });
  });

  const topicList = Array.from(topics).slice(0, 3).join(', ');

  return `Top story: ${topStory.title.substring(0, 80)}${topStory.title.length > 80 ? '...' : ''}. Coverage includes ${topicList} and more.`;
}

/**
 * Generate Daily Brief from articles
 * Creates a structured brief with top articles from each major category
 */
export function generateDailyBrief(allArticles: Article[]): DailyBrief {
  const now = new Date();

  // Deduplicate articles
  const uniqueArticles = deduplicateArticles(allArticles);

  // Group by category
  const grouped = groupArticlesByCategory(uniqueArticles);

  // Create sections for each brief category
  const sections: DailyBriefSection[] = BRIEF_CATEGORIES.map(categoryName => {
    const categoryArticles = grouped[categoryName] || [];
    const topArticles = selectTopArticles(categoryArticles, ARTICLES_PER_CATEGORY);
    const summary = generateSectionSummary(topArticles, categoryName);

    return {
      category: categoryName,
      articles: topArticles,
      summary,
    };
  }).filter(section => section.articles.length > 0); // Only include sections with articles

  // Calculate total articles
  const totalArticles = sections.reduce((sum, section) => sum + section.articles.length, 0);

  return {
    date: now,
    sections,
    generatedAt: now,
    totalArticles,
  };
}

/**
 * Get cached Daily Brief or generate a new one
 * Regenerates every 30 minutes
 */
export function getCachedDailyBrief(allArticles: Article[]): DailyBrief {
  const now = Date.now();

  // Check if cache is still valid
  if (briefCache.brief && (now - briefCache.timestamp) < CACHE_DURATION) {
    return briefCache.brief;
  }

  // Generate new brief
  const newBrief = generateDailyBrief(allArticles);

  // Update cache
  briefCache = {
    brief: newBrief,
    timestamp: now,
  };

  return newBrief;
}

/**
 * Clear the brief cache (useful for testing or manual refresh)
 */
export function clearBriefCache(): void {
  briefCache = {
    brief: null,
    timestamp: 0,
  };
}

/**
 * Get cache timestamp for display
 */
export function getCacheTimestamp(): Date | null {
  if (!briefCache.brief) return null;
  return new Date(briefCache.timestamp);
}

/**
 * Format brief date for display
 */
export function formatBriefDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get time until next refresh
 */
export function getTimeUntilRefresh(): number {
  if (!briefCache.brief) return 0;

  const now = Date.now();
  const elapsed = now - briefCache.timestamp;
  const remaining = CACHE_DURATION - elapsed;

  return Math.max(0, remaining);
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

/**
 * Export brief as JSON for sharing
 */
export function exportBriefAsJSON(brief: DailyBrief): string {
  return JSON.stringify(brief, null, 2);
}

/**
 * Generate a shareable text summary of the brief
 */
export function generateShareableText(brief: DailyBrief): string {
  const dateStr = formatBriefDate(brief.date);
  let text = `NewsHub Daily Brief - ${dateStr}\n\n`;

  brief.sections.forEach(section => {
    text += `${section.category.toUpperCase()}\n`;
    text += `${'='.repeat(section.category.length)}\n\n`;

    section.articles.forEach((article, index) => {
      text += `${index + 1}. ${article.title}\n`;
      text += `   ${article.sourceName} - ${new Date(article.pubDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}\n`;
      if (article.contentSnippet) {
        text += `   ${article.contentSnippet.substring(0, 100)}...\n`;
      }
      text += `   ${article.link}\n\n`;
    });

    text += '\n';
  });

  text += `\nGenerated at ${brief.generatedAt.toLocaleTimeString('en-US')}\n`;
  text += `Total articles: ${brief.totalArticles}\n`;

  return text;
}

/**
 * Get brief statistics
 */
export function getBriefStatistics(brief: DailyBrief): {
  totalSections: number;
  totalArticles: number;
  averageArticlesPerSection: number;
  categoriesIncluded: string[];
  oldestArticle: Date | null;
  newestArticle: Date | null;
} {
  const categoriesIncluded = brief.sections.map(s => s.category);
  const allArticles = brief.sections.flatMap(s => s.articles);

  const dates = allArticles
    .map(a => new Date(a.isoDate || a.pubDate))
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    totalSections: brief.sections.length,
    totalArticles: brief.totalArticles,
    averageArticlesPerSection: brief.totalArticles / brief.sections.length,
    categoriesIncluded,
    oldestArticle: dates.length > 0 ? dates[0] : null,
    newestArticle: dates.length > 0 ? dates[dates.length - 1] : null,
  };
}
