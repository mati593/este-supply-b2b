"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import type { CartItem } from "@/types/cart";

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onNavigate: () => void;
}

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
  onNavigate,
}: CartLineItemProps) {
  return (
    <li className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <Link
          href={`/productos/${item.slug}`}
          onClick={onNavigate}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-elevated"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-2">
            <Link
              href={`/productos/${item.slug}`}
              onClick={onNavigate}
              className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-accent"
            >
              {item.name}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(item.productId)}
              className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Eliminar ${item.name}`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="mb-3 text-xs text-muted">
            {formatPrice(item.unitPrice)} / u.
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-lg font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="min-w-[2.5rem] text-center text-base font-semibold text-foreground">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-lg font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface-elevated"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <span className="text-base font-semibold text-foreground">
              {formatPrice(item.unitPrice * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
