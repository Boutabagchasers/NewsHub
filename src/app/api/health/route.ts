/**
 * Health Check API Route
 * Simple endpoint to verify API routes are working
 * GET /api/health
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'NewsHub API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
