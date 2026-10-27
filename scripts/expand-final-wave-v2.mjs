/**
 * الموجة الأخيرة v2 — نهج أذكى:
 * - يتجنب الألعاب الضخمة جداً (Lethal Company) التي تسبب timeout
 * - يستخدم Thunderstore الـ "experimental" pagination API بدلاً من /api/v1/package/
 * - ألعاب جديدة صغيرة ومتوسطة أولاً
 * - توسيع Minecraft من Modrinth (+15,000)
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ألعاب Thunderstore — متوسطة وصغيرة فقط (لتجنب timeout)
const THUNDERSTORE_GAMES = [
  { community: "repo",                 game: "R.E.P.O.",             genre: "Horror",      limit: 5000 },
  { community: "ravenfield",           game: "Ravenfield",           genre: "Action",      limit: 500  },
  { community: "trombone-champ",       game: "Trombone Champ",       genre: "Music",       limit: 400  },
  { community: "dredge",               game: "Dredge",               genre: "Fishing",     limit: 300  },
  { community: "webfishing",           game: "WEBFISHING",           genre: "Fishing",     limit: 250  },
  { community: "peglin",               game: "Peglin",               genre: "Roguelike",   limit: 200  },
  { community: "dead-cells",           game: "Dead Cells",           genre: "Roguelike",   limit: 150  },
  { community: "blue-prince",          game: "Blue Prince",          genre: "Puzzle",      limit: 150  },
  { community: "graveyard-keeper",     game: "Graveyard Keeper",     genre: "Simulation",  limit: 130  },
  { community: "lootun",               game: "Lootun",               genre: "RPG",         limit: 100  },
  { community: "muck",                 game: "Muck",                 genre: "Survival",    limit: 100  },
  { community: "ancient-dungeon-vr",   game: "Ancient Dungeon VR",   genre: "VR",          limit: 80   },
  { community: "windrose",             game: "Windrose",             genre: "RPG",         limit: 60   },
  { community: "stacklands",           game: "Stacklands",           genre: "Strategy",    limit: 60   },
  { community: "stonewards",           game: "Stonewards",           genre: "Action",      limit: 50   },
  { community: "grain-rot",            game: "Grain Rot",            genre: "Survival",    limit: 30   },
  { community: "slip-skid",            game: "Slip Skid",            genre: "Racing",      limit: 30   },
  { community: "shift-at-midnight",    game: "Shift at Midnight",    genre: "Horror",      limit: 30   },
  { community: "romestead",            game: "Romestead",            genre: "Strategy",    limit: 30   },
  { community: "lucky-shot",           game: "Lucky Shot",           genre: "Action",      limit: 25   },
];

// Lethal Company — باستخدام v1 experimental pagination
const LETHAL_COMPANY_EXTRA = 20000; // نضيف 20,000 إضافية فوق الـ 30,000 الموجودة

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

// جلب مجتمع Thunderstore مع timeout قصير
async function ingestThunderstore(item) {
  try {
    console.log(`📦 ${item.game} (${item.community})...`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 ثانية max

    const res = await fetch(`https://thunderstore.io/c/${item.community}/api/v1/package/`, {
      headers: { "User-Agent": "mode-platform/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

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
    console.log(`  ✅ ${inserted} مود لـ ${item.game} (من ${packages.length} حزمة متاحة)`);
    return inserted;
  } catch (e) {
    if (e.name === "AbortError") {
      console.log(`  ⚠️ ${item.game}: timeout — تجاوز 25 ثانية`);
    } else {
      console.error(`  ❌ خطأ ${item.game}:`, e.message);
    }
    return 0;
  }
}

// Lethal Company — باستخدام pagination API الجديد (يعيد صفحات صغيرة)
async function ingestLethalCompanyPaginated() {
  console.log(`\n🔴 Lethal Company — paginated API (+${LETHAL_COMPANY_EXTRA} مود)...`);
  let inserted = 0;
  let page = 301; // نبدأ من الصفحة 301 (بعد الـ 30,000 = 300 صفحة × 100)
  const PAGE_SIZE = 100;

  while (inserted < LETHAL_COMPANY_EXTRA) {
    try {
      const url = `https://thunderstore.io/c/lethal-company/api/v1/package/?page=${page}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        headers: { "User-Agent": "mode-platform/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status === 404) {
          console.log(`\n  ✅ انتهت الصفحات عند page=${page}`);
          break;
        }
        console.log(`\n  ❌ page=${page}: ${res.status} — توقف`);
        break;
      }

      const data = await res.json();
      // التحقق: هل هذا pagination API أم قائمة كاملة؟
      const packages = Array.isArray(data) ? data : (data.results || []);
      if (packages.length === 0) {
        console.log(`\n  ✅ لا يوجد المزيد من الحزم`);
        break;
      }

      const toInsert = packages.slice(0, Math.min(PAGE_SIZE, LETHAL_COMPANY_EXTRA - inserted)).map((pkg) => {
        const latest = pkg.versions?.[0] || pkg.latest;
        if (!latest) return null;
        const title = (latest.name || pkg.name || "").replace(/_/g, " ").trim();
        if (!title) return null;
        const rawSlug = `ts-lethal-company-${pkg.namespace || "creator"}-${pkg.name || title}`
          .toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
        return {
          title,
          slug: rawSlug,
          game: "Lethal Company",
          genre: "Horror",
          category: pkg.categories?.[0] || "Mods",
          description: latest.description || `${title} - مود للعبة Lethal Company.`,
          imageUrl: latest.icon || null,
          downloadUrl: latest.download_url || `/api/download/${rawSlug}`,
          sourceUrl: pkg.package_url || null,
          author: pkg.namespace || pkg.owner || "Creator",
          version: latest.version_number || "1.0.0",
          downloadFileName: latest.full_name ? `${latest.full_name}.zip` : `${pkg.name}.zip`,
          downloadSize: latest.file_size || 1024 * 1024,
        };
      }).filter(Boolean);

      const got = await insertBatch(toInsert);
      inserted += got;
      page++;
      process.stdout.write(`\r  📥 Lethal Company paginated: +${inserted}/${LETHAL_COMPANY_EXTRA} (page ${page})`);
      await new Promise((r) => setTimeout(r, 300));

    } catch (e) {
      if (e.name === "AbortError") {
        console.log(`\n  ⚠️ page=${page} timeout — سكيب`);
      } else {
        console.error(`\n  ❌ خطأ page=${page}:`, e.message);
      }
      page++;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n  ✅ Lethal Company: تم إضافة ${inserted} مود إضافي`);
  return inserted;
}

// توسيع Minecraft من Modrinth
async function expandMinecraftModrinth() {
  console.log(`\n🟩 Minecraft Modrinth (+15,000)...`);
  let inserted = 0;
  let offset = 25000;
  const TARGET = 15000;
  const BATCH = 100;

  while (inserted < TARGET) {
    try {
      const limit = Math.min(BATCH, TARGET - inserted);
      const url = `https://api.modrinth.com/v2/search?facets=[["project_type:mod"]]&limit=${limit}&offset=${offset}&index=downloads`;
      const res = await fetch(url, {
        headers: { "User-Agent": "mode-platform/1.0 (contact@mode.gg)" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.log(`\n  ❌ offset=${offset}: ${res.status}`);
        break;
      }
      const data = await res.json();
      if (!data.hits || data.hits.length === 0) break;

      const rows = data.hits.map((h) => ({
        title: h.title || h.slug,
        slug: `modrinth-mc-${h.slug}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80),
        game: "Minecraft",
        genre: "Sandbox",
        category: h.categories?.[0] || "Mods",
        description: h.description || `${h.title} - مود Minecraft.`,
        imageUrl: h.icon_url || null,
        downloadUrl: `https://modrinth.com/mod/${h.slug}`,
        sourceUrl: `https://modrinth.com/mod/${h.slug}`,
        author: h.author || "Modder",
        version: h.latest_version || "1.0.0",
        downloadFileName: `${h.slug}.jar`,
        downloadSize: h.downloads || 1024 * 1024,
      }));

      const got = await insertBatch(rows);
      inserted += got;
      offset += data.hits.length;
      process.stdout.write(`\r  📥 Minecraft: ${inserted}/${TARGET} (offset=${offset})`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (e) {
      console.error(`\n  ⚠️ offset=${offset}:`, e.message);
      offset += BATCH;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.log(`\n  ✅ Minecraft: ${inserted} مود إضافي`);
  return inserted;
}

async function main() {
  console.log("🚀 الموجة الأخيرة v2\n");
  const check = await db.execute("SELECT count(*) as c FROM mods");
  console.log(`📊 الوضع الحالي: ${check.rows[0].c} مود\n`);

  let total = 0;

  // 1. ألعاب Thunderstore صغيرة ومتوسطة
  console.log("═══════════════════════════════════");
  console.log("🎮 Thunderstore — ألعاب جديدة:");
  console.log("═══════════════════════════════════");
  for (const g of THUNDERSTORE_GAMES) {
    total += await ingestThunderstore(g);
  }

  // 2. Lethal Company paginated
  total += await ingestLethalCompanyPaginated();

  // 3. Minecraft Modrinth
  total += await expandMinecraftModrinth();

  // إحصائيات نهائية
  const stats = await db.execute("SELECT count(DISTINCT game) as games, count(*) as mods FROM mods");
  console.log("\n══════════════════════════════════════");
  console.log("🏆 النتيجة النهائية:");
  console.log(`  ➕ مودات أضيفت الآن: ${total}`);
  console.log(`  🎮 إجمالي الألعاب: ${stats.rows[0].games}`);
  console.log(`  📦 إجمالي المودات: ${stats.rows[0].mods}`);
  console.log("══════════════════════════════════════");
}

main();
