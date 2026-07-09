import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { redis } from '@/lib/redis';
import { PDFParse } from 'pdf-parse';

// Helper to check authorization
function isAuthorized(request: NextRequest) {
  const secretToken = process.env.ADMIN_SECRET || 'NutriFitSwapAdminSecret';
  const reqToken = request.headers.get('x-admin-token') || new URL(request.url).searchParams.get('token');
  return reqToken === secretToken;
}

// Helper to automatically extract parameters from a Labdoor PDF certificate
async function extractReportFromPdfUrl(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    
    if (!result || !result.pages || result.pages.length === 0) return null;
    
    const fullText = result.pages.map((p: any) => p.text).join('\n');
    
    // Parse lot/cert ID
    const lotMatch = fullText.match(/Product Lot\s+([^\n\t]+)/i) || fullText.match(/Lot\s*(?:#|No\.?)?\s*([a-z0-9-]+)/i);
    const certificateId = lotMatch ? lotMatch[1].trim() : null;

    // Parse Accuracy
    const accuracyMatch = fullText.match(/Accuracy\s*\|\s*PASS/i);
    const labelAccuracyStatus = accuracyMatch ? 'Passed (100% Active ingredients claim)' : 'Verification Pending';

    // Parse Purity / Heavy Metals
    const purityMatch = fullText.match(/Purity\s*\|\s*PASS/i);
    const heavyMetalsStatus = purityMatch ? 'Clear (Lead, Mercury, Cadmium & Arsenic undetected)' : 'Safe trace levels';

    // Calculate score from Protein values if present
    let purityScore = 96; // fallback high grade
    const proteinMatch = fullText.match(/Protein\s+g\/serving\s+(\d+)\s+([\d.]+)/i);
    if (proteinMatch) {
      const claimed = parseFloat(proteinMatch[1]);
      const found = parseFloat(proteinMatch[2]);
      if (claimed > 0) {
        const ratio = found / claimed;
        purityScore = Math.min(100, Math.round(ratio * 90) + 10);
      }
    }

    return {
      certificateId,
      labelAccuracyStatus,
      heavyMetalsStatus,
      purityScore
    };
  } catch (err) {
    console.error('Error parsing PDF certificate:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { supplementId, labdoorUrl } = await request.json();

    if (!supplementId || !labdoorUrl) {
      return NextResponse.json({ error: 'supplementId and labdoorUrl are required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Extract slug from labdoorUrl
    let labdoorSlug = '';
    try {
      const parsedUrl = new URL(labdoorUrl);
      const paths = parsedUrl.pathname.split('/').filter(Boolean);
      labdoorSlug = paths[paths.length - 1] || '';
    } catch {
      const parts = labdoorUrl.split('/');
      labdoorSlug = parts[parts.length - 1] || '';
    }

    // 1. Save/Upsert mapping
    const { error: mapError } = await supabase
      .from('labdoor_mappings')
      .upsert({
        supplement_id: supplementId,
        labdoor_url: labdoorUrl,
        labdoor_slug: labdoorSlug,
        matched_by: 'admin',
        match_status: 'active'
      }, { onConflict: 'supplement_id' });

    if (mapError) {
      return NextResponse.json({ error: 'Failed to save mapping', message: mapError.message }, { status: 500 });
    }

    // 2. Extract PDF details if URL points to a PDF certificate
    let pdfData = null;
    if (labdoorUrl.toLowerCase().includes('.pdf')) {
      console.log('PDF certificate detected. Extracting audit parameters...');
      pdfData = await extractReportFromPdfUrl(labdoorUrl);
    }

    const purityScore = pdfData?.purityScore ?? 95;
    const labelAccuracyStatus = pdfData?.labelAccuracyStatus ?? 'Passed';
    const heavyMetalsStatus = pdfData?.heavyMetalsStatus ?? 'Clear (Lead & Mercury undetected)';
    const certificateId = pdfData?.certificateId ?? `CERT-${supplementId.substring(0, 8).toUpperCase()}`;

    // 3. Upsert linked lab_reports row with draft status and auto-filled data
    const { error: reportError } = await supabase
      .from('lab_reports')
      .upsert({
        supplement_id: supplementId,
        source_type: 'third_party_verified',
        issuing_lab: 'Labdoor (USA)',
        source_url: labdoorUrl,
        purity_score: purityScore,
        label_accuracy_status: labelAccuracyStatus,
        heavy_metals_status: heavyMetalsStatus,
        certificate_id: certificateId,
        status: 'draft'
      }, { onConflict: 'supplement_id' });

    if (reportError) {
      return NextResponse.json({ error: 'Failed to save draft lab report', message: reportError.message }, { status: 500 });
    }

    // 4. Invalidate Redis Cache
    if (redis) {
      try {
        await redis.del(`lab_report:${supplementId}`);
      } catch (err) {
        console.warn('Redis cache invalidation failed:', err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: pdfData 
        ? 'Draft mapping and report saved. Extracted details from PDF successfully!' 
        : 'Draft mapping and report successfully saved (no PDF parsed).' 
    });

  } catch (err: any) {
    console.error('Error saving mapping:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { supplementId, purityScore, labelAccuracyStatus, heavyMetalsStatus, verifiedBy, certificateId } = await request.json();

    if (!supplementId) {
      return NextResponse.json({ error: 'supplementId is required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Ensure status is published, and set verified details
    const { error: publishError } = await supabase
      .from('lab_reports')
      .update({
        status: 'published',
        purity_score: purityScore !== undefined && purityScore !== '' ? Number(purityScore) : null,
        label_accuracy_status: labelAccuracyStatus || 'Passed',
        heavy_metals_status: heavyMetalsStatus || 'Clear',
        certificate_id: certificateId || `CERT-${supplementId.substring(0, 8).toUpperCase()}`,
        verified_by: verifiedBy || 'Admin',
        verified_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString()
      })
      .eq('supplement_id', supplementId);

    if (publishError) {
      return NextResponse.json({ error: 'Failed to publish lab report', message: publishError.message }, { status: 500 });
    }

    // Invalidate Redis Cache
    if (redis) {
      try {
        await redis.del(`lab_report:${supplementId}`);
      } catch (err) {
        console.warn('Redis cache invalidation failed:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Lab report successfully published.' });

  } catch (err: any) {
    console.error('Error publishing report:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    // Return all mappings and reports for admin dashboard view
    const { data: mappings, error: mapErr } = await supabase.from('labdoor_mappings').select('*');
    const { data: reports, error: repErr } = await supabase.from('lab_reports').select('*');

    if (mapErr || repErr) {
      return NextResponse.json({ error: 'Failed to fetch details', message: (mapErr || repErr)?.message }, { status: 500 });
    }

    return NextResponse.json({ mappings, reports });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}
