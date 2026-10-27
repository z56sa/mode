import Link from "next/link";
import { genreLabels, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "الألعاب المتوفرة | mode",
  description: "استعرض جميع الألعاب المدعومة وتصفح موداتها الأصلية.",
};

// صور وشعارات رسمية عالية الدقة للألعاب
const GAME_COVERS: Record<string, { image: string; tag: string; banner: string }> = {
  "Minecraft": {
    image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80",
    tag: "عالم مفتوح وبناء",
  },
  "Lethal Company": {
    image: "https://ccdn.thunderstore.io/live/repository/icons/notnotnotswipez-MoreCompany-1.10.1.png",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    tag: "رعب وتعاون فضائي",
  },
  "Valheim": {
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tag: "فايكنج وبقاء",
  },
  "ULTRAKILL": {
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    tag: "أكشن وسرعة ريترو",
  },
  "Content Warning": {
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    tag: "رعب وتصوير فيديو",
  },
  "ROUNDS": {
    image: "https://images.unsplash.com/photo-1612287232213-79776f140685?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1612287232213-79776f140685?auto=format&fit=crop&w=800&q=80",
    tag: "قتال بطاقات حماسي",
  },
  "R.E.P.O.": {
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    tag: "مهمات وأكشن",
  },
  "GTFO": {
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    tag: "رعب تكتيكي عميق",
  },
  "Subnautica": {
    image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
    tag: "أعماق البحار وبقاء فضائي",
  },
};

export default async function GamesPage() {
  const db = await getDb();
  let gamesData: Array<{ game: string; genre: string; count: number; sampleImage: string | null }> = [];

  try {
    const res = await db.execute(`
      SELECT game, game_genre as genre, COUNT(*) as count, MAX(image_url) as sample_image
      FROM mods
      WHERE status = 'approved'
      GROUP BY game
      ORDER BY count DESC
    `);
    gamesData = res.rows.map((r: any) => ({
      game: String(r.game),
      genre: String(r.genre || "Sandbox"),
      count: Number(r.count),
      sampleImage: r.sample_image ? String(r.sample_image) : null,
    }));
  } catch (error) {
    console.error("Failed to load games list:", error);
  }

  return (
    <div className="section-wrap" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
      <div className="section-heading" style={{ marginBottom: "2.5rem" }}>
        <div>
          <span className="eyebrow dark-eyebrow">دليل الألعاب</span>
          <h1 style={{ fontSize: "2.6rem", fontWeight: "900", marginTop: "0.4rem", color: "#ffffff" }}>
            الألعاب المتوفرة ({gamesData.length} ألعاب)
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            اختر لعبتك المفضلة لتصفح آلاف المودات الحقيقية والمميزة المجهزة لها.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.75rem",
        }}
      >
        {gamesData.map((item) => {
          const cover = GAME_COVERS[item.game] || {
            image: item.sampleImage || "",
            banner: "",
            tag: genreLabels[item.genre] ?? item.genre,
          };

          const displayImg = cover.image || item.sampleImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80";

          return (
            <Link
              key={item.game}
              href={`/?game=${encodeURIComponent(item.game)}#catalog`}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              {/* واجهة صورة اللعبة بحجم واضح واحترافي */}
              <div
                style={{
                  height: "170px",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#111813",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={displayImg}
                  alt={item.game}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                    transition: "transform 0.3s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(14,24,16,0.95) 0%, transparent 70%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    background: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(6px)",
                    color: "#9dcc47",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(157,204,71,0.35)",
                  }}
                >
                  {item.count} مود متوفر
                </span>
              </div>

              {/* بيانات اللعبة */}
              <div style={{ padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
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
                    marginTop: "0.75rem",
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
