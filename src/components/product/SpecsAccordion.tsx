"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Product, ProductLogistics } from "@/types";

interface SpecsAccordionProps {
  product: Product;
}

function getLogistics(product: Product): ProductLogistics {
  if (product.logistics) return product.logistics;

  return {
    grossWeight: product.specifications.weight,
    masterBoxDimensions: product.specifications.dimensions,
    volumetricWeight: "Consultar",
  };
}

export function SpecsAccordion({ product }: SpecsAccordionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [openSection, setOpenSection] = useState<string | null>("logistics");
  const logistics = getLogistics(product);

  const specEntries = Object.entries(product.specifications).filter(
    ([, value]) => value !== undefined
  );

  const sections = [
    {
      id: "logistics",
      title: "Logística y envío",
      content: (
        <dl className="space-y-3">
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-muted">Peso bruto</dt>
            <dd className="text-sm font-medium text-foreground">
              {logistics.grossWeight}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-muted">Caja máster</dt>
            <dd className="text-sm font-medium text-foreground">
              {logistics.masterBoxDimensions}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-sm text-muted">Peso volumétrico</dt>
            <dd className="text-sm font-medium text-foreground">
              {logistics.volumetricWeight}
            </dd>
          </div>
          {logistics.unitsPerMasterBox && (
            <div className="flex justify-between gap-4">
              <dt className="text-sm text-muted">Unidades por caja</dt>
              <dd className="text-sm font-medium text-foreground">
                {logistics.unitsPerMasterBox}
              </dd>
            </div>
          )}
        </dl>
      ),
    },
    {
      id: "technical",
      title: "Especificaciones técnicas",
      content: (
        <dl className="space-y-3">
          {specEntries.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <dt className="text-sm capitalize text-muted">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </dt>
              <dd className="text-sm font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: "description",
      title: "Descripción técnica",
      content: (
        <p className="text-sm leading-relaxed text-muted">
          {product.technicalDescription}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {sections.map((section) => {
        const isOpen = openSection === section.id;

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <button
              type="button"
              onClick={() =>
                setOpenSection(isOpen ? null : section.id)
              }
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-surface-elevated"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-foreground">
                {section.title}
              </span>
              <motion.svg
                className="h-4 w-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }
                }
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="border-t border-border px-4 py-4">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
