import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button
        type="submit"
        className="w-full flex items-center gap-2 justify-center"
      >
        Sign in
      </Button>
    </form>
  );
}
