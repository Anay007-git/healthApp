export interface JunkItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  calories: number;
  carbs?: number;
  protein?: number;
  fat: number;
  fiber?: number;
  sugar: number;
  sodium: number;
  iron?: number;
  calcium?: number;
  potassium?: number;
  image_url?: string;
}

export interface HealthyAlternative {
  id: string;
  name: string;
  slug: string;
  category: string;
  calories: number;
  carbs?: number;
  protein: number;
  fiber: number;
  fat: number;
  sugar: number;
  sodium: number;
  iron?: number;
  calcium?: number;
  potassium?: number;
  image_url?: string;
  description: string;
}

export interface AlternativeMapping {
  junk_item_id: string;
  alternative_id: string;
  similarity_reason: string;
}

export const mockJunkItems: JunkItem[] = [
  { id: 'a1b1c1d1-1111-1111-1111-111111111111', name: 'Maggi Instant Noodles', slug: 'maggi-instant-noodles', category: 'snacks', calories: 380, carbs: 58.0, protein: 8.0, fat: 13.5, fiber: 1.2, sugar: 2.0, sodium: 1100, iron: 1.5, calcium: 20, potassium: 120, image_url: '/images/junk/maggi.jpg' },
  { id: 'a1b1c1d1-2222-2222-2222-222222222222', name: 'Samosa (Fried)', slug: 'samosa-fried', category: 'snacks', calories: 260, carbs: 24.0, protein: 3.5, fat: 17.0, fiber: 0.8, sugar: 1.0, sodium: 450, iron: 0.8, calcium: 15, potassium: 90, image_url: '/images/junk/samosa.jpg' },
  { id: 'a1b1c1d1-3333-3333-3333-333333333333', name: 'Coca-Cola Cola', slug: 'coca-cola-cola', category: 'drinks', calories: 140, carbs: 39.0, protein: 0.0, fat: 0.0, fiber: 0.0, sugar: 39.0, sodium: 45, iron: 0.0, calcium: 2, potassium: 10, image_url: '/images/junk/coke.jpg' },
  { id: 'a1b1c1d1-4444-4444-4444-444444444444', name: 'Potato Chips (Lays)', slug: 'potato-chips-lays', category: 'snacks', calories: 530, carbs: 53.0, protein: 6.0, fat: 35.0, fiber: 1.4, sugar: 1.0, sodium: 520, iron: 1.2, calcium: 20, potassium: 1275, image_url: '/images/junk/chips.jpg' },
  { id: 'a1b1c1d1-5555-5555-5555-555555555555', name: 'Dairy Milk Chocolate', slug: 'dairy-milk-chocolate', category: 'desserts', calories: 530, carbs: 58.0, protein: 7.5, fat: 30.0, fiber: 1.8, sugar: 56.0, sodium: 80, iron: 1.0, calcium: 180, potassium: 270, image_url: '/images/junk/chocolate.jpg' },
  { id: 'a1b1c1d1-6666-6666-6666-666666666666', name: 'French Fries', slug: 'french-fries', category: 'fastfood', calories: 312, carbs: 41.0, protein: 3.4, fat: 15.0, fiber: 2.6, sugar: 0.3, sodium: 210, iron: 0.8, calcium: 18, potassium: 579, image_url: '/images/junk/fries.jpg' },
  { id: 'a1b1c1d1-7777-7777-7777-777777777777', name: 'White Bread', slug: 'white-bread', category: 'breakfast', calories: 265, carbs: 49.0, protein: 9.0, fat: 3.2, fiber: 2.7, sugar: 5.0, sodium: 490, iron: 2.7, calcium: 260, potassium: 120, image_url: '/images/junk/white-bread.jpg' },
  { id: 'a1b1c1d1-8888-8888-8888-888888888888', name: 'Vanilla Ice Cream', slug: 'vanilla-ice-cream', category: 'desserts', calories: 207, carbs: 24.0, protein: 3.5, fat: 11.0, fiber: 0.7, sugar: 21.0, sodium: 80, iron: 0.1, calcium: 128, potassium: 199, image_url: '/images/junk/ice-cream.jpg' },
  { id: 'a1b1c1d1-9999-9999-9999-999999999999', name: 'Cheese Loaded Pizza', slug: 'cheese-loaded-pizza', category: 'fastfood', calories: 285, carbs: 33.0, protein: 12.0, fat: 12.0, fiber: 1.5, sugar: 3.5, sodium: 640, iron: 1.5, calcium: 180, potassium: 150, image_url: '/images/junk/pizza.jpg' },
  { id: 'a1b1c1d1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Jalebi (Fried in Ghee)', slug: 'jalebi-fried-ghee', category: 'desserts', calories: 350, carbs: 70.0, protein: 2.5, fat: 12.0, fiber: 0.5, sugar: 50.0, sodium: 150, iron: 0.8, calcium: 12, potassium: 45, image_url: '/images/junk/jalebi.jpg' },
  { id: 'a1b1c1d1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Fried Momos (Maida)', slug: 'fried-momos-maida', category: 'fastfood', calories: 320, carbs: 45.0, protein: 7.0, fat: 14.0, fiber: 1.0, sugar: 1.5, sodium: 620, iron: 1.0, calcium: 30, potassium: 110, image_url: '/images/junk/momos.jpg' },
  { id: 'a1b1c1d1-cccc-cccc-cccc-cccccccccccc', name: 'Butter Paneer Masala', slug: 'butter-paneer-masala', category: 'fastfood', calories: 380, carbs: 12.0, protein: 10.0, fat: 32.0, fiber: 1.5, sugar: 6.0, sodium: 780, iron: 1.2, calcium: 280, potassium: 210, image_url: '/images/junk/butter-paneer.jpg' },
  { id: 'a1b1c1d1-dddd-dddd-dddd-dddddddddddd', name: 'Gulab Jamun (Syrup)', slug: 'gulab-jamun', category: 'desserts', calories: 300, carbs: 58.0, protein: 4.5, fat: 10.0, fiber: 0.5, sugar: 42.0, sodium: 120, iron: 0.5, calcium: 110, potassium: 95, image_url: '/images/junk/gulab-jamun.jpg' },
  { id: 'a1b1c1d1-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Loaded Nachos & Cheese', slug: 'loaded-nachos-cheese', category: 'snacks', calories: 480, carbs: 60.0, protein: 8.0, fat: 25.0, fiber: 3.0, sugar: 3.0, sodium: 810, iron: 1.8, calcium: 120, potassium: 220, image_url: '/images/junk/nachos.jpg' },
  { id: 'a1b1c1d1-ffff-ffff-ffff-ffffffffffff', name: 'Double Cheese Chicken Burger', slug: 'chicken-burger', category: 'fastfood', calories: 540, carbs: 48.0, protein: 22.0, fat: 28.0, fiber: 2.0, sugar: 7.0, sodium: 980, iron: 2.5, calcium: 110, potassium: 280, image_url: '/images/junk/burger.jpg' },
  { id: 'a1b1c1d1-0000-0000-0000-000000000000', name: 'Chole Bhature', slug: 'chole-bhature', category: 'breakfast', calories: 450, carbs: 55.0, protein: 9.0, fat: 22.0, fiber: 4.5, sugar: 2.0, sodium: 850, iron: 2.4, calcium: 90, potassium: 310, image_url: '/images/junk/chole-bhature.jpg' },
  { id: 'a1b1c1d1-0001-0000-0000-000000000000', name: 'Cutting Masala Chai (Sugary)', slug: 'sugary-masala-chai', category: 'drinks', calories: 120, carbs: 18.0, protein: 2.0, fat: 4.0, fiber: 0.0, sugar: 18.0, sodium: 40, iron: 0.1, calcium: 70, potassium: 85, image_url: '/images/junk/chai.jpg' },
  { id: 'a1b1c1d1-0003-0000-0000-000000000000', name: 'Fried Fish Tikka', slug: 'fried-fish-tikka', category: 'fastfood', calories: 290, carbs: 12.0, protein: 16.0, fat: 18.0, fiber: 0.5, sugar: 0.0, sodium: 720, iron: 1.0, calcium: 40, potassium: 220, image_url: '/images/junk/fried-fish.jpg' },
  { id: 'a1b1c1d1-0004-0000-0000-000000000000', name: 'Sugary Frosted Flakes Cereal', slug: 'frosted-flakes-cereal', category: 'breakfast', calories: 375, carbs: 89.0, protein: 4.5, fat: 1.0, fiber: 2.0, sugar: 37.0, sodium: 729, iron: 9.0, calcium: 10, potassium: 95, image_url: '/images/junk/cereal.jpg' },
  { id: 'a1b1c1d1-0005-0000-0000-000000000000', name: 'Pav Bhaji (Excess Butter)', slug: 'butter-pav-bhaji', category: 'breakfast', calories: 400, carbs: 54.0, protein: 8.0, fat: 18.0, fiber: 4.0, sugar: 4.0, sodium: 890, iron: 2.2, calcium: 65, potassium: 280, image_url: '/images/junk/pav-bhaji.jpg' }
];

