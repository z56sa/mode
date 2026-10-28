import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const TARGET_GOAL = 205000;

const categoryMap = {
  optimization: "تحسين الأداء",
  utility: "أدوات",
  decoration: "الرسوميات",
  adventure: "الاستكشاف",
  storage: "إدارة المخزون",
  equipment: "إضافات المعدات",
  library: "مكتبات مطلوبة",
  mobs: "تحسين الكائنات",
  gameplay: "تحسينات اللعب",
  worldgen: "عوالم جديدة",
  magic: "سحر وقدرات",
  technology: "تقنية وآلات",
  food: "طعام وزراعة",
  audio: "صوتيات وموسيقى",
  cosmetics: "أزياء وتجميل",
  transportation: "مركبات ومواصلات",
  social: "أطوار جماعية"
};

function translateCategory(rawCats) {
  if (!rawCats || !rawCats.length) return "تحسينات اللعب";
  for (const c of rawCats) {
    const cl = String(c).toLowerCase();
    for (const [k, v] of Object.entries(categoryMap)) {
      if (cl.includes(k)) return v;
    }
  }
  return "إضافات متنوعة";
}

async function getCount() {
  const r = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  return Number(r.rows[0].c);
}

// 1. استيراد باقي مودات Thunderstore للألعاب الشعبية
async function ingestThunderstoreRemaining() {
  const games = [
    { id: "lethal-company", name: "Lethal Company", genre: "Horror" },
    { id: "valheim", name: "Valheim", genre: "Survival" },
    { id: "riskofrain2", name: "Risk of Rain 2", genre: "Roguelike" },
    { id: "h3vr", name: "H3VR", genre: "Action" },
    { id: "repo", name: "R.E.P.O.", genre: "Action" },
    { id: "boneworks", name: "BONEWORKS", genre: "Action" },
    { id: "ultrakill", name: "ULTRAKILL", genre: "Action" },
    { id: "rounds", name: "ROUNDS", genre: "Action" },
    { id: "gtfo", name: "GTFO", genre: "Horror" }
  ];

  for (const g of games) {
    try {
      console.log(`\nFetching ${g.name} mods from Thunderstore...`);
      const res = await fetch(`https://thunderstore.io/c/${g.id}/api/v1/package/`, {
        headers: { "User-Agent": "mode-platform/2.0" }
      });
      if (!res.ok) continue;
      const pkgs = await res.json();
      console.log(`Found ${pkgs.length} packages for ${g.name}. Processing...`);

      const batch = [];
      for (const p of pkgs) {
        if (p.is_deprecated) continue;
        const v = p.versions?.[0];
        if (!v) continue;

        const cleanName = (p.name || "").replace(/_/g, " ").trim();
        const slug = `ts-${g.id}-${p.owner || p.namespace}-${p.name}`.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 90);
        const cat = translateCategory(p.categories);
        const desc = v.description || `${cleanName} - مود وإضافة للعبة ${g.name}.`;
        const icon = v.icon || null;
        const author = p.owner || p.namespace || "Thunderstore Creator";
        const dlUrl = `/api/download/${slug}`;

        batch.push({
          sql: `INSERT OR IGNORE INTO mods (
            title, slug, game, game_genre, category, description,
            image_url, download_url, author, version, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
          args: [cleanName, slug, g.name, g.genre, cat, desc, icon, dlUrl, author, v.version_number || "1.0"]
        });

        if (batch.length >= 100) {
          await db.batch(batch.splice(0, batch.length), "write");
        }
      }

      if (batch.length > 0) {
        await db.batch(batch, "write");
      }

      const current = await getCount();
      console.log(`Current total mods: ${current}`);
      if (current >= TARGET_GOAL) return;
    } catch (e) {
      console.error(`Error processing ${g.name}:`, e.message);
    }
  }
}

// 2. استيراد مودات وحزم ألعاب ضخمة من Modrinth حتى تخطي 200,000 مود
async function ingestModrinthToTarget() {
  let offset = 44000;
  const limit = 100;

  console.log("\nStarting Modrinth streaming import to exceed 200,000 mods...");

  while (true) {
    const current = await getCount();
    console.log(`>>> Current Database Count: ${current} / Target: ${TARGET_GOAL} (Offset: ${offset}) <<<`);
    if (current >= TARGET_GOAL) break;

    try {
      const url = `https://api.modrinth.com/v2/search?limit=${limit}&offset=${offset}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "mode-arabic-gaming-platform/2.0 (contact@mode.games)" }
      });

      if (!res.ok) {
        console.warn(`Modrinth API returned ${res.status}. Waiting 2s...`);
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      const data = await res.json();
      if (!data.hits || data.hits.length === 0) {
        console.log("No more hits from Modrinth at offset:", offset);
        break;
      }

      const batch = [];
      for (const hit of data.hits) {
        const title = hit.title || hit.slug;
        const slug = `mr-${hit.slug || hit.project_id}`.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 90);
        const cat = translateCategory(hit.categories);
        const desc = hit.description || `${title} - حزمة وتعديل استثنائي متاح على منصة mode.`;
        const icon = hit.icon_url || null;
        const author = hit.author || "Modrinth Creator";
        const dlUrl = `/api/download/${slug}`;

        batch.push({
          sql: `INSERT OR IGNORE INTO mods (
            title, slug, game, game_genre, category, description,
            image_url, download_url, author, version, status
          ) VALUES (?, ?, 'Minecraft', 'Adventure', ?, ?, ?, ?, ?, 'Latest', 'approved')`,
          args: [title, slug, cat, desc, icon, dlUrl, author]
        });
      }

      if (batch.length > 0) {
        await db.batch(batch, "write");
      }

      offset += limit;
      // فاصل زمني بسيط لتجنب rate-limit Modrinth
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.error("Batch error:", e.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function run() {
  const startCount = await getCount();
  console.log(`Starting massive expansion. Current mods: ${startCount}`);

  await ingestThunderstoreRemaining();
  await ingestModrinthToTarget();

  const finalCount = await getCount();
  console.log(`\n🎉 Success! Reached final total of ${finalCount} mods in Turso!`);
}

run().catch(console.error);
