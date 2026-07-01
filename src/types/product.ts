export interface VolumePriceTier {
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
  /** Etiqueta B2B opcional, ej. "Caja Cerrada" */
  label?: string;
}

export interface ProductLogistics {
  grossWeight: string;
  masterBoxDimensions: string;
  volumetricWeight: string;
  unitsPerMasterBox?: number;
}

export interface ProductSpecifications {
  brand?: string;
  model?: string;
  weight: string;
  dimensions: string;
  material?: string;
  warranty?: string;
  [key: string]: string | undefined;
}

export type StockStatus = "out" | "low" | "high";

/** Cómo se comunica la disponibilidad al cliente B2B. */
export type AvailabilityMode = "stock" | "on_order";

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categoryId: string;
  description: string;
  technicalDescription: string;
  specifications: ProductSpecifications;
  images: string[];
  stock: number;
  volumePricing: VolumePriceTier[];
  /** Datos logísticos para cálculo de flete internacional. */
  logistics?: ProductLogistics;
  /** Margen de ganancia estimado para el distribuidor (mock, %). */
  estimatedMargin: number;
  featured: boolean;
  /** Oculta el producto del catálogo público sin eliminarlo. */
  hidden?: boolean;
  /**
   * "stock"    → muestra el número de unidades disponibles.
   * "on_order" → muestra "Disponible para pedido" (sin stock físico aún).
   */
  availabilityMode?: AvailabilityMode;
}
