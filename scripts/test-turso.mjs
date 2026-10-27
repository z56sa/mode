import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function test() {
  try {
    console.log("Testing Turso connection to:", process.env.TURSO_DATABASE_URL);
    const countRes = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
    console.log("Total approved mods in DB:", countRes.rows[0]?.c);

    const sample = await db.execute("SELECT title, game FROM mods WHERE status = 'approved' LIMIT 5");
    console.log("Sample mods:", sample.rows);
  } catch (err) {
    console.error("Test failed with error:", err);
  }
}

test();
