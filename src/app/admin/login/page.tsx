"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ADMIN_DEFAULT_REDIRECT,
  ADMIN_EMAIL,
  ADMIN_ROLE,
} from "@/lib/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl =
    searchParams.get("callbackUrl") ?? ADMIN_DEFAULT_REDIRECT;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.role === ADMIN_ROLE
    ) {
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(
        "Acceso denegado. Solo la cuenta de administrador puede ingresar."
      );
      return;
    }

    router.replace(callbackUrl);
    router.refresh();
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Verificando sesión…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Este Supply
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Acceso Administrador
          </h1>
          <p className="mt-2 text-sm text-muted">
            Área restringida. Solo personal autorizado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Correo administrador
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ADMIN_EMAIL}
              autoComplete="username"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Verificando…" : "Ingresar al panel"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Tras iniciar sesión serás redirigido al inventario de productos.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted">Cargando…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
