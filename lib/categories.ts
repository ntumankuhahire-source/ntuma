/**
 * Single source of truth for Ntuma's 4 fixed product categories.
 *
 * Rules:
 *  - Never add a 5th entry here without a full taxonomy review.
 *  - A Product's category field MUST be one of the 4 ids below.
 *  - Admin UI, order flow, and filters all import from this file directly.
 *  - There is no Categories table in the database; these are compile-time constants.
 */

export type CategoryId =
  | 'fresh-produce'
  | 'ready-to-cook'
  | 'animal-products'
  | 'supermarket-items';

export interface Category {
  id: CategoryId;
  name: string;
  /** One-liner shown as the tile subtitle on /order */
  relatedBy: string;
  /** Human-readable summary of what this category includes */
  includes: string;
  /** Fixed subcategory chips shown on the product browse screen */
  subcategories: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'fresh-produce',
    name: 'Fresh Produce',
    relatedBy: 'Straight from the farm, uncut, and unprocessed.',
    includes: 'Whole fruits, raw vegetables, tubers, and untouched greens.',
    subcategories: ['Fruits', 'Vegetables', 'Tubers', 'Greens'],
  },
  {
    id: 'ready-to-cook',
    name: 'Ready-to-Cook',
    relatedBy: 'Pre-washed, pre-chopped, and mixed to save the buyer time.',
    includes: 'Chopped onions, sliced cabbage, Isombe mixes, and stir-fry packs.',
    subcategories: ['Chopped & Sliced', 'Mixes', 'Stir-Fry Packs'],
  },
  {
    id: 'animal-products',
    name: 'Animal Products',
    relatedBy: 'The core protein/animal source of the meal, requiring cold storage.',
    includes: 'Meat, fish, eggs, and dairy.',
    subcategories: ['Meat', 'Fish', 'Eggs', 'Dairy'],
  },
  {
    id: 'supermarket-items',
    name: 'Supermarket Items',
    relatedBy: 'Dry goods, bottled items, long shelf-life, and general household needs.',
    includes: 'Packaged goods, sanitary items, cooking oil, maize flour, spices, mayonnaise, and household items.',
    subcategories: ['Packaged Goods', 'Sanitary', 'Cooking Oil', 'Flour & Grains', 'Spices & Condiments', 'Household'],
  },
];

/** Quick lookup: category id → Category object */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/** All valid category ids as a Set, for fast validation */
export const VALID_CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

/** The special pseudo-category id used exclusively for Quick List order items */
export const QUICK_LIST_CATEGORY = 'Quick List' as const;
