export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  /** Precio unitario en PYG según escalafón de volumen. */
  unitPrice: number;
  image: string;
}
