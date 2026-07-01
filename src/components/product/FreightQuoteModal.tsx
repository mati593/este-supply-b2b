"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

interface FreightQuoteModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  sku: string;
}

export function FreightQuoteModal({
  open,
  onClose,
  productName,
  sku,
}: FreightQuoteModalProps) {
  const prefersReducedMotion = useReducedMotion();

  const mailtoLink = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
    `Cotización de flete — ${productName} (${sku})`
  )}&body=${encodeURIComponent(
    "Hola,\n\nNecesito cotizar el flete para el siguiente producto:\n\nProducto: " +
      productName +
      "\nSKU: " +
      sku +
      "\nCantidad: \nDestino: \n\nGracias."
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-xl border border-border bg-surface p-6 shadow-xl sm:inset-x-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="freight-modal-title"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
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
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>

            <h2
              id="freight-modal-title"
              className="mb-2 text-lg font-semibold text-foreground"
            >
              Cotización de flete
            </h2>
            <p className="mb-1 text-sm font-medium text-accent">
              Próximamente — formulario integrado
            </p>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              Estamos preparando un módulo de cotización logística para envíos
              al Chaco, cruces fronterizos e internacionales. Mientras tanto,
              contáctenos directamente.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button href={mailtoLink} variant="primary" size="md" className="flex-1">
                Enviar por email
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
