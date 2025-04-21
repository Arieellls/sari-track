import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "https://sari-track.vercel.app", // Hardcoded for testing
});
