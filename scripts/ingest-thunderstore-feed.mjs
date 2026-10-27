import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  console.log("Downloading Thunderstore packages feed...");
  const res = await fetch("https://thunderstore.io/api/experimental/package/");
  if (!res.ok) {
    console.error("Failed to fetch Thunderstore:", res.status);
    return;
  }
  const packages = await res.json();
  console.log(`Fetched ${packages.length} total packages from Thunderstore!`);

  // فلترة الألعاب وتحديد المودات الأكثر تحميلاً
  const targetCommunities = {
    "lethal-company": { game: "Lethal Company", genre: "Horror", limit: 120 },
    "valheim": { game: "Valheim", genre: "Survival", limit: 100 },
    "riskofrain2": { game: "Risk of Rain 2", genre: "Roguelike", limit: 100 },
    "ultrakill": { game: "ULTRAKILL", genre: "Action", limit: 80 },
    "content-warning": { game: "Content Warning", genre: "Horror", limit: 60 },
    "rounds": { game: "ROUNDS", genre: "Action", limit: 60 },
    "repo": { game: "R.E.P.O.", genre: "Action", limit: 60 },
    "subnautica": { game: "Subnautica", genre: "Survival", limit: 60 },
    "gtfo": { game: "GTFO", genre: "Horror", limit: 60 },
    "cities-skylines-ii": { game: "Cities: Skylines II", genre: "Simulation", limit: 60 },
  };

  let totalAdded = 0;
  const gameCounts = {};

  for (const pkg of packages) {
    const community = pkg.community || (pkg.package_url ? pkg.package_url.split("/c/")[1]?.split("/")[0] : null);
    if (!community || !targetCommunities[community]) continue;

    const conf = targetCommunities[community];
    gameCounts[conf.game] = (gameCounts[conf.game] || 0);
    if (gameCounts[conf.game] >= conf.limit) continue;

    const latest = pkg.latest || pkg.versions?.[0];
    if (!latest) continue;

    const title = (latest.name || pkg.name || "").replace(/_/g, " ");
    const slug = `ts-${community}-${pkg.namespace}-${pkg.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
    const category = pkg.categories?.[0] || "Mods";
    const desc = latest.description || `${title} - مود رسمي ومشهور للعبة ${conf.game}.`;
    const iconUrl = latest.icon || pkg.icon_url || null;
    const author = pkg.namespace || "Thunderstore Creator";
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
        totalAdded++;
        gameCounts[conf.game]++;
      }
    } catch (e) {
      // ignore
    }
  }

  console.log("\nResults per game:", gameCounts);
  console.log(`\n✅ Added ${totalAdded} fresh popular mods from Thunderstore!`);
  
  const count = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`🎉 Total authentic mods now in database: ${count.rows[0]?.c}`);
}

run().catch(console.error);
