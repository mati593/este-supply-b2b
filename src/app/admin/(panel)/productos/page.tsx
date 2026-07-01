import { InventoryTable } from "@/components/admin/InventoryTable";
import { getCategories } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario",
};

export default function AdminProductosPage() {
  const categories = getCategories();

  return <InventoryTable categories={categories} />;
}
