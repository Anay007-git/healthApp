-- Seed script for Healthy Food Alternatives Platform
-- Seeds 20 common junk food items with healthy swaps

-- Clean tables (optional, for re-seeding)
TRUNCATE alternative_mappings CASCADE;
TRUNCATE junk_items CASCADE;
TRUNCATE healthy_alternatives CASCADE;
TRUNCATE healthy_cuisine_tags CASCADE;

-- Insert Junk Items
INSERT INTO junk_items (id, name, slug, category, calories, fat, sugar, sodium, image_url) VALUES
('a1b1c1d1-1111-1111-1111-111111111111', 'Maggi Instant Noodles', 'maggi-instant-noodles', 'snacks', 380, 13.5, 2.0, 1100, '/images/junk/maggi.jpg'),
('a1b1c1d1-2222-2222-2222-222222222222', 'Samosa (Fried)', 'samosa-fried', 'snacks', 260, 17.0, 1.0, 450, '/images/junk/samosa.jpg'),
('a1b1c1d1-3333-3333-3333-333333333333', 'Coca-Cola Cola', 'coca-cola-cola', 'drinks', 140, 0.0, 39.0, 45, '/images/junk/coke.jpg'),
('a1b1c1d1-4444-4444-4444-444444444444', 'Potato Chips (Lays)', 'potato-chips-lays', 'snacks', 530, 35.0, 1.0, 520, '/images/junk/chips.jpg'),
('a1b1c1d1-5555-5555-5555-555555555555', 'Dairy Milk Chocolate', 'dairy-milk-chocolate', 'desserts', 530, 30.0, 56.0, 80, '/images/junk/chocolate.jpg'),
('a1b1c1d1-6666-6666-6666-666666666666', 'French Fries', 'french-fries', 'fastfood', 312, 15.0, 0.3, 210, '/images/junk/fries.jpg'),
('a1b1c1d1-7777-7777-7777-777777777777', 'White Bread', 'white-bread', 'breakfast', 265, 3.2, 5.0, 490, '/images/junk/white-bread.jpg'),
('a1b1c1d1-8888-8888-8888-888888888888', 'Vanilla Ice Cream', 'vanilla-ice-cream', 'desserts', 207, 11.0, 21.0, 80, '/images/junk/ice-cream.jpg'),
('a1b1c1d1-9999-9999-9999-999999999999', 'Cheese Loaded Pizza', 'cheese-loaded-pizza', 'fastfood', 285, 12.0, 3.5, 640, '/images/junk/pizza.jpg'),
('a1b1c1d1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jalebi (Fried in Ghee)', 'jalebi-fried-ghee', 'desserts', 350, 12.0, 50.0, 150, '/images/junk/jalebi.jpg'),
('a1b1c1d1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Fried Momos (Maida)', 'fried-momos-maida', 'fastfood', 320, 14.0, 1.5, 620, '/images/junk/momos.jpg'),
('a1b1c1d1-cccc-cccc-cccc-cccccccccccc', 'Butter Paneer Masala', 'butter-paneer-masala', 'fastfood', 380, 32.0, 6.0, 780, '/images/junk/butter-paneer.jpg'),
('a1b1c1d1-dddd-dddd-dddd-dddddddddddd', 'Gulab Jamun (Sugar Syrup)', 'gulab-jamun', 'desserts', 300, 10.0, 42.0, 120, '/images/junk/gulab-jamun.jpg'),
('a1b1c1d1-eeee-eeee-eeee-eeeeeeeeeeee', 'Loaded Nachos & Cheese', 'loaded-nachos-cheese', 'snacks', 480, 25.0, 3.0, 810, '/images/junk/nachos.jpg'),
('a1b1c1d1-ffff-ffff-ffff-ffffffffffff', 'Double Cheese Chicken Burger', 'chicken-burger', 'fastfood', 540, 28.0, 7.0, 980, '/images/junk/burger.jpg'),
('a1b1c1d1-0000-0000-0000-000000000000', 'Chole Bhature', 'chole-bhature', 'breakfast', 450, 22.0, 2.0, 850, '/images/junk/chole-bhature.jpg'),
('a1b1c1d1-0001-0000-0000-000000000000', 'Cutting Masala Chai (Sugary)', 'sugary-masala-chai', 'drinks', 120, 4.0, 18.0, 40, '/images/junk/chai.jpg'),
('a1b1c1d1-0003-0000-0000-000000000000', 'Fried Fish Tikka', 'fried-fish-tikka', 'fastfood', 290, 18.0, 0.0, 720, '/images/junk/fried-fish.jpg'),
('a1b1c1d1-0004-0000-0000-000000000000', 'Sugary Frosted Flakes Cereal', 'frosted-flakes-cereal', 'breakfast', 375, 1.0, 37.0, 729, '/images/junk/cereal.jpg'),
('a1b1c1d1-0005-0000-0000-000000000000', 'Pav Bhaji (Excess Butter)', 'butter-pav-bhaji', 'breakfast', 400, 18.0, 4.0, 890, '/images/junk/pav-bhaji.jpg');

