export interface QCProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  calories?: number;
  protein?: number;
  fiber?: number;
  image_url: string;
  platform: 'blinkit' | 'zepto' | 'instamart';
  deep_link: string;
  available: boolean;
  tags?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  cuisine_tags: string[];
  lat: number;
  lng: number;
  distance_text: string;
  health_score: number; // Rating out of 100
  zomato_link: string;
  swiggy_link: string;
  address: string;
}

export interface QuickCommerceProvider {
  searchProducts(query: string, lat: number, lng: number, category?: string): Promise<QCProduct[]>;
}

export interface RestaurantProvider {
  searchRestaurants(lat: number, lng: number, tags: string[]): Promise<Restaurant[]>;
}

/**
 * Phase 2 Live implementation of QuickCommerceProvider (e.g. Actowiz/QuickCommerceAPI)
 */
export class ActowizQuickCommerceProvider implements QuickCommerceProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchProducts(query: string, lat: number, lng: number, category?: string): Promise<QCProduct[]> {
    try {
      console.log(`ActowizQCProvider: hitting live QC endpoint for "${query}"`);
      // Simulate/call Actowiz quick-commerce product query API
      const url = `https://api.actowiz.com/v1/quickcommerce/search?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        // Set short timeout to fail fast
        signal: AbortSignal.timeout(4000)
      });

      if (!response.ok) {
        throw new Error(`QC API HTTP error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.products) {
        throw new Error('Malformed QC API payload response');
      }

      return data.products.map((p: any) => ({
        id: p.id || `live-qc-${Math.random()}`,
        name: p.title || p.name,
        brand: p.brand || 'Clean Label',
        price: p.price || 150,
        calories: p.calories || 200,
        protein: p.protein || 5,
        fiber: p.fiber || 3,
        image_url: p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150',
        platform: (p.platform?.toLowerCase() || 'zepto') as 'blinkit' | 'zepto' | 'instamart',
        deep_link: p.deep_link || `https://blinkit.com/s/?q=${encodeURIComponent(p.title || p.name)}`,
        available: p.in_stock !== false
      }));
    } catch (e) {
      console.warn('ActowizQuickCommerceProvider live fetch failed, falling back to mock provider:', e);
      // Degrade gracefully to local simulated data
      const mockProvider = new MockQuickCommerceProvider();
      return mockProvider.searchProducts(query, lat, lng);
    }
  }
}

/**
 * Phase 3 Live implementation of RestaurantProvider using official Google Places API
 */
