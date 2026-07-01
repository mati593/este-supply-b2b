import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/currency";
import type { CartItem } from "@/types/cart";

export function getWhatsAppSupportUrl(message?: string): string {
  const phone = SITE_CONFIG.whatsapp.replace(/\D/g, "");
  const defaultMessage =
    "Hola Este Supply, me gustaría recibir información sobre sus productos mayoristas.";
  const text = encodeURIComponent(message ?? defaultMessage);
  return `https://wa.me/${phone}?text=${text}`;
}

export function buildWhatsAppQuoteMessage(
  items: CartItem[],
  total: number
): string {
  const lines = items.map(
    (item) =>
      `- ${item.quantity}x ${item.name} (Precio Vol: ${formatPrice(item.unitPrice)})`
  );

  return [
    "Hola Este Supply, me gustaría confirmar el stock y solicitar la cotización final de este pedido B2B, incluyendo opciones de flete:",
    "",
    ...lines,
    `- Total Estimado: ${formatPrice(total)}`,
  ].join("\n");
}

export function buildWhatsAppQuoteUrl(items: CartItem[], total: number): string {
  const message = buildWhatsAppQuoteMessage(items, total);
  const phone = SITE_CONFIG.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
