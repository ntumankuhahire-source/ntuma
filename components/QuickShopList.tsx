'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, ListChecks, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { QUICK_LIST_CATEGORY } from '@/lib/categories';
import { useRouter } from 'next/navigation';

interface QuickRow {
  id: string;
  description: string;
  qty: string;
}

function emptyRow(): QuickRow {
  return { id: Date.now().toString() + Math.random(), description: '', qty: '' };
}

export default function QuickShopList() {
  const [rows, setRows] = useState<QuickRow[]>([emptyRow()]);
  const [added, setAdded] = useState(false);
  const { addItem, setIsCartOpen } = useCart();
  const router = useRouter();
  const addBtnRef = useRef<HTMLButtonElement>(null);

  // ── Row helpers ────────────────────────────────────────────────────────────
  const updateRow = (id: string, field: keyof Omit<QuickRow, 'id'>, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
    // Give time for DOM to render then scroll to it
    setTimeout(() => addBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  const removeRow = (id: string) => {
    setRows((prev) => (prev.length === 1 ? [emptyRow()] : prev.filter((r) => r.id !== id)));
  };

  // ── Add all filled rows to the shared cart ─────────────────────────────────
  const handleAddToCart = () => {
    const filled = rows.filter((r) => r.description.trim());
    if (filled.length === 0) return;

    filled.forEach((row) => {
      addItem({
        name: row.description.trim(),
        category: QUICK_LIST_CATEGORY,
        price: 0,
        unit: row.qty.trim() || '—',
        quantity: 1,          // each free-text row = 1 line item (qty is embedded in the unit field)
        priceType: 'custom',
        isCustom: true,
      });
    });

    setAdded(true);
    // Brief success flash then open cart
    setTimeout(() => {
      setIsCartOpen(true);
    }, 700);
  };

  const filledCount = rows.filter((r) => r.description.trim()).length;
  const canSubmit = filledCount > 0;

  return (
    <div className="min-h-screen bg-white pb-40">
      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/order"
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <ListChecks className="w-5 h-5 text-emerald-600 shrink-0" />
              <h1 className="font-display font-bold text-xl text-brand-black truncate">
                Quick Shop List
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Type what you need — we'll get it. Prices confirmed via WhatsApp.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 pt-10">
        {/* ── Explainer callout ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 mb-8"
        >
          <ShoppingCart className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800 leading-relaxed">
            <span className="font-semibold">How it works:</span> Type each item and the quantity you need (e.g. "2 kg", "1 pack"). Once you add them, they go into your cart and our team will confirm the price over WhatsApp before delivering.
          </p>
        </motion.div>

        {/* ── Row list ────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Column labels */}
          <div className="grid grid-cols-[1fr_140px_40px] gap-3 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Item</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Qty / Unit</span>
            <span />
          </div>

          <AnimatePresence initial={false}>
            {rows.map((row, idx) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-[1fr_140px_40px] gap-3 items-center">
                  {/* Description */}
                  <div className="relative">
                    {idx === 0 && (
                      <span className="absolute -top-5 left-0" />
                    )}
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                      placeholder={`e.g. ${['Tomatoes', 'Cooking oil', 'Eggs', 'Rice (Kigori)', 'Irish potatoes'][idx % 5]}`}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      aria-label={`Item ${idx + 1} description`}
                    />
                  </div>

                  {/* Qty / unit — free text ("2 kg", "1 pack", "30 pieces") */}
                  <input
                    type="text"
                    value={row.qty}
                    onChange={(e) => updateRow(row.id, 'qty', e.target.value)}
                    placeholder="2 kg"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    aria-label={`Item ${idx + 1} quantity`}
                  />

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                    aria-label={`Remove item ${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Add row button ──────────────────────────────────────────────── */}
        <button
          ref={addBtnRef}
          type="button"
          onClick={addRow}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors group"
        >
          <span className="w-7 h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </span>
          Add another item
        </button>

        {/* ── Pricing notice ──────────────────────────────────────────────── */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            Ask price
          </span>
          <span>All Quick List items are added without a price — confirmed on WhatsApp before delivery.</span>
        </div>
      </div>

      {/* ── Pinned bottom CTA ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {added ? (
                <motion.p
                  key="added"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm font-semibold text-emerald-700"
                >
                  ✓ Added {filledCount} item{filledCount !== 1 ? 's' : ''} to your cart
                </motion.p>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-slate-400 truncate"
                >
                  {filledCount > 0
                    ? `${filledCount} item${filledCount !== 1 ? 's' : ''} ready to add`
                    : 'Fill in at least one item above'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleAddToCart}
            className={`shrink-0 inline-flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-full transition-all ${
              canSubmit
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Add to Cart
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
