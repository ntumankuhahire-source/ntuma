import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, Phone, Mail, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Ntuma Nkuhahire',
  description: 'Privacy Policy for Ntuma Nkuhahire delivery service in Rwanda. Learn how we collect, use, and protect your personal data.',
};

export default function PrivacyPage() {
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
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="font-display font-semibold text-3xl sm:text-4xl text-brand-black tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm font-mono text-slate-400">
              Last Updated: August 2026 &bull; Ntuma Nkuhahire
            </p>
          </div>

          {/* Policy Body */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-10 font-body text-slate-600 leading-relaxed">
            
            {/* Overview */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-700" />
                1. Overview &amp; Commitment
              </h2>
              <p>
                Ntuma Nkuhahire (&ldquo;Ntuma&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a registered vendor-to-door errand and grocery delivery service operating in Kigali (Gasabo, Kicukiro, Nyarugenge) and Nyagatare, Rwanda. We value your trust and are fully committed to protecting your privacy and safeguarding your personal information.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Information We Collect */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <Eye className="w-5 h-5 text-emerald-700" />
                2. Information We Collect
              </h2>
              <p>To process your orders and deliver goods to your doorstep, we collect:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-slate-600">
                <li><strong className="text-slate-800">Contact &amp; Delivery Information:</strong> Full name, phone number, delivery address, district, sector, and specific location landmarks.</li>
                <li><strong className="text-slate-800">Order &amp; Shopping Preferences:</strong> Requested items, brand/vendor preferences, target budgets, and WhatsApp communications related to order fulfillment.</li>
                <li><strong className="text-slate-800">Technical Data:</strong> Basic usage data (IP address, browser type, device information) when accessing our website or web portal.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* How We Use Your Information */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-700" />
                3. How We Use Your Information
              </h2>
              <p>We strictly use your personal data for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-slate-600">
                <li>Shopping from chosen local vendors/markets and completing your doorstep delivery.</li>
                <li>Sending real-time order confirmation, shopping receipts, and dispatch updates via WhatsApp (+250 787 800 703) or SMS/calls.</li>
                <li>Generating digital invoices and facilitating payments via Mobile Money (MoMo) or cash on delivery.</li>
                <li>Improving our runner service coverage and customer support in Rwanda.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Data Sharing */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black">
                4. Sharing of Information
              </h2>
              <p>
                We do <strong className="text-slate-800">NOT</strong> sell, rent, or trade your personal data to third parties. We share limited delivery information (name, phone number, delivery location) solely with:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-slate-600">
                <li><strong className="text-slate-800">Assigned Ntuma Runners:</strong> To ensure accurate and timely order delivery.</li>
                <li><strong className="text-slate-800">Partner Vendors:</strong> When custom pre-orders or specific item reservations require customer verification.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Data Retention & Security */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-brand-black">
                5. Data Security &amp; Retention
              </h2>
              <p>
                We store your order history securely to provide order tracking and re-ordering assistance. We implement technical security measures to protect your records from unauthorized disclosure, loss, or misuse.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Your Rights & Contact */}
            <section className="space-y-4 bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100">
              <h2 className="font-display font-semibold text-xl text-brand-black">
                6. Contact Us &amp; Your Privacy Rights
              </h2>
              <p className="text-sm">
                You may request access to, correction of, or deletion of your personal records at any time. For questions regarding this Privacy Policy or your data, contact us at:
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
