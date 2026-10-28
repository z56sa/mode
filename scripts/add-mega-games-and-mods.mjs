import { createClient } from "@libsql/client";

const db = createClient({
  url: "libsql://mode-knook9.aws-ap-northeast-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg"
});

// Real Steam header covers
const GAME_HEADERS = {
  "Elden Ring": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
  "Baldur's Gate 3": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
  "Fallout 4": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg",
  "Red Dead Redemption 2": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
  "Starfield": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
  "Kenshi": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/233860/header.jpg",
  "Barotrauma": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/602960/header.jpg",
  "Palworld": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/header.jpg"
};

const NEW_MODS = [
  // ================= ELDEN RING =================
  {
    title: "Seamless Co-op",
    slug: "elden-ring-seamless-co-op",
    game: "Elden Ring",
    gameGenre: "RPG",
    category: "اللعب الجماعي (Multiplayer)",
    description: "أشهر وأهم مود في تاريخ إلدن رينج! يتيح لك تختيم اللعبة بالكامل من البداية حتى النهاية مع أصدقائك بدون قيود الاستدعاء وبدون أي شاشات تحميل أو انقطاع عند الموت.",
    version: "1.8.6",
    author: "LukeYui",
    imageUrl: GAME_HEADERS["Elden Ring"],
    sourceUrl: "https://www.nexusmods.com/eldenring/mods/510",
    downloadUrl: "https://www.nexusmods.com/eldenring/mods/510"
  },
  {
    title: "Elden Ring Reforged",
    slug: "elden-ring-reforged",
    game: "Elden Ring",
    gameGenre: "RPG",
    category: "إصلاح وتوازن شامل (Overhaul)",
    description: "إعادة بناء وتطوير ميكانيكيات القتال: صد الضربات المتزامن (Deflect)، مهارات أسلحة مخصصة، كاميرا أكثر اتساعاً، وتوازن جديد كلياً للزعماء.",
    version: "0.14.2",
    author: "Kirnifr",
    imageUrl: GAME_HEADERS["Elden Ring"],
    sourceUrl: "https://www.nexusmods.com/eldenring/mods/541",
    downloadUrl: "https://www.nexusmods.com/eldenring/mods/541"
  },
  {
    title: "Item and Enemy Randomizer",
    slug: "elden-ring-item-enemy-randomizer",
    game: "Elden Ring",
    gameGenre: "RPG",
    category: "طريقة لعب وتحدي (Gameplay)",
    description: "عشوائية تامة لجميع العناصر والأسلحة والزعماء في جميع مناطق عالم إلدن رينج لتجربة لعب جديدة ومليئة بالمفاجآت غير المتوقعة في كل تختيمة.",
    version: "0.9.1",
    author: "thefifthmatt",
    imageUrl: GAME_HEADERS["Elden Ring"],
    sourceUrl: "https://www.nexusmods.com/eldenring/mods/428",
    downloadUrl: "https://www.nexusmods.com/eldenring/mods/428"
  },
  {
    title: "Clever's Moveset Modpack",
    slug: "clevers-moveset-modpack",
    game: "Elden Ring",
    gameGenre: "RPG",
    category: "حركات وقتال (Combat)",
    description: "حركات قتالية وأنميشن خرافي مقتبس من ألعاب الأكشن والأنمي، تعطي الأسلحة قدرات خارقة وتأثيرات بصرية ساحرة.",
    version: "1.3.0",
    author: "Clever",
    imageUrl: GAME_HEADERS["Elden Ring"],
    sourceUrl: "https://www.nexusmods.com/eldenring/mods/1928",
    downloadUrl: "https://www.nexusmods.com/eldenring/mods/1928"
  },
  {
    title: "Grand Merchant (Glorious Merchant)",
    slug: "elden-ring-grand-merchant",
    game: "Elden Ring",
    gameGenre: "RPG",
    category: "أدوات وتسهيل (Utility)",
    description: "يسمح لك بشراء وتجربة أي درع، سلاح، سحر، أو مادة صناعة في اللعبة فوراً من التاجر كاليه في كنيسة إيليه.",
    version: "2.0.1",
    author: "Yeet",
    imageUrl: GAME_HEADERS["Elden Ring"],
    sourceUrl: "https://www.nexusmods.com/eldenring/mods/129",
    downloadUrl: "https://www.nexusmods.com/eldenring/mods/129"
  },

  // ================= BALDUR'S GATE 3 =================
  {
    title: "Party Limit Begone",
    slug: "bg3-party-limit-begone",
    game: "Baldur's Gate 3",
    gameGenre: "RPG",
    category: "اللعب الجماعي والمرافقين (Companions)",
    description: "يزيل الحد الأقصى للمرافقين في الفريق ليمكنك أخذ حتى 16 مرافقاً في رحلتك وسماع جميع حواراتهم وتفاعلاتهم مع القصة في وقت واحد.",
    version: "2.1.0",
    author: "Scribe",
    imageUrl: GAME_HEADERS["Baldur's Gate 3"],
    sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/327",
    downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/327"
  },
  {
    title: "Tav's Hair Salon",
    slug: "bg3-tavs-hair-salon",
    game: "Baldur's Gate 3",
    gameGenre: "RPG",
    category: "تخصيص الشخصية (Customization)",
    description: "حزمة تصفيفات شعر وقصات مذهلة لشخصيتك الرئيسية بجميع الأجناس والفئات بجودة رسومية فائقة.",
    version: "1.4.5",
    author: "Toarie",
    imageUrl: GAME_HEADERS["Baldur's Gate 3"],
    sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/213",
    downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/213"
  },
  {
    title: "5e Spells",
    slug: "bg3-5e-spells",
    game: "Baldur's Gate 3",
    gameGenre: "RPG",
    category: "سحر وقدرات (Spells)",
    description: "يضيف العشرات من التعاويذ الرسمية لقواعد D&D 5e من المستوى 1 إلى 9 التي لم تكن موجودة في اللعبة الأصلية.",
    version: "3.2.1",
    author: "DiZ93",
    imageUrl: GAME_HEADERS["Baldur's Gate 3"],
    sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/125",
    downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/125"
  },
  {
    title: "Basket Full of Equipment (SFW)",
    slug: "bg3-basket-full-of-equipment",
    game: "Baldur's Gate 3",
    gameGenre: "RPG",
    category: "دروع وأزياء (Equipment)",
    description: "أكثر من 800 قطعة ملابس ودروع مميزة بتصاميم فريدة وأسلحة مزخرفة متوفرة في بداية اللعبة.",
    version: "1.8.0",
    author: "AnteMaxx",
    imageUrl: GAME_HEADERS["Baldur's Gate 3"],
    sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/87",
    downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/87"
  },
  {
    title: "UI Expansion & Better Inventory",
    slug: "bg3-better-inventory-ui",
    game: "Baldur's Gate 3",
    gameGenre: "RPG",
    category: "واجهة المستخدم (UI)",
    description: "تحسين واجهة الحقيبة، فرز الأدوات والجرعات، وتكبير نوافذ الخيارات مع شريط شروحات أسهل للقراءة.",
    version: "1.5.0",
    author: "Djmr",
    imageUrl: GAME_HEADERS["Baldur's Gate 3"],
    sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/141",
    downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/141"
  },

  // ================= FALLOUT 4 =================
  {
    title: "Unofficial Fallout 4 Patch (UFO4P)",
    slug: "unofficial-fallout-4-patch",
    game: "Fallout 4",
    gameGenre: "RPG",
    category: "إصلاحات أساسية (Bug Fixes)",
    description: "باتش المجتمع الرسمي الشامل لحل آلاف الأخطاء التقنية، مشاكل المهام، والأعطال في لعبة Fallout 4 وجميع إضافاتها الرسمية.",
    version: "2.1.5",
    author: "Arthmoor & UFO4P Team",
    imageUrl: GAME_HEADERS["Fallout 4"],
    sourceUrl: "https://www.nexusmods.com/fallout4/mods/4598",
    downloadUrl: "https://www.nexusmods.com/fallout4/mods/4598"
  },
  {
    title: "Sim Settlements 2",
    slug: "fallout-4-sim-settlements-2",
    game: "Fallout 4",
    gameGenre: "RPG",
    category: "بناء مستوطنات وقصة (Settlements)",
    description: "أعظم مود بناء في Fallout 4! يجعل المستوطنين يبنون منازلهم ومزارعهم ومتاجرهم بأنفسهم مع قصة سينمائية كاملة وأصوات مسجلة احترافياً.",
    version: "3.3.4",
    author: "Kinggath",
    imageUrl: GAME_HEADERS["Fallout 4"],
    sourceUrl: "https://www.nexusmods.com/fallout4/mods/47976",
    downloadUrl: "https://www.nexusmods.com/fallout4/mods/47976"
  },
  {
    title: "Armorsmith Extended",
    slug: "fallout-4-armorsmith-extended",
    game: "Fallout 4",
    gameGenre: "RPG",
    category: "دروع وتعديل (Equipment)",
    description: "يتيح لك ارتداء الدروع الواقية فوق أي زي أو ملابس عادية، وإضافة طبقات حرارية ومقاومة لجميع الملابس في عالم الكومنولث.",
    version: "4.6.2",
    author: "Gambit77",
    imageUrl: GAME_HEADERS["Fallout 4"],
    sourceUrl: "https://www.nexusmods.com/fallout4/mods/2228",
    downloadUrl: "https://www.nexusmods.com/fallout4/mods/2228"
  },
  {
    title: "True Storms - Wasteland Edition",
    slug: "fallout-4-true-storms",
    game: "Fallout 4",
    gameGenre: "RPG",
    category: "طقس وبيئة (Weather)",
    description: "عواصف رملية وإشعاعية مرعبة، أمطار غزيرة مع رعد وأصوات واقعية ثلاثية الأبعاد، وهجوم لغنائم الفيرال غول أثناء العواصف.",
    version: "1.4.3",
    author: "fadingsignal",
    imageUrl: GAME_HEADERS["Fallout 4"],
    sourceUrl: "https://www.nexusmods.com/fallout4/mods/4472",
    downloadUrl: "https://www.nexusmods.com/fallout4/mods/4472"
  },

  // ================= RED DEAD REDEMPTION 2 =================
  {
    title: "Rampage Trainer",
    slug: "rdr2-rampage-trainer",
    game: "Red Dead Redemption 2",
    gameGenre: "Action",
    category: "أدوات وتحكم وغش (Trainer)",
    description: "أقوى قائمة تحكم وغش لـ RDR2: أموال غير محدودة، طيران، استدعاء أي حصان أو مركبة، تغيير الطقس، والانتقال الفوري لأي بقعة في الخريطة.",
    version: "1.6.4",
    author: "berkay2578",
    imageUrl: GAME_HEADERS["Red Dead Redemption 2"],
    sourceUrl: "https://www.nexusmods.com/reddeadredemption2/mods/233",
    downloadUrl: "https://www.nexusmods.com/reddeadredemption2/mods/233"
  },
  {
    title: "WhyEm's DLC",
    slug: "rdr2-whyems-dlc",
    game: "Red Dead Redemption 2",
    gameGenre: "Action",
    category: "ملابس وتخصيص (Customization)",
    description: "توسعة ضخمة لملابس آرثر مورغان: معاطف، أحزمة أسلحة، قبعات جلدية، سكاكين مزخرفة، وقصات لحية وشعر جديدة تماماً.",
    version: "1.0.8",
    author: "WhyEm",
    imageUrl: GAME_HEADERS["Red Dead Redemption 2"],
    sourceUrl: "https://www.nexusmods.com/reddeadredemption2/mods/671",
    downloadUrl: "https://www.nexusmods.com/reddeadredemption2/mods/671"
  },
  {
    title: "Ped Damage Overhaul",
    slug: "rdr2-ped-damage-overhaul",
    game: "Red Dead Redemption 2",
    gameGenre: "Action",
    category: "واقعية وفيزياء (Realism)",
    description: "واقعية مذهلة لردود فعل الأعداء عند إصابتهم بالرصاص: محاولة النهوض، الزحف، إسقاط الأسلحة، ومؤثرات نزيف حقيقية.",
    version: "1.7.0",
    author: "HughJanus",
    imageUrl: GAME_HEADERS["Red Dead Redemption 2"],
    sourceUrl: "https://www.nexusmods.com/reddeadredemption2/mods/323",
    downloadUrl: "https://www.nexusmods.com/reddeadredemption2/mods/323"
  },
  {
    title: "Gunsmith Business",
    slug: "rdr2-gunsmith-business",
    game: "Red Dead Redemption 2",
    gameGenre: "Action",
    category: "تجارة ومهمات (Gameplay)",
    description: "يسمح لك بشراء وإدارة متجر أسلحة خاص بك في الغرب الأمريكي، طلب البضائع، وتحديد الأسعار لجني أرباح يومية.",
    version: "1.2.0",
    author: "Shtivi",
    imageUrl: GAME_HEADERS["Red Dead Redemption 2"],
    sourceUrl: "https://www.nexusmods.com/reddeadredemption2/mods/1458",
    downloadUrl: "https://www.nexusmods.com/reddeadredemption2/mods/1458"
  },

  // ================= KENSHI =================
  {
    title: "Reactive World",
    slug: "kenshi-reactive-world",
    game: "Kenshi",
    gameGenre: "Survival",
    category: "عالم تفاعلي (World Overhaul)",
    description: "يجعل عالم كينشي حياً وديناميكياً: عند إسقاط زعماء الفصائل الكبرى، تتفتت مدنهم وتشتعل حروب أهلية حقيقية للسيطرة على الأراضي.",
    version: "1.3.1",
    author: "Shidan",
    imageUrl: GAME_HEADERS["Kenshi"],
    sourceUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1358096888",
    downloadUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1358096888"
  },
  {
    title: "Dark UI",
    slug: "kenshi-dark-ui",
    game: "Kenshi",
    gameGenre: "Survival",
    category: "واجهة مستخدم (UI)",
    description: "الواجهة الداكنة الأنيقة الأكثر تحميلاً في Kenshi، تريح العين وتجعل قوائم إدارة الفريق والمستعمرة أكثر وضوحاً.",
    version: "1.0.0",
    author: "Elden",
    imageUrl: GAME_HEADERS["Kenshi"],
    sourceUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1200632417",
    downloadUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1200632417"
  },
  {
    title: "256 Recruitment Limit",
    slug: "kenshi-256-recruitment-limit",
    game: "Kenshi",
    gameGenre: "Survival",
    category: "توسيع الفريق (Gameplay)",
    description: "يرفع الحد الأقصى للمقاتلين في فرقتك من 30 إلى 256 عضواً لبناء جيوش جرارة ومستعمرات ضخمة لا تُقهر.",
    version: "1.0.0",
    author: "JarlFrank",
    imageUrl: GAME_HEADERS["Kenshi"],
    sourceUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=705119823",
    downloadUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=705119823"
  },

  // ================= BAROTRAUMA =================
  {
    title: "Neurotrauma",
    slug: "barotrauma-neurotrauma",
    game: "Barotrauma",
    gameGenre: "Horror",
    category: "طب وواقعية (Realism)",
    description: "نظام جراحة وطب شديد التعقيد والواقعية داخل الغواصة: كسور، عمليات قلب مفتوح، زراعة أعضاء، وتخثر دم.",
    version: "2.5.0",
    author: "Manni",
    imageUrl: GAME_HEADERS["Barotrauma"],
    sourceUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2776270649",
    downloadUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2776270649"
  },
  {
    title: "Enhanced Armaments",
    slug: "barotrauma-enhanced-armaments",
    game: "Barotrauma",
    gameGenre: "Horror",
    category: "أسلحة ومعدات (Weapons)",
    description: "ترسانة أسلحة غوص ودفاع متطورة ضد وحوش الأعماق، من بنادق مائية وبنادق ليزر عسكرية ودروع حماية حديثة.",
    version: "1.4.2",
    author: "Dr. Walter",
    imageUrl: GAME_HEADERS["Barotrauma"],
    sourceUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2621004381",
    downloadUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2621004381"
  },

  // ================= PALWORLD =================
  {
    title: "Palworld Gameplay Tweaks",
    slug: "palworld-gameplay-tweaks",
    game: "Palworld",
    gameGenre: "Survival",
    category: "تعديل طريقة اللعب (Gameplay)",
    description: "تعديل سرعة فقس البيض، سرعة التحمل، زيادة وزن الحقيبة، وتحسين ذكاء كائنات البال في إنجاز مهام القاعدة.",
    version: "1.2.0",
    author: "W1zard",
    imageUrl: GAME_HEADERS["Palworld"],
    sourceUrl: "https://www.nexusmods.com/palworld/mods/37",
    downloadUrl: "https://www.nexusmods.com/palworld/mods/37"
  },
  {
    title: "Better Building",
    slug: "palworld-better-building",
    game: "Palworld",
    gameGenre: "Survival",
    category: "بناء وقواعد (Building)",
    description: "يزيل قيود البناء الصارمة ويتيح محاذاة الجدران والأرضيات بسلاسة مع التشييد على المرتفعات دون رسائل خطأ.",
    version: "1.1.5",
    author: "Vortex",
    imageUrl: GAME_HEADERS["Palworld"],
    sourceUrl: "https://www.nexusmods.com/palworld/mods/145",
    downloadUrl: "https://www.nexusmods.com/palworld/mods/145"
  }
];

async function main() {
  console.log(`Adding ${NEW_MODS.length} top-tier mods across famous games...`);

  let added = 0;
  for (const m of NEW_MODS) {
    const existing = await db.execute({
      sql: "SELECT id FROM mods WHERE slug = ?",
      args: [m.slug]
    });

    if (existing.rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO mods (
          title, slug, game, game_genre, category, description,
          image_url, download_url, source_url, author, version,
          status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', CURRENT_TIMESTAMP)`,
        args: [
          m.title,
          m.slug,
          m.game,
          m.gameGenre,
          m.category,
          m.description,
          m.imageUrl,
          m.downloadUrl,
          m.sourceUrl,
          m.author,
          m.version
        ]
      });
      console.log(`✅ [${m.game}] Added: ${m.title}`);
      added++;
    } else {
      console.log(`✓ [${m.game}] Already exists: ${m.title}`);
    }
  }

  console.log(`\n🎉 Finished! Successfully added ${added} new popular mods.`);
}

main().catch(console.error);
