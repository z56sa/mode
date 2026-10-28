import { notFound } from "next/navigation";
import Link from "next/link";
import { genreLabels, getModBySlug, isGalleryImage } from "@/lib/db";
import { isAdminSession } from "@/lib/auth";
import DeleteModButton from "@/app/admin/delete-mod-button";
import MirrorUpload from "@/app/admin/mirror-upload";
import { isDirectFileUrl } from "@/lib/download-sources";
import DownloadButton from "./download-button";

export const dynamic = "force-dynamic";

function formatFileSize(size: number) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} ميجابايت`
    : `${Math.ceil(size / 1024)} كيلوبايت`;
}

export default async function ModDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await getModBySlug(slug);
  if (!mod) notFound();
  const isAdmin = await isAdminSession();
  const isSteamWorkshop = mod.sourceUrl?.includes("steamcommunity.com/sharedfiles/filedetails") ?? false;
  const isNexusMod = mod.sourceUrl?.includes("nexusmods.com/") ?? false;
  const hasMirror = Boolean(mod.mirrorFileName);
  const canServeFromSite = hasMirror || isDirectFileUrl(mod.downloadUrl, mod.downloadFileName);
  const providerLabel = isSteamWorkshop
    ? "Steam Workshop"
    : isNexusMod
      ? "Nexus Mods"
      : null;
  const downloadProvider = providerLabel ?? "المصدر الأصلي";
  // جميع المودات تُحمَّل مباشرة من mode — لا redirect خارجي
  const pageOnly = false;
  const buttonLabel = hasMirror
    ? "حمّل المود مباشرة ↓"
    : canServeFromSite
      ? "حمّل المود ↓"
      : "حمّل حزمة المود ↓";
  return (
    <div className="detail-wrap section-wrap">
      <Link className="back-link" href="/">← العودة للمكتبة</Link>
      <article className="detail-card">
        <div className={`detail-art ${isGalleryImage(mod.imageUrl) ? "has-gallery" : "has-icon"}`}>
          {mod.imageUrl && <img className={`mod-image ${isGalleryImage(mod.imageUrl) ? "mod-image-gallery" : "mod-image-icon"}`} src={mod.imageUrl} alt="" />}
          {!mod.imageUrl && <><span className="art-orb" /><span className="detail-letter">{mod.game.slice(0, 1)}</span></>}
          <span className="art-category">{mod.category}</span>
        </div>
        <div className="detail-content">
          <span className="mod-game">{mod.game} · {genreLabels[mod.gameGenre] ?? mod.gameGenre}</span>
          <h1>{mod.title}</h1>
          <p className="detail-description">{mod.description}</p>
          <div className="detail-meta"><span>صاحب المود <b>{mod.author}</b></span>{mod.version && <span>الإصدار <b>{mod.version}</b></span>}</div>
          <DownloadButton
            slug={mod.slug}
            label={buttonLabel}
            fileName={mod.mirrorFileName ?? mod.downloadFileName}
            pageOnly={pageOnly}
            pageUrl={mod.sourceUrl ?? mod.downloadUrl}
          />
          <p className="external-note">
            {mod.mirrorFileName || mod.downloadFileName
              ? `${mod.mirrorFileName ?? mod.downloadFileName}${mod.mirrorSize || mod.downloadSize ? ` · ${formatFileSize(mod.mirrorSize ?? mod.downloadSize!)}` : ""} · تنزيل فوري ومباشر من mode`
              : "تنزيل حزمة المود مباشرةً من mode — بدون تحويل لأي موقع خارجي"}
          </p>
          {isAdmin && <div className="detail-admin-actions"><span>إجراءات المسؤول</span><DeleteModButton modId={mod.id} returnToCatalog /></div>}
          {isAdmin && (
            <MirrorUpload
              modId={mod.id}
              fileName={mod.mirrorFileName ?? null}
              size={mod.mirrorSize ?? null}
            />
          )}
        </div>
      </article>
    </div>
  );
}
