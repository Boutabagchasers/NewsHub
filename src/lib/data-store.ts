/**
 * Data Store Library
 * Handles caching articles and managing sources/preferences
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Article } from '@/types';
import { RSSSource } from './rss-parser';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CACHE_FILE = path.join(DATA_DIR, 'cached-articles.json');
const SOURCES_FILE = path.join(DATA_DIR, 'sources.json');
const PREFERENCES_FILE = path.join(DATA_DIR, 'preferences.json');

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

export interface CachedData {
  articles: Article[];
  lastUpdated: string;
  timestamp: number;
}

export interface SourcesData {
  sources: RSSSource[];
  lastModified: string;
}

export interface Preferences {
  viewMode: 'report' | 'list';
  theme: 'light'; // Light mode only - inspired by ABC7 News & The Economist
  categories: string[];
  sources: string[];
  autoRefresh: boolean;
  refreshInterval: number;
}

/**
 * Ensure data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Cache articles to disk
 */
export async function cacheArticles(articles: Article[]): Promise<void> {
  await ensureDataDir();

  const cacheData: CachedData = {
    articles,
    lastUpdated: new Date().toISOString(),
    timestamp: Date.now(),
  };

  await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
}

/**
 * Get cached articles if still fresh
 */
export async function getCachedArticles(): Promise<{
  articles: Article[];
  lastUpdated: string;
  isFresh: boolean;
} | null> {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    const cacheData: CachedData = JSON.parse(data);

    const age = Date.now() - cacheData.timestamp;
    const isFresh = age < CACHE_DURATION;

    return {
      articles: cacheData.articles,
      lastUpdated: cacheData.lastUpdated,
      isFresh,
    };
  } catch {
    return null;
  }
}

/**
 * Load sources from disk
 */
export async function loadSources(): Promise<RSSSource[]> {
  try {
    const data = await fs.readFile(SOURCES_FILE, 'utf-8');
    const sourcesData: SourcesData = JSON.parse(data);
    return sourcesData.sources;
  } catch {
    // Return default sources if file doesn't exist
    return getDefaultSources();
  }
}

/**
 * Save sources to disk
 */
export async function saveSources(sources: RSSSource[]): Promise<void> {
  await ensureDataDir();

  const sourcesData: SourcesData = {
    sources,
    lastModified: new Date().toISOString(),
  };

  await fs.writeFile(SOURCES_FILE, JSON.stringify(sourcesData, null, 2), 'utf-8');
}

/**
 * Add a new source
 */
