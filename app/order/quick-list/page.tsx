import QuickShopList from '@/components/QuickShopList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Errand & Custom Shopping List in Kigali',
  description:
    'Know exactly what you need? Type your custom shopping list or errand instructions and Ntuma runners will buy and deliver them to your door in Kigali.',
  alternates: {
    canonical: '/order/quick-list',
  },
  openGraph: {
    title: 'Quick Errand & Custom Shopping List | Ntuma Nkuhahire',
    description:
      'Type your shopping list or errand instructions and our runners in Kigali will handle the shopping and delivery.',
    url: 'https://ntumankuhahire.com/order/quick-list',
  },
};

export default function QuickListPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <QuickShopList />
      </main>
      <Footer />
    </>
  );
}
