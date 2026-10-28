import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const BANNERLORD_MODS = [
  {
    title: "The Old Realms (Warhammer Fantasy Overhaul)",
    slug: "mb2-the-old-realms",
    category: "عوالم جديدة",
    description: "أضخم تعديل شامل لبانرلورد يحول اللعبة بالكامل إلى عالم Warhammer Fantasy مع فصائل الإمبراطورية ومصاصي الدماء، ونظام سحر كامل وبنادق نارية وفرسان ومخلوقات أسطورية.",
    author: "The Old Realms Team",
    version: "v0.9.2",
    imageUrl: "https://images.steamusercontent.com/ugc/2026101968494916960/6EFE996F77626F76E5B107F8FF19B6F304B76BF4/",
    downloadUrl: "https://github.com/The-Old-Realms/TheOldRealms/releases/download/v0.9.2/TheOldRealms.zip",
    fileName: "TheOldRealms-Warhammer-v0.9.2.zip"
  },
  {
    title: "Anno Domini 1259: High Middle Ages",
    slug: "mb2-anno-domini-1259",
    category: "عوالم جديدة",
    description: "تحويل تاريخي واقعي دقيق ينقل خريطة أوروبا والشرق الأوسط والحروب الصليبية إلى عام 1259م مع أكثر من 30 مملكة ودولة حقيقية، وأزياء ودروع فرسان القرون الوسطى.",
    author: "AD1259 Dev Team",
    version: "1.4.1",
    imageUrl: "https://images.steamusercontent.com/ugc/1831278143232811880/DCEAE0C4776BC10769D9D6EF25F60309995079BE/",
    downloadUrl: "https://github.com/AD1259/AnnoDomini1259/releases/download/v1.4.1/AnnoDomini1259.zip",
    fileName: "AnnoDomini1259.zip"
  },
  {
    title: "Eagle Rising: Dawn of an Empire (Rome Overhaul)",
    slug: "mb2-eagle-rising-rome",
    category: "عوالم جديدة",
    description: "مود الإمبراطورية الرومانية التاريخي؛ يعيد بناء فصائل كالراديا لتحاكي روما والقرطاجيين والإغريق وشعوب الغال مع أسلحة الفيالق ودروع اللوريكا سيغمنتاتا والتشكيلات التكتيكية.",
    author: "The Calradia Awakens Team",
    version: "3.2.0",
    imageUrl: "https://images.steamusercontent.com/ugc/1769324545592881079/01509618C526A4C2E4264A7E004128522774C3D9/",
    downloadUrl: "https://github.com/CalradiaAwakens/EagleRising/releases/download/v3.2.0/EagleRising.zip",
    fileName: "EagleRising-Rome.zip"
  },
  {
    title: "Trial of The Seven Kingdoms (Game of Thrones)",
    slug: "mb2-trial-of-seven-kingdoms",
    category: "عوالم جديدة",
    description: "عالم صراع العروش (Game of Thrones) بالكامل داخل بانرلورد: ويستروس، آل ستارك، آل لانيستر، حرس الليل، وأسلحة الفاليري الفولاذية مع خرائط قلاع ويستروس الشهيرة كـ وينترفيل وكينغز لاندينغ.",
    author: "Seven Kingdoms Team",
    version: "2.1.0",
    imageUrl: "https://images.steamusercontent.com/ugc/1825668308038086404/84F4FCF5593B412374D3B1FE3F8C1065CF1DECC2/",
    downloadUrl: "https://github.com/GoT-Bannerlord/TrialOfTheSevenKingdoms/releases/download/v2.1.0/SevenKingdoms.zip",
    fileName: "TrialOfSevenKingdoms-GoT.zip"
  },
  {
    title: "Realm of Thrones (Game of Thrones Complete Mod)",
    slug: "mb2-realm-of-thrones",
    category: "عوالم جديدة",
    description: "التعديل الأوسع انتشاراً لعالم ويستروس وإيسوس كاملاً؛ يشمل التنانين، الوايت ووكرز، وجيش الدوثراكي مع شخصيات المسلسل الحقيقية والرايات والجيوش الخاصة بكل بيت.",
    author: "Caranthir",
    version: "5.4",
    imageUrl: "https://images.steamusercontent.com/ugc/1854946825053210346/A5AF0AFC6AFF0E8D95842DE737330F74711CCEE2/",
    downloadUrl: "https://github.com/RealmOfThrones/ROT-Release/releases/download/v5.4/RealmOfThrones.zip",
    fileName: "RealmOfThrones-v5.4.zip"
  },
  {
    title: "Realistic Battle Mod (RBM): Combat & AI Module",
    slug: "mb2-realistic-battle-mod-rbm",
    category: "تحسينات اللعب",
    description: "المود الأساسي المعتمد لواقعية المعارك؛ يجعل الدروع تصد الضربات الحقيقية، والسهام تخترق حسب نوع السنان، مع ذكاء اصطناعي عبقري ينفذ تشكيلات الجدران الدفاعية والالتفاف بالخيالة.",
    author: "Philozoraptor & Marnid",
    version: "3.8.1",
    imageUrl: "https://images.steamusercontent.com/ugc/17278947949401270265/17DE7A752CCBD5EE69AD59B99E3B26D3F3C00C48/",
    downloadUrl: "https://github.com/RBM-Bannerlord/RealisticBattleMod/releases/download/v3.8.1/RealisticBattleMod.zip",
    fileName: "RealisticBattleMod-RBM.zip"
  },
  {
    title: "Improved Garrisons: Automated Castles & Recruiter",
    slug: "mb2-improved-garrisons",
    category: "أدوات",
    description: "نظام إدارة الحصون والقلاع الذكي؛ يمكّنك من توظيف حراس وتدريبهم تلقائياً، وإرسال فرق تجنيد تجمع الجنود من القرى، ودوريات لحماية القرى والقوافل من قطاع الطرق.",
    author: "Sidies",
    version: "4.1.2.11",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_7491c162be633613ff96f34174aff638883de507.1920x1080.jpg",
    downloadUrl: "https://github.com/Sidies/ImprovedGarrisons/releases/download/v4.1.2.11/ImprovedGarrisons.zip",
    fileName: "ImprovedGarrisons.zip"
  },
  {
    title: "Fourberie (Roguery & Criminal Underground System)",
    slug: "mb2-fourberie-roguery",
    category: "تحسينات اللعب",
    description: "نظام شامل يفعّل مسار العصابات واللصوصية؛ يسمح لك بالسيطرة على أحياء المدن، اغتيال القادة، التجسس وسرقة المتاجر، وإنشاء مخابئ لقطاع الطرق تحت إمرتك.",
    author: "Spiffer",
    version: "1.3.1.2",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_1ab88f5c0198a16f75db23af8477811c0996b864.1920x1080.jpg",
    downloadUrl: "https://github.com/Spiffer/Fourberie/releases/download/v1.3.1.2/Fourberie.zip",
    fileName: "Fourberie.zip"
  },
  {
    title: "Banner Kings: Feudal System, Demesne & Religion",
    slug: "mb2-banner-kings",
    category: "تحسينات اللعب",
    description: "تعميق نظام الإقطاع والولاء في العصور الوسطى؛ يضيف طبقات النبلاء والفرسان والفلاحين، نظام الضرائب الحقيقي، والمجالس الدينية والبابوية مع حقوق الملكية للأراضي.",
    author: "Rikitor",
    version: "1.2.9",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_569257e92fd31d58a6fe08053de637071b4518d3.1920x1080.jpg",
    downloadUrl: "https://github.com/BannerKings/BannerKings/releases/download/v1.2.9/BannerKings.zip",
    fileName: "BannerKings-FeudalOverhaul.zip"
  },
  {
    title: "My Little Warband: Custom Troop Tree Creator",
    slug: "mb2-my-little-warband",
    category: "تحسينات اللعب",
    description: "يتيح لك تصميم شجرة جنود خاصة بك بنسبة 100%؛ تخصيص الدروع، الأسلحة، الأسماء، والمهارات لكل رتبة من المجند وحتى الفارس النخبوي وتدريبهم في قلاعك.",
    author: "LLINK482",
    version: "1.2.8",
    imageUrl: "https://images.steamusercontent.com/ugc/13230785998235351294/322516AB1B53AE06AE7C3FB38A6C15BB641D1577/",
    downloadUrl: "https://github.com/LLINK482/MyLittleWarband/releases/download/v1.2.8/MyLittleWarband.zip",
    fileName: "MyLittleWarband.zip"
  },
  {
    title: "Surrender Tweaks: Intelligent Battle Surrender",
    slug: "mb2-surrender-tweaks",
    category: "تحسينات اللعب",
    description: "يجعل الأعداء واللوردات وقادة الجيوش يستسلمون بذكاء عند حصارهم أو عندما تتفوق عليهم بشكل ساحق بدلاً من خوض معارك انتحارية مستحيلة.",
    author: "Areldir",
    version: "1.6.3",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_eda4ec26be60bf8a1787db9b37e609e41e42ec21.1920x1080.jpg",
    downloadUrl: "https://github.com/Areldir/SurrenderTweaks/releases/download/v1.6.3/SurrenderTweaks.zip",
    fileName: "SurrenderTweaks.zip"
  },
  {
    title: "Governors Handle Issues: Automated Settlement Problems",
    slug: "mb2-governors-handle-issues",
    category: "أدوات",
    description: "يجعل حكام المدن والقلاع يتكفلون بحل مشكلات وقضايا القرى والمواطنين تلقائياً ويزيد من ولاء المدن دون الحاجة لتدخلك الشخصي في كل مهمة صغيرة.",
    author: "Zelfana",
    version: "1.0.8",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_2885840eb2e4a2b4a00acb8a8a40baac41b33cfd.1920x1080.jpg",
    downloadUrl: "https://github.com/Zelfana/GovernorsHandleIssues/releases/download/v1.0.8/GovernorsHandleIssues.zip",
    fileName: "GovernorsHandleIssues.zip"
  },
  {
    title: "Perfect Fire Arrows & Flaming Projectiles",
    slug: "mb2-perfect-fire-arrows",
    category: "الرسوميات",
    description: "إضافة الأسهم النارية ومقذوفات المنجنيق الحارقة ليلاً مع إضاءة ديناميكية مبهرة وإشعال النار في الدروع وعربات الحصار أثناء المعارك الليلية.",
    author: "Shadow3205",
    version: "2.3.0",
    imageUrl: "https://images.steamusercontent.com/ugc/1921374086541062941/73CBA9DE262513B48913CE55B4622D263A82B6A1/",
    downloadUrl: "https://github.com/Shadow3205/FireArrows/releases/download/v2.3.0/FireArrows.zip",
    fileName: "PerfectFireArrows.zip"
  },
  {
    title: "Party Screen Enhancements: One-Click Upgrade & Sort",
    slug: "mb2-party-screen-enhancements",
    category: "أدوات",
    description: "زر ترقية جماعي للجنود بنقرة واحدة، فرز الأسرى وفرق الجيش تلقائياً حسب الرتبة أو النوع، وتجنيد كل الأسرى المؤهلين فوراً لتوفير الوقت والجهد.",
    author: "Hirtol",
    version: "1.7.0",
    imageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/261550/ss_7858b1826060b9344b35569e027f6441f146e6aa.1920x1080.jpg",
    downloadUrl: "https://github.com/Hirtol/PartyScreenEnhancements/releases/download/v1.7.0/PartyScreenEnhancements.zip",
    fileName: "PartyScreenEnhancements.zip"
  },
  {
    title: "Raise Your Banner: Animated Battle Standards",
    slug: "mb2-raise-your-banner",
    category: "الرسوميات",
    description: "يمنح كل فرقة في المعركة حامل راية يرفع راية فصيلتك الحقيقية ترفرف في الهواء، مع أصوات طبول الحرب لتجربة ملحمية تماثل الأفلام التاريخية.",
    author: "Bloc",
    version: "3.1.0",
    imageUrl: "https://images.steamusercontent.com/ugc/1831278143232811880/DCEAE0C4776BC10769D9D6EF25F60309995079BE/",
    downloadUrl: "https://github.com/Bloc/RaiseYourBanner/releases/download/v3.1.0/RaiseYourBanner.zip",
    fileName: "RaiseYourBanner.zip"
  }
];

