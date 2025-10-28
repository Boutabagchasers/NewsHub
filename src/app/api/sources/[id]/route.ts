/**
 * Source Management API Route
 * Update or delete a specific source
 * PATCH /api/sources/[id] - Update source
 * DELETE /api/sources/[id] - Delete source
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateSource, deleteSource } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Update source
    const updatedSource = await updateSource(id, body);

    if (!updatedSource) {
      return NextResponse.json(
        { error: 'Source not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      source: updatedSource,
      message: 'Source updated successfully',
    });
  } catch (error) {
    console.error('Error updating source:', error);

    return NextResponse.json(
      { error: 'Failed to update source' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Delete source
    const deleted = await deleteSource(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Source not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Source deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting source:', error);

    return NextResponse.json(
      { error: 'Failed to delete source' },
      { status: 500 }
    );
  }
}
