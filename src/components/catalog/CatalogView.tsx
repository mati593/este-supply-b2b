"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { CurrencySelector } from "@/components/catalog/CurrencySelector";
import { FilterDrawer } from "@/components/catalog/FilterDrawer";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import {
  countActiveFilters,
  createDefaultFilters,
  filterProducts,
} from "@/lib/catalog";
import type { CatalogFilters as CatalogFiltersState } from "@/types/catalog";
import type { Category, CurrencyCode, Product } from "@/types";

interface CatalogViewProps {
  products: Product[];
  categories: Category[];
}

export function CatalogView({ products, categories }: CatalogViewProps) {
  const searchParams = useSearchParams();
  const defaults = useMemo(() => createDefaultFilters(products), [products]);

  const [filters, setFilters] = useState<CatalogFiltersState>(defaults);
  const [currency, setCurrency] = useState<CurrencyCode>("PYG");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const categoriaSlug = searchParams.get("categoria");
    if (!categoriaSlug) return;

    const category = categories.find((c) => c.slug === categoriaSlug);
    if (category) {
      setFilters((prev) => ({
        ...prev,
        categories: [category.id],
      }));
    }
  }, [searchParams, categories]);

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  const activeFilterCount = countActiveFilters(filters, defaults);

  const handleReset = useCallback(() => {
    setFilters(defaults);
  }, [defaults]);

  const activeCategory =
    filters.categories.length === 1
      ? categories.find((c) => c.id === filters.categories[0])
      : undefined;

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: "Inicio", href: "/" },
      { label: "Productos", href: "/productos" },
    ];
    if (activeCategory) {
      items.push({
        label: activeCategory.name,
        href: `/productos?categoria=${activeCategory.slug}`,
      });
    }
    return items;
  }, [activeCategory]);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Catálogo mayorista
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Explore el inventario completo con filtros por categoría, precio,
          disponibilidad y margen estimado. Precios en la moneda seleccionada.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:bg-surface-elevated lg:hidden"
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
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <p className="text-sm text-muted">
            <span className="font-medium text-foreground">
              {filteredProducts.length}
            </span>{" "}
            de {products.length} productos
          </p>
        </div>

        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="flex gap-8 lg:gap-10">
        <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
          <div className="sticky top-24 rounded-xl border border-border bg-surface p-5">
            <CatalogFilters
              filters={filters}
              defaults={defaults}
              categories={categories}
              currency={currency}
              onChange={setFilters}
              onReset={handleReset}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={categories}
                  currency={currency}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-elevated text-muted">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                Sin resultados
              </h3>
              <p className="mb-6 max-w-sm text-sm text-muted">
                No hay productos que coincidan con los filtros seleccionados.
                Ajuste los criterios o limpie los filtros.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/30"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        defaults={defaults}
        categories={categories}
        currency={currency}
        onChange={setFilters}
        onReset={handleReset}
        resultCount={filteredProducts.length}
      />
    </Container>
  );
}
