import { NextRequest, NextResponse } from 'next/server';
import { GooglePlacesGymProvider } from '@/lib/providers/providers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');

    if (!latStr || !lngStr) {
      return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Invalid latitude or longitude coordinates' }, { status: 400 });
    }

    const placesKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!placesKey) {
      // Return empty list so client falls back to database/mock list
      return NextResponse.json({ gyms: [], message: 'No Google Places API Key configured' });
    }

    const provider = new GooglePlacesGymProvider(placesKey);
    const gyms = await provider.searchGyms(lat, lng);

    return NextResponse.json({ gyms });
  } catch (err: any) {
    console.error('Error in /api/location/gyms endpoint:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}
