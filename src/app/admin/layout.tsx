import { verifyAdminRole } from "@/actions/authActions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await verifyAdminRole();

  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
