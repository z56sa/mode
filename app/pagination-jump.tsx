"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaginationJumpProps {
  currentPage: number;
  pageCount: number;
  filters: {
    q?: string;
    game?: string;
    category?: string;
    genre?: string;
  };
}

export default function PaginationJump({ currentPage, pageCount, filters }: PaginationJumpProps) {
  const router = useRouter();
  const [inputVal, setInputVal] = useState(String(currentPage));

  function buildUrl(page: number) {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.game) params.set("game", filters.game);
    if (filters.category) params.set("category", filters.category);
    if (filters.genre) params.set("genre", filters.genre);
    if (page > 1) params.set("page", String(page));
    const s = params.toString();
    return s ? `/?${s}` : "/";
  }

  function handleJump(e: React.FormEvent) {
    e.preventDefault();
    const p = parseInt(inputVal, 10);
    if (isNaN(p)) return;
    const targetPage = Math.max(1, Math.min(pageCount, p));
    router.push(buildUrl(targetPage));
  }

  return (
    <form onSubmit={handleJump} className="pagination-jump-form" title="اكتب رقم الصفحة ثم اضغط Enter أو انتقال">
      <span className="pagination-jump-text">صفحة</span>
      <input
        type="number"
        min={1}
        max={pageCount}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={() => {
          if (!inputVal) setInputVal(String(currentPage));
        }}
        className="pagination-jump-input"
        aria-label="رقم الصفحة المطلوب الانتقال إليها"
      />
      <span className="pagination-jump-text">من {pageCount.toLocaleString("ar-EG")}</span>
      <button type="submit" className="pagination-jump-btn">
        انتقال
      </button>
    </form>
  );
}
