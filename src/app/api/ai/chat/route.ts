import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    // Check if Hugging Face API Key is present in environment
    if (!apiKey) {
      console.log('Hugging Face API key not configured, using local rule-based fallback');
      const responseText = getLocalFallbackResponse(messages);
      return NextResponse.json({ 
        message: responseText, 
        isFallback: true 
      });
    }

    // Format Llama 3 chat template for the Hugging Face serverless endpoint
    let prompt = "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are NutriFit AI, a helpful Indian health, swap, and fitness coach. Keep answers extremely concise (max 3-4 sentences). Recommend specific Indian swaps like Moong Chilla, Makhana, Paneer/Chicken Tikka, and Oats Roti. Avoid technical jargon.<|eot_id|>";
    
    for (const msg of messages) {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      prompt += `<|start_header_id|>${role}<|end_header_id|>\n\n${msg.content}<|eot_id|>`;
    }
    prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n";

    const hfUrl = 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct';

    try {
      const hfResponse = await fetch(hfUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (hfResponse.ok) {
        const result = await hfResponse.json();
        
        let aiText = '';
        if (Array.isArray(result) && result[0]?.generated_text) {
          const generated = result[0].generated_text;
          // Extract only the new assistant response by splitting at the assistant prompt header
          const parts = generated.split("<|start_header_id|>assistant<|end_header_id|>\n\n");
          aiText = parts[parts.length - 1]?.replace("<|eot_id|>", "").trim() || generated;
        } else if (result.generated_text) {
          aiText = result.generated_text;
        }

        if (aiText) {
          return NextResponse.json({ message: aiText, isFallback: false });
        }
      } else {
        console.warn(`Hugging Face API returned status: ${hfResponse.status}, falling back`);
      }
    } catch (fetchErr) {
      console.warn('Hugging Face Inference call failed/timed out, using local fallback:', fetchErr);
    }

    // Graceful fallback in case of API error or timeout
    const fallbackText = getLocalFallbackResponse(messages);
    return NextResponse.json({ 
      message: fallbackText, 
      isFallback: true 
    });

  } catch (err: any) {
    console.error('Error in /api/ai/chat endpoint:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
  }
}

// Simple rule-based chatbot fallback when API key is missing or endpoint is down
function getLocalFallbackResponse(messages: any[]): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

  if (lastMsg.includes('butter chicken') || lastMsg.includes('butter paneer') || lastMsg.includes('paneer masala')) {
    return "For heavy gravy dishes like Butter Chicken or Butter Paneer Masala, the ultimate healthy swap is Tandoori Grilled Paneer/Chicken Tikka. It saves over 50% fat and 200+ calories, while keeping the authentic charcoal spices. Pair it with a high-fiber Oats or Wheat Roti instead of Maida Naan!";
  }
  
  if (lastMsg.includes('maggi') || lastMsg.includes('noodle') || lastMsg.includes('noodles')) {
    return "Instant fried noodles are packed with refined flour (maida) and high sodium. Swap them with Air-Dried Foxtail Millet Noodles. It cuts down calories, provides 8g of prebiotic fiber, and satisfies your savory masala cravings naturally!";
  }

  if (lastMsg.includes('samosa') || lastMsg.includes('makhana') || lastMsg.includes('chips')) {
    return "Instead of deep-fried samosas or potato chips, snack on Roasted Mint Makhana (Foxnuts) or Spiced Roasted Chickpeas. They offer a highly satisfying crunch, are rich in plant proteins and fiber, and have a low glycemic index.";
  }

  if (lastMsg.includes('jalebi') || lastMsg.includes('gulab jamun') || lastMsg.includes('sweet') || lastMsg.includes('chocolate')) {
    return "Satisfy sweet tooth cravings with Sugar-Free Dark Chocolate (85%), Cinnamon Honey Baked Apple Jalebi, or Baked Cardamom Date Oats Bites. These natural date/honey sugars release slowly, preventing insulin spikes.";
  }

  if (lastMsg.includes('weight loss') || lastMsg.includes('cutting') || lastMsg.includes('diet') || lastMsg.includes('loss')) {
    return "For a healthy weight loss plan, aim for a clean calorie deficit. Focus on high-protein, high-fiber options: Moong Dal Chilla for breakfast, Tandoori Paneer/Chicken Tikka for lunch, and Moong Dal Tadka with Steamed Brown Rice for dinner. Keep hydrated with Coconut Water!";
  }

  if (lastMsg.includes('muscle gain') || lastMsg.includes('bulking') || lastMsg.includes('gain')) {
    return "To build muscle, combine progressive hypertrophy workouts (like Push/Pull/Legs splits) with a calorie surplus. Ensure high-protein meals (aiming for 1.6-2g per kg of body weight). You can supplement with Creatine Monohydrate and Whey Protein to boost athletic output.";
  }

  if (lastMsg.includes('workout') || lastMsg.includes('exercise') || lastMsg.includes('gym')) {
    return "To optimize fitness, we recommend a 4-day training split customized to your goal: hypertrophy lifting for muscle gain, high-rep supersets & HIIT cardio for fat loss, or full-body functional splits for maintenance. Focus on strict form for safety!";
  }

  return "Hello! I am NutriFit AI, your Indian health, swap, and fitness coach. I can suggest healthy swaps for cravings (like swapping Maggi for Millet Noodles), review your calorie needs, or optimize your workout. Ask me anything about diet or workouts!";
}
