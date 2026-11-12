import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

const baseURL = process.env.BETTER_AUTH_URL;

const trustedOrigins = [
  baseURL,
  process.env.NEXT_PUBLIC_APP_URL,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((s) => s.trim()) ??
    []),
].filter((v): v is string => Boolean(v));

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users: schema.users,
      user_accounts: schema.user_accounts,
      user_sessions: schema.user_sessions,
      verifications: schema.verifications,
    },
  }),
  user: {
    modelName: "users",
  },
  account: {
    modelName: "user_accounts",
  },
  session: {
    modelName: "user_sessions",
  },
  verification: {
    modelName: "verifications",
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
});

export type Session = typeof auth.$Infer.Session;
