/**
 * سكريبت إضافة موسّع — يضيف مودات حقيقية لألعاب كثيرة من Thunderstore و Modrinth
 * كيفية التشغيل: node scripts/add-massive-games.mjs
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// =============================================
// ألعاب Thunderstore — مجتمعات الـ Experimental
// =============================================
const THUNDERSTORE_GAMES = [
  { community: "riskofrain2",        game: "Risk of Rain 2",       genre: "Roguelike",   limit: 200 },
  { community: "palworld",           game: "Palworld",             genre: "RPG",         limit: 150 },
  { community: "titanfall2",         game: "Titanfall 2",          genre: "Action",      limit: 120 },
  { community: "bonelab",            game: "BONELAB",              genre: "Action",      limit: 120 },
  { community: "cities-skylines-ii", game: "Cities: Skylines II",  genre: "Simulation",  limit: 120 },
  { community: "gtfo",               game: "GTFO",                 genre: "Horror",      limit: 100 },
  { community: "content-warning",    game: "Content Warning",      genre: "Horror",      limit: 120 },
  { community: "rounds",             game: "ROUNDS",               genre: "Action",      limit: 100 },
  { community: "repo",               game: "R.E.P.O.",             genre: "Horror",      limit: 120 },
  { community: "valheim",            game: "Valheim",              genre: "Survival",    limit: 200 },
  { community: "lethal-company",     game: "Lethal Company",       genre: "Horror",      limit: 200 },
  { community: "ultrakill",          game: "ULTRAKILL",            genre: "Action",      limit: 100 },
  { community: "subnautica",         game: "Subnautica",           genre: "Survival",    limit: 100 },
  // ألعاب جديدة
  { community: "outward",            game: "Outward",              genre: "RPG",         limit: 80  },
  { community: "dyson-sphere-program",game: "Dyson Sphere Program",genre: "Strategy",    limit: 80  },
  { community: "monster-train",      game: "Monster Train",        genre: "Roguelike",   limit: 80  },
  { community: "dsp",                game: "Dyson Sphere Program", genre: "Strategy",    limit: 60  },
  { community: "stacklands",         game: "Stacklands",           genre: "Strategy",    limit: 60  },
];

// =============================================
// ألعاب Modrinth — فئات إضافية
// =============================================
const MODRINTH_LOADERS = [
  { loader: "fabric",       game: "Minecraft", genre: "Sandbox", limit: 100 },
  { loader: "forge",        game: "Minecraft", genre: "Sandbox", limit: 100 },
  { loader: "neoforge",     game: "Minecraft", genre: "Sandbox", limit: 80  },
  { loader: "quilt",        game: "Minecraft", genre: "Sandbox", limit: 60  },
];

async function fetchThunderstoreFeed() {
  console.log("⚡ جلب حزم Thunderstore Experimental...");
  const res = await fetch("https://thunderstore.io/api/experimental/package/", {
    headers: { "Accept-Encoding": "gzip" },
  });
  if (!res.ok) {
    console.error("❌ فشل Thunderstore:", res.status);
    return [];
  }
  const raw = await res.json();
  // API قد يرجع array مباشرة أو object بداخله results
  const data = Array.isArray(raw) ? raw : (raw?.results ?? raw?.packages ?? []);
  console.log(`✅ تم تحميل ${data.length} حزمة من Thunderstore`);
  return data;
}

async function fetchThunderstoreCommunity(community, limit) {
  // fallback: جلب مودات مجتمع محدد عبر API العادي
  const packages = [];
  let page = 1;
  while (packages.length < limit) {
    try {
      const res = await fetch(
        `https://thunderstore.io/c/${community}/api/v1/package/?page=${page}`,
        { headers: { "User-Agent": "mode-platform/1.0" } }
      );
      if (!res.ok) break;
      const data = await res.json();
      const results = Array.isArray(data) ? data : (data?.results ?? []);
      if (!results.length) break;
      packages.push(...results);
      if (!data.next) break;
      page++;
      await new Promise((r) => setTimeout(r, 400));
    } catch {
      break;
    }
  }
  return packages.slice(0, limit);
}

async function insertMod(data) {
  try {
    const result = await db.execute({
      sql: `INSERT OR IGNORE INTO mods (
        title, slug, game, game_genre, category, description,
        image_url, download_url, source_url, author, version, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      args: [
        data.title,
        data.slug,
        data.game,
        data.genre,
        data.category,
        data.description,
        data.imageUrl,
        data.downloadUrl,
        data.sourceUrl,
        data.author,
        data.version,
      ],
    });
    return result.rowsAffected > 0;
  } catch (e) {
    return false;
  }
}

async function processThunderstore(packages) {
  const confMap = {};
  for (const g of THUNDERSTORE_GAMES) confMap[g.community] = g;

  const counts = {};
  let totalInserted = 0;

  if (packages.length > 0) {
    // استخدام الـ experimental feed لو نجح
    for (const pkg of packages) {
      const community =
        pkg.community ||
        (pkg.package_url ? pkg.package_url.split("/c/")[1]?.split("/")[0] : null);
      if (!community || !confMap[community]) continue;

      const conf = confMap[community];
      counts[conf.game] = counts[conf.game] || 0;
      if (counts[conf.game] >= conf.limit) continue;

      const latest = pkg.latest || pkg.versions?.[0];
      if (!latest) continue;

      const title = (latest.name || pkg.name || "").replace(/_/g, " ").trim();
      if (!title) continue;

      const slug = `ts-${community}-${pkg.namespace}-${pkg.name}`
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);

      const inserted = await insertMod({
        title, slug, game: conf.game, genre: conf.genre,
        category: pkg.categories?.[0] || "Mods",
        description: latest.description || `${title} - مود مجتمعي للعبة ${conf.game}.`,
        imageUrl: latest.icon || null,
        downloadUrl: `/api/download/${slug}`,
        sourceUrl: pkg.package_url || null,
        author: pkg.namespace || "Creator",
        version: latest.version_number || "1.0.0",
      });

      if (inserted) { totalInserted++; counts[conf.game]++; }
    }
  } else {
    // Fallback: جلب كل مجتمع منفرداً
    console.log("⚠️ الـ Experimental feed فشل — سأجلب كل مجتمع بشكل منفرد...\n");
    for (const conf of THUNDERSTORE_GAMES) {
      console.log(`  🔄 جلب ${conf.game} (${conf.community})...`);
      const pkgs = await fetchThunderstoreCommunity(conf.community, conf.limit);
      counts[conf.game] = 0;

      for (const pkg of pkgs) {
        const latest = pkg.latest || pkg.versions?.[0];
        if (!latest) continue;

        const title = (latest.name || pkg.name || "").replace(/_/g, " ").trim();
        if (!title) continue;

        const slug = `ts-${conf.community}-${pkg.namespace || "mod"}-${pkg.name || title}`
          .toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);

        const inserted = await insertMod({
          title, slug, game: conf.game, genre: conf.genre,
          category: pkg.categories?.[0] || "Mods",
          description: latest.description || `${title} - مود للعبة ${conf.game}.`,
          imageUrl: latest.icon || null,
          downloadUrl: `/api/download/${slug}`,
          sourceUrl: pkg.package_url || null,
          author: pkg.namespace || "Creator",
          version: latest.version_number || "1.0.0",
        });

        if (inserted) { totalInserted++; counts[conf.game]++; }
      }
      console.log(`    ✅ ${counts[conf.game]} مود`);
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log("\n📊 مودات Thunderstore المضافة:");
  console.table(counts);
  return totalInserted;
}

async function processModrinth() {
  let totalInserted = 0;

  for (const conf of MODRINTH_LOADERS) {
    console.log(`\n🔄 جلب مودات Modrinth (${conf.loader})...`);
    let offset = 0;
    let inserted = 0;

    while (inserted < conf.limit) {
      try {
        const url = `https://api.modrinth.com/v2/search?facets=${encodeURIComponent(
          JSON.stringify([["project_type:mod"], [`categories:${conf.loader}`]])
        )}&limit=100&offset=${offset}&index=downloads`;

        const res = await fetch(url, {
          headers: { "User-Agent": "mode-platform/1.0 (mods.mode.com)" },
        });
        if (!res.ok) break;

        const data = await res.json();
        if (!data.hits?.length) break;

        for (const hit of data.hits) {
          if (inserted >= conf.limit) break;

          const slug = `mr-${conf.loader}-${hit.slug}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .slice(0, 80);

          const ok = await insertMod({
            title: hit.title || hit.slug,
            slug,
            game: conf.game,
            genre: conf.genre,
            category: hit.categories?.[0] || "Mods",
            description: hit.description || `${hit.title} - مود شهير لـ Minecraft`,
            imageUrl: hit.icon_url || null,
            downloadUrl: `/api/download/${slug}`,
            sourceUrl: `https://modrinth.com/mod/${hit.slug}`,
            author: hit.author || "Creator",
            version: hit.latest_version || "1.0.0",
          });

          if (ok) inserted++;
        }

        offset += 100;
        if (data.hits.length < 100) break;
        await new Promise((r) => setTimeout(r, 500)); // تأخير لتجنب rate limit
      } catch (e) {
        console.error("خطأ Modrinth:", e.message);
        break;
      }
    }

    totalInserted += inserted;
    console.log(`  ✅ ${inserted} مود (${conf.loader})`);
  }

  return totalInserted;
}

async function main() {
  console.log("🚀 بدء إضافة المودات الموسّعة...\n");

  // Thunderstore (experimental feed أو fallback per-community)
  const packages = await fetchThunderstoreFeed();
  // لو الـ feed رجع أقل من 100 حزمة = مش مكتمل، استخدم الـ fallback
  const tsInserted = await processThunderstore(packages.length >= 100 ? packages : []);

  // Modrinth — فقط لو الـ Thunderstore fallback شتغل (لتفادي التكرار)
  // غيّر إلى true لو تريد إضافة مودات Modrinth مجدداً
  const RUN_MODRINTH = false;
  const mrInserted = RUN_MODRINTH ? await processModrinth() : 0;
  if (!RUN_MODRINTH) console.log("\nℹ️ Modrinth: تم تخطيه (عدّل RUN_MODRINTH=true لإعادة التشغيل)");

  // إجمالي
  const total = await db.execute(
    "SELECT COUNT(*) as c FROM mods WHERE status = 'approved'"
  );
  console.log(`\n🎉 تم إضافة ${tsInserted + mrInserted} مود جديد!`);
  console.log(`📦 إجمالي المودات في المنصة: ${total.rows[0]?.c} مود`);
}

main().catch(console.error);
