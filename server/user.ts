"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { authClient } from "../lib/auth-client";

import { XataHttpClient } from "drizzle-orm/xata-http";
import { drizzle } from "drizzle-orm/xata-http";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm/expressions";
import { getXataClient } from "@/db/xata-client";

import { redirect } from "next/navigation";

const xata: XataHttpClient = getXataClient() as unknown as XataHttpClient;
const db = drizzle(xata);
export const signIn = async (formData: any) => {
  const response = await auth.api.signInEmail({
    body: {
      email: formData.get("email"),
      password: formData.get("password"),
    },
  });

  const user = response.user;

  const userData = await getUserDetailsByEmail(user.email);

  if (!userData) {
    redirect("/not-approved");
  }

  return { success: true };
};

export const signUp = async (formData: any) => {
  const response = await auth.api.signUpEmail({
    body: {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      role: "staff",
    },
  });

  const user = response.user;

  const userData = await getUserDetailsByEmail(user.email);

  if (!userData) {
    redirect("/not-approved");
  }

  return { success: true };
};

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
};

export const signInGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });

  return data;
};

export const getUserDetailsByEmail = async (email: string) => {
  try {
    const result = await db.select().from(user).where(eq(user.email, email));

    return result[0].isApproved;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export const getUserRole = async (email: string) => {
  try {
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0]; // Return full user object
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};
