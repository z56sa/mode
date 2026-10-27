import Link from "next/link";
import { genreLabels, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "الألعاب المتوفرة | mode",
  description: "استعرض جميع الألعاب المدعومة وتصفح موداتها الأصلية.",
};

// صور رسمية حقيقية 100% مستخرجة مباشرة من بوسترات Steam الرسمية لكل لعبة
const REAL_GAME_ASSETS: Record<string, { image: string; tag: string }> = {
  "Minecraft": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1928870/header.jpg",
    tag: "عالم مفتوح وبناء",
  },
  "Lethal Company": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg",
    tag: "رعب وتعاون فضائي",
  },
  "Valheim": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/892970/header.jpg",
    tag: "فايكنج وبقاء",
  },
  "ULTRAKILL": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1229490/header.jpg",
    tag: "أكشن وسرعة ريترو",
  },
  "Content Warning": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2881650/header.jpg",
    tag: "رعب وتصوير فيديو",
  },
  "ROUNDS": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1557740/header.jpg",
    tag: "قتال بطاقات حماسي",
  },
  "R.E.P.O.": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/3241660/header.jpg",
    tag: "مهمات ورعب تعاوني",
  },
  "GTFO": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/493520/header.jpg",
    tag: "رعب تكتيكي عميق",
  },
  "Subnautica": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/264710/header.jpg",
    tag: "أعماق البحار وبقاء",
  },
  "Palworld": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/header.jpg",
    tag: "تقمّص أدوار وبقاء ومخلوقات",
  },
  "Risk of Rain 2": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/632360/header.jpg",
    tag: "روغلايك وشخصيات متعددة",
  },
  "Titanfall 2": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1237970/header.jpg",
    tag: "أكشن وحركات بهلوانية وسيرفرات مخصصة",
  },
  "BONELAB": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1592190/header.jpg",
    tag: "فيزياء ومحاكاة واقع افتراضي",
  },
  "Cities: Skylines II": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/949230/header.jpg",
    tag: "تخطيط ومحاكاة مدن",
  },
  "Outward": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/794260/header.jpg",
    tag: "مغامرة وبقاء وخيال",
  },
  "Dyson Sphere Program": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1366540/header.jpg",
    tag: "بناء وإستراتيجية فضائية",
  },
  "Monster Train": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1102190/header.jpg",
    tag: "بطاقات وبرج دفاع روغلايك",
  },
  "Stacklands": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1948280/header.jpg",
    tag: "استراتيجية ورق وبقاء",
  },
  "Balatro": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2379780/header.jpg",
    tag: "بوكر وروغلايك وبناء مجموعات",
  },
  "Inscryption": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1092790/header.jpg",
    tag: "بطاقات غامضة ورعب نفسي",
  },
  "V Rising": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1604030/header.jpg",
    tag: "بقاء ومصاصي دماء وبناء قلاع",
  },
  "Sons of the Forest": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1326470/header.jpg",
    tag: "رعب وبقاء في جزيرة نائية",
  },
  "Enter the Gungeon": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/311690/header.jpg",
    tag: "روغلايك وإطلاق نار كلاسيكي",
  },
  "Shadows of Doubt": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/986130/header.jpg",
    tag: "تحقيق بوليسي وعالم مفتوح ومحاكاة",
  },
  "Subnautica: Below Zero": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/848450/header.jpg",
    tag: "بقاء في أعماق متجمدة",
  },
  "BONEWORKS": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/823500/header.jpg",
    tag: "فيزياء واقع افتراضي تجريبية",
  },
  "TaleSpire": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/720620/header.jpg",
    tag: "طاولة رقمية ومغامرات RPG",
  },
  "Bloons TD 6": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/960090/header.jpg",
    tag: "دفاع عن البرج واستراتيجية",
  },
  "Stick Fight: The Game": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/674940/header.jpg",
    tag: "قتال فيزيائي ممتع مع الأصدقاء",
  },
  "Peglin": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1296610/header.jpg",
    tag: "روغلايك Pachinko وتكتيك",
  },
  "Sun Haven": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1432860/header.jpg",
    tag: "محاكاة زراعة وعالم سحري",
  },
  "Core Keeper": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1621690/header.jpg",
    tag: "تعدين وبقاء واستكشاف كهوف",
  },
  "Crab Game": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1782210/header.jpg",
    tag: "ألعاب مصغرة جماعية وحماسية",
  },
  "Potion Craft": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1210320/header.jpg",
    tag: "محاكاة خيميائي وصناعة الجرعات",
  },
  "Getting Over It": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/240720/header.jpg",
    tag: "تحدي تسلق فيزيائي أسطوري",
  },
  "Wobbly Life": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1211020/header.jpg",
    tag: "عالم مفتوح وفيزياء مرحة",
  },
  "Ravenfield": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/636480/header.jpg",
    tag: "معارك عسكرية وتكتيك فردي",
  },
  "SUPERHOT": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/322500/header.jpg",
    tag: "الوقت يتحرك فقط عند حركتك",
  },
  "H3VR": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/450540/header.jpg",
    tag: "محاكاة أسلحة واقعية VR",
  },
  // ألعاب مضافة في الموجة الأخيرة
  "ReSkate": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2883350/header.jpg",
    tag: "تزلج ومهارات حرة",
  },
  "How to Fish": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2977520/header.jpg",
    tag: "محاكاة صيد سمك",
  },
  "Gamble With Your Friends": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2898730/header.jpg",
    tag: "ألعاب حظ اجتماعية",
  },
  "Space Cat Digger": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2842420/header.jpg",
    tag: "تنقيب فضائي مع قطة",
  },
  "Burglin Gnomes": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2933930/header.jpg",
    tag: "سرقة وأكوام من الأقزام",
  },
  "The Spell Brigade": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2904000/header.jpg",
    tag: "سحر وروغلايك تعاوني",
  },
  "Among Us": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/945360/header.jpg",
    tag: "غموض ومخبر وخداع",
  },
  "Holdfast: Nations At War": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/589290/header.jpg",
    tag: "معارك تاريخية جماعية",
  },
  "Pikuniku": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/572890/header.jpg",
    tag: "مغامرة كوميدية غريبة",
  },
  "WEBFISHING": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/3146520/header.jpg",
    tag: "صيد سمك اجتماعي ومريح",
  },
  "Dredge": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1562430/header.jpg",
    tag: "صيد غامض ورعب كلافكرافتي",
  },
  "Trombone Champ": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1059990/header.jpg",
    tag: "إيقاع وموسيقى كوميدية",
  },
  "Dead Cells": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/588650/header.jpg",
    tag: "روغلايك متروفانيا مكثف",
  },
  "Muck": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1625450/header.jpg",
    tag: "بقاء روغلايك مع أصدقاء",
  },
  "Blue Prince": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1569580/header.jpg",
    tag: "ألغاز وغرف عشوائية",
  },
  "Graveyard Keeper": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/599140/header.jpg",
    tag: "محاكاة مقبرة مظلمة وكوميدية",
  },
  "Windrose": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2923320/header.jpg",
    tag: "مغامرة ومجارف RPG",
  },
  "Grain Rot": {
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4450620/560fb95ca428a798b7fb5f6b22b36dadb66fc058/capsule_231x87_alt_assets_1.jpg",
    tag: "زراعة وبقاء بيكسل آرت",
  },
  "Slip Skid": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2651350/header.jpg",
    tag: "سباق فيزيائي ممتع",
  },
  "Shift at Midnight": {
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3722330/19c9e6ec567f975b0b4462b8c84c1a38c74adf0d/capsule_231x87.jpg",
    tag: "رعب ومناوبة ليلية",
  },
  "Romestead": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1805320/header.jpg",
    tag: "بناء مدن رومانية استراتيجي",
  },
  "Lucky Shot": {
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4092940/089015e6dd6569f35944c4cc971c9a8e5d79d42f/capsule_231x87.jpg",
    tag: "لعبة رماية حظية",
  },
  "Lootun": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1960270/header.jpg",
    tag: "RPG عربة لوت وبناء مجموعات",
  },
  "Stonewards": {
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4502710/c72571ce75a39c4a6847ded74c66580f6b04ff42/capsule_231x87.jpg",
    tag: "اكشن وحمايه بالحجارة",
  },
  "Ancient Dungeon VR": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1963370/header.jpg",
    tag: "زنزانة VR بأسلوب Roguelite",
  },
  // ألعاب مشهورة جديدة
  "Beat Saber": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/620980/header.jpg",
    tag: "إيقاع وسيوف ليزر VR",
  },
  "Titanfall 2: Northstar": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1237970/header.jpg",
    tag: "سيرفرات مخصصة وأكشن سريع",
  },
  "Risk of Rain Returns": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1337520/header.jpg",
    tag: "روغلايك كلاسيكي مُعاد بناؤه",
  },
  "Supermarket Together": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2903950/header.jpg",
    tag: "محاكاة سوبرماركت جماعي",
  },
  "The Planet Crafter": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1284190/header.jpg",
    tag: "استعمار فضائي وبقاء مفتوح",
  },
  "Lethal League Blaze": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/553310/header.jpg",
    tag: "قتال بيسبول حماسي فائق السرعة",
  },
  "Chrono Ark": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1188930/header.jpg",
    tag: "روغلايك بطاقات وتقمّص أدوار",
  },
  "Deep Rock Galactic: Survivor": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2321470/header.jpg",
    tag: "أكشن إطلاق نار وتعدين وبقاء",
  },
  "Another Crab's Treasure": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1887840/header.jpg",
    tag: "سولزلایک في أعماق المحيط",
  },
  // ألعاب عملاقة وأسطورية مشهورة
  "Mount & Blade II: Bannerlord": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/261550/header.jpg",
    tag: "حروب تكتيكية وقرون وسطى وحروب كبرى",
  },
  "Grand Theft Auto V": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
    tag: "عالم مفتوح وأكشن وسيارات وجريمة",
  },
  "Cyberpunk 2077": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    tag: "عالم مستقبلي وسايبربانك وتقمّص أدوار",
  },
  "Stardew Valley": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg",
    tag: "محاكاة زراعة واستكشاف ومجتمع",
  },
  "The Witcher 3: Wild Hunt": {
    image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg",
    tag: "خيال مظلم ومطاردة وحوش وعالم أسطوري",
  },
};

