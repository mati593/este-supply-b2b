"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { User } from "lucide-react";
import { useState } from "react";
import {
  AccountButton,
  AccountButtonMobile,
} from "@/components/auth/AccountButton";
import { AdminAccessLink } from "@/components/admin/AdminAccessLink";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchBar } from "@/components/layout/SearchBar";
import { Container } from "@/components/ui/Container";
import { CATEGORY_NAV, SITE_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const openModal = useAuthStore((state) => state.openModal);
  const user = useAuthStore((state) => state.user);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur-md">
      <Container className="py-3">
        <div className="flex items-center gap-4 lg:gap-5">
          {/* Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            onClick={closeMobile}
          >
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-sm font-bold text-white"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              ES
            </motion.div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[11px] text-muted">{SITE_CONFIG.tagline}</span>
            </div>
          </Link>

          {/* Navegación principal — desktop */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Navegación principal"
          >
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              Productos
            </Link>
            <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
            {CATEGORY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Buscador — desktop/tablet */}
          <SearchBar className="hidden min-w-0 flex-1 md:block md:max-w-[200px] lg:max-w-xs xl:max-w-sm" />

          {/* Cuenta + Carrito + menú mobile */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <AdminAccessLink className="hidden sm:inline-flex" />
            <AccountButton />
            {!user && (
              <button
                type="button"
                onClick={openModal}
                className="flex h-50 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-elevated sm:hidden"
                aria-label="Iniciar sesión"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <CartButton />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-elevated lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú de navegación"
              aria-expanded={mobileOpen}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Buscador — mobile */}
        <div className="mt-3 md:hidden">
          <SearchBar onNavigate={closeMobile} />
        </div>
      </Container>

      <CartDrawer />

      {mobileOpen && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-border bg-white lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            <Link
              href="/"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
              onClick={closeMobile}
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
              onClick={closeMobile}
            >
              Productos
            </Link>
            <p className="mb-1 mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Categorías
            </p>
            {CATEGORY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-border pt-3 space-y-2">
              <AdminAccessLink className="w-full justify-center" />
              <AccountButtonMobile />
            </div>
          </Container>
        </motion.div>
      )}
    </header>
  );
}
