import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getCategories, getProducts } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo mayorista",
  description:
    "Catálogo B2B completo con filtros por categoría, precio, stock y margen estimado.",
};

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-surface-elevated" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-xl bg-surface-elevated"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductosPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogView products={products} categories={categories} />
    </Suspense>
  );
}
