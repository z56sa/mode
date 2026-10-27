/**
 * سكريبت لإضافة أكثر من 20 لعبة جديدة ومئات المودات الحقيقية لـ Turso DB
 * الألعاب تشمل: Balatro, Inscryption, V Rising, Sons of the Forest, Enter the Gungeon,
 * Shadows of Doubt, Subnautica: Below Zero, TaleSpire, Bloons TD 6, Boneworks, H3VR وغيرها.
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const TARGET_GAMES = [
  { community: "balatro",               game: "Balatro",               genre: "Roguelike",   limit: 150 },
  { community: "inscryption",           game: "Inscryption",           genre: "Card Battler",limit: 150 },
  { community: "v-rising",              game: "V Rising",              genre: "Survival",    limit: 150 },
  { community: "sons-of-the-forest",    game: "Sons of the Forest",    genre: "Horror",      limit: 80  },
  { community: "enter-the-gungeon",     game: "Enter the Gungeon",     genre: "Roguelike",   limit: 150 },
  { community: "shadows-of-doubt",      game: "Shadows of Doubt",      genre: "Detective",   limit: 120 },
  { community: "subnautica-below-zero", game: "Subnautica: Below Zero",genre: "Survival",    limit: 100 },
  { community: "boneworks",             game: "BONEWORKS",             genre: "Action",      limit: 150 },
  { community: "talespire",             game: "TaleSpire",             genre: "RPG",         limit: 120 },
  { community: "bloons-td-6",           game: "Bloons TD 6",           genre: "Strategy",    limit: 37  },
  { community: "stick-fight-the-game",  game: "Stick Fight: The Game", genre: "Action",      limit: 35  },
  { community: "peglin",                game: "Peglin",                genre: "Roguelike",   limit: 43  },
  { community: "sun-haven",             game: "Sun Haven",             genre: "Simulation",  limit: 32  },
  { community: "core-keeper",           game: "Core Keeper",           genre: "Sandbox",     limit: 29  },
  { community: "crab-game",             game: "Crab Game",             genre: "Action",      limit: 46  },
  { community: "potion-craft",          game: "Potion Craft",          genre: "Simulation",  limit: 25  },
  { community: "getting-over-it",       game: "Getting Over It",       genre: "Platformer",  limit: 14  },
  { community: "wobbly-life",           game: "Wobbly Life",           genre: "Sandbox",     limit: 14  },
  { community: "ravenfield",            game: "Ravenfield",            genre: "Action",      limit: 13  },
  { community: "superhot",              game: "SUPERHOT",              genre: "Action",      limit: 11  },
  { community: "h3vr",                  game: "H3VR",                  genre: "Simulation",  limit: 150 },
];

async function insertBatch(rows) {
  if (rows.length === 0) return 0;
  
  // نستخدم Statements متعددة مع batch
  const stmts = rows.map(r => ({
    sql: `INSERT OR IGNORE INTO mods (
      title, slug, game, game_genre, category,
      description, image_url, download_url, source_url,
      author, version, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
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
    ],
  }));

  try {
    await db.batch(stmts, "write");
    return stmts.length;
  } catch (e) {
    console.error("Batch error, falling back to individual inserts:", e.message);
    let okCount = 0;
    for (const stmt of stmts) {
      try {
        await db.execute(stmt);
        okCount++;
      } catch (err) {}
    }
    return okCount;
  }
}

async function run() {
  console.log("🚀 بدء إضافة ألعاب ومودات جديدة...\n");
  let grandTotal = 0;

  for (const item of TARGET_GAMES) {
    try {
      console.log(`📡 جلب مودات لعبة ${item.game} (${item.community})...`);
      const res = await fetch(`https://thunderstore.io/c/${item.community}/api/v1/package/`, {
        headers: { "User-Agent": "mode-platform/1.0" },
      });

      if (!res.ok) {
        console.log(`❌ فشل الاتصال لـ ${item.game}: ${res.status}`);
        continue;
      }

      const packages = await res.json();
      console.log(`  📦 تم العثور على ${packages.length} مود في API`);

      const toInsert = [];
      let count = 0;

      for (const pkg of packages) {
        if (count >= item.limit) break;
        const latest = pkg.versions?.[0] || pkg.latest;
        if (!latest) continue;

        const title = (latest.name || pkg.name || "").replace(/_/g, " ").trim();
        if (!title) continue;

        const slug = `ts-${item.community}-${pkg.namespace || "creator"}-${pkg.name || title}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 80);

        toInsert.push({
          title,
          slug,
          game: item.game,
          genre: item.genre,
          category: pkg.categories?.[0] || "Mods",
          description: latest.description || `${title} - مود للعبة ${item.game}.`,
          imageUrl: latest.icon || null,
          downloadUrl: latest.download_url || `/api/download/${slug}`,
          sourceUrl: pkg.package_url || null,
          author: pkg.namespace || pkg.owner || "Creator",
          version: latest.version_number || "1.0.0",
        });

        count++;
      }

      // إدخال على دفعات بحجم 50
      let insertedForGame = 0;
      for (let i = 0; i < toInsert.length; i += 50) {
        const chunk = toInsert.slice(i, i + 50);
        insertedForGame += await insertBatch(chunk);
      }

      console.log(`  ✅ تم إدخال ${insertedForGame} مود للعبة ${item.game}\n`);
      grandTotal += insertedForGame;
    } catch (err) {
      console.error(`خطأ في لعبة ${item.game}:`, err.message);
    }
  }

  // عرض الإحصائيات الجديدة
  const statsRes = await db.execute("SELECT count(DISTINCT game) as games, count(*) as mods FROM mods");
  console.log("\n==================================");
  console.log(`🎉 اكتملت العملية بنجاح!`);
  console.log(`إجمالي المودات المضافة الآن: ${grandTotal}`);
  console.log(`إحصائيات قاعدة البيانات الإجمالية:`);
  console.log(`- عدد الألعاب: ${statsRes.rows[0].games}`);
  console.log(`- إجمالي المودات: ${statsRes.rows[0].mods}`);
  console.log("==================================");
}

run();
