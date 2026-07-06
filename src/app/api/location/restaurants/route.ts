import { NextRequest, NextResponse } from 'next/server';
import { getHealthyCuisineTags } from '@/lib/db';
import { GooglePlacesRestaurantProvider, MockRestaurantProvider } from '@/lib/providers/providers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const tagsStr = searchParams.get('tags') || '';

    if (!latStr || !lngStr) {
      return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Invalid latitude or longitude coordinates' }, { status: 400 });
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    // 1. Instantiate Restaurant Provider
    const placesKey = process.env.GOOGLE_PLACES_API_KEY;
    const provider = placesKey
      ? new GooglePlacesRestaurantProvider(placesKey)
      : new MockRestaurantProvider();

    // 2. Fetch nearby matching restaurants
    const restaurants = await provider.searchRestaurants(lat, lng, tags);

    // 3. Cross-reference results with healthy_cuisine_tags for database-driven scoring and category grouping
    const dbTags = await getHealthyCuisineTags();
    const tagsMap = new Map(dbTags.map(t => [t.cuisine_type.toLowerCase(), t]));
    const locationParam = searchParams.get('location') || '';

    const enrichedRestaurants = restaurants.map((rest) => {
      let highestTagScore = rest.health_score;
      let matchedCategory = 'Balanced';
      let scoreFoundInDb = false;

      for (const tag of rest.cuisine_tags) {
        const dbTag = tagsMap.get(tag.toLowerCase());
        if (dbTag) {
          scoreFoundInDb = true;
          // Take the highest health score if multiple cuisines match
          if (dbTag.health_score > highestTagScore) {
            highestTagScore = dbTag.health_score;
          }
          matchedCategory = dbTag.category;
        }
      }

      // If mock mode is active, dynamically overwrite mock addresses with local location context
      let address = rest.address;
      if (!placesKey && locationParam) {
        const cleanLocName = locationParam.replace(/,\s*(India|Karnataka|Maharashtra|Delhi|Pune|Telangana)$/gi, '');
        const addressSuffixes = [
          '1st Main Road',
          'Opposite Central Park',
          'Food Court Extension',
          'Metro Exit Corridor'
        ];
        const index = restaurants.findIndex(r => r.id === rest.id);
        const suffix = addressSuffixes[index >= 0 ? index % addressSuffixes.length : 0];
        address = `${suffix}, ${cleanLocName}`;
      }

      return {
        ...rest,
        address,
        health_score: highestTagScore,
        health_category: matchedCategory,
        db_verified: scoreFoundInDb
      };
    });

    // 4. Sort by health score descending
    enrichedRestaurants.sort((a, b) => b.health_score - a.health_score);

    return NextResponse.json({ restaurants: enrichedRestaurants });
  } catch (err: any) {
    console.error('Error in /api/location/restaurants endpoint:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}
