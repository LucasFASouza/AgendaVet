import { auth } from "@/auth";
import { verifyAdminRole } from "@/actions/authActions";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { email: string };
}) {
  const session = await auth();
  const isAdmin = await verifyAdminRole();

  if (!session || (!isAdmin && session.user?.email !== params.email)) {
    redirect("/login");
  }

  return <>{children}</>;
}
