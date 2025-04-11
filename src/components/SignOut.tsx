"use client";

import { signOutAction } from "@/actions/authActions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOut() {
  return (
    <form action={signOutAction}>
      <DropdownMenuItem asChild>
        <button
          type="submit"
          className="w-full flex items-center gap-2 justify-center"
        >
          Sign out
        </button>
      </DropdownMenuItem>
    </form>
  );
}
