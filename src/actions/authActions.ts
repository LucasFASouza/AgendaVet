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

export async function getUserInfo() {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  const user = await db
    .select({
      name: users.name,
      zipCode: users.zipCode,
      addressStreet: users.addressStreet,
      addressNumber: users.addressNumber,
      addressComplement: users.addressComplement,
    })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user.length) {
    throw new Error("Usuário não encontrado");
  }

  return user[0];
}

export async function saveUserAddress(
  zipCode: string,
  addressStreet: string,
  addressNumber: string,
  addressComplement?: string,
  name?: string
) {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  const updateData: Record<string, string | undefined> = {
    zipCode,
    addressStreet,
    addressNumber,
    addressComplement,
  };

  if (name) {
    updateData.name = name;
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.email, session.user.email));
}
