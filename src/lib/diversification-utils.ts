/**
 * Content Diversification Utilities
 * Ensures balanced representation across categories and sources on the homepage
 * Prevents any single source (like ESPN) from dominating the feed
 */

import { Article } from '@/types';
import { getAllCategories } from './category-utils';

/**
 * Configuration for diversification algorithm
 */
const DIVERSIFICATION_CONFIG = {
  // Minimum articles per category in initial view
  minArticlesPerCategory: 1,

  // Scoring weights (must sum to 1.0)
  // These naturally moderate distribution without hard limits
  weights: {
    recency: 0.35,     // How fresh is the article?
    diversity: 0.35,   // Source diversity bonus (increased for better moderation)
    quality: 0.20,     // Content quality signals
    category: 0.10,    // Category balance bonus
  },

  // Recency decay (hours)
  recencyHalfLife: 24, // Score halves every 24 hours

  // Soft moderation thresholds (used for scoring penalties, not hard blocks)
  softLimits: {
    consecutivePenaltyThreshold: 2,    // Start penalizing after 2 consecutive from same source
    sourcePercentagePenalty: 0.25,     // Apply penalty when source exceeds 25% of visible articles
  },
};

/**
 * Calculate recency score (0-1) based on publication time
 * Uses exponential decay: newer articles score higher
 */
