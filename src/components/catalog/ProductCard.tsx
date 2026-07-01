"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  getCategoryName,
  getProductBasePrice,
  hasVolumePricing,
} from "@/lib/catalog";
import { AVAILABILITY_LABEL } from "@/lib/constants";
import { formatPrice } from "@/lib/currency";
import type { Category, CurrencyCode, Product } from "@/types";

interface ProductCardProps {
  product: Product;
  categories: Category[];
  currency: CurrencyCode;
  index: number;
}

export function ProductCard({
  product,
  categories,
  currency,
  index,
}: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const basePrice = getProductBasePrice(product);
  const categoryName = getCategoryName(product.categoryId, categories);

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.04, 0.24),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow duration-300 hover:border-accent/15 hover:shadow-lg hover:shadow-accent/5"
    >
      <Link
        href={`/productos/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-surface-elevated"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          {AVAILABILITY_LABEL}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
          {categoryName}
        </p>
        <Link href={`/productos/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3">
          <p className="text-lg font-semibold tracking-tight text-foreground">
            {formatPrice(basePrice, currency)}
          </p>
          <p className="text-xs text-muted">precio unitario base</p>
        </div>

        {hasVolumePricing(product) && (
          <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-accent/10 bg-accent/5 px-2.5 py-1 text-[11px] font-medium text-accent">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Precio especial por caja/volumen
          </span>
        )}

        <div className="mt-auto pt-2">
          <Button
            href={`/productos/${product.slug}`}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
