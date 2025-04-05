import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pglite",
  dbCredentials: {
    url: process.env.DATABASE_URL! // or paste the actual URL
  }
});
