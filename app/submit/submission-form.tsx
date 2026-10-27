"use client";

import { FormEvent, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

export default function SubmissionForm({ memberName }: { memberName: string }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadSize, setDownloadSize] = useState<number | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSending(true);
    setMessage("");

    const form = new FormData(formElement);
    if (imageUrl) form.set("imageUrl", imageUrl);
    if (downloadUrl) form.set("downloadUrl", downloadUrl);
    if (downloadFileName) form.set("downloadFileName", downloadFileName);
    if (downloadSize) form.set("downloadSize", String(downloadSize));

    try {
      const response = await fetch("/api/mods", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "تعذر إرسال المود. حاول مرة أخرى.");
        return;
      }
      formElement.reset();
      setImageUrl("");
      setDownloadUrl("");
      setDownloadFileName("");
      setDownloadSize(null);
      setMessage("🎉 وصلتنا إضافتك بنجاح! تم رفع الملفات إلى Uploadthing وحفظ الروابط في Turso.");
    } catch {
      setMessage("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="data-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          اسم المود <input name="title" maxLength={100} required placeholder="مثال: تحسين الإضاءة الفائق" />
        </label>
        <label>
          اسم اللعبة <input name="game" maxLength={80} required placeholder="مثال: Minecraft أو Lethal Company" />
        </label>
        <label>
          نوع اللعبة
          <select name="gameGenre" required defaultValue="Sandbox">
            <option value="Sandbox">عالم مفتوح</option>
            <option value="Adventure">مغامرات</option>
            <option value="RPG">تقمّص الأدوار (RPG)</option>
            <option value="Simulation">محاكاة</option>
            <option value="Strategy">استراتيجية</option>
            <option value="Survival">بقاء</option>
            <option value="Action">أكشن</option>
            <option value="Horror">رعب</option>
            <option value="Roguelike">روغلايك</option>
          </select>
        </label>
        <label>
          التصنيف <input name="category" maxLength={50} required placeholder="رسوميات، أسلحة، أدوات..." />
        </label>
        <label>
          مرسل الإضافة <input value={memberName} readOnly aria-readonly="true" />
        </label>
        <label>
          الإصدار <input name="version" maxLength={40} placeholder="مثال: 1.2.0" />
        </label>

        {/* 1. رفع الصورة مباشرة إلى Uploadthing */}
        <div className="full-field" style={{ padding: "12px", background: "#f8faf6", border: "1px dashed #c9d8bf", borderRadius: "8px" }}>
          <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block" }}>
            صورة المود (رفع مباشر إلى Uploadthing):
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <UploadButton
              endpoint="modImage"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setImageUrl(res[0].url);
                  alert("✅ تم رفع صورة المود إلى Uploadthing بنجاح!");
                }
              }}
              onUploadError={(error: Error) => {
                alert(`خطأ في رفع الصورة: ${error.message}`);
              }}
            />
            {imageUrl && (
              <span style={{ fontSize: "12px", color: "#228b22", direction: "ltr" }}>
                ✓ {imageUrl}
              </span>
            )}
          </div>
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        {/* 2. رفع ملف المود الفعلي ZIP إلى Uploadthing */}
        <div className="full-field" style={{ padding: "12px", background: "#f8faf6", border: "1px dashed #c9d8bf", borderRadius: "8px" }}>
          <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block" }}>
            ملف المود الفعلي (ZIP / JAR / RAR حتى 128MB إلى Uploadthing):
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <UploadButton
              endpoint="modAttachment"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setDownloadUrl(res[0].url);
                  setDownloadFileName(res[0].name);
                  setDownloadSize(res[0].size);
                  alert("✅ تم رفع حزمة المود إلى Uploadthing بنجاح!");
                }
              }}
              onUploadError={(error: Error) => {
                alert(`خطأ في رفع الملف: ${error.message}`);
              }}
            />
            {downloadUrl && (
              <span style={{ fontSize: "12px", color: "#228b22", direction: "ltr" }}>
                ✓ {downloadFileName} ({(downloadSize ? downloadSize / (1024 * 1024) : 0).toFixed(2)} MB)
              </span>
            )}
          </div>
          <input type="hidden" name="downloadUrl" value={downloadUrl} />
          <input type="hidden" name="downloadFileName" value={downloadFileName} />
          <input type="hidden" name="downloadSize" value={downloadSize || ""} />
        </div>

        {/* خيار إدخال رابط يدوي بديل إن وجد */}
        {!downloadUrl && (
          <label className="full-field">
            أو رابط تحميل خارجي مباشر (إن لم ترغب بالرفع):
            <input
              name="manualDownloadUrl"
              type="url"
              maxLength={2048}
              placeholder="https://..."
              onChange={(e) => setDownloadUrl(e.target.value)}
            />
          </label>
        )}

        <label className="full-field">
          وصف المود
          <textarea
            name="description"
            maxLength={2000}
            rows={4}
            required
            placeholder="ما الذي يضيفه هذا المود؟ وما إصدار اللعبة المتوافق معه؟"
          />
        </label>
      </div>

      <div className="form-submit">
        <p role="status">{message}</p>
        <button className="button button-dark" type="submit" disabled={sending}>
          {sending ? "جارٍ الحفظ..." : "نشر المود في المكتبة"} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
