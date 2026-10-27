import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// تعريف الألعاب الجديدة ومجتمعاتها
const NEW_GAMES = [
  { community: "riskofrain2", game: "Risk of Rain 2", genre: "Roguelike", limit: 120 },
  { community: "palworld", game: "Palworld", genre: "RPG", limit: 100 },
  { community: "titanfall2", game: "Titanfall 2", genre: "Action", limit: 80 },
  { community: "bonelab", game: "BONELAB", genre: "Action", limit: 80 },
  { community: "cities-skylines-ii", game: "Cities: Skylines II", genre: "Simulation", limit: 80 },
];

async function addGameMods() {
  console.log("⚡ جلب حزم الألعاب الجديدة من Thunderstore...");
  const res = await fetch("https://thunderstore.io/api/experimental/package/");
  if (!res.ok) {
    console.error("فشل الاتصال بـ Thunderstore:", res.status);
    return;
  }
  const packages = await res.json();
  console.log(`تم سحب ${packages.length} حزمة بنجاح! جارٍ تصفية الألعاب الجديدة...`);

  const confMap = {};
  for (const g of NEW_GAMES) confMap[g.community] = g;

  const counts = {};
  let totalInserted = 0;

  for (const pkg of packages) {
    const community = pkg.community || (pkg.package_url ? pkg.package_url.split("/c/")[1]?.split("/")[0] : null);
    if (!community || !confMap[community]) continue;

    const conf = confMap[community];
    counts[conf.game] = counts[conf.game] || 0;
    if (counts[conf.game] >= conf.limit) continue;

    const latest = pkg.latest || pkg.versions?.[0];
    if (!latest) continue;

    const title = (latest.name || pkg.name || "").replace(/_/g, " ");
    const slug = `ts-${community}-${pkg.namespace}-${pkg.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
    const category = pkg.categories?.[0] || "Mods";
    const desc = latest.description || `${title} - إضافة ومود مجتمعي رسمي ومشهور للعبة ${conf.game}.`;
    const iconUrl = latest.icon || null;
    const author = pkg.namespace || "Verified Creator";
    const dlUrl = `/api/download/${slug}`;

    try {
      const result = await db.execute({
        sql: `INSERT OR IGNORE INTO mods (
          title, slug, game, game_genre, category, description,
          image_url, download_url, author, version, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
        args: [
          title,
          slug,
          conf.game,
          conf.genre,
          category,
          desc,
          iconUrl,
          dlUrl,
          author,
          latest.version_number || "1.0.0",
        ],
      });
      if (result.rowsAffected > 0) {
        totalInserted++;
        counts[conf.game]++;
      }
    } catch (e) {
      // ignore
    }
  }

  console.log("\n📊 المودات المضافة للألعاب الجديدة:");
  console.table(counts);
  console.log(`\n✅ تم إدخال ${totalInserted} مود جديد بنجاح!`);

  const total = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`🎉 إجمالي المودات في المنصة الآن: ${total.rows[0]?.c} مود!`);
}

addGameMods().catch(console.error);
