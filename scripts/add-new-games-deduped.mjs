import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const NEW_GAMES = [
  { id: "bopl-battle", game: "Bopl Battle", genre: "Action", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1686940/header.jpg" },
  { id: "voices-of-the-void", game: "Voices of the Void", genre: "Horror", fallbackCover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80" },
  { id: "across-the-obelisk", game: "Across the Obelisk", genre: "Roguelike", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1385380/header.jpg" },
  { id: "hard-bullet", game: "HARD BULLET", genre: "Action", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1294760/header.jpg" },
  { id: "20-minutes-till-dawn", game: "20 Minutes Till Dawn", genre: "Action", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1966900/header.jpg" },
  { id: "r5flowstate", game: "R5Reloaded", genre: "Action", fallbackCover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80" },
];

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
  weapons: "أسلحة ومعدات"
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

async function main() {
  console.log("=== Ingesting Brand New Games with Strict Deduplication ===");
  
  // 1. جلب قائمة كل المودات الحالية (العنوان واللعبة) لمنع أي تكرار نهائياً
  console.log("Fetching existing titles to ensure strict uniqueness...");
  const existingRes = await db.execute("SELECT LOWER(TRIM(title)) as t, game FROM mods");
  const existingSet = new Set(existingRes.rows.map(r => `${r.game}:::${r.t}`));
  console.log(`Loaded ${existingSet.size} unique existing keys from DB.`);

  let totalAdded = 0;

  for (const g of NEW_GAMES) {
    console.log(`\nFetching packages for: ${g.game} (${g.id})...`);
    try {
      const res = await fetch(`https://thunderstore.io/c/${g.id}/api/v1/package/`, {
        headers: { "User-Agent": "mode-platform/2.0" }
      });
      if (!res.ok) continue;
      const pkgs = await res.json();
      const valid = pkgs.filter(p => !p.is_deprecated && p.versions?.length > 0);
      console.log(`Found ${valid.length} valid mods for ${g.game}.`);

      const batch = [];
      for (const p of valid) {
        const v = p.versions[0];
        const rawTitle = (p.name || "").replace(/_/g, " ").trim();
        const key = `${g.game}:::${rawTitle.toLowerCase()}`;

        // تخطي أي تكرار
        if (existingSet.has(key)) continue;
        existingSet.add(key);

        const slug = `ts-${g.id}-${p.owner || p.namespace}-${p.name}`.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 90);
        const cat = translateCategory(p.categories);
        const desc = v.description || `${rawTitle} - مود رسمي للعبة ${g.game}.`;
        const icon = v.icon || g.fallbackCover;
        const author = p.owner || p.namespace || "Thunderstore Creator";
        const dlUrl = `/api/download/${slug}`;

        batch.push({
          sql: `INSERT OR IGNORE INTO mods (
            title, slug, game, game_genre, category, description,
            image_url, download_url, author, version, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
          args: [rawTitle, slug, g.game, g.genre, cat, desc, icon, dlUrl, author, v.version_number || "1.0"]
        });

        if (batch.length >= 50) {
          await db.batch(batch.splice(0, batch.length), "write");
        }
      }

      if (batch.length > 0) {
        await db.batch(batch, "write");
      }

      console.log(`Successfully imported mods for ${g.game}.`);
      totalAdded += batch.length;
    } catch (e) {
      console.error(`Error processing ${g.game}:`, e.message);
    }
  }

  const finalRes = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`\n🎉 Done! New total approved mods in Turso: ${finalRes.rows[0].c}`);
}

main().catch(console.error);
