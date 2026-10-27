/**
 * سكريبت استيراد ألعاب ومودات مشهورة عالمياً:
 * 1. Beat Saber (أشهر لعبة VR مع آلاف الخرائط والمودات عبر BeatSaver CDN)
 * 2. Titanfall 2: Northstar (2,400+ مود)
 * 3. Risk of Rain Returns (230+ مود)
 * 4. Lethal League Blaze (98 مود)
 * 5. Supermarket Together (59 مود)
 * 6. Chrono Ark (42 مود)
 * 7. The Planet Crafter (16 مود)
 * 8. Deep Rock Galactic: Survivor (12 مود)
 * 9. Another Crab's Treasure (8 مود)
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const THUNDERSTORE_FAMOUS = [
  { community: "northstar",                    game: "Titanfall 2: Northstar",        genre: "Action",     limit: 2500 },
  { community: "risk-of-rain-returns",         game: "Risk of Rain Returns",          genre: "Roguelike",  limit: 300  },
  { community: "lethal-league-blaze",          game: "Lethal League Blaze",           genre: "Action",     limit: 150  },
  { community: "supermarket-together",         game: "Supermarket Together",          genre: "Simulation", limit: 100  },
  { community: "chrono-ark",                   game: "Chrono Ark",                    genre: "RPG",        limit: 60   },
  { community: "the-planet-crafter",           game: "The Planet Crafter",            genre: "Survival",   limit: 30   },
  { community: "deep-rock-galactic-survivor",  game: "Deep Rock Galactic: Survivor",  genre: "Action",     limit: 30   },
  { community: "another-crabs-treasure",       game: "Another Crab's Treasure",       genre: "Action",     limit: 20   },
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
      r.title, r.slug, r.game, r.genre, r.category,
      r.description, r.imageUrl, r.downloadUrl, r.sourceUrl,
      r.author, r.version, r.downloadFileName, r.downloadSize,
    ],
  }));
  try {
    await db.batch(stmts, "write");
    return stmts.length;
  } catch {
    let ok = 0;
    for (const s of stmts) {
      try { await db.execute(s); ok++; } catch {}
    }
    return ok;
  }
}

async function ingestThunderstore(item) {
  try {
    console.log(`📦 جلب ${item.game} (${item.community})...`);
    const res = await fetch(`https://thunderstore.io/c/${item.community}/api/v1/package/`, {
      headers: { "User-Agent": "mode-platform/1.0" },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      console.log(`  ❌ فشل: ${res.status}`);
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
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);

      toInsert.push({
        title,
        slug: rawSlug,
        game: item.game,
        genre: item.genre,
        category: pkg.categories?.[0] || "Mods",
        description: latest.description || `${title} - إضافة ومود للعبة ${item.game}.`,
        imageUrl: latest.icon || null,
        downloadUrl: latest.download_url || `/api/download/${rawSlug}`,
        sourceUrl: pkg.package_url || null,
        author: pkg.namespace || pkg.owner || "Creator",
        version: latest.version_number || "1.0.0",
        downloadFileName: latest.full_name ? `${latest.full_name}.zip` : `${pkg.name}.zip`,
        downloadSize: latest.file_size || 1024 * 1024,
      });
      count++;
    }

    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += 100) {
      inserted += await insertBatch(toInsert.slice(i, i + 100));
    }
    console.log(`  ✅ تم إدخال ${inserted} مود لـ ${item.game}`);
    return inserted;
  } catch (e) {
    console.error(`  ❌ خطأ في ${item.game}:`, e.message);
    return 0;
  }
}

async function ingestBeatSaber(targetCount = 6000) {
  console.log(`\n🎵 جلب مودات وخرائط Beat Saber من BeatSaver CDN (+${targetCount} مود)...`);
  let inserted = 0;
  let page = 0;
  const PAGE_SIZE = 100;

  while (inserted < targetCount) {
    try {
      const url = `https://api.beatsaver.com/maps/latest?pageSize=${PAGE_SIZE}&page=${page}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "mode-platform/1.0" },
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) {
        console.log(`\n  ❌ BeatSaver error page=${page}: ${res.status}`);
        break;
      }

      const data = await res.json();
      const docs = data.docs || [];
      if (docs.length === 0) break;

      const rows = [];
      for (const doc of docs) {
        const latestVersion = doc.versions?.[0];
        if (!latestVersion || !latestVersion.downloadURL) continue;

        const title = (doc.name || doc.metadata?.songName || `Map ${doc.id}`).trim();
        const rawSlug = `bs-${doc.id}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
        const artist = doc.metadata?.songAuthorName || doc.uploader?.name || "Beat Saber Mapper";

        rows.push({
          title,
          slug: rawSlug,
          game: "Beat Saber",
          genre: "Music",
          category: "Songs & Maps",
          description: doc.description || `خريطة ومود أغنية ${title} بواسطة ${artist} للعبة Beat Saber.`,
          imageUrl: latestVersion.coverURL || null,
          downloadUrl: latestVersion.downloadURL,
          sourceUrl: `https://beatsaver.com/maps/${doc.id}`,
          author: artist,
          version: "1.0",
          downloadFileName: `${doc.id} - ${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.zip`,
          downloadSize: 5 * 1024 * 1024,
        });
      }

      const got = await insertBatch(rows);
      inserted += got;
      page++;
      process.stdout.write(`\r  📥 Beat Saber: ${inserted}/${targetCount} (صفحة ${page})`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (e) {
      console.error(`\n  ⚠️ خطأ في صفحة ${page}:`, e.message);
      page++;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`\n  ✅ Beat Saber: تم إدخال ${inserted} مود وخريطة بنجاح!`);
  return inserted;
}

async function main() {
  console.log("🚀 بدء استيراد الألعاب والمودات المشهورة...\n");
  const check = await db.execute("SELECT count(*) as c FROM mods");
  console.log(`📊 عدد المودات الحالي قبل الاستيراد: ${check.rows[0].c}\n`);

  let total = 0;

  // 1. ألعاب Thunderstore المشهورة
  for (const g of THUNDERSTORE_FAMOUS) {
    total += await ingestThunderstore(g);
  }

  // 2. Beat Saber (لعبة VR الأيقونية)
  total += await ingestBeatSaber(6000);

  const stats = await db.execute("SELECT count(DISTINCT game) as games, count(*) as mods FROM mods");
  console.log("\n══════════════════════════════════════");
  console.log("🏆 النتيجة الإجمالية:");
  console.log(`  ➕ مودات جديدة أضيفت: ${total}`);
  console.log(`  🎮 إجمالي الألعاب: ${stats.rows[0].games}`);
  console.log(`  📦 إجمالي المودات: ${stats.rows[0].mods}`);
  console.log("══════════════════════════════════════");
}

main();
