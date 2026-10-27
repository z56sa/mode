import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Connecting to new DB:", process.env.TURSO_DATABASE_URL);
  
  // 1. Create table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS mods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      game TEXT NOT NULL,
      game_genre TEXT NOT NULL DEFAULT 'Sandbox',
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      download_url TEXT NOT NULL,
      download_file_name TEXT,
      download_size INTEGER,
      author TEXT NOT NULL DEFAULT 'المجتمع',
      version TEXT,
      status TEXT NOT NULL DEFAULT 'approved',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      source_url TEXT,
      upload_storage_key TEXT,
      upload_file_name TEXT,
      upload_size INTEGER,
      mirror_storage_key TEXT,
      mirror_file_name TEXT,
      mirror_size INTEGER,
      mirror_uploaded_at TEXT
    )
  `);
  console.log("Table 'mods' ready!");

  // 2. Fetch real mods from Modrinth (Minecraft)
  console.log("Fetching real Minecraft mods from Modrinth...");
  const mrRes = await fetch("https://api.modrinth.com/v2/search?limit=80&index=downloads", {
    headers: { "User-Agent": "mode-platform/1.0" },
  });
  const mrData = await mrRes.json();
  
  let inserted = 0;
  for (const hit of (mrData.hits || [])) {
    const title = hit.title?.trim();
    const slug = `mr-${hit.slug || hit.project_id}`.slice(0, 80);
    const game = "Minecraft";
    const gameGenre = "Sandbox";
    const category = hit.categories?.[0] || "Gameplay";
    const desc = hit.description || `${title} - مود حقيقي متوافق ومميز.`;
    const iconUrl = hit.icon_url || hit.gallery?.[0] || null;
    const author = hit.author || "مطور مستقل";
    const dlUrl = `/api/download/${slug}`;

    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO mods (title, slug, game, game_genre, category, description, image_url, download_url, author, version, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '1.0.0', 'approved')`,
        args: [title, slug, game, gameGenre, category, desc, iconUrl, dlUrl, author],
      });
      inserted++;
    } catch (e) {
      // ignore
    }
  }
  console.log(`Successfully added ${inserted} Minecraft mods!`);

  // 3. Fetch real mods from Thunderstore (Lethal Company)
  console.log("Fetching real Lethal Company mods from Thunderstore...");
  const tsRes = await fetch("https://thunderstore.io/c/lethal-company/api/v1/package/");
  const tsData = await tsRes.json();
  
  let tsInserted = 0;
  for (const pkg of (tsData || []).slice(0, 80)) {
    const latest = pkg.latest;
    if (!latest) continue;
    const title = (latest.name || pkg.name || "").replace(/_/g, " ");
    const slug = `ts-lc-${pkg.namespace}-${pkg.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
    const game = "Lethal Company";
    const gameGenre = "Horror";
    const category = pkg.categories?.[0] || "Mods";
    const desc = latest.description || `${title} - إضافة مجتمعية أصلية.`;
    const iconUrl = latest.icon || null;
    const author = pkg.namespace || "Thunderstore Creator";
    const dlUrl = `/api/download/${slug}`;

    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO mods (title, slug, game, game_genre, category, description, image_url, download_url, author, version, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
        args: [title, slug, game, gameGenre, category, desc, iconUrl, dlUrl, author, latest.version_number || "1.0.0"],
      });
      tsInserted++;
    } catch (e) {
      // ignore
    }
  }
  console.log(`Successfully added ${tsInserted} Lethal Company mods!`);

  const count = await db.execute("SELECT COUNT(*) as c FROM mods");
  console.log(`\n🎉 DONE! Total mods in knook9: ${count.rows[0]?.c}`);
}

main().catch(console.error);
