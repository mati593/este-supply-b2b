import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminPanelShell } from "@/components/admin/AdminPanelShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_ROLE,
  authOptions,
  isAdminEmail,
} from "@/lib/auth";
import { getProducts } from "@/lib/data";
export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    session.user.role !== ADMIN_ROLE ||
    !isAdminEmail(session.user.email)
  ) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border bg-surface px-8 py-4">
          <p className="text-sm text-muted">
            Sesión administrador:{" "}
            <span className="font-medium text-foreground">
              {session.user.email}
            </span>
          </p>
        </header>
        <main className="flex-1 p-8">
          <AdminPanelShell initialProducts={getProducts()}>
            {children}
          </AdminPanelShell>
        </main>
      </div>
    </div>
  );
}
