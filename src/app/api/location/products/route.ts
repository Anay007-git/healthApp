import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/redis';
import { ActowizQuickCommerceProvider, MockQuickCommerceProvider } from '@/lib/providers/providers';

// Helper function to reverse geocode lat/lng to pincode
async function getPincode(lat: number, lng: number): Promise<string> {
  const googleKey = process.env.GOOGLE_PLACES_API_KEY;
  
  // Try Google Geocoding API first if key exists
  if (googleKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleKey}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        const data = await response.json();
        const results = data.results || [];
        for (const res of results) {
          const postalComponent = res.address_components?.find((c: any) => 
            c.types.includes('postal_code')
          );
          if (postalComponent) {
            return postalComponent.long_name;
          }
        }
      }
    } catch (e) {
      console.warn('Google reverse geocoding failed, falling back:', e);
    }
  }

  // Fallback: OpenStreetMap Nominatim API (completely free reverse-geocoder)
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AnaySwapApp/1.0 (contact@anayswap.in)' // User-Agent required by OSM TOS
      },
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      const pincode = data.address?.postcode || data.address?.pincode;
      if (pincode) return pincode.replace(/\s/g, ''); // strip spaces
    }
  } catch (e) {
    console.warn('OSM Nominatim reverse geocoding failed:', e);
  }

  // Final fallback default: Bengaluru Indiranagar pincode
  return '560038';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';

    if (!latStr || !lngStr) {
      return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Invalid latitude or longitude coordinates' }, { status: 400 });
    }

    // 1. Get Pincode for coordinate grouping
    const pincode = await getPincode(lat, lng);
    const cacheKey = `products:${pincode}:${query.toLowerCase().trim().replace(/\s+/g, '_')}:${category.toLowerCase().trim()}`;

    // 2. Cache Lookup
    const cachedProducts = await cacheGet<any[]>(cacheKey);
    if (cachedProducts) {
      console.log(`Cache HIT for key: ${cacheKey}`);
      return NextResponse.json({ products: cachedProducts, pincode, cached: true });
    }

    console.log(`Cache MISS for key: ${cacheKey}. Fetching from provider...`);

    // 3. Provider invocation
    const providerKey = process.env.QUICK_COMMERCE_API_KEY;
    const provider = providerKey 
      ? new ActowizQuickCommerceProvider(providerKey)
      : new MockQuickCommerceProvider();

    const products = await provider.searchProducts(query, lat, lng, category);

    // 4. Cache update (3 hours TTL)
    await cacheSet(cacheKey, products, 10800);

    return NextResponse.json({ products, pincode, cached: false });
  } catch (err: any) {
    console.error('Error in /api/location/products endpoint:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}
