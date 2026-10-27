"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application page failed to load:", error);
  }, [error]);

  const needsTursoSetup = error.message.includes("Turso is required");

  return (
    <div className="form-page section-wrap">
      <section className="notice-card app-error-card" role="alert">
        <span className="eyebrow dark-eyebrow">تعذّر تحميل الصفحة</span>
        <h1>{needsTursoSetup ? "أكمل ربط قاعدة Turso" : "حدث خطأ أثناء تحميل الموقع"}</h1>
        {needsTursoSetup ? (
          <>
            <p>الموقع يستخدم Turso حصريًا. أضف عنوان قاعدة البيانات ورمز الاتصال إلى الملف المحلي <code>.env.local</code> في مجلد المشروع:</p>
            <pre dir="ltr">TURSO_DATABASE_URL=libsql://…{"\n"}TURSO_AUTH_TOKEN=…</pre>
            <p>احفظ الملف ثم أوقف الخادم وشغّله مجددًا. احتفظ برمز الاتصال سرًا ولا ترسله في المحادثة.</p>
          </>
        ) : (
          <p>تعذر إكمال الطلب. حاول مرة أخرى بعد قليل؛ إذا تكررت المشكلة فتحقق من سجل الخادم.</p>
        )}
        <button className="button button-dark" onClick={() => reset()}>إعادة المحاولة</button>
      </section>
    </div>
  );
}