export class GooglePlacesRestaurantProvider implements RestaurantProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchRestaurants(lat: number, lng: number, tags: string[]): Promise<Restaurant[]> {
    try {
      console.log(`GooglePlacesProvider: fetching nearby restaurants at ${lat}, ${lng}`);
      // Google Places NearbySearch JSON API
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=restaurant&key=${this.apiKey}`;
      
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) {
        throw new Error(`Google Places HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API returned status: ${data.status}`);
      }

      const results = data.results || [];
      const restaurants: Restaurant[] = results.map((place: any, idx: number) => {
        const nameLower = place.name.toLowerCase();
        
        // Detect healthy tags based on name / keyword matching
        const detectedTags = ['Healthy Food'];
        if (nameLower.includes('salad') || nameLower.includes('green') || nameLower.includes('leaf')) {
          detectedTags.push('Salads');
        }
        if (nameLower.includes('organic') || nameLower.includes('pure') || nameLower.includes('farm')) {
          detectedTags.push('Organic');
        }
        if (nameLower.includes('vegan') || nameLower.includes('plant')) {
          detectedTags.push('Vegan');
        }
        if (nameLower.includes('south') || nameLower.includes('tiffin') || nameLower.includes('idli')) {
          detectedTags.push('South Indian');
        }
        if (nameLower.includes('tandoor') || nameLower.includes('grilled') || nameLower.includes('tikka')) {
          detectedTags.push('Tandoori');
        }
        if (nameLower.includes('millet') || nameLower.includes('oats') || nameLower.includes('ragi')) {
          detectedTags.push('Millet Specials');
        }

        const combinedTags = Array.from(new Set([
          ...detectedTags, 
          ...(place.types?.map((t: string) => t.replace('_', ' ')) || [])
        ])).slice(0, 3);

        // Score restaurant healthiness index (out of 100)
        let healthScore = 70; // baseline
        if (combinedTags.includes('Salads')) healthScore = 95;
        else if (combinedTags.includes('Vegan') || combinedTags.includes('Organic')) healthScore = 92;
        else if (combinedTags.includes('Millet Specials')) healthScore = 90;
        else if (combinedTags.includes('Tandoori')) healthScore = 80;
        else if (combinedTags.includes('South Indian')) healthScore = 76;

        // Generate Swiggy and Zomato deep search links
        const searchName = encodeURIComponent(place.name);

        return {
          id: place.place_id || `google-place-${idx}`,
          name: place.name,
          rating: place.rating || 4.0,
          cuisine_tags: combinedTags,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          distance_text: 'Nearby', // Distance can be computed using Haversine formula
          health_score: healthScore,
          zomato_link: `https://www.zomato.com/search?q=${searchName}`,
          swiggy_link: `https://www.swiggy.com/search?query=${searchName}`,
          address: place.vicinity || 'Local Area, City'
        };
      });

      // Filter based on input tag list if specified
      if (tags && tags.length > 0) {
        const queryTagsLower = tags.map(t => t.toLowerCase());
        const filtered = restaurants.filter(r => 
          r.cuisine_tags.some(t => queryTagsLower.includes(t.toLowerCase()))
        );
        if (filtered.length > 0) return filtered;
      }

      return restaurants;
    } catch (e) {
      console.warn('GooglePlacesRestaurantProvider live fetch failed, falling back to mock provider:', e);
      const mockProvider = new MockRestaurantProvider();
      return mockProvider.searchRestaurants(lat, lng, tags);
    }
  }
}

/**
 * Helper function to generate localized simulated street addresses depending on coordinates
 */
function getMockAddressDetails(lat: number, lng: number): { area1: string; area2: string; area3: string; area4: string } {
  // Mumbai
  if (Math.abs(lat - 19.06) < 0.2) {
    return {
      area1: 'Carter Road, Bandra West, Mumbai',
      area2: 'Linking Road, Bandra West, Mumbai',
      area3: 'Pali Hill, Bandra West, Mumbai',
      area4: 'Juhu Tara Road, Bandra, Mumbai'
    };
  }
  // New Delhi
  if (Math.abs(lat - 28.63) < 0.2) {
    return {
      area1: 'Outer Circle, Connaught Place, New Delhi',
      area2: 'Inner Circle, Connaught Place, New Delhi',
      area3: 'Khan Market, New Delhi',
      area4: 'GK 2, M-Block Market, New Delhi'
    };
  }
  // Hyderabad
  if (Math.abs(lat - 17.44) < 0.2) {
    return {
      area1: 'DLF Cybercity Road, Gachibowli, Hyderabad',
      area2: 'Hitech City Road, Gachibowli, Hyderabad',
      area3: 'Road No. 36, Jubilee Hills, Hyderabad',
      area4: 'Kondapur Main Road, Hyderabad'
    };
  }
  // Pune
  if (Math.abs(lat - 18.53) < 0.2) {
    return {
      area1: 'North Main Road, Koregaon Park, Pune',
      area2: 'Lane 7, Koregaon Park, Pune',
      area3: 'Kalyani Nagar Main Road, Pune',
      area4: 'Viman Nagar Jogger\'s Park Rd, Pune'
    };
  }
  // Default: Bengaluru
  return {
    area1: '12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru',
    area2: 'Double Road, Indiranagar, Bengaluru',
    area3: '1st Stage, Domlur, Bengaluru',
    area4: 'Jayanagar 4th Block, Bengaluru'
  };
}

/**
 * Live free Open Food Facts API implementation of QuickCommerceProvider.
 */
