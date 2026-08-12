import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FileText, ShoppingBag, Truck, RefreshCw, AlertCircle, Phone, Mail, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Ntuma Nkuhahire',
  description: 'Terms of Service for Ntuma Nkuhahire vendor-to-door delivery platform in Rwanda.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="font-display font-semibold text-3xl sm:text-4xl text-brand-black tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-sm font-mono text-slate-400">
              Last Updated: August 2026 &bull; Ntuma Nkuhahire
            </p>
          </div>

          {/* Terms Body */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-10 font-body text-slate-600 leading-relaxed">
            
            {/* 1. Acceptance */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-700" />
                1. Acceptance of Terms
              </h2>
              <p>
                By using the Ntuma Nkuhahire website, web ordering application, or WhatsApp ordering channel (+250 787 800 703), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 2. Service Description */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                2. Service Description
              </h2>
              <p>
                Ntuma Nkuhahire provides on-demand market shopping, vendor procurement, and doorstep delivery services across Kigali (Gasabo, Kicukiro, Nyarugenge) and Nyagatare, Rwanda. Our runners purchase requested items from local markets, fresh farms, or supermarkets on your behalf and deliver them directly to your specified address.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 3. Orders & Pricing */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <Truck className="w-5 h-5 text-emerald-700" />
                3. Order Placement &amp; Pricing
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-slate-600">
                <li><strong className="text-slate-800">Shopping Budget &amp; Receipts:</strong> Item prices are based on actual vendor rates at time of purchase. Runners provide an itemized receipt/invoice for all purchased items.</li>
                <li><strong className="text-slate-800">Delivery Fees:</strong> Delivery charges are calculated based on location distance and order size, communicated prior to runner dispatch.</li>
                <li><strong className="text-slate-800">Product Availability:</strong> If a requested item is out of stock at the chosen vendor, your assigned runner will contact you via WhatsApp or call (+250 787 800 703) to suggest a suitable substitution or adjust your order.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* 4. Customer Responsibilities */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black">
                4. Customer Responsibilities
              </h2>
              <p>Customers must:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-slate-600">
                <li>Provide accurate delivery address details and an active phone number.</li>
                <li>Be available to receive the delivery or designate an authorized person to collect items upon runner arrival.</li>
                <li>Ensure payment is completed promptly upon delivery via Mobile Money (MoMo) or cash.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* 5. Cancellations & Returns */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-emerald-700" />
                5. Cancellations &amp; Returns
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-slate-600">
                <li><strong className="text-slate-800">Cancellations:</strong> Orders may be cancelled free of charge before the runner has purchased items at the vendor. Once items are purchased on your behalf, order cancellation is not permitted.</li>
                <li><strong className="text-slate-800">Defective or Damaged Goods:</strong> Please inspect your order upon delivery. If an item is damaged or missing, notify the runner immediately or contact our support team within 2 hours of delivery.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* 6. Limitation of Liability */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-emerald-700" />
                6. Limitation of Liability
              </h2>
              <p>
                Ntuma Nkuhahire acts as an errand agent connecting customers to local independent vendors. While we inspect items for freshness and quality, vendor-manufactured product warranties remain with the original producers.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 7. Contact Us */}
            <section className="space-y-4 bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100">
              <h2 className="font-display font-semibold text-xl text-brand-black">
                7. Contact Information
              </h2>
              <p className="text-sm">
                If you have questions about these Terms of Service or need support with an order:
              </p>
              <div className="pt-2 space-y-2 text-sm font-medium text-slate-800">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <span>Email: <a href="mailto:info@ntumankuhahire.com" className="text-emerald-700 hover:underline">info@ntumankuhahire.com</a> &bull; <a href="mailto:ntumankuhahire@gmail.com" className="text-emerald-700 hover:underline">ntumankuhahire@gmail.com</a></span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <span>Phone / WhatsApp: <a href="https://wa.me/250787800703" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">+250 787 800 703</a> &bull; <a href="https://wa.me/250788524634" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">+250 788 524 634</a></span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
