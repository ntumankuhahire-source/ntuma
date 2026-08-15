'use client';

import { useCart, CartItem } from '@/lib/CartContext';
import { CATEGORIES, QUICK_LIST_CATEGORY } from '@/lib/categories';
import { CATALOG } from '@/lib/catalog';
import { createOrder } from '@/lib/sheetsApi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  Download,
  ShieldCheck,
  PackageCheck,
  Loader2,
  Plus,
  Minus,
  Trash2,
  Edit3,
  MapPin,
  User,
  Phone,
  ShoppingBag,
  Check,
  Utensils,
  Apple,
  Beef,
  FileText,
  DollarSign,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import InvoiceTemplate, { generateInvoicePDF } from './InvoiceTemplate';

// ── Category Icon & Color Metadata ───────────────────────────────────────────
function getCategoryMeta(categoryId: string) {
  switch (categoryId) {
    case 'fresh-produce':
      return {
        label: 'Fresh Produce',
        icon: Apple,
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        iconBg: 'bg-emerald-100 text-emerald-700',
      };
    case 'ready-to-cook':
      return {
        label: 'Ready-to-Cook',
        icon: Utensils,
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
        iconBg: 'bg-amber-100 text-amber-700',
      };
    case 'animal-products':
      return {
        label: 'Animal Products',
        icon: Beef,
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200/80',
        iconBg: 'bg-rose-100 text-rose-700',
      };
    case 'supermarket-items':
      return {
        label: 'Supermarket Items',
        icon: ShoppingBag,
        badgeBg: 'bg-sky-50 text-sky-800 border-sky-200/80',
        iconBg: 'bg-sky-100 text-sky-700',
      };
    default:
      return {
        label: categoryId || 'Quick List',
        icon: FileText,
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200/80',
        iconBg: 'bg-purple-100 text-purple-700',
      };
  }
}

// ── Item Thumbnail Lookup ───────────────────────────────────────────────────
function getItemThumbnail(item: CartItem) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />
    );
  }
  const catItem = CATALOG.find(
    (p) => p.id === item.productId || p.name.toLowerCase() === item.name.toLowerCase()
  );
  if (catItem?.image) {
    return (
      <img
        src={catItem.image}
        alt={item.name}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />
    );
  }
  const meta = getCategoryMeta(item.category);
  const IconComp = meta.icon;
  return <IconComp className="w-6 h-6 text-emerald-700 opacity-80" />;
}

