'use client';

import { useCart } from '@/lib/CartContext';
import { CATEGORIES } from '@/lib/catalog';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronDown, ChevronUp, Send, CheckCircle2, CreditCard, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import InvoiceTemplate, { generateInvoicePDF } from './InvoiceTemplate';

export default function CheckoutDashboard() {
  const { items, fixedTotal, hasPendingPrices, clearCart } = useCart();
  const [budget, setBudget] = useState<string>('');
  const [details, setDetails] = useState({ name: '', phone: '', address: '' });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [orderId, setOrderId] = useState('');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const router = useRouter();

  const toggleSection = (categoryId: string) => {
    setExpandedSections(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const budgetNum = parseFloat(budget) || 0;
  const budgetPercentage = budgetNum > 0 ? (fixedTotal / budgetNum) * 100 : 0;
  
  let gaugeColor = 'bg-emerald-500';
  if (budgetPercentage > 80 && budgetPercentage <= 100) gaugeColor = 'bg-brand-yellow';
  if (budgetPercentage > 100) gaugeColor = 'bg-red-500';

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      setOrderId(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(2);
  };

  const handleConfirmWhatsApp = () => {
    let message = `*NEW ORDER - NTUMA*\n`;
    message += `Order ID: ${orderId}\n`;
    message += `Name: ${details.name}\nPhone: ${details.phone}\nAddress: ${details.address}\n`;
    if (budgetNum > 0) message += `Budget: ${budgetNum.toLocaleString()} RWF\n`;
    message += `\n`;

    Object.entries(groupedItems).forEach(([categoryId, catItems]) => {
      const categoryDef = CATEGORIES.find(c => c.id === categoryId);
      message += `*${(categoryDef?.name || categoryId).toUpperCase()}*\n`;
      
      let catFixedTotal = 0;
      catItems.forEach(item => {
        if (item.priceType === 'fixed') {
          catFixedTotal += item.price * item.quantity;
          message += `- ${item.quantity} ${item.unit} x ${item.name} (${(item.price * item.quantity).toLocaleString()} RWF)\n`;
        } else {
          message += `- ${item.quantity} ${item.unit} x ${item.name} (Price to confirm)\n`;
          if (item.note) message += `  Note: ${item.note}\n`;
          if (item.vendor) message += `  Vendor: ${item.vendor}\n`;
        }
      });
      if (catFixedTotal > 0) {
        message += `_Subtotal: ${catFixedTotal.toLocaleString()} RWF_\n\n`;
      } else {
        message += `\n`;
      }
    });

    message += `*ESTIMATED TOTAL:* ${hasPendingPrices ? '~' : ''}${fixedTotal.toLocaleString()} RWF\n`;
    if (hasPendingPrices) {
      message += `_(Final total will be confirmed by Ntuma runner)_\n`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/250788524634?text=${encoded}`, '_blank');
    
    clearCart();
    router.push('/');
  };

  const handleDownloadInvoice = async () => {
    setIsGeneratingInvoice(true);
    try {
      await generateInvoicePDF('invoice-template', orderId);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="section-heading mb-4">Your order is empty</h1>
        <p className="text-slate-500 mb-8">Go back and add some items to your cart.</p>
        <button onClick={() => router.push('/order')} className="btn-primary">Start an order</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <InvoiceTemplate 
        orderId={orderId} 
        customerDetails={details} 
        items={items} 
        fixedTotal={fixedTotal} 
      />

      {/* Top Stepper */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-10">
        <button 
          onClick={() => step === 2 ? setStep(1) : router.push('/order')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 2 ? 'Back to Details' : 'Back to Catalog'}
        </button>

        <div className="hidden sm:flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-brand-black' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-slate-200' : 'bg-slate-100'}`}>1</span>
            <span className="text-sm font-semibold">Your Details</span>
          </div>
          <div className="w-8 h-px bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-brand-black' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-100'}`}>2</span>
            <span className="text-sm font-semibold">Confirm & Pay</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-700 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Secure
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-[1fr_380px] gap-8 md:gap-12">
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([categoryId, catItems]) => {
              const categoryDef = CATEGORIES.find(c => c.id === categoryId);
              const isExpanded = expandedSections[categoryId] !== false;
              const catFixedTotal = catItems
                .filter(i => i.priceType === 'fixed')
                .reduce((sum, i) => sum + i.price * i.quantity, 0);
              const catHasPending = catItems.some(i => i.priceType !== 'fixed');

              return (
                <div key={categoryId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => toggleSection(categoryId)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-semibold text-lg">{categoryDef?.name || categoryId}</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                        {catItems.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="font-mono font-medium text-slate-700">
                        {catHasPending ? '~' : ''}{catFixedTotal.toLocaleString()} RWF
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 space-y-4">
                      {catItems.map(item => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div className="flex gap-3">
                            <span className="font-mono text-emerald-700 font-medium">{item.quantity}</span>
                            <div>
                              <p className="font-medium text-slate-800">{item.name}</p>
                              {item.note && <p className="text-xs text-slate-500 italic mt-0.5">"{item.note}"</p>}
                              {item.vendor && <p className="text-xs text-slate-500 mt-0.5">From: {item.vendor}</p>}
                            </div>
                          </div>
                          <div className="text-right pl-4">
                            {item.priceType === 'fixed' ? (
                              <span className="font-mono text-slate-600">{(item.price * item.quantity).toLocaleString()} RWF</span>
                            ) : (
                              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded uppercase tracking-wide">To be confirmed</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div>
            <div className="sticky top-6 space-y-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-semibold text-lg mb-4">Delivery Details</h3>
                <form id="checkout-form" onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={details.name}
                      onChange={e => setDetails({...details, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={details.phone}
                      onChange={e => setDetails({...details, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Address / Zone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nyagatare, near university"
                      value={details.address}
                      onChange={e => setDetails({...details, address: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button 
                      type="submit" 
                      form="checkout-form"
                      className="w-full bg-brand-black hover:bg-slate-800 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-colors group shadow-md"
                    >
                      Proceed to Payment
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid md:grid-cols-[1fr_320px] gap-6 max-w-4xl mx-auto">
          {/* Left Column - Payment Action */}
          <div className="space-y-6">
            {/* Success Header */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-black mb-2">Order Registered!</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Your order has been recorded in the database. Please select your payment method below to execute payment.
              </p>
              <div className="inline-flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-500">
                Order ID: <span className="font-mono font-bold text-brand-black ml-2">{orderId}</span>
              </div>
            </div>

            {/* Payment Selection Box */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#2E7D32] p-6 text-white">
                <div className="flex items-center gap-3 mb-1">
                  <CreditCard className="w-6 h-6 opacity-80" />
                  <h3 className="font-semibold text-lg">Select Payment Method</h3>
                </div>
                <p className="text-white/80 text-sm ml-9">Tap a payment network to initiate transaction</p>
              </div>
              
              <div className="p-6 space-y-4 bg-slate-50">
                <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
                  <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">AMOUNT TO PAY</span>
                  <span className="text-xl font-bold font-mono text-brand-black">{fixedTotal.toLocaleString()} RWF</span>
                </div>

                <a href="tel:*334*9*11686878*250#" className="w-full bg-[#004A8F] hover:bg-[#003666] text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors shadow-sm">
                  <CreditCard className="w-5 h-5" />
                  Pay with Bank of Kigali
                </a>
                
                <a href="tel:*182*1*11686878*250#" className="w-full bg-[#FFCC00] hover:bg-[#E6B800] text-brand-black py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors shadow-sm">
                  <CreditCard className="w-5 h-5" />
                  Pay with MTN MoMo
                </a>
                
                <a href="tel:*182*1*11686878*250#" className="w-full bg-[#E50000] hover:bg-[#CC0000] text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors shadow-sm">
                  <CreditCard className="w-5 h-5" />
                  Pay with Airtel Money
                </a>

                <p className="text-center text-xs text-slate-400 mt-4">
                  Tapping pays the pre-filled total amount directly. You will only need to input your PIN.
                </p>
              </div>
            </div>

            {/* Finalize box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-semibold text-lg text-brand-black">Finalize Order</h3>
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isGeneratingInvoice}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isGeneratingInvoice ? 'Generating...' : 'Download Invoice'}
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                After executing payment via the links above, click the button below to confirm with our sales team on WhatsApp.
              </p>
              <button 
                onClick={handleConfirmWhatsApp}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md group"
              >
                <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
                Confirm Payment on WhatsApp
              </button>
            </div>
          </div>

          {/* Right Column - Account Details */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 mb-6 font-semibold tracking-wider text-xs uppercase">
                <ShieldCheck className="w-4 h-4" />
                ACCOUNT DETAILS
              </div>
              
              <div className="space-y-4">
                <div className="border border-[#FFCC00]/40 bg-[#FFFBEA] rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#B38F00] mb-2 bg-[#FFCC00]/20 inline-block px-2 py-0.5 rounded">MTN & Airtel Code</h4>
                  <div className="space-y-1 mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Merchant Code:</span>
                      <span className="font-bold text-brand-black">11686878</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Manual Dial:</span>
                      <span className="font-mono text-[#B38F00] font-medium">*182*1*11686878*Amount#</span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#004A8F]/20 bg-[#F0F6FC] rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#004A8F] mb-2 bg-[#004A8F]/10 inline-block px-2 py-0.5 rounded">Bank of Kigali Code</h4>
                  <div className="space-y-1 mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Merchant Code:</span>
                      <span className="font-bold text-brand-black">11686878</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Manual Dial:</span>
                      <span className="font-mono text-[#004A8F] font-medium">*334*9*11686878*Amount#</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-700 mb-2" />
                <span className="text-xs font-medium text-slate-500">Secure<br/>Checkout</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 mb-2" />
                <span className="text-xs font-medium text-slate-500">Verified<br/>Business</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
