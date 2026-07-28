'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard({ allProducts }) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const router = useRouter();

  // The secret passcode to access your dashboard
  const SECRET_PIN = '1234';

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === SECRET_PIN) {
      setIsUnlocked(true);
    } else {
      alert('Incorrect PIN!');
      setPin('');
    }
  };

  // If locked, only show the PIN screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Admin Access</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your secret PIN</p>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center tracking-[1em] font-bold text-xl border-2 border-gray-200 rounded-xl p-4 mb-6 focus:border-gray-900 outline-none"
            placeholder="****"
            maxLength={4}
          />
          <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  // If unlocked, show the inventory manager
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-gray-900 text-white p-6 sticky top-0 z-40 shadow-md">
        <h1 className="text-xl font-black">Inventory Manager</h1>
        <p className="text-gray-400 text-sm font-medium">Live updates to storefront</p>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {allProducts.map(product => (
          <ProductEditor key={product.id} product={product} router={router} />
        ))}
      </div>
    </div>
  );
}

// A mini-component just for handling the individual product rows safely
function ProductEditor({ product, router }) {
  const [price, setPrice] = useState(product.price);
  const [isAvailable, setIsAvailable] = useState(product.is_available === 1);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: product.id, 
        is_available: isAvailable ? 1 : 0, 
        price: price 
      })
    });
    setIsSaving(false);
    router.refresh(); // Tells Next.js to refresh the live database data!
  };

  return (
    <div className={`bg-white p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${!isAvailable ? 'opacity-60 border-red-200' : 'border-gray-200 shadow-sm'}`}>
      
      <div className="flex-grow">
        <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
        <span className={`text-xs font-bold uppercase tracking-wider ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
          {isAvailable ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₱</span>
          <input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 pl-8 pr-3 py-2 border rounded-lg font-bold text-gray-900 bg-gray-50"
          />
        </div>

        <button 
          onClick={() => setIsAvailable(!isAvailable)}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${isAvailable ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          {isAvailable ? 'Hide' : 'Show'}
        </button>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
        >
          {isSaving ? '...' : 'Save'}
        </button>
      </div>
    </div>
  );
}