'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/lib/CartContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { setIsCartOpen } = useCart();
  const router = useRouter();

  // The cart logic is primarily handled by the drawer.
  // When a user visits /cart, we can just open the drawer and redirect back, or render an empty page with the drawer open.
  useEffect(() => {
    setIsCartOpen(true);
    // Optional: could push back to order if this is just a proxy route
    // router.push('/order');
  }, [setIsCartOpen]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="section-heading mb-4">Your Cart</h1>
          <p className="text-slate-500">Cart drawer should be open...</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
