/**
 * Search Utilities for NewsHub
 * Provides comprehensive search functionality with fuzzy matching, relevance scoring, and highlighting
 */

import type { Article, SearchResult, SearchOptions, SearchFilters } from '@/types';

/**
 * Calculate the Levenshtein distance between two strings (for fuzzy matching)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Check if a string matches a query with fuzzy matching
 */
function fuzzyMatch(text: string, query: string, threshold: number = 0.7): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) {
    return true;
  }

  // Check individual words
  const queryWords = queryLower.split(/\s+/);
  const textWords = textLower.split(/\s+/);

  for (const queryWord of queryWords) {
    let found = false;
    for (const textWord of textWords) {
      const distance = levenshteinDistance(queryWord, textWord);
      const maxLen = Math.max(queryWord.length, textWord.length);
      const similarity = 1 - distance / maxLen;

      if (similarity >= threshold) {
        found = true;
        break;
      }
    }
    if (!found && queryWord.length > 2) {
      return false;
    }
  }

  return true;
}

/**
 * Find all match indices in a text for highlighting
 */
function findMatchIndices(text: string, query: string): number[] {
  const indices: number[] = [];
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  let index = textLower.indexOf(queryLower);
  while (index !== -1) {
    indices.push(index);
    index = textLower.indexOf(queryLower, index + 1);
  }

  return indices;
}

/**
 * Calculate relevance score for an article based on query matches
 */
function calculateRelevanceScore(article: Article, query: string): number {
  let score = 0;
  const queryLower = query.toLowerCase();

  // Title match (highest weight)
  if (article.title.toLowerCase().includes(queryLower)) {
    score += 10;
  }

  // Content snippet match
  if (article.contentSnippet?.toLowerCase().includes(queryLower)) {
    score += 5;
  }

  // Full content match
  if (article.content?.toLowerCase().includes(queryLower)) {
    score += 3;
  }

  // Category match
  if (article.category.toLowerCase().includes(queryLower)) {
    score += 2;
  }

  // Source match
  if (article.sourceName.toLowerCase().includes(queryLower)) {
    score += 2;
  }

  // Author match
  if (article.author?.toLowerCase().includes(queryLower)) {
    score += 1;
  }

  // Boost score for recency (articles from the last 24 hours get a boost)
  const articleDate = new Date(article.pubDate);
  const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePublished < 1) {
    score += 2;
  } else if (daysSincePublished < 7) {
    score += 1;
  }

  return score;
}

/**
 * Generate highlights for matched fields
 */
function generateHighlights(article: Article, query: string) {
  const highlights: SearchResult['highlights'] = [];

  // Check title
  const titleIndices = findMatchIndices(article.title, query);
  if (titleIndices.length > 0) {
    highlights.push({
      field: 'title',
      text: article.title,
      matchIndices: titleIndices,
    });
  }

  // Check content snippet
  if (article.contentSnippet) {
    const contentIndices = findMatchIndices(article.contentSnippet, query);
    if (contentIndices.length > 0) {
      highlights.push({
        field: 'contentSnippet',
        text: article.contentSnippet,
        matchIndices: contentIndices,
      });
    }
  }

  // Check source
  const sourceIndices = findMatchIndices(article.sourceName, query);
  if (sourceIndices.length > 0) {
    highlights.push({
      field: 'source',
      text: article.sourceName,
      matchIndices: sourceIndices,
    });
  }

  return highlights;
}

/**
 * Apply filters to articles
 */
function applyFilters(articles: Article[], filters?: SearchFilters): Article[] {
  if (!filters) return articles;

  let filtered = articles;

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(article =>
      filters.categories!.includes(article.category)
    );
  }

  // Filter by sources
  if (filters.sources && filters.sources.length > 0) {
    filtered = filtered.filter(article =>
      filters.sources!.includes(article.source) ||
      filters.sources!.includes(article.sourceName)
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter(article => {
      const articleDate = new Date(article.pubDate);
      return articleDate >= filters.dateFrom!;
    });
  }

  if (filters.dateTo) {
    filtered = filtered.filter(article => {
      const articleDate = new Date(article.pubDate);
      return articleDate <= filters.dateTo!;
    });
  }

  return filtered;
}

/**
 * Main search function
 * Searches through articles with fuzzy matching, relevance scoring, and highlighting
 */
