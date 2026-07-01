import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const ADMIN_EMAIL = "admin@estesupply.com";
const ADMIN_PASSWORD = "admin";
export const ADMIN_ROLE = "admin" as const;
export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_DEFAULT_REDIRECT = "/admin/productos";

export function isAdminRole(role: string | undefined): boolean {
  return role === ADMIN_ROLE;
}

export function isAdminEmail(email: string | undefined | null): boolean {
  return email === ADMIN_EMAIL;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === ADMIN_EMAIL &&
          credentials?.password === ADMIN_PASSWORD
        ) {
          return {
            id: "admin-1",
            email: ADMIN_EMAIL,
            name: "Administrador",
            role: ADMIN_ROLE,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: ADMIN_LOGIN_PATH,
    error: ADMIN_LOGIN_PATH,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = (token.email as string) ?? session.user.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}${ADMIN_DEFAULT_REDIRECT}`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-estesupply-only",
};

export function isAdminToken(token: JWT | null | undefined): boolean {
  return (
    isAdminRole(token?.role as string | undefined) &&
    isAdminEmail(token?.email as string | undefined)
  );
}
