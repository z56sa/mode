import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getMemberSession, isAdminSession } from "@/lib/auth";
import ThemeToggle from "./theme-toggle";
import "./globals.css";
import "./dark-theme.css";
import "./components.css";

export const metadata: Metadata = {
  title: "mode | مكتبة مودات الألعاب",
  description: "اكتشف مودات الألعاب العربية وشارك إضافاتك المفضلة.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1210" },
  ],
};

// يُطبَّق الوضع المحفوظ قبل أول رسم للصفحة حتى لا تظهر وميضًا بالألوان الفاتحة.
const themeScript = `(function(){try{var t=localStorage.getItem("mode-theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getMemberSession();
  const isAdmin = await isAdminSession();
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/" aria-label="mode - الرئيسية">
              <span className="brand-mark">m</span>
              <span>mode<span className="brand-dot">.</span></span>
            </Link>
            <nav className="main-nav" aria-label="القائمة الرئيسية">
              <Link href="/">استكشف المودات</Link>
              <Link href="/submit">أضف مودًا</Link>
              <Link href="/create-mod">اصنع مودك</Link>
              {isAdmin && <Link className="admin-nav-link" href="/admin">لوحة التحكم</Link>}
            </nav>
            <div className="header-side">
              <ThemeToggle />
              <Link className="admin-link" href={session ? "/account" : "/login"}>
                {session ? "حسابي" : "دخول الأعضاء"} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <span>mode — مساحة عربية لعشّاق الألعاب والإضافات.</span>
          <span>المودات وروابط التنزيل مقدّمة من أصحابها.</span>
        </footer>
      </body>
    </html>
  );
}
