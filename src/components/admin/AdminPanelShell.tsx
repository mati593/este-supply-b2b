"use client";

import { AdminInventoryProvider } from "@/components/admin/AdminInventoryProvider";
import type { Product } from "@/types";

interface AdminPanelShellProps {
  initialProducts: Product[];
  children: React.ReactNode;
}

export function AdminPanelShell({
  initialProducts,
  children,
}: AdminPanelShellProps) {
  return (
    <AdminInventoryProvider initialProducts={initialProducts}>
      {children}
    </AdminInventoryProvider>
  );
}
