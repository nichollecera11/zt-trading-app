"use client";

import { useCart } from "../store/useCart";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartWidget() {
  // 1. Wait for the component to mount (Hydration safety)
  const [mounted, setMounted] = useState(false);
  // 2. State to track if the user closed the widget
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = useCart((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  // 3. Smart Auto-Open! If they add a new item, pop the widget back open
  useEffect(() => {
    if (totalItems > 0) {
      setIsDismissed(false);
    }
  }, [totalItems]);

  // 4. If it hasn't mounted yet, OR if the cart is empty, stay invisible
  if (!mounted || totalItems === 0) return null;

  // 5. The "Mini Bubble" state when dismissed
  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        aria-label={`Open cart, ${totalItems} items`}
        className="fixed bottom-6 right-6 bg-[#141412] text-[#d6eb1d] h-14 w-14 rounded-full shadow-2xl z-50 flex items-center justify-center hover:scale-105 transition-transform border-2 border-[#acbf00]/40"
      >
        <span className="text-xl">🛍️</span>
        <span className="absolute -top-2 -right-2 bg-[#d6eb1d] text-[#0a0a09] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-sm border-2 border-[#0a0a09]">
          {totalItems}
        </span>
      </button>
    );
  }

  // 6. The Main Full-Size Widget
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto bg-[#141412] text-white rounded-2xl shadow-2xl flex items-center justify-between p-4 md:px-6 pointer-events-auto relative border border-[#c3afb7]/20">
        {/* 👇 The 'X' Close Button, restyled to match the brand palette 👇 */}
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevents any weird bubbling
            setIsDismissed(true);
          }}
          aria-label="Minimize cart"
          title="Minimize Cart"
          className="absolute -top-3 -right-3 bg-[#c3afb7] text-[#0a0a09] rounded-full w-8 h-8 flex items-center justify-center text-sm font-black shadow-lg hover:bg-[#d6eb1d] transition-colors border-2 border-[#0a0a09] z-50"
        >
          ✕
        </button>

        <div className="flex flex-col">
          <p className="text-xs text-[#c3afb7] font-bold uppercase tracking-wider mb-0.5">
            Your Cart
          </p>
          <div className="flex items-center gap-2">
            <span className="font-black text-xl leading-none">
              {totalItems}{" "}
              <span className="text-sm font-medium text-[#c3afb7]">
                items
              </span>
            </span>
            <span className="text-[#c3afb7]/50">•</span>
            <span className="font-black text-[#d6eb1d] text-xl leading-none">
              ₱{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="bg-[#d6eb1d] text-[#0a0a09] px-6 py-3 rounded-xl font-black shadow-md hover:bg-[#acbf00] hover:scale-105 transition-all flex items-center gap-2"
        >
          Checkout <span>➡️</span>
        </Link>
      </div>
    </div>
  );
}