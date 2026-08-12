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

export const CATALOG: Product[] = [];
