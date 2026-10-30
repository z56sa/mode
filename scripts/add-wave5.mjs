import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const envContent = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const getEnv = (key) => { const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm')); return match ? match[1].trim() : ''; };

const db = createClient({ url: getEnv('TURSO_DATABASE_URL'), authToken: getEnv('TURSO_AUTH_TOKEN') });

function slug(t, g) { return (t+'-'+g).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80); }

const mods = [
  // ===== Borderlands 3 =====
  { title:"BL3 Commander",game:"Borderlands 3",gameGenre:"أكشن RPG",category:"أدوات تحكم",description:"أداة تحكم كاملة تُتيح تعديل المهارات والمستوى والأسلحة وموارد الشخصية بحرية.",version:"1.5",author:"CommanderBL3",imageUrl:"https://staticdelivery.nexusmods.com/mods/2884/images/2/2-1571838943-1736291847.png",downloadUrl:"https://www.nexusmods.com/borderlands3/mods/2",sourceUrl:"https://www.nexusmods.com/borderlands3/mods/2"},
  { title:"Quality of Life Features",game:"Borderlands 3",gameGenre:"أكشن RPG",category:"تحسينات عامة",description:"يُضيف حفظاً تلقائياً وعداد ذخيرة أوضح وتصغيراً تلقائياً لرسائل المهام.",version:"2.0",author:"QoL_BL3",imageUrl:"https://staticdelivery.nexusmods.com/mods/2884/images/5/5-1572238943-1928371847.png",downloadUrl:"https://www.nexusmods.com/borderlands3/mods/5",sourceUrl:"https://www.nexusmods.com/borderlands3/mods/5"},
  { title:"Faster Travel",game:"Borderlands 3",gameGenre:"أكشن RPG",category:"طريقة اللعب",description:"يُسرّع رسوم السفر السريع ويُقلّص التأخير بين المحطات والمناطق.",version:"1.1",author:"SpeedMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/2884/images/9/9-1573038943-1824381748.png",downloadUrl:"https://www.nexusmods.com/borderlands3/mods/9",sourceUrl:"https://www.nexusmods.com/borderlands3/mods/9"},

  // ===== Satisfactory =====
  { title:"Refined Power",game:"Satisfactory",gameGenre:"استراتيجية",category:"طاقة وإنتاج",description:"يُضيف 30+ طريقة جديدة لتوليد الطاقة كالطاقة الشمسية والرياح والمياه.",version:"3.2.0",author:"Satisfactory_Plus",imageUrl:"https://assets-mod.ficsit.app/thumb/refined-power.png",downloadUrl:"https://ficsit.app/mod/RefPow",sourceUrl:"https://ficsit.app/mod/RefPow"},
  { title:"Ficsit Networks",game:"Satisfactory",gameGenre:"استراتيجية",category:"أتمتة",description:"يُضيف شبكة معلومات قابلة للبرمجة تُتيح التحكم الآلي في المصانع عبر Lua.",version:"0.8.2",author:"Panakotta00",imageUrl:"https://assets-mod.ficsit.app/thumb/ficsit-networks.png",downloadUrl:"https://ficsit.app/mod/FicsitNetworks",sourceUrl:"https://ficsit.app/mod/FicsitNetworks"},
  { title:"Micro Manage",game:"Satisfactory",gameGenre:"استراتيجية",category:"بناء وتطوير",description:"يُضيف ضبطاً دقيقاً لوضع المباني بتدوير وتحريك بالمليمترات لتصاميم مثالية.",version:"2.3",author:"Archengius",imageUrl:"https://assets-mod.ficsit.app/thumb/micro-manage.png",downloadUrl:"https://ficsit.app/mod/MicroManage",sourceUrl:"https://ficsit.app/mod/MicroManage"},

  // ===== Phasmophobia =====
  { title:"Custom Map Pack",game:"Phasmophobia",gameGenre:"رعب",category:"خرائط",description:"يُضيف 5 خرائط مخيفة جديدة صنعها المجتمع مع أشباح وأحداث مخصصة.",version:"1.3",author:"PhaseModTeam",imageUrl:"https://staticdelivery.nexusmods.com/mods/4714/images/3/3-1635638943-1738291483.png",downloadUrl:"https://www.nexusmods.com/phasmophobia/mods/3",sourceUrl:"https://www.nexusmods.com/phasmophobia/mods/3"},
  { title:"More Ghost Types",game:"Phasmophobia",gameGenre:"رعب",category:"محتوى جديد",description:"يُضيف 8 أنواع أشباح جديدة بدلائل وسلوك مختلف تجعل كل تحقيق غير متوقع.",version:"2.1",author:"GhostMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4714/images/7/7-1636438943-1924381748.png",downloadUrl:"https://www.nexusmods.com/phasmophobia/mods/7",sourceUrl:"https://www.nexusmods.com/phasmophobia/mods/7"},
  { title:"Better Equipment Display",game:"Phasmophobia",gameGenre:"رعب",category:"واجهة المستخدم",description:"يُحسّن عرض المعدات في المتجر والمركبة مع أيقونات أوضح وتفاصيل سريعة.",version:"1.0",author:"EquipMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4714/images/11/11-1637238943-1827391483.png",downloadUrl:"https://www.nexusmods.com/phasmophobia/mods/11",sourceUrl:"https://www.nexusmods.com/phasmophobia/mods/11"},

  // ===== Grounded =====
  { title:"Resource Multiplier",game:"Grounded",gameGenre:"بقاء",category:"توازن",description:"يُضاعف كمية الموارد المجمّعة ليُقلّص الطحن المتكرر دون إلغاء متعة الاستكشاف.",version:"1.2",author:"GroundedMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4176/images/2/2-1661638943-1736291847.png",downloadUrl:"https://www.nexusmods.com/grounded/mods/2",sourceUrl:"https://www.nexusmods.com/grounded/mods/2"},
  { title:"Bigger Backpack",game:"Grounded",gameGenre:"بقاء",category:"تخزين",description:"يُوسّع سعة حقيبة الظهر من 25 إلى 50 خانة مع فتح خانات إضافية تدريجياً.",version:"1.5",author:"StorageMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4176/images/5/5-1662238943-1928381748.png",downloadUrl:"https://www.nexusmods.com/grounded/mods/5",sourceUrl:"https://www.nexusmods.com/grounded/mods/5"},
  { title:"No Bug Aggro",game:"Grounded",gameGenre:"بقاء",category:"طريقة اللعب",description:"يُوقف هجوم الحشرات العشوائي لتتجول وتستكشف العالم بشكل أكثر هدوءاً.",version:"1.0",author:"PeaceMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4176/images/8/8-1663038943-1824381748.png",downloadUrl:"https://www.nexusmods.com/grounded/mods/8",sourceUrl:"https://www.nexusmods.com/grounded/mods/8"},

  // ===== Back 4 Blood =====
  { title:"More Cards",game:"Back 4 Blood",gameGenre:"أكشن",category:"محتوى جديد",description:"يُضيف 50+ بطاقة جديدة لبناء شخصيات متخصصة لم تكن ممكنة في اللعبة الأصلية.",version:"2.3",author:"B4B_Modder",imageUrl:"https://staticdelivery.nexusmods.com/mods/3939/images/2/2-1636038943-1736291847.png",downloadUrl:"https://www.nexusmods.com/back4blood/mods/2",sourceUrl:"https://www.nexusmods.com/back4blood/mods/2"},
  { title:"Difficulty Tweaks",game:"Back 4 Blood",gameGenre:"أكشن",category:"توازن وصعوبة",description:"يُعدّل نسب صعوبة الأعداء وكثافة Ridden ليكون كل مستوى تحدياً مُرضياً.",version:"1.4",author:"DiffMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3939/images/6/6-1636838943-1928391748.png",downloadUrl:"https://www.nexusmods.com/back4blood/mods/6",sourceUrl:"https://www.nexusmods.com/back4blood/mods/6"},

  // ===== Warhammer 40000: Darktide =====
  { title:"Darktide Mod Framework",game:"Warhammer 40,000: Darktide",gameGenre:"أكشن",category:"أدوات أساسية",description:"إطار عمل أساسي لمودات Darktide يُتيح تثبيت وإدارة المودات المختلفة بأمان.",version:"1.5",author:"Darktide_Mods",imageUrl:"https://staticdelivery.nexusmods.com/mods/6575/images/3/3-1671038943-1736291847.png",downloadUrl:"https://www.nexusmods.com/warhammer40kdarktide/mods/3",sourceUrl:"https://www.nexusmods.com/warhammer40kdarktide/mods/3"},
  { title:"Enemy Health Bars",game:"Warhammer 40,000: Darktide",gameGenre:"أكشن",category:"واجهة المستخدم",description:"يُضيف أشرطة صحة للأعداء والنخبة والمطاردين لتقدير التهديد بشكل أسرع.",version:"2.1",author:"HealthBar",imageUrl:"https://staticdelivery.nexusmods.com/mods/6575/images/7/7-1671838943-1924381748.png",downloadUrl:"https://www.nexusmods.com/warhammer40kdarktide/mods/7",sourceUrl:"https://www.nexusmods.com/warhammer40kdarktide/mods/7"},
  { title:"Weapon Stats Display",game:"Warhammer 40,000: Darktide",gameGenre:"أكشن",category:"واجهة المستخدم",description:"يُظهر الإحصائيات الكاملة للأسلحة بأرقام دقيقة بدل الأشرطة الغامضة.",version:"1.3",author:"StatsMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/6575/images/12/12-1672638943-1827391748.png",downloadUrl:"https://www.nexusmods.com/warhammer40kdarktide/mods/12",sourceUrl:"https://www.nexusmods.com/warhammer40kdarktide/mods/12"},

  // ===== Ghostwire: Tokyo =====
  { title:"No Mask Removal",game:"Ghostwire: Tokyo",gameGenre:"أكشن",category:"شخصيات",description:"يُبقي قناع Akito على وجهه في جميع الأوقات خلال مشاهد اللعب.",version:"1.0",author:"MaskMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4374/images/2/2-1650238943-1736291847.png",downloadUrl:"https://www.nexusmods.com/ghostwiretokyo/mods/2",sourceUrl:"https://www.nexusmods.com/ghostwiretokyo/mods/2"},
  { title:"Increased Ether Capacity",game:"Ghostwire: Tokyo",gameGenre:"أكشن",category:"توازن",description:"يرفع الحد الأقصى للأثير لكل عنصر لتتمكن من المقاتلة لفترات أطول دون إعادة الشحن.",version:"1.2",author:"EtherMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4374/images/5/5-1650938943-1928391748.png",downloadUrl:"https://www.nexusmods.com/ghostwiretokyo/mods/5",sourceUrl:"https://www.nexusmods.com/ghostwiretokyo/mods/5"},

  // ===== A Plague Tale Requiem =====
  { title:"Photo Mode Free Camera",game:"A Plague Tale: Requiem",gameGenre:"مغامرة",category:"كاميرا",description:"يُحرّر كاميرا وضع التصوير من القيود ويتيح تصوير مشاهد بزوايا احترافية.",version:"1.1",author:"PlagueModder",imageUrl:"https://staticdelivery.nexusmods.com/mods/5698/images/2/2-1666238943-1736291847.png",downloadUrl:"https://www.nexusmods.com/aplaguetale2requiem/mods/2",sourceUrl:"https://www.nexusmods.com/aplaguetale2requiem/mods/2"},
  { title:"FPS Unlocker",game:"A Plague Tale: Requiem",gameGenre:"مغامرة",category:"تحسينات عامة",description:"يرفع قيد الـ 60 FPS في اللعبة للحصول على تجربة أكثر سلاسة على الشاشات العالية.",version:"1.0",author:"FPSMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/5698/images/5/5-1667038943-1928391748.png",downloadUrl:"https://www.nexusmods.com/aplaguetale2requiem/mods/5",sourceUrl:"https://www.nexusmods.com/aplaguetale2requiem/mods/5"},

  // ===== The Forest =====
  { title:"Improved Base Building",game:"The Forest",gameGenre:"بقاء",category:"بناء وتطوير",description:"يُوسّع خيارات البناء مع دعامات ومواد جديدة وتحسين نظام الوجازة.",version:"2.0",author:"ForestBuilder",imageUrl:"https://staticdelivery.nexusmods.com/mods/440/images/3/3-1512038943-1738291483.jpg",downloadUrl:"https://www.nexusmods.com/theforest/mods/3",sourceUrl:"https://www.nexusmods.com/theforest/mods/3"},
  { title:"Better Cannibal AI",game:"The Forest",gameGenre:"بقاء",category:"طريقة اللعب",description:"يُحسّن ذكاء أكلة لحوم البشر ليجعل هجماتهم أكثر تنسيقاً وتحدياً وواقعية.",version:"1.5",author:"AIForest",imageUrl:"https://staticdelivery.nexusmods.com/mods/440/images/7/7-1513038943-1924381748.jpg",downloadUrl:"https://www.nexusmods.com/theforest/mods/7",sourceUrl:"https://www.nexusmods.com/theforest/mods/7"},
  { title:"HD Textures Pack",game:"The Forest",gameGenre:"بقاء",category:"جرافيكس وإضاءة",description:"يُحسّن قوام الأشجار والأرضية والمباني بدقة مضاعفة مع ظلال أكثر واقعية.",version:"1.3",author:"HDForest",imageUrl:"https://staticdelivery.nexusmods.com/mods/440/images/12/12-1514038943-1827391748.jpg",downloadUrl:"https://www.nexusmods.com/theforest/mods/12",sourceUrl:"https://www.nexusmods.com/theforest/mods/12"},

  // ===== Escape from Tarkov =====
  { title:"Ammo Stats in Market",game:"Escape from Tarkov",gameGenre:"أكشن",category:"واجهة المستخدم",description:"يُظهر إحصائيات الذخيرة الكاملة مباشرة في قائمة السوق دون الحاجة لمراجعات خارجية.",version:"1.0",author:"TarkovMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/5469/images/1/1-1648038943-1736291847.png",downloadUrl:"https://www.nexusmods.com/escapefromtarkov/mods/1",sourceUrl:"https://www.nexusmods.com/escapefromtarkov/mods/1"},
  { title:"Quest Tracker Improved",game:"Escape from Tarkov",gameGenre:"أكشن",category:"واجهة المستخدم",description:"يُنظّم متابعة المهام بفلاتر وفرز ومؤشرات تقدم أكثر وضوحاً ومنطقية.",version:"1.3",author:"QuestMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/5469/images/4/4-1648838943-1924381748.png",downloadUrl:"https://www.nexusmods.com/escapefromtarkov/mods/4",sourceUrl:"https://www.nexusmods.com/escapefromtarkov/mods/4"},

  // ===== Cuphead =====
  { title:"Mugman Skin Pack",game:"Cuphead",gameGenre:"أكشن",category:"شخصيات",description:"يُضيف مظاهر بديلة لـ Mugman مستوحاة من فن عصر الثلاثينات الكلاسيكي.",version:"1.2",author:"CupMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3283/images/2/2-1535038943-1738291483.png",downloadUrl:"https://www.nexusmods.com/cuphead/mods/2",sourceUrl:"https://www.nexusmods.com/cuphead/mods/2"},
  { title:"Easy Mode Plus",game:"Cuphead",gameGenre:"أكشن",category:"صعوبة",description:"يُضيف وضعاً أكثر سهولة من Simple Mode للمبتدئين مع مزيد من الصحة والوقت.",version:"1.0",author:"EasyMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3283/images/5/5-1536038943-1924381748.png",downloadUrl:"https://www.nexusmods.com/cuphead/mods/5",sourceUrl:"https://www.nexusmods.com/cuphead/mods/5"},

  // ===== Frostpunk =====
  { title:"Harder Winter",game:"Frostpunk",gameGenre:"استراتيجية",category:"تحدي",description:"يجعل العاصفة الكبرى أقسى وأطول مع أحداث عشوائية إضافية لاختبار قيادتك.",version:"2.0",author:"FrostMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3011/images/2/2-1560238943-1736291847.png",downloadUrl:"https://www.nexusmods.com/frostpunk/mods/2",sourceUrl:"https://www.nexusmods.com/frostpunk/mods/2"},
  { title:"More Buildings",game:"Frostpunk",gameGenre:"استراتيجية",category:"بناء وتطوير",description:"يُضيف 15 مبنى جديداً متخصصاً كالمختبرات والمستودعات والمرافق المتقدمة.",version:"1.5",author:"BuildMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3011/images/5/5-1561038943-1928391748.png",downloadUrl:"https://www.nexusmods.com/frostpunk/mods/5",sourceUrl:"https://www.nexusmods.com/frostpunk/mods/5"},

  // ===== Wartales =====
  { title:"Party Size Increaser",game:"Wartales",gameGenre:"استراتيجية",category:"طريقة اللعب",description:"يرفع الحد الأقصى لحجم الفرقة من 12 إلى 20 مقاتلاً لمعارك أكثر ضخامة.",version:"1.1",author:"WartalesMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/6065/images/2/2-1672038943-1736291847.png",downloadUrl:"https://www.nexusmods.com/wartales/mods/2",sourceUrl:"https://www.nexusmods.com/wartales/mods/2"},
  { title:"Better Loot Tables",game:"Wartales",gameGenre:"استراتيجية",category:"توازن",description:"يُحسّن جداول الغنائم ليجعل الاكتشافات النادرة أكثر ترقباً وأقل عشوائية.",version:"1.3",author:"LootMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/6065/images/5/5-1672838943-1924381748.png",downloadUrl:"https://www.nexusmods.com/wartales/mods/5",sourceUrl:"https://www.nexusmods.com/wartales/mods/5"},

  // ===== Icarus =====
  { title:"Extended Tech Tree",game:"Icarus",gameGenre:"بقاء",category:"محتوى جديد",description:"يُضيف فروعاً إضافية لشجرة التقنية مع معدات ومباني وأدوات متخصصة جديدة.",version:"1.4",author:"IcarusMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4276/images/3/3-1647038943-1736291847.png",downloadUrl:"https://www.nexusmods.com/icarus/mods/3",sourceUrl:"https://www.nexusmods.com/icarus/mods/3"},
  { title:"Reduced Crafting Time",game:"Icarus",gameGenre:"بقاء",category:"توازن",description:"يُخفّض أوقات صنع الأدوات والمعدات ليكون إيقاع اللعبة أكثر سلاسة وأقل إرهاقاً.",version:"1.0",author:"SpeedCraft",imageUrl:"https://staticdelivery.nexusmods.com/mods/4276/images/7/7-1647838943-1924381748.png",downloadUrl:"https://www.nexusmods.com/icarus/mods/7",sourceUrl:"https://www.nexusmods.com/icarus/mods/7"},

  // ===== Coral Island =====
  { title:"Expanded Relationships",game:"Coral Island",gameGenre:"محاكاة",category:"حوار وقصة",description:"يُضيف أحداثاً وحوارات جديدة للشخصيات يرفع عمق العلاقات وتنوعها.",version:"1.2",author:"CoralMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/7120/images/3/3-1700038943-1738291483.png",downloadUrl:"https://www.nexusmods.com/coralisland/mods/3",sourceUrl:"https://www.nexusmods.com/coralisland/mods/3"},

  // ===== Hardspace Shipbreaker =====
  { title:"More Ship Types",game:"Hardspace: Shipbreaker",gameGenre:"محاكاة",category:"محتوى جديد",description:"يُضيف 8 أنواع سفن جديدة بتصاميم وتحديات تفكيك مختلفة تنوّع الجلسات.",version:"1.0",author:"ShipMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/4184/images/2/2-1625038943-1736291847.png",downloadUrl:"https://www.nexusmods.com/hardspaceshipbreaker/mods/2",sourceUrl:"https://www.nexusmods.com/hardspaceshipbreaker/mods/2"},
];

