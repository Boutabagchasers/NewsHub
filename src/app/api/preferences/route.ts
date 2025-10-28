/**
 * Preferences API Route
 * Get and save user preferences
 * GET /api/preferences - Get preferences
 * POST /api/preferences - Save preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadPreferences, savePreferences } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const preferences = await loadPreferences();

    return NextResponse.json({
      preferences,
    });
  } catch (error) {
    console.error('Error loading preferences:', error);

    return NextResponse.json(
      { error: 'Failed to load preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Save preferences
    await savePreferences(body);

    return NextResponse.json({
      preferences: body,
      message: 'Preferences saved successfully',
    });
  } catch (error) {
    console.error('Error saving preferences:', error);

    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
