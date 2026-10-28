import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const MUST_HAVE_MODS = [
  // ==========================================
  // 1. ELDEN RING
  // ==========================================
  {
    title: "Seamless Co-op (True Multiplayer Campaign)",
    slug: "er-seamless-coop-campaign",
    game: "Elden Ring",
    genre: "RPG",
    category: "أطوار جماعية",
    description: "أشهر مود في تاريخ إلدن رينغ؛ يسمح لك بإنهاء اللعبة كاملة مع أصدقائك من البداية للنهاية دون قيود الاستدعاء، مع مشاركة تقدم القصة وركوب الخيل معاً.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    downloadUrl: "https://github.com/LukeYui/EldenRingSeamlessCoopRelease/releases/download/v1.8.2/SeamlessCoop.zip",
    author: "LukeYui",
    version: "1.8.2"
  },
  {
    title: "Elden Ring Reforged (Comprehensive Overhaul)",
    slug: "er-reforged-overhaul",
    game: "Elden Ring",
    genre: "RPG",
    category: "تحسينات اللعب",
    description: "تعديل ضخم لإعادة موازنة اللعبة؛ نظام صد وتفادي جديد (Deflect)، آليات كاميرا محسنة للزعماء، وإعادة بناء شجرة السحر وتصنيع الموارد.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    downloadUrl: "https://github.com/ERR-Dev-Team/EldenRingReforged/releases/download/v1.0.0/EldenRingReforged.zip",
    author: "ERR Team",
    version: "v1.0.0"
  },
  {
    title: "Item and Enemy Randomizer (Endless Replayability)",
    slug: "er-item-enemy-randomizer",
    game: "Elden Ring",
    genre: "RPG",
    category: "تحسينات اللعب",
    description: "عشوائية مطلقة تجعل كل تختيمة فريدة: تغيير أماكن الزعماء، الأسلحة، والعتاد في كل زاوية من خريطة الأراضي الوسطى.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    downloadUrl: "https://github.com/thefifthmatt/EldenRingRandomizer/releases/download/v0.10.4/EldenRingRandomizer.zip",
    author: "thefifthmatt",
    version: "v0.10.4"
  },
  {
    title: "Clever's Moveset Modpack (Custom Martial Arts)",
    slug: "er-clevers-moveset-pack",
    game: "Elden Ring",
    genre: "RPG",
    category: "أسلحة ومعدات",
    description: "حركات قتالية أنمي وسينمائية استثنائية تشمل حركات مقاتلي الدم وأسلحة سحرية وحركات ملاكمة سريعة تعيد إحياء متعة القتال.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    downloadUrl: "https://github.com/CleverModding/CleversMovesets/releases/download/v2.1/CleversMovesetPack.zip",
    author: "Clever",
    version: "v2.1"
  },

  // ==========================================
  // 2. BALDUR'S GATE 3
  // ==========================================
  {
    title: "Party Limit Begone (Play with 16 Companions)",
    slug: "bg3-party-limit-begone",
    game: "Baldur's Gate 3",
    genre: "RPG",
    category: "أطوار جماعية",
    description: "إلغاء حد أعضاء الفريق؛ خض المغامرة مع جميع شخصيات القصة ورفاقك في آن واحد (حتى 16 رفيقاً و8 لاعبين باللعب الجماعي).",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    downloadUrl: "https://github.com/Sildur/PartyLimitBegone/releases/download/v2.3/PartyLimitBegone.zip",
    author: "Sildur",
    version: "v2.3"
  },
  {
    title: "5e Spells (Complete D&D 5th Edition Library)",
    slug: "bg3-5e-spells-expansion",
    game: "Baldur's Gate 3",
    genre: "RPG",
    category: "سحر وقدرات",
    description: "إضافة مئات التعاويذ والقدرات الرسمية من كتاب قواعد D&D 5e من المستوى الأول وحتى التاسع لجميع كلاسات السحرة والبالادين.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    downloadUrl: "https://github.com/Cerdio/5eSpells/releases/download/v1.1.8/5eSpells.zip",
    author: "Cerdio",
    version: "v1.1.8"
  },
  {
    title: "Native Camera Tweaks & WASD Character Movement",
    slug: "bg3-wasd-camera-movement",
    game: "Baldur's Gate 3",
    genre: "RPG",
    category: "أدوات",
    description: "تحويل تجربة التحكم إلى منظور الشخص الثالث الحر كألعاب RPG الحديثة؛ حرّك شخصيتك بأزرار WASD والتحكم الكامل بزوايا الكاميرا.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    downloadUrl: "https://github.com/Ch4nKyy/BG3WASD/releases/download/v1.3.4/BG3WASD.zip",
    author: "Ch4nKyy",
    version: "v1.3.4"
  },
  {
    title: "Bags Bags Bags (Automated Inventory Organization)",
    slug: "bg3-bags-inventory-manager",
    game: "Baldur's Gate 3",
    genre: "RPG",
    category: "إدارة المخزون",
    description: "حل مشكلة المخزون نهائياً؛ حقائب تلقائية ذكية لفرز الجرعات، كتب السحر، الأسهم، والأحجار الكريمة بمجرد التقاطها.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    downloadUrl: "https://github.com/LarianModders/BagsBagsBags/releases/download/v2.0/BagsBagsBags.zip",
    author: "LarianCommunity",
    version: "v2.0"
  },

  // ==========================================
  // 3. CYBERPUNK 2077
  // ==========================================
  {
    title: "Let There Be Flight (Flying Flying Cars Over Night City)",
    slug: "cp2077-let-there-be-flight",
    game: "Cyberpunk 2077",
    genre: "RPG",
    category: "مركبات ومواصلات",
    description: "المود الحلم لنايت سيتي؛ يحول جميع سيارات ودراجات سايبربانك إلى مركبات طائرة مع مؤثرات صوتية ودفع نفاث واقعي.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    downloadUrl: "https://github.com/jackhumbert/let_there_be_flight/releases/download/v0.1.7/let_there_be_flight.zip",
    author: "jackhumbert",
    version: "v0.1.7"
  },
  {
    title: "Cyber Engine Tweaks (CET Essential Modding Framework)",
    slug: "cp2077-cyber-engine-tweaks",
    game: "Cyberpunk 2077",
    genre: "RPG",
    category: "مكتبات مطلوبة",
    description: "الأداة الأساسية والمكتبة المركزية لتشغيل مودات سايبربانك 2077؛ تضيف قائمة تحكم برمجية وحل لمشاكل الأداء والذاكرة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    downloadUrl: "https://github.com/maxime由来/CyberEngineTweaks/releases/download/v1.32.0/CyberEngineTweaks.zip",
    author: "yamashi",
    version: "v1.32.0"
  },
  {
    title: "Night City Alive (Gang Wars & Ambient Shootouts)",
    slug: "cp2077-night-city-alive",
    game: "Cyberpunk 2077",
    genre: "RPG",
    category: "تحسينات اللعب",
    description: "يجعل مدينة نايت سيتي تنبض بالحياة الحقيقية: حروب عصابات مفاجئة في الشوارع، مطاردات شرطة، وردود فعل واقعية للمارة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    downloadUrl: "https://github.com/CP2077Mods/NightCityAlive/releases/download/v1.4/NightCityAlive.zip",
    author: "Sosseres",
    version: "v1.4"
  },

  // ==========================================
  // 4. RED DEAD REDEMPTION 2
  // ==========================================
  {
    title: "Rampage Trainer (Ultimate Freeplay & Cheats Suite)",
    slug: "rdr2-rampage-trainer",
    game: "Red Dead Redemption 2",
    genre: "Action",
    category: "أدوات",
    description: "أقوى ترينر وقائمة تحكم لـ RDR2؛ استدعاء أي حصان أو مركبة، تغيير الطقس والوقت، حماية لا نهائية، واختيار أزياء وتعديل الشخصيات.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
    downloadUrl: "https://github.com/RampageDev/RampageTrainer/releases/download/v1.6.4/RampageTrainer.zip",
    author: "Rampage Dev",
    version: "v1.6.4"
  },
  {
    title: "WhyEm's DLC (Massive Western Wardrobe & Outfits)",
    slug: "rdr2-whyems-dlc",
    game: "Red Dead Redemption 2",
    genre: "Action",
    category: "أزياء وتجميل",
    description: "أضخم حزمة أزياء وتخصيص لآرثر مورغان؛ تضيف مئات القبعات والمعاطف، لحى وتسريحات شعر جديدة، وأغماد مسدسات جلدية فاخرة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
    downloadUrl: "https://github.com/WhyEm/RDR2DLC/releases/download/v1.0.8/WhyEmsDLC.zip",
    author: "WhyEm",
    version: "v1.0.8"
  },
  {
    title: "Ped Damage Overhaul (Realistic Gunshot Reactions)",
    slug: "rdr2-ped-damage-overhaul",
    game: "Red Dead Redemption 2",
    genre: "Action",
    category: "تحسينات اللعب",
    description: "فيزياء إصابات واقعية بالرصاص؛ يتعثر الأعداء عند إصابتهم في الأرجل، يسقطون أسلحتهم عند إصابة الأيدي، وتأثيرات دماء واقعية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
    downloadUrl: "https://github.com/HJDev/PedDamageOverhaul/releases/download/v1.3/PedDamageOverhaul.zip",
    author: "HughJanus",
    version: "v1.3"
  },

  // ==========================================
  // 5. THE WITCHER 3: WILD HUNT
  // ==========================================
  {
    title: "The Witcher 3 Enhanced Edition Redux (Hardcore Combat)",
    slug: "tw3-enhanced-edition-redux",
    game: "The Witcher 3: Wild Hunt",
    genre: "RPG",
    category: "تحسينات اللعب",
    description: "إعادة بناء شاملة لمنظومة قتال جيرالت؛ إلغاء قيود اللفلات، اعتماد التوقيت والمهارة في صد الضربات، ونظام تسمم ومشروبات كيميائية متقدم.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg",
    downloadUrl: "https://github.com/Kolaris/W3EERedux/releases/download/v1.4/W3EERedux.zip",
    author: "Kolaris",
    version: "v1.4"
  },
  {
    title: "Fast Travel from Anywhere",
    slug: "tw3-fast-travel-anywhere",
    game: "The Witcher 3: Wild Hunt",
    genre: "RPG",
    category: "أدوات",
    description: "إمكانية السفر السريع الفوري من أي مكان في الخريطة دون الحاجة للركض الطويل إلى أعمدة وعلامات السفر الخشبية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg",
    downloadUrl: "https://github.com/Witcher3Mods/FastTravelAnywhere/releases/download/v2.1/FastTravelAnywhere.zip",
    author: "JupiterTheGod",
    version: "v2.1"
  },

  // ==========================================
  // 6. SEKIRO: SHADOWS DIE TWICE
  // ==========================================
  {
    title: "Sekiro Resurrection (Boss & Enemy Combat Overhaul)",
    slug: "sekiro-resurrection-overhaul",
    game: "Sekiro: Shadows Die Twice",
    genre: "Action",
    category: "تحسينات اللعب",
    description: "المود الأكثر شهرة لسيكيرو؛ يعيد تصميم هجمات جميع الزعماء والجنود بحركات هجومية جديدة وسريعة تمنحك تحدياً ملحمياً ممتعاً.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg",
    downloadUrl: "https://github.com/IshinDev/SekiroResurrection/releases/download/v1.15/SekiroResurrection.zip",
    author: "IshinDev",
    version: "v1.15"
  },
  {
    title: "Sekiro Mod Engine (Safe DLL Mod Loader)",
    slug: "sekiro-mod-engine-framework",
    game: "Sekiro: Shadows Die Twice",
    genre: "Action",
    category: "مكتبات مطلوبة",
    description: "المحرك الأساسي لتشغيل أزياء وأسلحة وتعديلات سيكيرو بدون تعديل ملفات اللعبة الأصلية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg",
    downloadUrl: "https://github.com/soulsmods/SekiroModEngine/releases/download/v1.11/SekiroModEngine.zip",
    author: "soulsmods",
    version: "v1.11"
  },

  // ==========================================
  // 7. HOLLOW KNIGHT
  // ==========================================
  {
    title: "Scarab Mod Manager (Complete HK Mod Suite)",
    slug: "hk-scarab-mod-manager",
    game: "Hollow Knight",
    genre: "Metroidvania",
    category: "أدوات",
    description: "المثبت الرسمي لمودات هولو نايت؛ يتيح لك تثبيت مودات الأطوار الجماعية، العشوائية، وإضافة أزياء ورؤساء جدد بنقرة واحدة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg",
    downloadUrl: "https://github.com/fifty-six/Scarab/releases/download/v2.1.0/Scarab.zip",
    author: "fifty-six",
    version: "v2.1.0"
  },
  {
    title: "Hollow Knight Multiplayer (Co-op & PvP)",
    slug: "hk-multiplayer-coop",
    game: "Hollow Knight",
    genre: "Metroidvania",
    category: "أطوار جماعية",
    description: "العب هولو نايت مع أصدقائك في عالم هولونيست؛ استكشفوا الخريطة معاً، قاتلوا الزعماء كفريق، أو تنافسوا في حلبات مبارزة لاعب ضد لاعب.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg",
    downloadUrl: "https://github.com/Flibber-hk/HollowKnight.Multiplayer/releases/download/v1.0.5/HKMultiplayer.zip",
    author: "Flibber",
    version: "v1.0.5"
  }
];

async function main() {
  console.log("=== Ingesting Curated Top-Demanded AAA Mods ===");

  const targetGames = [...new Set(MUST_HAVE_MODS.map(m => m.game))];
  const placeholders = targetGames.map(() => "?").join(",");
  const existingRes = await db.execute({
    sql: `SELECT LOWER(TRIM(title)) as t, game FROM mods WHERE game IN (${placeholders})`,
    args: targetGames
  });
  const existingSet = new Set(existingRes.rows.map(r => `${r.game}:::${r.t}`));

  let addedCount = 0;
  for (const m of MUST_HAVE_MODS) {
    const key = `${m.game}:::${m.title.toLowerCase().trim()}`;
    if (existingSet.has(key)) {
      console.log(`Skipped existing: ${m.title}`);
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
    console.log(`+ Added [${m.game}]: ${m.title}`);
    addedCount++;
  }

  const finalRes = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`\n🎉 Finished! Added ${addedCount} top-tier mods. Total in Turso: ${finalRes.rows[0].c}`);
}

main().catch(console.error);
