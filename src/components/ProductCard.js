"use client";

import { useCart } from "../store/useCart";
import Image from "next/image";

export default function ProductCard({ product }) {
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-100 w-full flex items-center justify-center text-gray-400 overflow-hidden relative flex-shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-48 object-cover rounded-t-xl"
          />
        ) : (
          <span className="text-sm font-medium text-gray-400 border-2 border-dashed border-gray-300 p-4 rounded-lg">
            Image Coming Soon
          </span>
        )}
      </div>

      {/* Product Details */}
      {/* Changed to p-3 on mobile, p-4 on larger screens for better spacing */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div>
          {/* Slightly smaller text on mobile so it fits the narrow grid */}
          <h3
            className="font-bold text-sm sm:text-base text-gray-900 leading-tight line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>
          <p
            className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2"
            title={product.description}
          >
            {product.description}
          </p>
        </div>

        {/* 👇 THE FIX: Vertical Stacking & Full-Width Button 👇 */}
        <div className="mt-auto pt-3 flex flex-col justify-end">
          <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight mb-2">
            ₱{Number(product.price).toFixed(2)}
          </span>
          
          <button
            onClick={() => addItem(product)}
            className="w-full bg-gray-900 hover:bg-black text-white py-2 px-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-1 active:scale-95"
          >
            <span>Add</span> 
            {/* Hides the word "Add" on tiny screens, shows it on tablets/laptops */}
            {/* <span className="hidden sm:inline">➕</span> */}
          </button>
        </div>
      </div>
    </div>
  );
}