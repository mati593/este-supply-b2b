import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getCategories, getProductById, getProducts } from "@/lib/data";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getProducts().map((product) => ({
    id: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const categories = getCategories();
  const category = categories.find((c) => c.id === product.categoryId);
  const categoryName = category?.name ?? "Sin categoría";
  const categorySlug = category?.slug ?? "";

  return (
    <ProductDetailView
      product={product}
      categoryName={categoryName}
      categorySlug={categorySlug}
    />
  );
}
