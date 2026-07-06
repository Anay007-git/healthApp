import { JunkItem, HealthyAlternative } from './mockData';

export interface DynamicSwap {
  junkItem: JunkItem;
  alternative: HealthyAlternative;
  similarityReason: string;
}

export function getDynamicSwap(slug: string): DynamicSwap | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '').trim();

  let junkName = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  let altName = 'Baked Multigrain Crisps & Hummus';
  let altSlug = 'roasted-chickpeas';
  let category = 'snacks';
  let similarityReason = 'Swaps empty-calorie fried snacks with complex carbohydrates and plant protein from baked grains and chickpeas.';
  
  let caloriesJunk = 450;
  let fatJunk = 22;
  let sugarJunk = 3.5;
  let sodiumJunk = 750;
  let carbsJunk = 48;
  let proteinJunk = 8;
  let fiberJunk = 1.5;

  let caloriesAlt = 160;
  let fatAlt = 3.5;
  let sugarAlt = 0.8;
  let sodiumAlt = 140;
  let carbsAlt = 22;
  let proteinAlt = 7.5;
  let fiberAlt = 6.0;
  let description = 'Oven-baked fiber-rich grains and dry-roasted chickpeas tossed in olive oil and active Indian spices. Packed with lean protein.';

  // Match keyword rules
  if (cleanSlug.includes('roll') || cleanSlug.includes('wrap') || cleanSlug.includes('kathi') || cleanSlug.includes('frankie')) {
    junkName = cleanSlug.includes('egg') ? 'Double Egg Kathi Roll' : junkName;
    altName = 'Whole Wheat Kathi Roll (Baked)';
    altSlug = 'wheat-kathi-roll';
    category = 'snacks';
    caloriesJunk = 390; fatJunk = 18; sugarJunk = 2.0; sodiumJunk = 680; carbsJunk = 42; proteinJunk = 12; fiberJunk = 1.2;
    caloriesAlt = 220; fatAlt = 6.5; sugarAlt = 1.0; sodiumAlt = 320; carbsAlt = 28; proteinAlt = 14.5; fiberAlt = 4.8;
    description = 'Whole wheat thin wrap stuffed with grilled paneer, onions, capsicum, and a dash of coriander chutney, baked with minimal olive oil.';
    similarityReason = 'Replaces the refined maida flour flatbread and greasy fillings with whole wheat wraps, baking rather than frying, saving fat by 65%.';
  }
  else if (cleanSlug.includes('biriyani') || cleanSlug.includes('biryani') || cleanSlug.includes('pulao') || cleanSlug.includes('rice') || cleanSlug.includes('chawal')) {
    junkName = cleanSlug.includes('chicken') ? 'Chicken Biryani' : 'Vegetable Dum Biryani';
    altName = 'Quinoa & Brown Rice Veg Biryani';
    altSlug = 'quinoa-veg-biryani';
    category = 'fastfood';
    caloriesJunk = 520; fatJunk = 24; sugarJunk = 2.5; sodiumJunk = 890; carbsJunk = 65; proteinJunk = 11; fiberJunk = 1.8;
    caloriesAlt = 290; fatAlt = 7.5; sugarAlt = 1.2; sodiumAlt = 420; carbsAlt = 45; proteinAlt = 10.0; fiberAlt = 8.0;
    description = 'A fiber-rich blend of organic quinoa and unpolished brown rice slow-cooked with fresh carrots, beans, peas, and aromatic spices.';
    similarityReason = 'Replaces white basmati rice cooked in saturated ghee/vanaspati with unpolished grains and fiber-rich vegetables, lowering glycemic load.';
  }
  else if (cleanSlug.includes('kfc') || cleanSlug.includes('nuggets') || cleanSlug.includes('fried-chicken') || cleanSlug.includes('wings') || cleanSlug.includes('bucket') || cleanSlug.includes('chicken-fry')) {
    junkName = cleanSlug.includes('kfc') ? 'KFC Fried Chicken Bucket' : 'Crispy Fried Chicken';
    altName = 'Baked Oats-Crusted Chicken Strips';
    altSlug = 'baked-oats-chicken';
    category = 'fastfood';
    caloriesJunk = 480; fatJunk = 32; sugarJunk = 0.5; sodiumJunk = 920; carbsJunk = 18; proteinJunk = 22; fiberJunk = 0.5;
    caloriesAlt = 240; fatAlt = 8.0; sugarAlt = 0.2; sodiumAlt = 410; carbsAlt = 12; proteinAlt = 29.0; fiberAlt = 3.5;
    description = 'Lean chicken breast strips dipped in egg white, rolled in crushed oats and paprika, and baked to a golden crisp in the oven.';
    similarityReason = 'Eliminates deep-frying and processed flour batters. Oats-crusted baking cuts fat by 75% while maintaining crispy texture and protein density.';
  }
  else if (cleanSlug.includes('burger') || cleanSlug.includes('mcdonald')) {
    altName = 'Grilled Chicken Breast Wheat Burger';
    altSlug = 'chicken-burger';
    category = 'fastfood';
    caloriesJunk = 540; fatJunk = 28; sugarJunk = 7.0; sodiumJunk = 980; carbsJunk = 45; proteinJunk = 20; fiberJunk = 1.5;
    caloriesAlt = 340; fatAlt = 9.5; sugarAlt = 3.0; sodiumAlt = 480; carbsAlt = 35; proteinAlt = 32.0; fiberAlt = 5.0;
    description = 'Juicy grilled chicken breast fillet on a whole wheat bun, topped with lettuce, tomato, and greek yogurt spread instead of mayonnaise.';
    similarityReason = 'Replaces processed fried patties and refined flour buns with lean grilled chicken breast, whole wheat buns, and high protein greek yogurt.';
  }
  else if (cleanSlug.includes('pizza') || cleanSlug.includes('domino')) {
    altName = 'Cauliflower Crust Veggie Pizza';
    altSlug = 'cauliflower-crust-pizza';
    category = 'fastfood';
    caloriesJunk = 285; fatJunk = 12; sugarJunk = 3.5; sodiumJunk = 640; carbsJunk = 32; proteinJunk = 12; fiberJunk = 1.5;
    caloriesAlt = 180; fatAlt = 6.5; sugarAlt = 2.0; sodiumAlt = 390; carbsAlt = 16; proteinAlt = 12.0; fiberAlt = 4.5;
    description = 'Low-carb, gluten-free crust made from grated cauliflower and herbs, topped with home-cooked marinara sauce and light mozzarella.';
    similarityReason = 'Swaps empty-calorie white flour crust with a vitamin-dense cauliflower dough base, slashing carbohydrate density to near-zero.';
  }
  else if (cleanSlug.includes('momo') || cleanSlug.includes('dumpling') || cleanSlug.includes('dimsum')) {
    altName = 'Steamed Beetroot & Oats Wheat Momos';
    altSlug = 'steamed-beetroot-momos';
    category = 'fastfood';
    caloriesJunk = 320; fatJunk = 14; sugarJunk = 1.5; sodiumJunk = 620; carbsJunk = 44; proteinJunk = 7; fiberJunk = 1.0;
    caloriesAlt = 160; fatAlt = 2.0; sugarAlt = 1.5; sodiumAlt = 310; carbsAlt = 29; proteinAlt = 6.5; fiberAlt = 3.8;
    description = 'Steamed momos made with a whole wheat flour wrapper, stuffed with high-protein paneer, carrots, and fiber-rich rolled oats.';
    similarityReason = 'Swaps oil-fried maida wrappers with steamed whole wheat beetroot dough filled with oats and paneer, boosting fiber and protein.';
  }
  else if (cleanSlug.includes('chowmein') || cleanSlug.includes('noodle') || cleanSlug.includes('maggi') || cleanSlug.includes('maggie')) {
    altName = 'Foxtail Millet Noodles';
    altSlug = 'foxtail-millet-noodles';
    category = 'snacks';
    caloriesJunk = 380; fatJunk = 13.5; sugarJunk = 2.0; sodiumJunk = 1100; carbsJunk = 62; proteinJunk = 8; fiberJunk = 1.0;
    caloriesAlt = 290; fatAlt = 2.5; sugarAlt = 0.5; sodiumAlt = 120; carbsAlt = 54; proteinAlt = 11.5; fiberAlt = 8.0;
    description = 'Air-dried, high-protein millet noodles that satisfy instant noodle cravings without the deep-fried trans fat and refined maida flour.';
    similarityReason = 'Swaps deep-fried refined white flour with air-dried whole millets, raising dietary fiber by 800% and reducing sodium load.';
  }

  const junkId = `dynamic-junk-${cleanSlug}`;
  const altId = `dynamic-alt-${altSlug}`;

  const junkItem: JunkItem = {
    id: junkId,
    name: junkName,
    slug: cleanSlug,
    category,
    calories: caloriesJunk,
    fat: fatJunk,
    sugar: sugarJunk,
    sodium: sodiumJunk,
    carbs: carbsJunk,
    protein: proteinJunk,
    fiber: fiberJunk,
    image_url: `/images/junk/${cleanSlug}.jpg`
  };

  const alternative: HealthyAlternative = {
    id: altId,
    name: altName,
    slug: altSlug,
    category,
    calories: caloriesAlt,
    protein: proteinAlt,
    fiber: fiberAlt,
    fat: fatAlt,
    sugar: sugarAlt,
    sodium: sodiumAlt,
    carbs: carbsAlt,
    image_url: `/images/healthy/${altSlug}.jpg`,
    description
  };

  return {
    junkItem,
    alternative,
    similarityReason
  };
}
