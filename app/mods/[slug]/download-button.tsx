"use client";

import { useRef, useState } from "react";

type Tone = "info" | "error" | "ok";

type Note = { tone: Tone; text: string; href?: string; hrefLabel?: string };

type DownloadResponse = {
  ok?: boolean;
  mode?: "mirror" | "file";
  provider?: "direct" | "mirror";
  url?: string;
  fileName?: string | null;
  size?: number | null;
  code?: string;
  message?: string;
  pageUrl?: string | null;
};

const PROVIDER_LABEL: Record<string, string> = {
  direct: "المصدر الأصلي",
  mirror: "استضافة mode",
};

/**
 * يبدأ التنزيل داخل الصفحة:
 * - نفس الأصل (النسخة المستضافة): رابط <a download> يضمن التنزيل باسم الملف.
 * - نطاق خارجي (CDN): إطار مخفي، لأن خاصية download تُتجاهل عبر النطاقات.
 */
function startDownload(url: string, fileName?: string | null) {
  const target = new URL(url, window.location.href);

  if (target.origin === window.location.origin) {
    const anchor = document.createElement("a");
    anchor.href = target.href;
    if (fileName) anchor.download = fileName;
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return;
  }

  const frame = document.createElement("iframe");
  frame.hidden = true;
  frame.setAttribute("aria-hidden", "true");
  frame.src = target.href;
  document.body.appendChild(frame);
  window.setTimeout(() => frame.remove(), 120_000);
}

const MESSAGES: Record<string, string> = {
  NOT_FOUND: "لم أجد هذا المود في المكتبة.",
};

export default function DownloadButton({
  slug,
  label,
  fileName,
  pageOnly = false,
  pageUrl,
  className = "button button-accent download-button",
}: {
  slug: string;
  label: string;
  fileName?: string | null;
  /** true عندما لا يوجد ملف مباشر أصلًا (Steam Workshop) فنفتح الصفحة مباشرة. */
  pageOnly?: boolean;
  pageUrl?: string | null;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const inFlight = useRef(false);

  if (pageOnly && pageUrl) {
    return (
      <a className={className} href={pageUrl} target="_blank" rel="noopener noreferrer">
        {label}
        <span aria-hidden="true"> ↗</span>
      </a>
    );
  }

  async function handleClick() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setNote(null);

    try {
      // طلب رابط حديث من خادمنا — المفتاح لا يغادر الخادم.
      const response = await fetch(`/api/download-url/${encodeURIComponent(slug)}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const data = (await response.json().catch(() => null)) as DownloadResponse | null;

      if (response.ok && data?.ok && data.url) {
        startDownload(data.url, data.fileName ?? fileName);
        setNote({
          tone: "ok",
          text: `✅ بدأ تنزيل ${data.fileName ?? "حزمة المود"} مباشرة من خوادم mode — لم نحوّلك لأي موقع خارجي.`,
        });
        return;
      }

      if (data?.code === "NOT_DISTRIBUTABLE" || data?.code === "EXTERNAL_PAGE") {
        setNote({
          tone: "info",
          text: "جارٍ توفير ملف التحميل المباشر لهذا المود قريباً عبر شبكة mode.",
        });
        return;
      }

      setNote({ tone: "error", text: MESSAGES[data?.code ?? ""] || data?.message || "تعذر تجهيز رابط التنزيل." });
    } catch {
      setNote({ tone: "error", text: "تعذر الاتصال بالخادم. تحقق من الشبكة وأعد المحاولة." });
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? "جارٍ تجهيز الرابط…" : label}
        <span aria-hidden="true">{busy ? " …" : " ↓"}</span>
      </button>
      {note && (
        <span className="download-status" data-tone={note.tone} role="status" aria-live="polite">
          {note.text}
          {note.href && (
            <>
              {" "}
              <a href={note.href} target="_blank" rel="noopener noreferrer">
                {note.hrefLabel}
              </a>
            </>
          )}
        </span>
      )}
    </>
  );
}
