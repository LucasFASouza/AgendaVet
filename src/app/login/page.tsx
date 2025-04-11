import Login from "@/components/Login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome :)</CardTitle>
          <CardDescription>Sign in here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Login />
        </CardContent>
      </Card>
    </div>
  );
}
