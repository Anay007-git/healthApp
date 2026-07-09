import { NextRequest, NextResponse } from 'next/server';
import { getLabReportBySupplementId, LabReport } from '@/lib/db';
import { cacheGet, cacheSet } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supplementId = searchParams.get('id');

    if (!supplementId) {
      return NextResponse.json({ error: 'supplementId query parameter is required' }, { status: 400 });
    }

    const cacheKey = `lab_report:${supplementId}`;

    // 1. Read from Redis cache first
    try {
      const cachedReport = await cacheGet<LabReport>(cacheKey);
      if (cachedReport) {
        return NextResponse.json({ report: cachedReport, cached: true });
      }
    } catch (cacheErr) {
      console.warn('Failed to read from Redis cache:', cacheErr);
    }

    // 2. Database query fallback on cache miss
    const dbReport = await getLabReportBySupplementId(supplementId);

    if (dbReport) {
      // Save/populate cache (TTL = 7 days = 604800 seconds)
      try {
        await cacheSet(cacheKey, dbReport, 604800);
      } catch (cacheErr) {
        console.warn('Failed to set Redis cache:', cacheErr);
      }

      return NextResponse.json({ report: dbReport, cached: false });
    }

    // 3. Absence of data -> Return default sample_demo configuration
    const sampleDemoReport: LabReport = {
      supplement_id: supplementId,
      source_type: 'sample_demo',
      status: 'draft'
    };

    return NextResponse.json({ report: sampleDemoReport, cached: false });

  } catch (err: any) {
    console.error('Error fetching verified lab report:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}
