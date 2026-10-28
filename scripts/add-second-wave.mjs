import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const THUNDERSTORE_GAMES = [
  { id: "ravenfield", game: "Ravenfield", genre: "Action", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/636480/header.jpg" },
  { id: "among-us", game: "Among Us", genre: "Action", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/945360/header.jpg" },
  { id: "backpack-hero", game: "Backpack Hero", genre: "Roguelike", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1970580/header.jpg" },
  { id: "dice-kingdoms", game: "Dice Kingdoms", genre: "Strategy", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2026850/header.jpg" },
  { id: "trash-day", game: "Trash Day", genre: "Action", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/380530/header.jpg" },
  { id: "crawl", game: "Crawl", genre: "Action", fallbackCover: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/293780/header.jpg" }
];

const CURATED_FAMOUS_MODS = [
  // Terraria
  {
    title: "tModLoader (Official Modding Framework)",
    slug: "terraria-tmodloader",
    game: "Terraria",
    genre: "Sandbox",
    category: "مكتبات مطلوبة",
    description: "أداة ومحرك تشغيل وإدارة المودات الرسمي والأساسي للعبة تيراريا لتثبيت وإطلاق المودات بأمان وسلاسة فائقة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1281930/header.jpg",
    downloadUrl: "https://github.com/tModLoader/tModLoader/releases/download/v2024.11.3.0/tModLoader.zip",
    author: "tModLoader Team",
    version: "2024.11.3.0"
  },
  {
    title: "Terraria Overhaul (Physics & Seasons Overhaul)",
    slug: "terraria-overhaul",
    game: "Terraria",
    genre: "Sandbox",
    category: "تحسينات اللعب",
    description: "تعديل شامل يعيد تشكيل تيراريا بالكامل بإضافة فيزياء حركة ديناميكية، قتال متطور، وفصول سنوية ومؤثرات صوتية وواقعية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg",
    downloadUrl: "https://github.com/Mirsario/TerrariaOverhaul/releases/download/v5.0.0/TerrariaOverhaul.zip",
    author: "Mirsario",
    version: "v5.0.0"
  },
  {
    title: "Magic Storage (Infinite Storage Network)",
    slug: "terraria-magic-storage",
    game: "Terraria",
    genre: "Sandbox",
    category: "إدارة المخزون",
    description: "الحل الأسطوري لتنظيم المخزون في تيراريا؛ شبكة تخزين سحرية متصلة لدمج وترتيب وتصنيع كافة الأغراض من واجهة مركزية واحدة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg",
    downloadUrl: "https://github.com/blushiemagic/MagicStorage/releases/download/v0.6.0.3/MagicStorage.zip",
    author: "blushiemagic",
    version: "v0.6.0.3"
  },
  {
    title: "Calamity Mod (Epic Bosses & Music)",
    slug: "terraria-calamity-mod",
    game: "Terraria",
    genre: "Sandbox",
    category: "عوالم جديدة",
    description: "أشهر وأضخم مود في تاريخ تيرارia؛ يضيف عشرات الزعماء الخارقين، مئات الأسلحة النادرة، ألحان ملحمية، ونظام صعوبة متقدم.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg",
    downloadUrl: "https://github.com/CalamityModTeam/CalamityMod/releases/download/v2.0.4/CalamityMod.zip",
    author: "Fabsol & Calamity Team",
    version: "v2.0.4"
  },
  // Project Zomboid
  {
    title: "Brita's Weapon Pack (Ultimate Arsenal)",
    slug: "pz-britas-weapon-pack",
    game: "Project Zomboid",
    genre: "Survival",
    category: "أسلحة ومعدات",
    description: "أشهر حزمة أسلحة لزومبويد؛ تضيف مئات الأسلحة النارية والبيضاء الواقعية مع ملحقاتها من مناظير وكواتم صوت وتعديلات قتالية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/header.jpg",
    downloadUrl: "https://github.com/Arsenal26/BritasWeaponPack/releases/download/v2.0/BritasWeaponPack.zip",
    author: "Brita & Arsenal[26]",
    version: "v2.0"
  },
  {
    title: "Common Sense (Realistic Survival Actions)",
    slug: "pz-common-sense",
    game: "Project Zomboid",
    genre: "Survival",
    category: "تحسينات اللعب",
    description: "يمنحك بديهيات البقاء الواقعية: فتح الأبواب والسيارات بالعتلة، نزع الأقمشة من الملابس، واستخدام الأدوات المنطقية بسلاسة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/header.jpg",
    downloadUrl: "https://github.com/Braven/CommonSense/releases/download/v1.2.1/CommonSense.zip",
    author: "Braven",
    version: "v1.2.1"
  },
  {
    title: "Filibuster Rhymes' Used Cars",
    slug: "pz-filibuster-used-cars",
    game: "Project Zomboid",
    genre: "Survival",
    category: "مركبات ومواصلات",
    description: "حزمة سيارات وشاحنات التسعينات الكلاسيكية المتوافقة مع أجواء كنتاكي؛ تضيف شاحنات عسكرية، سيارات شرطة، وسيارات عائلية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/108600/header.jpg",
    downloadUrl: "https://github.com/FilibusterRhymes/UsedCars/releases/download/v1.4/UsedCars.zip",
    author: "Filibuster Rhymes",
    version: "v1.4"
  },
  // RimWorld
  {
    title: "Combat Extended (Realistic Tactical Ballistics)",
    slug: "rimworld-combat-extended",
    game: "RimWorld",
    genre: "Simulation",
    category: "تحسينات اللعب",
    description: "تعديل شامل لمنظومة القتال في ريم وورلد؛ ذخيرة حقيقية، اختراق للدروع، نزيف وجروح واقعية، وتكتيكات إطلاق متقدمة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/header.jpg",
    downloadUrl: "https://github.com/CombatExtended-Continued/CombatExtended/releases/download/v1.5/CombatExtended.zip",
    author: "Combat Extended Team",
    version: "v1.5"
  },
  {
    title: "Hospitality (Visitor & Hotel Colony System)",
    slug: "rimworld-hospitality",
    game: "RimWorld",
    genre: "Simulation",
    category: "تحسينات اللعب",
    description: "يحول مستعمرتك إلى فندق ووجهة سياحية تستقبل الزوار والضيوف من الفصائل الأخرى، تجنيد الموهوبين وبيع الموارد لهم.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/header.jpg",
    downloadUrl: "https://github.com/OrionHiddenHand/Hospitality/releases/download/v1.5.1/Hospitality.zip",
    author: "Orion",
    version: "v1.5.1"
  },
  {
    title: "Save Our Ship 2 (Starship & Space Overhaul)",
    slug: "rimworld-save-our-ship-2",
    game: "RimWorld",
    genre: "Simulation",
    category: "عوالم جديدة",
    description: "الانتقال إلى مرحلة الفضاء؛ ابنِ سفينتك الفضائية بنفسك، خض معارك السفن في المدار، وسافر بين الكواكب والمحطات المدارية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/294100/header.jpg",
    downloadUrl: "https://github.com/SonicTHI/SaveOurShip2/releases/download/v2.6/SaveOurShip2.zip",
    author: "Kentington & Thain",
    version: "v2.6"
  }
];

async function main() {
  console.log("=== Ingesting Next Wave of Games and Mods with Zero Duplicates ===");
  
  // 1. تحميل كافة السجلات الموجودة مسبقاً لمنع أي تكرار
  const existingRes = await db.execute("SELECT LOWER(TRIM(title)) as t, game FROM mods");
  const existingSet = new Set(existingRes.rows.map(r => `${r.game}:::${r.t}`));
  console.log(`Loaded ${existingSet.size} unique keys from Turso.`);

  // 2. إدخال مودات الألعاب الشهيرة المختارة (Terraria, Project Zomboid, RimWorld)
  console.log("\nInserting Curated Famous Games Mods...");
  for (const m of CURATED_FAMOUS_MODS) {
    const key = `${m.game}:::${m.title.toLowerCase().trim()}`;
    if (existingSet.has(key)) {
      console.log(`Skipped duplicate: ${m.title}`);
      continue;
    }
    existingSet.add(key);

    await db.execute({
      sql: `INSERT OR IGNORE INTO mods (
        title, slug, game, game_genre, category, description,
        image_url, download_url, author, version, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      args: [m.title, m.slug, m.game, m.genre, m.category, m.description, m.imageUrl, m.downloadUrl, m.author, m.version]
    });
    console.log(`+ Added: ${m.title} (${m.game})`);
  }

  // 3. إدخال الألعاب الإضافية من Thunderstore
  for (const g of THUNDERSTORE_GAMES) {
    console.log(`\nFetching packages for: ${g.game}...`);
    try {
      const res = await fetch(`https://thunderstore.io/c/${g.id}/api/v1/package/`, {
        headers: { "User-Agent": "mode-platform/2.0" }
      });
      if (!res.ok) continue;
      const pkgs = await res.json();
      const valid = pkgs.filter(p => !p.is_deprecated && p.versions?.length > 0);
      console.log(`Found ${valid.length} mods for ${g.game}.`);

      const batch = [];
      for (const p of valid) {
        const v = p.versions[0];
        const rawTitle = (p.name || "").replace(/_/g, " ").trim();
        const key = `${g.game}:::${rawTitle.toLowerCase()}`;

        if (existingSet.has(key)) continue;
        existingSet.add(key);

        const slug = `ts-${g.id}-${p.owner || p.namespace}-${p.name}`.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 90);
        const desc = v.description || `${rawTitle} - مود رسمي للعبة ${g.game}.`;
        const icon = v.icon || g.fallbackCover;
        const author = p.owner || p.namespace || "Thunderstore Creator";
        const dlUrl = `/api/download/${slug}`;

        batch.push({
          sql: `INSERT OR IGNORE INTO mods (
            title, slug, game, game_genre, category, description,
            image_url, download_url, author, version, status
          ) VALUES (?, ?, ?, ?, 'تحسينات اللعب', ?, ?, ?, ?, ?, 'approved')`,
          args: [rawTitle, slug, g.game, g.genre, desc, icon, dlUrl, author, v.version_number || "1.0"]
        });

        if (batch.length >= 50) {
          await db.batch(batch.splice(0, batch.length), "write");
        }
      }

      if (batch.length > 0) {
        await db.batch(batch, "write");
      }
      console.log(`Successfully finished ${g.game}.`);
    } catch (e) {
      console.error(`Error processing ${g.game}:`, e.message);
    }
  }

  const finalTotal = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`\n🎉 All done! Current approved mods in Turso: ${finalTotal.rows[0].c}`);
}

main().catch(console.error);