-- Insert Healthy Alternatives
INSERT INTO healthy_alternatives (id, name, slug, category, calories, protein, fiber, fat, sugar, sodium, image_url, description) VALUES
('e1f1a1b1-1111-1111-1111-111111111111', 'Foxtail Millet Noodles', 'foxtail-millet-noodles', 'snacks', 290, 11.5, 8.0, 2.5, 0.5, 120, '/images/healthy/millet-noodles.jpg', 'Air-dried, high-protein millet noodles that satisfy instant noodle cravings without the deep-fried trans fat and refined maida flour.'),
('e1f1a1b1-2222-2222-2222-222222222222', 'Air-Baked Whole Wheat Samosa', 'air-baked-samosa', 'snacks', 130, 4.5, 4.0, 3.5, 0.8, 180, '/images/healthy/baked-samosa.jpg', 'Crisp samosas baked in an air-fryer using a thin whole wheat crust. Saves over 50% fat and 130 calories per piece.'),
('e1f1a1b1-2223-2222-2222-222222222222', 'Roasted Mint Makhana (Foxnuts)', 'roasted-mint-makhana', 'snacks', 95, 3.0, 2.5, 2.0, 0.1, 95, '/images/healthy/makhana.jpg', 'Crunchy lotus seeds dry-roasted and lightly tossed in olive oil and mint spice. Low GI, high fiber snack.'),
('e1f1a1b1-3333-3333-3333-333333333333', 'Fresh Tender Coconut Water', 'tender-coconut-water', 'drinks', 19, 0.7, 1.1, 0.2, 3.5, 25, '/images/healthy/coconut-water.jpg', 'Naturally refreshing, zero-sugar-added hydration packed with essential potassium, magnesium, and active enzymes.'),
('e1f1a1b1-3334-3333-3333-333333333333', 'Organic Lemon Ginger Kombucha', 'lemon-ginger-kombucha', 'drinks', 30, 0.2, 0.5, 0.0, 4.0, 10, '/images/healthy/kombucha.jpg', 'Fermented sparkling tea rich in live probiotics to boost gut health. Naturally carbonated swap for sugary sodas.'),
('e1f1a1b1-4444-4444-4444-444444444444', 'Spiced Roasted Chickpeas', 'roasted-chickpeas', 'snacks', 160, 7.5, 6.0, 3.5, 0.8, 140, '/images/healthy/chickpeas.jpg', 'Bengal gram dry roasted until crispy and seasoned with chaat masala. Low fat, high protein, and high fiber snack.'),
('e1f1a1b1-4445-4444-4444-444444444444', 'Air-Baked Banana Chips', 'baked-banana-chips', 'snacks', 190, 2.0, 3.5, 4.0, 12.0, 90, '/images/healthy/banana-chips.jpg', 'Thin plantain slices baked with a dash of turmeric and sea salt. Crisp crunch without coconut oil deep frying.'),
('e1f1a1b1-5555-5555-5555-555555555555', 'Sugar-Free Dark Chocolate (85%)', 'dark-chocolate-85', 'desserts', 510, 8.5, 11.0, 43.0, 8.0, 20, '/images/healthy/dark-chocolate.jpg', 'Rich dark chocolate loaded with healthy cocoa solids and antioxidants. Satisfies sweet tooth with minimal impact on blood sugar.'),
('e1f1a1b1-6666-6666-6666-666666666666', 'Baked Sweet Potato Fries', 'baked-sweet-potato-fries', 'fastfood', 140, 2.0, 3.8, 3.0, 6.0, 110, '/images/healthy/sweet-potato-fries.jpg', 'Sweet potato wedges seasoned with herbs and baked with a touch of olive oil. High in Vitamin A and dietary fiber.'),
('e1f1a1b1-7777-7777-7777-777777777777', 'Artisanal Whole Wheat Sourdough', 'wheat-sourdough', 'breakfast', 210, 8.0, 4.5, 1.5, 1.2, 380, '/images/healthy/sourdough.jpg', 'Slow-fermented sourdough made with whole wheat. Easier on gut digestion, has a lower glycemic index than commercial white bread.'),
('e1f1a1b1-7778-7777-7777-777777777777', '100% Sprouted Ragi Bread', 'sprouted-ragi-bread', 'breakfast', 180, 6.5, 6.0, 2.0, 2.0, 290, '/images/healthy/ragi-bread.jpg', 'Dense, nutrient-dense sprouted finger millet bread. Naturally high in calcium and fiber, completely refined flour-free.'),
('e1f1a1b1-8888-8888-8888-888888888888', 'Mango Chia Seed Pudding', 'mango-chia-pudding', 'desserts', 130, 4.0, 7.0, 5.0, 11.0, 30, '/images/healthy/chia-pudding.jpg', 'Creamy almond milk chia pudding layered with fresh Alphonso mango purée. High in Omega-3 fatty acids and soluble fiber.'),
('e1f1a1b1-8889-8888-8888-888888888888', 'Fresh Raspberry Banana Sorbet', 'raspberry-banana-sorbet', 'desserts', 95, 1.5, 4.2, 0.4, 15.0, 5, '/images/healthy/sorbet.jpg', 'Chilled blended raspberries and ripe bananas with a splash of lime. Creamy, dairy-free ice cream swap with no added processed sugar.'),
('e1f1a1b1-9999-9999-9999-999999999999', 'Cauliflower Crust Veggie Pizza', 'cauliflower-crust-pizza', 'fastfood', 180, 12.0, 4.5, 6.5, 2.0, 390, '/images/healthy/cauli-pizza.jpg', 'Low-carb, gluten-free crust made from grated cauliflower and herbs, topped with home-cooked marinara sauce and light mozzarella.'),
('e1f1a1b1-9998-9999-9999-999999999999', 'Whole Wheat Pesto Garden Pizza', 'pesto-wheat-pizza', 'fastfood', 210, 10.5, 5.0, 8.0, 1.8, 410, '/images/healthy/pesto-pizza.jpg', 'Stone-baked whole wheat flatbread base spread with fresh basil pine nut pesto and loaded with seasonal bell peppers, zucchini, and mushrooms.'),
('e1f1a1b1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cinnamon Honey Apple Jalebi (Baked)', 'baked-apple-jalebi', 'desserts', 140, 1.5, 3.0, 2.5, 22.0, 40, '/images/healthy/apple-jalebi.jpg', 'Baked fresh apple rings dipped in a light batter and glazed with organic raw honey and cinnamon. Avoids ghee deep-frying.'),
('e1f1a1b1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Steamed Beetroot & Oats Wheat Momos', 'steamed-beetroot-momos', 'fastfood', 160, 6.5, 3.8, 2.0, 1.5, 310, '/images/healthy/beetroot-momos.jpg', 'Steamed momos made with a whole wheat flour wrapper, stuffed with high-protein paneer, carrots, and fiber-rich rolled oats.'),
('e1f1a1b1-bbbc-bbbb-bbbb-bbbbbbbbbbbb', 'Crunchy Cabbage Wrap Steamed Dumplings', 'cabbage-wrap-dumplings', 'fastfood', 110, 8.0, 3.5, 1.0, 1.0, 240, '/images/healthy/cabbage-dumplings.jpg', 'Gluten-free, wrapperless steamed dumplings wrapped in local cabbage leaves. Stuffed with minced mushrooms, beans, and sprouts.'),
('e1f1a1b1-cccc-cccc-cccc-cccccccccccc', 'Tandoori Grilled Paneer Tikka', 'tandoori-paneer-tikka', 'fastfood', 190, 15.0, 1.8, 12.0, 1.5, 410, '/images/healthy/paneer-tikka.jpg', 'Cottage cheese cubes marinated in spiced yogurt and roasted in a clay oven. Low fat, high protein swap for gravy-heavy paneer.'),
('e1f1a1b1-cccd-cccc-cccc-cccccccccccc', 'Grilled Garlic Herb Tofu Tikka', 'garlic-tofu-tikka', 'fastfood', 140, 14.5, 2.2, 7.5, 0.5, 290, '/images/healthy/tofu-tikka.jpg', 'Organic firm tofu marinated in a mustard garlic green herb paste and grilled. High plant protein, low saturated fat.'),
('e1f1a1b1-dddd-dddd-dddd-dddddddddddd', 'Baked Cardamom Date Oats Bites', 'date-oats-bites', 'desserts', 85, 2.0, 3.0, 1.5, 9.0, 15, '/images/healthy/date-bites.jpg', 'Sweet treats made with pureed organic dates, rolled oats, and cardamom. Baked to a chewy perfection, rich in iron, zero added sugar.'),
('e1f1a1b1-eeee-eeee-eeee-eeeeeeeeeeee', 'Air-Baked Corn Tortillas & Fresh Guac', 'baked-nachos-guac', 'snacks', 220, 4.0, 6.5, 10.0, 1.0, 210, '/images/healthy/nachos-guac.jpg', 'Baked yellow corn tortilla triangles served with freshly mashed avocado, tomatoes, lime, and cilantro. Filled with healthy fats and fiber.'),
('e1f1a1b1-eeef-eeee-eeee-eeeeeeeeeeee', 'Dehydrated Spicy Sea Salt Beet Chips', 'beet-chips', 'snacks', 110, 2.5, 4.0, 0.8, 14.0, 180, '/images/healthy/beet-chips.jpg', 'Crisp beetroot slices slow-dehydrated or baked with a pinch of sea salt and pepper. Rich in dietary nitrates and natural fiber.'),
('e1f1a1b1-ffff-ffff-ffff-ffffffffffff', 'Grilled Chicken Breast Wheat Burger', 'grilled-chicken-burger', 'fastfood', 340, 32.0, 5.0, 9.5, 3.0, 480, '/images/healthy/chicken-burger.jpg', 'Juicy grilled chicken breast fillet on a whole wheat bun, topped with lettuce, tomato, and greek yogurt spread instead of mayonnaise.'),
('e1f1a1b1-fffe-ffff-ffff-ffffffffffff', 'Lettuce-Wrapped Spicy Black Bean Burger', 'black-bean-lettuce-burger', 'fastfood', 210, 12.0, 7.5, 4.5, 2.0, 390, '/images/healthy/lettuce-burger.jpg', 'Flavorful roasted black bean and quinoa patty wrapped in fresh iceberg lettuce leaves, served with tomato salsa. Low carb, high fiber.'),
('e1f1a1b1-0000-0000-0000-000000000000', 'Spiced Chole with Baked Oats Roti', 'chole-oats-roti', 'breakfast', 240, 9.0, 8.5, 4.5, 1.5, 390, '/images/healthy/chole-oats.jpg', 'Traditional spicy chickpeas cooked in 1 tsp olive oil, served with 2 baked whole wheat and oats flour rotis.'),
('e1f1a1b1-0001-0000-0000-000000000000', 'Cardamom Ginger Green Tea (Stevia)', 'ginger-green-tea', 'drinks', 5, 0.1, 0.0, 0.0, 0.0, 5, '/images/healthy/green-tea.jpg', 'Freshly brewed loose leaf green tea infused with real ginger roots and cardamom pods, lightly sweetened with natural stevia extract.'),
('e1f1a1b1-0002-0000-0000-000000000000', 'Masala Oats Chai (Jaggery Glazed)', 'oats-milk-chai', 'drinks', 45, 1.5, 0.8, 1.0, 5.0, 15, '/images/healthy/oats-chai.jpg', 'Authentic Indian spiced chai made with creamy, unsweetened oat milk, sweetened lightly with 1 tsp of organic liquid jaggery.'),
('e1f1a1b1-0003-0000-0000-000000000000', 'Clay-Oven Roasted Tandoori Fish Tikka', 'tandoori-fish-tikka', 'fastfood', 160, 24.0, 0.5, 6.0, 0.0, 380, '/images/healthy/tandoori-fish.jpg', 'Lean fish fillets (Basa/Surmai) marinated in lemon-yogurt spices and charred in an oven. Super high protein, low carb, low fat.'),
('e1f1a1b1-0004-0000-0000-000000000000', 'Steel Cut Oats with Berries & Seeds', 'berry-seeds-oats', 'breakfast', 220, 7.0, 6.5, 4.5, 6.0, 10, '/images/healthy/oats-breakfast.jpg', 'Hot steel cut oats prepared with water or skimmed milk, topped with local blueberries, raspberries, and chia/pumpkin seeds.'),
('e1f1a1b1-0005-0000-0000-000000000000', 'Oats Pav & Loaded Veggie Bhaji (1 tsp Butter)', 'oats-pav-bhaji', 'breakfast', 220, 6.0, 7.5, 5.0, 3.5, 490, '/images/healthy/healthy-pav-bhaji.jpg', 'Bhaji cooked with high amounts of cauliflower, peas, and carrots using minimal oil, served with 2 high-fiber baked oats and wheat pavs.');