let added = 0, skipped = 0;
console.log(`\nسيتم إضافة ${mods.length} مود...\n`);

for (const mod of mods) {
  const exists = await db.execute({ sql: "SELECT id FROM mods WHERE title = ? AND game = ? LIMIT 1", args: [mod.title, mod.game] });
  if (exists.rows.length > 0) { console.log(`⏭ ${mod.title}`); skipped++; continue; }
  await db.execute({
    sql: `INSERT INTO mods (title, slug, game, game_genre, category, description, version, author, image_url, download_url, source_url, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', datetime('now'))`,
    args: [mod.title, slug(mod.title,mod.game), mod.game, mod.gameGenre, mod.category, mod.description, mod.version||null, mod.author, mod.imageUrl||null, mod.downloadUrl, mod.sourceUrl||null]
  });
  console.log(`✅ ${mod.title} (${mod.game})`);
  added++;
}

console.log(`\n=== النتيجة النهائية ===`);
console.log(`✅ أُضيف: ${added} | ⏭ تكرار: ${skipped}`);
const total = await db.execute("SELECT COUNT(*) as cnt FROM mods WHERE status='approved'");
const games = await db.execute("SELECT COUNT(DISTINCT game) as cnt FROM mods WHERE status='approved'");
console.log(`📦 الإجمالي: ${total.rows[0].cnt} مود`);
console.log(`🎮 عدد الألعاب: ${games.rows[0].cnt} لعبة`);
process.exit(0);
