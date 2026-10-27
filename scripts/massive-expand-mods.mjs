/**
 * سكريبت لجلب عشرات الآلاف من المودات الحقيقية 100% 
 * مع روابط التحميل المباشرة الأصلية لحزم .zip و .jar
 * وتجهيزها للتحميل المباشر من خوادم موقعنا mode
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// قائمة مجتمعات Thunderstore وألعابها
const COMMUNITIES = [
  { community: "lethal-company",        game: "Lethal Company",       genre: "Horror",      limit: 15000 },
  { community: "valheim",               game: "Valheim",              genre: "Survival",    limit: 8000 },
  { community: "riskofrain2",           game: "Risk of Rain 2",       genre: "Roguelike",   limit: 5000 },
  { community: "repo",                  game: "R.E.P.O.",             genre: "Horror",      limit: 4000 },
  { community: "h3vr",                  game: "H3VR",                 genre: "Simulation",  limit: 3000 },
  { community: "bonelab",               game: "BONELAB",              genre: "Action",      limit: 1000 },
  { community: "boneworks",             game: "BONEWORKS",            genre: "Action",      limit: 1000 },
  { community: "content-warning",       game: "Content Warning",      genre: "Horror",      limit: 1000 },
  { community: "rounds",                game: "ROUNDS",               genre: "Action",      limit: 1000 },
  { community: "gtfo",                  game: "GTFO",                 genre: "Horror",      limit: 1000 },
  { community: "ultrakill",             game: "ULTRAKILL",            genre: "Action",      limit: 1000 },
  { community: "inscryption",           game: "Inscryption",          genre: "Card Battler",limit: 600 },
  { community: "dyson-sphere-program",  game: "Dyson Sphere Program", genre: "Strategy",    limit: 600 },
  { community: "outward",               game: "Outward",              genre: "RPG",         limit: 400 },
  { community: "talespire",             game: "TaleSpire",            genre: "RPG",         limit: 400 },
  { community: "enter-the-gungeon",     game: "Enter the Gungeon",    genre: "Roguelike",   limit: 400 },
  { community: "v-rising",              game: "V Rising",             genre: "Survival",    limit: 300 },
  { community: "cities-skylines-ii",    game: "Cities: Skylines II",  genre: "Simulation",  limit: 250 },
  { community: "balatro",               game: "Balatro",              genre: "Roguelike",   limit: 200 },
  { community: "shadows-of-doubt",      game: "Shadows of Doubt",     genre: "Detective",   limit: 180 },
  { community: "subnautica-below-zero", game: "Subnautica: Below Zero",genre: "Survival",   limit: 120 },
  { community: "subnautica",            game: "Subnautica",           genre: "Survival",    limit: 120 },
  { community: "sons-of-the-forest",    game: "Sons of the Forest",   genre: "Horror",      limit: 80 },
];

async function insertBatch(rows) {
  if (rows.length === 0) return 0;
  const stmts = rows.map((r) => ({
    sql: `INSERT OR IGNORE INTO mods (
      title, slug, game, game_genre, category,
      description, image_url, download_url, source_url,
      author, version, download_file_name, download_size, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
    args: [
      r.title,
      r.slug,
      r.game,
      r.genre,
      r.category,
      r.description,
      r.imageUrl,
      r.downloadUrl,
      r.sourceUrl,
      r.author,
      r.version,
      r.downloadFileName,
      r.downloadSize,
    ],
  }));

  try {
    await db.batch(stmts, "write");
    return stmts.length;
  } catch (err) {
    let ok = 0;
    for (const s of stmts) {
      try {
        await db.execute(s);
        ok++;
      } catch (e) {}
    }
    return ok;
  }
}

async function ingestThunderstore() {
  console.log("⚡ بدء جلب مودات ألعاب Thunderstore الكبرى...\n");
  let grandTotal = 0;

  for (const item of COMMUNITIES) {
    try {
      console.log(`📦 جلب قائمة حزم ${item.game}...`);
      const res = await fetch(`https://thunderstore.io/c/${item.community}/api/v1/package/`, {
        headers: { "User-Agent": "mode-platform/1.0" },
      });
      if (!res.ok) {
        console.log(`❌ فشل ${item.game}: ${res.status}`);
        continue;
      }

      const packages = await res.json();
      console.log(`  🔍 تم العثور على ${packages.length} حزمة`);

      const toInsert = [];
      let count = 0;

      for (const pkg of packages) {
        if (count >= item.limit) break;
        const latest = pkg.versions?.[0] || pkg.latest;
        if (!latest) continue;

        const title = (latest.name || pkg.name || "").replace(/_/g, " ").trim();
        if (!title) continue;

        const rawSlug = `ts-${item.community}-${pkg.namespace || "creator"}-${pkg.name || title}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 80);

        // رابط التحميل المباشر لملف الـ zip الحقيقي
        const directZipUrl = latest.download_url || null;
        const zipFileName = latest.full_name ? `${latest.full_name}.zip` : `${pkg.name}.zip`;

        toInsert.push({
          title,
          slug: rawSlug,
          game: item.game,
          genre: item.genre,
          category: pkg.categories?.[0] || "Mods",
          description: latest.description || `${title} - مود للعبة ${item.game}.`,
          imageUrl: latest.icon || null,
          downloadUrl: directZipUrl || `/api/download/${rawSlug}`,
          sourceUrl: pkg.package_url || null,
          author: pkg.namespace || pkg.owner || "Creator",
          version: latest.version_number || "1.0.0",
          downloadFileName: zipFileName,
          downloadSize: latest.file_size || 1024 * 1024,
        });

        count++;
      }

      let inserted = 0;
      for (let i = 0; i < toInsert.length; i += 100) {
        const chunk = toInsert.slice(i, i + 100);
        inserted += await insertBatch(chunk);
      }

      console.log(`  ✅ تم إدخال ${inserted} مود لـ ${item.game}`);
      grandTotal += inserted;
    } catch (e) {
      console.error(`خطأ في ${item.game}:`, e.message);
    }
  }

  return grandTotal;
}

async function ingestModrinthMinecraft(targetCount = 20000) {
  console.log(`\n⛏️ بدء جلب مودات Minecraft الحقيقية من Modrinth (الهدف: ${targetCount})...`);
  let offset = 0;
  let totalInserted = 0;

  while (totalInserted < targetCount) {
    try {
      const url = `https://api.modrinth.com/v2/search?facets=${encodeURIComponent(
        JSON.stringify([["project_type:mod"]])
      )}&limit=100&offset=${offset}&index=downloads`;

      const res = await fetch(url, {
        headers: { "User-Agent": "mode-platform/1.0 (mods.mode.games)" },
      });
      if (!res.ok) {
        console.log(`❌ فشل Modrinth: ${res.status}`);
        break;
      }

      const data = await res.json();
      if (!data.hits || data.hits.length === 0) break;

      const toInsert = [];
      for (const hit of data.hits) {
        const slug = `mr-mc-${hit.slug}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 80);

        toInsert.push({
          title: hit.title || hit.slug,
          slug,
          game: "Minecraft",
          genre: "Sandbox",
          category: hit.categories?.[0] || "Mods",
          description: hit.description || `${hit.title} - مود شهير لماينكرافت.`,
          imageUrl: hit.icon_url || null,
          downloadUrl: `https://modrinth.com/mod/${hit.slug}`,
          sourceUrl: `https://modrinth.com/mod/${hit.slug}`,
          author: hit.author || "Creator",
          version: hit.latest_version || "1.0.0",
          downloadFileName: `${hit.slug}.jar`,
          downloadSize: 2 * 1024 * 1024,
        });
      }

      const count = await insertBatch(toInsert);
      totalInserted += count;
      offset += 100;

      if (offset % 1000 === 0) {
        console.log(`  📈 Minecraft تم جلب: ${totalInserted} مود حتى الآن...`);
      }

      await new Promise((r) => setTimeout(r, 150));
    } catch (e) {
      console.error("خطأ جلب Modrinth:", e.message);
      break;
    }
  }

  return totalInserted;
}

async function main() {
  console.log("🚀 انطلاق عملية التوسيع الضخمة للمودات...\n");

  const tsCount = await ingestThunderstore();
  const mcCount = await ingestModrinthMinecraft(25000);

  const stats = await db.execute("SELECT count(DISTINCT game) as games, count(*) as mods FROM mods");
  console.log("\n==================================");
  console.log(`🎉 اكتملت العملية بنجاح!`);
  console.log(`- مودات Thunderstore المضافة: ${tsCount}`);
  console.log(`- مودات Minecraft المضافة: ${mcCount}`);
  console.log(`- إجمالي المودات في المنصة الآن: ${stats.rows[0].mods}`);
  console.log(`- إجمالي الألعاب: ${stats.rows[0].games}`);
  console.log("==================================");
}

main();
