"use client";

import { useCart } from "../../store/useCart";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Checkout() {
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);

  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);
  const removeItem = useCart((state) => state.removeItem);

  const YOUR_PHONE_NUMBER = "639068461463";

  const deliveryDistances = [
    {
      id: "dist1",
      name: "0 - 3km (Kauswagan, Carmen, Bayabas, Patag)",
      fee: 50.0,
    },
    {
      id: "dist2",
      name: "3 - 6km (Divisoria, Macasandig, Lapasan, Iponan, Bulua)",
      fee: 80.0,
    },
    {
      id: "dist3",
      name: "6 - 10km (Gusa, Cugman, Balulang, Lumbia, Opol)",
      fee: 130.0,
    },
    {
      id: "dist4",
      name: "10km+ (Tablon, Agusan, Puerto, Bugo, El Salvador)",
      fee: 180.0,
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    const savedCustomer = localStorage.getItem("zt_customer_details");
    if (savedCustomer) {
      const parsedData = JSON.parse(savedCustomer);
      setFormData((prev) => ({
        ...prev,
        name: parsedData.name || "",
        address: parsedData.address || "",
        phone: parsedData.phone || "",
      }));
    }
  }, []);

  const [orderMethod, setOrderMethod] = useState("whatsapp");
  const [selectedDistance, setSelectedDistance] = useState(
    deliveryDistances[0],
  );

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const grandTotal = subtotal + selectedDistance.fee;

  const handleOrder = async (e) => {
    e.preventDefault();

    // Updated the receipt header to SwiftBag!
    let message = `*NEW ORDER (SwiftBag)*\n\n`;
    message += `*Name:* ${formData.name}\n`;
    message += `*Address:* ${formData.address}\n`;
    message += `*Distance/Area:* ${selectedDistance.name}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    message += `*Notes:* ${formData.notes || "None"}\n\n`;
    message += `*Order Summary:*\n`;

    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} (₱${(item.price * item.quantity).toFixed(2)})\n`;
    });

    message += `\n*Subtotal:* ₱${subtotal.toFixed(2)}`;
    message += `\n*Delivery Fee:* ₱${selectedDistance.fee.toFixed(2)}\n`;
    message += `\n*GRAND TOTAL: ₱${grandTotal.toFixed(2)}*\n\n`;
    message += `Payment: Cash on Delivery / GCash`;

    const encodedMessage = encodeURIComponent(message);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          selectedDistance,
          subtotal,
          grandTotal,
          items,
          orderMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Database save failed");
      }

      if (orderMethod === "whatsapp") {
        window.open(
          `https://wa.me/${YOUR_PHONE_NUMBER}?text=${encodedMessage}`,
          "_blank",
        );
      } else if (orderMethod === "sms") {
        window.open(
          `sms:+${YOUR_PHONE_NUMBER}?body=${encodedMessage}`,
          "_self",
        );
      } else if (orderMethod === "copy") {
        navigator.clipboard.writeText(message);
        alert(
          "📋 Order copied to clipboard! You can now paste this directly into Facebook Messenger or Viber.",
        );
      }

      localStorage.setItem(
        "zt_customer_details",
        JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
        }),
      );

      clearCart();
      window.location.href = "/";
    } catch (error) {
      console.error("Order Error:", error);
      alert(
        "Oops! Something went wrong while processing your order. Please try again.",
      );
    }
  };

  // EMPTY CART STATE (Dark Mode)
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4">
          Your cart is empty!
        </h2>
        <Link
          href="/"
          className="bg-[#acbf00] hover:bg-[#d6eb1d] text-[#0a0a09] px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Go back to shop
        </Link>
      </div>
    );
  }

  // MAIN CHECKOUT STATE
  return (
    <main className="min-h-screen bg-[#0a0a09] py-12 px-6">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="text-sm font-bold text-[#c3afb7] mb-6 inline-block hover:text-white transition-colors"
        >
          &larr; Back to Shop
        </Link>

        <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>

        {/* ORDER SUMMARY BOX */}
        <div className="bg-[#0a0a09] p-6 rounded-xl shadow-sm border border-[#c3afb7]/30 mb-8">
          <h2 className="font-bold text-lg text-white mb-4 border-b border-[#c3afb7]/30 pb-2">
            Order Summary
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#c3afb7]/10 rounded-xl border border-[#c3afb7]/20 mb-3"
            >
              {/* Product Name & Single Price */}
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs font-bold text-[#c3afb7] mt-1">
                  ₱{Number(item.price).toFixed(2)} each
                </p>
              </div>

              {/* Controls: Plus/Minus, Total, Remove */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center border border-[#c3afb7]/30 rounded-lg overflow-hidden shadow-sm bg-transparent">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-3 py-1 text-[#c3afb7] hover:bg-[#c3afb7]/20 hover:text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    className="px-3 py-1 text-[#c3afb7] hover:bg-[#c3afb7]/20 hover:text-white font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-bold text-[#d6eb1d] w-16 text-right">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-[#c3afb7] hover:text-red-500 transition-colors p-1"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* TOTALS */}
          <div className="mt-4 pt-4 border-t border-[#c3afb7]/30 space-y-2">
            <div className="flex justify-between text-sm text-[#c3afb7] font-medium">
              <span>Subtotal</span>
              <span className="text-white">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#c3afb7] font-medium">
              <span>Delivery Fee</span>
              <span className="text-white">
                ₱{selectedDistance.fee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-[#c3afb7]/30 font-black text-xl text-white">
              <span>Grand Total</span>
              <span className="text-[#d6eb1d]">₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* DELIVERY DETAILS FORM */}
        <form
          onSubmit={handleOrder}
          className="bg-[#0a0a09] p-6 rounded-xl shadow-sm border border-[#c3afb7]/30"
        >
          <h2 className="font-bold text-lg text-white mb-4">
            Delivery Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-1">
                Full Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                className="w-full bg-[#0a0a09] text-white border border-[#c3afb7]/30 rounded-lg p-3 focus:ring-1 focus:ring-[#d6eb1d] focus:border-[#d6eb1d] focus:outline-none transition-all placeholder:text-[#c3afb7]/50"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-1">
                Select Delivery Distance
              </label>
              <select
                className="w-full bg-[#0a0a09] text-white border border-[#c3afb7]/30 rounded-lg p-3 focus:ring-1 focus:ring-[#d6eb1d] focus:border-[#d6eb1d] focus:outline-none transition-all font-medium"
                onChange={(e) => {
                  const distance = deliveryDistances.find(
                    (d) => d.id === e.target.value,
                  );
                  setSelectedDistance(distance);
                }}
              >
                {deliveryDistances.map((dist) => (
                  <option
                    key={dist.id}
                    value={dist.id}
                    className="bg-[#0a0a09]"
                  >
                    {dist.name} (+₱{dist.fee})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-1">
                Complete Address (Street, House No.)
              </label>
              <input
                required
                type="text"
                value={formData.address}
                className="w-full bg-[#0a0a09] text-white border border-[#c3afb7]/30 rounded-lg p-3 focus:ring-1 focus:ring-[#d6eb1d] focus:border-[#d6eb1d] focus:outline-none transition-all placeholder:text-[#c3afb7]/50"
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-1">
                Contact Number
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                className="w-full bg-[#0a0a09] text-white border border-[#c3afb7]/30 rounded-lg p-3 focus:ring-1 focus:ring-[#d6eb1d] focus:border-[#d6eb1d] focus:outline-none transition-all placeholder:text-[#c3afb7]/50"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-black text-white mb-1">
                Custom "Pabili" Requests & Notes 📝
              </label>
              <p className="text-xs text-[#c3afb7] mb-2 font-medium">
                Can't find an item? List it here and we'll confirm its
                availability and price!
              </p>
              <textarea
                rows="3"
                value={formData.notes || ""}
                placeholder="e.g. Please add 1 whole S&R Cheese Pizza, and deliver near the blue gate."
                className="w-full bg-[#0a0a09] text-white border border-[#c3afb7]/30 rounded-xl p-3 focus:ring-1 focus:ring-[#d6eb1d] focus:border-[#d6eb1d] focus:outline-none transition-all resize-none shadow-sm placeholder:text-[#c3afb7]/40"
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          {/* The Disclaimer Notice */}
          <div className="mt-6 bg-[#c3afb7]/10 border border-[#c3afb7]/30 text-[#c3afb7] text-xs font-medium p-4 rounded-lg">
            <strong className="text-white">Notice:</strong> Exceptionally large
            bulk orders may be subject to 4-wheel vehicle delivery rates. We
            will contact you to confirm any adjustments before proceeding.
          </div>

          {/* Select Ordering Platform */}
          <div className="mt-8">
            <label className="block text-sm font-black text-white mb-3 text-center">
              How would you like to send this order?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderMethod("whatsapp")}
                className={`p-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                  orderMethod === "whatsapp"
                    ? "border-[#d6eb1d] bg-[#d6eb1d]/10 text-[#d6eb1d] shadow-sm"
                    : "border-[#c3afb7]/30 text-[#c3afb7] hover:bg-[#c3afb7]/10"
                }`}
              >
                <span className="text-xl mb-1">🟢</span>
                WhatsApp
              </button>

              <button
                type="button"
                onClick={() => setOrderMethod("sms")}
                className={`p-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                  orderMethod === "sms"
                    ? "border-[#d6eb1d] bg-[#d6eb1d]/10 text-[#d6eb1d] shadow-sm"
                    : "border-[#c3afb7]/30 text-[#c3afb7] hover:bg-[#c3afb7]/10"
                }`}
              >
                <span className="text-xl mb-1">💬</span>
                SMS Text
              </button>

              <button
                type="button"
                onClick={() => setOrderMethod("copy")}
                className={`p-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                  orderMethod === "copy"
                    ? "border-[#d6eb1d] bg-[#d6eb1d]/10 text-[#d6eb1d] shadow-sm"
                    : "border-[#c3afb7]/30 text-[#c3afb7] hover:bg-[#c3afb7]/10"
                }`}
              >
                <span className="text-xl mb-1">📋</span>
                Copy (Messenger)
              </button>
            </div>
          </div>

          {/* Dynamic Submit Button */}
          {/* Using SwiftBag's signature Vivid Olive -> Vivid Yellow Green transition */}
          <button
            type="submit"
            className="w-full bg-[#acbf00] hover:bg-[#d6eb1d] text-[#0a0a09] font-black text-lg p-4 rounded-xl mt-6 transition-all shadow-md active:scale-[0.98]"
          >
            {orderMethod === "whatsapp" && "Send via WhatsApp"}
            {orderMethod === "sms" && "Send via SMS text"}
            {orderMethod === "copy" && "Copy Order & Finish"}
          </button>
        </form>
      </div>
    </main>
  );
}
