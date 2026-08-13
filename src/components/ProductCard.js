'use client'; // This tells Next.js this component uses interactive features

import { useCart } from '../store/useCart';

export default function ProductCard({ product }) {
  // Pull the addItem function from our Zustand brain
  const addItem = useCart((state) => state.addItem);

  return (
    // 1. Added 'h-full' here so the card stretches to match the tallest one in the row
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
      
      {/* Image Placeholder */}
      {/* Added 'flex-shrink-0' so the image always stays exactly h-48 and doesn't get squished */}
      <div className="h-48 bg-gray-100 w-full flex items-center justify-center text-gray-400 overflow-hidden relative flex-shrink-0">
         {product.image_url ? (
           <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
         ) : (
           <span className="text-sm font-medium text-gray-400 border-2 border-dashed border-gray-300 p-4 rounded-lg">
             Image Coming Soon
           </span>
         )}
      </div>
      
      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Wrapped text in a div so they stay grouped together at the top */}
        <div>
          {/* Added 'line-clamp-2' to prevent extremely long names from breaking layout */}
          <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2" title={product.name}>
            {product.name}
          </h3>
          {/* Added 'line-clamp-2' so long descriptions don't make the card 10 miles long */}
          <p className="text-gray-500 text-sm mt-2 line-clamp-2" title={product.description}>
            {product.description}
          </p>
        </div>
        
        {/* Price & Action */}
        {/* 2. Added 'mt-auto' here! This acts like a spring, pushing the price and button to the absolute bottom */}
        <div className="mt-auto pt-5 flex items-center justify-between gap-2">
          <span className="text-xl font-black text-gray-900 tracking-tight">
            ₱{Number(product.price).toFixed(2)}
          </span>
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