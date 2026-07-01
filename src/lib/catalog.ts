import type { CatalogFilters } from "@/types/catalog";
import type { Category, Product, StockStatus } from "@/types";

export function getProductBasePrice(product: Product): number {
  return product.volumePricing[0]?.pricePerUnit ?? 0;
}

export function hasVolumePricing(product: Product): boolean {
  return product.volumePricing.length > 1;
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out";
  if (stock < 15) return "low";
  return "high";
}

export function getStockLabel(status: StockStatus): string {
  switch (status) {
    case "out":
      return "Sin stock";
    case "low":
      return "Últimas unidades";
    case "high":
      return "Alto stock";
  }
}

export function getPriceBounds(products: Product[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) return { min: 0, max: 0 };

  const prices = products.map(getProductBasePrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function createDefaultFilters(products: Product[]): CatalogFilters {
  const { min, max } = getPriceBounds(products);
  return {
    categories: [],
    priceMin: min,
    priceMax: max,
    marginFilter: "all",
  };
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters
): Product[] {
  return products.filter((product) => {
    const price = getProductBasePrice(product);

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.categoryId)
    ) {
      return false;
    }

    if (price < filters.priceMin || price > filters.priceMax) {
      return false;
    }

    if (filters.marginFilter === "30" && product.estimatedMargin < 30) {
      return false;
    }

    if (filters.marginFilter === "50" && product.estimatedMargin < 50) {
      return false;
    }

    return true;
  });
}

export function getCategoryName(
  categoryId: string,
  categories: Category[]
): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "Sin categoría";
}

export function countActiveFilters(
  filters: CatalogFilters,
  defaults: CatalogFilters
): number {
  let count = 0;

  if (filters.categories.length > 0) count++;
  if (
    filters.priceMin !== defaults.priceMin ||
    filters.priceMax !== defaults.priceMax
  ) {
    count++;
  }
  if (filters.marginFilter !== "all") count++;

  return count;
}
