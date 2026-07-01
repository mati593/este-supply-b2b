"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import type { CatalogFilters as CatalogFiltersState } from "@/types/catalog";
import type { Category, CurrencyCode } from "@/types";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: CatalogFiltersState;
  defaults: CatalogFiltersState;
  categories: Category[];
  currency: CurrencyCode;
  onChange: (filters: CatalogFiltersState) => void;
  onReset: () => void;
  resultCount: number;
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  defaults,
  categories,
  currency,
  onChange,
  onReset,
  resultCount,
}: FilterDrawerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={prefersReducedMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-surface shadow-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filtros de catálogo"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Filtros B2B
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                aria-label="Cerrar filtros"
              >
                <svg
                  className="h-5 w-5"
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

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <CatalogFilters
                filters={filters}
                defaults={defaults}
                categories={categories}
                currency={currency}
                onChange={onChange}
                onReset={onReset}
              />
            </div>

            <div className="border-t border-border p-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Ver {resultCount} producto{resultCount !== 1 ? "s" : ""}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
