"use client";

import { useState } from "react";
import { CurrencySelector } from "@/components/catalog/CurrencySelector";
import { FreightQuoteModal } from "@/components/product/FreightQuoteModal";
import { ProductGallery } from "@/components/product/ProductGallery";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { SpecsAccordion } from "@/components/product/SpecsAccordion";
import { VolumePricingTable } from "@/components/product/VolumePricingTable";
import { TrustBadges } from "@/components/product/TrustBadges";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { AVAILABILITY_LABEL } from "@/lib/constants";
import { getProductTags } from "@/lib/pricing";
import { useCartStore } from "@/stores/cart-store";
import type { CurrencyCode, Product } from "@/types";

interface ProductDetailViewProps {
  product: Product;
  categoryName: string;
  categorySlug: string;
}

const tagStyles = {
  "Alto Margen": "bg-accent/10 text-accent",
  "Buen Margen": "bg-surface-elevated text-foreground",
  "Caja Cerrada": "bg-blue-50 text-blue-700",
} as const;

export function ProductDetailView({
  product,
  categoryName,
  categorySlug,
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [currency, setCurrency] = useState<CurrencyCode>("PYG");
  const [freightOpen, setFreightOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const tags = getProductTags(product);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      quantity,
      image: product.images[0],
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <>
      <Container className="py-8 sm:py-12">
        <FadeIn className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Productos", href: "/productos" },
              {
                label: categoryName,
                href: `/productos?categoria=${categorySlug}`,
              },
              { label: product.name },
            ]}
          />
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <FadeIn direction="left">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted">
                    {categoryName}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    {AVAILABILITY_LABEL}
                  </span>
                  <span className="text-xs text-muted">SKU: {product.sku}</span>
                </div>

                <h1 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {product.name}
                </h1>

                <p className="mb-4 text-sm leading-relaxed text-muted sm:text-base">
                  {product.description}
                </p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          tagStyles[tag as keyof typeof tagStyles] ??
                          "bg-surface-elevated text-foreground"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="rounded-md bg-surface-elevated px-2.5 py-1 text-xs font-medium text-muted">
                      Margen est. {product.estimatedMargin}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Precios por volumen
                </h2>
                <CurrencySelector value={currency} onChange={setCurrency} />
              </div>

              <VolumePricingTable
                product={product}
                quantity={quantity}
                currency={currency}
              />

              <QuantitySelector
                product={product}
                quantity={quantity}
                currency={currency}
                onChange={setQuantity}
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  {addedFeedback
                    ? "✓ Agregado al carrito"
                    : "Agregar al Carrito (B2B)"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setFreightOpen(true)}
                >
                  Solicitar cotización de flete
                </Button>
              </div>

              <TrustBadges />
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-14 lg:mt-20" delay={0.15}>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Información detallada
          </h2>
          <SpecsAccordion product={product} />
        </FadeIn>
      </Container>

      <FreightQuoteModal
        open={freightOpen}
        onClose={() => setFreightOpen(false)}
        productName={product.name}
        sku={product.sku}
      />
    </>
  );
}
