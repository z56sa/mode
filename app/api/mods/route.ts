import { NextResponse } from "next/server";
import path from "node:path";
import { getMemberSession } from "@/lib/auth";
import { createSubmission } from "@/lib/db";
import { inspectModUpload } from "@/lib/mod-review";
import { removeModUpload, saveModUpload } from "@/lib/mod-upload-storage";
import { createRateLimiter } from "@/lib/rate-limit";
import { validateSubmission } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_BODY_BYTES = MAX_UPLOAD_BYTES + 64 * 1024;
const submissionRateLimit = createRateLimiter(5, 15 * 60 * 1000);
const allowedExtensions = new Set([
  ".zip", ".cs", ".cfg", ".conf", ".ini", ".java", ".js", ".json", ".lua",
  ".md", ".properties", ".py", ".sh", ".toml", ".ts", ".txt", ".xml", ".yaml", ".yml",
]);

export async function POST(request: Request) {
  const session = await getMemberSession();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!session || !email) {
    return NextResponse.json({ error: "سجّل الدخول بحساب عضو قبل إرسال مود." }, { status: 401 });
  }

  const retryAfter = submissionRateLimit(email);
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "تجاوزت عدد الإرسالات المسموح. حاول مرة أخرى لاحقًا." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const rawContentLength = request.headers.get("content-length");
  const contentLength = rawContentLength ? Number(rawContentLength) : NaN;
  if (!Number.isFinite(contentLength)) {
    return NextResponse.json({ error: "يلزم تحديد حجم طلب الرفع." }, { status: 411 });
  }
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "حجم البيانات المرسلة أكبر من المسموح." }, { status: 413 });
  }

  let fields: Record<string, string>;
  let upload: { bytes: Buffer; fileName: string; extension: string } | null = null;
  try {
    const form = await request.formData();
    fields = {};
    for (const [key, value] of form.entries()) {
      if (key === "upload") {
        if (typeof value === "string" || (!value.name && !value.size)) continue;
        if (upload) return NextResponse.json({ error: "ارفع ملفًا واحدًا فقط." }, { status: 400 });
        if (!value.size) return NextResponse.json({ error: "لا يمكن رفع ملف فارغ." }, { status: 400 });
        if (value.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "الحد الأقصى لحجم الملف 15 ميغابايت." }, { status: 413 });
        const fileName = value.name.replace(/\\/g, "/").split("/").pop()!
          .replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 120);
        const extension = path.extname(fileName).toLowerCase();
        if (!allowedExtensions.has(extension)) {
          return NextResponse.json({ error: "ارفع أرشيف ZIP أو ملف مصدر نصي مدعوم." }, { status: 400 });
        }
        upload = { bytes: Buffer.from(await value.arrayBuffer()), fileName, extension };
      } else if (typeof value === "string") {
        fields[key] = value;
      } else {
        return NextResponse.json({ error: "يُسمح برفع ملف واحد فقط." }, { status: 400 });
      }
    }
  } catch {
    return NextResponse.json({ error: "تعذر قراءة نموذج الإرسال أو الملف." }, { status: 400 });
  }
  if (upload) {
    try {
      inspectModUpload(upload.bytes, upload.fileName);
    } catch (error) {
      const message = error instanceof Error ? error.message : "الملف غير صالح للفحص.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }
  const validated = validateSubmission(
    { ...fields, author: session.user?.name?.trim() || email },
  );
  if ("error" in validated) return NextResponse.json({ error: validated.error }, { status: 400 });
  if (upload && fields.analysisConsent !== "yes") {
    return NextResponse.json({ error: "وافق على فحص الملف المرفق وإرسال نصوص المصدر إلى خدمة الفحص الخارجية." }, { status: 400 });
  }
  let storageKey: string | null = null;
  try {
    if (upload) storageKey = await saveModUpload(upload.bytes, upload.extension);
    await createSubmission(validated.value, email, upload && storageKey
      ? { storageKey, fileName: upload.fileName, size: upload.bytes.length }
      : null);
    return NextResponse.json({ message: "تم استلام الإرسال للمراجعة." }, { status: 201 });
  } catch (error) {
    if (storageKey) await removeModUpload(storageKey).catch((cleanupError) => {
      console.error("Failed to clean up unlinked mod upload:", cleanupError);
    });
    console.error("Failed to save mod submission:", error);
    return NextResponse.json({ error: "تعذر حفظ الإرسال حاليًا." }, { status: 500 });
  }
}