export async function addSource(source: Omit<RSSSource, 'id'>): Promise<RSSSource> {
  const sources = await loadSources();

  // Generate unique ID
  const id = `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newSource: RSSSource = {
    id,
    ...source,
  };

  sources.push(newSource);
  await saveSources(sources);

  return newSource;
}

/**
 * Update a source
 */
export async function updateSource(id: string, updates: Partial<RSSSource>): Promise<RSSSource | null> {
  const sources = await loadSources();
  const index = sources.findIndex(s => s.id === id);

  if (index === -1) {
    return null;
  }

  sources[index] = { ...sources[index], ...updates };
  await saveSources(sources);

  return sources[index];
}

/**
 * Delete a source
 */
export async function deleteSource(id: string): Promise<boolean> {
  const sources = await loadSources();
  const filteredSources = sources.filter(s => s.id !== id);

  if (filteredSources.length === sources.length) {
    return false; // Source not found
  }

  await saveSources(filteredSources);
  return true;
}

/**
 * Load preferences
 */
export async function loadPreferences(): Promise<Preferences> {
  try {
    const data = await fs.readFile(PREFERENCES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Return default preferences
    return getDefaultPreferences();
  }
}

/**
 * Save preferences
 */
export async function savePreferences(preferences: Preferences): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PREFERENCES_FILE, JSON.stringify(preferences, null, 2), 'utf-8');
}

/**
 * Get default sources configuration
 */
function getDefaultSources(): RSSSource[] {
  return [
    // US News
    {
      id: 'nytimes-us',
      name: 'NY Times - US',
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
      category: 'us-news',
      active: true,
      sourceName: 'The New York Times',
    },
    {
      id: 'cnn-us',
      name: 'CNN - US',
      url: 'https://rss.cnn.com/rss/cnn_us.rss',
      category: 'us-news',
      active: true,
      sourceName: 'CNN',
    },
    {
      id: 'npr-news',
      name: 'NPR News',
      url: 'https://feeds.npr.org/1001/rss.xml',
      category: 'us-news',
      active: true,
      sourceName: 'NPR',
    },

    // World News
    {
      id: 'nytimes-world',
      name: 'NY Times - World',
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
      category: 'world-news',
      active: true,
      sourceName: 'The New York Times',
    },
    {
      id: 'bbc-world',
      name: 'BBC World',
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      category: 'world-news',
      active: true,
      sourceName: 'BBC News',
    },
    {
      id: 'guardian-world',
      name: 'The Guardian - World',
      url: 'https://www.theguardian.com/world/rss',
      category: 'world-news',
      active: true,
      sourceName: 'The Guardian',
    },

    // Technology
    {
      id: 'techcrunch',
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      category: 'technology',
      active: true,
      sourceName: 'TechCrunch',
    },
    {
      id: 'arstechnica',
      name: 'Ars Technica',
      url: 'https://feeds.arstechnica.com/arstechnica/index',
      category: 'technology',
      active: true,
      sourceName: 'Ars Technica',
    },
    {
      id: 'verge',
      name: 'The Verge',
      url: 'https://www.theverge.com/rss/index.xml',
      category: 'technology',
      active: true,
      sourceName: 'The Verge',
    },

    // Business
    {
      id: 'wsj',
      name: 'Wall Street Journal',
      url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
      category: 'business',
      active: true,
      sourceName: 'The Wall Street Journal',
    },
    {
      id: 'bloomberg',
      name: 'Bloomberg',
      url: 'https://www.bloomberg.com/feed/podcast/etf-report.xml',
      category: 'business',
      active: true,
      sourceName: 'Bloomberg',
    },
    {
      id: 'reuters-business',
      name: 'Reuters Business',
      url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
      category: 'business',
      active: true,
      sourceName: 'Reuters',
    },

    // Sports
    {
      id: 'espn',
      name: 'ESPN',
      url: 'https://www.espn.com/espn/rss/news',
      category: 'sports',
      active: true,
      sourceName: 'ESPN',
    },
    {
      id: 'cbs-sports',
      name: 'CBS Sports',
      url: 'https://www.cbssports.com/rss/headlines',
      category: 'sports',
      active: true,
      sourceName: 'CBS Sports',
    },

    // Entertainment
    {
      id: 'variety',
      name: 'Variety',
      url: 'https://variety.com/feed/',
      category: 'entertainment',
      active: true,
      sourceName: 'Variety',
    },
    {
      id: 'hollywood-reporter',
      name: 'Hollywood Reporter',
      url: 'https://www.hollywoodreporter.com/feed/',
      category: 'entertainment',
      active: true,
      sourceName: 'The Hollywood Reporter',
    },

    // Health
    {
      id: 'cdc-newsroom',
      name: 'CDC Newsroom',
      url: 'https://tools.cdc.gov/api/v2/resources/media/132608.rss',
      category: 'health',
      active: true,
      sourceName: 'CDC',
    },
    {
      id: 'nytimes-health',
      name: 'NY Times - Health',
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
      category: 'health',
      active: true,
      sourceName: 'The New York Times',
    },

    // Science
    {
      id: 'science-daily',
      name: 'Science Daily',
      url: 'https://www.sciencedaily.com/rss/all.xml',
      category: 'science',
      active: true,
      sourceName: 'Science Daily',
    },
    {
      id: 'nature-news',
      name: 'Nature News',
      url: 'https://feeds.nature.com/nature/rss/current',
      category: 'science',
      active: true,
      sourceName: 'Nature',
    },
  ];
}

/**
 * Get default preferences
 */
function getDefaultPreferences(): Preferences {
  return {
    viewMode: 'report',
    theme: 'light',
    categories: [
      'us-news',
      'world-news',
      'technology',
      'business',
      'sports',
      'entertainment',
      'health',
      'science',
    ],
    sources: [],
    autoRefresh: true,
    refreshInterval: 30,
  };
}