export default async function GamesPage() {
  const db = await getDb();
  let gamesData: Array<{ game: string; genre: string; count: number }> = [];

  try {
    const res = await db.execute(`
      SELECT game, game_genre as genre, COUNT(*) as count
      FROM mods
      WHERE status = 'approved'
      GROUP BY game
      ORDER BY count DESC
    `);
    gamesData = res.rows.map((r: any) => ({
      game: String(r.game),
      genre: String(r.genre || "Sandbox"),
      count: Number(r.count),
    }));
  } catch (error) {
    console.error("Failed to load games list:", error);
  }

  return (
    <div className="section-wrap" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
      <div className="section-heading" style={{ marginBottom: "2.5rem" }}>
        <div>
          <span className="eyebrow dark-eyebrow">دليل الألعاب</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginTop: "0.4rem", color: "var(--ink)" }}>
            الألعاب المتوفرة ({gamesData.length} ألعاب)
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            اختر لعبتك لتصفح موداتها الحقيقية والمجهزة لها بروابط مباشرة.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.75rem",
        }}
      >
        {gamesData.map((item) => {
          const asset = REAL_GAME_ASSETS[item.game] || {
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
            tag: genreLabels[item.genre] ?? item.genre,
          };

          return (
            <Link
              key={item.game}
              href={`/?game=${encodeURIComponent(item.game)}#catalog`}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--white)",
                border: "1px solid var(--line)",
                borderRadius: "18px",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* صورة الغلاف الرسمي الكامل للعبة */}
              <div
                style={{
                  height: "160px",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={asset.image}
                  alt={item.game}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(6px)",
                    color: "#9dcc47",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(157,204,71,0.4)",
                  }}
                >
                  {item.count} مود متوفر
                </span>
              </div>

              {/* عنوان وتفاصيل اللعبة */}
              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    fontWeight: "600",
                  }}
                >
                  {genreLabels[item.genre] ?? item.genre} · {asset.tag}
                </span>
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: "800",
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  {item.game}
                </h3>
                <div
                  style={{
                    marginTop: "0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "var(--lime)",
                    filter: "contrast(1.2)",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                  }}
                >
                  <span style={{ color: "#7da328" }}>استكشف مودات {item.game}</span>
                  <span style={{ fontSize: "1.2rem", color: "#7da328" }}>←</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
