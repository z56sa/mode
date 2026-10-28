import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const WAVE_1_MODS = [
  // ==========================================
  // 1. DARK SOULS III
  // ==========================================
  {
    title: "The Convergence (Massive Magic & Overhaul Mod)",
    slug: "ds3-the-convergence",
    game: "Dark Souls III",
    genre: "RPG",
    category: "عوالم جديدة",
    description: "أشهر وأضخم تعديل لدارك سولز 3؛ يضيف مئات التعاويذ الجديدة، أسلحة وفئات سحرية كالنكرومانسي، زعماء معدلين بالكامل، وخريطة متصلة بمسارات جديدة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg",
    downloadUrl: "https://github.com/Convergence-Team/ConvergenceDS3/releases/download/v3.0.1/TheConvergence.zip",
    author: "Cinders & Convergence Team",
    version: "v3.0.1"
  },
  {
    title: "Cinders Mod (Complete Rebalance & Mechanics)",
    slug: "ds3-cinders-overhaul",
    game: "Dark Souls III",
    genre: "RPG",
    category: "تحسينات اللعب",
    description: "إعادة بناء كاملة لأسلوب اللعب: استعادة حركات وأسلحة الأجزاء السابقة كـ Bloodborne و DS1، تجديد نظام الـ FP التلقائي، وإتاحة السفر المباشر من البداية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg",
    downloadUrl: "https://github.com/Xylozi/Cinders/releases/download/v2.15/Cinders.zip",
    author: "Xylozi",
    version: "v2.15"
  },
  {
    title: "Honest Merchant (Build Creation Utility)",
    slug: "ds3-honest-merchant",
    game: "Dark Souls III",
    genre: "RPG",
    category: "أدوات",
    description: "أداة آمنة تسمح لك بشراء أي سلاح أو درع أو خاتم في اللعبة بسعر رمزي لتجربة بيلدات مختلفة وشخصيات جديدة دون الحاجة لإعادة التختيم الطويل.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg",
    downloadUrl: "https://github.com/georgeg/HonestMerchant/releases/download/v1.1/HonestMerchant.zip",
    author: "georgeg",
    version: "v1.1"
  },

  // ==========================================
  // 2. FALLOUT: NEW VEGAS
  // ==========================================
  {
    title: "Tale of Two Wastelands (TTW: Fallout 3 + NV in One Game)",
    slug: "fnv-tale-of-two-wastelands",
    game: "Fallout: New Vegas",
    genre: "RPG",
    category: "عوالم جديدة",
    description: "المشروع الأسطوري الذي يدمج خريطة وقصة Fallout 3 كاملة مع Fallout: New Vegas في لعبة واحدة بمحرك واحد والسفر بالقطار بين واشنطن وصحراء موهافي.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/22380/header.jpg",
    downloadUrl: "https://github.com/TaleOfTwoWastelands/TTW-Installer/releases/download/v3.3.2/TTW_Installer.zip",
    author: "TTW Team",
    version: "v3.3.2"
  },
  {
    title: "New Vegas Anti-Crash (NVAC & Performance Stability)",
    slug: "fnv-anti-crash-nvac",
    game: "Fallout: New Vegas",
    genre: "RPG",
    category: "تحسين الأداء",
    description: "المود الإلزامي الأول لمنع توقف وكراشات اللعبة نهائياً وضمان سلاسة الإطارات حتى مع تثبيت عشرات المودات الثقيلة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/22380/header.jpg",
    downloadUrl: "https://github.com/ModdingLinked/NVAC/releases/download/v7.5.1/NVAC.zip",
    author: "Kuraimiku",
    version: "v7.5.1"
  },
  {
    title: "Just Assorted Mods (JAM: Sprint, Dynamic Crosshair & Bullet Time)",
    slug: "fnv-just-assorted-mods",
    game: "Fallout: New Vegas",
    genre: "RPG",
    category: "تحسينات اللعب",
    description: "تحديث ميكانيكا اللعب للجيل الحديث: الجري السريع (Sprint)، تصويب دقيق، إبطاء الوقت التكتيكي (Bullet Time)، وتفاعل سريع مع الصناديق.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/22380/header.jpg",
    downloadUrl: "https://github.com/yvileapsis/JustAssortedMods/releases/download/v4.4/JustAssortedMods.zip",
    author: "Yvileapsis",
    version: "v4.4"
  },

  // ==========================================
  // 3. S.T.A.L.K.E.R.: ANOMALY
  // ==========================================
  {
    title: "GAMMA Modpack Integration (Ultimate Survival Overhaul)",
    slug: "stalker-gamma-overhaul",
    game: "S.T.A.L.K.E.R.: Anomaly",
    genre: "Survival",
    category: "عوالم جديدة",
    description: "أعظم حزمة بقاء وواقعية لمنطقة تشيرنوبل المحظورة؛ نظام تصليح أسلحة واقعي، علاج متقدم، ذكاء اصطناعي مرعب للمتحولين، ومؤثرات صوتية فريدة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4500/header.jpg",
    downloadUrl: "https://github.com/Grokitach/Stalker_GAMMA/releases/download/v0.9.1/GAMMA_Launcher.zip",
    author: "Grokitach & Community",
    version: "v0.9.1"
  },
  {
    title: "Anomaly HD Models Addon (Ultra-Realistic Stalkers)",
    slug: "stalker-anomaly-hd-models",
    game: "S.T.A.L.K.E.R.: Anomaly",
    genre: "Survival",
    category: "الرسوميات",
    description: "ترقية رسومية شاملة لجميع شخصيات ومقاتلي فصائل المنطقة (Duty, Freedom, Monolith, Loners) ببدلات عسكرية وأقنعة غاز عالية الدقة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/4500/header.jpg",
    downloadUrl: "https://github.com/AydinMods/AnomalyHDModels/releases/download/v1.5/AnomalyHDModels.zip",
    author: "Aydin",
    version: "v1.5"
  },

  // ==========================================
  // 4. STARFIELD
  // ==========================================
  {
    title: "Starfield Script Extender (SFSE Core Framework)",
    slug: "sf-script-extender-sfse",
    game: "Starfield",
    genre: "RPG",
    category: "مكتبات مطلوبة",
    description: "المحرك البرمجي الأساسي لتوسيع إمكانيات محرك ستارفيلد وتشغيل مودات واجهة المستخدم والفيزياء وسفن الفضاء المعقدة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
    downloadUrl: "https://github.com/ianp/sfse/releases/download/v0.2.14/sfse_0_2_14.zip",
    author: "SFSE Team",
    version: "v0.2.14"
  },
  {
    title: "StarUI Inventory (Essential Space Inventory Overhaul)",
    slug: "sf-starui-inventory",
    game: "Starfield",
    genre: "RPG",
    category: "إدارة المخزون",
    description: "المود الأكثر تحميلاً في ستارفيلد؛ يعيد تنظيم واجهة المخزون الفضائي بقوائم أعمدة واضحة، فرز حسب القيمة والوزن، والفرز السريع للبضائع.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
    downloadUrl: "https://github.com/m8r-starfield/StarUI-Inventory/releases/download/v2.3/StarUI_Inventory.zip",
    author: "m8r98a4f2",
    version: "v2.3"
  },
  {
    title: "Ship Builder Tolerance Overhaul (No Build Limits)",
    slug: "sf-ship-builder-tolerance",
    game: "Starfield",
    genre: "RPG",
    category: "مركبات ومواصلات",
    description: "حرية مطلقة في بناء وتعديل سفن الفضاء دون قيود الاصطدام أو قيود الطول والحجم لتصميم أي سفينة خيالية كالميلينيوم فالكون.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
    downloadUrl: "https://github.com/StarfieldMods/ShipBuilderTolerance/releases/download/v1.2/ShipBuilderTolerance.zip",
    author: "Pete",
    version: "v1.2"
  },

  // ==========================================
  // 5. HOGWARTS LEGACY
  // ==========================================
  {
    title: "Apparition Mod (Teleportation & Fast Flying)",
    slug: "hl-apparition-teleportation",
    game: "Hogwarts Legacy",
    genre: "RPG",
    category: "سحر وقدرات",
    description: "القدرة السحرية الخارقة على الانتقال الآني اللحظي بالدخان الأسود كما في أفلام هاري بوتر والتنقل بسرعة خيالية داخل هوجورتس والمناطق المجاورة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg",
    downloadUrl: "https://github.com/hl-modding/ApparitionMod/releases/download/v1.0.4/ApparitionMod.zip",
    author: "Dekita",
    version: "v1.0.4"
  },
  {
    title: "Mouse Controls for Broom (Fluid Flight Overhaul)",
    slug: "hl-mouse-controls-broom",
    game: "Hogwarts Legacy",
    genre: "RPG",
    category: "أدوات",
    description: "تصحيح تحكم المكنسة الطائرة بالماوس ليكون سلساً ودقيقاً مثل ألعاب الطيران الحديثة بدلاً من التحكم الافتراضي الصعب.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg",
    downloadUrl: "https://github.com/hl-modding/MouseBroom/releases/download/v1.3/MouseBroom.zip",
    author: "Icarus",
    version: "v1.3"
  }
];

