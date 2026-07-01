import type { AvailabilityMode, Product, VolumePriceTier } from "@/types";

export const ADMIN_INPUT_CLASS =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent/40 focus:ring-2 focus:ring-accent/20";

// ─── Form shape ────────────────────────────────────────────────────────────────

export interface ProductFormValues {
  // General
  name: string;
  sku: string;
  categoryId: string;
  description: string;
  technicalDescription: string;
  featured: boolean;
  hidden: boolean;
  // Disponibilidad y precio
  availabilityMode: AvailabilityMode;
  stock: string;
  estimatedMargin: string;
  basePrice: string;
  // Escalones de precio por volumen
  tier2MinQty: string;
  tier2MaxQty: string;
  tier2Price: string;
  tier3MinQty: string;
  tier3Price: string;
  tier3Label: string;
  // Especificaciones
  brand: string;
  model: string;
  weight: string;
  dimensions: string;
  material: string;
  warranty: string;
  // Imágenes
  imageUrls: string;
  // Logística
  grossWeight: string;
  masterBoxDimensions: string;
  volumetricWeight: string;
  unitsPerMasterBox: string;
}

export function createEmptyProductForm(): ProductFormValues {
  return {
    name: "",
    sku: "",
    categoryId: "",
    description: "",
    technicalDescription: "",
    featured: false,
    hidden: false,
    availabilityMode: "on_order",
    stock: "0",
    estimatedMargin: "",
    basePrice: "",
    tier2MinQty: "",
    tier2MaxQty: "",
    tier2Price: "",
    tier3MinQty: "",
    tier3Price: "",
    tier3Label: "Caja Cerrada",
    brand: "",
    model: "",
    weight: "",
    dimensions: "",
    material: "",
    warranty: "",
    imageUrls: "",
    grossWeight: "",
    masterBoxDimensions: "",
    volumetricWeight: "",
    unitsPerMasterBox: "",
  };
}

