import Link from "next/link";
import { genreLabels, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "الألعاب المتوفرة | mode",
  description: "استعرض جميع الألعاب المدعومة وتصفح موداتها.",
};

// صور رمزية وخلفيات جذابة لكل لعبة
const GAME_COVERS: Record<string, { image: string; tag: string }> = {
  "Minecraft": {
    image: "https://cdn.modrinth.com/data/AANobbMI/icon.png",
    tag: "عالم مفتوح وبناء",
  },
  "Lethal Company": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/notnotnotswipez-MoreCompany-1.10.1.png",
    tag: "رعب وتعاون",
  },
  "Valheim": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/denikson-BepInExPack_Valheim-5.4.2202.png",
    tag: "بقاء ومغامرات",
  },
  "ULTRAKILL": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/BepInEx-BepInExPack_GTFO-5.4.2100.png",
    tag: "أكشن وسرعة",
  },
  "Content Warning": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/RugbugRedfern-SkinAttack-1.0.1.png",
    tag: "رعب وكوميديا",
  },
  "ROUNDS": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/willuwontu-WillsWackyCards-1.0.3.png",
    tag: "قتال بطاقات",
  },
  "R.E.P.O.": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/notnotnotswipez-MoreCompany-1.10.1.png",
    tag: "مهمات وأكشن",
  },
  "GTFO": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/BepInEx-BepInExPack_GTFO-5.4.2100.png",
    tag: "رعب تكتيكي",
  },
  "Subnautica": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/Tobey-TobeySubnauticaZipModLoader-1.1.2.png",
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
      <div className="section-heading" style={{ marginBottom: "2rem" }}>
        <div>
          <span className="eyebrow dark-eyebrow">دليل الألعاب</span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "800", marginTop: "0.4rem" }}>
            الألعاب المتوفرة ({gamesData.length} ألعاب)
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.5rem", fontSize: "1.05rem" }}>
            اختر لعبتك وتصفح آلاف المودات الحقيقية والإضافات المجهزة لها.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {gamesData.map((item) => {
          const cover = GAME_COVERS[item.game] || {
            image: "",
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
                borderRadius: "16px",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              className="game-card-hover"
            >
              <div
                style={{
                  height: "140px",
                  background: "linear-gradient(135deg, #1b2e15 0%, #0d170a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {cover.image ? (
                  <img
                    src={cover.image}
                    alt={item.game}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "16px",
                      objectFit: "cover",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "3rem" }}>🎮</span>
                )}
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    color: "#9dcc47",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    border: "1px solid rgba(157,204,71,0.3)",
                  }}
                >
                  {item.count} مود متوفر
                </span>
              </div>

              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: "600",
                  }}
                >
                  {genreLabels[item.genre] ?? item.genre} · {cover.tag}
                </span>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {item.game}
                </h3>
                <div
                  style={{
                    marginTop: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#9dcc47",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  <span>استكشف المودات</span>
                  <span>←</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
