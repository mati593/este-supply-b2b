"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { useIsAdminSession } from "@/hooks/use-is-admin";

interface AdminAccessLinkProps {
  className?: string;
}

export function AdminAccessLink({ className = "" }: AdminAccessLinkProps) {
  const { isAdmin, isLoading } = useIsAdminSession();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin/productos"
      className={`inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-sm font-medium text-accent transition-colors hover:border-accent/30 hover:bg-accent/10 ${className}`}
    >
      <Package className="h-4 w-4 shrink-0" />
      <span>Administrar productos</span>
    </Link>
  );
}
