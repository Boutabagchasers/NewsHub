/**
 * RSS Feed Health Monitoring System
 * Tracks feed reliability and performance
 */

import { RSSSource } from './rss-parser-enhanced';
import { fetchRSSFeedWithRetry } from './rss-parser-enhanced';
import { logger } from './logger';

export interface FeedHealth {
  sourceId: string;
  sourceName: string;
  status: 'healthy' | 'degraded' | 'failed';
  lastChecked: Date;
  lastSuccessfulFetch?: Date;
  consecutiveFailures: number;
  averageResponseTime: number;
  errorMessage?: string;
  uptime?: number; // percentage
}

export interface FeedHealthSummary {
  totalFeeds: number;
  healthyFeeds: number;
  degradedFeeds: number;
  failedFeeds: number;
  averageResponseTime: number;
  details: FeedHealth[];
}

// In-memory storage for feed health (would move to database in production)
const feedHealthHistory = new Map<string, FeedHealth>();

/**
 * Check health of a single feed
 */
export async function checkFeedHealth(source: RSSSource): Promise<FeedHealth> {
  const startTime = Date.now();
  const previousHealth = feedHealthHistory.get(source.id);

  try {
    const result = await fetchRSSFeedWithRetry(source, 2); // Only 2 retries for health check
    const responseTime = result.responseTime || Date.now() - startTime;

    if (result.error) {
      // Feed failed
      const consecutiveFailures = (previousHealth?.consecutiveFailures || 0) + 1;

      const health: FeedHealth = {
        sourceId: source.id,
        sourceName: source.sourceName,
        status: consecutiveFailures > 3 ? 'failed' : 'degraded',
        lastChecked: new Date(),
        lastSuccessfulFetch: previousHealth?.lastSuccessfulFetch,
        consecutiveFailures,
        averageResponseTime: previousHealth?.averageResponseTime || responseTime,
        errorMessage: result.error,
      };

      feedHealthHistory.set(source.id, health);
      logger.warn(`Feed health check failed for ${source.name}: ${result.error}`);

      return health;
    }

    // Feed succeeded
    const health: FeedHealth = {
      sourceId: source.id,
      sourceName: source.sourceName,
      status: 'healthy',
      lastChecked: new Date(),
      lastSuccessfulFetch: new Date(),
      consecutiveFailures: 0,
      averageResponseTime: previousHealth
        ? (previousHealth.averageResponseTime + responseTime) / 2
        : responseTime,
    };

    feedHealthHistory.set(source.id, health);

    return health;
  } catch (error) {
    const consecutiveFailures = (previousHealth?.consecutiveFailures || 0) + 1;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    const health: FeedHealth = {
      sourceId: source.id,
      sourceName: source.sourceName,
      status: 'failed',
      lastChecked: new Date(),
      lastSuccessfulFetch: previousHealth?.lastSuccessfulFetch,
      consecutiveFailures,
      averageResponseTime: previousHealth?.averageResponseTime || 0,
      errorMessage,
    };

    feedHealthHistory.set(source.id, health);
    logger.error(`Feed health check exception for ${source.name}`, error);

    return health;
  }
}

/**
 * Check health of all feeds
 */
export async function checkAllFeedsHealth(
  sources: RSSSource[]
): Promise<FeedHealthSummary> {
  const activeSources = sources.filter(s => s.active);

  logger.info(`Checking health of ${activeSources.length} feeds`);

  // Check feeds in parallel (batches of 10)
  const batchSize = 10;
  const healthResults: FeedHealth[] = [];

  for (let i = 0; i < activeSources.length; i += batchSize) {
    const batch = activeSources.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(source => checkFeedHealth(source))
    );
    healthResults.push(...batchResults);
  }

  // Calculate summary stats
  const healthyFeeds = healthResults.filter(h => h.status === 'healthy').length;
  const degradedFeeds = healthResults.filter(h => h.status === 'degraded').length;
  const failedFeeds = healthResults.filter(h => h.status === 'failed').length;

  const totalResponseTime = healthResults.reduce(
    (sum, h) => sum + h.averageResponseTime,
    0
  );
  const averageResponseTime = totalResponseTime / healthResults.length;

  const summary: FeedHealthSummary = {
    totalFeeds: activeSources.length,
    healthyFeeds,
    degradedFeeds,
    failedFeeds,
    averageResponseTime,
    details: healthResults,
  };

  logger.info(
    `Feed health check complete: ${healthyFeeds} healthy, ${degradedFeeds} degraded, ${failedFeeds} failed`
  );

  return summary;
}

/**
 * Get current health status for a feed
 */
export function getFeedHealth(sourceId: string): FeedHealth | undefined {
  return feedHealthHistory.get(sourceId);
}

/**
 * Get all feed health statuses
 */
export function getAllFeedHealth(): FeedHealth[] {
  return Array.from(feedHealthHistory.values());
}

/**
 * Clear feed health history
 */
export function clearFeedHealthHistory(): void {
  feedHealthHistory.clear();
  logger.info('Feed health history cleared');
}

/**
 * Get feeds that need attention (degraded or failed)
 */
export function getFeedsNeedingAttention(): FeedHealth[] {
  return Array.from(feedHealthHistory.values()).filter(
    h => h.status === 'degraded' || h.status === 'failed'
  );
}
