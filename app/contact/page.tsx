import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquare, Mail, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="eyebrow text-emerald-700">CONTACT US</h2>
            <h1 className="section-heading mb-4">How can we help?</h1>
            <p className="text-slate-500 max-w-xl mx-auto">
              Whether you have a question about our services, want to partner with us, or need help with a custom order, our team is ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="font-display font-semibold text-2xl mb-6 text-brand-black">Send a Message</h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email or Phone</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="How can we reach you?" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Tell us what you need..."></textarea>
                </div>
                <button type="button" className="btn-primary w-full justify-center mt-2">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-10 pl-0 md:pl-8">
              <div>
                <h3 className="font-display font-semibold text-2xl mb-6 text-brand-black">Fastest ways to reach us</h3>
                <p className="text-slate-500 mb-8">
                  For immediate assistance or to place an order directly, WhatsApp is the fastest way to get a response from our dispatchers.
                </p>
              </div>
              
              <div className="space-y-6">
                <a href="https://wa.me/250788524634" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">WhatsApp</p>
                    <p className="font-semibold text-brand-black">+250 788 524 634</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-yellow/20 text-brand-black flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">HQ</p>
                    <p className="font-semibold text-brand-black">Kigali, Rwanda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