export const mockHealthyAlternatives: HealthyAlternative[] = [
  { id: 'e1f1a1b1-1111-1111-1111-111111111111', name: 'Foxtail Millet Noodles', slug: 'foxtail-millet-noodles', category: 'snacks', calories: 290, carbs: 52.0, protein: 11.5, fiber: 8.0, fat: 2.5, sugar: 0.5, sodium: 120, iron: 3.5, calcium: 65, potassium: 280, image_url: '/images/healthy/millet-noodles.jpg', description: 'Air-dried, high-protein millet noodles that satisfy instant noodle cravings without the deep-fried trans fat and refined maida flour.' },
  { id: 'e1f1a1b1-2222-2222-2222-222222222222', name: 'Air-Baked Whole Wheat Samosa', slug: 'air-baked-samosa', category: 'snacks', calories: 130, carbs: 18.0, protein: 4.5, fiber: 4.0, fat: 3.5, sugar: 0.8, sodium: 180, iron: 2.0, calcium: 30, potassium: 160, image_url: '/images/healthy/baked-samosa.jpg', description: 'Crisp samosas baked in an air-fryer using a thin whole wheat crust. Saves over 50% fat and 130 calories per piece.' },
  { id: 'e1f1a1b1-2223-2222-2222-222222222222', name: 'Roasted Mint Makhana (Foxnuts)', slug: 'roasted-mint-makhana', category: 'snacks', calories: 95, carbs: 14.0, protein: 3.0, fiber: 2.5, fat: 2.0, sugar: 0.1, sodium: 95, iron: 1.4, calcium: 60, potassium: 350, image_url: '/images/healthy/makhana.jpg', description: 'Crunchy lotus seeds dry-roasted and lightly tossed in olive oil and mint spice. Low GI, high fiber snack.' },
  { id: 'e1f1a1b1-3333-3333-3333-333333333333', name: 'Fresh Tender Coconut Water', slug: 'tender-coconut-water', category: 'drinks', calories: 19, carbs: 4.5, protein: 0.7, fiber: 1.1, fat: 0.2, sugar: 3.5, sodium: 25, iron: 0.3, calcium: 24, potassium: 250, image_url: '/images/healthy/coconut-water.jpg', description: 'Naturally refreshing, zero-sugar-added hydration packed with essential potassium, magnesium, and active enzymes.' },
  { id: 'e1f1a1b1-3334-3333-3333-333333333333', name: 'Organic Lemon Ginger Kombucha', slug: 'lemon-ginger-kombucha', category: 'drinks', calories: 30, carbs: 7.0, protein: 0.2, fiber: 0.5, fat: 0.0, sugar: 4.0, sodium: 10, iron: 0.1, calcium: 10, potassium: 30, image_url: '/images/healthy/kombucha.jpg', description: 'Fermented sparkling tea rich in live probiotics to boost gut health. Naturally carbonated swap for sugary sodas.' },
  { id: 'e1f1a1b1-4444-4444-4444-444444444444', name: 'Spiced Roasted Chickpeas', slug: 'roasted-chickpeas', category: 'snacks', calories: 160, carbs: 27.0, protein: 7.5, fiber: 6.0, fat: 3.5, sugar: 0.8, sodium: 140, iron: 2.5, calcium: 40, potassium: 290, image_url: '/images/healthy/chickpeas.jpg', description: 'Bengal gram dry roasted until crispy and seasoned with chaat masala. Low fat, high protein, and high fiber snack.' },
  { id: 'e1f1a1b1-4445-4444-4444-444444444444', name: 'Air-Baked Banana Chips', slug: 'baked-banana-chips', category: 'snacks', calories: 190, carbs: 38.0, protein: 2.0, fiber: 3.5, fat: 4.0, sugar: 12.0, sodium: 90, iron: 1.5, calcium: 25, potassium: 320, image_url: '/images/healthy/banana-chips.jpg', description: 'Thin plantain slices baked with a dash of turmeric and sea salt. Crisp crunch without coconut oil deep frying.' },
  { id: 'e1f1a1b1-5555-5555-5555-555555555555', name: 'Sugar-Free Dark Chocolate (85%)', slug: 'dark-chocolate-85', category: 'desserts', calories: 510, carbs: 30.0, protein: 8.5, fiber: 11.0, fat: 43.0, sugar: 8.0, sodium: 20, image_url: '/images/healthy/dark-chocolate.jpg', description: 'Rich dark chocolate loaded with healthy cocoa solids and antioxidants. Satisfies sweet tooth with minimal impact on blood sugar.' },
  { id: 'e1f1a1b1-6666-6666-6666-666666666666', name: 'Baked Sweet Potato Fries', slug: 'baked-sweet-potato-fries', category: 'fastfood', calories: 140, carbs: 28.0, protein: 2.0, fiber: 3.8, fat: 3.0, sugar: 6.0, sodium: 110, iron: 1.5, calcium: 38, potassium: 470, image_url: '/images/healthy/sweet-potato-fries.jpg', description: 'Sweet potato wedges seasoned with herbs and baked with a touch of olive oil. High in Vitamin A and dietary fiber.' },
  { id: 'e1f1a1b1-7777-7777-7777-777777777777', name: 'Artisanal Whole Wheat Sourdough', slug: 'wheat-sourdough', category: 'breakfast', calories: 210, carbs: 42.0, protein: 8.0, fiber: 4.5, fat: 1.5, sugar: 1.2, sodium: 380, iron: 3.2, calcium: 80, potassium: 190, image_url: '/images/healthy/sourdough.jpg', description: 'Slow-fermented sourdough made with whole wheat. Easier on gut digestion, has a lower glycemic index than commercial white bread.' },
  { id: 'e1f1a1b1-7778-7777-7777-777777777777', name: '100% Sprouted Ragi Bread', slug: 'sprouted-ragi-bread', category: 'breakfast', calories: 180, carbs: 36.0, protein: 6.5, fiber: 6.0, fat: 2.0, sugar: 2.0, sodium: 290, iron: 4.5, calcium: 340, potassium: 220, image_url: '/images/healthy/ragi-bread.jpg', description: 'Dense, nutrient-dense sprouted finger millet bread. Naturally high in calcium and fiber, completely refined flour-free.' },
  { id: 'e1f1a1b1-8888-8888-8888-888888888888', name: 'Mango Chia Seed Pudding', slug: 'mango-chia-pudding', category: 'desserts', calories: 130, carbs: 18.0, protein: 4.0, fiber: 7.0, fat: 5.0, sugar: 11.0, sodium: 30, image_url: '/images/healthy/chia-pudding.jpg', description: 'Creamy almond milk chia pudding layered with fresh Alphonso mango purée. High in Omega-3 fatty acids and soluble fiber.' },
  { id: 'e1f1a1b1-8889-8888-8888-888888888888', name: 'Fresh Raspberry Banana Sorbet', slug: 'raspberry-banana-sorbet', category: 'desserts', calories: 95, carbs: 22.0, protein: 1.5, fiber: 4.2, fat: 0.4, sugar: 15.0, sodium: 5, image_url: '/images/healthy/sorbet.jpg', description: 'Chilled blended raspberries and ripe bananas with a splash of lime. Creamy, dairy-free ice cream swap with no added processed sugar.' },
  { id: 'e1f1a1b1-9999-9999-9999-999999999999', name: 'Cauliflower Crust Veggie Pizza', slug: 'cauliflower-crust-pizza', category: 'fastfood', calories: 180, carbs: 18.0, protein: 12.0, fiber: 4.5, fat: 6.5, sugar: 2.0, sodium: 390, image_url: '/images/healthy/cauli-pizza.jpg', description: 'Low-carb, gluten-free crust made from grated cauliflower and herbs, topped with home-cooked marinara sauce and light mozzarella.' },
  { id: 'e1f1a1b1-9998-9999-9999-999999999999', name: 'Whole Wheat Pesto Garden Pizza', slug: 'pesto-wheat-pizza', category: 'fastfood', calories: 210, carbs: 26.0, protein: 10.5, fiber: 5.0, fat: 8.0, sugar: 1.8, sodium: 410, image_url: '/images/healthy/pesto-pizza.jpg', description: 'Stone-baked whole wheat flatbread base spread with fresh basil pine nut pesto and loaded with seasonal bell peppers, zucchini, and mushrooms.' },
  { id: 'e1f1a1b1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Cinnamon Honey Apple Jalebi (Baked)', slug: 'baked-apple-jalebi', category: 'desserts', calories: 140, carbs: 32.0, protein: 1.5, fiber: 3.0, fat: 2.5, sugar: 22.0, sodium: 40, image_url: '/images/healthy/apple-jalebi.jpg', description: 'Baked fresh apple rings dipped in a light batter and glazed with organic raw honey and cinnamon. Avoids ghee deep-frying.' },
  { id: 'e1f1a1b1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Steamed Beetroot & Oats Wheat Momos', slug: 'steamed-beetroot-momos', category: 'fastfood', calories: 160, carbs: 28.0, protein: 6.5, fiber: 3.8, fat: 2.0, sugar: 1.5, sodium: 310, image_url: '/images/healthy/beetroot-momos.jpg', description: 'Steamed momos made with a whole wheat flour wrapper, stuffed with high-protein paneer, carrots, and fiber-rich rolled oats.' },
  { id: 'e1f1a1b1-bbbc-bbbb-bbbb-bbbbbbbbbbbb', name: 'Crunchy Cabbage Wrap Dumplings', slug: 'cabbage-wrap-dumplings', category: 'fastfood', calories: 110, carbs: 12.0, protein: 8.0, fiber: 3.5, fat: 1.0, sugar: 1.0, sodium: 240, image_url: '/images/healthy/cabbage-dumplings.jpg', description: 'Gluten-free, wrapperless steamed dumplings wrapped in local cabbage leaves. Stuffed with minced mushrooms, beans, and sprouts.' },
  { id: 'e1f1a1b1-cccc-cccc-cccc-cccccccccccc', name: 'Tandoori Grilled Paneer Tikka', slug: 'paneer-tikka', category: 'fastfood', calories: 190, carbs: 6.0, protein: 15.0, fiber: 1.8, fat: 12.0, sugar: 1.5, sodium: 410, image_url: '/images/healthy/paneer-tikka.jpg', description: 'Cottage cheese cubes marinated in spiced yogurt and roasted in a clay oven. Low fat, high protein swap for gravy-heavy paneer.' },
  { id: 'e1f1a1b1-cccd-cccc-cccc-cccccccccccc', name: 'Grilled Garlic Herb Tofu Tikka', slug: 'garlic-tofu-tikka', category: 'fastfood', calories: 140, carbs: 4.5, protein: 14.5, fiber: 2.2, fat: 7.5, sugar: 0.5, sodium: 290, image_url: '/images/healthy/tofu-tikka.jpg', description: 'Organic firm tofu marinated in a mustard garlic green herb paste and grilled. High plant protein, low saturated fat.' },
  { id: 'e1f1a1b1-dddd-dddd-dddd-dddddddddddd', name: 'Baked Cardamom Date Oats Bites', slug: 'date-oats-bites', category: 'desserts', calories: 85, carbs: 20.0, protein: 2.0, fiber: 3.0, fat: 1.5, sugar: 9.0, sodium: 15, image_url: '/images/healthy/date-bites.jpg', description: 'Sweet treats made with pureed organic dates, rolled oats, and cardamom. Baked to a chewy perfection, rich in iron, zero added sugar.' },
  { id: 'e1f1a1b1-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Air-Baked Corn Tortillas & Fresh Guac', slug: 'baked-nachos-guac', category: 'snacks', calories: 220, carbs: 28.0, protein: 4.0, fiber: 6.5, fat: 10.0, sugar: 1.0, sodium: 210, image_url: '/images/healthy/nachos-guac.jpg', description: 'Baked yellow corn tortilla triangles served with freshly mashed avocado, tomatoes, lime, and cilantro. Filled with healthy fats and fiber.' },
  { id: 'e1f1a1b1-eeef-eeee-eeee-eeeeeeeeeeee', name: 'Dehydrated Spicy Sea Salt Beet Chips', slug: 'beet-chips', category: 'snacks', calories: 110, carbs: 22.0, protein: 2.5, fiber: 4.0, fat: 0.8, sugar: 14.0, sodium: 180, image_url: '/images/healthy/beet-chips.jpg', description: 'Crisp beetroot slices slow-dehydrated or baked with a pinch of sea salt and pepper. Rich in dietary nitrates and natural fiber.' },
  { id: 'e1f1a1b1-ffff-ffff-ffff-ffffffffffff', name: 'Grilled Chicken Breast Wheat Burger', slug: 'grilled-chicken-burger', category: 'fastfood', calories: 340, carbs: 32.0, protein: 32.0, fiber: 5.0, fat: 9.5, sugar: 3.0, sodium: 480, image_url: '/images/healthy/chicken-burger.jpg', description: 'Juicy grilled chicken breast fillet on a whole wheat bun, topped with lettuce, tomato, and greek yogurt spread instead of mayonnaise.' },
  { id: 'e1f1a1b1-fffe-ffff-ffff-ffffffffffff', name: 'Lettuce-Wrapped Spicy Black Bean Burger', slug: 'black-bean-lettuce-burger', category: 'fastfood', calories: 210, carbs: 18.0, protein: 12.0, fiber: 7.5, fat: 4.5, sugar: 2.0, sodium: 390, image_url: '/images/healthy/lettuce-burger.jpg', description: 'Flavorful roasted black bean and quinoa patty wrapped in fresh iceberg lettuce leaves, served with tomato salsa. Low carb, high fiber.' },
  { id: 'e1f1a1b1-0000-0000-0000-000000000000', name: 'Spiced Chole with Baked Oats Roti', slug: 'chole-oats-roti', category: 'breakfast', calories: 240, carbs: 38.0, protein: 9.0, fiber: 8.5, fat: 4.5, sugar: 1.5, sodium: 390, image_url: '/images/healthy/chole-oats.jpg', description: 'Traditional spicy chickpeas cooked in 1 tsp olive oil, served with 2 baked whole wheat and oats flour rotis.' },
  { id: 'e1f1a1b1-0001-0000-0000-000000000000', name: 'Cardamom Ginger Green Tea (Stevia)', slug: 'ginger-green-tea', category: 'drinks', calories: 5, carbs: 1.0, protein: 0.1, fiber: 0.0, fat: 0.0, sugar: 0.0, sodium: 5, image_url: '/images/healthy/green-tea.jpg', description: 'Freshly brewed loose leaf green tea infused with real ginger roots and cardamom pods, lightly sweetened with natural stevia extract.' },
  { id: 'e1f1a1b1-0002-0000-0000-000000000000', name: 'Masala Oats Chai (Jaggery Glazed)', slug: 'oats-milk-chai', category: 'drinks', calories: 45, carbs: 8.0, protein: 1.5, fiber: 0.8, fat: 1.0, sugar: 5.0, sodium: 15, image_url: '/images/healthy/oats-chai.jpg', description: 'Authentic Indian spiced chai made with creamy, unsweetened oat milk, sweetened lightly with 1 tsp of organic liquid jaggery.' },
  { id: 'e1f1a1b1-0003-0000-0000-000000000000', name: 'Clay-Oven Roasted Tandoori Fish Tikka', slug: 'tandoori-fish-tikka', category: 'fastfood', calories: 160, carbs: 3.0, protein: 24.0, fiber: 0.5, fat: 6.0, sugar: 0.0, sodium: 380, image_url: '/images/healthy/tandoori-fish.jpg', description: 'Lean fish fillets (Basa/Surmai) marinated in yogurt and clay-oven grilled. Super high protein, low carb, low fat.' },
  { id: 'e1f1a1b1-0004-0000-0000-000000000000', name: 'Steel Cut Oats with Berries & Seeds', slug: 'berry-seeds-oats', category: 'breakfast', calories: 220, carbs: 34.0, protein: 7.0, fiber: 6.5, fat: 4.5, sugar: 6.0, sodium: 10, image_url: '/images/healthy/oats-breakfast.jpg', description: 'Hot steel cut oats prepared with water or skimmed milk, topped with local berries and pumpkin/chia seeds.' },
  { id: 'e1f1a1b1-0005-0000-0000-000000000000', name: 'Oats Pav & Loaded Veggie Bhaji', slug: 'oats-pav-bhaji', category: 'breakfast', calories: 220, carbs: 36.0, protein: 6.0, fiber: 7.5, fat: 5.0, sugar: 3.5, sodium: 490, image_url: '/images/healthy/healthy-pav-bhaji.jpg', description: 'Bhaji cooked with high amounts of cauliflower, peas, and carrots using minimal oil, served with 2 high-fiber baked oats and wheat pavs.' }
];

