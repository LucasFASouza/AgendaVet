import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MyAppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  return <>{children}</>;
}
