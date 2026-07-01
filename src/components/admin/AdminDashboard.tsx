"use client";

import { Package, Layers, TrendingUp } from "lucide-react";
import { useAdminInventoryStore } from "@/stores/admin-inventory-store";

interface AdminDashboardProps {
  categoryCount: number;
}

export function AdminDashboard({ categoryCount }: AdminDashboardProps) {
  const products = useAdminInventoryStore((state) => state.products);
  const featuredCount = products.filter((p) => p.featured).length;
  const highMarginCount = products.filter((p) => p.estimatedMargin >= 50).length;

  const stats = [
    {
      label: "Total Productos",
      value: products.length,
      description: "SKUs activos en inventario",
      icon: Package,
    },
    {
      label: "Categorías Activas",
      value: categoryCount,
      description: "Rubros disponibles para B2B",
      icon: Layers,
    },
    {
      label: "Alto Margen",
      value: highMarginCount,
      description: `${featuredCount} productos destacados`,
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Resumen del inventario administrado (persistido en sesión local).
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, description, icon: Icon }) => (
          <article
            key={label}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{label}</span>
              <span className="rounded-lg bg-surface-elevated p-2 text-muted">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <p className="mt-2 text-xs text-muted">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