export const mockAlternativeMappings: AlternativeMapping[] = [
  { junk_item_id: 'a1b1c1d1-1111-1111-1111-111111111111', alternative_id: 'e1f1a1b1-1111-1111-1111-111111111111', similarity_reason: 'Provides the same savory masala noodle taste and hot texture, but uses air-dried foxtail millet, reducing calories by 90 kcal, cutting fat by 80%, and providing 8g of prebiotic fiber.' },
  { junk_item_id: 'a1b1c1d1-2222-2222-2222-222222222222', alternative_id: 'e1f1a1b1-2222-2222-2222-222222222222', similarity_reason: 'Retains the iconic crunchy potato-pea crust feel but is baked in an air-fryer, saving over 130 calories and 80% of saturated oil fat per piece.' },
  { junk_item_id: 'a1b1c1d1-2222-2222-2222-222222222222', alternative_id: 'e1f1a1b1-2223-2222-2222-222222222222', similarity_reason: 'Replaces the deep-fried, carb-heavy snack with dry-roasted foxnuts, offering a low glycemic index, high fiber alternative with a crisp crunch.' },
  { junk_item_id: 'a1b1c1d1-3333-3333-3333-333333333333', alternative_id: 'e1f1a1b1-3333-3333-3333-333333333333', similarity_reason: 'Swaps high-fructose corn syrup soda with pure coconut water, replacing 39g of refined sugar with natural minerals and electrolytes for natural hydration.' },
  { junk_item_id: 'a1b1c1d1-3333-3333-3333-333333333333', alternative_id: 'e1f1a1b1-3334-3333-3333-333333333333', similarity_reason: 'Replaces carbonic acid and sugary sodas with a probiotic sparkling kombucha, delivering fizz and gut-health benefits with only 4g of sugar.' },
  { junk_item_id: 'a1b1c1d1-4444-4444-4444-444444444444', alternative_id: 'e1f1a1b1-4444-4444-4444-444444444444', similarity_reason: 'Swaps oil-soaked processed potato starch with fiber-rich roasted chickpeas, boosting protein by 7x while cutting fat by 90%.' },
  { junk_item_id: 'a1b1c1d1-4444-4444-4444-444444444444', alternative_id: 'e1f1a1b1-4445-4444-4444-444444444444', similarity_reason: 'Keeps the sweet-savory chip crunch but uses air-baked plantain slices, slashing high-calorie trans-fats from deep frying.' },
  { junk_item_id: 'a1b1c1d1-5555-5555-5555-555555555555', alternative_id: 'e1f1a1b1-5555-5555-5555-555555555555', similarity_reason: 'Replaces processed milk solids and 56g of sugar with antioxidant-rich cocoa solids, keeping the sweet craving checked with minimal insulin spikes.' },
  { junk_item_id: 'a1b1c1d1-6666-6666-6666-666666666666', alternative_id: 'e1f1a1b1-6666-6666-6666-666666666666', similarity_reason: 'Swaps double-fried white potato strips with baked sweet potato wedges, boosting vitamin A/fiber and cutting fat by 80%.' },
  { junk_item_id: 'a1b1c1d1-7777-7777-7777-777777777777', alternative_id: 'e1f1a1b1-7777-7777-7777-777777777777', similarity_reason: 'Swaps chemically bleached white flour with slow-fermented wheat sourdough, which contains prebiotic-like compounds that ease gut digestion.' },
  { junk_item_id: 'a1b1c1d1-7777-7777-7777-777777777777', alternative_id: 'e1f1a1b1-7778-7777-7777-777777777777', similarity_reason: 'Replaces high GI empty-calorie white bread with finger millet (Ragi) bread, increasing calcium intake and doubling fiber content.' },
  { junk_item_id: 'a1b1c1d1-8888-8888-8888-888888888888', alternative_id: 'e1f1a1b1-8888-8888-8888-888888888888', similarity_reason: 'Provides a cold, thick, sweet dessert experience using high-fiber chia seeds and almond milk, packed with healthy omega-3 fatty acids.' },
  { junk_item_id: 'a1b1c1d1-8888-8888-8888-888888888888', alternative_id: 'e1f1a1b1-8889-8888-8888-888888888888', similarity_reason: 'Replaces processed sugar/cream-based ice cream with blended frozen raspberries and bananas, supplying active vitamins and zero added sweeteners.' },
  { junk_item_id: 'a1b1c1d1-9999-9999-9999-999999999999', alternative_id: 'e1f1a1b1-9999-9999-9999-999999999999', similarity_reason: 'Swaps high-carbohydrate refined flour dough with a vitamin-dense cauliflower crust, reducing calories by 100+ and carbs by 70%.' },
  { junk_item_id: 'a1b1c1d1-9999-9999-9999-999999999999', alternative_id: 'e1f1a1b1-9998-9999-9999-999999999999', similarity_reason: 'Replaces grease-laden processed cheese and meats with whole wheat dough topped with olive-oil basil pesto and raw, fiber-rich vegetables.' },
  { junk_item_id: 'a1b1c1d1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', alternative_id: 'e1f1a1b1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', similarity_reason: 'Replaces oil-soaked deep-fried batter with sweet baked apple rings glazed in raw honey, cutting processed sugars and heavy ghee saturates.' },
  { junk_item_id: 'a1b1c1d1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', alternative_id: 'e1f1a1b1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', similarity_reason: 'Swaps oil-fried white flour momos with steamed whole wheat momos containing lean paneer and fiber-rich oats, lowering fat by 85%.' },
  { junk_item_id: 'a1b1c1d1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', alternative_id: 'e1f1a1b1-bbbc-bbbb-bbbb-bbbbbbbbbbbb', similarity_reason: 'Replaces starch wrappers with crisp steamed cabbage leaves, lowering overall carbs to near-zero while keeping the savory dumpling experience.' },
  { junk_item_id: 'a1b1c1d1-cccc-cccc-cccc-cccccccccccc', alternative_id: 'e1f1a1b1-cccc-cccc-cccc-cccccccccccc', similarity_reason: 'Swaps heavy cream-and-butter tomato gravy with spiced tandoor-charred cottage cheese skewers, lowering calories by 50% and doubling protein absorption.' },
  { junk_item_id: 'a1b1c1d1-cccc-cccc-cccc-cccccccccccc', alternative_id: 'e1f1a1b1-cccd-cccc-cccc-cccccccccccc', similarity_reason: 'Offers a dairy-free, low cholesterol option using grilled firm organic tofu skewers marinated in heart-healthy mustard oil and garlic.' },
  { junk_item_id: 'a1b1c1d1-dddd-dddd-dddd-dddddddddddd', alternative_id: 'e1f1a1b1-dddd-dddd-dddd-dddddddddddd', similarity_reason: 'Swaps deep-fried milk powder balls soaked in sugar syrup with baked date and oat balls, replacing empty calories with dietary iron and fiber.' },
  { junk_item_id: 'a1b1c1d1-eeee-eeee-eeee-eeeeeeeeeeee', alternative_id: 'e1f1a1b1-eeee-eeee-eeee-eeeeeeeeeeee', similarity_reason: 'Replaces fried corn flour chips and processed cheese sauce with oven-baked tortillas and fresh, heart-healthy monounsaturated fat from avocados.' },
  { junk_item_id: 'a1b1c1d1-eeee-eeee-eeee-eeeeeeeeeeee', alternative_id: 'e1f1a1b1-eeef-eeee-eeee-eeeeeeeeeeee', similarity_reason: 'A dry crunchy snack alternative using dehydrated beet slices, containing natural nitrates that support cardiovascular blood flow.' },
  { junk_item_id: 'a1b1c1d1-ffff-ffff-ffff-ffffffffffff', alternative_id: 'e1f1a1b1-ffff-ffff-ffff-ffffffffffff', similarity_reason: 'Replaces fried chicken patties and heavy mayo with grilled chicken breast and protein-rich Greek yogurt dressing on whole wheat buns.' },
  { junk_item_id: 'a1b1c1d1-ffff-ffff-ffff-ffffffffffff', alternative_id: 'e1f1a1b1-fffe-ffff-ffff-ffffffffffff', similarity_reason: 'Swaps beef/processed patties and white buns with high-fiber black bean patties wrapped in fresh crunchy iceberg lettuce leaf cups.' },
  { junk_item_id: 'a1b1c1d1-0000-0000-0000-000000000000', alternative_id: 'e1f1a1b1-0000-0000-0000-000000000000', similarity_reason: 'Swaps deep-fried refined flour bhatura bread with fiber-rich baked whole-wheat oats roti, and reduces gravy oil fat.' },
  { junk_item_id: 'a1b1c1d1-0001-0000-0000-000000000000', alternative_id: 'e1f1a1b1-0001-0000-0000-000000000000', similarity_reason: 'Avoids processed white sugar and high fat buffalo milk, substituting antioxidant green tea infused with warm, gut-soothing spices.' },
  { junk_item_id: 'a1b1c1d1-0001-0000-0000-000000000000', alternative_id: 'e1f1a1b1-0002-0000-0000-000000000000', similarity_reason: 'Replaces regular sugary milk tea with low-glycemic oat milk chai, flavored with ginger and a dash of raw minerals from organic jaggery.' },
  { junk_item_id: 'a1b1c1d1-0003-0000-0000-000000000000', alternative_id: 'e1f1a1b1-0003-0000-0000-000000000000', similarity_reason: 'Swaps oil-fried fish batter with tandoori grilled fish, preserving lean proteins and healthy Omega-3 fats while eliminating trans-fats.' },
  { junk_item_id: 'a1b1c1d1-0004-0000-0000-000000000000', alternative_id: 'e1f1a1b1-0004-0000-0000-000000000000', similarity_reason: 'Replaces high GI sugar-coated corn flakes with steel cut oats, stabilizing blood sugar and providing long-lasting energy from complex carbs.' },
  { junk_item_id: 'a1b1c1d1-0005-0000-0000-000000000000', alternative_id: 'e1f1a1b1-0005-0000-0000-000000000000', similarity_reason: 'Swaps heavily buttered white pav bread and oily bhaji with high-fiber baked oats-wheat pav and a veggie-loaded bhaji made in minimal fat.' }
];