const WAVE_2_MODS = [
  // ==========================================
  // 6. LEFT 4 DEAD 2
  // ==========================================
  {
    title: "Admin System & Spawn Menu (Ultimate Server Host)",
    slug: "l4d2-admin-system-menu",
    game: "Left 4 Dead 2",
    genre: "Action",
    category: "أدوات",
    description: "قائمة المسؤول الكاملة داخل اللعبة: استدعاء الأسلحة، التحكم بالوحوش، تشغيل الأطوار الخاصة، وحماية السيرفر من المخربين.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/header.jpg",
    downloadUrl: "https://github.com/Rayman-L4D2/AdminSystem/releases/download/v2.1/AdminSystem.zip",
    author: "Rayman1103",
    version: "v2.1"
  },
  {
    title: "Improved Bots (Advanced Tactical AI Survivors)",
    slug: "l4d2-improved-bots-ai",
    game: "Left 4 Dead 2",
    genre: "Action",
    category: "تحسينات اللعب",
    description: "يجعل البوتات والناجين يلعبون بذكاء حقيقي: إنقاذ سريع عند السقوط، التقاط القنابل والأسلحة النارية الفعالة، والتحرك بتكتيك دفاعي.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/header.jpg",
    downloadUrl: "https://github.com/L4D2-Community/ImprovedBots/releases/download/v3.0/ImprovedBots.zip",
    author: "Blasphemy",
    version: "v3.0"
  },
  {
    title: "All Weapons HD Remaster (Realistic 4K Models & Sounds)",
    slug: "l4d2-weapons-hd-remaster",
    game: "Left 4 Dead 2",
    genre: "Action",
    category: "أسلحة ومعدات",
    description: "إعادة تصميم شاملة لكافة بنادق ومسدسات لفت 4 ديد بمجسمات عالية الدقة وأنيميشن تعبئة ذخيرة واقعي ومؤثرات صوتية سينمائية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/header.jpg",
    downloadUrl: "https://github.com/L4D2-Weapon-Team/HDRemaster/releases/download/v1.4/WeaponsHD.zip",
    author: "Arby26",
    version: "v1.4"
  },

  // ==========================================
  // 7. PAYDAY 2
  // ==========================================
  {
    title: "SuperBLT (Essential C++ Modding Hook)",
    slug: "pd2-superblt-framework",
    game: "Payday 2",
    genre: "Action",
    category: "مكتبات مطلوبة",
    description: "المحرك المركزي لتشغيل كافة مودات السطو وأصوات ومؤثرات بايداي 2 مع دعم الصوتيات المخصصة والشبكات.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/218620/header.jpg",
    downloadUrl: "https://github.com/cray-payday/SuperBLT/releases/download/v1.4.5/SuperBLT.zip",
    author: "ZNixian",
    version: "v1.4.5"
  },
  {
    title: "WolfHUD (Ultimate Tactical Heist HUD Overhaul)",
    slug: "pd2-wolfhud-tactical-hud",
    game: "Payday 2",
    genre: "Action",
    category: "أدوات",
    description: "واجهة السطو التكتيكية المتكاملة: عداد الرهائن، مؤقت المثقاب التلقائي، مستوى ضرر الأعداء، وإحصائيات الذخيرة المتبقية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/218620/header.jpg",
    downloadUrl: "https://github.com/Kamikaze94/WolfHUD/releases/download/v4.2/WolfHUD.zip",
    author: "Kamikaze94",
    version: "v4.2"
  },
  {
    title: "Restoration Mod (Complete Gameplay & Cop AI Overhaul)",
    slug: "pd2-restoration-mod",
    game: "Payday 2",
    genre: "Action",
    category: "تحسينات اللعب",
    description: "تعديل جذري يعيد تكتيكات الشرطة ووحدات SWAT الذكية، إضافة فئات مهارات جديدة وإعادة توازن الصعوبة لتجربة سرقة بنوك احترافية.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/218620/header.jpg",
    downloadUrl: "https://github.com/RestorationModTeam/RestorationMod/releases/download/v7.1/RestorationMod.zip",
    author: "Restoration Mod Team",
    version: "v7.1"
  },

  // ==========================================
  // 8. MOUNT & BLADE: WARBAND
  // ==========================================
  {
    title: "Prophesy of Pendor (Legendary Fantasy Total Conversion)",
    slug: "mbw-prophesy-of-pendor",
    game: "Mount & Blade: Warband",
    genre: "Strategy",
    category: "عوالم جديدة",
    description: "التعديل الأسطوري الأكثر تتويجاً في تاريخ وارباند؛ قارة بيندور الفانتازية، فرسان النخبة الخارقين، جيوش الجان المتوحشة، وقصة متكاملة لبناء مملكتك.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/48700/header.jpg",
    downloadUrl: "https://github.com/Saxondragon/ProphesyOfPendor/releases/download/v3.9.5/ProphesyOfPendor.zip",
    author: "Saxondragon",
    version: "v3.9.5"
  },
  {
    title: "Gekokujo: Daimyo Edition (Feudal Japan & Samurai Warfare)",
    slug: "mbw-gekokujo-daimyo-edition",
    game: "Mount & Blade: Warband",
    genre: "Strategy",
    category: "عوالم جديدة",
    description: "اليابان الإقطاعية وعصر الساموراي؛ خريطة كاملة للجزر اليابانية، أسلحة الكاتانا والرماح، بدلات الساموراي التاريخية، والمدافع القديمة.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/48700/header.jpg",
    downloadUrl: "https://github.com/phai/gekokujo/releases/download/v3.1/GekokujoDaimyo.zip",
    author: "Marty & Phai",
    version: "v3.1"
  },
  {
    title: "Diplomacy (Advanced Kingdom Politics & Economy)",
    slug: "mbw-diplomacy-warband",
    game: "Mount & Blade: Warband",
    genre: "Strategy",
    category: "تحسينات اللعب",
    description: "تعميق السياسة؛ توظيف وزراء وقادة، إرسال سفراء لإبرام معاهدات السلام والتحالفات، وتعيين حكام للقلاع لتنظيم الجيوش تلقائياً.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/48700/header.jpg",
    downloadUrl: "https://github.com/Waihti/Diplomacy/releases/download/v4.3/Diplomacy.zip",
    author: "Waihti",
    version: "v4.3"
  },

  // ==========================================
  // 9. SUBNAUTICA
  // ==========================================
  {
    title: "Nitrox (Subnautica Multiplayer Co-op Framework)",
    slug: "subnautica-nitrox-multiplayer",
    game: "Subnautica",
    genre: "Survival",
    category: "أطوار جماعية",
    description: "طور اللعب الجماعي الكامل لسوبنوتيكا؛ استكشف أعماق الكوكب المائي 4546B مع أصدقائك، ابنوا قواعد مشتركة، وقودوا الغواصة العملاقة Cyclops سوياً.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/264710/header.jpg",
    downloadUrl: "https://github.com/SubnauticaNitrox/Nitrox/releases/download/v1.7.1.0/Nitrox.zip",
    author: "Nitrox Team",
    version: "v1.7.1.0"
  },
  {
    title: "More Quick Slots (Extended Tool Belt)",
    slug: "subnautica-more-quick-slots",
    game: "Subnautica",
    genre: "Survival",
    category: "أدوات",
    description: "زيادة خانات شريط الأدوات السريع حتى 12 خانة بدلاً من 5 لتسهيل التبديل الفوري بين الماسح، أداة الصيانة، وحارق الليزر تحت الماء.",
    imageUrl: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/264710/header.jpg",
    downloadUrl: "https://github.com/SubnauticaMods/MoreQuickSlots/releases/download/v2.1/MoreQuickSlots.zip",
    author: "RandyKnapp",
    version: "v2.1"
  }
];

async function main() {
  console.log("=== Executing Double Wave Famous AAA Mods Ingestion ===");
  const allMods = [...WAVE_1_MODS, ...WAVE_2_MODS];
  const targetGames = [...new Set(allMods.map(m => m.game))];

  const placeholders = targetGames.map(() => "?").join(",");
  const existingRes = await db.execute({
    sql: `SELECT LOWER(TRIM(title)) as t, game FROM mods WHERE game IN (${placeholders})`,
    args: targetGames
  });
  const existingSet = new Set(existingRes.rows.map(r => `${r.game}:::${r.t}`));
  console.log(`Loaded ${existingSet.size} existing keys for these AAA games.`);

  let added = 0;
  for (const m of allMods) {
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
    added++;
  }

  const finalTotal = await db.execute("SELECT COUNT(*) as c FROM mods WHERE status = 'approved'");
  console.log(`\n🎉 Completed Double Wave! Added ${added} unique mods. Total in Turso: ${finalTotal.rows[0].c}`);
}

main().catch(console.error);
