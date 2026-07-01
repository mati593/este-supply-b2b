"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { CartLineItem } from "@/components/cart/CartLineItem";
import {
  selectCartCount,
  selectCartTotal,
  useCartStore,
} from "@/stores/cart-store";
import { buildWhatsAppQuoteUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/currency";

export function CartDrawer() {
  const prefersReducedMotion = useReducedMotion();
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const total = selectCartTotal(items);
  const itemCount = selectCartCount(items);

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const url = buildWhatsAppQuoteUrl(items, total);
    console.log(
      "[B2B Checkout WhatsApp]",
      decodeURIComponent(url.split("text=")[1] ?? "")
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={closeCart}
            aria-hidden="true"
          />

          <motion.aside
            initial={prefersReducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}  
            className="fixed top-0 h-[600] right-0 z-[70] flex w-full max-w-full flex-col border-l border-border bg-[#FAFAFA] shadow-2xl sm:w-[450px]"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito B2B"
          >
            <div className="flex items-center justify-between border-b border-border bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Solicitud B2B
                </h2>
                <p className="text-sm text-muted">
                  {itemCount} unidad{itemCount !== 1 ? "es" : ""} ·{" "}
                  {items.length} producto{items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                aria-label="Cerrar carrito"
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

            <div className="flex-1 overflow-y-auto bg-[#FAFAFA] px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-muted shadow-sm">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <p className="mb-1 text-base font-medium text-foreground">
                    Carrito vacío
                  </p>
                  <p className="mb-6 max-w-xs text-sm text-muted">
                    Agregue productos desde el catálogo para solicitar su
                    cotización mayorista.
                  </p>
                  <Link
                    href="/productos"
                    onClick={closeCart}
                    className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                  >
                    Ver catálogo
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <CartLineItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      onNavigate={closeCart}
                    />
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border bg-white px-6 py-5">
                <div className="mb-5 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-muted">
                    Total estimado
                  </span>
                  <span className="text-2xl font-semibold tracking-tight text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#25D366] px-5 py-4 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#20BD5A] hover:shadow-lg"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Solicitar Cotización por WhatsApp
                </button>

                <p className="text-center text-[11px] leading-relaxed text-muted">
                  Nota: Los precios y la disponibilidad están sujetos a
                  confirmación final.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
