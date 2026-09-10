"use client";

import { useCart } from "../store/useCart";


export default function ProductCard({ product }) {
  const addItem = useCart((state) => state.addItem);

  // 1. Pull 'items' (fallback to []) and 'addItem' to match your store exactly!
  const cart = useCart((state) => state.items) || [];
  const addToCart = useCart((state) => state.addItem);

  // 2. Pull our + and - functions
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);

  // 3. Check if THIS specific product is already in the cart
  const cartItem = cart.find((item) => item.id === product.id);

  return (
    <div className="h-full bg-[#0a0a09] rounded-xl shadow-sm border border-[#c3afb7]/30 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
      {/* Image Placeholder */}
      {/* Changed background and dashed border to use the muted palette with opacity */}
      <div className="h-48 bg-[#c3afb7]/10 w-full flex items-center justify-center text-[#c3afb7] overflow-hidden relative flex-shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            width={400}
            height={400}
            className="w-full h-48 object-cover rounded-t-xl"
          />
        ) : (
          <span className="text-sm font-medium text-[#c3afb7] border-2 border-dashed border-[#c3afb7]/50 p-4 rounded-lg">
            Image Coming Soon
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div>
          {/* Product Name: Pure White for maximum readability */}
          <h3
            className="font-bold text-sm sm:text-base text-white leading-tight line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>
          {/* Description: Muted Palette (#c3afb7) */}
          <p
            className="text-[#c3afb7] text-xs sm:text-sm mt-1 line-clamp-2"
            title={product.description}
          >
            {product.description}
          </p>
        </div>

        {/* 👇 THE FIX: Vertical Stacking & Full-Width Button 👇 */}
        <div className="mt-auto pt-3 flex flex-col justify-end">
          {/* Price: Vivid Yellow Green (#d6eb1d) makes it pop! */}
          <span className="text-base sm:text-lg font-black text-[#d6eb1d] tracking-tight mb-2">
            ₱{Number(product.price).toFixed(2)}
          </span>

          {/* 👇 GRABMART STYLE ADD/QUANTITY TOGGLE (GOLD HOVER) 👇 */}
          {cartItem ? (
            <div className="flex items-center justify-between bg-[#0a0a09] border border-[#c3afb7]/50 rounded-lg p-1 w-full mt-3 animate-fade-in">
              <button
                onClick={() => decreaseQuantity(product.id)}
                className="w-8 h-8 flex items-center justify-center bg-transparent text-[#c3afb7] font-bold rounded shadow-sm hover:bg-[#D6EB1D] hover:text-[#0a0a09] transition-colors"
              >
                -
              </button>
              <span className="font-bold text-[#c3afb7] text-sm">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => increaseQuantity(product.id)}
                className="w-8 h-8 flex items-center justify-center bg-[#c3afb7] text-[#0a0a09] font-bold rounded shadow-sm hover:bg-[#D6EB1D] hover:text-[#0a0a09] transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full mt-3 bg-transparent border-2 border-[#c3afb7] text-[#c3afb7] hover:bg-[#D6EB1D] hover:border-[#D6EB1D] hover:text-[#0a0a09] font-bold py-2 rounded-lg transition-colors shadow-sm"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
