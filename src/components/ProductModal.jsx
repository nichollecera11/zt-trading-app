"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../store/useCart";

// Parse the JSON tags column safely (same logic as ProductFeed)
function getTags(product) {
  try {
    const tags =
      typeof product.tags === "string"
        ? JSON.parse(product.tags)
        : product.tags || [];
    return Array.isArray(tags) ? tags : [];
  } catch {
    return [];
  }
}


// ---------------------------------------------------------------------
// Turns the raw description from the admin into bullet points WITHOUT
// changing what is stored in the database. A new bullet starts when:
//   1. the admin pressed Enter (new line), or
//   2. a new "Label:" begins, e.g. "Net Weight: 7.11 KGs Product Dimensions: ..."
//      -> "Net Weight: 7.11 KGs" / "Product Dimensions: ..."
//   3. a new sentence begins (previous word ended with . ! or ?)
//
// Why not literally "every capital letter"? Because that would also cut
// "Net | Weight:", "K | G | s", "S | & | R" and brand names in the middle.
// So we only count a capital as a bullet start when it begins a label
// or a sentence.
// ---------------------------------------------------------------------
// Longest label (in capitalized words) such as "Net Weight" = 2.
// Raise to 3 if you have labels like "Item Package Quantity:".
const MAX_LABEL_WORDS = 2;
const CONNECTORS = new Set(["of", "and", "&", "for", "in", "per", "with", "to"]);
const UNITS = new Set([
  "kg", "kgs", "g", "gm", "mg", "ml", "l", "lb", "lbs", "oz",
  "pc", "pcs", "pack", "packs", "sheets", "ply", "cm", "mm", "m",
  "pieces", "count", "ct",
]);

// A word that can be part of a label: starts with a capital, has no digits,
// isn't a unit (Kg, KGs, Pcs) and isn't mixed like "KGs".
function isLabelWord(word) {
  if (!/^[A-Z]/.test(word)) return false;
  if (/\d/.test(word)) return false;
  if (/^[A-Z]{2,}[a-z]/.test(word)) return false;
  if (UNITS.has(word.toLowerCase())) return false;
  return true;
}

function toBullets(description) {
  if (!description) return [];
  const bullets = [];

  String(description)
    .split(/\r?\n/)
    .forEach((line) => {
      const tokens = line.trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 0) return;

      const starts = new Set([0]);

      tokens.forEach((token, i) => {
        // New sentence: previous word ended with . ! ? and this one is Capitalized
        if (i > 0 && /[.!?]$/.test(tokens[i - 1]) && /^[A-Z]/.test(token)) {
          starts.add(i);
        }

        // New label: a word ending in ":" -> walk back over the capitalized
        // words that belong to the same label (max 5 words)
        if (token.length > 1 && token.endsWith(":") && isLabelWord(token.slice(0, -1))) {
          let start = i;
          let words = 1;
          for (let j = i - 1; j >= 0 && i - j < 6; j--) {
            const w = tokens[j];
            if (/[:.!?;,]$/.test(w)) break;
            // never grab the first word of the previous label's value
            if (j > 0 && tokens[j - 1].endsWith(":")) break;
            if (isLabelWord(w)) {
              if (words >= MAX_LABEL_WORDS) break;
              start = j;
              words++;
            } else if (CONNECTORS.has(w.toLowerCase())) continue;
            else break;
          }
          starts.add(start);
        }
      });

      const sorted = [...starts].sort((a, b) => a - b);
      sorted.forEach((from, idx) => {
        const to = sorted[idx + 1] ?? tokens.length;
        bullets.push(tokens.slice(from, to).join(" "));
      });
    });

  return bullets;
}

// "Net Weight: 7.11 KGs" -> label in white, value in muted
function splitLabel(bullet) {
  const m = bullet.match(/^([^:]{1,40}):\s*(.*)$/);
  if (m && m[1].trim().split(/\s+/).length <= 5) {
    return { label: m[1], value: m[2] };
  }
  return { label: null, value: bullet };
}

