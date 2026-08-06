'use client';

import { CartProvider } from '@/lib/CartContext';
import CartPill from '@/components/CartPill';
import CartDrawer from '@/components/CartDrawer';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartPill />
      <CartDrawer />
    </CartProvider>
  );
}
