import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }),

      // NEW: Increase quantity (+1)
      increaseQuantity: (id) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      })),

      // NEW: Decrease quantity (-1)
      decreaseQuantity: (id) => set((state) => ({
        items: state.items.map(item => {
          if (item.id === id) {
            const newQty = item.quantity - 1;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
      })),

      // NEW: Remove item completely
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);