export default function ProductModal({ product, accentColor, onClose }) {
  const cart = useCart((state) => state.items) || [];
  const addToCart = useCart((state) => state.addItem);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);

  const cartItem = cart.find((item) => item.id === product.id);
  const accent = accentColor || "#acbf00";
  const tags = getTags(product);
  const bullets = toBullets(product.description);
  const unitPrice = Number(product.price);

  // Close on Escape + lock background scroll while the sheet is open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // Rendered through a portal on purpose: the product card has a CSS
  // transform (hover:scale), and a transformed ancestor traps
  // `position: fixed` children inside the card. The portal escapes that.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <style>{`
        @keyframes sb-sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes sb-sheet-pop {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes sb-fade { from { opacity: 0; } to { opacity: 1; } }
        .sb-sheet { animation: sb-sheet-up 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        @media (min-width: 768px) {
          .sb-sheet { animation: sb-sheet-pop 0.22s cubic-bezier(0.16,1,0.3,1) both; }
        }
        .sb-backdrop { animation: sb-fade 0.2s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .sb-sheet, .sb-backdrop { animation: none; }
        }
      `}</style>

      {/* Backdrop: tap anywhere outside the sheet to close */}
      <div
        className="sb-backdrop absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="sb-sheet relative w-full md:max-w-lg max-h-[92vh] md:max-h-[88vh] flex flex-col bg-[#141412] text-white rounded-t-3xl md:rounded-3xl border border-[#c3afb7]/20 overflow-hidden shadow-2xl">
        {/* Category accent line, same language as the card */}
        <div
          className="h-[3px] w-full flex-shrink-0"
          style={{ backgroundColor: accent }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#0a0a09]/80 border border-[#c3afb7]/30 text-[#c3afb7] font-bold hover:bg-[#d6eb1d] hover:text-[#0a0a09] hover:border-[#d6eb1d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6eb1d]"
        >
          ✕
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Big image */}
          <div
            className={`w-full h-[38vh] md:h-80 flex items-center justify-center ${
              product.image_url ? "bg-white" : "bg-[#c3afb7]/10"
            }`}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            ) : (
              <span className="text-sm font-medium text-[#c3afb7]/60">
                Photo coming soon
              </span>
            )}
          </div>

          {/* Details */}
          <div className="px-5 pt-5 pb-6">
            {product.brand && (
              <p className="text-xs font-semibold text-[#c3afb7] mb-1">
                {product.brand}
              </p>
            )}

            <h2 className="text-xl font-black leading-tight">{product.name}</h2>

            <p className="text-3xl font-black text-[#d6eb1d] tracking-tight mt-3">
              ₱{unitPrice.toFixed(2)}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-[#c3afb7] bg-[#c3afb7]/10 border border-[#c3afb7]/15 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {bullets.length > 0 && (
              <div className="mt-5 pt-5 border-t border-dashed border-[#c3afb7]/20">
                <h3 className="text-sm font-bold mb-3">Product details</h3>
                {bullets.length === 1 && !splitLabel(bullets[0]).label ? (
                  // Nothing to split, so show it as a normal paragraph
                  <p className="text-sm text-[#c3afb7] leading-relaxed break-words">
                    {bullets[0]}
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {bullets.map((bullet, i) => {
                      const { label, value } = splitLabel(bullet);
                      return (
                        <li
                          key={i}
                          className="flex gap-3 text-sm leading-relaxed"
                        >
                          <span
                            className="mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: accent }}
                          />
                          <span className="text-[#c3afb7] break-words min-w-0">
                            {label && (
                              <span className="text-white font-semibold">
                                {label}:{" "}
                              </span>
                            )}
                            {value}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sticky action bar. Safe-area padding keeps it clear of the
            phone's home indicator. */}
        <div className="flex-shrink-0 border-t border-[#c3afb7]/15 bg-[#141412] px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {cartItem ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-between bg-[#0a0a09] border border-[#c3afb7]/50 rounded-xl p-1 w-36 flex-shrink-0">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  aria-label={`Remove one ${product.name}`}
                  className="w-10 h-10 flex items-center justify-center text-[#c3afb7] font-bold rounded-lg hover:bg-[#d6eb1d] hover:text-[#0a0a09] transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-[#c3afb7]">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => increaseQuantity(product.id)}
                  aria-label={`Add one more ${product.name}`}
                  className="w-10 h-10 flex items-center justify-center bg-[#c3afb7] text-[#0a0a09] font-bold rounded-lg hover:bg-[#d6eb1d] transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={onClose}
                className="flex-1 h-12 bg-[#d6eb1d] text-[#0a0a09] font-black rounded-xl hover:bg-[#acbf00] transition-colors"
              >
                Done · ₱{(unitPrice * cartItem.quantity).toFixed(2)}
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full h-12 bg-[#d6eb1d] text-[#0a0a09] font-black rounded-xl hover:bg-[#acbf00] transition-colors"
            >
              Add to Cart · ₱{unitPrice.toFixed(2)}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}