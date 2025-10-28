/**
 * Feed Health Check API Route
 * GET /api/health/feed-health
 */

import { NextResponse } from 'next/server';
import { loadSources } from '@/lib/data-store';
import { checkAllFeedsHealth, getAllFeedHealth } from '@/lib/feed-health';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sources = await loadSources();

    // Get current health status (from memory)
    const currentHealth = getAllFeedHealth();

    // If we have recent health data (within last hour), return it
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const hasRecentData = currentHealth.some(
      h => h.lastChecked && new Date(h.lastChecked).getTime() > oneHourAgo
    );

    if (hasRecentData && currentHealth.length > 0) {
      return NextResponse.json({
        cached: true,
        lastChecked: new Date(),
        summary: {
          totalFeeds: currentHealth.length,
          healthyFeeds: currentHealth.filter(h => h.status === 'healthy').length,
          degradedFeeds: currentHealth.filter(h => h.status === 'degraded').length,
          failedFeeds: currentHealth.filter(h => h.status === 'failed').length,
          details: currentHealth,
        },
      });
    }

    // Perform fresh health check
    logger.info('Performing fresh feed health check');
    const healthSummary = await checkAllFeedsHealth(sources);

    return NextResponse.json({
      cached: false,
      lastChecked: new Date(),
      summary: healthSummary,
    });
  } catch (error) {
    logger.error('Error checking feed health', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Force refresh feed health
 * POST /api/health/feed-health
 */
export async function POST() {
  try {
    const sources = await loadSources();
    const healthSummary = await checkAllFeedsHealth(sources);

    return NextResponse.json({
      cached: false,
      lastChecked: new Date(),
      summary: healthSummary,
    });
  } catch (error) {
    logger.error('Error forcing feed health check', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
