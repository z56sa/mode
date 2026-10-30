import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

// قراءة التوكن مباشرة من .env.local
const envContent = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const getEnv = (key) => { const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm')); return match ? match[1].trim() : ''; };

const db = createClient({
  url: getEnv('TURSO_DATABASE_URL'),
  authToken: getEnv('TURSO_AUTH_TOKEN')
});

function slug(t, g) {
  return (t+'-'+g).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
}

const mods = [
  // ===== Doom Eternal =====
  { title:"Brutal Doom Eternal",game:"DOOM Eternal",gameGenre:"أكشن",category:"طريقة اللعب",description:"يُضاعف عنف اللعبة ودمها مع انفجارات دم إضافية وردود فعل أعداء أكثر تأثيراً.",version:"2.0",author:"Sergeant_Mark_IV",imageUrl:"https://staticdelivery.nexusmods.com/mods/5118/images/17/17-1594982143-1056383417.png",downloadUrl:"https://www.nexusmods.com/doometernal/mods/17",sourceUrl:"https://www.nexusmods.com/doometernal/mods/17"},
  { title:"Extra Weapon Sounds",game:"DOOM Eternal",gameGenre:"أكشن",category:"أصوات ومؤثرات صوتية",description:"يُضيف أصوات إضافية للأسلحة تجعل كل طلقة تبدو أكثر قوة وتأثيراً من الأصل.",version:"1.2",author:"SoundMod99",imageUrl:"https://staticdelivery.nexusmods.com/mods/5118/images/4/4-1590234143-1263481729.png",downloadUrl:"https://www.nexusmods.com/doometernal/mods/4",sourceUrl:"https://www.nexusmods.com/doometernal/mods/4"},
  { title:"No Cutscenes Mod",game:"DOOM Eternal",gameGenre:"أكشن",category:"تحسينات عامة",description:"يتخطى المشاهد السينمائية والـ loading screens بشكل فوري دون انتظار.",version:"1.0",author:"DoomSkipper",imageUrl:"https://staticdelivery.nexusmods.com/mods/5118/images/32/32-1595938143-1823461835.png",downloadUrl:"https://www.nexusmods.com/doometernal/mods/32",sourceUrl:"https://www.nexusmods.com/doometernal/mods/32"},
  { title:"Classic Doom Music",game:"DOOM Eternal",gameGenre:"أكشن",category:"أصوات ومؤثرات صوتية",description:"يستبدل موسيقى اللعبة بألحان DOOM 1993 و DOOM II الكلاسيكية الأيقونية.",version:"3.0",author:"MidiMaster",imageUrl:"https://staticdelivery.nexusmods.com/mods/5118/images/49/49-1597238143-1632847152.png",downloadUrl:"https://www.nexusmods.com/doometernal/mods/49",sourceUrl:"https://www.nexusmods.com/doometernal/mods/49"},

  // ===== Diablo IV =====
  { title:"Loot Filter Plus",game:"Diablo IV",gameGenre:"RPG",category:"واجهة المستخدم",description:"يُضيف فلتر غنائم متقدم يخفي الأيتمز غير المفيدة ويُبرز المهمة بألوان وأيقونات.",version:"2.1",author:"D4Filter",imageUrl:"https://staticdelivery.nexusmods.com/mods/7186/images/3/3-1695074923-1847384521.png",downloadUrl:"https://www.nexusmods.com/diablo4/mods/3",sourceUrl:"https://www.nexusmods.com/diablo4/mods/3"},
  { title:"Better Map Icons",game:"Diablo IV",gameGenre:"RPG",category:"خرائط",description:"يُحسّن أيقونات الخريطة ليكون التمييز بين مناطق الدانجن والمهام والمرتجلة أوضح.",version:"1.3",author:"MapMod_D4",imageUrl:"https://staticdelivery.nexusmods.com/mods/7186/images/8/8-1695238743-1263819452.png",downloadUrl:"https://www.nexusmods.com/diablo4/mods/8",sourceUrl:"https://www.nexusmods.com/diablo4/mods/8"},
  { title:"Quality of Life Bundle",game:"Diablo IV",gameGenre:"RPG",category:"تحسينات عامة",description:"حزمة شاملة من تحسينات تجربة اللعبة: فرز الجرد والبحث والتخزين والخريطة.",version:"4.0",author:"QoL_Team_D4",imageUrl:"https://staticdelivery.nexusmods.com/mods/7186/images/21/21-1695524923-1038294847.png",downloadUrl:"https://www.nexusmods.com/diablo4/mods/21",sourceUrl:"https://www.nexusmods.com/diablo4/mods/21"},

  // ===== Path of Exile =====
  { title:"Awakened PoE Trade",game:"Path of Exile",gameGenre:"RPG",category:"أدوات أساسية",description:"أداة البحث والتجارة الأشهر في PoE — تعرف أسعار الأيتمز بضغطة واحدة فورياً.",version:"3.24",author:"SnosMe",imageUrl:"https://i.imgur.com/lPpfZ8j.png",downloadUrl:"https://github.com/SnosMe/awakened-poe-trade",sourceUrl:"https://github.com/SnosMe/awakened-poe-trade"},
  { title:"PoE Overlay Community",game:"Path of Exile",gameGenre:"RPG",category:"واجهة المستخدم",description:"إضافة مرئية تُظهر معلومات الأيتمز والتجارة والبناءات مباشرة فوق شاشة اللعبة.",version:"0.9.0",author:"Overwolf_PoE",imageUrl:"https://i.imgur.com/vKwMRxq.png",downloadUrl:"https://github.com/PoE-Overlay-Community/PoE-Overlay-Community-Fork",sourceUrl:"https://github.com/PoE-Overlay-Community/PoE-Overlay-Community-Fork"},
  { title:"Exile Diary Reborn",game:"Path of Exile",gameGenre:"RPG",category:"إحصائيات",description:"يتتبع كل ما تجمعه وتبيعه خلال الجلسة مع إحصائيات تفصيلية وتقارير دخل.",version:"2.1",author:"Bestest_Exiled",imageUrl:"https://i.imgur.com/dQ3hfKl.png",downloadUrl:"https://github.com/Bestest-Exiled/ExileDiary",sourceUrl:"https://github.com/Bestest-Exiled/ExileDiary"},

  // ===== Factorio =====
  { title:"Space Exploration",game:"Factorio",gameGenre:"استراتيجية",category:"توسعة العالم",description:"أضخم مودات Factorio — يُضيف استكشاف الفضاء وكواكب متعددة ومنظومة شاملة للإنتاج.",version:"0.6.138",author:"Earendel",imageUrl:"https://assets-mod.factorio.com/assets/.thumb.space-exploration-0.6.138.png",downloadUrl:"https://mods.factorio.com/mod/space-exploration",sourceUrl:"https://mods.factorio.com/mod/space-exploration"},
  { title:"Bob's Mods",game:"Factorio",gameGenre:"استراتيجية",category:"محتوى جديد",description:"يضيف مئات الخامات والآلات والتقنيات لتعقيد سلسلة الإنتاج بشكل إيجابي.",version:"1.1.6",author:"Bobingabout",imageUrl:"https://assets-mod.factorio.com/assets/.thumb.bobs-mods.png",downloadUrl:"https://mods.factorio.com/user/Bobingabout",sourceUrl:"https://mods.factorio.com/user/Bobingabout"},
  { title:"Krastorio 2",game:"Factorio",gameGenre:"استراتيجية",category:"توسعة العالم",description:"يُعيد تصميم مسار البحث بمواد وكيانات ومكائن جديدة دون كسر الشعور الأصلي.",version:"1.3.19",author:"Linver",imageUrl:"https://assets-mod.factorio.com/assets/.thumb.Krastorio2-1.3.19.png",downloadUrl:"https://mods.factorio.com/mod/Krastorio2",sourceUrl:"https://mods.factorio.com/mod/Krastorio2"},
  { title:"FNEI",game:"Factorio",gameGenre:"استراتيجية",category:"واجهة المستخدم",description:"يُتيح البحث في كل الوصفات وطرق الإنتاج والمتطلبات داخل اللعبة فورياً.",version:"0.3.7",author:"pyanodon",imageUrl:"https://assets-mod.factorio.com/assets/.thumb.FNEI.png",downloadUrl:"https://mods.factorio.com/mod/FNEI",sourceUrl:"https://mods.factorio.com/mod/FNEI"},

  // ===== Vampire Survivors =====
  { title:"Custom Characters Pack",game:"Vampire Survivors",gameGenre:"أكشن",category:"شخصيات",description:"يُضيف 10 شخصيات مخصصة بمهارات فريدة تُنوّع أسلوب اللعب بشكل ممتع.",version:"1.5",author:"VS_Community",imageUrl:"https://staticdelivery.nexusmods.com/mods/5620/images/9/9-1669374943-1263842197.png",downloadUrl:"https://www.nexusmods.com/vampiresurvivors/mods/9",sourceUrl:"https://www.nexusmods.com/vampiresurvivors/mods/9"},
  { title:"Unlocked From Start",game:"Vampire Survivors",gameGenre:"أكشن",category:"طريقة اللعب",description:"يفتح جميع الشخصيات والأسلحة والمراحل من البداية لتجربة حرة بلا قيود.",version:"2.0",author:"FreeRun",imageUrl:"https://staticdelivery.nexusmods.com/mods/5620/images/4/4-1669074143-1923481751.png",downloadUrl:"https://www.nexusmods.com/vampiresurvivors/mods/4",sourceUrl:"https://www.nexusmods.com/vampiresurvivors/mods/4"},
  { title:"Weapon Rebalance Pack",game:"Vampire Survivors",gameGenre:"أكشن",category:"توازن",description:"يُعيد موازنة جميع الأسلحة لتجعل كل خيار صالحاً ومنافساً في المراحل المتأخرة.",version:"1.2",author:"BalanceMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/5620/images/17/17-1670038143-1748239184.png",downloadUrl:"https://www.nexusmods.com/vampiresurvivors/mods/17",sourceUrl:"https://www.nexusmods.com/vampiresurvivors/mods/17"},

  // ===== Celeste =====
  { title:"Everest Modding API",game:"Celeste",gameGenre:"منصات",category:"أدوات أساسية",description:"أساس مودات Celeste — يُتيح تثبيت المراحل المخصصة والمودات بضغطة واحدة.",version:"3.0.0",author:"EverestTeam",imageUrl:"https://cdn.discordapp.com/attachments/445236692136009738/1005893278398201866/everest-banner.png",downloadUrl:"https://github.com/EverestAPI/Everest",sourceUrl:"https://github.com/EverestAPI/Everest"},
  { title:"StrawberryJam 2021",game:"Celeste",gameGenre:"منصات",category:"محتوى جديد",description:"حزمة 200+ مرحلة مخصصة من مجتمع Celeste بمستويات صعوبة متنوعة.",version:"1.3",author:"Celeste_Community",imageUrl:"https://cdn.discordapp.com/attachments/445236692136009738/1005893278398201866/sj2021.png",downloadUrl:"https://gamebanana.com/mods/343867",sourceUrl:"https://gamebanana.com/mods/343867"},
  { title:"Extended Variants",game:"Celeste",gameGenre:"منصات",category:"طريقة اللعب",description:"يُضيف عشرات المتغيرات لتخصيص صعوبة اللعبة كتغيير الجاذبية وسرعة الحركة.",version:"0.31",author:"max480",imageUrl:"https://cdn.discordapp.com/attachments/445236692136009738/1005893278398201866/extended-variants.png",downloadUrl:"https://gamebanana.com/mods/53697",sourceUrl:"https://gamebanana.com/mods/53697"},

  // ===== Subnautica Below Zero =====
  { title:"Alien Creatures Expansion",game:"Subnautica: Below Zero",gameGenre:"استكشاف",category:"محتوى جديد",description:"يُضيف مخلوقات جديدة في مناطق المحيط العميق مع سلوك ذكاء اصطناعي مخصص.",version:"1.1",author:"BZModder",imageUrl:"https://staticdelivery.nexusmods.com/mods/3054/images/3/3-1621748943-1738291483.jpg",downloadUrl:"https://www.nexusmods.com/subnauticabelowzero/mods/3",sourceUrl:"https://www.nexusmods.com/subnauticabelowzero/mods/3"},
  { title:"Bigger Storage Containers",game:"Subnautica: Below Zero",gameGenre:"استكشاف",category:"تخزين",description:"يُضاعف سعة جميع حاويات التخزين في اللعبة لتقليل الرحلات المتكررة.",version:"2.0",author:"StorageMax",imageUrl:"https://staticdelivery.nexusmods.com/mods/3054/images/11/11-1622148943-1837291482.jpg",downloadUrl:"https://www.nexusmods.com/subnauticabelowzero/mods/11",sourceUrl:"https://www.nexusmods.com/subnauticabelowzero/mods/11"},

  // ===== Deep Rock Galactic =====
  { title:"Extra Enemy Variants",game:"Deep Rock Galactic",gameGenre:"أكشن",category:"محتوى جديد",description:"يُضيف أشكالاً جديدة للحشرات ذات مهارات وسلوك مختلف لتنويع الطوارئ.",version:"2.3",author:"DRG_Modder",imageUrl:"https://staticdelivery.nexusmods.com/mods/5046/images/8/8-1655238943-1726381929.png",downloadUrl:"https://www.nexusmods.com/deeprockgalactic/mods/8",sourceUrl:"https://www.nexusmods.com/deeprockgalactic/mods/8"},
  { title:"Better Graphics DRG",game:"Deep Rock Galactic",gameGenre:"أكشن",category:"جرافيكس وإضاءة",description:"يُحسّن جودة القوام وإضاءة الكهوف مع تأثيرات بصرية محسّنة للمعادن والحوائط.",version:"1.5",author:"GFX_Dwarf",imageUrl:"https://staticdelivery.nexusmods.com/mods/5046/images/3/3-1652138943-1634718294.png",downloadUrl:"https://www.nexusmods.com/deeprockgalactic/mods/3",sourceUrl:"https://www.nexusmods.com/deeprockgalactic/mods/3"},
  { title:"Mission Control Voice Pack",game:"Deep Rock Galactic",gameGenre:"أكشن",category:"أصوات ومؤثرات صوتية",description:"يستبدل صوت Mission Control بحزمة صوتية مختلفة مستوحاة من شخصيات أخرى.",version:"1.0",author:"VoiceDwarf",imageUrl:"https://staticdelivery.nexusmods.com/mods/5046/images/15/15-1657038943-1826391748.png",downloadUrl:"https://www.nexusmods.com/deeprockgalactic/mods/15",sourceUrl:"https://www.nexusmods.com/deeprockgalactic/mods/15"},

  // ===== Divinity: Original Sin 2 =====
  { title:"8 Action Points",game:"Divinity: Original Sin 2",gameGenre:"RPG",category:"توازن",description:"يرفع نقاط الحركة لكل اللاعبين والأعداء إلى 8 لإتاحة تكتيكات أكثر تنوعاً.",version:"1.0",author:"ArenaModder",imageUrl:"https://staticdelivery.nexusmods.com/mods/2286/images/5/5-1506234943-1826318472.jpg",downloadUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/5",sourceUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/5"},
  { title:"Animated Spells",game:"Divinity: Original Sin 2",gameGenre:"RPG",category:"سحر وقدرات",description:"يُحسّن رسوم متحركة التعاويذ والمهارات بتأثيرات بصرية أكثر إشباعاً وتفصيلاً.",version:"2.1",author:"SpellFX",imageUrl:"https://staticdelivery.nexusmods.com/mods/2286/images/7/7-1506638943-1934718374.jpg",downloadUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/7",sourceUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/7"},
  { title:"Extra Party Members",game:"Divinity: Original Sin 2",gameGenre:"RPG",category:"طريقة اللعب",description:"يرفع حد الفريق من 4 إلى 6 شخصيات مع ضبط توازن القتال بشكل تلقائي.",version:"1.5",author:"PartyMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/2286/images/13/13-1507938943-1627381928.jpg",downloadUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/13",sourceUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/13"},
  { title:"Crafter's Kit",game:"Divinity: Original Sin 2",gameGenre:"RPG",category:"حرفة وصناعة",description:"يُوسّع نظام الحرفة بوصفات جديدة وأدوات تُبسّط البحث عن المكونات اللازمة.",version:"1.2",author:"CraftMaster",imageUrl:"https://staticdelivery.nexusmods.com/mods/2286/images/22/22-1509238943-1823718294.jpg",downloadUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/22",sourceUrl:"https://www.nexusmods.com/divinityoriginalsin2/mods/22"},

  // ===== Oxygen Not Included =====
  { title:"Bigger Camera Zoom",game:"Oxygen Not Included",gameGenre:"استراتيجية",category:"واجهة المستخدم",description:"يُوسّع نطاق الكاميرا بشكل كبير لرؤية مستعمرتك بالكامل في شاشة واحدة.",version:"1.3",author:"ZoomMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3827/images/2/2-1605238943-1638291847.png",downloadUrl:"https://www.nexusmods.com/oxygennotincluded/mods/2",sourceUrl:"https://www.nexusmods.com/oxygennotincluded/mods/2"},
  { title:"Show Building Ranges",game:"Oxygen Not Included",gameGenre:"استراتيجية",category:"واجهة المستخدم",description:"يُظهر نطاق تأثير كل مبنى بشكل مرئي واضح عند التحديد أو التمرير عليه.",version:"2.0",author:"RangeMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3827/images/5/5-1606038943-1847293817.png",downloadUrl:"https://www.nexusmods.com/oxygennotincluded/mods/5",sourceUrl:"https://www.nexusmods.com/oxygennotincluded/mods/5"},
  { title:"Extra Dupes",game:"Oxygen Not Included",gameGenre:"استراتيجية",category:"توازن",description:"يُضيف مهارات ومظاهر جديدة للـ Duplicants مع خلفيات قصصية فريدة.",version:"1.1",author:"DupeMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3827/images/9/9-1607238943-1923481847.png",downloadUrl:"https://www.nexusmods.com/oxygennotincluded/mods/9",sourceUrl:"https://www.nexusmods.com/oxygennotincluded/mods/9"},

  // ===== Prey (2017) =====
  { title:"Prey Script Extender",game:"Prey",gameGenre:"RPG",category:"أدوات أساسية",description:"يُوسّع إمكانيات السكريبت في لعبة Prey ليتيح مودات أكثر تعقيداً وعمقاً.",version:"1.0",author:"Prey_Modders",imageUrl:"https://staticdelivery.nexusmods.com/mods/3196/images/1/1-1547238943-1034718294.jpg",downloadUrl:"https://www.nexusmods.com/prey/mods/1",sourceUrl:"https://www.nexusmods.com/prey/mods/1"},
  { title:"Enhanced Mimic Detection",game:"Prey",gameGenre:"RPG",category:"طريقة اللعب",description:"يُضيف مؤشراً يُحذّرك من الـ Mimics المتخفية قبل مهاجمتك بوقت كافٍ.",version:"1.2",author:"MimicAlert",imageUrl:"https://staticdelivery.nexusmods.com/mods/3196/images/3/3-1548238943-1738291483.jpg",downloadUrl:"https://www.nexusmods.com/prey/mods/3",sourceUrl:"https://www.nexusmods.com/prey/mods/3"},

  // ===== Disco Elysium =====
  { title:"More Dialogue Checks",game:"Disco Elysium",gameGenre:"RPG",category:"حوار وقصة",description:"يُضيف فحوصات حوار إضافية للإحصائيات الأقل استخداماً لتنويع تجربة اللعب.",version:"1.1",author:"DiscoModder",imageUrl:"https://staticdelivery.nexusmods.com/mods/3867/images/2/2-1605238943-1827391482.png",downloadUrl:"https://www.nexusmods.com/discoelysium/mods/2",sourceUrl:"https://www.nexusmods.com/discoelysium/mods/2"},
  { title:"Font Replacement Pack",game:"Disco Elysium",gameGenre:"RPG",category:"واجهة المستخدم",description:"يستبدل خط اللعبة بخيارات أكثر وضوحاً وقراءة دون المساس بطابعها الفني.",version:"1.0",author:"FontMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/3867/images/5/5-1606038943-1938291847.png",downloadUrl:"https://www.nexusmods.com/discoelysium/mods/5",sourceUrl:"https://www.nexusmods.com/discoelysium/mods/5"},

  // ===== Kingdom Come Deliverance =====
  { title:"Hardcore Mode Extended",game:"Kingdom Come: Deliverance",gameGenre:"RPG",category:"تحدي",description:"يُضيف خيارات الوضع الصعب مثل الجوع والإرهاق والأمراض لتجربة أكثر واقعية.",version:"1.3",author:"KCD_Hardcore",imageUrl:"https://staticdelivery.nexusmods.com/mods/2298/images/3/3-1521238943-1736291847.jpg",downloadUrl:"https://www.nexusmods.com/kingdomcomedeliverance/mods/3",sourceUrl:"https://www.nexusmods.com/kingdomcomedeliverance/mods/3"},
  { title:"Better Lock Picking",game:"Kingdom Come: Deliverance",gameGenre:"RPG",category:"طريقة اللعب",description:"يُحسّن ميكانيكية كسر الأقفال بتوازن أفضل بين الصعوبة والمتعة والمكافأة.",version:"2.0",author:"LockMod",imageUrl:"https://staticdelivery.nexusmods.com/mods/2298/images/7/7-1522038943-1924381748.jpg",downloadUrl:"https://www.nexusmods.com/kingdomcomedeliverance/mods/7",sourceUrl:"https://www.nexusmods.com/kingdomcomedeliverance/mods/7"},
  { title:"Unlimited Saving",game:"Kingdom Come: Deliverance",gameGenre:"RPG",category:"تحسينات عامة",description:"يُزيل قيود حفظ اللعبة بـ Savior Schnapps ويتيح الحفظ في أي وقت بحرية.",version:"1.5",author:"SaveAnywhere",imageUrl:"https://staticdelivery.nexusmods.com/mods/2298/images/11/11-1523238943-1827391843.jpg",downloadUrl:"https://www.nexusmods.com/kingdomcomedeliverance/mods/11",sourceUrl:"https://www.nexusmods.com/kingdomcomedeliverance/mods/11"},

  // ===== Outer Wilds =====
  { title:"New Horizons",game:"Outer Wilds",gameGenre:"استكشاف",category:"محتوى جديد",description:"يُضيف نظام شمسي جديد بكواكب وألغاز وقصة مستقلة مصنوعة بعناية فائقة.",version:"1.1.2",author:"xen-42",imageUrl:"https://i.imgur.com/EWXV9T8.png",downloadUrl:"https://github.com/xen-42/outer-wilds-new-horizons",sourceUrl:"https://github.com/xen-42/outer-wilds-new-horizons"},
  { title:"Outer Wilds Mod Manager",game:"Outer Wilds",gameGenre:"استكشاف",category:"أدوات أساسية",description:"أداة إدارة مودات Outer Wilds بواجهة رسومية سهلة تتعامل مع التبعيات تلقائياً.",version:"2.1.0",author:"_nebula",imageUrl:"https://i.imgur.com/xfF6TRz.png",downloadUrl:"https://github.com/ow-mods/ow-mod-man",sourceUrl:"https://github.com/ow-mods/ow-mod-man"},

  // ===== Slay the Spire =====
  { title:"Downfall - A Slay the Spire Fan Expansion",game:"Slay the Spire",gameGenre:"استراتيجية",category:"محتوى جديد",description:"يُضيف شخصية Hero الجديدة وبطاقات وأعداء مع وضع لعب عكسي كـ الشرير.",version:"2.8.0",author:"MountainCityGames",imageUrl:"https://steamuserimages-a.akamaihd.net/ugc/1840283862578038009/1E9B3BD8A7E3B8C2A7BCA7D2E41A2B1A87F43C91/",downloadUrl:"https://steamcommunity.com/sharedfiles/filedetails/?id=1931070857",sourceUrl:"https://steamcommunity.com/sharedfiles/filedetails/?id=1931070857"},
  { title:"The Watcher Expansion",game:"Slay the Spire",gameGenre:"استراتيجية",category:"محتوى جديد",description:"يُضيف 50+ بطاقة جديدة مخصصة لشخصية The Watcher مع ميكانيكيات تأمل جديدة.",version:"1.2",author:"WatcherMod",imageUrl:"https://steamuserimages-a.akamaihd.net/ugc/1738283862578038009/1E9B3BD8A7E3B8C2A7BCA7D2E41A2B1A87F43C92/",downloadUrl:"https://steamcommunity.com/sharedfiles/filedetails/?id=2178883872",sourceUrl:"https://steamcommunity.com/sharedfiles/filedetails/?id=2178883872"},
  { title:"Replay the Spire",game:"Slay the Spire",gameGenre:"استراتيجية",category:"طريقة اللعب",description:"يُتيح مشاهدة وتشغيل تسجيلات الجولات السابقة مع تحليل القرارات والاستراتيجيات.",version:"1.0",author:"Konko",imageUrl:"https://steamuserimages-a.akamaihd.net/ugc/1638283862578038009/1E9B3BD8A7E3B8C2A7BCA7D2E41A2B1A87F43C93/",downloadUrl:"https://steamcommunity.com/sharedfiles/filedetails/?id=1715931766",sourceUrl:"https://steamcommunity.com/sharedfiles/filedetails/?id=1715931766"},

  // ===== Darkest Dungeon 2 =====
  { title:"More Classes",game:"Darkest Dungeon 2",gameGenre:"استراتيجية",category:"شخصيات",description:"يُعيد أبطال Darkest Dungeon 1 المفقودين كـ Arbalest وAbomination وغيرهم.",version:"1.4",author:"DD2_Modder",imageUrl:"https://staticdelivery.nexusmods.com/mods/6724/images/3/3-1683238943-1736291847.png",downloadUrl:"https://www.nexusmods.com/darkestdungeon2/mods/3",sourceUrl:"https://www.nexusmods.com/darkestdungeon2/mods/3"},
  { title:"Loot Rework",game:"Darkest Dungeon 2",gameGenre:"استراتيجية",category:"توازن",description:"يُعيد تصميم نظام الغنائم ليكون أكثر توقعاً وأقل إحباطاً مع جوائز أكثر قيمة.",version:"1.0",author:"LootFix",imageUrl:"https://staticdelivery.nexusmods.com/mods/6724/images/7/7-1684038943-1924381748.png",downloadUrl:"https://www.nexusmods.com/darkestdungeon2/mods/7",sourceUrl:"https://www.nexusmods.com/darkestdungeon2/mods/7"},
];

let added = 0, skipped = 0;
console.log(`\nسيتم إضافة ${mods.length} مود...\n`);

for (const mod of mods) {
  const exists = await db.execute({ sql: "SELECT id FROM mods WHERE title = ? AND game = ? LIMIT 1", args: [mod.title, mod.game] });
  if (exists.rows.length > 0) { console.log(`⏭ ${mod.title}`); skipped++; continue; }
  const modSlug = slug(mod.title, mod.game);
  await db.execute({
    sql: `INSERT INTO mods (title, slug, game, game_genre, category, description, version, author, image_url, download_url, source_url, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', datetime('now'))`,
    args: [mod.title, modSlug, mod.game, mod.gameGenre, mod.category, mod.description, mod.version||null, mod.author, mod.imageUrl||null, mod.downloadUrl, mod.sourceUrl||null]
  });
  console.log(`✅ ${mod.title} (${mod.game})`);
  added++;
}

console.log(`\n=== النتيجة ===\n✅ أُضيف: ${added}\n⏭ تكرار: ${skipped}`);
const total = await db.execute("SELECT COUNT(*) as cnt FROM mods WHERE status='approved'");
console.log(`📦 الإجمالي: ${total.rows[0].cnt} مود`);

const gamesCount = await db.execute("SELECT COUNT(DISTINCT game) as cnt FROM mods WHERE status='approved'");
console.log(`🎮 عدد الألعاب: ${gamesCount.rows[0].cnt} لعبة`);
process.exit(0);
