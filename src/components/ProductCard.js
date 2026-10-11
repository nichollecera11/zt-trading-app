"use client";

import { useState } from "react";
import { useCart } from "../store/useCart";
import ProductModal from "./ProductModal";

export default function ProductCard({ product, accentColor }) {
  const [showDetails, setShowDetails] = useState(false);

  const cart = useCart((state) => state.items) || [];
  const addToCart = useCart((state) => state.addItem);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);

  const cartItem = cart.find((item) => item.id === product.id);

  // Keyboard support: Enter / Space on the focused card opens details.
  // The target check stops this from firing when the keypress comes from
  // the Add to Cart / +/- buttons inside the card.
  const handleKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowDetails(true);
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
        onClick={() => setShowDetails(true)}
        onKeyDown={handleKeyDown}
        className="h-full bg-[#141412] rounded-xl shadow-sm border border-[#c3afb7]/30 overflow-hidden flex flex-col transition-transform hover:scale-[1.02] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6eb1d]"
      >
        <div
          className="h-[3px] w-full flex-shrink-0"
          style={{ backgroundColor: accentColor || "#acbf00" }}
        />

        <div
          className={`w-full aspect-square flex items-center justify-center overflow-hidden relative flex-shrink-0 ${
            product.image_url ? "bg-white" : "bg-[#c3afb7]/10"
          }`}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              width={400}
              height={400}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#c3afb7]/60">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="w-8 h-8"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7l1.5-3h5L16 7" />
                <circle cx="12" cy="13.5" r="3.2" />
              </svg>
              <span className="text-xs font-medium">Photo coming soon</span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div>
            <h3
              className="font-bold text-sm sm:text-base text-white leading-tight line-clamp-2"
              title={product.name}
            >
              {product.name}
            </h3>
            {product.description && (
              <p className="text-[#c3afb7] text-xs sm:text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-auto pt-3 flex flex-col justify-end">
            <span className="text-base sm:text-lg font-black text-[#d6eb1d] tracking-tight mb-2">
              ₱{Number(product.price).toFixed(2)}
            </span>

            {/* Only this wrapper stops the click from reaching the card,
                so the cart buttons never open the modal. Everything else
                on the card (image, title, description, price, empty
                space) does. */}
            <div onClick={(e) => e.stopPropagation()}>
              {cartItem ? (
                <div className="flex items-center justify-between bg-[#0a0a09] border border-[#c3afb7]/50 rounded-lg p-1 w-full mt-3">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    aria-label={`Remove one ${product.name}`}
                    className="w-8 h-8 flex items-center justify-center bg-transparent text-[#c3afb7] font-bold rounded shadow-sm hover:bg-[#d6eb1d] hover:text-[#0a0a09] transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-[#c3afb7] text-sm">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    aria-label={`Add one more ${product.name}`}
                    className="w-8 h-8 flex items-center justify-center bg-[#c3afb7] text-[#0a0a09] font-bold rounded shadow-sm hover:bg-[#d6eb1d] hover:text-[#0a0a09] transition-colors"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-3 bg-transparent border-2 border-[#c3afb7] text-[#c3afb7] hover:bg-[#d6eb1d] hover:border-[#d6eb1d] hover:text-[#0a0a09] font-bold py-2 rounded-lg transition-colors shadow-sm"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <ProductModal
          product={product}
          accentColor={accentColor}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}