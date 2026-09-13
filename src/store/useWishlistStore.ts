import { create } from "zustand";

interface WishlistStore {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  addItem: (id) => {
    if (!get().items.includes(id)) {
      set((state) => ({ items: [...state.items, id] }));
    }
  },
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i !== id) })),
  toggleItem: (id) => {
    const { items } = get();
    if (items.includes(id)) {
      set({ items: items.filter((i) => i !== id) });
    } else {
      set({ items: [...items, id] });
    }
  },
  hasItem: (id) => get().items.includes(id),
}));
