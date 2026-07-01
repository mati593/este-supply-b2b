"use client";

import type { ReactNode } from "react";
import { formatPrice, convertPrice } from "@/lib/currency";
import type { CatalogFilters as CatalogFiltersState } from "@/types/catalog";
import type { Category, CurrencyCode } from "@/types";

interface CatalogFiltersProps {
  filters: CatalogFiltersState;
  defaults: CatalogFiltersState;
  categories: Category[];
  currency: CurrencyCode;
  onChange: (filters: CatalogFiltersState) => void;
  onReset: () => void;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-border pb-5 last:border-0 last:pb-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function CatalogFilters({
  filters,
  defaults,
  categories,
  currency,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const displayMin = Math.round(convertPrice(filters.priceMin, currency));
  const displayMax = Math.round(convertPrice(filters.priceMax, currency));
  const boundMin = Math.round(convertPrice(defaults.priceMin, currency));
  const boundMax = Math.round(convertPrice(defaults.priceMax, currency));

  const toggleCategory = (categoryId: string) => {
    const next = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];
    onChange({ ...filters, categories: next });
  };

  const handlePriceInput = (field: "priceMin" | "priceMax", value: number) => {
    const rate = convertPrice(1, currency);
    const baseValue = rate > 0 ? value / rate : value;

    if (field === "priceMin") {
      onChange({
        ...filters,
        priceMin: Math.min(baseValue, filters.priceMax),
      });
    } else {
      onChange({
        ...filters,
        priceMax: Math.max(baseValue, filters.priceMin),
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-muted transition-colors hover:text-accent"
        >
          Limpiar
        </button>
      </div>

      <FilterSection title="Categorías">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-surface-elevated">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
                />
                <span className="text-sm text-foreground">{category.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Rango de precio">
        <p className="mb-3 text-xs text-muted">
          Moneda activa: {currency}
        </p>
        <div className="mb-3 flex items-center justify-between text-sm font-medium text-foreground">
          <span>{formatPrice(filters.priceMin, currency)}</span>
          <span className="text-muted">—</span>
          <span>{formatPrice(filters.priceMax, currency)}</span>
        </div>
        <div className="space-y-3">
          <input
            type="range"
            min={boundMin}
            max={boundMax}
            value={displayMin}
            onChange={(e) =>
              handlePriceInput("priceMin", Number(e.target.value))
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <input
            type="range"
            min={boundMin}
            max={boundMax}
            value={displayMax}
            onChange={(e) =>
              handlePriceInput("priceMax", Number(e.target.value))
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[11px] text-muted">Mínimo</label>
              <input
                type="number"
                min={boundMin}
                max={displayMax}
                value={displayMin}
                onChange={(e) =>
                  handlePriceInput("priceMin", Number(e.target.value))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted">Máximo</label>
              <input
                type="number"
                min={displayMin}
                max={boundMax}
                value={displayMax}
                onChange={(e) =>
                  handlePriceInput("priceMax", Number(e.target.value))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent/40"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Margen estimado">
        <div className="space-y-2">
          {(
            [
              { value: "all", label: "Todos los márgenes" },
              { value: "30", label: "Mayor a 30%" },
              { value: "50", label: "Mayor a 50%" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-surface-elevated"
            >
              <input
                type="radio"
                name="marginFilter"
                checked={filters.marginFilter === option.value}
                onChange={() =>
                  onChange({ ...filters, marginFilter: option.value })
                }
                className="h-4 w-4 border-border text-accent focus:ring-accent/30"
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
