import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. Import the persist tool

// 2. Wrap your store inside persist()
export const useCart = create(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          };
        }
        
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'zt-trading-cart', // 3. This is the secret name used to save data in the phone's storage
    }
  )
);