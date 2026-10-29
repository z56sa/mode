import Link from "next/link";
import { genreLabels, getCatalogOptions, getPublishedModCount, getPublishedMods, isGalleryImage } from "@/lib/db";
import { smartSearchMods } from "@/lib/smart-search";
import PaginationJump from "./pagination-jump";
import ModCardImage from "./mod-card-image";
import IntegratedSearch from "./integrated-search";

type Props = { searchParams: Promise<{ q?: string; game?: string; category?: string; genre?: string; page?: string; ai?: string }> };

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
  const isAiMode = filters.ai === "1" && Boolean(filters.q?.trim());
  const catalogFilters = { search: filters.q, game: filters.game, category: filters.category, genre: filters.genre };
  const { games, categories, genres } = await getCatalogOptions();

  let aiResult: Awaited<ReturnType<typeof smartSearchMods>> | null = null;
  let mods: Awaited<ReturnType<typeof getPublishedMods>> = [];
  let totalMods = 0;
  let pageCount = 1;
  let currentPage = 1;

  if (isAiMode) {
    aiResult = await smartSearchMods(filters.q!, 48);
    const aiMods = aiResult?.mods ?? [];
    // Map AI mods to GameMod shape with defaults for missing fields
    mods = aiMods.map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      game: m.game,
      gameGenre: (m as unknown as { gameGenre?: string }).gameGenre ?? "Other",
      category: m.category,
      description: m.description,
      imageUrl: m.imageUrl,
      downloadUrl: (m as unknown as { downloadUrl?: string }).downloadUrl ?? "",
      downloadFileName: null,
      downloadSize: null,
      mirrorFileName: null,
      mirrorSize: null,
      sourceUrl: null,
      author: m.author,
      version: m.version,
      createdAt: "",
    }));
    totalMods = mods.length;
    pageCount = 1;
    currentPage = 1;
  } else {
    totalMods = await getPublishedModCount(catalogFilters);
    pageCount = Math.max(1, Math.ceil(totalMods / pageSize));
    const requestedPage = Number.parseInt(filters.page ?? "1", 10);
    currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, requestedPage), pageCount) : 1;
    mods = await getPublishedMods({ ...catalogFilters, page: currentPage, pageSize });
  }
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
            <span className="result-count">{isAiMode ? `${totalMods} نتيجة ذكية` : `${totalMods} مود`}</span>
          </div>
        </div>
        <IntegratedSearch
          initialQuery={filters.q || ""}
          initialGame={filters.game || ""}
          initialGenre={filters.genre || ""}
          initialCategory={filters.category || ""}
          initialAiMode={filters.ai === "1"}
          games={games}
          genres={genres}
          categories={categories}
          genreLabels={genreLabels}
        />
        {isAiMode && aiResult && (
          <div className="ai-search-banner">
            <span>✨ {aiResult.explanation}</span>
            {aiResult.category && <small>{aiResult.category}</small>}
          </div>
        )}
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
