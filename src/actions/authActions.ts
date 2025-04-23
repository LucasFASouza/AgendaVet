"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { auth } from "@/auth";

export async function signOutAction() {
  await signOut();

  redirect("/login");
}

export async function verifyAdminRole() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return false;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user.length || user[0].role !== "admin") {
    return false;
  } else {
    return true;
  }
}

export async function saveUserAddress(
  email: string,
  zipCode: string,
  addressStreet: string,
  addressNumber: string,
  addressComplement?: string
) {
  await db
    .update(users)
    .set({
      zipCode,
      addressStreet,
      addressNumber,
      addressComplement,
    })
    .where(eq(users.email, email));
}
