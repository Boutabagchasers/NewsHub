/**
 * NewsHub Type Definitions
 * Core types for articles, categories, and news content
 */

// Category and Subcategory string literal types for RSS sources
export type Category =
  | 'U.S. News'
  | 'World News'
  | 'Local News'
  | 'Sports'
  | 'Technology'
  | 'Business'
  | 'Entertainment'
  | 'Health'
  | 'Science';

export type Subcategory =
  | 'Bay Area'
  | 'Sacramento'
  | 'California'
  | 'National'
  | 'International'
  | 'Politics'
  | 'NFL'
  | 'NBA'
  | 'MLB'
  | 'Soccer'
  | 'General Sports'
  | 'Startups'
  | 'AI'
  | 'Gadgets'
  | 'Software'
  | 'Finance'
  | 'Markets'
  | 'Movies'
  | 'Music'
  | 'General';

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  author?: string;
  content: string;
  contentSnippet: string;
  categories?: string[];
  guid?: string;
  isoDate?: string;

  // NewsHub specific fields
  source: string;
  sourceName: string;
  category: string;
  imageUrl?: string;
  imageCaption?: string;
  relatedArticles?: RelatedArticle[];
}

export interface RelatedArticle {
  id: string;
  title: string;
  link: string;
  source: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  feedUrls: string[];
}

export interface FeedConfig {
  name: string;
  url: string;
  category: string;
}

export type ViewMode = 'report' | 'list';

export interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Search-related types
export interface SearchResult {
  article: Article;
  relevanceScore: number;
  matchedFields: string[];
  highlights: {
    field: string;
    text: string;
    matchIndices: number[];
  }[];
}

export interface SearchFilters {
  categories?: string[];
  sources?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchOptions {
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'date' | 'source';
  limit?: number;
  offset?: number;
}

// Daily Brief types
export interface DailyBrief {
  date: Date;
  sections: DailyBriefSection[];
  generatedAt: Date;
  totalArticles: number;
}

export interface DailyBriefSection {
  category: string;
  articles: Article[];
  summary?: string;
}

// RSS Source types
export interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: string;
  active: boolean;
  sourceName: string;
}

// NewsSource interface for Settings and preferences
export interface NewsSource {
  id: string;
  name: string;
  rssUrl: string;
  category: Category;
  subcategory?: Subcategory;
  isActive: boolean;
  fetchIntervalMinutes?: number;
  description?: string;
  website?: string;
}

// User Preferences interface
export interface UserPreferences {
  favoriteCategories: Category[];
  favoriteSources: string[];
  articleAgePreferenceDays: number;
  hiddenCategories: Category[];
  hiddenSources: string[];
  refreshIntervalMinutes: number;
  articlesPerPage: number;
  defaultView: 'grid' | 'list' | 'compact';
}

// API Response types
export interface ArticlesAPIResponse {
  articles: Article[];
  errors: string[];
  lastUpdated: string;
  successCount?: number;
  errorCount?: number;
}
