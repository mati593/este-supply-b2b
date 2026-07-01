import { getProducts } from "@/lib/data";
import type { Product } from "@/types";

export function searchProducts(query: string, limit = 6): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getProducts()
    .filter((product) => {
      const haystack = [
        product.name,
        product.sku,
        product.description,
        product.slug,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .slice(0, limit);
}
