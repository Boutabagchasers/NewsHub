/**
 * RSS Validation API Route
 * Validates an RSS feed URL before adding it as a source
 * POST /api/validate-rss
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRSSFeed } from '@/lib/rss-parser';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.url) {
      return NextResponse.json(
        { valid: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate the RSS feed
    const result = await validateRSSFeed(body.url);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        feedTitle: result.feedTitle,
        itemCount: result.itemCount,
        message: 'RSS feed is valid and accessible',
      });
    } else {
      return NextResponse.json({
        valid: false,
        error: result.error,
        message: 'RSS feed validation failed',
      });
    }
  } catch (error) {
    console.error('Error validating RSS feed:', error);

    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
