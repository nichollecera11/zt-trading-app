'use client'; // This tells Next.js this component uses interactive features

import { useCart } from '../store/useCart';

export default function ProductCard({ product }) {
  // Pull the addItem function from our Zustand brain
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-100 w-full flex items-center justify-center text-gray-400 overflow-hidden relative">
         {product.image_url ? (
           <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
         ) : (
           <span className="text-sm font-medium">No Image</span>
         )}
      </div>
      
      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-2 flex-grow">{product.description}</p>
        
        {/* Price & Action */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-black text-gray-900 tracking-tight">
            ₱{Number(product.price).toFixed(2)}
          </span>
          {/* We added the onClick event here! */}
          <button 
            onClick={() => addItem(product)}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm active:scale-95"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}