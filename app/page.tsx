import Link from "next/link";
import { genreLabels, getCatalogOptions, getPublishedModCount, getPublishedMods, isGalleryImage } from "@/lib/db";
import PaginationJump from "./pagination-jump";
import ModCardImage from "./mod-card-image";

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

      <section className="catalog section-wrap" id="catalog">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark-eyebrow">مكتبة المجتمع الذكية</span>
            <h2>ماذا ستضيف للعبتك؟</h2>
          </div>
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <Link
              href="/ai-helper"
              className="button button-outline"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem", borderColor: "rgba(16, 185, 129, 0.4)", color: "#10b981" }}
            >
              🤖 البحث الذكي بالفكرة
            </Link>
            <span className="result-count">{totalMods} مود</span>
          </div>
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
                  <ModCardImage
                    src={mod.imageUrl}
                    game={mod.game}
                    category={mod.category}
                    index={index}
                    isGallery={isGalleryImage(mod.imageUrl)}
                  />
                  <div className="mod-card-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                      <span className="mod-game">{mod.game} · {genreLabels[mod.gameGenre] ?? mod.gameGenre}</span>
                      {mod.version && (
                        <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", fontWeight: 600 }}>
                          v{mod.version}
                        </span>
                      )}
                    </div>
                    <h3>{mod.title}</h3>
                    <p>{mod.description}</p>
                    <div className="mod-card-foot">
                      <span>بواسطة {mod.author}</span>
                      <span className="card-arrow">↗</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {pageCount > 1 && (
              <nav className="pagination" aria-label="صفحات المودات">
                {currentPage > 1
                  ? <Link className="button button-outline" href={pageHref(currentPage - 1, filters)}>السابق</Link>
                  : <span className="button button-outline pagination-disabled" aria-disabled="true">السابق</span>}
                <PaginationJump currentPage={currentPage} pageCount={pageCount} filters={filters} />
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
