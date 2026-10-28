import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("=== Cleaning Duplicate Mods while Preserving the Best Version ===");
  
  // الاحتفاظ بالنسخة التي تحتوي على صورة حقيقية وأطول وصف، أو ذات المعرف الأحدث
  const deleteSql = `
    DELETE FROM mods
    WHERE id NOT IN (
      SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY LOWER(TRIM(title)), game
                 ORDER BY 
                   (CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) DESC,
                   LENGTH(description) DESC,
                   id DESC
               ) as rn
        FROM mods
      ) WHERE rn = 1
    )
  `;

  console.log("Executing deduplication query...");
  const res = await db.execute(deleteSql);
  console.log(`Removed duplicate mod records: ${res.rowsAffected}`);

  const remaining = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`Clean unique approved mods in DB: ${remaining.rows[0].c}`);
}

main().catch(console.error);
