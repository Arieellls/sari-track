"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { authClient } from "../lib/auth-client";

export const signIn = async (formData: any) => {
  await auth.api.signInEmail({
    body: {
      email: formData.get("email"),
      password: formData.get("password")
    }
  });
};

export const signUp = async (formData: any) => {
  await auth.api.signUpEmail({
    body: {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name")
    }
  });
};

// export const signOut = async () => {
//   authClient.signOut();
// };

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return session?.user;
};
