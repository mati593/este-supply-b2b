"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

interface DeleteProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => void;
}

export function DeleteProductModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: DeleteProductModalProps) {
  if (!product) return null;

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
            aria-labelledby="delete-product-title"
          >
            <div
              className="w-full max-w-md rounded-xl border border-border bg-surface shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <h2
                    id="delete-product-title"
                    className="text-lg font-semibold text-foreground"
                  >
                    Eliminar producto
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <p className="text-sm text-foreground">
                  ¿Confirma que desea eliminar{" "}
                  <span className="font-semibold">{product.name}</span> (
                  {product.sku}) del inventario?
                </p>
                <p className="text-xs text-muted">
                  Esta acción quita el producto del panel de administración. Al
                  conectar la base de datos real, se sincronizará con el
                  catálogo público.
                </p>

                <div className="flex justify-end gap-3 border-t border-border pt-5">
                  <Button variant="secondary" type="button" onClick={onClose}>
                    Cancelar
                  </Button>
                  <button
                    type="button"
                    onClick={() => onConfirm(product.id)}
                    className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
