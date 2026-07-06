export interface Recipe {
  title: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tip: string;
}

export const RECIPES: Record<string, Recipe> = {
  'foxtail-millet-noodles': {
    title: 'Healthy Homemade Millet Noodles',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: '2 servings',
    ingredients: [
      '1 pack Foxtail Millet Noodles',
      '1/2 cup Finely chopped carrots',
      '1/2 cup Chopped French beans',
      '1/2 cup Fresh green peas',
      '1 tbsp Olive oil',
      '2 cloves Garlic, minced',
      '1 tsp Low-sodium soy sauce',
      'A pinch of Black pepper'
    ],
    instructions: [
      'Boil water in a large pot, add the millet noodles, and cook for 5-6 minutes until al dente. Drain and rinse with cold water, adding 1/2 tsp oil to prevent sticking.',
      'Heat olive oil in a wok or pan over medium-high heat. Add minced garlic and sauté for 30 seconds.',
      'Toss in the carrots, beans, and green peas. Sauté for 3-4 minutes until the veggies are tender-crisp.',
      'Add the boiled noodles, low-sodium soy sauce, black pepper, and toss gently on high heat for 2 minutes.',
      'Serve hot, garnished with spring onions if desired.'
    ],
    tip: 'Avoid over-boiling millet noodles as they are gluten-free and can get mushy. Rinse them in cold water immediately after draining!'
  },
  'air-baked-samosa': {
    title: 'Guilt-Free Air-Baked Samosas',
    prepTime: '20 mins',
    cookTime: '18 mins',
    servings: '6 pieces',
    ingredients: [
      '1 cup Whole wheat flour (Atta)',
      '1 tsp Carom seeds (Ajwain)',
      '1 tbsp Cold-pressed oil (for dough)',
      '2 Medium potatoes, boiled & mashed',
      '1/4 cup Green peas',
      '1 tsp Ginger-green chili paste',
      '1/2 tsp Chaat masala',
      'Water to knead'
    ],
    instructions: [
      'Mix wheat flour, ajwain, 1 tbsp oil, and salt. Add water gradually to knead a firm dough. Rest it covered for 15 minutes.',
      'For the filling, heat 1 tsp oil in a pan. Sauté ginger-chili paste, peas, mashed potatoes, chaat masala, and salt for 3 minutes.',
      'Divide dough into 3 balls. Roll each thin, cut in half, shape into cones, fill with potato mixture, and seal the edges with water.',
      'Preheat your air-fryer to 180°C.',
      'Brush the samosas lightly with olive oil and air-fry for 15-18 minutes until golden and crisp, flipping halfway.'
    ],
    tip: 'Spray or brush the samosas with a light coat of cooking spray right before air-frying to achieve that classic bubbly, crisp texture.'
  },
  'roasted-mint-makhana': {
    title: 'Crispy Roasted Mint Makhana',
    prepTime: '5 mins',
    cookTime: '8 mins',
    servings: '3 servings',
    ingredients: [
      '2 cups Raw Makhana (Lotus seeds)',
      '1 tbsp Extra virgin olive oil or Ghee',
      '1 tbsp Dried mint leaves (pounded to powder)',
      '1/2 tsp Chaat masala',
      '1/4 tsp Black salt',
      '1/4 tsp Roasted cumin powder'
    ],
    instructions: [
      'Heat oil or ghee in a heavy-bottomed pan or kadhai on low heat.',
      'Add the makhana and slow-roast them for 6-8 minutes, stirring constantly. They are ready when they crunch easily when pressed.',
      'Turn off the heat. While the makhana are still warm, sprinkle the mint powder, chaat masala, black salt, and roasted cumin powder.',
      'Toss well for 1 minute until the spices coat the makhana evenly.',
      'Allow them to cool completely before storing in an airtight container.'
    ],
    tip: 'Slow-roasting on low heat is key! Fast roasting on high heat burns the makhana on the outside while keeping them soggy inside.'
  },
  'tender-coconut-water': {
    title: 'Tropical Aloe-Coconut Cooler',
    prepTime: '5 mins',
    cookTime: '0 mins',
    servings: '1 serving',
    ingredients: [
      '1 glass Fresh tender coconut water',
      '2 tbsp Fresh coconut meat (malai), sliced thin',
      '1 tsp Fresh lime juice',
      '3-4 Mint leaves, crushed',
      'Ice cubes'
    ],
    instructions: [
      'In a tall glass, muddle the crushed mint leaves and lime juice.',
      'Add ice cubes and the thin slices of tender coconut meat.',
      'Pour the fresh tender coconut water over the top.',
      'Stir gently and serve chilled immediately.'
    ],
    tip: 'Always consume tender coconut water fresh! If left open for too long, it oxidizes and loses its active enzymes and electrolyte potency.'
  },
  'lemon-ginger-kombucha': {
    title: 'Fresh Ginger Lemon Probiotic Tonic',
    prepTime: '5 mins',
    cookTime: '0 mins',
    servings: '1 serving',
    ingredients: [
      '1 cup Raw Organic Kombucha (Unflavored)',
      '1 tsp Fresh ginger juice',
      '1 tbsp Fresh lemon juice',
      '1 tsp Raw honey (optional)',
      'Ice cubes'
    ],
    instructions: [
      'In a shaker or small mixing pitcher, combine the lemon juice, ginger juice, and raw honey.',
      'Pour the unflavored kombucha over the juice mixture and stir gently (do not shake, as kombucha is naturally carbonated).',
      'Filter into a glass containing ice cubes.',
      'Garnish with a slice of lemon and fresh ginger juliennes.'
    ],
    tip: 'If brewing kombucha at home, add the ginger juice and lemon slices during the second fermentation phase (2-3 days) for a naturally carbonated flavor punch!'
  },
  'roasted-chickpeas': {
    title: 'Spiced Crunchy Roasted Chickpeas',
    prepTime: '10 mins',
    cookTime: '25 mins',
    servings: '4 servings',
    ingredients: [
      '2 cups Boiled chickpeas (drained and patted completely dry)',
      '1 tbsp Olive oil',
      '1 tsp Kashmiri red chili powder',
      '1/2 tsp Chaat masala',
      '1/2 tsp Garlic powder',
      'Salt to taste'
    ],
    instructions: [
      'Preheat your oven to 200°C (or air-fryer to 190°C).',
      'Line a baking sheet with parchment paper and spread the dried chickpeas in a single layer.',
      'Roast for 15 minutes without any spices until they start to dry and crisp.',
      'Drizzle with olive oil and sprinkle the chili powder, garlic powder, chaat masala, and salt. Toss well.',
      'Roast for another 10 minutes until crunchy. Let cool to crisp up fully.'
    ],
    tip: 'To get maximum crunch, make sure the boiled chickpeas are completely dry (pat them with a paper towel and let them air-dry for 15 minutes) before cooking!'
  },
  'baked-banana-chips': {
    title: 'Baked Turmeric Banana Chips',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: '3 servings',
    ingredients: [
      '2 Raw green plantains',
      '1/2 tsp Turmeric powder',
      '1/2 tsp Rock salt',
      '1 tbsp Coconut oil or olive oil',
      'Cold water (for soaking)'
    ],
    instructions: [
      'Peel the green plantains. Using a mandoline slicer, slice them into very thin round discs.',
      'Soak the slices in a bowl of cold water mixed with turmeric powder for 10 minutes. Drain and dry them thoroughly on kitchen paper.',
      'Preheat your oven or air-fryer to 180°C.',
      'Toss the dried slices with oil and rock salt. Arrange in a single layer on a baking tray.',
      'Bake for 15-20 minutes, flipping them halfway, until the edges curl and they become golden and crispy.'
    ],
    tip: 'Ensure the slices do not overlap on the baking tray, otherwise they will steam instead of baking, making them soft instead of crunchy.'
  },
  'dark-chocolate-85': {
    title: 'Dark Chocolate Almond Energy Bark',
    prepTime: '10 mins',
    cookTime: '0 mins (30 mins freeze)',
    servings: '8 servings',
    ingredients: [
      '100g Sugar-free 85% Dark Chocolate',
      '1/4 cup Roasted almonds, chopped',
      '1 tbsp Chia seeds',
      '1 tbsp Pumpkin seeds',
      'A pinch of Sea salt flakes'
    ],
    instructions: [
      'Break the dark chocolate into small pieces and melt it in a heatproof bowl set over a pot of simmering water (double boiler method) until smooth.',
      'Line a tray with baking paper.',
      'Pour the melted chocolate onto the paper and spread it into a thin, even sheet using a spatula.',
      'Scatter the roasted almonds, chia seeds, and pumpkin seeds evenly over the warm chocolate. Sprinkle a tiny pinch of sea salt flakes.',
      'Place in the freezer for 30 minutes until completely set. Break into rustic pieces and serve.'
    ],
    tip: 'Store the bark in the refrigerator to maintain crisp snap. The sea salt flakes contrast the rich cocoa solids beautifully!'
  },
  'baked-sweet-potato-fries': {
    title: 'Crispy Baked Sweet Potato Fries',
    prepTime: '15 mins',
    cookTime: '25 mins',
    servings: '3 servings',
    ingredients: [
      '2 Medium sweet potatoes',
      '1 tbsp Cornstarch or arrowroot powder (for crispness)',
      '1.5 tbsp Olive oil',
      '1 tsp Smoked paprika',
      '1/2 tsp Oregano',
      'Salt and pepper'
    ],
    instructions: [
      'Wash and peel the sweet potatoes. Cut them into even 1/4-inch thick matchsticks.',
      'Soak the cut sweet potatoes in cold water for 30 minutes to release excess starch. Drain and pat dry completely.',
      'Preheat your oven to 210°C (or air-fryer to 200°C).',
      'Toss the dry wedges with cornstarch first until lightly coated. Then add olive oil, paprika, oregano, salt, and pepper.',
      'Spread on a baking sheet in a single layer. Bake for 20-25 minutes, turning them once, until crispy and browned at the tips.'
    ],
    tip: 'Soaking in water and coating with a dusting of starch is the secret to getting crispy sweet potato fries without deep frying!'
  },
  'wheat-sourdough': {
    title: 'Easy Whole Wheat Sourdough Bread',
    prepTime: '24 hours (mostly inactive)',
    cookTime: '40 mins',
    servings: '1 Loaf',
    ingredients: [
      '3.5 cups Whole wheat flour',
      '1.25 cups Warm water',
      '1/2 cup Active sourdough starter',
      '1.5 tsp Salt'
    ],
    instructions: [
      'In a large bowl, whisk the warm water and active sourdough starter. Stir in the whole wheat flour and salt until a shaggy dough forms.',
      'Perform "stretch and folds" every 30 minutes for the first 2 hours, pulling the dough edges up and folding them over the center.',
      'Let the dough rise at room temperature for 8-10 hours (bulk fermentation) until doubled.',
      'Shape the dough into a round boule, place in a floured proofing basket, and ferment in the fridge for 12 hours.',
      'Preheat your oven to 230°C with a Dutch oven inside. Transfer the dough, score the top with a blade, cover, and bake for 25 minutes. Uncover and bake for another 15 minutes.'
    ],
    tip: 'Whole wheat sourdough starter requires hydration. Keep your starter active by feeding it equal parts whole wheat flour and water.'
  },
  'ragi-bread': {
    title: 'Sprouted Ragi & Oats Yeast-Free Bread',
    prepTime: '15 mins',
    cookTime: '45 mins',
    servings: '1 Loaf',
    ingredients: [
      '1.5 cups Sprouted Ragi flour (Finger millet)',
      '1 cup Rolled oats, ground to flour',
      '1 tsp Baking powder & 1/2 tsp Baking soda',
      '1 cup Buttermilk (or plant-based yogurt+water)',
      '2 tbsp Honey or maple syrup',
      '1 tbsp Chia seeds (soaked in 3 tbsp water)',
      '2 tbsp Flaxseeds (for topping)'
    ],
    instructions: [
      'Preheat your oven to 180°C and grease a standard loaf pan.',
      'In a large bowl, whisk the dry ingredients: ragi flour, oats flour, baking powder, baking soda, and salt.',
      'In another bowl, mix the buttermilk, honey, and soaked chia seeds (which act as a binder).',
      'Combine the wet and dry ingredients. The batter will be thick and pourable, not like regular wheat dough.',
      'Pour into the loaf pan, sprinkle flaxseeds on top, and bake for 40-45 minutes until a toothpick inserted in the center comes out clean.'
    ],
    tip: 'Let the loaf cool completely for 2 hours before slicing. Ragi is gluten-free, so it needs time to set structure or it will crumble!'
  },
  'mango-chia-pudding': {
    title: 'Tropical Mango Chia Seed Pudding',
    prepTime: '10 mins',
    cookTime: '0 mins (4 hours chill)',
    servings: '2 servings',
    ingredients: [
      '1/4 cup Chia seeds',
      '1 cup Unsweetened Almond milk or light coconut milk',
      '1 tbsp Raw honey or maple syrup',
      '1/2 tsp Vanilla extract',
      '1 cup Fresh sweet mango puree'
    ],
    instructions: [
      'In a jar or bowl, whisk the chia seeds, almond milk, honey, and vanilla extract.',
      'Let it sit for 5 minutes, then whisk again to break up any seed clumps.',
      'Cover and refrigerate for at least 4 hours (or overnight) until it thickens into a pudding.',
      'To assemble, spoon alternate layers of the chia pudding and fresh mango puree into serving glasses.',
      'Top with fresh mango cubes and mint leaves.'
    ],
    tip: 'Stirring the pudding twice in the first 10 minutes is essential to prevent the chia seeds from settling at the bottom in a hard block.'
  },
  'raspberry-banana-sorbet': {
    title: 'Instant 3-Ingredient Raspberry Sorbet',
    prepTime: '5 mins',
    cookTime: '0 mins',
    servings: '2 servings',
    ingredients: [
      '1.5 cups Frozen raspberries',
      '1 Large ripe banana, sliced and frozen',
      '1 tbsp Lime juice',
      '2-3 tbsp Warm water or coconut water (only if needed to blend)'
    ],
    instructions: [
      'Add the frozen banana slices, frozen raspberries, and lime juice to a high-speed blender or food processor.',
      'Blend on high, pulsing and scraping down the sides as necessary.',
      'If the mixture is too dry to blend, add warm water 1 tablespoon at a time.',
      'Process until the mixture is completely smooth and creamy, resembling soft-serve ice cream.',
      'Serve immediately for a soft texture, or transfer to a container and freeze for 1 hour to scoop.'
    ],
    tip: 'Ensure your banana is fully ripe (with brown spots) before freezing! Ripe bananas provide natural sweetness, eliminating the need for added sugar.'
  },
  'cauliflower-crust-pizza': {
    title: 'Low-Carb Cauliflower Crust Pizza',
    prepTime: '20 mins',
    cookTime: '25 mins',
    servings: '2 servings',
    ingredients: [
      '1 Medium head of cauliflower (grated/riced)',
      '1 Egg, beaten (or flax egg)',
      '1/3 cup Mozzarella cheese, shredded',
      '1 tsp Oregano & 1/2 tsp Garlic powder',
      '1/2 cup Homemade tomato marinara sauce',
      'Chopped bell peppers and basil (toppings)'
    ],
    instructions: [
      'Steam the riced cauliflower for 5 minutes. Let it cool slightly, then transfer to a clean kitchen towel.',
      'Squeeze the towel vigorously to wring out all moisture. This is crucial for a crisp crust.',
      'Mix the dry cauliflower, beaten egg, mozzarella, garlic powder, and oregano until it forms a dough.',
      'Press the dough onto a parchment-lined tray into a 10-inch circle. Bake at 200°C for 15-20 minutes until golden.',
      'Spread tomato sauce, toppings, and bake for another 5-8 minutes until the cheese is melted.'
    ],
    tip: 'Squeeze the cauliflower as much as possible! Any left-over water will make the crust soggy instead of crispy.'
  },
  'pesto-pizza': {
    title: 'Whole Wheat Pesto Garden Pizza',
    prepTime: '15 mins',
    cookTime: '12 mins',
    servings: '2 servings',
    ingredients: [
      '1 Whole wheat flatbread or pre-baked whole wheat pizza base',
      '3 tbsp Fresh basil pesto (made with olive oil, basil, pine nuts, garlic)',
      '1/2 cup Sliced mushrooms and bell peppers',
      '1/4 cup Low-fat paneer or ricotta cheese crumble',
      'A handful of Fresh baby arugula leaves'
    ],
    instructions: [
      'Preheat your oven to 200°C (or use a heavy iron tawa/skillet).',
      'Place the whole wheat base on a baking tray.',
      'Spread the basil pesto evenly over the base.',
      'Distribute the mushrooms, peppers, and low-fat paneer crumble on top.',
      'Bake for 10-12 minutes until the edges are golden brown and crispy.',
      'Remove from oven, scatter the fresh arugula leaves, slice, and serve.'
    ],
    tip: 'Sauté the mushrooms briefly in a dry pan before placing them on the pizza to release their moisture so they do not make the flatbread base soggy.'
  },
  'baked-apple-jalebi': {
    title: 'Baked Honey Apple Jalebis',
    prepTime: '15 mins',
    cookTime: '15 mins',
    servings: '3 servings',
    ingredients: [
      '2 Apples, cored and sliced into thin rings',
      '1/2 cup Chickpea flour (Besan) or Oats flour',
      '1/4 cup Greek yogurt',
      '1/2 tsp Cinnamon powder',
      '2 tbsp Raw organic honey',
      'Warm water (for batter)'
    ],
    instructions: [
      'Mix besan, yogurt, and warm water in a bowl to make a thick, smooth batter (similar to pancake batter). Rest it for 5 minutes.',
      'Dust the apple rings with cinnamon powder.',
      'Preheat your oven to 190°C and line a tray with baking paper.',
      'Dip each cinnamon-dusted apple ring into the batter to coat it completely. Place them on the tray.',
      'Bake for 12-15 minutes until the batter is cooked and slightly crisp. Drizzle raw honey over the warm rings before serving.'
    ],
    tip: 'Use crisp, tart apples like Granny Smith or Royal Gala. The natural crunch of the apple simulates the crispy texture of fried jalebis!'
  },
  'steamed-beetroot-momos': {
    title: 'Steamed Beetroot & Oats Momos',
    prepTime: '25 mins',
    cookTime: '10 mins',
    servings: '10 pieces',
    ingredients: [
      '1 cup Whole wheat flour',
      '2 tbsp Beetroot juice (for dough color)',
      '1/2 cup Low-fat paneer, crumbled',
      '1/4 cup Rolled oats, toasted & powdered',
      '1/2 cup Finely chopped cabbage and carrots',
      '1 tsp Soy sauce & 1/2 tsp Black pepper'
    ],
    instructions: [
      'Mix wheat flour with beetroot juice and water to knead a soft dough. Rest it covered for 15 minutes.',
      'For the filling, mix paneer crumble, oats powder, chopped veggies, soy sauce, black salt, and pepper in a bowl.',
      'Roll out the dough thin and cut into small circles.',
      'Place a spoonful of filling in the center, fold the edges, and pinch them together to seal.',
      'Steam the momos in a steamer basket for 8-10 minutes until the skin looks shiny and non-sticky.'
    ],
    tip: 'Steaming wheat momos for too long makes the wrappers rubbery. 8-10 minutes is the sweet spot!'
  },
  'cabbage-wrap-dumplings': {
    title: 'Wrapperless Cabbage Leaf Dumplings',
    prepTime: '20 mins',
    cookTime: '8 mins',
    servings: '8 pieces',
    ingredients: [
      '8 Large cabbage leaves (blanched)',
      '1/2 cup Crumbled firm tofu or paneer',
      '1/4 cup Finely chopped spring onions and mushrooms',
      '1/2 cup Mixed sprouts',
      '1 tbsp Garlic ginger paste',
      '1 tsp Sesame oil & 1 tsp soy sauce'
    ],
    instructions: [
      'Blanch the cabbage leaves in boiling salted water for 2 minutes until pliable. Immediately transfer to cold water, then pat dry.',
      'In a skillet, heat sesame oil. Sauté garlic-ginger paste, mushrooms, sprouts, tofu, and soy sauce for 3 minutes.',
      'Lay a blanched cabbage leaf flat. Slice off the thick white stem core to make folding easier.',
      'Place a spoonful of filling in the center. Fold the sides and roll up tightly into a log, tucking the edges.',
      'Place in a steamer and steam on medium-high heat for 6-8 minutes. Serve with a low-sodium chili dipping sauce.'
    ],
    tip: 'Rinse cabbage leaves in ice-cold water after blanching to preserve their vibrant green color and crunchy structure.'
  },
  'paneer-tikka': {
    title: 'Tandoori Grilled Cottage Cheese Tikka',
    prepTime: '20 mins (30 mins marinade)',
    cookTime: '15 mins',
    servings: '3 servings',
    ingredients: [
      '200g Low-fat Paneer, cut into thick cubes',
      '1/2 cup Thick Greek yogurt (Hung curd)',
      '1 tbsp Mustard oil (essential for flavor)',
      '1 tbsp Ginger-garlic paste',
      '1 tsp Kasuri methi (dried fenugreek leaves)',
      '1 tsp Tandoori masala powder',
      'Cubed bell peppers and onions'
    ],
    instructions: [
      'In a bowl, mix yogurt, mustard oil, ginger-garlic, kasuri methi, tandoori masala, and salt to form a thick marinade.',
      'Add paneer cubes, peppers, and onions, tossing gently until coated. Cover and marinate in the fridge for 30 minutes.',
      'Preheat your oven grill to 200°C (or use a non-stick grill pan).',
      'Skewer the paneer, peppers, and onions alternately.',
      'Grill for 12-15 minutes, turning occasionally, until the edges are charred and paneer is cooked through.'
    ],
    tip: 'To keep paneer soft, do not overcook it! Over-grilling paneer evaporates its moisture, making it rubbery and dry.'
  },
  'tofu-tikka': {
    title: 'Grilled Garlic Herb Tofu Tikka',
    prepTime: '15 mins (20 mins marinade)',
    cookTime: '12 mins',
    servings: '3 servings',
    ingredients: [
      '200g Firm organic Tofu, pressed and cubed',
      '1/2 cup Yogurt (or vegan cashew yogurt)',
      '1 tbsp Cold-pressed olive oil',
      '1/2 cup Fresh cilantro and mint leaves (ground to a paste)',
      '1 tbsp Ginger-garlic paste',
      '1 tsp Chaat masala'
    ],
    instructions: [
      'Press the tofu blocks with a heavy object for 15 minutes to squeeze out water, then cut into cubes.',
      'Mix the green herb paste, yogurt, olive oil, ginger-garlic paste, and chaat masala in a bowl.',
      'Toss the tofu cubes in the marinade. Let rest for 20 minutes.',
      'Heat a grill pan on medium-high heat.',
      'Place tofu cubes in the pan and sear for 3 minutes on each side until grill marks appear. Drizzle lime juice before serving.'
    ],
    tip: 'Pressing the tofu is essential! Removing water allows the tofu to act like a sponge and absorb all the green herb marinade flavors.'
  },
  'date-bites': {
    title: 'Baked Cardamom Date Oats Bites',
    prepTime: '10 mins',
    cookTime: '12 mins',
    servings: '12 bites',
    ingredients: [
      '1 cup Soft pitted dates (Medjool or Kimia)',
      '1/2 cup Rolled oats',
      '2 tbsp Almond flour or crushed almonds',
      '1/2 tsp Cardamom powder',
      '1 tsp Ghee or coconut oil'
    ],
    instructions: [
      'Preheat your oven to 170°C.',
      'Pulse the rolled oats in a blender to crack them slightly.',
      'Add the dates, almond flour, cardamom powder, and ghee to a food processor. Blend until it gathers into a sticky dough.',
      'Roll the mixture into small bite-sized round balls.',
      'Place on a baking sheet and bake for 10-12 minutes. They will firm up slightly and develop a delicious baked aroma. Let cool.'
    ],
    tip: 'If your dates are dry, soak them in warm water for 10 minutes, then drain and pat dry thoroughly before blending.'
  },
  'nachos-guac': {
    title: 'Oven-Baked Tortilla Chips & Fresh Guac',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: '2 servings',
    ingredients: [
      '4 Corn tortillas (Makai roti)',
      '1 tsp Olive oil',
      '1 Ripe Avocado',
      '1/4 cup Chopped tomatoes and onions',
      '1 tbsp Fresh cilantro, chopped',
      '1 tbsp Lime juice'
    ],
    instructions: [
      'Preheat your oven to 180°C.',
      'Cut each corn tortilla into 6-8 triangular wedges.',
      'Brush or spray them lightly with olive oil, sprinkle a pinch of salt, and arrange in a single layer on a baking tray.',
      'Bake for 8-10 minutes until crisp. Let cool.',
      'For the guac, mash the avocado flesh in a bowl. Fold in the tomatoes, onions, cilantro, lime juice, and salt. Serve alongside chips.'
    ],
    tip: 'Watch the chips closely in the last few minutes of baking! Corn tortillas go from crisp to burnt very quickly.'
  },
  'beet-chips': {
    title: 'Baked Spicy Sea Salt Beet Chips',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: '2 servings',
    ingredients: [
      '2 Medium beetroot',
      '1 tsp Olive oil',
      '1/2 tsp Sea salt flakes',
      '1/4 tsp Cayenne pepper or red chili flakes'
    ],
    instructions: [
      'Peel the beetroots and slice them into paper-thin rounds using a mandoline slicer.',
      'Toss the slices with olive oil and cayenne pepper (do not salt them yet, as salt draws out water and makes them soggy).',
      'Preheat oven to 160°C.',
      'Lay the slices in a single layer on baking sheets lined with baking paper.',
      'Bake for 15-20 minutes until the edges are crispy and curly. Remove, sprinkle with sea salt flakes, and let cool to crisp.'
    ],
    tip: 'Baking at a lower temperature (160°C) is key to dehydrating beet slices properly without burning their natural sugars.'
  },
  'grilled-chicken-burger': {
    title: 'Lean Grilled Chicken Breast Burger',
    prepTime: '15 mins',
    cookTime: '12 mins',
    servings: '2 servings',
    ingredients: [
      '2 Chicken breast fillets (pounded to even thickness)',
      '2 Whole wheat burger buns',
      '1 tbsp Lemon juice & 1 tsp olive oil',
      '1 tsp Garlic powder & 1/2 tsp black pepper',
      '2 tbsp Greek yogurt (for healthy spread)',
      'Lettuce leaves and tomato slices'
    ],
    instructions: [
      'Marinate chicken breasts in lemon juice, olive oil, garlic powder, salt, and pepper for 15 minutes.',
      'Grill the chicken breasts on a hot grill pan for 5-6 minutes on each side until fully cooked.',
      'Lightly toast the whole wheat buns.',
      'Spread Greek yogurt on the bottom bun. Layer with lettuce, tomatoes, and the grilled chicken breast.',
      'Close with the top bun and serve hot.'
    ],
    tip: 'Pound the chicken breast with a rolling pin before cooking to ensure it has uniform thickness, allowing it to grill evenly without drying out.'
  },
  'lettuce-burger': {
    title: 'Lettuce-Wrapped Spicy Black Bean Burger',
    prepTime: '20 mins',
    cookTime: '15 mins',
    servings: '4 patties',
    ingredients: [
      '1.5 cups Boiled black beans (or kidney beans), mashed',
      '1/2 cup Cooked quinoa or brown rice',
      '1/4 cup Rolled oats (for binding)',
      '1/2 cup Finely chopped onions and bell peppers',
      '1 tsp Cumin powder & 1 tsp Chili powder',
      '8 Large Iceberg lettuce leaves (washed and chilled)'
    ],
    instructions: [
      'Mix the mashed beans, cooked quinoa, oats, chopped veggies, cumin, chili powder, and salt until a cohesive mixture forms.',
      'Shape into 4 burger patties.',
      'Bake at 190°C for 15 minutes (or cook on a non-stick skillet for 5 minutes per side) until firm.',
      'To assemble, double-stack two chilled iceberg lettuce leaves as a wrap.',
      'Place the hot black bean patty in the center, add sliced tomatoes, onions, salsa, and fold the lettuce leaves over like a bun.'
    ],
    tip: 'Chilling the lettuce leaves in ice water for 10 minutes makes them extra crisp and sturdy enough to hold the burger patty!'
  },
  'chole-oats-roti': {
    title: 'Healthy Spiced Chole with Baked Oats Roti',
    prepTime: '20 mins',
    cookTime: '30 mins',
    servings: '2 servings',
    ingredients: [
      '1 cup Chickpeas (Kabuli chana), soaked and boiled',
      '1 Onion & 1 Tomato, pureed',
      '1 tsp Ginger-garlic paste',
      '1 tsp Chole masala powder',
      '1 tsp Olive oil',
      '1/2 cup Oats flour & 1/2 cup Whole wheat flour'
    ],
    instructions: [
      'For the Chole, heat 1 tsp oil in a pan. Sauté ginger-garlic paste, onion-tomato puree, chole masala, and salt for 5 minutes.',
      'Add boiled chickpeas and 1 cup water. Simmer on low heat for 15 minutes until thick.',
      'For the Roti, mix oats flour, wheat flour, and warm water. Knead a soft dough, rest for 10 minutes.',
      'Roll out into thin rotis.',
      'Cook the rotis on a hot tawa (griddle) on both sides until puffed. Serve hot with the spiced chole.'
    ],
    tip: 'Mash a handful of chickpeas in the gravy to thicken it naturally, eliminating the need to cook with excess fats.'
  },
  'ginger-green-tea': {
    title: 'Cardamom Ginger Green Tea Infusion',
    prepTime: '2 mins',
    cookTime: '5 mins',
    servings: '2 cups',
    ingredients: [
      '2 cups Water',
      '1 inch Ginger root, sliced',
      '2 Cardamom pods, crushed',
      '2 Green tea bags (or 1 tbsp loose green tea)',
      'A few drops of Natural liquid Stevia extract'
    ],
    instructions: [
      'In a saucepan, bring the water, sliced ginger, and crushed cardamom to a rolling boil.',
      'Simmer on medium heat for 3-4 minutes to extract the spice oils.',
      'Turn off the heat. Add the green tea leaves or tea bags and cover with a lid.',
      'Steep for 2-3 minutes. Do not exceed this, or green tea will taste bitter.',
      'Strain into cups, add stevia extract to taste, and serve warm.'
    ],
    tip: 'Never boil green tea leaves directly! Boiling leaves cooks them, releasing tannins which make the tea bitter and dry.'
  },
  'oats-milk-chai': {
    title: 'Spiced Oat Milk Masala Chai',
    prepTime: '2 mins',
    cookTime: '6 mins',
    servings: '2 cups',
    ingredients: [
      '1 cup Water',
      '1 cup Unsweetened Oat Milk',
      '1.5 tsp Black tea leaves (Assam dust)',
      '1/2 inch Ginger root, crushed',
      '1 Cardamom & 1 Clove, crushed',
      '1 tsp Organic liquid jaggery or palm sugar'
    ],
    instructions: [
      'Boil the water, crushed ginger, cardamom, and clove in a pot for 3 minutes.',
      'Add the black tea leaves and simmer for 1 minute until the water turns deep red.',
      'Pour in the oat milk. Heat on low-medium until it just reaches a gentle boil. Turn off heat immediately.',
      'Cover with a lid and let steep for 1 minute.',
      'Strain into cups, stir in the jaggery, and serve hot.'
    ],
    tip: 'Do not boil oat milk on high heat for too long, as it can cause the milk to thicken or separate. Heat gently just to a boil.'
  },
  'tandoori-fish-tikka': {
    title: 'Clay-Oven Roasted Tandoori Fish Tikka',
    prepTime: '15 mins (20 mins marinade)',
    cookTime: '12 mins',
    servings: '3 servings',
    ingredients: [
      '300g Fish fillets (Basa, Surmai, or Salmon), cut to cubes',
      '1/2 cup Hung yogurt (Greek yogurt)',
      '1 tbsp Lemon juice & 1 tsp mustard oil',
      '1 tbsp Ginger-garlic paste',
      '1 tsp Carom seeds (Ajwain) - essential for fish!',
      '1.5 tsp Red chili powder & 1 tsp garam masala'
    ],
    instructions: [
      'Pat the fish cubes completely dry with a paper towel.',
      'In a bowl, mix yogurt, mustard oil, ginger-garlic paste, ajwain, lemon juice, chili powder, and garam masala.',
      'Coat the fish cubes in the marinade. Let rest for 20 minutes.',
      'Preheat your oven or grill to 200°C.',
      'Arrange on a baking sheet. Bake for 10-12 minutes, turning once, until the fish flakes easily and edges are lightly charred.'
    ],
    tip: 'Ajwain (carom seeds) is a traditional pairing for fish in Indian cuisine—it aids digestion and adds a subtle thyme-like aroma.'
  },
  'berry-seeds-oats': {
    title: 'High-Protein Berry & Seeds Oats',
    prepTime: '5 mins',
    cookTime: '8 mins',
    servings: '2 servings',
    ingredients: [
      '1 cup Steel cut oats (or rolled oats)',
      '2 cups Water or skimmed milk',
      '1/2 cup Fresh blueberries or strawberries, sliced',
      '1 tbsp Chia seeds & 1 tbsp Pumpkin seeds',
      '1 tbsp Honey or maple syrup'
    ],
    instructions: [
      'Bring water or milk to a boil in a saucepan.',
      'Add the steel cut oats and reduce heat to low. Cook for 8 minutes (rolled oats take 5 minutes), stirring occasionally.',
      'Pour the warm oats into bowls.',
      'Arrange the fresh sliced berries on top.',
      'Sprinkle the chia seeds, pumpkin seeds, and drizzle with honey before serving.'
    ],
    tip: 'Use steel cut oats instead of instant oats for a much lower glycemic index, which keeps you full for hours longer!'
  },
  'oats-pav-bhaji': {
    title: 'Veggie-Loaded Bhaji with High-Fiber Oats Pav',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: '2 servings',
    ingredients: [
      '1 cup Cauliflower, chopped',
      '1/2 cup Green peas & 1/2 cup Carrots',
      '1 Onion & 1 Tomato, finely chopped',
      '1 tsp Olive oil & 1 tsp Butter (for glazing)',
      '1 tbsp Pav bhaji masala powder',
      '2 Oats Pavs (or Whole wheat pav buns)'
    ],
    instructions: [
      'Boil cauliflower, peas, and carrots. Mash them thoroughly into a smooth paste.',
      'In a pan, heat 1 tsp oil. Sauté onions, tomatoes, and pav bhaji masala for 5 minutes.',
      'Add the vegetable paste and 1/2 cup water. Simmer on low heat for 10 minutes. Stir in a tiny sliver (1/2 tsp) of butter at the end.',
      'Slice the oats pavs in half. Toast lightly on a griddle with a tiny brush of ghee.',
      'Serve the hot veggie bhaji garnished with fresh coriander and lime, alongside the oats pav.'
    ],
    tip: 'Mash the vegetables very well to create a creamy texture without adding potatoes, keeping the dish low in empty carbs!'
  }
};

export function getRecipeBySlug(slug: string): Recipe | null {
  if (!slug) return null;
  // Clean slug of common suffixes (e.g. -3, -4, -100g, -250g, etc.)
  let cleanSlug = slug.toLowerCase().replace(/-\d+(g|ml)?$/i, '').trim();
  
  if (RECIPES[cleanSlug]) {
    return RECIPES[cleanSlug];
  }
  
  // Try finding closest match
  for (const key of Object.keys(RECIPES)) {
    if (cleanSlug.includes(key) || key.includes(cleanSlug)) {
      return RECIPES[key];
    }
  }
  
  return null;
}
