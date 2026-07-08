import { NextRequest, NextResponse } from 'next/server';
import { saveSupplement } from '@/lib/db';
import { Supplement } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    let supplementDetails: any = null;

    if (apiKey) {
      try {
        const systemPrompt = `You are a third-party health supplement catalog agent. You must search your knowledge base and retrieve real product data for this Indian supplement query: "${query}".
Generate a structured JSON object representing this real supplement.
Important: Your response must be ONLY a valid JSON object. Do not include markdown codeblocks (do NOT start with \`\`\`json), no preamble, and no extra text.
JSON Structure:
{
  "brand": "Official Brand Name (e.g. MuscleBlaze, Himalaya, GNC)",
  "name": "Full Product Name (e.g. Biozyme Whey Protein, Ashwagandha Organic)",
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
          
          // Strip markdown codeblock markers if any exist
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

    // Heuristic fallback if Hugging Face is not configured or failed to return valid JSON
    if (!supplementDetails) {
      supplementDetails = getLocalFallbackSupplement(query);
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

    const newSupplement: Supplement = {
      id: cleanId,
      name: supplementDetails.name || query,
      brand: supplementDetails.brand || 'Generic',
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
  let brand = 'Generic';
  let name = query;
  let category = 'multivitamin';
  let price = 599;
  let servings = 60;
  let dose = '1 Capsule';
  let rating = 4.4;
  let tier = 'value_pick';
  let benefits = 'Supports overall health, immunity, and daily fitness routines.';
  
  if (q.includes('protein') || q.includes('whey') || q.includes('isolate')) {
    category = 'protein';
    brand = q.includes('muscleblaze') ? 'MuscleBlaze' : q.includes('on') || q.includes('optimum') ? 'Optimum Nutrition' : 'Nakpro';
    name = q.includes('isolate') ? 'Isolate Whey Protein' : '100% Pure Whey Protein';
    price = 2499;
    servings = 30;
    dose = '24g Protein';
    benefits = 'High-purity whey protein concentrate designed to stimulate muscle protein synthesis and accelerate recovery.';
  } else if (q.includes('creatine') || q.includes('monohydrate')) {
    category = 'creatine';
    brand = q.includes('wellcore') ? 'Wellcore' : q.includes('asitis') ? 'Asitis Nutrition' : 'MuscleBlaze';
    name = 'Pure Micronized Creatine Monohydrate';
    price = 599;
    servings = 83;
    dose = '3g Creatine';
    benefits = '100% pure micronized creatine helps hydrate muscle cells, increasing ATP energy synthesis for strength training.';
  } else if (q.includes('preworkout') || q.includes('c4') || q.includes('pre-workout')) {
    category = 'preworkout';
    brand = q.includes('cellucor') ? 'Cellucor' : 'MuscleBlaze';
    name = 'Explosive Pre-Workout Drink';
    price = 1499;
    servings = 30;
    dose = '200mg Caffeine, 2g Beta-Alanine';
    benefits = 'Formulated to amplify training stamina, energy, and muscle pump vascularity during high-intensity workouts.';
  } else if (q.includes('omega') || q.includes('fish oil') || q.includes('salmon')) {
    category = 'omega3';
    brand = q.includes('gnc') ? 'GNC' : 'Wow Life Science';
    name = 'Triple Strength Fish Oil Softgels';
    price = 899;
    servings = 60;
    dose = '1000mg Fish Oil (EPA 550mg / DHA 350mg)';
    benefits = 'Refined marine source rich in active EPA and DHA essential fatty acids to support brain, heart, and joints health.';
  } else if (q.includes('ashwagandha') || q.includes('himalaya')) {
    brand = 'Himalaya';
    name = 'Organic Ashwagandha Tablets';
    category = 'multivitamin';
    price = 250;
    servings = 60;
    dose = '250mg Pure Extract';
    benefits = 'Clinically proven herbal adaptogen that helps lower cortisol stress levels, enhances deep sleep, and supports stamina.';
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
