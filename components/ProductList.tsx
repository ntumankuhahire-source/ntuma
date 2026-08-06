'use client';

import { CATALOG, CATEGORIES, Product } from '@/lib/catalog';
import { useCart } from '@/lib/CartContext';
import { ArrowLeft, Plus, Minus, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductList({ categoryId }: { categoryId: string }) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const products = CATALOG.filter(p => p.category === categoryId);
  
  // Extract unique subcategories
  const subcategories = ['All', ...Array.from(new Set(products.map(p => p.subcategory)))];
  const [activeSub, setActiveSub] = useState('All');
  
  const { items, addItem, updateQuantity } = useCart();

  const filteredProducts = activeSub === 'All' 
    ? products 
    : products.filter(p => p.subcategory === activeSub);

  if (!category) {
    return <div className="p-8 text-center text-slate-500">Category not found.</div>;
  }

  return (
    <div className="pb-32">
      {/* Sticky Sub-header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 pt-6 pb-4 px-6 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/order" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="font-display font-semibold text-2xl">{category.name}</h1>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2 gap-2 snap-x">
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSub === sub 
                    ? 'bg-emerald-700 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-8 space-y-4">
        {filteredProducts.map(product => (
          <ProductRow 
            key={product.id} 
            product={product} 
            cartItem={items.find(i => i.productId === product.id)}
            onAdd={(qty, note) => addItem({
              productId: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              unit: product.unit,
              quantity: qty,
              priceType: product.priceType,
              note: note
            })}
            onUpdate={(id, qty) => updateQuantity(id, qty)}
          />
        ))}
      </div>
    </div>
  );
}

function ProductRow({ product, cartItem, onAdd, onUpdate }: { 
  product: Product, 
  cartItem?: any, 
  onAdd: (qty: number, note?: string) => void,
  onUpdate: (id: string, qty: number) => void
}) {
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [variableInput, setVariableInput] = useState({ qty: '1', note: '' });

  const handleVariableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(parseFloat(variableInput.qty) || 1, variableInput.note);
    setShowVariableForm(false);
    setVariableInput({ qty: '1', note: '' });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-emerald-100 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-4 flex-1">
          {product.image && (
            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-medium">{product.name}</h3>
              {product.priceType === 'variable' && (
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                  Ask price
                </span>
              )}
            </div>
            
            {product.priceType === 'fixed' ? (
              <p className="font-mono text-sm text-slate-500">
                {product.price.toLocaleString()} RWF / {product.unit}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Price varies — tell us how much
              </p>
            )}
          </div>
        </div>

        <div>
          {cartItem && product.priceType === 'fixed' ? (
            <div className="flex items-center gap-3 bg-emerald-50 rounded-full px-2 py-1 border border-emerald-100">
              <button
                onClick={() => onUpdate(cartItem.id, cartItem.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono font-medium w-4 text-center text-emerald-900">{cartItem.quantity}</span>
              <button
                onClick={() => onUpdate(cartItem.id, cartItem.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : product.priceType === 'fixed' ? (
            <button 
              onClick={() => onAdd(1)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 font-medium text-sm px-5 py-2 rounded-full transition-colors"
            >
              Add
            </button>
          ) : (
            <button 
              onClick={() => setShowVariableForm(!showVariableForm)}
              className="bg-brand-yellow/20 hover:bg-brand-yellow/30 text-brand-black font-medium text-sm px-5 py-2 rounded-full transition-colors"
            >
              Request quantity
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showVariableForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <form onSubmit={handleVariableSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder={`Quantity (in ${product.unit})`}
                    value={variableInput.qty}
                    onChange={(e) => setVariableInput({ ...variableInput, qty: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div className="flex-[2]">
                  <input
                    type="text"
                    placeholder="Note (e.g. ripe, small ones)"
                    value={variableInput.note}
                    onChange={(e) => setVariableInput({ ...variableInput, note: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                  Add to Cart
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
