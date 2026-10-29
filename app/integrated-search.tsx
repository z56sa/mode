"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface IntegratedSearchProps {
  initialQuery?: string;
  initialGame?: string;
  initialGenre?: string;
  initialCategory?: string;
  initialAiMode?: boolean;
  games: string[];
  genres: string[];
  categories: string[];
  genreLabels: Record<string, string>;
}

export default function IntegratedSearch({
  initialQuery = "",
  initialGame = "",
  initialGenre = "",
  initialCategory = "",
  initialAiMode = false,
  games,
  genres,
  categories,
  genreLabels,
}: IntegratedSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [game, setGame] = useState(initialGame);
  const [genre, setGenre] = useState(initialGenre);
  const [category, setCategory] = useState(initialCategory);
  const [isAiMode, setIsAiMode] = useState(initialAiMode);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (game) params.set("game", game);
    if (genre) params.set("genre", genre);
    if (category) params.set("category", category);
    if (isAiMode) params.set("ai", "1");

    const qs = params.toString();
    router.push(qs ? `/?${qs}#catalog` : "/#catalog");
  }

  return (
    <form className="filters integrated-search-bar" onSubmit={handleSubmit}>
      <label className="search-field">
        <span aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
          {isAiMode ? "✨" : "⌕"}
        </span>
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isAiMode
              ? "المساعد الذكي: اكتب فكرتك بلغتك (مثال: ابي مود يخليني أطير بسفينة، أو زيادة فلوس ودم)..."
              : "ابحث عن اسم مود أو لعبة أو وصف..."
          }
        />
        {/* زر التبديل الذكي المدمج مباشرة داخل شريط البحث */}
        <button
          type="button"
          onClick={() => setIsAiMode(!isAiMode)}
          className={`ai-toggle-pill ${isAiMode ? "ai-active" : ""}`}
          title="تفعيل/تعطيل فهم الفكرة بالذكاء الاصطناعي"
        >
          <span className="ai-icon">🤖</span>
          <span className="ai-text">{isAiMode ? "البحث الذكي مفعّل" : "بحث ذكي بالفكرة"}</span>
        </button>
      </label>

      <label className="select-field">
        <span className="sr-only">اللعبة</span>
        <select name="game" value={game} onChange={(e) => setGame(e.target.value)}>
          <option value="">كل الألعاب</option>
          {games.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label className="select-field">
        <span className="sr-only">نوع اللعبة</span>
        <select name="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">كل الأنواع</option>
          {genres.map((gn) => (
            <option key={gn} value={gn}>
              {genreLabels[gn] ?? gn}
            </option>
          ))}
        </select>
      </label>

      <label className="select-field">
        <span className="sr-only">التصنيف</span>
        <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <button
        className={isAiMode ? "button ai-submit-btn" : "button button-dark"}
        type="submit"
      >
        {isAiMode ? "✨ تحليل وبحث" : "بحث ↗"}
      </button>
    </form>
  );
}
