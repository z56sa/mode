/**
 * الموجة الأخيرة من التوسيع:
 * 1. استنفاد Lethal Company (51,000+)
 * 2. ألعاب Thunderstore جديدة صغيرة
 * 3. توسيع Minecraft من Modrinth (77,000+)
 * 4. Dead Cells, Peglin, Trombone Champ, Webfishing, Dredge
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ألعاب Thunderstore — بعضها جديد كلياً وبعضها توسيع
const THUNDERSTORE_GAMES = [
  // استنفاد Lethal Company (الحد السابق 30,000 — الآن 51,427)
  { community: "lethal-company",       game: "Lethal Company",       genre: "Horror",      limit: 51427 },
  // ألعاب جديدة من Thunderstore
  { community: "stonewards",           game: "Stonewards",           genre: "Action",      limit: 50   },
  { community: "graveyard-keeper",     game: "Graveyard Keeper",     genre: "Simulation",  limit: 200  },
  { community: "blue-prince",          game: "Blue Prince",          genre: "Puzzle",      limit: 150  },
  { community: "windrose",             game: "Windrose",             genre: "RPG",         limit: 60   },
  { community: "grain-rot",            game: "Grain Rot",            genre: "Survival",    limit: 30   },
  { community: "slip-skid",            game: "Slip Skid",            genre: "Racing",      limit: 30   },
  { community: "shift-at-midnight",    game: "Shift at Midnight",    genre: "Horror",      limit: 30   },
  { community: "romestead",            game: "Romestead",            genre: "Strategy",    limit: 30   },
  { community: "lucky-shot",           game: "Lucky Shot",           genre: "Action",      limit: 25   },
  { community: "lootun",               game: "Lootun",               genre: "RPG",         limit: 80   },
  { community: "webfishing",           game: "WEBFISHING",           genre: "Fishing",     limit: 200  },
  { community: "dredge",               game: "Dredge",               genre: "Fishing",     limit: 300  },
  { community: "trombone-champ",       game: "Trombone Champ",       genre: "Music",       limit: 400  },
  { community: "peglin",               game: "Peglin",               genre: "Roguelike",   limit: 200  },
  { community: "dead-cells",           game: "Dead Cells",           genre: "Roguelike",   limit: 150  },
  { community: "muck",                 game: "Muck",                 genre: "Survival",    limit: 100  },
  { community: "stacklands",           game: "Stacklands",           genre: "Strategy",    limit: 60   },
  { community: "ancient-dungeon-vr",   game: "Ancient Dungeon VR",   genre: "VR",          limit: 80   },
  { community: "potion-craft",         game: "Potion Craft",         genre: "Simulation",  limit: 100  },
  { community: "ravenfield",           game: "Ravenfield",           genre: "Action",      limit: 500  },
  { community: "repo",                 game: "R.E.P.O.",             genre: "Horror",      limit: 5000 },
];

// توسيع Minecraft من Modrinth
const MINECRAFT_MODRINTH_LIMIT = 15000; // نضيف 15,000 إضافية

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
    console.log(`📦 ${item.game} (${item.community})...`);
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
        description: latest.description || `${title} - مود للعبة ${item.game}.`,
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
    console.log(`  ✅ ${inserted} مود لـ ${item.game} (من ${packages.length} حزمة)`);
    return inserted;
  } catch (e) {
    console.error(`  ⚠️ خطأ ${item.game}:`, e.message);
    return 0;
  }
}

async function expandMinecraftModrinth() {
  console.log(`\n🟩 توسيع Minecraft من Modrinth (+${MINECRAFT_MODRINTH_LIMIT})...`);
  let inserted = 0;
  let offset = 25000; // نبدأ بعد الـ 25,000 الموجودة
  const BATCH = 100;

  while (inserted < MINECRAFT_MODRINTH_LIMIT) {
    try {
      const limit = Math.min(BATCH, MINECRAFT_MODRINTH_LIMIT - inserted);
      const url = `https://api.modrinth.com/v2/search?query=&facets=[["project_type:mod"],["categories:fabric","categories:forge","categories:neoforge"]]&limit=${limit}&offset=${offset}&index=downloads`;

      const res = await fetch(url, {
        headers: { "User-Agent": "mode-platform/1.0 (contact@mode.gg)" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.log(`  ❌ Modrinth offset=${offset}: ${res.status}`);
        break;
      }
      const data = await res.json();
      if (!data.hits || data.hits.length === 0) break;

      const rows = data.hits.map((h) => {
        const slug = `modrinth-mc-${h.slug}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
        return {
          title: h.title || h.slug,
          slug,
          game: "Minecraft",
          genre: "Sandbox",
          category: h.categories?.[0] || "Mods",
          description: h.description || `${h.title} - مود للعبة Minecraft.`,
          imageUrl: h.icon_url || null,
          downloadUrl: `https://modrinth.com/mod/${h.slug}`,
          sourceUrl: `https://modrinth.com/mod/${h.slug}`,
          author: h.author || "Modder",
          version: h.latest_version || "1.0.0",
          downloadFileName: `${h.slug}.jar`,
          downloadSize: h.downloads || 1024 * 1024,
        };
      });

      const got = await insertBatch(rows);
      inserted += got;
      offset += data.hits.length;
      process.stdout.write(`\r  📥 Minecraft Modrinth: ${inserted}/${MINECRAFT_MODRINTH_LIMIT} (offset=${offset})`);

      await new Promise((r) => setTimeout(r, 200)); // تأخير لطيف
    } catch (e) {
      console.error(`\n  ⚠️ Modrinth خطأ offset=${offset}:`, e.message);
      offset += BATCH;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n  ✅ Minecraft Modrinth: تم إضافة ${inserted} مود إضافي`);
  return inserted;
}

async function main() {
  console.log("🚀 الموجة الأخيرة — توسيع ضخم شامل\n");

  // اختبار الاتصال
  const check = await db.execute("SELECT count(*) as c FROM mods");
  console.log(`📊 الوضع الحالي: ${check.rows[0].c} مود في قاعدة البيانات\n`);

  let total = 0;

  // Thunderstore
  console.log("═══════════════════════════════════");
  console.log("🎮 مودات Thunderstore:");
  console.log("═══════════════════════════════════");
  for (const g of THUNDERSTORE_GAMES) {
    total += await ingestThunderstore(g);
  }

  // Modrinth Minecraft
  total += await expandMinecraftModrinth();

  // إحصائيات نهائية
  const stats = await db.execute("SELECT count(DISTINCT game) as games, count(*) as mods FROM mods");
  console.log("\n══════════════════════════════════════");
  console.log("🏆 النتيجة النهائية:");
  console.log(`  ➕ مودات أضيفت: ${total}`);
  console.log(`  🎮 إجمالي الألعاب: ${stats.rows[0].games}`);
  console.log(`  📦 إجمالي المودات: ${stats.rows[0].mods}`);
  console.log("══════════════════════════════════════");
}

main();