export class OpenFoodFactsQuickCommerceProvider implements QuickCommerceProvider {
  async searchProducts(query: string, lat: number, lng: number, category?: string): Promise<QCProduct[]> {
    try {
      // Clean query of weights (100g, 400g, 330ml), pack constraints (pack of 3), and parentheticals
      let cleaned = query
        .replace(/\s*\([^)]*\)/g, '')
        .replace(/\s*\b\d+\s*(g|ml|kg|l)\b/gi, '')
        .replace(/\s*\bpack\s*of\s*\d+\b/gi, '')
        .replace(/[^a-zA-Z0-9\s]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const searchQuery = cleaned.length > 2 ? cleaned : query;
      console.log(`OpenFoodFactsQCProvider: searching products for cleaned query: "${searchQuery}" (original: "${query}")`);
      
      const searchTerms = encodeURIComponent(searchQuery);
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerms}&search_simple=1&action=process&json=1&page_size=8`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AnaySwapApp/1.0 (contact@anayswap.in)'
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`Open Food Facts API error: ${response.status}`);
      }
      
      const data = await response.json();
      const products = data.products || [];
      
      if (products.length === 0) {
        if (category) {
          const catUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(category)}&search_simple=1&action=process&json=1&page_size=5`;
          const catRes = await fetch(catUrl, {
            headers: { 'User-Agent': 'AnaySwapApp/1.0 (contact@anayswap.in)' },
            signal: AbortSignal.timeout(4000)
          });
          if (catRes.ok) {
            const catData = await catRes.json();
            if (catData.products && catData.products.length > 0) {
              return this.mapProducts(catData.products);
            }
          }
        }
        return [];
      }
      
      return this.mapProducts(products);
    } catch (e) {
      console.error('Open Food Facts search failed:', e);
      return [];
    }
  }

  private mapProducts(products: any[]): QCProduct[] {
    return products.map((p: any, idx: number) => {
      const nutriments = p.nutriments || {};
      const calories = Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 120);
      const protein = parseFloat(nutriments.proteins_100g || nutriments.proteins || 0) || 2.5;
      const fiber = parseFloat(nutriments.fiber_100g || nutriments.fiber || 0) || 1.5;
      const fat = parseFloat(nutriments.fat_100g || nutriments.fat || 0) || 3.0;
      const sugar = parseFloat(nutriments.sugars_100g || nutriments.sugars || 0) || 0.5;
      const sodium = Math.round(parseFloat(nutriments.sodium_100g || nutriments.sodium || 0) * 1000) || 150;

      const platforms: ('blinkit' | 'zepto' | 'instamart')[] = ['zepto', 'blinkit', 'instamart'];
      const platform = platforms[idx % platforms.length];
      const name = p.product_name || p.product_name_en || 'Healthy Swap Option';

      let brand = p.brands || 'Natural Brand';
      if (brand.includes(',')) {
        brand = brand.split(',')[0].trim();
      }

      let deepLink = `https://blinkit.com/s/?q=${encodeURIComponent(name)}`;
      if (platform === 'zepto') {
        deepLink = `https://www.zeptonow.com/search?q=${encodeURIComponent(name)}`;
      } else if (platform === 'instamart') {
        deepLink = `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(name)}`;
      }

      return {
        id: p.code || `off-${idx}`,
        name: name,
        brand: brand,
        price: p.price || (100 + (idx * 25) % 150),
        calories: calories,
        protein: parseFloat(protein.toFixed(1)),
        fiber: parseFloat(fiber.toFixed(1)),
        image_url: p.image_front_small_url || p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150',
        platform: platform,
        deep_link: deepLink,
        available: true,
        tags: p.categories_tags || []
      };
    });
  }
}

/**
 * Mock implementation of QuickCommerceProvider.
 * Returns relevant healthy packaged goods depending on the search query.
 */