/** Convierte un Product existente en valores de formulario para edición. */
export function productToForm(product: Product): ProductFormValues {
  const tier1 = product.volumePricing[0];
  const tier2 = product.volumePricing[1];
  const tier3 = product.volumePricing[2];

  return {
    name: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    description: product.description,
    technicalDescription: product.technicalDescription,
    featured: product.featured,
    hidden: product.hidden ?? false,
    availabilityMode: product.availabilityMode ?? "stock",
    stock: String(product.stock),
    estimatedMargin: String(product.estimatedMargin),
    basePrice: tier1 ? String(tier1.pricePerUnit) : "",
    tier2MinQty: tier2 ? String(tier2.minQuantity) : "",
    tier2MaxQty: tier2?.maxQuantity != null ? String(tier2.maxQuantity) : "",
    tier2Price: tier2 ? String(tier2.pricePerUnit) : "",
    tier3MinQty: tier3 ? String(tier3.minQuantity) : "",
    tier3Price: tier3 ? String(tier3.pricePerUnit) : "",
    tier3Label: tier3?.label ?? "Caja Cerrada",
    brand: product.specifications.brand ?? "",
    model: product.specifications.model ?? "",
    weight: product.specifications.weight,
    dimensions: product.specifications.dimensions,
    material: product.specifications.material ?? "",
    warranty: product.specifications.warranty ?? "",
    imageUrls: product.images.join("\n"),
    grossWeight: product.logistics?.grossWeight ?? "",
    masterBoxDimensions: product.logistics?.masterBoxDimensions ?? "",
    volumetricWeight: product.logistics?.volumetricWeight ?? "",
    unitsPerMasterBox:
      product.logistics?.unitsPerMasterBox != null
        ? String(product.logistics.unitsPerMasterBox)
        : "",
  };
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getAdminB2BTags(product: Product): string[] {
  const tags: string[] = [];
  if (product.estimatedMargin >= 50) {
    tags.push("Alto Margen");
  } else if (product.estimatedMargin >= 30) {
    tags.push("Buen Margen");
  }
  if (product.stock >= 50 && product.availabilityMode !== "on_order") {
    tags.push("Rotación");
  }
  return tags;
}

function parsePositiveInt(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function parseImageUrls(raw: string): string[] {
  return raw
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// ─── Validation ────────────────────────────────────────────────────────────────

export function validateProductForm(
  values: ProductFormValues
): Partial<Record<keyof ProductFormValues, string>> {
  const errors: Partial<Record<keyof ProductFormValues, string>> = {};

  if (!values.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!values.sku.trim()) errors.sku = "El SKU es obligatorio.";
  if (!values.categoryId) errors.categoryId = "Seleccione una categoría.";
  if (!values.description.trim())
    errors.description = "La descripción comercial es obligatoria.";
  if (!values.technicalDescription.trim())
    errors.technicalDescription = "La ficha técnica es obligatoria.";
  if (!values.weight.trim()) errors.weight = "El peso es obligatorio.";
  if (!values.dimensions.trim())
    errors.dimensions = "Las dimensiones son obligatorias.";

  const images = parseImageUrls(values.imageUrls);
  if (images.length === 0) {
    errors.imageUrls = "Ingrese al menos una URL de imagen.";
  } else if (images.some((url) => !isValidUrl(url))) {
    errors.imageUrls = "Todas las URLs deben ser válidas (http/https).";
  }

  // Stock solo requerido en modo "stock"
  if (values.availabilityMode === "stock") {
    if (parsePositiveInt(values.stock) === null)
      errors.stock = "Ingrese un stock válido (0 o más).";
  }

  const margin = parsePositiveInt(values.estimatedMargin);
  if (margin === null || margin > 100)
    errors.estimatedMargin = "Ingrese un margen entre 0 y 100.";

  const basePrice = parsePositiveNumber(values.basePrice);
  if (basePrice === null || basePrice <= 0)
    errors.basePrice = "Ingrese un precio base mayor a 0.";

  if (values.tier2Price.trim()) {
    if (!values.tier2MinQty.trim())
      errors.tier2MinQty = "Indique cantidad mínima del escalón 2.";
    if (parsePositiveNumber(values.tier2Price) === null)
      errors.tier2Price = "Precio del escalón 2 inválido.";
  }

  if (values.tier3Price.trim()) {
    if (!values.tier3MinQty.trim())
      errors.tier3MinQty = "Indique cantidad mínima del escalón 3.";
    if (parsePositiveNumber(values.tier3Price) === null)
      errors.tier3Price = "Precio del escalón 3 inválido.";
  }

  return errors;
}

// ─── Build helpers ─────────────────────────────────────────────────────────────

function buildVolumePricing(values: ProductFormValues): VolumePriceTier[] {
  const tiers: VolumePriceTier[] = [];
  const basePrice = Number.parseFloat(values.basePrice);

  tiers.push({
    minQuantity: 1,
    maxQuantity: values.tier2MinQty
      ? Number.parseInt(values.tier2MinQty, 10) - 1
      : null,
    pricePerUnit: basePrice,
  });

  if (values.tier2Price.trim() && values.tier2MinQty.trim()) {
    const tier2Min = Number.parseInt(values.tier2MinQty, 10);
    const tier2Max = values.tier2MaxQty.trim()
      ? Number.parseInt(values.tier2MaxQty, 10)
      : values.tier3MinQty.trim()
        ? Number.parseInt(values.tier3MinQty, 10) - 1
        : null;

    tiers.push({
      minQuantity: tier2Min,
      maxQuantity: tier2Max,
      pricePerUnit: Number.parseFloat(values.tier2Price),
    });
  }

  if (values.tier3Price.trim() && values.tier3MinQty.trim()) {
    tiers.push({
      minQuantity: Number.parseInt(values.tier3MinQty, 10),
      maxQuantity: null,
      pricePerUnit: Number.parseFloat(values.tier3Price),
      label: values.tier3Label.trim() || "Caja Cerrada",
    });
  }

  return tiers;
}

function buildSpecifications(
  values: ProductFormValues
): Product["specifications"] {
  const specs: Product["specifications"] = {
    weight: values.weight.trim(),
    dimensions: values.dimensions.trim(),
  };
  if (values.brand.trim()) specs.brand = values.brand.trim();
  if (values.model.trim()) specs.model = values.model.trim();
  if (values.material.trim()) specs.material = values.material.trim();
  if (values.warranty.trim()) specs.warranty = values.warranty.trim();
  return specs;
}

function buildLogistics(
  values: ProductFormValues
): Product["logistics"] | undefined {
  if (
    !values.grossWeight.trim() &&
    !values.masterBoxDimensions.trim() &&
    !values.volumetricWeight.trim()
  ) {
    return undefined;
  }
  const logistics: Product["logistics"] = {
    grossWeight: values.grossWeight.trim() || "—",
    masterBoxDimensions: values.masterBoxDimensions.trim() || "—",
    volumetricWeight: values.volumetricWeight.trim() || "—",
  };
  if (values.unitsPerMasterBox.trim()) {
    logistics.unitsPerMasterBox = Number.parseInt(
      values.unitsPerMasterBox,
      10
    );
  }
  return logistics;
}

function uniqueSlug(baseSlug: string, existingSlugs: Set<string>): string {
  let slug = baseSlug || "producto";
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

// ─── Create ────────────────────────────────────────────────────────────────────

export function createProductFromForm(
  values: ProductFormValues,
  existingProducts: Product[]
): Product {
  const existingSlugs = new Set(existingProducts.map((p) => p.slug));
  const baseSlug = slugifyProductName(values.name.trim());
  const slug = uniqueSlug(baseSlug, existingSlugs);
  const images = parseImageUrls(values.imageUrls);

  return {
    id: `prod-${Date.now()}`,
    slug,
    name: values.name.trim(),
    sku: values.sku.trim(),
    categoryId: values.categoryId,
    description: values.description.trim(),
    technicalDescription: values.technicalDescription.trim(),
    specifications: buildSpecifications(values),
    images,
    stock:
      values.availabilityMode === "on_order"
        ? 0
        : Number.parseInt(values.stock, 10),
    estimatedMargin: Number.parseInt(values.estimatedMargin, 10),
    featured: values.featured,
    hidden: values.hidden,
    availabilityMode: values.availabilityMode,
    volumePricing: buildVolumePricing(values),
    logistics: buildLogistics(values),
  };
}

// ─── Update ────────────────────────────────────────────────────────────────────

/** Genera los campos actualizados de un producto a partir del formulario de edición. */
export function updateProductFromForm(
  values: ProductFormValues,
  original: Product
): Product {
  const images = parseImageUrls(values.imageUrls);

  return {
    ...original,
    name: values.name.trim(),
    sku: values.sku.trim(),
    categoryId: values.categoryId,
    description: values.description.trim(),
    technicalDescription: values.technicalDescription.trim(),
    specifications: buildSpecifications(values),
    images,
    stock:
      values.availabilityMode === "on_order"
        ? 0
        : Number.parseInt(values.stock, 10),
    estimatedMargin: Number.parseInt(values.estimatedMargin, 10),
    featured: values.featured,
    hidden: values.hidden,
    availabilityMode: values.availabilityMode,
    volumePricing: buildVolumePricing(values),
    logistics: buildLogistics(values),
  };
}
