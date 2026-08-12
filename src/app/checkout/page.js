"use client";

import { useCart } from "../../store/useCart";
import { useState, useEffect } from "react";
import Link from "next/link";


export default function Checkout() {
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);

  // 👇 NEW: Pull in the new actions
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

  // 👇 NEW: Load saved details when the page opens
  useEffect(() => {
    const savedCustomer = localStorage.getItem('zt_customer_details');
    if (savedCustomer) {
      const parsedData = JSON.parse(savedCustomer);
      setFormData(prev => ({
        ...prev,
        name: parsedData.name || '',
        address: parsedData.address || '',
        phone: parsedData.phone || ''
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

  const handleOrder = (e) => {
    e.preventDefault();

    // 1. Build the exact same message
    let message = `*NEW ORDER (ZT Trading)*\n\n`;
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

    // 2. Route it to the correct app!
    if (orderMethod === "whatsapp") {
      window.open(
        `https://wa.me/${YOUR_PHONE_NUMBER}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (orderMethod === "sms") {
      // Triggers the native text messaging app on their phone
      window.open(`sms:+${YOUR_PHONE_NUMBER}?body=${encodedMessage}`, "_self");
    } else if (orderMethod === "copy") {
      // Copies to their clipboard so they can paste it anywhere
      navigator.clipboard.writeText(message);
      alert(
        "📋 Order copied to clipboard! You can now paste this directly into Facebook Messenger or Viber.",
      );
    }
    // 👇 NEW: Save their details for their next order!
    localStorage.setItem('zt_customer_details', JSON.stringify({
      name: formData.name,
      address: formData.address,
      phone: formData.phone
    }));

    clearCart();
    window.location.href = "/";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">
          Your cart is empty!
        </h2>
        <Link
          href="/"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold"
        >
          Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="text-sm font-bold text-gray-500 mb-6 inline-block hover:text-gray-900"
        >
          ← Back to Shop
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="font-bold text-lg mb-4 border-b pb-2">
            Order Summary
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
            >
              {/* Product Name & Single Price */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs font-bold text-gray-500">
                  ₱{Number(item.price).toFixed(2)} each
                </p>
              </div>

              {/* Controls: Plus/Minus, Total, Remove */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-bold text-gray-900 w-16 text-right">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Delivery Fee</span>
              <span>₱{selectedDistance.fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t font-black text-xl text-gray-900">
              <span>Grand Total</span>
              <span>₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleOrder}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="font-bold text-lg mb-4">Delivery Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                className="w-full border rounded-lg p-3"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Select Delivery Distance
              </label>
              <select
                className="w-full border rounded-lg p-3 bg-white font-medium text-gray-700"
                onChange={(e) => {
                  const distance = deliveryDistances.find(
                    (d) => d.id === e.target.value,
                  );
                  setSelectedDistance(distance);
                }}
              >
                {deliveryDistances.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name} (+₱{dist.fee})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Complete Address (Street, House No.)
              </label>
              <input
                required
                type="text"
                value={formData.address}
                className="w-full border rounded-lg p-3"
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                className="w-full border rounded-lg p-3"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Driver Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near the blue gate"
                className="w-full border rounded-lg p-3"
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/* The Disclaimer Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-medium p-4 rounded-lg">
            <strong>Notice:</strong> Exceptionally large bulk orders may be
            subject to 4-wheel vehicle delivery rates. We will contact you to
            confirm any adjustments before proceeding.
          </div>

          {/* NEW: Select Ordering Platform */}
          <div className="mt-8">
            <label className="block text-sm font-black text-gray-900 mb-3 text-center">
              How would you like to send this order?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderMethod("whatsapp")}
                className={`p-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${orderMethod === "whatsapp" ? "border-green-500 bg-green-50 text-green-700 shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              >
                <span className="text-xl mb-1">🟢</span>
                WhatsApp
              </button>

              <button
                type="button"
                onClick={() => setOrderMethod("sms")}
                className={`p-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${orderMethod === "sms" ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              >
                <span className="text-xl mb-1">💬</span>
                SMS Text
              </button>

              <button
                type="button"
                onClick={() => setOrderMethod("copy")}
                className={`p-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${orderMethod === "copy" ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              >
                <span className="text-xl mb-1">📋</span>
                Copy (Messenger)
              </button>
            </div>
          </div>

          {/* Dynamic Submit Button */}
          <button
            type="submit"
            className={`w-full text-white font-black text-lg p-4 rounded-xl mt-6 transition-all shadow-md ${
              orderMethod === "whatsapp"
                ? "bg-green-600 hover:bg-green-700"
                : orderMethod === "sms"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-purple-600 hover:bg-purple-700"
            }`}
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
