/**
 * Sources API Route
 * Get all sources or add a new source
 * GET /api/sources - Get all sources
 * POST /api/sources - Add new source
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadSources, addSource } from '@/lib/data-store';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sources = await loadSources();

    return NextResponse.json({
      sources,
      count: sources.length,
    });
  } catch (error) {
    logger.error('Error loading sources', error);

    return NextResponse.json(
      { error: 'Failed to load sources', sources: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.url || !body.category || !body.sourceName) {
      return NextResponse.json(
        { error: 'Missing required fields: name, url, category, sourceName' },
        { status: 400 }
      );
    }

    // Create new source
    const newSource = await addSource({
      name: body.name,
      url: body.url,
      category: body.category,
      sourceName: body.sourceName,
      active: body.active !== undefined ? body.active : true,
    });

    logger.info('RSS source added successfully', { sourceId: newSource.id, name: newSource.name });

    return NextResponse.json({
      source: newSource,
      message: 'Source added successfully',
    });
  } catch (error) {
    logger.error('Error adding source', error);

    return NextResponse.json(
      { error: 'Failed to add source' },
      { status: 500 }
    );
  }
}
