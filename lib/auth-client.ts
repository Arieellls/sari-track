import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: `https://${process.env.NEXT_PUBLIC_API_URL}`,
});
