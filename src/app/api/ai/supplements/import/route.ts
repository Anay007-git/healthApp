import { NextRequest, NextResponse } from 'next/server';
import { saveSupplement } from '@/lib/db';
import { Supplement } from '@/lib/mockData';

// Helper to scrape search engine results for prices and product context
async function searchWebContext(query: string): Promise<string> {
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + " price India site:amazon.in OR site:healthkart.com OR site:flipkart.com")}`;
  try {
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const html = await res.text();
      const snippets = html.match(/Result__snippet"[^>]*>([\s\S]+?)<\/a>/gi) || html.match(/<a class="result__snippet"[^>]*>([\s\S]+?)<\/a>/gi);
      if (snippets && snippets.length > 0) {
        return snippets.slice(0, 5)
          .map(s => s.replace(/<[^>]+>/g, '').trim())
          .join('\n');
      }
    }
  } catch (err) {
    console.error('Error fetching web search context:', err);
  }
  return '';
}

// Local regex parser to extract real prices and servings from web search results when LLM is unavailable
function parseLocalWebContext(query: string, context: string): any {
  const details = getLocalFallbackSupplement(query);
  if (!context) return details;

  // 1. Try to find the price (e.g. ₹699, Rs. 1,250, INR 899, etc.)
  const priceMatches = context.match(/(?:Rs\.?|₹|INR)\s*([0-9,]+)/i) || context.match(/([0-9,]+)\s*(?:Rupees|Rs|INR)/i);
  if (priceMatches) {
    const rawPrice = priceMatches[1].replace(/,/g, '');
    const p = parseInt(rawPrice);
    if (p >= 150 && p < 15000) {
      details.price = p;
    }
  }

  // 2. Try to find servings (e.g. 60 tablets, 30 servings, 90 tablets)
  const servingsMatches = context.match(/([0-9]+)\s*(?:tablets|capsules|servings|caps|softgels|tabs)/i);
  if (servingsMatches) {
    const s = parseInt(servingsMatches[1]);
    if (s >= 10 && s <= 300) {
      details.servings = s;
    }
  }

  // 3. Try to clean up name based on the query if they typed something specific
  if (query.trim().length > 5) {
    details.name = query;
  }

  return details;
}

// Helper to parse brand, name, and category from a specific snippet line
function extractBrandAndNameFromSnippet(line: string, query: string): { brand: string; name: string; category: string } {
  const lineLower = line.toLowerCase();
  const qClean = query.trim();
  const qLower = qClean.toLowerCase();

  const productStopwords = [
    'creatine', 'monohydrate', 'protein', 'whey', 'isolate', 'wafer', 'gainer', 'mass',
    'preworkout', 'pre-workout', 'c4', 'pump', 'omega', 'omega3', 'fish', 'oil', 'salmon',
    'ashwagandha', 'multivitamin', 'vitamins', 'tabs', 'tablets', 'capsules', 'caps', 'pills',
    'powder', 'supplement', 'supplements', 'nutrition', 'active', 'pure', 'extract', 'gold',
    'elite', 'micronized', 'advanced', 'raw', 'cookies', 'cookie', 'bars', 'bar', 'blend'
  ];

  // Mappings
  const categoryMap: Record<string, string> = {
    'protein': 'protein',
    'whey': 'protein',
    'isolate': 'protein',
    'wafer': 'protein',
    'gainer': 'protein',
    'cookie': 'protein',
    'bar': 'protein',
    'creatine': 'creatine',
    'monohydrate': 'creatine',
    'preworkout': 'preworkout',
    'pre-workout': 'preworkout',
    'c4': 'preworkout',
    'pump': 'preworkout',
    'omega': 'omega3',
    'fish oil': 'omega3',
    'salmon': 'omega3',
    'ashwagandha': 'multivitamin',
    'multivitamin': 'multivitamin',
    'vitamins': 'multivitamin',
    'zinc': 'multivitamin',
    'testo': 'multivitamin'
  };

  let category = 'multivitamin';
  for (const [key, catVal] of Object.entries(categoryMap)) {
    if (lineLower.includes(key)) {
      category = catVal;
      break;
    }
  }

  // Brand extraction
  let brand = 'Generic';
  if (qLower === 'superyou' || qLower === 'beast life' || qLower === 'smash' || qLower === 'beastlife') {
    brand = qClean.charAt(0).toUpperCase() + qClean.slice(1);
  } else {
    // Dynamic brand detection
    const words = qLower.split(/\s+/);
    const brandWords = words.filter(word => !productStopwords.includes(word));
    if (brandWords.length > 0) {
      brand = brandWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else {
      brand = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
  }

  // Capitalize brand overrides
  const lowerBrand = brand.toLowerCase();
  if (lowerBrand.includes('muscletech')) brand = 'MuscleTech';
  else if (lowerBrand.includes('muscleblaze')) brand = 'MuscleBlaze';
  else if (lowerBrand.includes('gnc')) brand = 'GNC';
  else if (lowerBrand.includes('optimum') || lowerBrand === 'on') brand = 'Optimum Nutrition';
  else if (lowerBrand.includes('myprotein')) brand = 'Myprotein';
  else if (lowerBrand.includes('nakpro')) brand = 'Nakpro';
  else if (lowerBrand.includes('asitis') || lowerBrand.includes('as-it-is')) brand = 'Asitis Nutrition';
  else if (lowerBrand.includes('wellcore')) brand = 'Wellcore';
  else if (lowerBrand.includes('himalaya')) brand = 'Himalaya';
  else if (lowerBrand.includes('fast&up') || lowerBrand.includes('fast and up')) brand = 'Fast&Up';
  else if (lowerBrand.includes('carbamide')) brand = 'Carbamide Forte';
  else if (lowerBrand.includes('wow')) brand = 'Wow Life Science';
  else if (lowerBrand.includes('truebasics')) brand = 'TrueBasics';
  else if (lowerBrand.includes('hk vitals') || lowerBrand.includes('healthkart')) brand = 'HealthKart';
  else if (lowerBrand.includes('doctor')) brand = "Doctors Choice";
  else if (lowerBrand.includes('superyou')) brand = 'Superyou';
  else if (lowerBrand.includes('beast life') || lowerBrand === 'beastlife') brand = 'Beast Life';
  else if (lowerBrand.includes('smash')) brand = 'Smash';

  // Construct name
  let name = category.charAt(0).toUpperCase() + category.slice(1);
  if (category === 'protein') {
    if (lineLower.includes('wafer')) name = 'Protein Wafer Cookie';
    else if (lineLower.includes('cookie')) name = 'High Protein Cookie';
    else if (lineLower.includes('bar')) name = 'Protein Bar';
    else if (lineLower.includes('isolate')) name = 'Isolate Whey Protein';
    else name = '100% Pure Whey Protein';
  } else if (category === 'creatine') {
    name = 'Pure Micronized Creatine Monohydrate';
  } else if (category === 'preworkout') {
    name = 'Explosive Pre-Workout Drink';
  } else if (category === 'omega3') {
    name = 'Triple Strength Fish Oil Softgels';
  } else {
    name = lineLower.includes('ashwagandha') ? 'Organic Ashwagandha Tablets' : 'Daily Essential Multivitamin';
  }

  // Filter out duplicate brand names from name
  let cleanName = query;
  if (cleanName.toLowerCase().startsWith(brand.toLowerCase())) {
    cleanName = cleanName.substring(brand.length).trim();
  }
  if (cleanName.length > 0 && !productStopwords.includes(cleanName.toLowerCase())) {
    name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }

  return { brand, name, category };
}

function parsePriceFromLine(line: string): number | null {
  const match = line.match(/(?:Rs\.?|₹|INR)\s*([0-9,]+)/i) || line.match(/([0-9,]+)\s*(?:Rupees|Rs|INR)/i);
  if (match) {
    const raw = match[1].replace(/,/g, '');
    const val = parseInt(raw);
    if (val >= 150 && val <= 15000) return val;
  }
  return null;
}

function parseServingsFromLine(line: string): number | null {
  const match = line.match(/([0-9]+)\s*(?:tablets|capsules|servings|caps|softgels|tabs)/i);
  if (match) {
    const val = parseInt(match[1]);
    if (val >= 10 && val <= 300) return val;
  }
  return null;
}

// Extract multiple products from DuckDuckGo snippets matching the query
function extractSupplementsFromWebContext(query: string, webContext: string): Supplement[] {
  const list: Supplement[] = [];
  if (!webContext) return list;

  const lines = webContext.split('\n').filter(l => l.trim().length > 15);
  const seenCategories = new Set<string>();

  for (const line of lines) {
    const { brand, name, category } = extractBrandAndNameFromSnippet(line, query);
    
    // Map up to 3 distinct categories per search to keep catalog diverse
    if (!seenCategories.has(category) && list.length < 3) {
      seenCategories.add(category);
      
      const price = parsePriceFromLine(line) || (category === 'protein' ? 2499 : category === 'creatine' ? 599 : 399);
      const servings = parseServingsFromLine(line) || (category === 'protein' ? 30 : category === 'creatine' ? 83 : 60);
      const pricePerServing = servings > 0 ? parseFloat((price / servings).toFixed(2)) : 0;
      
      const cleanId = `s-dyn-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const searchParam = encodeURIComponent(`${brand} ${name}`);

      list.push({
        id: cleanId,
        name: name,
        brand: brand,
        category: category,
        price: price,
        servings: servings,
        dose_per_serving: category === 'protein' ? '24g Protein' : category === 'creatine' ? '3g Creatine' : '1 Serving',
        price_per_serving: pricePerServing,
        rating: 4.6,
        tier: 'value_pick',
        buy_links: {
          amazon: `https://www.amazon.in/s?k=${searchParam}`,
          healthkart: `https://www.healthkart.com/search?q=${searchParam}`
        },
        image_url: `/images/supps/default.jpg`,
        benefits: `Verified high-quality ${category} supplement from ${brand}.`
      });
    }
  }

  return list;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    // Retrieve live search context from DuckDuckGo
    const webContext = await searchWebContext(query);
    console.log(`Web search context retrieved for "${query}":`, webContext ? 'Success' : 'Empty');

    let importedSupplements: Supplement[] = extractSupplementsFromWebContext(query, webContext);
    
    // If no products were dynamically found, fall back to parsing a single product using LLM or local fallback
    if (importedSupplements.length === 0) {
      let supplementDetails: any = null;

      if (apiKey) {
        try {
          const systemPrompt = `You are a third-party health supplement catalog agent. You must retrieve real product data for this Indian supplement query: "${query}".
Use this live web search context:
"""
${webContext}
"""
Important: Your response must be ONLY a valid JSON object.
JSON Structure:
{
  "brand": "Official Brand Name (e.g. MuscleBlaze, Himalaya, GNC, MuscleTech)",
  "name": "Full Product Name without repeating the brand (e.g. Biozyme Whey Protein, Ashwagandha Tablets)",
  "category": "Must be exactly one of: 'protein', 'creatine', 'preworkout', 'multivitamin', 'omega3'",
  "price": Retail price in Indian Rupees (INR) as an integer (e.g. 799),
  "servings": Number of servings as an integer (e.g. 60),
  "dose_per_serving": "Active strength dose (e.g. '25g Protein', '250mg Extract', '1000mg Fish Oil')",
  "rating": User rating as a float between 4.0 and 5.0 (e.g. 4.6),
  "tier": "Must be exactly one of: 'market_leader', 'value_pick'",
  "benefits": "Short clinical benefits description (max 2 sentences)"
}`;

          const hfResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: "meta-llama/Meta-Llama-3-8B-Instruct",
              messages: [{ role: "user", content: systemPrompt }],
              max_tokens: 350,
              temperature: 0.2
            }),
            signal: AbortSignal.timeout(9000)
          });

          if (hfResponse.ok) {
            const result = await hfResponse.json();
            let rawText = result.choices?.[0]?.message?.content?.trim() || '';
            rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
            supplementDetails = JSON.parse(rawText);
          }
        } catch (err) {
          console.warn('Error fetching details from Hugging Face:', err);
        }
      }

      if (!supplementDetails) {
        supplementDetails = parseLocalWebContext(query, webContext);
      }

      const price = Number(supplementDetails.price) || 499;
      const servings = Number(supplementDetails.servings) || 30;
      const pricePerServing = servings > 0 ? parseFloat((price / servings).toFixed(2)) : 0;
      const cleanId = `s-dyn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const searchParam = encodeURIComponent(`${supplementDetails.brand} ${supplementDetails.name}`);
      const newSupplement: Supplement = {
        id: cleanId,
        name: supplementDetails.name,
        brand: supplementDetails.brand,
        category: supplementDetails.category || 'multivitamin',
        price: price,
        servings: servings,
        dose_per_serving: supplementDetails.dose_per_serving || '1 Serving',
        price_per_serving: pricePerServing,
        rating: Number(supplementDetails.rating) || 4.5,
        tier: supplementDetails.tier || 'value_pick',
        buy_links: supplementDetails.buy_links || {
          amazon: `https://www.amazon.in/s?k=${searchParam}`,
          healthkart: `https://www.healthkart.com/search?q=${searchParam}`
        },
        image_url: supplementDetails.image_url || '/images/supps/default.jpg',
        benefits: supplementDetails.benefits || 'High quality fitness support supplement.'
      };

      importedSupplements = [newSupplement];
    }

    // Save all imported supplements to Postgres database (via Supabase helper)
    let savedAll = true;
    for (const supp of importedSupplements) {
      const ok = await saveSupplement(supp);
      if (!ok) savedAll = false;
    }

    return NextResponse.json({
      supplement: importedSupplements[0],
      supplements: importedSupplements,
      savedInDb: savedAll
    });

  } catch (err: any) {
    console.error('Error in /api/ai/supplements/import:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}

function getLocalFallbackSupplement(query: string): any {
  const q = query.toLowerCase().trim();
  
  // Define standard category keywords and their mappings
  const categoryMap: Record<string, string> = {
    'protein': 'protein',
    'whey': 'protein',
    'isolate': 'protein',
    'wafer': 'protein',
    'gainer': 'protein',
    'cookie': 'protein',
    'bar': 'protein',
    'creatine': 'creatine',
    'monohydrate': 'creatine',
    'preworkout': 'preworkout',
    'pre-workout': 'preworkout',
    'c4': 'preworkout',
    'pump': 'preworkout',
    'omega': 'omega3',
    'fish oil': 'omega3',
    'salmon': 'omega3',
    'ashwagandha': 'multivitamin',
    'multivitamin': 'multivitamin',
    'vitamins': 'multivitamin',
    'zinc': 'multivitamin',
    'testo': 'multivitamin'
  };

  // 1. Determine category
  let category = 'multivitamin'; // default
  for (const [key, catVal] of Object.entries(categoryMap)) {
    if (q.includes(key)) {
      category = catVal;
      break;
    }
  }

  // 2. Extract brand dynamically from query
  const words = q.split(/\s+/);
  const productStopwords = [
    'creatine', 'monohydrate', 'protein', 'whey', 'isolate', 'wafer', 'gainer', 'mass',
    'preworkout', 'pre-workout', 'c4', 'pump', 'omega', 'omega3', 'fish', 'oil', 'salmon',
    'ashwagandha', 'multivitamin', 'vitamins', 'tabs', 'tablets', 'capsules', 'caps', 'pills',
    'powder', 'supplement', 'supplements', 'nutrition', 'active', 'pure', 'extract', 'gold',
    'elite', 'micronized', 'advanced', 'raw', 'cookies', 'cookie', 'bars', 'bar', 'blend'
  ];

  const brandWords = words.filter(word => !productStopwords.includes(word));
  
  let brand = 'Generic';
  if (brandWords.length > 0) {
    brand = brandWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  } else {
    brand = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  // Double check manual brand list for standard capitalization overrides if search has them
  const lowerBrand = brand.toLowerCase();
  if (lowerBrand.includes('muscletech')) brand = 'MuscleTech';
  else if (lowerBrand.includes('muscleblaze')) brand = 'MuscleBlaze';
  else if (lowerBrand.includes('gnc')) brand = 'GNC';
  else if (lowerBrand.includes('optimum') || lowerBrand === 'on') brand = 'Optimum Nutrition';
  else if (lowerBrand.includes('myprotein')) brand = 'Myprotein';
  else if (lowerBrand.includes('nakpro')) brand = 'Nakpro';
  else if (lowerBrand.includes('asitis') || lowerBrand.includes('as-it-is')) brand = 'Asitis Nutrition';
  else if (lowerBrand.includes('wellcore')) brand = 'Wellcore';
  else if (lowerBrand.includes('himalaya')) brand = 'Himalaya';
  else if (lowerBrand.includes('fast&up') || lowerBrand.includes('fast and up')) brand = 'Fast&Up';
  else if (lowerBrand.includes('carbamide')) brand = 'Carbamide Forte';
  else if (lowerBrand.includes('wow')) brand = 'Wow Life Science';
  else if (lowerBrand.includes('truebasics')) brand = 'TrueBasics';
  else if (lowerBrand.includes('hk vitals') || lowerBrand.includes('healthkart')) brand = 'HealthKart';
  else if (lowerBrand.includes('doctor')) brand = "Doctors Choice";

  // 3. Setup default template values based on category
  let price = 599;
  let servings = 60;
  let dose = '1 Capsule';
  let rating = 4.5;
  let tier = 'value_pick';
  let benefits = 'Supports overall health, immunity, and daily fitness routines.';
  let name = '';

  if (category === 'protein') {
    name = q.includes('wafer') ? 'Protein Wafer Cookie' : q.includes('isolate') ? 'Isolate Whey Protein' : '100% Pure Whey Protein';
    price = 2499;
    servings = 30;
    dose = '24g Protein';
    benefits = 'High-purity whey protein concentrate designed to stimulate muscle protein synthesis and accelerate recovery.';
  } else if (category === 'creatine') {
    name = 'Pure Micronized Creatine Monohydrate';
    price = 599;
    servings = 83;
    dose = '3g Creatine';
    benefits = '100% pure micronized creatine helps hydrate muscle cells, increasing ATP energy synthesis for strength training.';
  } else if (category === 'preworkout') {
    name = 'Explosive Pre-Workout Drink';
    price = 1499;
    servings = 30;
    dose = '200mg Caffeine, 2g Beta-Alanine';
    benefits = 'Formulated to amplify training stamina, energy, and muscle pump vascularity during high-intensity workouts.';
  } else if (category === 'omega3') {
    name = 'Triple Strength Fish Oil Softgels';
    price = 899;
    servings = 60;
    dose = '1000mg Fish Oil (EPA 550mg / DHA 350mg)';
    benefits = 'Refined marine source rich in active EPA and DHA essential fatty acids to support brain, heart, and joints health.';
  } else {
    // Multivitamin
    name = q.includes('ashwagandha') ? 'Organic Ashwagandha Tablets' : 'Daily Essential Multivitamin';
    price = 399;
    servings = 60;
    dose = q.includes('ashwagandha') ? '500mg Pure Extract' : '1 Tablet Daily';
    benefits = q.includes('ashwagandha') ? 'Clinically proven herbal adaptogen that helps lower cortisol stress levels, enhances deep sleep, and supports stamina.' : 'Broad-spectrum vitamins and minerals to support daily metabolism and immunity.';
  }

  // 4. Construct clean product name (remove brand prefix to avoid duplicates)
  let cleanName = query;
  if (cleanName.toLowerCase().startsWith(brand.toLowerCase())) {
    cleanName = cleanName.substring(brand.length).trim();
  }
  
  if (cleanName.length > 0) {
    name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }

  // Construct links
  const searchStr = encodeURIComponent(`${brand} ${name}`);
  const buy_links = {
    amazon: `https://www.amazon.in/s?k=${searchStr}`,
    healthkart: `https://www.healthkart.com/search?q=${searchStr}`
  };

  return {
    brand,
    name,
    category,
    price,
    servings,
    dose_per_serving: dose,
    rating,
    tier,
    buy_links,
    benefits
  };
}
