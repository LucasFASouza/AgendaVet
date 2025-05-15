import React from "react";
import Link from "next/link";
import { SignOut } from "@/components/SignOut";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";
import { auth } from "@/auth";
import { verifyAdminRole } from "@/actions/authActions";

export const ProfileBadge = async () => {
  const session = await auth();

  if (!session?.user) {
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
          Login
        </Button>
      </form>
    );
  }

  const isAdmin = await verifyAdminRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={session.user.image ?? ""} />
          <AvatarFallback>
            {session.user.name?.at(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex flex-col items-center gap-2 p-4 border-b">
          <Link href="/">Início</Link>
          <Link href="/profile">Perfil</Link>
          {isAdmin && <Link href="/admin">Administrador</Link>}
        </div>
        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