export interface Gym {
  id: string;
  name: string;
  rating: number;
  monthly_fee: number;
  distance_text: string;
  latitude: number;
  longitude: number;
  address: string;
  amenities: string[];
  is_value_pick: boolean;
  image_url?: string;
  contact_number?: string;
}

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  category: string; // 'protein' | 'creatine' | 'preworkout' | 'multivitamin' | 'omega3'
  price: number;
  servings: number;
  dose_per_serving: string;
  price_per_serving: number;
  rating: number;
  tier: 'market_leader' | 'value_pick';
  buy_links: {
    amazon?: string;
    blinkit?: string;
    zepto?: string;
    instamart?: string;
    healthkart?: string;
  };
  image_url?: string;
  benefits: string;
}

export const mockGyms: Gym[] = [
  // Indiranagar, Bengaluru
  {
    id: 'g-1',
    name: 'Cult.fit Elite Indiranagar',
    rating: 4.8,
    monthly_fee: 3000,
    distance_text: '0.5 km',
    latitude: 12.971891,
    longitude: 77.641151,
    address: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    amenities: ['Group Workouts', 'Strength Training', 'Yoga', 'Boxing', 'Shower'],
    is_value_pick: false,
    image_url: '/images/gyms/cult_indiranagar.jpg',
    contact_number: '919876543201'
  },
  {
    id: 'g-2',
    name: "Gold's Gym Indiranagar",
    rating: 4.5,
    monthly_fee: 4500,
    distance_text: '0.9 km',
    latitude: 12.975000,
    longitude: 77.643000,
    address: 'Double Road, Indiranagar, Bengaluru',
    amenities: ['Strength Training', 'Cardio Machines', 'Personal Training', 'Steam Room'],
    is_value_pick: false,
    image_url: '/images/gyms/golds_indiranagar.jpg',
    contact_number: '919876543202'
  },
  {
    id: 'g-3',
    name: 'Snap Fitness 24/7 Indiranagar',
    rating: 4.2,
    monthly_fee: 2500,
    distance_text: '1.2 km',
    latitude: 12.969000,
    longitude: 77.638000,
    address: '100 Feet Road, Indiranagar, Bengaluru',
    amenities: ['24/7 Access', 'Cardio Machines', 'Strength Training', 'Free Wi-Fi'],
    is_value_pick: false,
    image_url: '/images/gyms/snap_indiranagar.jpg',
    contact_number: '919876543203'
  },
  {
    id: 'g-4',
    name: 'Peak Iron Fitness Gym',
    rating: 4.4,
    monthly_fee: 1500,
    distance_text: '0.7 km',
    latitude: 12.973000,
    longitude: 77.640000,
    address: 'Lashkar Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    amenities: ['Strength Training', 'Free Weights', 'Cardio Area'],
    is_value_pick: true,
    image_url: '/images/gyms/peak_indiranagar.jpg',
    contact_number: '919876543204'
  },

  // Bandra West, Mumbai
  {
    id: 'g-5',
    name: "Gold's Gym Bandra",
    rating: 4.7,
    monthly_fee: 6000,
    distance_text: '0.6 km',
    latitude: 19.060691,
    longitude: 72.836250,
    address: 'Carter Road, Bandra West, Mumbai',
    amenities: ['Strength Training', 'Cardio Machines', 'Personal Training', 'Valet Parking', 'Steam Room'],
    is_value_pick: false,
    image_url: '/images/gyms/golds_bandra.jpg',
    contact_number: '919876543205'
  },
  {
    id: 'g-6',
    name: 'Waves Gym Bandra',
    rating: 4.6,
    monthly_fee: 5000,
    distance_text: '0.8 km',
    latitude: 19.058000,
    longitude: 72.838000,
    address: 'Linking Road, Bandra West, Mumbai',
    amenities: ['Spin Classes', 'Strength Training', 'Cardio Area', 'Steam Bath', 'Juice Bar'],
    is_value_pick: false,
    image_url: '/images/gyms/waves_bandra.jpg',
    contact_number: '919876543206'
  },
  {
    id: 'g-7',
    name: 'Cult.fit Bandra West',
    rating: 4.5,
    monthly_fee: 3500,
    distance_text: '1.1 km',
    latitude: 19.063000,
    longitude: 72.834000,
    address: 'Pali Hill, Bandra West, Mumbai',
    amenities: ['Group Workouts', 'Strength Training', 'Yoga', 'Boxing'],
    is_value_pick: false,
    image_url: '/images/gyms/cult_bandra.jpg',
    contact_number: '919876543207'
  },
  {
    id: 'g-8',
    name: 'Iron Temple Bodybuilding Gym',
    rating: 4.3,
    monthly_fee: 1800,
    distance_text: '0.5 km',
    latitude: 19.061000,
    longitude: 72.835000,
    address: 'Juhu Tara Road, Bandra, Mumbai',
    amenities: ['Free Weights', 'Strength Training', 'Personal Training'],
    is_value_pick: true,
    image_url: '/images/gyms/irontemple_bandra.jpg',
    contact_number: '919876543208'
  },

  // Connaught Place, New Delhi
  {
    id: 'g-9',
    name: "Gold's Gym Connaught Place",
    rating: 4.6,
    monthly_fee: 5000,
    distance_text: '0.4 km',
    latitude: 28.630400,
    longitude: 77.217700,
    address: 'Outer Circle, Connaught Place, New Delhi',
    amenities: ['Strength Training', 'Cardio Machines', 'Spa', 'Personal Training'],
    is_value_pick: false,
    image_url: '/images/gyms/golds_cp.jpg',
    contact_number: '919876543209'
  },
  {
    id: 'g-10',
    name: 'Anytime Fitness CP',
    rating: 4.5,
    monthly_fee: 3500,
    distance_text: '0.8 km',
    latitude: 28.632000,
    longitude: 77.215000,
    address: 'Inner Circle, Connaught Place, New Delhi',
    amenities: ['24/7 Access', 'Cardio Machines', 'Strength Training', 'Private Showers'],
    is_value_pick: false,
    image_url: '/images/gyms/anytime_cp.jpg',
    contact_number: '919876543210'
  },
  {
    id: 'g-11',
    name: 'Cult.fit Connaught Place',
    rating: 4.7,
    monthly_fee: 3200,
    distance_text: '1.0 km',
    latitude: 28.628000,
    longitude: 77.220000,
    address: 'Khan Market, Near CP, New Delhi',
    amenities: ['Group Workouts', 'Boxing', 'Strength Training', 'Yoga'],
    is_value_pick: false,
    image_url: '/images/gyms/cult_cp.jpg',
    contact_number: '919876543211'
  },
  {
    id: 'g-12',
    name: 'Delhi Fitness Club CP',
    rating: 4.1,
    monthly_fee: 1200,
    distance_text: '0.5 km',
    latitude: 28.631000,
    longitude: 77.218000,
    address: 'M-Block, Connaught Place, New Delhi',
    amenities: ['Cardio Machines', 'Strength Training', 'Free Weights'],
    is_value_pick: true,
    image_url: '/images/gyms/delhifitness_cp.jpg',
    contact_number: '919876543212'
  },

  // Gachibowli, Hyderabad
  {
    id: 'g-13',
    name: 'Cult.fit Gachibowli',
    rating: 4.7,
    monthly_fee: 2800,
    distance_text: '0.7 km',
    latitude: 17.440081,
    longitude: 78.348915,
    address: 'DLF Cybercity Road, Gachibowli, Hyderabad',
    amenities: ['Group Workouts', 'Strength Training', 'Yoga', 'Boxing', 'Shower'],
    is_value_pick: false,
    image_url: '/images/gyms/cult_gachibowli.jpg',
    contact_number: '919876543213'
  },
  {
    id: 'g-14',
    name: 'Nitro Gym Gachibowli',
    rating: 4.5,
    monthly_fee: 4000,
    distance_text: '1.2 km',
    latitude: 17.438000,
    longitude: 78.352000,
    address: 'Hitech City Road, Gachibowli, Hyderabad',
    amenities: ['Jacuzzi', 'Steam Room', 'Cardio Area', 'Strength Training', 'Zumba'],
    is_value_pick: false,
    image_url: '/images/gyms/nitro_gachibowli.jpg',
    contact_number: '919876543214'
  },
  {
    id: 'g-15',
    name: 'Anytime Fitness Gachibowli',
    rating: 4.4,
    monthly_fee: 3200,
    distance_text: '1.5 km',
    latitude: 17.443000,
    longitude: 78.345000,
    address: 'Kondapur Main Road, Near Gachibowli, Hyderabad',
    amenities: ['24/7 Access', 'Cardio Machines', 'Strength Training', 'Personal Training'],
    is_value_pick: false,
    image_url: '/images/gyms/anytime_gachibowli.jpg',
    contact_number: '919876543215'
  },
  {
    id: 'g-16',
    name: 'Fit-Life Iron Gym Gachibowli',
    rating: 4.2,
    monthly_fee: 1200,
    distance_text: '0.6 km',
    latitude: 17.441000,
    longitude: 78.349000,
    address: 'Gachibowli X Roads, Hyderabad',
    amenities: ['Free Weights', 'Strength Training', 'Cardio Area'],
    is_value_pick: true,
    image_url: '/images/gyms/fitlife_gachibowli.jpg',
    contact_number: '919876543216'
  },

  // Koregaon Park, Pune
  {
    id: 'g-17',
    name: "Gold's Gym Koregaon Park",
    rating: 4.8,
    monthly_fee: 5500,
    distance_text: '0.6 km',
    latitude: 18.536200,
    longitude: 73.893000,
    address: 'North Main Road, Koregaon Park, Pune',
    amenities: ['Swimming Pool', 'Spa', 'Strength Training', 'Cardio Machines', 'Personal Training'],
    is_value_pick: false,
    image_url: '/images/gyms/golds_kp.jpg',
    contact_number: '919876543217'
  },
  {
    id: 'g-18',
    name: 'Absolute Fitness KP',
    rating: 4.4,
    monthly_fee: 3500,
    distance_text: '1.0 km',
    latitude: 18.538000,
    longitude: 73.895000,
    address: 'Lane 7, Koregaon Park, Pune',
    amenities: ['Zumba', 'Cardio Machines', 'Strength Training', 'Shower Area'],
    is_value_pick: false,
    image_url: '/images/gyms/absolute_kp.jpg',
    contact_number: '919876543218'
  },
  {
    id: 'g-19',
    name: 'Cult.fit Koregaon Park',
    rating: 4.6,
    monthly_fee: 3000,
    distance_text: '1.3 km',
    latitude: 18.534000,
    longitude: 73.890000,
    address: 'Kalyani Nagar Main Road, Near KP, Pune',
    amenities: ['Group Workouts', 'Strength Training', 'Yoga', 'Boxing', 'Shower'],
    is_value_pick: false,
    image_url: '/images/gyms/cult_kp.jpg',
    contact_number: '919876543219'
  },
  {
    id: 'g-20',
    name: 'Muscle Garage Gym KP',
    rating: 4.3,
    monthly_fee: 1400,
    distance_text: '0.4 km',
    latitude: 18.537000,
    longitude: 73.892000,
    address: "Jogger's Park Road, Koregaon Park, Pune",
    amenities: ['Strength Training', 'Free Weights', 'Personal Training'],
    is_value_pick: true,
    image_url: '/images/gyms/musclegarage_kp.jpg',
    contact_number: '919876543220'
  }
];