export function searchArticles(
  articles: Article[],
  query: string,
  options?: SearchOptions
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryTrimmed = query.trim();
  const results: SearchResult[] = [];

  // Apply filters first
  const filteredArticles = applyFilters(articles, options?.filters);

  // Search through filtered articles
  for (const article of filteredArticles) {
    const matchedFields: string[] = [];

    // Check various fields with fuzzy matching
    if (fuzzyMatch(article.title, queryTrimmed)) {
      matchedFields.push('title');
    }

    if (article.contentSnippet && fuzzyMatch(article.contentSnippet, queryTrimmed)) {
      matchedFields.push('contentSnippet');
    }

    if (article.content && fuzzyMatch(article.content, queryTrimmed)) {
      matchedFields.push('content');
    }

    if (fuzzyMatch(article.category, queryTrimmed)) {
      matchedFields.push('category');
    }

    if (fuzzyMatch(article.sourceName, queryTrimmed)) {
      matchedFields.push('source');
    }

    if (article.author && fuzzyMatch(article.author, queryTrimmed)) {
      matchedFields.push('author');
    }

    // If any field matched, add to results
    if (matchedFields.length > 0) {
      const relevanceScore = calculateRelevanceScore(article, queryTrimmed);
      const highlights = generateHighlights(article, queryTrimmed);

      results.push({
        article,
        relevanceScore,
        matchedFields,
        highlights,
      });
    }
  }

  // Sort results
  const sortedResults = [...results];
  const sortBy = options?.sortBy || 'relevance';

  switch (sortBy) {
    case 'relevance':
      sortedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      break;
    case 'date':
      sortedResults.sort((a, b) => {
        const dateA = new Date(a.article.pubDate).getTime();
        const dateB = new Date(b.article.pubDate).getTime();
        return dateB - dateA;
      });
      break;
    case 'source':
      sortedResults.sort((a, b) =>
        a.article.sourceName.localeCompare(b.article.sourceName)
      );
      break;
  }

  // Apply pagination
  const offset = options?.offset || 0;
  const limit = options?.limit || sortedResults.length;

  return sortedResults.slice(offset, offset + limit);
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(
  articles: Article[],
  partialQuery: string,
  limit: number = 5
): string[] {
  if (!partialQuery || partialQuery.length < 2) {
    return [];
  }

  const suggestions = new Set<string>();
  const queryLower = partialQuery.toLowerCase();

  // Collect suggestions from titles
  articles.forEach(article => {
    const titleLower = article.title.toLowerCase();
    if (titleLower.includes(queryLower)) {
      // Extract relevant phrase
      const words = article.title.split(/\s+/);
      words.forEach((word, index) => {
        if (word.toLowerCase().includes(queryLower)) {
          // Add 2-3 word phrase
          const phrase = words.slice(Math.max(0, index - 1), index + 2).join(' ');
          suggestions.add(phrase);
        }
      });
    }
  });

  // Collect suggestions from categories
  articles.forEach(article => {
    if (article.category.toLowerCase().includes(queryLower)) {
      suggestions.add(article.category);
    }
  });

  // Collect suggestions from sources
  articles.forEach(article => {
    if (article.sourceName.toLowerCase().includes(queryLower)) {
      suggestions.add(article.sourceName);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}

/**
 * Highlight matched text in a string
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-sky-blue">$1</mark>');
}

/**
 * Generate "Did you mean" suggestions for potential typos
 */
export function getDidYouMeanSuggestions(
  articles: Article[],
  query: string,
  limit: number = 3
): string[] {
  const queryLower = query.toLowerCase();

  // Collect common terms from articles
  const terms = new Set<string>();
  articles.forEach(article => {
    article.title.split(/\s+/).forEach(word => {
      if (word.length > 3) {
        terms.add(word.toLowerCase());
      }
    });
  });

  // Find similar terms
  const similarities: { term: string; similarity: number }[] = [];
  terms.forEach(term => {
    const distance = levenshteinDistance(queryLower, term);
    const maxLen = Math.max(queryLower.length, term.length);
    const similarity = 1 - distance / maxLen;

    if (similarity > 0.6 && similarity < 0.95) {
      similarities.push({ term, similarity });
    }
  });

  // Sort by similarity and return top suggestions
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, limit).map(s => s.term);
}

/**
 * Extract unique categories from articles
 */
export function getUniqueCategories(articles: Article[]): string[] {
  const categories = new Set<string>();
  articles.forEach(article => {
    if (article.category) {
      categories.add(article.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Extract unique sources from articles
 */
export function getUniqueSources(articles: Article[]): string[] {
  const sources = new Set<string>();
  articles.forEach(article => {
    if (article.sourceName) {
      sources.add(article.sourceName);
    }
  });
  return Array.from(sources).sort();
}
