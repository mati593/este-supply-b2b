"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ADMIN_INPUT_CLASS,
  createEmptyProductForm,
  createProductFromForm,
  productToForm,
  updateProductFromForm,
  validateProductForm,
  type ProductFormValues,
} from "@/lib/admin-product";
import { useAdminInventoryStore } from "@/stores/admin-inventory-store";
import type { Category, Product } from "@/types";

// ─── Sub-components ────────────────────────────────────────────────────────────

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-background/50 p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function CheckboxField({
  id,
  checked,
  onChange,
  label,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-accent focus:ring-accent/30"
      />
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-muted">{description}</p>
        )}
      </div>
    </label>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface ProductFormModalProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  /** Cuando se pasa un producto, el modal opera en modo edición. */
  product?: Product;
  onSuccess?: (name: string, mode: "create" | "edit") => void;
}

export function ProductFormModal({
  categories,
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const mode: "create" | "edit" = product ? "edit" : "create";

  const products = useAdminInventoryStore((state) => state.products);
  const addProduct = useAdminInventoryStore((state) => state.addProduct);
  const updateProduct = useAdminInventoryStore((state) => state.updateProduct);

  const [form, setForm] = useState<ProductFormValues>(createEmptyProductForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormValues, string>>
  >({});

  // Sincronizar formulario cuando el modal abre o cambia el producto
  useEffect(() => {
    if (isOpen) {
      setForm(product ? productToForm(product) : createEmptyProductForm());
      setErrors({});
    }
  }, [isOpen, product]);

  const update = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProductForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (mode === "create") {
      const newProduct = createProductFromForm(form, products);
      addProduct(newProduct);
      onSuccess?.(newProduct.name, "create");
    } else if (product) {
      const updated = updateProductFromForm(form, product);
      updateProduct(product.id, updated);
      onSuccess?.(updated.name, "edit");
    }
    onClose();
  };

  const isOnOrder = form.availabilityMode === "on_order";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
          >
            <div
              className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-surface shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2
                    id="product-form-title"
                    className="text-lg font-semibold text-foreground"
                  >
                    {mode === "create" ? "Nuevo Producto" : "Editar Producto"}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    {mode === "create"
                      ? "Complete los campos según el modelo B2B del catálogo."
                      : `Editando: ${product?.name}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable form body */}
              <form
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="space-y-5 overflow-y-auto p-6">

                  {/* ── Visibilidad y estado ─────────────────────────── */}
                  <FormSection
                    title="Visibilidad y estado"
                    description="Controla cómo aparece este producto en el catálogo público."
                  >
                    <div className="space-y-3">
                      <CheckboxField
                        id="product-hidden"
                        checked={form.hidden}
                        onChange={(v) => update("hidden", v)}
                        label="Ocultar del catálogo público"
                        description="El producto seguirá en tu inventario pero los clientes no lo verán."
                      />
                      <CheckboxField
                        id="product-featured"
                        checked={form.featured}
                        onChange={(v) => update("featured", v)}
                        label="Destacar en catálogo"
                        description="Aparece en la sección de productos destacados."
                      />
                    </div>
                  </FormSection>

                  {/* ── Información general ──────────────────────────── */}
                  <FormSection title="Información general">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-name"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Nombre *
                        </label>
                        <input
                          id="product-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder='Ej. Notebook Corporativa 15"'
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.name} />
                      </div>

                      <div>
                        <label
                          htmlFor="product-sku"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          SKU *
                        </label>
                        <input
                          id="product-sku"
                          type="text"
                          value={form.sku}
                          onChange={(e) => update("sku", e.target.value)}
                          placeholder="NB-CRP-15-001"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.sku} />
                      </div>

                      <div>
                        <label
                          htmlFor="product-category"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Categoría *
                        </label>
                        <select
                          id="product-category"
                          value={form.categoryId}
                          onChange={(e) =>
                            update("categoryId", e.target.value)
                          }
                          className={ADMIN_INPUT_CLASS}
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <FieldError message={errors.categoryId} />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-description"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Descripción comercial *
                        </label>
                        <textarea
                          id="product-description"
                          rows={2}
                          value={form.description}
                          onChange={(e) =>
                            update("description", e.target.value)
                          }
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.description} />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-technical"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Ficha técnica *
                        </label>
                        <textarea
                          id="product-technical"
                          rows={2}
                          value={form.technicalDescription}
                          onChange={(e) =>
                            update("technicalDescription", e.target.value)
                          }
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.technicalDescription} />
                      </div>
                    </div>
                  </FormSection>

                  {/* ── Disponibilidad ───────────────────────────────── */}
                  <FormSection
                    title="Disponibilidad"
                    description="Elige cómo se muestra la disponibilidad a tus compradores B2B."
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          {
                            value: "on_order",
                            label: "Disponible para pedido",
                            desc: "Sin stock físico aún. Se muestra como disponible bajo pedido.",
                          },
                          {
                            value: "stock",
                            label: "Con stock propio",
                            desc: "Ingresa la cantidad exacta en inventario.",
                          },
                        ] as const
                      ).map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${
                            form.availabilityMode === opt.value
                              ? "border-accent/30 bg-accent/5"
                              : "border-border hover:border-border/80 hover:bg-surface-elevated/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="availabilityMode"
                            value={opt.value}
                            checked={form.availabilityMode === opt.value}
                            onChange={() =>
                              update("availabilityMode", opt.value)
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent focus:ring-accent/30"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {opt.label}
                            </p>
                            <p className="text-xs text-muted">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {!isOnOrder && (
                      <div className="mt-2 max-w-xs">
                        <label
                          htmlFor="product-stock"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Unidades en stock *
                        </label>
                        <input
                          id="product-stock"
                          type="number"
                          min={0}
                          value={form.stock}
                          onChange={(e) => update("stock", e.target.value)}
                          placeholder="100"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.stock} />
                      </div>
                    )}
                  </FormSection>

                  {/* ── Precio y margen ──────────────────────────────── */}
                  <FormSection title="Precio y margen">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="product-base-price"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Precio base (PYG) *
                        </label>
                        <input
                          id="product-base-price"
                          type="number"
                          min={0}
                          value={form.basePrice}
                          onChange={(e) => update("basePrice", e.target.value)}
                          placeholder="4850000"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.basePrice} />
                      </div>

                      <div>
                        <label
                          htmlFor="product-margin"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Margen estimado (%) *
                        </label>
                        <input
                          id="product-margin"
                          type="number"
                          min={0}
                          max={100}
                          value={form.estimatedMargin}
                          onChange={(e) =>
                            update("estimatedMargin", e.target.value)
                          }
                          placeholder="35"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.estimatedMargin} />
                      </div>
                    </div>

                    {/* Escalones por volumen */}
                    <p className="text-xs font-medium text-muted">
                      Precios por volumen (opcional)
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor="tier2-min"
                          className="mb-1.5 block text-xs font-medium text-foreground"
                        >
                          Escalón 2 — cant. mín.
                        </label>
                        <input
                          id="tier2-min"
                          type="number"
                          min={2}
                          value={form.tier2MinQty}
                          onChange={(e) =>
                            update("tier2MinQty", e.target.value)
                          }
                          placeholder="11"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.tier2MinQty} />
                      </div>
                      <div>
                        <label
                          htmlFor="tier2-max"
                          className="mb-1.5 block text-xs font-medium text-foreground"
                        >
                          Escalón 2 — cant. máx.
                        </label>
                        <input
                          id="tier2-max"
                          type="number"
                          min={2}
                          value={form.tier2MaxQty}
                          onChange={(e) =>
                            update("tier2MaxQty", e.target.value)
                          }
                          placeholder="50"
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="tier2-price"
                          className="mb-1.5 block text-xs font-medium text-foreground"
                        >
                          Escalón 2 — precio (PYG)
                        </label>
                        <input
                          id="tier2-price"
                          type="number"
                          min={0}
                          value={form.tier2Price}
                          onChange={(e) =>
                            update("tier2Price", e.target.value)
                          }
                          placeholder="4620000"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.tier2Price} />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor="tier3-min"
                          className="mb-1.5 block text-xs font-medium text-foreground"
                        >
                          Escalón 3 — cant. mín.
                        </label>
                        <input
                          id="tier3-min"
                          type="number"
                          min={2}
                          value={form.tier3MinQty}
                          onChange={(e) =>
                            update("tier3MinQty", e.target.value)
                          }
                          placeholder="51"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.tier3MinQty} />
                      </div>
                      <div>
                        <label
                          htmlFor="tier3-price"
                          className="mb-1.5 block text-xs font-medium text-foreground"
                        >
                          Escalón 3 — precio (PYG)
                        </label>
                        <input
                          id="tier3-price"
                          type="number"
                          min={0}
                          value={form.tier3Price}
                          onChange={(e) =>
                            update("tier3Price", e.target.value)
                          }
                          placeholder="4380000"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.tier3Price} />
                      </div>
                      <div>
                        <label
                          htmlFor="tier3-label"
                          className="mb-1.5 block text-xs font-medium text-foreground"
                        >
                          Etiqueta escalón 3
                        </label>
                        <input
                          id="tier3-label"
                          type="text"
                          value={form.tier3Label}
                          onChange={(e) =>
                            update("tier3Label", e.target.value)
                          }
                          placeholder="Caja Cerrada"
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* ── Especificaciones ─────────────────────────────── */}
                  <FormSection title="Especificaciones técnicas">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="product-brand"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Marca
                        </label>
                        <input
                          id="product-brand"
                          type="text"
                          value={form.brand}
                          onChange={(e) => update("brand", e.target.value)}
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-model"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Modelo
                        </label>
                        <input
                          id="product-model"
                          type="text"
                          value={form.model}
                          onChange={(e) => update("model", e.target.value)}
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-weight"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Peso *
                        </label>
                        <input
                          id="product-weight"
                          type="text"
                          value={form.weight}
                          onChange={(e) => update("weight", e.target.value)}
                          placeholder="1.8 kg"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.weight} />
                      </div>
                      <div>
                        <label
                          htmlFor="product-dimensions"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Dimensiones *
                        </label>
                        <input
                          id="product-dimensions"
                          type="text"
                          value={form.dimensions}
                          onChange={(e) =>
                            update("dimensions", e.target.value)
                          }
                          placeholder="35.6 × 23.5 × 1.9 cm"
                          className={ADMIN_INPUT_CLASS}
                        />
                        <FieldError message={errors.dimensions} />
                      </div>
                      <div>
                        <label
                          htmlFor="product-material"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Material
                        </label>
                        <input
                          id="product-material"
                          type="text"
                          value={form.material}
                          onChange={(e) => update("material", e.target.value)}
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-warranty"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Garantía
                        </label>
                        <input
                          id="product-warranty"
                          type="text"
                          value={form.warranty}
                          onChange={(e) => update("warranty", e.target.value)}
                          placeholder="24 meses"
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* ── Imágenes ─────────────────────────────────────── */}
                  <FormSection title="Imágenes">
                    <div>
                      <label
                        htmlFor="product-images"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        URLs de imagen * (una por línea)
                      </label>
                      <textarea
                        id="product-images"
                        rows={3}
                        value={form.imageUrls}
                        onChange={(e) => update("imageUrls", e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={ADMIN_INPUT_CLASS}
                      />
                      <FieldError message={errors.imageUrls} />
                    </div>
                  </FormSection>

                  {/* ── Logística ────────────────────────────────────── */}
                  <FormSection
                    title="Logística"
                    description="Datos para el calculador de flete internacional (opcional)."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="product-gross-weight"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Peso bruto con embalaje
                        </label>
                        <input
                          id="product-gross-weight"
                          type="text"
                          value={form.grossWeight}
                          onChange={(e) =>
                            update("grossWeight", e.target.value)
                          }
                          placeholder="2.1 kg (unidad con embalaje)"
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-master-box"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Dimensiones caja master
                        </label>
                        <input
                          id="product-master-box"
                          type="text"
                          value={form.masterBoxDimensions}
                          onChange={(e) =>
                            update("masterBoxDimensions", e.target.value)
                          }
                          placeholder="42 × 32 × 28 cm"
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-volumetric"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Peso volumétrico
                        </label>
                        <input
                          id="product-volumetric"
                          type="text"
                          value={form.volumetricWeight}
                          onChange={(e) =>
                            update("volumetricWeight", e.target.value)
                          }
                          placeholder="7.5 kg"
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product-units-box"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Unidades por caja master
                        </label>
                        <input
                          id="product-units-box"
                          type="number"
                          min={1}
                          value={form.unitsPerMasterBox}
                          onChange={(e) =>
                            update("unitsPerMasterBox", e.target.value)
                          }
                          placeholder="5"
                          className={ADMIN_INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 justify-end gap-3 border-t border-border px-6 py-4">
                  <Button variant="secondary" type="button" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {mode === "create" ? "Guardar producto" : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
