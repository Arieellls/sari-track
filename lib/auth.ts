import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { XataHttpClient } from "drizzle-orm/xata-http";
import { drizzle } from "drizzle-orm/xata-http";
import { getXataClient } from "./../src/db/xata-client";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { send } from "process";
import { text } from "stream/consumers";
import { Resend } from "resend";

const xata: XataHttpClient = getXataClient() as unknown as XataHttpClient;
const db = drizzle(xata);

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Sari-Track <noreply@aryel.works>",
        to: user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: ${url}`,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [nextCookies()],
});
