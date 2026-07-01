"use client";

import { Eye, EyeOff, Package, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteProductModal } from "@/components/admin/DeleteProductModal";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { Button } from "@/components/ui/Button";
import { getAdminB2BTags } from "@/lib/admin-product";
import { getCategoryName, getProductBasePrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";
import { useAdminInventoryStore } from "@/stores/admin-inventory-store";
import type { Category, Product } from "@/types";

interface InventoryTableProps {
  categories: Category[];
}

// ─── Badges ────────────────────────────────────────────────────────────────────

function AvailabilityBadge({ product }: { product: Product }) {
  if (product.availabilityMode === "on_order") {
    return (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
        Para pedido
      </span>
    );
  }
  return <span className="text-sm text-foreground">{product.stock}</span>;
}

function StatusBadge({ hidden }: { hidden?: boolean }) {
  if (hidden) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-0.5 text-xs font-medium text-muted">
        <EyeOff className="h-3 w-3" />
        Oculto
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
      <Eye className="h-3 w-3" />
      Visible
    </span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function InventoryTable({ categories }: InventoryTableProps) {
  const products = useAdminInventoryStore((state) => state.products);
  const deleteProduct = useAdminInventoryStore((state) => state.deleteProduct);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    window.setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteConfirm = (productId: string) => {
    const deleted = deleteProduct(productId);
    if (deleted) showFeedback("Producto eliminado del inventario.");
    setProductToDelete(null);
  };

  const handleFormSuccess = (name: string, mode: "create" | "edit") => {
    showFeedback(
      mode === "create"
        ? `"${name}" agregado al inventario.`
        : `"${name}" actualizado correctamente.`
    );
  };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Inventario
          </h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} producto{products.length === 1 ? "" : "s"} ·{" "}
            {products.filter((p) => !p.hidden).length} visible
            {products.filter((p) => !p.hidden).length === 1 ? "" : "s"} en
            catálogo
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>+ Nuevo Producto</Button>
      </div>

      {/* ── Feedback ───────────────────────────────────────── */}
      {feedback && (
        <div
          role="status"
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────── */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <Package className="mb-3 h-10 w-10 text-muted" />
          <p className="text-sm font-medium text-foreground">
            No hay productos en el inventario
          </p>
          <p className="mt-1 text-sm text-muted">
            Agregue el primer producto para comenzar.
          </p>
          <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
            + Nuevo Producto
          </Button>
        </div>
      ) : (
        /* ── Table ─────────────────────────────────────────── */
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated/60">
                  <th className="px-4 py-3 font-medium text-muted">Imagen</th>
                  <th className="px-4 py-3 font-medium text-muted">Producto</th>
                  <th className="px-4 py-3 font-medium text-muted">Estado</th>
                  <th className="px-4 py-3 font-medium text-muted">
                    Precio base
                  </th>
                  <th className="px-4 py-3 font-medium text-muted">
                    Disponibilidad
                  </th>
                  <th className="px-4 py-3 font-medium text-muted">
                    Categoría
                  </th>
                  <th className="px-4 py-3 font-medium text-muted">
                    Etiquetas
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const tags = getAdminB2BTags(product);
                  const imageUrl = product.images[0];
                  const isHidden = product.hidden === true;

                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-border last:border-b-0 transition-colors ${
                        isHidden ? "opacity-50" : ""
                      }`}
                    >
                      {/* Imagen */}
                      <td className="px-4 py-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface-elevated">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-5 w-5 text-muted" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Nombre + SKU */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted">{product.sku}</p>
                      </td>

                      {/* Estado visible/oculto */}
                      <td className="px-4 py-3">
                        <StatusBadge hidden={isHidden} />
                      </td>

                      {/* Precio */}
                      <td className="px-4 py-3 font-medium text-foreground">
                        {formatPrice(getProductBasePrice(product))}
                      </td>

                      {/* Disponibilidad / Stock */}
                      <td className="px-4 py-3">
                        <AvailabilityBadge product={product} />
                      </td>

                      {/* Categoría */}
                      <td className="px-4 py-3 text-foreground">
                        {getCategoryName(product.categoryId, categories)}
                      </td>

                      {/* Etiquetas B2B */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {tags.length > 0 ? (
                            tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-accent/8 px-2 py-0.5 text-xs font-medium text-accent"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setProductToEdit(product)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-elevated"
                            aria-label={`Editar ${product.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                            aria-label={`Eliminar ${product.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────── */}
      <ProductFormModal
        categories={categories}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleFormSuccess}
      />

      <ProductFormModal
        categories={categories}
        isOpen={productToEdit !== null}
        onClose={() => setProductToEdit(null)}
        product={productToEdit ?? undefined}
        onSuccess={handleFormSuccess}
      />

      <DeleteProductModal
        product={productToDelete}
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
