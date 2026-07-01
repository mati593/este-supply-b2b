"use client";

import { getProductBasePrice } from "@/lib/catalog";
import {
  formatTierRange,
  getTierForQuantity,
  getTierSavingsPercent,
} from "@/lib/pricing";
import { formatPrice } from "@/lib/currency";
import type { CurrencyCode, Product } from "@/types";

interface VolumePricingTableProps {
  product: Product;
  quantity: number;
  currency: CurrencyCode;
}

export function VolumePricingTable({
  product,
  quantity,
  currency,
}: VolumePricingTableProps) {
  const basePrice = getProductBasePrice(product);
  const activeTier = getTierForQuantity(product, quantity);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-elevated">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              Cantidad
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
              Precio unit.
            </th>
            <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted sm:table-cell">
              Ahorro
            </th>
          </tr>
        </thead>
        <tbody>
          {product.volumePricing.map((tier) => {
            const savings = getTierSavingsPercent(basePrice, tier.pricePerUnit);
            const isActive = tier === activeTier;

            return (
              <tr
                key={`${tier.minQuantity}-${tier.maxQuantity}`}
                className={`border-b border-border last:border-0 transition-colors ${
                  isActive ? "bg-accent/5" : "bg-surface"
                }`}
              >
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${isActive ? "text-accent" : "text-foreground"}`}
                  >
                    {formatTierRange(tier)}
                  </span>
                  {isActive && (
                    <span className="ml-2 inline-flex rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                      Actual
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {formatPrice(tier.pricePerUnit, currency)}
                </td>
                <td className="hidden px-4 py-3 text-right sm:table-cell">
                  {savings > 0 ? (
                    <span className="font-medium text-emerald-600">
                      −{savings}%
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
