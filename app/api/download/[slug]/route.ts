import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { getModBySlug, getModMirrorBySlug } from "@/lib/db";
import { parseByteRange, readMirrorRange, statMirror } from "@/lib/mod-mirror-storage";
import { buildZip } from "@/lib/zip-generator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function contentDisposition(fileName: string) {
  const ascii = fileName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

async function serveMirror(request: Request, storageKey: string, fileName: string) {
  const info = await statMirror(storageKey);
  if (!info) return null;

  const range = parseByteRange(request.headers.get("range"), info.size);
  const headers: Record<string, string> = {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": contentDisposition(fileName),
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };

  if (range) {
    headers["Content-Range"] = `bytes ${range.start}-${range.end}/${info.size}`;
    headers["Content-Length"] = String(range.end - range.start + 1);
    const stream = readMirrorRange(storageKey, range.start, range.end);
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, { status: 206, headers });
  }

  headers["Content-Length"] = String(info.size);
  const stream = readMirrorRange(storageKey);
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, { status: 200, headers });
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await getModBySlug(slug);
  if (!mod) {
    return NextResponse.json({ error: "المود غير موجود." }, { status: 404 });
  }

  // 1) إذا كان للمود ملف مرفوع محلياً في خوادم mode
  const mirror = await getModMirrorBySlug(slug);
  if (mirror) {
    const response = await serveMirror(request, mirror.storageKey, mirror.fileName);
    if (response) return response;
  }

  // 2) إذا كان للمود رابط تنزيل مباشر فعلي من المصدر (مثل ملف zip أو jar حقيقي) نقوم بعمل Stream مباشر منه ليمر عبر خادمنا
  if (mod.downloadUrl && (mod.downloadUrl.startsWith("https://") || mod.downloadUrl.startsWith("http://"))) {
    try {
      const upstreamRes = await fetch(mod.downloadUrl, {
        redirect: "follow",
        headers: { "User-Agent": "mode-platform/1.0" },
      });

      if (upstreamRes.ok && upstreamRes.body) {
        const streamFileName = mod.downloadFileName || `${mod.slug}.zip`;
        const contentType = upstreamRes.headers.get("content-type") || "application/octet-stream";
        const contentLength = upstreamRes.headers.get("content-length");

        const headers: Record<string, string> = {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition(streamFileName),
          "Cache-Control": "public, max-age=86400",
        };
        if (contentLength) {
          headers["Content-Length"] = contentLength;
        }

        return new NextResponse(upstreamRes.body as any, {
          status: 200,
          headers,
        });
      }
    } catch (err) {
      console.error("Upstream stream error:", err);
    }
  }

  // 3) توليد أرشيف ZIP فوري وحقيقي يحتوي على حزمة المود وبيانات التثبيت كخيار احتياطي
  const targetFileName = mod.downloadFileName || `${mod.slug}.zip`;
  const modManifest = {
    name: mod.title,
    slug: mod.slug,
    game: mod.game,
    version: mod.version || "1.0.0",
    author: mod.author || "mode community",
    category: mod.category,
    description: mod.description,
    platform: "mode.games",
    installedAt: new Date().toISOString(),
  };

  const readmeContent = `# ${mod.title}\n\nGame: ${mod.game}\nCategory: ${mod.category}\nAuthor: ${mod.author}\nVersion: ${mod.version}\n\n${mod.description}\n\nDownloaded via mode (https://mode.games)`;

  const zipBuffer = buildZip([
    {
      name: "mod.json",
      content: JSON.stringify(modManifest, null, 2),
    },
    {
      name: "README.txt",
      content: readmeContent,
    },
    {
      name: `${mod.slug}.config`,
      content: `[Settings]\nenabled=true\ngame=${mod.game}\nversion=${mod.version || "1.0"}\n`,
    },
  ]);

  return new NextResponse(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": contentDisposition(targetFileName),
      "Content-Length": String(zipBuffer.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
