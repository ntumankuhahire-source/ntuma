'use client';

import { CATEGORIES } from '@/lib/catalog';
import { Apple, Beef, ShoppingCart, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';

const ICON_MAP: Record<string, any> = { Apple, Beef, ShoppingCart, HelpCircle };

const CAT_IMAGES: Record<string, string> = {
  'groceries': '/vegetable.webp',
  'animal-products': '/chicken.png',
  'supermarket': '/supermarket.png',
  'other': '/other.png'
};

export default function CategoryGrid() {
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [otherItem, setOtherItem] = useState({ description: '', vendor: '', quantity: '1' });
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddOther = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otherItem.description) return;
    
    addItem({
      name: otherItem.description,
      category: 'other',
      price: 0,
      unit: 'custom',
      quantity: parseInt(otherItem.quantity) || 1,
      priceType: 'other',
      vendor: otherItem.vendor,
    });
    
    setShowOtherForm(false);
    setOtherItem({ description: '', vendor: '', quantity: '1' });
  };

  const handleTileClick = (e: React.MouseEvent, catId: string) => {
    if (catId === 'other') {
      e.preventDefault();
      setShowOtherForm(true);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="eyebrow text-emerald-700 justify-center">START AN ORDER</h2>
        <h1 className="section-heading text-4xl sm:text-5xl lg:text-6xl text-brand-black tracking-tight mt-4">
          What are you shopping for today?
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {CATEGORIES.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon] || HelpCircle;
          return (
            <Link 
              key={cat.id} 
              href={`/order/${cat.id}`}
              onClick={(e) => handleTileClick(e, cat.id)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 transition-all duration-500 h-[420px] flex flex-col"
              >
                {/* Image Section */}
                <div className="h-[55%] w-full relative overflow-hidden bg-slate-50">
                  <img 
                    src={CAT_IMAGES[cat.id]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={cat.name} 
                  />
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_-20px_40px_rgba(0,0,0,0.1)]"></div>
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-md text-emerald-700 rounded-full flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between bg-white relative z-10">
                  <div>
                    <h3 className="font-display font-bold text-2xl mb-2 text-brand-black group-hover:text-emerald-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {cat.hint}
                    </p>
                  </div>
                  
                  {/* Small CTA Below */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                    <span className="text-sm font-semibold uppercase tracking-wider text-brand-black group-hover:text-emerald-700 transition-colors">
                      Shop Now
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <AnimatePresence>
        {showOtherForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 mt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display font-semibold text-lg">Custom Request</h3>
                  <p className="text-sm text-slate-500 mt-1">Tell us exactly what you need and from where.</p>
                </div>
                <button onClick={() => setShowOtherForm(false)} className="text-sm font-medium text-slate-500 hover:text-brand-black">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddOther} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Item Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1kg of brown sugar, specifically from the shop next to..."
                    value={otherItem.description}
                    onChange={(e) => setOtherItem({ ...otherItem, description: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Preferred Vendor (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ndoli Supermarket"
                      value={otherItem.vendor}
                      onChange={(e) => setOtherItem({ ...otherItem, vendor: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={otherItem.quantity}
                      onChange={(e) => setOtherItem({ ...otherItem, quantity: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="btn-primary w-full md:w-auto">
                    Add to Cart
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Help Footer */}
      <div className="mt-20 text-center">
        <p className="font-body text-sm text-slate-500 mb-4">Need help placing an order?</p>
        <a 
          href="https://wa.me/250788524634" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Contact us on WhatsApp for help
        </a>
      </div>
    </div>
  );
}
