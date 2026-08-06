export type PriceType = 'fixed' | 'variable';

export interface Product {
  id: string;
  name: string;
  category: string; // e.g. 'groceries'
  subcategory: string;
  price: number; // For variable products, this is a base/estimate price if any, or just 0
  unit: string;
  priceType: PriceType;
  image?: string;
}

export const CATEGORIES = [
  {
    id: 'groceries',
    name: 'Groceries',
    hint: 'Fruits, vegetables, tubers',
    icon: 'Apple',
  },
  {
    id: 'animal-products',
    name: 'Animal Products',
    hint: 'Meat, fish, eggs, dairy',
    icon: 'Beef', // Using Lucide icon names roughly
  },
  {
    id: 'supermarket',
    name: 'Supermarket Items',
    hint: 'Packaged goods, household',
    icon: 'ShoppingCart',
  },
  {
    id: 'other',
    name: 'Other',
    hint: 'Something specific? Tell us what and where.',
    icon: 'Search', // Or HelpCircle
  },
];

export const CATALOG: Product[] = [
  // Groceries
  { id: 'g1', name: 'Bananas (Sweet)', category: 'groceries', subcategory: 'Fruits', price: 1200, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300&q=80' },
  { id: 'g2', name: 'Avocados', category: 'groceries', subcategory: 'Fruits', price: 200, unit: 'piece', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80' },
  { id: 'g3', name: 'Tomatoes', category: 'groceries', subcategory: 'Vegetables', price: 800, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80' },
  { id: 'g4', name: 'Onions', category: 'groceries', subcategory: 'Vegetables', price: 700, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80' },
  { id: 'g5', name: 'Irish Potatoes', category: 'groceries', subcategory: 'Tubers', price: 500, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80' },
  
  // Animal Products
  { id: 'a1', name: 'Beef (With Bone)', category: 'animal-products', subcategory: 'Meat', price: 3500, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1607116176195-b81b1f41f536?w=300&q=80' },
  { id: 'a2', name: 'Chicken (Whole)', category: 'animal-products', subcategory: 'Meat', price: 6000, unit: 'piece', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&q=80' },
  { id: 'a3', name: 'Eggs (Tray of 30)', category: 'animal-products', subcategory: 'Eggs', price: 3500, unit: 'tray', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&q=80' },
  { id: 'a4', name: 'Fresh Milk (Inyange)', category: 'animal-products', subcategory: 'Dairy', price: 1000, unit: 'liter', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80' },
  { id: 'a5', name: 'Tilapia Fish', category: 'animal-products', subcategory: 'Fish', price: 4000, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80' },

  // Supermarket Items
  { id: 's1', name: 'Sugar (Kabuye)', category: 'supermarket', subcategory: 'Pantry', price: 1500, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300&q=80' },
  { id: 's2', name: 'Cooking Oil (Golden)', category: 'supermarket', subcategory: 'Pantry', price: 2500, unit: 'liter', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80' },
  { id: 's3', name: 'Rice (Kigori)', category: 'supermarket', subcategory: 'Pantry', price: 1300, unit: 'kg', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80' },
  { id: 's4', name: 'Toilet Paper (Velvex)', category: 'supermarket', subcategory: 'Household', price: 4000, unit: 'pack', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=300&q=80' },
  { id: 's5', name: 'Soap (Omo 500g)', category: 'supermarket', subcategory: 'Household', price: 1000, unit: 'piece', priceType: 'fixed', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=300&q=80' },
];
