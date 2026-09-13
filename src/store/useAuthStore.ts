import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, User } from "../types";

interface RegisteredAccount {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  addresses: Address[];
  isAuthenticated: boolean;
  registeredAccounts: Record<string, RegisteredAccount>;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (account: RegisteredAccount) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      isAuthenticated: false,
      registeredAccounts: {},
      login: (email, password) => {
        const key = email.trim().toLowerCase();
        const account = get().registeredAccounts[key];
        if (!account) {
          return {
            ok: false,
            error: "No account found with this email. Please create an account.",
          };
        }
        if (account.password !== password) {
          return { ok: false, error: "Incorrect password. Please try again." };
        }
        set({
          user: {
            name: account.name,
            email: account.email,
            phone: account.phone,
          },
          isAuthenticated: true,
        });
        return { ok: true };
      },
      register: (account) => {
        const key = account.email.trim().toLowerCase();
        if (get().registeredAccounts[key]) {
          return {
            ok: false,
            error: "An account already exists with this email. Please sign in.",
          };
        }
        set((state) => ({
          registeredAccounts: {
            ...state.registeredAccounts,
            [key]: account,
          },
          user: {
            name: account.name,
            email: account.email,
            phone: account.phone,
          },
          isAuthenticated: true,
        }));
        return { ok: true };
      },
      logout: () =>
        set({ user: null, addresses: [], isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };
          const key = state.user.email.trim().toLowerCase();
          const registered = state.registeredAccounts[key];
          return {
            user: updatedUser,
            registeredAccounts: {
              ...state.registeredAccounts,
              [key]: {
                ...registered,
                ...updatedUser,
              },
            },
          };
        }),
      addAddress: (address) =>
        set((state) => ({
          addresses: [
            ...state.addresses.map((a) =>
              address.isDefault ? { ...a, isDefault: false } : a
            ),
            { ...address, id: address.id || generateId() },
          ],
        })),
      updateAddress: (address) =>
        set((state) => ({
          addresses: state.addresses
            .map((a) => (a.id === address.id ? { ...address } : a))
            .map((a) =>
              address.isDefault && a.id !== address.id
                ? { ...a, isDefault: false }
                : a
            ),
        })),
      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),
    }),
    { name: "weavear-auth" }
  )
);

export function newAddressId(): string {
  return Math.random().toString(36).slice(2, 10);
}