export default function CheckoutDashboard() {
  const { items, fixedTotal, hasPendingPrices, clearCart, updateQuantity, removeItem } = useCart();
  const [budget, setBudget] = useState<string>('');
  const [details, setDetails] = useState({ name: '', phone: '', address: '' });
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Mobile Money'>('Cash');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [orderId, setOrderId] = useState('');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>('');
  const router = useRouter();

  const toggleSection = (categoryId: string) => {
    setExpandedSections((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const budgetNum = parseFloat(budget) || 0;
  const budgetPercentage = budgetNum > 0 ? (fixedTotal / budgetNum) * 100 : 0;

  let gaugeColor = 'bg-emerald-500';
  if (budgetPercentage > 80 && budgetPercentage <= 100) gaugeColor = 'bg-amber-500';
  if (budgetPercentage > 100) gaugeColor = 'bg-rose-500';

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(2);
  };

  const handleConfirmWhatsApp = async () => {
    setIsSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        category: item.category,
        productName: item.name,
        qty: item.quantity,
        unit: item.unit,
        price: item.priceType === 'fixed' ? item.price : 0,
        isCustom: item.isCustom,
      }));

      const order = await createOrder({
        customerName: details.name,
        customerPhone: details.phone,
        location: details.address,
        modeOfPayment: paymentMode,
        budget: budgetNum,
        items: orderItems,
        total: fixedTotal,
      });

      const newOrderId = order.id;
      setOrderId(newOrderId);

      let message = `*ORDER ID: ${newOrderId}*\n`;
      message += `*NEW ORDER - NTUMA*\n`;
      message += `Name: ${details.name}\nPhone: ${details.phone}\nAddress: ${details.address}\n`;
      message += `Payment Method: ${paymentMode}\n`;
      if (budgetNum > 0) message += `Budget: ${budgetNum.toLocaleString()} RWF\n`;
      message += `\n`;

      Object.entries(groupedItems).forEach(([categoryId, catItems]) => {
        const meta = getCategoryMeta(categoryId);
        message += `*${meta.label.toUpperCase()}*\n`;

        let catFixedTotal = 0;
        catItems.forEach((item) => {
          const isCustom = item.isCustom || item.priceType === 'custom' || item.category === QUICK_LIST_CATEGORY;
          const unit = (item.unit || '').trim();
          const qtyText = isCustom
            ? (unit && unit !== '—' && unit !== '-' ? unit : `${item.quantity || 1}`)
            : (unit && unit !== '—' && unit !== '-' ? (/^\d/.test(unit) && item.quantity === 1 ? unit : `${item.quantity} ${unit}`) : `${item.quantity}`);

          if (item.priceType === 'fixed' && !item.isCustom) {
            catFixedTotal += item.price * item.quantity;
            message += `- ${qtyText} x ${item.name} (${(
              item.price * item.quantity
            ).toLocaleString()} RWF)\n`;
          } else if (item.isCustom) {
            message += `- ${qtyText} x ${item.name} (Ask price — to confirm)\n`;
          } else {
            message += `- ${qtyText} x ${item.name} (Price to confirm)\n`;
            if (item.note) message += `  Note: ${item.note}\n`;
          }
        });
        if (catFixedTotal > 0) {
          message += `_Subtotal: ${catFixedTotal.toLocaleString()} RWF_\n\n`;
        } else {
          message += `\n`;
        }
      });

      message += `*ESTIMATED TOTAL:* ${
        hasPendingPrices ? '~' : ''
      }${fixedTotal.toLocaleString()} RWF\n`;
      if (hasPendingPrices) {
        message += `_(Final total will be confirmed by Ntuma runner)_\n`;
      }

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/250787800703?text=${encoded}`, '_blank');

      clearCart();
      setConfirmedOrderId(newOrderId);
      setOrderConfirmed(true);
    } catch (err) {
      console.error('Failed to create order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setIsGeneratingInvoice(true);
    try {
      await generateInvoicePDF('invoice-template', orderId || 'DRAFT');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const saveItemNote = (itemId: string) => {
    const itemToUpdate = items.find((i) => i.id === itemId);
    if (itemToUpdate) {
      itemToUpdate.note = editingNoteText;
    }
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  // ── Order Confirmed View ──────────────────────────────────────────────────
  if (orderConfirmed) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-lg"
          >
            <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <PackageCheck className="w-10 h-10 text-emerald-700" />
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-black mb-2">
              Order Sent!
            </h2>

            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-4">
              <span className="text-sm text-slate-500">Reference:</span>
              <span className="font-mono font-bold text-emerald-700 text-base sm:text-lg">
                #{confirmedOrderId}
              </span>
            </div>

            <p className="text-slate-600 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
              We&apos;ll confirm your order on WhatsApp shortly. Keep an eye on your messages!
            </p>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push('/order')}
                className="w-full sm:w-auto btn-primary text-sm"
              >
                Place Another Order
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Empty Cart View ────────────────────────────────────────────────────────
  if (items.length === 0 && step === 1) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-black mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-slate-500 text-base mb-8 max-w-md mx-auto">
          Explore our store and add items to your cart to proceed with checkout.
        </p>
        <button
          onClick={() => router.push('/order')}
          className="btn-primary text-base px-8 py-3.5 shadow-md hover:shadow-lg transition-all"
        >
          Start an Order
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-32">
      <InvoiceTemplate
        orderId={orderId || 'DRAFT'}
        customerDetails={details}
        items={items}
        fixedTotal={fixedTotal}
        modeOfPayment={paymentMode}
      />

      {/* ── TOP PROGRESS STEPPER HEADER (Reference Design) ───────────────────── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs mb-8 rounded-2xl px-4 sm:px-8 py-4 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back Link */}
          <button
            onClick={() => (step === 2 ? setStep(1) : router.push('/order'))}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">
              {step === 2 ? 'Back to Details' : 'Back to Catalog'}
            </span>
            <span className="sm:hidden">{step === 2 ? 'Back' : 'Catalog'}</span>
          </button>

          {/* Center: Progress Steps Indicator */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all shadow-xs ${
                  step === 1 || step === 2
                    ? 'bg-[#267E3B] text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step === 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
              </span>
              <span
                className={`text-xs sm:text-sm font-bold transition-colors ${
                  step === 1 ? 'text-[#267E3B]' : 'text-slate-700'
                }`}
              >
                Your Details
              </span>
            </div>

            {/* Connecting Line */}
            <div
              className={`w-8 sm:w-16 h-[2px] rounded-full transition-colors ${
                step === 2 ? 'bg-[#267E3B]' : 'bg-slate-200'
              }`}
            />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all shadow-xs ${
                  step === 2 ? 'bg-[#267E3B] text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                2
              </span>
              <span
                className={`text-xs sm:text-sm font-bold transition-colors ${
                  step === 2 ? 'text-[#267E3B]' : 'text-slate-400'
                }`}
              >
                Confirm &amp; Pay
              </span>
            </div>
          </div>

          {/* Right: Security Badge */}
          <div className="flex items-center gap-1.5 text-[#267E3B] text-xs sm:text-sm font-bold">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#267E3B]" />
            <span>Secure</span>
          </div>
        </div>
      </div>

      {/* ── STEP 1: YOUR DETAILS & ITEM CARDS ───────────────────────────────── */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[1fr_400px] gap-8"
        >
          {/* Left Column: Awesome Fancy Item Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                Review Your Items
              </h2>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-mono">
                {items.reduce((sum, i) => sum + i.quantity, 0)} Items
              </span>
            </div>

            {Object.entries(groupedItems).map(([categoryId, catItems]) => {
              const meta = getCategoryMeta(categoryId);
              const IconComp = meta.icon;
              const isExpanded = expandedSections[categoryId] !== false;
              const catFixedTotal = catItems
                .filter((i) => i.priceType === 'fixed')
                .reduce((sum, i) => sum + i.price * i.quantity, 0);
              const catHasPending = catItems.some((i) => i.priceType !== 'fixed');

              return (
                <div
                  key={categoryId}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs"
                >
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(categoryId)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${meta.iconBg} flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                          {meta.label}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">
                          {catItems.length} {catItems.length === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-sm sm:text-base text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                        {catHasPending ? '~' : ''}
                        {catFixedTotal.toLocaleString()} RWF
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {/* Category Items List - Fancy Cards Design */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-slate-100 space-y-4 bg-slate-50/30">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Product Info & Thumbnail */}
                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                                {getItemThumbnail(item)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className="font-display font-semibold text-slate-900 text-base leading-snug">
                                    {item.name}
                                  </h4>
                                  {item.priceType !== 'fixed' && (
                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                      Price to confirm
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 text-xs sm:text-sm">
                                  {item.priceType === 'fixed' ? (
                                    <span className="font-mono text-slate-500 font-medium">
                                      {item.price.toLocaleString()} RWF / {item.unit}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium">
                                      Runner will confirm price
                                    </span>
                                  )}
                                </div>

                                {/* Custom Note for runner */}
                                {item.note ? (
                                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 max-w-max">
                                    <span className="italic">&quot;{item.note}&quot;</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(item.id);
                                        setEditingNoteText(item.note || '');
                                      }}
                                      className="text-slate-400 hover:text-emerald-700 ml-1"
                                      title="Edit note"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingNoteId(item.id);
                                      setEditingNoteText('');
                                    }}
                                    className="mt-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                                  >
                                    <Plus className="w-3 h-3" /> Add note for runner
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Item Actions & Subtotal */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                              {/* Quantity Pill (Awesome styling from Catalog) */}
                              <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 rounded-full p-1 shadow-inner">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition-colors font-bold shadow-xs active:scale-95"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center font-mono font-bold text-slate-900 text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors font-bold shadow-xs active:scale-95"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Item Subtotal */}
                              <div className="text-right min-w-[95px]">
                                {item.priceType === 'fixed' ? (
                                  <span className="font-mono font-bold text-slate-900 text-base">
                                    {(item.price * item.quantity).toLocaleString()} RWF
                                  </span>
                                ) : (
                                  <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                    TBD
                                  </span>
                                )}
                              </div>

                              {/* Remove Item */}
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="w-8 h-8 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Inline Note Form */}
                          {editingNoteId === item.id && (
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                              <input
                                type="text"
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                                placeholder="e.g. Ripe bananas, 1kg pack only"
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => saveItemNote(item.id)}
                                className="bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-emerald-800 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNoteId(null)}
                                className="text-xs text-slate-500 hover:text-slate-700 px-2"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Customer Details & Summary Sidebar */}
          <div>
            <div className="sticky top-32 space-y-6">
              {/* Delivery Details Form */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
                <h3 className="font-display font-bold text-lg text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  Delivery Details
                </h3>

                <form id="checkout-form" onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Keza Alice"
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0788 123 456"
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-mono text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Delivery Address / Zone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gasabo, Kimironko"
                      value={details.address}
                      onChange={(e) => setDetails({ ...details, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900 font-medium"
                    />
                  </div>
                  
                  {/* Mode of Payment Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      Mode of Payment
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('Cash')}
                        className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMode === 'Cash'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 text-emerald-700" />
                        Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('Mobile Money')}
                        className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMode === 'Mobile Money'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        Mobile Money
                      </button>
                    </div>
                  </div>

                  {/* Optional Target Budget Input */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      Target Budget (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-mono text-slate-900"
                    />
                    {budgetNum > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Budget Limit:</span>
                          <span className="font-mono">{budgetNum.toLocaleString()} RWF</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${gaugeColor} transition-all duration-300`}
                            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Breakdown */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Fixed Items Subtotal</span>
                      <span className="font-mono font-bold text-slate-900">
                        {fixedTotal.toLocaleString()} RWF
                      </span>
                    </div>
                    {hasPendingPrices && (
                      <div className="flex justify-between text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                        <span>Variable items to confirm:</span>
                        <span className="font-bold">Runner estimate</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-bold font-display text-slate-900 pt-2 border-t border-slate-200">
                      <span>Estimated Total</span>
                      <span className="font-mono text-emerald-800">
                        {hasPendingPrices ? '~' : ''}
                        {fixedTotal.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>

                  {/* Proceed to Payment CTA */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-[#267E3B] hover:bg-[#1f6630] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-base font-display group cursor-pointer"
                    >
                      Proceed to Payment
                      <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── STEP 2: CONFIRM & PAY ────────────────────────────────────────────── */}
      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid lg:grid-cols-[1fr_360px] gap-8 max-w-5xl mx-auto"
        >
          {/* Left Column: Payment Action */}
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 text-center shadow-xs">
              <div className="w-16 h-16 bg-[#267E3B] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">
                Ready to Complete Order
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Review your payment mode below and click the green button to confirm your order details on WhatsApp.
              </p>
            </div>

            {/* Payment Selection Box */}
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
              <div className="bg-[#267E3B] p-6 text-white">
                <div className="flex items-center gap-3 mb-1">
                  <CreditCard className="w-6 h-6 opacity-90" />
                  <h3 className="font-display font-bold text-xl">Mode of Payment</h3>
                </div>
                <p className="text-white/80 text-sm ml-9">
                  Selected: <span className="font-bold underline">{paymentMode}</span>
                </p>
              </div>

              <div className="p-6 space-y-4 bg-slate-50/50">
                {/* Switcher Buttons */}
                <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Cash')}
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMode === 'Cash'
                        ? 'bg-[#267E3B] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Mobile Money')}
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMode === 'Mobile Money'
                        ? 'bg-[#267E3B] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Mobile Money
                  </button>
                </div>

                <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    AMOUNT TO PAY
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-800">
                    {fixedTotal.toLocaleString()} RWF
                  </span>
                </div>

                {paymentMode === 'Mobile Money' ? (
                  <>
                    <a
                      href={`tel:*334*8*1*880008822*${fixedTotal}%23`}
                      className="w-full bg-[#004A8F] hover:bg-[#003666] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-sm text-sm sm:text-base cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Pay with BK Pay</span>
                    </a>

                    <a
                      href={`tel:*182*8*1*000882*${fixedTotal}%23`}
                      className="w-full bg-[#FFCC00] hover:bg-[#E6B800] text-slate-900 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-sm text-sm sm:text-base cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Pay with MTN MoMo</span>
                    </a>

                    <a
                      href={`tel:*182*8*1*88000882*${fixedTotal}%23`}
                      className="w-full bg-[#E50000] hover:bg-[#CC0000] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-sm text-sm sm:text-base cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Pay with Airtel Money</span>
                    </a>

                    <p className="text-center text-xs text-slate-500 pt-2">
                      Tapping automatically pre-fills amount. Enter PIN to complete transfer.
                    </p>
                  </>
                ) : (
                  <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery</h4>
                    <p className="text-xs text-slate-600">
                      You will pay directly in cash to the Ntuma runner upon receiving your items.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Finalize WhatsApp Box */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Confirm &amp; Send Order
                </h3>
                <button
                  onClick={handleDownloadInvoice}
                  disabled={isGeneratingInvoice}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isGeneratingInvoice ? 'Generating...' : 'Draft Invoice'}
                </button>
              </div>
              <p className="text-sm text-slate-600">
                Click below to send your complete order summary directly to our runner team on
                WhatsApp.
              </p>
              <button
                onClick={handleConfirmWhatsApp}
                disabled={isSubmitting}
                className="w-full bg-[#267E3B] hover:bg-[#1f6630] disabled:opacity-60 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg text-base group cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Preparing order...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Confirm &amp; Send Order on WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Account Details */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#267E3B] font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                <ShieldCheck className="w-4 h-4" />
                OFFICIAL PAYMENT CODES
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs space-y-1">
                <span className="text-slate-500 font-medium">Account Holder Name:</span>
                <p className="font-bold text-slate-900 text-sm">Ntuma nkuhahire</p>
              </div>

              <div className="space-y-3 text-sm">
                {/* Bank of Kigali (BK) */}
                <div className="border border-blue-200 bg-blue-50/70 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-200/60 px-2 py-0.5 rounded">
                      Bank of Kigali (BK)
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-600">Merchant Code:</span>
                    <span className="font-mono font-bold text-slate-900">880008822</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">USSD:</span>
                    <span className="font-mono text-blue-900 font-bold">
                      *334*8*1*880008822*Amount#
                    </span>
                  </div>
                </div>

                {/* MTN MoMo */}
                <div className="border border-amber-300/60 bg-amber-50/70 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-200/60 px-2 py-0.5 rounded">
                      MTN MoMo
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-600">Merchant Code:</span>
                    <span className="font-mono font-bold text-slate-900">000882</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">USSD:</span>
                    <span className="font-mono text-amber-900 font-bold">
                      *182*8*1*000882*Amount#
                    </span>
                  </div>
                </div>

                {/* Airtel Money */}
                <div className="border border-rose-200 bg-rose-50/70 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 uppercase tracking-wider bg-rose-200/60 px-2 py-0.5 rounded">
                      Airtel Money
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-600">Merchant Code:</span>
                    <span className="font-mono font-bold text-slate-900">88000882</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">USSD:</span>
                    <span className="font-mono text-rose-900 font-bold">
                      *182*8*1*88000882*Amount#
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Summary Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3 text-sm">
              <h4 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-2">
                Order Summary
              </h4>
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{details.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phone:</span>
                <span className="font-mono text-slate-900">{details.phone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Address:</span>
                <span className="font-semibold text-slate-900">{details.address}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-base text-slate-900">
                <span>Total:</span>
                <span className="font-mono text-emerald-800">
                  {fixedTotal.toLocaleString()} RWF
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
