'use client';

import { useCart } from '@/lib/CartContext';
import { CATEGORIES } from '@/lib/categories';
import { X, Plus, Minus, ChevronRight, Leaf, Scissors, Beef, ShoppingBag, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ICON_MAP: Record<string, React.ElementType> = {
  'fresh-produce':    Leaf,
  'ready-to-cook':    Scissors,
  'animal-products':  Beef,
  'supermarket-items': ShoppingBag,
  'Quick List':       ListChecks,
};

export default function CartDrawer() {
  const { items, updateQuantity, removeItem, isCartOpen, setIsCartOpen, fixedTotal, hasPendingPrices } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleKeepShopping = (categoryId: string) => {
    setIsCartOpen(false);
    router.push(`/order/${categoryId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-brand-black/20 backdrop-blur-sm"
        />

        {/* Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute bottom-0 left-0 right-0 md:static md:w-[480px] md:h-full bg-white rounded-t-2xl md:rounded-none shadow-2xl flex flex-col h-[85vh] max-h-screen"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="font-display font-semibold text-xl">Your Order</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {Object.keys(groupedItems).length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([categoryId, catItems]) => {
                const categoryDef = CATEGORIES.find(c => c.id === categoryId);
                return (
                  <div key={categoryId} className="space-y-4">
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      {categoryDef?.name || categoryId}
                    </h3>
                    <div className="space-y-4">
                      {catItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            {item.priceType === 'fixed' ? (
                              <p className="font-mono text-xs text-slate-500 mt-1">
                                {(item.price * item.quantity).toLocaleString()} RWF
                              </p>
                            ) : (
                              <p className="font-mono text-xs text-yellow-600 mt-1 bg-yellow-50 inline-block px-2 py-0.5 rounded">
                                Price to confirm
                              </p>
                            )}
                            {item.note && <p className="text-xs text-slate-400 mt-1 italic">"{item.note}"</p>}
                          </div>
                          
                          <div className="flex items-center gap-3 bg-slate-50 rounded-full px-2 py-1 border border-slate-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-brand-black"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-brand-black"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}

            {/* Keep Shopping Section */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="font-display font-medium text-sm mb-4">Keep Shopping</h3>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = ICON_MAP[cat.id] ?? ShoppingBag;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleKeepShopping(cat.id)}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors border border-transparent hover:border-emerald-100 text-center"
                    >
                      <Icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" />
                      <span className="font-medium text-xs">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgb(0,0,0,0.05)] z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-slate-500">Estimated Total</p>
                <p className="font-mono text-xl font-medium mt-1">
                  {hasPendingPrices ? '~' : ''}{fixedTotal.toLocaleString()} RWF
                </p>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Go to checkout
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
