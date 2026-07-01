import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_DEFAULT_REDIRECT,
  ADMIN_LOGIN_PATH,
  ADMIN_ROLE,
  isAdminEmail,
} from "@/lib/auth";

const authSecret = process.env.NEXTAUTH_SECRET ?? "dev-secret-estesupply-only";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: authSecret });

  if (pathname === ADMIN_LOGIN_PATH) {
    if (
      token?.role === ADMIN_ROLE &&
      isAdminEmail(token.email as string | undefined)
    ) {
      return NextResponse.redirect(new URL(ADMIN_DEFAULT_REDIRECT, req.url));
    }
    return NextResponse.next();
  }

  if (
    token?.role !== ADMIN_ROLE ||
    !isAdminEmail(token.email as string | undefined)
  ) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
