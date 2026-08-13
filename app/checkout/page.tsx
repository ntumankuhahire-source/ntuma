import CheckoutDashboard from '@/components/CheckoutDashboard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout — Ntuma Nkuhahire',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50 py-8">
        <CheckoutDashboard />
      </main>
      <Footer />
    </>
  );
}
