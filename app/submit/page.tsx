import Link from "next/link";
import { getMemberSession } from "@/lib/auth";
import SubmissionForm from "./submission-form";

export default async function SubmitPage() {
  const session = await getMemberSession();
  return <div className="form-page section-wrap"><Link className="back-link" href="/">← العودة للمكتبة</Link><div className="form-heading"><span className="eyebrow dark-eyebrow">مشاركة المجتمع</span><h1>أضف مودًا للمكتبة</h1><p>شارك التفاصيل ورابط التنزيل. سيراجع فريقنا الإضافة قبل نشرها.</p></div>{session ? <SubmissionForm memberName={session.user?.name || session.user?.email || ""} /> : <div className="notice-card member-required"><h2>سجّل الدخول للمشاركة</h2><p>تسجيل الأعضاء مطلوب لإرسال مود جديد ومتابعة مراجعته.</p><Link className="button button-dark" href="/login?callbackUrl=%2Fsubmit">دخول الأعضاء <span aria-hidden="true">↗</span></Link></div>}</div>;
}