export class MockQuickCommerceProvider implements QuickCommerceProvider {
  async searchProducts(query: string, lat: number, lng: number, category?: string): Promise<QCProduct[]> {
    console.log(`MockQCProvider: searching products for "${query}" near ${lat}, ${lng} (category: ${category})`);
    
    // Expanded mock database of quick commerce healthy products with explicit tags
    const mockProducts: QCProduct[] = [
      {
        id: 'qc-1',
        name: 'Foxtail Millet Noodles (Pack of 3)',
        brand: 'Slurrp Farm',
        price: 180,
        calories: 290,
        protein: 11.5,
        fiber: 8.0,
        image_url: 'https://images.unsplash.com/photo-1612966608967-302fc5ad8903?w=150',
        platform: 'blinkit',
        deep_link: 'https://blinkit.com/s/?q=slurrp+farm+millet+noodles',
        available: true,
        tags: ['noodle', 'noodles', 'maggi', 'breakfast', 'fastfood']
      },
      {
        id: 'qc-2',
        name: 'Roasted Mint Makhana 100g',
        brand: 'Farmley',
        price: 120,
        calories: 95,
        protein: 3.0,
        fiber: 2.5,
        image_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=150',
        platform: 'zepto',
        deep_link: 'https://www.zeptonow.com/search?q=roasted+makhana',
        available: true,
        tags: ['makhana', 'samosa', 'snack', 'chips', 'snacks']
      },
      {
        id: 'qc-3',
        name: 'Organic Lemon Ginger Kombucha 330ml',
        brand: 'Toyo Kombucha',
        price: 99,
        calories: 30,
        image_url: 'https://images.unsplash.com/photo-1598122837318-7555765959ef?w=150',
        platform: 'instamart',
        deep_link: 'https://www.swiggy.com/instamart/search?query=kombucha',
        available: true,
        tags: ['kombucha', 'coke', 'cola', 'soda', 'drink', 'beverage', 'carbonated', 'water', 'coconut', 'tea', 'chai', 'drinks']
      },
      {
        id: 'qc-4',
        name: 'Whole Wheat Sourdough Bread 400g',
        brand: 'The Baker\'s Dozen',
        price: 85,
        calories: 210,
        protein: 8.0,
        fiber: 4.5,
        image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=150',
        platform: 'zepto',
        deep_link: 'https://www.zeptonow.com/search?q=sourdough+bread',
        available: true,
        tags: ['sourdough', 'bread', 'ragi', 'wheat', 'breakfast']
      },
      {
        id: 'qc-5',
        name: 'Steamed Wheat Veg Momos (Pack of 10)',
        brand: 'Prasuma',
        price: 150,
        calories: 180,
        protein: 6.0,
        fiber: 3.5,
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=150',
        platform: 'blinkit',
        deep_link: 'https://blinkit.com/s/?q=prasuma+steamed+momos',
        available: true,
        tags: ['momo', 'momos', 'dumpling', 'dumplings', 'fastfood']
      },
      {
        id: 'qc-6',
        name: 'Cabbage Dumplings (Ready to Steam)',
        brand: 'Sumo Momo',
        price: 140,
        calories: 160,
        protein: 5.5,
        fiber: 4.0,
        image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=150',
        platform: 'zepto',
        deep_link: 'https://www.zeptonow.com/search?q=steamed+momos',
        available: true,
        tags: ['momo', 'momos', 'dumpling', 'dumplings', 'fastfood']
      },
      {
        id: 'qc-7',
        name: 'Cauliflower Pizza Crusts (Pack of 2)',
        brand: 'FitFood',
        price: 220,
        calories: 120,
        protein: 8.0,
        fiber: 6.0,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150',
        platform: 'instamart',
        deep_link: 'https://www.swiggy.com/instamart/search?query=cauliflower+pizza+crust',
        available: true,
        tags: ['pizza', 'crust', 'fastfood']
      },
      {
        id: 'qc-8',
        name: 'Proso Millet Date Bites 120g',
        brand: 'Yoga Bar',
        price: 160,
        calories: 190,
        protein: 4.5,
        fiber: 5.5,
        image_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=150',
        platform: 'blinkit',
        deep_link: 'https://blinkit.com/s/?q=yogabar+date+bites',
        available: true,
        tags: ['sweet', 'jalebi', 'jamun', 'bites', 'dessert', 'chocolate', 'desserts', 'snacks']
      },
      {
        id: 'qc-9',
        name: 'High-Fiber Oats Pav (Pack of 4)',
        brand: 'Bonn',
        price: 45,
        calories: 110,
        fiber: 3.8,
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150',
        platform: 'instamart',
        deep_link: 'https://www.swiggy.com/instamart/search?query=oats+pav',
        available: true,
        tags: ['pav', 'roti', 'chole', 'bhaji', 'breakfast']
      },
      {
        id: 'qc-10',
        name: 'Ginger Cardamom Green Tea 25 bags',
        brand: 'Organic India',
        price: 175,
        calories: 5,
        image_url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=150',
        platform: 'blinkit',
        deep_link: 'https://blinkit.com/s/?q=organic+india+green+tea',
        available: true,
        tags: ['tea', 'green tea', 'drink', 'beverage', 'chai', 'coke', 'cola', 'soda', 'water', 'coconut', 'drinks']
      },
      {
        id: 'qc-11',
        name: 'Lean Chicken Breast Burger Patties',
        brand: 'Meatzza',
        price: 260,
        calories: 160,
        protein: 24.0,
        image_url: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=150',
        platform: 'zepto',
        deep_link: 'https://www.zeptonow.com/search?q=chicken+burger+patty',
        available: true,
        tags: ['burger', 'chicken', 'patty', 'patties', 'fastfood']
      },
      {
        id: 'qc-12',
        name: 'Fresh Tender Coconut Water 200ml',
        brand: 'Raw Pressery',
        price: 80,
        calories: 40,
        protein: 0.5,
        image_url: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=150',
        platform: 'instamart',
        deep_link: 'https://www.swiggy.com/instamart/search?query=coconut+water',
        available: true,
        tags: ['coconut', 'water', 'drink', 'beverage', 'coke', 'cola', 'soda', 'kombucha', 'tea', 'drinks']
      },
      {
        id: 'qc-13',
        name: 'Mango Chia Seed Pudding 150g',
        brand: 'Epigamia',
        price: 80,
        calories: 130,
        protein: 4.0,
        fiber: 7.0,
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150',
        platform: 'zepto',
        deep_link: 'https://www.zeptonow.com/search?q=epigamia+chia+pudding',
        available: true,
        tags: ['mango', 'chia', 'pudding', 'seed', 'seeds', 'dessert', 'sweet', 'icecream', 'ice cream', 'desserts']
      },
      {
        id: 'qc-14',
        name: 'Raspberry Banana Frozen Sorbet 200ml',
        brand: 'The Brooklyn Creamery',
        price: 150,
        calories: 95,
        protein: 1.5,
        fiber: 4.2,
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=150',
        platform: 'blinkit',
        deep_link: 'https://blinkit.com/s/?q=brooklyn+creamery+sorbet',
        available: true,
        tags: ['raspberry', 'banana', 'sorbet', 'icecream', 'ice cream', 'dessert', 'sweet', 'desserts']
      },
      {
        id: 'qc-15',
        name: 'Low Fat Fresh Paneer 200g',
        brand: 'Amul',
        price: 90,
        calories: 180,
        protein: 18.0,
        fiber: 0.0,
        image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=150',
        platform: 'blinkit',
        deep_link: 'https://blinkit.com/s/?q=low+fat+paneer',
        available: true,
        tags: ['paneer', 'tikka', 'tandoori', 'grilled', 'cottage', 'cheese', 'fastfood']
      },
      {
        id: 'qc-16',
        name: 'Ready to Cook Tandoori Paneer Tikka 250g',
        brand: 'Mother Dairy',
        price: 180,
        calories: 220,
        protein: 16.0,
        fiber: 1.5,
        image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=150',
        platform: 'zepto',
        deep_link: 'https://www.zeptonow.com/search?q=paneer+tikka',
        available: true,
        tags: ['paneer', 'tikka', 'tandoori', 'grilled', 'fastfood']
      }
    ];

    // Clean and split query into tokens
    const lowerQuery = query.toLowerCase();
    const queryTokens = lowerQuery.split(/[^a-zA-Z0-9]+/).filter(token => token.length > 2);

    const filtered = mockProducts.filter(p => {
      // 1. Direct name/brand match
      if (p.name.toLowerCase().includes(lowerQuery) || p.brand.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 2. Token overlap with product tags
      if (p.tags && p.tags.some(tag => queryTokens.includes(tag))) {
        return true;
      }

      return false;
    });

    if (filtered.length > 0) {
      return filtered;
    }

    // Fallback: Filter by category tag (e.g. 'snacks', 'drinks', 'desserts', 'fastfood', 'breakfast')
    if (category) {
      const cleanCategory = category.toLowerCase().trim();
      const categoryFiltered = mockProducts.filter(p => 
        p.tags && p.tags.some(tag => tag === cleanCategory)
      );
      if (categoryFiltered.length > 0) {
        return categoryFiltered;
      }
    }

    return mockProducts.slice(0, 2);
  }
}

/**
 * Mock implementation of RestaurantProvider.
 * Simulates finding healthy restaurants in Indian tech hubs (like Bengaluru or Mumbai).
 */
export class MockRestaurantProvider implements RestaurantProvider {
  async searchRestaurants(lat: number, lng: number, tags: string[]): Promise<Restaurant[]> {
    console.log(`MockRestaurantProvider: searching restaurants near ${lat}, ${lng} with tags:`, tags);

    const addr = getMockAddressDetails(lat, lng);

    const mockRestaurants: Restaurant[] = [
      {
        id: 'rest-1',
        name: 'The Salad Bar & Co.',
        rating: 4.5,
        cuisine_tags: ['Salads', 'Healthy Food', 'Keto'],
        lat: lat + 0.005,
        lng: lng - 0.003,
        distance_text: '0.8 km',
        health_score: 92,
        zomato_link: `https://www.zomato.com/search?q=${encodeURIComponent('The Salad Bar & Co')}`,
        swiggy_link: `https://www.swiggy.com/search?query=${encodeURIComponent('The Salad Bar & Co')}`,
        address: addr.area1,
      },
      {
        id: 'rest-2',
        name: 'EatFit',
        rating: 4.2,
        cuisine_tags: ['North Indian', 'Healthy Food', 'Low Calorie'],
        lat: lat - 0.002,
        lng: lng + 0.004,
        distance_text: '1.4 km',
        health_score: 85,
        zomato_link: `https://www.zomato.com/search?q=${encodeURIComponent('EatFit')}`,
        swiggy_link: `https://www.swiggy.com/search?query=${encodeURIComponent('EatFit')}`,
        address: addr.area2,
      },
      {
        id: 'rest-3',
        name: 'Sante Spa Cuisine',
        rating: 4.6,
        cuisine_tags: ['Organic', 'Vegan', 'Mediterranean'],
        lat: lat + 0.008,
        lng: lng + 0.001,
        distance_text: '2.1 km',
        health_score: 95,
        zomato_link: `https://www.zomato.com/search?q=${encodeURIComponent('Sante Spa Cuisine')}`,
        swiggy_link: `https://www.swiggy.com/search?query=${encodeURIComponent('Sante Spa Cuisine')}`,
        address: addr.area3,
      },
      {
        id: 'rest-4',
        name: 'Pure & Sure Organic Cafe',
        rating: 4.3,
        cuisine_tags: ['Organic', 'South Indian', 'Millet Specials'],
        lat: lat - 0.004,
        lng: lng - 0.006,
        distance_text: '1.9 km',
        health_score: 89,
        zomato_link: `https://www.zomato.com/search?q=${encodeURIComponent('Pure & Sure Organic Cafe')}`,
        swiggy_link: `https://www.swiggy.com/search?query=${encodeURIComponent('Pure & Sure Organic Cafe')}`,
        address: addr.area4,
      }
    ];

    // Filter by tags if specified
    if (tags && tags.length > 0) {
      const filtered = mockRestaurants.filter(r =>
        r.cuisine_tags.some(tag => tags.includes(tag))
      );
      if (filtered.length > 0) return filtered;
    }

    return mockRestaurants;
  }
}
