import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

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
  baseURL: process.env.BETTER_AUTH_URL,
});

export type Session = typeof auth.$Infer.Session;
