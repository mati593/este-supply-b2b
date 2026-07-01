export type MarginFilter = "all" | "30" | "50";

export interface CatalogFilters {
  categories: string[];
  priceMin: number;
  priceMax: number;
  marginFilter: MarginFilter;
}

export const DEFAULT_MARGIN_FILTER: MarginFilter = "all";
