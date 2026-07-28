'use client';

import { useCart } from '../store/useCart';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // 1. Import React hooks

export default function CartWidget() {
  // 2. Wait for the component to mount on the user's phone before checking storage
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const items = useCart((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  // 3. If it hasn't mounted yet, OR if the cart is empty, stay invisible
  if (!mounted || totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto">
        <Link href="/checkout" className="bg-gray-900 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between pointer-events-auto cursor-pointer hover:bg-black transition-colors block">
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
              {totalItems} items
            </div>
            <span className="font-medium text-sm hidden sm:inline">in your cart</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-lg font-black tracking-tight">
              ₱{totalPrice.toFixed(2)}
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-gray-300">
              Checkout →
            </span>
          </div>

        </Link>
      </div>
    </div>
  );
}