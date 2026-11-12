import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DbClient = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __telemetryx_sql?: ReturnType<typeof postgres>;
  __telemetryx_db?: DbClient;
};

function createDb(): DbClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client =
    globalForDb.__telemetryx_sql ??
    postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__telemetryx_sql = client;
  }

  return drizzle(client, { schema });
}


export const db: DbClient = new Proxy({} as DbClient, {
  get(_target, prop, receiver) {
    const instance = (globalForDb.__telemetryx_db ??= createDb());
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export type Db = DbClient;
