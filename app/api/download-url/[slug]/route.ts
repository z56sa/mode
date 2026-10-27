import { NextResponse } from "next/server";
import { getModBySlug, getModMirrorBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * يعيد رابط التنزيل المباشر من منصة mode الداخلية
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await getModBySlug(slug);
  if (!mod) {
    return NextResponse.json({ ok: false, code: "NOT_FOUND", message: "المود غير موجود." }, { status: 404, headers: NO_STORE });
  }

  const mirror = await getModMirrorBySlug(slug);
  const fileName = mirror?.fileName ?? mod.downloadFileName ?? `${slug}.zip`;
  const size = mirror?.size ?? mod.downloadSize ?? 1024 * 1024 * 2;

  // رابط التنزيل الداخلي المباشر بنسبة 100%
  return NextResponse.json(
    {
      ok: true,
      mode: "file",
      provider: "mirror",
      url: `/api/download/${encodeURIComponent(slug)}`,
      fileName,
      size,
    },
    { headers: NO_STORE },
  );
}
