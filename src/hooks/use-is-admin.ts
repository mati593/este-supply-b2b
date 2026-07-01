"use client";

import { useSession } from "next-auth/react";
import { ADMIN_ROLE, isAdminEmail } from "@/lib/auth";

export function useIsAdminSession() {
  const { data: session, status } = useSession();

  const isAdmin =
    status === "authenticated" &&
    session?.user?.role === ADMIN_ROLE &&
    isAdminEmail(session.user.email);

  return {
    isAdmin,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    session,
  };
}
