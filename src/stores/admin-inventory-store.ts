import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface AdminInventoryState {
  products: Product[];
  isSeeded: boolean;
  seedFromMock: (mockProducts: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Product) => boolean;
  deleteProduct: (id: string) => boolean;
}

export const useAdminInventoryStore = create<AdminInventoryState>()(
  persist(
    (set, get) => ({
      products: [],
      isSeeded: false,

      seedFromMock: (mockProducts) => {
        if (!get().isSeeded) {
          set({ products: mockProducts, isSeeded: true });
        }
      },

      addProduct: (product) => {
        set((state) => ({ products: [...state.products, product] }));
      },

      updateProduct: (id, updated) => {
        const exists = get().products.some((p) => p.id === id);
        if (!exists) return false;
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updated : p)),
        }));
        return true;
      },

      deleteProduct: (id) => {
        const exists = get().products.some((p) => p.id === id);
        if (!exists) return false;
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        return true;
      },
    }),
    {
      name: "estesupply-admin-inventory",
    }
  )
);
