'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PriceType } from './catalog';

export interface CartItem {
  id: string; // Unique ID for cart item, can be product ID or a generated ID for 'other' items
  productId?: string;
  name: string;
  category: string;
  price: number; // 0 for variable/other if unknown
  unit: string;
  quantity: number;
  priceType: PriceType | 'other';
  note?: string;
  vendor?: string; // For 'other' category
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  fixedTotal: number;
  hasPendingPrices: boolean;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ntuma-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ntuma-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, 'id'> & { id?: string }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id || (item.productId && i.productId === item.productId));
      if (existing && item.priceType === 'fixed') {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: item.id || Date.now().toString() }];
    });
    // Optional: bounce effect logic could trigger here, handled by component though
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const fixedTotal = items
    .filter((i) => i.priceType === 'fixed')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const hasPendingPrices = items.some((i) => i.priceType === 'variable' || i.priceType === 'other');
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        fixedTotal,
        hasPendingPrices,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
