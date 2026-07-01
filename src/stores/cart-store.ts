import { create } from "zustand";
import { getProductById } from "@/lib/data";
import { getUnitPriceForQuantity } from "@/lib/pricing";
import type { CartItem } from "@/types/cart";

interface AddItemPayload {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (payload: AddItemPayload) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
}

function resolveUnitPrice(productId: string, quantity: number): number {
  const product = getProductById(productId);
  if (!product) return 0;
  return getUnitPriceForQuantity(product, quantity);
}

function resolveImage(productId: string, image?: string): string {
  if (image) return image;
  const product = getProductById(productId);
  return (
    product?.images[0] ??
    "https://images.unsplash.com/photo-1505744386214-5093af933ab0?w=200&q=80"
  );
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,

  addItem: ({ productId, slug, name, quantity, image }) => {
    set((state) => {
      const existing = state.items.find((item) => item.productId === productId);

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        return {
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: newQuantity,
                  unitPrice: resolveUnitPrice(productId, newQuantity),
                  image: resolveImage(productId, image),
                }
              : item
          ),
          isOpen: true,
        };
      }

      return {
        items: [
          ...state.items,
          {
            productId,
            slug,
            name,
            quantity,
            unitPrice: resolveUnitPrice(productId, quantity),
            image: resolveImage(productId, image),
          },
        ],
        isOpen: true,
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return;

    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              unitPrice: resolveUnitPrice(productId, quantity),
            }
          : item
      ),
    }));
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  clearCart: () => set({ items: [] }),
}));

export function selectCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function selectCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartLineCount(items: CartItem[]): number {
  return items.length;
}
