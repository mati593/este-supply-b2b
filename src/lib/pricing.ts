import type { Product, VolumePriceTier } from "@/types";

export function getTierForQuantity(
  product: Product,
  quantity: number
): VolumePriceTier {
  const tier =
    product.volumePricing.find((t) => {
      const withinMax =
        t.maxQuantity === null || quantity <= t.maxQuantity;
      return quantity >= t.minQuantity && withinMax;
    }) ?? product.volumePricing[product.volumePricing.length - 1];

  return tier;
}

export function getUnitPriceForQuantity(
  product: Product,
  quantity: number
): number {
  return getTierForQuantity(product, quantity).pricePerUnit;
}

export function getTierSavingsPercent(
  basePrice: number,
  tierPrice: number
): number {
  if (basePrice <= 0 || tierPrice >= basePrice) return 0;
  return Math.round(((basePrice - tierPrice) / basePrice) * 100);
}

export function formatTierRange(tier: VolumePriceTier): string {
  if (tier.label) {
    if (tier.maxQuantity === null) {
      return `${tier.label} (${tier.minQuantity}+)`;
    }
    return `${tier.label} (${tier.minQuantity}–${tier.maxQuantity})`;
  }

  if (tier.maxQuantity === null) {
    return `${tier.minQuantity}+ unidades`;
  }

  if (tier.minQuantity === tier.maxQuantity) {
    return `${tier.minQuantity} unidad${tier.minQuantity > 1 ? "es" : ""}`;
  }

  return `${tier.minQuantity} a ${tier.maxQuantity} unidades`;
}

export function getProductTags(product: Product): string[] {
  const tags: string[] = [];

  if (product.estimatedMargin >= 50) {
    tags.push("Alto Margen");
  } else if (product.estimatedMargin >= 30) {
    tags.push("Buen Margen");
  }

  const hasBulkTier = product.volumePricing.some(
    (tier) => tier.label === "Caja Cerrada" || tier.minQuantity >= 50
  );
  if (hasBulkTier) {
    tags.push("Caja Cerrada");
  }

  return tags;
}

export function clampMinQuantity(quantity: number): number {
  return Math.max(1, quantity || 1);
}

export function clampQuantity(quantity: number, maxStock: number): number {
  if (maxStock <= 0) return 1;
  return Math.max(1, Math.min(quantity, maxStock));
}