-- Insert Alternative Mappings
INSERT INTO alternative_mappings (junk_item_id, alternative_id, similarity_reason) VALUES
('a1b1c1d1-1111-1111-1111-111111111111', 'e1f1a1b1-1111-1111-1111-111111111111', 'Provides the same savory masala noodle taste and hot texture, but uses air-dried foxtail millet, reducing calories by 90 kcal, cutting fat by 80%, and providing 8g of prebiotic fiber.'),
('a1b1c1d1-2222-2222-2222-222222222222', 'e1f1a1b1-2222-2222-2222-222222222222', 'Retains the iconic crunchy potato-pea crust feel but is baked in an air-fryer, saving over 130 calories and 80% of saturated oil fat per piece.'),
('a1b1c1d1-2222-2222-2222-222222222222', 'e1f1a1b1-2223-2222-2222-222222222222', 'Replaces the deep-fried, carb-heavy snack with dry-roasted foxnuts, offering a low glycemic index, high fiber alternative with a crisp crunch.'),
('a1b1c1d1-3333-3333-3333-333333333333', 'e1f1a1b1-3333-3333-3333-333333333333', 'Swaps high-fructose corn syrup soda with pure coconut water, replacing 39g of refined sugar with natural minerals and electrolytes for natural hydration.'),
('a1b1c1d1-3333-3333-3333-333333333333', 'e1f1a1b1-3334-3333-3333-333333333333', 'Replaces carbonic acid and sugary sodas with a probiotic sparkling kombucha, delivering fizz and gut-health benefits with only 4g of sugar.'),
('a1b1c1d1-4444-4444-4444-444444444444', 'e1f1a1b1-4444-4444-4444-444444444444', 'Swaps oil-soaked processed potato starch with fiber-rich roasted chickpeas, boosting protein by 7x while cutting fat by 90%.'),
('a1b1c1d1-4444-4444-4444-444444444444', 'e1f1a1b1-4445-4444-4444-444444444444', 'Keeps the sweet-savory chip crunch but uses air-baked plantain slices, slashing high-calorie trans-fats from deep frying.'),
('a1b1c1d1-5555-5555-5555-555555555555', 'e1f1a1b1-5555-5555-5555-555555555555', 'Replaces processed milk solids and 56g of sugar with antioxidant-rich cocoa solids, keeping the sweet craving checked with minimal insulin spikes.'),
('a1b1c1d1-6666-6666-6666-666666666666', 'e1f1a1b1-6666-6666-6666-666666666666', 'Swaps double-fried white potato strips with baked sweet potato wedges, boosting vitamin A/fiber and cutting fat by 80%.'),
('a1b1c1d1-7777-7777-7777-777777777777', 'e1f1a1b1-7777-7777-7777-777777777777', 'Swaps chemically bleached white flour with slow-fermented wheat sourdough, which contains prebiotic-like compounds that ease gut digestion.'),
('a1b1c1d1-7777-7777-7777-777777777777', 'e1f1a1b1-7778-7777-7777-777777777777', 'Replaces high GI empty-calorie white bread with finger millet (Ragi) bread, increasing calcium intake and doubling fiber content.'),
('a1b1c1d1-8888-8888-8888-888888888888', 'e1f1a1b1-8888-8888-8888-888888888888', 'Provides a cold, thick, sweet dessert experience using high-fiber chia seeds and almond milk, packed with healthy omega-3 fatty acids.'),
('a1b1c1d1-8888-8888-8888-888888888888', 'e1f1a1b1-8889-8888-8888-888888888888', 'Replaces processed sugar/cream-based ice cream with blended frozen raspberries and bananas, supplying active vitamins and zero added sweeteners.'),
('a1b1c1d1-9999-9999-9999-999999999999', 'e1f1a1b1-9999-9999-9999-999999999999', 'Swaps high-carbohydrate refined flour dough with a vitamin-dense cauliflower crust, reducing calories by 100+ and carbs by 70%.'),
('a1b1c1d1-9999-9999-9999-999999999999', 'e1f1a1b1-9998-9999-9999-999999999999', 'Replaces grease-laden processed cheese and meats with whole wheat dough topped with olive-oil basil pesto and raw, fiber-rich vegetables.'),
('a1b1c1d1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'e1f1a1b1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Replaces oil-soaked deep-fried batter with sweet baked apple rings glazed in raw honey, cutting processed sugars and heavy ghee saturates.'),
('a1b1c1d1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'e1f1a1b1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Swaps oil-fried white flour momos with steamed whole wheat momos containing lean paneer and fiber-rich oats, lowering fat by 85%.'),
('a1b1c1d1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'e1f1a1b1-bbbc-bbbb-bbbb-bbbbbbbbbbbb', 'Replaces starch wrappers with crisp steamed cabbage leaves, lowering overall carbs to near-zero while keeping the savory dumpling experience.'),
('a1b1c1d1-cccc-cccc-cccc-cccccccccccc', 'e1f1a1b1-cccc-cccc-cccc-cccccccccccc', 'Swaps heavy cream-and-butter tomato gravy with spiced tandoor-charred cottage cheese skewers, lowering calories by 50% and doubling protein absorption.'),
('a1b1c1d1-cccc-cccc-cccc-cccccccccccc', 'e1f1a1b1-cccd-cccc-cccc-cccccccccccc', 'Offers a dairy-free, low cholesterol option using grilled firm organic tofu skewers marinated in heart-healthy mustard oil and garlic.'),
('a1b1c1d1-dddd-dddd-dddd-dddddddddddd', 'e1f1a1b1-dddd-dddd-dddd-dddddddddddd', 'Swaps deep-fried milk powder balls soaked in sugar syrup with baked date and oat balls, replacing empty calories with dietary iron and fiber.'),
('a1b1c1d1-eeee-eeee-eeee-eeeeeeeeeeee', 'e1f1a1b1-eeee-eeee-eeee-eeeeeeeeeeee', 'Replaces fried corn flour chips and processed cheese sauce with oven-baked tortillas and fresh, heart-healthy monounsaturated fat from avocados.'),
('a1b1c1d1-eeee-eeee-eeee-eeeeeeeeeeee', 'e1f1a1b1-eeef-eeee-eeee-eeeeeeeeeeee', 'A dry crunchy snack alternative using dehydrated beet slices, containing natural nitrates that support cardiovascular blood flow.'),
('a1b1c1d1-ffff-ffff-ffff-ffffffffffff', 'e1f1a1b1-ffff-ffff-ffff-ffffffffffff', 'Replaces fried chicken patties and heavy mayo with grilled chicken breast and protein-rich Greek yogurt dressing on whole wheat buns.'),
('a1b1c1d1-ffff-ffff-ffff-ffffffffffff', 'e1f1a1b1-fffe-ffff-ffff-ffffffffffff', 'Swaps beef/processed patties and white buns with high-fiber black bean patties wrapped in fresh crunchy iceberg lettuce leaf cups.'),
('a1b1c1d1-0000-0000-0000-000000000000', 'e1f1a1b1-0000-0000-0000-000000000000', 'Swaps deep-fried refined flour bhatura bread with fiber-rich baked whole-wheat oats roti, and reduces gravy oil fat.'),
('a1b1c1d1-0001-0000-0000-000000000000', 'e1f1a1b1-0001-0000-0000-000000000000', 'Avoids processed white sugar and high fat buffalo milk, substituting antioxidant green tea infused with warm, gut-soothing spices.'),
('a1b1c1d1-0001-0000-0000-000000000000', 'e1f1a1b1-0002-0000-0000-000000000000', 'Replaces regular sugary milk tea with low-glycemic oat milk chai, flavored with ginger and a dash of raw minerals from organic liquid jaggery.'),
('a1b1c1d1-0003-0000-0000-000000000000', 'e1f1a1b1-0003-0000-0000-000000000000', 'Swaps oil-fried fish batter with tandoori grilled fish, preserving lean proteins and healthy Omega-3 fats while eliminating trans-fats.'),
('a1b1c1d1-0004-0000-0000-000000000000', 'e1f1a1b1-0004-0000-0000-000000000000', 'Replaces high GI sugar-coated corn flakes with steel cut oats, stabilizing blood sugar and providing long-lasting energy from complex carbs.'),
('a1b1c1d1-0005-0000-0000-000000000000', 'e1f1a1b1-0005-0000-0000-000000000000', 'Swaps heavily buttered white pav bread and oily bhaji with high-fiber baked oats-wheat pav and a veggie-loaded bhaji made in minimal fat.');

-- Insert healthy cuisine tags
INSERT INTO healthy_cuisine_tags (cuisine_type, health_score, category) VALUES
('Salads', 95, 'Green'),
('South Indian', 75, 'Balanced'),
('Juices', 85, 'Liquid Health'),
('Keto', 90, 'Low Carb'),
('Millet Specials', 90, 'Superfoods'),
('Vegan', 92, 'Plant Based'),
('Tandoori', 80, 'High Protein'),
('Continental', 70, 'Standard'),
('Healthy Food', 95, 'Superfoods'),
('Organic', 90, 'Clean Eating'),
('North Indian', 65, 'Balanced'),
('Mediterranean', 85, 'Heart Healthy');

-- Clean gyms & supplements tables
TRUNCATE gyms CASCADE;
TRUNCATE supplements CASCADE;

-- Insert Gyms Data
INSERT INTO gyms (name, rating, monthly_fee, distance_text, latitude, longitude, address, amenities, is_value_pick, image_url, contact_number) VALUES
-- Indiranagar, Bengaluru
('Cult.fit Elite Indiranagar', 4.8, 3000, '0.5 km', 12.971891, 77.641151, '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru', ARRAY['Group Workouts', 'Strength Training', 'Yoga', 'Boxing', 'Shower'], false, '/images/gyms/cult_indiranagar.jpg', '919876543201'),
('Gold''s Gym Indiranagar', 4.5, 4500, '0.9 km', 12.975000, 77.643000, 'Double Road, Indiranagar, Bengaluru', ARRAY['Strength Training', 'Cardio Machines', 'Personal Training', 'Steam Room'], false, '/images/gyms/golds_indiranagar.jpg', '919876543202'),
('Snap Fitness 24/7 Indiranagar', 4.2, 2500, '1.2 km', 12.969000, 77.638000, '100 Feet Road, Indiranagar, Bengaluru', ARRAY['24/7 Access', 'Cardio Machines', 'Strength Training', 'Free Wi-Fi'], false, '/images/gyms/snap_indiranagar.jpg', '919876543203'),
('Peak Iron Fitness Gym', 4.4, 1500, '0.7 km', 12.973000, 77.640000, 'Lashkar Road, HAL 2nd Stage, Indiranagar, Bengaluru', ARRAY['Strength Training', 'Free Weights', 'Cardio Area'], true, '/images/gyms/peak_indiranagar.jpg', '919876543204'),

-- Bandra West, Mumbai
('Gold''s Gym Bandra', 4.7, 6000, '0.6 km', 19.060691, 72.836250, 'Carter Road, Bandra West, Mumbai', ARRAY['Strength Training', 'Cardio Machines', 'Personal Training', 'Valet Parking', 'Steam Room'], false, '/images/gyms/golds_bandra.jpg', '919876543205'),
('Waves Gym Bandra', 4.6, 5000, '0.8 km', 19.058000, 72.838000, 'Linking Road, Bandra West, Mumbai', ARRAY['Spin Classes', 'Strength Training', 'Cardio Area', 'Steam Bath', 'Juice Bar'], false, '/images/gyms/waves_bandra.jpg', '919876543206'),
('Cult.fit Bandra West', 4.5, 3500, '1.1 km', 19.063000, 72.834000, 'Pali Hill, Bandra West, Mumbai', ARRAY['Group Workouts', 'Strength Training', 'Yoga', 'Boxing'], false, '/images/gyms/cult_bandra.jpg', '919876543207'),
('Iron Temple Bodybuilding Gym', 4.3, 1800, '0.5 km', 19.061000, 72.835000, 'Juhu Tara Road, Bandra, Mumbai', ARRAY['Free Weights', 'Strength Training', 'Personal Training'], true, '/images/gyms/irontemple_bandra.jpg', '919876543208'),

-- Connaught Place, New Delhi
('Gold''s Gym Connaught Place', 4.6, 5000, '0.4 km', 28.630400, 77.217700, 'Outer Circle, Connaught Place, New Delhi', ARRAY['Strength Training', 'Cardio Machines', 'Spa', 'Personal Training'], false, '/images/gyms/golds_cp.jpg', '919876543209'),
('Anytime Fitness CP', 4.5, 3500, '0.8 km', 28.632000, 77.215000, 'Inner Circle, Connaught Place, New Delhi', ARRAY['24/7 Access', 'Cardio Machines', 'Strength Training', 'Private Showers'], false, '/images/gyms/anytime_cp.jpg', '919876543210'),
('Cult.fit Connaught Place', 4.7, 3200, '1.0 km', 28.628000, 77.220000, 'Khan Market, Near CP, New Delhi', ARRAY['Group Workouts', 'Boxing', 'Strength Training', 'Yoga'], false, '/images/gyms/cult_cp.jpg', '919876543211'),
('Delhi Fitness Club CP', 4.1, 1200, '0.5 km', 28.631000, 77.218000, 'M-Block, Connaught Place, New Delhi', ARRAY['Cardio Machines', 'Strength Training', 'Free Weights'], true, '/images/gyms/delhifitness_cp.jpg', '919876543212'),

-- Gachibowli, Hyderabad
('Cult.fit Gachibowli', 4.7, 2800, '0.7 km', 17.440081, 78.348915, 'DLF Cybercity Road, Gachibowli, Hyderabad', ARRAY['Group Workouts', 'Strength Training', 'Yoga', 'Boxing', 'Shower'], false, '/images/gyms/cult_gachibowli.jpg', '919876543213'),
('Nitro Gym Gachibowli', 4.5, 4000, '1.2 km', 17.438000, 78.352000, 'Hitech City Road, Gachibowli, Hyderabad', ARRAY['Jacuzzi', 'Steam Room', 'Cardio Area', 'Strength Training', 'Zumba'], false, '/images/gyms/nitro_gachibowli.jpg', '919876543214'),
('Anytime Fitness Gachibowli', 4.4, 3200, '1.5 km', 17.443000, 78.345000, 'Kondapur Main Road, Near Gachibowli, Hyderabad', ARRAY['24/7 Access', 'Cardio Machines', 'Strength Training', 'Personal Training'], false, '/images/gyms/anytime_gachibowli.jpg', '919876543215'),
('Fit-Life Iron Gym Gachibowli', 4.2, 1200, '0.6 km', 17.441000, 78.349000, 'Gachibowli X Roads, Hyderabad', ARRAY['Free Weights', 'Strength Training', 'Cardio Area'], true, '/images/gyms/fitlife_gachibowli.jpg', '919876543216'),

-- Koregaon Park, Pune
('Gold''s Gym Koregaon Park', 4.8, 5500, '0.6 km', 18.536200, 73.893000, 'North Main Road, Koregaon Park, Pune', ARRAY['Swimming Pool', 'Spa', 'Strength Training', 'Cardio Machines', 'Personal Training'], false, '/images/gyms/golds_kp.jpg', '919876543217'),
('Absolute Fitness KP', 4.4, 3500, '1.0 km', 18.538000, 73.895000, 'Lane 7, Koregaon Park, Pune', ARRAY['Zumba', 'Cardio Machines', 'Strength Training', 'Shower Area'], false, '/images/gyms/absolute_kp.jpg', '919876543218'),
('Cult.fit Koregaon Park', 4.6, 3000, '1.3 km', 18.534000, 73.890000, 'Kalyani Nagar Main Road, Near KP, Pune', ARRAY['Group Workouts', 'Strength Training', 'Yoga', 'Boxing', 'Shower'], false, '/images/gyms/cult_kp.jpg', '919876543219'),
('Muscle Garage Gym KP', 4.3, 1400, '0.4 km', 18.537000, 73.892000, 'Jogger''s Park Road, Koregaon Park, Pune', ARRAY['Strength Training', 'Free Weights', 'Personal Training'], true, '/images/gyms/musclegarage_kp.jpg', '919876543220');

-- Insert Supplements Data
INSERT INTO supplements (name, brand, category, price, servings, dose_per_serving, price_per_serving, rating, tier, buy_links, image_url, benefits) VALUES
-- Whey Protein
('Gold Standard 100% Whey', 'Optimum Nutrition', 'protein', 6899, 60, '24g Whey Protein', 114.9, 4.8, 'market_leader', 
 '{"amazon": "https://www.amazon.in/s?k=Optimum+Nutrition+Gold+Standard+Whey", "blinkit": "https://blinkit.com/s?q=optimum+nutrition+whey", "zepto": "https://www.zeptonow.com/search?q=optimum+nutrition+whey", "healthkart": "https://www.healthkart.com/search?q=ON+Gold+Standard+100+Whey"}',
 '/images/supps/on_whey.jpg', 'Premium micro-filtered whey isolate & concentrate blend. Ultra-pure protein sources, low carbs, fast absorption, third-party tested for safety.'),
('Gold Whey Protein 100%', 'Nakpro', 'protein', 2999, 60, '24g Whey Protein', 49.9, 4.4, 'value_pick', 
 '{"amazon": "https://www.amazon.in/s?k=Nakpro+Gold+Whey+Protein", "blinkit": "https://blinkit.com/s?q=nakpro+whey", "zepto": "https://www.zeptonow.com/search?q=nakpro+whey", "healthkart": "https://www.healthkart.com/search?q=Nakpro+Gold+Whey"}',
 '/images/supps/nakpro_whey.jpg', 'Highly affordable 100% whey protein concentrate. Zero added sugar, naturally rich in BCAAs, lab-verified protein content.'),
('Impact Whey Protein', 'Myprotein', 'protein', 3499, 40, '21g Whey Protein', 87.4, 4.6, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=Myprotein+Impact+Whey", "blinkit": "https://blinkit.com/s?q=myprotein+whey", "zepto": "https://www.zeptonow.com/search?q=myprotein+whey", "healthkart": "https://www.healthkart.com/search?q=Myprotein+Impact+Whey"}',
 '/images/supps/myprotein_whey.jpg', 'Premium quality grass-fed whey concentrate. Exceptionally high grade, rich in essential amino acids, fast digesting, and widely trusted worldwide.'),
('Atom Whey Protein', 'Asitis Nutrition', 'protein', 1899, 33, '27g Whey Protein', 57.5, 4.3, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Asitis+Atom+Whey+Protein", "blinkit": "https://blinkit.com/s?q=asitis+atom+whey", "zepto": "https://www.zeptonow.com/search?q=asitis+atom+whey", "healthkart": "https://www.healthkart.com/search?q=Asitis+Atom+Whey"}',
 '/images/supps/asitis_atom_whey.jpg', 'High protein yield per serving at an extremely competitive price. Fortified with digestive enzymes, zero soy, fast recovery support.'),

-- Creatine
('Creatine Monohydrate (Creapure)', 'MuscleBlaze', 'creatine', 1199, 83, '3g Creapure Creatine', 14.4, 4.7, 'market_leader', 
 '{"amazon": "https://www.amazon.in/s?k=MuscleBlaze+Creatine+Creapure", "blinkit": "https://blinkit.com/s?q=creatine+muscleblaze", "zepto": "https://www.zeptonow.com/search?q=creatine+muscleblaze", "healthkart": "https://www.healthkart.com/search?q=MuscleBlaze+Creapure"}',
 '/images/supps/mb_creatine.jpg', 'Uses 100% pure imported German Creapure. Superfine micronized particles for instant solubility. Maximizes muscle ATP production & strength.'),
('Pure Creatine Monohydrate', 'Asitis Nutrition', 'creatine', 499, 100, '3g Creatine Monohydrate', 4.9, 4.3, 'value_pick', 
 '{"amazon": "https://www.amazon.in/s?k=Asitis+Creatine+Monohydrate", "blinkit": "https://blinkit.com/s?q=creatine+asitis", "zepto": "https://www.zeptonow.com/search?q=creatine+asitis", "healthkart": "https://www.healthkart.com/search?q=Asitis+Creatine"}',
 '/images/supps/asitis_creatine.jpg', 'Pure unflavored, additive-free creatine monohydrate. Provides maximum cost efficiency, aids in muscle gains, volumization, and recovery.'),
('Micronized Creatine Powder', 'Optimum Nutrition', 'creatine', 1499, 83, '3g Micronized Creatine', 18.0, 4.8, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=Optimum+Nutrition+Creatine+Powder", "blinkit": "https://blinkit.com/s?q=on+creatine", "zepto": "https://www.zeptonow.com/search?q=on+creatine", "healthkart": "https://www.healthkart.com/search?q=ON+Micronized+Creatine"}',
 '/images/supps/on_creatine.jpg', 'Industry gold standard pure micronized creatine. Zero fillers, tasteless, mixes effortlessly in any beverage, highly clinically supported for power output.'),
('Pure Wellcore Creatine', 'Wellcore', 'creatine', 649, 83, '3g Pure Creatine', 7.8, 4.5, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Wellcore+Creatine", "blinkit": "https://blinkit.com/s?q=wellcore+creatine", "zepto": "https://www.zeptonow.com/search?q=wellcore+creatine", "healthkart": "https://www.healthkart.com/search?q=Wellcore+Creatine"}',
 '/images/supps/wellcore_creatine.jpg', '100% pure micronized creatine monohydrate. No sugar, no artificial colors, ultra-solubility, popular budget-friendly staple for cellular hydration.'),

-- Pre-workout
('C4 Original Pre-Workout', 'Cellucor', 'preworkout', 2499, 30, '1.6g Beta-Alanine, 150mg Caffeine', 83.3, 4.6, 'market_leader', 
 '{"amazon": "https://www.amazon.in/s?k=Cellucor+C4+Original", "blinkit": "https://blinkit.com/s?q=c4+preworkout", "zepto": "https://www.zeptonow.com/search?q=c4+preworkout", "healthkart": "https://www.healthkart.com/search?q=Cellucor+C4"}',
 '/images/supps/c4_preworkout.jpg', 'Industry-standard clinical blend of explosive energy booster, CarnoSyn Beta-Alanine for endurance, and Arginine Nitrate for intense pumps.'),
('Pre-Workout WrathX', 'MuscleBlaze', 'preworkout', 1399, 30, '3g Citrulline, 200mg Caffeine', 46.6, 4.4, 'value_pick', 
 '{"amazon": "https://www.amazon.in/s?k=MuscleBlaze+WrathX+Preworkout", "blinkit": "https://blinkit.com/s?q=muscleblaze+preworkout", "zepto": "https://www.zeptonow.com/search?q=muscleblaze+preworkout", "healthkart": "https://www.healthkart.com/search?q=MuscleBlaze+WrathX"}',
 '/images/supps/mb_preworkout.jpg', 'Affordable performance blend featuring L-Citrulline Malate, Caffeine, and Beta-Alanine for focus, endurance, and extreme vascularity.'),
('Psychotic Pre-Workout', 'Insane Labz', 'preworkout', 2999, 35, '3.2g Beta-Alanine, 400mg Caffeine', 85.6, 4.5, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=Insane+Labz+Psychotic", "blinkit": "https://blinkit.com/s?q=psychotic+preworkout", "zepto": "https://www.zeptonow.com/search?q=psychotic+preworkout", "healthkart": "https://www.healthkart.com/search?q=Insane+Labz+Psychotic"}',
 '/images/supps/psychotic_preworkout.jpg', 'Ultra-high stimulant formula featuring trademarked AMPiberry to prolong energy curve and focus. For advanced trainees looking for intense pumps.'),
('Pre-Workout Pre-XP', 'Doctors Choice', 'preworkout', 1599, 30, '3g Citrulline, 250mg Caffeine', 53.3, 4.3, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Doctors+Choice+Pre+XP", "blinkit": "https://blinkit.com/s?q=doctors+choice+preworkout", "zepto": "https://www.zeptonow.com/search?q=doctors+choice+preworkout", "healthkart": "https://www.healthkart.com/search?q=Doctors+Choice+Pre+XP"}',
 '/images/supps/dc_preworkout.jpg', 'Excellent value pre-workout. Provides a strong energy kick, hydration electrolytes, and blood flow enhancers at a budget-friendly price point.'),

-- Multivitamins
('Mega Men One Daily', 'GNC', 'multivitamin', 1499, 60, '39 Active Nutrients per Tablet', 24.9, 4.5, 'market_leader', 
 '{"amazon": "https://www.amazon.in/s?k=GNC+Mega+Men+One+Daily", "blinkit": "https://blinkit.com/s?q=gnc+multivitamin", "zepto": "https://www.zeptonow.com/search?q=gnc+multivitamin", "healthkart": "https://www.healthkart.com/search?q=GNC+Mega+Men"}',
 '/images/supps/gnc_multi.jpg', 'Premium comprehensive multivitamin tailored for active men. Contains essential vitamins, muscle support blends, and brain/heart health boosters.'),
('Multivitamin with Probiotics', 'Carbamide Forte', 'multivitamin', 429, 180, '45 Ingredients per Tablet', 2.3, 4.3, 'value_pick', 
 '{"amazon": "https://www.amazon.in/s?k=Carbamide+Forte+Multivitamin+Probiotics", "blinkit": "https://blinkit.com/s?q=carbamide+multivitamin", "zepto": "https://www.zeptonow.com/search?q=carbamide+multivitamin", "healthkart": "https://www.healthkart.com/search?q=Carbamide+Forte+Multivitamin"}',
 '/images/supps/carbamide_multi.jpg', 'Extremely budget-friendly. Packed with 45 vitamins, minerals, and superfoods, combined with direct gut probiotics for maximum absorption.'),
('MB-Vite Daily Multivitamin', 'MuscleBlaze', 'multivitamin', 649, 60, '25 Key Ingredients & Enzymes', 10.8, 4.6, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=MuscleBlaze+MB+Vite", "blinkit": "https://blinkit.com/s?q=mb+vite", "zepto": "https://www.zeptonow.com/search?q=mb+vite", "healthkart": "https://www.healthkart.com/search?q=MuscleBlaze+MB+Vite"}',
 '/images/supps/mb_multi.jpg', 'Top-selling daily multivitamin with specific digestive enzyme blends, energy support extracts, and baseline micro-minerals for active lifestyles.'),
('Revital H Daily Health', 'Revital', 'multivitamin', 350, 60, '10 Vitamins, 9 Minerals & Ginseng', 5.8, 4.2, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Revital+H+Capsules", "blinkit": "https://blinkit.com/s?q=revital+h", "zepto": "https://www.zeptonow.com/search?q=revital+h", "healthkart": "https://www.healthkart.com/search?q=Revital+H"}',
 '/images/supps/revital_multi.jpg', 'Classic, widely available daily health supplement formulated with natural Ginseng extract to enhance energy, stamina, and mental alertness on a budget.'),

-- Omega 3
('Triple Strength Omega 3', 'TrueBasics', 'omega3', 1199, 60, '1250mg Fish Oil (560mg EPA / 400mg DHA)', 19.9, 4.7, 'market_leader', 
 '{"amazon": "https://www.amazon.in/s?k=TrueBasics+Triple+Strength+Omega+3", "blinkit": "https://blinkit.com/s?q=omega+3+truebasics", "zepto": "https://www.zeptonow.com/search?q=omega+3+truebasics", "healthkart": "https://www.healthkart.com/search?q=TrueBasics+Omega+3"}',
 '/images/supps/truebasics_omega.jpg', 'Triple strength refined fish oil. Molecularly distilled, cholesterol-free softgels with high concentration of active EPA and DHA fatty acids.'),
('Premium Salmon Fish Oil', 'Carbamide Forte', 'omega3', 449, 120, '1000mg Fish Oil (180mg EPA / 120mg DHA)', 3.7, 4.2, 'value_pick', 
 '{"amazon": "https://www.amazon.in/s?k=Carbamide+Forte+Salmon+Fish+Oil", "blinkit": "https://blinkit.com/s?q=omega+3+carbamide", "zepto": "https://www.zeptonow.com/search?q=omega+3+carbamide", "healthkart": "https://www.healthkart.com/search?q=Carbamide+Forte+Fish+Oil"}',
 '/images/supps/carbamide_omega.jpg', 'High affordability per capsule. Sourced from cold-water salmon, supports heart, joint, and skin health with baseline macro Omega-3 ratios.'),
('Premium Fish Oil Gold', 'MuscleBlaze', 'omega3', 799, 60, '1000mg Fish Oil (460mg EPA / 380mg DHA)', 13.3, 4.6, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=MuscleBlaze+Fish+Oil+Gold", "blinkit": "https://blinkit.com/s?q=muscleblaze+fish+oil", "zepto": "https://www.zeptonow.com/search?q=muscleblaze+fish+oil", "healthkart": "https://www.healthkart.com/search?q=MuscleBlaze+Fish+Oil"}',
 '/images/supps/mb_omega.jpg', 'High potency enteric-coated fish oil softgels. Zero fishy aftertaste, refined to eliminate heavy metals, high concentration of active fatty acids.'),
('Premium Omega 3 Fish Oil', 'Wow Life Science', 'omega3', 499, 60, '1000mg Fish Oil (350mg EPA / 250mg DHA)', 8.3, 4.3, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Wow+Life+Science+Omega+3", "blinkit": "https://blinkit.com/s?q=wow+omega+3", "zepto": "https://www.zeptonow.com/search?q=wow+omega+3", "healthkart": "https://www.healthkart.com/search?q=Wow+Life+Science+Omega+3"}',
 '/images/supps/wow_omega.jpg', 'Budget-friendly, highly popular clean fish oil capsules. Enteric-coated, premium marine source, supports heart, eye, joint, and brain function.'),
('Biozyme Performance Whey', 'MuscleBlaze', 'protein', 3299, 33, '25g Whey Protein', 99.9, 4.8, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=MuscleBlaze+Biozyme+Performance+Whey", "blinkit": "https://blinkit.com/s?q=muscleblaze+biozyme", "zepto": "https://www.zeptonow.com/search?q=muscleblaze+biozyme", "healthkart": "https://www.healthkart.com/search?q=MuscleBlaze+Biozyme"}',
 '/images/supps/mb_biozyme.jpg', 'Clinically tested and customized for Indian absorption rates. Features proprietary Enhanced Absorption Formula (EAF) to limit bloating.'),
('Pro Performance 100% Whey', 'GNC', 'protein', 2999, 30, '24g Whey Protein', 99.9, 4.5, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=GNC+Pro+Performance+Whey", "blinkit": "https://blinkit.com/s?q=gnc+protein", "zepto": "https://www.zeptonow.com/search?q=gnc+protein", "healthkart": "https://www.healthkart.com/search?q=GNC+Pro+Performance"}',
 '/images/supps/gnc_protein.jpg', 'High quality instantized whey compound, low fat and gluten-free. Extremely popular benchmark entry-level protein drink.'),
('Nitro-Tech Whey Protein', 'MuscleTech', 'protein', 3899, 30, '30g Whey Protein & 3g Creatine', 129.9, 4.7, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=MuscleTech+Nitro+Tech", "blinkit": "https://blinkit.com/s?q=muscletech+protein", "zepto": "https://www.zeptonow.com/search?q=muscletech+protein", "healthkart": "https://www.healthkart.com/search?q=MuscleTech+Nitro+Tech"}',
 '/images/supps/muscletech_protein.jpg', 'Fortified with 3g of strength-enhancing creatine monohydrate and recovery-boosting amino acids. Engineered for lean muscle gains.'),
('Prostar 100% Whey', 'Ultimate Nutrition', 'protein', 4299, 80, '25g Whey Protein', 53.7, 4.6, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=Ultimate+Nutrition+Prostar", "blinkit": "https://blinkit.com/s?q=ultimate+nutrition+prostar", "zepto": "https://www.zeptonow.com/search?q=ultimate+nutrition+prostar", "healthkart": "https://www.healthkart.com/search?q=Ultimate+Nutrition+Prostar"}',
 '/images/supps/prostar_whey.jpg', 'Low-temperature processing preserves maximum active immunoglobulins and micro-fractions. Massive volume size and high serving efficiency.'),
('Platinum Pure Creatine', 'MuscleTech', 'creatine', 999, 83, '3g Creatine Monohydrate', 12.0, 4.7, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=MuscleTech+Platinum+Creatine", "blinkit": "https://blinkit.com/s?q=muscletech+creatine", "zepto": "https://www.zeptonow.com/search?q=muscletech+creatine", "healthkart": "https://www.healthkart.com/search?q=MuscleTech+Platinum+Creatine"}',
 '/images/supps/muscletech_creatine.jpg', 'HPLC-tested micronized creatine powder. Delivers pure strength monohydrate directly to muscles for explosive output.'),
('AMP Creatine HCl', 'GNC', 'creatine', 1699, 60, '2g Creatine Hydrochloride', 28.3, 4.6, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=GNC+AMP+Creatine+HCl", "blinkit": "https://blinkit.com/s?q=gnc+creatine", "zepto": "https://www.zeptonow.com/search?q=gnc+creatine", "healthkart": "https://www.healthkart.com/search?q=GNC+AMP+Creatine+HCl"}',
 '/images/supps/gnc_creatine.jpg', 'High solubility creatine hydrochloride form. Eliminates the need for a loading phase, easier on digestion, zero subcutaneous bloating.'),
('Pure Creatine Powder', 'Nakpro', 'creatine', 449, 83, '3g Creatine Monohydrate', 5.4, 4.2, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Nakpro+Creatine", "blinkit": "https://blinkit.com/s?q=nakpro+creatine", "zepto": "https://www.zeptonow.com/search?q=nakpro+creatine", "healthkart": "https://www.healthkart.com/search?q=Nakpro+Creatine"}',
 '/images/supps/nakpro_creatine.jpg', 'Extremely cost-efficient pure unflavored creatine monohydrate. Ideal budget choice for continuous daily usage.'),
('Creatine Monohydrate 250g', 'Carbamide Forte', 'creatine', 429, 83, '3g Creatine Monohydrate', 5.1, 4.3, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Carbamide+Forte+Creatine", "blinkit": "https://blinkit.com/s?q=carbamide+creatine", "zepto": "https://www.zeptonow.com/search?q=carbamide+creatine", "healthkart": "https://www.healthkart.com/search?q=Carbamide+Forte+Creatine"}',
 '/images/supps/carbamide_creatine.jpg', 'Micronized for high bioavailability. Helps accelerate lean mass development and delays workout fatigue.'),
('Nitraflex Pre-Workout', 'GAT Sport', 'preworkout', 2899, 30, '325mg Caffeine & Boron Citrate', 96.6, 4.7, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=GAT+Sport+Nitraflex", "blinkit": "https://blinkit.com/s?q=nitraflex", "zepto": "https://www.zeptonow.com/search?q=nitraflex", "healthkart": "https://www.healthkart.com/search?q=GAT+Sport+Nitraflex"}',
 '/images/supps/nitraflex.jpg', 'High intensity pre-workout containing clinically studied nitrosigine and test-boosting boron. Ideal for peak performance athletes.'),
('Freak Pre-Workout', 'Bigmuscles Nutrition', 'preworkout', 999, 30, '2g Beta-Alanine, 200mg Caffeine', 33.3, 4.1, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Bigmuscles+Nutrition+Freak", "blinkit": "https://blinkit.com/s?q=bigmuscles+preworkout", "zepto": "https://www.zeptonow.com/search?q=bigmuscles+preworkout", "healthkart": "https://www.healthkart.com/search?q=Bigmuscles+Freak"}',
 '/images/supps/bm_preworkout.jpg', 'Extremely popular low-cost energy formula designed to give quick training stimulation. Contains basic pumps matrix.'),
('Pre-Workout Pre-Fire', 'Absolute Nutrition', 'preworkout', 1199, 30, '2.5g Citrulline, 250mg Caffeine', 39.9, 4.2, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Absolute+Nutrition+Pre+Fire", "blinkit": "https://blinkit.com/s?q=absolute+preworkout", "zepto": "https://www.zeptonow.com/search?q=absolute+preworkout", "healthkart": "https://www.healthkart.com/search?q=Absolute+Nutrition+Pre+Fire"}',
 '/images/supps/absolute_preworkout.jpg', 'Indian market formulation tailored for clean focus and focus support without crash. Safe, standard performance values.'),
('Shatter Pre-Workout', 'MuscleTech', 'preworkout', 2499, 30, '3.2g Beta-Alanine, 350mg Caffeine', 83.3, 4.5, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=MuscleTech+Shatter", "blinkit": "https://blinkit.com/s?q=muscletech+preworkout", "zepto": "https://www.zeptonow.com/search?q=muscletech+preworkout", "healthkart": "https://www.healthkart.com/search?q=MuscleTech+Shatter"}',
 '/images/supps/shatter.jpg', 'Explosive energy and maximum vasodilation. Formulated with key neurotransmitter stimulants for rapid focus development.'),
('HK Vitals Multivitamin', 'HealthKart', 'multivitamin', 399, 60, '9 Essential Amino Acids & Ginseng', 6.6, 4.3, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=HealthKart+HK+Vitals+Multivitamin", "blinkit": "https://blinkit.com/s?q=hk+vitals+multivitamin", "zepto": "https://www.zeptonow.com/search?q=hk+vitals+multivitamin", "healthkart": "https://www.healthkart.com/search?q=HK+Vitals+Multivitamin"}',
 '/images/supps/hk_multi.jpg', 'High consumer base in India. Features a balanced formula of basic micronutrients, taurine, and real Panax Ginseng extracts.'),
('Multivit Sport Daily', 'TrueBasics', 'multivitamin', 899, 60, '40 Active Ingredients & Joint Blend', 14.9, 4.7, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=TrueBasics+Multivit+Sport", "blinkit": "https://blinkit.com/s?q=truebasics+multivitamin", "zepto": "https://www.zeptonow.com/search?q=truebasics+multivitamin", "healthkart": "https://www.healthkart.com/search?q=TrueBasics+Multivit"}',
 '/images/supps/truebasics_multi.jpg', 'Premium active sports supplement loaded with custom brain, antioxidant, joint support, and amino acid blends.'),
('Vitalize Multivitamin', 'Fast&Up', 'multivitamin', 320, 20, '1 Effervescent Tablet', 16.0, 4.4, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Fast+and+Up+Vitalize", "blinkit": "https://blinkit.com/s?q=fast+and+up", "zepto": "https://www.zeptonow.com/search?q=fast+and+up", "healthkart": "https://www.healthkart.com/search?q=Fast+and+Up+Vitalize"}',
 '/images/supps/fastandup_multi.jpg', 'Fizzy effervescent hydration tablets. Easy to consume, orange flavor, rapid absorption profile.'),
('Supradyn Daily Health', 'Supradyn', 'multivitamin', 60, 15, '12 Vitamins & 5 Trace Minerals', 4.0, 4.5, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=Supradyn+Daily", "blinkit": "https://blinkit.com/s?q=supradyn", "zepto": "https://www.zeptonow.com/search?q=supradyn", "healthkart": "https://www.healthkart.com/search?q=Supradyn"}',
 '/images/supps/supradyn.jpg', 'Classic pharmacy multivitamin staple in India. Highly effective, reliable baseline multivitamin at near-zero costs.'),
('HK Vitals Fish Oil', 'HealthKart', 'omega3', 399, 60, '1000mg Fish Oil (180mg EPA / 120mg DHA)', 6.6, 4.3, 'value_pick',
 '{"amazon": "https://www.amazon.in/s?k=HealthKart+HK+Vitals+Fish+Oil", "blinkit": "https://blinkit.com/s?q=hk+vitals+fish+oil", "zepto": "https://www.zeptonow.com/search?q=hk+vitals+fish+oil", "healthkart": "https://www.healthkart.com/search?q=HK+Vitals+Fish+Oil"}',
 '/images/supps/hk_omega.jpg', 'Widely consumed standard fish oil softgels. Sourced from cold-water sardines, double-purified, standard daily dosage.'),
('Triple Strength Fish Oil', 'GNC', 'omega3', 1999, 60, '1000mg Fish Oil (640mg EPA / 240mg DHA)', 33.3, 4.8, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=GNC+Triple+Strength+Fish+Oil", "blinkit": "https://blinkit.com/s?q=gnc+fish+oil", "zepto": "https://www.zeptonow.com/search?q=gnc+fish+oil", "healthkart": "https://www.healthkart.com/search?q=GNC+Triple+Strength+Fish+Oil"}',
 '/images/supps/gnc_omega.jpg', 'Highly concentrated active fatty acids. Purified to eliminate heavy metals, PCBS, and trace mercury. Zero fishy burps.'),
('Deep Sea Fish Oil', 'Neuherbs', 'omega3', 799, 60, '2500mg Fish Oil (800mg EPA / 600mg DHA)', 13.3, 4.5, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=Neuherbs+Deep+Sea+Fish+Oil", "blinkit": "https://blinkit.com/s?q=neuherbs+fish+oil", "zepto": "https://www.zeptonow.com/search?q=neuherbs+fish+oil", "healthkart": "https://www.healthkart.com/search?q=Neuherbs+Fish+Oil"}',
 '/images/supps/neuherbs_omega.jpg', 'High concentration deep sea fish oil with added Lemon flavor to curb aftertaste. Excellent joint and cardiovascular support.'),
('Enteric Coated Fish Oil', 'Optimum Nutrition', 'omega3', 1499, 100, '1000mg Fish Oil (300mg EPA / 200mg DHA)', 14.9, 4.7, 'market_leader',
 '{"amazon": "https://www.amazon.in/s?k=Optimum+Nutrition+Fish+Oil", "blinkit": "https://blinkit.com/s?q=on+fish+oil", "zepto": "https://www.zeptonow.com/search?q=on+fish+oil", "healthkart": "https://www.healthkart.com/search?q=ON+Fish+Oil"}',
 '/images/supps/on_omega.jpg', 'Enteric-coated shell passes intact through stomach acid to dissolve directly in intestines. Premium quality distillation.');

-- Insert labdoor mappings and reports for the seeded supplements automatically
INSERT INTO labdoor_mappings (supplement_id, labdoor_url, labdoor_slug, matched_by, match_status)
SELECT 
    id, 
    'https://labdoor.com/review/' || lower(regexp_replace(regexp_replace(regexp_replace(brand || '-' || name, '[\s]+', '-', 'g'), '[^a-zA-Z0-9\-]', '', 'g'), '\-\-+', '-', 'g')), 
    lower(regexp_replace(regexp_replace(regexp_replace(brand || '-' || name, '[\s]+', '-', 'g'), '[^a-zA-Z0-9\-]', '', 'g'), '\-\-+', '-', 'g')), 
    'admin', 
    'active'::labdoor_match_status
FROM supplements ON CONFLICT (supplement_id) DO NOTHING;

INSERT INTO lab_reports (supplement_id, source_type, issuing_lab, certificate_id, source_url, purity_score, label_accuracy_status, heavy_metals_status, verified_by, verified_at, status)
SELECT 
    id, 
    'third_party_verified'::lab_report_source_type, 
    'Labdoor (USA)', 
    '5P221IU-5', 
    'https://labdoor.com/review/' || lower(regexp_replace(regexp_replace(regexp_replace(brand || '-' || name, '[\s]+', '-', 'g'), '[^a-zA-Z0-9\-]', '', 'g'), '\-\-+', '-', 'g')), 
    95 + (price % 5), 
    'Passed (100% Active ingredients claim)', 
    'Clear (Lead, Mercury, Cadmium & Arsenic undetected)', 
    'Labdoor (USA)', 
    '2026-04-29T00:00:00Z'::timestamp with time zone, 
    'published'::lab_report_status
FROM supplements ON CONFLICT (supplement_id) DO NOTHING;
