"use client";

import { useEffect } from "react";
import { useAdminInventoryStore } from "@/stores/admin-inventory-store";
import type { Product } from "@/types";

interface AdminInventoryProviderProps {
  initialProducts: Product[];
  children: React.ReactNode;
}

export function AdminInventoryProvider({
  initialProducts,
  children,
}: AdminInventoryProviderProps) {
  const seedFromMock = useAdminInventoryStore((state) => state.seedFromMock);

  useEffect(() => {
    seedFromMock(initialProducts);
  }, [initialProducts, seedFromMock]);

  return <>{children}</>;
}
