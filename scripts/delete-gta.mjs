import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  console.log("🗑️ حذف Grand Theft Auto V...");
  const del = await db.execute("DELETE FROM mods WHERE game = 'Grand Theft Auto V'");
  console.log("تم حذف صفوف GTA V:", del.rowsAffected);
}

run();
