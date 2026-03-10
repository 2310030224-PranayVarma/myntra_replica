import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setCart: (cart: Cart) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const computeCount = (items: CartItem[]) =>
  items.reduce((acc, item) => acc + item.quantity, 0);

const computeTotal = (items: CartItem[]) =>
  items.reduce((acc, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      total: 0,
      isOpen: false,

      setCart: (cart) => {
        const items = cart.items;
        set({
          items,
          count: computeCount(items),
          total: computeTotal(items),
        });
      },

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        let updated: CartItem[];
        if (existing) {
          updated = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          updated = [...items, item];
        }
        set({ items: updated, count: computeCount(updated), total: computeTotal(updated) });
      },

      removeItem: (itemId) => {
        const updated = get().items.filter((i) => i.id !== itemId);
        set({ items: updated, count: computeCount(updated), total: computeTotal(updated) });
      },

      updateItem: (itemId, quantity) => {
        const updated = get().items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        set({ items: updated, count: computeCount(updated), total: computeTotal(updated) });
      },

      clearCart: () => set({ items: [], count: 0, total: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.count = computeCount(state.items);
          state.total = computeTotal(state.items);
        }
      },
    }
  )
);
