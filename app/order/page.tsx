import CategoryGrid from '@/components/CategoryGrid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Grocery & Market Goods in Kigali',
  description:
    'Browse fresh produce, ready-to-cook meal kits, meats, and supermarket items delivered straight to your door in Gasabo, Kicukiro, and Nyarugenge.',
  alternates: {
    canonical: '/order',
  },
  openGraph: {
    title: 'Order Grocery & Market Goods in Kigali | Ntuma Nkuhahire',
    description:
      'Browse fresh produce, ready-to-cook meal kits, meats, and supermarket items delivered straight to your door in Kigali.',
    url: 'https://ntumankuhahire.com/order',
  },
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <CategoryGrid />
      </main>
      <Footer />
    </>
  );
}

