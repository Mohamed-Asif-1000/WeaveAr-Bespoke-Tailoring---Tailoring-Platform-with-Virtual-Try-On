import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "../types";

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  ordersForUser: (email: string) => Order[];
}

function generateOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `WEV-${n}`;
}

export function newOrderId(): string {
  return generateOrderId();
}

export const useOrdersStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      ordersForUser: (email) =>
        get().orders.filter((o) => o.userEmail === email),
    }),
    { name: "weavear-orders" }
  )
);