export function calculateRecencyScore(pubDate: string): number {
  const now = Date.now();
  const published = new Date(pubDate).getTime();
  const hoursSince = (now - published) / (1000 * 60 * 60);

  // Exponential decay: score = e^(-hours / halfLife)
  const score = Math.exp(-hoursSince / DIVERSIFICATION_CONFIG.recencyHalfLife);

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate quality score (0-1) based on content signals
 */
export function calculateQualityScore(article: Article): number {
  let score = 0;

  // Has image? (+0.3)
  if (article.imageUrl) {
    score += 0.3;
  }

  // Substantial content? (+0.4)
  const contentLength = article.contentSnippet?.length || 0;
  if (contentLength > 200) {
    score += 0.4;
  } else if (contentLength > 100) {
    score += 0.2;
  }

  // Has author? (+0.2)
  if (article.author) {
    score += 0.2;
  }

  // Title quality (+0.1)
  const titleLength = article.title?.length || 0;
  if (titleLength >= 40 && titleLength <= 120) {
    score += 0.1;
  }

  return Math.min(1, score);
}

/**
 * Calculate source diversity bonus/penalty
 * Returns higher scores for underrepresented sources
 * Uses smooth curves instead of hard cutoffs
 */
function calculateSourceDiversityScore(
  source: string,
  sourceDistribution: Map<string, number>,
  totalArticles: number,
  recentSources: string[]
): number {
  const sourceCount = sourceDistribution.get(source) || 0;
  const sourcePercentage = totalArticles > 0 ? sourceCount / totalArticles : 0;

  // Smooth penalty curve for over-representation
  // Uses sigmoid function for gradual penalty
  // 0% = 1.0, 25% = ~0.7, 50% = ~0.3, 75%+ = ~0.1
  const overrepresentationPenalty = 1 / (1 + Math.exp(10 * (sourcePercentage - 0.3)));

  // Additional penalty for consecutive articles from same source
  // Check last 2 articles
  const lastTwo = recentSources.slice(-2);
  const consecutiveCount = lastTwo.filter(s => s === source).length;
  const consecutivePenalty = consecutiveCount >= 1
    ? Math.pow(0.6, consecutiveCount)  // 0.6 for 1 consecutive, 0.36 for 2, etc.
    : 1.0;

  // Combine penalties (multiplicative for stronger effect)
  return overrepresentationPenalty * consecutivePenalty;
}

/**
 * Calculate category balance bonus
 * Returns higher scores for underrepresented categories
 */
function calculateCategoryBalanceScore(
  category: string,
  categoryDistribution: Map<string, number>,
  totalArticles: number
): number {
  const categoryCount = categoryDistribution.get(category) || 0;
  const expectedPercentage = 1 / 8; // We have 8 categories
  const actualPercentage = totalArticles > 0 ? categoryCount / totalArticles : 0;

  // Bonus for underrepresented categories
  // Below expected = bonus, above expected = penalty
  const delta = expectedPercentage - actualPercentage;
  const bonus = Math.max(0, Math.min(1, 0.5 + delta * 4));

  return bonus;
}

/**
 * Ensure every category has at least minimum representation
 * Returns articles that guarantee category coverage
 */
function ensureCategoryRepresentation(articles: Article[]): {
  guaranteed: Article[];
  remaining: Article[];
} {
  const categories = getAllCategories();
  const guaranteed: Article[] = [];
  const usedIds = new Set<string>();

  // For each category, select the most recent article(s)
  for (const category of categories) {
    const categoryArticles = articles
      .filter(a => a.category === category.slug)
      .sort((a, b) => {
        const dateA = new Date(a.pubDate || a.isoDate || 0).getTime();
        const dateB = new Date(b.pubDate || b.isoDate || 0).getTime();
        return dateB - dateA;
      });

    // Take top N articles per category
    const toTake = Math.min(
      DIVERSIFICATION_CONFIG.minArticlesPerCategory,
      categoryArticles.length
    );

    for (let i = 0; i < toTake; i++) {
      if (categoryArticles[i]) {
        guaranteed.push(categoryArticles[i]);
        usedIds.add(categoryArticles[i].id);
      }
    }
  }

  // Remaining articles (not used for guaranteed representation)
  const remaining = articles.filter(a => !usedIds.has(a.id));

  return { guaranteed, remaining };
}

/**
 * Calculate composite score for an article
 */
interface ScoredArticle {
  article: Article;
  score: number;
  breakdown: {
    recency: number;
    diversity: number;
    quality: number;
    category: number;
  };
}

function scoreArticle(
  article: Article,
  sourceDistribution: Map<string, number>,
  categoryDistribution: Map<string, number>,
  totalScoredArticles: number,
  recentSources: string[]
): ScoredArticle {
  const recencyScore = calculateRecencyScore(article.pubDate || article.isoDate || new Date().toISOString());
  const qualityScore = calculateQualityScore(article);
  const diversityScore = calculateSourceDiversityScore(
    article.source,
    sourceDistribution,
    totalScoredArticles,
    recentSources
  );
  const categoryScore = calculateCategoryBalanceScore(
    article.category,
    categoryDistribution,
    totalScoredArticles
  );

  // Weighted composite score
  const weights = DIVERSIFICATION_CONFIG.weights;
  const finalScore =
    (recencyScore * weights.recency) +
    (diversityScore * weights.diversity) +
    (qualityScore * weights.quality) +
    (categoryScore * weights.category);

  return {
    article,
    score: finalScore,
    breakdown: {
      recency: recencyScore,
      diversity: diversityScore,
      quality: qualityScore,
      category: categoryScore,
    },
  };
}

/**
 * Sort scored articles by their final score
 * No hard limits - the scoring algorithm naturally moderates diversity
 */
function sortByScore(scoredArticles: ScoredArticle[]): Article[] {
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .map(scored => scored.article);
}

/**
 * Main diversification function
 * Applies multi-phase algorithm to ensure balanced, diverse content
 */
export function diversifyArticles(articles: Article[], enableDebug: boolean = false): Article[] {
  if (articles.length === 0) {
    return articles;
  }

  // Phase 1: Ensure category representation
  const { guaranteed, remaining } = ensureCategoryRepresentation(articles);

  // Track what we've already included
  const sourceDistribution = new Map<string, number>();
  const categoryDistribution = new Map<string, number>();
  const recentSources: string[] = [];

  for (const article of guaranteed) {
    const sourceCount = sourceDistribution.get(article.source) || 0;
    sourceDistribution.set(article.source, sourceCount + 1);

    const categoryCount = categoryDistribution.get(article.category) || 0;
    categoryDistribution.set(article.category, categoryCount + 1);

    recentSources.push(article.source);
  }

  // Phase 2: Score remaining articles with dynamic context
  const scoredRemaining: ScoredArticle[] = [];

  for (const article of remaining) {
    const scored = scoreArticle(
      article,
      sourceDistribution,
      categoryDistribution,
      guaranteed.length + scoredRemaining.length,
      recentSources
    );
    scoredRemaining.push(scored);
  }

  // Phase 3: Sort by composite score (no hard limits)
  const sortedRemaining = sortByScore(scoredRemaining);

  // Combine guaranteed + scored
  // Sort guaranteed by recency first
  const sortedGuaranteed = [...guaranteed].sort((a, b) => {
    const dateA = new Date(a.pubDate || a.isoDate || 0).getTime();
    const dateB = new Date(b.pubDate || b.isoDate || 0).getTime();
    return dateB - dateA;
  });

  // Interleave for better distribution
  const result = interleaveArticles(sortedGuaranteed, sortedRemaining);

  // Debug logging if enabled
  if (enableDebug && typeof window !== 'undefined') {
    const stats = getDiversificationStats(result.slice(0, 20));
    console.group('📊 Content Diversification Stats (First 20 Articles)');
    console.log('Total Articles:', stats.totalArticles);
    console.log('Category Distribution:', stats.categoryCounts);
    console.log('Source Distribution:', stats.sourceCounts);
    console.log(`Top Source: ${stats.topSource.name} (${stats.topSource.count} articles, ${stats.topSource.percentage.toFixed(1)}%)`);
    console.groupEnd();
  }

  return result;
}

/**
 * Interleave guaranteed category articles with ranked articles
 * Maintains some chronological flow while ensuring diversity
 */
function interleaveArticles(guaranteed: Article[], ranked: Article[]): Article[] {
  const result: Article[] = [];
  const usedIds = new Set<string>();

  // Start with guaranteed articles (already sorted by recency)
  for (const article of guaranteed) {
    result.push(article);
    usedIds.add(article.id);
  }

  // Add ranked articles that aren't already included
  for (const article of ranked) {
    if (!usedIds.has(article.id)) {
      result.push(article);
      usedIds.add(article.id);
    }
  }

  return result;
}

/**
 * Get diversification statistics for debugging
 */
export function getDiversificationStats(articles: Article[]): {
  totalArticles: number;
  categoryCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
  topSource: { name: string; count: number; percentage: number };
} {
  const categoryCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};

  for (const article of articles) {
    categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
    sourceCounts[article.sourceName] = (sourceCounts[article.sourceName] || 0) + 1;
  }

  // Find top source
  let topSource = { name: '', count: 0, percentage: 0 };
  for (const [name, count] of Object.entries(sourceCounts)) {
    if (count > topSource.count) {
      topSource = { name, count, percentage: (count / articles.length) * 100 };
    }
  }

  return {
    totalArticles: articles.length,
    categoryCounts,
    sourceCounts,
    topSource,
  };
}
