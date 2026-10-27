import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const USER_AGENT = "mode-platform/1.0 (contact@mode.games)";

// قائمة الألعاب المدعومة مع تصنيفاتها الحقيقية
const THUNDERSTORE_COMMUNITIES = [
  { community: "lethal-company", game: "Lethal Company", genre: "Horror", limit: 120 },
  { community: "valheim", game: "Valheim", genre: "Survival", limit: 100 },
  { community: "ultrakill", game: "ULTRAKILL", genre: "Action", limit: 60 },
  { community: "content-warning", game: "Content Warning", genre: "Horror", limit: 60 },
  { community: "rounds", game: "ROUNDS", genre: "Action", limit: 50 },
  { community: "repo", game: "R.E.P.O.", genre: "Action", limit: 50 },
  { community: "subnautica", game: "Subnautica", genre: "Survival", limit: 50 },
  { community: "gtfo", game: "GTFO", genre: "Horror", limit: 50 },
  { community: "riskofrain2", game: "Risk of Rain 2", genre: "Roguelike", limit: 80 },
  { community: "blade-and-sorcery", game: "Blade and Sorcery", genre: "Action", limit: 60 },
  { community: "cities-skylines-ii", game: "Cities: Skylines II", genre: "Simulation", limit: 50 },
  { community: "palworld", game: "Palworld", genre: "RPG", limit: 60 },
];

async function insertMod(mod) {
  try {
    await db.execute({
      sql: `INSERT OR IGNORE INTO mods (
        title, slug, game, game_genre, category, description,
        image_url, download_url, author, version, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      args: [
        mod.title,
        mod.slug,
        mod.game,
        mod.gameGenre,
        mod.category,
        mod.description,
        mod.imageUrl,
        mod.downloadUrl,
        mod.author,
        mod.version || "1.0.0",
      ],
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function ingestModrinthTopMods() {
  console.log("\n📦 [1/2] جلب أشهر وأقوى مودات Minecraft الحقيقية من Modrinth...");
  let totalMr = 0;
  
  // سحب مودات ماينكرافت الأكثر تحميلاً في العالم (مثل Sodium, Iris Shaders, Fabric API, Lithium, إلخ)
  for (let offset = 0; offset <= 300; offset += 100) {
    try {
      const url = `https://api.modrinth.com/v2/search?limit=100&offset=${offset}&index=downloads`;
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) continue;
      const data = await res.json();
      
      for (const hit of (data.hits || [])) {
        const title = hit.title?.trim();
        const slug = `mr-${hit.slug || hit.project_id}`.slice(0, 80);
        const category = hit.categories?.[0] || "Gameplay";
        const desc = hit.description || `${title} - من أشهر مودات ماينكرافت وأكثرها تحميلاً وتقييماً عالمياً.`;
        const iconUrl = hit.icon_url || hit.gallery?.[0] || null;
        const author = hit.author || "Minecraft Modder";
        const dlUrl = `/api/download/${slug}`;

        const ok = await insertMod({
          title,
          slug,
          game: "Minecraft",
          gameGenre: "Sandbox",
          category,
          description: desc,
          imageUrl: iconUrl,
          downloadUrl: dlUrl,
          author,
          version: "أحدث إصدار",
        });
        if (ok) totalMr++;
      }
    } catch (err) {
      console.warn("Modrinth page error:", err.message);
    }
  }
  console.log(`✅ تم إدخال ${totalMr} مود مشهور لماينكرافت!`);
}

async function ingestThunderstoreTopMods() {
  console.log("\n🎮 [2/2] جلب أشهر المودات الحقيقية لألعاب متعددة من Thunderstore...");
  let totalTs = 0;

  for (const item of THUNDERSTORE_COMMUNITIES) {
    try {
      console.log(`⏳ جلب مودات ${item.game}...`);
      const res = await fetch(`https://thunderstore.io/c/${item.community}/api/v1/package/`);
      if (!res.ok) {
        console.warn(`تعذر جلب ${item.community}: ${res.status}`);
        continue;
      }
      const packages = await res.json();
      let countForGame = 0;

      // فرز بالمودات الأكثر تنزيلاً وشهرة
      const sorted = packages.sort((a, b) => (b.metrics?.downloads || 0) - (a.metrics?.downloads || 0));

      for (const pkg of sorted.slice(0, item.limit)) {
        const latest = pkg.latest;
        if (!latest) continue;

        const title = (latest.name || pkg.name || "").replace(/_/g, " ");
        const slug = `ts-${item.community}-${pkg.namespace}-${pkg.name}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 80);
        const category = pkg.categories?.[0] || "Mods";
        const desc = latest.description || `${title} - إضافة مجتمعية مشهورة وموثوقة للعبة ${item.game}.`;
        const iconUrl = latest.icon || null;
        const author = pkg.namespace || "Verified Modder";
        const dlUrl = `/api/download/${slug}`;

        const ok = await insertMod({
          title,
          slug,
          game: item.game,
          gameGenre: item.genre,
          category,
          description: desc,
          imageUrl: iconUrl,
          downloadUrl: dlUrl,
          author,
          version: latest.version_number || "1.0.0",
        });
        if (ok) {
          totalTs++;
          countForGame++;
        }
      }
      console.log(`  ✓ أُضيف ${countForGame} مود لـ ${item.game}`);
    } catch (e) {
      console.warn(`خطأ في ${item.game}:`, e.message);
    }
  }
  console.log(`✅ إجمالي المودات المضافة من Thunderstore: ${totalTs}`);
}

async function run() {
  console.log("🚀 بدء توسيع المكتبة بالمودات العالمية المشهورة والحقيقية 100%...\n");
  await ingestModrinthTopMods();
  await ingestThunderstoreTopMods();

  const count = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`\n🎉 اكتمل التوسيع بنجاح! إجمالي المودات الحقيقية في الموقع الآن: ${count.rows[0]?.c} مود!`);
}

run().catch(console.error);
