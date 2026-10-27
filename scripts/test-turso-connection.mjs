import fs from "node:fs";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";

const env = dotenv.parse(fs.readFileSync(".env.local"));
console.log("Checking connection to:", env.TURSO_DATABASE_URL);

const client = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

async function test() {
  try {
    const res = await client.execute("SELECT 1 as test");
    console.log("Connection OK:", res.rows[0]);
  } catch (err) {
    console.error("Connection Failed:", err.message);
  }
}

test();
