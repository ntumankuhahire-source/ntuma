'use client';

import { CATALOG, Product } from '@/lib/catalog';
import { CATEGORIES } from '@/lib/categories';
import { fetchProducts } from '@/lib/sheetsApi';
import { useCart } from '@/lib/CartContext';
import {
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
  Search,
  ShoppingBag,
  Leaf,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Category Default Fallback Images ─────────────────────────────────────────
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'fresh-produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
  'ready-to-cook': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
  'animal-products': 'https://images.unsplash.com/photo-1607116176195-b81b1f41f536?w=400&q=80',
  'supermarket-items': 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80',
};

// ── Smart Keyword Image Fallback Mapping ─────────────────────────────────────
const ITEM_IMAGE_FALLBACKS: Record<string, string> = {
  // Fresh Produce & Greens
  'amaranth': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  'dodo': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  'greens': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  'cassava': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
  'isombe': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
  'beans': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
  'sweet potato': 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&q=80',
  'irish': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
  'bananas': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80',
  'mango': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80',
  'tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
  'onions': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
  'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&q=80',

  // Dairy & Protein
  'inyange milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
  'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
  'yoghurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
  'fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
  'tilapia': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
  'sambaza': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80',
  'eggs': 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80',
  'egg': 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80',
  'beef': 'https://images.unsplash.com/photo-1607116176195-b81b1f41f536?w=400&q=80',
  'chicken': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80',
  'goat': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',

  // Supermarket & Household
  'sugar': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80',
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  'toilet paper': 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&q=80',
  'soap': 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&q=80',
  'cooking oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
  'flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
  'akabanga': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80',
};

