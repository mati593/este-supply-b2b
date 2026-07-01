import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getCategories } from "@/lib/data";

export default function AdminDashboardPage() {
  const categories = getCategories();

  return <AdminDashboard categoryCount={categories.length} />;
}
