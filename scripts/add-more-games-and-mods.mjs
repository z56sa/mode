/**
 * سكريبت لإضافة 10 ألعاب جديدة وتوسيع المودات لتتجاوز 100,000 مود حقيقي
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// الألعاب الجديدة
const NEW_GAMES = [
  { community: "reskate",                  game: "ReSkate",                  genre: "Sports",     limit: 3000 },
  { community: "how-to-fish",              game: "How to Fish",              genre: "Simulation", limit: 275  },
  { community: "gamble-with-your-friends", game: "Gamble With Your Friends", genre: "Party",      limit: 87   },
  { community: "space-cat-digger",         game: "Space Cat Digger",         genre: "Action",     limit: 58   },
  { community: "burglin-gnomes",           game: "Burglin Gnomes",           genre: "Action",     limit: 51   },
  { community: "the-spell-brigade",        game: "The Spell Brigade",        genre: "Action",     limit: 27   },
  { community: "among-us",                 game: "Among Us",                 genre: "Party",      limit: 17   },
  { community: "holdfast-nations-at-war",  game: "Holdfast: Nations At War", genre: "Action",     limit: 9    },
  { community: "pikuniku",                 game: "Pikuniku",                 genre: "Platformer", limit: 8    },
];

// رفع سقف الألعاب الضخمة القائمة
const EXPAND_EXISTING = [
  { community: "lethal-company",           game: "Lethal Company",           genre: "Horror",     limit: 30000 },
  { community: "valheim",                  game: "Valheim",                  genre: "Survival",   limit: 13000 },
  { community: "riskofrain2",              game: "Risk of Rain 2",           genre: "Roguelike",  limit: 7500  },
  { community: "h3vr",                     game: "H3VR",                     genre: "Simulation", limit: 6000  },
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

async function ingestCommunity(item) {
  try {
    console.log(`📦 جلب ${item.game} (${item.community})...`);
    const res = await fetch(`https://thunderstore.io/c/${item.community}/api/v1/package/`, {
      headers: { "User-Agent": "mode-platform/1.0" },
    });
    if (!res.ok) {
      console.log(`❌ فشل ${item.game}: ${res.status}`);
      return 0;
    }

    const packages = await res.json();
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
    return inserted;
  } catch (e) {
    console.error(`خطأ ${item.game}:`, e.message);
    return 0;
  }
}

async function main() {
  console.log("🚀 بدء التوسيع الشامل...\n");

  let totalNew = 0;
  console.log("🎮 إضافة ألعاب جديدة بالكامل:");
  for (const g of NEW_GAMES) {
    totalNew += await ingestCommunity(g);
  }

  console.log("\n📈 توسيع مودات الألعاب القائمة لأقصى حد:");
  for (const g of EXPAND_EXISTING) {
    totalNew += await ingestCommunity(g);
  }

  const stats = await db.execute("SELECT count(DISTINCT game) as games, count(*) as mods FROM mods");
  console.log("\n==================================");
  console.log(`🎉 النتيجة الإجمالية:`);
  console.log(`- إجمالي المودات المضافة بهذه الدفعة: ${totalNew}`);
  console.log(`- إجمالي الألعاب في الموقع: ${stats.rows[0].games}`);
  console.log(`- إجمالي المودات في الموقع: ${stats.rows[0].mods}`);
  console.log("==================================");
}

main();
