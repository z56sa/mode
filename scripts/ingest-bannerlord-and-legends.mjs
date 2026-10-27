/**
 * سكريبت لإدخال ألعاب عالمية أسطورية وموداتها الحقيقية:
 * 1. Mount & Blade II: Bannerlord
 * 2. Grand Theft Auto V (GTA V)
 * 3. Cyberpunk 2077
 * 4. Stardew Valley
 * 5. The Witcher 3: Wild Hunt
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

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

// 1. جلب مستودعات GitHub المفتوحة والـ Releases لمودات Bannerlord
async function ingestGithubRepos(game, genre, repos) {
  console.log(`\n⚔️ جلب مودات ${game} من GitHub Releases...`);
  const rows = [];

  for (const item of repos) {
    try {
      const res = await fetch(`https://api.github.com/repos/${item.repo}/releases`, {
        headers: { "User-Agent": "mode-platform" },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        console.log(`  ❌ ${item.name} (${item.repo}): HTTP ${res.status}`);
        continue;
      }

      const releases = await res.json();
      if (!Array.isArray(releases) || releases.length === 0) continue;

      const latest = releases[0];
      const asset = latest.assets?.find((a) =>
        a.name.endsWith(".zip") || a.name.endsWith(".7z") || a.name.endsWith(".rar") || a.name.endsWith(".exe")
      ) || latest.assets?.[0];

      const downloadUrl = asset ? asset.browser_download_url : latest.zipball_url;
      const fileName = asset ? asset.name : `${item.name}.zip`;
      const size = asset ? asset.size : 10 * 1024 * 1024;
      const slug = `gh-${game.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.slice(0, 80);

      rows.push({
        title: item.title || item.name,
        slug,
        game,
        genre,
        category: item.category || "Gameplay",
        description: item.desc || latest.body?.slice(0, 200) || `مود ${item.title || item.name} للعبة ${game}.`,
        imageUrl: item.image || null,
        downloadUrl,
        sourceUrl: `https://github.com/${item.repo}`,
        author: item.repo.split("/")[0],
        version: latest.tag_name || "1.0",
        downloadFileName: fileName,
        downloadSize: size,
      });

      console.log(`  ✅ ${item.name} -> v${latest.tag_name} (${fileName})`);
    } catch (e) {
      console.error(`  ⚠️ خطأ في ${item.name}:`, e.message);
    }
  }

  const inserted = await insertBatch(rows);
  console.log(`  🎉 إجمالي ما تم إدخاله لـ ${game}: ${inserted} مود`);
  return inserted;
}

// قائمة مودات Mount & Blade II: Bannerlord الرسمية ذات الروابط المباشرة
const BANNERLORD_MODS = [
  {
    repo: "BUTR/Bannerlord.Harmony",
    name: "Harmony",
    title: "Bannerlord Harmony Library",
    category: "Core Engine",
    desc: "المكتبة الأساسية الأولى لتشغيل وربط جميع مودات Mount & Blade II: Bannerlord وتعديل ملفات اللعبة.",
    image: "https://raw.githubusercontent.com/BUTR/Bannerlord.Harmony/master/banner.png",
  },
  {
    repo: "BUTR/Bannerlord.ButterLib",
    name: "ButterLib",
    title: "Bannerlord ButterLib Extended Library",
    category: "Core Engine",
    desc: "حزمة التوسيع البرمجية التي تمنح مودات Bannerlord قدرات متقدمة لإدارة السيرفرات والأحداث والحفظ.",
  },
  {
    repo: "BUTR/Bannerlord.UIExtenderEx",
    name: "UIExtenderEx",
    title: "Bannerlord UI Extender Extended",
    category: "Interface",
    desc: "مود تمديد وتحسين واجهة المستخدم وتعديل شاشات الجيوش والمعارك والمدن في Bannerlord.",
  },
  {
    repo: "Bannerlord-Coop-Team/BannerlordCoop",
    name: "Bannerlord Co-op",
    title: "Bannerlord Co-op Multiplayer Campaign",
    category: "Multiplayer",
    desc: "أشهر مود على الإطلاق لتمكين طور الحملة الكاملة باللعب التعاوني المشترك (Co-op) مع الأصدقاء.",
  },
  {
    repo: "DiplomacyTeam/Bannerlord.Diplomacy",
    name: "Diplomacy Mod",
    title: "Bannerlord Diplomacy & War Realism",
    category: "Strategy & Warfare",
    desc: "إعادة بناء كاملة لنظام الدبلوماسية: إعلان الحروب ومعاهدات السلام والتحالفات وإدارة الممالك والحروب الأهلية.",
  },
  {
    repo: "lzh-mb-mod/RTSCamera",
    name: "RTS Camera",
    title: "RTS Camera & Battlefield Command",
    category: "Camera & Tactics",
    desc: "تحويل معارك Bannerlord إلى استراتيجية فورية مع كاميرا علوية تكتيكية وأوامر متقدمة لكل فرقة.",
  },
  {
    repo: "Fellow93/RealisticBattleProject",
    name: "Realistic Battle Mod",
    title: "Realistic Battle Mod (RBM)",
    category: "Combat & Physics",
    desc: "تعديل فيزياء السيوف والدروع والسهام وذكاء الجيوش الاصطناعي ليصبح واقعياً وتكتيكياً بنسبة 100%.",
  },
  {
    repo: "R-Vaccari/bannerlord-banner-kings",
    name: "Banner Kings",
    title: "Banner Kings Feudalism Overhaul",
    category: "Total Conversion",
    desc: "تعديل جذري عميق لنظام الإقطاع والقرى والطبقات النبيلة والأديان والاقتصاد في كالراديا.",
  },
  {
    repo: "BUTR/MnB2-Bannerlord-CommunityPatch",
    name: "Community Patch",
    title: "Bannerlord Community Bugfix Patch",
    category: "Bugfixes",
    desc: "باتش المجتمع الرسمي لإصلاح المهارات والميزات المعطلة في كود اللعبة الأصلي وتحسين الأداء.",
  },
  {
    repo: "PureDark/MB2FireLord",
    name: "Fire Lord",
    title: "Fire Lord - Flaming Arrows & Weapons",
    category: "Visuals & Combat",
    desc: "إضافة المؤثرات النارية الواقعية للسهام والرماح وسيوف الفرسان أثناء المعارك الليلية الحماسية.",
  },
  {
    repo: "NotLooky/BannerlordVR",
    name: "Bannerlord VR",
    title: "Bannerlord Native VR Support",
    category: "VR Mod",
    desc: "تشغيل لعبة Mount & Blade II: Bannerlord داخل نظارات الواقع الافتراضي PCVR بخوذة وتحكم كامل.",
  },
  {
    repo: "welles/BannerlordCheats",
    name: "Bannerlord Cheats",
    title: "Bannerlord Advanced Sandbox Cheats Menu",
    category: "Cheats & Tools",
    desc: "قائمة أدوات تحكم وتطوير الشخصية والجيوش والأموال المتقدمة لطور الساندبوكس في اللعبة.",
  },
  {
    repo: "calsev/bannerlord_smith_forever",
    name: "Smith Forever",
    title: "Infinite Smithing Stamina Mod",
    category: "Crafting",
    desc: "إلغاء قيود طاقة الحدادة وصنع الأسلحة الأسطورية والدروع بحرية كاملة دون انتظار في المدن.",
  },
  {
    repo: "OzanUrkmez/CustomSpawns",
    name: "Custom Spawns",
    title: "Custom Spawns & Dynamic Armies API",
    category: "Campaign",
    desc: "ظهور جيوش متمردين وجيوش قراصنة ومرتزقة جدد ديناميكياً في مختلف مناطق الخريطة.",
  },
  {
    repo: "BUTR/Bannerlord.BLSE",
    name: "BLSE Loader",
    title: "Bannerlord Software Extender (BLSE)",
    category: "Core Engine",
    desc: "مشغل المودات الحديث فائق الاستقرار لحل مشاكل تعارض المودات ورفع معدل الإطارات (FPS).",
  },
];

// قائمة مودات GTA V الرسمية
const GTAV_MODS = [
  {
    repo: "scripthookvdotnet/scripthookvdotnet",
    name: "ScriptHookVDotNet",
    title: "Community Script Hook V .NET",
    category: "Core Engine",
    desc: "المكتبة الأساسية الأولى لتشغيل وبرمجة جميع سكربتات ومودات Grand Theft Auto V على الكمبيوتر.",
  },
  {
    repo: "MAFINS/MenyooSP",
    name: "Menyoo PC SP",
    title: "Menyoo PC Single-Player Trainer",
    category: "Trainer & Sandbox",
    desc: "أقوى وأشهر ترينر وقائمة تحكم شاملة في العالم للعبة GTA V: تعديل المركبات، الطقس، الخرائط، والشخصيات.",
  },
  {
    repo: "crosire/scripthookv",
    name: "Native Trainer Plus",
    title: "Native Trainer & Script Engine",
    category: "Tools",
    desc: "أداة الربط والتحكم الأصلية لتنفيذ دوال GTA V الأصلية وإضافة مهام وأطوار جديدة.",
  },
];

// قائمة مودات Cyberpunk 2077 الرسمية
const CYBERPUNK_MODS = [
  {
    repo: "maximeqdm/cyber_engine_tweaks",
    name: "Cyber Engine Tweaks",
    title: "Cyber Engine Tweaks (CET)",
    category: "Core Engine",
    desc: "الأساس الذي تبنى عليه كل مودات Cyberpunk 2077: كونسول الأوامر وإصلاحات الأداء وتفعيل السكربتات.",
  },
  {
    repo: "psiberx/cp2077-archive-xl",
    name: "ArchiveXL",
    title: "ArchiveXL Asset Loader",
    category: "Core Engine",
    desc: "أداة تحميل الموارد والمباني والملابس والأسلحة الجديدة بدون استبدال ملفات اللعبة الأصلية.",
  },
  {
    repo: "psiberx/cp2077-tweak-xl",
    name: "TweakXL",
    title: "TweakXL Gameplay & Stat Modifier",
    category: "Gameplay",
    desc: "تعديل قيم الأسلحة والمركبات وقدرات السيبرنتيك والمهارات بدون كسر ملفات الحفظ.",
  },
  {
    repo: "psiberx/cp2077-codeware",
    name: "Codeware",
    title: "Codeware Framework",
    category: "Framework",
    desc: "مكتبة كود متطورة ومكتبة واجهات تمنح صانعي المودات إمكانية إضافة واجهات وشاشات تفاعلية.",
  },
];

// قائمة مودات Stardew Valley الرسمية
const STARDEW_MODS = [
  {
    repo: "Pathoschild/SMAPI",
    name: "SMAPI",
    title: "SMAPI - Stardew Modding API",
    category: "Core Engine",
    desc: "مشغل المودات الأساسي الرسمي للعبة Stardew Valley الذي يشغل أكثر من 95% من مودات اللعبة.",
  },
  {
    repo: "Annosz/UIInfoSuite2",
    name: "UI Info Suite 2",
    title: "UI Info Suite 2 - Smart HUD",
    category: "Interface",
    desc: "إضافة معلومات ذكية لواجهة اللعبة: مواعيد الحصاد، طقس الغد، أعياد ميلاد القرويين، ونسبة الحظ اليومي.",
  },
];

async function main() {
  console.log("🚀 استيراد مودات الألعاب الأسطورية (Bannerlord, GTA V, Cyberpunk, Stardew Valley)...\n");

  let total = 0;

  // 1. Mount & Blade II: Bannerlord
  total += await ingestGithubRepos("Mount & Blade II: Bannerlord", "Strategy", BANNERLORD_MODS);

  // 2. Grand Theft Auto V
  total += await ingestGithubRepos("Grand Theft Auto V", "Action", GTAV_MODS);

  // 3. Cyberpunk 2077
  total += await ingestGithubRepos("Cyberpunk 2077", "RPG", CYBERPUNK_MODS);

  // 4. Stardew Valley
  total += await ingestGithubRepos("Stardew Valley", "Simulation", STARDEW_MODS);

  const stats = await db.execute("SELECT count(DISTINCT game) as games, count(*) as mods FROM mods");
  console.log("\n══════════════════════════════════════");
  console.log("🏆 النتيجة الإجمالية المحدثة:");
  console.log(`  ➕ مودات جديدة أضيفت: ${total}`);
  console.log(`  🎮 إجمالي الألعاب: ${stats.rows[0].games}`);
  console.log(`  📦 إجمالي المودات: ${stats.rows[0].mods}`);
  console.log("══════════════════════════════════════");
}

main();
