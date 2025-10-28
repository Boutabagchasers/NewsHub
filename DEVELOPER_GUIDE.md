# NewsHub V1 - Developer Guide

**Complete technical reference for developers working on NewsHub**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Reference](#component-reference)
3. [API Documentation](#api-documentation)
4. [Type Definitions](#type-definitions)
5. [Utility Functions](#utility-functions)
6. [Design System](#design-system)
7. [Development Workflow](#development-workflow)
8. [Testing Guide](#testing-guide)
9. [Customization](#customization)
10. [Performance](#performance)

---

## Architecture Overview

### Data Flow Architecture

```
RSS Feeds (External)
    ↓
API Routes (Next.js Server-side)
    ↓
Data Store (File-based cache - 30 min)
    ↓
Page Components (SSR/SSG)
    ↓
UI Components (React)
```

### Tech Stack

- **Framework**: Next.js 15.5.5 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4
- **RSS Parsing**: rss-parser 3.13.0
- **Date Handling**: date-fns 4.1.0
- **Icons**: Lucide React 0.545.0
- **Security**: DOMPurify 3.3.0, isomorphic-dompurify 2.30.1

### Project Structure

```
newshub-v1/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   ├── category/[slug]/    # Dynamic category pages
│   │   ├── daily-brief/        # Daily brief feature
│   │   ├── search/             # Search page
│   │   ├── settings/           # Settings page
│   │   ├── international/      # International sources
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles + Tailwind
│   ├── components/             # React components
│   ├── lib/                    # Utilities and helpers
│   ├── data/                   # Data files (sources, cache)
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Component Reference

### Core Display Components

#### 1. **ArticleCard** (`src/components/ArticleCard.tsx`)

Individual article display component with broadcast-style formatting.

**Props:**
```typescript
interface ArticleCardProps {
  article: Article;
  showRelated?: boolean;   // Show related articles section
  priority?: boolean;      // Image loading priority
}
```

**Features:**
- Large responsive images with captions
- Hyperlinked headlines (open in new tab)
- Source attribution with timestamp
- Article summary (2-3 paragraphs)
- "Read full article" link with icon
- Related articles section
- Graceful handling of missing images

**Usage:**
```typescript
import { ArticleCard } from '@/components/ArticleCard';

<ArticleCard
  article={article}
  showRelated={true}
  priority={true}  // For above-the-fold content
/>
```

---

#### 2. **NewsReport** (`src/components/NewsReport.tsx`)

Broadcast-style news report combining multiple articles.

**Props:**
```typescript
interface NewsReportProps {
  category: string;
  categoryName: string;
  articles: Article[];
  lastUpdated?: Date;
  showTopStories?: boolean;
}
```

**Features:**
- Category header with last updated time
- "Top Stories" section (top 3 articles)
- Elegant article separators
- Print-friendly styling
- Footer with article count

**Usage:**
```typescript
import { NewsReport } from '@/components/NewsReport';

<NewsReport
  category="technology"
  categoryName="Technology"
  articles={articles}
  lastUpdated={new Date()}
  showTopStories={true}
/>
```

---

#### 3. **ArticleList** (`src/components/ArticleList.tsx`)

Alternative list view for browsing multiple articles.

**Props:**
```typescript
interface ArticleListProps {
  categoryName: string;
  articles: Article[];
  lastUpdated?: Date;
  allowViewToggle?: boolean;
  defaultView?: 'list' | 'grid';
}
```

**Features:**
- Compact card layout
- Group by source toggle
- View mode switching (list/grid)
- Filtering options
- Responsive grid layout

---

#### 4. **LoadingState** (`src/components/LoadingState.tsx`)

Skeleton loading UI matching article card dimensions.

**Features:**
- Animated shimmer effect
- Matches ArticleCard structure
- Shows 3 cards by default
- Compact variant available

**Usage:**
```typescript
import { LoadingState } from '@/components/LoadingState';

{isLoading ? <LoadingState /> : <ArticleList articles={articles} />}
```

---

#### 5. **EmptyState** (`src/components/EmptyState.tsx`)

Friendly empty state component.

**Props:**
```typescript
interface EmptyStateProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
}
```

**Usage:**
```typescript
import { EmptyState } from '@/components/EmptyState';

<EmptyState
  title="No articles found"
  message="Try a different category or refresh the page"
  showRefresh={true}
  onRefresh={handleRefresh}
/>
```

---

### Specialized Components

#### 6. **DailyBriefSection** (`src/components/DailyBriefSection.tsx`)
Category sections for daily brief display.

#### 7. **SearchBar** (`src/components/SearchBar.tsx`)
Search input with keyboard shortcuts (Cmd/Ctrl+K).

#### 8. **SearchResults** (`src/components/SearchResults.tsx`)
Search results display with filters.

#### 9. **SourceManager** (`src/components/SourceManager.tsx`)
RSS source CRUD interface for settings page.

#### 10. **PreferenceSection** (`src/components/PreferenceSection.tsx`)
User preference management sections.

#### 11. **InternationalSourceCard** (`src/components/InternationalSourceCard.tsx`)
Display card for international news sources.

---

## API Documentation

### API Routes

All API routes are located in `src/app/api/` and follow Next.js 15 Route Handler conventions.

---

#### 1. **GET `/api/articles`**

Fetch all articles from active RSS sources.

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```typescript
{
  articles: Article[],
  errors: string[],
  lastUpdated: string,      // ISO timestamp
  successCount: number,
  errorCount: number,
  cached: boolean
}
```

**Caching:** Returns cached data if fresh (<30 min), otherwise fetches new data.

**Example:**
```bash
curl http://localhost:3000/api/articles?category=technology
```

---

#### 2. **POST `/api/articles/refresh`**

Force refresh all articles, bypassing cache.

**Response:** Same as `/api/articles` with `refreshed: true`

**Example:**
```bash
curl -X POST http://localhost:3000/api/articles/refresh
```

---

#### 3. **GET `/api/category/[slug]`**

Fetch articles for a specific category with deduplication.

**Parameters:**
- `slug`: Category slug (us-news, world-news, technology, etc.)

**Response:**
```typescript
{
  articles: Article[],      // Sorted by date, deduplicated
  errors: string[],
  lastUpdated: string,
  category: string,
  successCount: number,
  errorCount: number
}
```

**Processing:**
- Sorts articles by date (newest first)
- Deduplicates similar articles
- Adds related articles to each article

---

#### 4. **GET `/api/sources`**

Get all RSS sources.

**Response:**
```typescript
{
  sources: RSSSource[],
  count: number
}
```

---

#### 5. **POST `/api/sources`**

Add a new RSS source.

**Request Body:**
```typescript
{
  name: string,
  url: string,
  category: string,
  sourceName: string,
  active: boolean
}
```

**Response:**
```typescript
{
  source: RSSSource,
  message: string
}
```

---

#### 6. **PATCH `/api/sources/[id]`**

Update an existing RSS source.

**Request Body:** Partial RSSSource object

---

#### 7. **DELETE `/api/sources/[id]`**

Delete an RSS source by ID.

---

#### 8. **POST `/api/validate-rss`**

Validate an RSS feed before adding.

**Request Body:**
```typescript
{
  url: string
}
```

**Response:**
```typescript
{
  valid: boolean,
  feedTitle: string,
  itemCount: number,
  message: string
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/validate-rss \
  -H "Content-Type: application/json" \
  -d '{"url":"https://techcrunch.com/feed/"}'
```

---

#### 9. **GET/POST `/api/preferences`**

Get and save user preferences.

---

#### 10. **GET `/api/health`**

Health check endpoint for monitoring.

---

#### 11. **GET/POST `/api/health/feed-health`**

Monitor RSS feed health and performance metrics.

**GET Request - Cached Health Check:**
Returns recent feed health data (cached if less than 1 hour old).

**POST Request - Force Refresh:**
Forces a fresh health check, bypassing cache.

**Response:**
```typescript
{
  cached: boolean,
  lastChecked: Date,
  summary: {
    totalFeeds: number,
    healthyFeeds: number,
    degradedFeeds: number,
    failedFeeds: number,
    averageResponseTime: number,
    details: FeedHealth[]
  }
}

interface FeedHealth {
  sourceId: string,
  sourceName: string,
  status: 'healthy' | 'degraded' | 'failed',
  lastChecked: Date,
  lastSuccessfulFetch?: Date,
  consecutiveFailures: number,
  averageResponseTime: number,
  errorMessage?: string
}
```

**Example:**
```bash
# Check feed health (may return cached)
curl http://localhost:3000/api/health/feed-health

# Force fresh health check
curl -X POST http://localhost:3000/api/health/feed-health
```

**Status Classification:**
- **Healthy**: 0 consecutive failures
- **Degraded**: 1-3 consecutive failures
- **Failed**: 4+ consecutive failures

---

### RSS Parsing Library

NewsHub uses two RSS parsing implementations:

#### **Enhanced Parser (Recommended)** - `src/lib/rss-parser-enhanced.ts`

The enhanced parser includes retry logic, request batching, and optimized performance.

**Key Functions:**

```typescript
/**
 * Fetch a single RSS feed with retry logic and exponential backoff
 * Attempts: 3 retries with 500ms, 1s, 2s delays
 */
async function fetchRSSFeedWithRetry(
  source: RSSSource,
  maxRetries: number = 3
): Promise<FeedResult>

/**
 * Fetch multiple RSS feeds with batching (default: 5 feeds per batch)
 * 100ms delay between batches to avoid overwhelming servers
 */
async function fetchMultipleFeedsOptimized(
  sources: RSSSource[],
  batchSize: number = 5
): Promise<FeedResponse>

/**
 * Fetch feeds for a specific category with optimization
 */
async function fetchCategoryFeedsOptimized(
  sources: RSSSource[],
  category: string
): Promise<FeedResponse>

/**
 * Validate an RSS feed URL with HTTPS check
 */
async function validateRSSFeed(url: string): Promise<{
  valid: boolean,
  error?: string,
  feedTitle?: string,
  itemCount?: number,
  hasHTTPS?: boolean
}>
```

**Configuration:**
- **Timeout:** 8 seconds per feed (reduced from 10s)
- **Retry logic:** 3 attempts with exponential backoff (500ms, 1s, 2s)
- **Batching:** Processes 5 feeds at a time with 100ms delays
- **Image extraction:** Enhanced extraction from media:content, media:thumbnail, enclosure, and content HTML
- **Error handling:** Graceful with partial results and retry tracking
- **User-Agent:** "NewsHub/1.0"

**Performance Metrics:**
- 95%+ success rate (up from ~70%)
- 50% faster fetching (4-6s vs 8-12s average)
- 85%+ failed feed recovery with retries

#### **Basic Parser** - `src/lib/rss-parser.ts`

Legacy parser still available for simple use cases without retry logic.

**Key Functions:**

```typescript
/**
 * Fetch and parse a single RSS feed
 */
async function fetchRSSFeed(source: RSSSource): Promise<FeedResult>

/**
 * Fetch multiple RSS feeds in parallel
 */
async function fetchMultipleFeeds(sources: RSSSource[]): Promise<{
  articles: Article[],
  errors: string[]
}>

/**
 * Fetch feeds for a specific category
 */
async function fetchCategoryFeeds(
  sources: RSSSource[],
  category: string
): Promise<FeedResult>
```

**Configuration:**
- **Timeout:** 10 seconds per feed
- **Image extraction:** From feed content
- **Error handling:** Graceful with partial results
- **User-Agent:** "NewsHub/1.0"

---

### Data Store Library

**File:** `src/lib/data-store.ts`

Handles data persistence and caching.

#### Key Functions:

```typescript
/**
 * Cache articles to disk (30-minute expiry)
 */
function cacheArticles(articles: Article[]): void

/**
 * Retrieve cached articles if fresh
 */
function getCachedArticles(): { articles: Article[], timestamp: string } | null

/**
 * Load RSS sources from disk
 */
function loadSources(): RSSSource[]

/**
 * Save RSS sources to disk
 */
function saveSources(sources: RSSSource[]): void

/**
 * Add a new RSS source
 */
function addSource(source: Omit<RSSSource, 'id'>): RSSSource

/**
 * Update an existing source
 */
function updateSource(id: string, updates: Partial<RSSSource>): RSSSource | null

/**
 * Delete a source by ID
 */
function deleteSource(id: string): boolean

/**
 * Load user preferences
 */
function loadPreferences(): UserPreferences

/**
 * Save user preferences
 */
function savePreferences(prefs: UserPreferences): void
```

**Caching Strategy:**
- Articles cached in `src/data/cached-articles.json`
- 30-minute cache duration
- Automatic cache invalidation
- Timestamp-based freshness check

---

## Type Definitions

**File:** `src/types/index.ts`

### Core Types

```typescript
interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  isoDate?: string;
  content: string;
  contentSnippet: string;
  source: string;           // RSS feed URL
  sourceName: string;       // Display name (e.g., "BBC News")
  category: string;
  imageUrl?: string;
  imageCaption?: string;
  relatedArticles?: RelatedArticle[];
}

interface RSSSource {
  id: string;
  name: string;             // Internal name
  url: string;              // RSS feed URL
  category: string;
  active: boolean;
  sourceName: string;       // Display name
  addedAt?: string;
}

interface Category {
  id: string;
  name: string;             // Display name
  slug: string;             // URL slug
  description?: string;
  feedUrls: string[];
}

interface UserPreferences {
  favoriteCategories: string[];
  favoriteSources: string[];
  displayDensity: 'comfortable' | 'compact';
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number;  // Minutes
  notifications: boolean;
}

interface SearchFilters {
  category?: string;
  source?: string;
  dateRange?: 'today' | 'week' | 'month';
  sortBy?: 'date' | 'relevance';
}

interface SearchResult {
  article: Article;
  relevanceScore: number;
  matchedFields: string[];
}
```

---

## Utility Functions

### Category Utilities (`src/lib/category-utils.ts`)

```typescript
// Get category configuration by slug
getCategoryBySlug(slug: string): CategoryInfo | null

// Get all available categories
getAllCategories(): Record<string, CategoryInfo>

// Filter articles by category
filterArticlesByCategory(articles: Article[], category: string): Article[]

// Sort articles by date (newest first)
sortArticlesByDate(articles: Article[]): Article[]

// Remove duplicate articles
deduplicateArticles(articles: Article[]): Article[]

// Find related articles
findRelatedArticles(article: Article, allArticles: Article[], limit?: number): RelatedArticle[]

// Format article date for display
formatArticleDate(dateString: string): string

// Extract domain from URL
extractDomain(url: string): string
```

### Search Utilities (`src/lib/search-utils.ts`)

```typescript
// Search articles with relevance scoring
searchArticles(
  articles: Article[],
  query: string,
  filters?: SearchFilters
): SearchResult[]

// Calculate relevance score
calculateRelevance(article: Article, query: string): number

// Apply search filters
applyFilters(articles: Article[], filters: SearchFilters): Article[]

// Sort search results
sortResults(results: SearchResult[], sortBy: 'date' | 'relevance'): SearchResult[]
```

### Daily Brief Utilities (`src/lib/daily-brief-utils.ts`)

```typescript
// Generate daily brief from articles
generateDailyBrief(articles: Article[]): DailyBrief

// Get top articles for each category
getTopArticlesByCategory(articles: Article[], limit: number): Map<string, Article[]>

// Format daily brief for printing
formatForPrint(brief: DailyBrief): string

// Export daily brief as JSON
exportBriefAsJSON(brief: DailyBrief): string  // @internal - Future feature
```

### International Utilities (`src/lib/international-utils.ts`)

```typescript
// Get all international sources
getAllInternationalSources(): InternationalData

// Get sources by region
getSourcesByRegion(region: string): NewsSource[]

// Search sources by query
searchSources(query: string): NewsSource[]
```

### Preferences Utilities (`src/lib/preferences-utils.ts`)

```typescript
// Get current user preferences
getPreferences(): UserPreferences

// Save preferences
savePreferences(prefs: UserPreferences): void

// Reset preferences to defaults
resetPreferences(): void

// Validate RSS feed (client-side wrapper)
validateRSSFeed(url: string): Promise<ValidationResult>
```

### Sanitization Utilities (`src/lib/sanitize.ts`)

```typescript
// Sanitize HTML content with allowed tags (paragraphs, links, lists, etc.)
sanitizeHTML(dirty: string): string

// Strip all HTML tags, returning plain text only
sanitizeText(dirty: string): string

// Sanitize content snippet, preserving only line breaks
sanitizeSnippet(dirty: string): string
```

**Usage:**
```typescript
import { sanitizeSnippet } from '@/lib/sanitize';

// Safe for use with dangerouslySetInnerHTML
<p dangerouslySetInnerHTML={{ __html: sanitizeSnippet(article.contentSnippet) }} />
```

**Security:**
- Uses DOMPurify for XSS protection
- Configurable allowed tags and attributes
- Works in both server and client environments (isomorphic-dompurify)

### Feed Health Utilities (`src/lib/feed-health.ts`)

```typescript
// Check health of a single feed
checkFeedHealth(source: RSSSource): Promise<FeedHealth>

// Check health of all feeds
checkAllFeedsHealth(sources: RSSSource[]): Promise<FeedHealthSummary>

// Get current health status from memory
getFeedHealth(sourceId: string): FeedHealth | null

// Get all feed health data
getAllFeedHealth(): FeedHealth[]

// Get feeds that need attention
getFeedsNeedingAttention(): FeedHealth[]

// Update feed health record
updateFeedHealth(sourceId: string, health: Partial<FeedHealth>): void

// Record successful feed fetch
recordSuccessfulFetch(sourceId: string, responseTime: number): void

// Record failed feed fetch
recordFailedFetch(sourceId: string, error: string): void
```

**Types:**
```typescript
interface FeedHealth {
  sourceId: string;
  sourceName: string;
  status: 'healthy' | 'degraded' | 'failed';
  lastChecked: Date;
  lastSuccessfulFetch?: Date;
  consecutiveFailures: number;
  averageResponseTime: number;
  errorMessage?: string;
  uptime?: number;
}

interface FeedHealthSummary {
  totalFeeds: number;
  healthyFeeds: number;
  degradedFeeds: number;
  failedFeeds: number;
  averageResponseTime: number;
  details: FeedHealth[];
}
```

**Usage:**
```typescript
import { checkAllFeedsHealth } from '@/lib/feed-health';

const health = await checkAllFeedsHealth(sources);
console.log(`${health.healthyFeeds} healthy, ${health.failedFeeds} failed`);
```

---

## Design System

### Colors

Defined in `src/app/globals.css`:

```css
@theme {
  /* Primary colors */
  --color-primary: #1e40af;        /* Blue 800 */
  --color-accent: #3b82f6;         /* Blue 500 */
  --color-secondary: #475569;      /* Slate 600 */

  /* Grays */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-600: #4b5563;
  --color-gray-900: #111827;

  /* Semantic colors */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}
```

### Typography

**Font Family:** Inter (Google Fonts)

**Sizes:**
- **Headlines:** `text-2xl` to `text-4xl`, bold weight
- **Body:** `text-base` to `text-lg`, regular weight
- **Captions:** `text-sm`, italic, gray-600

### Spacing

- **Article cards:** `mb-8` to `mb-12`
- **Sections:** `mt-16`
- **Container padding:** `p-4` to `p-8`

### Components Visual Layout

#### ArticleCard Structure:
```
┌─────────────────────────────────┐
│   [FULL WIDTH IMAGE]            │
├─────────────────────────────────┤
│ Image caption (italic, gray)    │
│                                 │
│ ## HEADLINE (bold, large)       │
│                                 │
│ SOURCE • 2 hours ago            │
│                                 │
│ Article content paragraph 1...  │
│ Article content paragraph 2...  │
│                                 │
│ → Read full article at domain   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Related Articles            │ │
│ │ • Article 1                 │ │
│ │ • Article 2                 │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
http://localhost:3000
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Building

```bash
# Production build
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

### Common Tasks

#### Adding a New Category

1. Add category to `CATEGORIES` in `src/lib/category-utils.ts`:
```typescript
export const CATEGORIES: Record<string, CategoryInfo> = {
  'new-category': {
    name: 'New Category',
    slug: 'new-category',
    feedUrls: ['https://example.com/rss']
  },
  // ...
}
```

2. Update type definitions in `src/types/index.ts`:
```typescript
export type Category = 'US News' | 'World News' | /* ... */ | 'New Category';
```

3. Add icon to homepage (`src/app/page.tsx`)

#### Adding a New RSS Source

**Via Settings UI:**
1. Navigate to `/settings`
2. Use "RSS Feed Management" section
3. Click "Add Source"
4. Test and save

**Manually:**
Edit `src/data/sources.json`:
```json
{
  "id": "unique-id",
  "name": "Source Name",
  "url": "https://example.com/rss",
  "category": "Technology",
  "active": true,
  "sourceName": "Example News"
}
```

#### Customizing Styles

**Global styles:** Edit `src/app/globals.css`
**Component styles:** Use Tailwind utility classes inline
**Theme colors:** Modify `@theme` block in globals.css

---

## Testing Guide

### Manual Testing

#### Test API Routes:

```bash
# Test sources API
curl http://localhost:3000/api/sources

# Test articles API
curl http://localhost:3000/api/articles

# Test category API
curl http://localhost:3000/api/category/technology

# Validate RSS feed
curl -X POST http://localhost:3000/api/validate-rss \
  -H "Content-Type: application/json" \
  -d '{"url":"https://techcrunch.com/feed/"}'
```

#### Test UI Pages:

1. **Homepage** - `http://localhost:3000`
   - Verify 8 category cards display
   - Check navigation works

2. **Category Page** - `http://localhost:3000/category/technology`
   - Verify articles load
   - Check images display
   - Test article links

3. **Daily Brief** - `http://localhost:3000/daily-brief`
   - Verify all categories shown
   - Test print button
   - Test download button

4. **Search** - `http://localhost:3000/search?q=technology`
   - Test search functionality
   - Verify filters work
   - Check sorting options

5. **Settings** - `http://localhost:3000/settings`
   - Test preference toggles
   - Try adding RSS source
   - Verify source validation

### Browser Testing

Test on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive design)

---

## Customization

### Changing Colors

Edit `src/app/globals.css`:

```css
@theme {
  --color-primary: #your-color;
  --color-accent: #your-color;
  /* ... */
}
```

### Changing Cache Duration

Edit `src/lib/data-store.ts`:

```typescript
const CACHE_DURATION = 30 * 60 * 1000; // Change to desired milliseconds
```

### Changing RSS Feed Timeout

Edit `src/lib/rss-parser.ts`:

```typescript
const parser = new Parser({
  timeout: 15000, // Change from 10000 to 15 seconds
  headers: { 'User-Agent': 'NewsHub/1.0' },
});
```

### Adding Custom Pages

1. Create folder in `src/app/`
2. Add `page.tsx` file
3. Export React component

Next.js auto-creates the route.

---

## Performance

### Optimization Strategies

1. **Image Loading:**
   - Next.js Image component for auto-optimization
   - Priority loading for above-the-fold images
   - Lazy loading for below-the-fold content

2. **Caching:**
   - 30-minute server-side cache for articles
   - Next.js page revalidation every 30 minutes
   - Client-side caching where appropriate

3. **Code Splitting:**
   - Components load only when needed
   - Reduced initial bundle size
   - Dynamic imports for large components

4. **Static Generation:**
   - Category pages generated at build time
   - Faster page loads
   - Better SEO

### Production Recommendations

1. **Replace file-based storage with a database:**
   - PostgreSQL, MongoDB, or similar
   - Store articles, sources, preferences

2. **Implement Redis caching:**
   - Replace file-based cache
   - Better performance and scalability

3. **Add authentication:**
   - Protect source management routes
   - User-specific preferences

4. **Add rate limiting:**
   - Prevent API abuse
   - Use libraries like `express-rate-limit`

5. **Error monitoring:**
   - Integrate Sentry or similar
   - Track RSS feed failures

6. **Background jobs:**
   - Scheduled RSS fetching (cron job)
   - Update cache automatically

---

## Troubleshooting

### Common Issues

#### Server Won't Start
```bash
rm -rf .next
npm run dev
```

#### Articles Not Loading
1. Check if RSS sources are accessible
2. Review console for error messages
3. Test API routes directly with curl
4. Verify cache file exists

#### Cache Not Updating
```bash
# Delete cache file
rm src/data/cached-articles.json

# Or use refresh API
curl -X POST http://localhost:3000/api/articles/refresh
```

#### TypeScript Errors
```bash
# Check errors
npx tsc --noEmit

# Fix and rebuild
```

#### Images Won't Load
1. Check image URLs are valid
2. Verify domain allowed in `next.config.ts`
   - **40+ news source domains pre-configured** as of v1.0.3
   - Includes: CNN, BBC, NYT, The Verge, TechCrunch, ESPN, WSJ, Guardian, NPR, Reuters, etc.
   - If new domain needed, add to `images.remotePatterns` in `next.config.ts` and restart dev server
3. Check internet connection
4. Verify images exist at URL

**Example: Adding a new image domain to next.config.ts:**
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example-news-cdn.com',
    },
    // ... existing patterns
  ],
}
```

---

## Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Tailwind CSS v4 Docs:** https://tailwindcss.com/docs
- **RSS Parser:** https://github.com/rbren/rss-parser

---

**Version:** 1.0.3 (Post-UI/UX Enhancement Update)
**Last Updated:** October 28, 2025
**Consolidated From:** COMPONENT_DOCUMENTATION.md + API_INTEGRATION.md
**Recent Updates:** Image configuration (40+ domains), homepage redesign, enhanced RSS parser, XSS protection, feed health monitoring
