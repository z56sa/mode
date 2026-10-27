import { redirect } from "next/navigation";
import { adminEmail, getMemberSession } from "@/lib/auth";
import MemberLogin from "./member-login";

export const dynamic = "force-dynamic";

function safeCallback(value?: string) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/account";
  if (value !== "/admin" && value.startsWith("/admin/")) return "/account";
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const destination = safeCallback(callbackUrl);
  const session = await getMemberSession();
  if (session) {
    if (destination === "/admin" && session.user?.email?.toLowerCase() !== adminEmail) {
      redirect("/account");
    }
    redirect(destination);
  }

  return (
    <div className="form-page section-wrap">
      <div className="admin-login member-login">
        <span className="login-symbol">m</span>
        <span className="eyebrow dark-eyebrow member-eyebrow">مجتمع mode</span>
        <h1>دخول الأعضاء</h1>
        <p>سجّل الدخول أو أنشئ حسابًا للانضمام إلى مجتمع اللاعبين ومشاركة موداتك.</p>
        <MemberLogin callbackUrl={destination} authError={error} />
        <small className="member-privacy">بالمتابعة، سيُنشأ حساب عضو باستخدام بريد Google الموثّق.</small>
      </div>
    </div>
  );
}