function getProductImageUrl(product: Product): string {
  if (product.image && product.image.trim() !== '') return product.image;

  // Try matching catalog item by ID or Name
  const catalogItem = CATALOG.find(
    (p) => p.id === product.id || p.name.toLowerCase() === product.name.toLowerCase()
  );
  if (catalogItem?.image) return catalogItem.image;

  // Keyword match
  const nameLower = product.name.toLowerCase();
  for (const [key, url] of Object.entries(ITEM_IMAGE_FALLBACKS)) {
    if (nameLower.includes(key)) return url;
  }

  // Category level default fallback
  return CATEGORY_FALLBACK_IMAGES[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80';
}

export default function ProductList({ categoryId }: { categoryId: string }) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSub, setActiveSub] = useState('All');
  const { items, addItem, updateQuantity } = useCart();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const sheetProds = await fetchProducts();
        const catSheetProds = sheetProds.filter((p) => p.category === categoryId);

        if (catSheetProds.length > 0) {
          const mapped: Product[] = catSheetProds.map((sp) => ({
            id: sp.id,
            name: sp.name,
            category: sp.category as any,
            subcategory: sp.subcategory || 'General',
            price: Number(sp.price) || 0,
            unit: sp.unit || 'pc',
            priceType: sp.priceType || (Number(sp.price) > 0 ? 'fixed' : 'variable'),
            image: sp.image || undefined,
          }));
          setProducts(mapped);
        } else {
          setProducts(CATALOG.filter((p) => p.category === categoryId));
        }
      } catch (err) {
        console.error('Failed to load products from Google Sheets:', err);
        setProducts(CATALOG.filter((p) => p.category === categoryId));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [categoryId]);

  const fixedSubcategories = category?.subcategories ?? [];
  const availableSubcategories = fixedSubcategories.filter((sub) =>
    products.some((p) => p.subcategory === sub)
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSub = activeSub === 'All' || p.subcategory === activeSub;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSub && matchesSearch;
    });
  }, [products, activeSub, searchQuery]);

  if (!category) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Category Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested product category does not exist.</p>
        <Link href="/order" className="btn-primary">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4">
      {/* ── Category Banner Header ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#0F6D38] via-[#0F6D38] to-[#0A4B26] text-white rounded-3xl p-6 sm:p-10 shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Link
              href="/order"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Category Catalog
            </span>
          </div>

          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-1.5 leading-relaxed">
              {category.relatedBy} {category.includes}
            </p>
          </div>

          {/* Search bar */}
          <div className="pt-2">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Subcategory filter chips ──────────────────────────────────────── */}
      {availableSubcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-8 snap-x">
          <button
            key="All"
            onClick={() => setActiveSub('All')}
            className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-xs ${
              activeSub === 'All'
                ? 'bg-[#0F6D38] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Items
          </button>
          {availableSubcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-xs ${
                activeSub === sub
                  ? 'bg-[#0F6D38] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* ── Products Grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
          <span className="text-sm font-medium">Loading items from store...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-slate-800">No items found</h3>
          <p className="text-slate-500 text-sm mt-1">
            {searchQuery ? `No results for "${searchQuery}"` : 'No items available in this category yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={items.find((i) => i.productId === product.id)}
              onAdd={(qty, note) =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  category: product.category,
                  price: product.price,
                  unit: product.unit,
                  quantity: qty,
                  priceType: product.priceType,
                  note,
                  isCustom: false,
                })
              }
              onUpdate={(id, qty) => updateQuantity(id, qty)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fancy Product Card Component ──────────────────────────────────────────────
function ProductCard({
  product,
  cartItem,
  onAdd,
  onUpdate,
}: {
  product: Product;
  cartItem?: any;
  onAdd: (qty: number, note?: string) => void;
  onUpdate: (id: string, qty: number) => void;
}) {
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [variableInput, setVariableInput] = useState({ qty: '1', note: '' });
  const [imageSrc, setImageSrc] = useState<string>(() => getProductImageUrl(product));

  useEffect(() => {
    setImageSrc(getProductImageUrl(product));
  }, [product]);

  const handleImageError = () => {
    // If the image link fails to load (e.g. 404 or broken external link), replace with category default
    setImageSrc(CATEGORY_FALLBACK_IMAGES[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80');
  };

  const handleVariableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(parseFloat(variableInput.qty) || 1, variableInput.note);
    setShowVariableForm(false);
    setVariableInput({ qty: '1', note: '' });
  };

  return (
    <div className="bg-white border border-slate-200/90 hover:border-emerald-500 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Product Image Thumbnail */}
        <div className="w-full h-48 rounded-2xl overflow-hidden shadow-xs border border-slate-100 bg-slate-50 relative mb-4">
          <img
            src={imageSrc}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Subcategory Tag */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-white/50">
            {product.subcategory}
          </span>
          {/* Ask price tag */}
          {product.priceType === 'variable' && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Ask Price
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="font-display font-bold text-slate-900 text-lg sm:text-xl capitalize leading-snug group-hover:text-[#0F6D38] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            {product.priceType === 'fixed' ? (
              <span className="font-mono text-base font-bold text-[#0F6D38] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/70 inline-block">
                {product.price.toLocaleString()} RWF{' '}
                <span className="text-xs text-slate-500 font-normal">/ {product.unit}</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/70 inline-block">
                Price varies — to be confirmed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-3">
        {cartItem && product.priceType === 'fixed' ? (
          /* Interactive Quantity Pill when in cart */
          <div className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-1.5 px-3">
            <span className="text-xs font-bold text-[#0F6D38] uppercase">In Cart</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdate(cartItem.id, cartItem.quantity - 1)}
                className="w-8 h-8 rounded-full bg-white hover:bg-emerald-100 text-[#0F6D38] flex items-center justify-center transition-colors font-bold shadow-xs active:scale-95 border border-emerald-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-mono font-bold text-slate-900 text-base">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdate(cartItem.id, cartItem.quantity + 1)}
                className="w-8 h-8 rounded-full bg-[#0F6D38] hover:bg-[#0A4B26] text-white flex items-center justify-center transition-colors font-bold shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : product.priceType === 'fixed' ? (
          /* Add Button */
          <button
            type="button"
            onClick={() => onAdd(1)}
            className="w-full bg-[#0F6D38] hover:bg-[#0A4B26] text-white font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md text-sm font-display cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add to Order
          </button>
        ) : (
          /* Variable Price Request Button */
          <button
            type="button"
            onClick={() => setShowVariableForm(!showVariableForm)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm text-sm font-display cursor-pointer"
          >
            Request Quantity
          </button>
        )}
      </div>

      {/* Variable Item Form */}
      <AnimatePresence>
        {showVariableForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
              <form onSubmit={handleVariableSubmit} className="space-y-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  placeholder={`Quantity in ${product.unit}`}
                  value={variableInput.qty}
                  onChange={(e) => setVariableInput({ ...variableInput, qty: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono outline-none"
                />
                <input
                  type="text"
                  placeholder="Note (e.g. ripe, small ones)"
                  value={variableInput.note}
                  onChange={(e) => setVariableInput({ ...variableInput, note: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#0F6D38] hover:bg-[#0A4B26] text-white text-xs font-bold py-2 rounded-xl transition-colors"
                >
                  Add Request
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
