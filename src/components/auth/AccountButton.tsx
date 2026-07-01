"use client";

import { motion, useReducedMotion } from "framer-motion";
import { User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export function AccountButton() {
  const prefersReducedMotion = useReducedMotion();
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);
  const logout = useAuthStore((state) => state.logout);

  if (user) {
    return (
      <div className="relative group">
        <motion.button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-bold text-white ring-2 ring-white transition-shadow hover:shadow-md"
          aria-label={`Cuenta de ${user.email}`}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        >
          {user.initials}
        </motion.button>
        <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-white py-1 opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <p className="border-b border-border px-3 py-2 text-xs text-muted truncate">
            {user.email}
          </p>
          <button
            type="button"
            onClick={logout}
            className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-elevated"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={openModal}
      className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:bg-surface-elevated sm:flex"
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      aria-label="Iniciar sesión"
    >
      <User className="h-4 w-4 text-muted" />
      <span className="hidden md:inline">Iniciar sesión</span>
    </motion.button>
  );
}

export function AccountButtonMobile() {
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);
  const logout = useAuthStore((state) => state.logout);

  if (user) {
    return (
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
          {user.initials}
        </span>
        Cerrar sesión
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openModal}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
    >
      <User className="h-4 w-4 text-muted" />
      Iniciar sesión
    </button>
  );
}