async function run() {
  console.log("=== Ingesting Authentic Bannerlord Mods ===");
  let inserted = 0;

  for (const m of BANNERLORD_MODS) {
    try {
      const res = await db.execute({
        sql: `INSERT INTO mods (
          title, slug, game, game_genre, category, description,
          image_url, download_url, download_file_name, author, version, status
        ) VALUES (?, ?, 'Mount & Blade II: Bannerlord', 'Strategy', ?, ?, ?, ?, ?, ?, ?, 'approved')
        ON CONFLICT(slug) DO UPDATE SET
          title = excluded.title,
          category = excluded.category,
          description = excluded.description,
          image_url = excluded.image_url,
          download_url = excluded.download_url,
          download_file_name = excluded.download_file_name,
          author = excluded.author,
          version = excluded.version`,
        args: [
          m.title,
          m.slug,
          m.category,
          m.description,
          m.imageUrl,
          m.downloadUrl,
          m.fileName,
          m.author,
          m.version
        ]
      });
      if (res.rowsAffected > 0) inserted++;
      console.log(`+ ${m.title}`);
    } catch (e) {
      console.error(`Failed ${m.title}:`, e.message);
    }
  }

  const total = await db.execute("SELECT COUNT(*) as c FROM mods WHERE game = 'Mount & Blade II: Bannerlord'");
  console.log(`\nDone! Total Mount & Blade II: Bannerlord mods in Turso: ${total.rows[0].c}`);
}

run().catch(console.error);
