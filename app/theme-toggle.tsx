"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mode-theme";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // التخزين قد يكون معطّلًا في وضع التصفح الخاص؛ تبقى الإضاءة مطبقة في الجلسة الحالية.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
    >
      <span className="icon-moon" aria-hidden="true">☾</span>
      <span className="icon-sun" aria-hidden="true">☀</span>
    </button>
  );
}
