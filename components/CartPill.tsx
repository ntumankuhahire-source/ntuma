'use client';

import { useCart } from '@/lib/CartContext';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPill() {
  const { totalItems, fixedTotal, hasPendingPrices, isCartOpen, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  const displayTotal = `${hasPendingPrices ? '~' : ''}${fixedTotal.toLocaleString()} RWF`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-40"
      >
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="bg-brand-black text-white px-6 py-4 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="font-mono text-sm font-medium">
            {totalItems} items &middot; {displayTotal}
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
