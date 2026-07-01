import categoriesData from "@/data/mock/categories.json";
import productsData from "@/data/mock/products.json";
import type { Category, Product } from "@/types";

/**
 * Data access layer — swap these functions for Supabase queries in production.
 */
export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getFeaturedCategories(): Category[] {
  return getCategories().filter((c) => c.featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id || p.slug === id);
}
