"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function MemberLogin({
  callbackUrl,
  authError,
}: {
  callbackUrl: string;
  authError?: string;
}) {
  const [busy, setBusy] = useState(false);
  const message =
    authError === "AccessDenied"
      ? "تعذر اعتماد الحساب. استخدم بريد Google موثقًا."
      : authError
        ? "تعذر تسجيل الدخول. تحقق من إعداد حساب Google وحاول مجددًا."
        : "";

  return (
    <>
      <button
        className="button button-dark google-login"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void signIn("google", { callbackUrl });
        }}
      >
        <span className="google-mark" aria-hidden="true">G</span>
        {busy ? "جارٍ الانتقال إلى Google..." : "المتابعة باستخدام Google"}
      </button>
      {message && <p role="alert" className="form-error">{message}</p>}
    </>
  );
}
