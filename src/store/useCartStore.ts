import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  getItem: (productId: string) => CartItem | undefined;
}

interface CartSelectors {
  itemCount: (items: CartItem[]) => number;
  subtotal: (items: CartItem[]) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity }],
          }));
        }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        })),
      clear: () => set({ items: [] }),
      getItem: (productId) =>
        get().items.find((i) => i.productId === productId),
    }),
    { name: "weavear-cart" }
  )
);

export const cartSelectors: CartSelectors = {
  itemCount: (items) =>
    items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: (items) =>
    items.reduce(
      (sum, i) =>
        sum + (i.unitPrice + (i.fabricPrice ?? 0)) * i.quantity,
      0
    ),
};

export function lineTotal(item: CartItem): number {
  return (item.unitPrice + (item.fabricPrice ?? 0)) * item.quantity;
}