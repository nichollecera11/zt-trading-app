"use client";

import { useCart } from "../store/useCart";
import Image from "next/image";

export default function ProductCard({ product }) {
  const addItem = useCart((state) => state.addItem);

  return (
    <div 
      className="h-full bg-[#0a0a09] rounded-xl shadow-sm border border-[#c3afb7]/30 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]"
      style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Image Placeholder */}
      {/* Changed background and dashed border to use the muted palette with opacity */}
      <div className="h-48 bg-[#c3afb7]/10 w-full flex items-center justify-center text-[#c3afb7] overflow-hidden relative flex-shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
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
          
          {/* Button: Vivid Olive (#acbf00) hovering to Vivid Yellow Green (#d6eb1d) with Dark Gray text (#0a0a09) */}
          <button
            onClick={() => addItem(product)}
            className="w-full bg-[#acbf00] hover:bg-[#d6eb1d] text-[#0a0a09] py-2 px-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-1 active:scale-95"
          >
            <span>Add</span> 
            {/* <span className="hidden sm:inline">➕</span> */}
          </button>
        </div>
      </div>
    </div>
  );
}