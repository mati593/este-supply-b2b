"use client";

import { clampMinQuantity, getUnitPriceForQuantity } from "@/lib/pricing";
import { formatPrice } from "@/lib/currency";
import type { CurrencyCode, Product } from "@/types";

interface QuantitySelectorProps {
  product: Product;
  quantity: number;
  currency: CurrencyCode;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({
  product,
  quantity,
  currency,
  onChange,
}: QuantitySelectorProps) {
  const unitPrice = getUnitPriceForQuantity(product, quantity);
  const totalPrice = unitPrice * quantity;

  const adjust = (delta: number) => {
    onChange(clampMinQuantity(quantity + delta));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Cantidad
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => adjust(-1)}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:border-accent/30 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Disminuir cantidad"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              onChange(clampMinQuantity(parseInt(e.target.value, 10) || 1))
            }
            className="h-10 w-20 rounded-lg border border-border bg-background text-center text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/40"
          />

          <button
            type="button"
            onClick={() => adjust(1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:border-accent/30"
            aria-label="Aumentar cantidad"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <span className="text-xs text-muted">
            Sujeto a confirmación
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface-elevated p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Precio unitario</span>
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(unitPrice, currency)}
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
          <span className="text-sm font-medium text-foreground">
            Subtotal ({quantity} u.)
          </span>
          <span className="text-xl font-semibold tracking-tight text-accent">
            {formatPrice(totalPrice, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
