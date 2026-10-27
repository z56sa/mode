import Link from "next/link";
import { genreLabels, getCatalogOptions, getPublishedModCount, getPublishedMods, isGalleryImage } from "@/lib/db";

type Props = { searchParams: Promise<{ q?: string; game?: string; category?: string; genre?: string; page?: string }> };

export const dynamic = "force-dynamic";
const pageSize = 48;

function pageHref(page: number, filters: { q?: string; game?: string; category?: string; genre?: string }) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.game) params.set("game", filters.game);
  if (filters.category) params.set("category", filters.category);
  if (filters.genre) params.set("genre", filters.genre);
  params.set("page", String(page));
  return `/?${params.toString()}#catalog`;
}

export default async function Home({ searchParams }: Props) {
  const filters = await searchParams;
  const catalogFilters = { search: filters.q, game: filters.game, category: filters.category, genre: filters.genre };
  const [{ games, categories, genres }, totalMods] = await Promise.all([
    getCatalogOptions(),
    getPublishedModCount(catalogFilters),
  ]);
  const pageCount = Math.max(1, Math.ceil(totalMods / pageSize));
  const requestedPage = Number.parseInt(filters.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, requestedPage), pageCount) : 1;
  const mods = await getPublishedMods({ ...catalogFilters, page: currentPage, pageSize });
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot" /> مجتمع اللاعبين العرب</span>
          <h1>خلّ لعبتك<br /><span>على مزاجك.</span></h1>
          <p>اكتشف مودات تصنع فرقًا، وشارك إضافاتك مع مجتمع يحبّ التجربة مثلك.</p>
          <Link className="button button-light" href="/submit">شاركنا مودك <span aria-hidden="true">←</span></Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="hero-symbol">M<span>+</span></div>
          <div className="float-card card-top"><span className="float-icon">✦</span><span>تجارب جديدة<br /><b>كل يوم</b></span></div>
          <div className="float-card card-bottom"><span className="float-icon">⌘</span><span>مودك القادم<br /><b>هنا يبدأ</b></span></div>
        </div>
        <div className="hero-index"><span>01</span> / اكتشف، حمّل، واستمتع</div>
      </section>

      {/* شريط الألعاب التي نوفر لها مودات */}
      <section className="section-wrap" style={{ paddingTop: "1rem", paddingBottom: "1.5rem" }}>
        <div className="section-heading" style={{ marginBottom: "1rem" }}>
          <div>
            <span className="eyebrow dark-eyebrow">ألعاب المنصة</span>
            <h2>
              <Link href="/games" style={{ color: "inherit", textDecoration: "none" }}>
                الألعاب المتوفرة ({games.length} ألعاب) <span style={{ fontSize: "1.1rem", color: "#9dcc47" }}>عرض صفحة الألعاب ↗</span>
              </Link>
            </h2>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          <Link
            href="/#catalog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: "600",
              textDecoration: "none",
              border: !filters.game ? "2px solid #527926" : "1px solid rgba(255,255,255,0.15)",
              backgroundColor: !filters.game ? "#9dcc47" : "rgba(255,255,255,0.06)",
              color: !filters.game ? "#0e1f06" : "#ffffff",
              transition: "all 0.2s ease",
            }}
          >
            <span>🎮</span>
            <span>كل الألعاب</span>
          </Link>
          {games.map((g) => {
            const isSelected = filters.game === g;
            return (
              <Link
                key={g}
                href={isSelected ? "/#catalog" : `/?game=${encodeURIComponent(g)}#catalog`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "999px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  border: isSelected ? "2px solid #527926" : "1px solid rgba(255,255,255,0.15)",
                  backgroundColor: isSelected ? "#9dcc47" : "rgba(255,255,255,0.06)",
                  color: isSelected ? "#0e1f06" : "#ffffff",
                  transition: "all 0.2s ease",
                }}
              >
                <span>🎲</span>
                <span>{g}</span>
                {isSelected && <span>✓</span>}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="catalog section-wrap" id="catalog">
        <div className="section-heading">
          <div><span className="eyebrow dark-eyebrow">مكتبة المجتمع</span><h2>ماذا ستضيف للعبتك؟</h2></div>
          <span className="result-count">{totalMods} مود</span>
        </div>
        <form className="filters" action="/" method="get">
          <label className="search-field"><span aria-hidden="true">⌕</span><input type="search" name="q" defaultValue={filters.q} placeholder="ابحث عن مود أو لعبة..." /></label>
          <label className="select-field"><span className="sr-only">اللعبة</span><select name="game" defaultValue={filters.game || ""}><option value="">كل الألعاب</option>{games.map((game) => <option key={game}>{game}</option>)}</select></label>
          <label className="select-field"><span className="sr-only">نوع اللعبة</span><select name="genre" defaultValue={filters.genre || ""}><option value="">كل الأنواع</option>{genres.map((genre) => <option key={genre} value={genre}>{genreLabels[genre] ?? genre}</option>)}</select></label>
          <label className="select-field"><span className="sr-only">التصنيف</span><select name="category" defaultValue={filters.category || ""}><option value="">كل التصنيفات</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <button className="button button-dark" type="submit">بحث <span aria-hidden="true">↗</span></button>
        </form>
        {mods.length ? (
          <>
            <div className="mod-grid">
              {mods.map((mod, index) => (
                <Link className="mod-card" href={`/mods/${encodeURIComponent(mod.slug)}`} key={mod.id}>
                  <div className={`mod-art mod-art-${index % 4} ${isGalleryImage(mod.imageUrl) ? "has-gallery" : "has-icon"}`}>
                    {mod.imageUrl && <img className={`mod-image ${isGalleryImage(mod.imageUrl) ? "mod-image-gallery" : "mod-image-icon"}`} src={mod.imageUrl} alt="" loading="lazy" />}
                    {!mod.imageUrl && <><span className="art-orb" /><span className="art-letter">{mod.game.slice(0, 1)}</span></>}
                    <span className="art-category">{mod.category}</span>
                  </div>
                  <div className="mod-card-body"><span className="mod-game">{mod.game} · {genreLabels[mod.gameGenre] ?? mod.gameGenre}</span><h3>{mod.title}</h3><p>{mod.description}</p><div className="mod-card-foot"><span>بواسطة {mod.author}</span><span className="card-arrow">↗</span></div></div>
                </Link>
              ))}
            </div>
            {pageCount > 1 && (
              <nav className="pagination" aria-label="صفحات المودات">
                {currentPage > 1
                  ? <Link className="button button-outline" href={pageHref(currentPage - 1, filters)}>السابق</Link>
                  : <span className="button button-outline pagination-disabled" aria-disabled="true">السابق</span>}
                <span className="pagination-status">صفحة {currentPage} من {pageCount}</span>
                {currentPage < pageCount
                  ? <Link className="button button-outline" href={pageHref(currentPage + 1, filters)}>التالي</Link>
                  : <span className="button button-outline pagination-disabled" aria-disabled="true">التالي</span>}
              </nav>
            )}
          </>
        ) : (
          <div className="empty-state"><span className="empty-icon">✳</span><h3>{filters.q || filters.game || filters.category || filters.genre ? "ما لقينا نتائج مطابقة" : "المكتبة بانتظار أول مود"}</h3><p>{filters.q || filters.game || filters.category || filters.genre ? "جرّب كلمات أو تصنيفات مختلفة." : "كن أول من يشارك مودًا مع المجتمع. كل الإضافات تمر بمراجعة سريعة قبل ظهورها."}</p><Link className="button button-dark" href="/submit">أرسل أول مود <span aria-hidden="true">←</span></Link></div>
        )}
      </section>
      <section className="submit-banner section-wrap"><div><span className="eyebrow dark-eyebrow">لديك إضافة تستحق المشاركة؟</span><h2>خلّ مجتمع اللاعبين<br />يجربها معك.</h2></div><Link className="button button-accent" href="/submit">أرسل مودك الآن <span aria-hidden="true">↗</span></Link></section>
    </>
  );
}
