import { createClient } from '@supabase/supabase-js';
import {
  JunkItem,
  HealthyAlternative,
  mockJunkItems,
  mockHealthyAlternatives,
  mockAlternativeMappings,
  Gym,
  Supplement,
  mockGyms,
  mockSupplements
} from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isDbConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isDbConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

if (!isDbConfigured) {
  console.log('⚠️ Database credentials missing. Running with local mock database fallback.');
}

/**
 * Fetch all junk items available in the system
 */
export async function getJunkItems(): Promise<JunkItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('junk_items')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) return data as JunkItem[];
      console.warn('Error fetching junk items from database, falling back to mock:', error);
    } catch (e) {
      console.warn('Exception fetching junk items, falling back to mock:', e);
    }
  }
  return mockJunkItems;
}

/**
 * Fetch a specific junk item by its slug
 */
export async function getJunkItemBySlug(slug: string): Promise<JunkItem | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('junk_items')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) return data as JunkItem;
      console.warn(`Error fetching junk item for slug "${slug}", falling back to mock:`, error);
    } catch (e) {
      console.warn(`Exception fetching junk item for slug "${slug}", falling back to mock:`, e);
    }
  }
  const item = mockJunkItems.find((j) => j.slug === slug);
  return item || null;
}

/**
 * Fetch all healthy alternatives mapped to a specific junk item ID
 */
export async function getAlternativesForJunkItem(
  junkItemId: string
): Promise<(HealthyAlternative & { similarity_reason: string })[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('alternative_mappings')
        .select(`
          similarity_reason,
          healthy_alternatives (
            id, name, slug, category, calories, protein, fiber, fat, sugar, sodium, image_url, description
          )
        `)
        .eq('junk_item_id', junkItemId);
      
      if (!error && data) {
        // Map database result structure to flat structure
        const mapped = data.map((mapping: any) => {
          const alt = mapping.healthy_alternatives;
          return {
            id: alt.id,
            name: alt.name,
            slug: alt.slug,
            category: alt.category,
            calories: alt.calories,
            protein: alt.protein,
            fiber: alt.fiber,
            fat: alt.fat ?? 0,
            sugar: alt.sugar ?? 0,
            sodium: alt.sodium ?? 0,
            image_url: alt.image_url,
            description: alt.description,
            similarity_reason: mapping.similarity_reason
          };
        });
        return mapped;
      }
      console.warn(`Error fetching alternatives for junk item ID ${junkItemId}, falling back to mock:`, error);
    } catch (e) {
      console.warn(`Exception fetching alternatives for junk item ID ${junkItemId}, falling back to mock:`, e);
    }
  }

  // Fallback to local mock data
  const mappings = mockAlternativeMappings.filter((m) => m.junk_item_id === junkItemId);
  return mappings.map((m) => {
    const alt = mockHealthyAlternatives.find((h) => h.id === m.alternative_id);
    if (!alt) {
      throw new Error(`Healthy alternative ID ${m.alternative_id} not found in mock data.`);
    }
    return {
      ...alt,
      similarity_reason: m.similarity_reason
    };
  });
}

export interface CuisineTag {
  cuisine_type: string;
  health_score: number;
  category: string;
}

export const mockCuisineTags: CuisineTag[] = [
  { cuisine_type: 'Salads', health_score: 95, category: 'Green' },
  { cuisine_type: 'South Indian', health_score: 75, category: 'Balanced' },
  { cuisine_type: 'Juices', health_score: 85, category: 'Liquid Health' },
  { cuisine_type: 'Keto', health_score: 90, category: 'Low Carb' },
  { cuisine_type: 'Millet Specials', health_score: 90, category: 'Superfoods' },
  { cuisine_type: 'Vegan', health_score: 92, category: 'Plant Based' },
  { cuisine_type: 'Tandoori', health_score: 80, category: 'High Protein' },
  { cuisine_type: 'Continental', health_score: 70, category: 'Standard' },
  { cuisine_type: 'Healthy Food', health_score: 95, category: 'Superfoods' },
  { cuisine_type: 'Organic', health_score: 90, category: 'Clean Eating' },
  { cuisine_type: 'North Indian', health_score: 65, category: 'Balanced' },
  { cuisine_type: 'Mediterranean', health_score: 85, category: 'Heart Healthy' }
];

export async function getHealthyCuisineTags(): Promise<CuisineTag[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('healthy_cuisine_tags')
        .select('*');
      if (!error && data) return data as CuisineTag[];
      console.warn('Error fetching cuisine tags from DB, falling back to mock:', error);
    } catch (e) {
      console.warn('Exception fetching cuisine tags, falling back to mock:', e);
    }
  }
  return mockCuisineTags;
}

/**
 * Fetch all gyms available in the system
 */
export async function getGyms(): Promise<Gym[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .order('rating', { ascending: false });
      if (!error && data) return data as Gym[];
      console.warn('Error fetching gyms from database, falling back to mock:', error);
    } catch (e) {
      console.warn('Exception fetching gyms, falling back to mock:', e);
    }
  }
  return mockGyms;
}

/**
 * Fetch all supplements available in the system
 */
export async function getSupplements(category?: string): Promise<Supplement[]> {
  if (supabase) {
    try {
      let query = supabase.from('supplements').select('*');
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query.order('rating', { ascending: false });
      if (!error && data) return data as Supplement[];
      console.warn('Error fetching supplements from database, falling back to mock:', error);
    } catch (e) {
      console.warn('Exception fetching supplements, falling back to mock:', e);
    }
  }
  
  if (category && category !== 'all') {
    return mockSupplements.filter((s) => s.category === category);
  }
  return mockSupplements;
}

/**
 * Insert or upsert a supplement to the database
 */
export async function saveSupplement(supp: Supplement): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('supplements')
        .upsert({
          id: supp.id,
          name: supp.name,
          brand: supp.brand,
          category: supp.category,
          price: supp.price,
          servings: supp.servings,
          dose_per_serving: supp.dose_per_serving,
          price_per_serving: supp.price_per_serving,
          rating: supp.rating,
          tier: supp.tier,
          buy_links: supp.buy_links,
          image_url: supp.image_url,
          benefits: supp.benefits
        });
      if (!error) return true;
      console.warn('Error saving supplement to database:', error);
    } catch (e) {
      console.warn('Exception saving supplement to database:', e);
    }
  }
  return false;
}

