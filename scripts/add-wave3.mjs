import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://mode-knook9.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTU2ODAsImlkIjoiMDFhMTdjYjMtZTgwMS03MDNiLWE3NDMtYzI0Mzc2YjgzNTdhIiwia2lkIjoiUHFmNXBLOTFNenFGVExIbENOa2ZpenJRWXMweFNYQ2dtenh6NkZ3bTVYRSIsInJpZCI6IjYzN2NhZWE5LWVkNTgtNDVkZS1iNDE5LWU3ZGVhMDhmY2UxMSJ9.nr3uKRlNd5ZqrM0GCZpB8EmZ_JWBeNEdcRkG2aRILsS4ITOaDFy6MOkGSPvqoSGL_ThzdeXtSjtP3C0c4JH6Bg'
});

function slug(title, game) {
  return (title + '-' + game).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

const mods = [
  // ===== Skyrim SE — المزيد =====
  { title: "Enhanced Lights and FX", game: "The Elder Scrolls V: Skyrim Special Edition", gameGenre: "RPG", category: "جرافيكس وإضاءة", description: "يُعيد تصميم نظام الإضاءة في المداخل والكهوف بجعلها أكثر واقعية وغموضاً.", version: "3.0.5", author: "anamorfus", imageUrl: "https://staticdelivery.nexusmods.com/mods/1704/images/1377/1377-1462989890-1699478011.jpg", downloadUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/1377", sourceUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/1377" },
  { title: "Interesting NPCs", game: "The Elder Scrolls V: Skyrim Special Edition", gameGenre: "RPG", category: "شخصيات", description: "يضيف 250+ شخصية جديدة بأحداث وحوار واسع النطاق كأن كل واحد له قصة حقيقية.", version: "4.3.9", author: "Kris Takahashi", imageUrl: "https://staticdelivery.nexusmods.com/mods/1704/images/29194/29194-1504468437-1483975143.jpg", downloadUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/29194", sourceUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/29194" },
  { title: "Apocalypse - Magic of Skyrim", game: "The Elder Scrolls V: Skyrim Special Edition", gameGenre: "RPG", category: "سحر وقدرات", description: "يضيف 155 تعويذة سحرية فريدة ومتوازنة تتناسب مع أسلوب كل مستخدم للسحر.", version: "9.45.0", author: "EnaiSiaion", imageUrl: "https://staticdelivery.nexusmods.com/mods/1704/images/1090/1090-1462562143-540680065.jpg", downloadUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/1090", sourceUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/1090" },
  { title: "Vivid Weathers Definitive Edition", game: "The Elder Scrolls V: Skyrim Special Edition", gameGenre: "RPG", category: "طقس وبيئة", description: "يُعيد تصميم الطقس بالكامل بـ 359+ نمط مناخي متنوع وتأثيرات ضوء طبيعية.", version: "1.5.0", author: "Mangaclub", imageUrl: "https://staticdelivery.nexusmods.com/mods/1704/images/2187/2187-1560946839-1940476015.jpg", downloadUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/2187", sourceUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/2187" },
  { title: "Serana Dialogue Add-On", game: "The Elder Scrolls V: Skyrim Special Edition", gameGenre: "RPG", category: "حوار وقصة", description: "يُضيف ألف+ حوار لـ Serana تجعلها رفيقة حية حقيقية تتفاعل مع العالم والأحداث.", version: "4.5.2", author: "winzarten", imageUrl: "https://staticdelivery.nexusmods.com/mods/1704/images/32161/32161-1600038482-1832453213.jpg", downloadUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/32161", sourceUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/32161" },
  { title: "Legacy of the Dragonborn", game: "The Elder Scrolls V: Skyrim Special Edition", gameGenre: "RPG", category: "محتوى جديد", description: "يضيف متحفاً ضخماً لعرض كل مقتنياتك مع محتوى ومهام وشخصيات لا نهائية.", version: "5.8.5", author: "icecreamassassin", imageUrl: "https://staticdelivery.nexusmods.com/mods/1704/images/11802/11802-1636127475-1478047278.jpg", downloadUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/11802", sourceUrl: "https://www.nexusmods.com/skyrimspecialedition/mods/11802" },

  // ===== Fallout 4 — المزيد =====
  { title: "Horizon", game: "Fallout 4", gameGenre: "RPG", category: "توازن وصعوبة", description: "مود توازن شامل يُعيد تصميم الاقتصاد والبقاء والحرفة والقتال بمنطق واقعي.", version: "1.8.7", author: "zawinul", imageUrl: "https://staticdelivery.nexusmods.com/mods/1151/images/17374/17374-1467222879-2073488344.jpg", downloadUrl: "https://www.nexusmods.com/fallout4/mods/17374", sourceUrl: "https://www.nexusmods.com/fallout4/mods/17374" },
  { title: "Start Me Up", game: "Fallout 4", gameGenre: "RPG", category: "طريقة اللعب", description: "يتيح بدء Fallout 4 بدون مشهد المقدمة الطويل مع خيار تعديل قصة الشخصية.", version: "1.0.4", author: "kinggath", imageUrl: "https://staticdelivery.nexusmods.com/mods/1151/images/18946/18946-1470785543-1993034527.jpg", downloadUrl: "https://www.nexusmods.com/fallout4/mods/18946", sourceUrl: "https://www.nexusmods.com/fallout4/mods/18946" },
  { title: "Place Everywhere", game: "Fallout 4", gameGenre: "RPG", category: "بناء وتطوير", description: "يُزيل جميع قيود وضع المباني في وضع البناء — ضعها أينما تريد وبأي زاوية.", version: "1.22.0", author: "TheLich", imageUrl: "https://staticdelivery.nexusmods.com/mods/1151/images/9424/9424-1456088649-1832403752.jpg", downloadUrl: "https://www.nexusmods.com/fallout4/mods/9424", sourceUrl: "https://www.nexusmods.com/fallout4/mods/9424" },

  // ===== GTA V — المزيد =====
  { title: "World of Variety", game: "Grand Theft Auto V", gameGenre: "أكشن", category: "طريقة اللعب", description: "يضيف مئات الأحداث العشوائية والسيناريوهات للعالم المفتوح لجعله حياً ومتنوعاً.", version: "3.0.2", author: "TheMadBreaker", imageUrl: "https://staticdelivery.nexusmods.com/mods/1456/images/16607/16607-1547840082-1820482049.jpg", downloadUrl: "https://www.nexusmods.com/gtav/mods/16607", sourceUrl: "https://www.nexusmods.com/gtav/mods/16607" },
  { title: "Realistic Driving V", game: "Grand Theft Auto V", gameGenre: "أكشن", category: "واقعية", description: "يُعيد فيزياء القيادة لتكون أكثر واقعية مع التحكم في الانزلاق وردود الفعل.", version: "2.8.0", author: "killatomate", imageUrl: "https://staticdelivery.nexusmods.com/mods/1456/images/1478/1478-1489343862-1948398032.jpg", downloadUrl: "https://www.nexusmods.com/gtav/mods/1478", sourceUrl: "https://www.nexusmods.com/gtav/mods/1478" },
  { title: "Open All Interiors", game: "Grand Theft Auto V", gameGenre: "أكشن", category: "استكشاف", description: "يفتح جميع المباني والمداخل المغلقة في GTA V لاستكشافها بحرية تامة.", version: "4.3.0", author: "NewTheft", imageUrl: "https://staticdelivery.nexusmods.com/mods/1456/images/4932/4932-1430246773-791254278.jpg", downloadUrl: "https://www.nexusmods.com/gtav/mods/4932", sourceUrl: "https://www.nexusmods.com/gtav/mods/4932" },

  // ===== Cyberpunk 2077 — المزيد =====
  { title: "Judy Romanced Enhanced", game: "Cyberpunk 2077", gameGenre: "RPG", category: "حوار وقصة", description: "يوسع علاقة V مع Judy بحوارات ومشاهد ومواقف جديدة على مدار اللعبة.", version: "2.1.0", author: "deceptious", imageUrl: "https://staticdelivery.nexusmods.com/mods/3333/images/4137/4137-1619082643-1935286194.png", downloadUrl: "https://www.nexusmods.com/cyberpunk2077/mods/4137", sourceUrl: "https://www.nexusmods.com/cyberpunk2077/mods/4137" },
  { title: "Body Mods - Arm Cyberware Overhaul", game: "Cyberpunk 2077", gameGenre: "RPG", category: "شخصيات", description: "يُعيد تصميم تحسينات الذراع السيبرانية بأنظمة حركة وتأثيرات بصرية محسّنة.", version: "1.5.0", author: "LazyMods", imageUrl: "https://staticdelivery.nexusmods.com/mods/3333/images/14895/14895-1658068213-1743985241.png", downloadUrl: "https://www.nexusmods.com/cyberpunk2077/mods/14895", sourceUrl: "https://www.nexusmods.com/cyberpunk2077/mods/14895" },

  // ===== Baldur's Gate 3 — المزيد =====
  { title: "5e Spells", game: "Baldur's Gate 3", gameGenre: "RPG", category: "سحر وقدرات", description: "يضيف عشرات التعاويذ من D&D 5e الغائبة عن اللعبة الأصلية مع توازن دقيق.", version: "3.4.0", author: "Siegfried", imageUrl: "https://staticdelivery.nexusmods.com/mods/3474/images/1399/1399-1697283452-547263981.png", downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/1399", sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/1399" },
  { title: "Transmog", game: "Baldur's Gate 3", gameGenre: "RPG", category: "تخصيص", description: "يتيح تغيير مظهر الدروع مع الاحتفاظ بإحصائياتها — الأناقة لا تتعارض مع القوة.", version: "2.0.0", author: "AlanaSP", imageUrl: "https://staticdelivery.nexusmods.com/mods/3474/images/367/367-1693372459-1975043742.png", downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/367", sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/367" },
  { title: "Better Hotbar 2", game: "Baldur's Gate 3", gameGenre: "RPG", category: "واجهة المستخدم", description: "يُعيد تصميم شريط الأوامر السفلي بشكل أكثر وضوحاً وتنظيماً وسهولة استخدام.", version: "3.1.0", author: "TheRealDjmr", imageUrl: "https://staticdelivery.nexusmods.com/mods/3474/images/2347/2347-1699039846-1453289736.png", downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/2347", sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/2347" },
  { title: "Shadowheart Romance Expanded", game: "Baldur's Gate 3", gameGenre: "RPG", category: "حوار وقصة", description: "يُضيف أحداثاً ومحادثات جديدة مع Shadowheart لتعميق علاقتها مع اللاعب.", version: "1.3.0", author: "Volitio", imageUrl: "https://staticdelivery.nexusmods.com/mods/3474/images/3469/3469-1699942285-1032047619.png", downloadUrl: "https://www.nexusmods.com/baldursgate3/mods/3469", sourceUrl: "https://www.nexusmods.com/baldursgate3/mods/3469" },

  // ===== Elden Ring — المزيد =====
  { title: "Seamless Co-op", game: "Elden Ring", gameGenre: "أكشن RPG", category: "متعدد اللاعبين", description: "يُمكّن اللعب التعاوني المتواصل مع الأصدقاء في كل منطقة وزعيم دون انقطاع.", version: "1.9.4", author: "LukeYui", imageUrl: "https://staticdelivery.nexusmods.com/mods/3050/images/510/510-1650717716-1782643125.jpg", downloadUrl: "https://www.nexusmods.com/eldenring/mods/510", sourceUrl: "https://www.nexusmods.com/eldenring/mods/510" },
  { title: "Elden Ring Randomizer", game: "Elden Ring", gameGenre: "أكشن RPG", category: "عشوائية", description: "يخلط مواضع كل الأسلحة والدروع والأيتمز وحتى الزعماء لتجربة جديدة كل مرة.", version: "2.2.0", author: "thefifthmatt", imageUrl: "https://staticdelivery.nexusmods.com/mods/3050/images/428/428-1649865826-1747532658.jpg", downloadUrl: "https://www.nexusmods.com/eldenring/mods/428", sourceUrl: "https://www.nexusmods.com/eldenring/mods/428" },
  { title: "Enhanced Camera", game: "Elden Ring", gameGenre: "أكشن RPG", category: "كاميرا", description: "يُحسّن إعدادات الكاميرا والـ FOV مع إضافة وضع كاميرا أولى تجريبي.", version: "1.3.0", author: "Pav3l", imageUrl: "https://staticdelivery.nexusmods.com/mods/3050/images/1244/1244-1660239783-1074845359.jpg", downloadUrl: "https://www.nexusmods.com/eldenring/mods/1244", sourceUrl: "https://www.nexusmods.com/eldenring/mods/1244" },

  // ===== الألعاب الجديدة الكاملة =====

  // --- Spider-Man Remastered ---
  { title: "Photo Mode Unlocker", game: "Marvel's Spider-Man Remastered", gameGenre: "أكشن", category: "أدوات تحكم", description: "يُزيل قيود وضع التصوير ويُمكّن التحكم الكامل في الكاميرا والإضاءة والفلاتر.", version: "1.2.0", author: "PapaXan", imageUrl: "https://staticdelivery.nexusmods.com/mods/7097/images/31/31-1660669476-1095283521.png", downloadUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/31", sourceUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/31" },
  { title: "Symbiote Black Suit", game: "Marvel's Spider-Man Remastered", gameGenre: "أكشن", category: "شخصيات", description: "يُضيف البدلة السوداء الرمزية المستوحاة من Venom بتفاصيل بصرية مذهلة.", version: "2.0.0", author: "jedijosh920", imageUrl: "https://staticdelivery.nexusmods.com/mods/7097/images/175/175-1660909845-1026371546.png", downloadUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/175", sourceUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/175" },
  { title: "Web of Shadows Suit Pack", game: "Marvel's Spider-Man Remastered", gameGenre: "أكشن", category: "شخصيات", description: "يُضيف 6 بدلات من لعبة Web of Shadows الكلاسيكية بجودة عالية.", version: "1.5.0", author: "GatoPaint", imageUrl: "https://staticdelivery.nexusmods.com/mods/7097/images/312/312-1661246822-1056453782.png", downloadUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/312", sourceUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/312" },
  { title: "RayTracing Reshade", game: "Marvel's Spider-Man Remastered", gameGenre: "أكشن", category: "جرافيكس وإضاءة", description: "يُضيف تأثيرات ReShade مع محاكاة Ray Tracing لألوان أكثر عمقاً وإضاءة دراماتيكية.", version: "2.3.0", author: "Starfield18", imageUrl: "https://staticdelivery.nexusmods.com/mods/7097/images/58/58-1660735426-1735840627.png", downloadUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/58", sourceUrl: "https://www.nexusmods.com/marvelsspidermanremastered/mods/58" },

  // --- God of War ---
  { title: "Photo Mode Enhancement", game: "God of War", gameGenre: "أكشن", category: "أدوات تحكم", description: "يُوسّع إمكانيات وضع التصوير مع حرية كاملة في التحريك والتكبير والفلاتر.", version: "1.1.0", author: "PapaXan", imageUrl: "https://staticdelivery.nexusmods.com/mods/6473/images/19/19-1648739482-1847274639.png", downloadUrl: "https://www.nexusmods.com/godofwar/mods/19", sourceUrl: "https://www.nexusmods.com/godofwar/mods/19" },
  { title: "Young Kratos Skin", game: "God of War", gameGenre: "أكشن", category: "شخصيات", description: "يُعيد مظهر Kratos لنسخته الشابة من الثلاثية الأصلية مع لون جلد أبيض رمادي.", version: "1.0.0", author: "SilverEzredes", imageUrl: "https://staticdelivery.nexusmods.com/mods/6473/images/6/6-1648658882-1063453812.png", downloadUrl: "https://www.nexusmods.com/godofwar/mods/6", sourceUrl: "https://www.nexusmods.com/godofwar/mods/6" },
  { title: "4K Texture Pack", game: "God of War", gameGenre: "أكشن", category: "جرافيكس وإضاءة", description: "يُعيد رسم القوام الرئيسية بدقة 4K مع تحسينات دقيقة تحترم الأسلوب البصري الأصلي.", version: "1.2.0", author: "Hein84", imageUrl: "https://staticdelivery.nexusmods.com/mods/6473/images/41/41-1649123742-1273618451.png", downloadUrl: "https://www.nexusmods.com/godofwar/mods/41", sourceUrl: "https://www.nexusmods.com/godofwar/mods/41" },

  // --- Assassin's Creed Valhalla ---
  { title: "Skip Cinematic Intro", game: "Assassin's Creed Valhalla", gameGenre: "أكشن RPG", category: "تحسينات عامة", description: "يحذف شاشات البداية الطويلة والإعلانات ويأخذك مباشرة للعبة.", version: "1.0.0", author: "MrMorwen", imageUrl: "https://staticdelivery.nexusmods.com/mods/3640/images/8/8-1608065843-1073821456.png", downloadUrl: "https://www.nexusmods.com/assassinscreedvalhalla/mods/8", sourceUrl: "https://www.nexusmods.com/assassinscreedvalhalla/mods/8" },
  { title: "Alternate Outfit Pack", game: "Assassin's Creed Valhalla", gameGenre: "أكشن RPG", category: "شخصيات", description: "يضيف 20+ بدلة مستوحاة من شخصيات AC السابقة بجودة بصرية عالية.", version: "2.5.0", author: "JediAnakin", imageUrl: "https://staticdelivery.nexusmods.com/mods/3640/images/243/243-1611573048-2115753148.png", downloadUrl: "https://www.nexusmods.com/assassinscreedvalhalla/mods/243", sourceUrl: "https://www.nexusmods.com/assassinscreedvalhalla/mods/243" },
  { title: "Better NPC Faces", game: "Assassin's Creed Valhalla", gameGenre: "أكشن RPG", category: "جرافيكس وإضاءة", description: "يُحسّن قوام وجوه الشخصيات الثانوية لتكون أكثر دقة وأقل تكراراً.", version: "1.3.0", author: "Nexus_Graphix", imageUrl: "https://staticdelivery.nexusmods.com/mods/3640/images/157/157-1609983056-1943582753.png", downloadUrl: "https://www.nexusmods.com/assassinscreedvalhalla/mods/157", sourceUrl: "https://www.nexusmods.com/assassinscreedvalhalla/mods/157" },

  // --- Metal Gear Solid V ---
  { title: "Extra Config", game: "Metal Gear Solid V: The Phantom Pain", gameGenre: "أكشن", category: "أدوات تحكم", description: "يُضيف خيارات تكوين موسعة لضبط إعدادات اللعبة بشكل دقيق.", version: "0.8.1", author: "chocovivian", imageUrl: "https://staticdelivery.nexusmods.com/mods/516/images/24/24-1445723648-1264938213.jpg", downloadUrl: "https://www.nexusmods.com/metalgearsolidvtpp/mods/24", sourceUrl: "https://www.nexusmods.com/metalgearsolidvtpp/mods/24" },
  { title: "Infinite Heaven", game: "Metal Gear Solid V: The Phantom Pain", gameGenre: "أكشن", category: "طريقة اللعب", description: "يضيف مئات الخيارات والتعديلات لتجربة اللعب من أسلوب الأعداء لأحوال الطقس.", version: "0.9.6", author: "Chocobos_Last_Stand", imageUrl: "https://staticdelivery.nexusmods.com/mods/516/images/43/43-1453248843-567984213.jpg", downloadUrl: "https://www.nexusmods.com/metalgearsolidvtpp/mods/43", sourceUrl: "https://www.nexusmods.com/metalgearsolidvtpp/mods/43" },
  { title: "Chapter 3 Restored", game: "Metal Gear Solid V: The Phantom Pain", gameGenre: "أكشن", category: "محتوى جديد", description: "يُعيد المحتوى المحذوف والمقطع من الفصل الثالث الذي لم يُكتمل في نسخة الإصدار.", version: "1.2.0", author: "Atvaark", imageUrl: "https://staticdelivery.nexusmods.com/mods/516/images/1281/1281-1479244756-847239015.jpg", downloadUrl: "https://www.nexusmods.com/metalgearsolidvtpp/mods/1281", sourceUrl: "https://www.nexusmods.com/metalgearsolidvtpp/mods/1281" },

  // --- Far Cry 5 ---
  { title: "No Intro Movies", game: "Far Cry 5", gameGenre: "أكشن", category: "تحسينات عامة", description: "يحذف فيديوهات الشركات في بداية اللعبة ويوصلك للقائمة الرئيسية مباشرة.", version: "1.0.0", author: "fc5modder", imageUrl: "https://staticdelivery.nexusmods.com/mods/2086/images/26/26-1525448932-1264758390.jpg", downloadUrl: "https://www.nexusmods.com/farcry5/mods/26", sourceUrl: "https://www.nexusmods.com/farcry5/mods/26" },
  { title: "Better Weather System", game: "Far Cry 5", gameGenre: "أكشن", category: "طقس وبيئة", description: "يُنوّع أنماط الطقس ويُضيف عواصف وضباب وأمطار أكثر واقعية في Montana.", version: "1.5.0", author: "Shtivi", imageUrl: "https://staticdelivery.nexusmods.com/mods/2086/images/7/7-1525373842-1823945827.jpg", downloadUrl: "https://www.nexusmods.com/farcry5/mods/7", sourceUrl: "https://www.nexusmods.com/farcry5/mods/7" },

  // --- Resident Evil Village ---
  { title: "Tall Vampire Lady - Lady Dimitrescu Enhanced", game: "Resident Evil Village", gameGenre: "رعب", category: "شخصيات", description: "يُضيف تفاصيل وقوام محسّنة لشخصية Lady Dimitrescu الشهيرة مع حركات أكثر توهجاً.", version: "2.0.0", author: "FluffyQuack", imageUrl: "https://staticdelivery.nexusmods.com/mods/4183/images/176/176-1620140434-1846394325.png", downloadUrl: "https://www.nexusmods.com/residentevilvillage/mods/176", sourceUrl: "https://www.nexusmods.com/residentevilvillage/mods/176" },
  { title: "HD Texture Pack Village", game: "Resident Evil Village", gameGenre: "رعب", category: "جرافيكس وإضاءة", description: "يُعيد رسم قوام القرية والقلعة والشخصيات بدقة 4K مع الحفاظ على الجو الرعب.", version: "1.1.0", author: "Hein84", imageUrl: "https://staticdelivery.nexusmods.com/mods/4183/images/82/82-1621234849-1947321845.png", downloadUrl: "https://www.nexusmods.com/residentevilvillage/mods/82", sourceUrl: "https://www.nexusmods.com/residentevilvillage/mods/82" },
  { title: "Classic Font Restoration", game: "Resident Evil Village", gameGenre: "رعب", category: "واجهة المستخدم", description: "يُعيد الخط الكلاسيكي من سلسلة RE القديمة للواجهة ليناسب المحبين للنوستالجيا.", version: "1.0.0", author: "FluffyQuack", imageUrl: "https://staticdelivery.nexusmods.com/mods/4183/images/12/12-1620073849-1736453218.png", downloadUrl: "https://www.nexusmods.com/residentevilvillage/mods/12", sourceUrl: "https://www.nexusmods.com/residentevilvillage/mods/12" },

  // --- Monster Hunter World ---
  { title: "Transmog System", game: "Monster Hunter: World", gameGenre: "أكشن RPG", category: "تخصيص", description: "يُتيح تغيير مظهر الدروع مع الإبقاء على إحصائياتها للتنسيق بأسلوبك المفضل.", version: "1.5.2", author: "AsteriskAmpersand", imageUrl: "https://staticdelivery.nexusmods.com/mods/2531/images/2324/2324-1575058834-1946283755.png", downloadUrl: "https://www.nexusmods.com/monsterhunterworld/mods/2324", sourceUrl: "https://www.nexusmods.com/monsterhunterworld/mods/2324" },
  { title: "Fluffy Manager MHW", game: "Monster Hunter: World", gameGenre: "أكشن RPG", category: "أدوات أساسية", description: "مدير مودات سهل الاستخدام خصيصاً لـ MHW مع دعم تعارضات تلقائية.", version: "2.0.0", author: "Fexty12573", imageUrl: "https://staticdelivery.nexusmods.com/mods/2531/images/2921/2921-1577455834-993481759.png", downloadUrl: "https://www.nexusmods.com/monsterhunterworld/mods/2921", sourceUrl: "https://www.nexusmods.com/monsterhunterworld/mods/2921" },
  { title: "World Quests Multiplayer", game: "Monster Hunter: World", gameGenre: "أكشن RPG", category: "متعدد اللاعبين", description: "يُزيل قيود المهام المنفردة ويُتيح إكمال أي مهمة مع الأصدقاء في الوضع التعاوني.", version: "1.2.0", author: "bladex", imageUrl: "https://staticdelivery.nexusmods.com/mods/2531/images/4178/4178-1581248849-1734521348.png", downloadUrl: "https://www.nexusmods.com/monsterhunterworld/mods/4178", sourceUrl: "https://www.nexusmods.com/monsterhunterworld/mods/4178" },

  // --- Portal 2 ---
  { title: "Hammer Editor Tools Pack", game: "Portal 2", gameGenre: "ألغاز", category: "أدوات أساسية", description: "مجموعة أدوات لمحرر المراحل تُبسّط إنشاء غرف اختبار معقدة بدون خبرة مسبقة.", version: "3.0.0", author: "Valve_Mapper", imageUrl: "https://steamuserimages-a.akamaihd.net/ugc/925152646700975397/2CC93BFCE476EF7B4BC3B23D2A53B34A9B4C0E2A/", downloadUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=318820930", sourceUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=318820930" },
  { title: "Mel Companion", game: "Portal 2", gameGenre: "ألغاز", category: "شخصيات", description: "يُضيف روبوت Mel من Portal Stories: Mel كمرافق مُعبّر بحوار مُخصّص.", version: "1.0.0", author: "Philobytes", imageUrl: "https://steamuserimages-a.akamaihd.net/ugc/89309226476568888/0CCBF7D2A1B2C42B2E78C0AC5AE9AADC2D2EC93E/", downloadUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=231994018", sourceUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=231994018" },

  // --- Nioh 2 ---
  { title: "Clear Save Data Modifier", game: "Nioh 2", gameGenre: "أكشن RPG", category: "أدوات تحكم", description: "يتيح تعديل إحصائيات الشخصية والمعدات والموارد عبر أداة خارجية آمنة.", version: "2.1.0", author: "Woeful Wolf", imageUrl: "https://staticdelivery.nexusmods.com/mods/2578/images/1/1-1602748834-1436832541.png", downloadUrl: "https://www.nexusmods.com/nioh2/mods/1", sourceUrl: "https://www.nexusmods.com/nioh2/mods/1" },
  { title: "All Weapon Skills Unlocker", game: "Nioh 2", gameGenre: "أكشن RPG", category: "طريقة اللعب", description: "يفتح جميع مهارات الأسلحة من البداية لتجربة أساليب القتال المختلفة بحرية.", version: "1.0.0", author: "SpecialK_Team", imageUrl: "https://staticdelivery.nexusmods.com/mods/2578/images/3/3-1602781634-1834965217.png", downloadUrl: "https://www.nexusmods.com/nioh2/mods/3", sourceUrl: "https://www.nexusmods.com/nioh2/mods/3" },

  // --- Dave the Diver ---
  { title: "Faster Fishing", game: "Dave the Diver", gameGenre: "مغامرة", category: "طريقة اللعب", description: "يُسرّع ميكانيكيات الصيد لتكون أقل عشوائية وأكثر مُرضية في الجلسات الطويلة.", version: "1.0.0", author: "Bepis_Dave", imageUrl: "https://staticdelivery.nexusmods.com/mods/5685/images/2/2-1691284743-1934892547.png", downloadUrl: "https://www.nexusmods.com/davethediver/mods/2", sourceUrl: "https://www.nexusmods.com/davethediver/mods/2" },
  { title: "Menu Skip", game: "Dave the Diver", gameGenre: "مغامرة", category: "تحسينات عامة", description: "يُقلّص أوقات التحميل ويتخطى الشاشات الانتقالية الطويلة بين المناطق.", version: "1.1.0", author: "SharkMod", imageUrl: "https://staticdelivery.nexusmods.com/mods/5685/images/9/9-1691382743-2087345123.png", downloadUrl: "https://www.nexusmods.com/davethediver/mods/9", sourceUrl: "https://www.nexusmods.com/davethediver/mods/9" },

  // --- Street Fighter 6 ---
  { title: "Costume Color Editor", game: "Street Fighter 6", gameGenre: "قتال", category: "تخصيص", description: "يُتيح تعديل ألوان الملابس والشخصيات بحرية تامة خارج نظام الألوان الأصلي.", version: "1.5.0", author: "SF6Modder", imageUrl: "https://staticdelivery.nexusmods.com/mods/7218/images/7/7-1692483921-1823764218.png", downloadUrl: "https://www.nexusmods.com/streetfighter6/mods/7", sourceUrl: "https://www.nexusmods.com/streetfighter6/mods/7" },
  { title: "Classic SF2 Music Pack", game: "Street Fighter 6", gameGenre: "قتال", category: "أصوات ومؤثرات صوتية", description: "يستبدل موسيقى المستويات بألحان Street Fighter 2 الأيقونية بجودة صوتية عالية.", version: "2.0.0", author: "RetroBeats", imageUrl: "https://staticdelivery.nexusmods.com/mods/7218/images/23/23-1693024819-1094837642.png", downloadUrl: "https://www.nexusmods.com/streetfighter6/mods/23", sourceUrl: "https://www.nexusmods.com/streetfighter6/mods/23" },
];

let added = 0, skipped = 0;
console.log(`\nسيتم إضافة ${mods.length} مود...\n`);

for (const mod of mods) {
  const modSlug = slug(mod.title, mod.game);
  const exists = await db.execute({
    sql: "SELECT id FROM mods WHERE title = ? AND game = ? LIMIT 1",
    args: [mod.title, mod.game]
  });
  if (exists.rows.length > 0) {
    console.log(`⏭ مكرر: ${mod.title}`);
    skipped++;
    continue;
  }
  await db.execute({
    sql: `INSERT INTO mods (title, slug, game, game_genre, category, description, version, author, image_url, download_url, source_url, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', datetime('now'))`,
    args: [mod.title, modSlug, mod.game, mod.gameGenre, mod.category, mod.description, mod.version || null, mod.author, mod.imageUrl || null, mod.downloadUrl, mod.sourceUrl || null]
  });
  console.log(`✅ ${mod.title} (${mod.game})`);
  added++;
}

console.log(`\n=== النتيجة ===`);
console.log(`✅ أُضيف: ${added}`);
console.log(`⏭ تكرار: ${skipped}`);
const total = await db.execute("SELECT COUNT(*) as cnt FROM mods WHERE status='approved'");
console.log(`📦 الإجمالي: ${total.rows[0].cnt} مود`);

const newGames = await db.execute(`
  SELECT game, COUNT(*) as cnt FROM mods WHERE status='approved'
  AND game IN ('Marvel''s Spider-Man Remastered','God of War','Assassin''s Creed Valhalla',
    'Metal Gear Solid V: The Phantom Pain','Far Cry 5','Resident Evil Village',
    'Monster Hunter: World','Portal 2','Nioh 2','Dave the Diver','Street Fighter 6')
  GROUP BY game ORDER BY cnt DESC
`);
console.log('\n=== الألعاب الجديدة ===');
newGames.rows.forEach(r => console.log(`${r.cnt}\t${r.game}`));
process.exit(0);
