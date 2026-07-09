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

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    let supplementDetails: any = null;

    // Retrieve live search context from DuckDuckGo first!
    const webContext = await searchWebContext(query);
    console.log(`Web search context retrieved for "${query}":`, webContext ? 'Success' : 'Empty');

    if (apiKey) {
      try {
        const systemPrompt = `You are a third-party health supplement catalog agent. You must search your knowledge base and retrieve real product data for this Indian supplement query: "${query}".
Generate a structured JSON object representing this real supplement.
Use this live web search context to extract actual real-world prices, brand, servings, and specifications:
"""
${webContext}
"""

Important: Your response must be ONLY a valid JSON object. Do not include markdown codeblocks (do NOT start with \`\`\`json), no preamble, and no extra text.
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
          
          try {
            supplementDetails = JSON.parse(rawText);
          } catch (jsonErr) {
            console.warn('Failed parsing JSON payload from Hugging Face response:', rawText, jsonErr);
          }
        } else {
          console.warn(`Hugging Face API returned status ${hfResponse.status}`);
        }
      } catch (err) {
        console.warn('Error fetching details from Hugging Face, using fallback:', err);
      }
    }

    // Heuristic fallback using web context regex if Hugging Face is not configured or failed
    if (!supplementDetails) {
      supplementDetails = parseLocalWebContext(query, webContext);
    }

    // Ensure price_per_serving is calculated
    const price = Number(supplementDetails.price) || 499;
    const servings = Number(supplementDetails.servings) || 30;
    const pricePerServing = servings > 0 ? parseFloat((price / servings).toFixed(2)) : 0;

    // Create unique ID
    const cleanId = `s-dyn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Populate buy links if missing
    const searchParam = encodeURIComponent(`${supplementDetails.brand} ${supplementDetails.name}`);
    const buy_links = supplementDetails.buy_links || {
      amazon: `https://www.amazon.in/s?k=${searchParam}`,
      healthkart: `https://www.healthkart.com/search?q=${searchParam}`
    };

    let finalName = supplementDetails.name || query;
    const finalBrand = supplementDetails.brand || 'Generic';

    // Clean duplicate brand name prefix
    if (finalName.toLowerCase().startsWith(finalBrand.toLowerCase())) {
      finalName = finalName.substring(finalBrand.length).trim();
      if (finalName.length > 0) {
        finalName = finalName.charAt(0).toUpperCase() + finalName.slice(1);
      } else {
        finalName = supplementDetails.name || query;
      }
    }

    const newSupplement: Supplement = {
      id: cleanId,
      name: finalName,
      brand: finalBrand,
      category: supplementDetails.category || 'multivitamin',
      price: price,
      servings: servings,
      dose_per_serving: supplementDetails.dose_per_serving || '1 Serving',
      price_per_serving: pricePerServing,
      rating: Number(supplementDetails.rating) || 4.4,
      tier: supplementDetails.tier || 'value_pick',
      buy_links: buy_links,
      image_url: supplementDetails.image_url || '/images/supps/default.jpg',
      benefits: supplementDetails.benefits || 'High quality fitness support supplement.'
    };

    // Save to Postgres (via Supabase) if connected
    const savedInDb = await saveSupplement(newSupplement);

    return NextResponse.json({
      supplement: newSupplement,
      savedInDb: savedInDb
    });

  } catch (err: any) {
    console.error('Error in /api/ai/supplements/import:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}

function getLocalFallbackSupplement(query: string): any {
  const q = query.toLowerCase();
  
  // Default values
  let brand = 'Generic';
  let name = query;
  let category = 'multivitamin';
  let price = 599;
  let servings = 60;
  let dose = '1 Capsule';
  let rating = 4.4;
  let tier = 'value_pick';
  let benefits = 'Supports overall health, immunity, and daily fitness routines.';

  // Detect brand dynamically from query keywords
  if (q.includes('muscletech')) brand = 'MuscleTech';
  else if (q.includes('muscleblaze')) brand = 'MuscleBlaze';
  else if (q.includes('gnc')) brand = 'GNC';
  else if (q.includes('optimum') || q.includes(' on ')) brand = 'Optimum Nutrition';
  else if (q.includes('myprotein')) brand = 'Myprotein';
  else if (q.includes('nakpro')) brand = 'Nakpro';
  else if (q.includes('asitis') || q.includes('as-it-is')) brand = 'Asitis Nutrition';
  else if (q.includes('wellcore')) brand = 'Wellcore';
  else if (q.includes('himalaya')) brand = 'Himalaya';
  else if (q.includes('fast&up') || q.includes('fast and up')) brand = 'Fast&Up';
  else if (q.includes('carbamide')) brand = 'Carbamide Forte';
  else if (q.includes('wow')) brand = 'Wow Life Science';
  else if (q.includes('truebasics')) brand = 'TrueBasics';
  else if (q.includes('hk vitals') || q.includes('healthkart')) brand = 'HealthKart';
  else if (q.includes('doctor')) brand = "Doctors Choice";

  if (q.includes('protein') || q.includes('whey') || q.includes('isolate')) {
    category = 'protein';
    name = q.includes('isolate') ? 'Isolate Whey Protein' : '100% Pure Whey Protein';
    price = 2499;
    servings = 30;
    dose = '24g Protein';
    benefits = 'High-purity whey protein concentrate designed to stimulate muscle protein synthesis and accelerate recovery.';
    if (brand === 'Generic') brand = 'Nakpro';
  } else if (q.includes('creatine') || q.includes('monohydrate')) {
    category = 'creatine';
    name = 'Pure Micronized Creatine Monohydrate';
    price = 599;
    servings = 83;
    dose = '3g Creatine';
    benefits = '100% pure micronized creatine helps hydrate muscle cells, increasing ATP energy synthesis for strength training.';
    if (brand === 'Generic') brand = 'Wellcore';
  } else if (q.includes('preworkout') || q.includes('c4') || q.includes('pre-workout')) {
    category = 'preworkout';
    name = 'Explosive Pre-Workout Drink';
    price = 1499;
    servings = 30;
    dose = '200mg Caffeine, 2g Beta-Alanine';
    benefits = 'Formulated to amplify training stamina, energy, and muscle pump vascularity during high-intensity workouts.';
    if (brand === 'Generic') brand = 'MuscleBlaze';
  } else if (q.includes('omega') || q.includes('fish oil') || q.includes('salmon')) {
    category = 'omega3';
    name = 'Triple Strength Fish Oil Softgels';
    price = 899;
    servings = 60;
    dose = '1000mg Fish Oil (EPA 550mg / DHA 350mg)';
    benefits = 'Refined marine source rich in active EPA and DHA essential fatty acids to support brain, heart, and joints health.';
    if (brand === 'Generic') brand = 'Wow Life Science';
  } else if (q.includes('ashwagandha') || q.includes('kSM-66') || q.includes('stress')) {
    category = 'multivitamin';
    name = 'Organic Ashwagandha Tablets';
    price = 399;
    servings = 60;
    dose = '500mg Pure Extract';
    benefits = 'Clinically proven herbal adaptogen that helps lower cortisol stress levels, enhances deep sleep, and supports stamina.';
    if (brand === 'Generic') brand = 'Himalaya';
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
