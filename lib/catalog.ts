import type { CategoryId } from './categories';

export type PriceType = 'fixed' | 'variable' | 'custom';

export interface Product {
  id: string;
  name: string;
  /** Must be one of the 4 fixed CategoryId values from lib/categories.ts */
  category: CategoryId;
  subcategory: string;
  price: number; // For variable/custom products this is 0
  unit: string;
  priceType: PriceType;
  image?: string;
}

export const CATALOG: Product[] = [
  // ─── Fresh Produce ───────────────────────────────────────────────────────────
  { id: 'fp1', name: 'Bananas (Sweet)',   category: 'fresh-produce', subcategory: 'Fruits',     price: 1200, unit: 'kg',    priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300&q=80' },
  { id: 'fp2', name: 'Avocados',          category: 'fresh-produce', subcategory: 'Fruits',     price: 200,  unit: 'piece', priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80' },
  { id: 'fp3', name: 'Mango',             category: 'fresh-produce', subcategory: 'Fruits',     price: 0,    unit: 'piece', priceType: 'variable', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&q=80' },
  { id: 'fp4', name: 'Tomatoes',          category: 'fresh-produce', subcategory: 'Vegetables', price: 800,  unit: 'kg',    priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80' },
  { id: 'fp5', name: 'Onions',            category: 'fresh-produce', subcategory: 'Vegetables', price: 700,  unit: 'kg',    priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80' },
  { id: 'fp6', name: 'Cabbage (Whole)',   category: 'fresh-produce', subcategory: 'Vegetables', price: 0,    unit: 'head',  priceType: 'variable', image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&q=80' },
  { id: 'fp7', name: 'Irish Potatoes',   category: 'fresh-produce', subcategory: 'Tubers',     price: 500,  unit: 'kg',    priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80' },
  { id: 'fp8', name: 'Sweet Potatoes',   category: 'fresh-produce', subcategory: 'Tubers',     price: 0,    unit: 'kg',    priceType: 'variable', image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=300&q=80' },
  { id: 'fp9', name: 'Cassava',          category: 'fresh-produce', subcategory: 'Tubers',     price: 0,    unit: 'kg',    priceType: 'variable', image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&q=80' },
  { id: 'fp10', name: 'Spinach',         category: 'fresh-produce', subcategory: 'Greens',     price: 0,    unit: 'bunch', priceType: 'variable', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80' },
  { id: 'fp11', name: 'Amaranth (Dodo)', category: 'fresh-produce', subcategory: 'Greens',     price: 0,    unit: 'bunch', priceType: 'variable', image: 'https://images.unsplash.com/photo-1583195764036-46f545b81938?w=300&q=80' },

  // ─── Ready-to-Cook ───────────────────────────────────────────────────────────
  { id: 'rc1', name: 'Chopped Onions Pack',    category: 'ready-to-cook', subcategory: 'Chopped & Sliced', price: 0, unit: 'pack',  priceType: 'variable', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80' },
  { id: 'rc2', name: 'Sliced Cabbage Pack',    category: 'ready-to-cook', subcategory: 'Chopped & Sliced', price: 0, unit: 'pack',  priceType: 'variable', image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&q=80' },
  { id: 'rc3', name: 'Diced Tomato Mix',       category: 'ready-to-cook', subcategory: 'Chopped & Sliced', price: 0, unit: 'pack',  priceType: 'variable', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80' },
  { id: 'rc4', name: 'Isombe Mix (Cassava Leaves)', category: 'ready-to-cook', subcategory: 'Mixes', price: 0, unit: 'pack', priceType: 'variable', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80' },
  { id: 'rc5', name: 'Beans & Greens Mix',     category: 'ready-to-cook', subcategory: 'Mixes', price: 0, unit: 'pack',  priceType: 'variable', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80' },
  { id: 'rc6', name: 'Vegetable Stir-Fry Pack', category: 'ready-to-cook', subcategory: 'Stir-Fry Packs', price: 0, unit: 'pack', priceType: 'variable', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80' },
  { id: 'rc7', name: 'Meat & Veggie Stir-Fry', category: 'ready-to-cook', subcategory: 'Stir-Fry Packs', price: 0, unit: 'pack', priceType: 'variable', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },

  // ─── Animal Products ─────────────────────────────────────────────────────────
  { id: 'a1', name: 'Beef (With Bone)',         category: 'animal-products', subcategory: 'Meat',  price: 3500, unit: 'kg',    priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1607116176195-b81b1f41f536?w=300&q=80' },
  { id: 'a2', name: 'Chicken (Whole)',          category: 'animal-products', subcategory: 'Meat',  price: 6000, unit: 'piece', priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&q=80' },
  { id: 'a3', name: 'Goat Meat',               category: 'animal-products', subcategory: 'Meat',  price: 0,    unit: 'kg',    priceType: 'variable', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&q=80' },
  { id: 'a4', name: 'Tilapia Fish',            category: 'animal-products', subcategory: 'Fish',  price: 4000, unit: 'kg',    priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80' },
  { id: 'a5', name: 'Catfish (Sambaza)',        category: 'animal-products', subcategory: 'Fish',  price: 0,    unit: 'kg',    priceType: 'variable', image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=300&q=80' },
  { id: 'a6', name: 'Eggs (Tray of 30)',       category: 'animal-products', subcategory: 'Eggs',  price: 3500, unit: 'tray',  priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&q=80' },
  { id: 'a7', name: 'Fresh Milk (Inyange)',    category: 'animal-products', subcategory: 'Dairy', price: 1000, unit: 'liter', priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80' },
  { id: 'a8', name: 'Yoghurt (Plain)',         category: 'animal-products', subcategory: 'Dairy', price: 1200, unit: 'liter', priceType: 'fixed',    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80' },

  // ─── Supermarket Items ────────────────────────────────────────────────────────
  { id: 's1',  name: 'Sugar (Kabuye)',           category: 'supermarket-items', subcategory: 'Packaged Goods',       price: 1500, unit: 'kg',    priceType: 'fixed', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300&q=80' },
  { id: 's2',  name: 'Rice (Kigori)',            category: 'supermarket-items', subcategory: 'Packaged Goods',       price: 1300, unit: 'kg',    priceType: 'fixed', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80' },
  { id: 's3',  name: 'Toilet Paper (Velvex)',   category: 'supermarket-items', subcategory: 'Sanitary',             price: 4000, unit: 'pack',  priceType: 'fixed', image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=300&q=80' },
  { id: 's4',  name: 'Soap (Omo 500g)',         category: 'supermarket-items', subcategory: 'Sanitary',             price: 1000, unit: 'piece', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=300&q=80' },
  { id: 's5',  name: 'Cooking Oil (Golden)',    category: 'supermarket-items', subcategory: 'Cooking Oil',          price: 2500, unit: 'liter', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80' },
  { id: 's6',  name: 'Maize Flour (Akabanga)', category: 'supermarket-items', subcategory: 'Flour & Grains',       price: 800,  unit: 'kg',    priceType: 'fixed', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
  { id: 's7',  name: 'Wheat Flour',            category: 'supermarket-items', subcategory: 'Flour & Grains',       price: 900,  unit: 'kg',    priceType: 'fixed', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80' },
  { id: 's8',  name: 'Akabanga Chili Oil',     category: 'supermarket-items', subcategory: 'Spices & Condiments',  price: 1500, unit: 'bottle',priceType: 'fixed', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&q=80' },
  { id: 's9',  name: 'Mayonnaise (Remia)',     category: 'supermarket-items', subcategory: 'Spices & Condiments',  price: 1800, unit: 'jar',   priceType: 'fixed', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
  { id: 's10', name: 'Dish Soap (Mama Lemon)', category: 'supermarket-items', subcategory: 'Household',            price: 800,  unit: 'bottle',priceType: 'fixed', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80' },
];