export const mockSupplements: Supplement[] = [
  // Whey Protein
  {
    id: 's-1',
    name: 'Gold Standard 100% Whey',
    brand: 'Optimum Nutrition',
    category: 'protein',
    price: 6899,
    servings: 60,
    dose_per_serving: '24g Whey Protein',
    price_per_serving: 114.9,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Optimum+Nutrition+Gold+Standard+Whey',
      blinkit: 'https://blinkit.com/s?q=optimum+nutrition+whey',
      zepto: 'https://www.zeptonow.com/search?q=optimum+nutrition+whey',
      healthkart: 'https://www.healthkart.com/search?q=ON+Gold+Standard+100+Whey'
    },
    image_url: '/images/supps/on_whey.jpg',
    benefits: 'Premium micro-filtered whey isolate & concentrate blend. Ultra-pure protein sources, low carbs, fast absorption, third-party tested for safety.'
  },
  {
    id: 's-2',
    name: 'Gold Whey Protein 100%',
    brand: 'Nakpro',
    category: 'protein',
    price: 2999,
    servings: 60,
    dose_per_serving: '24g Whey Protein',
    price_per_serving: 49.9,
    rating: 4.4,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Nakpro+Gold+Whey+Protein',
      blinkit: 'https://blinkit.com/s?q=nakpro+whey',
      zepto: 'https://www.zeptonow.com/search?q=nakpro+whey',
      healthkart: 'https://www.healthkart.com/search?q=Nakpro+Gold+Whey'
    },
    image_url: '/images/supps/nakpro_whey.jpg',
    benefits: 'Highly affordable 100% whey protein concentrate. Zero added sugar, naturally rich in BCAAs, lab-verified protein content.'
  },

  // Creatine
  {
    id: 's-3',
    name: 'Creatine Monohydrate (Creapure)',
    brand: 'MuscleBlaze',
    category: 'creatine',
    price: 1199,
    servings: 83,
    dose_per_serving: '3g Creapure Creatine',
    price_per_serving: 14.4,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+Creatine+Creapure',
      blinkit: 'https://blinkit.com/s?q=creatine+muscleblaze',
      zepto: 'https://www.zeptonow.com/search?q=creatine+muscleblaze',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+Creapure'
    },
    image_url: '/images/supps/mb_creatine.jpg',
    benefits: 'Uses 100% pure imported German Creapure. Superfine micronized particles for instant solubility. Maximizes muscle ATP production & strength.'
  },
  {
    id: 's-4',
    name: 'Pure Creatine Monohydrate',
    brand: 'Asitis Nutrition',
    category: 'creatine',
    price: 499,
    servings: 100,
    dose_per_serving: '3g Creatine Monohydrate',
    price_per_serving: 4.9,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Asitis+Creatine+Monohydrate',
      blinkit: 'https://blinkit.com/s?q=creatine+asitis',
      zepto: 'https://www.zeptonow.com/search?q=creatine+asitis',
      healthkart: 'https://www.healthkart.com/search?q=Asitis+Creatine'
    },
    image_url: '/images/supps/asitis_creatine.jpg',
    benefits: 'Pure unflavored, additive-free creatine monohydrate. Provides maximum cost efficiency, aids in muscle gains, volumization, and recovery.'
  },

  // Pre-workout
  {
    id: 's-5',
    name: 'C4 Original Pre-Workout',
    brand: 'Cellucor',
    category: 'preworkout',
    price: 2499,
    servings: 30,
    dose_per_serving: '1.6g Beta-Alanine, 150mg Caffeine',
    price_per_serving: 83.3,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Cellucor+C4+Original',
      blinkit: 'https://blinkit.com/s?q=c4+preworkout',
      zepto: 'https://www.zeptonow.com/search?q=c4+preworkout',
      healthkart: 'https://www.healthkart.com/search?q=Cellucor+C4'
    },
    image_url: '/images/supps/c4_preworkout.jpg',
    benefits: 'Industry-standard clinical blend of explosive energy booster, CarnoSyn Beta-Alanine for endurance, and Arginine Nitrate for intense pumps.'
  },
  {
    id: 's-6',
    name: 'Pre-Workout WrathX',
    brand: 'MuscleBlaze',
    category: 'preworkout',
    price: 1399,
    servings: 30,
    dose_per_serving: '3g Citrulline, 200mg Caffeine',
    price_per_serving: 46.6,
    rating: 4.4,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+WrathX+Preworkout',
      blinkit: 'https://blinkit.com/s?q=muscleblaze+preworkout',
      zepto: 'https://www.zeptonow.com/search?q=muscleblaze+preworkout',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+WrathX'
    },
    image_url: '/images/supps/mb_preworkout.jpg',
    benefits: 'Affordable performance blend featuring L-Citrulline Malate, Caffeine, and Beta-Alanine for focus, endurance, and extreme vascularity.'
  },

  // Multivitamin
  {
    id: 's-7',
    name: 'Mega Men One Daily',
    brand: 'GNC',
    category: 'multivitamin',
    price: 1499,
    servings: 60,
    dose_per_serving: '39 Active Nutrients per Tablet',
    price_per_serving: 24.9,
    rating: 4.5,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=GNC+Mega+Men+One+Daily',
      blinkit: 'https://blinkit.com/s?q=gnc+multivitamin',
      zepto: 'https://www.zeptonow.com/search?q=gnc+multivitamin',
      healthkart: 'https://www.healthkart.com/search?q=GNC+Mega+Men'
    },
    image_url: '/images/supps/gnc_multi.jpg',
    benefits: 'Premium comprehensive multivitamin tailored for active men. Contains essential vitamins, muscle support blends, and brain/heart health boosters.'
  },
  {
    id: 's-8',
    name: 'Multivitamin with Probiotics',
    brand: 'Carbamide Forte',
    category: 'multivitamin',
    price: 429,
    servings: 180,
    dose_per_serving: '45 Ingredients per Tablet',
    price_per_serving: 2.3,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Carbamide+Forte+Multivitamin+Probiotics',
      blinkit: 'https://blinkit.com/s?q=carbamide+multivitamin',
      zepto: 'https://www.zeptonow.com/search?q=carbamide+multivitamin',
      healthkart: 'https://www.healthkart.com/search?q=Carbamide+Forte+Multivitamin'
    },
    image_url: '/images/supps/carbamide_multi.jpg',
    benefits: 'Extremely budget-friendly. Packed with 45 vitamins, minerals, and superfoods, combined with direct gut probiotics for maximum absorption.'
  },

  // Omega 3
  {
    id: 's-9',
    name: 'Triple Strength Omega 3',
    brand: 'TrueBasics',
    category: 'omega3',
    price: 1199,
    servings: 60,
    dose_per_serving: '1250mg Fish Oil (560mg EPA / 400mg DHA)',
    price_per_serving: 19.9,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=TrueBasics+Triple+Strength+Omega+3',
      blinkit: 'https://blinkit.com/s?q=omega+3+truebasics',
      zepto: 'https://www.zeptonow.com/search?q=omega+3+truebasics',
      healthkart: 'https://www.healthkart.com/search?q=TrueBasics+Omega+3'
    },
    image_url: '/images/supps/truebasics_omega.jpg',
    benefits: 'Triple strength refined fish oil. Molecularly distilled, cholesterol-free softgels with high concentration of active EPA and DHA fatty acids.'
  },
  {
    id: 's-10',
    name: 'Premium Salmon Fish Oil',
    brand: 'Carbamide Forte',
    category: 'omega3',
    price: 449,
    servings: 120,
    dose_per_serving: '1000mg Fish Oil (180mg EPA / 120mg DHA)',
    price_per_serving: 3.7,
    rating: 4.2,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Carbamide+Forte+Salmon+Fish+Oil',
      blinkit: 'https://blinkit.com/s?q=omega+3+carbamide',
      zepto: 'https://www.zeptonow.com/search?q=omega+3+carbamide',
      healthkart: 'https://www.healthkart.com/search?q=Carbamide+Forte+Fish+Oil'
    },
    image_url: '/images/supps/carbamide_omega.jpg',
    benefits: 'High affordability per capsule. Sourced from cold-water salmon, supports heart, joint, and skin health with baseline macro Omega-3 ratios.'
  },
  {
    id: 's-11',
    name: 'Impact Whey Protein',
    brand: 'Myprotein',
    category: 'protein',
    price: 3499,
    servings: 40,
    dose_per_serving: '21g Whey Protein',
    price_per_serving: 87.4,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Myprotein+Impact+Whey',
      blinkit: 'https://blinkit.com/s?q=myprotein+whey',
      zepto: 'https://www.zeptonow.com/search?q=myprotein+whey',
      healthkart: 'https://www.healthkart.com/search?q=Myprotein+Impact+Whey'
    },
    image_url: '/images/supps/myprotein_whey.jpg',
    benefits: 'Premium quality grass-fed whey concentrate. Exceptionally high grade, rich in essential amino acids, fast digesting, and widely trusted worldwide.'
  },
  {
    id: 's-12',
    name: 'Atom Whey Protein',
    brand: 'Asitis Nutrition',
    category: 'protein',
    price: 1899,
    servings: 33,
    dose_per_serving: '27g Whey Protein',
    price_per_serving: 57.5,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Asitis+Atom+Whey+Protein',
      blinkit: 'https://blinkit.com/s?q=asitis+atom+whey',
      zepto: 'https://www.zeptonow.com/search?q=asitis+atom+whey',
      healthkart: 'https://www.healthkart.com/search?q=Asitis+Atom+Whey'
    },
    image_url: '/images/supps/asitis_atom_whey.jpg',
    benefits: 'High protein yield per serving at an extremely competitive price. Fortified with digestive enzymes, zero soy, fast recovery support.'
  },
  {
    id: 's-13',
    name: 'Micronized Creatine Powder',
    brand: 'Optimum Nutrition',
    category: 'creatine',
    price: 1499,
    servings: 83,
    dose_per_serving: '3g Micronized Creatine',
    price_per_serving: 18.0,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Optimum+Nutrition+Creatine+Powder',
      blinkit: 'https://blinkit.com/s?q=on+creatine',
      zepto: 'https://www.zeptonow.com/search?q=on+creatine',
      healthkart: 'https://www.healthkart.com/search?q=ON+Micronized+Creatine'
    },
    image_url: '/images/supps/on_creatine.jpg',
    benefits: 'Industry gold standard pure micronized creatine. Zero fillers, tasteless, mixes effortlessly in any beverage, highly clinically supported for power output.'
  },
  {
    id: 's-14',
    name: 'Pure Wellcore Creatine',
    brand: 'Wellcore',
    category: 'creatine',
    price: 649,
    servings: 83,
    dose_per_serving: '3g Pure Creatine',
    price_per_serving: 7.8,
    rating: 4.5,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Wellcore+Creatine',
      blinkit: 'https://blinkit.com/s?q=wellcore+creatine',
      zepto: 'https://www.zeptonow.com/search?q=wellcore+creatine',
      healthkart: 'https://www.healthkart.com/search?q=Wellcore+Creatine'
    },
    image_url: '/images/supps/wellcore_creatine.jpg',
    benefits: '100% pure micronized creatine monohydrate. No sugar, no artificial colors, ultra-solubility, popular budget-friendly staple for cellular hydration.'
  },
  {
    id: 's-15',
    name: 'Psychotic Pre-Workout',
    brand: 'Insane Labz',
    category: 'preworkout',
    price: 2999,
    servings: 35,
    dose_per_serving: '3.2g Beta-Alanine, 400mg Caffeine',
    price_per_serving: 85.6,
    rating: 4.5,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Insane+Labz+Psychotic',
      blinkit: 'https://blinkit.com/s?q=psychotic+preworkout',
      zepto: 'https://www.zeptonow.com/search?q=psychotic+preworkout',
      healthkart: 'https://www.healthkart.com/search?q=Insane+Labz+Psychotic'
    },
    image_url: '/images/supps/psychotic_preworkout.jpg',
    benefits: 'Ultra-high stimulant formula featuring trademarked AMPiberry to prolong energy curve and focus. For advanced trainees looking for intense pumps.'
  },
  {
    id: 's-16',
    name: 'Pre-Workout Pre-XP',
    brand: 'Doctors Choice',
    category: 'preworkout',
    price: 1599,
    servings: 30,
    dose_per_serving: '3g Citrulline, 250mg Caffeine',
    price_per_serving: 53.3,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Doctors+Choice+Pre+XP',
      blinkit: 'https://blinkit.com/s?q=doctors+choice+preworkout',
      zepto: 'https://www.zeptonow.com/search?q=doctors+choice+preworkout',
      healthkart: 'https://www.healthkart.com/search?q=Doctors+Choice+Pre+XP'
    },
    image_url: '/images/supps/dc_preworkout.jpg',
    benefits: 'Excellent value pre-workout. Provides a strong energy kick, hydration electrolytes, and blood flow enhancers at a budget-friendly price point.'
  },
  {
    id: 's-17',
    name: 'MB-Vite Daily Multivitamin',
    brand: 'MuscleBlaze',
    category: 'multivitamin',
    price: 649,
    servings: 60,
    dose_per_serving: '25 Key Ingredients & Enzymes',
    price_per_serving: 10.8,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+MB+Vite',
      blinkit: 'https://blinkit.com/s?q=mb+vite',
      zepto: 'https://www.zeptonow.com/search?q=mb+vite',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+MB+Vite'
    },
    image_url: '/images/supps/mb_multi.jpg',
    benefits: 'Top-selling daily multivitamin with specific digestive enzyme blends, energy support extracts, and baseline micro-minerals for active lifestyles.'
  },
  {
    id: 's-18',
    name: 'Revital H Daily Health',
    brand: 'Revital',
    category: 'multivitamin',
    price: 350,
    servings: 60,
    dose_per_serving: '10 Vitamins, 9 Minerals & Ginseng',
    price_per_serving: 5.8,
    rating: 4.2,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Revital+H+Capsules',
      blinkit: 'https://blinkit.com/s?q=revital+h',
      zepto: 'https://www.zeptonow.com/search?q=revital+h',
      healthkart: 'https://www.healthkart.com/search?q=Revital+H'
    },
    image_url: '/images/supps/revital_multi.jpg',
    benefits: 'Classic, widely available daily health supplement formulated with natural Ginseng extract to enhance energy, stamina, and mental alertness on a budget.'
  },
  {
    id: 's-19',
    name: 'Premium Fish Oil Gold',
    brand: 'MuscleBlaze',
    category: 'omega3',
    price: 799,
    servings: 60,
    dose_per_serving: '1000mg Fish Oil (460mg EPA / 380mg DHA)',
    price_per_serving: 13.3,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+Fish+Oil+Gold',
      blinkit: 'https://blinkit.com/s?q=muscleblaze+fish+oil',
      zepto: 'https://www.zeptonow.com/search?q=muscleblaze+fish+oil',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+Fish+Oil'
    },
    image_url: '/images/supps/mb_omega.jpg',
    benefits: 'High potency enteric-coated fish oil softgels. Zero fishy aftertaste, refined to eliminate heavy metals, high concentration of active fatty acids.'
  },
  {
    id: 's-20',
    name: 'Premium Omega 3 Fish Oil',
    brand: 'Wow Life Science',
    category: 'omega3',
    price: 499,
    servings: 60,
    dose_per_serving: '1000mg Fish Oil (350mg EPA / 250mg DHA)',
    price_per_serving: 8.3,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Wow+Life+Science+Omega+3',
      blinkit: 'https://blinkit.com/s?q=wow+omega+3',
      zepto: 'https://www.zeptonow.com/search?q=wow+omega+3',
      healthkart: 'https://www.healthkart.com/search?q=Wow+Life+Science+Omega+3'
    },
    image_url: '/images/supps/wow_omega.jpg',
    benefits: 'Budget-friendly, highly popular clean fish oil capsules. Enteric-coated, premium marine source, supports heart, eye, joint, and brain function.'
  },
  
  // 20 More Best Selling Indian Supplements (s-21 to s-40)
  {
    id: 's-21',
    name: 'Biozyme Performance Whey',
    brand: 'MuscleBlaze',
    category: 'protein',
    price: 3299,
    servings: 33,
    dose_per_serving: '25g Whey Protein',
    price_per_serving: 99.9,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+Biozyme+Performance+Whey',
      blinkit: 'https://blinkit.com/s?q=muscleblaze+biozyme',
      zepto: 'https://www.zeptonow.com/search?q=muscleblaze+biozyme',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+Biozyme'
    },
    image_url: '/images/supps/mb_biozyme.jpg',
    benefits: 'Clinically tested and customized for Indian absorption rates. Features proprietary Enhanced Absorption Formula (EAF) to limit bloating.'
  },
  {
    id: 's-22',
    name: 'Pro Performance 100% Whey',
    brand: 'GNC',
    category: 'protein',
    price: 2999,
    servings: 30,
    dose_per_serving: '24g Whey Protein',
    price_per_serving: 99.9,
    rating: 4.5,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=GNC+Pro+Performance+Whey',
      blinkit: 'https://blinkit.com/s?q=gnc+protein',
      zepto: 'https://www.zeptonow.com/search?q=gnc+protein',
      healthkart: 'https://www.healthkart.com/search?q=GNC+Pro+Performance'
    },
    image_url: '/images/supps/gnc_protein.jpg',
    benefits: 'High quality instantized whey compound, low fat and gluten-free. Extremely popular benchmark entry-level protein drink.'
  },
  {
    id: 's-23',
    name: 'Nitro-Tech Whey Protein',
    brand: 'MuscleTech',
    category: 'protein',
    price: 3899,
    servings: 30,
    dose_per_serving: '30g Whey Protein & 3g Creatine',
    price_per_serving: 129.9,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleTech+Nitro+Tech',
      blinkit: 'https://blinkit.com/s?q=muscletech+protein',
      zepto: 'https://www.zeptonow.com/search?q=muscletech+protein',
      healthkart: 'https://www.healthkart.com/search?q=MuscleTech+Nitro+Tech'
    },
    image_url: '/images/supps/muscletech_protein.jpg',
    benefits: 'Fortified with 3g of strength-enhancing creatine monohydrate and recovery-boosting amino acids. Engineered for lean muscle gains.'
  },
  {
    id: 's-24',
    name: 'Prostar 100% Whey',
    brand: 'Ultimate Nutrition',
    category: 'protein',
    price: 4299,
    servings: 80,
    dose_per_serving: '25g Whey Protein',
    price_per_serving: 53.7,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Ultimate+Nutrition+Prostar',
      blinkit: 'https://blinkit.com/s?q=ultimate+nutrition+prostar',
      zepto: 'https://www.zeptonow.com/search?q=ultimate+nutrition+prostar',
      healthkart: 'https://www.healthkart.com/search?q=Ultimate+Nutrition+Prostar'
    },
    image_url: '/images/supps/prostar_whey.jpg',
    benefits: 'Low-temperature processing preserves maximum active immunoglobulins and micro-fractions. Massive volume size and high serving efficiency.'
  },
  {
    id: 's-25',
    name: 'Platinum Pure Creatine',
    brand: 'MuscleTech',
    category: 'creatine',
    price: 999,
    servings: 83,
    dose_per_serving: '3g Creatine Monohydrate',
    price_per_serving: 12.0,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleTech+Platinum+Creatine',
      blinkit: 'https://blinkit.com/s?q=muscletech+creatine',
      zepto: 'https://www.zeptonow.com/search?q=muscletech+creatine',
      healthkart: 'https://www.healthkart.com/search?q=MuscleTech+Platinum+Creatine'
    },
    image_url: '/images/supps/muscletech_creatine.jpg',
    benefits: 'HPLC-tested micronized creatine powder. Delivers pure strength monohydrate directly to muscles for explosive output.'
  },
  {
    id: 's-26',
    name: 'AMP Creatine HCl',
    brand: 'GNC',
    category: 'creatine',
    price: 1699,
    servings: 60,
    dose_per_serving: '2g Creatine Hydrochloride',
    price_per_serving: 28.3,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=GNC+AMP+Creatine+HCl',
      blinkit: 'https://blinkit.com/s?q=gnc+creatine',
      zepto: 'https://www.zeptonow.com/search?q=gnc+creatine',
      healthkart: 'https://www.healthkart.com/search?q=GNC+AMP+Creatine+HCl'
    },
    image_url: '/images/supps/gnc_creatine.jpg',
    benefits: 'High solubility creatine hydrochloride form. Eliminates the need for a loading phase, easier on digestion, zero subcutaneous bloating.'
  },
  {
    id: 's-27',
    name: 'Pure Creatine Powder',
    brand: 'Nakpro',
    category: 'creatine',
    price: 449,
    servings: 83,
    dose_per_serving: '3g Creatine Monohydrate',
    price_per_serving: 5.4,
    rating: 4.2,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Nakpro+Creatine',
      blinkit: 'https://blinkit.com/s?q=nakpro+creatine',
      zepto: 'https://www.zeptonow.com/search?q=nakpro+creatine',
      healthkart: 'https://www.healthkart.com/search?q=Nakpro+Creatine'
    },
    image_url: '/images/supps/nakpro_creatine.jpg',
    benefits: 'Extremely cost-efficient pure unflavored creatine monohydrate. Ideal budget choice for continuous daily usage.'
  },
  {
    id: 's-28',
    name: 'Creatine Monohydrate 250g',
    brand: 'Carbamide Forte',
    category: 'creatine',
    price: 429,
    servings: 83,
    dose_per_serving: '3g Creatine Monohydrate',
    price_per_serving: 5.1,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Carbamide+Forte+Creatine',
      blinkit: 'https://blinkit.com/s?q=carbamide+creatine',
      zepto: 'https://www.zeptonow.com/search?q=carbamide+creatine',
      healthkart: 'https://www.healthkart.com/search?q=Carbamide+Forte+Creatine'
    },
    image_url: '/images/supps/carbamide_creatine.jpg',
    benefits: 'Micronized for high bioavailability. Helps accelerate lean mass development and delays workout fatigue.'
  },
  {
    id: 's-29',
    name: 'Nitraflex Pre-Workout',
    brand: 'GAT Sport',
    category: 'preworkout',
    price: 2899,
    servings: 30,
    dose_per_serving: '325mg Caffeine & Boron Citrate',
    price_per_serving: 96.6,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=GAT+Sport+Nitraflex',
      blinkit: 'https://blinkit.com/s?q=nitraflex',
      zepto: 'https://www.zeptonow.com/search?q=nitraflex',
      healthkart: 'https://www.healthkart.com/search?q=GAT+Sport+Nitraflex'
    },
    image_url: '/images/supps/nitraflex.jpg',
    benefits: 'High intensity pre-workout containing clinically studied nitrosigine and test-boosting boron. Ideal for peak performance athletes.'
  },
  {
    id: 's-30',
    name: 'Freak Pre-Workout',
    brand: 'Bigmuscles Nutrition',
    category: 'preworkout',
    price: 999,
    servings: 30,
    dose_per_serving: '2g Beta-Alanine, 200mg Caffeine',
    price_per_serving: 33.3,
    rating: 4.1,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Bigmuscles+Nutrition+Freak',
      blinkit: 'https://blinkit.com/s?q=bigmuscles+preworkout',
      zepto: 'https://www.zeptonow.com/search?q=bigmuscles+preworkout',
      healthkart: 'https://www.healthkart.com/search?q=Bigmuscles+Freak'
    },
    image_url: '/images/supps/bm_preworkout.jpg',
    benefits: 'Extremely popular low-cost energy formula designed to give quick training stimulation. Contains basic pumps matrix.'
  },
  {
    id: 's-31',
    name: 'Pre-Workout Pre-Fire',
    brand: 'Absolute Nutrition',
    category: 'preworkout',
    price: 1199,
    servings: 30,
    dose_per_serving: '2.5g Citrulline, 250mg Caffeine',
    price_per_serving: 39.9,
    rating: 4.2,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Absolute+Nutrition+Pre+Fire',
      blinkit: 'https://blinkit.com/s?q=absolute+preworkout',
      zepto: 'https://www.zeptonow.com/search?q=absolute+preworkout',
      healthkart: 'https://www.healthkart.com/search?q=Absolute+Nutrition+Pre+Fire'
    },
    image_url: '/images/supps/absolute_preworkout.jpg',
    benefits: 'Indian market formulation tailored for clean focus and focus support without crash. Safe, standard performance values.'
  },
  {
    id: 's-32',
    name: 'Shatter Pre-Workout',
    brand: 'MuscleTech',
    category: 'preworkout',
    price: 2499,
    servings: 30,
    dose_per_serving: '3.2g Beta-Alanine, 350mg Caffeine',
    price_per_serving: 83.3,
    rating: 4.5,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleTech+Shatter',
      blinkit: 'https://blinkit.com/s?q=muscletech+preworkout',
      zepto: 'https://www.zeptonow.com/search?q=muscletech+preworkout',
      healthkart: 'https://www.healthkart.com/search?q=MuscleTech+Shatter'
    },
    image_url: '/images/supps/shatter.jpg',
    benefits: 'Explosive energy and maximum vasodilation. Formulated with key neurotransmitter stimulants for rapid focus development.'
  },
  {
    id: 's-33',
    name: 'HK Vitals Multivitamin',
    brand: 'HealthKart',
    category: 'multivitamin',
    price: 399,
    servings: 60,
    dose_per_serving: '9 Essential Amino Acids & Ginseng',
    price_per_serving: 6.6,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=HealthKart+HK+Vitals+Multivitamin',
      blinkit: 'https://blinkit.com/s?q=hk+vitals+multivitamin',
      zepto: 'https://www.zeptonow.com/search?q=hk+vitals+multivitamin',
      healthkart: 'https://www.healthkart.com/search?q=HK+Vitals+Multivitamin'
    },
    image_url: '/images/supps/hk_multi.jpg',
    benefits: 'High consumer base in India. Features a balanced formula of basic micronutrients, taurine, and real Panax Ginseng extracts.'
  },
  {
    id: 's-34',
    name: 'Multivit Sport Daily',
    brand: 'TrueBasics',
    category: 'multivitamin',
    price: 899,
    servings: 60,
    dose_per_serving: '40 Active Ingredients & Joint Blend',
    price_per_serving: 14.9,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=TrueBasics+Multivit+Sport',
      blinkit: 'https://blinkit.com/s?q=truebasics+multivitamin',
      zepto: 'https://www.zeptonow.com/search?q=truebasics+multivitamin',
      healthkart: 'https://www.healthkart.com/search?q=TrueBasics+Multivit'
    },
    image_url: '/images/supps/truebasics_multi.jpg',
    benefits: 'Premium active sports supplement loaded with custom brain, antioxidant, joint support, and amino acid blends.'
  },
  {
    id: 's-35',
    name: 'Vitalize Multivitamin',
    brand: 'Fast&Up',
    category: 'multivitamin',
    price: 320,
    servings: 20,
    dose_per_serving: '1 Effervescent Tablet',
    price_per_serving: 16.0,
    rating: 4.4,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Fast+and+Up+Vitalize',
      blinkit: 'https://blinkit.com/s?q=fast+and+up',
      zepto: 'https://www.zeptonow.com/search?q=fast+and+up',
      healthkart: 'https://www.healthkart.com/search?q=Fast+and+Up+Vitalize'
    },
    image_url: '/images/supps/fastandup_multi.jpg',
    benefits: 'Fizzy effervescent hydration tablets. Easy to consume, orange flavor, rapid absorption profile.'
  },
  {
    id: 's-36',
    name: 'Supradyn Daily Health',
    brand: 'Supradyn',
    category: 'multivitamin',
    price: 60,
    servings: 15,
    dose_per_serving: '12 Vitamins & 5 Trace Minerals',
    price_per_serving: 4.0,
    rating: 4.5,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Supradyn+Daily',
      blinkit: 'https://blinkit.com/s?q=supradyn',
      zepto: 'https://www.zeptonow.com/search?q=supradyn',
      healthkart: 'https://www.healthkart.com/search?q=Supradyn'
    },
    image_url: '/images/supps/supradyn.jpg',
    benefits: 'Classic pharmacy multivitamin staple in India. Highly effective, reliable baseline multivitamin at near-zero costs.'
  },
  {
    id: 's-37',
    name: 'HK Vitals Fish Oil',
    brand: 'HealthKart',
    category: 'omega3',
    price: 399,
    servings: 60,
    dose_per_serving: '1000mg Fish Oil (180mg EPA / 120mg DHA)',
    price_per_serving: 6.6,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=HealthKart+HK+Vitals+Fish+Oil',
      blinkit: 'https://blinkit.com/s?q=hk+vitals+fish+oil',
      zepto: 'https://www.zeptonow.com/search?q=hk+vitals+fish+oil',
      healthkart: 'https://www.healthkart.com/search?q=HK+Vitals+Fish+Oil'
    },
    image_url: '/images/supps/hk_omega.jpg',
    benefits: 'Widely consumed standard fish oil softgels. Sourced from cold-water sardines, double-purified, standard daily dosage.'
  },
  {
    id: 's-38',
    name: 'Triple Strength Fish Oil',
    brand: 'GNC',
    category: 'omega3',
    price: 1999,
    servings: 60,
    dose_per_serving: '1000mg Fish Oil (640mg EPA / 240mg DHA)',
    price_per_serving: 33.3,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=GNC+Triple+Strength+Fish+Oil',
      blinkit: 'https://blinkit.com/s?q=gnc+fish+oil',
      zepto: 'https://www.zeptonow.com/search?q=gnc+fish+oil',
      healthkart: 'https://www.healthkart.com/search?q=GNC+Triple+Strength+Fish+Oil'
    },
    image_url: '/images/supps/gnc_omega.jpg',
    benefits: 'Highly concentrated active fatty acids. Purified to eliminate heavy metals, PCBS, and trace mercury. Zero fishy burps.'
  },
  {
    id: 's-39',
    name: 'Deep Sea Fish Oil',
    brand: 'Neuherbs',
    category: 'omega3',
    price: 799,
    servings: 60,
    dose_per_serving: '2500mg Fish Oil (800mg EPA / 600mg DHA)',
    price_per_serving: 13.3,
    rating: 4.5,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Neuherbs+Deep+Sea+Fish+Oil',
      blinkit: 'https://blinkit.com/s?q=neuherbs+fish+oil',
      zepto: 'https://www.zeptonow.com/search?q=neuherbs+fish+oil',
      healthkart: 'https://www.healthkart.com/search?q=Neuherbs+Fish+Oil'
    },
    image_url: '/images/supps/neuherbs_omega.jpg',
    benefits: 'High concentration deep sea fish oil with added Lemon flavor to curb aftertaste. Excellent joint and cardiovascular support.'
  },
  {
    id: 's-40',
    name: 'Enteric Coated Fish Oil',
    brand: 'Optimum Nutrition',
    category: 'omega3',
    price: 1499,
    servings: 100,
    dose_per_serving: '1000mg Fish Oil (300mg EPA / 200mg DHA)',
    price_per_serving: 14.9,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Optimum+Nutrition+Fish+Oil',
      blinkit: 'https://blinkit.com/s?q=on+fish+oil',
      zepto: 'https://www.zeptonow.com/search?q=on+fish+oil',
      healthkart: 'https://www.healthkart.com/search?q=ON+Fish+Oil'
    },
    image_url: '/images/supps/on_omega.jpg',
    benefits: 'Enteric-coated shell passes intact through stomach acid to dissolve directly in intestines. Premium quality distillation.'
  },
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Atom PWR Whey Protein',
    brand: 'AS-IT-IS Nutrition',
    category: 'protein',
    price: 1899,
    servings: 33,
    dose_per_serving: '27g Whey Protein',
    price_per_serving: 57.5,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=AS-IT-IS+Atom+PWR+Whey+Protein',
      healthkart: 'https://www.healthkart.com/search?q=AS-IT-IS+Atom+PWR+Whey+Protein'
    },
    image_url: '/images/supps/asitis_atom_whey.jpg',
    benefits: 'High protein yield per serving with double digestive enzymes. Certified by Labdoor for high purity.'
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Bon Iso Whey 100% Protein Isolate - Irish Chocolate',
    brand: 'Bon',
    category: 'protein',
    price: 3499,
    servings: 30,
    dose_per_serving: '25g Whey Isolate',
    price_per_serving: 116.6,
    rating: 4.5,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Bon+Iso+Whey+Protein',
      healthkart: 'https://www.healthkart.com/search?q=Bon+Iso+Whey+Protein'
    },
    image_url: '/images/supps/myprotein_whey.jpg',
    benefits: 'Pure whey protein isolate with rich Irish chocolate flavor, low carb. Certified by Labdoor for high purity.'
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'Platinum Whey',
    brand: 'L-Men',
    category: 'protein',
    price: 2799,
    servings: 25,
    dose_per_serving: '25g Whey Protein',
    price_per_serving: 111.9,
    rating: 4.4,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=L-Men+Platinum+Whey'
    },
    image_url: '/images/supps/gnc_protein.jpg',
    benefits: 'Clinically formulated platinum whey for active athletes. Certified by Labdoor.'
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    name: '100% Whey',
    brand: 'Muscle Feast',
    category: 'protein',
    price: 4199,
    servings: 37,
    dose_per_serving: '20g Whey Protein',
    price_per_serving: 113.4,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Muscle+Feast+100+Whey'
    },
    image_url: '/images/supps/on_whey.jpg',
    benefits: 'All-natural grass-fed whey with zero artificial ingredients or fillers. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    name: 'Biozorb Performance Whey',
    brand: 'MuscleBlaze',
    category: 'protein',
    price: 3199,
    servings: 30,
    dose_per_serving: '25g Whey Protein',
    price_per_serving: 106.6,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+Biozorb+Performance+Whey',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+Biozorb+Performance'
    },
    image_url: '/images/supps/mb_biozyme.jpg',
    benefits: 'Enhanced absorption formula optimized for digestive efficiency. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    name: 'Hormone Free Grass Fed Whey Isolate',
    brand: 'Muscle Feast',
    category: 'protein',
    price: 4899,
    servings: 37,
    dose_per_serving: '21g Whey Isolate',
    price_per_serving: 132.4,
    rating: 4.9,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Muscle+Feast+Grass+Fed+Whey+Isolate'
    },
    image_url: '/images/supps/on_whey.jpg',
    benefits: 'Hormone-free grass-fed whey isolate of supreme purity. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    name: 'Biozorb Iso Zero',
    brand: 'MuscleBlaze',
    category: 'protein',
    price: 4499,
    servings: 30,
    dose_per_serving: '27g Whey Isolate',
    price_per_serving: 149.9,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+Biozorb+Iso+Zero',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+Biozorb+Iso+Zero'
    },
    image_url: '/images/supps/mb_biozyme.jpg',
    benefits: 'Zero carb, zero fat lactose-free isolate with Biozorb formulation. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000009',
    name: 'Biozyme Iso-Zero Low Carb',
    brand: 'MuscleBlaze',
    category: 'protein',
    price: 4699,
    servings: 33,
    dose_per_serving: '27g Whey Isolate',
    price_per_serving: 142.4,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=MuscleBlaze+Biozyme+Iso+Zero',
      healthkart: 'https://www.healthkart.com/search?q=MuscleBlaze+Biozyme+Iso+Zero'
    },
    image_url: '/images/supps/mb_biozyme.jpg',
    benefits: 'Low carb, low lactose whey protein isolate for lean muscle definition. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000010',
    name: 'Whey+ Protein Powder',
    brand: 'Legion',
    category: 'protein',
    price: 4299,
    servings: 30,
    dose_per_serving: '22g Whey Isolate',
    price_per_serving: 143.3,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Legion+Whey+Protein+Powder'
    },
    image_url: '/images/supps/on_whey.jpg',
    benefits: '100% natural grass-fed whey isolate, lactose-free. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000011',
    name: 'Whey Protein Concentrate',
    brand: 'Muscle Feast',
    category: 'protein',
    price: 3699,
    servings: 37,
    dose_per_serving: '19g Whey Protein',
    price_per_serving: 99.9,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Muscle+Feast+Whey+Protein+Concentrate'
    },
    image_url: '/images/supps/on_whey.jpg',
    benefits: 'Cold-filtered grass-fed whey protein concentrate of high purity. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000012',
    name: 'Whey Protein Hydrolyzed',
    brand: 'Muscle Feast',
    category: 'protein',
    price: 4999,
    servings: 37,
    dose_per_serving: '20g Hydrolyzed Whey',
    price_per_serving: 135.1,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Muscle+Feast+Whey+Protein+Hydrolyzed'
    },
    image_url: '/images/supps/on_whey.jpg',
    benefits: 'Rapidly absorbing hydrolyzed whey protein, ideal for post-workout. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000013',
    name: 'Concentrate Whey Protein',
    brand: 'Bal Bharat',
    category: 'protein',
    price: 1599,
    servings: 30,
    dose_per_serving: '24g Whey Protein',
    price_per_serving: 53.3,
    rating: 4.4,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Bal+Bharat+Whey+Protein'
    },
    image_url: '/images/supps/nakpro_whey.jpg',
    benefits: 'Affordable high quality concentrate, local brand for daily fitness support. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000014',
    name: 'Whey Protein Concentrate',
    brand: 'AS-IT-IS Nutrition',
    category: 'protein',
    price: 1699,
    servings: 30,
    dose_per_serving: '24g Whey Protein',
    price_per_serving: 56.6,
    rating: 4.5,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=AS-IT-IS+Whey+Protein+Concentrate',
      healthkart: 'https://www.healthkart.com/search?q=AS-IT-IS+Whey+Protein+Concentrate'
    },
    image_url: '/images/supps/asitis_atom_whey.jpg',
    benefits: 'Pure unflavored whey protein concentrate with no additives. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000015',
    name: 'PRO WHEY 100',
    brand: 'Muscle First',
    category: 'protein',
    price: 2499,
    servings: 30,
    dose_per_serving: '24g Whey Protein',
    price_per_serving: 83.3,
    rating: 4.4,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Muscle+First+PRO+WHEY+100'
    },
    image_url: '/images/supps/nakpro_whey.jpg',
    benefits: 'Premium grade whey protein with high mixability and taste. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000016',
    name: 'Power Play Fuel Cold Micro Filtered Whey Protein Isolate',
    brand: 'Power Play',
    category: 'protein',
    price: 3999,
    servings: 30,
    dose_per_serving: '26g Whey Isolate',
    price_per_serving: 133.3,
    rating: 4.6,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Power+Play+Fuel+Whey+Isolate'
    },
    image_url: '/images/supps/myprotein_whey.jpg',
    benefits: 'Cold micro-filtered whey isolate preserving immunoglobulins. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000017',
    name: 'Puro IsoPro WPI Whey Isolate',
    brand: 'Puro',
    category: 'protein',
    price: 4199,
    servings: 30,
    dose_per_serving: '27g Whey Isolate',
    price_per_serving: 139.9,
    rating: 4.5,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Puro+IsoPro+Whey+Isolate'
    },
    image_url: '/images/supps/myprotein_whey.jpg',
    benefits: 'High-potency pure whey isolate with zero sugar and low fat. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000018',
    name: 'Impact Whey Isolate - India',
    brand: 'Myprotein',
    category: 'protein',
    price: 4599,
    servings: 40,
    dose_per_serving: '22g Whey Isolate',
    price_per_serving: 114.9,
    rating: 4.7,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Myprotein+Impact+Whey+Isolate+India',
      healthkart: 'https://www.healthkart.com/search?q=Myprotein+Impact+Whey+Isolate+India'
    },
    image_url: '/images/supps/myprotein_whey.jpg',
    benefits: 'World-class premium whey isolate, grass-fed and highly refined. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000019',
    name: '100% Grass-Fed Whey Protein Isolate',
    brand: 'Transparent Labs',
    category: 'protein',
    price: 4999,
    servings: 30,
    dose_per_serving: '28g Whey Isolate',
    price_per_serving: 166.6,
    rating: 4.9,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Transparent+Labs+Whey+Isolate'
    },
    image_url: '/images/supps/on_whey.jpg',
    benefits: '100% grass-fed whey isolate with zero artificial sweeteners or food dyes. Labdoor certified.'
  },
  {
    id: '10000000-0000-0000-0000-000000000020',
    name: 'ATOM Nitro Whey Protein with Creatine',
    brand: 'AS-IT-IS Nutrition',
    category: 'protein',
    price: 2199,
    servings: 33,
    dose_per_serving: '27g Protein, 3g Creatine',
    price_per_serving: 66.6,
    rating: 4.3,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=AS-IT-IS+Atom+Nitro+Whey'
    },
    image_url: '/images/supps/asitis_atom_whey.jpg',
    benefits: 'Fortified with creatine and performance boosters for explosive power. Labdoor certification upcoming.'
  },
  {
    id: '10000000-0000-0000-0000-000000000022',
    name: 'Smart Nutrition Whey Protein',
    brand: "Will's",
    category: 'protein',
    price: 2399,
    servings: 30,
    dose_per_serving: '24g Whey Protein',
    price_per_serving: 79.9,
    rating: 4.4,
    tier: 'value_pick',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Wills+Smart+Nutrition+Whey+Protein'
    },
    image_url: '/images/supps/nakpro_whey.jpg',
    benefits: 'Smart-formulated whey protein supporting lean gains and digestion. Labdoor certification upcoming.'
  },
  {
    id: '20000000-0000-0000-0000-000000000001',
    name: 'Triton Fish Oil',
    brand: 'Legion',
    category: 'omega3',
    price: 3999,
    servings: 30,
    dose_per_serving: '4000mg Fish Oil (1600mg EPA / 800mg DHA)',
    price_per_serving: 133.3,
    rating: 4.9,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Legion+Triton+Fish+Oil'
    },
    image_url: '/images/supps/truebasics_omega.jpg',
    benefits: 'Extreme potency re-esterified triglyceride fish oil with added vitamin E. Certified #1 on Labdoor.'
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    name: 'UnoCardio 1000 + Vitamin D3',
    brand: 'WHC',
    category: 'omega3',
    price: 4999,
    servings: 60,
    dose_per_serving: '1280mg Fish Oil (675mg EPA / 460mg DHA)',
    price_per_serving: 83.3,
    rating: 4.9,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=WHC+UnoCardio+1000'
    },
    image_url: '/images/supps/gnc_omega.jpg',
    benefits: 'Highest active concentration fish oil in the world. Cold-processed with Vitamin D3. Labdoor certified.'
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    name: 'Bulk Pre-Workout',
    brand: 'Transparent Labs',
    category: 'preworkout',
    price: 4499,
    servings: 30,
    dose_per_serving: '8g Citrulline Malate, 4g Beta-Alanine, 200mg Caffeine',
    price_per_serving: 149.9,
    rating: 4.8,
    tier: 'market_leader',
    buy_links: {
      amazon: 'https://www.amazon.in/s?k=Transparent+Labs+Bulk'
    },
    image_url: '/images/supps/c4_preworkout.jpg',
    benefits: '100% transparent formula with zero artificial sweeteners or colorings. Clinically dosed for peak performance. Labdoor certified.'
  }
];

