import Link from "next/link";
import { genreLabels, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "الألعاب المتوفرة | mode",
  description: "استعرض جميع الألعاب المدعومة وتصفح موداتها الأصلية.",
};

// صور رسمية حقيقية 100% مستخرجة مباشرة من بوسترات Steam و Modrinth الرسمية لكل لعبة
const REAL_GAME_ASSETS: Record<string, { image: string; tag: string }> = {
  "Minecraft": {
    // لوجو وشعار ماينكرافت الحقيقي بجودة عالية
    image: "https://upload.wikimedia.org/wikipedia/commons/1/14/Minecraft_Logo.png",
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
    // الغلاف الرسمي الكامل للعبة R.E.P.O. من Steam CDN
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginTop: "0.4rem", color: "#ffffff" }}>
            الألعاب المتوفرة ({gamesData.length} ألعاب)
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
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
            image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg",
            tag: genreLabels[item.genre] ?? item.genre,
          };

          return (
            <Link
              key={item.game}
              href={`/?game=${encodeURIComponent(item.game)}#catalog`}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "18px",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* صورة الغلاف الرسمي الكامل للعبة */}
              <div
                style={{
                  height: "160px",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: item.game === "Minecraft" ? "#1e3814" : "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={asset.image}
                  alt={item.game}
                  style={{
                    width: item.game === "Minecraft" ? "80%" : "100%",
                    height: item.game === "Minecraft" ? "auto" : "100%",
                    objectFit: item.game === "Minecraft" ? "contain" : "cover",
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
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: "600",
                  }}
                >
                  {genreLabels[item.genre] ?? item.genre} · {asset.tag}
                </span>
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: "800",
                    color: "#ffffff",
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
                    color: "#9dcc47",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                  }}
                >
                  <span>استكشف مودات {item.game}</span>
                  <span style={{ fontSize: "1.2rem" }}>←</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
